/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-home.js
  function parse(element, { document }) {
    const image = element.querySelector('[class*="imageContainer"] img, [class*="imageMask"] img, img');
    const heading = element.querySelector('[class*="textContainer"] h1, [class*="textContainer"] h2, h1');
    const description = element.querySelector('[class*="description"]');
    const cta = element.querySelector('[class*="textContainer"] a[class*="button"], [class*="textContainer"] a[href]');
    const featured = element.querySelector('a[class*="featuredContainer"]');
    if (!heading && !description && !image && !featured) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (image) {
      cells.push([image]);
    }
    const textCell = [];
    if (heading) textCell.push(heading);
    if (description) textCell.push(description);
    if (cta) {
      const p = document.createElement("p");
      p.appendChild(cta);
      textCell.push(p);
    }
    cells.push([textCell]);
    if (featured) {
      const href = featured.getAttribute("href");
      const eyebrow = featured.querySelector('[class*="featuredEyebrow"]');
      const title = featured.querySelector('[class*="featuredTitle"]');
      const ctaText = featured.querySelector('[class*="featuredCta"]');
      const link = document.createElement("a");
      if (href) link.href = href;
      const parts = [];
      if (eyebrow) parts.push(eyebrow.textContent.trim());
      if (title) parts.push(title.textContent.trim());
      if (ctaText) parts.push(ctaText.textContent.trim());
      link.textContent = parts.filter((t) => t).join(" \u2014 ");
      const p = document.createElement("p");
      p.appendChild(link);
      cells.push([[p]]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-home", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-media.js
  function parse2(element, { document }) {
    const isTextContainer = /textContainer/.test(element.className);
    if (!isTextContainer) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const section = element.closest('section[class*="text-list-image-card_container"]') || element.parentElement;
    const textCol = element.querySelector('[class*="eyebrowTitleDescriptionContainer"]') || element;
    const imageContainer = section ? section.querySelector('[class*="imageContainer"]') : null;
    const image = imageContainer ? imageContainer.querySelector('img[class*="_image"], img:not([src^="data:"])') : null;
    if (!textCol && !image) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const imageCell = document.createElement("div");
    if (image) imageCell.appendChild(image);
    const cells = [[textCol, imageCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-media", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-highlight.js
  function parse3(element, { document }) {
    const image = element.querySelector('[class*="cardIconContainer"] img, [class*="cardIcon"], img');
    const title = element.querySelector('[class*="cardTitle"], h2, h3, h4');
    const description = element.querySelector('[class*="cardDescription"]');
    const cta = element.querySelector('a[class*="link"], a[href]');
    if (!title && !description && !image) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const imageCell = document.createElement("div");
    if (image) imageCell.appendChild(image);
    const textCell = [];
    if (title) textCell.push(title);
    if (description) textCell.push(description);
    if (cta) {
      const p = document.createElement("p");
      p.appendChild(cta);
      textCell.push(p);
    }
    const cells = [[imageCell, textCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-highlight", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-solutions.js
  function parse4(element, { document }) {
    const cards = Array.from(element.querySelectorAll(':scope > [class*="cardContainer"]'));
    const source = cards.length ? cards : Array.from(element.querySelectorAll('[class*="cardContainer"]'));
    const cells = [];
    source.forEach((card) => {
      const image = card.querySelector('[class*="cardIconContainer"] img, figure img, img');
      const title = card.querySelector('[class*="cardTitle"], h2, h3, h4');
      const description = card.querySelector('[class*="cardDescription"]');
      const cta = card.querySelector('a[class*="button"], a[class*="link"], a[href]');
      const imageCell = document.createElement("div");
      if (image) imageCell.appendChild(image);
      const textCell = [];
      if (title) textCell.push(title);
      if (description) textCell.push(description);
      if (cta) {
        const p = document.createElement("p");
        p.appendChild(cta);
        textCell.push(p);
      }
      cells.push([imageCell, textCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-solutions", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-callout.js
  function parse5(element, { document }) {
    const cards = Array.from(element.querySelectorAll('[class*="cardContainer"]'));
    const cells = [];
    cards.forEach((card) => {
      const image = card.querySelector('[class*="cardIcon"] img, [class*="cardEyebrow"] img, img');
      const title = card.querySelector('[class*="cardTitle"], h2, h3, h4');
      const description = card.querySelector('[class*="cardDescription"]');
      const cta = card.querySelector('a[class*="button"], a[class*="link"], a[href]');
      const imageCell = document.createElement("div");
      if (image) imageCell.appendChild(image);
      const textCell = [];
      if (title) textCell.push(title);
      if (description) textCell.push(description);
      if (cta) {
        const p = document.createElement("p");
        p.appendChild(cta);
        textCell.push(p);
      }
      cells.push([imageCell, textCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-callout", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-stories.js
  function parse6(element, { document }) {
    const containers = Array.from(element.querySelectorAll('[class*="cardContainer"]'));
    const cells = [];
    containers.forEach((card) => {
      const isIntro = /introContainer/.test(card.className);
      const image = card.querySelector('img:not([src^="data:"])');
      const eyebrow = card.querySelector('[class*="cardEyebrow"], [class*="_eyebrow"]');
      const title = card.querySelector('[class*="cardTitle"], [class*="_title"], h2, h3, h4');
      const cta = card.querySelector("a[href]");
      if (!title && !eyebrow && !(cta && cta.getAttribute("href"))) return;
      const imageCell = document.createElement("div");
      if (image) imageCell.appendChild(image);
      const textCell = [];
      if (eyebrow) {
        const ep = document.createElement("p");
        ep.textContent = eyebrow.textContent.trim();
        textCell.push(ep);
      }
      if (title) textCell.push(title);
      if (cta && cta.getAttribute("href")) {
        const p = document.createElement("p");
        p.appendChild(cta);
        textCell.push(p);
      }
      cells.push([imageCell, textCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-stories", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/dnb-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "dialog.floating-cta_dialog__uXzWi",
        'dialog[class*="no-consent_dialog"]',
        'section[class*="stickyCta_container"]'
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        'header[class*="header_container"]',
        'footer[class*="footer_container"]',
        "section#aiBannerPromo",
        "div.cmp-separator",
        "iframe",
        "link",
        "noscript",
        "source"
      ]);
      element.querySelectorAll('div[id*="_experiencefragment_"], div[id*="_experiencefragment"]').forEach((el) => {
        if (el.textContent.trim() === "" && !el.querySelector("img")) {
          el.remove();
        }
      });
    }
  }

  // tools/importer/transformers/dnb-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const template = payload && payload.template;
    const sections = template && Array.isArray(template.sections) ? template.sections : [];
    if (sections.length < 2) return;
    const doc = element.ownerDocument;
    const findSectionEl = (section) => {
      const selectors = Array.isArray(section.selector) ? section.selector : section.selector ? [section.selector] : [];
      for (const sel of selectors) {
        const el = element.querySelector(sel);
        if (el) return el;
      }
      return null;
    };
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const sectionEl = findSectionEl(section);
      if (!sectionEl) continue;
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        if (sectionEl.parentNode) {
          sectionEl.parentNode.insertBefore(metaBlock, sectionEl.nextSibling);
        }
      }
      if (i > 0 && sectionEl.parentNode) {
        const hr = doc.createElement("hr");
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    }
  }

  // tools/importer/transformers/dnb-dm-images.js
  function detectDynamicMediaUrl(urlStr) {
    let u;
    try {
      u = new URL(urlStr, "https://x/");
    } catch (e) {
      return false;
    }
    if (u.pathname.startsWith("/is/image/")) {
      return "scene7";
    }
    if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname) && u.pathname.startsWith("/adobe/assets/urn:")) {
      return "dm-openapi";
    }
    return false;
  }
  var LINKED_DM_INLINE_WRAPPER_TAGS = /* @__PURE__ */ new Set(["PICTURE"]);
  var LINKED_DM_WRAPPER_SIBLING_TAGS = /* @__PURE__ */ new Set(["SOURCE"]);
  function findLinkedDmCarrier(img) {
    if (!img || !img.parentElement) return null;
    let node = img;
    let parent = img.parentElement;
    while (parent && LINKED_DM_INLINE_WRAPPER_TAGS.has(parent.tagName)) {
      let foundNode = false;
      for (const child of parent.children) {
        if (child === node) {
          foundNode = true;
        } else if (!LINKED_DM_WRAPPER_SIBLING_TAGS.has(child.tagName)) {
          return null;
        }
      }
      if (!foundNode) return null;
      node = parent;
      parent = parent.parentElement;
    }
    if (!parent || parent.tagName !== "A") return null;
    if (parent.children.length !== 1 || parent.children[0] !== node) return null;
    if (parent.textContent.trim() !== "") return null;
    return parent;
  }
  var EMPTY_ALT_SENTINEL = "Image without alt text";
  function altToLinkText(alt) {
    return alt || EMPTY_ALT_SENTINEL;
  }
  function transform3(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const doc = element.ownerDocument;
    element.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!detectDynamicMediaUrl(src)) return;
      const alt = img.getAttribute("alt") || "";
      const linkedAnchor = findLinkedDmCarrier(img);
      if (linkedAnchor) {
        linkedAnchor.setAttribute("title", src);
        linkedAnchor.textContent = altToLinkText(alt);
        return;
      }
      const parent = img.parentElement;
      if (parent && parent.tagName === "A") {
        console.warn("DM image inside mixed-content anchor, skipped:", src);
        return;
      }
      const a = doc.createElement("a");
      a.href = src;
      a.textContent = altToLinkText(alt);
      img.replaceWith(a);
    });
  }

  // tools/importer/import-homepage.js
  var FORM_FRAGMENT_PATH = "/fragments/schedule-a-strategy-session";
  function formFragmentParser(element, { document }) {
    if (element.tagName !== "SECTION") {
      element.replaceWith(...element.childNodes);
      return;
    }
    const link = document.createElement("a");
    link.href = FORM_FRAGMENT_PATH;
    link.textContent = FORM_FRAGMENT_PATH;
    const block = WebImporter.Blocks.createBlock(document, {
      name: "fragment",
      cells: [[link]]
    });
    element.replaceWith(block);
  }
  var parsers = {
    "hero-home": parse,
    "columns-media": parse2,
    "cards-highlight": parse3,
    "cards-solutions": parse4,
    "cards-callout": parse5,
    "carousel-stories": parse6,
    form: formFragmentParser
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Dun & Bradstreet homepage with hero, AI context (text+image + highlight card), solutions card grid, D-U-N-S callout, customer stories carousel, and lead-capture form.",
    urls: [
      "https://www.dnb.com/en-us/"
    ],
    blocks: [
      { name: "hero-home", instances: ["section[class*='hero-home_container']"] },
      {
        name: "columns-media",
        instances: [
          "[class*='text-list-image-card_textContainer']",
          "[class*='text-list-image-card_imageContainer']"
        ]
      },
      { name: "cards-highlight", instances: ["[class*='text-list-image-card_cardContainer']"] },
      { name: "cards-solutions", instances: ["#product [class*='product-card-grid_cardsContainer']"] },
      { name: "cards-callout", instances: ["section[class*='product-card-grid-two-up_container']"], section: "dark" },
      { name: "carousel-stories", instances: ["section[class*='insight-card-carousel_container']"], section: "dark" },
      {
        name: "form",
        instances: [
          "#form form[class*='contact-form_formContainer']",
          "#form > section[class*='contact-form_container']"
        ]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "Hero",
        selector: ["section[class*='hero-home_container']"],
        style: null,
        blocks: ["hero-home"],
        defaultContent: []
      },
      {
        id: "section-2-ai-context",
        name: "AI Context",
        selector: ["section[class*='text-list-image-card_container']"],
        style: null,
        blocks: ["columns-media", "cards-highlight"],
        defaultContent: []
      },
      {
        id: "section-3-solutions",
        name: "Solutions Card Grid",
        selector: ["#product"],
        style: null,
        blocks: ["cards-solutions"],
        defaultContent: [
          "#product [class*='product-card-grid_eyebrow']",
          "#product h2",
          "#product [class*='product-card-grid_description']"
        ]
      },
      {
        id: "section-4-duns-callout",
        name: "D-U-N-S Number Callout",
        selector: ["section[class*='product-card-grid-two-up_container']"],
        style: "dark",
        blocks: ["cards-callout"],
        defaultContent: []
      },
      {
        id: "section-5-customer-stories",
        name: "Customer Stories Carousel",
        selector: ["section[class*='insight-card-carousel_container']"],
        style: "dark",
        blocks: ["carousel-stories"],
        defaultContent: []
      },
      {
        id: "section-6-lead-form",
        name: "Lead-Capture Form",
        selector: ["#form > section[class*='contact-form_container']"],
        style: null,
        blocks: ["form"],
        defaultContent: ["#form [class*='contact-form_plainTextContainer']"]
      }
    ]
  };
  var transformers = [
    transform,
    transform2,
    transform3
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const {
        document,
        url,
        html,
        params
      } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
