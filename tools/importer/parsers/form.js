/* eslint-disable */
/* global WebImporter */
/**
 * Parser for form. Base: form (local forms-excat / AEM Block Collection form block).
 * Source: https://www.dnb.com/en-us/
 * Generated for xwalk project.
 *
 * The local blocks/form/form.js decorates a Form block by reading two anchors from the
 * block: a form-definition link ending in `.json` and a submit-endpoint link. It builds
 * the actual fields at runtime from the JSON definition.
 *
 * The source "Schedule a Strategy Session" form is a JS-driven React multi-step widget
 * with no author-facing definition/submit links, so we emit the standard Form block
 * table with a conventional form-definition path and submit endpoint for authors to wire
 * up. The intro copy (heading/description) is default content handled outside this block.
 *
 * No UE model file (blocks/form/_form.json) exists, so no field-hint comments are added.
 *
 * page-templates.json maps two instances:
 *   #form form[class*="contact-form_formContainer"]  -> empty React <form>, unwrapped
 *   #form > section[class*="contact-form_container"]  -> emits the Form block
 */
export default function parse(element, { document }) {
  const isSection = element.tagName === 'SECTION';

  // The bare React <form> shell carries no authorable content — unwrap it.
  if (!isSection) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Standard Form block: form-definition link + submit-endpoint link.
  const formDef = document.createElement('a');
  formDef.href = '/forms/schedule-a-strategy-session.json';
  formDef.textContent = 'Form Definition';

  const submit = document.createElement('a');
  submit.href = 'https://www.dnb.com/en-us/api/forms/submit';
  submit.textContent = 'Submit';

  const cells = [
    [formDef],
    [submit],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'form', cells });
  element.replaceWith(block);
}
