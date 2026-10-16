// ============================================================
// FILE: src/pages/LiveEditorPage.jsx
// Chỉnh sửa Trực quan Website - Live Visual Builder & Preview
// ============================================================

import { useState, useEffect } from 'react';
import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  Laptop, Smartphone, Tablet, Save, Eye, Edit3, Check, RotateCcw,
  Sparkles, ExternalLink, X, Image as ImageIcon, ChevronRight,
  Flame, Award, Phone, Mail, Building, Layers
} from 'lucide-react';
import {
  initialServices, initialNews, initialProjects, initialSettings
} from '../data/initialData';
import ImageUploader from '../components/ui/ImageUploader';

export default function LiveEditorPage() {
  const [device, setDevice] = useState('desktop'); // desktop, tablet, mobile
  const [activeSection, setActiveSection] = useState(null); // id of section being edited
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  // Editable Website State
  const [settings, setSettings] = useState(initialSettings);
  const [heroSlide, setHeroSlide] = useState({
    title_vi: "KIỂM ĐỊNH, HIỆU CHUẨN ĐO LƯỜNG VÀ DỊCH VỤ KỸ THUẬT CÔNG NGHIỆP",
    title_en: "CALIBRATION, MEASUREMENT INSPECTION & INDUSTRIAL TECHNICAL SERVICES",
    badge_vi: "VILAS 1288 (ISO/IEC 17025) & ISO 9001:2015",
    badge_en: "VILAS 1288 (ISO/IEC 17025) & ISO 9001:2015 ACCREDITED",
    btn1_vi: "Khám phá 7 Dịch vụ",
    btn2_vi: "Yêu cầu Báo giá",
    imageUrl: "assets/images/banner-4-vnit-01.jpg"
  });

  const [tickerText, setTickerText] = useState({
    date: "15/10/2026",
    title_vi: "VNIT hoàn thành xuất sắc chiến dịch kiểm định & bảo dưỡng an toàn mỏ Lô 01&02 ngoài khơi",
    title_en: "VNIT successfully completes offshore inspection and safety maintenance for Blocks 01&02"
  });

  const [stats, setStats] = useState([
    { num: "10+", label_vi: "Năm Phát Triển Bền Vững", label_en: "Years of Sustainable Development", desc_vi: "Khẳng định thương hiệu cal-test.vn từ 2018" },
    { num: "1,000+", label_vi: "Dự Án Đã Thực Hiện", label_en: "Completed Projects", desc_vi: "Tại các giàn khoan và nhà máy công nghiệp" },
    { num: "100%", label_vi: "Chuẩn BoA VILAS 1288 & ISO 9001", label_en: "VILAS 1288 & ISO 9001 Standard", desc_vi: "Được Bộ Khoa Học & Công Nghệ chỉ định ĐK 426" },
    { num: "15,000 PSI", label_vi: "Dải Áp Lực Thử Nghiệm Van", label_en: "Valve Testing Pressure Range", desc_vi: "Trạm thử áp lực thủy tĩnh theo chuẩn API 527/598" },
  ]);

  const [services, setServices] = useState(initialServices);
  const [projects, setProjects] = useState(initialProjects);
  const [news, setNews] = useState(initialNews);
  const [lang, setLang] = useState('vi'); // vi or en preview

  // Load live data from Firestore
  useEffect(() => {
    // 1. Settings & Homepage
    const unsubSettings = onSnapshot(doc(db, 'settings', 'general'), (snap) => {
      if (snap.exists()) setSettings(prev => ({ ...prev, ...snap.data() }));
    });

    const unsubHome = onSnapshot(doc(db, 'settings', 'homepage'), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.heroSlide) setHeroSlide(data.heroSlide);
        if (data.tickerText) setTickerText(data.tickerText);
        if (data.stats) setStats(data.stats);
      }
    });

    // 2. Services
    const unsubServices = onSnapshot(collection(db, 'services'), (snap) => {
      if (!snap.empty) {
        setServices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    });

    // 3. Projects
    const unsubProjects = onSnapshot(collection(db, 'projects'), (snap) => {
      if (!snap.empty) {
        setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    });

    // 4. News
    const unsubNews = onSnapshot(collection(db, 'news'), (snap) => {
      if (!snap.empty) {
        setNews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    });

    return () => {
      unsubSettings();
      unsubHome();
      unsubServices();
      unsubProjects();
      unsubNews();
    };
  }, []);

  // Save changes to Firebase
  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // 1. Save Settings
      await setDoc(doc(db, 'settings', 'general'), settings, { merge: true });

      // 2. Save Homepage (hero, ticker, stats)
      await setDoc(doc(db, 'settings', 'homepage'), {
        heroSlide,
        tickerText,
        stats
      }, { merge: true });

      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 4000);
    } catch (err) {
      alert('Lỗi lưu thay đổi: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Device width classes
  const containerWidthClass = {
    desktop: 'w-full max-w-[1240px]',
    tablet: 'w-[768px] max-w-full',
    mobile: 'w-[375px] max-w-full'
  }[device];

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 -m-4 lg:-m-6">
      {/* Top Visual Editor Toolbar */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Sparkles size={18} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              Trình Chỉnh Sửa Trực Quan (Live Preview CMS)
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded border border-emerald-500/30">
                Interactive WYSIWYG
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Rê chuột và bấm trực tiếp vào bất kỳ mục nào trên giao diện website để sửa nhanh
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="bg-slate-800 p-1 rounded-lg flex items-center gap-1 border border-slate-700">
            <button
              onClick={() => setLang('vi')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${lang === 'vi' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              🇻🇳 Tiếng Việt
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${lang === 'en' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              🇬🇧 English
            </button>
          </div>

          {/* Device Responsive Switcher */}
          <div className="hidden sm:flex bg-slate-800 p-1 rounded-lg items-center gap-1 border border-slate-700">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded transition-all ${device === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Xem giao diện Desktop"
            >
              <Laptop size={16} />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-1.5 rounded transition-all ${device === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Xem giao diện Tablet (768px)"
            >
              <Tablet size={16} />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded transition-all ${device === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Xem giao diện Mobile (375px)"
            >
              <Smartphone size={16} />
            </button>
          </div>

          {/* Public Website Link */}
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-all"
            title="Mở website thật ở tab mới"
          >
            <ExternalLink size={14} />
            <span className="hidden md:inline">Mở Web thật (cổng 3000)</span>
          </a>

          {/* Save Button */}
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow transition-all cursor-pointer"
          >
            {saving ? (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={14} />
            )}
            <span>{saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
          </button>
        </div>
      </div>

      {/* Save Success Alert Banner */}
      {savedNotice && (
        <div className="bg-emerald-600 text-white text-xs font-medium px-4 py-2 flex items-center justify-between shadow-lg sticky top-[53px] z-30">
          <div className="flex items-center gap-2">
            <Check size={16} />
            <span>Đã lưu thành công lên Firebase! Toàn bộ thay đổi đã được ghi nhận.</span>
          </div>
          <button onClick={() => setSavedNotice(false)}><X size={14} /></button>
        </div>
      )}

      {/* Main Workspace: Website Preview Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-slate-950/80">
        <div className={`transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden border border-slate-800 bg-white text-slate-800 ${containerWidthClass}`}>

          {/* ================= 1. HEADER PREVIEW ================= */}
          <div
            onClick={() => setActiveSection('header')}
            className="relative group border-b border-slate-200 bg-white cursor-pointer hover:ring-4 hover:ring-blue-500/50 transition-all"
          >
            <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow flex items-center gap-1.5">
              <Edit3 size={13} /> Sửa Hotline / Email / Logo
            </div>

            {/* Top Bar */}
            <div className="bg-slate-50 border-b border-slate-100 px-4 py-2 flex flex-wrap items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-blue-900 font-medium">
                  <Phone size={13} className="text-amber-500" /> Hotline: <strong className="text-blue-950 font-bold">{settings.hotline || '0977.2323.46'}</strong>
                </span>
                <span className="hidden sm:flex items-center gap-1.5 text-slate-600">
                  <Mail size={13} className="text-amber-500" /> Email: <strong>{settings.email || 'info@cal-test.vn'}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-100/70 text-blue-900 px-2 py-0.5 rounded text-[11px] font-semibold border border-blue-200">
                  🏆 VILAS 1288 (ISO 17025)
                </span>
              </div>
            </div>

            {/* Main Nav Header */}
            <div className="px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-900 flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
                  V
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-blue-950 leading-none tracking-tight">VNIT</h3>
                  <p className="text-[10px] text-amber-600 font-bold tracking-wider mt-0.5 uppercase">
                    {lang === 'vi' ? 'Kiểm định & Dịch vụ kỹ thuật' : 'Inspection & Technical Services'}
                  </p>
                </div>
              </div>

              {/* Fake Navigation items */}
              <div className="hidden lg:flex items-center gap-5 text-xs font-bold text-slate-700 uppercase tracking-wide">
                <span className="text-blue-600 border-b-2 border-blue-600 pb-0.5">Trang chủ</span>
                <span>Giới thiệu</span>
                <span>Năng lực</span>
                <span>Dịch vụ</span>
                <span>Dự án</span>
                <span>Tin tức</span>
                <span>Liên hệ</span>
              </div>
            </div>
          </div>

          {/* ================= 2. HERO SLIDER PREVIEW ================= */}
          <div
            onClick={() => setActiveSection('hero')}
            className="relative group min-h-[380px] md:min-h-[460px] bg-slate-900 flex items-center cursor-pointer hover:ring-4 hover:ring-amber-500/50 transition-all overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(11, 45, 100, 0.92) 0%, rgba(11, 45, 100, 0.6) 100%), url(${heroSlide.imageUrl || 'assets/images/banner-4-vnit-01.jpg'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-amber-500 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-1.5">
              <Edit3 size={13} /> Sửa Banner Hero Slider & Ảnh nền
            </div>

            <div className="p-6 md:p-12 max-w-2xl text-white">
              <span className="inline-block bg-amber-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded mb-3 uppercase tracking-wider shadow">
                {lang === 'vi' ? heroSlide.badge_vi : heroSlide.badge_en}
              </span>
              <h1 className="text-2xl md:text-4xl font-black text-white leading-tight mb-4 tracking-tight drop-shadow-md">
                {lang === 'vi' ? heroSlide.title_vi : heroSlide.title_en}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase rounded shadow-lg flex items-center gap-2">
                  {heroSlide.btn1_vi} <ChevronRight size={14} />
                </button>
                <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase rounded border border-white/30 backdrop-blur-sm">
                  {heroSlide.btn2_vi}
                </button>
              </div>
            </div>
          </div>

          {/* ================= 3. NEWS TICKER PREVIEW ================= */}
          <div
            onClick={() => setActiveSection('ticker')}
            className="relative group bg-amber-500 text-slate-950 px-4 py-2.5 flex items-center gap-3 cursor-pointer hover:ring-4 hover:ring-amber-300 transition-all text-xs font-semibold shadow-inner"
          >
            <div className="absolute top-1 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
              <Edit3 size={11} /> Sửa Dòng Tin Nổi Bật
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950 text-amber-400 px-2.5 py-1 rounded text-[11px] font-black uppercase tracking-wider flex-shrink-0">
              <Flame size={13} className="text-amber-400 fill-amber-400" /> Tin Nổi Bật
            </div>
            <span className="bg-white/40 px-2 py-0.5 rounded text-[11px] font-bold text-slate-900 flex-shrink-0">
              {tickerText.date}
            </span>
            <p className="truncate font-medium text-slate-950">
              {lang === 'vi' ? tickerText.title_vi : tickerText.title_en}
            </p>
          </div>

          {/* ================= 4. OVERVIEW SECTION PREVIEW ================= */}
          <div
            onClick={() => setActiveSection('overview')}
            className="relative group p-6 md:p-10 text-center bg-white cursor-pointer hover:ring-4 hover:ring-blue-500/50 transition-all"
          >
            <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded shadow flex items-center gap-1.5">
              <Edit3 size={13} /> Sửa Giới thiệu công ty
            </div>

            <span className="text-amber-600 font-extrabold text-xs uppercase tracking-widest">
              {lang === 'vi' ? 'Tổng quan doanh nghiệp' : 'Company Overview'}
            </span>
            <h2 className="text-xl md:text-2xl font-black text-blue-950 uppercase mt-1 mb-3">
              {lang === 'vi' ? (settings.companyName_vi || 'CÔNG TY TNHH KIỂM ĐỊNH VÀ DỊCH VỤ KỸ THUẬT VIỆT NAM (VNIT)') : settings.companyName_en}
            </h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto mb-4 rounded-full"></div>
            <p className="text-slate-600 text-sm max-w-3xl mx-auto leading-relaxed">
              {lang === 'vi'
                ? `Được thành lập với bề dày kinh nghiệm và hệ thống quản trị chất lượng đạt chuẩn VILAS 1288 (ISO/IEC 17025) và ISO 9001:2015. VNIT chuyên sâu trong lĩnh vực hiệu chuẩn đo lường, bảo dưỡng van đến 15,000 PSI và tổng thầu EPC cho các công trình dầu khí, lọc hóa dầu và công nghiệp trọng điểm.`
                : `Accredited under VILAS 1288 (ISO/IEC 17025) and ISO 9001:2015, VNIT is a leading engineering contractor providing calibration, valve overhaul up to 15,000 PSI, and EPC solutions.`
              }
            </p>
          </div>

          {/* ================= 5. KEY STATS (4 SỐ LIỆU) PREVIEW ================= */}
          <div
            onClick={() => setActiveSection('stats')}
            className="relative group bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 text-white p-6 md:p-8 cursor-pointer hover:ring-4 hover:ring-blue-400 transition-all"
          >
            <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-amber-500 text-slate-950 text-xs font-bold px-2.5 py-1 rounded shadow flex items-center gap-1.5">
              <Edit3 size={13} /> Sửa 4 Khối Số Liệu & Thành Tích
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {stats.map((s, idx) => (
                <div key={idx} className="p-3 border-r last:border-r-0 border-white/10">
                  <div className="text-2xl md:text-3xl font-black text-amber-400 tracking-tight">{s.num}</div>
                  <div className="text-xs font-bold uppercase mt-1 text-white">{lang === 'vi' ? s.label_vi : s.label_en}</div>
                  <div className="text-[11px] text-blue-200 mt-1">{s.desc_vi}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= 6. 7 CORE SERVICES PREVIEW ================= */}
          <div
            onClick={() => setActiveSection('services')}
            className="relative group p-6 md:p-10 bg-slate-50 cursor-pointer hover:ring-4 hover:ring-blue-500/50 transition-all"
          >
            <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded shadow flex items-center gap-1.5">
              <Edit3 size={13} /> Quản lý Dịch vụ (Đang có {services.length} dịch vụ)
            </div>

            <div className="text-center mb-8">
              <span className="text-amber-600 font-extrabold text-xs uppercase tracking-widest">
                {lang === 'vi' ? 'Dịch vụ toàn diện' : 'Core Services'}
              </span>
              <h2 className="text-xl md:text-2xl font-black text-blue-950 uppercase mt-1">
                {lang === 'vi' ? `${services.length} LĨNH VỰC DỊCH VỤ VNIT CUNG CẤP` : `${services.length} CORE TECHNICAL SERVICES`}
              </h2>
              <div className="w-16 h-1 bg-amber-500 mx-auto mt-2 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {services.slice(0, 6).map((s, idx) => (
                <div key={s.id || idx} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-black flex items-center justify-center text-xs mb-3">
                    0{idx + 1}
                  </div>
                  <h3 className="font-bold text-sm text-blue-950 line-clamp-2 mb-2">
                    {lang === 'vi' ? s.name_vi : (s.name_en || s.name_vi)}
                  </h3>
                  <div
                    className="text-xs text-slate-500 line-clamp-3 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: lang === 'vi' ? s.description_vi : (s.description_en || s.description_vi) }}
                  />
                </div>
              ))}
            </div>
            {services.length > 6 && (
              <p className="text-center text-xs text-slate-400 mt-4 italic">+ và {services.length - 6} dịch vụ khác...</p>
            )}
          </div>

          {/* ================= 7. FEATURED PROJECTS PREVIEW ================= */}
          <div
            onClick={() => setActiveSection('projects')}
            className="relative group p-6 md:p-10 bg-white cursor-pointer hover:ring-4 hover:ring-emerald-500/50 transition-all border-t border-slate-100"
          >
            <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded shadow flex items-center gap-1.5">
              <Edit3 size={13} /> Quản lý Dự án Tiêu biểu ({projects.length} dự án)
            </div>

            <div className="text-center mb-8">
              <span className="text-emerald-600 font-extrabold text-xs uppercase tracking-widest">
                {lang === 'vi' ? 'Năng lực thực hiện' : 'Featured Projects'}
              </span>
              <h2 className="text-xl md:text-2xl font-black text-blue-950 uppercase mt-1">
                {lang === 'vi' ? 'DỰ ÁN TIÊU BIỂU DẦU KHÍ & NĂNG LƯỢNG' : 'KEY OIL & GAS PROJECTS'}
              </h2>
              <div className="w-16 h-1 bg-emerald-500 mx-auto mt-2 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {projects.slice(0, 3).map((p, idx) => (
                <div key={p.id || idx} className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                  <div className="h-40 bg-slate-100 overflow-hidden relative">
                    <img
                      src={p.imageUrl || 'assets/images/IMG_1052-411x400.jpg'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-blue-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {p.client || 'Dự án Ngoài khơi'}
                    </span>
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="font-bold text-sm text-blue-950 line-clamp-1 mb-1">
                      {lang === 'vi' ? p.name_vi : (p.name_en || p.name_vi)}
                    </h3>
                    <p className="text-xs text-slate-500">Chủ đầu tư: <strong className="text-slate-700">{p.client || 'PVN'}</strong></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= 8. FOOTER PREVIEW ================= */}
          <div
            onClick={() => setActiveSection('footer')}
            className="relative group bg-slate-900 text-white p-6 md:p-8 cursor-pointer hover:ring-4 hover:ring-amber-500/50 transition-all border-t border-slate-800"
          >
            <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-amber-500 text-slate-950 text-xs font-bold px-2.5 py-1 rounded shadow flex items-center gap-1.5">
              <Edit3 size={13} /> Sửa Thông Tin Footer & Địa chỉ
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-400">
              <div>
                <h4 className="text-white font-black text-sm uppercase mb-2">
                  {lang === 'vi' ? settings.companyName_vi : settings.companyName_en}
                </h4>
                <p className="leading-relaxed mb-2">
                  📍 Địa chỉ: {lang === 'vi' ? settings.address_vi : settings.address_en}
                </p>
                <p>📞 Hotline: <strong className="text-amber-400 font-bold">{settings.hotline}</strong></p>
                <p>✉️ Email: <strong className="text-white font-medium">{settings.email}</strong></p>
              </div>
              <div className="flex flex-col justify-end text-slate-500 text-[11px]">
                <p>© 2026 {settings.companyName_vi}. All Rights Reserved.</p>
                <p className="mt-1 text-slate-600">Hệ thống đồng bộ dữ liệu thời gian thực CMS.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================= RIGHT DRAWER / MODAL FOR SECTION EDITING ================= */}
      {activeSection && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[460px] bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
          {/* Drawer Header */}
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Edit3 size={16} className="text-blue-400" />
              <span>
                {activeSection === 'header' && 'Chỉnh sửa Header & Hotline'}
                {activeSection === 'hero' && 'Chỉnh sửa Hero Slider & Banner'}
                {activeSection === 'ticker' && 'Chỉnh sửa Tin Nổi Bật Ticker'}
                {activeSection === 'overview' && 'Chỉnh sửa Giới thiệu công ty'}
                {activeSection === 'stats' && 'Chỉnh sửa 4 Khối Số Liệu'}
                {activeSection === 'services' && 'Chỉnh sửa Dịch vụ'}
                {activeSection === 'projects' && 'Chỉnh sửa Dự án'}
                {activeSection === 'footer' && 'Chỉnh sửa Footer & Địa chỉ'}
              </span>
            </div>
            <button
              onClick={() => setActiveSection(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Drawer Body - Specific Form for each section */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">

            {/* SECTION 1: HEADER & FOOTER SETTINGS */}
            {(activeSection === 'header' || activeSection === 'footer') && (
              <>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Số Hotline công ty</label>
                  <input
                    type="text"
                    value={settings.hotline || ''}
                    onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email liên hệ</label>
                  <input
                    type="email"
                    value={settings.email || ''}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tên công ty (Tiếng Việt)</label>
                  <input
                    type="text"
                    value={settings.companyName_vi || ''}
                    onChange={(e) => setSettings({ ...settings, companyName_vi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Địa chỉ trụ sở (Tiếng Việt)</label>
                  <textarea
                    rows={2}
                    value={settings.address_vi || ''}
                    onChange={(e) => setSettings({ ...settings, address_vi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </>
            )}

            {/* SECTION 2: HERO SLIDER */}
            {activeSection === 'hero' && (
              <>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Huy hiệu trên tiêu đề (Tiếng Việt)</label>
                  <input
                    type="text"
                    value={heroSlide.badge_vi || ''}
                    onChange={(e) => setHeroSlide({ ...heroSlide, badge_vi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tiêu đề lớn Hero (Tiếng Việt)</label>
                  <textarea
                    rows={3}
                    value={heroSlide.title_vi || ''}
                    onChange={(e) => setHeroSlide({ ...heroSlide, title_vi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs outline-none focus:border-blue-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nút bấm 1</label>
                  <input
                    type="text"
                    value={heroSlide.btn1_vi || ''}
                    onChange={(e) => setHeroSlide({ ...heroSlide, btn1_vi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nút bấm 2</label>
                  <input
                    type="text"
                    value={heroSlide.btn2_vi || ''}
                    onChange={(e) => setHeroSlide({ ...heroSlide, btn2_vi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Ảnh nền Banner Hero</label>
                  <ImageUploader
                    value={heroSlide.imageUrl}
                    onChange={(url) => setHeroSlide({ ...heroSlide, imageUrl: url })}
                    folder="hero"
                  />
                </div>
              </>
            )}

            {/* SECTION 3: TICKER */}
            {activeSection === 'ticker' && (
              <>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Ngày đăng tin</label>
                  <input
                    type="text"
                    value={tickerText.date || ''}
                    onChange={(e) => setTickerText({ ...tickerText, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nội dung tin chạy (Tiếng Việt)</label>
                  <textarea
                    rows={3}
                    value={tickerText.title_vi || ''}
                    onChange={(e) => setTickerText({ ...tickerText, title_vi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </>
            )}

            {/* SECTION 4: 4 STATS */}
            {activeSection === 'stats' && (
              <div className="space-y-4">
                {stats.map((s, i) => (
                  <div key={i} className="p-3 bg-slate-800 rounded-lg border border-slate-700 space-y-2">
                    <span className="text-[10px] font-bold text-amber-400 uppercase">Khối số liệu {i + 1}</span>
                    <input
                      type="text"
                      value={s.num}
                      onChange={(e) => {
                        const newStats = [...stats];
                        newStats[i].num = e.target.value;
                        setStats(newStats);
                      }}
                      className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-amber-400 font-bold text-xs"
                      placeholder="Con số (vd: 15,000 PSI)"
                    />
                    <input
                      type="text"
                      value={s.label_vi}
                      onChange={(e) => {
                        const newStats = [...stats];
                        newStats[i].label_vi = e.target.value;
                        setStats(newStats);
                      }}
                      className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-white text-xs"
                      placeholder="Tiêu đề (vd: Năm phát triển)"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Quick Link to dedicated CRUD pages */}
            {(activeSection === 'services' || activeSection === 'projects') && (
              <div className="p-4 bg-blue-950/60 border border-blue-800/60 rounded-xl text-center space-y-3">
                <p className="text-slate-300 text-xs">
                  Mục này đã liên kết trực tiếp với cơ sở dữ liệu Firebase. Để thêm mới, chỉnh sửa chi tiết Rich Text và xoá từng bài, hãy dùng menu chuyên dụng:
                </p>
                {activeSection === 'services' && (
                  <a
                    href="/admin/services"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs shadow"
                  >
                    Mở Trang Quản Lý Dịch Vụ <ChevronRight size={14} />
                  </a>
                )}
                {activeSection === 'projects' && (
                  <a
                    href="/admin/projects"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs shadow"
                  >
                    Mở Trang Quản Lý Dự Án <ChevronRight size={14} />
                  </a>
                )}
              </div>
            )}

          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
            <button
              onClick={() => setActiveSection(null)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
            >
              Đóng lại
            </button>
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow"
            >
              <Save size={14} />
              {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
