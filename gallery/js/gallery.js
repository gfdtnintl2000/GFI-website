// /js/gallery.js

(function(){
  const grid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  const imgEl = document.getElementById('lightbox-img');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const closeBtn = document.getElementById('closeBtn');

  let currentImages = [];
  let currentIndex = 0;

  function parseImages(attr) {
    return (attr || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }

  function show(index) {
    if (!currentImages.length) return;
    currentIndex = (index + currentImages.length) % currentImages.length;

    const src = currentImages[currentIndex];

    // reset first to avoid stale frame flash
    imgEl.style.display = 'none';
    imgEl.removeAttribute('src');

    imgEl.onload = () => { imgEl.style.display = 'block'; };
    imgEl.onerror = () => {
      console.error('[Gallery] Failed to load image:', src);
      imgEl.alt = 'Image failed to load';
      imgEl.style.display = 'block';
    };

    imgEl.src = src;
  }

  function open(images, startAt = 0) {
    currentImages = images;
    show(startAt);
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  }

  // Wire albums
  grid.querySelectorAll('.album-card').forEach((card) => {
    card.addEventListener('click', () => {
      const images = parseImages(card.getAttribute('data-images'));
      if (!images.length) {
        console.error('[Gallery] No images found on album card');
        return;
      }
      open(images, 0);
    });

    // Allow "Enter" to open when focused
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') card.click();
    });
  });

  // Lightbox controls
  nextBtn.addEventListener('click', () => show(currentIndex + 1));
  prevBtn.addEventListener('click', () => show(currentIndex - 1));
  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    // click backdrop closes; ignore clicks directly on image or buttons
    if (e.target === lightbox) close();
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (lightbox.style.display !== 'flex') return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(currentIndex + 1);
    if (e.key === 'ArrowLeft') show(currentIndex - 1);
  });
})();
