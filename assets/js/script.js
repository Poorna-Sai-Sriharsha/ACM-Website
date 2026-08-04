/* ============================================================
   R.V.R. & J.C. COLLEGE OF ENGINEERING — CSE Dept.
   Shared site behaviour
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
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
  var masterView = document.getElementById('events-master-view');
  var subView = document.getElementById('events-sub-view');
  var subViewTitle = document.getElementById('sub-view-title');

  function showSubView(title) {
    if (!subView || !masterView) return;
    masterView.style.display = 'none';
    subView.style.display = 'block';
    if (subViewTitle && title) subViewTitle.textContent = title;

    var canvas = document.getElementById('tech-nodes-canvas');
    if (canvas) canvas.style.display = 'none';
  }

  function showMasterView() {
    if (!subView || !masterView) return;
    subView.style.display = 'none';
    masterView.style.display = 'block';

    var canvas = document.getElementById('tech-nodes-canvas');
    if (canvas) canvas.style.display = 'block';
  }

  function checkHashAndToggle() {
    if (!masterView || !subView) return;
    var hash = window.location.hash.toLowerCase();
    if (hash === '#technizen') {
      showSubView('TECHNIZEN');
    } else {
      showMasterView();
    }
  }

  if (masterView && subView) {
    checkHashAndToggle();
    window.addEventListener('hashchange', checkHashAndToggle);
    window.addEventListener('popstate', checkHashAndToggle);
    window.addEventListener('pageshow', checkHashAndToggle);

    masterCards.forEach(function (card) {
      card.addEventListener('click', function () {
        var masterName = card.getAttribute('data-open-master') || 'TECHNIZEN';
        showSubView(masterName);
        window.location.hash = masterName.toLowerCase();
        window.scrollTo({ top: subView.offsetTop - 90, behavior: 'smooth' });
      });
    });

    var backToMaster = document.getElementById('back-to-master');
    backToMaster && backToMaster.addEventListener('click', function (e) {
      e.preventDefault();
      showMasterView();
      if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname + window.location.search);
      }
      window.scrollTo({ top: masterView.offsetTop - 90, behavior: 'smooth' });
    });
  }

  /* ---------- Event Countdown Timer (TECHNIZEN 2026 - Aug 11) ---------- */
  (function initCountdownTimer() {
    var daysEl = document.getElementById('cd-days');
    var hoursEl = document.getElementById('cd-hours');
    var minsEl = document.getElementById('cd-mins');
    var secsEl = document.getElementById('cd-secs');

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    // Target Date: August 11, 2026 09:00:00 AM IST
    var targetDate = new Date('August 11, 2026 00:00:00').getTime();

    function updateTimer() {
      var now = new Date().getTime();
      var diff = targetDate - now;

      if (diff <= 0) {
        var container = document.getElementById('technizen-countdown');
        if (container) {
          container.innerHTML = '<div class="live-event-banner"><span class="pulse-dot"></span> We Are Live! Step Into Technizen 2K26</div>';
        }
        return;
      }

      var d = Math.floor(diff / (1000 * 60 * 60 * 24));
      var h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var s = Math.floor((diff % (1000 * 60)) / 1000);

      daysEl.textContent = d < 10 ? '0' + d : String(d);
      hoursEl.textContent = h < 10 ? '0' + h : String(h);
      minsEl.textContent = m < 10 ? '0' + m : String(m);
      secsEl.textContent = s < 10 ? '0' + s : String(s);
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  })();

  /* ---------- Event detail modal ---------- */
  var modalBackdrop = document.getElementById('event-modal');
  var modalBody = document.getElementById('event-modal-body');

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

  /* ---------- Floating Connected Tech Nodes Canvas ---------- */
  (function initTechNodesCanvas() {
    var canvas = document.getElementById('tech-nodes-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var width, height;
    var particles = [];

    var config = {
      maxDist: 140,
      nodeCount: window.innerWidth < 768 ? 20 : 80,
      blueColor: '20, 80, 158',
      goldColor: '200, 161, 58',
      cyanColor: '0, 102, 204'
    };

    function resize() {
      var oldW = width;
      var oldH = height;

      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      var isMobile = window.innerWidth < 768;
      config.nodeCount = isMobile ? 20 : 80;

      if (oldW && oldH && particles.length) {
        // Proportionally scale particle coordinates so they stay evenly distributed during resize / devtools toggle
        for (var i = 0; i < particles.length; i++) {
          particles[i].x = (particles[i].x / oldW) * width;
          particles[i].y = (particles[i].y / oldH) * height;
        }
        while (particles.length < config.nodeCount) {
          particles.push(new Particle());
        }
        if (particles.length > config.nodeCount) {
          particles.length = config.nodeCount;
        }
      }
    }

    function Particle() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      var isMobile = window.innerWidth < 768;
      var speed = isMobile ? 0.49488 : 0.52093;
      this.vx = (Math.random() - 0.5) * speed;
      this.vy = (Math.random() - 0.5) * speed;
      this.radius = isMobile ? (Math.random() * 0.6 + 0.4) : (Math.random() * 3.5 + 2.5);
      this.alpha = Math.random() * 0.5 + 0.35;
      var isGold = Math.random() < 0.22;
      this.color = isGold ? config.goldColor : (Math.random() < 0.5 ? config.blueColor : config.cyanColor);
    }

    Particle.prototype.update = function () {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < -15) this.x = width + 10;
      else if (this.x > width + 15) this.x = -10;
      if (this.y < -15) this.y = height + 10;
      else if (this.y > height + 15) this.y = -10;
    };

    Particle.prototype.draw = function () {
      // Core particle dot
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + this.color + ', ' + this.alpha + ')';
      ctx.fill();

      // Soft glowing outer ring
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 2.8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + this.color + ', ' + (this.alpha * 0.22) + ')';
      ctx.fill();
    };

    function initParticles() {
      resize();
      particles = [];
      for (var i = 0; i < config.nodeCount; i++) {
        particles.push(new Particle());
      }
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      var footerEl = document.querySelector('.site-footer');
      var footerTop = footerEl ? footerEl.getBoundingClientRect().top : height + 100;

      // Draw connecting lines between nearby tech nodes (only above footer)
      for (var i = 0; i < particles.length; i++) {
        if (particles[i].y >= footerTop - 5) continue;
        for (var j = i + 1; j < particles.length; j++) {
          if (particles[j].y >= footerTop - 5) continue;
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < config.maxDist) {
            var lineAlpha = (1 - dist / config.maxDist) * 0.25;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(0, 102, 204, ' + lineAlpha + ')';
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      // Update & draw tech nodes (omit drawing inside footer)
      for (var k = 0; k < particles.length; k++) {
        particles[k].update();
        if (particles[k].y < footerTop - 5) {
          particles[k].draw();
        }
      }

      requestAnimationFrame(render);
    }

    var resizeTimeout;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        resize();
      }, 150);
    });

    initParticles();
    render();
  })();

});
