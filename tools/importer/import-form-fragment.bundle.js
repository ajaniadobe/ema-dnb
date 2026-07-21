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
      const formDef = document.createElement("a");
      formDef.href = "/forms/schedule-a-strategy-session.json";
      formDef.textContent = "Form Definition";
      const submit = document.createElement("a");
      submit.href = "https://www.dnb.com/en-us/api/forms/submit";
      submit.textContent = "Submit";
      const block = WebImporter.Blocks.createBlock(document, {
        name: "form",
        cells: [[formDef], [submit]]
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
