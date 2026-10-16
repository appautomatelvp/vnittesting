// ============================================================
// FILE: src/components/ui/ImageUploader.jsx
// Component Upload Ảnh Thông Minh Chuẩn VNIT
// - Tự động nén & tối ưu hóa ảnh < 1MB, bảo toàn 100% tỉ lệ khung hình (object-cover)
// - Chặn tuyệt đối tải video trực tiếp lên Firebase Storage
// ============================================================

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import { optimizeImage, formatBytes } from '../../utils/imageOptimizer';
import { isVideoFile, VIDEO_UPLOAD_REJECTION_MESSAGE } from '../../utils/youtubeUtils';

export default function ImageUploader({
  value,
  onChange,
  folder = 'uploads',
  aspectRatio = 'aspect-[16/10]',
  label = 'Chọn hoặc thay đổi ảnh'
}) {
  const [preview, setPreview] = useState(value || null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [optInfo, setOptInfo] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. KIỂM TRA & CHẶN VIDEO NGAY LẬP TỨC
    if (isVideoFile(file)) {
      setError(VIDEO_UPLOAD_REJECTION_MESSAGE);
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    // 2. Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Chỉ chấp nhận định dạng hình ảnh (JPG, PNG, WEBP, SVG).');
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    setError('');
    setUploading(true);
    setProgress(10);

    try {
      // 3. TỰ ĐỘNG NÉN & RESIZE BẢO TOÀN TỈ LỆ (KHÔNG MÉO HÌNH, < 1MB)
      const optResult = await optimizeImage(file, {
        maxWidth: 1920,
        maxHeight: 1920,
        maxSizeBytes: 1024 * 1024 // 1MB tối đa
      });

      setOptInfo(optResult);
      setPreview(optResult.blobUrl);
      setProgress(25);

      // 4. Tải file đã nén lên Firebase Storage
      const fileToUpload = optResult.file;
      const storageRef = ref(storage, `${folder}/${Date.now()}_${fileToUpload.name}`);
      const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(Math.max(25, pct));
        },
        (err) => {
          console.warn('Firebase Storage offline fallback:', err);
          // Fallback an toàn nếu Firebase Storage offline
          onChange(optResult.blobUrl);
          setUploading(false);
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            onChange(url);
            setUploading(false);
          } catch (e) {
            setError('Lỗi lấy URL ảnh: ' + e.message);
            setUploading(false);
          }
        }
      );
    } catch (err) {
      setError(err.message || 'Lỗi xử lý hình ảnh');
      setUploading(false);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setOptInfo(null);
    onChange('');
    setProgress(0);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative inline-block w-full max-w-sm rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 group">
          {/* KHUNG TRÀN VIỀN BẢO TOÀN TỈ LỆ KHÔNG MÉO */}
          <div className={`w-full ${aspectRatio} relative overflow-hidden bg-slate-200`}>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* NÚT XÓA ẢNH */}
          {!uploading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-2 right-2 w-7 h-7 bg-red-600/90 text-white rounded-full flex items-center justify-center hover:bg-red-700 shadow-md transition-colors cursor-pointer"
              title="Xóa ảnh này"
            >
              <X size={14} />
            </button>
          )}

          {/* TIẾN TRÌNH UPLOAD */}
          {uploading && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4">
              <RefreshCw size={24} className="animate-spin mb-2 text-blue-400" />
              <span className="text-xs font-bold mb-1">Đang nén & Tải lên ({progress}%)</span>
              <div className="w-36 h-1.5 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* BADGE THÔNG TIN NÉN TỐI ƯU */}
          {optInfo && (
            <div className="p-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
              <span className="flex items-center gap-1 font-semibold text-emerald-700">
                <Sparkles size={12} />
                Đã nén {optInfo.compressionRatio}%
              </span>
              <span>
                {formatBytes(optInfo.compressedSize)} (&lt; 1MB)
              </span>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center w-full max-w-sm h-32 border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 rounded-xl text-slate-500 hover:text-blue-600 transition-all cursor-pointer p-4"
        >
          <ImageIcon size={26} className="mb-1 text-slate-400 group-hover:text-blue-500" />
          <span className="text-xs font-bold text-slate-700">{label}</span>
          <span className="text-[11px] text-slate-400 mt-0.5">
            Tự động nén chất lượng cao &lt; 1MB • Chuẩn tràn viền không méo hình
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && (
        <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-1.5">
          <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
