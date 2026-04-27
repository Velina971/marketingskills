/* NUQA — minimal interactions
   Mobile sticky CTA, scroll reveal, gallery, qty stepper, cart counter
   No external deps. Uses IntersectionObserver + native APIs only. */

(() => {
  'use strict';

  // ----- Scroll reveal -----
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-revealed');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-revealed'));
  }

  // ----- Mobile sticky CTA (homepage) -----
  const sticky = document.getElementById('stickyCta');
  if (sticky) {
    let ticking = false;
    const update = () => {
      const scrolled = window.scrollY;
      const heroBottom = (document.querySelector('.hero')?.offsetHeight) || 600;
      if (scrolled > heroBottom * 0.7) sticky.classList.add('is-visible');
      else sticky.classList.remove('is-visible');
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  // ----- Quantity stepper -----
  const qtyInput = document.getElementById('qty');
  if (qtyInput) {
    document.querySelectorAll('[data-qty]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const delta = parseInt(btn.dataset.qty, 10);
        const min = parseInt(qtyInput.min, 10) || 1;
        const max = parseInt(qtyInput.max, 10) || 99;
        const next = Math.max(min, Math.min(max, (parseInt(qtyInput.value, 10) || 1) + delta));
        qtyInput.value = next;
        updateAtcLabel(next);
      });
    });
  }

  // ----- Add-to-cart label & counter -----
  const atc = document.getElementById('addToCart');
  const stickyAdd = document.getElementById('stickyAdd');
  const cartCounters = document.querySelectorAll('.cart-count');

  function updateAtcLabel(n) {
    if (atc) atc.textContent = `Ajouter au panier — ${49 * n}€`;
  }

  function bumpCart(qty) {
    cartCounters.forEach((el) => {
      const next = (parseInt(el.textContent, 10) || 0) + qty;
      el.textContent = next;
      el.style.transform = 'scale(1.3)';
      setTimeout(() => (el.style.transform = ''), 200);
    });
  }

  function flashAdded(button) {
    if (!button) return;
    const original = button.textContent;
    button.textContent = '✓ Ajouté';
    button.style.background = 'var(--black)';
    button.style.color = 'var(--gold)';
    setTimeout(() => {
      button.textContent = original;
      button.style.background = '';
      button.style.color = '';
    }, 1800);
  }

  if (atc) atc.addEventListener('click', () => {
    const n = parseInt(qtyInput?.value, 10) || 1;
    bumpCart(n);
    flashAdded(atc);
  });
  if (stickyAdd) stickyAdd.addEventListener('click', () => {
    const n = parseInt(qtyInput?.value, 10) || 1;
    bumpCart(n);
    flashAdded(stickyAdd);
  });

  // ----- Gallery thumbs -----
  const thumbs = document.querySelectorAll('.gallery__thumb');
  const mainEl = document.getElementById('galleryMain');
  thumbs.forEach((t) => {
    t.addEventListener('click', () => {
      thumbs.forEach((x) => x.classList.remove('is-active'));
      t.classList.add('is-active');
      // Visual placeholder swap (real implementation would change the image src)
      if (mainEl) {
        mainEl.style.transition = 'opacity 200ms ease';
        mainEl.style.opacity = '0.4';
        setTimeout(() => {
          mainEl.style.opacity = '1';
        }, 200);
      }
    });
  });

  // ----- Tabs scroll spy + smooth scroll -----
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(tab.getAttribute('href'));
      if (target) {
        const headerH = (document.querySelector('.header')?.offsetHeight || 0) + (document.querySelector('.tabs')?.offsetHeight || 0);
        window.scrollTo({ top: target.offsetTop - headerH - 16, behavior: 'smooth' });
      }
      tabs.forEach((x) => x.classList.remove('is-active'));
      tab.classList.add('is-active');
    });
  });

  // Active tab on scroll
  const tabTargets = Array.from(tabs).map((t) => document.querySelector(t.getAttribute('href'))).filter(Boolean);
  if (tabTargets.length && 'IntersectionObserver' in window) {
    const tabIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          tabs.forEach((t) => {
            t.classList.toggle('is-active', t.getAttribute('href') === '#' + e.target.id);
          });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    tabTargets.forEach((el) => tabIo.observe(el));
  }

  // ----- Burger menu (mobile) — minimal toggle stub -----
  const burger = document.querySelector('.burger');
  if (burger) {
    burger.addEventListener('click', () => {
      // Stub for mobile drawer — to be wired with a real drawer component
      console.log('Open mobile menu');
    });
  }

  // ----- Number count-up on results -----
  const stats = document.querySelectorAll('.stat__num');
  if (stats.length && 'IntersectionObserver' in window) {
    const statIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        statIo.unobserve(e.target);
        const el = e.target;
        const text = el.textContent;
        const match = text.match(/^(\d+)/);
        if (!match) return;
        const target = parseInt(match[1], 10);
        const suffix = text.slice(match[1].length);
        const duration = 1200;
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          const current = Math.round(target * eased);
          el.innerHTML = current + suffix;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    stats.forEach((s) => statIo.observe(s));
  }
})();
