/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-promo block.
 * Base: hero. Source: https://www.lg.com/ae/business/commercial-laundry
 * Selectors: #iw_comp1587097986691 .component.GPC0055 (Titan-C),
 *            #iw_comp1587097986754 .component.GPC0055 (Giant-C+),
 *            #iw_comp1587097986768 .component.GPC0055 (Atom),
 *            #iw_comp1587097986790 .component.GPC0055 (Contact Us)
 * UE Model fields: media_image (reference), media_imageAlt (collapsed), content_text (richtext)
 */
export default function parse(element, { document }) {
  // Row 1: Background/product image
  const bgImage = element.querySelector('img.pc, img.lazyloaded, .visual-area img');

  // Row 2: Text content (heading + description + CTA)
  const heading = element.querySelector('.title h3, .title h2, .title h1, h3, h2');
  const description = element.querySelector('.copy');
  const ctaLink = element.querySelector('.cta a, .cta-button a');

  const cells = [];

  // Row 1: media image with field hint
  if (bgImage) {
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:media_image '));
    imgFrag.appendChild(bgImage);
    cells.push([imgFrag]);
  }

  // Row 2: content text with field hint
  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:content_text '));
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-promo', cells });
  element.replaceWith(block);
}
