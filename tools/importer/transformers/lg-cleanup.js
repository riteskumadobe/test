/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: LG UAE site cleanup.
 * Removes non-authorable chrome (header, footer, nav, banners, modals, breadcrumbs).
 * All selectors from captured DOM of lg.com/ae pages (about-lg/our-brand, business/commercial-laundry).
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove browser check popup modal (line 6: #modal_browse_supported_guide)
    // Remove notice banner wrap (line 45: .gnb-notice-banner-wrap)
    // Remove sr-only meta block (line 33: .sr-only)
    WebImporter.DOMUtils.remove(element, [
      '#modal_browse_supported_guide',
      '.gnb-notice-banner-wrap',
      '.sr-only',
    ]);
  }

  if (hookName === H.after) {
    // Remove header navigation (line 58: header#header)
    // Remove skip nav (line 42: .skip_nav)
    // Remove breadcrumbs (line 2047: nav.breadcrumb)
    // Remove footer boxes (line 5026+: .footer-box)
    // Remove footer main contents (line 5038: footer.footer-main-contents)
    // Remove iframes, link tags, noscript
    WebImporter.DOMUtils.remove(element, [
      'header#header',
      'header.navigation',
      '.skip_nav',
      'nav.breadcrumb',
      '.footer-box',
      'footer.footer-main-contents',
      'iframe',
      'link',
      'noscript',
      'script',
      '.GPC0076.floating-menu',
    ]);

    // Remove tracking/analytics attributes from all elements
    element.querySelectorAll('[data-track-group]').forEach((el) => {
      el.removeAttribute('data-track-group');
      el.removeAttribute('data-track-name');
      el.removeAttribute('data-track-opt');
    });
    element.querySelectorAll('[onclick]').forEach((el) => {
      el.removeAttribute('onclick');
    });
  }
}
