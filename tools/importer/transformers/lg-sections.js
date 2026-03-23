/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: LG UAE section breaks and section-metadata.
 * Adds <hr> section breaks and Section Metadata blocks based on template sections.
 * Runs in afterTransform only. Uses payload.template.sections from page-templates.json.
 * All selectors from captured DOM of lg.com/ae/about-lg/our-brand/index.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to avoid DOM position shifts
    const reversed = [...sections].reverse();

    for (const section of reversed) {
      // Try each selector (can be string or array)
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;

      for (const sel of selectors) {
        try {
          sectionEl = element.querySelector(sel);
        } catch (e) {
          // :contains() not supported in native querySelector, try without
          const simplified = sel.replace(/:contains\([^)]*\)/g, '');
          try {
            sectionEl = element.querySelector(simplified);
          } catch (e2) {
            // skip invalid selector
          }
        }
        if (sectionEl) break;
      }

      if (!sectionEl) continue;

      // Add section-metadata block if section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metaBlock);
      }

      // Add <hr> before section (except for the first section)
      if (section.id !== sections[0].id) {
        const hr = document.createElement('hr');
        // Find the closest ancestor that is a direct child of element (main)
        let target = sectionEl;
        while (target.parentElement && target.parentElement !== element) {
          target = target.parentElement;
        }
        if (target.parentElement === element) {
          target.before(hr);
        }
      }
    }
  }
}
