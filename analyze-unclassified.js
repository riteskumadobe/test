const fs = require('fs');
const aeUrls = fs.readFileSync('/workspace/urls-ae.txt', 'utf8').trim().split('\n').filter(u => u.trim());
const aeArUrls = fs.readFileSync('/workspace/urls-ae_ar.txt', 'utf8').trim().split('\n').filter(u => u.trim());
const ruUrls = fs.readFileSync('/workspace/urls-ru.txt', 'utf8').trim().split('\n').filter(u => u.trim());

function getPathAfterLocale(url) {
  try {
    const u = new URL(url);
    return u.pathname.replace(/^\/(ae|ae_ar|ru)\//, '/');
  } catch(e) { return url; }
}

const patterns = {};
for (const url of [...aeUrls, ...aeArUrls, ...ruUrls]) {
  const path = getPathAfterLocale(url);
  const parts = path.split('/').filter(Boolean);
  const prefix = parts.slice(0, Math.min(2, parts.length)).join('/');
  if (patterns[prefix] === undefined) patterns[prefix] = [];
  patterns[prefix].push(url);
}

const sorted = Object.entries(patterns).sort((a, b) => b[1].length - a[1].length);
for (const [p, urls] of sorted.slice(0, 50)) {
  console.log(`${p.padEnd(60)} ${urls.length}`);
}

// Now find which ones are NOT being matched by our rules
// We need to check specific URL patterns that might be falling through
console.log('\n--- SAMPLE UNCLASSIFIED PATHS ---');
const unclassifiedPrefixes = ['lg-story/helpful-guide', 'lg-story/news', 'lg-story/scoop',
  'lg-story/lifes-good-people', 'lg-story/up-and-coming', 'lg-story/articles',
  'business', 'tvs-soundbars', 'tvs', 'support', 'about-lg', 'air-conditioning'];

// Check ALL URLs to find ones that don't match any known prefix
const knownPrefixes = [
  'includes', 'cmsinclude', 'sitemap', 'privacy', 'legal', 'personaldata', 'cookie',
  'sm-test', 'lg-story', 'lg-magazine', 'business', 'tvs-soundbars', 'tvs',
  'oled-televisions', 'qned-tvs', 'televisions', 'support', 'air-conditioning',
  'air-conditioner', 'about-lg', 'lg-ai', 'lg-ai-core-tech', 'better-life',
  'lg-mood-up', 'lg-signature', 'lg-thinq', 'lg-objet-collection', 'webos-smart-tv',
  'cinebeam', 'Ultragear', 'ultragear', 'probeam', 'healthy-home-solution',
  'lgneochef', 'recipes', 'ces20', 'promotion-offers', 'appliances', 'discount',
  'washing-machines', 'vacuum-cleaners', 'refrigerators', 'stylers', 'built-in-appliances',
  'home-appliances', 'monitors', 'projectors', 'soundbars', 'sound-bars', 'audio',
  'lgoled', 'lgnanocell', 'virtualshowroom', 'newyear', 'happynewyear', 'gift-wall',
  'healthcare', 'welcome-to-lg-thinq', 'shop', 'yandex-recomended-retailers',
  'mobile', 'technologies', 'lggramstore', 'lg-travel', 'brandshop',
  'tv-audio-video', 'it-products', '55-inch-tvs', '65-inch-tvs', '75-inch-tvs',
  'oled-televizory', 'televizory', 'led-lcd-televisions', 'super-uhd', 'lifestyle-televisions',
  '8k-televisions', 'ultra-large-televisions', 'smart-tvs', 'uhd-4k',
  'dryers', 'microwaves', 'bluetooth-speakers', 'computer-products', 'laptops',
  'ergo-monitors', 'homeandoffice', 'ultrafine', 'ultrawide', 'smart-monitors',
  'mini-systems-xboom', 'air-purifiers'
];

// Find URLs that don't start with any known prefix
const unmatched = [];
for (const url of [...aeUrls, ...aeArUrls, ...ruUrls]) {
  const path = getPathAfterLocale(url).replace(/^\//, '');
  let matched = false;
  for (const prefix of knownPrefixes) {
    if (path.startsWith(prefix)) {
      matched = true;
      break;
    }
  }
  // Also check query param URLs and exact patterns
  if (path.includes('buying-guide') || path.includes('?')) matched = true;

  if (matched === false) {
    unmatched.push(path);
  }
}

console.log(`\nUnmatched paths: ${unmatched.length}`);
// Group unmatched by first segment
const unmatchedGroups = {};
for (const p of unmatched) {
  const first = p.split('/')[0];
  if (unmatchedGroups[first] === undefined) unmatchedGroups[first] = [];
  unmatchedGroups[first].push(p);
}

const sortedUnmatched = Object.entries(unmatchedGroups).sort((a, b) => b[1].length - a[1].length);
for (const [prefix, paths] of sortedUnmatched) {
  console.log(`\n${prefix} (${paths.length}):`);
  for (const p of paths.slice(0, 5)) {
    console.log(`  ${p}`);
  }
  if (paths.length > 5) console.log(`  ... and ${paths.length - 5} more`);
}
