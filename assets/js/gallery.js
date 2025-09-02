/* =============================================================
   Grace Foundation International — Gallery Lightbox (final)
   FULL REPLACEMENT for /assets/js/gallery.js (no <script> tags)
   -------------------------------------------------------------
   - Robust to missing/bad image URLs (skips 404s automatically)
   - Works whether the script tag has `defer` or not
   - Keyboard access: Esc to close, ←/→ to navigate, Enter/Space on cards
   - Click outside (backdrop) closes dialog
   ============================================================= */
(function () {
  // Run after DOM is ready, even if defer is missing
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const cards = document.querySelectorAll('.album-card');
    const dlg = document.getElementById('lightbox');
    const imgEl = document.getElementById('lightbox-image');
    const titleEl = document.getElementById('lightbox-title');
    const counterEl = document.getElementById('lightbox-counter');
    const btnClose = document.getElementById('lightbox-close');
    const btnPrev = dlg ? dlg.querySelector('.nav.prev') : null;
    const btnNext = dlg ? dlg.querySelector('.nav.next') : null;

    if (!cards.length || !dlg || !imgEl || !titleEl || !counterEl || !btnClose) {
      console.warn('[gallery] Missing required elements — check gallery.html');
      return;
    }

    let images = [];
    let idx = 0;
    let lastFocus = null;

    function parseImages(csv) {
      // Split, trim, dedupe, and filter empties
      const seen = new Set();
      return (csv || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .filter(url => (seen.has(url) ? false : seen.add(url)));
    }

    // Validate image URLs by attempting to load; skip those that fail
    function validateImages(urls, timeoutMs = 10000) {
      const tests = urls.map(url => new Promise(resolve => {
        const img = new Image();
        let done = false;
        const timer = setTimeout(() => { if (!done) { done = true; resolve(null); } }, timeoutMs);
        img.onload = () => { if (!done) { done = true; clearTimeout(timer); resolve(url); } };
        img.onerror = () => { if (!done) { done = true; clearTimeout(timer); resolve(null); } };
        img.src = url;
      }));
      return Promise.all(tests).then(results => results.filter(Boolean));
    }

    function updateNav() {
      const single = images.length <= 1;
      if (btnPrev) btnPrev.style.display = single ? 'none' : '';
      if (btnNext) btnNext.style.display = single ? 'none' : '';
    }

    function show(i) {
      if (!images.length) return;
      idx = (i + images.length) % images.length; // wrap

      counterEl.textContent = 'Loading…';
      imgEl.removeAttribute('src');
      imgEl.alt = `${titleEl.textContent} — ${idx + 1}`;

      imgEl.onload = () => { counterEl.textContent = `${idx + 1} / ${images.length}`; };
      imgEl.onerror = () => { counterEl.textContent = 'Failed to load image'; };

      imgEl.src = images[idx];
      updateNav();
    }

    function openAlbum(card) {
      const requested = parseImages(card.getAttribute('data-images'));
      titleEl.textContent = card.getAttribute('data-title') || 'Album';

      if (!requested.length) {
        alert('No images found for this album.');
        return;
      }

      lastFocus = document.activeElement;

      // Open the dialog first, then resolve valid images
      if (typeof dlg.showModal === 'function') dlg.showModal();
      else dlg.setAttribute('open', '');

      counterEl.textContent = 'Loading…';

      validateImages(requested).then(valid => {
        if (!valid.length) {
          counterEl.textContent = 'No valid images';
          setTimeout(() => { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); }, 1200);
          return;
        }
        images = valid;
        show(0);
      });
    }

    // Wire up album cards
    cards.forEach(card => {
      card.addEventListener('click', () => openAlbum(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAlbum(card); }
      });
    });
document.querySelectorAll('.project-figure img').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    // Use the section H2 as the album title
    const section = img.closest('section');
    titleEl.textContent = section?.querySelector('h2')?.textContent || 'Project Photo';

    // Show just this one image in the lightbox
    images = [img.currentSrc || img.src];

    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');

    show(0);
  });
});
     document.querySelectorAll('.project-figure img').forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    const dlg = document.getElementById('lightbox');
    const imgEl = document.getElementById('lightbox-image');
    const titleEl = document.getElementById('lightbox-title');
    const counterEl = document.getElementById('lightbox-counter');

    const section = img.closest('section');
    titleEl.textContent = section?.querySelector('h2')?.textContent || 'Project Photo';

    images = [img.currentSrc || img.src];  // show just this image
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
    counterEl.textContent = 'Loading…';
    show(0);
  });
});
    // Lightbox controls
    btnPrev && btnPrev.addEventListener('click', () => show(idx - 1));
    btnNext && btnNext.addEventListener('click', () => show(idx + 1));

    btnClose.addEventListener('click', () => {
      if (dlg.close) dlg.close(); else dlg.removeAttribute('open');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    });

    // Click on backdrop (outside dialog) closes
    dlg.addEventListener('click', (e) => { if (e.target === dlg) { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); if (lastFocus && lastFocus.focus) lastFocus.focus(); } });
    dlg.addEventListener('cancel', (e) => { e.preventDefault(); if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); if (lastFocus && lastFocus.focus) lastFocus.focus(); });

    // Keyboard shortcuts when lightbox is open
    document.addEventListener('keydown', (e) => {
      if (!dlg.open) return;
      if (e.key === 'Escape') { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
      if (e.key === 'Home') show(0);
      if (e.key === 'End') show(images.length - 1);
    });

    // Optional: clicking the image advances to next
    imgEl.addEventListener('click', () => { if (images.length > 1) show(idx + 1); });
  }
})();
