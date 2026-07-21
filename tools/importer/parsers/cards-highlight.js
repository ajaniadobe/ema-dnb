/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-highlight. Base: cards (container block).
 * Source: https://www.dnb.com/en-us/
 * Generated for xwalk project (field-hinted output).
 *
 * Container block: each card = one row with 2 cells.
 *   cell 1: image/icon  -> field:image (imageAlt collapses into <img alt>)
 *   cell 2: text (title + description + CTA) -> field:text (richtext)
 *
 * Card model (blocks/cards-highlight/_cards-highlight.json -> model "card"): image, text.
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

  // Cell 1: image (field:image). imageAlt collapses into the <img> alt attribute.
  const imageCell = document.createDocumentFragment();
  if (image) {
    imageCell.appendChild(document.createComment(' field:image '));
    imageCell.appendChild(image);
  }

  // Cell 2: text (field:text) — richtext with title, description, CTA.
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));
  if (title) textCell.appendChild(title);
  if (description) textCell.appendChild(description);
  if (cta) {
    const p = document.createElement('p');
    p.appendChild(cta);
    textCell.appendChild(p);
  }

  // One card = one row, 2 columns.
  const cells = [[imageCell, textCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-highlight', cells });
  element.replaceWith(block);
}
