const fs = require('fs');
const cheerio = require('cheerio');
const XLSX = require('xlsx');

// Configuration
const CONCURRENCY = 5;
const TIMEOUT = 30000;
const RETRY_COUNT = 2;
const DELAY_BETWEEN_BATCHES = 1000;

// Read URLs
const urls = fs.readFileSync('/workspace/urls-ae.txt', 'utf8')
  .split('\n')
  .map(u => u.trim())
  .filter(u => u.length > 0 && u.startsWith('http'));

console.log(`Total URLs to process: ${urls.length}`);

// Classify page type based on URL pattern and HTML
function classifyPage(url, $, statusCode, headers) {
  const path = new URL(url).pathname;

  // Default values
  let type = 'PAGE';
  let template = 'nan';

  // Business pages typically use PAGE type with specific templates
  if (path.includes('/business/')) {
    type = 'PAGE';

    // Detect template based on page structure
    const hasHero = $('main .hero, main [class*="hero"], main [class*="banner"]').length > 0;
    const hasProductGrid = $('main [class*="product"], main [class*="grid"]').length > 0;
    const hasForm = $('main form').length > 0;
    const hasMap = $('main [class*="map"], main .gm-style, main iframe[src*="google"]').length > 0;
    const hasSitemap = path.includes('sitemap');

    if (path.includes('/hvac/commercial-solutions/chiller/') || path.includes('/hvac/commercial-solutions/vrf-system/')) {
      template = 'T0017C'; // Product detail
    } else if (path.includes('/hvac/commercial-solutions/single-split/') || path.includes('/hvac/residential-solutions/single-split/')) {
      template = 'T0017C'; // Product listing
    } else if (path.includes('/hvac/')) {
      template = 'T0017C'; // HVAC general
    } else if (path.includes('/commercial-display/') || path.includes('/information-display/')) {
      template = 'T0017C';
    } else if (hasForm || hasMap) {
      template = 'T0017C';
    } else if (hasSitemap) {
      template = 'T0017C';
    } else {
      template = 'T0017C'; // Default for business pages
    }
  }
  // Consumer pages
  else if (path.includes('/about-lg/') || path.includes('/support/')) {
    type = 'JSP';
    template = 'nan';
  }
  // Story/blog pages
  else if (path.includes('/lg-story/')) {
    type = 'JSP';
    template = 'nan';
  }
  // Product/category listing pages
  else if (path.match(/\/(tvs|monitors|refrigerators|washing-machines|air-conditioning|sound-bars|projectors|speakers)/)) {
    type = 'JSP';
    template = 'nan';
  }
  // Marketing/campaign pages
  else if (path.includes('/tvs-soundbars/') || path.includes('/qned-tvs/') || path.includes('/cinebeam') || path.includes('/Ultragear') || path.includes('/ultragear')) {
    type = 'JSP';
    template = 'nan';
  }
  // Other consumer pages
  else {
    type = 'JSP';
    template = 'nan';
  }

  return { type, template };
}

// Find the main content area from SSR HTML
function findContentArea($) {
  // Strategy: Remove known non-content elements, then find the div containing h1
  // Remove scripts, styles, noscript
  $('script, noscript, style').remove();

  // Try standard content selectors first
  let content = $('main, #content, [role="main"], #lgContent').first();
  if (content.length && content.find('h1').length) return content;

  // Find the body > div that contains h1 (main content indicator)
  let contentDiv = null;
  $('body > div').each((i, el) => {
    const div = $(el);
    if (div.find('h1').length > 0 && !contentDiv) {
      contentDiv = div;
    }
  });

  if (contentDiv) {
    // Clone to avoid modifying original
    // Remove nav-like elements from this div
    contentDiv.find('header, footer, nav, [class*="gnb"], [class*="footer"], [class*="sitemap"]').remove();
    return contentDiv;
  }

  // Fallback: use body
  return $('body');
}

// Analyze page complexity
function analyzeComplexity($, url) {
  const content = findContentArea($);

  // Count content elements
  const headings = content.find('h1, h2, h3, h4, h5, h6').length;
  const paragraphs = content.find('p').length;
  const images = content.find('img').length;
  const tables = content.find('table').length;
  const lists = content.find('ul, ol').length;
  const numContents = headings + paragraphs + images + tables + lists;

  // Count links
  const numLinks = content.find('a[href]').length;

  // Count dynamic JS/integrations
  const iframes = content.find('iframe').length;
  const forms = content.find('form').length;
  const videos = content.find('video, [class*="video"], [data-video]').length;
  const maps = content.find('[class*="map"], .gm-style, [class*="google-map"]').length;
  const carousels = content.find('[class*="carousel"], [class*="slider"], [class*="swiper"]').length;
  const tabs = content.find('[role="tablist"], [class*="tab-content"]').length;
  const accordions = content.find('[class*="accordion"], [class*="collapse"]').length;
  const dynamicCount = iframes + forms + videos + maps + carousels + tabs + accordions;

  // Determine complexity
  let complexity = 'Simple';
  let devHours = 2;
  let qaHours = 1;

  if (dynamicCount >= 5 || numContents > 100 || (forms > 0 && maps > 0)) {
    complexity = 'Complex';
    devHours = 8;
    qaHours = 4;
  } else if (dynamicCount >= 2 || numContents > 30 || tables > 2 || forms > 0 || maps > 0 || carousels > 0) {
    complexity = 'Medium';
    devHours = 4;
    qaHours = 2;
  }

  return {
    complexity,
    devHours,
    qaHours,
    numContents,
    numLinks,
    numDynamic: dynamicCount
  };
}

// Fetch a single URL with retry
async function fetchUrl(url, retries = RETRY_COUNT) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), TIMEOUT);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5'
        },
        redirect: 'follow'
      });

      clearTimeout(timeout);

      const html = await response.text();
      return {
        url,
        statusCode: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        html,
        finalUrl: response.url,
        error: null
      };
    } catch (err) {
      if (attempt === retries) {
        return {
          url,
          statusCode: 0,
          headers: {},
          html: '',
          finalUrl: url,
          error: err.message
        };
      }
      // Wait before retry
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

// Process a single URL
function processResult(result) {
  const path = new URL(result.url).pathname;

  if (result.error || result.statusCode >= 400) {
    return {
      pageUrl: path,
      locale: 'AE',
      type: 'ERROR',
      template: 'nan',
      complexity: 'N/A',
      devHours: 0,
      qaHours: 0,
      numContents: 0,
      numLinks: 0,
      numDynamic: 0,
      statusCode: result.statusCode,
      error: result.error || `HTTP ${result.statusCode}`
    };
  }

  const $ = cheerio.load(result.html);
  const { type, template } = classifyPage(result.url, $, result.statusCode, result.headers);
  const metrics = analyzeComplexity($, result.url);

  return {
    pageUrl: path,
    locale: 'AE',
    type,
    template,
    complexity: metrics.complexity,
    devHours: metrics.devHours,
    qaHours: metrics.qaHours,
    numContents: metrics.numContents,
    numLinks: metrics.numLinks,
    numDynamic: metrics.numDynamic,
    statusCode: result.statusCode,
    error: null
  };
}

// Process URLs in batches
async function processBatch(batch, batchNum, totalBatches) {
  const results = await Promise.all(batch.map(url => fetchUrl(url)));
  const processed = results.map(r => processResult(r));
  console.log(`  Batch ${batchNum}/${totalBatches} complete (${processed.length} URLs)`);
  return processed;
}

// Main execution
async function main() {
  console.log(`Starting crawl of ${urls.length} URLs with concurrency ${CONCURRENCY}...`);
  const startTime = Date.now();

  const allResults = [];
  const batches = [];

  // Create batches
  for (let i = 0; i < urls.length; i += CONCURRENCY) {
    batches.push(urls.slice(i, i + CONCURRENCY));
  }

  console.log(`Processing ${batches.length} batches...`);

  for (let i = 0; i < batches.length; i++) {
    const batchResults = await processBatch(batches[i], i + 1, batches.length);
    allResults.push(...batchResults);

    // Progress update every 10 batches
    if ((i + 1) % 10 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const pct = (((i + 1) / batches.length) * 100).toFixed(1);
      console.log(`Progress: ${pct}% (${allResults.length}/${urls.length} URLs, ${elapsed}s elapsed)`);
    }

    // Small delay between batches to be polite
    if (i < batches.length - 1) {
      await new Promise(r => setTimeout(r, DELAY_BETWEEN_BATCHES));
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nCrawl complete: ${allResults.length} URLs processed in ${elapsed}s`);

  // Count stats
  const errors = allResults.filter(r => r.error);
  const byType = {};
  const byComplexity = {};
  allResults.forEach(r => {
    byType[r.type] = (byType[r.type] || 0) + 1;
    byComplexity[r.complexity] = (byComplexity[r.complexity] || 0) + 1;
  });

  console.log(`\nSummary:`);
  console.log(`  Errors: ${errors.length}`);
  console.log(`  By Type:`, byType);
  console.log(`  By Complexity:`, byComplexity);

  // Generate Excel
  const wb = XLSX.utils.book_new();

  const wsData = [
    ['Page URL', 'Locale', 'Type', 'Template', 'Complexity', 'Estimated Development Hours', 'Estimated QA Hours', 'Number of Contents', 'Number of links', 'Number of Dynamic JS/integration', 'HTTP Status', 'Error']
  ];

  allResults.forEach(r => {
    wsData.push([
      r.pageUrl,
      r.locale,
      r.type,
      r.template,
      r.complexity,
      r.devHours,
      r.qaHours,
      r.numContents,
      r.numLinks,
      r.numDynamic,
      r.statusCode,
      r.error || ''
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  ws['!cols'] = [
    { wch: 80 },  // Page URL
    { wch: 8 },   // Locale
    { wch: 8 },   // Type
    { wch: 12 },  // Template
    { wch: 12 },  // Complexity
    { wch: 25 },  // Dev Hours
    { wch: 20 },  // QA Hours
    { wch: 20 },  // Contents
    { wch: 16 },  // Links
    { wch: 30 },  // Dynamic JS
    { wch: 12 },  // Status
    { wch: 30 },  // Error
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'AE');
  XLSX.writeFile(wb, '/workspace/page_url_audit_ae.xlsx');
  console.log(`\nSpreadsheet saved to: /workspace/page_url_audit_ae.xlsx`);

  // Also save as CSV for quick viewing
  const csv = wsData.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  fs.writeFileSync('/workspace/page_url_audit_ae.csv', csv);
  console.log(`CSV saved to: /workspace/page_url_audit_ae.csv`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
