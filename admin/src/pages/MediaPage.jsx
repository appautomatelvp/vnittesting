// ============================================================
// FILE: src/pages/MediaPage.jsx
// Trang Quản Lý Tài Nguyên Đa Phương Tiện & Video YouTube VNIT
// ============================================================

import { useState } from 'react';
import { Image as ImageIcon, Layers, Sparkles } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import BatchImageUploader from '../components/media/BatchImageUploader';
import YouTubeManager from '../components/media/YouTubeManager';
import { getAllMediaItems, getAllAlbums } from '../data/mediaGallery';
import { YoutubeIcon } from '../utils/youtubeUtils';

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState('batch_upload'); // 'batch_upload' | 'youtube' | 'gallery'
  const [items, setItems] = useState(getAllMediaItems());
  const [albums, setAlbums] = useState(getAllAlbums());

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Quản Lý Đa Phương Tiện & Video YouTube"
        subtitle="Upload hàng loạt ảnh tự động nén &lt; 1MB, quản lý album và nhúng video YouTube tối ưu hóa tốc độ"
      />

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab('batch_upload')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'batch_upload'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers size={16} />
          <span>Upload Hàng Loạt (Nén Thông Minh &lt; 1MB)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('youtube')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'youtube'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-slate-600 hover:text-red-600'
          }`}
        >
          <YoutubeIcon size={16} />
          <span>Quản Lý Video YouTube</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gallery')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'gallery'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ImageIcon size={16} />
          <span>Kho Ảnh & Albums ({items.length})</span>
        </button>
      </div>

      {/* TAB 1: BATCH UPLOAD */}
      {activeTab === 'batch_upload' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="max-w-3xl mx-auto">
            <div className="mb-4">
              <h3 className="font-extrabold text-slate-800 text-base">Tải Nhiều Hình Ảnh Cùng Lúc Vào Bộ Nhớ</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kéo thả nhiều ảnh cùng lúc. Hệ thống tự động nén giữ trọn độ nét Full HD, dung lượng &lt; 1MB và tự động tràn viền không méo hình.
              </p>
            </div>
            <BatchImageUploader
              onUploadSuccess={() => {
                setItems(getAllMediaItems());
                setAlbums(getAllAlbums());
              }}
            />
          </div>
        </div>
      )}

      {/* TAB 2: YOUTUBE MANAGER */}
      {activeTab === 'youtube' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <YouTubeManager />
        </div>
      )}

      {/* TAB 3: GALLERY PREVIEW */}
      {activeTab === 'gallery' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="group rounded-xl border border-slate-200 overflow-hidden bg-slate-50 hover:shadow-md transition-shadow"
              >
                {/* KHUNG TRÀN VIỀN CHUẨN COVER */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-bold text-slate-800 truncate" title={item.title}>
                    {item.title}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                    {item.dimensions || 'Chuẩn web'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
