// ============================================================
// FILE: src/data/mediaGallery.js
// Thư Viện Hình Ảnh, Bộ Sưu Tập & Quản Lý Album VNIT
// ============================================================

export const PRESET_ALBUMS = [
  {
    id: 'album-offshore',
    title: 'Giàn Khoan & Công Trình Ngoài Khơi',
    description: 'Hình ảnh thi công và kiểm định tại giàn khai thác Lô 01&02, Heera, FPSO',
    coverUrl: 'assets/images/banner-4-vnit-01.jpg',
    categoryGroupId: 'du-an',
    imageUrls: [
      'assets/images/banner-4-vnit-01.jpg',
      'assets/images/project-hera.jpg',
      'assets/images/banner-1.jpg',
      'assets/images/banner-2.jpg',
      'assets/images/background-companies-4-2-scaled.jpg'
    ]
  },
  {
    id: 'album-lab-calib',
    title: 'Phòng Lab VILAS & Đo Lường Chuẩn Cao',
    description: 'Phòng thí nghiệm đạt chuẩn ISO/IEC 17025:2017 và thiết bị Beamex, Fluke, Druck',
    coverUrl: 'assets/images/IMG_5460-300x400.jpg',
    categoryGroupId: 'dich-vu',
    imageUrls: [
      'assets/images/IMG_5460-300x400.jpg',
      'assets/images/IMG_4461-533x400.jpg',
      'assets/images/IMG_5484-533x400.jpg',
      'assets/images/IMG_5423-600x800.jpg',
      'assets/images/IMG_5244-600x800.jpg'
    ]
  },
  {
    id: 'album-valves-mech',
    title: 'Xưởng Bảo Dưỡng Van & Cơ Khí Công Nghiệp',
    description: 'Trạm thử áp lực van PSV 15,000 PSI, cân chỉnh đồng tâm trục laser XT770',
    coverUrl: 'assets/images/IMG_6701-300x400.jpg',
    categoryGroupId: 'dich-vu',
    imageUrls: [
      'assets/images/IMG_6701-300x400.jpg',
      'assets/images/z5734006150820_779fb6aa77bf5a84fbbd12074e9febae-534x400.jpg',
      'assets/images/IMG_1052-411x400.jpg',
      'assets/images/z5808753523411_b21746d00b222dc51b71a727da57c2b2-600x800.jpg',
      'assets/images/z5901330745396_fdda2825a45ea5187fc33d7c6ef40b78-628x400.jpg'
    ]
  },
  {
    id: 'album-certificates',
    title: 'Chứng Chỉ VILAS, ISO & Giấy Phép ĐK 426',
    description: 'Quyết định công nhận năng lực từ Văn phòng Công nhận Chất lượng (BoA) & Bộ KH&CN',
    coverUrl: 'assets/images/CHUNG-CHI-CONG-NHAN-CALTEST-568x800.jpg',
    categoryGroupId: 'nang-luc',
    imageUrls: [
      'assets/images/CHUNG-CHI-CONG-NHAN-CALTEST-568x800.jpg',
      'assets/images/1-563x800.jpg',
      'assets/images/1-566x800.jpg',
      'assets/images/2-566x800.jpg',
      'assets/images/LOGO-ILAC-VILAS-ISO-17025-ISO-9001-2015-VNIT-01-800x202.png',
      'assets/images/handle_cert.png'
    ]
  },
  {
    id: 'album-clients-partners',
    title: 'Đối Tác Chiến Lược & Nhận Diện VNIT',
    description: 'Logo khách hàng dầu khí PTSC, PV GAS, VSP, SLB và bộ nhận diện thương hiệu VNIT',
    coverUrl: 'assets/images/logo-VNIT-kiem-dinh-viet-nam-01.png',
    categoryGroupId: 'gioi-thieu',
    imageUrls: [
      'assets/images/ptsc.png',
      'assets/images/pv-gas.png',
      'assets/images/pv-oil.png',
      'assets/images/pvep.png',
      'assets/images/vsp.jpg',
      'assets/images/Schlumberger_Logo.jpg',
      'assets/images/TLJOC_Logo.jpg',
      'assets/images/halliburton.png',
      'assets/images/logo-VNIT-kiem-dinh-viet-nam-01.png',
      'assets/images/logo-vnit-white.svg',
      'assets/images/qr-zalo-01-400x400.png'
    ]
  }
];

export const PRESET_GALLERY = [
  // Banners & Backgrounds
  {
    id: 'med-banner-4',
    title: 'Giàn Khoan Khai Thác Ngoài Khơi Lô 01&02',
    url: 'assets/images/banner-4-vnit-01.jpg',
    category: 'banner',
    albumId: 'album-offshore',
    tags: ['banner', 'ngoài khơi', 'giàn khoan', 'dầu khí'],
    dimensions: '1920x800'
  },
  {
    id: 'med-banner-1',
    title: 'Banner Toàn Cảnh Công Trình Năng Lượng',
    url: 'assets/images/banner-1.jpg',
    category: 'banner',
    albumId: 'album-offshore',
    tags: ['banner', 'năng lượng', 'công trình'],
    dimensions: '1920x600'
  },
  {
    id: 'med-banner-2',
    title: 'Hệ Thống Đường Ống Khí Áp Lực Cao',
    url: 'assets/images/banner-2.jpg',
    category: 'banner',
    albumId: 'album-offshore',
    tags: ['banner', 'đường ống', 'nhà máy lọc dầu'],
    dimensions: '1920x600'
  },
  {
    id: 'med-bg-comp',
    title: 'Tổ Hợp Doanh Nghiệp Công Nghiệp VNIT',
    url: 'assets/images/background-companies-4-2-scaled.jpg',
    category: 'banner',
    albumId: 'album-offshore',
    tags: ['background', 'tổng quan', 'khu công nghiệp'],
    dimensions: '1600x900'
  },

  // Phòng Lab & Hiệu Chuẩn Đo Lường
  {
    id: 'med-lab-calib',
    title: 'Phòng Thí Nghiệm & Hiệu Chuẩn VILAS BoA',
    url: 'assets/images/IMG_5460-300x400.jpg',
    category: 'services',
    albumId: 'album-lab-calib',
    tags: ['hiệu chuẩn', 'phòng lab', 'vilas', 'thiết bị chuẩn'],
    dimensions: '300x400'
  },
  {
    id: 'med-valve-test',
    title: 'Trạm Thử Nghiệm Áp Lực Van An Toàn PSV 15,000 PSI',
    url: 'assets/images/IMG_6701-300x400.jpg',
    category: 'services',
    albumId: 'album-valves-mech',
    tags: ['van psv', 'thử áp lực', 'bảo dưỡng van', 'an toàn'],
    dimensions: '300x400'
  },
  {
    id: 'med-ei-telecom',
    title: 'Thi Công Hệ Thống Điện & Tủ Điều Khiển LCP',
    url: 'assets/images/IMG_1052-411x400.jpg',
    category: 'services',
    albumId: 'album-valves-mech',
    tags: ['điện', 'tủ điện', 'lcp', 'thi công', 'viễn thông'],
    dimensions: '411x400'
  },
  {
    id: 'med-laser-align',
    title: 'Căn Chỉnh Đồng Tâm Trục Bằng Thiết Bị Laser',
    url: 'assets/images/z5734006150820_779fb6aa77bf5a84fbbd12074e9febae-534x400.jpg',
    category: 'services',
    albumId: 'album-valves-mech',
    tags: ['laser', 'căn chỉnh trục', 'máy quay', 'cơ khí'],
    dimensions: '534x400'
  },
  {
    id: 'med-field-calib',
    title: 'Kỹ Sư Kiểm Định Áp Suất Tại Công Trường',
    url: 'assets/images/IMG_4461-533x400.jpg',
    category: 'services',
    albumId: 'album-lab-calib',
    tags: ['kỹ sư', 'hiện trường', 'áp suất', 'kiểm định'],
    dimensions: '533x400'
  },
  {
    id: 'med-fluke-stand',
    title: 'Bàn Kiểm Chuẩn Đo Lường Điện & Tự Động',
    url: 'assets/images/IMG_5484-533x400.jpg',
    category: 'services',
    albumId: 'album-lab-calib',
    tags: ['bàn chuẩn', 'đo lường', 'tự động hóa'],
    dimensions: '533x400'
  },

  // Chứng nhận & Năng lực
  {
    id: 'med-cert-vilas',
    title: 'Chứng Chỉ Công Nhận Phòng Hiệu Chuẩn VILAS 1288 (ISO/IEC 17025)',
    url: 'assets/images/CHUNG-CHI-CONG-NHAN-CALTEST-568x800.jpg',
    category: 'certificates',
    albumId: 'album-certificates',
    tags: ['chứng chỉ', 'vilas', 'iso 17025', 'boa', 'công nhận'],
    dimensions: '568x800'
  },
  {
    id: 'med-cert-426',
    title: 'Giấy Đăng Ký Cung Cấp Dịch Vụ Kiểm Định Bộ KH&CN (ĐK 426)',
    url: 'assets/images/1-563x800.jpg',
    category: 'certificates',
    albumId: 'album-certificates',
    tags: ['giấy phép', 'bộ khcn', 'kiểm định', 'pháp lý'],
    dimensions: '563x800'
  },
  {
    id: 'med-cert-iso9001',
    title: 'Chứng Nhận Hệ Thống Quản Lý Chất Lượng ISO 9001:2015',
    url: 'assets/images/1-566x800.jpg',
    category: 'certificates',
    albumId: 'album-certificates',
    tags: ['iso 9001', 'quản lý chất lượng', 'tcvn'],
    dimensions: '566x800'
  },
  {
    id: 'med-cert-appendix',
    title: 'Phụ Lục Phạm Vi Đo Lường Được Chỉ Định Mở Rộng',
    url: 'assets/images/2-566x800.jpg',
    category: 'certificates',
    albumId: 'album-certificates',
    tags: ['phụ lục', 'dải đo', 'phạm vi', 'năng lực'],
    dimensions: '566x800'
  },
  {
    id: 'med-logo-ilac',
    title: 'Dải Logo Quốc Tế ILAC-MRA & VILAS & BoA & ISO',
    url: 'assets/images/LOGO-ILAC-VILAS-ISO-17025-ISO-9001-2015-VNIT-01-800x202.png',
    category: 'certificates',
    albumId: 'album-certificates',
    tags: ['ilac', 'vilas', 'iso', 'logo'],
    dimensions: '800x202'
  },

  // Dự án & Khách hàng
  {
    id: 'med-proj-hera',
    title: 'Dự Án Phát Triển Công Nghệ Heera Ngoài Khơi',
    url: 'assets/images/project-hera.jpg',
    category: 'projects',
    albumId: 'album-offshore',
    tags: ['dự án', 'heera', 'ngoài khơi', 'lắp đặt'],
    dimensions: '600x400'
  },
  {
    id: 'med-ptsc-logo',
    title: 'Tổng Công Ty Cổ Phần Dịch Vụ Kỹ Thuật Dầu Khí (PTSC)',
    url: 'assets/images/ptsc.png',
    category: 'clients',
    albumId: 'album-clients-partners',
    tags: ['khách hàng', 'ptsc', 'dầu khí'],
    dimensions: '200x80'
  },
  {
    id: 'med-pvgas-logo',
    title: 'Tổng Công Ty Khí Việt Nam (PV GAS)',
    url: 'assets/images/pv-gas.png',
    category: 'clients',
    albumId: 'album-clients-partners',
    tags: ['khách hàng', 'pv gas', 'khí hóa lỏng'],
    dimensions: '200x80'
  },
  {
    id: 'med-vsp-logo',
    title: 'Liên Doanh Việt - Nga Vietsovpetro (VSP)',
    url: 'assets/images/vsp.jpg',
    category: 'clients',
    albumId: 'album-clients-partners',
    tags: ['khách hàng', 'vietsovpetro', 'vsp', 'dầu khí'],
    dimensions: '200x80'
  },
  {
    id: 'med-tljoc-logo',
    title: 'Công Ty Liên Doanh Điều Hành Thăng Long JOC',
    url: 'assets/images/TLJOC_Logo.jpg',
    category: 'clients',
    albumId: 'album-clients-partners',
    tags: ['khách hàng', 'tljoc', 'hải sư đen'],
    dimensions: '200x80'
  },
  {
    id: 'med-schlum-logo',
    title: 'Tập Đoàn Dịch Vụ Dầu Khí SLB (Schlumberger)',
    url: 'assets/images/Schlumberger_Logo.jpg',
    category: 'clients',
    albumId: 'album-clients-partners',
    tags: ['đối tác', 'slb', 'schlumberger'],
    dimensions: '200x80'
  },
  {
    id: 'med-halli-logo',
    title: 'Tập Đoàn Dầu Khí Halliburton',
    url: 'assets/images/halliburton.png',
    category: 'clients',
    albumId: 'album-clients-partners',
    tags: ['đối tác', 'halliburton'],
    dimensions: '200x80'
  },

  // Nhận diện thương hiệu VNIT
  {
    id: 'med-vnit-logo-color',
    title: 'Logo Chuẩn VNIT Có Màu (Bản In & Web)',
    url: 'assets/images/logo-VNIT-kiem-dinh-viet-nam-01.png',
    category: 'branding',
    albumId: 'album-clients-partners',
    tags: ['logo', 'vnit', 'thương hiệu', 'chuẩn'],
    dimensions: '500x200'
  },
  {
    id: 'med-vnit-logo-white',
    title: 'Logo VNIT Trắng Vector (SVG)',
    url: 'assets/images/logo-vnit-white.svg',
    category: 'branding',
    albumId: 'album-clients-partners',
    tags: ['logo', 'svg', 'trắng'],
    dimensions: 'Vector'
  },
  {
    id: 'med-qr-zalo',
    title: 'Mã QR Kênh Hỗ Trợ Kỹ Thuật Zalo VNIT',
    url: 'assets/images/qr-zalo-01-400x400.png',
    category: 'branding',
    albumId: 'album-clients-partners',
    tags: ['qr', 'zalo', 'liên hệ'],
    dimensions: '400x400'
  }
];

const LOCAL_STORAGE_MEDIA_KEY = 'vnit_custom_media_items';
const LOCAL_STORAGE_ALBUMS_KEY = 'vnit_custom_albums_list';

// Lấy danh sách ảnh tùy biến người dùng đã upload thêm
export function getCustomUploadedMedia() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MEDIA_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

// Lưu thêm ảnh mới vừa upload vào thư viện
export function saveCustomUploadedMedia(item) {
  try {
    const current = getCustomUploadedMedia();
    const updated = [item, ...current];
    localStorage.setItem(LOCAL_STORAGE_MEDIA_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}

// Lấy toàn bộ thư viện ảnh (Ảnh có sẵn + Ảnh đã upload thêm)
export function getAllMediaItems() {
  const custom = getCustomUploadedMedia();
  return [...custom, ...PRESET_GALLERY];
}

// ============================================================
// CÁC HÀM QUẢN LÝ ALBUM
// ============================================================

// Lấy danh sách tất cả các Album (Mặc định + Tạo mới)
export function getAllAlbums() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ALBUMS_KEY);
    const customAlbums = raw ? JSON.parse(raw) : [];
    return [...customAlbums, ...PRESET_ALBUMS];
  } catch (e) {
    return PRESET_ALBUMS;
  }
}

// Tạo Album Mới
export function createNewAlbum({ title, description, categoryGroupId, coverUrl }) {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ALBUMS_KEY);
    const customAlbums = raw ? JSON.parse(raw) : [];

    const newAlbum = {
      id: 'album-custom-' + Date.now(),
      title: title.trim(),
      description: description ? description.trim() : '',
      categoryGroupId: categoryGroupId || 'trang-chu',
      coverUrl: coverUrl || 'assets/images/banner-4-vnit-01.jpg',
      imageUrls: [],
      createdAt: new Date().toISOString()
    };

    const updated = [newAlbum, ...customAlbums];
    localStorage.setItem(LOCAL_STORAGE_ALBUMS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Lỗi tạo album mới:', e);
    return [];
  }
}

// Xóa Album tùy biến
export function deleteCustomAlbum(albumId) {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ALBUMS_KEY);
    const customAlbums = raw ? JSON.parse(raw) : [];
    const updated = customAlbums.filter(a => a.id !== albumId);
    localStorage.setItem(LOCAL_STORAGE_ALBUMS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [];
  }
}

// Thêm ảnh vào Album
export function addImageToAlbum(albumId, imageUrl) {
  try {
    // Kiểm tra trong custom albums
    const raw = localStorage.getItem(LOCAL_STORAGE_ALBUMS_KEY);
    const customAlbums = raw ? JSON.parse(raw) : [];
    const target = customAlbums.find(a => a.id === albumId);
    if (target) {
      if (!target.imageUrls) target.imageUrls = [];
      if (!target.imageUrls.includes(imageUrl)) {
        target.imageUrls.unshift(imageUrl);
        target.coverUrl = imageUrl;
        localStorage.setItem(LOCAL_STORAGE_ALBUMS_KEY, JSON.stringify(customAlbums));
      }
    }
  } catch (e) {
    console.error('Lỗi thêm ảnh vào album:', e);
  }
}
