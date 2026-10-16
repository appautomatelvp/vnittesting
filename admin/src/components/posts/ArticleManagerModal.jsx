// ============================================================
// FILE: src/components/posts/ArticleManagerModal.jsx
// Quản Lý Danh Sách Bài Viết — Tìm kiếm, Lọc Danh Mục, Sửa & Xóa
// ============================================================

import { useState, useEffect } from 'react';
import {
  X, Plus, Search, Filter, Pencil, Trash2, Star, StarOff,
  Eye, FileText, CheckCircle2, AlertCircle, Clock, ExternalLink
} from 'lucide-react';
import { db } from '../../firebase';
import {
  collection, onSnapshot, query, orderBy, doc, deleteDoc, updateDoc
} from 'firebase/firestore';
import { CATEGORY_GROUPS, getCategoryById } from '../../data/categories';
import { initialNews } from '../../data/initialData';

export default function ArticleManagerModal({
  isOpen,
  onClose,
  onOpenComposer
}) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Lắng nghe dữ liệu bài viết Real-time từ Firestore
  useEffect(() => {
    if (!isOpen) return;

    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setArticles(list);
        } else {
          // Nạp dữ liệu mẫu ban đầu nếu Firestore trống
          const fallback = initialNews.map((n, i) => ({
            id: 'mock-' + i,
            ...n,
            categoryId: i === 0 ? 'tin-hoat-dong' : i === 1 ? 'tin-ky-thuat' : i === 2 ? 'tin-dau-khi' : 'tin-su-kien',
            status: 'published',
            publishedAt: '2026-10-15',
            author: 'Ban Biên Tập VNIT'
          }));
          setArticles(fallback);
        }
        setLoading(false);
      },
      (err) => {
        console.warn('Firestore load warning, using initial data:', err);
        const fallback = initialNews.map((n, i) => ({
          id: 'mock-' + i,
          ...n,
          categoryId: i === 0 ? 'tin-hoat-dong' : i === 1 ? 'tin-ky-thuat' : i === 2 ? 'tin-dau-khi' : 'tin-su-kien',
          status: 'published',
          publishedAt: '2026-10-15',
          author: 'Ban Biên Tập VNIT'
        }));
        setArticles(fallback);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [isOpen]);

  if (!isOpen) return null;

  // Lọc bài viết
  const filtered = articles.filter(a => {
    const q = search.toLowerCase().trim();
    const matchQuery = !q ||
      (a.title_vi && a.title_vi.toLowerCase().includes(q)) ||
      (a.title_en && a.title_en.toLowerCase().includes(q)) ||
      (a.author && a.author.toLowerCase().includes(q));

    const meta = getCategoryById(a.categoryId);
    const matchGroup = selectedGroup === 'all' || meta.groupId === selectedGroup || a.categoryId === selectedGroup;
    const matchStatus = statusFilter === 'all' || (a.status || 'published') === statusFilter;

    return matchQuery && matchGroup && matchStatus;
  });

  const handleDelete = async (id) => {
    try {
      if (id.startsWith('mock-')) {
        setArticles(articles.filter(a => a.id !== id));
      } else {
        await deleteDoc(doc(db, 'news', id));
      }
      setDeleteConfirmId(null);
    } catch (err) {
      alert('Lỗi xóa bài viết: ' + err.message);
    }
  };

  const handleToggleFeatured = async (item) => {
    try {
      const next = !item.isFeatured;
      if (!item.id.startsWith('mock-')) {
        await updateDoc(doc(db, 'news', item.id), { isFeatured: next });
      } else {
        setArticles(articles.map(a => a.id === item.id ? { ...a, isFeatured: next } : a));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-[96vw] max-w-[1650px] h-[94vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Quản Lý Danh Sách Bài Viết
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                  {articles.length} bài viết
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Tìm kiếm, lọc danh mục, chỉnh sửa nội dung và quản lý trạng thái xuất bản
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                if (onOpenComposer) onOpenComposer(null);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>Viết Bài Mới</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
          {/* Ô tìm kiếm */}
          <div className="relative flex-1 min-w-[240px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tiêu đề, tác giả..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg text-xs text-white focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Nhóm bộ lọc danh mục */}
          <div className="flex items-center gap-2">
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Tất Cả Chuyên Mục</option>
              {CATEGORY_GROUPS.map(g => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Mọi Trạng Thái</option>
              <option value="published">Đã Xuất Bản</option>
              <option value="draft">Bản Nháp</option>
            </select>
          </div>
        </div>

        {/* Danh sách bài viết */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {loading ? (
            <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
              Đang tải danh sách bài viết...
            </div>
          ) : filtered.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-center">
              <FileText size={40} className="stroke-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-400">Không tìm thấy bài viết nào phù hợp</p>
              <p className="text-xs text-slate-600 mt-1">Hãy thử xóa bộ lọc tìm kiếm hoặc tạo bài viết mới.</p>
            </div>
          ) : (
            filtered.map(item => {
              const meta = getCategoryById(item.categoryId);
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Thumbnail */}
                    <div className="w-20 h-16 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 flex-shrink-0">
                      <img
                        src={item.imageUrl || 'assets/images/banner-4-vnit-01.jpg'}
                        alt={item.title_vi}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${meta.badgeColor || 'bg-blue-900 text-blue-300 border-blue-700'}`}>
                          {meta.name}
                        </span>

                        {item.isFeatured && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <Star size={10} className="fill-amber-400 text-amber-400" />
                            Ghim Nổi Bật
                          </span>
                        )}

                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          item.status === 'draft' ? 'bg-slate-800 text-slate-400' : 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                        }`}>
                          {item.status === 'draft' ? 'Bản Nháp' : 'Đã Xuất Bản'}
                        </span>
                      </div>

                      <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {item.title_vi}
                      </h3>

                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          {item.publishedAt || 'Hôm nay'}
                        </span>
                        {item.author && (
                          <span>• {item.author}</span>
                        )}
                        <span className="hidden md:inline font-mono text-[10px] text-slate-500">
                          {meta.pageFile}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    {/* Star Featured */}
                    <button
                      onClick={() => handleToggleFeatured(item)}
                      title={item.isFeatured ? 'Bỏ ghim nổi bật' : 'Ghim bài nổi bật'}
                      className={`p-2 rounded-lg transition-colors ${
                        item.isFeatured
                          ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                          : 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                      }`}
                    >
                      <Star size={15} className={item.isFeatured ? 'fill-amber-400' : ''} />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => {
                        onClose();
                        if (onOpenComposer) onOpenComposer(item);
                      }}
                      title="Sửa nội dung bài viết"
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Pencil size={15} />
                    </button>

                    {/* Delete */}
                    {deleteConfirmId === item.id ? (
                      <div className="flex items-center gap-1 bg-red-950/90 border border-red-800 p-1 rounded-lg">
                        <span className="text-[11px] text-red-300 px-1 font-semibold">Xóa?</span>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold hover:bg-red-500"
                        >
                          Có
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        title="Xóa bài viết này"
                        className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Tổng số {filtered.length} / {articles.length} bài viết hiển thị</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            Đóng Lại
          </button>
        </div>

      </div>
    </div>
  );
}
