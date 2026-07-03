const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const comparisons = document.querySelectorAll('[data-comparison]');
comparisons.forEach(card => {
  const range = card.querySelector('.comparison-range');
  if (!range) return;
  const update = () => card.style.setProperty('--position', `${range.value}%`);
  range.addEventListener('input', update);
  update();
});

const sliderShells = document.querySelectorAll('[data-slider]');
sliderShells.forEach(shell => {
  const track = shell.querySelector('.slider-track');
  if (!track) return;

  const slides = Array.from(track.children);
  const wrapper = shell.parentElement;
  const prev = wrapper.querySelector('[data-prev]');
  const next = wrapper.querySelector('[data-next]');
  const dotsWrap = shell.querySelector('[data-dots]');

  const getStep = () => {
    if (!slides.length) return track.clientWidth;
    const first = slides[0];
    const slideWidth = first.getBoundingClientRect().width;
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || 0);
    return slideWidth + gap;
  };

  const getCurrentIndex = () => {
    const step = getStep();
    return Math.round(track.scrollLeft / step);
  };

  const scrollToIndex = index => {
    const step = getStep();
    track.scrollTo({ left: index * step, behavior: 'smooth' });
  };

  const updateDots = () => {
    if (!dotsWrap) return;
    const current = Math.max(0, Math.min(getCurrentIndex(), slides.length - 1));
    dotsWrap.querySelectorAll('button').forEach((dot, index) => {
      dot.classList.toggle('active', index === current);
      dot.setAttribute('aria-current', index === current ? 'true' : 'false');
    });
  };

  if (dotsWrap) {
    dotsWrap.innerHTML = '';
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => {
        scrollToIndex(index);
        restartAuto();
      });
      dotsWrap.appendChild(dot);
    });
  }

  if (prev) {
    prev.addEventListener('click', () => {
      const target = Math.max(getCurrentIndex() - 1, 0);
      scrollToIndex(target);
      restartAuto();
    });
  }

  if (next) {
    next.addEventListener('click', () => {
      const target = Math.min(getCurrentIndex() + 1, slides.length - 1);
      scrollToIndex(target);
      restartAuto();
    });
  }

  let autoTimer = null;
  const autoEnabled = slides.length > 1;

  const stopAuto = () => {
    if (autoTimer) window.clearInterval(autoTimer);
    autoTimer = null;
  };

  const startAuto = () => {
    if (!autoEnabled) return;
    stopAuto();
    autoTimer = window.setInterval(() => {
      const current = getCurrentIndex();
      const nextIndex = current >= slides.length - 1 ? 0 : current + 1;
      scrollToIndex(nextIndex);
    }, Number(shell.dataset.autoplay || 5000));
  };

  const restartAuto = () => {
    stopAuto();
    startAuto();
  };

  track.addEventListener('scroll', () => window.requestAnimationFrame(updateDots));
  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);
  track.addEventListener('touchstart', stopAuto, { passive: true });
  track.addEventListener('touchend', startAuto, { passive: true });

  window.addEventListener('resize', updateDots);
  updateDots();
  startAuto();
});

const quoteForm = document.querySelector('.quote-form');
if (quoteForm) {
  quoteForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(quoteForm);
    const name = data.get('name') || '';
    const phone = data.get('phone') || '';
    const service = data.get('service') || '';
    const area = data.get('area') || '';
    const message = data.get('message') || '';

    const text = `Hello Ana's Cleaning Services, I would like a free estimate.%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AService: ${encodeURIComponent(service)}%0AArea: ${encodeURIComponent(area)}%0AMessage: ${encodeURIComponent(message)}`;
    window.open(`https://wa.me/14695350028?text=${text}`, '_blank', 'noopener');
  });
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
