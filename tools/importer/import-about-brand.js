/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsFeatureParser from './parsers/cards-feature.js';
import columnsMediaParser from './parsers/columns-media.js';
import columnsInfoParser from './parsers/columns-info.js';
import carouselTimelineParser from './parsers/carousel-timeline.js';
import cardsExecutiveParser from './parsers/cards-executive.js';
import cardsDownloadParser from './parsers/cards-download.js';
import cardsBannerParser from './parsers/cards-banner.js';

// TRANSFORMER IMPORTS
import lgCleanupTransformer from './transformers/lg-cleanup.js';
import lgSectionsTransformer from './transformers/lg-sections.js';

// PARSER REGISTRY
const parsers = {
  'cards-feature': cardsFeatureParser,
  'columns-media': columnsMediaParser,
  'columns-info': columnsInfoParser,
  'carousel-timeline': carouselTimelineParser,
  'cards-executive': cardsExecutiveParser,
  'cards-download': cardsDownloadParser,
  'cards-banner': cardsBannerParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'about-brand',
  description: 'LG UAE About - Our Brand page showcasing company brand story, values, and identity',
  urls: [
    'https://www.lg.com/ae/about-lg/our-brand/index'
  ],
  blocks: [
    {
      name: 'cards-feature',
      instances: ['.component.GPC0067.img4']
    },
    {
      name: 'columns-media',
      instances: ['.component.GPC0062 .half-type', 'ul.unit-box-list.jeong-do-desc:first-of-type']
    },
    {
      name: 'columns-info',
      instances: ['.component.GPC0067:has(.size-companyinfobox)', 'ul.jeong-do-desc.border-top', 'div.global-operations', '.component.GPC0069:has(.img-lt-lg)']
    },
    {
      name: 'carousel-timeline',
      instances: ['.history-slide']
    },
    {
      name: 'cards-executive',
      instances: ['.executive-list']
    },
    {
      name: 'cards-download',
      instances: ['.symbol-list']
    },
    {
      name: 'cards-banner',
      instances: ['.component.GPC0062 > ul.unit-list:has(h3)']
    }
  ],
  sections: [
    {
      id: 's1',
      name: 'Page Hero',
      selector: '.component.GPC0054:has(h1)',
      style: null,
      blocks: [],
      defaultContent: ['.component.GPC0054:has(h1) h1', '.component.GPC0054:has(h1) p']
    },
    {
      id: 's2',
      name: 'Anchor Navigation',
      selector: '.component.GPC0117',
      style: null,
      blocks: [],
      defaultContent: ['.component.GPC0117 a.tab']
    },
    {
      id: 's3',
      name: 'Overview',
      selector: '#overview',
      style: null,
      blocks: [],
      defaultContent: ['#overview .heading-box .title', '#overview .head-copy', '#overview .body-copy']
    },
    {
      id: 's4',
      name: 'Business Divisions',
      selector: '.component.GPC0067.img4',
      style: null,
      blocks: ['cards-feature'],
      defaultContent: []
    },
    {
      id: 's5',
      name: 'Brand Film CTA',
      selector: '.component.GPC0062:has(.half-type)',
      style: null,
      blocks: ['columns-media'],
      defaultContent: []
    },
    {
      id: 's6',
      name: 'Company Information',
      selector: '.component.GPC0067:has(.size-companyinfobox)',
      style: null,
      blocks: ['columns-info'],
      defaultContent: []
    },
    {
      id: 's7',
      name: 'History',
      selector: ['#history', '.history-slide'],
      style: null,
      blocks: ['carousel-timeline'],
      defaultContent: ['#history .heading-box .title', '#history .head-copy', '#history .body-copy']
    },
    {
      id: 's8',
      name: 'Jeong-Do Management',
      selector: ['#jeongdo-management', ".component.GPC0069:has(h2:contains('LG Way'))"],
      style: null,
      blocks: [],
      defaultContent: ['#jeongdo-management .heading-box .title', '#jeongdo-management .head-copy', '.component.GPC0069 h2', '.component.GPC0069 .text']
    },
    {
      id: 's9',
      name: 'Jeong-Do Vision',
      selector: 'ul.unit-box-list.jeong-do-desc:first-of-type',
      style: null,
      blocks: ['columns-media'],
      defaultContent: []
    },
    {
      id: 's10',
      name: 'Code of Ethics and Compliance',
      selector: 'ul.jeong-do-desc.border-top',
      style: null,
      blocks: ['columns-info'],
      defaultContent: []
    },
    {
      id: 's11',
      name: 'Executives',
      selector: ['#executives', '.executive-list'],
      style: null,
      blocks: ['cards-executive'],
      defaultContent: ['#executives .heading-box .title', '#executives .head-copy']
    },
    {
      id: 's12',
      name: 'Global Operations',
      selector: '#global-operations',
      style: null,
      blocks: ['columns-info'],
      defaultContent: ['#global-operations .heading-box .title', '#global-operations .head-copy']
    },
    {
      id: 's13',
      name: 'Brand Identity',
      selector: '#brand-identity',
      style: null,
      blocks: [],
      defaultContent: ['#brand-identity .heading-box .title h2', '#brand-identity .head-copy', '#brand-identity .body-copy']
    },
    {
      id: 's14',
      name: 'Logo Symbol Detail',
      selector: '.component.GPC0069:has(.img-lt-lg)',
      style: null,
      blocks: ['columns-info'],
      defaultContent: []
    },
    {
      id: 's15',
      name: 'Logo Description',
      selector: ".component.GPC0069:has(.txt:contains('The letters'))",
      style: null,
      blocks: [],
      defaultContent: ['.component.GPC0069 .txt p']
    },
    {
      id: 's16',
      name: 'Logo Downloads',
      selector: '.symbol-list',
      style: null,
      blocks: ['cards-download'],
      defaultContent: []
    },
    {
      id: 's17',
      name: 'Global Links Banner',
      selector: '.component.GPC0062:has(ul.unit-list h3)',
      style: 'dark',
      blocks: ['cards-banner'],
      defaultContent: []
    }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  lgCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [lgSectionsTransformer] : []),
];

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
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null,
          });
        });
      } catch (e) {
        // Handle selectors with :has() or :contains() that may not be supported
        console.warn(`Selector not supported: ${selector} for block ${blockDef.name}`);
      }
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
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

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '').replace(/\/index$/, '')
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
