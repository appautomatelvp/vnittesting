// ============================================================
// FILE: src/pages/NewsPage.jsx
// Trang Quản lý Tin tức - Đầy đủ CRUD + Song ngữ + Rich Text
// ============================================================

import { useState, useEffect } from 'react';
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, serverTimestamp, query, orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import { Plus, Pencil, Trash2, Star, StarOff, Image as ImageIcon } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ArticleComposerModal from '../components/posts/ArticleComposerModal';
import { getCategoryById } from '../data/categories';

const EMPTY_FORM = {
  title_vi: '', title_en: '',
  content_vi: '', content_en: '',
  imageUrl: '', isFeatured: false,
};

function LangTabs({ lang, onChange }) {
  return (
    <div className="flex gap-1 mb-4 bg-slate-100 p-1 rounded-lg w-fit">
      {['vi', 'en'].map(l => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            lang === l ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {l === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'}
        </button>
      ))}
    </div>
  );
}

export default function NewsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [lang, setLang] = useState('vi');

  // Real-time listener
  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const openCreate = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title_vi.trim()) {
      alert('Vui lòng nhập Tiêu đề (VI).');
      return;
    }
    setSaving(true);
    try {
      if (editItem) {
        await updateDoc(doc(db, 'news', editItem.id), { ...form });
      } else {
        await addDoc(collection(db, 'news'), { ...form, createdAt: serverTimestamp() });
      }
      setModalOpen(false);
    } catch (err) {
      alert('Lỗi: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'news', id));
  };

  const toggleFeatured = async (item) => {
    await updateDoc(doc(db, 'news', item.id), { isFeatured: !item.isFeatured });
  };

  const setField = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const formatDate = (ts) => {
    if (!ts?.toDate) return '—';
    return ts.toDate().toLocaleDateString('vi-VN');
  };

  return (
    <div>
      <PageHeader
        title="Quản lý Tin tức"
        subtitle="Thêm, chỉnh sửa và xoá các bài viết trên website"
        action={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={16} />
            Thêm bài viết mới
          </button>
        }
      />

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
            <span>Đang tải dữ liệu...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <ImageIcon size={40} className="mb-3 opacity-40" />
            <p className="text-sm">Chưa có bài viết nào. Hãy thêm bài viết đầu tiên!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left font-medium text-slate-600 w-16">Ảnh</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Tiêu đề (VI)</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600 w-44">Chuyên mục</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600 w-28">Ngày tạo</th>
                  <th className="px-4 py-3 text-center font-medium text-slate-600 w-20">Nổi bật</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600 w-24">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map(item => {
                  const meta = getCategoryById(item.categoryId);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="w-12 h-9 object-cover rounded-md bg-slate-100"
                          />
                        ) : (
                          <div className="w-12 h-9 bg-slate-100 rounded-md flex items-center justify-center">
                            <ImageIcon size={14} className="text-slate-300" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800 max-w-xs truncate">
                        {item.title_vi || <span className="text-slate-400 italic">Chưa có tiêu đề</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${meta.badgeColor || 'bg-blue-100 text-blue-700 border-blue-200'}`}>
                          {meta.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{formatDate(item.createdAt)}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleFeatured(item)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          item.isFeatured
                            ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                            : 'text-slate-300 hover:text-amber-400 hover:bg-amber-50'
                        }`}
                        title={item.isFeatured ? 'Bỏ nổi bật' : 'Đánh dấu nổi bật'}
                      >
                        {item.isFeatured ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xoá"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Article Composer Modal with Word Editor & Category Branching */}
      <ArticleComposerModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditItem(null);
        }}
        initialData={editItem}
        onSuccess={() => {
          setModalOpen(false);
          setEditItem(null);
        }}
      />

      {/* Confirm delete */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget)}
        title="Xoá bài viết"
        message="Bài viết sẽ bị xoá vĩnh viễn. Hành động này không thể hoàn tác."
      />
    </div>
  );
}
