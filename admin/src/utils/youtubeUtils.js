// ============================================================
// FILE: src/utils/youtubeUtils.js
// Tiện ích xử lý Video YouTube & Chặn upload file Video trực tiếp
// ============================================================

/**
 * Trích xuất YouTube Video ID từ bất kỳ định dạng link YouTube nào
 * Hỗ trợ:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 */
export function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null;
  const cleanUrl = url.trim();

  // Pattern tổng quát cho mọi dạng link YouTube
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = cleanUrl.match(regExp);

  if (match && match[1]) {
    return match[1];
  }

  // Trường hợp người dùng chỉ dán đúng 11 ký tự videoId
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
    return cleanUrl;
  }

  return null;
}

/**
 * Kiểm tra xem một URL có phải là link YouTube hợp lệ không
 */
export function isValidYouTubeUrl(url) {
  return extractYouTubeId(url) !== null;
}

/**
 * Lấy URL nhúng iframe YouTube chuẩn responsive
 */
export function getYouTubeEmbedUrl(urlOrId, options = {}) {
  const videoId = extractYouTubeId(urlOrId);
  if (!videoId) return '';

  const { autoplay = 0, rel = 0, mute = 0, controls = 1 } = options;
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    rel: rel ? '1' : '0',
    mute: mute ? '1' : '0',
    controls: controls ? '1' : '0',
    enablejsapi: '1'
  });

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

/**
 * Lấy các cấp độ ảnh đại diện (Thumbnail) từ YouTube
 */
export function getYouTubeThumbnails(urlOrId) {
  const videoId = extractYouTubeId(urlOrId);
  if (!videoId) return null;

  return {
    videoId,
    maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    mq: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    default: `https://img.youtube.com/vi/${videoId}/default.jpg`
  };
}

/**
 * Kiểm tra xem một file có phải là định dạng Video hay không
 * Dùng để ngăn chặn upload video trực tiếp lên Firebase Storage
 */
export function isVideoFile(file) {
  if (!file) return false;

  // Kiểm tra qua MIME type
  if (file.type && file.type.startsWith('video/')) {
    return true;
  }

  // Kiểm tra qua đuôi mở rộng của tệp
  const name = (file.name || '').toLowerCase();
  const videoExtensions = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.mkv', '.webm', '.m4v', '.3gp'];
  return videoExtensions.some(ext => name.endsWith(ext));
}

/**
 * Thông điệp từ chối khi người dùng cố gắng upload file video
 */
export const VIDEO_UPLOAD_REJECTION_MESSAGE = 
  'Hệ thống không cho phép tải trực tiếp file video lên máy chủ để tối ưu dung lượng lưu trữ và tốc độ website. ' +
  'Vui lòng tải video lên kênh YouTube của công ty và nhúng đường dẫn YouTube vào hệ thống!';

import React from 'react';

/**
 * Biểu tượng YouTube chuẩn SVG (Pure JS)
 */
export function YoutubeIcon({ size = 18, className = "" }) {
  return React.createElement(
    'svg',
    {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      className: className,
      style: { display: 'inline-block', verticalAlign: 'middle' }
    },
    React.createElement('path', {
      d: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'
    })
  );
}
