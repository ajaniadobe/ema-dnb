/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroHomeParser from './parsers/hero-home.js';
import columnsMediaParser from './parsers/columns-media.js';
import cardsHighlightParser from './parsers/cards-highlight.js';
import cardsSolutionsParser from './parsers/cards-solutions.js';
import cardsCalloutParser from './parsers/cards-callout.js';
import carouselStoriesParser from './parsers/carousel-stories.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/dnb-cleanup.js';
import sectionsTransformer from './transformers/dnb-sections.js';
import dmImagesTransformer from './transformers/dnb-dm-images.js';

// The lead-capture form lives in a reusable fragment
// (/fragments/schedule-a-strategy-session). On the homepage the form section is
// replaced by a fragment block that includes it, rather than an inline form.
const FORM_FRAGMENT_PATH = '/fragments/schedule-a-strategy-session';

function formFragmentParser(element, { document }) {
  // Two form instances are mapped: the section wrapper and the bare React
  // <form> shell. Only the section becomes the fragment block; the empty
  // shell (and any already-processed node) is simply unwrapped/removed.
  if (element.tagName !== 'SECTION') {
    element.replaceWith(...element.childNodes);
    return;
  }
  const link = document.createElement('a');
  link.href = FORM_FRAGMENT_PATH;
  link.textContent = FORM_FRAGMENT_PATH;
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'fragment',
    cells: [[link]],
  });
  element.replaceWith(block);
}

// PARSER REGISTRY
const parsers = {
  'hero-home': heroHomeParser,
  'columns-media': columnsMediaParser,
  'cards-highlight': cardsHighlightParser,
  'cards-solutions': cardsSolutionsParser,
  'cards-callout': cardsCalloutParser,
  'carousel-stories': carouselStoriesParser,
  form: formFragmentParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Dun & Bradstreet homepage with hero, AI context (text+image + highlight card), solutions card grid, D-U-N-S callout, customer stories carousel, and lead-capture form.',
  urls: [
    'https://www.dnb.com/en-us/',
  ],
  blocks: [
    { name: 'hero-home', instances: ["section[class*='hero-home_container']"] },
    {
      name: 'columns-media',
      instances: [
        "[class*='text-list-image-card_textContainer']",
        "[class*='text-list-image-card_imageContainer']",
      ],
    },
    { name: 'cards-highlight', instances: ["[class*='text-list-image-card_cardContainer']"] },
    { name: 'cards-solutions', instances: ["#product [class*='product-card-grid_cardsContainer']"] },
    { name: 'cards-callout', instances: ["section[class*='product-card-grid-two-up_container']"], section: 'dark' },
    { name: 'carousel-stories', instances: ["section[class*='insight-card-carousel_container']"], section: 'dark' },
    {
      name: 'form',
      instances: [
        "#form form[class*='contact-form_formContainer']",
        "#form > section[class*='contact-form_container']",
      ],
    },
  ],
  sections: [
    {
      id: 'section-1-hero',
      name: 'Hero',
      selector: ["section[class*='hero-home_container']"],
      style: null,
      blocks: ['hero-home'],
      defaultContent: [],
    },
    {
      id: 'section-2-ai-context',
      name: 'AI Context',
      selector: ["section[class*='text-list-image-card_container']"],
      style: null,
      blocks: ['columns-media', 'cards-highlight'],
      defaultContent: [],
    },
    {
      id: 'section-3-solutions',
      name: 'Solutions Card Grid',
      selector: ['#product'],
      style: null,
      blocks: ['cards-solutions'],
      defaultContent: [
        "#product [class*='product-card-grid_eyebrow']",
        '#product h2',
        "#product [class*='product-card-grid_description']",
      ],
    },
    {
      id: 'section-4-duns-callout',
      name: 'D-U-N-S Number Callout',
      selector: ["section[class*='product-card-grid-two-up_container']"],
      style: 'dark',
      blocks: ['cards-callout'],
      defaultContent: [],
    },
    {
      id: 'section-5-customer-stories',
      name: 'Customer Stories Carousel',
      selector: ["section[class*='insight-card-carousel_container']"],
      style: 'dark',
      blocks: ['carousel-stories'],
      defaultContent: [],
    },
    {
      id: 'section-6-lead-form',
      name: 'Lead-Capture Form',
      selector: ["#form > section[class*='contact-form_container']"],
      style: null,
      blocks: ['form'],
      defaultContent: ["#form [class*='contact-form_plainTextContainer']"],
    },
  ],
};

// TRANSFORMER REGISTRY
// cleanup runs first (both hooks). sections + dm-images run afterTransform:
// sections inserts <hr>/section-metadata; dm-images runs last so it rewrites
// DM <img> into anchors after parsers have placed them into block cells.
const transformers = [
  cleanupTransformer,
  sectionsTransformer,
  dmImagesTransformer,
];

/**
 * Execute all page transformers for a specific hook.
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
 * Find all blocks on the page based on the embedded template configuration.
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
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block; skip elements already replaced by a prior parser
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
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

    // 4. afterTransform (final cleanup + section breaks/metadata + DM image rewrite)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
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
