/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-highlight. Base: cards (container block).
 * Source: https://www.dnb.com/en-us/
 * DA project: plain document markup, no field-hint comments.
 *
 * Container block: each card = one row with 2 cells.
 *   cell 1: image/icon
 *   cell 2: text (title + description + CTA) as rich text
 *
 * The mapped instance selector is the card container itself
 * ([class*="text-list-image-card_cardContainer"]), so each matched element is one card.
 */
export default function parse(element, { document }) {
  // Icon / image cell.
  const image = element.querySelector('[class*="cardIconContainer"] img, [class*="cardIcon"], img');

  // Text content cell.
  const title = element.querySelector('[class*="cardTitle"], h2, h3, h4');
  const description = element.querySelector('[class*="cardDescription"]');
  const cta = element.querySelector('a[class*="link"], a[href]');

  if (!title && !description && !image) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Cell 1: image (may be empty, but cell must still be present).
  const imageCell = document.createElement('div');
  if (image) imageCell.appendChild(image);

  // Cell 2: text — title, description, CTA as rich text.
  const textCell = [];
  if (title) textCell.push(title);
  if (description) textCell.push(description);
  if (cta) {
    const p = document.createElement('p');
    p.appendChild(cta);
    textCell.push(p);
  }

  // One card = one row, 2 columns.
  const cells = [[imageCell, textCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-highlight', cells });
  element.replaceWith(block);
}
