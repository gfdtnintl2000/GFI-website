<script>
const btnNext = dlg.querySelector('.nav.next');

let images = [];
let idx = 0;

function parseImages(csv) {
return (csv || '').split(',').map(s => s.trim()).filter(Boolean);
}

// Validate image URLs (skip any that 404)
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

function show(i) {
if (!images.length) return;
idx = (i + images.length) % images.length;
counterEl.textContent = 'Loading…';
imgEl.removeAttribute('src');
imgEl.alt = `${titleEl.textContent} — ${idx + 1}`;
imgEl.onload = () => { counterEl.textContent = `${idx + 1} / ${images.length}`; };
imgEl.onerror = () => { counterEl.textContent = 'Failed to load image'; };
imgEl.src = images[idx];
}

function openAlbum(card) {
const requested = parseImages(card.getAttribute('data-images'));
titleEl.textContent = card.getAttribute('data-title') || 'Album';
if (!requested.length) { alert('No images found for this album.'); return; }

if (typeof dlg.showModal === 'function') dlg.showModal();
else dlg.setAttribute('open', '');
counterEl.textContent = 'Loading…';

validateImages(requested).then(valid => {
if (!valid.length) {
counterEl.textContent = 'No valid images';
setTimeout(() => { dlg.close && dlg.close(); }, 1200);
return;
}
images = valid;
show(0);
});
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
</script>
<script src="/assets/js/gallery.js" defer></script>
