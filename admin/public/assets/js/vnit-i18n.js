/**
 * VNIT Bilingual Internationalization System (Vietnamese <-> English)
 * Fully supports client-side instant switching, localStorage persistence,
 * URL query parameter (?lang=en), /en/ routes, and comprehensive dictionary mapping.
 */

(function () {
  'use strict';

  const PAGE_TITLES = {
    vi: {
      'index.html': 'VNIT - KIỂM ĐỊNH VÀ DỊCH VỤ KỸ THUẬT VIỆT NAM | Chuẩn VILAS 1288 & ISO 9001',
      'gioi-thieu.html': 'Giới thiệu - VNIT | Công ty Kiểm định & Dịch vụ Kỹ thuật Việt Nam',
      'nang-luc.html': 'Hồ sơ Năng lực & Chứng nhận - VNIT | VILAS 1288 ISO/IEC 17025',
      'dich-vu.html': '7 Lĩnh vực Dịch vụ Kỹ thuật - VNIT | Kiểm định, Hiệu chuẩn, EPC, Bảo dưỡng Van',
      'du-an.html': 'Dự án Tiêu biểu - VNIT | Dầu khí Ngoài khơi & Nhà máy Công nghiệp',
      'tin-tuc.html': 'Tin tức & Hoạt động Kỹ thuật - VNIT',
      'tuyen-dung.html': 'Cơ hội Nghề nghiệp & Tuyển dụng Kỹ sư - VNIT',
      'lien-he.html': 'Liên hệ & Báo giá Kỹ thuật - VNIT'
    },
    en: {
      'index.html': 'VNIT - Vietnam Technical Services & Inspection | VILAS 1288 & ISO 9001',
      'gioi-thieu.html': 'About Us - VNIT | Vietnam Technical Services & Inspection Co., Ltd',
      'nang-luc.html': 'Capabilities & Accreditations - VNIT | VILAS 1288 ISO/IEC 17025',
      'dich-vu.html': '7 Core Technical Services - VNIT | Calibration, EPC, Valve Overhaul',
      'du-an.html': 'Track Record & Featured Projects - VNIT | Offshore & Industrial',
      'tin-tuc.html': 'News & Technical Updates - VNIT',
      'tuyen-dung.html': 'Careers & Engineering Vacancies - VNIT',
      'lien-he.html': 'Contact & Technical RFQ - VNIT'
    }
  };

  const DICTIONARY = {
    vi: {
      // Global Navigation & Header
      'nav.home': 'Trang chủ',
      'nav.about': 'Giới thiệu',
      'nav.about.intro': 'Giới thiệu chung',
      'nav.about.vision': 'Tầm nhìn',
      'nav.about.mission': 'Sứ mệnh',
      'nav.about.values': 'Giá trị cốt lõi',
      'nav.about.history': 'Lịch sử hình thành và phát triển',
      'nav.about.partners': 'Khách hàng và đối tác',
      'nav.capabilities': 'Năng lực',
      'nav.cap.cert': 'Chứng nhận',
      'nav.cap.hr': 'Nhân lực',
      'nav.cap.equip': 'Trang thiết bị',
      'nav.cap.infra': 'Cơ sở hạ tầng',
      'nav.services': 'Dịch vụ',
      'nav.services.s1': 'Kiểm định, hiệu chuẩn, thử nghiệm đo lường - tự động',
      'nav.services.s2': 'Thi công, chế tạo, lắp đặt hệ thống điện, đo lường & viễn thông',
      'nav.services.s3': 'Thiết kế - Mua sắm – Thi công - Lắp đặt - Chạy thử (EPC)',
      'nav.services.s4': 'Bảo dưỡng, sửa chữa và thử nghiệm các loại van',
      'nav.services.s5': 'Bảo dưỡng, sửa chữa thiết bị và hệ thống cơ khí',
      'nav.services.s6': 'Bảo dưỡng, sửa chữa, nâng cấp hệ thống điện & tự động',
      'nav.services.s7': 'Thương mại và cho thuê thiết bị kỹ thuật',
      'nav.projects': 'Dự án',
      'nav.proj.featured': 'Dự án tiêu biểu',
      'nav.proj.offshore': 'Dự án Dầu khí ngoài khơi',
      'nav.proj.refinery': 'Dự án Lọc hóa dầu & Hóa chất',
      'nav.proj.energy': 'Dự án Năng lượng & Công nghiệp',
      'nav.news': 'Tin tức',
      'nav.careers': 'Tuyển dụng',
      'nav.contact': 'Liên hệ',
      'header.tagline': 'KIỂM ĐỊNH & DỊCH VỤ KỸ THUẬT',
      'header.hotline': 'Hotline:',
      'header.email': 'Email:',
      'header.vilas_badge': 'VILAS 1288 (ISO/IEC 17025) & ISO 9001:2015',
      'header.search_placeholder': 'Nhập từ khóa tìm kiếm dịch vụ, dự án, năng lực VNIT...',
      'header.search_btn': 'Tìm kiếm',

      // Hero Banner
      'hero.slide1.title': 'KIỂM ĐỊNH, HIỆU CHUẨN ĐO LƯỜNG VÀ DỊCH VỤ KỸ THUẬT CÔNG NGHIỆP',
      'hero.slide1.badge': 'VILAS 1288 (ISO/IEC 17025) & ISO 9001:2015',
      'hero.slide1.btn1': 'Khám phá 7 Dịch vụ',
      'hero.slide1.btn2': 'Yêu cầu Báo giá',
      'hero.slide2.title': 'BẢO DƯỠNG, SỬA CHỮA VÀ THỬ NGHIỆM VAN CÔNG NGHIỆP ĐẾN 15,000 PSI',
      'hero.slide2.badge': 'CHUẨN API 527 & API 598',
      'hero.slide2.btn1': 'Xưởng Dịch Vụ Van',
      'hero.slide2.btn2': 'Năng Lực Thiết Bị',
      'hero.slide3.title': 'TỔNG THẦU EPC HỆ THỐNG ĐIỆN, ĐO LƯỜNG VÀ TỰ ĐỘNG HÓA CÔNG TRÌNH',
      'hero.slide3.badge': 'THIẾT KẾ - MUA SẮM - THI CÔNG - CHẠY THỬ',
      'hero.slide3.btn1': 'Xem Dự Án Tiêu Biểu',
      'hero.slide3.btn2': 'Tư Vấn Kỹ Thuật',
      'hero.slide4.title': 'CÂN CHỈNH ĐỒNG TÂM TRỤC LASER VÀ PHÂN TÍCH RUNG ĐỘNG CHẨN ĐOÁN MÁY',
      'hero.slide4.badge': 'EASY-LASER & BEAMEX MC6',
      'hero.slide4.btn1': 'Cơ Khí Chính Xác',
      'hero.slide4.btn2': 'Hỗ Trợ Hiện Trường 24/7',

      // News Ticker
      'ticker.label': 'TIN NỔI BẬT',
      'ticker.item1': 'VNIT hoàn thành xuất sắc chiến dịch kiểm định & bảo dưỡng an toàn mỏ Lô 01&02 ngoài khơi',
      'ticker.item2': 'Mở rộng phạm vi công nhận BoA VILAS 1288 ISO/IEC 17025 cho phép đo Lưu lượng & Áp lực cao 15,000 PSI',
      'ticker.item3': 'VNIT ký kết hợp đồng kiểm định & thử nghiệm bình áp lực cao cùng Thăng Long JOC',
      'ticker.item4': 'Hội thảo quốc tế về công nghệ cân chỉnh laser và phân tích rung động chẩn đoán máy quay cùng chuyên gia Easy-Laser',

      // Overview Section
      'overview.subtitle': 'TỔNG QUAN DOANH NGHIỆP',
      'overview.title': 'CÔNG TY TNHH KIỂM ĐỊNH VÀ DỊCH VỤ KỸ THUẬT VIỆT NAM (VNIT)',
      'overview.eng_title': 'VIET NAM TECHNICAL SERVICES & INSPECTION COMPANY LIMITED',
      'overview.desc': 'Được thành lập theo Giấy chứng nhận ĐKKD số 3502379813 do Sở Kế hoạch & Đầu tư tỉnh Bà Rịa - Vũng Tàu cấp ngày 19/11/2018, cùng Giấy chứng nhận hoạt động số 53/GCN-BKHCN (Số đăng ký ĐK 426) của Bộ Khoa Học & Công Nghệ. Trải qua hơn 10 năm xây dựng và phát triển bền vững, VNIT đã khẳng định vị thế dẫn đầu trong lĩnh vực đo lường, thử nghiệm phòng lab đạt chuẩn quốc tế VILAS 1288 (ISO/IEC 17025:2017), hệ thống quản lý chất lượng ISO 9001:2015, xưởng dịch vụ đại tu van đến 15,000 PSI và tổng thầu EPC hệ thống điện - tự động hóa cho các công trình dầu khí, lọc hóa dầu và công nghiệp trọng điểm quốc gia.',
      'overview.btn_about': 'Xem Hồ sơ Giới thiệu VNIT',
      'overview.btn_cap': 'Hồ sơ Năng lực VILAS 1288',

      // Statistics Section
      'stats.years': 'Năm Phát Triển Bền Vững',
      'stats.years_desc': 'Khẳng định thương hiệu cal-test.vn từ 2018',
      'stats.projects': 'Dự Án Đã Thực Hiện',
      'stats.projects_desc': 'Tại các giàn khoan và nhà máy công nghiệp',
      'stats.vilas': 'Chuẩn BoA VILAS 1288 & ISO 9001',
      'stats.vilas_desc': 'Được Bộ Khoa Học & Công Nghệ chỉ định ĐK 426',
      'stats.pressure': 'Dải Áp Lực Thử Nghiệm Van',
      'stats.pressure_desc': 'Trạm thử áp lực thủy tĩnh theo chuẩn API 527/598',

      // 7 Core Services Section
      'services.subtitle': 'DỊCH VỤ TOÀN DIỆN',
      'services.title': '7 LĨNH VỰC DỊCH VỤ VNIT CUNG CẤP',
      'services.desc': 'Hệ thống dịch vụ kỹ thuật khép kín theo tiêu chuẩn quốc tế, đáp ứng đầy đủ yêu cầu khắt khe của các công trình công nghiệp và năng lượng.',
      'services.s1.title': 'Kiểm định, hiệu chuẩn, thử nghiệm đo lường - tự động',
      'services.s1.desc': 'Hiệu chuẩn áp suất, nhiệt độ, lưu lượng, mức, phân tích khí, thiết bị điện - điện tử phòng lab VILAS 1288 và tại hiện trường công trình.',
      'services.s2.title': 'Thi công, chế tạo, lắp đặt hệ thống điện, đo lường & viễn thông',
      'services.s2.desc': 'Lắp đặt cáp động lực, thang máng cáp, chế tạo tủ bảng điện điều khiển (LCP, Marshalling), thiết bị đo hiện trường và hệ thống viễn thông.',
      'services.s3.title': 'Thiết kế - Mua sắm – Thi công - Lắp đặt - Chạy thử (EPC)',
      'services.s3.desc': 'Tổng thầu EPC trọn gói các gói thầu điện, đo lường điều khiển (ICSS/SCADA/DCS/ESD/F&G) cho các công trình công nghiệp và dầu khí.',
      'services.s4.title': 'Bảo dưỡng, sửa chữa và thử nghiệm các loại van',
      'services.s4.desc': 'Bảo dưỡng, rà mài mặt bích, phục hồi làm kín, hiệu chuẩn và thử nghiệm áp lực van an toàn (PSV), van điều khiển (Control Valve), van đóng ngắt đến 15,000 PSI theo chuẩn API 527/598.',
      'services.s5.title': 'Bảo dưỡng, sửa chữa thiết bị và hệ thống cơ khí',
      'services.s5.desc': 'Cân chỉnh đồng tâm trục laser (Laser Shaft Alignment), phân tích rung động chẩn đoán máy quay, phục hồi động cơ bơm, máy nén khí, turbine công nghiệp.',
      'services.s6.title': 'Bảo dưỡng, sửa chữa, nâng cấp hệ thống điện & tự động',
      'services.s6.desc': 'Đại tu tủ máy cắt trung hạ thế, thí nghiệm rơ le bảo vệ, nâng cấp lập trình PLC/SCADA/DCS và bảo trì định kỳ hệ thống điện động lực nhà máy.',
      'services.s7.title': 'Thương mại và cho thuê thiết bị kỹ thuật',
      'services.s7.desc': 'Cung cấp phụ tùng thay thế chính hãng ngành điện - đo lường - van; cho thuê máy chuẩn hiệu chuẩn áp suất (Fluke, Beamex, Druck), máy nén khí cao áp, máy phát thử tải.',
      'services.link': 'Chi tiết dịch vụ',

      // Capabilities Section
      'cap.subtitle': 'NĂNG LỰC ĐƯỢC CÔNG NHẬN',
      'cap.title': 'HỒ SƠ NĂNG LỰC & CHỨNG NHẬN QUỐC TẾ',
      'cap.c1.title': 'Chứng nhận',
      'cap.c2.title': 'Nhân lực',
      'cap.c3.title': 'Trang thiết bị',
      'cap.c4.title': 'Cơ sở hạ tầng',
      'cap.btn': 'Xem Chi tiết Chứng nhận & Hồ sơ Năng lực',

      // Featured Projects Section
      'proj.subtitle': 'DỰ ÁN ĐÃ THỰC HIỆN',
      'proj.title': 'DỰ ÁN TIÊU BIỂU',
      'proj.tag_offshore': 'Dầu khí ngoài khơi',
      'proj.tag_refinery': 'Lọc hóa dầu',
      'proj.tag_energy': 'Năng lượng & Công nghiệp',
      'proj.client': 'Khách hàng:',
      'proj.location': 'Địa điểm:',
      'proj.scope': 'Phạm vi:',
      'proj.btn': 'Xem chi tiết',

      // Clients & Partners Section
      'partners.subtitle': 'ĐỒNG HÀNH BỀN VỮNG',
      'partners.title': 'KHÁCH HÀNG & ĐỐI TÁC CHIẾN LƯỢC',

      // News Section
      'news.subtitle': 'TIN TỨC HOẠT ĐỘNG',
      'news.title': 'TIN TỨC & SỰ KIỆN KỸ THUẬT VNIT',
      'news.readmore': 'Đọc tiếp',

      // Footer
      'footer.company_name': 'CÔNG TY TNHH KIỂM ĐỊNH VÀ DỊCH VỤ KỸ THUẬT VIỆT NAM (VNIT)',
      'footer.address': 'Lô D6/5, đường Quang Dũng, Trung Tâm Đô Thị Chí Linh, Phường 10, TP. Vũng Tàu',
      'footer.quicklinks': 'Liên kết nhanh',
      'footer.services': 'Dịch vụ chính',
      'footer.zalo_title': 'Kết nối Zalo Kỹ thuật',
      'footer.zalo_desc': 'Quét mã QR Zalo để liên hệ trực tiếp với kỹ sư trực 24/7.',
      'footer.newsletter_title': 'Đăng ký nhận tin',
      'footer.newsletter_placeholder': 'Địa chỉ email...',
      'footer.send_btn': 'Gửi',
      'footer.license': 'CÔNG TY TNHH KIỂM ĐỊNH VÀ DỊCH VỤ KỸ THUẬT VIỆT NAM (VNIT) | GCN ĐKKD: 3502379813',
      'footer.copyright': 'Copyright 2026 © VNIT - cal-test.vn. All rights reserved.',

      // Common Sub-Page Breadcrumb
      'breadcrumb.home': 'Trang chủ',
      'breadcrumb.about': 'Giới thiệu',
      'breadcrumb.cap': 'Năng lực',
      'breadcrumb.services': 'Dịch vụ kỹ thuật',
      'breadcrumb.projects': 'Dự án tiêu biểu',
      'breadcrumb.news': 'Tin tức & Sự kiện',
      'breadcrumb.careers': 'Cơ hội nghề nghiệp',
      'breadcrumb.contact': 'Liên hệ & Hỗ trợ kỹ thuật',

      // Forms & Toasts
      'form.name': 'Họ và tên *',
      'form.phone': 'Số điện thoại *',
      'form.email': 'Email liên hệ *',
      'form.service': 'Dịch vụ quan tâm',
      'form.message': 'Nội dung yêu cầu kỹ thuật / Báo giá *',
      'form.submit': 'Gửi Yêu Cầu Báo Giá',
      'form.close': 'Đóng',
      'toast.newsletter': 'Cảm ơn bạn! Đã đăng ký nhận bản tin kỹ thuật VNIT thành công.',
      'toast.contact': 'Cảm ơn bạn! Yêu cầu của bạn đã được gửi tới VNIT. Chúng tôi sẽ liên hệ trong 24h.',
      'toast.apply': 'Hồ sơ ứng tuyển của bạn đã được tiếp nhận thành công. Phòng Nhân sự VNIT sẽ phản hồi sớm!'
    },

    en: {
      // Global Navigation & Header
      'nav.home': 'Home',
      'nav.about': 'About Us',
      'nav.about.intro': 'General Introduction',
      'nav.about.vision': 'Vision',
      'nav.about.mission': 'Mission',
      'nav.about.values': 'Core Values',
      'nav.about.history': 'History & Milestones',
      'nav.about.partners': 'Clients & Partners',
      'nav.capabilities': 'Capabilities',
      'nav.cap.cert': 'Certifications & Accreditations',
      'nav.cap.hr': 'Human Capital',
      'nav.cap.equip': 'Machinery & Equipment',
      'nav.cap.infra': 'Infrastructure & Facilities',
      'nav.services': 'Services',
      'nav.services.s1': 'Calibration, Verification & Instrumentation Testing',
      'nav.services.s2': 'Fabrication & Installation of E&I and Telecom Systems',
      'nav.services.s3': 'Engineering - Procurement - Construction (EPC/EPIC)',
      'nav.services.s4': 'Maintenance, Repair & Valve Testing (up to 15,000 PSI)',
      'nav.services.s5': 'Precision Mechanical Maintenance & Laser Alignment',
      'nav.services.s6': 'Maintenance & Upgrade of Electrical & Automation Systems',
      'nav.services.s7': 'Equipment Trading & Rental Services',
      'nav.projects': 'Projects',
      'nav.proj.featured': 'Featured Projects',
      'nav.proj.offshore': 'Offshore Oil & Gas Projects',
      'nav.proj.refinery': 'Refinery & Petrochemical Projects',
      'nav.proj.energy': 'Energy & Industrial Projects',
      'nav.news': 'News & Events',
      'nav.careers': 'Careers',
      'nav.contact': 'Contact & RFQ',
      'header.tagline': 'TECHNICAL SERVICES & INSPECTION',
      'header.hotline': 'Hotline:',
      'header.email': 'Email:',
      'header.vilas_badge': 'VILAS 1288 (ISO/IEC 17025) & ISO 9001:2015',
      'header.search_placeholder': 'Search services, projects, capabilities...',
      'header.search_btn': 'Search',

      // Hero Banner
      'hero.slide1.title': 'CALIBRATION, VERIFICATION & INDUSTRIAL TECHNICAL SERVICES',
      'hero.slide1.badge': 'VILAS 1288 (ISO/IEC 17025) & ISO 9001:2015',
      'hero.slide1.btn1': 'Explore 7 Services',
      'hero.slide1.btn2': 'Request Quotation',
      'hero.slide2.title': 'MAINTENANCE, REPAIR & TESTING OF INDUSTRIAL VALVES UP TO 15,000 PSI',
      'hero.slide2.badge': 'STANDARDS API 527 & API 598',
      'hero.slide2.btn1': 'Valve Workshop',
      'hero.slide2.btn2': 'Equipment Capacity',
      'hero.slide3.title': 'EPC CONTRACTOR FOR ELECTRICAL, INSTRUMENTATION & AUTOMATION',
      'hero.slide3.badge': 'ENGINEERING - PROCUREMENT - CONSTRUCTION - COMMISSIONING',
      'hero.slide3.btn1': 'Featured Projects',
      'hero.slide3.btn2': 'Technical Consultation',
      'hero.slide4.title': 'LASER SHAFT ALIGNMENT & ROTATING MACHINERY VIBRATION ANALYSIS',
      'hero.slide4.badge': 'EASY-LASER & BEAMEX MC6',
      'hero.slide4.btn1': 'Precision Mechanics',
      'hero.slide4.btn2': '24/7 Onsite Support',

      // News Ticker
      'ticker.label': 'BREAKING NEWS',
      'ticker.item1': 'VNIT successfully completes safety equipment recertification & overhaul campaign for offshore Blocks 01&02',
      'ticker.item2': 'Scope expansion of BoA VILAS 1288 ISO/IEC 17025 for high pressure flow & valve testing up to 15,000 PSI',
      'ticker.item3': 'VNIT signs contract for pressurized cylinder inspection and hydrostatic testing with Thang Long JOC',
      'ticker.item4': 'Technical workshop on precision laser alignment and vibration condition monitoring with Easy-Laser experts',

      // Overview Section
      'overview.subtitle': 'COMPANY OVERVIEW',
      'overview.title': 'VIET NAM TECHNICAL SERVICES & INSPECTION COMPANY LIMITED (VNIT)',
      'overview.eng_title': 'VIET NAM TECHNICAL SERVICES & INSPECTION COMPANY LIMITED',
      'overview.desc': 'Established under Business License No. 3502379813 issued by the Department of Planning and Investment of Ba Ria - Vung Tau Province on November 19, 2018, and accredited under Operation License No. 53/GCN-BKHCN (Registration No. ĐK 426) by the Ministry of Science and Technology. Over 10 years of steadfast growth, VNIT has affirmed its pioneering status in measurement, calibration and testing laboratories meeting international standard VILAS 1288 (ISO/IEC 17025:2017), ISO 9001:2015 Quality Management System, state-of-the-art valve overhaul facilities up to 15,000 PSI, and EPC contracting for E&I automation systems across strategic offshore oil & gas, petrochemical, and industrial complexes.',
      'overview.btn_about': 'Company Profile',
      'overview.btn_cap': 'VILAS 1288 Capabilities',

      // Statistics Section
      'stats.years': 'Years of Excellence',
      'stats.years_desc': 'Trusted technical partner since 2018',
      'stats.projects': 'Completed Projects',
      'stats.projects_desc': 'Across offshore platforms & industrial plants',
      'stats.vilas': 'VILAS 1288 & ISO 9001 Certified',
      'stats.vilas_desc': 'Accredited by BoA & Ministry of Science & Technology',
      'stats.pressure': 'Valve Pressure Test Range',
      'stats.pressure_desc': 'Hydrostatic test bench compliant with API 527/598',

      // 7 Core Services Section
      'services.subtitle': 'COMPREHENSIVE SERVICES',
      'services.title': '7 CORE SERVICE DOMAINS OF VNIT',
      'services.desc': 'Integrated technical services complying with international standards, fulfilling the most rigorous demands of energy and heavy industrial projects.',
      'services.s1.title': 'Calibration, Verification & Instrumentation Testing',
      'services.s1.desc': 'Calibration of pressure, temperature, flow, level, gas analytics, electrical/electronic devices at VILAS 1288 accredited labs and onsite.',
      'services.s2.title': 'Fabrication & Installation of E&I and Telecom Systems',
      'services.s2.desc': 'Power and signal cable pulling, cable trays, control panel fabrication (LCP, Marshalling), field instrument installation, and industrial telecom.',
      'services.s3.title': 'Engineering - Procurement - Construction (EPC/EPIC)',
      'services.s3.desc': 'Turnkey EPC contractor for electrical, instrumentation & control systems (ICSS/SCADA/DCS/ESD/F&G) for oil & gas and industrial plants.',
      'services.s4.title': 'Maintenance, Repair & Valve Testing (up to 15,000 PSI)',
      'services.s4.desc': 'Overhaul, flange refacing, seat lapping, calibration, and hydrostatic pressure testing for Safety Relief Valves (PSV), Control Valves, and Shut-off Valves up to 15,000 PSI per API 527/598.',
      'services.s5.title': 'Precision Mechanical Maintenance & Laser Alignment',
      'services.s5.desc': 'Laser Shaft Alignment, vibration analysis for rotating machinery diagnostics, complete overhaul of centrifugal pumps, compressors, and industrial turbines.',
      'services.s6.title': 'Maintenance & Upgrade of Electrical & Automation Systems',
      'services.s6.desc': 'Overhaul of MV/LV switchgear, protection relay testing, PLC/SCADA/DCS programming upgrades, and scheduled plant electrical maintenance.',
      'services.s7.title': 'Equipment Trading & Rental Services',
      'services.s7.desc': 'Genuine spare parts supply for E&I and valve systems; high-precision calibration equipment rental (Fluke, Beamex, Druck), high-pressure air compressors, and load banks.',
      'services.link': 'Service Details',

      // Capabilities Section
      'cap.subtitle': 'ACCREDITED CAPABILITIES',
      'cap.title': 'CAPABILITY PROFILE & INTERNATIONAL ACCREDITATIONS',
      'cap.c1.title': 'Certifications',
      'cap.c2.title': 'Human Capital',
      'cap.c3.title': 'Equipment & Standards',
      'cap.c4.title': 'Facilities & Infrastructure',
      'cap.btn': 'View Full Certifications & Capability Profile',

      // Featured Projects Section
      'proj.subtitle': 'TRACK RECORD',
      'proj.title': 'FEATURED PROJECTS',
      'proj.tag_offshore': 'Offshore Oil & Gas',
      'proj.tag_refinery': 'Petrochemical & Refinery',
      'proj.tag_energy': 'Energy & Industrial',
      'proj.client': 'Client:',
      'proj.location': 'Location:',
      'proj.scope': 'Scope:',
      'proj.btn': 'View Details',

      // Clients & Partners Section
      'partners.subtitle': 'SUSTAINABLE PARTNERSHIPS',
      'partners.title': 'STRATEGIC CLIENTS & PARTNERS',

      // News Section
      'news.subtitle': 'NEWS & EVENTS',
      'news.title': 'VNIT TECHNICAL NEWS & EVENTS',
      'news.readmore': 'Read More',

      // Footer
      'footer.company_name': 'VIET NAM TECHNICAL SERVICES & INSPECTION COMPANY LIMITED (VNIT)',
      'footer.address': 'Lot D6/5, Quang Dung Street, Chi Linh Urban Center, Ward 10, Vung Tau City',
      'footer.quicklinks': 'Quick Links',
      'footer.services': 'Core Services',
      'footer.zalo_title': 'Technical Hotline & Zalo',
      'footer.zalo_desc': 'Scan QR code to connect directly with 24/7 duty engineers.',
      'footer.newsletter_title': 'Newsletter Subscription',
      'footer.newsletter_placeholder': 'Enter your email address...',
      'footer.send_btn': 'Send',
      'footer.license': 'VIET NAM TECHNICAL SERVICES & INSPECTION CO., LTD (VNIT) | Tax ID: 3502379813',
      'footer.copyright': 'Copyright 2026 © VNIT - cal-test.vn. All rights reserved.',

      // Common Sub-Page Breadcrumb
      'breadcrumb.home': 'Home',
      'breadcrumb.about': 'About Us',
      'breadcrumb.cap': 'Capabilities',
      'breadcrumb.services': 'Technical Services',
      'breadcrumb.projects': 'Featured Projects',
      'breadcrumb.news': 'News & Events',
      'breadcrumb.careers': 'Career Opportunities',
      'breadcrumb.contact': 'Contact & Technical Support',

      // Forms & Toasts
      'form.name': 'Full Name *',
      'form.phone': 'Phone Number *',
      'form.email': 'Business Email *',
      'form.service': 'Interested Service',
      'form.message': 'Technical RFQ Details / Message *',
      'form.submit': 'Submit Quotation Request',
      'form.close': 'Close',
      'toast.newsletter': 'Thank you! You have successfully subscribed to VNIT technical newsletter.',
      'toast.contact': 'Thank you! Your request has been sent to VNIT. We will respond within 24 hours.',
      'toast.apply': 'Your application has been received successfully. VNIT HR will be in touch shortly!'
    }
  };

  // Comprehensive phrase fallback map for full-page text translation
  const PHRASE_MAP = [
    // Subtitles & Headings
    ['DỊCH VỤ TOÀN DIỆN', 'COMPREHENSIVE SERVICES'],
    ['7 LĨNH VỰC DỊCH VỤ VNIT CUNG CẤP', '7 CORE SERVICE DOMAINS OF VNIT'],
    ['NĂNG LỰC ĐƯỢC CÔNG NHẬN', 'ACCREDITED CAPABILITIES'],
    ['HỒ SƠ NĂNG LỰC & CHỨNG NHẬN QUỐC TẾ', 'CAPABILITY PROFILE & INTERNATIONAL ACCREDITATIONS'],
    ['DỰ ÁN ĐÃ THỰC HIỆN', 'TRACK RECORD'],
    ['DỰ ÁN TIÊU BIỂU', 'FEATURED PROJECTS'],
    ['ĐỒNG HÀNH BỀN VỮNG', 'SUSTAINABLE PARTNERSHIPS'],
    ['KHÁCH HÀNG & ĐỐI TÁC CHIẾN LƯỢC', 'STRATEGIC CLIENTS & PARTNERS'],
    ['TIN TỨC HOẠT ĐỘNG', 'NEWS & EVENTS'],
    ['TIN TỨC & SỰ KIỆN KỸ THUẬT VNIT', 'VNIT TECHNICAL NEWS & EVENTS'],
    ['TỔNG QUAN DOANH NGHIỆP', 'COMPANY OVERVIEW'],
    ['CƠ HỘI NGHỀ NGHIỆP', 'CAREER OPPORTUNITIES'],
    ['LIÊN HỆ & HỖ TRỢ KỸ THUẬT', 'CONTACT & TECHNICAL SUPPORT'],
    ['HỆ THỐNG TRỤ SỞ & CHI NHÁNH', 'HEADQUARTERS & BRANCHES'],
    ['GỬI YÊU CẦU BÁO GIÁ & TƯ VẤN', 'REQUEST QUOTATION & CONSULTATION'],
    ['MÔI TRƯỜNG LÀM VIỆC TẠI VNIT', 'WORKING ENVIRONMENT AT VNIT'],
    ['PHÁT TRIỂN SỰ NGHIỆP BỀN VỮNG CÙNG VNIT', 'BUILD A SUSTAINABLE CAREER WITH VNIT'],
    ['VỊ TRÍ ĐANG TUYỂN DỤNG', 'OPEN VACANCIES'],
    ['CÁC VỊ TRÍ KỸ THUẬT & KINH DOANH MỞ ĐỢT NÀY', 'CURRENT TECHNICAL & COMMERCIAL OPENINGS'],
    ['BẢN ĐỒ VỊ TRÍ TRUNG TÂM KIỂM ĐỊNH VNIT TẠI TP. VŨNG TÀU', 'LOCATION MAP OF VNIT INSPECTION CENTER IN VUNG TAU CITY'],
    ['ĐỊNH HƯỚNG CHIẾN LƯỢC', 'STRATEGIC ORIENTATION'],
    ['TẦM NHÌN ĐẾN NĂM 2035', 'VISION TOWARDS 2035'],
    ['Mở rộng Quốc tế', 'International Expansion'],
    ['Chuyển đổi Số', 'Digital Transformation'],
    ['Đối với Khách hàng', 'Towards Clients'],
    ['Đối với Nhân sự', 'Towards Human Capital'],
    ['Đối với Xã hội', 'Towards Society'],
    ['TẤT CẢ DỰ ÁN', 'ALL PROJECTS'],
    ['TẤT CẢ BÀI VIẾT', 'ALL ARTICLES'],
    ['BẢN TIN HOẠT ĐỘNG & KỸ THUẬT', 'TECHNICAL & OPERATIONAL BULLETINS'],
    ['Dầu khí ngoài khơi', 'Offshore Oil & Gas'],
    ['Dầu khí Ngoài khơi & Giàn khoan', 'Offshore Oil & Gas Platforms'],
    ['Bảo dưỡng Van & Thử Áp lực cao', 'Valve Maintenance & High-Pressure Testing'],
    ['Điện, Đo lường & Máy quay', 'E&I, Measurement & Rotating Equipment'],
    ['Điện & Máy quay', 'Electrical & Rotating Machinery'],
    ['Thử nghiệm Áp lực', 'Pressure Testing'],
    ['Dịch vụ Van Công nghiệp', 'Industrial Valve Services'],
    ['Dịch vụ Van & Áp lực', 'Valves & Pressure Services'],
    ['Điện động lực', 'Power & Electrical Systems'],
    ['Phòng nổ ATEX / IECEx', 'Explosion-Proof ATEX / IECEx'],
    ['Đo lường VILAS 1288', 'VILAS 1288 Metrology'],
    ['Chuẩn BoA VILAS 1288', 'BoA VILAS 1288 Standard'],
    ['Lọc hóa dầu', 'Petrochemical & Refinery'],
    ['Lọc hóa dầu & Hóa chất', 'Refinery & Chemical Projects'],
    ['Năng lượng & Công nghiệp', 'Energy & Industrial Projects'],

    // Real VNIT Project Titles
    ['Kiểm định & Tái chứng nhận Thiết bị An toàn – Lô 01&02 PVN', 'Recertification & Maintenance Safety Equipment – PVN Blocks 01&02'],
    ['Kiểm định & Bảo dưỡng Thiết bị An toàn – Lô 01&02 PVN', 'Recertification & Maintenance Safety Equipment – PVN Blocks 01&02'],
    ['Kiểm định & Thử nghiệm Bình Áp lực – Thăng Long JOC', 'Inspection & Testing Pressurized Cylinder – Thang Long JOC'],
    ['Đại tu Alternator Máy phát khí GEG – Lô 01&02', 'Overhauling Alternator Of Gas Engine Generator (GEG) – PVN Blocks 01&02'],
    ['Cung cấp Phụ tùng & Bảo dưỡng Van – Lô 01&02', 'Provision of Valve Spare Parts & Overhaul – PVN Blocks 01&02'],
    ['Bảo dưỡng, Đại tu Cụm Alternator – Lô 01&02 PVN', 'Maintenance-Overhaul Alternator – PVN Blocks 01&02'],
    ['Bảo dưỡng Động cơ Phòng nổ Ex-Motor – Lô 01&02', 'Maintenance Ex-Motor in Hazardous Area – PVN Blocks 01&02'],
    ['Hiệu chuẩn Thiết bị Đo lường & Công tắc – Lô 01&02', 'Calibration Transmitters & Switches – PVN Blocks 01&02'],
    ['Hiệu chuẩn & Sửa chữa Van An toàn (PSV) – Lô 01&02', 'Calibration & Repair Pressure Safety Valves (PSV) – PVN Blocks 01&02'],
    ['Kiểm định Lưu lượng Kỹ thuật số & Trạm Thử áp 15,000 PSI', 'Flow Meter Digital Calibration & 15,000 PSI Pressure Testing'],
    ['VNIT Hoàn Thành Xuất Sắc Chiến Dịch Kiểm Định & Đại Tu Thiết Bị Cho Mỏ Lô 01&02 Ngoài Khơi', 'VNIT Successfully Completes Safety Equipment Recertification & Overhaul for Offshore Blocks 01&02'],
    ['VNIT Ký kết Hợp đồng Cung cấp Dịch vụ Kiểm định & Thử nghiệm Bình Áp lực cùng Thăng Long JOC', 'VNIT Signs Contract for Pressurized Cylinder Inspection & Hydrostatic Testing with Thang Long JOC'],
    ['Đóng cửa sổ', 'Close Window'],
    ['Thời gian:', 'Period / Year:'],

    // Common labels & buttons
    ['Chi tiết dịch vụ', 'Service Details'],
    ['Xem chi tiết', 'View Details'],
    ['Đọc tiếp', 'Read More'],
    ['Khách hàng:', 'Client:'],
    ['Địa điểm:', 'Location:'],
    ['Phạm vi:', 'Scope:'],
    ['Năm thực hiện:', 'Year:'],
    ['Liên kết nhanh', 'Quick Links'],
    ['Dịch vụ chính', 'Core Services'],
    ['Đăng ký nhận tin', 'Newsletter Subscription'],
    ['Kết nối Zalo Kỹ thuật', 'Technical Hotline & Zalo'],
    ['Tìm kiếm', 'Search'],
    ['Trang chủ', 'Home'],
    ['Giới thiệu', 'About Us'],
    ['Năng lực', 'Capabilities'],
    ['Dịch vụ', 'Services'],
    ['Dự án', 'Projects'],
    ['Tin tức', 'News'],
    ['Tuyển dụng', 'Careers'],
    ['Liên hệ', 'Contact'],
    ['Giới thiệu chung', 'General Introduction'],
    ['Tầm nhìn', 'Vision'],
    ['Sứ mệnh', 'Mission'],
    ['Giá trị cốt lõi', 'Core Values'],
    ['Lịch sử hình thành và phát triển', 'History & Milestones'],
    ['Lịch sử hình thành & phát triển', 'History & Milestones'],
    ['Khách hàng và đối tác', 'Clients & Partners'],
    ['Khách hàng & Đối tác', 'Clients & Partners'],
    ['Chứng nhận', 'Certifications'],
    ['Nhân lực', 'Human Resources'],
    ['Trang thiết bị', 'Equipment'],
    ['Cơ sở hạ tầng', 'Infrastructure'],
    ['Ứng tuyển ngay', 'Apply Now'],
    ['Mô tả công việc', 'Job Description'],
    ['Yêu cầu công việc', 'Job Requirements'],
    ['Quyền lợi được hưởng', 'Benefits & Compensation'],
    ['Hạn nộp hồ sơ', 'Deadline'],
    ['Số lượng', 'Headcount'],
    ['Nơi làm việc', 'Work Location'],
    ['Mức lương:', 'Salary:'],
    ['Thỏa thuận theo năng lực', 'Competitive / Negotiable'],
    ['Đóng', 'Close'],
    ['Gửi Yêu Cầu Báo Giá', 'Submit RFQ Request'],
    ['Nộp hồ sơ ứng tuyển', 'Submit Application'],
    ['NỘP HỒ SƠ ỨNG TUYỂN TRỰC TUYẾN', 'ONLINE JOB APPLICATION'],
    ['THÔNG TIN DỰ ÁN CHI TIẾT', 'DETAILED PROJECT SPECIFICATIONS'],
    ['CHỨNG NHẬN & GIẤY PHÉP HOẠT ĐỘNG', 'ACCREDITATIONS & OPERATION LICENSES'],
    ['ĐỘI NGŨ KỸ SƯ & CHUYÊN GIA KỸ THUẬT', 'TEAM OF ENGINEERS & TECHNICAL EXPERTS'],
    ['HỆ THỐNG THIẾT BỊ ĐO LƯỜNG & CHUẨN HIỆU CHUẨN', 'CALIBRATION STANDARDS & MEASURING EQUIPMENT'],
    ['CƠ SỞ HẠ TẦNG PHÒNG THÍ NGHIỆM & XƯỞNG DỊCH VỤ', 'LABORATORY FACILITIES & SERVICE WORKSHOPS']
  ];

  function getPageFilename() {
    let path = window.location.pathname;
    let parts = path.split('/');
    let file = parts[parts.length - 1];
    if (!file || file === '' || file === 'en') return 'index.html';
    return file;
  }

  function getCurrentLang() {
    const urlParams = new URLSearchParams(window.location.search);
    const paramLang = urlParams.get('lang');
    if (paramLang === 'en' || paramLang === 'vi') {
      return paramLang;
    }
    if (window.location.pathname.startsWith('/en')) {
      return 'en';
    }
    const saved = localStorage.getItem('vnit_lang');
    if (saved === 'en' || saved === 'vi') {
      return saved;
    }
    return 'vi';
  }

  function updateSwitcherUI(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      if (btn.getAttribute('data-lang-btn') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function updatePageTitle(lang) {
    const filename = getPageFilename();
    if (PAGE_TITLES[lang] && PAGE_TITLES[lang][filename]) {
      document.title = PAGE_TITLES[lang][filename];
    }
  }

  function setLanguage(lang) {
    if (lang !== 'vi' && lang !== 'en') lang = 'vi';

    localStorage.setItem('vnit_lang', lang);
    document.documentElement.lang = lang;
    updateSwitcherUI(lang);
    updatePageTitle(lang);

    // Update URL query parameter without full reload
    const url = new URL(window.location.href);
    if (lang === 'en') {
      url.searchParams.set('lang', 'en');
    } else {
      url.searchParams.delete('lang');
    }
    window.history.replaceState({}, '', url.toString());

    // 1. Explicit data-i18n attributes
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (DICTIONARY[lang] && DICTIONARY[lang][key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.value = DICTIONARY[lang][key];
        } else {
          el.innerHTML = DICTIONARY[lang][key];
        }
      }
    });

    // 2. data-i18n-placeholder attributes
    const placeholderEls = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderEls.forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (DICTIONARY[lang] && DICTIONARY[lang][key]) {
        el.setAttribute('placeholder', DICTIONARY[lang][key]);
      }
    });

    // 3. Fallback phrase replacement across text nodes
    translatePhrases(lang === 'en');

    // 4. Update search input placeholder
    const searchInputs = document.querySelectorAll('.search-inner input, .header-actions input');
    searchInputs.forEach(inp => {
      inp.placeholder = lang === 'en'
        ? 'Search services, projects, capabilities...'
        : 'Nhập từ khóa tìm kiếm dịch vụ, dự án, năng lực VNIT...';
    });

    // Dispatch custom event
    document.dispatchEvent(new CustomEvent('vnit:languageChanged', { detail: { lang } }));
  }

  function translatePhrases(toEnglish) {
    // 1. TextNode TreeWalker for fast, non-destructive, full-page phrase translation
    if (document.body && typeof document.createTreeWalker === 'function') {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: function (node) {
            if (!node.nodeValue || !node.nodeValue.trim()) {
              return NodeFilter.FILTER_REJECT;
            }
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            const tag = parent.tagName;
            if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'SVG' || tag === 'TEXTAREA') {
              return NodeFilter.FILTER_REJECT;
            }
            if (parent.closest('.home-link') || parent.closest('.lang-switch-box') || parent.closest('[data-no-i18n]') || parent.closest('[data-i18n]')) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      const textNodes = [];
      while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
      }

      textNodes.forEach(node => {
        const trimmed = node.nodeValue.trim();
        for (let i = 0; i < PHRASE_MAP.length; i++) {
          const [viPhrase, enPhrase] = PHRASE_MAP[i];
          const source = toEnglish ? viPhrase : enPhrase;
          const target = toEnglish ? enPhrase : viPhrase;

          if (trimmed === source) {
            node.nodeValue = node.nodeValue.replace(source, target);
            break;
          }
        }
      });
    }

    // 2. Element level matching (for tags with icons or specific wrappers)
    PHRASE_MAP.forEach(([viPhrase, enPhrase]) => {
      const source = toEnglish ? viPhrase : enPhrase;
      const target = toEnglish ? enPhrase : viPhrase;

      const candidates = document.querySelectorAll('h1, h2, h3, h4, h5, h6, a, button, span, strong, p, .section-subtitle, .zone-title, .title-ft, .project-badge, .service-link, .cap-title');
      candidates.forEach(el => {
        if (el.hasAttribute('data-i18n') || el.closest('.home-link') || el.closest('.lang-switch-box') || el.hasAttribute('data-no-i18n')) return;

        // Leaf element
        if (el.children.length === 0) {
          if (el.textContent.trim() === source) {
            el.textContent = target;
          }
        } else if (el.children.length === 1 && (el.children[0].tagName === 'I' || el.children[0].tagName === 'IMG' || el.children[0].tagName === 'EM' || el.children[0].tagName === 'SVG')) {
          const icon = el.children[0];
          const textOnly = Array.from(el.childNodes)
            .filter(n => n.nodeType === Node.TEXT_NODE)
            .map(n => n.textContent.trim())
            .filter(Boolean)
            .join(' ');

          if (!textOnly) return;

          if (textOnly === source) {
            const iconHTML = icon.outerHTML;
            if (el.innerHTML.trim().startsWith(iconHTML)) {
              el.innerHTML = iconHTML + ' ' + target;
            } else {
              el.innerHTML = target + ' ' + iconHTML;
            }
          }
        }

        // Also update title attribute if it matches source
        if (el.getAttribute('title') === source) {
          el.setAttribute('title', target);
        }
      });
    });
  }

  function init() {
    const initialLang = getCurrentLang();
    setLanguage(initialLang);
  }

  // Global event delegation for language switches - attach immediately
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-lang-btn]');
    if (btn) {
      e.preventDefault();
      const targetLang = btn.getAttribute('data-lang-btn');
      setLanguage(targetLang);
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose public API
  window.vnitI18n = {
    setLanguage: setLanguage,
    getLanguage: getCurrentLang,
    dictionary: DICTIONARY
  };
})();
