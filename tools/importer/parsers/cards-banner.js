/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-banner variant.
 * Base block: cards. Source: lg.com/ae/about-lg/our-brand/index
 * Linked banner image cards with h3 headings (Global LG, Sustainability, Investor Relations).
 * UE Model: image (reference), text (richtext)
 * Generated: 2026-03-19
 */
export default function parse(element, { document }) {
  // Source: .component.GPC0062 > ul.unit-list > li.unit-box items
  // Each item has .visual-area.image > a > img and .title > h3
  const items = element.querySelectorAll('li.unit-box');
  const cells = [];

  items.forEach((item) => {
    const img = item.querySelector('.visual-area img, img');
    const heading = item.querySelector('.title h3, h3');
    const link = item.querySelector('.visual-area a, a');

    // Cell 1: image with field hint
    const imgCell = document.createDocumentFragment();
    imgCell.appendChild(document.createComment(' field:image '));
    if (img) imgCell.appendChild(img);

    // Cell 2: text content (linked heading) with field hint
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (heading) {
      const h3 = document.createElement('h3');
      if (link && link.href) {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = heading.textContent.trim();
        h3.appendChild(a);
      } else {
        h3.textContent = heading.textContent.trim();
      }
      textCell.appendChild(h3);
    }

    cells.push([imgCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-banner', cells });
  element.replaceWith(block);
}
