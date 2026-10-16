// ============================================================
// FILE: src/components/ui/ProfessionalEditor.jsx
// Trình soạn thảo văn bản chuyên nghiệp chuẩn Word / Google Docs
// Hỗ trợ: Căn lề, màu sắc, font, tiêu đề, thêm hình từ máy & thư viện
// ============================================================

import { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import {
  Image as ImageIcon, Upload, Folder, HelpCircle,
  FileText, Sparkles, Eye, Check
} from 'lucide-react';
import MediaLibraryModal from '../media/MediaLibraryModal';

export default function ProfessionalEditor({
  value,
  onChange,
  placeholder = "Bắt đầu soạn thảo nội dung bài viết chuyên nghiệp...",
  minHeight = 320
}) {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  // Khởi tạo Quill
  useEffect(() => {
    if (!containerRef.current || quillRef.current) return;

    // Tùy biến thanh công cụ chuyên nghiệp phong cách văn phòng
    const toolbarOptions = [
      [{ header: [1, 2, 3, 4, false] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ];

    const quill = new Quill(containerRef.current, {
      theme: 'snow',
      placeholder,
      modules: {
        toolbar: toolbarOptions
      }
    });

    quillRef.current = quill;

    if (value) {
      quill.root.innerHTML = value;
      updateStats(quill.getText());
    }

    quill.on('text-change', () => {
      const html = quill.root.innerHTML;
      const text = quill.getText();
      updateStats(text);
      onChangeRef.current(html === '<p><br></p>' ? '' : html);
    });

    return () => {
      quillRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateStats = (text) => {
    const clean = text.trim();
    setCharCount(clean.length);
    setWordCount(clean ? clean.split(/\s+/).length : 0);
  };

  // Đồng bộ khi value thay đổi từ ngoài
  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;

    const currentHtml = quill.root.innerHTML === '<p><br></p>' ? '' : quill.root.innerHTML;
    if (currentHtml === (value || '')) return;

    quill.off('text-change');
    quill.root.innerHTML = value || '<p><br></p>';
    updateStats(quill.getText());
    quill.on('text-change', () => {
      const html = quill.root.innerHTML;
      const text = quill.getText();
      updateStats(text);
      onChangeRef.current(html === '<p><br></p>' ? '' : html);
    });
  }, [value]);

  // Chèn ảnh vào vị trí con trỏ trong Quill
  const handleInsertImage = (url) => {
    const quill = quillRef.current;
    if (!quill) return;

    const range = quill.getSelection(true) || { index: quill.getLength(), length: 0 };
    quill.insertEmbed(range.index, 'image', url);
    quill.setSelection(range.index + 1);
  };

  return (
    <div className="flex flex-col border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-slate-900 transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
      
      {/* Top Banner Toolbar: Insert Media Shortcuts */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles size={13} className="text-amber-500" />
            Soạn Thảo Văn Bản Chuẩn Word
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-[11px] text-slate-500">
            Hỗ trợ căn lề, màu chữ, tiêu đề phân cấp và chèn hình ảnh
          </span>
        </div>

        {/* Nút chèn hình ảnh thông minh */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsMediaModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold rounded-lg border border-blue-200 dark:border-blue-800 transition-colors shadow-xs"
            title="Thêm hình ảnh vào giữa bài viết"
          >
            <ImageIcon size={13} />
            <span>Chèn Ảnh Vào Bài</span>
          </button>
        </div>
      </div>

      {/* Vùng chứa Editor Quill */}
      <div className="prose-editor-container flex-1 bg-white dark:bg-slate-900">
        <div
          ref={containerRef}
          style={{ minHeight }}
          className="text-slate-800 dark:text-slate-100 text-sm"
        />
      </div>

      {/* Bottom Bar: Thống kê từ, ký tự & trạng thái */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
        <div className="flex items-center gap-3">
          <span>Số từ: <strong className="text-slate-700 dark:text-slate-300">{wordCount}</strong></span>
          <span>Ký tự: <strong className="text-slate-700 dark:text-slate-300">{charCount}</strong></span>
          <span className="hidden sm:inline">Thời gian đọc dự kiến: ~{Math.max(1, Math.ceil(wordCount / 180))} phút</span>
        </div>
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
          <Check size={12} />
          <span>Sẵn sàng xuất bản</span>
        </div>
      </div>

      {/* Modal Thư Viện Media */}
      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelectImage={handleInsertImage}
        title="Chèn Hình Ảnh Vào Bài Viết"
      />

    </div>
  );
}
