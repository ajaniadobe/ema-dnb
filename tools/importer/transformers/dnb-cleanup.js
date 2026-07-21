/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Dun & Bradstreet (dnb) site-wide cleanup.
 *
 * Source is an AEM React SPA. Content lives under #spa-root, wrapped in many
 * nested AEM responsive-grid containers. The global header, footer, sticky
 * CTA / chat widget, and trailing promo experience-fragments are NOT
 * authorable page content — header/footer are auto-populated in EDS — so they
 * are stripped here.
 *
 * All selectors below were verified against migration-work/cleaned.html.
 */


const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Overlays / widgets that would otherwise interfere with block parsing.
    // Found in cleaned.html:
    //   <dialog class="floating-cta_dialog__uXzWi">  (duplicate floating form dialog)
    //   <dialog class="no-consent_dialog__+cN6q">    (chat cookies consent dialog)
    //   <section class="stickyCta_container__yKC4D">  (sticky phone/chat CTA)
    WebImporter.DOMUtils.remove(element, [
      'dialog.floating-cta_dialog__uXzWi',
      'dialog[class*="no-consent_dialog"]',
      'section[class*="stickyCta_container"]',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome (experience fragments) — header, footer,
    // the header AI promo banner, and the trailing empty iframe promo EXF.
    // Verified selectors in cleaned.html:
    //   <header class="header_container__gpAdJ"> ... including .aiBanner promo
    //   <footer class="footer_container__FYJ7H">
    //   <section id="aiBannerPromo" class="article-media_container__hs2ON"> (empty iframe)
    //   <div class="cmp-separator"> (AEM separator rule, layout chrome)
    WebImporter.DOMUtils.remove(element, [
      'header[class*="header_container"]',
      'footer[class*="footer_container"]',
      'section#aiBannerPromo',
      'div.cmp-separator',
      'iframe',
      'link',
      'noscript',
      'source',
    ]);

    // Remove empty experience-fragment wrapper divs left behind (global
    // privacy control / header / footer EXF containers). Matched by their
    // AEM-generated id prefix seen in cleaned.html.
    element
      .querySelectorAll('div[id*="_experiencefragment_"], div[id*="_experiencefragment"]')
      .forEach((el) => {
        if (el.textContent.trim() === '' && !el.querySelector('img')) {
          el.remove();
        }
      });
  }
}
