// ============================================================
// FILE: src/components/media/MediaLibraryModal.jsx
// Thư Viện Hình Ảnh & Quản Lý Album Chuẩn Website VNIT
// Tích hợp: Tạo Album Mới, Quản lý Album, Upload ảnh, Duyệt kho ảnh
// ============================================================

import { useState, useRef, useEffect } from 'react';
import {
  Upload, Search, Check, Copy, X, Folder, Image as ImageIcon,
  CheckCircle2, Sparkles, Filter, ExternalLink, HardDrive, Plus,
  FolderPlus, Trash2, ArrowLeft, Layers, Calendar, Tag
} from 'lucide-react';
import {
  getAllMediaItems, saveCustomUploadedMedia, getAllAlbums,
  createNewAlbum, deleteCustomAlbum, addImageToAlbum
} from '../../data/mediaGallery';
import { CATEGORY_GROUPS } from '../../data/categories';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import BatchImageUploader from './BatchImageUploader';
import YouTubeManager from './YouTubeManager';
import { isVideoFile, VIDEO_UPLOAD_REJECTION_MESSAGE, YoutubeIcon } from '../../utils/youtubeUtils';
import { optimizeImage } from '../../utils/imageOptimizer';

export default function MediaLibraryModal({
  isOpen,
  onClose,
  onSelectImage,
  title = "Thư Viện Hình Ảnh & Quản Lý Album VNIT"
}) {
  const [viewMode, setViewMode] = useState('gallery'); // 'gallery' | 'albums' | 'album_detail' | 'upload'
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState('');

  // Data
  const [items, setItems] = useState(getAllMediaItems());
  const [albums, setAlbums] = useState(getAllAlbums());

  // Modal tạo Album mới
  const [isCreateAlbumOpen, setIsCreateAlbumOpen] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newAlbumDesc, setNewAlbumDesc] = useState('');
  const [newAlbumCategory, setNewAlbumCategory] = useState('dich-vu');

  // Upload states
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  // Cập nhật lại dữ liệu khi mở modal
  useEffect(() => {
    if (isOpen) {
      setItems(getAllMediaItems());
      setAlbums(getAllAlbums());
      setSelectedCat('all');
      setViewMode('gallery');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Lọc items theo chuyên mục hoặc album
  const filteredItems = items.filter(item => {
    // Nếu đang xem chi tiết album
    if (viewMode === 'album_detail' && selectedAlbum) {
      const matchAlbum = (selectedAlbum.imageUrls && selectedAlbum.imageUrls.includes(item.url)) || item.albumId === selectedAlbum.id;
      const q = search.toLowerCase().trim();
      const matchQuery = !q || item.title.toLowerCase().includes(q) || item.url.toLowerCase().includes(q);
      return matchAlbum && matchQuery;
    }

    // Nếu đang ở thư viện ảnh tổng quát
    const matchCat = selectedCat === 'all' || item.category === selectedCat || (selectedCat === 'custom' && item.category === 'custom');
    const q = search.toLowerCase().trim();
    const matchQuery = !q ||
      item.title.toLowerCase().includes(q) ||
      item.url.toLowerCase().includes(q) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(q)));

    return matchCat && matchQuery;
  });

  const handleCopy = (url, e) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(''), 2000);
  };

  const handleSelect = (url) => {
    if (onSelectImage) {
      onSelectImage(url);
      onClose();
    }
  };

  // Tạo Album mới
  const handleCreateAlbumSubmit = (e) => {
    e?.preventDefault();
    if (!newAlbumTitle.trim()) {
      alert('Vui lòng nhập tên Album!');
      return;
    }
    const updated = createNewAlbum({
      title: newAlbumTitle,
      description: newAlbumDesc,
      categoryGroupId: newAlbumCategory,
      coverUrl: 'assets/images/banner-4-vnit-01.jpg'
    });
    setAlbums(getAllAlbums());
    setNewAlbumTitle('');
    setNewAlbumDesc('');
    setIsCreateAlbumOpen(false);
  };

  // Xóa Album
  const handleDeleteAlbum = (albumId, e) => {
    e?.stopPropagation();
    if (confirm('Bạn có chắc chắn muốn xóa Album này? (Các ảnh vẫn được giữ trong thư viện tổng)')) {
      deleteCustomAlbum(albumId);
      setAlbums(getAllAlbums());
      if (selectedAlbum?.id === albumId) {
        setSelectedAlbum(null);
        setViewMode('albums');
      }
    }
  };

  // Xử lý upload file từ máy tính
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isVideoFile(file)) {
      setUploadError(VIDEO_UPLOAD_REJECTION_MESSAGE);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploadError('Vui lòng chỉ chọn tệp hình ảnh (JPG, PNG, WEBP, SVG).');
      return;
    }

    setUploadError('');
    setUploading(true);
    setUploadProgress(15);

    try {
      // Tự động tối ưu hóa và nén giữ nguyên tỉ lệ < 1MB
      const optResult = await optimizeImage(file);
      const fileToUpload = optResult.file;

      const storageRef = ref(storage, `media/${Date.now()}_${fileToUpload.name}`);
      const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(Math.max(15, pct));
        },
        (err) => {
          console.warn('Firebase Storage offline fallback:', err);
          const dataUrl = optResult.blobUrl;
          const newItem = {
            id: 'custom-' + Date.now(),
            title: file.name.replace(/\.[^/.]+$/, ""),
            url: dataUrl,
            category: 'custom',
            albumId: selectedAlbum ? selectedAlbum.id : undefined,
            tags: ['upload', 'optimized', file.name],
            dimensions: `${optResult.width}x${optResult.height}`
          };
          saveCustomUploadedMedia(newItem);
          if (selectedAlbum) {
            addImageToAlbum(selectedAlbum.id, dataUrl);
          }
          setItems(getAllMediaItems());
          setAlbums(getAllAlbums());
          setSelectedImage(newItem);
          setUploading(false);
          if (selectedAlbum) {
            setViewMode('album_detail');
          } else {
            setViewMode('gallery');
            setSelectedCat('all');
          }
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            const newItem = {
              id: 'custom-' + Date.now(),
              title: file.name.replace(/\.[^/.]+$/, ""),
              url: downloadUrl,
              category: 'custom',
              albumId: selectedAlbum ? selectedAlbum.id : undefined,
              tags: ['upload', 'firebase', 'optimized', file.name],
              dimensions: `${optResult.width}x${optResult.height}`
            };
            saveCustomUploadedMedia(newItem);
            if (selectedAlbum) {
              addImageToAlbum(selectedAlbum.id, downloadUrl);
            }
            setItems(getAllMediaItems());
            setAlbums(getAllAlbums());
            setSelectedImage(newItem);
            setUploading(false);
            if (selectedAlbum) {
              setViewMode('album_detail');
            } else {
              setViewMode('gallery');
              setSelectedCat('all');
            }
          } catch (e) {
            setUploadError('Lỗi lấy đường dẫn ảnh: ' + e.message);
            setUploading(false);
          }
        }
      );
    } catch (optErr) {
      setUploadError(optErr.message || 'Lỗi nén ảnh');
      setUploading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'Tất Cả Ảnh (Toàn Kho)' },
    { id: 'banner', label: '1. Banner & Nền Trang Chủ' },
    { id: 'services', label: '2. Kỹ Thuật & Dịch Vụ' },
    { id: 'certificates', label: '3. Chứng Nhận VILAS/ISO' },
    { id: 'projects', label: '4. Dự Án Ngoài Khơi' },
    { id: 'clients', label: '5. Đối Tác & Khách Hàng' },
    { id: 'branding', label: '6. Logo & Nhận Diện VNIT' },
    { id: 'custom', label: '7. Ảnh Mới Tải Lên' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-[96vw] max-w-[1650px] h-[94vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* ============================================================ */}
        {/* HEADER                                                       */}
        {/* ============================================================ */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <ImageIcon size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                {title}
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {albums.length} Album • {items.length} Ảnh
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Tạo Album chủ đề, tải ảnh từ máy tính hoặc duyệt toàn bộ kho ảnh công nghiệp VNIT
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Nút Tạo Album Mới */}
            <button
              onClick={() => setIsCreateAlbumOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <FolderPlus size={14} />
              <span>+ Tạo Album Mới</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* THANH ĐIỀU HƯỚNG TABS & TÌM KIẾM                             */}
        {/* ============================================================ */}
        <div className="px-6 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 flex-shrink-0">
          
          {/* Main Action Tabs */}
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => { setViewMode('gallery'); setSelectedAlbum(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'gallery'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon size={14} />
              Kho Ảnh ({items.length})
            </button>

            <button
              onClick={() => { setViewMode('albums'); setSelectedAlbum(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'albums' || viewMode === 'album_detail'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Folder size={14} />
              Album ({albums.length})
            </button>

            <button
              onClick={() => setViewMode('batch_upload')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'batch_upload'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              <Layers size={14} />
              Tải Hàng Loạt (Nén &lt; 1MB)
            </button>

            <button
              onClick={() => setViewMode('youtube')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'youtube'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-red-400'
              }`}
            >
              <YoutubeIcon size={14} />
              Video YouTube
            </button>

            <button
              onClick={() => setViewMode('upload')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'upload'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Upload size={14} />
              Tải Đơn
            </button>
          </div>

          {/* Ô Tìm Kiếm */}
          {viewMode !== 'upload' && viewMode !== 'batch_upload' && viewMode !== 'youtube' && (
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm ảnh hoặc album theo tên..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* NỘI DUNG CHÍNH (CONTENT AREA)                                */}
        {/* ============================================================ */}

        {/* 1. CHẾ ĐỘ XEM DANH SÁCH ALBUM */}
        {viewMode === 'albums' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Folder className="text-amber-400" size={16} />
                  Bộ Sưu Tập Album Theo Chuyên Đề VNIT
                </h3>
                <p className="text-xs text-slate-400">
                  Nhấn vào bất kỳ Album nào để xem hình ảnh hoặc tải thêm ảnh vào Album đó
                </p>
              </div>

              <button
                onClick={() => setIsCreateAlbumOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
              >
                <Plus size={14} />
                <span>Thêm Album Mới</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {albums.map(alb => {
                const count = (alb.imageUrls && alb.imageUrls.length) || items.filter(i => i.albumId === alb.id).length || 0;
                return (
                  <div
                    key={alb.id}
                    onClick={() => {
                      setSelectedAlbum(alb);
                      setViewMode('album_detail');
                    }}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/80 transition-all cursor-pointer group flex flex-col justify-between shadow-lg"
                  >
                    <div>
                      {/* Album Cover */}
                      <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900 relative mb-3">
                        <img
                          src={alb.coverUrl || 'assets/images/banner-4-vnit-01.jpg'}
                          alt={alb.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-xs text-[11px] font-bold text-white border border-white/20">
                          {count} hình ảnh
                        </div>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1 mb-1">
                        {alb.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        {alb.description || 'Chưa có mô tả cho album này.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 mt-3 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
                        Xem chi tiết &rarr;
                      </span>
                      {alb.id.startsWith('album-custom-') && (
                        <button
                          onClick={(e) => handleDeleteAlbum(alb.id, e)}
                          title="Xóa album này"
                          className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. CHẾ ĐỘ XEM CHI TIẾT 1 ALBUM */}
        {viewMode === 'album_detail' && selectedAlbum && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Album Header Bar */}
            <div className="px-6 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode('albums')}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Album:
                    </span>
                    <h3 className="text-sm font-bold text-white">
                      {selectedAlbum.title}
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      ({filteredItems.length} ảnh)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {selectedAlbum.description}
                  </p>
                </div>
              </div>

              {/* Nút Upload trực tiếp vào Album này */}
              <button
                onClick={() => setViewMode('upload')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow transition-all cursor-pointer"
              >
                <Upload size={13} />
                <span>Tải Thêm Ảnh Vào Album Này</span>
              </button>
            </div>

            {/* Grid ảnh của Album */}
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 p-4 overflow-y-auto">
                {filteredItems.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-slate-500">
                    <ImageIcon size={40} className="stroke-slate-600 mb-2" />
                    <p className="text-sm font-medium">Chưa có ảnh nào trong Album này</p>
                    <button
                      onClick={() => setViewMode('upload')}
                      className="mt-3 px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold"
                    >
                      Tải Ảnh Vào Ngay
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredItems.map(item => {
                      const isSelected = selectedImage?.id === item.id || selectedImage?.url === item.url;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedImage(item)}
                          className={`group relative rounded-xl border overflow-hidden cursor-pointer bg-slate-950 transition-all ${
                            isSelected
                              ? 'ring-2 ring-blue-500 border-transparent shadow-lg shadow-blue-500/20'
                              : 'border-slate-800 hover:border-slate-600'
                          }`}
                        >
                          <div className="aspect-[4/3] w-full overflow-hidden bg-slate-900 flex items-center justify-center">
                            <img
                              src={item.url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                          <div className="p-2 bg-slate-900/90 border-t border-slate-800">
                            <p className="text-[11px] font-medium text-slate-200 truncate" title={item.title}>
                              {item.title}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow">
                              <Check size={14} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Preview Pane Bên Phải Khi Chọn Ảnh */}
              {selectedImage && (
                <div className="w-64 border-l border-slate-800 p-4 bg-slate-950/80 flex flex-col justify-between overflow-y-auto">
                  <div>
                    <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-700 bg-slate-900 mb-3">
                      <img src={selectedImage.url} alt="" className="w-full h-full object-contain" />
                    </div>
                    <h4 className="text-xs font-bold text-white mb-2">{selectedImage.title}</h4>
                    <button
                      onClick={(e) => handleCopy(selectedImage.url, e)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                    >
                      {copiedUrl === selectedImage.url ? (
                        <span className="text-emerald-400 font-bold">Đã chép link!</span>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Sao chép URL</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => handleSelect(selectedImage.url)}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                  >
                    <Check size={14} />
                    <span>Chọn Ảnh Này</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. CHẾ ĐỘ DUYỆT TẤT CẢ ẢNH THEO CHUYÊN MỤC */}
        {viewMode === 'gallery' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Phân loại Menu bên trái */}
            <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-slate-800 p-3 space-y-1 bg-slate-950/40 overflow-y-auto flex-shrink-0">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                Phân Loại Kho Ảnh
              </div>
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCat(c.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCat === c.id
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="truncate">{c.label}</span>
                  {selectedCat === c.id && <Check size={12} className="flex-shrink-0" />}
                </button>
              ))}

              <div className="pt-3 border-t border-slate-800 mt-3">
                <button
                  onClick={() => setViewMode('albums')}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 flex items-center gap-1.5 transition-colors"
                >
                  <Folder size={13} />
                  <span>Duyệt Theo Album ({albums.length})</span>
                </button>
              </div>
            </div>

            {/* Grid Ảnh */}
            <div className="flex-1 p-4 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-500">
                  <ImageIcon size={40} className="stroke-slate-600 mb-2" />
                  <p className="text-sm font-medium">Chưa có ảnh trong mục này</p>
                  <button
                    onClick={() => setViewMode('upload')}
                    className="mt-3 px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold"
                  >
                    Tải Ảnh Lên Ngay
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filteredItems.map(item => {
                    const isSelected = selectedImage?.id === item.id || selectedImage?.url === item.url;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedImage(item)}
                        className={`group relative rounded-xl border overflow-hidden cursor-pointer bg-slate-950 transition-all ${
                          isSelected
                            ? 'ring-2 ring-blue-500 border-transparent shadow-lg shadow-blue-500/20'
                            : 'border-slate-800 hover:border-slate-600'
                        }`}
                      >
                        <div className="aspect-[4/3] w-full overflow-hidden bg-slate-900 flex items-center justify-center">
                          <img
                            src={item.url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-2 bg-slate-900/90 border-t border-slate-800">
                          <p className="text-[11px] font-medium text-slate-200 truncate" title={item.title}>
                            {item.title}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow">
                            <Check size={14} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Chi Tiết & Preview Bên Phải */}
            {selectedImage && (
              <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-slate-800 p-4 bg-slate-950/80 flex flex-col justify-between overflow-y-auto">
                <div>
                  <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-700 bg-slate-900 mb-3">
                    <img src={selectedImage.url} alt="" className="w-full h-full object-contain" />
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1 line-clamp-2">{selectedImage.title}</h4>
                  <p className="text-[10px] text-slate-500 font-mono truncate mb-3">{selectedImage.url}</p>

                  <button
                    onClick={(e) => handleCopy(selectedImage.url, e)}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    {copiedUrl === selectedImage.url ? (
                      <span className="text-emerald-400 font-bold">Đã chép link!</span>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Sao chép URL</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => handleSelect(selectedImage.url)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                >
                  <Check size={14} />
                  <span>Chọn Ảnh Này</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* 4. CHẾ ĐỘ UPLOAD TỪ MÁY TÍNH */}
        {viewMode === 'upload' && (
          <div className="flex-1 p-8 flex flex-col items-center justify-center">
            <div className="max-w-md w-full p-8 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/60 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4 border border-blue-500/30">
                <HardDrive size={32} />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                Tải ảnh mới từ máy tính
              </h3>
              {selectedAlbum && (
                <div className="mb-3 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
                  Sẽ được thêm trực tiếp vào Album: {selectedAlbum.title}
                </div>
              )}
              <p className="text-xs text-slate-400 mb-6">
                Hỗ trợ định dạng JPG, PNG, WEBP, SVG dung lượng tối đa 10MB.
              </p>

              {uploading ? (
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Đang tải lên hệ thống...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Upload size={15} />
                    <span>Duyệt Chọn Tệp Ảnh Từ Máy Tính</span>
                  </button>
                </>
              )}

              {uploadError && (
                <p className="text-red-400 text-xs mt-3">{uploadError}</p>
              )}
            </div>
          </div>
        )}

        {/* 5. CHẾ ĐỘ TẢI HÀNG LOẠT (BATCH UPLOAD) NÉN < 1MB */}
        {viewMode === 'batch_upload' && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-900/50">
            <div className="max-w-3xl mx-auto">
              {selectedAlbum && (
                <div className="mb-4 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2">
                  <Folder size={15} />
                  <span>Ảnh tải lên sẽ tự động thêm vào Album: <strong>{selectedAlbum.title}</strong></span>
                </div>
              )}
              <BatchImageUploader
                selectedAlbum={selectedAlbum}
                onUploadSuccess={() => {
                  setItems(getAllMediaItems());
                  setAlbums(getAllAlbums());
                }}
              />
            </div>
          </div>
        )}

        {/* 6. CHẾ ĐỘ QUẢN LÝ VIDEO YOUTUBE */}
        {viewMode === 'youtube' && (
          <div className="flex-1 p-6 overflow-y-auto bg-slate-900/50">
            <div className="max-w-5xl mx-auto">
              <YouTubeManager
                onSelectVideo={(video) => {
                  if (onSelectImage) {
                    onSelectImage(video.thumbnail || video.url);
                  }
                  onClose();
                }}
              />
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* FOOTER                                                       */}
        {/* ============================================================ */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400 flex-shrink-0">
          <span>Hệ thống Quản lý Album & Tài nguyên Hình ảnh VNIT</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Đóng Lại
          </button>
        </div>

      </div>

      {/* ============================================================ */}
      {/* POPUP TẠO ALBUM MỚI                                          */}
      {/* ============================================================ */}
      {isCreateAlbumOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderPlus size={16} className="text-emerald-400" />
                Tạo Album Ảnh Mới
              </h3>
              <button
                onClick={() => setIsCreateAlbumOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateAlbumSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Tên Album *</label>
                <input
                  type="text"
                  value={newAlbumTitle}
                  onChange={(e) => setNewAlbumTitle(e.target.value)}
                  placeholder="Ví dụ: Đại Tu Thiết Bị Lô 01&02 Năm 2026..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Mô tả ngắn</label>
                <textarea
                  rows={2}
                  value={newAlbumDesc}
                  onChange={(e) => setNewAlbumDesc(e.target.value)}
                  placeholder="Tóm tắt nội dung các hình ảnh trong album này..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Thuộc Chuyên Mục Nào (WEBSITE VNIT NEW UPDATE)
                </label>
                <select
                  value={newAlbumCategory}
                  onChange={(e) => setNewAlbumCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {CATEGORY_GROUPS.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateAlbumOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md cursor-pointer"
                >
                  Lưu Album Mới
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
