/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-form-fragment.js
  var import_form_fragment_exports = {};
  __export(import_form_fragment_exports, {
    default: () => import_form_fragment_default
  });
  var FRAGMENT_PATH = "/fragments/schedule-a-strategy-session";
  var import_form_fragment_default = {
    transform: (payload) => {
      const { document } = payload;
      const section = document.querySelector("#form > section[class*='contact-form_container']") || document.querySelector("section[class*='contact-form_container']");
      const main = document.createElement("main");
      if (section) {
        const intro = section.querySelector("[class*='contact-form_plainTextContainer'], [class*='contact-form_textOuterContainer']");
        if (intro) {
          const wrapper = document.createElement("div");
          intro.querySelectorAll("h1, h2, h3, h4, h5, h6, p").forEach((node) => {
            const text = node.textContent.trim();
            if (text) {
              const clone = document.createElement(/^H\d$/.test(node.tagName) ? node.tagName.toLowerCase() : "p");
              clone.textContent = text;
              wrapper.append(clone);
            }
          });
          if (wrapper.childNodes.length) main.append(wrapper);
        }
        const formHeading = section.querySelector("[class*='contact-form_formOuterContainer'] h2, [class*='formContainer'] ~ h2");
        if (formHeading && formHeading.textContent.trim()) {
          const wrapper = document.createElement("div");
          const h = document.createElement("h2");
          h.textContent = formHeading.textContent.trim();
          wrapper.append(h);
          main.append(wrapper);
        }
      }
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
              "T\xFCrkiye",
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
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      code.textContent = JSON.stringify(FORM_JSON);
      pre.append(code);
      const block = WebImporter.Blocks.createBlock(document, {
        name: "form",
        cells: [[pre]]
      });
      main.append(block);
      return [{
        element: main,
        path: FRAGMENT_PATH,
        report: { title: "Schedule a Strategy Session", template: "form-fragment" }
      }];
    }
  };
  return __toCommonJS(import_form_fragment_exports);
})();
