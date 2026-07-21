/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Dun & Bradstreet (dnb) section boundaries + section metadata.
 *
 * Reads the migrating template's sections from payload.template.sections and,
 * for each section (processed in reverse document order so insertions don't
 * shift not-yet-processed anchors):
 *   - inserts a section-break <hr> before the section element (for every
 *     section except the first),
 *   - appends a "Section Metadata" block after the section element when the
 *     section defines a style (e.g. the dark D-U-N-S callout and customer
 *     stories carousel).
 *
 * Homepage template sections (verified against migration-work/cleaned.html):
 *   1 Hero                         section[class*='hero-home_container']     style: null
 *   2 AI Context                   section[class*='text-list-image-card_container'] style: null
 *   3 Solutions Card Grid          #product                                  style: null
 *   4 D-U-N-S Number Callout       section[class*='product-card-grid-two-up_container'] style: dark
 *   5 Customer Stories Carousel    section[class*='insight-card-carousel_container']    style: dark
 *   6 Lead-Capture Form            #form > section[class*='contact-form_container']     style: null
 *
 * Expected output for this template: 5 <hr> and 2 Section Metadata blocks.
 *
 * Runs in afterTransform only (block parsers have already built their cells).
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const template = payload && payload.template;
  const sections = template && Array.isArray(template.sections) ? template.sections : [];
  if (sections.length < 2) return;

  const doc = element.ownerDocument;

  // Resolve the first matching element for a section from its selector list.
  const findSectionEl = (section) => {
    const selectors = Array.isArray(section.selector)
      ? section.selector
      : (section.selector ? [section.selector] : []);
    for (const sel of selectors) {
      const el = element.querySelector(sel);
      if (el) return el;
    }
    return null;
  };

  // Process in reverse so earlier insertions don't invalidate later anchors.
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    const section = sections[i];
    const sectionEl = findSectionEl(section);
    if (!sectionEl) continue;

    // Section Metadata block after the section, when a style is defined.
    if (section.style) {
      const metaBlock = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      if (sectionEl.parentNode) {
        sectionEl.parentNode.insertBefore(metaBlock, sectionEl.nextSibling);
      }
    }

    // Section break before every section except the first.
    if (i > 0 && sectionEl.parentNode) {
      const hr = doc.createElement('hr');
      sectionEl.parentNode.insertBefore(hr, sectionEl);
    }
  }
}
