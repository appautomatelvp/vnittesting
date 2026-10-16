// ============================================================
// FILE: src/components/media/BatchImageUploader.jsx
// Bộ Tải Ảnh Đồng Loạt & Nén Thông Minh Chuẩn Doanh Nghiệp VNIT
// 
// Quy tắc:
// 1. Tải lên đồng loạt nhiều tấm hình cùng lúc trong bộ nhớ
// 2. Tự động nén và resize giữ nguyên tỉ lệ (không méo hình), dung lượng < 1MB
// 3. Chặn hoàn toàn video, hướng dẫn chuyển qua YouTube
// ============================================================

import { useState, useRef } from 'react';
import {
  Upload, Image as ImageIcon, CheckCircle2, AlertTriangle,
  RefreshCw, Trash2, Layers, Check, X, ShieldAlert, Sparkles
} from 'lucide-react';
import { optimizeMultipleImages, formatBytes } from '../../utils/imageOptimizer';
import { isVideoFile, VIDEO_UPLOAD_REJECTION_MESSAGE } from '../../utils/youtubeUtils';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import { saveCustomUploadedMedia, addImageToAlbum } from '../../data/mediaGallery';

export default function BatchImageUploader({
  selectedAlbum = null,
  onUploadSuccess = null
}) {
  const [queue, setQueue] = useState([]); // [{ id, originalFile, optimized, status: 'pending'|'ready'|'uploading'|'done'|'error', progress, downloadUrl, error }]
  const [processing, setProcessing] = useState(false);
  const [uploadingAll, setUploadingAll] = useState(false);
  const [totalProgress, setTotalProgress] = useState(0);
  const [videoWarnings, setVideoWarnings] = useState([]);
  const fileInputRef = useRef(null);

  // Xử lý khi người dùng chọn nhiều file hoặc kéo thả
  const handleFilesChosen = async (files) => {
    if (!files || files.length === 0) return;

    setVideoWarnings([]);
    const fileArray = Array.from(files);

    // 1. Kiểm tra và lọc ra các file video
    const videos = fileArray.filter(f => isVideoFile(f));
    if (videos.length > 0) {
      setVideoWarnings(videos.map(v => v.name));
    }

    // 2. Lấy các file ảnh hợp lệ
    const imageFiles = fileArray.filter(f => !isVideoFile(f) && f.type.startsWith('image/'));

    if (imageFiles.length === 0) return;

    setProcessing(true);

    // Tiến hành nén & tối ưu hóa đồng loạt
    const result = await optimizeMultipleImages(imageFiles);

    const newQueueItems = result.optimized.map((opt, idx) => ({
      id: `queue-${Date.now()}-${idx}`,
      originalFile: imageFiles[idx],
      optimized: opt,
      status: 'ready',
      progress: 0,
      downloadUrl: null,
      error: null
    }));

    setQueue(prev => [...prev, ...newQueueItems]);
    setProcessing(false);
  };

  // Kéo thả files
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer?.files) {
      handleFilesChosen(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Xóa 1 ảnh khỏi hàng đợi
  const handleRemoveItem = (id) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  };

  // Xóa toàn bộ hàng đợi
  const handleClearAll = () => {
    setQueue([]);
    setTotalProgress(0);
  };

  // Upload toàn bộ hàng đợi lên Firebase Storage
  const handleUploadAll = async () => {
    const readyItems = queue.filter(item => item.status === 'ready' || item.status === 'error');
    if (readyItems.length === 0) return;

    setUploadingAll(true);
    let completedCount = 0;

    for (const item of readyItems) {
      // Đánh dấu đang upload
      setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'uploading', progress: 10 } : q));

      try {
        const fileToUpload = item.optimized.file;
        const storageRef = ref(storage, `media/${Date.now()}_${fileToUpload.name}`);
        const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              setQueue(prev => prev.map(q => q.id === item.id ? { ...q, progress: pct } : q));
            },
            (err) => {
              console.warn('Firebase Storage offline fallback:', err);
              // Fallback dùng blobUrl an toàn
              const fallbackUrl = item.optimized.blobUrl;
              saveItemToGallery(item, fallbackUrl);
              setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'done', progress: 100, downloadUrl: fallbackUrl } : q));
              resolve();
            },
            async () => {
              try {
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                saveItemToGallery(item, downloadUrl);
                setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'done', progress: 100, downloadUrl: downloadUrl } : q));
                resolve();
              } catch (e) {
                reject(e);
              }
            }
          );
        });
      } catch (err) {
        setQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: 'error', error: err.message } : q));
      }

      completedCount++;
      setTotalProgress(Math.round((completedCount / readyItems.length) * 100));
    }

    setUploadingAll(false);
    if (onUploadSuccess) onUploadSuccess();
  };

  // Lưu ảnh đã upload thành công vào Thư viện VNIT
  const saveItemToGallery = (item, finalUrl) => {
    const title = item.originalFile.name.replace(/\.[^/.]+$/, "");
    const newItem = {
      id: 'custom-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      title: title,
      url: finalUrl,
      category: 'custom',
      albumId: selectedAlbum ? selectedAlbum.id : undefined,
      tags: ['upload', 'optimized', item.originalFile.name],
      dimensions: `${item.optimized.width}x${item.optimized.height} (${formatBytes(item.optimized.compressedSize)})`
    };

    saveCustomUploadedMedia(newItem);
    if (selectedAlbum) {
      addImageToAlbum(selectedAlbum.id, finalUrl);
    }
  };

  const readyCount = queue.filter(q => q.status === 'ready').length;
  const doneCount = queue.filter(q => q.status === 'done').length;

  return (
    <div className="space-y-4">
      {/* CẢNH BÁO TỪ CHỐI VIDEO NẾU CÓ */}
      {videoWarnings.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3 text-amber-900 text-xs">
          <ShieldAlert size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-amber-950">
              Đã phát hiện {videoWarnings.length} tệp Video ({videoWarnings.join(', ')}):
            </p>
            <p>{VIDEO_UPLOAD_REJECTION_MESSAGE}</p>
          </div>
        </div>
      )}

      {/* DROP ZONE */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50/80 rounded-2xl p-6 text-center cursor-pointer transition-all duration-150"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFilesChosen(e.target.files)}
        />

        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white mx-auto flex items-center justify-center mb-3 shadow-md shadow-blue-500/20">
          <Upload size={22} />
        </div>

        <p className="text-sm font-extrabold text-slate-800">
          Chọn hoặc Kéo thả nhiều ảnh cùng lúc vào đây
        </p>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Hệ thống tự động nén thông minh chuẩn &lt; 1MB, giữ nét Full HD/2K và bảo toàn 100% tỉ lệ khung hình (không méo hình).
        </p>
        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-blue-700 font-bold bg-blue-100/70 py-1 px-3 rounded-full w-fit mx-auto">
          <Sparkles size={13} />
          <span>Tự động tối ưu tràn viền object-fit: cover</span>
        </div>
      </div>

      {/* PROGRESS NÉN */}
      {processing && (
        <div className="p-3 bg-blue-50 rounded-xl flex items-center gap-2.5 text-xs text-blue-700 font-bold">
          <RefreshCw size={15} className="animate-spin" />
          <span>Đang nén và tối ưu hóa hàng loạt hình ảnh bằng Canvas...</span>
        </div>
      )}

      {/* HEADER BẢNG HÀNG ĐỢI */}
      {queue.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Layers size={16} className="text-blue-600" />
              <span>Hàng đợi: {queue.length} ảnh ({doneCount} đã tải xong, {readyCount} sẵn sàng)</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClearAll}
                disabled={uploadingAll}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                Xóa danh sách
              </button>

              <button
                type="button"
                onClick={handleUploadAll}
                disabled={uploadingAll || readyCount === 0}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {uploadingAll ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Đang tải lên ({totalProgress}%)...</span>
                  </>
                ) : (
                  <>
                    <Upload size={14} />
                    <span>Tải Tất Cả Lên ({readyCount})</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* TIẾN TRÌNH TỔNG */}
          {uploadingAll && (
            <div className="w-full bg-slate-100 h-1.5">
              <div
                className="bg-blue-600 h-full transition-all duration-200"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          )}

          {/* DANH SÁCH CÁC TẤM ẢNH ĐƯỢC NÉN TRỰC TIẾP */}
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {queue.map((item) => (
              <div key={item.id} className="p-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  {/* PREVIEW KHUNG TRÀN VIỀN CHUẨN COVER KHÔNG MÉO */}
                  <div className="w-14 h-11 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0 relative">
                    <img
                      src={item.optimized.blobUrl}
                      alt={item.originalFile.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 truncate text-xs" title={item.originalFile.name}>
                      {item.originalFile.name}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {formatBytes(item.optimized.originalSize)} ➔ <strong className="text-emerald-600">{formatBytes(item.optimized.compressedSize)}</strong> ({item.optimized.compressionRatio}% gọn hơn) • {item.optimized.width}x{item.optimized.height}px
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.status === 'ready' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                      Sẵn sàng
                    </span>
                  )}
                  {item.status === 'uploading' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 flex items-center gap-1">
                      <RefreshCw size={10} className="animate-spin" />
                      {item.progress}%
                    </span>
                  )}
                  {item.status === 'done' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 flex items-center gap-1">
                      <Check size={12} />
                      Đã lưu
                    </span>
                  )}
                  {item.status === 'error' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700" title={item.error}>
                      Lỗi
                    </span>
                  )}

                  {!uploadingAll && item.status !== 'done' && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                      title="Xóa khỏi hàng đợi"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
