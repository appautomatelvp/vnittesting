// ============================================================
// FILE: src/pages/DashboardPage.jsx
// Trang Tổng quan - Thống kê nhanh + Banner chào mừng + Nạp dữ liệu
// ============================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  collection, getCountFromServer, doc, setDoc, addDoc, serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  Newspaper, FolderKanban, Briefcase,
  BookOpen, Info, Database, CheckCircle2, Loader2
} from 'lucide-react';
import {
  initialServices, initialNews, initialProjects, initialSettings
} from '../data/initialData';

function StatCard({ icon: Icon, label, count, color }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">
          {count === null ? (
            <span className="inline-block w-8 h-6 bg-slate-200 rounded animate-pulse" />
          ) : count}
        </p>
        <p className="text-slate-500 text-sm">{label}</p>
      </div>
    </div>
  );
}

const quickLinks = [
  { to: '/admin/news',     label: 'Đăng bài viết',   icon: Newspaper,    color: 'text-blue-600 bg-blue-50 hover:bg-blue-100' },
  { to: '/admin/projects', label: 'Thêm dự án',       icon: FolderKanban, color: 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' },
  { to: '/admin/services', label: 'Quản lý dịch vụ', icon: Briefcase,    color: 'text-violet-600 bg-violet-50 hover:bg-violet-100' },
  { to: '/admin/manual',   label: 'Hướng dẫn',        icon: BookOpen,     color: 'text-amber-600 bg-amber-50 hover:bg-amber-100' },
];

export default function DashboardPage() {
  const [counts, setCounts] = useState({ news: null, projects: null, services: null });
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  const fetchCounts = async () => {
    try {
      const [newsSnap, projectsSnap, servicesSnap] = await Promise.all([
        getCountFromServer(collection(db, 'news')),
        getCountFromServer(collection(db, 'projects')),
        getCountFromServer(collection(db, 'services')),
      ]);
      setCounts({
        news: newsSnap.data().count,
        projects: projectsSnap.data().count,
        services: servicesSnap.data().count,
      });
    } catch {
      setCounts({ news: 0, projects: 0, services: 0 });
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const handleSeedData = async () => {
    if (!window.confirm('Hành động này sẽ nạp toàn bộ 7 Dịch vụ, 4 Tin tức, 4 Dự án và Cài đặt công ty từ website mẫu vào cơ sở dữ liệu Firebase. Bạn có muốn tiếp tục?')) {
      return;
    }

    setSeeding(true);
    try {
      // 1. Settings
      await setDoc(doc(db, 'settings', 'general'), initialSettings, { merge: true });

      // 2. Services
      for (const item of initialServices) {
        await addDoc(collection(db, 'services'), {
          ...item,
          createdAt: serverTimestamp()
        });
      }

      // 3. News
      for (const item of initialNews) {
        await addDoc(collection(db, 'news'), {
          ...item,
          createdAt: serverTimestamp()
        });
      }

      // 4. Projects
      for (const item of initialProjects) {
        await addDoc(collection(db, 'projects'), {
          ...item,
          createdAt: serverTimestamp()
        });
      }

      await fetchCounts();
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 5000);
    } catch (err) {
      alert('Lỗi nạp dữ liệu: ' + err.message);
    } finally {
      setSeeding(false);
    }
  };

  const isDatabaseEmpty = counts.services === 0 && counts.news === 0 && counts.projects === 0;

  return (
    <div>
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-6 text-white shadow-md">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Info size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold mb-1">
              Chào mừng đến với Hệ thống quản trị nội dung
            </h1>
            <p className="text-blue-100 text-sm leading-relaxed">
              Vui lòng xem tab <strong className="text-white">Hướng dẫn sử dụng</strong> nếu bạn mới làm quen với hệ thống này.
              Mọi thao tác đều có hướng dẫn chi tiết kèm theo.
            </p>
          </div>
        </div>
      </div>

      {/* Sync / Seed Data Banner if Database is Empty */}
      {isDatabaseEmpty && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 text-emerald-600">
                <Database size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-900 text-base">
                  Cơ sở dữ liệu Firebase hiện chưa có bài viết nào!
                </h3>
                <p className="text-emerald-700 text-sm mt-0.5">
                  Bạn có thể bấm nút bên phải để tự động đưa toàn bộ <strong>7 Dịch vụ, 4 Tin tức, 4 Dự án</strong> và thông tin công ty từ website mẫu vào hệ thống quản trị ngay bây giờ.
                </p>
              </div>
            </div>

            <button
              onClick={handleSeedData}
              disabled={seeding}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-medium text-sm rounded-xl transition-all shadow-sm flex-shrink-0 cursor-pointer"
            >
              {seeding ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Đang đồng bộ...</span>
                </>
              ) : (
                <>
                  <Database size={16} />
                  <span>Nạp dữ liệu từ Website vào Firebase</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Seed Success Alert */}
      {seedSuccess && (
        <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 text-sm font-medium">
          <CheckCircle2 size={18} className="text-green-600" />
          Đồng bộ thành công! Toàn bộ Dịch vụ, Tin tức, Dự án đã được nạp vào Firebase. Bạn có thể vào các menu bên trái để chỉnh sửa.
        </div>
      )}

      {/* Stats */}
      <h2 className="text-base font-semibold text-slate-700 mb-3">Thống kê nhanh</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Newspaper}    label="Tổng số bài viết" count={counts.news}     color="bg-blue-500" />
        <StatCard icon={FolderKanban} label="Tổng số dự án"    count={counts.projects} color="bg-emerald-500" />
        <StatCard icon={Briefcase}    label="Tổng số dịch vụ"  count={counts.services} color="bg-violet-500" />
      </div>

      {/* Quick links — dùng Link để điều hướng SPA, không reload trang */}
      <h2 className="text-base font-semibold text-slate-700 mb-3">Thao tác nhanh</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickLinks.map(({ to, label, icon: Icon, color }) => (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-200 transition-colors ${color}`}
          >
            <Icon size={22} />
            <span className="text-sm font-medium text-center">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
