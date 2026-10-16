// ============================================================
// FILE: assets/js/cms-editor.js
// TRÌNH BIÊN TẬP TRỰC QUAN DOANH NGHIỆP — PHIÊN BẢN ĐỒNG BỘ TOÀN DIỆN & TỰ ĐỘNG BẢN ĐỒ
// 1. Chỉnh sửa 100% nội dung hiện hữu: Header, Main, Footer, Địa chỉ, Bản đồ, Thẻ thông tin.
// 2. Tự động nhận diện Thông Tin Dùng Chung Toàn Hệ Thống:
//    - Tên công ty
//    - Địa chỉ trụ sở & phòng lab (Tự động cập nhật Bản đồ Google Maps)
//    - Hotline & Điện thoại bàn (Tel / Fax)
//    - Email liên hệ
//    Sửa ở bất kỳ đâu -> Tự động đồng bộ nhất quán 100% trên toàn bộ website.
// 3. Hiệu năng siêu nhẹ: Double click để sửa, Click ra ngoài tự động hỏi lưu, Zero lag.
// ============================================================

(function () {
  const isInsideCMS = window.self !== window.top || window.location.search.includes('cms_admin=true');
  if (!isInsideCMS) return;

  console.log('[CMS Visual Studio Pro] ⚡ Khởi tạo Hệ thống Quản trị & Đồng Bộ Toàn Diện');

  let isEditMode = false;
  let activeEditingElement = null;
  let originalHtml = '';
  let originalText = '';

  // 1. INJECT STYLESHEET CHO TẤT CẢ NỘI DUNG HIỆN HỮU (HEADER, BODY, FOOTER)
  const style = document.createElement('style');
  style.id = 'cms-studio-pro-styles';
  style.textContent = `
    /* Khung viền gợi ý khi rê chuột — CHO TẤT CẢ NỘI DUNG HIỆN HỮU */
    body.cms-edit-allowed h1:hover,
    body.cms-edit-allowed h2:hover,
    body.cms-edit-allowed h3:hover,
    body.cms-edit-allowed h4:hover,
    body.cms-edit-allowed h5:hover,
    body.cms-edit-allowed h6:hover,
    body.cms-edit-allowed p:hover,
    body.cms-edit-allowed blockquote:hover,
    body.cms-edit-allowed .section-title:hover,
    body.cms-edit-allowed .section-subtitle:hover,
    body.cms-edit-allowed .zone-title:hover,
    body.cms-edit-allowed .cap-title:hover,
    body.cms-edit-allowed .service-card-title:hover,
    body.cms-edit-allowed .project-title:hover,
    body.cms-edit-allowed main ul:not(.vnit-tabs-nav):not(.breadcrumb-trail) > li:hover,
    body.cms-edit-allowed footer li:hover,
    body.cms-edit-allowed footer p:hover,
    body.cms-edit-allowed footer span:hover,
    body.cms-edit-allowed .facility-card p:hover,
    body.cms-edit-allowed td:hover,
    body.cms-edit-allowed th:hover,
    body.cms-edit-allowed figcaption:hover,
    body.cms-edit-allowed span:not(.vnit-tabs-nav *):not(.main-menu *):not(.mobile-nav-drawer *):hover {
      outline: 1.5px dashed rgba(56, 189, 248, 0.7) !important;
      outline-offset: 2px !important;
      cursor: text !important;
    }
    body.cms-edit-allowed a[href^="tel:"],
    body.cms-edit-allowed a[href^="mailto:"] {
      cursor: text !important;
    }
    body.cms-edit-allowed a[href^="tel:"]:hover,
    body.cms-edit-allowed a[href^="mailto:"]:hover {
      outline: 2px dashed #2563eb !important;
      outline-offset: 3px !important;
      cursor: text !important;
      position: relative !important;
    }

    /* Viền đặc biệt cho THÔNG TIN ĐỒNG BỘ TOÀN HỆ THỐNG (Địa chỉ, Tên công ty, Hotline) */
    body.cms-edit-allowed [data-cms-global="true"]:hover {
      outline: 2.5px dashed #0284c7 !important;
      outline-offset: 4px !important;
    }

    body.cms-edit-allowed main img:hover,
    body.cms-edit-allowed .hero-swiper img:hover,
    body.cms-edit-allowed .cap-box img:hover,
    body.cms-edit-allowed .header-badge-logo img:hover,
    body.cms-edit-allowed footer img:hover {
      outline: 3px dashed #f59e0b !important;
      outline-offset: 3px !important;
      cursor: pointer !important;
    }

    /* Tự động tràn viền theo khung, bảo toàn 100% tỉ lệ gốc, KHÔNG BỊ MÉO MÓ */
    .facility-card img,
    .service-card img,
    .project-card img,
    .news-card img,
    .cap-box img,
    .hero-swiper img,
    [data-cms-fit="cover"] {
      object-fit: cover !important;
      object-position: center !important;
    }

    /* Tag gợi ý nhấp đúp khi rê chuột */
    body.cms-edit-allowed h1:hover::after,
    body.cms-edit-allowed h2:hover::after,
    body.cms-edit-allowed h3:hover::after,
    body.cms-edit-allowed h4:hover::after,
    body.cms-edit-allowed p:hover::after,
    body.cms-edit-allowed blockquote:hover::after,
    body.cms-edit-allowed .section-title:hover::after,
    body.cms-edit-allowed .section-subtitle:hover::after,
    body.cms-edit-allowed .zone-title:hover::after,
    body.cms-edit-allowed .cap-title:hover::after,
    body.cms-edit-allowed footer li:hover::after,
    body.cms-edit-allowed footer p:hover::after {
      content: "🖱️ Nhấp đúp để sửa";
      position: absolute;
      top: -14px;
      left: 10px;
      background: #1e3a8a;
      color: #ffffff;
      font-size: 10.5px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      z-index: 99999;
      pointer-events: none;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      white-space: nowrap;
    }

    /* Tag nổi bật cho Thông tin đồng bộ toàn hệ thống */
    body.cms-edit-allowed [data-cms-global="true"]:hover::after {
      content: "🌐 Nhấp đúp sửa (Đồng bộ toàn website)" !important;
      background: #0284c7 !important;
      box-shadow: 0 2px 10px rgba(2, 132, 199, 0.45) !important;
    }

    /* Khung khi ĐANG ĐƯỢC CHỌN SỬA TRỰC TIẾP - TỰ ĐỘNG ĐẢM BẢO TƯƠNG PHẢN CAO 100% */
    .cms-active-editing-now {
      outline-offset: 3px !important;
      border-radius: 6px !important;
      cursor: text !important;
      z-index: 10000 !important;
      position: relative !important;
      min-height: 1.35em !important;
      min-width: 40px !important;
      transition: outline 0.15s ease, box-shadow 0.15s ease !important;
    }

    /* KHI SỬA TRÊN NỀN TỐI (Xanh đậm, Đen, Hero banner, Footer, Vision box, v.v.) */
    .cms-editing-dark {
      outline: 2.5px solid #38bdf8 !important; /* Xanh Cyan dạ quang siêu nổi bật */
      box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.4), 0 8px 24px rgba(0, 0, 0, 0.6) !important;
      background-color: rgba(255, 255, 255, 0.12) !important; /* Lớp phủ mờ nhẹ, KHÔNG LÀM TRẮNG NỀN */
      color: #ffffff !important; /* Đảm bảo chữ trắng luôn sáng rõ 100%, không bị chìm */
      caret-color: #38bdf8 !important; /* Con trỏ nhấp nháy Cyan dạ quang cực kỳ rõ */
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7) !important;
    }
    .cms-editing-dark * {
      caret-color: #38bdf8 !important;
    }

    /* KHI SỬA TRÊN NỀN SÁNG (Trang trắng, Khối xám nhạt, Body thông thường) */
    .cms-editing-light {
      outline: 2.5px solid #2563eb !important; /* Xanh dương đậm chuẩn mực */
      box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.25), 0 4px 16px rgba(0, 0, 0, 0.1) !important;
      background-color: rgba(37, 99, 235, 0.04) !important; /* Phủ mờ nhẹ nhàng */
      color: #0f172a !important; /* Đảm bảo chữ đen đậm sắc nét 100% */
      caret-color: #2563eb !important; /* Con trỏ nhấp nháy Xanh đậm cực kỳ rõ */
    }
    .cms-editing-light * {
      caret-color: #2563eb !important;
    }

    /* Huy hiệu nổi bật chỉ báo vùng đang soạn thảo */
    .cms-active-editing-now::before {
      content: "✏️ Đang sửa trực tiếp";
      position: absolute;
      top: -24px;
      right: 0px;
      background: #0f172a;
      color: #38bdf8;
      font-size: 10.5px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid rgba(56, 189, 248, 0.5);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      pointer-events: none;
      z-index: 100001;
      white-space: nowrap;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      animation: cmsFadeUp 0.15s ease-out;
    }

    .cms-active-editing-now::after {
      display: none !important;
    }

    /* Khi khối rỗng -> Hiện chữ mờ hướng dẫn, KHÔNG BỊ CO 0px LÀM ẨN */
    .cms-active-editing-now:empty::after {
      display: inline-block !important;
      content: "Nhấp để nhập nội dung vào đây..." !important;
      color: rgba(148, 163, 184, 0.85) !important;
      font-style: italic !important;
      pointer-events: none !important;
    }

    /* FLOATING WORD TOOLBAR */
    #cms-floating-word-toolbar {
      position: fixed;
      display: none;
      align-items: center;
      gap: 3px;
      background: #0f172a;
      border: 1px solid rgba(255,255,255,0.25);
      border-radius: 8px;
      padding: 4px 6px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.4);
      z-index: 100000;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      animation: cmsFadeUp 0.15s ease-out;
    }
    @keyframes cmsFadeUp {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .cms-fbar-btn {
      background: transparent;
      border: none;
      color: #f1f5f9;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 3px;
      transition: background 0.12s;
    }
    .cms-fbar-btn:hover {
      background: rgba(255,255,255,0.15);
      color: #ffffff;
    }
    .cms-fbar-sep {
      width: 1px;
      height: 16px;
      background: rgba(255,255,255,0.2);
      margin: 0 2px;
    }
    .cms-fbar-color-dot {
      width: 13px;
      height: 13px;
      border-radius: 50%;
      display: inline-block;
      cursor: pointer;
      border: 1.5px solid rgba(255,255,255,0.6);
      transition: transform 0.1s;
    }
    .cms-fbar-color-dot:hover {
      transform: scale(1.2);
    }
    .cms-fbar-save-btn {
      background: #10b981;
      color: #ffffff;
      padding: 4px 10px;
      border-radius: 5px;
      font-weight: 800;
      font-size: 11px;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 3px;
    }
    .cms-fbar-save-btn:hover {
      background: #059669;
    }

    /* TOAST THÔNG BÁO */
    #cms-toast-notice {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #0f172a;
      color: #ffffff;
      padding: 10px 18px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      z-index: 999999;
      display: none;
      align-items: center;
      gap: 8px;
      border: 1px solid rgba(255,255,255,0.15);
      animation: cmsFadeUp 0.2s ease-out;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    /* HỘP THOẠI XÁC NHẬN LƯU KHI CLICK RA NGOÀI */
    #cms-confirm-save-modal {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(4px);
      z-index: 9999999;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    #cms-confirm-save-box {
      background: #ffffff;
      width: 92%;
      max-width: 480px;
      border-radius: 14px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
      overflow: hidden;
      border: 1px solid #e2e8f0;
      animation: cmsFadeUp 0.15s ease-out;
    }
  `;
  document.head.appendChild(style);

  // 2. TẠO FLOATING MINI-TOOLBAR
  const floatBar = document.createElement('div');
  floatBar.id = 'cms-floating-word-toolbar';
  floatBar.innerHTML = `
    <button type="button" class="cms-fbar-btn" data-cmd="bold" title="In đậm (Ctrl+B)"><b>B</b></button>
    <button type="button" class="cms-fbar-btn" data-cmd="italic" title="In nghiêng (Ctrl+I)"><i>I</i></button>
    <button type="button" class="cms-fbar-btn" data-cmd="underline" title="Gạch chân (Ctrl+U)"><u>U</u></button>
    <div class="cms-fbar-sep"></div>
    <span class="cms-fbar-color-dot" data-color="#ffffff" style="background: #ffffff; border: 1.5px solid #94a3b8;" title="Trắng sáng (cho nền tối)"></span>
    <span class="cms-fbar-color-dot" data-color="#38bdf8" style="background: #38bdf8;" title="Xanh Cyan dạ quang"></span>
    <span class="cms-fbar-color-dot" data-color="#0066bf" style="background: #0066bf;" title="Xanh VNIT chuẩn"></span>
    <span class="cms-fbar-color-dot" data-color="#ff7700" style="background: #ff7700;" title="Cam nổi bật"></span>
    <span class="cms-fbar-color-dot" data-color="#fbbf24" style="background: #fbbf24;" title="Vàng hoàng gia"></span>
    <span class="cms-fbar-color-dot" data-color="#0f172a" style="background: #0f172a;" title="Đen đậm (cho nền sáng)"></span>
    <div class="cms-fbar-sep"></div>
    <button type="button" class="cms-fbar-btn" id="cms-btn-open-detail" title="Mở hộp thoại soạn thảo chi tiết & bản đồ">⚙️ Chi tiết</button>
    <button type="button" class="cms-fbar-save-btn" id="cms-btn-done" title="Lưu và hoàn tất sửa đoạn này">✓ Xong</button>
  `;
  document.body.appendChild(floatBar);

  // 3. TẠO HỘP THOẠI XÁC NHẬN LƯU (KHI CLICK RA NGOÀI VÀ CÓ CHỈNH SỬA)
  const confirmModal = document.createElement('div');
  confirmModal.id = 'cms-confirm-save-modal';
  confirmModal.innerHTML = `
    <div id="cms-confirm-save-box">
      <div style="background: #1e3a8a; color: #ffffff; padding: 14px 20px; font-weight: 700; font-size: 14px; display: flex; align-items: center; justify-content: space-between;">
        <span style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 16px;">💾</span> Xác Nhận Lưu Thay Đổi
        </span>
        <button id="cms-confirm-btn-close-x" type="button" style="background: transparent; border: none; color: #ffffff; font-size: 18px; cursor: pointer; line-height: 1;">&times;</button>
      </div>
      <div style="padding: 20px 22px; color: #334155; font-size: 13.5px; line-height: 1.6;">
        <p id="cms-confirm-text-msg" style="margin: 0 0 12px; font-weight: 600; color: #0f172a;"></p>
        <div style="font-size: 12px; color: #64748b; margin-bottom: 6px;">Nội dung mới chỉnh sửa:</div>
        <div id="cms-confirm-text-preview" style="background: #f8fafc; border-left: 3px solid #2563eb; padding: 10px 14px; font-size: 12.5px; color: #1e293b; border-radius: 0 6px 6px 0; max-height: 110px; overflow-y: auto; font-style: italic; white-space: pre-wrap; word-break: break-word;"></div>
      </div>
      <div style="background: #f8fafc; padding: 12px 20px; display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #e2e8f0;">
        <button id="cms-confirm-btn-cancel" type="button" style="background: #e2e8f0; color: #475569; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 12.5px; cursor: pointer; transition: background 0.15s;">
          ✕ Hủy Bỏ (Không lưu)
        </button>
        <button id="cms-confirm-btn-save" type="button" style="background: #10b981; color: #ffffff; border: none; padding: 8px 20px; border-radius: 8px; font-weight: 700; font-size: 12.5px; cursor: pointer; transition: background 0.15s; box-shadow: 0 2px 6px rgba(16,185,129,0.3);">
          ✓ Có, Lưu Thay Đổi
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(confirmModal);

  // 4. TOAST THÔNG BÁO NHẸ
  const toastNotice = document.createElement('div');
  toastNotice.id = 'cms-toast-notice';
  document.body.appendChild(toastNotice);

  function showToast(msg, duration = 3200) {
    toastNotice.textContent = msg;
    toastNotice.style.display = 'flex';
    setTimeout(() => {
      toastNotice.style.display = 'none';
    }, duration);
  }

  // Sự kiện định dạng cho Floating Toolbar
  floatBar.querySelectorAll('.cms-fbar-btn[data-cmd]').forEach(btn => {
    btn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      const cmd = btn.getAttribute('data-cmd');
      document.execCommand(cmd, false, null);
    });
  });

  floatBar.querySelectorAll('.cms-fbar-color-dot').forEach(dot => {
    dot.addEventListener('mousedown', (e) => {
      e.preventDefault();
      const color = dot.getAttribute('data-color');
      document.execCommand('foreColor', false, color);
      if (activeEditingElement) {
        activeEditingElement.style.color = color;
      }
    });
  });

  document.getElementById('cms-btn-open-detail').addEventListener('click', (e) => {
    e.preventDefault();
    if (!activeEditingElement) return;
    openDetailModalForElement(activeEditingElement);
  });

  document.getElementById('cms-btn-done').addEventListener('click', (e) => {
    e.preventDefault();
    if (activeEditingElement) {
      commitSaveElement(activeEditingElement);
      cleanupEditingElement(activeEditingElement);
      showToast('✓ Đã lưu nội dung!');
    }
  });

  function positionFloatBar(el) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const barW = 340;
    
    // Nếu phía trên có đủ khoảng cách (>= 60px từ mép trên) -> Hiển thị trên
    let top = rect.top - 54;
    // Nếu sát mép trên viewport -> Hiển thị ngay dưới phần tử để không đè chữ
    if (rect.top < 62) {
      top = rect.bottom + 12;
    }

    let left = rect.left + (rect.width / 2) - (barW / 2);
    if (left < 10) left = 10;
    if (left + barW > window.innerWidth - 10) left = window.innerWidth - barW - 10;

    floatBar.style.top = `${top}px`;
    floatBar.style.left = `${left}px`;
    floatBar.style.display = 'flex';
  }

  function hideFloatBar() {
    floatBar.style.display = 'none';
  }

  window.addEventListener('scroll', () => {
    if (activeEditingElement) positionFloatBar(activeEditingElement);
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (activeEditingElement) positionFloatBar(activeEditingElement);
  }, { passive: true });

  // 5. BỘ CHỌN CSS DUY NHẤT (Selector)
  function getDomPath(el) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return '';
    if (el.id) return `#${el.id}`;
    let path = [];
    while (el && el.nodeType === Node.ELEMENT_NODE && el !== document.body) {
      let selector = el.tagName.toLowerCase();
      let sibling = el;
      let nth = 1;
      while ((sibling = sibling.previousElementSibling)) {
        if (sibling.tagName.toLowerCase() === selector) nth++;
      }
      selector += `:nth-of-type(${nth})`;
      path.unshift(selector);
      el = el.parentElement;
    }
    return path.join(' > ');
  }

  function getFriendlyName(el) {
    if (!el) return 'Văn bản';
    const tag = el.tagName.toLowerCase();
    const cls = el.className || '';
    if (cls.includes('subtitle') || cls.includes('zone-title')) return 'Tiêu Đề Nhỏ / Phụ Đề';
    if (cls.includes('section-title') || tag === 'h1' || tag === 'h2') return 'Tiêu Đề Chính';
    if (tag === 'h3' || tag === 'h4') return 'Tiêu Đề Mục';
    if (cls.includes('desc') || tag === 'p') return 'Đoạn Văn Nội Dung';
    if (tag === 'blockquote' || el.style.borderLeft) return 'Lời Khẳng Định / Trích Dẫn';
    if (tag === 'li') return 'Mục Danh Sách / Thông Tin';
    return 'Khối Nội Dung';
  }

  // 6. NHẬN DIỆN THÔNG TIN DÙNG CHUNG TOÀN HỆ THỐNG (GLOBAL FIELDS)
  function detectGlobalField(el) {
    if (!el) return null;

    const parentLi = el.closest('li');
    const parentP = el.closest('p');
    const fullText = ((el.innerText || '') + ' ' + (parentLi ? parentLi.innerText || '' : '') + ' ' + (parentP ? parentP.innerText || '' : '')).trim();

    // 1. Hotline di động 24/7
    if (
      (el.tagName === 'A' && el.href.startsWith('tel:')) ||
      el.closest('a[href^="tel:"]') ||
      /hotline/i.test(fullText) ||
      el.querySelector?.('.ri-customer-service-2-fill, .ri-customer-service-fill') ||
      parentLi?.querySelector?.('.ri-customer-service-2-fill, .ri-customer-service-fill')
    ) {
      return 'hotline';
    }

    // 2. Địa chỉ công ty & Trụ sở
    const hasPinIcon = el.querySelector?.('.ri-map-pin-2-fill, .ri-map-pin-fill') ||
      parentLi?.querySelector?.('.ri-map-pin-2-fill, .ri-map-pin-fill') ||
      el.classList?.contains('ri-map-pin-2-fill');
    if (
      el.getAttribute('data-i18n') === 'footer.address' ||
      el.closest('[data-i18n="footer.address"]') ||
      el.id === 'loc-card-address' ||
      el.closest('#loc-card-address') ||
      hasPinIcon ||
      (el.closest('footer') && (/địa chỉ/i.test(fullText) || fullText.includes('Quang Dũng') || fullText.includes('Chí Linh') || fullText.includes('Vũng Tàu'))) ||
      (el.closest('.facility-card') && fullText.includes('Quang Dũng'))
    ) {
      return 'address';
    }

    // 3. Tên công ty
    if (
      el.getAttribute('data-i18n') === 'footer.company_name' ||
      el.closest('[data-i18n="footer.company_name"]') ||
      /CÔNG TY TNHH KIỂM ĐỊNH/i.test(fullText) ||
      (el.closest('footer') && /VNIT/i.test(fullText) && !/hotline|email|tel/i.test(fullText))
    ) {
      return 'company_name';
    }

    // 4. Email công ty
    if (
      (el.tagName === 'A' && el.href.startsWith('mailto:')) ||
      el.closest('a[href^="mailto:"]') ||
      /email/i.test(fullText) ||
      /@[\w\.-]+\.\w+/.test(fullText) ||
      el.querySelector?.('.ri-mail-fill, .ri-mail-line') ||
      parentLi?.querySelector?.('.ri-mail-fill, .ri-mail-line')
    ) {
      return 'email';
    }

    // 5. Điện thoại bàn (Tel) & Fax
    if (
      (el.closest('footer') || el.closest('.facility-card')) &&
      (/tel:/i.test(fullText) || /fax:/i.test(fullText))
    ) {
      return 'tel';
    }

    return null;
  }

  // Đánh dấu huy hiệu [🌐 Đồng bộ toàn hệ thống] cho các mục dùng chung
  function markGlobalBadges() {
    document.querySelectorAll(`
      footer li, footer p, footer span,
      .facility-card p, #loc-card-address,
      a[href^="tel:"], a[href^="mailto:"]
    `).forEach(el => {
      if (detectGlobalField(el)) {
        el.setAttribute('data-cms-global', 'true');
      }
    });
  }

  // 7. LƯU VÀ ĐỒNG BỘ THÔNG TIN DÙNG CHUNG (GLOBAL SYSTEM INFO)
  function saveGlobalSystemInfo(infoObj) {
    try {
      const raw = localStorage.getItem('vnit_cms_global_info') || '{}';
      const globalInfo = JSON.parse(raw);
      Object.assign(globalInfo, infoObj);
      localStorage.setItem('vnit_cms_global_info', JSON.stringify(globalInfo));
    } catch (e) {}
  }

  // Khôi phục các chỉnh sửa và đồng bộ toàn hệ thống khi tải trang
  function restoreLocalEdits() {
    // 1. Áp dụng thông tin dùng chung toàn hệ thống
    try {
      const rawGlobal = localStorage.getItem('vnit_cms_global_info');
      if (rawGlobal) {
        const info = JSON.parse(rawGlobal);
        if (info.address) applyGlobalAddress(info.address);
        if (info.companyName) applyGlobalCompanyName(info.companyName);
        if (info.hotline) applyGlobalHotline(info.hotline);
        if (info.email) applyGlobalEmail(info.email);
        if (info.tel) applyGlobalTel(info.tel);
      }
    } catch (e) {}

    // 2. Áp dụng các thay đổi chi tiết từng phần tử
    try {
      const raw = localStorage.getItem('vnit_cms_local_edits');
      if (!raw) return;
      const edits = JSON.parse(raw);
      let count = 0;
      Object.keys(edits).forEach(sel => {
        const item = edits[sel];
        const el = document.querySelector(sel);
        if (el) {
          count++;
          if (item.type === 'image' && item.src) {
            el.src = item.src;
            el.style.objectFit = item.objectFit || 'cover';
            el.style.objectPosition = item.objectPosition || 'center';
            el.setAttribute('data-cms-fit', 'cover');
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
      window.parent.postMessage({ type: 'CMS_UNSAVED_CHANGES_COUNT', count: count }, '*');
    } catch (e) {}

    markGlobalBadges();
  }

  // Hàm áp dụng địa chỉ đồng bộ và cập nhật Google Maps
  function applyGlobalAddress(newAddr) {
    if (!newAddr) return;

    // A. Cập nhật Footer các trang
    document.querySelectorAll('span[data-i18n="footer.address"]').forEach(span => {
      span.textContent = newAddr;
    });
    document.querySelectorAll('footer li').forEach(li => {
      if (li.querySelector('.ri-map-pin-2-fill, .ri-map-pin-fill') || li.innerText.includes('Quang Dũng') || li.innerText.includes('Vũng Tàu')) {
        li.innerHTML = `<i class="ri-map-pin-2-fill" style="color: var(--vnit-accent);"></i> ${newAddr}`;
      }
    });

    // B. Cập nhật Trang Liên Hệ (lien-he.html) nếu có
    const locCardAddr = document.getElementById('loc-card-address');
    if (locCardAddr) {
      locCardAddr.innerHTML = `<i class="ri-map-pin-2-fill" style="color:#0066bf;"></i> ${newAddr}`;
    }
    const fac0 = document.getElementById('facility-card-0');
    if (fac0) {
      const pAddr = fac0.querySelector('p');
      if (pAddr) pAddr.textContent = newAddr;
    }

    // C. 🎯 TỰ ĐỘNG ĐỊNH VỊ BẢN ĐỒ GOOGLE MAPS THEO ĐỊA CHỈ MỚI
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
      if (li.textContent.includes('Hotline:')) {
        const icon = li.querySelector('i')?.outerHTML || '<i class="ri-phone-fill" style="color: var(--vnit-accent);"></i>';
        li.innerHTML = `${icon} <span>Hotline: <a href="tel:${cleanDigits}"><strong>${newHotline}</strong></a></span>`;
      }
    });

    // 3. Cập nhật tại Chân trang (Footer) — Tất cả các thẻ li/p chứa Hotline
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

  function applyGlobalTel(newTel) {
    if (!newTel) return;
    // Cập nhật Footer Tel/Fax
    document.querySelectorAll('footer li').forEach(li => {
      if (li.textContent.includes('Tel:') || li.querySelector('.ri-phone-fill')) {
        const icon = li.querySelector('i')?.outerHTML || '<i class="ri-phone-fill" style="color: var(--vnit-accent);"></i>';
        li.innerHTML = `${icon} Tel: ${newTel} | Fax: ${newTel}`;
      }
    });
    // Cập nhật thẻ facility trên lien-he.html
    document.querySelectorAll('.facility-card p').forEach(p => {
      if (p.textContent.includes('Điện thoại:') || p.textContent.includes('Tel:')) {
        p.innerHTML = p.innerHTML.replace(/Điện thoại:\s*<strong>.*?<\/strong>/i, `Điện thoại: <strong>${newTel}</strong>`);
      }
    });
  }

  function applyGlobalEmail(newEmail) {
    if (!newEmail) return;

    // 1. Header
    document.querySelectorAll('.top-info li, header li').forEach(li => {
      if (li.textContent.includes('Email:')) {
        const icon = li.querySelector('i')?.outerHTML || '<i class="ri-mail-fill" style="color: var(--vnit-accent);"></i>';
        li.innerHTML = `${icon} <span>Email: <a href="mailto:${newEmail}">${newEmail}</a></span>`;
      }
    });

    // 2. Footer
    document.querySelectorAll('footer li').forEach(li => {
      if (li.textContent.includes('Email:') || li.querySelector('.ri-mail-fill')) {
        const icon = li.querySelector('i')?.outerHTML || '<i class="ri-mail-fill" style="color: var(--vnit-accent);"></i>';
        li.innerHTML = `${icon} Email: <a href="mailto:${newEmail}" style="color: #cbd5e0;">${newEmail}</a>`;
      }
    });

    // 3. Facility Cards
    document.querySelectorAll('.facility-card p').forEach(p => {
      if (p.textContent.includes('Email:')) {
        p.innerHTML = p.innerHTML.replace(/Email:\s*<strong>.*?<\/strong>/i, `Email: <strong>${newEmail}</strong>`);
        p.innerHTML = p.innerHTML.replace(/Email:\s*[\w\.-]+@[\w\.-]+\.\w+/i, `Email: <strong>${newEmail}</strong>`);
      }
    });

    // 4. Tất cả thẻ mailto
    document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
      a.href = 'mailto:' + newEmail;
      if (a.textContent.includes('@')) a.textContent = newEmail;
    });
  }

  function saveLocalEdit(selector, editObj) {
    try {
      const raw = localStorage.getItem('vnit_cms_local_edits') || '{}';
      const edits = JSON.parse(raw);
      edits[selector] = editObj;
      localStorage.setItem('vnit_cms_local_edits', JSON.stringify(edits));
      const count = Object.keys(edits).length;
      window.parent.postMessage({ type: 'CMS_UNSAVED_CHANGES_COUNT', count: count }, '*');
    } catch (e) {}
  }

  // 8. BẮT ĐẦU VÀ KẾT THÚC CHỈNH SỬA
  function activateInlineEditing(el) {
    if (activeEditingElement === el) return;

    if (activeEditingElement) {
      checkAndHandleExitEditing(() => {
        startEdit(el);
      });
    } else {
      startEdit(el);
    }
  }

  function placeCursorAtEnd(el) {
    try {
      el.focus();
      if (typeof window.getSelection !== "undefined" && typeof document.createRange !== "undefined") {
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } catch (e) {
      el.focus();
    }
  }

  // Nhận diện môi trường nền của phần tử đang sửa để đảm bảo độ tương phản 100%
  function detectElementTheme(el) {
    let curr = el;
    let bg = 'rgba(0, 0, 0, 0)';
    let isDarkBg = false;

    function getLuminance(rgbStr) {
      if (!rgbStr) return 255;
      const m = rgbStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!m) return 255;
      return 0.299 * parseInt(m[1], 10) + 0.587 * parseInt(m[2], 10) + 0.114 * parseInt(m[3], 10);
    }

    while (curr && curr !== document && curr !== document.body) {
      const style = window.getComputedStyle(curr);
      const bColor = style.backgroundColor;
      const bImg = style.backgroundImage;

      if (bColor && bColor !== 'transparent' && bColor !== 'rgba(0, 0, 0, 0)') {
        bg = bColor;
        break;
      }
      if (bImg && (bImg.includes('gradient') || bImg.includes('url'))) {
        if (style.color && getLuminance(style.color) > 170) {
          isDarkBg = true;
          break;
        }
      }
      curr = curr.parentElement;
    }

    const textStyle = window.getComputedStyle(el);
    const textColor = textStyle.color || '';

    const bgLum = getLuminance(bg);
    const textLum = getLuminance(textColor);

    // Nếu nền tối (bgLum < 140) HOẶC chữ là màu sáng/trắng (textLum > 180) HOẶC có cờ nền tối -> Theme Dark
    return (bgLum < 140 || textLum > 180 || isDarkBg) ? 'dark' : 'light';
  }

  function startEdit(el) {
    activeEditingElement = el;
    originalHtml = el.innerHTML;
    originalText = el.innerText.trim();

    el.contentEditable = 'true';
    el.classList.add('cms-active-editing-now');

    // Tự động phân loại nền để áp dụng màu chữ và màu con trỏ chuột tương phản 100%
    const theme = detectElementTheme(el);
    if (theme === 'dark') {
      el.classList.add('cms-editing-dark');
      el.classList.remove('cms-editing-light');
    } else {
      el.classList.add('cms-editing-light');
      el.classList.remove('cms-editing-dark');
    }

    positionFloatBar(el);
    placeCursorAtEnd(el);
  }

  function cleanupEditingElement(el) {
    if (el) {
      el.contentEditable = 'false';
      el.classList.remove('cms-active-editing-now', 'cms-editing-dark', 'cms-editing-light');
    }
    hideFloatBar();
    activeEditingElement = null;
    originalHtml = '';
    originalText = '';
  }

  function commitSaveElement(el) {
    const selector = getDomPath(el);
    const newText = el.innerText.trim();

    // 🌐 TỰ ĐỘNG ĐỒNG BỘ TOÀN DIỆN NẾU LÀ THÔNG TIN DÙNG CHUNG
    const globalType = detectGlobalField(el);
    if (globalType === 'hotline') {
      const hotlineMatch = newText.match(/0\d{2,3}[\.\s]?\d{3}[\.\s]?\d{3,4}/);
      const val = hotlineMatch ? hotlineMatch[0] : newText.replace(/^Hotline:\s*/i, '').trim();
      applyGlobalHotline(val);
      saveGlobalSystemInfo({ hotline: val });
      window.parent.postMessage({
        type: 'CMS_GLOBAL_INFO_UPDATED',
        field: 'hotline',
        value: val
      }, '*');
    } else if (globalType === 'address') {
      const val = newText.replace(/^.*?\s*(Lô D6|Địa chỉ:?)\s*/i, '$1').trim() || newText;
      applyGlobalAddress(val);
      saveGlobalSystemInfo({ address: val });
      window.parent.postMessage({
        type: 'CMS_GLOBAL_INFO_UPDATED',
        field: 'address',
        value: val
      }, '*');
    } else if (globalType === 'company_name') {
      applyGlobalCompanyName(newText);
      saveGlobalSystemInfo({ companyName: newText });
      window.parent.postMessage({
        type: 'CMS_GLOBAL_INFO_UPDATED',
        field: 'company_name',
        value: newText
      }, '*');
    } else if (globalType === 'email') {
      const emailMatch = newText.match(/[\w\.-]+@[\w\.-]+\.\w+/);
      const val = emailMatch ? emailMatch[0] : newText.replace(/^Email:\s*/i, '').trim();
      applyGlobalEmail(val);
      saveGlobalSystemInfo({ email: val });
      window.parent.postMessage({
        type: 'CMS_GLOBAL_INFO_UPDATED',
        field: 'email',
        value: val
      }, '*');
    } else if (globalType === 'tel') {
      const telMatch = newText.match(/0\d{2,3}[\.\s]?\d{3}[\.\s]?\d{3,4}/);
      const val = telMatch ? telMatch[0] : newText.replace(/^Tel:\s*/i, '').trim();
      applyGlobalTel(val);
      saveGlobalSystemInfo({ tel: val });
      window.parent.postMessage({
        type: 'CMS_GLOBAL_INFO_UPDATED',
        field: 'tel',
        value: val
      }, '*');
    } else {
      saveLocalEdit(selector, {
        type: 'text',
        html: el.innerHTML,
        text: el.innerText
      });
    }

    window.parent.postMessage({
      type: 'CMS_TEXT_AUTO_SAVED',
      selector: selector,
      text: el.innerText,
      html: el.innerHTML
    }, '*');
  }

  // 9. XỬ LÝ KHI CLICK RA NGOÀI KHU VỰC ĐANG SỬA
  function checkAndHandleExitEditing(onDone) {
    if (!activeEditingElement) {
      if (onDone) onDone();
      return;
    }

    const el = activeEditingElement;
    const currentText = el.innerText.trim();
    const currentHtml = el.innerHTML;

    const isModified = (currentText !== originalText && currentHtml !== originalHtml);

    if (!isModified) {
      // Không sửa gì -> Thoát êm ru
      cleanupEditingElement(el);
      if (onDone) onDone();
      return;
    }

    // Đã sửa -> Hỏi xác nhận lưu đúng theo yêu cầu
    const friendlyLabel = getFriendlyName(el);
    const snippet = currentText.length > 80 ? currentText.substring(0, 80) + '...' : currentText;
    const globalType = detectGlobalField(el);

    const msgEl = document.getElementById('cms-confirm-text-msg');
    const previewEl = document.getElementById('cms-confirm-text-preview');
    const btnSave = document.getElementById('cms-confirm-btn-save');

    if (globalType) {
      msgEl.innerHTML = `Bạn vừa chỉnh sửa <strong>[${friendlyLabel}]</strong>.<br/><span style="color: #2563eb; font-weight: 600; font-size: 12px; display: block; margin-top: 6px;">🌐 Lưu ý: Đây là thông tin dùng chung toàn hệ thống. Khi lưu, thay đổi sẽ được đồng bộ nhất quán trên toàn bộ Header, Footer, Trang liên hệ và Bản đồ Google Maps.</span>`;
      btnSave.textContent = '✓ Có, Lưu & Đồng Bộ Toàn Bộ';
    } else {
      msgEl.textContent = `Bạn vừa chỉnh sửa [${friendlyLabel}]. Bạn có xác nhận muốn lưu thay đổi này không?`;
      btnSave.textContent = '✓ Có, Lưu Thay Đổi';
    }
    previewEl.textContent = snippet || '(Nội dung trống)';

    confirmModal.style.display = 'flex';

    const btnCancel = document.getElementById('cms-confirm-btn-cancel');
    const btnCloseX = document.getElementById('cms-confirm-btn-close-x');

    const handleSave = () => {
      confirmModal.style.display = 'none';
      cleanupListeners();
      commitSaveElement(el);
      cleanupEditingElement(el);
      showToast('✓ Đã lưu thay đổi thành công!');
      if (onDone) onDone();
    };

    const handleCancel = () => {
      confirmModal.style.display = 'none';
      cleanupListeners();
      el.innerHTML = originalHtml;
      cleanupEditingElement(el);
      showToast('↩️ Đã khôi phục nội dung gốc.');
      if (onDone) onDone();
    };

    function cleanupListeners() {
      btnSave.removeEventListener('click', handleSave);
      btnCancel.removeEventListener('click', handleCancel);
      btnCloseX.removeEventListener('click', handleCancel);
    }

    btnSave.addEventListener('click', handleSave);
    btnCancel.addEventListener('click', handleCancel);
    btnCloseX.addEventListener('click', handleCancel);
  }

  function openDetailModalForElement(el) {
    const globalType = detectGlobalField(el);
    if (globalType === 'address') {
      const text = el.innerText.replace(/^.*?\s*(Lô D6|Địa chỉ:?)\s*/i, '$1').trim() || el.innerText.trim();
      window.parent.postMessage({
        type: 'CMS_CLICK_EDIT',
        target: 'address',
        data: { address_vi: text, selector: getDomPath(el) }
      }, '*');
      return;
    }
    if (globalType === 'company_name') {
      window.parent.postMessage({
        type: 'CMS_CLICK_EDIT',
        target: 'company_name',
        data: { companyName_vi: el.innerText.trim(), selector: getDomPath(el) }
      }, '*');
      return;
    }
    if (globalType === 'hotline') {
      const hotlineMatch = el.innerText.match(/0\d{2,3}[\.\s]?\d{3}[\.\s]?\d{3,4}/);
      const hotlineVal = hotlineMatch ? hotlineMatch[0] : el.innerText.replace(/^Hotline:\s*/i, '').trim();
      window.parent.postMessage({
        type: 'CMS_CLICK_EDIT',
        target: 'hotline',
        data: { hotline: hotlineVal, selector: getDomPath(el) }
      }, '*');
      return;
    }
    if (globalType === 'email') {
      const emailMatch = el.innerText.match(/[\w\.-]+@[\w\.-]+\.\w+/);
      const emailVal = emailMatch ? emailMatch[0] : el.innerText.replace(/^Email:\s*/i, '').trim();
      window.parent.postMessage({
        type: 'CMS_CLICK_EDIT',
        target: 'email',
        data: { email: emailVal, selector: getDomPath(el) }
      }, '*');
      return;
    }

    const cs = window.getComputedStyle(el);
    const payload = {
      selector: getDomPath(el),
      tag: el.tagName.toLowerCase(),
      label: getFriendlyName(el),
      html: el.innerHTML,
      text: el.innerText,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      color: cs.color,
      textAlign: cs.textAlign
    };
    window.parent.postMessage({
      type: 'CMS_CLICK_EDIT',
      target: 'rich_text_edit',
      data: payload
    }, '*');
  }

  // 10. BỘ PHÂN GIẢI PHẦN TỬ CHỈNH SỬA CHÍNH XÁC (RESOLVER)
  function resolveEditableElement(target) {
    if (!target) return null;

    // A. Thẻ liên kết điện thoại (tel:) hoặc email (mailto:)
    const telLink = target.closest('a[href^="tel:"]');
    if (telLink) return telLink;

    const mailLink = target.closest('a[href^="mailto:"]');
    if (mailLink) return mailLink;

    // B. Hotline hoặc điện thoại ở footer / trang liên hệ (kể cả không có thẻ <a>)
    const hotlineLi = target.closest('footer li, .footer-info li, .facility-card p');
    if (hotlineLi && /hotline/i.test(hotlineLi.innerText)) {
      const strong = hotlineLi.querySelector('strong');
      if (strong && (target === strong || strong.contains(target))) return strong;
      if (strong) return strong;
    }

    // C. Thẻ ảnh
    if (target.tagName === 'IMG') return target;

    // D. Kiểm tra các khối văn bản chính
    const blockEl = target.closest(`
      h1, h2, h3, h4, h5, h6,
      p, blockquote,
      .section-title, .section-subtitle, .zone-title, .cap-title,
      .service-card-title, .project-title,
      main ul:not(.vnit-tabs-nav):not(.breadcrumb-trail) > li,
      footer li, footer p, footer span,
      td, th, figcaption
    `);
    if (blockEl) return blockEl;

    // E. Nếu không nằm trong khối lớn, bắt các phần tử văn bản đơn lẻ (như span phụ đề, thẻ bold, badge...)
    const inlineEl = target.closest(`
      span, strong, em, b, label, .badge, .facility-card, #loc-card-address
    `);
    if (inlineEl && inlineEl.innerText && inlineEl.innerText.trim().length > 0) {
      return inlineEl;
    }

    return null;
  }

  // 11. BẮT VÀ XỬ LÝ SỰ KIỆN CLICK (GIAI ĐOẠN CAPTURE = TRUE)
  // Đảm bảo ngăn chặn tuyệt đối trình duyệt mở ứng dụng gọi điện khi ở chế độ sửa
  document.addEventListener('click', (e) => {
    // Nếu KHÔNG ở chế độ chỉnh sửa -> Trình duyệt hoạt động bình thường (gọi điện, gửi mail, chuyển trang)
    if (!isEditMode) return;

    // 1. Kiểm tra click vào liên kết thẻ <a>
    const link = e.target.closest('a');
    if (link) {
      const href = (link.getAttribute('href') || '').trim();

      // NẾU LÀ SỐ ĐIỆN THOẠI (tel:) HOẶC EMAIL (mailto:)
      if (href.startsWith('tel:') || href.startsWith('mailto:')) {
        e.preventDefault();
        e.stopPropagation();

        // Trong chế độ chỉnh sửa, click vào đây là để SỬA NỘI DUNG chứ KHÔNG PHẢI ĐỂ GỌI ĐIỆN!
        const editableEl = resolveEditableElement(e.target) || link;
        if (activeEditingElement !== editableEl) {
          activateInlineEditing(editableEl);
        }
        return;
      }

      // Nếu là liên kết nội dung thông thường khác (trừ thanh điều hướng menu chính)
      if (!link.closest('.main-menu, .mobile-nav-drawer, .vnit-tabs-nav, .lang-switch-box, .header-actions')) {
        e.preventDefault();
      }
    }

    // 2. Nếu click vào Hotline ở Footer (không có thẻ a)
    const hotlineFooter = e.target.closest('footer li, .footer-info li');
    if (hotlineFooter && /hotline/i.test(hotlineFooter.innerText)) {
      const strong = hotlineFooter.querySelector('strong');
      if (strong && (e.target === strong || strong.contains(e.target))) {
        e.preventDefault();
        e.stopPropagation();
        if (activeEditingElement !== strong) {
          activateInlineEditing(strong);
        }
        return;
      }
    }

    // 3. Xử lý khi click ra ngoài vùng đang sửa -> Hỏi xác nhận lưu thay đổi
    if (activeEditingElement) {
      if (activeEditingElement.contains(e.target) || floatBar.contains(e.target) || confirmModal.contains(e.target)) {
        return;
      }
      checkAndHandleExitEditing();
    }
  }, true); // QUAN TRỌNG: capture = true để ngăn chặn trình duyệt gọi ứng dụng bên ngoài ngay lập tức!

  // 12. BẮT SỰ KIỆN DOUBLE CLICK (SỬA VĂN BẢN & MỞ MODAL ẢNH)
  document.addEventListener('dblclick', (e) => {
    if (!isEditMode) return;

    // Bỏ qua thanh menu điều hướng chính
    if (e.target.closest('.main-menu, .mobile-nav-drawer, .vnit-tabs-nav, .lang-switch-box, .header-actions')) {
      return;
    }

    const editableTarget = resolveEditableElement(e.target);
    if (!editableTarget) return;

    e.preventDefault();
    e.stopPropagation();

    // 1. TRƯỜNG HỢP LÀ ẢNH -> Mở modal thay ảnh
    if (editableTarget.tagName === 'IMG') {
      window.parent.postMessage({
        type: 'CMS_CLICK_EDIT',
        target: 'image_edit',
        data: {
          currentUrl: editableTarget.getAttribute('src') || '',
          alt: editableTarget.getAttribute('alt') || 'Ảnh',
          selector: getDomPath(editableTarget)
        }
      }, '*');
      return;
    }

    // 2. TẤT CẢ VĂN BẢN (KỂ CẢ THÔNG TIN DÙNG CHUNG) -> KÍCH HOẠT SỬA TRỰC TIẾP TẠI CHỖ
    activateInlineEditing(editableTarget);
  });

  // 13. PHÍM TẮT THÔNG MINH
  document.addEventListener('keydown', (e) => {
    if (!activeEditingElement) return;

    // Phím Enter lưu ngay đối với Tiêu đề, Hotline, Email, v.v.
    if (e.key === 'Enter' && !e.shiftKey) {
      const isSingleLine = detectGlobalField(activeEditingElement) ||
        activeEditingElement.tagName === 'A' ||
        activeEditingElement.tagName === 'SPAN' ||
        /^H[1-6]$/.test(activeEditingElement.tagName);
      if (isSingleLine) {
        e.preventDefault();
        commitSaveElement(activeEditingElement);
        cleanupEditingElement(activeEditingElement);
        showToast('✓ Đã lưu thay đổi thành công!');
        return;
      }
    }

    // Phím Escape hủy bỏ chỉnh sửa
    if (e.key === 'Escape') {
      activeEditingElement.innerHTML = originalHtml;
      cleanupEditingElement(activeEditingElement);
      showToast('↩️ Đã hủy chỉnh sửa.');
      return;
    }
  });

  // 11. LẮNG NGHE LỆNH TỪ CMS TOPBAR
  window.addEventListener('message', (e) => {
    if (!e.data) return;

    // A. BẬT / TẮT CHẾ ĐỘ SỬA
    if (e.data.type === 'CMS_SET_EDIT_MODE') {
      isEditMode = !!e.data.enabled;
      if (isEditMode) {
        document.body.classList.add('cms-edit-allowed');
        markGlobalBadges();
        showToast('✏️ Đã bật Chế độ Sửa. Nhấp đúp chuột (Double click) vào bất kỳ mục nào để sửa!', 3500);
      } else {
        document.body.classList.remove('cms-edit-allowed');
        if (activeEditingElement) {
          checkAndHandleExitEditing();
        }
      }
      return;
    }

    // B. CẬP NHẬT TỨC THÌ TỪ MODAL PARENT SANG DOM (0ms)
    if (e.data.type === 'CMS_DOM_UPDATE') {
      const { target, data } = e.data;

      // 1. Cập nhật Địa Chỉ & Tự động ghim Bản Đồ Google Maps
      if (target === 'address' && data.address_vi) {
        applyGlobalAddress(data.address_vi);
        saveGlobalSystemInfo({ address: data.address_vi });
        showToast('✓ Đã đồng bộ địa chỉ & bản đồ toàn website!');
      }

      // 2. Cập nhật Tên Công Ty đồng bộ
      else if (target === 'company_name' && data.companyName_vi) {
        applyGlobalCompanyName(data.companyName_vi);
        saveGlobalSystemInfo({ companyName: data.companyName_vi });
        showToast('✓ Đã đồng bộ tên công ty toàn website!');
      }

      // 3. Cập nhật Hotline & Tel đồng bộ
      else if (target === 'hotline') {
        if (data.hotline) applyGlobalHotline(data.hotline);
        if (data.tel) applyGlobalTel(data.tel);
        saveGlobalSystemInfo({ hotline: data.hotline, tel: data.tel });
        showToast('✓ Đã đồng bộ Hotline & Số điện thoại toàn website!');
      }

      // 4. Cập nhật Email đồng bộ
      else if (target === 'email' && data.email) {
        applyGlobalEmail(data.email);
        saveGlobalSystemInfo({ email: data.email });
        showToast('✓ Đã đồng bộ Email toàn website!');
      }

      // 5. Cập nhật Rich Text
      else if (target === 'rich_text_edit' && data.selector) {
        const el = document.querySelector(data.selector);
        if (el) {
          if (data.html !== undefined) el.innerHTML = data.html;
          else if (data.text !== undefined) el.innerText = data.text;
          if (data.color) el.style.color = data.color;
          if (data.fontSize) el.style.fontSize = data.fontSize;
          if (data.fontWeight) el.style.fontWeight = data.fontWeight;
          if (data.textAlign) el.style.textAlign = data.textAlign;

          saveLocalEdit(data.selector, {
            type: 'text',
            html: el.innerHTML,
            text: el.innerText,
            color: data.color,
            fontSize: data.fontSize,
            fontWeight: data.fontWeight,
            textAlign: data.textAlign
          });
          showToast('✓ Đã cập nhật định dạng!');
        }
      }

      // 6. Cập nhật ảnh
      else if (target === 'image_edit' && data.selector && data.imageUrl) {
        const img = document.querySelector(data.selector);
        if (img) {
          img.src = data.imageUrl;
          img.style.objectFit = 'cover';
          img.style.objectPosition = 'center';
          img.setAttribute('data-cms-fit', 'cover');
          if (img.parentElement && img.parentElement.tagName === 'A') {
            img.parentElement.href = data.imageUrl;
          }
          saveLocalEdit(data.selector, {
            type: 'image',
            src: data.imageUrl,
            objectFit: 'cover',
            objectPosition: 'center'
          });
          showToast('✓ Đã thay đổi ảnh (Tự động tràn viền chuẩn tỷ lệ)!');
        }
      }

      // 7. Cập nhật Hero
      else if (target === 'hero') {
        const heroTitle = document.querySelector('.hero-swiper h1');
        if (heroTitle && data.title_vi) heroTitle.textContent = data.title_vi;
        const heroBadge = document.querySelector('.banner-skew-badge span');
        if (heroBadge && data.badge_vi) heroBadge.textContent = data.badge_vi;
        const heroImg = document.querySelector('.hero-bg-img');
        if (heroImg && data.imageUrl) heroImg.src = data.imageUrl;
        showToast('✓ Đã cập nhật Banner Hero!');
      }
    }

    // C. HOÀN TÁC TẤT CẢ (RESET LOCAL EDITS)
    if (e.data.type === 'CMS_RESET_ALL_EDITS') {
      localStorage.removeItem('vnit_cms_local_edits');
      localStorage.removeItem('vnit_cms_global_info');
      window.location.reload();
      return;
    }

    // D. ĐỒNG BỘ CÀI ĐẶT TỪ FIREBASE SANG DOM
    if (e.data.type === 'CMS_SYNC_SETTINGS' && e.data.settings) {
      const s = e.data.settings;
      if (s.address_vi) applyGlobalAddress(s.address_vi);
      if (s.companyName_vi) applyGlobalCompanyName(s.companyName_vi);
      if (s.hotline) applyGlobalHotline(s.hotline);
      if (s.email) applyGlobalEmail(s.email);
      if (s.tel) applyGlobalTel(s.tel);
      saveGlobalSystemInfo({
        address: s.address_vi,
        companyName: s.companyName_vi,
        hotline: s.hotline,
        email: s.email,
        tel: s.tel
      });
    }
  });

  try {
    const pageName = window.location.pathname.split('/').pop() || 'index.html';
    window.parent.postMessage({ type: 'CMS_PAGE_NAVIGATED', page: pageName }, '*');
  } catch (err) {}

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', restoreLocalEdits);
  } else {
    restoreLocalEdits();
  }

})();
