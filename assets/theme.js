(function() {
  'use strict';

  // Keep this developer-controlled breakpoint in sync with theme.css.
  var responsiveQuery = '(max-width: 900px)';
  var controllers = new Map();
  var scrollOwners = new Set();
  var scrollSnapshot = null;

  function lockScroll(owner) {
    if (scrollOwners.has(owner)) return;
    if (scrollOwners.size === 0) {
      var body = document.body;
      var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      scrollSnapshot = {
        x: window.scrollX,
        y: window.scrollY,
        hadClass: document.documentElement.classList.contains('header-menu-scroll-lock'),
        styles: ['top', 'padding-right'].map(function(name) {
          return [name, body.style.getPropertyValue(name), body.style.getPropertyPriority(name)];
        })
      };
      var padding = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
      body.style.setProperty('top', -scrollSnapshot.y + 'px');
      body.style.setProperty('padding-right', padding + Math.max(0, scrollbarWidth) + 'px');
      document.documentElement.classList.add('header-menu-scroll-lock');
    }
    scrollOwners.add(owner);
  }

  function unlockScroll(owner) {
    if (!scrollOwners.delete(owner) || scrollOwners.size > 0) return;
    scrollSnapshot.styles.forEach(function(style) {
      if (style[1]) document.body.style.setProperty(style[0], style[1], style[2]);
      else document.body.style.removeProperty(style[0]);
    });
    if (!scrollSnapshot.hadClass) document.documentElement.classList.remove('header-menu-scroll-lock');
    window.scrollTo({ left: scrollSnapshot.x, top: scrollSnapshot.y, behavior: 'instant' });
    scrollSnapshot = null;
  }

  class HeaderController {
    constructor(root) {
      this.root = root;
      this.toggle = root.querySelector('[data-theme-toggle]');
      this.trigger = root.querySelector('[data-menu-trigger]');
      this.panel = root.querySelector('[data-menu-panel]');
      this.desktopNav = root.querySelector('[data-desktop-navigation]');
      this.closeButton = root.querySelector('[data-menu-close]');
      this.modal = this.panel && this.panel.tagName === 'DIALOG';
      this.opened = false;
      this.enhanced = false;
      this.cleanup = [];
    }

    listen(target, name, handler) {
      target.addEventListener(name, handler);
      this.cleanup.push(function() { target.removeEventListener(name, handler); });
    }

    updateTheme(theme) {
      if (!this.toggle) return;
      var dark = theme === 'dark';
      this.toggle.setAttribute('aria-pressed', dark ? 'true' : 'false');
      this.toggle.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
    }

    init() {
      if (this.toggle) {
        this.listen(this.toggle, 'click', () => {
          var theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', theme);
          try { localStorage.setItem('go-crazy-theme', theme); } catch (error) {}
          controllers.forEach(function(controller) { controller.updateTheme(theme); });
        });
        this.updateTheme(document.documentElement.getAttribute('data-theme') || 'light');
        this.toggle.disabled = false;
      }

      if (!this.trigger || !this.panel || !this.desktopNav || !this.closeButton || !window.matchMedia) return;
      // Unsupported dialogs retain the ordinary visible navigation instead.
      if (this.modal && typeof this.panel.showModal !== 'function') return;
      this.media = window.matchMedia(responsiveQuery);
      this.listen(this.trigger, 'click', () => {
        if (this.opened) this.close(true);
        else this.open();
      });
      this.listen(this.closeButton, 'click', () => this.close(true));

      if (this.modal) {
        this.listen(this.panel, 'cancel', (event) => {
          event.preventDefault();
          this.close(true);
        });
        this.listen(this.panel, 'close', () => {
          if (!this.panel.open && this.opened) this.close(true);
        });
      } else {
        this.listen(document, 'keydown', (event) => {
          if (event.key === 'Escape' && this.opened &&
              (this.panel.contains(event.target) || this.trigger.contains(event.target))) {
            event.preventDefault();
            this.close(true);
          }
        });
        this.listen(document, 'pointerdown', (event) => {
          if (this.opened && !this.panel.contains(event.target) && !this.trigger.contains(event.target)) {
            this.close(false);
          }
        });
        this.listen(document, 'focusin', (event) => {
          if (this.opened && !this.panel.contains(event.target) && !this.trigger.contains(event.target)) {
            this.close(false);
          }
        });
      }

      var onMediaChange = () => this.syncBreakpoint();
      if (this.media.addEventListener) this.listen(this.media, 'change', onMediaChange);
      else {
        this.media.addListener(onMediaChange);
        this.cleanup.push(() => this.media.removeListener(onMediaChange));
      }

      this.enhanced = true;
      this.root.setAttribute('data-header-enhanced', '');
      this.syncBreakpoint();
    }

    syncBreakpoint() {
      var active = document.activeElement;
      if (this.media.matches) {
        this.trigger.hidden = false;
        if (this.desktopNav.contains(active)) this.trigger.focus({ preventScroll: true });
      } else {
        var moveFocus = this.panel.contains(active) || active === this.trigger;
        this.close(false);
        this.trigger.hidden = true;
        if (moveFocus) {
          var destination = this.desktopNav.querySelector('a') || this.root.querySelector('.site-header__brand');
          if (destination) destination.focus({ preventScroll: true });
        }
      }
    }

    open() {
      if (!this.enhanced || !this.media.matches || this.opened) return;
      this.panel.hidden = false;
      if (this.modal) {
        try { this.panel.showModal(); }
        catch (error) {
          this.panel.hidden = true;
          this.trigger.hidden = true;
          this.root.removeAttribute('data-header-enhanced');
          this.enhanced = false;
          return;
        }
        lockScroll(this);
      }
      this.opened = true;
      this.trigger.setAttribute('aria-expanded', 'true');
      if (this.modal) this.closeButton.focus({ preventScroll: true });
    }

    close(restoreFocus) {
      var wasOpen = this.opened;
      this.opened = false;
      if (this.trigger) this.trigger.setAttribute('aria-expanded', 'false');
      if (this.modal && this.panel.open) this.panel.close();
      if (this.panel) this.panel.hidden = true;
      unlockScroll(this);
      if (wasOpen && restoreFocus && this.media.matches && this.root.isConnected) {
        this.trigger.focus({ preventScroll: true });
      }
    }

    destroy() {
      this.close(false);
      this.cleanup.forEach(function(dispose) { dispose(); });
      this.cleanup = [];
      this.root.removeAttribute('data-header-enhanced');
      if (this.trigger) this.trigger.hidden = true;
      if (this.toggle) this.toggle.disabled = true;
      this.enhanced = false;
    }
  }

  function initializeHeaders(scope) {
    controllers.forEach(function(controller, root) {
      if (!root.isConnected) {
        controller.destroy();
        controllers.delete(root);
      }
    });
    var roots = Array.from(scope.querySelectorAll('[data-site-header]'));
    if (scope.matches && scope.matches('[data-site-header]')) roots.unshift(scope);
    roots.forEach(function(root) {
      if (controllers.has(root)) return;
      var controller = new HeaderController(root);
      controllers.set(root, controller);
      try { controller.init(); }
      catch (error) {
        controller.destroy();
        controllers.delete(root);
        console.error('Header initialization failed; ordinary navigation remains available.', error);
      }
    });
  }

  initializeHeaders(document);
  document.addEventListener('shopify:section:load', function(event) {
    initializeHeaders(event.target);
  });
  document.addEventListener('shopify:section:unload', function(event) {
    controllers.forEach(function(controller, root) {
      if (event.target.contains(root)) {
        controller.destroy();
        controllers.delete(root);
      }
    });
  });
})();
