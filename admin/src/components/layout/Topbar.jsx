// ============================================================
// FILE: src/components/layout/Topbar.jsx
// Thanh trên cùng - Avatar, tên admin, nút đăng xuất
// ============================================================

import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ onMenuClick }) {
  const { currentUser, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
      {/* Hamburger (mobile) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <Menu size={22} />
      </button>

      {/* Page title placeholder (responsive) */}
      <div className="hidden lg:block" />

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* User info */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[160px] truncate">
            {currentUser?.email}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200" />

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Đăng xuất</span>
        </button>
      </div>
    </header>
  );
}
