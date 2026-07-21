/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-solutions. Base: cards (container block).
 * Source: https://www.dnb.com/en-us/
 * Generated for xwalk project (field-hinted output).
 *
 * Container block: each solution card = one row with 2 cells.
 *   cell 1: image/icon -> field:image (imageAlt collapses into <img alt>)
 *   cell 2: text (title + description + CTA) -> field:text (richtext)
 *
 * Card model (model "card"): image, text.
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

    // Cell 1: image (field:image). imageAlt collapses into <img alt>.
    const imageCell = document.createDocumentFragment();
    if (image) {
      imageCell.appendChild(document.createComment(' field:image '));
      imageCell.appendChild(image);
    }

    // Cell 2: text (field:text) — title, description, CTA.
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (title) textCell.appendChild(title);
    if (description) textCell.appendChild(description);
    if (cta) {
      const p = document.createElement('p');
      p.appendChild(cta);
      textCell.appendChild(p);
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
