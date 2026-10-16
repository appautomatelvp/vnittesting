// ============================================================
// FILE: src/App.jsx
// Cấu hình Router chính — Chế độ Trực quan Website mặc định
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './components/layout/AdminLayout';
import ErrorBoundary from './components/ErrorBoundary';

import LoginPage from './pages/LoginPage';
import VisualWebsiteEditor from './components/visual/VisualWebsiteEditor';
import DashboardPage from './pages/DashboardPage';
import NewsPage from './pages/NewsPage';
import ServicesPage from './pages/ServicesPage';
import ProjectsPage from './pages/ProjectsPage';
import SettingsPage from './pages/SettingsPage';
import ManualPage from './pages/ManualPage';
import LiveEditorPage from './pages/LiveEditorPage';
import BackupRestorePage from './pages/BackupRestorePage';
import MediaPage from './pages/MediaPage';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Main Admin Route: GIAO DIỆN TRỰC QUAN Y CHANG WEBSITE (MẶC ĐỊNH) */}
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <VisualWebsiteEditor />
                </PrivateRoute>
              }
            />

            {/* Secondary Table CRUD Routes (Bảng Quản trị truyền thống) */}
            <Route
              path="/admin/manage"
              element={
                <PrivateRoute>
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="live-editor" element={<LiveEditorPage />} />
              <Route path="news" element={<NewsPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="media" element={<MediaPage />} />
              <Route path="backup" element={<BackupRestorePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="manual" element={<ManualPage />} />
            </Route>

            {/* Legacy redirect for old URLs */}
            <Route path="/admin/backup" element={<Navigate to="/admin/manage/backup" replace />} />
            <Route path="/admin/media" element={<Navigate to="/admin/manage/media" replace />} />
            <Route path="/admin/news" element={<Navigate to="/admin/manage/news" replace />} />
            <Route path="/admin/services" element={<Navigate to="/admin/manage/services" replace />} />
            <Route path="/admin/projects" element={<Navigate to="/admin/manage/projects" replace />} />
            <Route path="/admin/settings" element={<Navigate to="/admin/manage/settings" replace />} />
            <Route path="/admin/manual" element={<Navigate to="/admin/manage/manual" replace />} />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
