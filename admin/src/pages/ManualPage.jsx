// ============================================================
// FILE: src/pages/ManualPage.jsx
// Trang Hướng dẫn sử dụng - Accordion + Download PDF
// ============================================================

import { useState } from 'react';
import { ChevronDown, Download, BookOpen } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';

const manualItems = [
  {
    id: 1,
    title: '📝 Cách đăng bài viết mới',
    content: [
      'Vào menu <strong>Tin tức</strong> ở thanh điều hướng bên trái.',
      'Nhấn nút <strong>"Thêm bài viết mới"</strong> (màu xanh, góc trên bên phải).',
      'Cửa sổ nhập liệu sẽ hiện ra. Nhập <strong>Tiêu đề (VI)</strong> — đây là trường bắt buộc.',
      'Nhấn vào tab <strong>🇬🇧 English</strong> để chuyển sang nhập tiêu đề và nội dung tiếng Anh.',
      'Phần <strong>Nội dung</strong>: Bạn có thể bôi đậm (B), in nghiêng (I), tạo danh sách, hoặc chèn link trong thanh công cụ soạn thảo.',
      'Nhấn vào ô vuông <strong>"Chọn ảnh"</strong> để tải ảnh đại diện lên — ảnh tối đa 5MB.',
      'Bật công tắc <strong>"Tin nổi bật trang chủ"</strong> nếu bạn muốn bài viết hiển thị nổi bật.',
      'Nhấn <strong>"Đăng bài"</strong> — bài viết sẽ xuất hiện ngay trên bảng danh sách.',
    ],
  },
  {
    id: 2,
    title: '✏️ Cách chỉnh sửa và xoá bài viết',
    content: [
      'Vào trang <strong>Tin tức</strong>, tìm bài viết cần chỉnh sửa trong bảng.',
      'Nhấn icon <strong>✏️ (bút chì)</strong> ở cột "Hành động" để mở form chỉnh sửa.',
      'Cập nhật nội dung và nhấn <strong>"Cập nhật"</strong> để lưu.',
      'Để xoá, nhấn icon <strong>🗑️ (thùng rác)</strong> — một hộp thoại xác nhận sẽ xuất hiện.',
      '<strong>Lưu ý:</strong> Thao tác xoá KHÔNG thể hoàn tác. Hãy chắc chắn trước khi xoá.',
    ],
  },
  {
    id: 3,
    title: '🖼️ Cách thay đổi ảnh / upload ảnh mới',
    content: [
      'Khi mở form chỉnh sửa, phần <strong>Ảnh đại diện</strong> hiển thị ảnh hiện tại.',
      'Nhấn vào nút <strong>X (màu đỏ)</strong> góc trên ảnh để xoá ảnh cũ.',
      'Nhấn vào ô <strong>"Chọn ảnh"</strong> để chọn ảnh mới từ máy tính.',
      'Ảnh sẽ được <strong>preview</strong> ngay lập tức — thanh tiến trình xanh hiển thị quá trình upload.',
      'Chờ đến khi thanh tiến trình đạt 100% rồi mới nhấn <strong>"Cập nhật"</strong>.',
      'Định dạng hỗ trợ: <strong>JPG, PNG, WEBP</strong>. Kích thước tối đa: <strong>5MB</strong>.',
    ],
  },
  {
    id: 4,
    title: '⚙️ Cách thay đổi thông tin công ty',
    content: [
      'Vào menu <strong>Cài đặt</strong> ở thanh điều hướng.',
      'Cập nhật các thông tin: Tên công ty, Hotline, Email, Địa chỉ.',
      'Mỗi thông tin có 2 ô: <strong>(VI)</strong> cho tiếng Việt và <strong>(EN)</strong> cho tiếng Anh.',
      'Sau khi nhập xong, nhấn nút <strong>"Lưu cài đặt"</strong>.',
      'Thông báo <strong>"Đã lưu thành công!"</strong> màu xanh lá sẽ xuất hiện bên cạnh nút.',
    ],
  },
  {
    id: 5,
    title: '🌐 Hiểu về hệ thống Song ngữ (Việt / Anh)',
    content: [
      'Website của công ty hiển thị nội dung bằng <strong>2 ngôn ngữ</strong>: Tiếng Việt và Tiếng Anh.',
      'Mỗi form nhập liệu đều có <strong>2 tab ngôn ngữ</strong>: 🇻🇳 Tiếng Việt và 🇬🇧 English.',
      'Bạn cần <strong>nhập đầy đủ cả 2 ngôn ngữ</strong> để website hiển thị đúng khi khách hàng chuyển ngôn ngữ.',
      'Nếu chỉ nhập tiếng Việt, phần tiếng Anh sẽ <strong>hiển thị trống</strong> với khách quốc tế.',
      '<strong>Trường bắt buộc</strong> chỉ yêu cầu Tiếng Việt (có dấu *).',
    ],
  },
  {
    id: 6,
    title: '🔑 Quên mật khẩu / Vấn đề đăng nhập',
    content: [
      'Nếu quên mật khẩu, liên hệ <strong>quản trị viên hệ thống</strong> để được cấp lại.',
      'Không chia sẻ mật khẩu với người khác.',
      'Sau khi làm việc xong, nhấn nút <strong>"Đăng xuất"</strong> ở góc trên bên phải.',
      'Nếu gặp lỗi <strong>"Quá nhiều lần thử"</strong>, hãy đợi 5 phút rồi thử lại.',
    ],
  },
];

function AccordionItem({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border border-slate-200 rounded-xl overflow-hidden transition-shadow ${open ? 'shadow-sm' : ''}`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-slate-50 transition-colors"
      >
        <span className="font-medium text-slate-800 text-sm">{item.title}</span>
        <ChevronDown
          size={18}
          className={`text-slate-400 flex-shrink-0 ml-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 bg-white border-t border-slate-100">
          <ol className="mt-4 space-y-2.5 list-decimal list-inside">
            {item.content.map((step, i) => (
              <li key={i} className="text-sm text-slate-600 leading-relaxed">
                <span dangerouslySetInnerHTML={{ __html: step }} />
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default function ManualPage() {
  return (
    <div>
      <PageHeader
        title="Hướng dẫn sử dụng"
        subtitle="Tài liệu hướng dẫn chi tiết dành cho nhân sự quản trị nội dung"
      />

      {/* Notice banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 flex items-start gap-4">
        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <BookOpen size={20} className="text-amber-600" />
        </div>
        <div>
          <p className="font-semibold text-amber-800 text-sm mb-1">Lưu ý quan trọng</p>
          <p className="text-amber-700 text-sm leading-relaxed">
            Mọi thay đổi trên hệ thống này sẽ được lưu vĩnh viễn vào cơ sở dữ liệu và hiển thị lên website
            ngay lập tức. Hãy kiểm tra kỹ trước khi lưu, đặc biệt khi xoá dữ liệu.
          </p>
        </div>
      </div>

      {/* Download button */}
      <div className="flex justify-end mb-4">
        <a
          href="#"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          onClick={e => e.preventDefault()}
        >
          <Download size={16} />
          Download PDF Hướng dẫn chi tiết
        </a>
      </div>

      {/* Accordion */}
      <div className="space-y-3">
        {manualItems.map(item => (
          <AccordionItem key={item.id} item={item} />
        ))}
      </div>

      {/* Support footer */}
      <div className="mt-8 p-5 bg-slate-50 border border-slate-200 rounded-xl text-center">
        <p className="text-sm text-slate-600">
          Cần hỗ trợ thêm? Liên hệ đội kỹ thuật qua email:{' '}
          <a href="mailto:support@venus.com" className="text-blue-600 font-medium hover:underline">
            support@venus.com
          </a>
        </p>
      </div>
    </div>
  );
}
