// ============================================================
// FILE: src/pages/ProjectsPage.jsx
// Trang Quản lý Dự án tiêu biểu - CRUD + Song ngữ
// ============================================================

import { useState, useEffect } from 'react';
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, serverTimestamp, query, orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import { Plus, Pencil, Trash2, FolderKanban } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import ImageUploader from '../components/ui/ImageUploader';
import RichTextEditor from '../components/ui/RichTextEditor';

const EMPTY_FORM = {
  name_vi: '', name_en: '',
  client: '',
  description_vi: '', description_en: '',
  imageUrl: '',
};

export default function ProjectsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [lang, setLang] = useState('vi');

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  const openCreate = () => { setEditItem(null); setForm(EMPTY_FORM); setLang('vi'); setModalOpen(true); };
  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      name_vi: item.name_vi || '', name_en: item.name_en || '',
      client: item.client || '',
      description_vi: item.description_vi || '',
      description_en: item.description_en || '',
      imageUrl: item.imageUrl || '',
    });
    setLang('vi');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name_vi.trim()) { alert('Vui lòng nhập Tên dự án (VI).'); return; }
    setSaving(true);
    try {
      if (editItem) {
        await updateDoc(doc(db, 'projects', editItem.id), { ...form });
      } else {
        await addDoc(collection(db, 'projects'), { ...form, createdAt: serverTimestamp() });
      }
      setModalOpen(false);
    } catch (err) { alert('Lỗi: ' + err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => { await deleteDoc(doc(db, 'projects', id)); };
  const setField = (field, val) => setForm(f => ({ ...f, [field]: val }));

  return (
    <div>
      <PageHeader
        title="Quản lý Dự án"
        subtitle="Các dự án tiêu biểu hiển thị trên website"
        action={
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
            <Plus size={16} />
            Thêm dự án mới
          </button>
        }
      />

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 text-sm"><span>Đang tải...</span></div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <FolderKanban size={40} className="mb-3 opacity-40" />
            <p className="text-sm">Chưa có dự án nào. Hãy thêm dự án đầu tiên!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left font-medium text-slate-600 w-16">Ảnh</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Tên dự án (VI)</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Chủ đầu tư</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600 w-24">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="w-12 h-9 object-cover rounded-md" />
                      ) : (
                        <div className="w-12 h-9 bg-slate-100 rounded-md flex items-center justify-center">
                          <FolderKanban size={14} className="text-slate-300" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800 max-w-xs truncate">
                      {item.name_vi || <span className="text-slate-400 italic">—</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {item.client || <span className="italic">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(item)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={15} /></button>
                        <button onClick={() => setDeleteTarget(item.id)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'} size="xl">
        <form onSubmit={handleSave}>
          <div className="flex gap-1 mb-4 bg-slate-100 p-1 rounded-lg w-fit">
            {['vi', 'en'].map(l => (
              <button key={l} type="button" onClick={() => setLang(l)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${lang === l ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {l === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {/* Project name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tên dự án ({lang === 'vi' ? 'VI' : 'EN'}) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lang === 'vi' ? form.name_vi : form.name_en}
                onChange={e => setField(lang === 'vi' ? 'name_vi' : 'name_en', e.target.value)}
                placeholder={lang === 'vi' ? 'Tên dự án...' : 'Project name...'}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Client - không cần dịch */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tên chủ đầu tư</label>
              <input
                type="text"
                value={form.client}
                onChange={e => setField('client', e.target.value)}
                placeholder="Tên đơn vị / chủ đầu tư..."
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mô tả ({lang === 'vi' ? 'VI' : 'EN'})
              </label>
              <RichTextEditor
                value={lang === 'vi' ? form.description_vi : form.description_en}
                onChange={val => setField(lang === 'vi' ? 'description_vi' : 'description_en', val)}
                placeholder={lang === 'vi' ? 'Mô tả dự án...' : 'Project description...'}
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ảnh dự án</label>
              <ImageUploader value={form.imageUrl} onChange={url => setField('imageUrl', url)} folder="projects" />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Huỷ</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg transition-colors flex items-center gap-2">
              {saving && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {saving ? 'Đang lưu...' : (editItem ? 'Cập nhật' : 'Thêm mới')}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => handleDelete(deleteTarget)} title="Xoá dự án" message="Dự án sẽ bị xoá vĩnh viễn." />
    </div>
  );
}
