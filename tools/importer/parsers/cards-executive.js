/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-executive variant.
 * Base block: cards. Source: lg.com/ae/about-lg/our-brand/index
 * Executive profile cards with photo, name, and job title.
 * UE Model: image (reference), text (richtext)
 * Generated: 2026-03-19
 */
export default function parse(element, { document }) {
  // Source: .executive-list contains .unit-box > .person items
  // Each .person has .img > img, .title (name), .body-copy.small (job title)
  const persons = element.querySelectorAll('.person');
  const cells = [];

  persons.forEach((person) => {
    const img = person.querySelector('.img img, img');
    const name = person.querySelector('.title');
    const jobTitle = person.querySelector('.body-copy, .body-copy.small');

    // Cell 1: image with field hint
    const imgCell = document.createDocumentFragment();
    imgCell.appendChild(document.createComment(' field:image '));
    if (img) imgCell.appendChild(img);

    // Cell 2: text content (name + job title) with field hint
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (name) {
      const h = document.createElement('strong');
      h.textContent = name.textContent.trim();
      textCell.appendChild(h);
    }
    if (jobTitle) {
      const p = document.createElement('p');
      p.textContent = jobTitle.textContent.trim();
      textCell.appendChild(p);
    }

    cells.push([imgCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-executive', cells });
  element.replaceWith(block);
}
