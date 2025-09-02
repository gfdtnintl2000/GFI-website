(function () {
  // Run after HTML is parsed (works even if 'defer' is missing)
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

    // Minimal guards so a missing element can't break the script
    if (!cards.length || !dlg || !imgEl || !titleEl || !counterEl || !btnClose) {
      console.warn('[gallery] Missing required elements');
      return;
    }

    const btnPrev = dlg.querySelector('.nav.prev');
    const btnNext = dlg.querySelector('.nav.next');

    let images = [];
    let idx = 0;

    function parseImages(csv) {
      return (csv || '').split(',').map(s => s.trim()).filter(Boolean);
    }

    function show(i) {
      if (!images.length) return;
      idx = (i + images.length) % images.length;

      // show loading state while the image fetches
      counterEl.textContent = 'Loading…';
      imgEl.removeAttribute('src');
      imgEl.alt = `${titleEl.textContent} — ${idx + 1}`;

      imgEl.onload = () => { counterEl.textContent = `${idx + 1} / ${images.length}`; };
      imgEl.onerror = () => { counterEl.textContent = 'Failed to load image'; };

      imgEl.src = images[idx];
    }

    function openAlbum(card) {
      images = parseImages(card.getAttribute('data-images'));
      titleEl.textContent = card.getAttribute('data-title') || 'Album';
      if (!images.length) {
        alert('No images found for this album.');
        return;
      }

      // open the dialog first, then load the image
      if (typeof dlg.showModal === 'function') dlg.showModal();
      else dlg.setAttribute('open', '');

      show(0);
    }

    cards.forEach(card => {
      card.addEventListener('click', () => openAlbum(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAlbum(card); }
      });
    });

    btnPrev && btnPrev.addEventListener('click', () => show(idx - 1));
    btnNext && btnNext.addEventListener('click', () => show(idx + 1));
    btnClose.addEventListener('click', () => dlg.close && dlg.close());
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close && dlg.close(); });

    document.addEventListener('keydown', (e) => {
      if (!dlg.open) return;
      if (e.key === 'Escape') dlg.close && dlg.close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }
})();

