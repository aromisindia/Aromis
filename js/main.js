const navLinks = document.getElementById('navLinks');
const navItems = document.querySelectorAll('[data-page]');

function scrollToTop() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'auto'
  });
}

function parseHash() {
  const raw = window.location.hash.replace('#', '').trim();

  if (!raw) {
    return {
      pageId: 'home',
      scrollTarget: null
    };
  }

  // Examples:
  // #home
  // #products:product-400ml

  const [pageId, scrollTarget = null] = raw.split(':');

  return {
    pageId: pageId || 'home',
    scrollTarget: scrollTarget || null
  };
}

function setHash(pageId, scrollTarget = null) {

  const nextHash = scrollTarget
    ? `${pageId}:${scrollTarget}`
    : pageId;

  if (window.location.hash.replace('#', '') !== nextHash) {
    window.location.hash = nextHash;
  }
}

function showPage(pageId, scrollTarget = null, updateHash = true) {

  const targetPage = document.getElementById(`page-${pageId}`);

  if (!targetPage) return;

  // HIDE ALL PAGES
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  // REMOVE ACTIVE NAV STATE
  document.querySelectorAll('[data-page]').forEach(link => {
    link.classList.remove('active');
  });

  // SHOW CURRENT PAGE
  targetPage.classList.add('active');

  // ACTIVATE NAV LINKS
  document.querySelectorAll(`[data-page="${pageId}"]`).forEach(link => {
    link.classList.add('active');
  });

  // SAVE IN URL
  if (updateHash) {
    setHash(pageId, scrollTarget);
  }

  // CLOSE MOBILE MENU
  if (navLinks) {
    navLinks.classList.remove('open');
  }

  // WAIT FOR PAGE RENDER THEN SCROLL
  requestAnimationFrame(() => {

    requestAnimationFrame(() => {

      if (scrollTarget) {

        const targetEl = document.getElementById(scrollTarget);

        if (targetEl) {

          targetEl.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          return;
        }
      }

      scrollToTop();

    });

  });

}

// LOAD PAGE FROM URL
window.addEventListener('load', () => {

  const {
    pageId,
    scrollTarget
  } = parseHash();

  showPage(pageId, scrollTarget, false);

});

// BROWSER BACK/FORWARD SUPPORT
window.addEventListener('hashchange', () => {

  const {
    pageId,
    scrollTarget
  } = parseHash();

  showPage(pageId, scrollTarget, false);

});

// MOBILE MENU
function toggleMenu() {

  if (navLinks) {
    navLinks.classList.toggle('open');
  }

}

// PAGE NAVIGATION
navItems.forEach(item => {

  item.addEventListener('click', (event) => {

    const page = item.dataset.page;
    const scrollTarget = item.dataset.scroll || null;

    if (!page) return;

    // PREVENT DEFAULT LINK BEHAVIOR
    if (item.tagName === 'A') {
      event.preventDefault();
    }

    showPage(page, scrollTarget, true);

  });

});

// PRODUCT SLIDER
function initProductSlider(slider) {

  const slides = Array.from(
    slider.querySelectorAll('.product-slide')
  );

  const prevBtn = slider.querySelector('.slider-arrow.prev');
  const nextBtn = slider.querySelector('.slider-arrow.next');
  const dotsWrap = slider.querySelector('.slider-dots');

  if (slides.length <= 1 || !dotsWrap) return;

  let index = 0;
  let timer = null;

  function renderDots() {

    dotsWrap.innerHTML = '';

    slides.forEach((_, i) => {

      const dot = document.createElement('button');

      dot.type = 'button';

      dot.className =
        'slider-dot' + (i === index ? ' is-active' : '');

      dot.setAttribute(
        'aria-label',
        `Go to image ${i + 1}`
      );

      dot.addEventListener('click', () => goTo(i));

      dotsWrap.appendChild(dot);

    });

  }

  function update() {

    slides.forEach((slide, i) => {

      slide.classList.toggle(
        'is-active',
        i === index
      );

    });

    dotsWrap
      .querySelectorAll('.slider-dot')
      .forEach((dot, i) => {

        dot.classList.toggle(
          'is-active',
          i === index
        );

      });

  }

  function goTo(i) {

    index = (i + slides.length) % slides.length;

    update();

    resetAuto();

  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  function startAuto() {

    clearInterval(timer);

    timer = setInterval(next, 4000);

  }

  function resetAuto() {
    startAuto();
  }

  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);

  renderDots();
  update();
  startAuto();

  slider.addEventListener(
    'mouseenter',
    () => clearInterval(timer)
  );

  slider.addEventListener(
    'mouseleave',
    () => resetAuto()
  );

  slider.addEventListener(
    'focusin',
    () => clearInterval(timer)
  );

  slider.addEventListener(
    'focusout',
    () => resetAuto()
  );

}

// INITIALIZE SLIDERS
document.addEventListener('DOMContentLoaded', () => {

  document
    .querySelectorAll('.product-slider')
    .forEach(initProductSlider);

});

/* ============================
FAQ ACCORDION
============================ */

document.querySelectorAll(".faq-question").forEach(question=>{

    question.addEventListener("click",()=>{

        const item=question.parentElement;

        document.querySelectorAll(".faq-item").forEach(faq=>{

            if(faq!==item){

                faq.classList.remove("active");

            }

        });

        item.classList.toggle("active");

    });

});
