(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const counter = document.getElementById('slideCounter');
  const progressBar = document.getElementById('progressBar');
  const dotsContainer = document.getElementById('slideDots');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  let current = 0;

  slides.forEach((slide, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'slide-dot';
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    dot.addEventListener('click', () => showSlide(index));
    dotsContainer.appendChild(dot);
  });
  const dots = [...dotsContainer.querySelectorAll('.slide-dot')];

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === current);
      slide.setAttribute('aria-hidden', i === current ? 'false' : 'true');
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
      if (i === current) dot.setAttribute('aria-current', 'step');
      else dot.removeAttribute('aria-current');
    });
    counter.innerHTML = `${String(current + 1).padStart(2, '0')} <span>/</span> ${String(slides.length).padStart(2, '0')}`;
    progressBar.style.width = `${((current + 1) / slides.length) * 100}%`;
    prevBtn.disabled = false;
    nextBtn.disabled = false;
    document.title = `${String(current + 1).padStart(2, '0')} / 07 — UNFILTERED`;
  }

  prevBtn.addEventListener('click', () => showSlide(current - 1));
  nextBtn.addEventListener('click', () => showSlide(current + 1));
  document.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'PageDown') {
      event.preventDefault(); showSlide(current + 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault(); showSlide(current - 1);
    } else if (event.key === 'Home') {
      event.preventDefault(); showSlide(0);
    } else if (event.key === 'End') {
      event.preventDefault(); showSlide(slides.length - 1);
    } else if (event.key === 'Escape' && document.fullscreenElement) {
      document.exitFullscreen?.();
    }
  });

  fullscreenBtn.addEventListener('click', async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch (error) {
      alert('Fullscreen is not available in this browser or context.');
    }
  });
  document.addEventListener('fullscreenchange', () => {
    fullscreenBtn.innerHTML = document.fullscreenElement
      ? '<i class="fa-solid fa-compress"></i>'
      : '<i class="fa-solid fa-expand"></i>';
    fullscreenBtn.setAttribute('aria-label', document.fullscreenElement ? 'Exit fullscreen' : 'Toggle fullscreen');
  });
  document.querySelectorAll('[data-go]').forEach(link => {
    link.addEventListener('click', event => { event.preventDefault(); showSlide(Number(link.dataset.go)); });
  });

  // Give touch users a simple horizontal swipe gesture for slide navigation.
  let touchStartX = null;
  document.querySelector('.slides').addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, {passive:true});
  document.querySelector('.slides').addEventListener('touchend', e => {
    if (touchStartX === null) return;
    const delta = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(delta) > 65) showSlide(current + (delta < 0 ? 1 : -1));
    touchStartX = null;
  }, {passive:true});

  // If the supplied image cannot be loaded, show a readable replacement panel.
  document.querySelectorAll('.brand-image').forEach(img => {
    img.addEventListener('error', () => {
      const placeholder = document.createElement('div');
      placeholder.className = 'image-placeholder';
      placeholder.innerHTML = '<strong>UNFILTERED</strong><span>Place your clothing mockup at<br><code>images/unfiltered-clothing.png</code></span>';
      img.replaceWith(placeholder);
    }, {once:true});
  });

  showSlide(0);
})();
