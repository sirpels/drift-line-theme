(function() {
  'use strict';

  if (window.DriftLineProductInit) {
    window.DriftLineProductInit(document);
    return;
  }

  var initialized = new WeakSet();

  function initialize(scope) {
    var sections = Array.from(scope.querySelectorAll('[data-product-section]'));
    if (scope.matches && scope.matches('[data-product-section]')) sections.unshift(scope);

    sections.forEach(function(section) {
      if (initialized.has(section)) return;
      initialized.add(section);

      var select = section.querySelector('[data-product-variant-select]');
      if (!select) return;

      var price = section.querySelector('[data-product-price]');
      var comparePrice = section.querySelector('[data-product-compare-price]');
      var sale = section.querySelector('[data-product-sale]');
      var availability = section.querySelector('[data-product-availability]');
      var submit = section.querySelector('[data-product-submit]');
      var announcement = section.querySelector('[data-product-announcement]');

      select.addEventListener('change', function() {
        var option = select.options[select.selectedIndex];
        if (!option) return;

        var available = option.dataset.variantAvailable === 'true';
        var onSale = option.dataset.variantSale === 'true';
        price.textContent = option.dataset.variantPrice;
        comparePrice.textContent = onSale ? option.dataset.variantComparePrice : '';
        comparePrice.hidden = !onSale;
        sale.hidden = !onSale;
        availability.textContent = available ? 'Available' : 'Sold out';
        availability.dataset.available = available ? 'true' : 'false';
        submit.disabled = !available;
        submit.textContent = available ? 'Add to cart' : 'Sold out';
        announcement.textContent = option.dataset.variantTitle + ': ' + option.dataset.variantPrice + '. ' + availability.textContent + '.';

        try {
          var url = new URL(window.location.href);
          url.searchParams.set('variant', option.value);
          window.history.replaceState(window.history.state, '', url.toString());
        } catch (error) {
          // The native product form remains usable if the URL cannot be updated.
        }
      });
    });
  }

  window.DriftLineProductInit = initialize;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { initialize(document); }, { once: true });
  } else {
    initialize(document);
  }

  document.addEventListener('shopify:section:load', function(event) {
    initialize(event.target);
  });
})();
