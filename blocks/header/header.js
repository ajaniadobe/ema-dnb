import { getMetadata } from '../../scripts/aem.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Loads the nav fragment DOM. Tries the localhost /content path first, then
 * the DA/EDS production path (navPath + .plain.html).
 * @param {string} navPath nav doc path without the .plain.html suffix
 * @returns {Element} a container element holding the fragment markup
 */
async function loadNavFragment(navPath) {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch(`${navPath}.plain.html`);
  if (!resp.ok) return null;
  const container = document.createElement('div');
  container.innerHTML = await resp.text();
  return container;
}

/**
 * Closes any open megamenu panel and resets its trigger state.
 * @param {Element} nav The nav element
 */
function closeAllPanels(nav) {
  nav.querySelectorAll('.nav-trigger[aria-expanded="true"]').forEach((t) => {
    t.setAttribute('aria-expanded', 'false');
  });
  nav.querySelectorAll('.nav-panel.open').forEach((p) => p.classList.remove('open'));
}

/**
 * Builds one megamenu section from a fragment section div.
 * The section shape: <h2>Label</h2>, intro (<p> eyebrow, <p> desc, <p><a>cta),
 * then repeating <h3>[link] + <ul> link groups.
 * @param {Element} section The source section div
 * @param {Element} nav The nav element (for close-on-select)
 * @returns {Element} an <li> containing trigger button + panel
 */
function buildNavItem(section, nav) {
  const label = section.querySelector('h2')?.textContent.trim() || '';
  const li = document.createElement('li');
  li.className = 'nav-item';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'nav-trigger';
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-haspopup', 'true');
  trigger.textContent = label;

  const panel = document.createElement('div');
  panel.className = 'nav-panel';

  // Intro column: first <p> = eyebrow, following <p>s = description/cta until first <h3>.
  const intro = document.createElement('div');
  intro.className = 'nav-panel-intro';
  const groups = document.createElement('div');
  groups.className = 'nav-panel-groups';

  let inGroups = false;
  let currentGroup = null;
  [...section.children].forEach((el) => {
    if (el.tagName === 'H2') return;
    if (el.tagName === 'H3') {
      inGroups = true;
      currentGroup = document.createElement('div');
      currentGroup.className = 'nav-panel-group';
      const gh = document.createElement('p');
      gh.className = 'nav-group-heading';
      gh.append(...el.childNodes);
      currentGroup.append(gh);
      groups.append(currentGroup);
      return;
    }
    if (el.tagName === 'UL') {
      (currentGroup || groups).append(el.cloneNode(true));
      return;
    }
    if (!inGroups) intro.append(el.cloneNode(true));
  });

  panel.append(intro, groups);

  trigger.addEventListener('click', () => {
    const open = trigger.getAttribute('aria-expanded') === 'true';
    closeAllPanels(nav);
    if (!open) {
      trigger.setAttribute('aria-expanded', 'true');
      panel.classList.add('open');
    }
  });

  li.append(trigger, panel);
  return li;
}

/**
 * loads and decorates the header nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadNavFragment(navPath);
  if (!fragment) return;

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');

  // Classify sections by content shape (generic — not positional):
  //   navItem = has an <h2> (megamenu trigger)
  //   utility = has <ul> (audience/tools lists; may contain icons)
  //   brand   = has an <img> but no <ul> (logo)
  //   promo   = single link, no <ul>/<h2>/<img>
  const sections = [...fragment.querySelectorAll(':scope > div')];
  let brandSection = null;
  const navItemSections = [];
  const utilitySections = [];
  const promoSections = [];
  sections.forEach((section) => {
    if (section.querySelector('h2')) navItemSections.push(section);
    else if (section.querySelector('ul')) utilitySections.push(section);
    else if (section.querySelector('img')) brandSection = section;
    else promoSections.push(section);
  });

  // Utility bar (top row): each <ul> becomes a group; first group is the
  // audience switcher (left), the rest are tools (right).
  let utilityBar = null;
  if (utilitySections.length) {
    utilityBar = document.createElement('div');
    utilityBar.className = 'nav-utility';
    const inner = document.createElement('div');
    inner.className = 'nav-utility-inner';
    utilitySections.forEach((section) => {
      [...section.querySelectorAll(':scope > ul')].forEach((ul, i) => {
        const group = ul.cloneNode(true);
        group.classList.add(i === 0 ? 'nav-utility-audience' : 'nav-utility-tools');
        inner.append(group);
      });
    });
    utilityBar.append(inner);

    // Search flyout: the tools link labelled "Search" becomes a toggle that
    // reveals an inline search input, rather than navigating.
    const searchItem = [...utilityBar.querySelectorAll('.nav-utility-tools a')]
      .find((a) => /search/i.test(a.textContent) || /search/i.test(a.querySelector('img')?.getAttribute('alt') || ''));
    if (searchItem) {
      const flyout = document.createElement('div');
      flyout.className = 'nav-search-flyout';
      flyout.hidden = true;
      flyout.innerHTML = `<form role="search" action="/en-us/search.html" method="get">
          <input type="search" name="q" aria-label="Search" placeholder="Search dnb.com">
          <button type="submit" aria-label="Submit search">Search</button>
        </form>`;
      utilityBar.append(flyout);

      searchItem.setAttribute('role', 'button');
      searchItem.setAttribute('aria-expanded', 'false');
      searchItem.setAttribute('aria-controls', 'nav-search-flyout');
      flyout.id = 'nav-search-flyout';
      searchItem.addEventListener('click', (e) => {
        e.preventDefault();
        const open = searchItem.getAttribute('aria-expanded') === 'true';
        searchItem.setAttribute('aria-expanded', open ? 'false' : 'true');
        flyout.hidden = open;
        if (!open) flyout.querySelector('input')?.focus();
      });
      document.addEventListener('click', (e) => {
        if (!utilityBar.contains(e.target)) {
          searchItem.setAttribute('aria-expanded', 'false');
          flyout.hidden = true;
        }
      });
    }
  }

  // Brand: logo link.
  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  if (brandSection) {
    const link = brandSection.querySelector('a');
    if (link) {
      link.className = '';
      brand.append(link);
    }
  }

  // Nav items: megamenu triggers.
  const list = document.createElement('ul');
  list.className = 'nav-list';
  navItemSections.forEach((section) => list.append(buildNavItem(section, nav)));

  const sectionsWrap = document.createElement('div');
  sectionsWrap.className = 'nav-sections';
  sectionsWrap.append(list);

  // Hamburger (mobile placeholder — full mobile behavior added in a later pass).
  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation" aria-expanded="false">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.querySelector('button').addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    hamburger.querySelector('button').setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    document.body.style.overflowY = expanded ? '' : 'hidden';
  });

  nav.append(hamburger, brand, sectionsWrap);
  nav.setAttribute('aria-expanded', 'false');

  // Promo banner (bottom row): trailing single-link section.
  let promoBar = null;
  if (promoSections.length) {
    promoBar = document.createElement('div');
    promoBar.className = 'nav-promo';
    const link = promoSections[promoSections.length - 1].querySelector('a');
    if (link) {
      link.className = '';
      promoBar.append(link);
    }
  }

  // Close panels on outside click and on Escape.
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) closeAllPanels(nav);
  });
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') closeAllPanels(nav);
  });

  // Reset state when crossing the desktop/mobile breakpoint.
  isDesktop.addEventListener('change', () => {
    closeAllPanels(nav);
    nav.setAttribute('aria-expanded', 'false');
    document.body.style.overflowY = '';
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  if (utilityBar) navWrapper.append(utilityBar);
  navWrapper.append(nav);
  if (promoBar) navWrapper.append(promoBar);
  block.append(navWrapper);
}
