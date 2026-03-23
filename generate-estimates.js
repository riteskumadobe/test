const XLSX = require('xlsx');

// ============================================
// ESTIMATE 1: GLOBAL IMPLEMENTATION (UAE PILOT)
// ============================================

const globalEstimate = {
  sheetName: 'Global Implementation (UAE Pilot)',
  categories: [
    // 1. PROJECT SETUP & INFRASTRUCTURE
    {
      category: '1. PROJECT SETUP & INFRASTRUCTURE',
      items: [
        { item: 'AEM EDS project setup (repo, boilerplate, aem.json config)', complexity: 'Medium', devHours: 16, qaHours: 4, notes: 'One-time setup with boilerplate clone, fstab.yaml, paths.json' },
        { item: 'CI/CD pipeline configuration (GitHub Actions, preview/live)', complexity: 'Medium', devHours: 16, qaHours: 8, notes: 'Build, lint, test, deploy pipeline' },
        { item: 'Local development environment setup & documentation', complexity: 'Simple', devHours: 8, qaHours: 4, notes: 'aem CLI, local server, developer guide' },
        { item: 'Multi-locale architecture design (URL structure, folder hierarchy)', complexity: 'Complex', devHours: 24, qaHours: 8, notes: 'Support 25-30 country folders, locale config pattern' },
        { item: 'Content authoring guidelines & documentation', complexity: 'Medium', devHours: 16, qaHours: 0, notes: 'Block usage guide, authoring best practices' },
      ]
    },
    // 2. GLOBAL DESIGN SYSTEM
    {
      category: '2. GLOBAL DESIGN SYSTEM',
      items: [
        { item: 'CSS custom properties / design tokens (colors, spacing, sizing)', complexity: 'Medium', devHours: 24, qaHours: 8, notes: 'LG brand colors (#A50034), spacing scale, sizing tokens' },
        { item: 'Typography system (LG Smart font, Cyrillic/Arabic fallbacks)', complexity: 'Medium', devHours: 16, qaHours: 8, notes: 'Font loading, multi-script support, heading/body scales' },
        { item: 'Button component styles (primary, secondary, ghost, disabled)', complexity: 'Simple', devHours: 8, qaHours: 4, notes: '4 button variants with hover/focus states' },
        { item: 'Responsive grid system & breakpoints', complexity: 'Medium', devHours: 16, qaHours: 8, notes: 'Mobile-first, 4 breakpoints' },
        { item: 'Icon system', complexity: 'Simple', devHours: 8, qaHours: 4, notes: 'SVG icon library for common UI elements' },
        { item: 'Accessibility standards (WCAG 2.1 AA)', complexity: 'Medium', devHours: 16, qaHours: 8, notes: 'Skip links, focus management, ARIA patterns' },
        { item: 'RTL/LTR support framework', complexity: 'Complex', devHours: 32, qaHours: 16, notes: 'CSS logical properties for Arabic locales' },
      ]
    },
    // 3. GLOBAL NAVIGATION COMPONENTS
    {
      category: '3. GLOBAL NAVIGATION COMPONENTS',
      items: [
        { item: 'Global header (logo, utility nav, mobile hamburger)', complexity: 'Complex', devHours: 40, qaHours: 16, notes: 'Responsive, sticky, locale-aware logo link' },
        { item: 'Mega menu (multi-level product navigation)', complexity: 'Complex', devHours: 60, qaHours: 24, notes: '3-level depth, category images, responsive collapse' },
        { item: 'Mobile navigation (hamburger menu, accordion sub-nav)', complexity: 'Complex', devHours: 32, qaHours: 12, notes: 'Touch-friendly, animated transitions' },
        { item: 'Breadcrumb component', complexity: 'Simple', devHours: 8, qaHours: 4, notes: 'Auto-generated from URL path, schema.org markup' },
        { item: 'Global footer (multi-column sitemap, social, legal)', complexity: 'Complex', devHours: 40, qaHours: 16, notes: 'Configurable columns, country-specific content areas' },
        { item: 'Search overlay with autocomplete', complexity: 'Complex', devHours: 40, qaHours: 16, notes: 'Product search, model number lookup, predictive results' },
        { item: 'Language/Region selector', complexity: 'Medium', devHours: 16, qaHours: 8, notes: 'Country/language switching with URL redirect' },
        { item: 'nav.xlsx / footer.xlsx authoring structure', complexity: 'Medium', devHours: 12, qaHours: 4, notes: 'Content structure for author-managed navigation' },
      ]
    },
    // 4. SHARED PAGE TEMPLATES
    {
      category: '4. SHARED PAGE TEMPLATES',
      items: [
        { item: 'Homepage template', complexity: 'Complex', devHours: 40, qaHours: 16, notes: 'Hero carousel, product showcase, category grid, support links' },
        { item: 'Product Listing Page (PLP) template', complexity: 'Complex', devHours: 60, qaHours: 24, notes: 'Filter panel, sort, product grid, pagination, sub-category nav' },
        { item: 'Product Detail Page (PDP) template', complexity: 'Complex', devHours: 80, qaHours: 32, notes: 'Gallery, specs, reviews, buy CTA, related products, sticky nav' },
        { item: 'Category/Sub-category landing template', complexity: 'Complex', devHours: 40, qaHours: 16, notes: 'Hero, sub-nav tabs, featured products, content blocks' },
        { item: 'Support Hub template', complexity: 'Complex', devHours: 40, qaHours: 16, notes: 'Search, category selector, help cards, contact section' },
        { item: 'About/Corporate template', complexity: 'Medium', devHours: 24, qaHours: 8, notes: 'Tab navigation, timeline, leadership grid' },
        { item: 'Content/Story article template', complexity: 'Medium', devHours: 24, qaHours: 8, notes: 'Article layout, featured image, related stories (270 AE pages)' },
        { item: 'Promotions listing template', complexity: 'Simple', devHours: 16, qaHours: 8, notes: 'Card grid layout, simple structure' },
        { item: 'Brand/AI landing page template', complexity: 'Complex', devHours: 40, qaHours: 16, notes: 'Video hero, tab sections, product carousels, story carousel' },
        { item: 'Business pages template', complexity: 'Complex', devHours: 40, qaHours: 16, notes: '127 AE business pages, multiple section layouts' },
      ]
    },
    // 5. SHARED BLOCKS (CONTENT BLOCKS)
    {
      category: '5. SHARED BLOCKS - CONTENT',
      items: [
        { item: 'Hero carousel/banner block (Slick/Swiper)', complexity: 'Complex', devHours: 40, qaHours: 16, notes: 'Auto-play, pause, dots, arrows, responsive images, video support' },
        { item: 'Product card component', complexity: 'Complex', devHours: 32, qaHours: 12, notes: 'Image, title, rating, price, wishlist, compare actions' },
        { item: 'Product card carousel block', complexity: 'Complex', devHours: 32, qaHours: 12, notes: 'Horizontal scroll, responsive card count, tabbed variants' },
        { item: 'Product grid block', complexity: 'Complex', devHours: 32, qaHours: 12, notes: 'Responsive grid, lazy load, load more' },
        { item: 'Tab panel block', complexity: 'Medium', devHours: 24, qaHours: 8, notes: 'Accessible tabs with ARIA, content switching' },
        { item: 'Accordion/FAQ block', complexity: 'Medium', devHours: 16, qaHours: 8, notes: 'Expandable sections, accessibility, schema.org FAQ' },
        { item: 'Content cards block (2/3/4-up grid)', complexity: 'Medium', devHours: 24, qaHours: 8, notes: 'Image + heading + description + CTA, responsive columns' },
        { item: 'Text + Image block (left/right/full variants)', complexity: 'Medium', devHours: 24, qaHours: 8, notes: 'Multiple layout variants, responsive stacking' },
        { item: 'Video player/embed block', complexity: 'Medium', devHours: 24, qaHours: 8, notes: 'YouTube embed, native video, play button overlay' },
        { item: 'CTA banner block', complexity: 'Simple', devHours: 12, qaHours: 4, notes: 'Full-width with heading, text, button' },
        { item: 'Feature highlight block', complexity: 'Medium', devHours: 16, qaHours: 8, notes: 'Icon/image + heading + description grid' },
        { item: 'Spec/comparison table block', complexity: 'Complex', devHours: 32, qaHours: 12, notes: 'Responsive table with scroll, sticky headers' },
        { item: 'Image gallery block', complexity: 'Complex', devHours: 32, qaHours: 12, notes: 'Thumbnail strip, zoom, lightbox, swipe' },
        { item: 'SEO text block (expandable)', complexity: 'Simple', devHours: 8, qaHours: 4, notes: 'Truncated text with "More" toggle' },
        { item: 'Social media links block', complexity: 'Simple', devHours: 8, qaHours: 4, notes: 'Configurable social platform icons' },
        { item: 'Contact/support cards block', complexity: 'Medium', devHours: 16, qaHours: 8, notes: 'Icon + title + description + CTA' },
        { item: 'Announcement bar block', complexity: 'Simple', devHours: 8, qaHours: 4, notes: 'Dismissible top notification banner' },
        { item: 'Star rating display block', complexity: 'Simple', devHours: 8, qaHours: 4, notes: 'Star icons + review count' },
        { item: 'Mosaic/featured grid block', complexity: 'Medium', devHours: 24, qaHours: 8, notes: 'Asymmetric image grid with overlay text' },
        { item: 'Story/news carousel block', complexity: 'Medium', devHours: 20, qaHours: 8, notes: 'Article cards with image + excerpt + CTA' },
      ]
    },
    // 6. SHARED BLOCKS (INTERACTIVE/JS)
    {
      category: '6. SHARED BLOCKS - INTERACTIVE/JS',
      items: [
        { item: 'Product filter panel', complexity: 'Complex', devHours: 60, qaHours: 24, notes: '40+ filter types, faceted search, URL state management' },
        { item: 'Product sort controls', complexity: 'Medium', devHours: 16, qaHours: 8, notes: 'Sort by price, popularity, newest, rating' },
        { item: 'Product compare widget', complexity: 'Complex', devHours: 40, qaHours: 16, notes: 'Multi-product selection, comparison modal/page' },
        { item: 'Wishlist functionality', complexity: 'Medium', devHours: 24, qaHours: 8, notes: 'Toggle button, local/account storage' },
        { item: 'Modal dialog system', complexity: 'Medium', devHours: 16, qaHours: 8, notes: 'Accessible modal with focus trap, multiple instances' },
        { item: 'Sticky navigation bar (PDP)', complexity: 'Medium', devHours: 16, qaHours: 8, notes: 'Scroll-triggered sticky with buy CTA' },
        { item: 'Back to top button', complexity: 'Simple', devHours: 4, qaHours: 2, notes: 'Scroll-triggered floating button' },
        { item: 'Lazy image loading', complexity: 'Simple', devHours: 8, qaHours: 4, notes: 'Intersection Observer, placeholder, progressive load' },
        { item: 'Cookie consent integration (OneTrust)', complexity: 'Medium', devHours: 16, qaHours: 8, notes: 'Banner, preference center, consent management' },
        { item: 'Form components (contact, feedback)', complexity: 'Medium', devHours: 24, qaHours: 8, notes: 'Validation, submission, multi-step forms' },
        { item: 'Pagination component', complexity: 'Simple', devHours: 8, qaHours: 4, notes: 'Page numbers, prev/next, load more variant' },
      ]
    },
    // 7. IMPORT INFRASTRUCTURE (GLOBAL)
    {
      category: '7. IMPORT INFRASTRUCTURE & CONTENT MIGRATION',
      items: [
        { item: 'Page template definitions (page-templates.json)', complexity: 'Medium', devHours: 16, qaHours: 4, notes: '10 templates with section/block mappings' },
        { item: 'Block parsers (20+ parsers for shared blocks)', complexity: 'Complex', devHours: 60, qaHours: 16, notes: 'DOM-to-EDS content transformation per block type' },
        { item: 'Page transformers (metadata, cleanup, structure)', complexity: 'Medium', devHours: 24, qaHours: 8, notes: 'Metadata extraction, URL rewriting, cleanup' },
        { item: 'Import script (import.js bundling)', complexity: 'Medium', devHours: 16, qaHours: 8, notes: 'Main import orchestrator combining parsers + transformers' },
        { item: 'Bulk import tooling & automation', complexity: 'Medium', devHours: 24, qaHours: 8, notes: 'Batch processing, error handling, progress reporting' },
        { item: 'UAE content migration (510 pages)', complexity: 'Complex', devHours: 40, qaHours: 24, notes: '270 story + 127 business + 113 other pages' },
        { item: 'Content verification & QA (UAE)', complexity: 'Complex', devHours: 16, qaHours: 40, notes: 'Visual comparison, link validation, metadata check' },
      ]
    },
    // 8. ANALYTICS & INTEGRATIONS
    {
      category: '8. ANALYTICS & THIRD-PARTY INTEGRATIONS',
      items: [
        { item: 'Adobe Analytics / Launch integration', complexity: 'Complex', devHours: 32, qaHours: 16, notes: 'Tag management, page tracking, custom events' },
        { item: 'Google Analytics 4 / GTM integration', complexity: 'Medium', devHours: 16, qaHours: 8, notes: 'Dual analytics setup, event tracking' },
        { item: 'Facebook/Meta Pixel', complexity: 'Simple', devHours: 8, qaHours: 4, notes: 'Conversion tracking, custom audiences' },
        { item: 'BazaarVoice (Reviews) integration', complexity: 'Complex', devHours: 32, qaHours: 12, notes: 'Review display, submission, syndication' },
        { item: 'WhatsApp chat widget (VIECHATBOT)', complexity: 'Medium', devHours: 16, qaHours: 8, notes: 'Floating widget, deep linking' },
        { item: 'YouTube video embed API', complexity: 'Simple', devHours: 8, qaHours: 4, notes: 'Player API, lazy loading, privacy mode' },
      ]
    },
    // 9. PERFORMANCE & TESTING
    {
      category: '9. PERFORMANCE, TESTING & LAUNCH',
      items: [
        { item: 'Performance optimization (Core Web Vitals)', complexity: 'Complex', devHours: 32, qaHours: 16, notes: 'LCP, FID, CLS optimization across templates' },
        { item: 'Cross-browser testing (Chrome, Safari, Firefox, Edge)', complexity: 'Medium', devHours: 8, qaHours: 24, notes: '4 browsers × 10 templates' },
        { item: 'Responsive testing (mobile, tablet, desktop)', complexity: 'Medium', devHours: 8, qaHours: 24, notes: '3 viewports × 10 templates' },
        { item: 'Accessibility audit & fixes', complexity: 'Medium', devHours: 16, qaHours: 16, notes: 'Screen reader, keyboard nav, color contrast' },
        { item: 'SEO audit (metadata, structured data, sitemap)', complexity: 'Medium', devHours: 16, qaHours: 8, notes: 'Schema.org, Open Graph, sitemap.xml' },
        { item: 'UAT support & bug fixes', complexity: 'Complex', devHours: 40, qaHours: 24, notes: 'User acceptance testing, issue resolution' },
        { item: 'Production launch & DNS cutover', complexity: 'Medium', devHours: 16, qaHours: 8, notes: 'Go-live checklist, monitoring, rollback plan' },
      ]
    },
  ]
};

// ============================================
// ESTIMATE 2: SINGLE COUNTRY (RUSSIA)
// ============================================

const countryEstimate = {
  sheetName: 'Country Implementation (Russia)',
  categories: [
    // 1. COUNTRY CONFIGURATION
    {
      category: '1. COUNTRY CONFIGURATION & SETUP',
      items: [
        { item: 'Locale folder setup (/ru/) with config files', complexity: 'Simple', devHours: 4, qaHours: 2, notes: 'Folder structure, fstab paths, locale config' },
        { item: 'Cyrillic font configuration & testing', complexity: 'Simple', devHours: 4, qaHours: 4, notes: 'LG Smart Cyrillic variant, fallback fonts' },
        { item: 'URL structure mapping (English slugs with Russian content)', complexity: 'Simple', devHours: 4, qaHours: 2, notes: 'Map Russian categories to URL paths' },
        { item: 'Country-specific metadata defaults', complexity: 'Simple', devHours: 4, qaHours: 2, notes: 'Default lang, hreflang, Open Graph locale' },
      ]
    },
    // 2. NAVIGATION CONTENT
    {
      category: '2. NAVIGATION CONTENT (COUNTRY-SPECIFIC)',
      items: [
        { item: 'Header navigation content (Russian labels, categories)', complexity: 'Simple', devHours: 8, qaHours: 4, notes: 'Populate nav.xlsx with Russian menu structure' },
        { item: 'Mega menu category mapping (Russia-specific product lines)', complexity: 'Medium', devHours: 12, qaHours: 8, notes: 'Different categories: Full HD, Stylers, Microwaves, Wireless TV' },
        { item: 'Footer content (Russian social media, legal, phone)', complexity: 'Simple', devHours: 8, qaHours: 4, notes: 'VK, OK, Telegram, Yandex Zen; single RU phone' },
        { item: 'Breadcrumb labels (Russian translations)', complexity: 'Simple', devHours: 4, qaHours: 2, notes: 'Category name translations' },
      ]
    },
    // 3. COUNTRY-SPECIFIC BLOCKS
    {
      category: '3. COUNTRY-SPECIFIC BLOCKS & VARIANTS',
      items: [
        { item: 'Russian social media block (VK, OK, Telegram, Yandex Zen)', complexity: 'Medium', devHours: 16, qaHours: 8, notes: 'Replace Facebook/Instagram/Twitter with Russian platforms' },
        { item: 'Where-to-Buy retailer grid block', complexity: 'Medium', devHours: 20, qaHours: 8, notes: 'Retailer logos + links (no direct e-commerce for Russia)' },
        { item: 'Telegram/Viber contact blocks (support page)', complexity: 'Simple', devHours: 8, qaHours: 4, notes: 'Messaging app deep links and QR codes' },
        { item: 'Anti-fraud warning block (support page)', complexity: 'Simple', devHours: 6, qaHours: 2, notes: 'Warning banner with content' },
        { item: '"Email to CEO" feedback block', complexity: 'Simple', devHours: 8, qaHours: 4, notes: 'Feedback form or link block' },
        { item: 'Legal entity details block (About page)', complexity: 'Simple', devHours: 4, qaHours: 2, notes: 'OOO details, INN, OGRN (Russian legal requirements)' },
        { item: 'Geography of sales map block (PLP)', complexity: 'Medium', devHours: 16, qaHours: 8, notes: 'City selector for retail availability' },
        { item: 'Price display adjustment (hide price, show "See Retailers")', complexity: 'Simple', devHours: 4, qaHours: 4, notes: 'Toggle pricing display via locale config' },
      ]
    },
    // 4. COUNTRY-SPECIFIC PAGES
    {
      category: '4. COUNTRY-SPECIFIC PAGES',
      items: [
        { item: 'Virtual Showroom page', complexity: 'Complex', devHours: 24, qaHours: 8, notes: '3D/WebGL interactive experience (unique to Russia)' },
        { item: 'LG SIGNATURE microsite (dedicated sub-nav, 6+ pages)', complexity: 'Complex', devHours: 32, qaHours: 12, notes: 'Standalone microsite with own navigation and magazine' },
        { item: 'LG Magazine listing page (vs LG Story)', complexity: 'Simple', devHours: 8, qaHours: 4, notes: 'Article listing with category filtering' },
        { item: 'Career page', complexity: 'Simple', devHours: 4, qaHours: 2, notes: 'Job listings or recruitment content' },
        { item: 'Social Responsibility page', complexity: 'Simple', devHours: 4, qaHours: 2, notes: 'CSR content page' },
        { item: 'Personal Data policy page (Russian data law)', complexity: 'Simple', devHours: 4, qaHours: 2, notes: 'Russian data protection compliance' },
        { item: 'Mobile phone legacy support page', complexity: 'Simple', devHours: 2, qaHours: 1, notes: 'Maintenance notice for discontinued mobile division' },
      ]
    },
    // 5. IMPORT INFRASTRUCTURE & CONTENT MIGRATION
    {
      category: '5. IMPORT INFRASTRUCTURE & CONTENT MIGRATION',
      items: [
        { item: 'Russia site crawl & page audit', complexity: 'Medium', devHours: 8, qaHours: 4, notes: 'Crawl all RU URLs, classify templates, complexity' },
        { item: 'Country-specific block parsers (5-8 new parsers)', complexity: 'Medium', devHours: 24, qaHours: 8, notes: 'Parsers for Russia-only blocks' },
        { item: 'Import script adaptation for Russian content', complexity: 'Medium', devHours: 12, qaHours: 4, notes: 'Extend global import script with RU-specific handlers' },
        { item: 'Content migration - Product pages (~300-400 pages)', complexity: 'Complex', devHours: 24, qaHours: 16, notes: 'PLP/PDP pages with Russian product data' },
        { item: 'Content migration - Editorial/Magazine pages (~100-200 pages)', complexity: 'Medium', devHours: 16, qaHours: 8, notes: 'Article content migration' },
        { item: 'Content migration - Support, About, Business pages (~50-100 pages)', complexity: 'Medium', devHours: 12, qaHours: 8, notes: 'Static/informational pages' },
        { item: 'Content verification & visual QA', complexity: 'Complex', devHours: 8, qaHours: 24, notes: 'Visual comparison, link check, metadata validation' },
      ]
    },
    // 6. COUNTRY-SPECIFIC INTEGRATIONS
    {
      category: '6. COUNTRY-SPECIFIC INTEGRATIONS',
      items: [
        { item: 'Russian analytics configuration', complexity: 'Simple', devHours: 4, qaHours: 4, notes: 'Country-specific GA/Adobe Analytics property' },
        { item: 'Yandex Metrica integration (if required)', complexity: 'Simple', devHours: 8, qaHours: 4, notes: 'Russian-specific analytics platform' },
        { item: 'Russian social sharing (VK, OK share buttons)', complexity: 'Simple', devHours: 8, qaHours: 4, notes: 'Share API for Russian social networks' },
        { item: 'Cookie consent (Russian localization)', complexity: 'Simple', devHours: 4, qaHours: 2, notes: 'OneTrust Russian translation, data law compliance' },
      ]
    },
    // 7. TESTING & LAUNCH
    {
      category: '7. TESTING & COUNTRY LAUNCH',
      items: [
        { item: 'Cyrillic rendering verification across templates', complexity: 'Simple', devHours: 4, qaHours: 8, notes: 'Font rendering, text overflow, line breaks' },
        { item: 'Cross-browser testing (Russia-focused)', complexity: 'Simple', devHours: 4, qaHours: 8, notes: 'Yandex Browser included in test matrix' },
        { item: 'Social media integration testing', complexity: 'Simple', devHours: 2, qaHours: 4, notes: 'VK/OK/Telegram sharing and contact flows' },
        { item: 'Support channel testing (phone, Telegram, Viber)', complexity: 'Simple', devHours: 2, qaHours: 4, notes: 'Deep links, phone number formatting' },
        { item: 'SEO verification (hreflang, meta, structured data)', complexity: 'Simple', devHours: 4, qaHours: 4, notes: 'Russian locale SEO, search console setup' },
        { item: 'UAT support & bug fixes', complexity: 'Medium', devHours: 16, qaHours: 8, notes: 'Country-specific issue resolution' },
        { item: 'Go-live & DNS configuration', complexity: 'Simple', devHours: 4, qaHours: 4, notes: 'Country URL routing, monitoring' },
      ]
    },
  ]
};

// ============================================
// GENERATE XLSX
// ============================================

const wb = XLSX.utils.book_new();

function createSheet(estimate) {
  const rows = [];
  let totalDev = 0;
  let totalQA = 0;
  let totalAll = 0;
  
  // Header
  rows.push(['Category', 'Item', 'Complexity', 'Dev Hours', 'QA Hours', 'Total Hours', 'Notes']);
  
  for (const cat of estimate.categories) {
    let catDev = 0;
    let catQA = 0;
    
    // Category header row
    rows.push([cat.category, '', '', '', '', '', '']);
    
    for (const item of cat.items) {
      const total = item.devHours + item.qaHours;
      rows.push(['', item.item, item.complexity, item.devHours, item.qaHours, total, item.notes]);
      catDev += item.devHours;
      catQA += item.qaHours;
    }
    
    // Category subtotal
    const catTotal = catDev + catQA;
    rows.push(['', `SUBTOTAL: ${cat.category.split('. ')[1] || cat.category}`, '', catDev, catQA, catTotal, '']);
    rows.push([]); // Empty row
    
    totalDev += catDev;
    totalQA += catQA;
  }
  
  totalAll = totalDev + totalQA;
  
  // Project Management overhead (15%)
  const pmDev = Math.round(totalDev * 0.15);
  const pmQA = Math.round(totalQA * 0.15);
  const pmTotal = pmDev + pmQA;
  rows.push(['PROJECT MANAGEMENT (15% overhead)', '', '', pmDev, pmQA, pmTotal, 'Coordination, reviews, meetings, risk management']);
  rows.push([]);
  
  // Buffer/Contingency (10%)
  const bufDev = Math.round(totalDev * 0.10);
  const bufQA = Math.round(totalQA * 0.10);
  const bufTotal = bufDev + bufQA;
  rows.push(['CONTINGENCY BUFFER (10%)', '', '', bufDev, bufQA, bufTotal, 'Unforeseen issues, scope changes, technical debt']);
  rows.push([]);
  
  // Grand Total
  const grandDev = totalDev + pmDev + bufDev;
  const grandQA = totalQA + pmQA + bufQA;
  const grandTotal = grandDev + grandQA;
  rows.push(['GRAND TOTAL', '', '', grandDev, grandQA, grandTotal, '']);
  
  // Person-weeks and Person-months (40hr/week)
  const devWeeks = (grandDev / 40).toFixed(1);
  const qaWeeks = (grandQA / 40).toFixed(1);
  const totalWeeks = (grandTotal / 40).toFixed(1);
  rows.push(['IN PERSON-WEEKS (40hrs/week)', '', '', devWeeks, qaWeeks, totalWeeks, '']);
  
  const devMonths = (grandDev / 160).toFixed(1);
  const qaMonths = (grandQA / 160).toFixed(1);
  const totalMonths = (grandTotal / 160).toFixed(1);
  rows.push(['IN PERSON-MONTHS (160hrs/month)', '', '', devMonths, qaMonths, totalMonths, '']);
  
  const ws = XLSX.utils.aoa_to_sheet(rows);
  
  // Column widths
  ws['!cols'] = [
    { wch: 45 },  // Category
    { wch: 60 },  // Item
    { wch: 12 },  // Complexity
    { wch: 12 },  // Dev Hours
    { wch: 12 },  // QA Hours
    { wch: 12 },  // Total Hours
    { wch: 60 },  // Notes
  ];
  
  return { ws, grandDev, grandQA, grandTotal };
}

// Create Global sheet
const global = createSheet(globalEstimate);
XLSX.utils.book_append_sheet(wb, global.ws, 'Global (UAE Pilot)');

// Create Country sheet
const country = createSheet(countryEstimate);
XLSX.utils.book_append_sheet(wb, country.ws, 'Country (Russia)');

// Create Summary sheet
const summaryRows = [
  ['EDS MIGRATION ESTIMATION SUMMARY', '', '', '', '', ''],
  ['LG Global Template + Country Rollout', '', '', '', '', ''],
  ['Generated: ' + new Date().toISOString().split('T')[0], '', '', '', '', ''],
  [],
  ['SCOPE', 'Dev Hours', 'QA Hours', 'Total Hours', 'Person-Weeks', 'Person-Months'],
  ['Global Implementation (UAE as Pilot)', global.grandDev, global.grandQA, global.grandTotal, (global.grandTotal/40).toFixed(1), (global.grandTotal/160).toFixed(1)],
  ['Single Country Rollout (Russia Example)', country.grandDev, country.grandQA, country.grandTotal, (country.grandTotal/40).toFixed(1), (country.grandTotal/160).toFixed(1)],
  [],
  ['MULTI-COUNTRY PROJECTION', '', '', '', '', ''],
  ['Number of Countries', '25-30', '', '', '', ''],
  ['Global (one-time)', global.grandDev, global.grandQA, global.grandTotal, (global.grandTotal/40).toFixed(1), (global.grandTotal/160).toFixed(1)],
  ['25 Countries × Country Estimate', country.grandDev * 25, country.grandQA * 25, country.grandTotal * 25, (country.grandTotal*25/40).toFixed(1), (country.grandTotal*25/160).toFixed(1)],
  ['30 Countries × Country Estimate', country.grandDev * 30, country.grandQA * 30, country.grandTotal * 30, (country.grandTotal*30/40).toFixed(1), (country.grandTotal*30/160).toFixed(1)],
  [],
  ['TOTAL PROGRAM ESTIMATE (25 countries)', global.grandDev + country.grandDev * 25, global.grandQA + country.grandQA * 25, global.grandTotal + country.grandTotal * 25, ((global.grandTotal + country.grandTotal*25)/40).toFixed(1), ((global.grandTotal + country.grandTotal*25)/160).toFixed(1)],
  ['TOTAL PROGRAM ESTIMATE (30 countries)', global.grandDev + country.grandDev * 30, global.grandQA + country.grandQA * 30, global.grandTotal + country.grandTotal * 30, ((global.grandTotal + country.grandTotal*30)/40).toFixed(1), ((global.grandTotal + country.grandTotal*30)/160).toFixed(1)],
  [],
  [],
  ['ASSUMPTIONS & NOTES', '', '', '', '', ''],
  ['1. Global implementation includes all shared blocks, templates, design system, and infrastructure that can be reused across countries', '', '', '', '', ''],
  ['2. Country estimate assumes global template covers 60-70% of implementation; remaining 20-30% is country-specific', '', '', '', '', ''],
  ['3. Country estimates will vary - some countries (similar to UAE) may need less; countries with unique features (like Russia) may need more', '', '', '', '', ''],
  ['4. Arabic-speaking countries (AE_AR) will need RTL support testing (included in global) but may need additional RTL-specific block adjustments', '', '', '', '', ''],
  ['5. E-commerce vs catalog-only countries will have different PDP complexity', '', '', '', '', ''],
  ['6. Social media integrations vary by country (WeChat for China, VK for Russia, WhatsApp for Middle East, etc.)', '', '', '', '', ''],
  ['7. Content migration volume varies significantly by country (UAE has 510 pages; Russia may have 500-800 pages)', '', '', '', '', ''],
  ['8. Estimates include 15% PM overhead and 10% contingency buffer', '', '', '', '', ''],
  ['9. Dev hours assume experienced EDS developers; QA hours assume dedicated QA resources', '', '', '', '', ''],
  ['10. Does not include content authoring/translation (assumes content is provided)', '', '', '', '', ''],
  [],
  ['PAGE INVENTORY (UAE - Pilot Country)', '', '', '', '', ''],
  ['Total Pages Audited', 510, '', '', '', ''],
  ['Consumer Pages (JSP)', 381, '', '', '', ''],
  ['Business Pages (PAGE)', 127, '', '', '', ''],
  ['Error Pages', 3, '', '', '', ''],
  ['By Complexity: Complex', 336, '', '', '', ''],
  ['By Complexity: Medium', 158, '', '', '', ''],
  ['By Complexity: Simple', 14, '', '', '', ''],
  ['By Section: LG Story articles', 270, '', '', '', ''],
  ['By Section: Business', 127, '', '', '', ''],
  ['By Section: TV/Soundbars', 34, '', '', '', ''],
  ['By Section: Other (Support, About, AC, etc.)', 79, '', '', '', ''],
  [],
  ['SHARED vs COUNTRY-SPECIFIC BREAKDOWN', '', '', '', '', ''],
  ['Component Type', 'Shared (Global)', 'Country-Specific', '', '', ''],
  ['Page Templates', '10 templates', '2-4 extra templates', '', '', ''],
  ['Content Blocks', '20 blocks', '5-8 variant blocks', '', '', ''],
  ['Interactive/JS Blocks', '11 blocks', '2-3 variant blocks', '', '', ''],
  ['Navigation Components', '8 components', 'Content changes only', '', '', ''],
  ['Design System', 'Full system', 'Font/locale adjustments', '', '', ''],
  ['Analytics', 'Framework setup', 'Country property config', '', '', ''],
  ['Import Infrastructure', 'Core parsers/transformers', '5-8 additional parsers', '', '', ''],
];

const summaryWs = XLSX.utils.aoa_to_sheet(summaryRows);
summaryWs['!cols'] = [
  { wch: 55 },
  { wch: 18 },
  { wch: 18 },
  { wch: 18 },
  { wch: 18 },
  { wch: 18 },
];

XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

// Move Summary to first position
wb.SheetNames = ['Summary', 'Global (UAE Pilot)', 'Country (Russia)'];

// Write file
XLSX.writeFile(wb, '/workspace/eds_migration_estimates.xlsx');
console.log('Estimates generated: /workspace/eds_migration_estimates.xlsx');

// Print summary
console.log('\n=== SUMMARY ===');
console.log(`Global Implementation (UAE Pilot): ${global.grandDev} dev + ${global.grandQA} QA = ${global.grandTotal} total hours (${(global.grandTotal/160).toFixed(1)} person-months)`);
console.log(`Single Country (Russia):           ${country.grandDev} dev + ${country.grandQA} QA = ${country.grandTotal} total hours (${(country.grandTotal/160).toFixed(1)} person-months)`);
console.log(`\n25-Country Program Total: ${global.grandTotal + country.grandTotal * 25} hours (${((global.grandTotal + country.grandTotal*25)/160).toFixed(1)} person-months)`);
console.log(`30-Country Program Total: ${global.grandTotal + country.grandTotal * 30} hours (${((global.grandTotal + country.grandTotal*30)/160).toFixed(1)} person-months)`);

