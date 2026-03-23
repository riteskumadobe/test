/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-download variant.
 * Base block: cards. Source: lg.com/ae/about-lg/our-brand/index
 * Logo download cards with image, title, applicable items list, and download button.
 * UE Model: image (reference), text (richtext)
 * Generated: 2026-03-19
 */
export default function parse(element, { document }) {
  // Source: .symbol-list contains li.unit-box items
  // Each item has .title (logo name), .border-top.border-bottom > img,
  // .symbol-desc > p.text + ul.bullet-text + .btn-box > a
  const items = element.querySelectorAll(':scope > li.unit-box');
  const cells = [];

  items.forEach((item) => {
    const img = item.querySelector('.border-top img, .border-bottom img, img');
    const title = item.querySelector('.title');
    const desc = item.querySelector('.symbol-desc');

    // Cell 1: image with field hint
    const imgCell = document.createDocumentFragment();
    imgCell.appendChild(document.createComment(' field:image '));
    if (img) imgCell.appendChild(img);

    // Cell 2: text content with field hint
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    if (title) {
      const h = document.createElement('strong');
      h.textContent = title.textContent.trim();
      textCell.appendChild(h);
    }

    if (desc) {
      // Applicable items label
      const label = desc.querySelector('p.text');
      if (label) {
        const p = document.createElement('p');
        p.textContent = label.textContent.trim();
        textCell.appendChild(p);
      }

      // Bullet list of applicable items
      const bulletList = desc.querySelector('ul.bullet-text');
      if (bulletList) {
        textCell.appendChild(bulletList);
      }

      // Download button
      const downloadLink = desc.querySelector('.btn-box a, a.btn');
      if (downloadLink) {
        const p = document.createElement('p');
        p.appendChild(downloadLink);
        textCell.appendChild(p);
      }
    }

    cells.push([imgCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-download', cells });
  element.replaceWith(block);
}
