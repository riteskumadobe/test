/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-resource block.
 * Base: cards. Source: https://www.lg.com/ae/business/commercial-laundry
 * Selector: .component.GPC0059.type-triple
 * UE Model: container block with repeatable card group (image + text)
 * Each .square element = one card row with image (col 1) and text (col 2)
 */
export default function parse(element, { document }) {
  const cards = element.querySelectorAll('.square');
  const cells = [];

  cards.forEach((card) => {
    const img = card.querySelector('img.pc-lg, img.lazyloaded, .visual-area img');
    const heading = card.querySelector('.head h2, .head h3, h2, h3');
    const desc = card.querySelector('.desc');
    const link = card.querySelector('a.common-area');

    // Column 1: image with field hint
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    if (img) imgFrag.appendChild(img);

    // Column 2: text content with field hint
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    if (heading) {
      if (link) {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = heading.textContent.trim();
        const h = document.createElement('p');
        const strong = document.createElement('strong');
        strong.appendChild(a);
        h.appendChild(strong);
        textFrag.appendChild(h);
      } else {
        textFrag.appendChild(heading);
      }
    }
    if (desc) textFrag.appendChild(desc);

    cells.push([imgFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-resource', cells });
  element.replaceWith(block);
}
