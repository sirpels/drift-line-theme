(function() {
  'use strict';

  if (window.DriftLineCartInit) {
    window.DriftLineCartInit(document);
    return;
  }

  var initialized = new WeakSet();
  var debounceMs = 600;

  function initialize(scope) {
    var forms = Array.from(scope.querySelectorAll('form[data-cart-form]'));
    if (scope.matches && scope.matches('form[data-cart-form]')) forms.unshift(scope);

    forms.forEach(function(form) {
      if (initialized.has(form) || typeof form.requestSubmit !== 'function' ||
          typeof window.requestAnimationFrame !== 'function') return;

      var inputs = Array.from(form.querySelectorAll('input[name="updates[]"]'));
      var updateButton = form.querySelector('[data-cart-update]');
      var status = form.querySelector('[data-cart-status]');
      if (!inputs.length || !updateButton || !status) return;

      var originalQuantities = inputs.map(function(input) { return Number(input.value); });
      var timer = null;
      var revision = 0;
      var submitting = false;

      function valuesAreValid() {
        return inputs.every(function(input) {
          return /^\d+$/.test(input.value) &&
            Number.isSafeInteger(Number(input.value)) &&
            input.checkValidity();
        });
      }

      function quantitiesChanged() {
        return inputs.some(function(input, index) {
          return Number(input.value) !== originalQuantities[index];
        });
      }

      function scheduleUpdate() {
        if (submitting) return;
        revision += 1;
        var currentRevision = revision;
        clearTimeout(timer);
        status.textContent = '';

        if (!valuesAreValid() || !quantitiesChanged()) return;

        timer = setTimeout(function() {
          if (!form.isConnected || submitting || currentRevision !== revision ||
              !valuesAreValid() || !quantitiesChanged()) return;

          status.textContent = 'Updating cart...';
          window.requestAnimationFrame(function() {
            if (!form.isConnected || submitting || currentRevision !== revision ||
                !valuesAreValid() || !quantitiesChanged()) return;
            form.requestSubmit(updateButton);
          });
        }, debounceMs);
      }

      inputs.forEach(function(input) {
        input.addEventListener('input', scheduleUpdate);
        input.addEventListener('change', scheduleUpdate);
      });

      form.addEventListener('submit', function() {
        clearTimeout(timer);
        submitting = true;
      });

      initialized.add(form);
      form.setAttribute('data-cart-enhanced', '');
    });
  }

  window.DriftLineCartInit = initialize;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { initialize(document); }, { once: true });
  } else {
    initialize(document);
  }

  document.addEventListener('shopify:section:load', function(event) {
    initialize(event.target);
  });
})();
