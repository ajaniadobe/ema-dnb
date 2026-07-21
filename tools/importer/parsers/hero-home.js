/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-home. Base: hero.
 * Source: https://www.dnb.com/en-us/
 * Generated for xwalk project (field-hinted output).
 *
 * Model fields (blocks/hero-home/_hero-home.json):
 *   image (reference)  -> row 2 background image
 *   imageAlt (text)    -> collapsed into <img alt>
 *   text (richtext)    -> row 3 title + subheading + CTA
 *
 * Library structure: 1 column, up to 3 rows (name, image, text).
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

  // Row 2: image cell (field: image). imageAlt collapses into the <img> alt attribute.
  const imageCell = document.createDocumentFragment();
  if (image) {
    imageCell.appendChild(document.createComment(' field:image '));
    imageCell.appendChild(image);
  }
  cells.push([imageCell]);

  // Row 3: text cell (field: text) - richtext holding heading, description, CTA.
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));
  if (heading) textCell.appendChild(heading);
  if (description) textCell.appendChild(description);
  if (cta) {
    // Wrap CTA in a paragraph so it renders as a linked call-to-action.
    const p = document.createElement('p');
    p.appendChild(cta);
    textCell.appendChild(p);
  }
  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-home', cells });
  element.replaceWith(block);
}
