/**
 * VNIT Interactive Motion & Animation Engine
 * Inspired by PTSC (GD) Interactive Design System
 * 
 * Features:
 * 1. Number CountUp Engine (con so chay muot ma 60fps khi scroll vao view)
 * 2. Scroll Reveal Engine (noi dung troi len, hien ra, zoom in, slide left/right)
 * 3. Staggered Entrance Animations for Cards & Grids
 * 4. Swiper Banner Ken Burns, Auto-Pause on Hover & Slide Entrance Effects
 * 5. Full CMS Mode & Visual Editor Compatibility
 */

(function () {
  'use strict';

  // Check if user prefers reduced motion
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // =========================================================================
  // 1. NUMBER COUNTUP ENGINE (CON SỐ CHẠY)
  // =========================================================================
  function parseNumberString(str) {
    if (!str) return null;
    var trimmed = str.trim();
    // Match optional prefix, digits (with optional commas/dots), and suffix
    var match = trimmed.match(/^([^\d]*)([\d,.]+)([^\d]*)$/);
    if (!match) return null;

    var prefix = match[1] || '';
    var numStr = match[2] || '';
    var suffix = match[3] || '';

    // Determine thousand separator vs decimal
    var hasComma = numStr.indexOf(',') !== -1;
    var rawNum = parseFloat(numStr.replace(/,/g, ''));
    if (isNaN(rawNum)) return null;

    return {
      rawTarget: rawNum,
      prefix: prefix,
      suffix: suffix,
      hasComma: hasComma,
      originalText: trimmed
    };
  }

  function formatCountNumber(num, hasComma) {
    var integerVal = Math.round(num);
    if (hasComma) {
      return integerVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return integerVal.toString();
  }

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function animateCountUp(element, data, duration) {
    if (element.__isCounting || element.__hasCounted) return;
    element.__isCounting = true;

    var startTime = null;
    var target = data.rawTarget;
    var animDuration = duration || 2000;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / animDuration, 1);
      var easedProgress = easeOutExpo(progress);
      var currentVal = easedProgress * target;

      element.textContent = data.prefix + formatCountNumber(currentVal, data.hasComma) + data.suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = data.originalText;
        element.__isCounting = false;
        element.__hasCounted = true;
      }
    }

    requestAnimationFrame(step);
  }

  function initNumberCounters() {
    if (prefersReducedMotion) return;

    var counterElements = document.querySelectorAll(
      '.stat-number-wide, .stat-number, [data-counter], .number-count, .number-item .number span.count'
    );

    if (!counterElements || counterElements.length === 0) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      return; // gracefully fallback to static numbers
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          // Avoid re-running in CMS edit mode
          if (document.body.classList.contains('cms-editing-active')) {
            obs.unobserve(el);
            return;
          }

          var parsed = el.__parsedData || parseNumberString(el.textContent);
          if (parsed && !el.__hasCounted) {
            el.__parsedData = parsed;
            animateCountUp(el, parsed, 2200);
            obs.unobserve(el);
          }
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    });

    counterElements.forEach(function (el) {
      var parsed = parseNumberString(el.textContent);
      if (parsed) {
        el.__parsedData = parsed;
        observer.observe(el);
      }
    });
  }

  // =========================================================================
  // 2. SCROLL REVEAL & PTSC ANIMATION ENGINE (NỘI DUNG HIỆN RA, TRÔI LÊN)
  // =========================================================================
  function initScrollReveal() {
    if (prefersReducedMotion) return;
    if (!('IntersectionObserver' in window)) return;

    // A. PTSC Native .animate[data-animate] support
    var ptsElements = document.querySelectorAll('.animate[data-animate]');
    if (ptsElements.length > 0) {
      var ptsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var target = entry.target;
            target.style.animation = target.dataset.animate;
            ptsObserver.unobserve(target);
          }
        });
      }, { threshold: 0.15 });

      ptsElements.forEach(function (el) {
        ptsObserver.observe(el);
      });
    }

    // B. Auto-Reveal for Key Site Components:
    // Section Headers, Service Cards, Project Cards, Capabilities, Stats
    var revealSelectorGroups = [
      { selector: '.section-header', anim: 'vnit-fade-up' },
      { selector: '.service-card', anim: 'vnit-fade-up', staggered: true },
      { selector: '.project-card', anim: 'vnit-fade-up', staggered: true },
      { selector: '.cap-box', anim: 'vnit-fade-up', staggered: true },
      { selector: '.stat-item-wide', anim: 'vnit-zoom-in', staggered: true },
      { selector: '.partner-item, .client-item', anim: 'vnit-fade-up', staggered: true },
      { selector: '.vnit-tab-pane.active .row > [class*="col-"]', anim: 'vnit-fade-up', staggered: true }
    ];

    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.classList.add('vnit-revealed');
          obs.unobserve(el);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealSelectorGroups.forEach(function (group) {
      var elements = document.querySelectorAll(group.selector);
      if (!elements || elements.length === 0) return;

      var parentRow = null;
      var childIndex = 0;

      elements.forEach(function (el) {
        // If already initialized, skip
        if (el.classList.contains('vnit-reveal-init')) return;

        el.classList.add('vnit-reveal-init');
        el.classList.add(group.anim);

        // Add staggered delays for cards in the same row/container
        if (group.staggered) {
          var curParent = el.closest('.row, .stats-grid-wide, .container-wide') || el.parentElement;
          if (curParent !== parentRow) {
            parentRow = curParent;
            childIndex = 0;
          }
          var delayClass = 'vnit-delay-' + Math.min(childIndex + 1, 7);
          el.classList.add(delayClass);
          childIndex++;
        }

        revealObserver.observe(el);
      });
    });
  }

  // =========================================================================
  // 3. HERO BANNER & SWIPER ENHANCEMENTS (CHUYỂN HÌNH CHUYÊN NGHIỆP)
  // =========================================================================
  function initBannerEffects() {
    var heroBanner = document.querySelector('.hero-banner-section');
    if (!heroBanner) return;

    // Autoplay pause on hover (inspired by GD main.js:196-203)
    heroBanner.addEventListener('mouseenter', function () {
      var swiperEl = heroBanner.querySelector('.hero-swiper');
      if (swiperEl && swiperEl.swiper && swiperEl.swiper.autoplay) {
        swiperEl.swiper.autoplay.stop();
      }
    });

    heroBanner.addEventListener('mouseleave', function () {
      var swiperEl = heroBanner.querySelector('.hero-swiper');
      if (swiperEl && swiperEl.swiper && swiperEl.swiper.autoplay) {
        swiperEl.swiper.autoplay.start();
      }
    });

    // Re-trigger slide animations on slide change
    var heroSwiperEl = heroBanner.querySelector('.hero-swiper');
    if (heroSwiperEl && heroSwiperEl.swiper) {
      heroSwiperEl.swiper.on('slideChangeTransitionStart', function () {
        var activeSlide = heroSwiperEl.querySelector('.swiper-slide-active');
        if (activeSlide) {
          var titleBox = activeSlide.querySelector('.banner-skew-title-box');
          var metaBox = activeSlide.querySelector('.banner-skew-meta');
          if (titleBox) {
            titleBox.style.animation = 'none';
            void titleBox.offsetWidth; // trigger reflow
            titleBox.style.animation = 'animTitle 0.9s cubic-bezier(0.16, 1, 0.3, 1) both';
          }
          if (metaBox) {
            metaBox.style.animation = 'none';
            void metaBox.offsetWidth; // trigger reflow
            metaBox.style.animation = 'animTop 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both';
          }
        }
      });
    }
  }

  // =========================================================================
  // 4. BUTTON HOVER RIPPLE / ANIMATE (NHƯ GD BUTTON.SASS)
  // =========================================================================
  function initButtonHoverEffects() {
    var btns = document.querySelectorAll('.btn-vnit, .button .btn');
    btns.forEach(function (btn) {
      if (btn.__hasHoverEffect) return;
      btn.__hasHoverEffect = true;

      btn.addEventListener('mouseenter', function (e) {
        var animDot = btn.querySelector('.animate');
        if (!animDot) return;
        var rect = btn.getBoundingClientRect();
        var relX = e.clientX - rect.left;
        var relY = e.clientY - rect.top;
        animDot.style.left = relX + 'px';
        animDot.style.top = relY + 'px';
      });
    });
  }

  // =========================================================================
  // 5. 360-DEGREE FLY-IN CONVERGENCE ENGINE (SERVICES, CAPABILITIES, PARTNERS)
  // (Hiệu ứng bay vào hội tụ chuyên nghiệp từ xung quanh cho Dịch Vụ, Năng Lực, Đối Tác)
  // =========================================================================
  function initFlyInClusters() {
    var clusters = document.querySelectorAll('.partner-fly-cluster, .service-fly-cluster, .cap-fly-cluster');
    if (!clusters || clusters.length === 0) return;

    if (prefersReducedMotion || document.body.classList.contains('cms-editing-active')) {
      clusters.forEach(function (c) { c.classList.add('is-assembled'); });
      return;
    }

    // Dynamic angles for partner items if needed
    var partnerClusters = document.querySelectorAll('.partner-fly-cluster');
    partnerClusters.forEach(function (cluster) {
      var items = cluster.querySelectorAll('.partner-fly-item');
      var isMobile = window.innerWidth <= 768;
      var count = items.length;

      items.forEach(function (item, idx) {
        if (!item.style.getPropertyValue('--fly-x') && !item.classList.contains('partner-fly-1')) {
          var angle = (idx / count) * 2 * Math.PI - (Math.PI / 2);
          var dist = isMobile ? 120 : 320;
          var fx = Math.round(Math.cos(angle) * dist);
          var fy = Math.round(Math.sin(angle) * (dist * 0.75));
          var rot = Math.round(Math.sin(angle) * 20);
          var delay = (idx * 0.05).toFixed(2);

          item.style.setProperty('--fly-x', fx + 'px');
          item.style.setProperty('--fly-y', fy + 'px');
          item.style.setProperty('--fly-r', rot + 'deg');
          item.style.setProperty('--fly-delay', delay + 's');
        }
      });
    });

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-assembled');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    clusters.forEach(function (cluster) {
      var rect = cluster.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setTimeout(function () {
          cluster.classList.add('is-assembled');
        }, 200);
      } else {
        observer.observe(cluster);
      }
    });
  }

  // =========================================================================
  // 6. MASTER INITIALIZATION
  // =========================================================================
  function initAllAnimations() {
    initNumberCounters();
    initScrollReveal();
    initBannerEffects();
    initButtonHoverEffects();
    initFlyInClusters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllAnimations);
  } else {
    initAllAnimations();
  }

  // Re-observe if dynamic tabs change (e.g. tabslet switch)
  window.addEventListener('vnit:tabChanged', function () {
    setTimeout(function () {
      initScrollReveal();
      initFlyInClusters();
    }, 100);
  });

  // Export to window for external control
  window.vnitAnimations = {
    init: initAllAnimations,
    initNumberCounters: initNumberCounters,
    initScrollReveal: initScrollReveal,
    initFlyInClusters: initFlyInClusters,
    initPartnerFlyIn: initFlyInClusters
  };

})();
