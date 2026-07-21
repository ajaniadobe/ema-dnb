/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-media. Base: columns.
 * Source: https://www.dnb.com/en-us/
 * Generated for xwalk project.
 *
 * Columns blocks use ONLY default content — no field-hint comments (per hinting rules).
 * Layout: 1 row, 2 columns. Column 1 = text (eyebrow/title/description/callout list).
 * Column 2 = the accompanying image.
 *
 * page-templates.json lists two instances for this block:
 *   [class*="text-list-image-card_textContainer"]  (triggers block creation)
 *   [class*="text-list-image-card_imageContainer"] (unwrapped — its content is pulled
 *                                                    into the block by the text instance)
 * Both live inside the same section[class*="text-list-image-card_container"].
 */
export default function parse(element, { document }) {
  const isTextContainer = /textContainer/.test(element.className);

  // The image-container instance is handled by the text-container pass; unwrap it so
  // its content isn't emitted as a second, stray columns block.
  if (!isTextContainer) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const section = element.closest('section[class*="text-list-image-card_container"]') || element.parentElement;

  // Column 1: text content — reuse the whole text container's inner content.
  const textCol = element.querySelector('[class*="eyebrowTitleDescriptionContainer"]') || element;

  // Column 2: image from the sibling image container within the same section.
  const imageContainer = section ? section.querySelector('[class*="imageContainer"]') : null;
  const image = imageContainer
    ? imageContainer.querySelector('img[class*="_image"], img:not([src^="data:"])')
    : null;

  if (!textCol && !image) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const imageCell = document.createElement('div');
  if (image) imageCell.appendChild(image);

  // 1 row, 2 columns: [ text, image ]. No field hints for columns blocks.
  const cells = [[textCol, imageCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-media', cells });
  element.replaceWith(block);
}
