// ============================================================
// FILE: src/components/PrivateRoute.jsx
// Bảo vệ các route nội bộ - Chưa đăng nhập sẽ redirect /login
// ============================================================

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth();

  // Đang kiểm tra trạng thái đăng nhập
  if (currentUser === undefined) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Đang tải...</p>
        </div>
      </div>
    );
  }

  return currentUser ? children : <Navigate to="/login" replace />;
}
