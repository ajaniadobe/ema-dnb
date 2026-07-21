/* eslint-disable */
/* global WebImporter */

// Fragment import: extracts the "Schedule a Strategy Session" lead-form section
// from the DNB homepage and emits it as a reusable fragment document at
// /fragments/schedule-a-strategy-session. The fragment holds the intro copy
// (default content) plus the Form block; the homepage includes it via a
// fragment block.

/* global WebImporter */

const FRAGMENT_PATH = '/fragments/schedule-a-strategy-session';

export default {
  transform: (payload) => {
    const { document } = payload;

    const section = document.querySelector("#form > section[class*='contact-form_container']")
      || document.querySelector("section[class*='contact-form_container']");

    const main = document.createElement('main');

    // Intro copy (left text region: heading + description) as default content.
    if (section) {
      const intro = section.querySelector("[class*='contact-form_plainTextContainer'], [class*='contact-form_textOuterContainer']");
      if (intro) {
        const wrapper = document.createElement('div');
        // Keep only headings and paragraphs — drop empty React wrappers.
        intro.querySelectorAll('h1, h2, h3, h4, h5, h6, p').forEach((node) => {
          const text = node.textContent.trim();
          if (text) {
            const clone = document.createElement(/^H\d$/.test(node.tagName) ? node.tagName.toLowerCase() : 'p');
            clone.textContent = text;
            wrapper.append(clone);
          }
        });
        if (wrapper.childNodes.length) main.append(wrapper);
      }

      // Form heading ("Schedule a Strategy Session") above the block.
      const formHeading = section.querySelector("[class*='contact-form_formOuterContainer'] h2, [class*='formContainer'] ~ h2");
      if (formHeading && formHeading.textContent.trim()) {
        const wrapper = document.createElement('div');
        const h = document.createElement('h2');
        h.textContent = formHeading.textContent.trim();
        wrapper.append(h);
        main.append(wrapper);
      }
    }

    // Form block: standard 2-row table (form-definition link + submit endpoint).
    const formDef = document.createElement('a');
    formDef.href = '/forms/schedule-a-strategy-session.json';
    formDef.textContent = 'Form Definition';
    const submit = document.createElement('a');
    submit.href = 'https://www.dnb.com/en-us/api/forms/submit';
    submit.textContent = 'Submit';
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'form',
      cells: [[formDef], [submit]],
    });
    main.append(block);

    return [{
      element: main,
      path: FRAGMENT_PATH,
      report: { title: 'Schedule a Strategy Session', template: 'form-fragment' },
    }];
  },
};
