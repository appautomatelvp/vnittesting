/**
 * VNIT Main Interactive Script
 * Handles navigation, mobile drawer, tabslet, project modals, filters, and forms
 */

// =========================================================================
// F5 / RELOAD TO HOMEPAGE GUARANTEE
// Pressing F5, Ctrl+R, or reloading from any sub-page always returns to index.html
// =========================================================================
(function () {
  try {
    var isReload = false;
    var navEntries = performance.getEntriesByType('navigation');
    if (navEntries && navEntries.length > 0) {
      isReload = (navEntries[0].type === 'reload');
    } else if (window.performance && window.performance.navigation) {
      isReload = (window.performance.navigation.type === 1);
    }
    if (isReload) {
      var currentFile = window.location.pathname.split('/').pop() || 'index.html';
      if (currentFile !== 'index.html') {
        window.location.replace('index.html');
        return;
      } else if (window.location.hash) {
        window.location.replace('index.html');
        return;
      }
    }
  } catch (e) {}

  window.addEventListener('keydown', function (e) {
    if (e.key === 'F5' || (e.ctrlKey && (e.key === 'r' || e.key === 'R'))) {
      var currentFile = window.location.pathname.split('/').pop() || 'index.html';
      if (currentFile !== 'index.html' || window.location.hash) {
        e.preventDefault();
        window.location.href = 'index.html';
      }
    }
  });
})();

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // 1. Header scroll effect (GPU optimized with passive listener)
  const header = document.querySelector('header');
  if (header) {
    let isScrolled = false;
    window.addEventListener('scroll', function () {
      const shouldScroll = window.scrollY > 30;
      if (shouldScroll !== isScrolled) {
        isScrolled = shouldScroll;
        if (isScrolled) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    }, { passive: true });
  }

  // 2. Mobile drawer navigation
  const toggler = document.querySelector('.navbar-toggler');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.mobile-overlay');
  const drawerClose = document.querySelector('.mobile-drawer-close');

  function openDrawer() {
    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (toggler) toggler.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  // Mobile drawer sub-menu accordions
  const mobileHasSub = document.querySelectorAll('.mobile-nav-list li.has-sub > a');
  mobileHasSub.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      const parent = item.parentElement;
      const sub = parent.querySelector('.mobile-sub-menu');
      if (sub) {
        sub.classList.toggle('open');
        const icon = item.querySelector('.sub-toggle-icon');
        if (icon) {
          if (icon.tagName === 'I') {
            icon.className = sub.classList.contains('open')
              ? 'ri-arrow-up-s-line sub-toggle-icon'
              : 'ri-arrow-down-s-line sub-toggle-icon';
          } else {
            icon.textContent = sub.classList.contains('open') ? 'expand_less' : 'expand_more';
          }
        }
      }
    });
  });

  // 3. Search Bar Overlay Toggle
  const searchBtn = document.querySelector('.btn-search-toggle');
  const searchWrap = document.querySelector('.search-wrap');
  const closeSearchBtn = document.querySelector('.btn-close-search');

  if (searchBtn && searchWrap) {
    searchBtn.addEventListener('click', function (e) {
      e.preventDefault();
      searchWrap.classList.toggle('active');
      if (searchWrap.classList.contains('active')) {
        const input = searchWrap.querySelector('input');
        if (input) input.focus();
      }
    });
  }

  if (closeSearchBtn && searchWrap) {
    closeSearchBtn.addEventListener('click', function () {
      searchWrap.classList.remove('active');
    });
  }

  // =========================================================================
  // 4. Universal Tabslet & In-Page Navigation System
  // Supports:
  // - Tabs subnav (.vnit-tabs-nav li a)
  // - Top Header Mega-Menu dropdown links (.mega-menu a)
  // - Mobile Drawer sub-menu links (.mobile-sub-menu a)
  // - Footer & inline anchor links (a[href*="#"])
  // - du-an.html Project Filter mapping
  // =========================================================================
  // 4. UNIFIED TAB & ANCHOR NAVIGATION ENGINE
  // Synchronizes:
  // - Tabs subnav (.vnit-tabs-nav li a)
  // - Top Header Mega-Menu dropdown links (.mega-menu a)
  // - Mobile Drawer sub-menu links (.mobile-sub-menu a)
  // - du-an.html Project Filter mapping
  // - Prevents any viewport jump down to content panes
  // - Always preserves Header + Top menu + Sub tabs in full view (Hình 1)
  // =========================================================================

  function syncMegaMenu(hash) {
    if (!hash) return;
    var cleanHash = hash.startsWith('#') ? hash : ('#' + hash);

    // Synchronize desktop mega-menu
    document.querySelectorAll('.mega-menu li').forEach(function (mLi) {
      mLi.classList.remove('active');
    });
    document.querySelectorAll('.mega-menu a').forEach(function (mLink) {
      var mHref = mLink.getAttribute('href') || '';
      if (mHref.endsWith(cleanHash) || mHref === cleanHash) {
        var mLi = mLink.closest('li');
        if (mLi) mLi.classList.add('active');
      }
    });

    // Synchronize mobile drawer sub-menu
    document.querySelectorAll('.mobile-sub-menu li').forEach(function (mLi) {
      mLi.classList.remove('active');
    });
    document.querySelectorAll('.mobile-sub-menu a').forEach(function (mLink) {
      var mHref = mLink.getAttribute('href') || '';
      if (mHref.endsWith(cleanHash) || mHref === cleanHash) {
        var mLi = mLink.closest('li');
        if (mLi) mLi.classList.add('active');
      }
    });
  }

  function activateVnitTab(rawTarget, shouldScroll) {
    if (!rawTarget) return false;

    // Clean hash extraction (e.g. "nang-luc.html#trang-thiet-bi" -> "#trang-thiet-bi")
    var hash = '';
    if (rawTarget.indexOf('#') !== -1) {
      hash = '#' + rawTarget.split('#')[1].trim();
    } else if (rawTarget.startsWith('#')) {
      hash = rawTarget.trim();
    } else {
      hash = '#' + rawTarget.trim();
    }

    if (!hash || hash === '#' || hash.length < 2) return false;

    var activated = false;

    // A. Check for .vnit-tab-pane matching the hash ID
    var targetPane = null;
    try {
      targetPane = document.querySelector(hash + '.vnit-tab-pane') || document.querySelector(hash);
    } catch (e) {
      targetPane = document.getElementById(hash.replace('#', ''));
    }

    if (targetPane && targetPane.classList.contains('vnit-tab-pane')) {
      var container = targetPane.closest('.vnit-tabs-container') || document;

      // 1. Deactivate all sibling panes in this container
      container.querySelectorAll('.vnit-tab-pane').forEach(function (pane) {
        pane.classList.remove('active');
      });

      // 2. Activate target pane
      targetPane.classList.add('active');
      activated = true;

      // 3. Update .vnit-tabs-nav active pill (Tab Dưới)
      var parentNav = container.querySelector('.vnit-tabs-nav');
      if (parentNav) {
        parentNav.querySelectorAll('li').forEach(function (li) {
          li.classList.remove('active');
        });

        var matchingLink = parentNav.querySelector('a[href$="' + hash + '"]') ||
                           parentNav.querySelector('a[href="' + hash + '"]');
        if (matchingLink) {
          var parentLi = matchingLink.closest('li');
          if (parentLi) parentLi.classList.add('active');

          // Scroll ONLY horizontal nav list if it overflows on mobile
          if (parentNav.scrollWidth > parentNav.clientWidth) {
            try {
              var navBox = parentNav.getBoundingClientRect();
              var linkBox = matchingLink.getBoundingClientRect();
              var scrollOffset = (linkBox.left - navBox.left) - (navBox.width / 2) + (linkBox.width / 2);
              parentNav.scrollBy({ left: scrollOffset, behavior: 'smooth' });
            } catch (err) {}
          }
        }
      }

      // 4. Synchronize Header Mega-Menu (Tab Trên) & Mobile Menu items
      syncMegaMenu(hash);

      // 5. CRITICAL: NEVER jump down to content pane!
      // Keep Header + Top tabs + Sub tabs in full view (Hình 1).
      if (window.scrollY > 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    // B. Check for du-an.html Project Filters
    var filterKey = hash.replace('#', '');
    var filterMapping = {
      'du-an-tieu-bieu': 'all',
      'all': 'all',
      'ngoai-khoi': 'ngoai-khoi',
      'loc-hoa-dau': 'valves-pressure',
      'valves-pressure': 'valves-pressure',
      'nang-luong': 'dien-mayquay',
      'dien-mayquay': 'dien-mayquay'
    };

    var targetFilter = filterMapping[filterKey] || filterKey;
    var filterBtn = document.querySelector('.project-filter-btn[data-filter="' + targetFilter + '"]');
    if (filterBtn) {
      filterBtn.click();
      activated = true;

      syncMegaMenu(hash);

      if (window.scrollY > 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    // C. Fallback: Standard in-page anchor (only for anchors that are NOT tab panes)
    if (!activated && targetPane && shouldScroll) {
      var yOffset = -90;
      var y = targetPane.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      activated = true;
    }

    // Update URL hash without page jump
    if (activated) {
      try {
        if (window.location.hash !== hash) {
          history.replaceState(null, '', hash);
        }
      } catch (e) {}
    }

    return activated;
  }

  // Handle direct click on tabs nav pills (.vnit-tabs-nav)
  document.addEventListener('click', function (e) {
    var tabLink = e.target.closest('.vnit-tabs-nav a, .vnit-tabs-nav li');
    if (tabLink) {
      var linkEl = tabLink.tagName === 'A' ? tabLink : tabLink.querySelector('a');
      if (linkEl) {
        var href = linkEl.getAttribute('href');
        if (href && href.includes('#')) {
          e.preventDefault();
          e.stopPropagation();
          activateVnitTab(href, false);
        }
      }
    }
  });

  // Handle click on Header Mega-Menu, Mobile Drawer, Footer, and any in-page link
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (!link) return;

    if (link.closest('.vnit-tabs-nav')) return;

    var href = link.getAttribute('href');
    if (!href || href === '#' || href.startsWith('javascript:')) return;

    if (href.indexOf('#') !== -1) {
      var parts = href.split('#');
      var targetPath = parts[0];
      var targetHash = '#' + parts[1];

      var currentPath = window.location.pathname.split('/').pop() || 'index.html';

      var isCurrentPage = !targetPath ||
                          targetPath === currentPath ||
                          targetPath.endsWith('/' + currentPath) ||
                          (currentPath === 'index.html' && (targetPath === '' || targetPath === '/'));

      if (isCurrentPage && targetHash.length > 1) {
        var handled = activateVnitTab(targetHash, false);
        if (handled) {
          e.preventDefault();
          e.stopPropagation();

          if (typeof closeDrawer === 'function') {
            closeDrawer();
          }

          var megaParent = link.closest('.has-mega');
          if (megaParent) {
            megaParent.classList.remove('hover');
          }
        }
      }
    }
  });

  // Listen to hashchange for browser navigation (Back / Forward)
  window.addEventListener('hashchange', function (e) {
    if (window.location.hash) {
      e.preventDefault();
      activateVnitTab(window.location.hash, false);
      window.scrollTo(0, 0);
    }
  });

  // On page load: prevent scroll jump and sync tabs + mega-menu immediately
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  function initTabSyncOnLoad() {
    if (window.location.hash) {
      window.scrollTo(0, 0);
      activateVnitTab(window.location.hash, false);
      window.scrollTo(0, 0);
    } else {
      // If no hash in URL, sync the currently active tab pill with mega-menu
      var activeTabPill = document.querySelector('.vnit-tabs-nav li.active a') ||
                          document.querySelector('.vnit-tabs-nav a');
      if (activeTabPill) {
        var defaultHash = activeTabPill.getAttribute('href');
        if (defaultHash && defaultHash.includes('#')) {
          syncMegaMenu(defaultHash);
        }
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTabSyncOnLoad);
  } else {
    initTabSyncOnLoad();
  }

  window.addEventListener('load', function () {
    if (window.location.hash) {
      window.scrollTo(0, 0);
      activateVnitTab(window.location.hash, false);
      setTimeout(function () {
        window.scrollTo(0, 0);
      }, 50);
    }
  });

  // 5. Project Filtering
  const projectFilters = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-filter-item');

  projectFilters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      projectFilters.forEach(function (b) {
        b.classList.remove('active');
        b.style.background = '#f1f4f8';
        b.style.color = 'var(--vnit-primary)';
        b.style.borderColor = 'var(--vnit-border)';
      });
      btn.classList.add('active');
      btn.style.background = 'var(--vnit-primary)';
      btn.style.color = '#fff';
      btn.style.borderColor = 'var(--vnit-primary)';

      const filterVal = btn.getAttribute('data-filter');
      projectCards.forEach(function (card) {
        if (filterVal === 'all' || card.getAttribute('data-category') === filterVal) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 6. Interactive Modal (Project Details & Application)
  const modalTriggers = document.querySelectorAll('[data-vnit-modal]');
  const modals = document.querySelectorAll('.vnit-modal');
  const modalCloses = document.querySelectorAll('.vnit-modal-close, .modal-close-btn');

  modalTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      const targetModalId = trigger.getAttribute('data-vnit-modal');
      const targetModal = document.getElementById(targetModalId);
      if (targetModal) {
        targetModal.classList.add('show');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modalCloses.forEach(function (closeBtn) {
    closeBtn.addEventListener('click', function () {
      modals.forEach(function (m) { m.classList.remove('show'); });
      document.body.style.overflow = '';
    });
  });

  window.addEventListener('click', function (e) {
    modals.forEach(function (m) {
      if (e.target === m) {
        m.classList.remove('show');
        document.body.style.overflow = '';
      }
    });
  });

  // 7. Toast Notification Utility
  window.showToast = function (message) {
    let toast = document.querySelector('.vnit-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'vnit-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(function () {
      toast.style.display = 'none';
    }, 3500);
  };

  // 8. Form Submissions
  const forms = document.querySelectorAll('form[data-vnit-form]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const formType = form.getAttribute('data-vnit-form');
      if (formType === 'newsletter') {
        const msg = (window.vnitI18n && window.vnitI18n.getLanguage() === 'en')
          ? 'Thank you! You have successfully subscribed to VNIT technical newsletter.'
          : 'Cảm ơn bạn! Đã đăng ký nhận bản tin kỹ thuật VNIT thành công.';
        window.showToast(msg);
      } else if (formType === 'contact') {
        const msg = (window.vnitI18n && window.vnitI18n.getLanguage() === 'en')
          ? 'Thank you! Your request has been sent to VNIT. We will respond within 24 hours.'
          : 'Cảm ơn bạn! Yêu cầu của bạn đã được gửi tới VNIT. Chúng tôi sẽ liên hệ trong 24h.';
        window.showToast(msg);
      } else if (formType === 'apply') {
        const msg = (window.vnitI18n && window.vnitI18n.getLanguage() === 'en')
          ? 'Your application has been received successfully. VNIT HR will be in touch shortly!'
          : 'Hồ sơ ứng tuyển của bạn đã được tiếp nhận thành công. Phòng Nhân sự VNIT sẽ phản hồi sớm!';
        window.showToast(msg);
        modals.forEach(function (m) { m.classList.remove('show'); });
        document.body.style.overflow = '';
      }
      form.reset();
    });
  });

  // 9. Initialize Swiper if present
  if (typeof Swiper !== 'undefined') {
    // Banner Swiper
    new Swiper('.hero-swiper', {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.hero-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.hero-next',
        prevEl: '.hero-prev',
      },
    });

    // Partner Swiper
    new Swiper('.partner-swiper', {
      slidesPerView: 2,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      breakpoints: {
        640: { slidesPerView: 3, spaceBetween: 20 },
        768: { slidesPerView: 4, spaceBetween: 30 },
        1024: { slidesPerView: 6, spaceBetween: 30 },
      },
    });

    // Project Swiper
    new Swiper('.project-swiper', {
      slidesPerView: 1,
      spaceBetween: 25,
      loop: true,
      navigation: {
        nextEl: '.project-next',
        prevEl: '.project-prev',
      },
      breakpoints: {
        768: { slidesPerView: 2, spaceBetween: 25 },
        1024: { slidesPerView: 3, spaceBetween: 30 },
      },
    });
  }
});
