alert('Gallery JS loaded');
(function() {
  const cards = document.querySelectorAll('.album-card');
  const dlg = document.getElementById('lightbox');
  const imgEl = document.getElementById('lightbox-image');
  const titleEl = document.getElementById('lightbox-title');
  const counterEl = document.getElementById('lightbox-counter');
  const btnClose = document.getElementById('lightbox-close');
  const btnPrev = dlg.querySelector('.nav.prev');
  const btnNext = dlg.querySelector('.nav.next');

  // Parse comma-separated image list
  function parseImages(csv) {
    return (csv || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }

  let images = [];
  let idx = 0;

  function show(i) {
    if (!images.length) return;
    idx = (i + images.length) % images.length;
    imgEl.src = images[idx];
    imgEl.alt = titleEl.textContent + ' — ' + (idx + 1);
    counterEl.textContent = (idx + 1) + ' / ' + images.length;
  }

  function openAlbum(card) {
    images = parseImages(card.getAttribute('data-images'));
    titleEl.textContent = card.getAttribute('data-title') || 'Album';
    if (!images.length) {
      alert('No images found for this album.');
      return;
    }
    show(0);
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', ''); // fallback
  }

  cards.forEach(card => {
    card.addEventListener('click', () => openAlbum(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAlbum(card); }
    });
  });

  btnClose.addEventListener('click', () => dlg.close && dlg.close());
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) dlg.close && dlg.close();
  });

  btnPrev.addEventListener('click', () => show(idx - 1));
  btnNext.addEventListener('click', () => show(idx + 1));

  document.addEventListener('keydown', (e) => {
    if (!dlg.open) return;
    if (e.key === 'Escape') dlg.close && dlg.close();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
})();

