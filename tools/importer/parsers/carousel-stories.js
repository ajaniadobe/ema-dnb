/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-stories. Base: carousel (container block).
 * Source: https://www.dnb.com/en-us/
 * DA project: plain document markup, no field-hint comments.
 *
 * Container block: each slide = one row with 2 cells.
 *   cell 1: image (empty in source, but cell still emitted)
 *   cell 2: text (title + CTA) as rich text
 *
 * Mapped instance is section[class*="insight-card-carousel_container"]. The first
 * cardContainer is the carousel intro (eyebrow + heading, no CTA target) and is skipped;
 * every remaining cardContainer is a story slide. Source slides carry no image, so the
 * image cell is left empty (still emitted, per container-block rules).
 */
export default function parse(element, { document }) {
  const containers = Array.from(element.querySelectorAll('[class*="cardContainer"]'));

  const cells = [];

  containers.forEach((card) => {
    const isIntro = /introContainer/.test(card.className);
    if (isIntro) return; // section intro, not a slide

    const image = card.querySelector('img:not([src^="data:"])');
    const title = card.querySelector('[class*="cardTitle"], h2, h3, h4');
    const cta = card.querySelector('a[href]');

    // A slide needs at least a title or CTA target; skip decorative/empty cards.
    if (!title && !(cta && cta.getAttribute('href'))) return;

    // Cell 1: image (empty when the source slide has none, but cell must still be present).
    const imageCell = document.createElement('div');
    if (image) imageCell.appendChild(image);

    // Cell 2: text — title + CTA as rich text.
    const textCell = [];
    if (title) textCell.push(title);
    if (cta && cta.getAttribute('href')) {
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-stories', cells });
  element.replaceWith(block);
}
