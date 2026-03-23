var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-about-brand.js
  var import_about_brand_exports = {};
  __export(import_about_brand_exports, {
    default: () => import_about_brand_default
  });

  // tools/importer/parsers/cards-feature.js
  function parse(element, { document }) {
    const items = element.querySelectorAll(".unit-box");
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector(".visual-area img, img");
      const title = item.querySelector("h4.title, .title");
      const desc = item.querySelector("p.body-copy, p");
      const imgCell = document.createDocumentFragment();
      imgCell.appendChild(document.createComment(" field:media_image "));
      if (img) imgCell.appendChild(img);
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:content_text "));
      if (title) {
        const h = document.createElement("strong");
        h.textContent = title.textContent.replace(/\s+/g, " ").trim();
        textCell.appendChild(h);
      }
      if (desc) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.trim();
        textCell.appendChild(p);
      }
      cells.push([imgCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-media.js
  function parse2(element, { document }) {
    const cells = [];
    const isHalfType = element.matches ? element.matches('.half-type, [class*="half-type"]') : element.className && element.className.includes("half-type");
    if (isHalfType) {
      const boxes = element.querySelectorAll(":scope > .unit-box");
      const imgBox = boxes[0];
      const textBox = boxes[1];
      const col1 = document.createDocumentFragment();
      const img = imgBox ? imgBox.querySelector("img") : null;
      if (img) col1.appendChild(img);
      const col2 = document.createDocumentFragment();
      if (textBox) {
        const bodyText = textBox.querySelector("p.body-copy, p");
        if (bodyText) {
          const p = document.createElement("p");
          p.textContent = bodyText.textContent.trim();
          col2.appendChild(p);
        }
        const cta = textBox.querySelector(".btns a, a.btn");
        if (cta) {
          const p = document.createElement("p");
          p.appendChild(cta);
          col2.appendChild(p);
        }
      }
      cells.push([col1, col2]);
    } else {
      const items = element.querySelectorAll(":scope > li.unit-box");
      const imgItem = items[0];
      const textItem = items[1];
      const col1 = document.createDocumentFragment();
      const img = imgItem ? imgItem.querySelector("img") : null;
      if (img) col1.appendChild(img);
      const col2 = document.createDocumentFragment();
      if (textItem) {
        const titles = textItem.querySelectorAll(".title h2, h2");
        const paragraphs = textItem.querySelectorAll("p.body-copy, p");
        titles.forEach((title, i) => {
          const h = document.createElement("h2");
          h.textContent = title.textContent.trim();
          col2.appendChild(h);
          if (paragraphs[i]) {
            const p = document.createElement("p");
            p.textContent = paragraphs[i].textContent.trim();
            col2.appendChild(p);
          }
        });
      }
      cells.push([col1, col2]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-media", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-info.js
  function parse3(element, { document }) {
    const cells = [];
    const companyInfoBox = element.querySelector(".size-companyinfobox");
    if (companyInfoBox) {
      const col1 = document.createDocumentFragment();
      const title = element.querySelector("h4.title, .title");
      if (title) {
        const h = document.createElement("h4");
        h.textContent = title.textContent.trim();
        col1.appendChild(h);
      }
      const table = element.querySelector("table");
      if (table) col1.appendChild(table);
      const col2 = document.createDocumentFragment();
      const downloadBox = element.querySelector(".size-downloadbox, .downloadbox");
      if (downloadBox) {
        const eyebrow = downloadBox.querySelector(".eyebrow");
        const dlTitle = downloadBox.querySelector(".title");
        const dlLink = downloadBox.querySelector("a.btn, a");
        if (eyebrow) {
          const p = document.createElement("p");
          p.textContent = eyebrow.textContent.trim();
          col2.appendChild(p);
        }
        if (dlTitle) {
          const strong = document.createElement("strong");
          strong.textContent = dlTitle.textContent.trim();
          col2.appendChild(strong);
        }
        if (dlLink) {
          const p = document.createElement("p");
          p.appendChild(dlLink);
          col2.appendChild(p);
        }
      }
      cells.push([col1, col2]);
      const block2 = WebImporter.Blocks.createBlock(document, { name: "columns-info", cells });
      element.replaceWith(block2);
      return;
    }
    const isJeongDoDesc = element.matches ? element.matches('ul.jeong-do-desc, [class*="jeong-do-desc"]') : element.className && element.className.includes("jeong-do-desc");
    if (isJeongDoDesc) {
      const items = element.querySelectorAll(":scope > li.unit-box");
      const firstItemImg = items[0] && items[0].querySelector("img");
      if (!firstItemImg && items.length >= 2) {
        items.forEach((item) => {
          const col = document.createDocumentFragment();
          const headings = item.querySelectorAll(".title h2, h2");
          const paragraphs = item.querySelectorAll("p.body-copy, p");
          const downloadLink = item.querySelector(".btn-box a, a.btn");
          headings.forEach((h) => {
            const heading = document.createElement("h2");
            heading.textContent = h.textContent.trim();
            col.appendChild(heading);
          });
          paragraphs.forEach((p) => {
            const para = document.createElement("p");
            para.textContent = p.textContent.trim();
            col.appendChild(para);
          });
          if (downloadLink) {
            const p = document.createElement("p");
            p.appendChild(downloadLink);
            col.appendChild(p);
          }
          cells.push(col);
        });
        const row = cells.length >= 2 ? [cells[0], cells[1]] : [cells[0] || ""];
        const block2 = WebImporter.Blocks.createBlock(document, { name: "columns-info", cells: [row] });
        element.replaceWith(block2);
        return;
      }
    }
    const globalOps = element.matches ? element.matches('.global-operations, [class*="global-operations"]') : element.className && element.className.includes("global-operations");
    if (globalOps) {
      const col1 = document.createDocumentFragment();
      const heading = element.querySelector(".heading-box .title, .title");
      if (heading) {
        const h = document.createElement("h3");
        h.textContent = heading.textContent.trim();
        col1.appendChild(h);
      }
      const desc = element.querySelector(".head-copy, p");
      if (desc) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.trim();
        col1.appendChild(p);
      }
      const col2 = document.createDocumentFragment();
      const resultRows = element.querySelectorAll(".result-table tr, table tr");
      resultRows.forEach((tr) => {
        const text = tr.textContent.trim();
        if (text) {
          const p = document.createElement("p");
          p.textContent = text;
          col2.appendChild(p);
        }
      });
      if (!col2.hasChildNodes()) {
        const p = document.createElement("p");
        p.textContent = "Global operations information";
        col2.appendChild(p);
      }
      cells.push([col1, col2]);
      const block2 = WebImporter.Blocks.createBlock(document, { name: "columns-info", cells });
      element.replaceWith(block2);
      return;
    }
    const logoDetail = element.querySelector(".img-lt-lg");
    if (logoDetail) {
      const col1 = document.createDocumentFragment();
      const mainImg = logoDetail.querySelector("img");
      if (mainImg) col1.appendChild(mainImg);
      const note = logoDetail.querySelector(".txt");
      if (note) {
        const p = document.createElement("p");
        p.textContent = note.textContent.trim();
        col1.appendChild(p);
      }
      const col2 = document.createDocumentFragment();
      const rightCol = element.querySelector(".col-lg-4");
      if (rightCol) {
        const symbolTypes = rightCol.querySelectorAll('[class*="img-rt-sm"]');
        symbolTypes.forEach((sym) => {
          const labelText = sym.childNodes[0] && sym.childNodes[0].textContent ? sym.childNodes[0].textContent.trim() : "";
          if (labelText) {
            const p = document.createElement("p");
            const strong = document.createElement("strong");
            strong.textContent = labelText;
            p.appendChild(strong);
            col2.appendChild(p);
          }
          const img = sym.querySelector("img");
          if (img) col2.appendChild(img);
        });
      }
      cells.push([col1, col2]);
      const block2 = WebImporter.Blocks.createBlock(document, { name: "columns-info", cells });
      element.replaceWith(block2);
      return;
    }
    const children = element.querySelectorAll(":scope > div, :scope > li");
    if (children.length >= 2) {
      cells.push([children[0], children[1]]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-info", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-timeline.js
  function parse4(element, { document }) {
    const slides = element.querySelectorAll(".historylist > .item, .historylist .item");
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector(".img img, img");
      const milestones = slide.querySelectorAll("dl");
      const imgCell = document.createDocumentFragment();
      imgCell.appendChild(document.createComment(" field:media_image "));
      if (img) imgCell.appendChild(img);
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:content_text "));
      milestones.forEach((dl) => {
        const year = dl.querySelector("dt");
        const desc = dl.querySelector("dd");
        if (year) {
          const strong = document.createElement("strong");
          strong.textContent = year.textContent.trim();
          textCell.appendChild(strong);
          textCell.appendChild(document.createTextNode(" - "));
        }
        if (desc) {
          const span = document.createElement("span");
          span.textContent = desc.textContent.trim();
          textCell.appendChild(span);
        }
        textCell.appendChild(document.createElement("br"));
      });
      cells.push([imgCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-timeline", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-executive.js
  function parse5(element, { document }) {
    const persons = element.querySelectorAll(".person");
    const cells = [];
    persons.forEach((person) => {
      const img = person.querySelector(".img img, img");
      const name = person.querySelector(".title");
      const jobTitle = person.querySelector(".body-copy, .body-copy.small");
      const imgCell = document.createDocumentFragment();
      imgCell.appendChild(document.createComment(" field:image "));
      if (img) imgCell.appendChild(img);
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (name) {
        const h = document.createElement("strong");
        h.textContent = name.textContent.trim();
        textCell.appendChild(h);
      }
      if (jobTitle) {
        const p = document.createElement("p");
        p.textContent = jobTitle.textContent.trim();
        textCell.appendChild(p);
      }
      cells.push([imgCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-executive", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-download.js
  function parse6(element, { document }) {
    const items = element.querySelectorAll(":scope > li.unit-box");
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector(".border-top img, .border-bottom img, img");
      const title = item.querySelector(".title");
      const desc = item.querySelector(".symbol-desc");
      const imgCell = document.createDocumentFragment();
      imgCell.appendChild(document.createComment(" field:image "));
      if (img) imgCell.appendChild(img);
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (title) {
        const h = document.createElement("strong");
        h.textContent = title.textContent.trim();
        textCell.appendChild(h);
      }
      if (desc) {
        const label = desc.querySelector("p.text");
        if (label) {
          const p = document.createElement("p");
          p.textContent = label.textContent.trim();
          textCell.appendChild(p);
        }
        const bulletList = desc.querySelector("ul.bullet-text");
        if (bulletList) {
          textCell.appendChild(bulletList);
        }
        const downloadLink = desc.querySelector(".btn-box a, a.btn");
        if (downloadLink) {
          const p = document.createElement("p");
          p.appendChild(downloadLink);
          textCell.appendChild(p);
        }
      }
      cells.push([imgCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-download", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-banner.js
  function parse7(element, { document }) {
    const items = element.querySelectorAll("li.unit-box");
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector(".visual-area img, img");
      const heading = item.querySelector(".title h3, h3");
      const link = item.querySelector(".visual-area a, a");
      const imgCell = document.createDocumentFragment();
      imgCell.appendChild(document.createComment(" field:image "));
      if (img) imgCell.appendChild(img);
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (heading) {
        const h3 = document.createElement("h3");
        if (link && link.href) {
          const a = document.createElement("a");
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
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/lg-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#modal_browse_supported_guide",
        ".gnb-notice-banner-wrap",
        ".sr-only"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header#header",
        "header.navigation",
        ".skip_nav",
        "nav.breadcrumb",
        ".footer-box",
        "footer.footer-main-contents",
        "iframe",
        "link",
        "noscript",
        "script"
      ]);
      element.querySelectorAll("[data-track-group]").forEach((el) => {
        el.removeAttribute("data-track-group");
        el.removeAttribute("data-track-name");
        el.removeAttribute("data-track-opt");
      });
      element.querySelectorAll("[onclick]").forEach((el) => {
        el.removeAttribute("onclick");
      });
    }
  }

  // tools/importer/transformers/lg-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const reversed = [...sections].reverse();
      for (const section of reversed) {
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          try {
            sectionEl = element.querySelector(sel);
          } catch (e) {
            const simplified = sel.replace(/:contains\([^)]*\)/g, "");
            try {
              sectionEl = element.querySelector(simplified);
            } catch (e2) {
            }
          }
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (section.id !== sections[0].id) {
          const hr = document.createElement("hr");
          let target = sectionEl;
          while (target.parentElement && target.parentElement !== element) {
            target = target.parentElement;
          }
          if (target.parentElement === element) {
            target.before(hr);
          }
        }
      }
    }
  }

  // tools/importer/import-about-brand.js
  var parsers = {
    "cards-feature": parse,
    "columns-media": parse2,
    "columns-info": parse3,
    "carousel-timeline": parse4,
    "cards-executive": parse5,
    "cards-download": parse6,
    "cards-banner": parse7
  };
  var PAGE_TEMPLATE = {
    name: "about-brand",
    description: "LG UAE About - Our Brand page showcasing company brand story, values, and identity",
    urls: [
      "https://www.lg.com/ae/about-lg/our-brand/index"
    ],
    blocks: [
      {
        name: "cards-feature",
        instances: [".component.GPC0067.img4"]
      },
      {
        name: "columns-media",
        instances: [".component.GPC0062 .half-type", "ul.unit-box-list.jeong-do-desc:first-of-type"]
      },
      {
        name: "columns-info",
        instances: [".component.GPC0067:has(.size-companyinfobox)", "ul.jeong-do-desc.border-top", "div.global-operations", ".component.GPC0069:has(.img-lt-lg)"]
      },
      {
        name: "carousel-timeline",
        instances: [".history-slide"]
      },
      {
        name: "cards-executive",
        instances: [".executive-list"]
      },
      {
        name: "cards-download",
        instances: [".symbol-list"]
      },
      {
        name: "cards-banner",
        instances: [".component.GPC0062 > ul.unit-list:has(h3)"]
      }
    ],
    sections: [
      {
        id: "s1",
        name: "Page Hero",
        selector: ".component.GPC0054:has(h1)",
        style: null,
        blocks: [],
        defaultContent: [".component.GPC0054:has(h1) h1", ".component.GPC0054:has(h1) p"]
      },
      {
        id: "s2",
        name: "Anchor Navigation",
        selector: ".component.GPC0117",
        style: null,
        blocks: [],
        defaultContent: [".component.GPC0117 a.tab"]
      },
      {
        id: "s3",
        name: "Overview",
        selector: "#overview",
        style: null,
        blocks: [],
        defaultContent: ["#overview .heading-box .title", "#overview .head-copy", "#overview .body-copy"]
      },
      {
        id: "s4",
        name: "Business Divisions",
        selector: ".component.GPC0067.img4",
        style: null,
        blocks: ["cards-feature"],
        defaultContent: []
      },
      {
        id: "s5",
        name: "Brand Film CTA",
        selector: ".component.GPC0062:has(.half-type)",
        style: null,
        blocks: ["columns-media"],
        defaultContent: []
      },
      {
        id: "s6",
        name: "Company Information",
        selector: ".component.GPC0067:has(.size-companyinfobox)",
        style: null,
        blocks: ["columns-info"],
        defaultContent: []
      },
      {
        id: "s7",
        name: "History",
        selector: ["#history", ".history-slide"],
        style: null,
        blocks: ["carousel-timeline"],
        defaultContent: ["#history .heading-box .title", "#history .head-copy", "#history .body-copy"]
      },
      {
        id: "s8",
        name: "Jeong-Do Management",
        selector: ["#jeongdo-management", ".component.GPC0069:has(h2:contains('LG Way'))"],
        style: null,
        blocks: [],
        defaultContent: ["#jeongdo-management .heading-box .title", "#jeongdo-management .head-copy", ".component.GPC0069 h2", ".component.GPC0069 .text"]
      },
      {
        id: "s9",
        name: "Jeong-Do Vision",
        selector: "ul.unit-box-list.jeong-do-desc:first-of-type",
        style: null,
        blocks: ["columns-media"],
        defaultContent: []
      },
      {
        id: "s10",
        name: "Code of Ethics and Compliance",
        selector: "ul.jeong-do-desc.border-top",
        style: null,
        blocks: ["columns-info"],
        defaultContent: []
      },
      {
        id: "s11",
        name: "Executives",
        selector: ["#executives", ".executive-list"],
        style: null,
        blocks: ["cards-executive"],
        defaultContent: ["#executives .heading-box .title", "#executives .head-copy"]
      },
      {
        id: "s12",
        name: "Global Operations",
        selector: "#global-operations",
        style: null,
        blocks: ["columns-info"],
        defaultContent: ["#global-operations .heading-box .title", "#global-operations .head-copy"]
      },
      {
        id: "s13",
        name: "Brand Identity",
        selector: "#brand-identity",
        style: null,
        blocks: [],
        defaultContent: ["#brand-identity .heading-box .title h2", "#brand-identity .head-copy", "#brand-identity .body-copy"]
      },
      {
        id: "s14",
        name: "Logo Symbol Detail",
        selector: ".component.GPC0069:has(.img-lt-lg)",
        style: null,
        blocks: ["columns-info"],
        defaultContent: []
      },
      {
        id: "s15",
        name: "Logo Description",
        selector: ".component.GPC0069:has(.txt:contains('The letters'))",
        style: null,
        blocks: [],
        defaultContent: [".component.GPC0069 .txt p"]
      },
      {
        id: "s16",
        name: "Logo Downloads",
        selector: ".symbol-list",
        style: null,
        blocks: ["cards-download"],
        defaultContent: []
      },
      {
        id: "s17",
        name: "Global Links Banner",
        selector: ".component.GPC0062:has(ul.unit-list h3)",
        style: "dark",
        blocks: ["cards-banner"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        try {
          const elements = document.querySelectorAll(selector);
          elements.forEach((element) => {
            pageBlocks.push({
              name: blockDef.name,
              selector,
              element,
              section: blockDef.section || null
            });
          });
        } catch (e) {
          console.warn(`Selector not supported: ${selector} for block ${blockDef.name}`);
        }
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_about_brand_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "").replace(/\/index$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_about_brand_exports);
})();
