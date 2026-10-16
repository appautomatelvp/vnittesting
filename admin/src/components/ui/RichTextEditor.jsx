// ============================================================
// FILE: src/components/ui/RichTextEditor.jsx
// Vanilla Quill wrapper — không dùng react-quill, tương thích React 19
// ============================================================

import { useEffect, useRef } from 'react';
import Quill from 'quill';

export default function RichTextEditor({ value, onChange, placeholder }) {
  const holderRef = useRef(null);     // div React render (Quill toolbar + editor gắn vào đây)
  const quillRef = useRef(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Khởi tạo Quill 1 lần duy nhất
  useEffect(() => {
    if (!holderRef.current || quillRef.current) return;

    // Import CSS động để tránh side-effect lúc module load
    import('quill/dist/quill.snow.css');

    const quill = new Quill(holderRef.current, {
      theme: 'snow',
      placeholder: placeholder || 'Nhập nội dung...',
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'blockquote'],
          ['clean'],
        ],
      },
    });

    quillRef.current = quill;

    // Set giá trị ban đầu
    if (value) {
      quill.root.innerHTML = value;
    }

    // Lắng nghe thay đổi
    quill.on('text-change', () => {
      const html = quill.root.innerHTML;
      onChangeRef.current(html === '<p><br></p>' ? '' : html);
    });

    // Cleanup: chỉ huỷ reference, không xoá DOM (React tự xử lý)
    return () => {
      quillRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Đồng bộ khi value thay đổi từ bên ngoài (chuyển tab ngôn ngữ)
  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;

    const current = quill.root.innerHTML === '<p><br></p>' ? '' : quill.root.innerHTML;
    if (current === (value || '')) return;

    // Tắt listener, set HTML, bật lại
    quill.off('text-change');
    quill.root.innerHTML = value || '<p><br></p>';
    quill.on('text-change', () => {
      const html = quill.root.innerHTML;
      onChangeRef.current(html === '<p><br></p>' ? '' : html);
    });
  }, [value]);

  return (
    <div
      className="border border-slate-300 rounded-lg overflow-hidden
                 focus-within:ring-2 focus-within:ring-blue-500
                 focus-within:border-blue-500 transition-shadow"
    >
      {/* Quill sẽ gắn toolbar + editor vào div này — React KHÔNG render children bên trong */}
      <div ref={holderRef} style={{ minHeight: 200 }} />
    </div>
  );
}
