/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-home. Base: hero.
 * Source: https://www.dnb.com/en-us/
 * DA project: plain document markup, no field-hint comments.
 *
 * Library structure: 1 column, up to 3 rows (name, background image, text).
 *   Row 2: background/hero image (optional)
 *   Row 3: title (heading) + subheading + call-to-action link
 */
export default function parse(element, { document }) {
  // Row 2: background/hero image
  const image = element.querySelector('[class*="imageContainer"] img, [class*="imageMask"] img, img');

  // Row 3: text content (heading, description, CTA)
  const heading = element.querySelector('[class*="textContainer"] h1, [class*="textContainer"] h2, h1');
  const description = element.querySelector('[class*="description"]');
  const cta = element.querySelector('[class*="textContainer"] a[class*="button"], [class*="textContainer"] a[href]');

  // Empty-block guard
  if (!heading && !description && !image) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: image cell (optional).
  if (image) {
    cells.push([image]);
  }

  // Row 3: text cell holding heading, description and CTA (1 column).
  const textCell = [];
  if (heading) textCell.push(heading);
  if (description) textCell.push(description);
  if (cta) {
    // Wrap CTA in a paragraph so it renders as a linked call-to-action.
    const p = document.createElement('p');
    p.appendChild(cta);
    textCell.push(p);
  }
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-home', cells });
  element.replaceWith(block);
}
