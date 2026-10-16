// ============================================================
// FILE: src/components/drawer/AdminLeftToolbar.jsx
// Thanh Công Cụ / Popup Bên Trái Đa Năng Cho Admin CMS
// Tích hợp: Viết bài mới, Quản lý bài, Thư viện ảnh, Tìm kiếm thông minh,
// Quản lý Dịch vụ, Dự án, Cài đặt và Điều hướng trực quan
// ============================================================

import { useState, useEffect, useRef } from 'react';
import {
  Search, Plus, FileText, Image as ImageIcon, Wrench, Briefcase,
  Layers, Building2, PhoneCall, ChevronRight, X, Sparkles, Folder,
  ExternalLink, Eye, Check, Star, Settings, LayoutGrid, Clock,
  PanelLeftClose, PanelLeftOpen, ArrowRight, Compass
} from 'lucide-react';
import { CATEGORY_GROUPS, getCategoryById } from '../../data/categories';
import { initialServices, initialNews, initialProjects, initialSettings } from '../../data/initialData';
import { getAllMediaItems } from '../../data/mediaGallery';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function AdminLeftToolbar({
  isOpen,
  onToggle,
  onNavigatePage,
  onOpenArticleComposer,
  onOpenArticleManager,
  onOpenMediaLibrary,
  onOpenSettings,
  currentPage = 'index.html'
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState('all');
  const [newsItems, setNewsItems] = useState([]);
  const [serviceItems, setServiceItems] = useState([]);
  const [projectItems, setProjectItems] = useState([]);
  const searchInputRef = useRef(null);

  // Focus search input when drawer opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  // Lắng nghe dữ liệu realtime từ Firestore (hoặc fallback initialData)
  useEffect(() => {
    // 1. News
    const unsubNews = onSnapshot(
      query(collection(db, 'news'), orderBy('createdAt', 'desc')),
      (snap) => {
        if (!snap.empty) {
          setNewsItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } else {
          setNewsItems(initialNews.map((n, i) => ({ id: 'mock-news-' + i, ...n, categoryId: 'tin-hoat-dong' })));
        }
      },
      () => {
        setNewsItems(initialNews.map((n, i) => ({ id: 'mock-news-' + i, ...n, categoryId: 'tin-hoat-dong' })));
      }
    );

    // 2. Services
    const unsubServices = onSnapshot(
      collection(db, 'services'),
      (snap) => {
        if (!snap.empty) {
          setServiceItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } else {
          setServiceItems(initialServices.map((s, i) => ({ id: 'mock-serv-' + i, ...s })));
        }
      },
      () => {
        setServiceItems(initialServices.map((s, i) => ({ id: 'mock-serv-' + i, ...s })));
      }
    );

    // 3. Projects
    const unsubProjects = onSnapshot(
      collection(db, 'projects'),
      (snap) => {
        if (!snap.empty) {
          setProjectItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } else {
          setProjectItems(initialProjects.map((p, i) => ({ id: 'mock-proj-' + i, ...p })));
        }
      },
      () => {
        setProjectItems(initialProjects.map((p, i) => ({ id: 'mock-proj-' + i, ...p })));
      }
    );

    return () => {
      unsubNews();
      unsubServices();
      unsubProjects();
    };
  }, []);

  // Danh sách các trang chính của website
  // Danh sách 8 trang chính theo chuẩn WEBSITE VNIT NEW UPDATE
  const sitePages = [
    { file: 'index.html', title: '1. Trang Chủ', desc: 'Hero Slider, Khối thống kê, Đối tác chiến lược', icon: '🏠' },
    { file: 'gioi-thieu.html', title: '2. Giới Thiệu', desc: 'Giới thiệu chung, Tầm nhìn, Sứ mệnh, Lịch sử', icon: 'ℹ️' },
    { file: 'nang-luc.html', title: '3. Năng Lực', desc: 'Chứng nhận VILAS/ISO, Nhân lực, Thiết bị, Cơ sở hạ tầng', icon: '📜' },
    { file: 'dich-vu.html', title: '4. Dịch Vụ', desc: '7 dịch vụ kỹ thuật cốt lõi chuẩn sơ đồ', icon: '⚙️' },
    { file: 'du-an.html', title: '5. Dự Án', desc: 'Dự án tiêu biểu, Dầu khí ngoài khơi, Lọc hóa dầu', icon: '🏗️' },
    { file: 'tin-tuc.html', title: '6. Tin Tức', desc: 'Tin hoạt động, kỹ thuật dầu khí, hội thảo chuyên đề', icon: '📰' },
    { file: 'tuyen-dung.html', title: '7. Tuyển Dụng', desc: 'Kỹ sư ngoài khơi, Kỹ thuật viên Lab, Kinh doanh', icon: '💼' },
    { file: 'lien-he.html', title: '8. Liên Hệ', desc: 'Trụ sở Vũng Tàu, VP TP.HCM, Form báo giá RFQ', icon: '📞' },
  ];

  // Kết quả tìm kiếm thông minh đa đối tượng (Universal Search)
  const q = searchQuery.toLowerCase().trim();
  const searchResults = {
    articles: q ? newsItems.filter(item =>
      (item.title_vi && item.title_vi.toLowerCase().includes(q)) ||
      (item.title_en && item.title_en.toLowerCase().includes(q))
    ) : [],
    services: q ? serviceItems.filter(item =>
      (item.name_vi && item.name_vi.toLowerCase().includes(q)) ||
      (item.name_en && item.name_en.toLowerCase().includes(q))
    ) : [],
    projects: q ? projectItems.filter(item =>
      (item.name_vi && item.name_vi.toLowerCase().includes(q)) ||
      (item.client && item.client.toLowerCase().includes(q))
    ) : [],
    pages: q ? sitePages.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.file.toLowerCase().includes(q)
    ) : [],
    media: q ? getAllMediaItems().filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.url.toLowerCase().includes(q) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
    ).slice(0, 6) : []
  };

  const totalResults =
    searchResults.articles.length +
    searchResults.services.length +
    searchResults.projects.length +
    searchResults.pages.length +
    searchResults.media.length;

  return (
    <>
      {/* ============================================================ */}
      {/* 1. NÚT KÍCH HOẠT THANH CÔNG CỤ (TRIGGER BUTTON Ở GÓC TRÁI)     */}
      {/* ============================================================ */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-16 left-3 z-40 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-blue-500/40 shadow-xl shadow-blue-500/10 backdrop-blur-md transition-all hover:scale-105 active:scale-95 group cursor-pointer"
          title="Mở Bảng Điều Khiển Tác Vụ CMS (Viết bài, Tìm kiếm, Media, Danh mục)"
        >
          <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-500 transition-colors">
            <PanelLeftOpen size={14} />
          </div>
          <span className="text-xs font-bold tracking-wide">Tác Vụ CMS</span>
          <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-1.5 py-0.5 rounded border border-blue-500/30">
            Menu Trái
          </span>
        </button>
      )}

      {/* ============================================================ */}
      {/* 2. BACKDROP (KHI MỞ TRÊN MÀN HÌNH NHỎ)                        */}
      {/* ============================================================ */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity xl:hidden"
        />
      )}

      {/* ============================================================ */}
      {/* 3. NỘI DUNG PANEL TRÁI (POPUP / SLIDING DRAWER)               */}
      {/* ============================================================ */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-84 sm:w-96 bg-slate-950 border-r border-slate-800 flex flex-col shadow-2xl transition-transform duration-300 ease-out text-slate-100 font-sans ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Panel Header */}
        <div className="h-14 px-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-xs text-white shadow-md">
              CMS
            </div>
            <div>
              <h2 className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
                Bảng Tác Vụ Hệ Thống
                <Sparkles size={12} className="text-amber-400" />
              </h2>
              <p className="text-[10px] text-slate-400">
                Toàn quyền quản trị nội dung Website
              </p>
            </div>
          </div>

          <button
            onClick={onToggle}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Thu gọn bảng điều khiển"
          >
            <PanelLeftClose size={17} />
          </button>
        </div>

        {/* ============================================================ */}
        {/* Ô TÌM KIẾM TOÀN NĂNG (UNIVERSAL SEARCH)                      */}
        {/* ============================================================ */}
        <div className="p-3 border-b border-slate-800 bg-slate-900/40 flex-shrink-0">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Tìm nhanh bài viết, dịch vụ, trang web..."
              className="w-full pl-9 pr-8 py-2 bg-slate-900 border border-slate-700/80 focus:border-blue-500 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={13} />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 px-1">
            <span>Tìm kiếm tức thì trên toàn bộ cơ sở dữ liệu VNIT</span>
            {q && (
              <span className="font-semibold text-blue-400">
                {totalResults} kết quả
              </span>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* VÙNG NỘI DUNG CUỘN (SCROLLABLE AREA)                         */}
        {/* ============================================================ */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">

          {/* NẾU ĐANG TÌM KIẾM: HIỂN THỊ KẾT QUẢ TÌM KIẾM TỨC THÌ */}
          {q ? (
            <div className="space-y-4">
              {totalResults === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <Search size={32} className="mx-auto stroke-slate-600 mb-2" />
                  <p className="text-xs font-semibold text-slate-400">Không tìm thấy nội dung với từ khóa</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">"{searchQuery}"</p>
                </div>
              ) : (
                <>
                  {/* Kết quả Bài viết */}
                  {searchResults.articles.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1 px-1">
                        <FileText size={11} />
                        Bài Viết & Tin Tức ({searchResults.articles.length})
                      </div>
                      {searchResults.articles.map(item => (
                        <div
                          key={item.id}
                          onClick={() => {
                            if (onOpenArticleComposer) onOpenArticleComposer(item);
                          }}
                          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 cursor-pointer transition-all flex items-start gap-2.5 group"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0">
                            <img
                              src={item.imageUrl || 'assets/images/banner-4-vnit-01.jpg'}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 line-clamp-2 transition-colors">
                              {item.title_vi}
                            </h4>
                            <span className="text-[10px] text-slate-500 mt-0.5 block truncate">
                              Nhấn để chỉnh sửa nội dung bài viết này ➜
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Kết quả Dịch vụ */}
                  {searchResults.services.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1 px-1">
                        <Wrench size={11} />
                        Dịch Vụ Kỹ Thuật ({searchResults.services.length})
                      </div>
                      {searchResults.services.map(item => (
                        <div
                          key={item.id}
                          onClick={() => {
                            if (onNavigatePage) onNavigatePage('dich-vu.html');
                          }}
                          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 cursor-pointer transition-all flex items-center justify-between group"
                        >
                          <div className="min-w-0 pr-2">
                            <h4 className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 line-clamp-1">
                              {item.name_vi}
                            </h4>
                            <span className="text-[10px] text-slate-500">Mở trang Dịch vụ để sửa trực quan</span>
                          </div>
                          <ChevronRight size={13} className="text-slate-500 group-hover:text-emerald-400" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Kết quả Dự án */}
                  {searchResults.projects.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1 px-1">
                        <Briefcase size={11} />
                        Dự Án Tiêu Biểu ({searchResults.projects.length})
                      </div>
                      {searchResults.projects.map(item => (
                        <div
                          key={item.id}
                          onClick={() => {
                            if (onNavigatePage) onNavigatePage('du-an.html');
                          }}
                          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 cursor-pointer transition-all flex items-center justify-between group"
                        >
                          <div className="min-w-0 pr-2">
                            <h4 className="text-xs font-semibold text-slate-200 group-hover:text-amber-400 line-clamp-1">
                              {item.name_vi}
                            </h4>
                            <span className="text-[10px] text-slate-500">{item.client || 'Dự án dầu khí'}</span>
                          </div>
                          <ChevronRight size={13} className="text-slate-500 group-hover:text-amber-400" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Kết quả Trang */}
                  {searchResults.pages.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1 px-1">
                        <Compass size={11} />
                        Trang Web ({searchResults.pages.length})
                      </div>
                      {searchResults.pages.map(item => (
                        <div
                          key={item.file}
                          onClick={() => {
                            if (onNavigatePage) onNavigatePage(item.file);
                          }}
                          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-850 cursor-pointer transition-all flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-sm">{item.icon}</span>
                            <div>
                              <div className="text-xs font-semibold text-slate-200 group-hover:text-purple-400">
                                {item.title}
                              </div>
                              <span className="text-[10px] text-slate-500 font-mono">{item.file}</span>
                            </div>
                          </div>
                          <ArrowRight size={13} className="text-slate-500 group-hover:text-purple-400" />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            /* TRẠNG THÁI MẶC ĐỊNH: BẢNG TÁC VỤ & DANH MỤC */
            <>
              {/* ============================================================ */}
              {/* 1. KHỐI TÁC VỤ CHÍNH (QUICK ACTIONS HERO)                     */}
              {/* ============================================================ */}
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  ⚡ Tác Vụ Thường Dùng
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Nút Viết Bài Mới */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenArticleComposer) onOpenArticleComposer(null);
                    }}
                    className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white flex flex-col items-start justify-between shadow-lg shadow-blue-600/20 transition-all active:scale-95 text-left cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Plus size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold">Viết Bài Mới</div>
                      <div className="text-[10px] text-blue-200 mt-0.5">Soạn thảo chuẩn Word</div>
                    </div>
                  </button>

                  {/* Nút Quản Lý Bài Viết */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenArticleManager) onOpenArticleManager();
                    }}
                    className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-white flex flex-col items-start justify-between transition-all active:scale-95 text-left cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <FileText size={15} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                        Quản Lý Bài Viết
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {newsItems.length} bài đăng
                      </div>
                    </div>
                  </button>

                  {/* Nút Thư Viện Media & Tải Ảnh */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenMediaLibrary) onOpenMediaLibrary();
                    }}
                    className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-white flex flex-col items-start justify-between transition-all active:scale-95 text-left cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <ImageIcon size={15} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-purple-400 transition-colors">
                        Thư Viện Ảnh
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Tải lên & Duyệt kho</div>
                    </div>
                  </button>

                  {/* Nút Cài Đặt Website */}
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenSettings) onOpenSettings();
                    }}
                    className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-white flex flex-col items-start justify-between transition-all active:scale-95 text-left cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Settings size={15} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                        Cài Đặt Hotline/Email
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Thông tin công ty</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* ============================================================ */}
              {/* 2. CHUYÊN MỤC PHÂN NHÁNH WEBSITE                             */}
              {/* ============================================================ */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    📁 Chuyên Mục Theo Thiết Kế
                  </span>
                  <span className="text-[10px] text-blue-400 font-semibold">
                    {CATEGORY_GROUPS.length} nhóm chính
                  </span>
                </div>

                <div className="space-y-1.5">
                  {CATEGORY_GROUPS.map(group => {
                    const isTabActive = activeCategoryTab === group.id;
                    return (
                      <div
                        key={group.id}
                        className="rounded-xl border border-slate-800/80 bg-slate-900/60 overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => setActiveCategoryTab(isTabActive ? 'all' : group.id)}
                          className="w-full px-3 py-2 text-left flex items-center justify-between text-xs font-semibold hover:bg-slate-800/60 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: group.color }} />
                            <span className="text-slate-200">{group.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {group.categories.length} mục
                          </span>
                        </button>

                        {/* Dropdown danh mục con */}
                        {isTabActive && (
                          <div className="p-2 pt-0 space-y-1 bg-slate-950/40 border-t border-slate-800/40">
                            {group.categories.map(cat => (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                  if (onNavigatePage) onNavigatePage(group.pageFile);
                                }}
                                className="w-full p-1.5 rounded-lg text-[11px] text-slate-300 hover:text-white hover:bg-slate-800/80 flex items-center justify-between text-left transition-colors group/item"
                              >
                                <span className="line-clamp-1">{cat.name}</span>
                                <ExternalLink size={10} className="text-slate-500 opacity-0 group-hover/item:opacity-100 flex-shrink-0" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ============================================================ */}
              {/* 3. ĐIỀU HƯỚNG 8 TRANG CHÍNH TRỰC QUAN                       */}
              {/* ============================================================ */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  🌐 Điều Hướng & Sửa Trực Quan Trang
                </div>

                <div className="space-y-1">
                  {sitePages.map(page => {
                    const isCurrent = currentPage === page.file;
                    return (
                      <button
                        key={page.file}
                        type="button"
                        onClick={() => {
                          if (onNavigatePage) onNavigatePage(page.file);
                        }}
                        className={`w-full p-2 rounded-xl text-left flex items-center justify-between transition-all ${
                          isCurrent
                            ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 font-bold shadow-xs'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-sm">{page.icon}</span>
                          <div className="min-w-0">
                            <div className="text-xs truncate font-medium text-slate-200">
                              {page.title}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate">
                              {page.desc}
                            </div>
                          </div>
                        </div>

                        {isCurrent ? (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-600 text-white font-bold">
                            Đang xem
                          </span>
                        ) : (
                          <ChevronRight size={13} className="text-slate-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

        </div>

        {/* Panel Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] text-slate-400 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Hệ thống trực tuyến</span>
          </div>
          <span className="font-mono text-[10px] text-slate-500">VNIT CMS v2.0</span>
        </div>

      </aside>
    </>
  );
}
