const XLSX = require('xlsx');
const fs = require('fs');

// ============================================
// URL CLASSIFICATION & AUTHORING EFFORT ESTIMATION
// ============================================

// Read URL files
const aeUrls = fs.readFileSync('/workspace/urls-ae.txt', 'utf8').trim().split('\n').filter(u => u.trim());
const aeArUrls = fs.readFileSync('/workspace/urls-ae_ar.txt', 'utf8').trim().split('\n').filter(u => u.trim());
const ruUrls = fs.readFileSync('/workspace/urls-ru.txt', 'utf8').trim().split('\n').filter(u => u.trim());

// ============================================
// PAGE TYPE CLASSIFICATION RULES
// ============================================
// Each rule: { pattern: RegExp or function, type, subtype, authoringHours, description }

const classificationRules = [
  // System/Include pages - minimal authoring
  { match: (path) => /\/(includes|cmsinclude)\//.test(path), type: 'System', subtype: 'Include/Fragment', authoringHours: 0.25, description: 'Header/footer/system fragments - copy or auto-generated' },
  { match: (path) => /\/sitemap$/.test(path), type: 'System', subtype: 'Sitemap', authoringHours: 0.25, description: 'Auto-generated sitemap' },
  { match: (path) => /\/(privacy|legal|personaldata|cookie)/.test(path), type: 'System', subtype: 'Legal/Privacy', authoringHours: 0.5, description: 'Legal text - copy from source, format check' },
  { match: (path) => /\/sm-test\//.test(path), type: 'System', subtype: 'Test Page', authoringHours: 0, description: 'Test pages - skip' },

  // Story listing/index pages (MUST come before article rules - more specific match)
  // Category index: /lg-story/helpful-guide/index (exactly 3 segments after locale)
  { match: (path) => /\/lg-story\/(helpful-guide|news|scoop|lifes-good-people|up-and-coming|articles)\/index$/.test(path.replace(/\/+$/, '')) && path.replace(/\/+$/, '').split('/').filter(Boolean).length <= 4, type: 'Listing', subtype: 'Story Category Index', authoringHours: 1.0, description: 'Category listing page: filter setup, card configuration' },
  { match: (path) => /\/lg-story\/index$/.test(path.replace(/\/+$/, '')) || /\/lg-story$/.test(path), type: 'Listing', subtype: 'Story Hub', authoringHours: 1.5, description: 'Story hub: featured articles, category navigation' },
  // Story GNB include
  { match: (path) => /\/lg-story\/includes\//.test(path), type: 'System', subtype: 'Include/Fragment', authoringHours: 0.25, description: 'Story navigation fragment' },
  // Story articles - different sub-categories (match any path with content after category)
  { match: (path) => /\/lg-story\/helpful-guide\//.test(path), type: 'Content', subtype: 'Helpful Guide Article', authoringHours: 1.5, description: 'How-to guide: text, images, metadata, internal links' },
  { match: (path) => /\/lg-story\/news\//.test(path), type: 'Content', subtype: 'News Article', authoringHours: 1.0, description: 'News/press release: shorter format, standard layout' },
  { match: (path) => /\/lg-story\/scoop\//.test(path), type: 'Content', subtype: 'Scoop/Review Article', authoringHours: 1.25, description: 'Customer reviews/scoop: testimonial content, images' },
  { match: (path) => /\/lg-story\/lifes-good-people\//.test(path), type: 'Content', subtype: "Life's Good People Article", authoringHours: 1.25, description: 'Brand story: interview/ambassador content, images, video' },
  { match: (path) => /\/lg-story\/up-and-coming\//.test(path), type: 'Content', subtype: 'Up & Coming Article', authoringHours: 1.25, description: 'Product launch article: product details, images, specs' },
  { match: (path) => /\/lg-story\/articles\//.test(path), type: 'Content', subtype: 'General Article', authoringHours: 1.25, description: 'General article: mixed content format' },
  // Catch any remaining lg-story pages
  { match: (path) => /\/lg-story\//.test(path) || /\/lg-story$/.test(path), type: 'Content', subtype: 'Story Page (Other)', authoringHours: 1.25, description: 'Story/editorial page' },
  { match: (path) => /\/lg-magazine/.test(path), type: 'Content', subtype: 'Magazine Article', authoringHours: 1.5, description: 'Magazine article: editorial content, images' },

  // Business pages
  { match: (path) => /\/business\/hvac\//.test(path), type: 'Business', subtype: 'HVAC Product/Solution', authoringHours: 2.0, description: 'B2B HVAC: technical specs, images, downloads' },
  { match: (path) => /\/business\/commercial-display\//.test(path), type: 'Business', subtype: 'Commercial Display', authoringHours: 2.0, description: 'B2B display solutions: specs, use cases' },
  { match: (path) => /\/business\/information-display\//.test(path), type: 'Business', subtype: 'Information Display', authoringHours: 2.0, description: 'B2B info display: specs, use cases' },
  { match: (path) => /\/business\/(supersign|procentric|connectedcare|signage|webos|createboard|extendedcare|business-cloud)/.test(path), type: 'Business', subtype: 'Business Software/Service', authoringHours: 1.5, description: 'B2B software: product description, features' },
  { match: (path) => /\/business\/(hotel|hospital|indoor-l|outdoor-l|led-|oled-|professional-|commercial-tv|thin-client|zero-client)/.test(path), type: 'Business', subtype: 'Business Product', authoringHours: 2.0, description: 'B2B product page: specs, images, use cases' },
  { match: (path) => /\/business\/(find-a-dealer|sitemap)/.test(path), type: 'Business', subtype: 'Business Utility', authoringHours: 0.5, description: 'B2B utility page: dealer locator or sitemap' },
  { match: (path) => /\/business\/air-solution/.test(path), type: 'Business', subtype: 'Business Air Solution', authoringHours: 2.0, description: 'B2B air solution: product details, use cases' },
  { match: (path) => /\/business\/probeam/.test(path), type: 'Business', subtype: 'Business Projector', authoringHours: 2.0, description: 'B2B projector: product details, use cases' },
  { match: (path) => /\/business/.test(path), type: 'Business', subtype: 'Business General', authoringHours: 1.75, description: 'B2B general page: product or solution content' },

  // TV/Soundbar product marketing pages
  { match: (path) => /\/tvs-soundbars\/tv-buying-guide\//.test(path), type: 'Product Marketing', subtype: 'TV Buying Guide', authoringHours: 2.0, description: 'Interactive buying guide: sections, comparisons, rich media' },
  { match: (path) => /\/tvs-soundbars\/why-lgoled\//.test(path), type: 'Product Marketing', subtype: 'OLED Brand Page', authoringHours: 2.5, description: 'Brand story: rich media, video, animations' },
  { match: (path) => /\/tvs-soundbars\/(oled-art|oled-innovation|ai-tv|lg-screen-vision|why-true-wireless|why-qned-evo)/.test(path), type: 'Product Marketing', subtype: 'TV Technology Page', authoringHours: 2.5, description: 'Technology showcase: rich media, interactive sections' },
  { match: (path) => /\/tvs-soundbars\/(2023|2022|webos|promotion|appletvplus|shahid|osn|yango|watch-it)/.test(path), type: 'Product Marketing', subtype: 'TV Campaign/Promo', authoringHours: 1.5, description: 'Seasonal/promo campaign page' },
  { match: (path) => /\/tvs-soundbars\/tv-buying-guide$/.test(path), type: 'Listing', subtype: 'TV Buying Guide Hub', authoringHours: 2.0, description: 'Guide hub: navigation, featured guides' },
  { match: (path) => /\/tvs-soundbars/.test(path), type: 'Product Marketing', subtype: 'TV/Soundbar General', authoringHours: 2.0, description: 'General TV/soundbar marketing page' },

  // TV technology sub-pages (legacy)
  { match: (path) => /\/tvs\/(oled|2022|ai-|alpha9|viewing-angle)/.test(path), type: 'Product Marketing', subtype: 'Legacy TV Tech Page', authoringHours: 1.5, description: 'Legacy TV technology/feature page' },
  { match: (path) => /\/oled-televisions\//.test(path), type: 'Product Marketing', subtype: 'OLED Sub-page', authoringHours: 2.0, description: 'OLED technology sub-page' },
  { match: (path) => /\/qned-tvs\//.test(path), type: 'Product Marketing', subtype: 'QNED Sub-page', authoringHours: 2.0, description: 'QNED technology sub-page' },
  { match: (path) => /\/televisions\//.test(path), type: 'Product Marketing', subtype: 'TV Sub-page', authoringHours: 2.0, description: 'TV technology/feature sub-page' },

  // Product category pages (PLPs)
  { match: (path) => /\/(oled-televisions|oled-televizory|televisions|televizory|led-lcd-|super-uhd|lifestyle-televisions|8k-televisions|ultra-large-televisions|smart-tvs|uhd-4k)$/.test(path), type: 'Product Listing', subtype: 'TV Category PLP', authoringHours: 0.5, description: 'Product listing - auto-generated, minimal authoring' },
  { match: (path) => /\/(washing-machines|dryers|refrigerators|microwaves|vacuum-cleaners|stylers|built-in-appliances)$/.test(path), type: 'Product Listing', subtype: 'Appliance Category PLP', authoringHours: 0.5, description: 'Product listing - auto-generated, minimal authoring' },
  { match: (path) => /\/(monitors|soundbars|projectors|bluetooth-speakers|computer-products|laptops|ergo-monitors|homeandoffice|ultragear|ultrawide|ultrafine|smart-monitors)/.test(path) && !/\//.test(path.split('/').pop().split('?')[0].replace(/^(monitors|soundbars|projectors|bluetooth-speakers)/, '')), type: 'Product Listing', subtype: 'IT/AV Category PLP', authoringHours: 0.5, description: 'Product listing - auto-generated, minimal authoring' },

  // Size-specific TV pages
  { match: (path) => /\/(55|65|75)-inch-tvs$/.test(path), type: 'Product Listing', subtype: 'TV Size PLP', authoringHours: 0.5, description: 'Size-filtered TV listing' },

  // Support pages
  { match: (path) => /\/support\/(warranty|fota|smart-share|video-tutorials|manuals|software-firmware|parts-accessories|product-help)/.test(path), type: 'Support', subtype: 'Support Resource', authoringHours: 0.75, description: 'Support resource page: links, instructions' },
  { match: (path) => /\/support\/(contact|chat-email|telephone|whatsapp|locate-repair|service-center|inquiry-status)/.test(path), type: 'Support', subtype: 'Support Contact', authoringHours: 0.75, description: 'Contact/service page: contact info, forms' },
  { match: (path) => /\/support\/svc_info\//.test(path), type: 'Support', subtype: 'Service Info', authoringHours: 0.5, description: 'Service circuit info page' },
  { match: (path) => /\/support\/repair-warranty\//.test(path), type: 'Support', subtype: 'Repair/Warranty', authoringHours: 0.75, description: 'Repair tracking, warranty info' },
  { match: (path) => /\/support\/business\//.test(path), type: 'Support', subtype: 'Business Support', authoringHours: 0.75, description: 'B2B support/service contracts' },
  { match: (path) => /\/support\/ref-customer-guide/.test(path), type: 'Support', subtype: 'Customer Guide', authoringHours: 0.75, description: 'Customer reference guide' },
  { match: (path) => /\/support\/web-survey/.test(path), type: 'Support', subtype: 'Survey', authoringHours: 0.5, description: 'Web survey page' },
  { match: (path) => /\/support$/.test(path), type: 'Support', subtype: 'Support Hub', authoringHours: 1.5, description: 'Support hub: search, categories, featured help' },

  // Air conditioning pages
  { match: (path) => /\/air-conditioning\//.test(path) || /\/air-conditioner\//.test(path), type: 'Product Marketing', subtype: 'AC Content Page', authoringHours: 1.5, description: 'AC guide/tips: informational content' },
  { match: (path) => /\/air-conditioning$/.test(path) || /\/air-conditioners-split-systems$/.test(path), type: 'Product Listing', subtype: 'AC PLP', authoringHours: 0.5, description: 'AC product listing' },

  // About/Corporate pages
  { match: (path) => /\/about-lg\/(our-brand|sustainability|press-media|press-contact|press-and-media|history|career|social-responsibility|survey)/.test(path), type: 'Corporate', subtype: 'About Sub-page', authoringHours: 1.5, description: 'Corporate content: text, images, links' },
  { match: (path) => /\/about-lg\/index$/.test(path.replace(/\/+$/, '')) || /\/about-lg$/.test(path), type: 'Corporate', subtype: 'About Hub', authoringHours: 2.0, description: 'About hub: overview, navigation to sections' },

  // Campaign/Landing pages
  { match: (path) => /\/lg-ai\//.test(path) || /\/lg-ai$/.test(path), type: 'Campaign', subtype: 'AI Landing Page', authoringHours: 2.5, description: 'AI technology showcase: rich media, videos, demos' },
  { match: (path) => /\/lg-ai-core-tech/.test(path), type: 'Campaign', subtype: 'AI Core Tech Page', authoringHours: 2.0, description: 'AI technology detail: features, use cases' },
  { match: (path) => /\/better-life/.test(path), type: 'Campaign', subtype: 'Better Life Campaign', authoringHours: 2.0, description: 'Lifestyle campaign: rich content, video' },
  { match: (path) => /\/lg-mood-up/.test(path), type: 'Campaign', subtype: 'MoodUp Campaign', authoringHours: 2.0, description: 'Product launch campaign: rich media' },
  { match: (path) => /\/lg-signature/.test(path), type: 'Campaign', subtype: 'LG Signature', authoringHours: 2.5, description: 'Premium brand microsite: luxury content, imagery' },
  { match: (path) => /\/lg-thinq/.test(path), type: 'Campaign', subtype: 'ThinQ Smart Home', authoringHours: 2.0, description: 'Smart home/IoT: app features, device management' },
  { match: (path) => /\/lg-objet-collection/.test(path), type: 'Campaign', subtype: 'Objet Collection', authoringHours: 2.0, description: 'Design-focused product line' },
  { match: (path) => /\/webos-smart-tv\//.test(path), type: 'Campaign', subtype: 'webOS Feature', authoringHours: 1.5, description: 'Smart TV platform feature page' },
  { match: (path) => /\/cinebeam/.test(path), type: 'Campaign', subtype: 'CinBeam Campaign', authoringHours: 2.0, description: 'Projector campaign: features, lifestyle' },
  { match: (path) => /\/Ultragear/.test(path) || /\/ultragear-gaming-oled/.test(path), type: 'Campaign', subtype: 'UltraGear Gaming', authoringHours: 2.0, description: 'Gaming brand page: esports, products' },
  { match: (path) => /\/probeam/.test(path) && !/\/business/.test(path), type: 'Campaign', subtype: 'ProBeam Campaign', authoringHours: 1.5, description: 'Business projector campaign' },
  { match: (path) => /\/healthy-home-solution/.test(path), type: 'Campaign', subtype: 'Health Campaign', authoringHours: 1.5, description: 'Health solution campaign page' },

  // Recipe pages (Russia)
  { match: (path) => /\/lgneochef\/cookbook-/.test(path), type: 'Content', subtype: 'Recipe', authoringHours: 0.75, description: 'Recipe page: ingredients, steps, images' },
  { match: (path) => /\/lgneochef\//.test(path) && !/\/cookbook-/.test(path), type: 'Content', subtype: 'NeoChef Content', authoringHours: 1.0, description: 'NeoChef product/recipe content' },
  { match: (path) => /\/recipes\//.test(path), type: 'Content', subtype: 'Recipe Collection', authoringHours: 1.0, description: 'Recipe collection page' },

  // CES event pages (Russia)
  { match: (path) => /\/ces20\d{2}/.test(path), type: 'Campaign', subtype: 'CES Event Page', authoringHours: 1.0, description: 'CES event page - may be outdated/archival' },

  // Promotion pages
  { match: (path) => /\/promotion-offers/.test(path) || /\/appliances\/promotion-offers/.test(path), type: 'Promotion', subtype: 'Promotion Landing', authoringHours: 1.25, description: 'Promotional offers page: deals, CTAs' },
  { match: (path) => /\/discount\//.test(path), type: 'Promotion', subtype: 'Discount Page', authoringHours: 1.0, description: 'Discount/offer page' },

  // Buying guides
  { match: (path) => /\/.*-buying-guide$/.test(path), type: 'Content', subtype: 'Buying Guide', authoringHours: 2.0, description: 'Product buying guide: comparisons, features' },

  // Product sub-pages for appliances
  { match: (path) => /\/washing-machines\//.test(path), type: 'Product Marketing', subtype: 'Washer Feature Page', authoringHours: 1.5, description: 'Washing machine feature/technology page' },
  { match: (path) => /\/vacuum-cleaners\//.test(path), type: 'Product Marketing', subtype: 'Vacuum Feature Page', authoringHours: 1.5, description: 'Vacuum cleaner feature page' },
  { match: (path) => /\/refrigerators\//.test(path), type: 'Product Marketing', subtype: 'Refrigerator Feature Page', authoringHours: 1.5, description: 'Refrigerator feature/technology page' },
  { match: (path) => /\/stylers\//.test(path), type: 'Product Marketing', subtype: 'Styler Feature Page', authoringHours: 1.5, description: 'Styler feature page' },
  { match: (path) => /\/built-in-appliances\//.test(path), type: 'Product Marketing', subtype: 'Built-in Feature Page', authoringHours: 1.5, description: 'Built-in appliance feature page' },
  { match: (path) => /\/home-appliances\//.test(path), type: 'Product Marketing', subtype: 'Home Appliance Feature', authoringHours: 1.5, description: 'Home appliance feature page' },

  // Monitor/IT sub-pages
  { match: (path) => /\/monitors\//.test(path), type: 'Product Marketing', subtype: 'Monitor Feature Page', authoringHours: 1.5, description: 'Monitor technology/feature page' },
  { match: (path) => /\/projectors\//.test(path), type: 'Product Marketing', subtype: 'Projector Feature Page', authoringHours: 1.5, description: 'Projector feature/technology page' },
  { match: (path) => /\/soundbars\//.test(path), type: 'Product Marketing', subtype: 'Soundbar Feature Page', authoringHours: 1.5, description: 'Soundbar feature page' },
  { match: (path) => /\/sound-bars\//.test(path), type: 'Product Marketing', subtype: 'Sound Bar Page', authoringHours: 1.5, description: 'Sound bar product page' },
  { match: (path) => /\/audio\//.test(path), type: 'Product Marketing', subtype: 'Audio Feature Page', authoringHours: 1.5, description: 'Audio product feature page' },

  // TV OLED sub-pages
  { match: (path) => /\/lgoled\//.test(path) || /\/lgnanocell\//.test(path), type: 'Product Marketing', subtype: 'TV Technology Sub-page', authoringHours: 1.5, description: 'TV technology showcase sub-page' },

  // Russia-specific
  { match: (path) => /\/virtualshowroom/.test(path), type: 'Campaign', subtype: 'Virtual Showroom', authoringHours: 3.0, description: 'Interactive virtual showroom - complex 3D content' },
  { match: (path) => /\/newyear/.test(path) || /\/happynewyear/.test(path) || /\/gift-wall/.test(path), type: 'Campaign', subtype: 'Seasonal Campaign', authoringHours: 1.0, description: 'Seasonal/holiday campaign page' },
  { match: (path) => /\/healthcare/.test(path), type: 'Campaign', subtype: 'Healthcare', authoringHours: 2.0, description: 'Healthcare solutions page' },
  { match: (path) => /\/welcome-to-lg-thinq/.test(path), type: 'Campaign', subtype: 'ThinQ Welcome', authoringHours: 1.5, description: 'ThinQ welcome/intro page' },
  { match: (path) => /\/shop/.test(path), type: 'System', subtype: 'Shop/E-commerce', authoringHours: 0.5, description: 'Shop page - links to external or auto-generated' },
  { match: (path) => /\/yandex-recomended-retailers/.test(path), type: 'Support', subtype: 'Retailer Page', authoringHours: 0.75, description: 'Retailer recommendation page' },
  { match: (path) => /\/mobile\/mc-announcement/.test(path), type: 'Content', subtype: 'Mobile Announcement', authoringHours: 0.5, description: 'Mobile division announcement' },
  { match: (path) => /\/technologies\//.test(path), type: 'Product Marketing', subtype: 'Technology Page', authoringHours: 1.5, description: 'Technology overview page' },
  { match: (path) => /\/lggramstore\//.test(path) || /\/lg-travel\//.test(path), type: 'Campaign', subtype: 'Store/Promo Page', authoringHours: 1.5, description: 'Product store or promotional page' },

  // Homepage / brandshop
  { match: (path) => /\/brandshop$/.test(path), type: 'Campaign', subtype: 'Brandshop', authoringHours: 2.0, description: 'Brand shop landing page' },

  // Misc product pages
  { match: (path) => /\/home-appliances$/.test(path) || /\/tv-audio-video$/.test(path) || /\/audio$/.test(path), type: 'Product Listing', subtype: 'Category Hub', authoringHours: 0.5, description: 'Product category hub' },
  { match: (path) => /\/it-products$/.test(path), type: 'Product Listing', subtype: 'IT Products Hub', authoringHours: 0.5, description: 'IT products hub' },

  // Legacy TV pages without sub-path (e.g., /ru/ai-2019, /ru/nanocell-tvs)
  { match: (path) => /\/(ai-\d{4}|nanocell-tvs)/.test(path), type: 'Product Marketing', subtype: 'Legacy TV Page', authoringHours: 1.5, description: 'Legacy TV technology page' },

  // Arabic lg-story variant (ae_ar uses lg-story-ar path)
  { match: (path) => /\/lg-story-ar\//.test(path), type: 'Content', subtype: 'News Article', authoringHours: 1.0, description: 'Arabic news/story article' },

  // Additional RU product categories
  { match: (path) => /\/air-purifiers-humidifiers/.test(path), type: 'Product Listing', subtype: 'Air Purifier PLP', authoringHours: 0.5, description: 'Air purifier product listing' },
  { match: (path) => /\/built-in-appliances-microwaves/.test(path), type: 'Product Listing', subtype: 'Built-in Microwave PLP', authoringHours: 0.5, description: 'Built-in microwave product listing' },
  { match: (path) => /\/led-lcd-televisions/.test(path), type: 'Product Listing', subtype: 'TV Category PLP', authoringHours: 0.5, description: 'LED/LCD TV product listing' },
  { match: (path) => /\/mini-systems-xboom/.test(path), type: 'Product Listing', subtype: 'Audio PLP', authoringHours: 0.5, description: 'Mini system/XBOOM product listing' },
  { match: (path) => /\/super-uhd-4k-televisions\//.test(path), type: 'Product Marketing', subtype: 'UHD TV Sub-page', authoringHours: 1.5, description: 'UHD TV technology/feature sub-page' },
  { match: (path) => /\/(super-uhd-4k-televisions|uhd-4k-televisions|qned-tvs)$/.test(path), type: 'Product Listing', subtype: 'TV Category PLP', authoringHours: 0.5, description: 'TV category product listing' },
  { match: (path) => /\/vacuum-cleaners-cordless/.test(path), type: 'Product Marketing', subtype: 'Vacuum Feature Page', authoringHours: 1.5, description: 'Cordless vacuum feature page' },

  // Catch-all with query parameters (PLP variants)
  { match: (path) => /\?/.test(path), type: 'Product Listing', subtype: 'Filtered PLP', authoringHours: 0.25, description: 'Filtered product listing - auto-generated' },
];

function classifyUrl(url) {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname + (urlObj.search || '');

    for (const rule of classificationRules) {
      if (rule.match(path)) {
        return { ...rule, match: undefined };
      }
    }

    // Default fallback
    return {
      type: 'Other',
      subtype: 'Unclassified',
      authoringHours: 1.5,
      description: 'Unclassified page - estimated average authoring effort'
    };
  } catch (e) {
    return {
      type: 'Error',
      subtype: 'Invalid URL',
      authoringHours: 0,
      description: 'Could not parse URL'
    };
  }
}

// ============================================
// AUTHORING EFFORT COMPONENTS
// ============================================
// Each page's total authoring effort includes:
// 1. Content entry (text, headings, formatting)
// 2. Image preparation (download, resize, alt text, upload to DAM)
// 3. Link verification (internal + external links)
// 4. Metadata entry (title, description, OG tags, keywords)
// 5. Block configuration (setting up block parameters)
// 6. QA review (preview check, mobile check, content accuracy)

// Locale multipliers
const localeMultipliers = {
  'AE': { multiplier: 1.0, reason: 'English - base locale, pilot country' },
  'AE_AR': { multiplier: 1.3, reason: 'Arabic - RTL layout verification, Arabic typography checks, bidirectional content review' },
  'RU': { multiplier: 1.1, reason: 'Russian - Cyrillic font verification, text overflow checks, locale-specific content adaptation' },
};

// ============================================
// PROCESS ALL URLS
// ============================================

function processLocale(urls, localeName) {
  const results = [];
  const multiplier = localeMultipliers[localeName].multiplier;

  for (const url of urls) {
    const classification = classifyUrl(url);
    const baseHours = classification.authoringHours;
    const adjustedHours = Math.round(baseHours * multiplier * 100) / 100;

    results.push({
      url,
      locale: localeName,
      type: classification.type,
      subtype: classification.subtype,
      baseAuthoringHours: baseHours,
      localeMultiplier: multiplier,
      totalAuthoringHours: adjustedHours,
      description: classification.description,
    });
  }

  return results;
}

const aeResults = processLocale(aeUrls, 'AE');
const aeArResults = processLocale(aeArUrls, 'AE_AR');
const ruResults = processLocale(ruUrls, 'RU');
const allResults = [...aeResults, ...aeArResults, ...ruResults];

// ============================================
// GENERATE SUMMARY STATISTICS
// ============================================

function generateSummary(results, localeName) {
  const byType = {};
  let totalPages = 0;
  let totalHours = 0;

  for (const r of results) {
    const key = `${r.type} > ${r.subtype}`;
    if (!byType[key]) {
      byType[key] = { type: r.type, subtype: r.subtype, count: 0, totalHours: 0, baseHoursPerPage: r.baseAuthoringHours };
    }
    byType[key].count++;
    byType[key].totalHours += r.totalAuthoringHours;
    totalPages++;
    totalHours += r.totalAuthoringHours;
  }

  return { byType, totalPages, totalHours: Math.round(totalHours * 100) / 100 };
}

const aeSummary = generateSummary(aeResults, 'AE');
const aeArSummary = generateSummary(aeArResults, 'AE_AR');
const ruSummary = generateSummary(ruResults, 'RU');

// ============================================
// GENERATE XLSX
// ============================================

const wb = XLSX.utils.book_new();

// --- TAB 1: AUTHORING SUMMARY ---
const summaryRows = [
  ['AUTHORING EFFORT ESTIMATION - LG EDS MIGRATION', '', '', '', '', '', ''],
  ['Generated: ' + new Date().toISOString().split('T')[0], '', '', '', '', '', ''],
  [],
  ['OVERVIEW', '', '', '', '', '', ''],
  ['Locale', 'Total Pages', 'Total Authoring Hours', 'Locale Multiplier', 'Person-Days (8hr)', 'Person-Weeks (40hr)', 'Person-Months (160hr)'],
  ['AE (English)', aeSummary.totalPages, aeSummary.totalHours, '1.0x', (aeSummary.totalHours/8).toFixed(1), (aeSummary.totalHours/40).toFixed(1), (aeSummary.totalHours/160).toFixed(1)],
  ['AE_AR (Arabic)', aeArSummary.totalPages, aeArSummary.totalHours, '1.3x (RTL)', (aeArSummary.totalHours/8).toFixed(1), (aeArSummary.totalHours/40).toFixed(1), (aeArSummary.totalHours/160).toFixed(1)],
  ['RU (Russian)', ruSummary.totalPages, ruSummary.totalHours, '1.1x (Cyrillic)', (ruSummary.totalHours/8).toFixed(1), (ruSummary.totalHours/40).toFixed(1), (ruSummary.totalHours/160).toFixed(1)],
  [],
  ['GRAND TOTAL', aeSummary.totalPages + aeArSummary.totalPages + ruSummary.totalPages,
   Math.round((aeSummary.totalHours + aeArSummary.totalHours + ruSummary.totalHours) * 100) / 100, '',
   ((aeSummary.totalHours + aeArSummary.totalHours + ruSummary.totalHours)/8).toFixed(1),
   ((aeSummary.totalHours + aeArSummary.totalHours + ruSummary.totalHours)/40).toFixed(1),
   ((aeSummary.totalHours + aeArSummary.totalHours + ruSummary.totalHours)/160).toFixed(1)],
  [],
  ['WITH QA REVIEW (20% overhead)', '',
   Math.round((aeSummary.totalHours + aeArSummary.totalHours + ruSummary.totalHours) * 1.2 * 100) / 100, '',
   ((aeSummary.totalHours + aeArSummary.totalHours + ruSummary.totalHours)*1.2/8).toFixed(1),
   ((aeSummary.totalHours + aeArSummary.totalHours + ruSummary.totalHours)*1.2/40).toFixed(1),
   ((aeSummary.totalHours + aeArSummary.totalHours + ruSummary.totalHours)*1.2/160).toFixed(1)],
  ['WITH CONTINGENCY (+10%)', '',
   Math.round((aeSummary.totalHours + aeArSummary.totalHours + ruSummary.totalHours) * 1.32 * 100) / 100, '',
   ((aeSummary.totalHours + aeArSummary.totalHours + ruSummary.totalHours)*1.32/8).toFixed(1),
   ((aeSummary.totalHours + aeArSummary.totalHours + ruSummary.totalHours)*1.32/40).toFixed(1),
   ((aeSummary.totalHours + aeArSummary.totalHours + ruSummary.totalHours)*1.32/160).toFixed(1)],
  [],
  [],
  ['BREAKDOWN BY PAGE TYPE', '', '', '', '', '', ''],
];

// Add type breakdown for each locale
function addTypeBreakdown(summary, localeName, rows) {
  rows.push([`${localeName} - Page Type Breakdown`, 'Count', 'Hrs/Page (base)', 'Total Hours', '', '', '']);

  const sorted = Object.values(summary.byType).sort((a, b) => b.totalHours - a.totalHours);
  for (const entry of sorted) {
    rows.push([`  ${entry.type} > ${entry.subtype}`, entry.count, entry.baseHoursPerPage, Math.round(entry.totalHours * 100) / 100, '', '', '']);
  }
  rows.push([`  SUBTOTAL`, summary.totalPages, '', summary.totalHours, '', '', '']);
  rows.push([]);
}

addTypeBreakdown(aeSummary, 'AE (English)', summaryRows);
addTypeBreakdown(aeArSummary, 'AE_AR (Arabic)', summaryRows);
addTypeBreakdown(ruSummary, 'RU (Russian)', summaryRows);

// Assumptions
summaryRows.push([]);
summaryRows.push(['ASSUMPTIONS & METHODOLOGY', '', '', '', '', '', '']);
summaryRows.push(['1. Authoring hours include: content entry, image preparation, link verification, metadata entry, block configuration, and basic preview QA', '', '', '', '', '', '']);
summaryRows.push(['2. Arabic (AE_AR) multiplier (1.3x) accounts for RTL layout verification, bidirectional text issues, and Arabic typography checks', '', '', '', '', '', '']);
summaryRows.push(['3. Russian (RU) multiplier (1.1x) accounts for Cyrillic font verification, text overflow checks, and locale-specific content', '', '', '', '', '', '']);
summaryRows.push(['4. Product Listing Pages (PLPs) have minimal authoring effort as they are largely auto-generated from product data feeds', '', '', '', '', '', '']);
summaryRows.push(['5. Story/Article pages assume content is copied from source site with formatting adjustments', '', '', '', '', '', '']);
summaryRows.push(['6. System/Include pages assume auto-generation or one-time setup', '', '', '', '', '', '']);
summaryRows.push(['7. QA review overhead (20%) covers content accuracy verification, cross-device preview checks, and link validation', '', '', '', '', '', '']);
summaryRows.push(['8. Contingency (10%) covers unexpected formatting issues, missing content, and rework', '', '', '', '', '', '']);
summaryRows.push(['9. Does NOT include content translation - assumes content is provided in the target language', '', '', '', '', '', '']);
summaryRows.push(['10. Does NOT include image creation/editing - assumes images are available from source site', '', '', '', '', '', '']);
summaryRows.push(['11. Estimates assume trained content authors familiar with AEM EDS authoring interface', '', '', '', '', '', '']);
summaryRows.push(['12. Test/test pages (sm-test/*) are excluded with 0 hours as they will not be migrated', '', '', '', '', '', '']);

const summaryWs = XLSX.utils.aoa_to_sheet(summaryRows);
summaryWs['!cols'] = [
  { wch: 55 }, { wch: 15 }, { wch: 22 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 18 },
];
XLSX.utils.book_append_sheet(wb, summaryWs, 'Authoring Summary');

// --- TAB 2, 3, 4: DETAILED URL LISTS PER LOCALE ---
function createDetailSheet(results, sheetName) {
  const rows = [
    ['Page URL', 'Page Type', 'Sub-type', 'Base Hours', 'Locale Multiplier', 'Authoring Hours', 'Description'],
  ];

  // Sort by type, then subtype, then URL
  const sorted = [...results].sort((a, b) => {
    if (a.type !== b.type) return a.type.localeCompare(b.type);
    if (a.subtype !== b.subtype) return a.subtype.localeCompare(b.subtype);
    return a.url.localeCompare(b.url);
  });

  let currentType = '';
  for (const r of sorted) {
    if (r.type !== currentType) {
      currentType = r.type;
      rows.push([`--- ${r.type.toUpperCase()} ---`, '', '', '', '', '', '']);
    }
    rows.push([r.url, r.type, r.subtype, r.baseAuthoringHours, r.localeMultiplier, r.totalAuthoringHours, r.description]);
  }

  // Totals
  const totalHours = results.reduce((sum, r) => sum + r.totalAuthoringHours, 0);
  rows.push([]);
  rows.push(['TOTAL', '', '', '', '', Math.round(totalHours * 100) / 100, `${results.length} pages`]);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [
    { wch: 85 }, { wch: 20 }, { wch: 30 }, { wch: 12 }, { wch: 16 }, { wch: 16 }, { wch: 55 },
  ];
  return ws;
}

XLSX.utils.book_append_sheet(wb, createDetailSheet(aeResults, 'AE Detail'), 'AE (English) Detail');
XLSX.utils.book_append_sheet(wb, createDetailSheet(aeArResults, 'AE_AR Detail'), 'AE_AR (Arabic) Detail');
XLSX.utils.book_append_sheet(wb, createDetailSheet(ruResults, 'RU Detail'), 'RU (Russian) Detail');

// --- TAB 5: COMBINED DEV + AUTHORING SUMMARY ---
// Read existing estimates to create combined view
const combinedRows = [
  ['COMBINED ESTIMATION: DEVELOPMENT + AUTHORING', '', '', '', '', '', ''],
  ['Generated: ' + new Date().toISOString().split('T')[0], '', '', '', '', '', ''],
  [],
  ['EFFORT TYPE', 'Hours', 'Person-Days', 'Person-Weeks', 'Person-Months', '', ''],
  [],
  ['--- DEVELOPMENT & QA (from prior estimate) ---', '', '', '', '', '', ''],
  ['Global Implementation (UAE Pilot) - Dev', 1960, (1960/8).toFixed(1), (1960/40).toFixed(1), (1960/160).toFixed(1), '', ''],
  ['Global Implementation (UAE Pilot) - QA', 490, (490/8).toFixed(1), (490/40).toFixed(1), (490/160).toFixed(1), '', ''],
  ['Global PM Overhead (15%)', 368, (368/8).toFixed(1), (368/40).toFixed(1), (368/160).toFixed(1), '', ''],
  ['Global Contingency (10%)', 245, (245/8).toFixed(1), (245/40).toFixed(1), (245/160).toFixed(1), '', ''],
  ['Global Subtotal', 3558, (3558/8).toFixed(1), (3558/40).toFixed(1), (3558/160).toFixed(1), '', ''],
  [],
  ['Country Implementation (Russia) - Dev', 372, (372/8).toFixed(1), (372/40).toFixed(1), (372/160).toFixed(1), '', ''],
  ['Country Implementation (Russia) - QA', 225, (225/8).toFixed(1), (225/40).toFixed(1), (225/160).toFixed(1), '', ''],
  ['Country PM Overhead (15%)', 90, (90/8).toFixed(1), (90/40).toFixed(1), (90/160).toFixed(1), '', ''],
  ['Country Contingency (10%)', 60, (60/8).toFixed(1), (60/40).toFixed(1), (60/160).toFixed(1), '', ''],
  ['Country Subtotal', 747, (747/8).toFixed(1), (747/40).toFixed(1), (747/160).toFixed(1), '', ''],
  [],
  ['DEVELOPMENT & QA TOTAL', 4305, (4305/8).toFixed(1), (4305/40).toFixed(1), (4305/160).toFixed(1), '', ''],
  [],
  ['--- CONTENT AUTHORING ---', '', '', '', '', '', ''],
];

const totalAuthoringBase = Math.round((aeSummary.totalHours + aeArSummary.totalHours + ruSummary.totalHours) * 100) / 100;
const totalAuthoringWithQA = Math.round(totalAuthoringBase * 1.2 * 100) / 100;
const totalAuthoringFull = Math.round(totalAuthoringBase * 1.32 * 100) / 100;

combinedRows.push(['AE (English) - ' + aeSummary.totalPages + ' pages', aeSummary.totalHours, (aeSummary.totalHours/8).toFixed(1), (aeSummary.totalHours/40).toFixed(1), (aeSummary.totalHours/160).toFixed(1), '', '']);
combinedRows.push(['AE_AR (Arabic) - ' + aeArSummary.totalPages + ' pages', aeArSummary.totalHours, (aeArSummary.totalHours/8).toFixed(1), (aeArSummary.totalHours/40).toFixed(1), (aeArSummary.totalHours/160).toFixed(1), '', '']);
combinedRows.push(['RU (Russian) - ' + ruSummary.totalPages + ' pages', ruSummary.totalHours, (ruSummary.totalHours/8).toFixed(1), (ruSummary.totalHours/40).toFixed(1), (ruSummary.totalHours/160).toFixed(1), '', '']);
combinedRows.push(['Authoring QA Review (20%)', Math.round(totalAuthoringBase * 0.2 * 100) / 100, '', '', '', '', '']);
combinedRows.push(['Authoring Contingency (10%)', Math.round(totalAuthoringBase * 0.12 * 100) / 100, '', '', '', '', '']);
combinedRows.push(['CONTENT AUTHORING TOTAL', totalAuthoringFull, (totalAuthoringFull/8).toFixed(1), (totalAuthoringFull/40).toFixed(1), (totalAuthoringFull/160).toFixed(1), '', '']);
combinedRows.push([]);
combinedRows.push([]);
combinedRows.push(['=== GRAND TOTAL (DEV + QA + AUTHORING) ===', '', '', '', '', '', '']);
const grandTotal = 4305 + totalAuthoringFull;
combinedRows.push(['ALL EFFORTS COMBINED', Math.round(grandTotal), (grandTotal/8).toFixed(1), (grandTotal/40).toFixed(1), (grandTotal/160).toFixed(1), '', '']);
combinedRows.push([]);
combinedRows.push(['Note: Development hours from previous estimate (Global + Country Russia implementation)', '', '', '', '', '', '']);
combinedRows.push(['Note: For AE_AR authoring, content is Arabic translation of AE English pages - RTL review required', '', '', '', '', '', '']);

const combinedWs = XLSX.utils.aoa_to_sheet(combinedRows);
combinedWs['!cols'] = [
  { wch: 55 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 12 },
];
XLSX.utils.book_append_sheet(wb, combinedWs, 'Combined Summary');

// Reorder sheets: Combined Summary first
wb.SheetNames = ['Combined Summary', 'Authoring Summary', 'AE (English) Detail', 'AE_AR (Arabic) Detail', 'RU (Russian) Detail'];

// Write file
XLSX.writeFile(wb, '/workspace/eds_authoring_estimates.xlsx');

// ============================================
// CONSOLE OUTPUT
// ============================================
console.log('=== AUTHORING EFFORT ESTIMATION ===\n');
console.log(`AE (English):  ${aeSummary.totalPages} pages → ${aeSummary.totalHours} hours (${(aeSummary.totalHours/160).toFixed(1)} person-months)`);
console.log(`AE_AR (Arabic): ${aeArSummary.totalPages} pages → ${aeArSummary.totalHours} hours (${(aeArSummary.totalHours/160).toFixed(1)} person-months)`);
console.log(`RU (Russian):   ${ruSummary.totalPages} pages → ${ruSummary.totalHours} hours (${(ruSummary.totalHours/160).toFixed(1)} person-months)`);
console.log(`\nBase Total: ${totalAuthoringBase} hours`);
console.log(`With QA (20%): ${totalAuthoringWithQA} hours`);
console.log(`With Contingency (+10%): ${totalAuthoringFull} hours (${(totalAuthoringFull/160).toFixed(1)} person-months)`);
console.log(`\n=== COMBINED (DEV + AUTHORING) ===`);
console.log(`Development & QA: 4,305 hours (26.9 person-months)`);
console.log(`Content Authoring: ${totalAuthoringFull} hours (${(totalAuthoringFull/160).toFixed(1)} person-months)`);
console.log(`GRAND TOTAL: ${Math.round(grandTotal)} hours (${(grandTotal/160).toFixed(1)} person-months)`);

console.log('\n\nFile generated: /workspace/eds_authoring_estimates.xlsx');

// Print top categories
console.log('\n=== TOP PAGE CATEGORIES BY HOURS ===');
const allByType = {};
for (const r of allResults) {
  const key = `${r.type} > ${r.subtype}`;
  if (!allByType[key]) allByType[key] = { count: 0, hours: 0 };
  allByType[key].count++;
  allByType[key].hours += r.totalAuthoringHours;
}
const topCategories = Object.entries(allByType)
  .sort((a, b) => b[1].hours - a[1].hours)
  .slice(0, 15);

for (const [name, data] of topCategories) {
  console.log(`  ${name}: ${data.count} pages, ${Math.round(data.hours * 100) / 100} hours`);
}
