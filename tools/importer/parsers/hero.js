/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero block.
 * Base: hero. Source: https://www.lg.com/ae/business/commercial-laundry
 * Selector: .component.GPC0078
 * UE Model fields: image (reference), imageAlt (collapsed), text (richtext)
 */
export default function parse(element, { document }) {
  // Row 1: Background image
  const bgImage = element.querySelector('img.pc, img.lazyloaded, .visual-area img');

  // Row 2: Text content (heading + description + CTA)
  const heading = element.querySelector('.title h2, .title h1, h2, h1');
  const description = element.querySelector('.copy');
  const ctaLink = element.querySelector('.cta a, .cta-button a');

  const cells = [];

  // Row 1: image with field hint
  if (bgImage) {
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    imgFrag.appendChild(bgImage);
    cells.push([imgFrag]);
  }

  // Row 2: text content with field hint
  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:text '));
  if (heading) textFrag.appendChild(heading);
  if (description) textFrag.appendChild(description);
  if (ctaLink) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.appendChild(ctaLink);
    p.appendChild(strong);
    textFrag.appendChild(p);
  }
  cells.push([textFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
