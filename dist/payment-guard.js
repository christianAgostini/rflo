// Complementary browser-side protection. This is not external monitoring.
(() => {
  'use strict';

  const ACCEPTA_PAYMENT_URL = 'https://gateway.ezpaycenters.net/RFLO/PmtForm';
  const options = document.getElementById('payment-online-slot');
  const originalLink = document.getElementById('online-payment');
  if (!options || !originalLink) return;

  // Retain the intended element so removing or replacing it can be repaired.
  const expectedAttributes = Object.freeze({
    href: ACCEPTA_PAYMENT_URL,
    target: '_blank',
    rel: 'noopener noreferrer'
  });

  function restoreLink() {
    let changed = false;
    if (options.firstElementChild !== originalLink) {
      const replacement = options.firstElementChild;
      if (replacement && replacement.getAttribute('href') !== 'tel:+17879933731') {
        replacement.replaceWith(originalLink);
      } else {
        options.prepend(originalLink);
      }
      changed = true;
    }

    for (const [name, value] of Object.entries(expectedAttributes)) {
      if (originalLink.getAttribute(name) !== value) {
        originalLink.setAttribute(name, value);
        changed = true;
      }
    }

    if (changed) {
      // Local signal only; no email, external alert, or submitted visitor data.
      console.warn('[RFLO] Payment link integrity check restored the authorized link.');
      window.dispatchEvent(new CustomEvent('rflo:payment-link-restored'));
    }
    return changed;
  }

  // Check synchronously before click/keyboard activation or opening a link menu.
  function validateActivation(event) {
    const link = event.target instanceof Element ? event.target.closest('a') : null;
    if (!link || !options.contains(link)) return;
    if (link !== originalLink && link.getAttribute('href') === 'tel:+17879933731') return;

    const invalid = link !== originalLink ||
      Object.entries(expectedAttributes).some(([name, value]) => link.getAttribute(name) !== value);
    if (invalid) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    restoreLink();
  }

  ['click', 'auxclick', 'contextmenu'].forEach((type) => {
    window.addEventListener(type, validateActivation, true);
  });

  restoreLink();
  const observer = new MutationObserver(restoreLink);
  observer.observe(options, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['href', 'target', 'rel']
  });
})();
