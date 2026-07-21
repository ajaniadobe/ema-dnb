import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      // Image cell: authored as a Scene7 image link (href not ending in an
      // image extension, so EDS leaves it as an <a>) or an EDS <picture>.
      const link = div.querySelector('a');
      const isImageLink = link && div.children.length === 1
        && link === div.firstElementChild
        && !link.querySelector('*');
      if (div.querySelector('picture')) {
        div.className = 'cards-solutions-card-image';
      } else if (isImageLink) {
        const img = document.createElement('img');
        img.src = link.getAttribute('href');
        img.alt = link.textContent.trim() === 'Image without alt text' ? '' : link.textContent.trim();
        img.loading = 'lazy';
        const picture = document.createElement('picture');
        picture.append(img);
        link.replaceWith(picture);
        div.className = 'cards-solutions-card-image';
      } else {
        div.className = 'cards-solutions-card-body';
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '228' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
