/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-callout. Base: cards (container block).
 * Source: https://www.dnb.com/en-us/
 * DA project: plain document markup, no field-hint comments.
 *
 * Container block: each callout card = one row with 2 cells.
 *   cell 1: icon/image
 *   cell 2: text (title + description + CTA) as rich text
 *
 * Mapped instance is the section[class*="product-card-grid-two-up_container"];
 * iterate its [class*="cardContainer"] children (typically one D-U-N-S callout card).
 * The section-level base64 pattern SVG is skipped because image lookup is scoped to the card.
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('[class*="cardContainer"]'));

  const cells = [];

  cards.forEach((card) => {
    // Icon lives inside the card eyebrow; scoping to the card avoids the section pattern SVG.
    const image = card.querySelector('[class*="cardIcon"] img, [class*="cardEyebrow"] img, img');
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-callout', cells });
  element.replaceWith(block);
}
