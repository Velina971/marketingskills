/* NUQA — v2 interactions
   Bundle picker, sticky CTA, scroll reveal, gallery, accordion enhancements
   No external deps. */

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
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
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
      sticky.classList.toggle('is-visible', scrolled > heroBottom * 0.7);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  // ----- Bundle picker (PDP) -----
  const bundles = document.querySelectorAll('.bundle');
  const atcPrice = document.getElementById('atcPrice');
  const stickyPrice = document.getElementById('stickyPrice');
  const scalapayAmount = document.getElementById('scalapayAmount');

  const priceMap = {
    solo: { price: 49, old: 69, sticky: 49 },
    duo:  { price: 79, old: 98, sticky: 79 },
    trio: { price: 109, old: 147, sticky: 109 },
  };

  function updateBundleUI(key) {
    const d = priceMap[key];
    if (!d) return;
    if (atcPrice) atcPrice.textContent = `${d.price}€`;
    if (stickyPrice) stickyPrice.textContent = `${d.sticky}€`;
    if (scalapayAmount) scalapayAmount.textContent = `${(d.price / 3).toFixed(2).replace('.', ',')}€`;
  }

  bundles.forEach((b) => {
    b.addEventListener('click', () => {
      bundles.forEach((x) => x.classList.remove('is-active'));
      b.classList.add('is-active');
      const input = b.querySelector('input[type="radio"]');
      if (input) input.checked = true;
      updateBundleUI(b.dataset.bundle);
    });
  });

  // ----- Add to cart flash + counter -----
  const atc = document.getElementById('addToCart');
  const stickyAdd = document.getElementById('stickyAdd');
  const cartCounters = document.querySelectorAll('.cart-count');

  function bumpCart(qty = 1) {
    cartCounters.forEach((el) => {
      const next = (parseInt(el.textContent, 10) || 0) + qty;
      el.textContent = next;
      el.style.transform = 'scale(1.35)';
      setTimeout(() => (el.style.transform = ''), 220);
    });
  }

  function flashAdded(button) {
    if (!button) return;
    const original = button.innerHTML;
    button.innerHTML = '✓ Ajouté à votre panier';
    button.style.background = 'var(--gold)';
    button.style.color = 'var(--brown-cta)';
    setTimeout(() => {
      button.innerHTML = original;
      button.style.background = '';
      button.style.color = '';
    }, 1900);
  }

  if (atc) atc.addEventListener('click', (e) => {
    e.preventDefault();
    bumpCart(1);
    flashAdded(atc);
  });
  if (stickyAdd) stickyAdd.addEventListener('click', (e) => {
    e.preventDefault();
    bumpCart(1);
    flashAdded(stickyAdd);
  });

  // ----- Gallery thumbs -----
  const thumbs = document.querySelectorAll('.gallery__thumb');
  const mainEl = document.getElementById('galleryMain');
  thumbs.forEach((t) => {
    t.addEventListener('click', () => {
      thumbs.forEach((x) => x.classList.remove('is-active'));
      t.classList.add('is-active');
      if (mainEl) {
        mainEl.style.transition = 'opacity 200ms ease';
        mainEl.style.opacity = '0.4';
        setTimeout(() => { mainEl.style.opacity = '1'; }, 200);
      }
    });
  });

  // ----- Burger menu stub -----
  const burger = document.querySelector('.burger');
  if (burger) burger.addEventListener('click', () => { console.log('Open mobile menu'); });

  // ----- Number count-up on stats -----
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
        const duration = 1400;
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
