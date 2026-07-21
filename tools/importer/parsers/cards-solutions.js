/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-solutions. Base: cards (container block).
 * Source: https://www.dnb.com/en-us/
 * DA project: plain document markup, no field-hint comments.
 *
 * Container block: each solution card = one row with 2 cells.
 *   cell 1: image/icon
 *   cell 2: text (title + description + CTA) as rich text
 *
 * The mapped instance is the cards container
 * (#product [class*="product-card-grid_cardsContainer"]); iterate its child
 * [class*="cardContainer"] nodes, one row per card.
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll(':scope > [class*="cardContainer"]'));
  const source = cards.length ? cards : Array.from(element.querySelectorAll('[class*="cardContainer"]'));

  const cells = [];

  source.forEach((card) => {
    const image = card.querySelector('[class*="cardIconContainer"] img, figure img, img');
    const title = card.querySelector('[class*="cardTitle"], h2, h3, h4');
    const description = card.querySelector('[class*="cardDescription"]');
    const cta = card.querySelector('a[class*="button"], a[class*="link"], a[href]');

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

    cells.push([imageCell, textCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-solutions', cells });
  element.replaceWith(block);
}
