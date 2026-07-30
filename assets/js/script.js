/* ============================================================
   R.V.R. & J.C. COLLEGE OF ENGINEERING — CSE Dept.
   Shared site behaviour
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks  = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { navLinks.classList.remove('open'); });
    });
  }

  /* ---------- Highlight active nav link ---------- */
  var here = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    var target = a.getAttribute('href');
    if (target === here || (here === '' && target === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ---------- Image slider (About page) ---------- */
  var slides = document.querySelectorAll('.slide');
  if (slides.length) {
    var current = 0;
    var dotsWrap = document.querySelector('.slider-dots');
    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function () { goToSlide(i); });
      dotsWrap && dotsWrap.appendChild(dot);
    });
    var dots = dotsWrap ? dotsWrap.querySelectorAll('button') : [];

    function goToSlide(i) {
      slides[current].classList.remove('active');
      dots[current] && dots[current].classList.remove('active');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current] && dots[current].classList.add('active');
    }

    var prevBtn = document.querySelector('.slider-arrow.prev');
    var nextBtn = document.querySelector('.slider-arrow.next');
    prevBtn && prevBtn.addEventListener('click', function () { goToSlide(current - 1); });
    nextBtn && nextBtn.addEventListener('click', function () { goToSlide(current + 1); });

    var autoplay = setInterval(function () { goToSlide(current + 1); }, 5500);
    var sliderFrame = document.querySelector('.slider-frame');
    sliderFrame && sliderFrame.addEventListener('mouseenter', function () { clearInterval(autoplay); });
    sliderFrame && sliderFrame.addEventListener('mouseleave', function () {
      autoplay = setInterval(function () { goToSlide(current + 1); }, 5500);
    });
  }

  /* ---------- Events: master grid -> TECHNIZEN sub-grid ---------- */
  var masterCards = document.querySelectorAll('[data-open-master]');
  var masterView   = document.getElementById('events-master-view');
  var subView      = document.getElementById('events-sub-view');
  var subViewTitle = document.getElementById('sub-view-title');

  masterCards.forEach(function (card) {
    card.addEventListener('click', function () {
      if (!subView || !masterView) return;
      masterView.style.display = 'none';
      subView.style.display = 'block';
      if (subViewTitle) subViewTitle.textContent = card.getAttribute('data-open-master');
      window.scrollTo({ top: subView.offsetTop - 90, behavior: 'smooth' });
    });
  });

  var backToMaster = document.getElementById('back-to-master');
  backToMaster && backToMaster.addEventListener('click', function (e) {
    e.preventDefault();
    subView.style.display = 'none';
    masterView.style.display = 'block';
    window.scrollTo({ top: masterView.offsetTop - 90, behavior: 'smooth' });
  });

  /* ---------- Event detail modal ---------- */
  var modalBackdrop = document.getElementById('event-modal');
  var modalBody      = document.getElementById('event-modal-body');

  document.querySelectorAll('[data-view-details]').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var tpl = document.getElementById(trigger.getAttribute('data-view-details'));
      if (!tpl || !modalBackdrop || !modalBody) return;
      modalBody.innerHTML = tpl.innerHTML;
      modalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('[data-close-modal]').forEach(function (btn) {
    btn.addEventListener('click', closeModal);
  });
  modalBackdrop && modalBackdrop.addEventListener('click', function (e) {
    if (e.target === modalBackdrop) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* ---------- Gallery marquee: duplicate row content for seamless loop ---------- */
  document.querySelectorAll('.marquee-row').forEach(function (row) {
    row.innerHTML += row.innerHTML;
  });

});
