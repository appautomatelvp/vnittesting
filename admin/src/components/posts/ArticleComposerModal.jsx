// ============================================================
// FILE: src/components/posts/ArticleComposerModal.jsx
// Cơ cấu Đăng Bài Viết Chuyên Nghiệp — Chuẩn Văn Phòng & Widescreen
// Tận Dụng Toàn Bộ Không Gian Màn Hình Ngang (Widescreen 98vw / Fullscreen)
// Chức Năng Xem Trước Tức Thì (Real-time Live Preview) & Song Song (Split View)
// ============================================================

import { useState } from 'react';
import {
  X, Check, FolderTree, Globe, Calendar, User, Tag,
  Eye, Image as ImageIcon, Save, AlertCircle,
  FileText, Star, Maximize2, Minimize2, Columns2, Sparkles, ChevronDown, ChevronUp
} from 'lucide-react';
import { CATEGORY_GROUPS, getCategoryById } from '../../data/categories';
import ProfessionalEditor from '../ui/ProfessionalEditor';
import MediaLibraryModal from '../media/MediaLibraryModal';
import ArticleLivePreview from './ArticleLivePreview';
import { db } from '../../firebase';
import {
  collection, addDoc, updateDoc, doc, serverTimestamp
} from 'firebase/firestore';

export default function ArticleComposerModal({
  isOpen,
  onClose,
  initialData = null,
  onSuccess
}) {
  if (!isOpen) return null;

  // Form State
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || 'tin-hoat-dong');
  const [lang, setLang] = useState('vi'); // 'vi' | 'en'

  const [titleVi, setTitleVi] = useState(initialData?.title_vi || '');
  const [titleEn, setTitleEn] = useState(initialData?.title_en || '');
  const [summaryVi, setSummaryVi] = useState(initialData?.summary_vi || '');
  const [summaryEn, setSummaryEn] = useState(initialData?.summary_en || '');
  const [contentVi, setContentVi] = useState(initialData?.content_vi || '');
  const [contentEn, setContentEn] = useState(initialData?.content_en || '');

  const [slug, setSlug] = useState(initialData?.slug || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || 'assets/images/banner-4-vnit-01.jpg');
  const [author, setAuthor] = useState(initialData?.author || 'Ban Biên Tập Kỹ Thuật VNIT');
  const [publishDate, setPublishDate] = useState(initialData?.publishedAt || new Date().toISOString().split('T')[0]);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [status, setStatus] = useState(initialData?.status || 'published'); // 'published' | 'draft'
  const [tags, setTags] = useState(initialData?.tags ? (Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags) : 'vnit, kiểm định, hiệu chuẩn');

  // Widescreen & View Mode state
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'edit' | 'preview'
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(!initialData); // Mặc định mở nếu tạo mới, thu gọn nếu chỉnh sửa

  // Media Modal state
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-generate slug when title_vi changes (nếu bài mới chưa sửa slug riêng)
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  };

  const handleTitleChange = (val) => {
    setTitleVi(val);
    if (!initialData) {
      setSlug(generateSlug(val));
    }
  };

  const selectedCategoryMeta = getCategoryById(categoryId);

  // Lưu bài viết vào Firestore
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!titleVi.trim()) {
      setErrorMsg('Vui lòng nhập Tiêu đề bài viết (Tiếng Việt).');
      return;
    }
    if (!categoryId) {
      setErrorMsg('Vui lòng chọn danh mục bài viết sẽ hiển thị.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      const payload = {
        categoryId,
        categoryGroupId: selectedCategoryMeta.groupId,
        categoryName: selectedCategoryMeta.name,
        categoryGroupName: selectedCategoryMeta.groupName,
        targetPage: selectedCategoryMeta.targetPage || selectedCategoryMeta.pageFile,

        title_vi: titleVi.trim(),
        title_en: titleEn.trim() || titleVi.trim(),
        summary_vi: summaryVi.trim(),
        summary_en: summaryEn.trim(),
        content_vi: contentVi,
        content_en: contentEn || contentVi,

        slug: slug.trim() || generateSlug(titleVi),
        imageUrl: imageUrl.trim(),
        author: author.trim(),
        publishedAt: publishDate,
        isFeatured: Boolean(isFeatured),
        status,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        updatedAt: serverTimestamp(),
      };

      if (initialData?.id) {
        // Cập nhật bài viết có sẵn
        await updateDoc(doc(db, 'news', initialData.id), payload);
      } else {
        // Tạo bài viết mới
        payload.createdAt = serverTimestamp();
        await addDoc(collection(db, 'news'), payload);
      }

      setSaving(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Lỗi lưu bài viết:', err);
      setErrorMsg('Lỗi lưu dữ liệu: ' + err.message);
      setSaving(false);
    }
  };

  // ============================================================
  // COMPONENT: FORM SOẠN THẢO NỘI DUNG
  // ============================================================
  const renderEditorForm = () => (
    <div className="space-y-5">
      {errorMsg && (
        <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-red-200 text-xs flex items-center gap-2">
          <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* PHẦN 1: HỎI RÕ MỤC ĐĂNG BÀI (CATEGORY TREE)                  */}
      {/* ============================================================ */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-blue-500/30 shadow-lg">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs">
              1
            </span>
            <h3 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wide">
              Mục Đăng Bài Viết Trên Website
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold px-2.5 py-1 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 transition-all cursor-pointer flex items-center gap-1"
          >
            {isCategoryExpanded ? (
              <>
                <ChevronUp size={13} />
                <span>Thu gọn 8 đầu mục</span>
              </>
            ) : (
              <>
                <ChevronDown size={13} />
                <span>Mở rộng chọn mục khác</span>
              </>
            )}
          </button>
        </div>

        {/* Thanh xác nhận vị trí đã chọn luôn hiển thị rõ */}
        <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-semibold">Đang gắn vào:</span>
            <span className="px-2.5 py-1 rounded-lg bg-blue-600/25 text-blue-200 font-bold border border-blue-500/40 flex items-center gap-1.5">
              <FolderTree size={13} style={{ color: selectedCategoryMeta.color }} />
              {selectedCategoryMeta.groupName} ➜ {selectedCategoryMeta.name}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>Trang đích:</span>
            <span className="font-mono text-amber-400 font-semibold">{selectedCategoryMeta.targetPage || selectedCategoryMeta.pageFile}</span>
          </div>
        </div>

        {/* Danh sách 8 nhóm chuyên mục theo sơ đồ WEBSITE VNIT NEW UPDATE */}
        {isCategoryExpanded && (
          <div className={`grid gap-2.5 pt-3 ${viewMode === 'split' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'}`}>
            {CATEGORY_GROUPS.map(group => (
              <div
                key={group.id}
                className="rounded-xl border border-slate-800 bg-slate-900/90 p-2.5 space-y-1.5"
              >
                <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <FolderTree size={12} style={{ color: group.color }} />
                    {group.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {group.pageFile}
                  </span>
                </div>

                <div className="space-y-1">
                  {group.categories.map(cat => {
                    const isSelected = categoryId === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategoryId(cat.id)}
                        className={`w-full text-left p-1.5 rounded-lg text-xs transition-all flex items-start justify-between gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-[11px]">{cat.name}</div>
                          <div className={`text-[10px] line-clamp-1 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                            {cat.description}
                          </div>
                        </div>
                        {isSelected && <Check size={13} className="flex-shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* PHẦN 2: THÔNG TIN CƠ BẢN & SOẠN THẢO NỘI DUNG                */}
      {/* ============================================================ */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-lg space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs">
              2
            </span>
            <h3 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wide">
              Tiêu Đề & Nội Dung Bài Viết
            </h3>
          </div>

          {/* Chuyển đổi ngôn ngữ */}
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setLang('vi')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                lang === 'vi' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🇻🇳 Tiếng Việt (Chính)
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                lang === 'en' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🇬🇧 English (Quốc tế)
            </button>
          </div>
        </div>

        {/* Tab Tiếng Việt */}
        {lang === 'vi' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Tiêu đề bài viết (Tiếng Việt) *
              </label>
              <input
                type="text"
                value={titleVi}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Ví dụ: VNIT Hoàn Thành Xuất Sắc Chiến Dịch Kiểm Định Thiết Bị Cho Mỏ Lô 01&02..."
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Đoạn tóm tắt mở đầu (Hiển thị nổi bật ở đầu bài viết & danh sách thẻ)
              </label>
              <textarea
                rows={2}
                value={summaryVi}
                onChange={(e) => setSummaryVi(e.target.value)}
                placeholder="Tóm tắt ngắn gọn 2 - 3 câu về nội dung bài viết..."
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Editor Tiếng Việt */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Nội dung chi tiết (Định dạng chuyên nghiệp chuẩn Word) *</span>
                <span className="text-[10px] text-slate-400 font-normal">Hỗ trợ căn lề, tiêu đề H1-H3, bảng biểu & chèn ảnh</span>
              </label>
              <ProfessionalEditor
                value={contentVi}
                onChange={setContentVi}
                placeholder="Bắt đầu gõ nội dung bài viết, căn lề trái/giữa/phải/đều, định dạng tiêu đề và chèn hình ảnh..."
                minHeight={260}
              />
            </div>
          </div>
        )}

        {/* Tab English */}
        {lang === 'en' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Article Title (English)
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g.: VNIT Successfully Completes Offshore Inspection & Calibration Campaign..."
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm font-semibold text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Short Summary (English)
              </label>
              <textarea
                rows={2}
                value={summaryEn}
                onChange={(e) => setSummaryEn(e.target.value)}
                placeholder="Brief 2-3 sentence overview of this article..."
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Editor English */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Detailed Content (English)</span>
                <span className="text-[10px] text-slate-400 font-normal">Supports full office formatting</span>
              </label>
              <ProfessionalEditor
                value={contentEn}
                onChange={setContentEn}
                placeholder="Write English content here..."
                minHeight={260}
              />
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* PHẦN 3: ẢNH ĐẠI DIỆN & CÀI ĐẶT BÀI VIẾT                      */}
      {/* ============================================================ */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-lg space-y-3.5">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs">
            3
          </span>
          <h3 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wide">
            Ảnh Bìa Đại Diện & Cài Đặt Xuất Bản
          </h3>
        </div>

        <div className={`grid gap-4 ${viewMode === 'split' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
          {/* Ảnh bìa đại diện */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Ảnh bìa bài viết (Hero & Thumbnail) *
            </label>
            <div className="flex gap-3 items-start">
              <div className="w-36 h-24 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 flex-shrink-0 relative group">
                <img
                  src={imageUrl}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "assets/images/banner-4-vnit-01.jpg";
                  }}
                />
              </div>

              <div className="space-y-2 flex-1">
                <button
                  type="button"
                  onClick={() => setIsMediaModalOpen(true)}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <ImageIcon size={14} />
                  <span>Chọn Từ Thư Viện / Tải Lên</span>
                </button>

                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Hoặc dán link ảnh URL..."
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Cài đặt metadata & xuất bản */}
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Tác giả / Ban Biên Tập
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Ngày xuất bản
                </label>
                <input
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  SEO Slug (Đường dẫn)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 font-mono focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Từ khóa tags (Cách nhau dấu phẩy)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="vnit, kiem dinh, hieu chuan"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-amber-300">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-800 border-slate-700 cursor-pointer"
                />
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span>Ghim nổi bật (Trang chủ)</span>
              </label>

              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-400 text-[11px]">Trạng thái:</span>
                <button
                  type="button"
                  onClick={() => setStatus('published')}
                  className={`px-2.5 py-1 rounded-md font-bold text-[11px] transition-all cursor-pointer ${
                    status === 'published' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Xuất bản
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('draft')}
                  className={`px-2.5 py-1 rounded-md font-bold text-[11px] transition-all cursor-pointer ${
                    status === 'draft' ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Lưu nháp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================
  // COMPONENT: GIAO DIỆN XEM TRƯỚC (LIVE PREVIEW)
  // ============================================================
  const renderLivePreview = () => (
    <ArticleLivePreview
      title={lang === 'vi' ? (titleVi || 'Tiêu đề bài viết chưa nhập...') : (titleEn || titleVi || 'Article title...')}
      summary={lang === 'vi' ? summaryVi : (summaryEn || summaryVi)}
      content={lang === 'vi' ? contentVi : (contentEn || contentVi)}
      imageUrl={imageUrl}
      categoryId={categoryId}
      author={author}
      publishDate={publishDate}
      tags={tags.split(',').map(t => t.trim()).filter(Boolean)}
      isFeatured={isFeatured}
      lang={lang}
    />
  );

  return (
    <div
      className={`fixed inset-0 z-[120] ${
        isFullScreen
          ? 'p-0 bg-black'
          : 'flex items-center justify-center p-1 sm:p-2.5 bg-black/85 backdrop-blur-md'
      } animate-in fade-in duration-150`}
    >
      <div
        className={`bg-slate-900 border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden text-slate-100 ${
          isFullScreen
            ? 'w-screen h-screen rounded-none'
            : 'w-[99vw] max-w-[1900px] h-[98vh] rounded-2xl'
        }`}
      >
        {/* ============================================================ */}
        {/* HEADER MODAL CÓ CHỨC NĂNG CHUYỂN CHẾ ĐỘ & FULLSCREEN          */}
        {/* ============================================================ */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-950/90 flex-shrink-0 gap-3">
          {/* Trái: Tiêu đề popup */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
              <FileText size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  {initialData ? 'Chỉnh Sửa Bài Viết' : 'Biên Tập & Đăng Bài Mới'}
                </h2>
                <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {selectedCategoryMeta.groupName}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Hệ thống soạn thảo phân nhánh chuẩn Website VNIT
              </p>
            </div>
          </div>

          {/* Giữa: Nút Chuyển Đổi Chế Độ (Split / Edit / Preview) */}
          <div className="flex items-center bg-slate-900 border border-slate-700/80 p-1 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'split'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Chế độ Song Song: Soạn thảo bên trái, Xem trước trực quan bên phải"
            >
              <Columns2 size={14} />
              <span className="hidden sm:inline">Song Song (Split)</span>
              <span className="sm:hidden">Split</span>
              <span className="hidden xl:inline text-[9px] px-1.5 py-0.5 bg-blue-400/25 text-blue-200 rounded font-normal">
                Khuyên dùng
              </span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('edit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'edit'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Chỉ mở rộng vùng Soạn thảo"
            >
              <FileText size={14} />
              <span className="hidden sm:inline">Soạn Thảo</span>
              <span className="sm:hidden">Soạn</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'preview'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Xem trước bài viết toàn màn hình chuẩn Website"
            >
              <Eye size={14} />
              <span className="hidden sm:inline">Xem Trước Web</span>
              <span className="sm:hidden">Xem</span>
            </button>
          </div>

          {/* Phải: Fullscreen & Nút Lưu */}
          <div className="flex items-center gap-2">
            {/* Nút Toàn màn hình (Widescreen 100%) */}
            <button
              type="button"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={isFullScreen ? 'Thu nhỏ cửa sổ' : 'Phóng to toàn màn hình (Widescreen 100%)'}
            >
              {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 sm:px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Save size={14} />
              <span>{saving ? 'Đang Lưu...' : (initialData ? 'Cập Nhật' : 'Xuất Bản')}</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Đóng cửa sổ"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* NỘI DUNG CHÍNH (THEO CHẾ ĐỘ VIEW)                            */}
        {/* ============================================================ */}

        {/* 1. CHẾ ĐỘ SONG SONG (SPLIT VIEW): SOẠN THẢO TRÁI, PREVIEW PHẢI */}
        {viewMode === 'split' && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            {/* Cột trái: Form Soạn thảo */}
            <div className="w-full lg:w-[48%] xl:w-[47%] h-full overflow-y-auto p-4 sm:p-5 bg-slate-900">
              {renderEditorForm()}
            </div>

            {/* Cột phải: Live Preview trực quan */}
            <div className="w-full lg:w-[52%] xl:w-[53%] h-full p-3 sm:p-4 bg-slate-950 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between pb-2.5 px-1 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Eye size={14} className="text-blue-400" />
                    Xem Trước Giao Diện Thực Tế Trên Website VNIT
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Cập nhật thời gian thực
                </span>
              </div>
              <div className="flex-1 overflow-hidden">
                {renderLivePreview()}
              </div>
            </div>
          </div>
        )}

        {/* 2. CHẾ ĐỘ CHỈ SOẠN THẢO (FULL EDIT VIEW) */}
        {viewMode === 'edit' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900">
            <div className="max-w-5xl mx-auto">
              {renderEditorForm()}
            </div>
          </div>
        )}

        {/* 3. CHẾ ĐỘ XEM TRƯỚC TOÀN MÀN HÌNH (FULL PREVIEW VIEW) */}
        {viewMode === 'preview' && (
          <div className="flex-1 p-3 sm:p-5 bg-slate-950 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between pb-2.5 px-2 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Eye size={15} className="text-blue-400" />
                <span className="text-xs font-bold text-slate-200">
                  Xem Trước Toàn Màn Hình Chuẩn Giao Diện Desktop Website VNIT
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Columns2 size={13} />
                <span>Trở về chế độ Song Song (Split)</span>
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              {renderLivePreview()}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* FOOTER ACTIONS                                               */}
        {/* ============================================================ */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 flex-shrink-0 text-xs">
          <div className="text-slate-400 flex items-center gap-2 flex-wrap">
            <span>Điểm đến trên web:</span>
            <span className="font-mono text-blue-400 font-bold">
              {selectedCategoryMeta.groupName} ➜ {selectedCategoryMeta.name} ({selectedCategoryMeta.targetPage || selectedCategoryMeta.pageFile})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors cursor-pointer"
            >
              Hủy Bỏ
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save size={15} />
              <span>{saving ? 'Đang Lưu...' : (initialData ? 'Lưu Thay Đổi' : 'Xuất Bản Ngay')}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Modal Thư Viện Media Chọn Thumbnail */}
      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelectImage={(url) => setImageUrl(url)}
        title="Chọn Ảnh Đại Diện Bài Viết"
      />
    </div>
  );
}
