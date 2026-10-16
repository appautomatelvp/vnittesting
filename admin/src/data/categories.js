// ============================================================
// FILE: src/data/categories.js
// Cấu trúc phân nhánh Danh mục Website VNIT bám sát 100%
// SƠ ĐỒ CHÍNH THỨC: "WEBSITE VNIT NEW UPDATE"
// Gồm 8 phân hệ chính:
// 1. TRANG CHỦ
// 2. GIỚI THIỆU (Giới thiệu chung, Tầm nhìn, Sứ mệnh, Giá trị cốt lõi, Lịch sử, Khách hàng & đối tác)
// 3. NĂNG LỰC (Chứng nhận, Nhân lực, Trang thiết bị, Cơ sở hạ tầng)
// 4. DỊCH VỤ (7 dịch vụ kỹ thuật cốt lõi theo đúng sơ đồ)
// 5. DỰ ÁN (Dự án tiêu biểu, Ngoài khơi, Lọc hóa dầu, Năng lượng)
// 6. TIN TỨC (Tin hoạt động, Kỹ thuật, Sự kiện, Dầu khí)
// 7. TUYỂN DỤNG (Kỹ sư công trình, Kỹ thuật viên Lab, Kinh doanh)
// 8. LIÊN HỆ (Trụ sở & chi nhánh, Báo giá RFQ)
// ============================================================

export const CATEGORY_GROUPS = [
  {
    id: 'trang-chu',
    name: '1. TRANG CHỦ',
    pageFile: 'index.html',
    icon: 'Home',
    color: '#2563eb', // Royal Blue
    description: 'Trang chủ website VNIT: Banner Slider, Thống kê năng lực, Tin nổi bật, Đối tác',
    categories: [
      {
        id: 'tc-hero',
        name: 'Hero Slider & Thông Điệp Đầu Trang',
        description: 'Banner giàn khoan, khẩu hiệu hành động, nút Báo giá & Khám phá dịch vụ',
        badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
        targetPage: 'index.html#hero',
      },
      {
        id: 'tc-stats',
        name: 'Khối Chỉ Số Thống Kê Năng Lực',
        description: '10+ năm kinh nghiệm, 1,000+ dự án, 100% VILAS 1288, Trạm van 15,000 PSI',
        badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        targetPage: 'index.html#stats',
      },
      {
        id: 'tc-highlights',
        name: 'Bản Tin Ticker & Tiêu Điểm Nổi Bật',
        description: 'Dòng tin chạy marquee các chiến dịch turnaround và hợp đồng mới',
        badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
        targetPage: 'index.html#ticker',
      }
    ]
  },
  {
    id: 'gioi-thieu',
    name: '2. GIỚI THIỆU',
    pageFile: 'gioi-thieu.html',
    icon: 'Info',
    color: '#0284c7', // Sky Blue
    description: 'Hồ sơ doanh nghiệp VNIT: Lịch sử, Tầm nhìn, Sứ mệnh và Giá trị cốt lõi',
    categories: [
      {
        id: 'gt-chung',
        name: 'Giới Thiệu Chung',
        description: 'Tổng quan công ty Cổ phần Kỹ thuật & Kiểm định VNIT',
        badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
        targetPage: 'gioi-thieu.html#gioi-thieu-chung',
      },
      {
        id: 'gt-tam-nhin',
        name: 'Tầm Nhìn',
        description: 'Định hướng chiến lược phát triển đến năm 2035',
        badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        targetPage: 'gioi-thieu.html#tam-nhin',
      },
      {
        id: 'gt-su-menh',
        name: 'Sứ Mệnh',
        description: 'Cam kết với Khách hàng, Cán bộ nhân viên và Cộng đồng',
        badgeColor: 'bg-cyan-100 text-cyan-700 border-cyan-200',
        targetPage: 'gioi-thieu.html#su-menh',
      },
      {
        id: 'gt-gia-tri',
        name: 'Giá Trị Cốt Lõi',
        description: 'An toàn - Chính xác - Chuyên nghiệp - Uy tín - Đổi mới - Bền vững',
        badgeColor: 'bg-teal-100 text-teal-700 border-teal-200',
        targetPage: 'gioi-thieu.html#gia-tri-cot-loi',
      },
      {
        id: 'gt-lich-su',
        name: 'Lịch Sử Hình Thành & Phát Triển',
        description: 'Hành trình phát triển từ 2011 đến nay',
        badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
        targetPage: 'gioi-thieu.html#lich-su-hinh-thanh',
      },
      {
        id: 'gt-khach-hang',
        name: 'Khách Hàng & Đối Tác',
        description: 'Petrovietnam, PTSC, Vietsovpetro, PV GAS, LSP, Dung Quất',
        badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
        targetPage: 'gioi-thieu.html#khach-hang-doi-tac',
      }
    ]
  },
  {
    id: 'nang-luc',
    name: '3. NĂNG LỰC',
    pageFile: 'nang-luc.html',
    icon: 'Award',
    color: '#ea580c', // Orange
    description: 'Hồ sơ pháp lý, chứng chỉ VILAS ISO/IEC 17025, máy móc chuẩn và nhân sự',
    categories: [
      {
        id: 'nl-chung-nhan',
        name: 'Chứng Nhận',
        description: 'VILAS ISO/IEC 17025:2017, ISO 9001:2015, Giấy phép Bộ KH&CN ĐK 426',
        badgeColor: 'bg-red-100 text-red-700 border-red-200',
        targetPage: 'nang-luc.html#chung-nhan',
      },
      {
        id: 'nl-nhan-luc',
        name: 'Nhân Lực',
        description: 'Đội ngũ 150+ kỹ sư, chuyên gia chứng chỉ quốc tế API, ASNT, CompEx, AWS',
        badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
        targetPage: 'nang-luc.html#nhan-luc',
      },
      {
        id: 'nl-thiet-bi',
        name: 'Trang Thiết Bị',
        description: 'Máy chuẩn Beamex MC6, Druck DPI 620, Fluke, Trạm thử van 15,000 PSI, Laser XT770',
        badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
        targetPage: 'nang-luc.html#trang-thiet-bi',
      },
      {
        id: 'nl-ha-tang',
        name: 'Cơ Sở Hạ Tầng',
        description: 'Trụ sở Vũng Tàu, Lab chuẩn VILAS, Xưởng van & cơ khí 5,000m² tại KCN Đông Xuyên',
        badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
        targetPage: 'nang-luc.html#co-so-ha-tang',
      }
    ]
  },
  {
    id: 'dich-vu',
    name: '4. DỊCH VỤ',
    pageFile: 'dich-vu.html',
    icon: 'Wrench',
    color: '#059669', // Emerald Green
    description: '7 dịch vụ kỹ thuật cốt lõi chuẩn sơ đồ WEBSITE VNIT NEW UPDATE',
    categories: [
      {
        id: 'dv-kiem-dinh',
        name: 'Kiểm Định, Hiệu Chuẩn, Thử Nghiệm Thiết Bị Đo Lường - Tự Động',
        description: 'Phòng Lab VILAS 1288 & On-site: Áp suất, Nhiệt độ, Lưu lượng, Khí',
        badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        targetPage: 'dich-vu.html#dich-vu-1',
      },
      {
        id: 'dv-thi-cong',
        name: 'Dịch Vụ Thi Công, Chế Tạo, Lắp Đặt Hệ Thống Điện, Thiết Bị Đo Lường - Điều Khiển & Viễn Thông',
        description: 'Kéo rải cáp, thang máng cáp SS316, tủ điện LCP, PLC, Instrument Tubing, PAGA',
        badgeColor: 'bg-cyan-100 text-cyan-700 border-cyan-200',
        targetPage: 'dich-vu.html#dich-vu-2',
      },
      {
        id: 'dv-epc',
        name: 'Thiết Kế - Mua Sắm – Thi Công - Lắp Đặt - Chạy Thử (EPC / EPCM)',
        description: 'Tổng thầu EPC nâng cấp giàn khoan, mở rộng topside, thay thế hệ thống DCS/PLC',
        badgeColor: 'bg-orange-100 text-orange-700 border-orange-200',
        targetPage: 'dich-vu.html#dich-vu-3',
      },
      {
        id: 'dv-van',
        name: 'Bảo Dưỡng Và Sửa Chữa, Thử Nghiệm Các Loại Van',
        description: 'Bảo dưỡng, rà phẳng, thay seal và thử áp lực van PSV, van bi đến 15,000 PSI',
        badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
        targetPage: 'dich-vu.html#dich-vu-4',
      },
      {
        id: 'dv-co-khi',
        name: 'Bảo Dưỡng, Sửa Chữa Thiết Bị, Hệ Thống Cơ Khí',
        description: 'Đại tu máy bơm, máy nén, cân chỉnh laser đồng tâm trục, phân tích rung động',
        badgeColor: 'bg-teal-100 text-teal-700 border-teal-200',
        targetPage: 'dich-vu.html#dich-vu-5',
      },
      {
        id: 'dv-dien-tdh',
        name: 'Bảo Dưỡng, Sửa Chữa Và Nâng Cấp Hệ Thống, Thiết Bị Điện & Tự Động',
        description: 'Bảo dưỡng máy biến áp, tủ MCC, rơ-le số, lập trình SCADA/PLC Siemens/Rockwell',
        badgeColor: 'bg-violet-100 text-violet-700 border-violet-200',
        targetPage: 'dich-vu.html#dich-vu-6',
      },
      {
        id: 'dv-thuong-mai',
        name: 'Thương Mại Và Cho Thuê Thiết Bị',
        description: 'Cho thuê thiết bị chuẩn đo lường hàng đầu thế giới: Beamex, Druck, Fluke, NDT',
        badgeColor: 'bg-lime-100 text-lime-700 border-lime-200',
        targetPage: 'dich-vu.html#dich-vu-7',
      }
    ]
  },
  {
    id: 'du-an',
    name: '5. DỰ ÁN',
    pageFile: 'du-an.html',
    icon: 'Briefcase',
    color: '#0d9488', // Teal
    description: 'Hồ sơ năng lực công trình & dự án đã và đang thực hiện',
    categories: [
      {
        id: 'da-tieu-bieu',
        name: 'Dự Án Tiêu Biểu',
        description: 'Các dự án trọng điểm quốc gia VNIT tham gia thực hiện',
        badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
        targetPage: 'du-an.html#du-an-tieu-bieu',
      },
      {
        id: 'da-ngoai-khoi',
        name: 'Dự Án Dầu Khí Ngoài Khơi (Offshore)',
        description: 'Giàn Sao Vàng - Đại Nguyệt, Mỏ Lô B, Lạc Đà Vàng, Hải Sư Đen / Trắng',
        badgeColor: 'bg-sky-100 text-sky-700 border-sky-200',
        targetPage: 'du-an.html#ngoai-khoi',
      },
      {
        id: 'da-loc-hoa-dau',
        name: 'Dự Án Lọc Hóa Dầu & Nhà Máy Khí (Onshore)',
        description: 'Tổ hợp Hóa dầu Long Sơn (LSP), NMLD Dung Quất, Nhà máy Khí Dinh Cố',
        badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
        targetPage: 'du-an.html#loc-hoa-dau',
      },
      {
        id: 'da-nang-luong',
        name: 'Dự Án Năng Lượng & Điện Khí',
        description: 'Nhiệt điện Thái Bình 2, Nhơn Trạch 3 & 4, Trạm năng lượng tái tạo',
        badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        targetPage: 'du-an.html#nang-luong',
      }
    ]
  },
  {
    id: 'tin-tuc',
    name: '6. TIN TỨC',
    pageFile: 'tin-tuc.html',
    icon: 'Newspaper',
    color: '#8b5cf6', // Violet
    description: 'Bản tin hoạt động, kỹ thuật dầu khí, sự kiện và thị trường',
    categories: [
      {
        id: 'tin-hoat-dong',
        name: 'Tin Hoạt Động Doanh Nghiệp',
        description: 'Sự kiện nội bộ, ký kết hợp đồng, hoạt động sản xuất kỹ thuật VNIT',
        badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
        targetPage: 'tin-tuc.html#hoat-dong',
      },
      {
        id: 'tin-ky-thuat',
        name: 'Kỹ Thuật & Công Nghệ Kiểm Định',
        description: 'Quy trình thử nghiệm van, căn chỉnh laser, tiêu chuẩn VILAS ISO/IEC 17025',
        badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        targetPage: 'tin-tuc.html#ky-thuat',
      },
      {
        id: 'tin-su-kien',
        name: 'Sự Kiện, Hội Thảo & Đào Tạo',
        description: 'Hội thảo chuyên môn, đào tạo an toàn kỹ thuật và chứng chỉ nghề',
        badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
        targetPage: 'tin-tuc.html#su-kien',
      },
      {
        id: 'tin-dau-khi',
        name: 'Thị Trường Dầu Khí & Năng Lượng',
        description: 'Tin tức tổng hợp về các mỏ dầu khí, dự án điện gió và công nghiệp',
        badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
        targetPage: 'tin-tuc.html#thi-truong',
      }
    ]
  },
  {
    id: 'tuyen-dung',
    name: '7. TUYỂN DỤNG',
    pageFile: 'tuyen-dung.html',
    icon: 'Users',
    color: '#10b981', // Emerald
    description: 'Thông báo tuyển dụng, chính sách đãi ngộ nhân tài tại VNIT',
    categories: [
      {
        id: 'td-ky-su',
        name: 'Khối Kỹ Sư Công Trình & Ngoài Khơi',
        description: 'Kỹ sư đo lường, kỹ sư van, kỹ sư điện động lực làm việc giàn khoan',
        badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        targetPage: 'tuyen-dung.html#ky-su',
      },
      {
        id: 'td-lab',
        name: 'Khối Phòng Thí Nghiệm & Thử Nghiệm',
        description: 'Kỹ thuật viên hiệu chuẩn phòng Lab VILAS Vũng Tàu',
        badgeColor: 'bg-teal-100 text-teal-700 border-teal-200',
        targetPage: 'tuyen-dung.html#lab',
      },
      {
        id: 'td-kinh-doanh',
        name: 'Khối Dự Án, Báo Giá & Thương Mại',
        description: 'Kỹ sư kinh doanh thiết bị kỹ thuật, chuyên viên đấu thầu EPC',
        badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
        targetPage: 'tuyen-dung.html#kinh-doanh',
      }
    ]
  },
  {
    id: 'lien-he',
    name: '8. LIÊN HỆ',
    pageFile: 'lien-he.html',
    icon: 'PhoneCall',
    color: '#e11d48', // Rose Red
    description: 'Trụ sở chính, chi nhánh xưởng kỹ thuật và form báo giá RFQ',
    categories: [
      {
        id: 'lh-tru-so',
        name: 'Trụ Sở & Xưởng Dịch Vụ Kỹ Thuật',
        description: 'Trụ sở Vũng Tàu, VP TP.HCM và Xưởng van KCN Đông Xuyên',
        badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
        targetPage: 'lien-he.html#tru-so',
      },
      {
        id: 'lh-rfq',
        name: 'Yêu Cầu Báo Giá Kỹ Thuật (RFQ)',
        description: 'Form trực tuyến gửi yêu cầu báo giá kiểm định, van, EPC, thuê thiết bị',
        badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
        targetPage: 'lien-he.html#bao-gia',
      }
    ]
  }
];

// Helper: Tìm category theo ID
export function getCategoryById(categoryId) {
  for (const group of CATEGORY_GROUPS) {
    const found = group.categories.find(c => c.id === categoryId);
    if (found) {
      return {
        ...found,
        groupId: group.id,
        groupName: group.name,
        pageFile: group.pageFile,
        groupIcon: group.icon,
        groupColor: group.color,
      };
    }
  }
  // Fallback mặc định
  return {
    id: 'tin-hoat-dong',
    name: 'Tin Hoạt Động Doanh Nghiệp',
    groupId: 'tin-tuc',
    groupName: '6. TIN TỨC',
    pageFile: 'tin-tuc.html',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
  };
}

// Helper: Lấy danh sách phẳng tất cả categories
export function getAllFlatCategories() {
  const result = [];
  CATEGORY_GROUPS.forEach(group => {
    group.categories.forEach(cat => {
      result.push({
        ...cat,
        groupId: group.id,
        groupName: group.name,
        pageFile: group.pageFile,
      });
    });
  });
  return result;
}
