// ============================================================
// FILE: src/components/posts/ArticleLivePreview.jsx
// Giao Diện Xem Trước Trực Quan Bài Viết Y Chang Website VNIT
// ============================================================

import React from 'react';
import {
  Calendar, User, Clock, Tag, Share2, Eye, ShieldCheck,
  ChevronRight, ArrowLeft, Bookmark, ExternalLink, Sparkles
} from 'lucide-react';
import { getCategoryById } from '../../data/categories';

export default function ArticleLivePreview({
  title = "Tiêu đề bài viết chưa nhập",
  summary = "",
  content = "",
  imageUrl = "assets/images/banner-4-vnit-01.jpg",
  categoryId = "tin-hoat-dong",
  author = "Ban Biên Tập Kỹ Thuật VNIT",
  publishDate = "16/10/2026",
  tags = [],
  isFeatured = false,
  lang = "vi"
}) {
  const meta = getCategoryById(categoryId);

  // Tính thời gian đọc
  const words = content ? content.replace(/<[^>]*>?/gm, '').split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(words / 180));

  return (
    <div className="bg-slate-100 text-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-300 font-sans flex flex-col h-full">
      
      {/* ============================================================ */}
      {/* 1. MOCK BROWSER BAR                                          */}
      {/* ============================================================ */}
      <div className="bg-slate-800 text-slate-300 px-4 py-2 border-b border-slate-700 flex items-center justify-between text-xs flex-shrink-0 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
          </div>
          <span className="hidden sm:inline font-mono text-[11px] text-slate-400 pl-2">
            Xem trước giao diện thực tế bài viết trên Website VNIT
          </span>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-lg border border-slate-700 text-[11px] font-mono text-emerald-400 truncate max-w-sm sm:max-w-md">
          <span className="text-slate-500">https://cal-test.vn/</span>
          <span className="truncate">{meta.pageFile}#{categoryId}</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. BODY SCROLLABLE WEBSITE VIEW                              */}
      {/* ============================================================ */}
      <div className="flex-1 overflow-y-auto bg-white">
        
        {/* Mock Top Brand Bar */}
        <div className="bg-[#213B78] text-white px-6 py-3 flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center gap-3">
            <img
              src="assets/images/logo-vnit-white.svg"
              alt="VNIT Logo"
              className="h-8 w-auto"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "assets/images/logo-VNIT-kiem-dinh-viet-nam-01.png";
              }}
            />
            <div className="border-l border-white/20 pl-3">
              <span className="font-extrabold text-sm tracking-wide block">VNIT JSC</span>
              <span className="text-[10px] text-blue-200 block font-light">Kiểm Định & Hiệu Chuẩn Dầu Khí</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs">
            <span>Hotline: <strong className="text-amber-300">0977.2323.46</strong></span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-[11px] font-bold">VILAS 1288</span>
          </div>
        </div>

        {/* Breadcrumb Zone */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 text-xs text-slate-600 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 font-medium">Trang Chủ</span>
            <ChevronRight size={13} className="text-slate-400" />
            <span className="text-slate-600 font-semibold">{meta.groupName}</span>
            <ChevronRight size={13} className="text-slate-400" />
            <span className="text-[#0082C4] font-bold">{meta.name}</span>
          </div>

          {isFeatured && (
            <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
              <Sparkles size={11} className="text-amber-500" />
              Bài Viết Ghim Nổi Bật Trang Chủ
            </span>
          )}
        </div>

        {/* Main Article Container */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          
          {/* Category Badge & Metadata */}
          <div className="mb-4">
            <span className={`inline-block text-xs font-black uppercase tracking-wider px-3 py-1 rounded-md border ${meta.badgeColor || 'bg-blue-100 text-blue-800 border-blue-200'}`}>
              {meta.name}
            </span>
          </div>

          {/* Article Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#213B78] leading-tight mb-4">
            {title || "Tiêu đề bài viết mẫu của VNIT"}
          </h1>

          {/* Author & Published Date Bar */}
          <div className="flex flex-wrap items-center gap-4 py-3 border-y border-slate-200 text-xs text-slate-500 mb-6">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <User size={14} className="text-[#0082C4]" />
              <span>{author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-slate-400" />
              <span>{publishDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-slate-400" />
              <span>~{readTime} phút đọc</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                Xuất bản chính thức
              </span>
            </div>
          </div>

          {/* Featured Image (Ảnh Đại Diện Bài Viết) */}
          {imageUrl && (
            <div className="mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-auto max-h-[480px] object-cover"
              />
              <div className="p-2 bg-slate-50 text-[11px] text-slate-500 italic text-center border-t border-slate-200">
                Hình ảnh: {title} — Công ty Cổ phần Kỹ thuật & Kiểm định VNIT
              </div>
            </div>
          )}

          {/* Excerpt / Tóm tắt bài viết */}
          {summary && (
            <div className="p-5 rounded-xl bg-blue-50/70 border-l-4 border-[#0082C4] text-slate-700 font-medium text-sm leading-relaxed mb-8 italic shadow-xs">
              {summary}
            </div>
          )}

          {/* Rich Content Rendered */}
          {content ? (
            <div
              className="article-preview-content prose max-w-none text-slate-700 text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div className="py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
              <p className="font-semibold text-sm">Chưa có nội dung bài viết</p>
              <p className="text-xs text-slate-400 mt-1">Chuyển sang tab "Soạn Thảo" để bắt đầu viết nội dung.</p>
            </div>
          )}

          {/* Tags & Keywords */}
          {tags && tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag size={14} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-600">Từ khóa SEO:</span>
                {(Array.isArray(tags) ? tags : tags.split(',')).map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200 transition-colors"
                  >
                    #{typeof t === 'string' ? t.trim() : t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Box */}
          <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50/50 border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#213B78] text-white flex items-center justify-center font-bold text-base shadow-md">
              VNIT
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#213B78]">
                {author}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Chuyên môn sâu về kiểm định an toàn, hiệu chuẩn phòng lab VILAS 1288 và thử nghiệm van công nghiệp ngoài khơi.
              </p>
            </div>
          </div>

        </div>

        {/* Footer Mock */}
        <div className="bg-slate-900 text-slate-400 px-6 py-6 border-t border-slate-800 text-xs text-center">
          <p>© 2026 CÔNG TY CỔ PHẦN KỸ THUẬT & KIỂM ĐỊNH VNIT — cal-test.vn. Bản quyền được bảo lưu.</p>
        </div>

      </div>

    </div>
  );
}
