/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-info variant.
 * Base block: columns. Source: lg.com/ae/about-lg/our-brand/index
 * Two-column informational layouts. Multiple instances with varied content:
 * - Company Information (table + download card)
 * - Code of Ethics (two text columns with download buttons)
 * - Global Operations (interactive selector - simplified to static)
 * - Logo Symbol Detail (large image + symbol images)
 * Columns blocks do NOT require field hints (per xwalk rules).
 * Generated: 2026-03-19
 */
export default function parse(element, { document }) {
  const cells = [];

  // Instance 1: Company Information - .component.GPC0067:has(.size-companyinfobox)
  const companyInfoBox = element.querySelector('.size-companyinfobox');
  if (companyInfoBox) {
    const col1 = document.createDocumentFragment();
    // Company info table
    const title = element.querySelector('h4.title, .title');
    if (title) {
      const h = document.createElement('h4');
      h.textContent = title.textContent.trim();
      col1.appendChild(h);
    }
    const table = element.querySelector('table');
    if (table) col1.appendChild(table);

    const col2 = document.createDocumentFragment();
    // Download card
    const downloadBox = element.querySelector('.size-downloadbox, .downloadbox');
    if (downloadBox) {
      const eyebrow = downloadBox.querySelector('.eyebrow');
      const dlTitle = downloadBox.querySelector('.title');
      const dlLink = downloadBox.querySelector('a.btn, a');
      if (eyebrow) {
        const p = document.createElement('p');
        p.textContent = eyebrow.textContent.trim();
        col2.appendChild(p);
      }
      if (dlTitle) {
        const strong = document.createElement('strong');
        strong.textContent = dlTitle.textContent.trim();
        col2.appendChild(strong);
      }
      if (dlLink) {
        const p = document.createElement('p');
        p.appendChild(dlLink);
        col2.appendChild(p);
      }
    }

    cells.push([col1, col2]);
    const block = WebImporter.Blocks.createBlock(document, { name: 'columns-info', cells });
    element.replaceWith(block);
    return;
  }

  // Instance 2: Code of Ethics - ul.jeong-do-desc.border-top with two li.unit-box
  const isJeongDoDesc = element.matches ? element.matches('ul.jeong-do-desc, [class*="jeong-do-desc"]') : element.className && element.className.includes('jeong-do-desc');
  if (isJeongDoDesc) {
    const items = element.querySelectorAll(':scope > li.unit-box');

    // Check if this is a two-column text layout (Code of Ethics)
    // vs a image + text layout (Jeong-Do Vision, handled by columns-media)
    const firstItemImg = items[0] && items[0].querySelector('img');
    if (!firstItemImg && items.length >= 2) {
      // Two-column text: each item is a column
      items.forEach((item) => {
        const col = document.createDocumentFragment();
        const headings = item.querySelectorAll('.title h2, h2');
        const paragraphs = item.querySelectorAll('p.body-copy, p');
        const downloadLink = item.querySelector('.btn-box a, a.btn');

        headings.forEach((h) => {
          const heading = document.createElement('h2');
          heading.textContent = h.textContent.trim();
          col.appendChild(heading);
        });
        paragraphs.forEach((p) => {
          const para = document.createElement('p');
          para.textContent = p.textContent.trim();
          col.appendChild(para);
        });
        if (downloadLink) {
          const p = document.createElement('p');
          p.appendChild(downloadLink);
          col.appendChild(p);
        }
        cells.push(col);
      });

      // Wrap into a single row with two columns
      const row = cells.length >= 2 ? [cells[0], cells[1]] : [cells[0] || ''];
      const block = WebImporter.Blocks.createBlock(document, { name: 'columns-info', cells: [row] });
      element.replaceWith(block);
      return;
    }
  }

  // Instance 3: Global Operations - div.global-operations
  const globalOps = element.matches ? element.matches('.global-operations, [class*="global-operations"]') : element.className && element.className.includes('global-operations');
  if (globalOps) {
    // Simplified: extract region data as static columns
    const col1 = document.createDocumentFragment();
    const heading = element.querySelector('.heading-box .title, .title');
    if (heading) {
      const h = document.createElement('h3');
      h.textContent = heading.textContent.trim();
      col1.appendChild(h);
    }
    const desc = element.querySelector('.head-copy, p');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      col1.appendChild(p);
    }

    const col2 = document.createDocumentFragment();
    // Extract visible table data if available
    const resultRows = element.querySelectorAll('.result-table tr, table tr');
    resultRows.forEach((tr) => {
      const text = tr.textContent.trim();
      if (text) {
        const p = document.createElement('p');
        p.textContent = text;
        col2.appendChild(p);
      }
    });
    if (!col2.hasChildNodes()) {
      const p = document.createElement('p');
      p.textContent = 'Global operations information';
      col2.appendChild(p);
    }

    cells.push([col1, col2]);
    const block = WebImporter.Blocks.createBlock(document, { name: 'columns-info', cells });
    element.replaceWith(block);
    return;
  }

  // Instance 4: Logo Symbol Detail - .component.GPC0069:has(.img-lt-lg)
  const logoDetail = element.querySelector('.img-lt-lg');
  if (logoDetail) {
    const col1 = document.createDocumentFragment();
    const mainImg = logoDetail.querySelector('img');
    if (mainImg) col1.appendChild(mainImg);
    const note = logoDetail.querySelector('.txt');
    if (note) {
      const p = document.createElement('p');
      p.textContent = note.textContent.trim();
      col1.appendChild(p);
    }

    const col2 = document.createDocumentFragment();
    const rightCol = element.querySelector('.col-lg-4');
    if (rightCol) {
      const symbolTypes = rightCol.querySelectorAll('[class*="img-rt-sm"]');
      symbolTypes.forEach((sym) => {
        // Get label text (before the img)
        const labelText = sym.childNodes[0] && sym.childNodes[0].textContent ? sym.childNodes[0].textContent.trim() : '';
        if (labelText) {
          const p = document.createElement('p');
          const strong = document.createElement('strong');
          strong.textContent = labelText;
          p.appendChild(strong);
          col2.appendChild(p);
        }
        const img = sym.querySelector('img');
        if (img) col2.appendChild(img);
      });
    }

    cells.push([col1, col2]);
    const block = WebImporter.Blocks.createBlock(document, { name: 'columns-info', cells });
    element.replaceWith(block);
    return;
  }

  // Fallback: generic two-column extraction
  const children = element.querySelectorAll(':scope > div, :scope > li');
  if (children.length >= 2) {
    cells.push([children[0], children[1]]);
  }
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-info', cells });
  element.replaceWith(block);
}
