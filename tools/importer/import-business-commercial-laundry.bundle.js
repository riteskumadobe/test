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

  // tools/importer/import-business-commercial-laundry.js
  var import_business_commercial_laundry_exports = {};
  __export(import_business_commercial_laundry_exports, {
    default: () => import_business_commercial_laundry_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const bgImage = element.querySelector("img.pc, img.lazyloaded, .visual-area img");
    const heading = element.querySelector(".title h2, .title h1, h2, h1");
    const description = element.querySelector(".copy");
    const ctaLink = element.querySelector(".cta a, .cta-button a");
    const cells = [];
    if (bgImage) {
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:image "));
      imgFrag.appendChild(bgImage);
      cells.push([imgFrag]);
    }
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(" field:text "));
    if (heading) textFrag.appendChild(heading);
    if (description) textFrag.appendChild(description);
    if (ctaLink) {
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      strong.appendChild(ctaLink);
      p.appendChild(strong);
      textFrag.appendChild(p);
    }
    cells.push([textFrag]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-promo.js
  function parse2(element, { document }) {
    const bgImage = element.querySelector("img.pc, img.lazyloaded, .visual-area img");
    const heading = element.querySelector(".title h3, .title h2, .title h1, h3, h2");
    const description = element.querySelector(".copy");
    const ctaLink = element.querySelector(".cta a, .cta-button a");
    const cells = [];
    if (bgImage) {
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:media_image "));
      imgFrag.appendChild(bgImage);
      cells.push([imgFrag]);
    }
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(" field:content_text "));
    if (heading) textFrag.appendChild(heading);
    if (description) textFrag.appendChild(description);
    if (ctaLink) {
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      strong.appendChild(ctaLink);
      p.appendChild(strong);
      textFrag.appendChild(p);
    }
    cells.push([textFrag]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-resource.js
  function parse3(element, { document }) {
    const cards = element.querySelectorAll(".square");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector("img.pc-lg, img.lazyloaded, .visual-area img");
      const heading = card.querySelector(".head h2, .head h3, h2, h3");
      const desc = card.querySelector(".desc");
      const link = card.querySelector("a.common-area");
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:image "));
      if (img) imgFrag.appendChild(img);
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      if (heading) {
        if (link) {
          const a = document.createElement("a");
          a.href = link.href;
          a.textContent = heading.textContent.trim();
          const h = document.createElement("p");
          const strong = document.createElement("strong");
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
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-resource", cells });
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
        "script",
        ".GPC0076.floating-menu"
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

  // tools/importer/import-business-commercial-laundry.js
  var parsers = {
    "hero": parse,
    "hero-promo": parse2,
    "cards-resource": parse3
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "business-commercial-laundry",
    description: "LG UAE B2B commercial laundry category page showcasing commercial washing machines and dryers for business customers",
    urls: [
      "https://www.lg.com/ae/business/commercial-laundry"
    ],
    blocks: [
      {
        name: "hero",
        instances: [".component.GPC0078"]
      },
      {
        name: "hero-promo",
        instances: [
          "#iw_comp1587097986691 .component.GPC0055",
          "#iw_comp1587097986754 .component.GPC0055",
          "#iw_comp1587097986768 .component.GPC0055",
          "#iw_comp1587097986790 .component.GPC0055"
        ]
      },
      {
        name: "cards-resource",
        instances: [".component.GPC0059.type-triple"]
      }
    ],
    sections: [
      {
        id: "s1",
        name: "Page Title",
        selector: ".component.GPC0054",
        style: null,
        blocks: [],
        defaultContent: [".component.GPC0054 h1", ".component.GPC0054 .copy"]
      },
      {
        id: "s2",
        name: "Hero Banner",
        selector: ".component.GPC0078",
        style: null,
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "s3",
        name: "Product Feature - Titan-C",
        selector: "#iw_comp1587097986691 .component.GPC0055",
        style: null,
        blocks: ["hero-promo"],
        defaultContent: []
      },
      {
        id: "s4",
        name: "Product Feature - Giant-C+",
        selector: "#iw_comp1587097986754 .component.GPC0055",
        style: null,
        blocks: ["hero-promo"],
        defaultContent: []
      },
      {
        id: "s5",
        name: "Product Feature - Atom",
        selector: "#iw_comp1587097986768 .component.GPC0055",
        style: null,
        blocks: ["hero-promo"],
        defaultContent: []
      },
      {
        id: "s6",
        name: "Resource Cards",
        selector: ".component.GPC0059.type-triple",
        style: null,
        blocks: ["cards-resource"],
        defaultContent: []
      },
      {
        id: "s7",
        name: "Contact CTA Banner",
        selector: "#iw_comp1587097986790 .component.GPC0055",
        style: null,
        blocks: ["hero-promo"],
        defaultContent: []
      }
    ]
  };
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
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_business_commercial_laundry_default = {
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
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
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
  return __toCommonJS(import_business_commercial_laundry_exports);
})();
