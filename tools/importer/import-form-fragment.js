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

    // Form block: inline the sheet-form definition as a <pre><code> JSON block.
    //
    // We intentionally do NOT use a link to the .json file: the EDS/helix link
    // renderer slugifies internal anchor hrefs, turning "...session.json" into
    // "...session-json". The boilerplate form.js fetchForm() then sees no
    // ".json" in the path, treats it as an AEM page, and 404s — so the form
    // never renders. Inlining the definition (which form.js reads via
    // extractFormDefinition -> block.querySelector('pre') > code) avoids the
    // fragile link entirely. decorate() only falls back to the <pre><code>
    // path when the block has NO anchor, so no submit/href anchors are emitted;
    // the submit endpoint comes from the form definition's own properties.
    const FORM_JSON = {
  "name": "schedule-a-strategy-session",
  "data": [
    {
      "Name": "email",
      "Type": "email",
      "Description": "",
      "Placeholder": "Business Email *",
      "Label": "Business Email",
      "Read Only": "",
      "Mandatory": true,
      "Pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
      "Step": "",
      "Min": "",
      "Max": "",
      "Value": "",
      "Options": "",
      "OptionNames": "",
      "Fieldset": "",
      "Repeatable": ""
    },
    {
      "Name": "country",
      "Type": "select",
      "Description": "",
      "Placeholder": "",
      "Label": "Country",
      "Read Only": "",
      "Mandatory": true,
      "Pattern": "",
      "Step": "",
      "Min": "",
      "Max": "",
      "Value": "US",
      "Options": ",US,CA,AF,AL,DZ,AU,AT,BE,BR,BG,CN,HR,CZ,DK,EG,FI,FR,DE,GR,HK,HU,IN,ID,IE,IL,IT,JP,KR,MY,MX,NL,NZ,NO,PH,PL,PT,RO,SA,SG,SK,ZA,ES,SE,CH,TW,TH,TR,AE,GB,VN",
      "OptionNames": [
        "Select Country",
        "United States",
        "Canada",
        "Afghanistan",
        "Albania",
        "Algeria",
        "Australia",
        "Austria",
        "Belgium",
        "Brazil",
        "Bulgaria",
        "China Mainland",
        "Croatia",
        "Czechia",
        "Denmark",
        "Egypt",
        "Finland",
        "France",
        "Germany",
        "Greece",
        "Hong Kong SAR",
        "Hungary",
        "India",
        "Indonesia",
        "Ireland",
        "Israel",
        "Italy",
        "Japan",
        "Korea (South)",
        "Malaysia",
        "Mexico",
        "Netherlands, Kingdom of the",
        "New Zealand",
        "Norway",
        "Philippines",
        "Poland",
        "Portugal",
        "Romania",
        "Saudi Arabia",
        "Singapore",
        "Slovakia",
        "South Africa",
        "Spain",
        "Sweden",
        "Switzerland",
        "Taiwan Region",
        "Thailand",
        "Türkiye",
        "United Arab Emirates",
        "United Kingdom",
        "Viet Nam"
      ],
      "Fieldset": "",
      "Repeatable": ""
    },
    {
      "Name": "submit",
      "Type": "submit",
      "Description": "",
      "Placeholder": "",
      "Label": "Next",
      "Read Only": "",
      "Mandatory": "",
      "Pattern": "",
      "Step": "",
      "Min": "",
      "Max": "",
      "Value": "",
      "Options": "",
      "OptionNames": "",
      "Fieldset": "",
      "Repeatable": ""
    }
  ],
  ":type": "sheet"
};
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.textContent = JSON.stringify(FORM_JSON);
    pre.append(code);
    const block = WebImporter.Blocks.createBlock(document, {
      name: 'form',
      cells: [[pre]],
    });
    main.append(block);

    return [{
      element: main,
      path: FRAGMENT_PATH,
      report: { title: 'Schedule a Strategy Session', template: 'form-fragment' },
    }];
  },
};
