// ============================================================
// FILE: assets/js/firebase-sync.js
// Đồng bộ Dữ liệu Realtime Toàn Diện từ Firebase & LocalStorage ra Toàn Bộ Website VNIT
// ============================================================

(function () {
  console.log('[CMS Sync] Khởi tạo hệ thống đồng bộ Omni-channel VNIT...');

  // ==========================================================
  // 1. CÁC HÀM CẬP NHẬT GIAO DIỆN TOÀN DIỆN (DOM UPDATERS)
  // ==========================================================

  // A. Đồng bộ Hotline di động 24/7 (Header, Footer, Liên hệ, Call buttons)
  function applyGlobalHotline(newHotline) {
    if (!newHotline) return;
    const cleanDigits = newHotline.replace(/\D/g, '');

    // 1. Cập nhật tất cả thẻ link a[href^="tel:"]
    document.querySelectorAll('a[href^="tel:"]').forEach(a => {
      a.href = 'tel:' + cleanDigits;
      const strong = a.querySelector('strong');
      if (strong) {
        strong.textContent = newHotline;
      } else if (a.textContent.trim().match(/^0\d+/)) {
        a.textContent = newHotline;
      }
    });

    // 2. Cập nhật trên Header
    document.querySelectorAll('.top-info li, header li').forEach(li => {
      if (li.textContent.includes('Hotline:') || li.querySelector('.ri-phone-fill')) {
        const icon = li.querySelector('i')?.outerHTML || '<i class="ri-phone-fill" style="color: var(--vnit-accent);"></i>';
        li.innerHTML = `${icon} <span>Hotline: <a href="tel:${cleanDigits}"><strong>${newHotline}</strong></a></span>`;
      }
    });

    // 3. Cập nhật tại Chân trang (Footer) - Tất cả các thẻ li/p chứa Hotline
    document.querySelectorAll('footer li, footer p, .footer-info li').forEach(li => {
      if (li.textContent.includes('Hotline:') || li.querySelector('.ri-customer-service-2-fill, .ri-customer-service-fill')) {
        const icon = li.querySelector('i')?.outerHTML || '<i class="ri-customer-service-2-fill" style="color: var(--vnit-accent);"></i>';
        li.innerHTML = `${icon} Hotline: <strong style="color: var(--vnit-accent);">${newHotline}</strong>`;
      }
    });

    // 4. Cập nhật trên Trang Liên Hệ (lien-he.html) trong Facility Cards
    document.querySelectorAll('.facility-card p').forEach(p => {
      if (p.textContent.includes('Hotline:')) {
        p.innerHTML = p.innerHTML.replace(/Hotline:\s*<strong[^>]*>.*?<\/strong>/i, `Hotline: <strong style="color: var(--vnit-secondary);">${newHotline}</strong>`);
        p.innerHTML = p.innerHTML.replace(/Hotline:\s*0\d{2,3}[\.\s]?\d{3}[\.\s]?\d{3,4}/i, `Hotline: <strong style="color: var(--vnit-secondary);">${newHotline}</strong>`);
      }
    });

    // 5. Cập nhật nút gọi nhanh
    document.querySelectorAll('.btn-quick-call, .floating-phone-btn').forEach(btn => {
      if (btn.tagName === 'A') btn.href = 'tel:' + cleanDigits;
    });
  }

  // B. Đồng bộ Điện thoại bàn & Fax
  function applyGlobalTel(newTel) {
    if (!newTel) return;
    document.querySelectorAll('footer li').forEach(li => {
      if (li.textContent.includes('Tel:') || li.querySelector('.ri-phone-fill')) {
        const icon = li.querySelector('i')?.outerHTML || '<i class="ri-phone-fill" style="color: var(--vnit-accent);"></i>';
        li.innerHTML = `${icon} Tel: ${newTel} | Fax: ${newTel}`;
      }
    });
    document.querySelectorAll('.facility-card p').forEach(p => {
      if (p.textContent.includes('Điện thoại:') || p.textContent.includes('Tel:')) {
        p.innerHTML = p.innerHTML.replace(/Điện thoại:\s*<strong>.*?<\/strong>/i, `Điện thoại: <strong>${newTel}</strong>`);
      }
    });
  }

  // C. Đồng bộ Email công ty
  function applyGlobalEmail(newEmail) {
    if (!newEmail) return;

    // Header
    document.querySelectorAll('.top-info li, header li').forEach(li => {
      if (li.textContent.includes('Email:')) {
        const icon = li.querySelector('i')?.outerHTML || '<i class="ri-mail-fill" style="color: var(--vnit-accent);"></i>';
        li.innerHTML = `${icon} <span>Email: <a href="mailto:${newEmail}">${newEmail}</a></span>`;
      }
    });

    // Footer
    document.querySelectorAll('footer li').forEach(li => {
      if (li.textContent.includes('Email:') || li.querySelector('.ri-mail-fill')) {
        const icon = li.querySelector('i')?.outerHTML || '<i class="ri-mail-fill" style="color: var(--vnit-accent);"></i>';
        li.innerHTML = `${icon} Email: <a href="mailto:${newEmail}" style="color: #cbd5e0;">${newEmail}</a>`;
      }
    });

    // Facility Cards
    document.querySelectorAll('.facility-card p').forEach(p => {
      if (p.textContent.includes('Email:')) {
        p.innerHTML = p.innerHTML.replace(/Email:\s*<strong>.*?<\/strong>/i, `Email: <strong>${newEmail}</strong>`);
        p.innerHTML = p.innerHTML.replace(/Email:\s*[\w\.-]+@[\w\.-]+\.\w+/i, `Email: <strong>${newEmail}</strong>`);
      }
    });

    // Tất cả thẻ mailto
    document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
      a.href = 'mailto:' + newEmail;
      if (a.textContent.includes('@')) a.textContent = newEmail;
    });
  }

  // D. Đồng bộ Địa chỉ trụ sở & Google Maps
  function applyGlobalAddress(newAddr) {
    if (!newAddr) return;

    // Footer
    document.querySelectorAll('span[data-i18n="footer.address"]').forEach(span => {
      span.textContent = newAddr;
    });
    document.querySelectorAll('footer li').forEach(li => {
      if (li.querySelector('.ri-map-pin-2-fill, .ri-map-pin-fill') || li.innerText.includes('Quang Dũng') || li.innerText.includes('Vũng Tàu')) {
        li.innerHTML = `<i class="ri-map-pin-2-fill" style="color: var(--vnit-accent);"></i> ${newAddr}`;
      }
    });

    // Trang liên hệ
    const locCardAddr = document.getElementById('loc-card-address');
    if (locCardAddr) {
      locCardAddr.innerHTML = `<i class="ri-map-pin-2-fill" style="color:#0066bf;"></i> ${newAddr}`;
    }
    const fac0 = document.getElementById('facility-card-0');
    if (fac0) {
      const pAddr = fac0.querySelector('p');
      if (pAddr) pAddr.textContent = newAddr;
    }

    // Google Maps iframe & chỉ đường
    const encodedAddr = encodeURIComponent(newAddr);
    const mapIframe = document.getElementById('vnit-google-iframe');
    if (mapIframe) {
      mapIframe.src = `https://maps.google.com/maps?q=${encodedAddr}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
    }
    document.querySelectorAll('a[href*="google.com/maps/dir"]').forEach(a => {
      a.href = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddr}`;
    });
    document.querySelectorAll('a[href*="google.com/maps/search"]').forEach(a => {
      a.href = `https://www.google.com/maps/search/?api=1&query=${encodedAddr}`;
    });
  }

  // E. Đồng bộ Tên công ty
  function applyGlobalCompanyName(newName) {
    if (!newName) return;
    document.querySelectorAll('[data-i18n="footer.company_name"]').forEach(el => {
      el.textContent = newName;
    });
    document.querySelectorAll('footer p').forEach(p => {
      if (p.innerText.includes('CÔNG TY TNHH KIỂM ĐỊNH') || p.innerText.includes('VNIT')) {
        p.textContent = newName;
      }
    });
  }

  // F. Khôi phục chỉnh sửa trực quan (Local / Visual edits)
  function applyLocalEdits() {
    try {
      const raw = localStorage.getItem('vnit_cms_local_edits');
      if (!raw) return;
      const edits = JSON.parse(raw);
      Object.keys(edits).forEach(sel => {
        const item = edits[sel];
        const el = document.querySelector(sel);
        if (el) {
          if (item.type === 'image' && item.src) {
            el.src = item.src;
            if (el.parentElement && el.parentElement.tagName === 'A') {
              el.parentElement.href = item.src;
            }
          } else if (item.type === 'text' && (item.html || item.text)) {
            el.innerHTML = item.html || item.text;
            if (item.color) el.style.color = item.color;
            if (item.fontSize) el.style.fontSize = item.fontSize;
            if (item.fontWeight) el.style.fontWeight = item.fontWeight;
            if (item.textAlign) el.style.textAlign = item.textAlign;
          }
        }
      });
    } catch (e) {}
  }

  // G. Áp dụng thông tin dùng chung từ cache LocalStorage
  function hydrateFromLocalStorage() {
    try {
      const rawGlobal = localStorage.getItem('vnit_cms_global_info');
      if (rawGlobal) {
        const info = JSON.parse(rawGlobal);
        if (info.hotline) applyGlobalHotline(info.hotline);
        if (info.tel) applyGlobalTel(info.tel);
        if (info.email) applyGlobalEmail(info.email);
        if (info.address) applyGlobalAddress(info.address);
        if (info.companyName) applyGlobalCompanyName(info.companyName);
      }
    } catch (e) {}

    applyLocalEdits();
  }

  // Thực hiện ngay lập tức 0ms
  hydrateFromLocalStorage();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrateFromLocalStorage);
  }
  window.addEventListener('load', hydrateFromLocalStorage);

  // ==========================================================
  // 2. CROSS-TAB REALTIME SYNC (Đồng bộ tức thì giữa các tab trình duyệt)
  // ==========================================================
  window.addEventListener('storage', (e) => {
    if (e.key === 'vnit_cms_global_info' && e.newValue) {
      try {
        const info = JSON.parse(e.newValue);
        if (info.hotline) applyGlobalHotline(info.hotline);
        if (info.tel) applyGlobalTel(info.tel);
        if (info.email) applyGlobalEmail(info.email);
        if (info.address) applyGlobalAddress(info.address);
        if (info.companyName) applyGlobalCompanyName(info.companyName);
      } catch (err) {}
    } else if (e.key === 'vnit_cms_local_edits') {
      applyLocalEdits();
    }
  });

  // ==========================================================
  // 3. KẾT NỐI FIREBASE FIRESTORE REALTIME SYNC
  // ==========================================================
  const firebaseConfig = {
    apiKey: "AIzaSyACw62O9MOxdssL08Vbe0bp36pXGIdK_v8",
    authDomain: "freelacer-web1-5a188.firebaseapp.com",
    projectId: "freelacer-web1-5a188",
    storageBucket: "freelacer-web1-5a188.firebasestorage.app",
    messagingSenderId: "613305277804",
    appId: "1:613305277804:web:6d80f1e2d8111317292749"
  };

  function loadScript(src, cb) {
    if (document.querySelector(`script[src="${src}"]`)) {
      if (cb) cb();
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.onload = cb;
    document.head.appendChild(s);
  }

  loadScript('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js', () => {
    loadScript('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js', () => {
      if (!window.firebase.apps.length) {
        window.firebase.initializeApp(firebaseConfig);
      }
      const db = window.firebase.firestore();
      console.log('[CMS Sync] ✅ Đã kết nối Firebase Firestore thành công!');

      // 1. Đồng bộ Cài đặt chung (Hotline, Tel, Email, Địa chỉ, Tên công ty, Bản quyền)
      db.collection('settings').doc('general').onSnapshot((doc) => {
        if (!doc.exists) return;
        const data = doc.data();

        if (data.hotline) applyGlobalHotline(data.hotline);
        if (data.tel) applyGlobalTel(data.tel);
        if (data.email) applyGlobalEmail(data.email);
        if (data.address_vi) applyGlobalAddress(data.address_vi);
        if (data.companyName_vi) applyGlobalCompanyName(data.companyName_vi);

        // Giấy phép & Copyright
        if (data.license) {
          document.querySelectorAll('[data-i18n="footer.license"]').forEach(el => {
            el.textContent = data.license;
          });
        }
        if (data.copyright) {
          document.querySelectorAll('[data-i18n="footer.copyright"]').forEach(el => {
            el.textContent = data.copyright;
          });
        }

        // Cập nhật lại Cache LocalStorage
        try {
          const rawGlobal = localStorage.getItem('vnit_cms_global_info') || '{}';
          const info = JSON.parse(rawGlobal);
          if (data.hotline) info.hotline = data.hotline;
          if (data.tel) info.tel = data.tel;
          if (data.email) info.email = data.email;
          if (data.address_vi) info.address = data.address_vi;
          if (data.companyName_vi) info.companyName = data.companyName_vi;
          localStorage.setItem('vnit_cms_global_info', JSON.stringify(info));
        } catch (e) {}
      });

      // 2. Đồng bộ Homepage Settings (Hero Slider, Ticker, Stats)
      db.collection('settings').doc('homepage').onSnapshot((doc) => {
        if (!doc.exists) return;
        const data = doc.data();

        // Hero Banner Slide 1
        if (data.heroSlide) {
          const heroTitle = document.querySelector('.hero-swiper .swiper-slide:first-child h1');
          if (heroTitle && data.heroSlide.title_vi) {
            heroTitle.textContent = data.heroSlide.title_vi;
          }
          const heroBadge = document.querySelector('.hero-swiper .swiper-slide:first-child .banner-skew-badge span');
          if (heroBadge && data.heroSlide.badge_vi) {
            heroBadge.textContent = data.heroSlide.badge_vi;
          }
          const heroImg = document.querySelector('.hero-swiper .swiper-slide:first-child .hero-bg-img');
          if (heroImg && data.heroSlide.imageUrl) {
            heroImg.src = data.heroSlide.imageUrl;
          }
        }

        // Ticker Tin Nổi Bật
        if (data.tickerText && data.tickerText.title_vi) {
          const firstTicker = document.querySelector('.ticker-marquee .ticker-item:first-child');
          if (firstTicker) {
            const dateEl = firstTicker.querySelector('.ticker-date');
            if (dateEl && data.tickerText.date) dateEl.textContent = data.tickerText.date;
            const textEl = firstTicker.querySelector('span:not(.ticker-date)');
            if (textEl) textEl.textContent = data.tickerText.title_vi;
          }
        }

        // 4 Khối Số Liệu
        if (data.stats && Array.isArray(data.stats)) {
          const statItems = document.querySelectorAll('.full-stats-section .stat-item-wide');
          data.stats.forEach((s, idx) => {
            if (statItems[idx]) {
              const numEl = statItems[idx].querySelector('.stat-number-wide');
              if (numEl && s.num) numEl.textContent = s.num;
              const titleEl = statItems[idx].querySelector('.stat-title-wide');
              if (titleEl && s.label_vi) titleEl.textContent = s.label_vi;
              const descEl = statItems[idx].querySelector('.stat-desc-wide');
              if (descEl && s.desc_vi) descEl.textContent = s.desc_vi;
            }
          });
        }
      });

      // 3. Đồng bộ Page Overrides từ Firestore (Chỉnh sửa văn bản)
      db.collection('settings').doc('page_overrides').onSnapshot((doc) => {
        if (!doc.exists) return;
        const overrides = doc.data();
        Object.keys(overrides).forEach(key => {
          const item = overrides[key];
          if (item && item.selector) {
            const el = document.querySelector(item.selector);
            if (el) {
              if (item.html) el.innerHTML = item.html;
              else if (item.text) el.textContent = item.text;
              if (item.color) el.style.color = item.color;
              if (item.fontSize) el.style.fontSize = item.fontSize;
              if (item.fontWeight) el.style.fontWeight = item.fontWeight;
              if (item.textAlign) el.style.textAlign = item.textAlign;
            }
          }
        });
      });

      // 4. Đồng bộ Media Overrides từ Firestore (Hình ảnh)
      db.collection('settings').doc('media_overrides').onSnapshot((doc) => {
        if (!doc.exists) return;
        const media = doc.data();
        Object.keys(media).forEach(key => {
          const src = media[key];
          if (typeof src === 'string' && src) {
            // Find img matching key
            const img = document.querySelector(`img[src*="${key}"]`) || document.getElementById(key);
            if (img) img.src = src;
          }
        });
      });

      // 5. Đồng bộ Dịch Vụ Cốt Lõi (Services)
      db.collection('services').onSnapshot((snapshot) => {
        if (snapshot.empty) return;
        const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        const cards = document.querySelectorAll('.service-card');
        docs.forEach((item, idx) => {
          if (cards[idx]) {
            const t = cards[idx].querySelector('.service-card-title');
            if (t && item.name_vi) t.textContent = item.name_vi;
            const d = cards[idx].querySelector('.service-card-desc');
            if (d && item.description_vi) {
              d.innerHTML = item.description_vi.replace(/<[^>]*>?/gm, '').length > 0 ? item.description_vi : d.innerHTML;
            }
          }
        });
      });

      // 6. Đồng bộ Dự Án Tiêu Biểu (Projects)
      db.collection('projects').onSnapshot((snapshot) => {
        if (snapshot.empty) return;
        const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        const cards = document.querySelectorAll('section:not(.section-bg-light) .project-card');
        docs.forEach((item, idx) => {
          if (cards[idx]) {
            const t = cards[idx].querySelector('.project-title');
            if (t && item.name_vi) t.textContent = item.name_vi;
            const b = cards[idx].querySelector('.project-badge');
            if (b && item.client) b.textContent = item.client;
            const img = cards[idx].querySelector('img');
            if (img && item.imageUrl) img.src = item.imageUrl;
          }
        });
      });

      // 7. Đồng bộ Bài Viết Tin Tức (News)
      db.collection('news').onSnapshot((snapshot) => {
        if (snapshot.empty) return;
        const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        const newsCards = document.querySelectorAll('.section-bg-light .project-card, section:has([data-i18n*="news"]) .project-card');
        docs.forEach((item, idx) => {
          if (newsCards[idx]) {
            const t = newsCards[idx].querySelector('h3, h4');
            if (t && item.title_vi) t.textContent = item.title_vi;
            const p = newsCards[idx].querySelector('p');
            if (p && (item.summary_vi || item.content_vi)) {
              const cleanText = (item.summary_vi || item.content_vi).replace(/<[^>]*>?/gm, '');
              p.textContent = cleanText.substring(0, 160) + (cleanText.length > 160 ? '...' : '');
            }
            const img = newsCards[idx].querySelector('img');
            if (img && item.imageUrl) img.src = item.imageUrl;
            const badge = newsCards[idx].querySelector('.project-badge');
            if (badge && (item.categoryName || item.category)) {
              badge.textContent = item.categoryName || item.category;
            }
          }
        });
      });

    });
  });
})();
