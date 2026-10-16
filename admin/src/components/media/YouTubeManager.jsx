// ============================================================
// FILE: src/components/media/YouTubeManager.jsx
// Trình Quản Lý & Nhúng Video YouTube Doanh Nghiệp VNIT
// ============================================================

import { useState, useEffect } from 'react';
import {
  Plus, Trash2, Copy, Check, ExternalLink, Play,
  Film, AlertCircle, Sparkles, Filter, Info
} from 'lucide-react';
import {
  extractYouTubeId, getYouTubeEmbedUrl, getYouTubeThumbnails,
  isValidYouTubeUrl, YoutubeIcon
} from '../../utils/youtubeUtils';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const LOCAL_STORAGE_YOUTUBE_KEY = 'vnit_custom_youtube_videos';
const FIRESTORE_SETTINGS_DOC = 'youtube_videos';

const PRESET_VIDEOS = [
  {
    id: 'yt-vnit-intro',
    videoId: 'dQw4w9WgXcQ', // Demo ID
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Giới Thiệu Năng Lực Kiểm Định & Hiệu Chuẩn Đo Lường VNIT',
    description: 'Video giới thiệu phòng thí nghiệm VILAS ISO/IEC 17025 và quy trình kiểm định tại hiện trường',
    category: 'gioi-thieu',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

export default function YouTubeManager({ onSelectVideo = null }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('dich-vu');
  const [previewId, setPreviewId] = useState(null);
  const [copiedId, setCopiedId] = useState('');
  const [activePlayerId, setActivePlayerId] = useState(null);
  const [filterCat, setFilterCat] = useState('all');

  // Tải danh sách video từ LocalStorage và Firestore
  useEffect(() => {
    async function loadVideos() {
      try {
        let loaded = [...PRESET_VIDEOS];

        // 1. Kiểm tra localStorage
        const raw = localStorage.getItem(LOCAL_STORAGE_YOUTUBE_KEY);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
              loaded = parsed;
            }
          } catch (e) {}
        }

        // 2. Kiểm tra Firestore settings/youtube_videos
        try {
          const docSnap = await getDoc(doc(db, 'settings', FIRESTORE_SETTINGS_DOC));
          if (docSnap.exists() && docSnap.data().videos) {
            loaded = docSnap.data().videos;
            localStorage.setItem(LOCAL_STORAGE_YOUTUBE_KEY, JSON.stringify(loaded));
          }
        } catch (e) {}

        setVideos(loaded);
      } catch (err) {
        console.warn('Lỗi tải video YouTube:', err);
      } finally {
        setLoading(false);
      }
    }
    loadVideos();
  }, []);

  // Lắng nghe URL thay đổi để tạo preview tức thì
  useEffect(() => {
    const vId = extractYouTubeId(inputUrl);
    setPreviewId(vId);
  }, [inputUrl]);

  // Lưu danh sách video vào cả LocalStorage và Firestore
  const saveVideosList = async (newList) => {
    setVideos(newList);
    localStorage.setItem(LOCAL_STORAGE_YOUTUBE_KEY, JSON.stringify(newList));
    try {
      await setDoc(doc(db, 'settings', FIRESTORE_SETTINGS_DOC), {
        videos: newList,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Không thể đồng bộ video lên Firestore:', e);
    }
  };

  // Xử lý thêm video mới
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const vId = extractYouTubeId(inputUrl);
    if (!vId) {
      alert('Vui lòng nhập đường dẫn YouTube hợp lệ (ví dụ: https://www.youtube.com/watch?v=...)');
      return;
    }

    const thumbs = getYouTubeThumbnails(vId);
    const newVideo = {
      id: 'yt-' + Date.now(),
      videoId: vId,
      url: inputUrl.trim(),
      title: title.trim() || `Video YouTube (${vId})`,
      description: description.trim(),
      category: category,
      thumbnail: thumbs.hq,
      createdAt: new Date().toISOString()
    };

    const updated = [newVideo, ...videos];
    await saveVideosList(updated);

    // Reset form
    setInputUrl('');
    setTitle('');
    setDescription('');
    setPreviewId(null);
    setIsAddOpen(false);
  };

  // Xóa video
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa video này khỏi danh sách?')) return;
    const updated = videos.filter(v => v.id !== id);
    await saveVideosList(updated);
  };

  // Sao chép mã nhúng iframe
  const handleCopyEmbed = (vId) => {
    const embedHtml = `<div class="vnit-video-wrapper" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;"><iframe src="https://www.youtube.com/embed/${vId}?rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe></div>`;
    navigator.clipboard.writeText(embedHtml);
    setCopiedId(vId);
    setTimeout(() => setCopiedId(''), 2200);
  };

  // Lọc video theo chuyên mục
  const filteredVideos = videos.filter(v => {
    if (filterCat === 'all') return true;
    return v.category === filterCat;
  });

  return (
    <div className="space-y-6">
      {/* HEADER & THÔNG BÁO ƯU TIÊN YOUTUBE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-red-600 via-red-500 to-amber-600 p-5 rounded-2xl text-white shadow-lg shadow-red-500/15">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shrink-0">
            <YoutubeIcon size={26} className="text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg">Quản Lý & Nhúng Video YouTube</h3>
            <p className="text-xs text-red-100 mt-0.5">
              Ưu tiên tải video lên YouTube & nhúng link để website hoạt động mượt mà, siêu tiết kiệm data
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 bg-white text-red-600 hover:bg-red-50 font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus size={16} />
          <span>Thêm Video YouTube Mới</span>
        </button>
      </div>

      {/* MODAL THÊM VIDEO MỚI */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <YoutubeIcon size={20} className="text-red-600" />
                <h4 className="font-extrabold text-slate-800 text-sm">Thêm Video YouTube Mới</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Đường dẫn Video YouTube <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube.com/watch?v=... hoặc https://youtu.be/..."
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Hỗ trợ cả link máy tính, điện thoại, shorts và link chia sẻ rút gọn.
                </p>
              </div>

              {/* XEM TRƯỚC VIDEO (PREVIEW TỨC THỜI) */}
              {previewId && (
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-black aspect-video relative">
                  <iframe
                    src={getYouTubeEmbedUrl(previewId)}
                    title="YouTube video player preview"
                    className="w-full h-full border-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề Video</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Quy trình hiệu chuẩn cảm biến đo lường tại giàn khoan"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Chuyên mục</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded-xl bg-white outline-none"
                  >
                    <option value="dich-vu">Dịch vụ kỹ thuật</option>
                    <option value="du-an">Dự án công trình</option>
                    <option value="nang-luc">Năng lực thiết bị</option>
                    <option value="gioi-thieu">Giới thiệu doanh nghiệp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú / Mô tả</label>
                  <input
                    type="text"
                    placeholder="Mô tả ngắn gọn..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={!previewId}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Lưu Video Vào Hệ Thống
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FILTER TABS */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'all', label: 'Tất cả Video' },
            { id: 'dich-vu', label: 'Dịch vụ' },
            { id: 'du-an', label: 'Dự án' },
            { id: 'nang-luc', label: 'Năng lực' },
            { id: 'gioi-thieu', label: 'Giới thiệu' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterCat(tab.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                filterCat === tab.id
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 font-medium">
          {filteredVideos.length} video sẵn sàng
        </span>
      </div>

      {/* GRID DANH SÁCH VIDEO YOUTUBE */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Film size={36} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-bold text-slate-700">Chưa có video nào trong danh mục này</p>
          <p className="text-xs text-slate-400 mt-1">Nhấn "Thêm Video YouTube Mới" để liên kết video đầu tiên</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* VIDEO PLAYER HOẶC THUMBNAIL */}
                <div className="aspect-video bg-black relative group overflow-hidden">
                  {activePlayerId === video.videoId ? (
                    <iframe
                      src={getYouTubeEmbedUrl(video.videoId, { autoplay: 1 })}
                      title={video.title}
                      className="w-full h-full border-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <img
                        src={video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setActivePlayerId(video.videoId)}
                        className="absolute inset-0 m-auto w-12 h-12 bg-red-600/90 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
                        title="Phát video ngay"
                      >
                        <Play size={20} className="ml-1 fill-white" />
                      </button>
                    </>
                  )}
                </div>

                {/* DETAILS */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-red-50 text-red-600 border border-red-200">
                      YouTube
                    </span>
                    <span className="text-[10px] text-slate-400">ID: {video.videoId}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 line-clamp-2 leading-snug mb-1">
                    {video.title}
                  </h4>
                  {video.description && (
                    <p className="text-xs text-slate-500 line-clamp-2">{video.description}</p>
                  )}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopyEmbed(video.videoId)}
                    className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                    title="Sao chép mã nhúng iframe để dán vào bài viết / website"
                  >
                    {copiedId === video.videoId ? (
                      <>
                        <Check size={14} className="text-emerald-600" />
                        <span className="text-emerald-600">Đã chép!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Mã nhúng</span>
                      </>
                    )}
                  </button>

                  <a
                    href={video.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors flex items-center gap-1 text-[11px]"
                    title="Mở trên YouTube"
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>

                <div className="flex items-center gap-1.5">
                  {onSelectVideo && (
                    <button
                      type="button"
                      onClick={() => onSelectVideo(video)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Chọn Video
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(video.id)}
                    className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                    title="Xóa video"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
