// ============================================================
// FILE: src/utils/imageOptimizer.js
// Bộ nén và tối ưu hóa hình ảnh thông minh phía Client
// Quy tắc:
// 1. Tự động resize kích thước tối đa (1920px) giữ nguyên 100% tỉ lệ gốc, không méo hình
// 2. Tự động nén chất lượng cao sang WebP / JPEG để dung lượng < 1MB (thường 150KB - 500KB)
// 3. Chặn triệt để file video, hướng dẫn người dùng qua YouTube
// ============================================================

import { isVideoFile, VIDEO_UPLOAD_REJECTION_MESSAGE } from './youtubeUtils';

/**
 * Định dạng dung lượng byte thành chuỗi dễ đọc (KB, MB)
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Nén và tối ưu hóa 1 file ảnh trước khi upload
 * @param {File} file File ảnh được chọn từ input
 * @param {Object} options Cấu hình (maxWidth, maxHeight, maxSizeBytes, quality)
 * @returns {Promise<Object>} Thông tin ảnh đã nén kèm File mới
 */
export async function optimizeImage(file, options = {}) {
  // 1. CHẶN NẾU LÀ TỆP VIDEO
  if (isVideoFile(file)) {
    throw new Error(VIDEO_UPLOAD_REJECTION_MESSAGE);
  }

  // 2. Kiểm tra nếu không phải ảnh
  if (!file.type.startsWith('image/')) {
    throw new Error('Tệp không đúng định dạng hình ảnh (chỉ chấp nhận JPG, PNG, WEBP, SVG).');
  }

  // 3. Nếu là file SVG, giữ nguyên vẹn vì là vector
  if (file.type === 'image/svg+xml') {
    return {
      file: file,
      blobUrl: URL.createObjectURL(file),
      originalSize: file.size,
      compressedSize: file.size,
      width: 'Vector',
      height: 'Vector',
      compressionRatio: 0,
      format: 'svg'
    };
  }

  const {
    maxWidth = 1920,
    maxHeight = 1920,
    maxSizeBytes = 1024 * 1024, // 1MB tối đa theo yêu cầu
    initialQuality = 0.88,
    preferredFormat = 'image/webp'
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Không thể đọc tệp hình ảnh.'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Tệp ảnh bị lỗi hoặc không thể giải mã.'));
      img.onload = async () => {
        try {
          let origWidth = img.naturalWidth || img.width;
          let origHeight = img.naturalHeight || img.height;

          // Tính toán kích thước mới đảm bảo KHÔNG ĐỔI TỈ LỆ (giữ nguyên aspect ratio)
          let targetWidth = origWidth;
          let targetHeight = origHeight;

          if (origWidth > maxWidth || origHeight > maxHeight) {
            const widthRatio = maxWidth / origWidth;
            const heightRatio = maxHeight / origHeight;
            const ratio = Math.min(widthRatio, heightRatio);

            targetWidth = Math.round(origWidth * ratio);
            targetHeight = Math.round(origHeight * ratio);
          }

          // Tạo Canvas và vẽ ảnh với thuật toán làm mịn mượt mà
          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d', { alpha: true });

          // Cấu hình chất lượng nội suy cao nhất
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          // Hàm phụ tạo Blob với chất lượng động để đảm bảo < 1MB
          let currentQuality = initialQuality;
          let blob = null;

          // Thử xuất với WebP trước
          const getBlobPromise = (q, mime) => new Promise(res => canvas.toBlob(res, mime, q));

          let mimeType = preferredFormat;
          blob = await getBlobPromise(currentQuality, mimeType);

          // Nếu trình duyệt không hỗ trợ WebP hoặc kết quả null -> chuyển sang JPEG
          if (!blob) {
            mimeType = 'image/jpeg';
            blob = await getBlobPromise(currentQuality, mimeType);
          }

          // Vòng lặp giảm chất lượng thông minh nếu ảnh vẫn vượt quá 1MB
          let attempts = 0;
          while (blob && blob.size > maxSizeBytes && attempts < 5 && currentQuality > 0.5) {
            attempts++;
            currentQuality -= 0.08;
            blob = await getBlobPromise(currentQuality, mimeType);
          }

          // Nếu vẫn vượt quá 1MB sau khi giảm chất lượng, scale giảm kích thước thêm 15%
          if (blob && blob.size > maxSizeBytes) {
            const smallerCanvas = document.createElement('canvas');
            smallerCanvas.width = Math.round(targetWidth * 0.82);
            smallerCanvas.height = Math.round(targetHeight * 0.82);
            const smallCtx = smallerCanvas.getContext('2d');
            smallCtx.imageSmoothingEnabled = true;
            smallCtx.imageSmoothingQuality = 'high';
            smallCtx.drawImage(canvas, 0, 0, smallerCanvas.width, smallerCanvas.height);
            blob = await new Promise(res => smallerCanvas.toBlob(res, mimeType, 0.8));
          }

          if (!blob) {
            throw new Error('Lỗi xuất dữ liệu nén ảnh.');
          }

          // Tạo tên file mới với đuôi phù hợp
          const extension = mimeType === 'image/webp' ? '.webp' : '.jpg';
          const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
          const cleanName = originalName.replace(/[^a-zA-Z0-9_-]/g, '_');
          const newFileName = `${cleanName}_opt${extension}`;

          const optimizedFile = new File([blob], newFileName, {
            type: mimeType,
            lastModified: Date.now()
          });

          const compressedSize = optimizedFile.size;
          const compressionRatio = Math.round(((file.size - compressedSize) / file.size) * 100);

          resolve({
            file: optimizedFile,
            blobUrl: URL.createObjectURL(blob),
            originalName: file.name,
            optimizedName: newFileName,
            originalSize: file.size,
            compressedSize: compressedSize,
            width: targetWidth,
            height: targetHeight,
            compressionRatio: Math.max(0, compressionRatio),
            format: mimeType === 'image/webp' ? 'WebP' : 'JPEG',
            isUnderLimit: compressedSize <= maxSizeBytes
          });
        } catch (err) {
          reject(err);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Xử lý nén đồng loạt nhiều ảnh một lúc
 * @param {FileList|File[]} files Danh sách file
 * @param {Function} onProgress Callback báo cáo tiến trình (completed, total, currentResult)
 */
export async function optimizeMultipleImages(files, onProgress = null) {
  const fileArray = Array.from(files);
  const results = {
    optimized: [],
    rejectedVideos: [],
    errors: []
  };

  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i];

    if (isVideoFile(file)) {
      results.rejectedVideos.push({
        fileName: file.name,
        size: file.size,
        reason: VIDEO_UPLOAD_REJECTION_MESSAGE
      });
      if (onProgress) onProgress(i + 1, fileArray.length, null);
      continue;
    }

    try {
      const optResult = await optimizeImage(file);
      results.optimized.push(optResult);
      if (onProgress) onProgress(i + 1, fileArray.length, optResult);
    } catch (err) {
      results.errors.push({
        fileName: file.name,
        error: err.message
      });
      if (onProgress) onProgress(i + 1, fileArray.length, null);
    }
  }

  return results;
}
