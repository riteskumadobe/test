/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-timeline variant.
 * Base block: carousel. Source: lg.com/ae/about-lg/our-brand/index
 * History timeline carousel with era images and milestone lists per slide.
 * UE Model: media_image (reference), media_imageAlt (collapsed), content_text (richtext)
 * Generated: 2026-03-19
 */
export default function parse(element, { document }) {
  // Source: .history-slide > .historylist > .item divs
  // Each .item has: .img.unit-box > img and .list.unit-box > dl elements (dt=year, dd=description)
  const slides = element.querySelectorAll('.historylist > .item, .historylist .item');
  const cells = [];

  slides.forEach((slide) => {
    const img = slide.querySelector('.img img, img');
    const milestones = slide.querySelectorAll('dl');

    // Cell 1: image with field hint
    const imgCell = document.createDocumentFragment();
    imgCell.appendChild(document.createComment(' field:media_image '));
    if (img) imgCell.appendChild(img);

    // Cell 2: text content (milestones list) with field hint
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:content_text '));

    milestones.forEach((dl) => {
      const year = dl.querySelector('dt');
      const desc = dl.querySelector('dd');
      if (year) {
        const strong = document.createElement('strong');
        strong.textContent = year.textContent.trim();
        textCell.appendChild(strong);
        textCell.appendChild(document.createTextNode(' - '));
      }
      if (desc) {
        const span = document.createElement('span');
        span.textContent = desc.textContent.trim();
        textCell.appendChild(span);
      }
      textCell.appendChild(document.createElement('br'));
    });

    cells.push([imgCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-timeline', cells });
  element.replaceWith(block);
}
