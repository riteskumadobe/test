/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-media variant.
 * Base block: columns. Source: lg.com/ae/about-lg/our-brand/index
 * Two-column layout: image on one side, text + optional CTA on the other.
 * Columns blocks do NOT require field hints (per xwalk rules).
 * Generated: 2026-03-19
 */
export default function parse(element, { document }) {
  // Instance 1: .half-type element - video thumbnail + text + CTA
  // Instance 2: ul.jeong-do-desc element - image + headings + paragraphs

  const cells = [];

  // Detect which instance: element itself may be .half-type or ul.jeong-do-desc
  const isHalfType = element.matches ? element.matches('.half-type, [class*="half-type"]') : element.className && element.className.includes('half-type');

  if (isHalfType) {
    // Brand Film CTA: .unit-box items inside .half-type
    const boxes = element.querySelectorAll(':scope > .unit-box');
    const imgBox = boxes[0];
    const textBox = boxes[1];

    const col1 = document.createDocumentFragment();
    const img = imgBox ? imgBox.querySelector('img') : null;
    if (img) col1.appendChild(img);

    const col2 = document.createDocumentFragment();
    if (textBox) {
      const bodyText = textBox.querySelector('p.body-copy, p');
      if (bodyText) {
        const p = document.createElement('p');
        p.textContent = bodyText.textContent.trim();
        col2.appendChild(p);
      }
      const cta = textBox.querySelector('.btns a, a.btn');
      if (cta) {
        const p = document.createElement('p');
        p.appendChild(cta);
        col2.appendChild(p);
      }
    }

    cells.push([col1, col2]);
  } else {
    // Jeong-Do Vision: li.unit-box items - first has image, second has content
    const items = element.querySelectorAll(':scope > li.unit-box');
    const imgItem = items[0];
    const textItem = items[1];

    const col1 = document.createDocumentFragment();
    const img = imgItem ? imgItem.querySelector('img') : null;
    if (img) col1.appendChild(img);

    const col2 = document.createDocumentFragment();
    if (textItem) {
      // Extract heading + paragraph pairs (Vision, Conduct, Management Philosophy)
      const titles = textItem.querySelectorAll('.title h2, h2');
      const paragraphs = textItem.querySelectorAll('p.body-copy, p');

      titles.forEach((title, i) => {
        const h = document.createElement('h2');
        h.textContent = title.textContent.trim();
        col2.appendChild(h);
        if (paragraphs[i]) {
          const p = document.createElement('p');
          p.textContent = paragraphs[i].textContent.trim();
          col2.appendChild(p);
        }
      });
    }

    cells.push([col1, col2]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-media', cells });
  element.replaceWith(block);
}
