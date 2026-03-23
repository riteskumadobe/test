/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-feature variant.
 * Base block: cards. Source: lg.com/ae/about-lg/our-brand/index
 * Business division cards with image, h4 title, and description.
 * UE Model: media_image (reference), media_imageAlt (collapsed), content_text (richtext)
 * Generated: 2026-03-19
 */
export default function parse(element, { document }) {
  // Source: .component.GPC0067.img4 contains .overview-list.unit-box-list > .unit-box items
  // Each unit-box has .visual-area > img and .txt > h4.title + p.body-copy
  const items = element.querySelectorAll('.unit-box');
  const cells = [];

  items.forEach((item) => {
    const img = item.querySelector('.visual-area img, img');
    const title = item.querySelector('h4.title, .title');
    const desc = item.querySelector('p.body-copy, p');

    // Cell 1: image with field hint
    const imgCell = document.createDocumentFragment();
    imgCell.appendChild(document.createComment(' field:media_image '));
    if (img) imgCell.appendChild(img);

    // Cell 2: text content with field hint
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:content_text '));
    if (title) {
      const h = document.createElement('strong');
      h.textContent = title.textContent.replace(/\s+/g, ' ').trim();
      textCell.appendChild(h);
    }
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      textCell.appendChild(p);
    }

    cells.push([imgCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
