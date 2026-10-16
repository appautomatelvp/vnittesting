// ============================================================
// FILE: src/components/layout/Sidebar.jsx
// Sidebar menu điều hướng bên trái
// ============================================================

import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Newspaper,
  Briefcase,
  FolderKanban,
  Settings,
  BookOpen,
  X,
  Building2,
  Sparkles,
  ExternalLink,
  Database,
  ImagePlus
} from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Website Trực Quan (Click để Sửa)', icon: Sparkles, highlight: true },
  { to: '/admin/manage', label: 'Tổng quan & Thống kê', icon: LayoutDashboard, end: true },
  { to: '/admin/manage/services', label: 'Quản lý Dịch vụ (Bảng)', icon: Briefcase },
  { to: '/admin/manage/projects', label: 'Quản lý Dự án (Bảng)', icon: FolderKanban },
  { to: '/admin/manage/news', label: 'Quản lý Tin tức (Bảng)', icon: Newspaper },
  { to: '/admin/manage/media', label: 'Media & Video YouTube', icon: ImagePlus },
  { to: '/admin/manage/backup', label: 'Sao lưu & Phục hồi', icon: Database },
  { to: '/admin/manage/settings', label: 'Cài đặt Chung', icon: Settings },
  { to: '/admin/manage/manual', label: 'Hướng dẫn sử dụng', icon: BookOpen },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-slate-900 text-white z-30
          flex flex-col transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <Building2 size={20} />
            </div>
            <div>
              <p className="font-extrabold text-base tracking-wider leading-none text-white">CMS</p>
              <p className="text-slate-400 text-xs mt-1">Hệ thống quản trị</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Link to Website */}
        <div className="px-3 pt-3">
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-blue-300 bg-blue-950/60 border border-blue-800/50 rounded-lg hover:bg-blue-900/60 hover:text-white transition-all"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Xem Website (cổng 3000)
            </span>
            <ExternalLink size={13} />
          </a>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end, highlight }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : highlight
                    ? 'text-amber-300 bg-amber-950/30 hover:bg-amber-900/40 hover:text-amber-200'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                <span>{label}</span>
              </div>
              {highlight && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                  Live
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 text-slate-500 text-xs flex items-center justify-between">
          <span>CMS v2.0 Pro</span>
          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">VNIT</span>
        </div>
      </aside>
    </>
  );
}
