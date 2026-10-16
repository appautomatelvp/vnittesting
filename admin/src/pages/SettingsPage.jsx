// ============================================================
// FILE: src/pages/SettingsPage.jsx
// Trang Cài đặt chung - Cập nhật document duy nhất trong Firestore
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Save, CheckCircle, Database, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';

const SETTINGS_DOC_ID = 'general';

const EMPTY_FORM = {
  companyName_vi: '',
  companyName_en: '',
  hotline: '',
  email: '',
  address_vi: '',
  address_en: '',
};

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputClass = "w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow";

export default function SettingsPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const docSnap = await getDoc(doc(db, 'settings', SETTINGS_DOC_ID));
        if (docSnap.exists()) {
          setForm({ ...EMPTY_FORM, ...docSnap.data() });
        }
      } catch (err) {
        console.error('Lỗi tải cài đặt:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const setField = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', SETTINGS_DOC_ID), form, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Lỗi khi lưu cài đặt: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2" />
        <span>Đang tải cài đặt...</span>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Cài đặt chung"
        subtitle="Cập nhật thông tin liên hệ và tên công ty hiển thị trên website"
      />

      <form onSubmit={handleSave} className="max-w-2xl">
        {/* Company name */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-4">
          <h3 className="font-semibold text-slate-700 mb-4 pb-3 border-b border-slate-100">
            Tên công ty
          </h3>
          <div className="space-y-4">
            <Field label="Tên công ty (Tiếng Việt)">
              <input
                type="text"
                value={form.companyName_vi}
                onChange={e => setField('companyName_vi', e.target.value)}
                placeholder="Công ty Venus..."
                className={inputClass}
              />
            </Field>
            <Field label="Company Name (English)">
              <input
                type="text"
                value={form.companyName_en}
                onChange={e => setField('companyName_en', e.target.value)}
                placeholder="Venus Company..."
                className={inputClass}
              />
            </Field>
          </div>
        </div>

        {/* Contact info */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-4">
          <h3 className="font-semibold text-slate-700 mb-4 pb-3 border-b border-slate-100">
            Thông tin liên hệ
          </h3>
          <div className="space-y-4">
            <Field label="Số hotline / điện thoại">
              <input
                type="tel"
                value={form.hotline}
                onChange={e => setField('hotline', e.target.value)}
                placeholder="0909 123 456"
                className={inputClass}
              />
            </Field>
            <Field label="Email liên hệ">
              <input
                type="email"
                value={form.email}
                onChange={e => setField('email', e.target.value)}
                placeholder="contact@venus.com"
                className={inputClass}
              />
            </Field>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-slate-700 mb-4 pb-3 border-b border-slate-100">
            Địa chỉ
          </h3>
          <div className="space-y-4">
            <Field label="Địa chỉ (Tiếng Việt)">
              <textarea
                rows={2}
                value={form.address_vi}
                onChange={e => setField('address_vi', e.target.value)}
                placeholder="123 Đường ABC, Phường XYZ, Thành phố HCM"
                className={inputClass + ' resize-none'}
              />
            </Field>
            <Field label="Address (English)">
              <textarea
                rows={2}
                value={form.address_en}
                onChange={e => setField('address_en', e.target.value)}
                placeholder="123 ABC Street, XYZ Ward, Ho Chi Minh City"
                className={inputClass + ' resize-none'}
              />
            </Field>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium text-sm rounded-lg transition-colors cursor-pointer"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
          </button>

          {saved && (
            <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
              <CheckCircle size={16} />
              Đã lưu thành công!
            </div>
          )}
        </div>
      </form>

      {/* QUICK BACKUP & RESTORE SECTION */}
      <div className="max-w-2xl mt-8 pt-6 border-t border-slate-200">
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-bold text-sm text-indigo-300">
              <ShieldCheck size={18} className="text-emerald-400" />
              <span>Bảo Trì & Sao Lưu Dữ Liệu Toàn Hệ Thống</span>
            </div>
            <p className="text-xs text-slate-300 max-w-md">
              Bảo toàn 100% dữ liệu dịch vụ, dự án, tin tức & chỉnh sửa trực quan. Ảnh lưu trên Firebase nên file backup siêu nhẹ (&lt; 100KB).
            </p>
          </div>

          <Link
            to="/admin/manage/backup"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Database size={15} />
            <span>Vào Trung Tâm Sao Lưu</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
