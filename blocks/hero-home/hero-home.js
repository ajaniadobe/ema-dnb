export default function decorate(block) {
  const rows = [...block.children];

  // Row 1, cell 1 holds the full-bleed illustration.
  // Source content authored it as a link to a Scene7 image URL, so we
  // convert that link (or an EDS-decorated <picture>) into the background layer.
  const mediaRow = rows[0];
  if (mediaRow) {
    mediaRow.classList.add('hero-home-media');
    const link = mediaRow.querySelector('a');
    const img = mediaRow.querySelector('img');
    if (img) {
      // EDS already produced an <img>/<picture> — leave it, CSS positions it.
      mediaRow.querySelector('picture')?.classList.add('hero-home-illustration');
    } else if (link) {
      // Replace the placeholder link with an <img> element.
      const url = link.getAttribute('href');
      const picture = document.createElement('picture');
      const image = document.createElement('img');
      image.src = url;
      image.alt = link.textContent.trim();
      image.loading = 'eager';
      picture.className = 'hero-home-illustration';
      picture.append(image);
      link.replaceWith(picture);
    }
  }

  // Remaining row(s) hold the text: heading, paragraph, CTA.
  const contentRow = rows[1] || rows[0];
  if (contentRow) contentRow.classList.add('hero-home-content');
}
