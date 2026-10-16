// ============================================================
// FILE: src/components/ErrorBoundary.jsx
// Bắt lỗi runtime — hiện thông báo thân thiện thay vì màn hình trắng
// ============================================================

import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-8 max-w-md w-full text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} className="text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">
              Đã xảy ra lỗi
            </h2>
            <p className="text-slate-500 text-sm mb-2">
              Hệ thống gặp sự cố không mong muốn.
            </p>
            <details className="text-left text-xs text-slate-400 bg-slate-50 rounded-lg p-3 mb-5 overflow-auto max-h-32">
              <summary className="cursor-pointer font-medium text-slate-500 mb-1">Chi tiết lỗi</summary>
              {this.state.error?.message}
            </details>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <RefreshCw size={15} />
              Tải lại trang
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
