/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import heroPromoParser from './parsers/hero-promo.js';
import cardsResourceParser from './parsers/cards-resource.js';

// TRANSFORMER IMPORTS
import lgCleanupTransformer from './transformers/lg-cleanup.js';
import lgSectionsTransformer from './transformers/lg-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero': heroParser,
  'hero-promo': heroPromoParser,
  'cards-resource': cardsResourceParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  lgCleanupTransformer,
  lgSectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'business-commercial-laundry',
  description: 'LG UAE B2B commercial laundry category page showcasing commercial washing machines and dryers for business customers',
  urls: [
    'https://www.lg.com/ae/business/commercial-laundry',
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['.component.GPC0078'],
    },
    {
      name: 'hero-promo',
      instances: [
        '#iw_comp1587097986691 .component.GPC0055',
        '#iw_comp1587097986754 .component.GPC0055',
        '#iw_comp1587097986768 .component.GPC0055',
        '#iw_comp1587097986790 .component.GPC0055',
      ],
    },
    {
      name: 'cards-resource',
      instances: ['.component.GPC0059.type-triple'],
    },
  ],
  sections: [
    {
      id: 's1',
      name: 'Page Title',
      selector: '.component.GPC0054',
      style: null,
      blocks: [],
      defaultContent: ['.component.GPC0054 h1', '.component.GPC0054 .copy'],
    },
    {
      id: 's2',
      name: 'Hero Banner',
      selector: '.component.GPC0078',
      style: null,
      blocks: ['hero'],
      defaultContent: [],
    },
    {
      id: 's3',
      name: 'Product Feature - Titan-C',
      selector: '#iw_comp1587097986691 .component.GPC0055',
      style: null,
      blocks: ['hero-promo'],
      defaultContent: [],
    },
    {
      id: 's4',
      name: 'Product Feature - Giant-C+',
      selector: '#iw_comp1587097986754 .component.GPC0055',
      style: null,
      blocks: ['hero-promo'],
      defaultContent: [],
    },
    {
      id: 's5',
      name: 'Product Feature - Atom',
      selector: '#iw_comp1587097986768 .component.GPC0055',
      style: null,
      blocks: ['hero-promo'],
      defaultContent: [],
    },
    {
      id: 's6',
      name: 'Resource Cards',
      selector: '.component.GPC0059.type-triple',
      style: null,
      blocks: ['cards-resource'],
      defaultContent: [],
    },
    {
      id: 's7',
      name: 'Contact CTA Banner',
      selector: '#iw_comp1587097986790 .component.GPC0055',
      style: null,
      blocks: ['hero-promo'],
      defaultContent: [],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
