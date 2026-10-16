// ============================================================
// FILE: src/data/initialData.js
// Dữ liệu mẫu ban đầu từ website VNIT để nạp lên Firestore
// ============================================================

export const initialServices = [
  {
    name_vi: "Kiểm định, hiệu chuẩn, thử nghiệm thiết bị đo lường - tự động",
    name_en: "Calibration, Inspection & Testing of Instrumentation - Automation",
    description_vi: "<p>Dịch vụ hiệu chuẩn phòng thí nghiệm đạt chuẩn <strong>VILAS ISO/IEC 17025:2017</strong> và On-site tại công trình. Đảm bảo độ chính xác tuyệt đối, phục vụ các hệ thống đo lường chuyển giao thương mại (Custody Transfer) và đo lường an toàn công nghệ.</p><ul><li>Hiệu chuẩn Áp suất dải đo đến 15,000 PSI</li><li>Hiệu chuẩn Nhiệt độ từ -100°C đến +650°C</li><li>Hiệu chuẩn Lưu lượng & Mức (Coriolis, Ultrasonic, Radar)</li><li>Hiệu chuẩn Thiết bị Phân tích khí cháy, O2, H2S</li></ul>",
    description_en: "<p>Laboratory and on-site calibration services certified under <strong>VILAS ISO/IEC 17025:2017</strong> for custody transfer and critical process measurement systems.</p>",
    imageUrl: "assets/images/IMG_5460-300x400.jpg"
  },
  {
    name_vi: "Thi công, chế tạo, lắp đặt hệ thống điện, đo lường & viễn thông",
    name_en: "E&I and Telecom Construction, Fabrication & Installation",
    description_vi: "<p>Cung cấp dịch vụ thi công trọn gói cho hệ thống điện động lực, điện chiếu sáng, thiết bị đo lường hiện trường và hạ tầng viễn thông trên các giàn khoan ngoài khơi, tàu chứa dầu FPSO và nhà máy lọc hóa dầu.</p><ul><li>Kéo rải cáp động lực, cáp điều khiển, cáp quang</li><li>Gia công thang máng cáp SS316L, mạ kẽm</li><li>Thiết kế, lắp ráp tủ điện LCP, Marshalling, PLC/SCADA chống cháy nổ</li><li>Lắp đặt Instrument Tubing và hệ thống viễn thông PAGA, CCTV</li></ul>",
    description_en: "<p>Full EPC/installation services for power, control, field instrumentation and telecom infrastructure on offshore platforms, FPSO and refineries.</p>",
    imageUrl: "assets/images/IMG_1052-411x400.jpg"
  },
  {
    name_vi: "Thiết kế - Mua sắm – Thi công (Tổng thầu EPC / EPCM)",
    name_en: "Engineering, Procurement, Construction (EPC / EPCM)",
    description_vi: "<p>Đảm nhận vai trò tổng thầu EPC cho các gói thầu nâng cấp giàn khoan, mở rộng hệ thống công nghệ, thay thế hệ thống điều khiển tự động hóa (DCS/PLC migration) cho các công trình dầu khí và năng lượng.</p>",
    description_en: "<p>Turnkey EPC contractor for platform revamping, automation migration and offshore topside modifications.</p>",
    imageUrl: "assets/images/banner-4-vnit-01.jpg"
  },
  {
    name_vi: "Bảo dưỡng, sửa chữa và thử nghiệm van công nghiệp đến 15,000 PSI",
    name_en: "Industrial Valve Maintenance, Overhaul & Testing Up to 15,000 PSI",
    description_vi: "<p>Xưởng bảo dưỡng van chuyên nghiệp: bảo dưỡng, rà phẳng mặt bích, thay thế seat/seal, thử kín và thử bền áp lực theo tiêu chuẩn API 598, API 527 cho các loại van cầu, van bi, van bướm và van an toàn PSV.</p>",
    description_en: "<p>Comprehensive valve overhaul, lapping and hydrostatic/pneumatic testing up to 15,000 PSI conforming to API 598 and API 527 standards.</p>",
    imageUrl: "assets/images/IMG_6701-300x400.jpg"
  },
  {
    name_vi: "Bảo dưỡng, sửa chữa thiết bị cơ khí công nghiệp & máy quay",
    name_en: "Mechanical Equipment & Rotating Machinery Overhaul",
    description_vi: "<p>Đại tu, sửa chữa máy bơm ly tâm, máy nén khí, tuabin khí và động cơ đốt trong. Cân chỉnh đồng tâm trục bằng máy laser chuyên dụng, đo và phân tích rung động cơ khí tiêu chuẩn ISO 10816.</p>",
    description_en: "<p>Overhaul and precision alignment for pumps, compressors, turbines with laser alignment and ISO 10816 vibration analysis.</p>",
    imageUrl: "assets/images/z5734006150820_779fb6aa77bf5a84fbbd12074e9febae-534x400.jpg"
  },
  {
    name_vi: "Bảo dưỡng, nâng cấp hệ thống điện & tự động hóa",
    name_en: "Electrical & Automation Upgrades and Maintenance",
    description_vi: "<p>Bảo dưỡng máy biến áp, máy cắt trung/hạ thế, tủ phân phối MCC. Thử nghiệm rơ-le bảo vệ kỹ thuật số, lập trình và nâng cấp hệ thống SCADA, PLC Siemens/Rockwell/Schneider.</p>",
    description_en: "<p>Substation, transformer and MCC maintenance. Protective relay testing and PLC/SCADA programming and upgrades.</p>",
    imageUrl: "assets/images/banner-3.jpg"
  },
  {
    name_vi: "Thương mại & cho thuê thiết bị kiểm định, hiệu chuẩn",
    name_en: "Trading & Rental of Calibration and Testing Equipment",
    description_vi: "<p>Cho thuê các thiết bị chuẩn đo lường hàng đầu thế giới: Bơm áp lực cao Beamex/Druck, lò tạo nhiệt Fluke, máy đo độ dày kim loại siêu âm, máy phân tích rung động và bộ kiểm tra rơ-le Omicron.</p>",
    description_en: "<p>Rental and supply of world-class primary calibration standards and NDT inspection instruments.</p>",
    imageUrl: "assets/images/IMG_5460-300x400.jpg"
  }
];

export const initialNews = [
  {
    title_vi: "VNIT Hoàn Thành Xuất Sắc Chiến Dịch Kiểm Định & Đại Tu Thiết Bị Cho Mỏ Lô 01&02 Ngoài Khơi",
    title_en: "VNIT Successfully Completes Offshore Inspection & Overhaul Campaign for Blocks 01&02",
    content_vi: "<p>Đội ngũ kỹ sư và chuyên viên kỹ thuật của VNIT đã phối hợp chặt chẽ cùng nhà điều hành, hoàn thành tái chứng nhận và thử nghiệm an toàn tuyệt đối toàn bộ hệ thống van PSV, cảm biến đo lường và thiết bị an toàn giàn khai thác Lô 01&02 ngoài khơi vượt tiến độ cam kết.</p>",
    content_en: "<p>VNIT engineering team has completed the recertification and testing of PSV valves and safety instrumentation on offshore platforms ahead of schedule.</p>",
    imageUrl: "assets/images/banner-4-vnit-01.jpg",
    isFeatured: true
  },
  {
    title_vi: "Mở rộng phạm vi công nhận VILAS ISO/IEC 17025 cho phép đo Lưu lượng & Áp lực cao",
    title_en: "Extension of VILAS ISO/IEC 17025 Scope for Flow and High Pressure Measurements",
    content_vi: "<p>Văn phòng Công nhận Chất lượng đã cấp chứng nhận bổ sung dải đo áp suất thủy lực đến 15,000 PSI và chuẩn đo lưu lượng khí chính xác cao cho phòng lab VNIT.</p>",
    content_en: "<p>Accreditation scope extended to 15,000 PSI hydraulic pressure and precision gas flow measurement standards.</p>",
    imageUrl: "assets/images/CHUNG-CHI-CONG-NHAN-CALTEST-568x800.jpg",
    isFeatured: true
  },
  {
    title_vi: "VNIT Ký kết Hợp đồng Cung cấp Dịch vụ Kiểm định & Thử nghiệm Bình Áp lực cùng Thăng Long JOC",
    title_en: "VNIT Signs Contract for Pressure Vessel Inspection & Testing with Thang Long JOC",
    content_vi: "<p>Thực hiện gói thầu kiểm định an toàn kỹ thuật định kỳ, đo độ dày kim loại NDT và thử bền thủy tĩnh cho hệ thống bình bồn áp lực cao trên các giàn khai thác ngoài khơi của Thăng Long JOC.</p>",
    content_en: "<p>Awarded periodic statutory inspection, NDT ultrasonic testing and hydrostatic testing contract for offshore pressurized vessels.</p>",
    imageUrl: "assets/images/IMG_6701-300x400.jpg",
    isFeatured: false
  },
  {
    title_vi: "Hội thảo quốc tế về công nghệ căn chỉnh laser và phân tích rung động cơ khí",
    title_en: "International Seminar on Laser Shaft Alignment and Vibration Analysis",
    content_vi: "<p>VNIT đồng tổ chức chuỗi hội thảo chuyên đề kỹ thuật nhằm chia sẻ các công nghệ chẩn đoán sớm sự cố máy quay cho các kỹ sư dầu khí tại Vũng Tàu.</p>",
    content_en: "<p>VNIT co-organized technical seminar sharing predictive maintenance technologies for rotating equipment in Vung Tau.</p>",
    imageUrl: "assets/images/z5734006150820_779fb6aa77bf5a84fbbd12074e9febae-534x400.jpg",
    isFeatured: false
  }
];

export const initialProjects = [
  {
    name_vi: "Kiểm định & Tái chứng nhận Thiết bị An toàn – Lô 01&02 PVN",
    name_en: "Recertification & Maintenance Safety Equipment – PVN Blocks 01&02",
    client: "Petrovietnam (PVN) / Lô 01&02",
    description_vi: "<p><strong>Địa điểm:</strong> Mỏ Lô 01&02 ngoài khơi Việt Nam<br><strong>Phạm vi:</strong> Tái kiểm định, hiệu chuẩn van PSV, hệ thống cảm biến đo lường và thiết bị an toàn giàn khai thác.</p>",
    description_en: "<p>Recertification and testing of PSV valves, transmitters and safety devices on offshore production platform.</p>",
    imageUrl: "assets/images/IMG_1052-411x400.jpg"
  },
  {
    name_vi: "Kiểm định & Thử nghiệm Bình Áp lực – Thăng Long JOC",
    name_en: "Inspection & Testing Pressurized Cylinder – Thang Long JOC",
    client: "Thăng Long Joint Operating Co. (Thăng Long JOC)",
    description_vi: "<p><strong>Địa điểm:</strong> Giàn Hải Sư Đen / Hải Sư Trắng, Bể Cửu Long<br><strong>Phạm vi:</strong> Kiểm tra không phá hủy NDT, đo độ dày siêu âm, thử áp lực thủy tĩnh và cấp chứng chỉ an toàn.</p>",
    description_en: "<p>NDT inspection, ultrasonic thickness gauging and hydrostatic testing for high pressure cylinders.</p>",
    imageUrl: "assets/images/IMG_6701-300x400.jpg"
  },
  {
    name_vi: "Đại tu Alternator Máy phát khí GEG – Lô 01&02",
    name_en: "Overhauling Alternator Of Gas Engine Generator (GEG) – Blocks 01&02",
    client: "Petrovietnam (PVN) / Lô 01&02",
    description_vi: "<p><strong>Địa điểm:</strong> Giàn công nghệ mỏ Lô 01&02 ngoài khơi<br><strong>Phạm vi:</strong> Đại tu Alternator của máy phát điện động cơ khí GEG và cân chỉnh đồng tâm trục laser.</p>",
    description_en: "<p>Full overhaul of alternator for gas engine generator and precision laser shaft alignment.</p>",
    imageUrl: "assets/images/IMG_5460-300x400.jpg"
  },
  {
    name_vi: "Bảo dưỡng & Hiệu chuẩn Hệ thống Đo đếm Khí Thương mại FPSO",
    name_en: "Maintenance & Calibration of Gas Metering System on FPSO",
    client: "PTSC Offshore / Idemitsu",
    description_vi: "<p><strong>Địa điểm:</strong> Tàu chứa dầu FPSO Sao Vàng - Đại Nguyệt<br><strong>Phạm vi:</strong> Hiệu chuẩn định kỳ hệ thống đo đếm khí Fiscal Metering, cảm biến nhiệt độ áp suất và máy tính lưu lượng Flow Computer.</p>",
    description_en: "<p>Periodic fiscal gas metering system calibration and flow computer verification on FPSO.</p>",
    imageUrl: "assets/images/banner-4-vnit-01.jpg"
  }
];

export const initialSettings = {
  companyName_vi: "Công ty TNHH Kiểm định và Dịch vụ Kỹ thuật Việt Nam (VNIT)",
  companyName_en: "Vietnam Inspection & Technical Services Co., Ltd (VNIT)",
  hotline: "0977.2323.46",
  email: "info@cal-test.vn",
  address_vi: "Số 123 Đường 30/4, Phường Thắng Nhất, TP. Vũng Tàu, Bà Rịa - Vũng Tàu",
  address_en: "123 30/4 Street, Thang Nhat Ward, Vung Tau City, Vietnam"
};
