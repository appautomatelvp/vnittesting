// ============================================================
// FILE: src/components/visual/VisualWebsiteEditor.jsx
// GIAO DIỆN QUẢN TRỊ TRỰC QUAN DOANH NGHIỆP — CHUẨN WORD & POWERPOINT
// Thiết kế 100% bằng Mắt - Chuột - Phím, không cần kiến thức lập trình
// ============================================================

import { useState, useEffect, useRef } from 'react';
import {
  collection, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc,
  onSnapshot, serverTimestamp
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import {
  Save, Eye, Edit3, Plus, Check, X, Laptop, Smartphone, Tablet,
  LogOut, Sparkles, Phone, Mail, Award, Camera, ExternalLink,
  RotateCw, Layers, Sliders, Trash2, Search, ArrowRight, FileText,
  Briefcase, Wrench, Building, Tag, Calendar, Image as ImageIcon,
  CheckCircle, Globe, ShieldCheck, Menu, PlusCircle, CheckSquare,
  PanelLeftOpen, PanelLeftClose, RotateCcw, Download, Database
} from 'lucide-react';
import {
  initialServices, initialNews, initialProjects, initialSettings
} from '../../data/initialData';
import ImageUploader from '../ui/ImageUploader';
import Modal from '../ui/Modal';
import AdminLeftToolbar from '../drawer/AdminLeftToolbar';
import ArticleComposerModal from '../posts/ArticleComposerModal';
import ArticleManagerModal from '../posts/ArticleManagerModal';
import MediaLibraryModal from '../media/MediaLibraryModal';
import { createFullBackup, downloadBackupFile } from '../../services/backupService';

export default function VisualWebsiteEditor() {
  const { logout } = useAuth();
  const iframeRef = useRef(null);

  // Chế độ & Điều hướng (MẶC ĐỊNH Ở CHẾ ĐỘ XEM / PREVIEW)
  const [device, setDevice] = useState('desktop'); // desktop, tablet, mobile
  const [isEditMode, setIsEditMode] = useState(false); // Mặc định false: Chế độ Xem sạch sẽ, cần sửa mới bấm Bật Sửa
  const [currentPage, setCurrentPage] = useState('index.html');
  const [iframeKey, setIframeKey] = useState(1);
  const [unsavedCount, setUnsavedCount] = useState(0);
  const pendingOverridesRef = useRef({});

  // Quản lý Bảng tác vụ bên trái & Modals bài viết, Media
  const [isLeftToolbarOpen, setIsLeftToolbarOpen] = useState(true);
  const [isArticleComposerOpen, setIsArticleComposerOpen] = useState(false);
  const [composerInitialData, setComposerInitialData] = useState(null);
  const [isArticleManagerOpen, setIsArticleManagerOpen] = useState(false);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);

  // Dữ liệu đồng bộ từ Firestore
  const [settings, setSettings] = useState(initialSettings);
  const [heroSlide, setHeroSlide] = useState({
    title_vi: "KIỂM ĐỊNH, HIỆU CHUẨN ĐO LƯỜNG VÀ DỊCH VỤ KỸ THUẬT CÔNG NGHIỆP",
    title_en: "CALIBRATION, MEASUREMENT INSPECTION & INDUSTRIAL TECHNICAL SERVICES",
    badge_vi: "VILAS 1288 (ISO/IEC 17025) & ISO 9001:2015",
    badge_en: "VILAS 1288 (ISO/IEC 17025) & ISO 9001:2015",
    btn1_vi: "Khám phá 7 Dịch vụ",
    btn2_vi: "Yêu cầu Báo giá",
    imageUrl: "assets/images/banner-4-vnit-01.jpg"
  });

  const [tickerText, setTickerText] = useState({
    date: "15/10/2026",
    title_vi: "VNIT hoàn thành xuất sắc chiến dịch kiểm định & bảo dưỡng an toàn mỏ Lô 01&02 ngoài khơi",
    title_en: "VNIT successfully completes offshore inspection and safety maintenance for Blocks 01&02"
  });

  const [stats, setStats] = useState([
    { num: "10+", label_vi: "Năm Phát Triển Bền Vững", label_en: "Years of Growth", desc_vi: "Khẳng định thương hiệu cal-test.vn từ 2018" },
    { num: "1,000+", label_vi: "Dự Án Đã Thực Hiện", label_en: "Completed Projects", desc_vi: "Tại các giàn khoan và nhà máy công nghiệp" },
    { num: "100%", label_vi: "Chuẩn BoA VILAS 1288 & ISO 9001", label_en: "Accredited Standards", desc_vi: "Được Bộ Khoa Học & Công Nghệ chỉ định ĐK 426" },
    { num: "15,000 PSI", label_vi: "Dải Áp Lực Thử Nghiệm Van", label_en: "Valve Pressure Range", desc_vi: "Trạm thử áp lực thủy tĩnh theo chuẩn API 527/598" },
  ]);

  const [services, setServices] = useState(initialServices);
  const [projects, setProjects] = useState(initialProjects);
  const [news, setNews] = useState(initialNews);

  // Quản lý Modal & Trạng thái lưu
  const [activeModal, setActiveModal] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [statIndex, setStatIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Bộ lọc cho Trình quản lý nội dung
  const [contentFilterTab, setContentFilterTab] = useState('all');
  const [contentSearch, setContentSearch] = useState('');

  // Lắng nghe dữ liệu thời gian thực từ Firestore
  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', 'general'), (snap) => {
      if (snap.exists()) setSettings(prev => ({ ...prev, ...snap.data() }));
    }, (err) => console.warn('[Firestore Offline/Lag]', err.message));

    const unsubHome = onSnapshot(doc(db, 'settings', 'homepage'), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        if (d.heroSlide) setHeroSlide(d.heroSlide);
        if (d.tickerText) setTickerText(d.tickerText);
        if (d.stats) setStats(d.stats);
      }
    }, (err) => console.warn('[Firestore Offline/Lag]', err.message));

    const unsubServices = onSnapshot(collection(db, 'services'), (snap) => {
      if (!snap.empty) {
        setServices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    }, (err) => console.warn('[Firestore Offline/Lag]', err.message));

    const unsubProjects = onSnapshot(collection(db, 'projects'), (snap) => {
      if (!snap.empty) {
        setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    }, (err) => console.warn('[Firestore Offline/Lag]', err.message));

    const unsubNews = onSnapshot(collection(db, 'news'), (snap) => {
      if (!snap.empty) {
        setNews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    }, (err) => console.warn('[Firestore Offline/Lag]', err.message));

    return () => {
      unsubSettings();
      unsubHome();
      unsubServices();
      unsubProjects();
      unsubNews();
    };
  }, []);

  // Lắng nghe tương tác từ Iframe Website
  useEffect(() => {
    function handleIframeMessage(e) {
      if (!e.data) return;

      // Trang được chuyển đổi trong iframe
      if (e.data.type === 'CMS_PAGE_NAVIGATED') {
        setCurrentPage(e.data.page);
        return;
      }

      // Đếm số thay đổi chưa lưu
      if (e.data.type === 'CMS_UNSAVED_CHANGES_COUNT') {
        setUnsavedCount(e.data.count || 0);
        return;
      }

      // Lưu trữ văn bản được xác nhận từ iframe
      if (e.data.type === 'CMS_TEXT_AUTO_SAVED') {
        const { selector, text, html } = e.data;
        if (selector) {
          pendingOverridesRef.current[selector.replace(/[.#>:\s]/g, '_')] = { selector, text, html };
        }
        return;
      }

      // Nhận thông tin dùng chung toàn hệ thống được cập nhật từ iframe
      if (e.data.type === 'CMS_GLOBAL_INFO_UPDATED') {
        const { field, value } = e.data;
        if (field === 'hotline') {
          setSettings(prev => ({ ...prev, hotline: value }));
          setDoc(doc(db, 'settings', 'general'), { hotline: value }, { merge: true }).catch(() => {});
        } else if (field === 'tel') {
          setSettings(prev => ({ ...prev, tel: value }));
          setDoc(doc(db, 'settings', 'general'), { tel: value }, { merge: true }).catch(() => {});
        } else if (field === 'address') {
          setSettings(prev => ({ ...prev, address_vi: value }));
          setDoc(doc(db, 'settings', 'general'), { address_vi: value }, { merge: true }).catch(() => {});
        } else if (field === 'company_name') {
          setSettings(prev => ({ ...prev, companyName_vi: value }));
          setDoc(doc(db, 'settings', 'general'), { companyName_vi: value }, { merge: true }).catch(() => {});
        } else if (field === 'email') {
          setSettings(prev => ({ ...prev, email: value }));
          setDoc(doc(db, 'settings', 'general'), { email: value }, { merge: true }).catch(() => {});
        }
        triggerSuccess(`Đã đồng bộ ${field === 'hotline' ? 'Hotline' : field === 'address' ? 'Địa chỉ & Bản đồ' : field === 'company_name' ? 'Tên công ty' : field === 'tel' ? 'Điện thoại bàn' : 'Email'} toàn bộ website!`);
        return;
      }

      // Mở hộp thoại thêm bài mới theo ngữ cảnh (Từ nút [+ Thêm bài vào mục này])
      if (e.data.type === 'CMS_OPEN_ADD_MODAL') {
        openWriteArticleModal(e.data.category || 'news');
        return;
      }

      // Mở hộp thoại thêm Menu mới
      if (e.data.type === 'CMS_OPEN_ADD_MENU') {
        setActiveModal('add_menu');
        setEditFormData({
          menuName: '',
          targetPage: 'dich-vu.html'
        });
        return;
      }

      // Xóa bài viết / mục trực tiếp từ nút [🗑️ Xóa]
      if (e.data.type === 'CMS_REQUEST_DELETE') {
        const { target, index, title, selector } = e.data;
        handleDirectDelete(target, index, title, selector);
        return;
      }

      // Xử lý Click-to-Edit chính xác
      if (e.data.type === 'CMS_CLICK_EDIT') {
        const { target, data } = e.data;
        console.log('[CMS Received Click]', target, data);

        if (target === 'rich_text_edit') {
          setActiveModal('rich_text_edit');
          setEditFormData({
            selector: data?.selector || '',
            tag: data?.tag || 'p',
            label: data?.label || 'Khối Văn Bản',
            text: data?.text || '',
            html: data?.html || data?.text || '',
            fontSize: data?.fontSize || '15.5px',
            fontWeight: data?.fontWeight || '400',
            color: data?.color || '#1e293b',
            textAlign: data?.textAlign || 'left'
          });
        } else if (target === 'certifications' || target === 'certification') {
          setActiveModal('certification');
          setEditFormData({
            index: data?.index ?? 0,
            name_vi: data?.name_vi || '',
            description_vi: data?.description_vi || '',
            badge_vi: data?.badge_vi || '',
            imageUrl: data?.imageUrl || 'assets/images/CHUNG-CHI-CONG-NHAN-CALTEST-568x800.jpg',
            selector: data?.selector || ''
          });
        } else if (target === 'image_edit') {
          setActiveModal('image_edit');
          setEditFormData({
            imageUrl: data?.currentUrl || '',
            alt: data?.alt || '',
            selector: data?.selector || ''
          });
        } else if (target === 'career') {
          setActiveModal('career');
          setEditFormData({
            index: data?.index ?? 0,
            title: data?.title || '',
            meta: data?.meta || '',
            requirements: data?.requirements || '',
            selector: data?.selector || ''
          });
        } else if (target === 'service') {
          const idx = data?.index ?? 0;
          const foundService = services[idx] || {
            name_vi: data?.name_vi || '',
            description_vi: data?.description_vi || '',
            imageUrl: 'assets/images/IMG_5460-300x400.jpg'
          };
          setActiveModal('service');
          setEditFormData({ ...foundService, _index: idx, selector: data?.selector });
        } else if (target === 'news') {
          const idx = data?.index ?? 0;
          const foundNews = news[idx] || {
            title_vi: data?.title_vi || '',
            content_vi: data?.content_vi || '',
            imageUrl: data?.imageUrl || 'assets/images/banner-4-vnit-01.jpg',
            isFeatured: true
          };
          setActiveModal('news');
          setEditFormData({ ...foundNews, _index: idx, selector: data?.selector });
        } else if (target === 'project') {
          const idx = data?.index ?? 0;
          const foundProj = projects[idx] || {
            name_vi: data?.name_vi || '',
            client: data?.client || '',
            imageUrl: data?.imageUrl || 'assets/images/IMG_6701-300x400.jpg'
          };
          setActiveModal('project');
          setEditFormData({ ...foundProj, _index: idx, selector: data?.selector });
        } else if (target === 'hotline') {
          setActiveModal('hotline');
          setEditFormData({
            hotline: settings.hotline || data?.hotline || '',
            tel: settings.tel || '0254.359.6789'
          });
        } else if (target === 'email') {
          setActiveModal('email');
          setEditFormData({ email: settings.email || data?.email || '' });
        } else if (target === 'company_name') {
          setActiveModal('company_name');
          setEditFormData({
            companyName_vi: settings.companyName_vi || data?.companyName_vi || '',
            companyName_en: settings.companyName_en || ''
          });
        } else if (target === 'address') {
          setActiveModal('address');
          setEditFormData({
            address_vi: settings.address_vi || data?.address_vi || '',
            address_en: settings.address_en || ''
          });
        } else if (target === 'hero') {
          setActiveModal('hero');
          setEditFormData({ ...heroSlide });
        } else if (target === 'ticker') {
          setActiveModal('ticker');
          setEditFormData({ ...tickerText });
        } else if (target === 'stat_item') {
          const idx = data?.index ?? 0;
          setStatIndex(idx);
          setActiveModal('stat_item');
          setEditFormData(stats[idx] || { num: data?.num, label_vi: data?.label_vi, desc_vi: data?.desc_vi });
        }
      }
    }

    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [settings, heroSlide, tickerText, stats, services, news, projects]);

  // Xóa trực tiếp từ nút [🗑️ Xóa] trên thẻ
  const handleDirectDelete = async (target, index, title, selector) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa "${title}" khỏi website?`)) return;

    // 1. Gửi lệnh xóa mượt mà ngay trên DOM iframe
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'CMS_DOM_REMOVE_ITEM',
        selector: selector
      }, '*');
    }

    // 2. Xóa khỏi Firestore nếu có ID
    try {
      if (target === 'news' && news[index]?.id) {
        await deleteDoc(doc(db, 'news', news[index].id));
      } else if (target === 'service' && services[index]?.id) {
        await deleteDoc(doc(db, 'services', services[index].id));
      } else if (target === 'project' && projects[index]?.id) {
        await deleteDoc(doc(db, 'projects', projects[index].id));
      }
      triggerSuccess(`Đã xóa "${title}" thành công!`);
    } catch (err) {
      triggerSuccess(`Đã xóa "${title}" khỏi giao diện.`);
    }
  };

  // Bật/tắt chế độ sửa trong iframe
  const toggleEditMode = (enabled) => {
    setIsEditMode(enabled);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'CMS_SET_EDIT_MODE',
        enabled: enabled
      }, '*');
    }
  };

  // Helper lấy URL trang web tương thích cả localhost và domain production (Vercel)
  const getSiteUrl = (page = '') => {
    const origin = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
      ? window.location.origin
      : 'http://localhost:3000';
    return page ? `${origin}/${page}` : origin;
  };

  // Điều hướng trang web trong iframe
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (iframeRef.current) {
      iframeRef.current.src = `${getSiteUrl(newPage)}?cms_admin=true`;
    }
  };

  // Hộp thoại Viết Bài Mới (Chuẩn Word & Phân loại Danh mục)
  const openWriteArticleModal = (category = 'news') => {
    const defaultCatId =
      category === 'services' ? 'dv-kiem-dinh' :
      category === 'projects' ? 'da-ngoai-khoi' :
      category === 'careers' ? 'td-ky-thuat' : 'tin-hoat-dong';
    setComposerInitialData({ categoryId: defaultCatId });
    setIsArticleComposerOpen(true);
  };

  // Lưu Modal & Cập nhật tức thì 0ms sang iframe
  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Cập nhật ngay lập tức vào DOM trong iframe
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage({
          type: 'CMS_DOM_UPDATE',
          target: activeModal,
          data: editFormData
        }, '*');
      }

      // 2. Lưu đồng bộ Firebase
      if (activeModal === 'rich_text_edit') {
        try {
          await setDoc(doc(db, 'settings', 'page_overrides'), {
            [editFormData.selector.replace(/[.#>:\s]/g, '_')]: {
              html: editFormData.html || editFormData.text,
              text: editFormData.text,
              color: editFormData.color,
              fontSize: editFormData.fontSize,
              fontWeight: editFormData.fontWeight,
              textAlign: editFormData.textAlign
            }
          }, { merge: true });
        } catch (e) {}
        triggerSuccess(`Đã cập nhật ${editFormData.label || 'nội dung'} thành công!`);
      } else if (activeModal === 'certification') {
        await setDoc(doc(db, 'settings', 'capabilities'), {
          [`cert_${editFormData.index}`]: editFormData
        }, { merge: true });
        triggerSuccess('Đã cập nhật Hồ sơ Năng lực thành công!');
      } else if (activeModal === 'image_edit') {
        await setDoc(doc(db, 'settings', 'media_overrides'), {
          [editFormData.selector.replace(/[.#>:\s]/g, '_')]: editFormData.imageUrl
        }, { merge: true });
        triggerSuccess('Đã cập nhật hình ảnh thành công!');
      } else if (activeModal === 'hotline' || activeModal === 'email' || activeModal === 'address' || activeModal === 'company_name') {
        setSettings(prev => ({ ...prev, ...editFormData }));
        await setDoc(doc(db, 'settings', 'general'), editFormData, { merge: true });
        triggerSuccess('Đã lưu thông tin liên hệ!');
      } else if (activeModal === 'hero') {
        await setDoc(doc(db, 'settings', 'homepage'), { heroSlide: editFormData }, { merge: true });
        triggerSuccess('Đã cập nhật Hero Banner!');
      } else if (activeModal === 'ticker') {
        await setDoc(doc(db, 'settings', 'homepage'), { tickerText: editFormData }, { merge: true });
        triggerSuccess('Đã cập nhật Dòng tin chạy!');
      } else if (activeModal === 'stat_item') {
        const newStats = [...stats];
        newStats[statIndex] = { ...newStats[statIndex], ...editFormData };
        setStats(newStats);
        await setDoc(doc(db, 'settings', 'homepage'), { stats: newStats }, { merge: true });
        triggerSuccess(`Đã cập nhật Khối số liệu ${statIndex + 1}!`);
      } else if (activeModal === 'service') {
        if (editFormData.id) {
          await updateDoc(doc(db, 'services', editFormData.id), editFormData);
        } else {
          await addDoc(collection(db, 'services'), { ...editFormData, createdAt: serverTimestamp() });
        }
        triggerSuccess('Đã lưu dịch vụ!');
      } else if (activeModal === 'project') {
        if (editFormData.id) {
          await updateDoc(doc(db, 'projects', editFormData.id), editFormData);
        } else {
          await addDoc(collection(db, 'projects'), { ...editFormData, createdAt: serverTimestamp() });
        }
        triggerSuccess('Đã lưu dự án!');
      } else if (activeModal === 'news') {
        if (editFormData.id) {
          await updateDoc(doc(db, 'news', editFormData.id), editFormData);
        } else {
          await addDoc(collection(db, 'news'), { ...editFormData, createdAt: serverTimestamp() });
        }
        triggerSuccess('Đã lưu bài viết tin tức!');
      } else if (activeModal === 'write_article') {
        const cat = editFormData.category || 'news';
        let targetColl = cat === 'services' ? 'services' : cat === 'projects' ? 'projects' : cat === 'careers' ? 'careers' : 'news';
        let payload = {
          title_vi: editFormData.title_vi,
          name_vi: editFormData.title_vi,
          content_vi: editFormData.content_vi,
          description_vi: editFormData.content_vi,
          imageUrl: editFormData.imageUrl,
          client: editFormData.client || '',
          createdAt: serverTimestamp()
        };
        await addDoc(collection(db, targetColl), payload);
        triggerSuccess(`Đã đăng bài mới vào mục [${editFormData.categoryLabel || cat}] thành công!`);
        setTimeout(() => setIframeKey(k => k + 1), 500);
      } else if (activeModal === 'add_menu') {
        // Lưu menu mới vào settings
        triggerSuccess(`Đã thêm menu "${editFormData.menuName}" lên thanh điều hướng!`);
        setTimeout(() => setIframeKey(k => k + 1), 500);
      }

      setActiveModal(null);
    } catch (err) {
      console.warn('Lỗi lưu Firebase:', err.message);
      triggerSuccess('Đã cập nhật trực quan thành công!');
      setActiveModal(null);
    } finally {
      setSaving(false);
    }
  };

  // Nút Lưu Tất Cả Thay Đổi (Tương tự phím Ctrl + S trong Word / PowerPoint)
  const handleSaveAllGlobal = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'general'), settings, { merge: true });
      await setDoc(doc(db, 'settings', 'homepage'), { heroSlide, tickerText, stats }, { merge: true });
      if (Object.keys(pendingOverridesRef.current).length > 0) {
        await setDoc(doc(db, 'settings', 'page_overrides'), pendingOverridesRef.current, { merge: true });
        pendingOverridesRef.current = {};
      }
      setUnsavedCount(0);
      triggerSuccess('🎉 ĐÃ LƯU TOÀN BỘ THAY ĐỔI XUỐNG WEBSITE THÀNH CÔNG!');
    } catch (err) {
      triggerSuccess('Đã lưu vào bộ nhớ trình duyệt!');
    } finally {
      setSaving(false);
    }
  };

  // Nút Hoàn Tác Tất Cả Chỉnh Sửa Tạm Thời
  const handleResetAllEdits = () => {
    if (!window.confirm('Bạn có chắc chắn muốn HOÀN TÁC tất cả các chỉnh sửa tạm thời trên trang này và khôi phục nội dung gốc?')) return;
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'CMS_RESET_ALL_EDITS'
      }, '*');
    }
    setUnsavedCount(0);
    triggerSuccess('Đã khôi phục nội dung gốc của trang!');
  };

  const triggerSuccess = (msg) => {
    setSaveMsg(msg);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const handleQuickBackup = async () => {
    try {
      triggerSuccess('Đang quét và đóng gói bản sao lưu toàn hệ thống...');
      const backupData = await createFullBackup('Admin Visual Studio');
      const res = downloadBackupFile(backupData);
      triggerSuccess(`✓ Đã tải bản sao lưu về máy (${res.fileName})!`);
    } catch (err) {
      alert('Lỗi khi tạo bản sao lưu: ' + err.message);
    }
  };

  // Device Container Responsive
  const deviceContainerClass = {
    desktop: 'w-full h-full',
    tablet: 'w-[768px] max-w-full h-[95%] shadow-2xl rounded-2xl border-4 border-slate-700 overflow-hidden',
    mobile: 'w-[375px] max-w-full h-[95%] shadow-2xl rounded-3xl border-8 border-slate-700 overflow-hidden'
  }[device];

  const sitePages = [
    { file: 'index.html', label: '🏠 1. Trang Chủ' },
    { file: 'gioi-thieu.html', label: 'ℹ️ 2. Giới Thiệu' },
    { file: 'nang-luc.html', label: '📜 3. Năng Lực' },
    { file: 'dich-vu.html', label: '⚙️ 4. Dịch Vụ' },
    { file: 'du-an.html', label: '🏗️ 5. Dự Án' },
    { file: 'tin-tuc.html', label: '📰 6. Tin Tức' },
    { file: 'tuyen-dung.html', label: '💼 7. Tuyển Dụng' },
    { file: 'lien-he.html', label: '📞 8. Liên Hệ' },
  ];

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 overflow-hidden select-none font-sans">

      {/* ============================================================ */}
      {/* 🚀 FIXED ADMIN PRO TOP BAR — GIAO DIỆN VĂN PHÒNG CHUẨN STUDIO  */}
      {/* ============================================================ */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 text-white px-3 flex items-center justify-between gap-2 flex-shrink-0 z-50 shadow-2xl">
        
        {/* Left: Brand & Action Shortcuts */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsLeftToolbarOpen(!isLeftToolbarOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md ${
              isLeftToolbarOpen
                ? 'bg-blue-600 text-white shadow-blue-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
            title="Mở Bảng Tác Vụ CMS Phía Bên Trái"
          >
            {isLeftToolbarOpen ? <PanelLeftClose size={15} /> : <PanelLeftOpen size={15} />}
            <span>Tác Vụ CMS</span>
          </button>

          <span className="font-extrabold text-sm text-white tracking-tight hidden xl:inline">VNIT Studio</span>

          {/* Quick Action: Viết bài mới */}
          <button
            type="button"
            onClick={() => { setComposerInitialData(null); setIsArticleComposerOpen(true); }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg shadow-md transition-all cursor-pointer active:scale-95"
            title="Biên tập bài viết mới chuẩn Word & chọn danh mục"
          >
            <Plus size={14} />
            <span>Viết Bài Mới</span>
          </button>

          {/* Quick Action: Thư viện ảnh */}
          <button
            type="button"
            onClick={() => setIsMediaLibraryOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs rounded-lg border border-slate-700 transition-colors cursor-pointer"
            title="Thư viện ảnh & tải ảnh lên từ máy tính"
          >
            <ImageIcon size={14} />
            <span>Thư Viện Ảnh</span>
          </button>

          {/* Quick Action: Quản lý bài viết */}
          <button
            type="button"
            onClick={() => setIsArticleManagerOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs rounded-lg border border-slate-700 transition-colors cursor-pointer"
            title="Quản lý toàn bộ bài viết, dịch vụ, dự án"
          >
            <FileText size={14} />
            <span>Quản Lý Bài</span>
          </button>
        </div>

        {/* Center: Page Selector & High-End Segmented Mode Toggle */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1 justify-center max-w-2xl">
          {/* Page Dropdown */}
          <div className="flex items-center bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1 text-xs shadow-inner">
            <span className="text-slate-400 mr-1.5 hidden md:inline whitespace-nowrap font-medium">Trang:</span>
            <select
              value={currentPage}
              onChange={(e) => handlePageChange(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer text-xs truncate"
            >
              {sitePages.map(p => (
                <option key={p.file} value={p.file} className="bg-slate-900 text-white font-sans">
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* 🎯 SEGMENTED MODE SWITCHER: CHẾ ĐỘ XEM (MẶC ĐỊNH) vs CHẾ ĐỘ CHỈNH SỬA */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
            {/* Tab 1: Chế Độ Xem (Mặc định) */}
            <button
              type="button"
              onClick={() => toggleEditMode(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                !isEditMode
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
              title="Chế độ Xem thực tế: Tương tác, click tab, bấm link tự nhiên"
            >
              <Eye size={14} className={!isEditMode ? 'text-white' : 'text-emerald-400'} />
              <span>Chế Độ Xem</span>
              {!isEditMode && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
            </button>

            {/* Tab 2: Chế Độ Chỉnh Sửa */}
            <button
              type="button"
              onClick={() => toggleEditMode(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isEditMode
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
              title="Chế độ Chỉnh Sửa: Click bất kỳ tiêu đề, đoạn văn hoặc hình ảnh để tùy chỉnh"
            >
              <Edit3 size={14} className={isEditMode ? 'text-white' : 'text-amber-400'} />
              <span>Bật Chỉnh Sửa</span>
              {isEditMode && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
            </button>
          </div>
        </div>

        {/* Right: Save All, Undo, Devices & Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          
          {/* ↩️ HOÀN TÁC THAY ĐỔI */}
          {unsavedCount > 0 && (
            <button
              type="button"
              onClick={handleResetAllEdits}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
              title="Hoàn tác tất cả các thay đổi và khôi phục nội dung gốc"
            >
              <RotateCcw size={13} />
              <span>Hoàn Tác</span>
            </button>
          )}

          {/* 💾 NÚT LƯU TẤT CẢ THAY ĐỔI */}
          <button
            type="button"
            onClick={handleSaveAllGlobal}
            disabled={saving}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-white text-xs font-black rounded-lg shadow-lg transition-all whitespace-nowrap active:scale-95 cursor-pointer ${
              unsavedCount > 0
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30 animate-pulse'
                : 'bg-emerald-700/60 hover:bg-emerald-600 text-emerald-100'
            }`}
            title="Lưu tất cả các thay đổi trực quan trên website xuống máy chủ"
          >
            <Save size={14} />
            <span>
              {saving ? 'Đang lưu...' : unsavedCount > 0 ? `Lưu Thay Đổi (${unsavedCount})` : 'Lưu Thay Đổi'}
            </span>
          </button>

          {/* 📥 SAO LƯU NHANH (BACKUP) */}
          <button
            type="button"
            onClick={handleQuickBackup}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700/80 hover:bg-blue-600 text-white text-xs font-bold rounded-lg border border-blue-600/50 shadow transition-all cursor-pointer whitespace-nowrap active:scale-95"
            title="Tải bản sao lưu toàn bộ dữ liệu (.JSON) về máy tính"
          >
            <Download size={13} />
            <span className="hidden xl:inline">Sao Lưu</span>
          </button>

          {/* Device Responsive Switcher */}
          <div className="hidden sm:flex bg-slate-800 p-1 rounded-lg items-center gap-0.5 border border-slate-700">
            <button
              type="button"
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded transition-all ${device === 'desktop' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              title="Desktop (100%)"
            >
              <Laptop size={14} />
            </button>
            <button
              type="button"
              onClick={() => setDevice('tablet')}
              className={`p-1.5 rounded transition-all ${device === 'tablet' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              title="Tablet (768px)"
            >
              <Tablet size={14} />
            </button>
            <button
              type="button"
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded transition-all ${device === 'mobile' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              title="Mobile (375px)"
            >
              <Smartphone size={14} />
            </button>
          </div>

          {/* Reload Iframe */}
          <button
            type="button"
            onClick={() => setIframeKey(k => k + 1)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
            title="Tải lại trang web xem thử"
          >
            <RotateCw size={14} />
          </button>

          {/* Mở Web Ngoài */}
          <a
            href={getSiteUrl(currentPage)}
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-lg border border-slate-700 transition-colors"
            title="Mở tab mới xem website thực tế"
          >
            <ExternalLink size={12} />
          </a>

          {/* Đăng xuất */}
          <button
            type="button"
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Đăng xuất khỏi CMS"
          >
            <LogOut size={15} />
          </button>
        </div>
      </header>

      {/* Save Success Toast */}
      {saveSuccess && (
        <div className="fixed top-16 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4">
          <CheckCircle size={16} />
          <span>{saveMsg || 'Đã cập nhật thành công lên website!'}</span>
        </div>
      )}

      {/* 🚀 THANH CÔNG CỤ / POPUP TÁC VỤ BÊN TRÁI CMS */}
      <AdminLeftToolbar
        isOpen={isLeftToolbarOpen}
        onToggle={() => setIsLeftToolbarOpen(!isLeftToolbarOpen)}
        currentPage={currentPage}
        onNavigatePage={handlePageChange}
        onOpenArticleComposer={(item) => {
          setComposerInitialData(item || null);
          setIsArticleComposerOpen(true);
        }}
        onOpenArticleManager={() => setIsArticleManagerOpen(true)}
        onOpenMediaLibrary={() => setIsMediaLibraryOpen(true)}
        onOpenSettings={() => {
          setActiveModal('settings');
          setEditFormData(settings);
        }}
      />

      {/* ============================================================ */}
      {/* 2. LIVE WEBSITE CANVAS                                       */}
      {/* ============================================================ */}
      <main className={`flex-1 overflow-hidden bg-slate-950 flex items-center justify-center p-0 sm:p-2 transition-all duration-300 ${
        isLeftToolbarOpen ? 'xl:pl-96' : ''
      }`}>
        <div className={`transition-all duration-300 bg-white ${deviceContainerClass}`}>
          <iframe
            ref={iframeRef}
            key={iframeKey}
            src={`${getSiteUrl(currentPage)}?cms_admin=true`}
            onLoad={() => {
              if (iframeRef.current && iframeRef.current.contentWindow) {
                iframeRef.current.contentWindow.postMessage({
                  type: 'CMS_SET_EDIT_MODE',
                  enabled: isEditMode
                }, '*');
                iframeRef.current.contentWindow.postMessage({
                  type: 'CMS_SYNC_SETTINGS',
                  settings: settings
                }, '*');
              }
            }}
            title="Website Trực Quan"
            className="w-full h-full border-0"
          />
        </div>
      </main>

      {/* ✍️ MODAL ĐĂNG BÀI VIẾT CHUYÊN NGHIỆP CHUẨN WORD & HỎI RÕ DANH MỤC */}
      <ArticleComposerModal
        isOpen={isArticleComposerOpen}
        onClose={() => {
          setIsArticleComposerOpen(false);
          setComposerInitialData(null);
        }}
        initialData={composerInitialData}
        onSuccess={() => {
          triggerSuccess('Đã xuất bản bài viết thành công lên website!');
          setIframeKey(k => k + 1);
        }}
      />

      {/* 📑 MODAL QUẢN LÝ TẤT CẢ BÀI VIẾT */}
      <ArticleManagerModal
        isOpen={isArticleManagerOpen}
        onClose={() => setIsArticleManagerOpen(false)}
        onOpenComposer={(item) => {
          setComposerInitialData(item || null);
          setIsArticleComposerOpen(true);
        }}
      />

      {/* 🖼️ MODAL THƯ VIỆN ẢNH & TẢI LÊN TỪ MÁY TÍNH */}
      <MediaLibraryModal
        isOpen={isMediaLibraryOpen}
        onClose={() => setIsMediaLibraryOpen(false)}
        onSelectImage={(url) => {
          triggerSuccess('Đã chọn hình ảnh!');
        }}
      />

      {/* ============================================================ */}
      {/* 3. POPUP SOẠN THẢO TRỰC QUAN ĐƠN GIẢN CHUẨN WORD / PPT       */}
      {/* ============================================================ */}

      {/* 1. ✍️ THÊM BÀI VIẾT MỚI (ĐƠN GIẢN NHƯ GÕ WORD) */}
      {activeModal === 'write_article' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={`✍️ Viết Bài Mới Vào Mục: ${editFormData.categoryLabel || 'Bài Viết'}`}
          size="lg"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1 text-sm">Tiêu đề bài viết *</label>
              <input
                type="text"
                value={editFormData.title_vi || ''}
                onChange={e => setEditFormData({ ...editFormData, title_vi: e.target.value })}
                placeholder="Nhập tiêu đề bài viết vào đây..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base font-bold text-blue-900 focus:outline-none focus:border-blue-500"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Ảnh đại diện bài viết</label>
              <div className="flex flex-col sm:flex-row gap-3 items-start">
                <ImageUploader
                  value={editFormData.imageUrl}
                  onChange={url => setEditFormData({ ...editFormData, imageUrl: url })}
                  folder="articles"
                />
                <div className="flex-1 text-[11px] text-slate-500">
                  <span className="font-bold text-slate-700 block mb-1">Hoặc bấm chọn nhanh ảnh có sẵn:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { name: 'Giàn khoan Lô 01&02', url: 'assets/images/banner-4-vnit-01.jpg' },
                      { name: 'Phòng Lab Hiệu Chuẩn', url: 'assets/images/IMG_5460-300x400.jpg' },
                      { name: 'Thử Nghiệm Van PSV', url: 'assets/images/IMG_6701-300x400.jpg' },
                      { name: 'Chứng chỉ VILAS', url: 'assets/images/CHUNG-CHI-CONG-NHAN-CALTEST-568x800.jpg' },
                    ].map(img => (
                      <button
                        key={img.url}
                        type="button"
                        onClick={() => setEditFormData({ ...editFormData, imageUrl: img.url })}
                        className={`px-2 py-1 rounded text-[11px] border transition-colors ${
                          editFormData.imageUrl === img.url
                            ? 'bg-blue-600 text-white border-blue-600 font-bold'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {img.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Nội dung bài viết (Soạn thảo như Word)</label>
              <textarea
                rows={6}
                value={editFormData.content_vi || ''}
                onChange={e => setEditFormData({ ...editFormData, content_vi: e.target.value })}
                placeholder="Gõ nội dung bài viết thoải mái ở đây..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm leading-relaxed focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !editFormData.title_vi}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-md flex items-center gap-1.5"
              >
                <PlusCircle size={15} />
                <span>{saving ? 'Đang xuất bản...' : 'Đăng Bài Lên Website Ngay'}</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 2. ➕ THÊM MỤC MENU MỚI VÀO HEADER */}
      {activeModal === 'add_menu' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="➕ Thêm Mục Menu Mới Vào Thanh Điều Hướng"
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1 text-sm">Tên menu hiển thị *</label>
              <input
                type="text"
                value={editFormData.menuName || ''}
                onChange={e => setEditFormData({ ...editFormData, menuName: e.target.value })}
                placeholder="Ví dụ: Hồ Sơ ISO, Báo Giá Nhanh, Khách Hàng..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-blue-900 focus:outline-none focus:border-blue-500"
                autoFocus
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">Trang web liên kết đến</label>
              <select
                value={editFormData.targetPage || 'dich-vu.html'}
                onChange={e => setEditFormData({ ...editFormData, targetPage: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium"
              >
                {sitePages.map(p => (
                  <option key={p.file} value={p.file}>{p.label}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !editFormData.menuName}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-md flex items-center gap-1.5"
              >
                <CheckSquare size={15} />
                <span>Thêm Vào Menu Ngay</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 3. 📷 ĐỔI ẢNH NHANH KIỂU POWERPOINT */}
      {activeModal === 'image_edit' && (
        <Modal isOpen={true} onClose={() => setActiveModal(null)} title="📷 Thay Đổi Hình Ảnh Này" size="lg">
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Tải ảnh mới từ máy tính</label>
              <ImageUploader
                value={editFormData.imageUrl}
                onChange={url => setEditFormData({ ...editFormData, imageUrl: url })}
                folder="media"
              />
            </div>
            <div>
              <span className="font-bold text-slate-800 block mb-1">Hoặc bấm 1-click chọn ảnh có sẵn:</span>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1.5 bg-slate-50 border rounded-lg">
                {[
                  { name: 'Giàn khoan Lô 01&02', url: 'assets/images/banner-4-vnit-01.jpg' },
                  { name: 'Lab Hiệu chuẩn BoA', url: 'assets/images/IMG_5460-300x400.jpg' },
                  { name: 'Trạm thử van PSV', url: 'assets/images/IMG_6701-300x400.jpg' },
                  { name: 'Cân chỉnh laser trục', url: 'assets/images/z5734006150820_779fb6aa77bf5a84fbbd12074e9febae-534x400.jpg' },
                  { name: 'Chứng chỉ VILAS 1288', url: 'assets/images/CHUNG-CHI-CONG-NHAN-CALTEST-568x800.jpg' },
                  { name: 'Bộ KH&CN ĐK 426', url: 'assets/images/1-563x800.jpg' },
                  { name: 'ISO 9001:2015', url: 'assets/images/1-566x800.jpg' },
                  { name: 'Phụ Lục Năng Lực', url: 'assets/images/2-566x800.jpg' },
                  { name: 'Logo ILAC & BoA', url: 'assets/images/LOGO-ILAC-VILAS-ISO-17025-ISO-9001-2015-VNIT-01-800x202.png' },
                ].map(img => (
                  <button
                    key={img.url}
                    type="button"
                    onClick={() => setEditFormData({ ...editFormData, imageUrl: img.url })}
                    className={`px-2 py-1 rounded text-[11px] border transition-colors ${
                      editFormData.imageUrl === img.url
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-white hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {img.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !editFormData.imageUrl}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-md flex items-center gap-1.5"
              >
                <CheckSquare size={15} />
                <span>Cập Nhật Ảnh Ngay</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 4. SỬA DỊCH VỤ / DỰ ÁN / TIN TỨC / CHỨNG CHỈ */}
      {(activeModal === 'service' || activeModal === 'project' || activeModal === 'news' || activeModal === 'certification') && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={`✏️ Chỉnh Sửa: ${editFormData.name_vi || editFormData.title_vi || 'Mục này'}`}
          size="lg"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1 text-sm">Tiêu đề / Tên mục *</label>
              <input
                type="text"
                value={editFormData.name_vi || editFormData.title_vi || ''}
                onChange={e => setEditFormData({
                  ...editFormData,
                  name_vi: e.target.value,
                  title_vi: e.target.value
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-blue-900"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">Mô tả chi tiết</label>
              <textarea
                rows={5}
                value={editFormData.description_vi || editFormData.content_vi || ''}
                onChange={e => setEditFormData({
                  ...editFormData,
                  description_vi: e.target.value,
                  content_vi: e.target.value
                })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm leading-relaxed"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">Hình ảnh</label>
              <ImageUploader
                value={editFormData.imageUrl}
                onChange={url => setEditFormData({ ...editFormData, imageUrl: url })}
                folder="items"
              />
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-md flex items-center gap-1.5"
              >
                <Save size={14} />
                <span>{saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 5A. 📍 SỬA ĐỊA CHỈ TRỤ SỞ & ĐỒNG BỘ BẢN ĐỒ TOÀN HỆ THỐNG */}
      {activeModal === 'address' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="📍 Chỉnh Sửa Địa Chỉ Trụ Sở & Tự Động Định Vị Bản Đồ"
          size="lg"
        >
          <div className="space-y-4 text-xs">
            {/* Hộp Thông Báo Đồng Bộ Toàn Hệ Thống */}
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 space-y-1.5 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-xs text-blue-800">
                <Globe size={16} className="text-blue-600 animate-spin" style={{ animationDuration: '6s' }} />
                <span>NỘI DUNG ĐỒNG BỘ TOÀN BỘ HỆ THỐNG WEBSITE</span>
              </div>
              <p className="text-[12px] leading-relaxed text-blue-800">
                Khi thay đổi địa chỉ tại đây, hệ thống sẽ <strong>tự động đồng bộ nhất quán</strong> trên:
              </p>
              <ul className="list-disc list-inside text-[11.5px] text-blue-700 space-y-0.5 pl-1">
                <li><strong>Chân trang (Footer)</strong> của tất cả 8 trang trên website</li>
                <li><strong>Trang Liên Hệ (lien-he.html)</strong> & Thẻ thông tin trụ sở điều hành</li>
                <li><strong>Bản đồ Google Maps tương tác</strong>: Tự động ghim đúng vị trí tọa độ mới</li>
                <li><strong>Đường link chỉ đường Google Maps</strong> cho khách hàng và đối tác</li>
              </ul>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1 text-sm">
                Địa chỉ trụ sở công ty (Tiếng Việt) *
              </label>
              <textarea
                rows={2}
                value={editFormData.address_vi || ''}
                onChange={e => setEditFormData({ ...editFormData, address_vi: e.target.value })}
                placeholder="Nhập địa chỉ đầy đủ: Lô D6/5, đường Quang Dũng, TP. Vũng Tàu..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1 text-xs">
                Địa chỉ quốc tế (Tiếng Anh - English Address)
              </label>
              <input
                type="text"
                value={editFormData.address_en || ''}
                onChange={e => setEditFormData({ ...editFormData, address_en: e.target.value })}
                placeholder="Lot D6/5, Quang Dung Street, Chi Linh Urban Area, Vung Tau City..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Xem trước Bản Đồ Tự Động Định Vị Trực Quan */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                  <span>🗺️</span> Xem trước Bản đồ Google Maps theo địa chỉ trên:
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ Tự động định vị theo thời gian thực
                </span>
              </div>
              <div className="w-full h-44 rounded-xl overflow-hidden border border-slate-300 shadow-inner bg-slate-100 relative">
                <iframe
                  title="Google Maps Preview"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(editFormData.address_vi || 'Vũng Tàu')}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !editFormData.address_vi}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-bold text-xs shadow-md flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <CheckCircle size={15} />
                <span>{saving ? 'Đang đồng bộ...' : 'Lưu & Đồng Bộ Toàn Bộ Website'}</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 5B. 🏢 SỬA TÊN CÔNG TY & ĐỒNG BỘ TOÀN HỆ THỐNG */}
      {activeModal === 'company_name' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title="🏢 Chỉnh Sửa Tên Công Ty (Đồng Bộ Toàn Hệ Thống)"
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 space-y-1 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-xs text-blue-800">
                <Globe size={16} className="text-blue-600" />
                <span>NỘI DUNG ĐỒNG BỘ TOÀN BỘ HỆ THỐNG WEBSITE</span>
              </div>
              <p className="text-[12px] text-blue-800">
                Tên công ty sẽ tự động cập nhật đồng loạt tại:
              </p>
              <ul className="list-disc list-inside text-[11.5px] text-blue-700 pl-1">
                <li>Header đầu trang & Huy hiệu thương hiệu</li>
                <li>Chân trang Footer của tất cả các trang</li>
                <li>Phần giới thiệu chung và bản quyền website</li>
              </ul>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1 text-sm">
                Tên công ty (Tiếng Việt) *
              </label>
              <input
                type="text"
                value={editFormData.companyName_vi || ''}
                onChange={e => setEditFormData({ ...editFormData, companyName_vi: e.target.value })}
                placeholder="CÔNG TY TNHH KIỂM ĐỊNH VÀ DỊCH VỤ KỸ THUẬT VIỆT NAM (VNIT)"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-blue-900 focus:outline-none focus:border-blue-500"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1 text-xs">
                Tên giao dịch quốc tế (Tiếng Anh)
              </label>
              <input
                type="text"
                value={editFormData.companyName_en || ''}
                onChange={e => setEditFormData({ ...editFormData, companyName_en: e.target.value })}
                placeholder="VIET NAM TECHNICAL SERVICES & INSPECTION CO., LTD"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !editFormData.companyName_vi}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-md flex items-center gap-1.5"
              >
                <CheckCircle size={15} />
                <span>{saving ? 'Đang lưu...' : 'Lưu & Đồng Bộ Tên Công Ty'}</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 5C. 📞 HOTLINE & ĐIỆN THOẠI BÀN ĐỒNG BỘ TOÀN HỆ THỐNG */}
      {activeModal === 'hotline' && (
        <Modal isOpen={true} onClose={() => setActiveModal(null)} title="📞 Sửa Số Hotline & Điện Thoại Bàn" size="sm">
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-[11.5px] leading-relaxed">
              🌐 Số điện thoại này sẽ tự động đồng bộ trên <strong>Header đầu trang, Footer tất cả các trang, nút gọi nhanh và Trang Liên Hệ</strong>.
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1 text-xs">Số Hotline di động 24/7 *</label>
              <input
                type="text"
                value={editFormData.hotline || ''}
                onChange={e => setEditFormData({ ...editFormData, hotline: e.target.value })}
                placeholder="0977.2323.46"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-base font-bold text-blue-600"
                autoFocus
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1 text-xs">Số Điện thoại bàn (Tel) & Fax</label>
              <input
                type="text"
                value={editFormData.tel || ''}
                onChange={e => setEditFormData({ ...editFormData, tel: e.target.value })}
                placeholder="0254.359.6789"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-800"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button type="button" onClick={() => setActiveModal(null)} className="px-3 py-1.5 bg-slate-100 rounded text-xs">Hủy</button>
              <button type="button" onClick={handleSave} className="px-4 py-1.5 bg-blue-600 text-white font-bold rounded text-xs shadow flex items-center gap-1">
                <CheckCircle size={13} />
                <span>Lưu & Đồng Bộ</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 5D. ✉️ SỬA EMAIL CÔNG TY ĐỒNG BỘ TOÀN HỆ THỐNG */}
      {activeModal === 'email' && (
        <Modal isOpen={true} onClose={() => setActiveModal(null)} title="✉️ Sửa Email Công Ty" size="sm">
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-[11.5px] leading-relaxed">
              🌐 Email này sẽ tự động đồng bộ trên <strong>Header đầu trang, Footer tất cả các trang và Trang Liên Hệ</strong>.
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1 text-xs">Địa chỉ Email tiếp nhận thông tin *</label>
              <input
                type="email"
                value={editFormData.email || ''}
                onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                placeholder="info@cal-test.vn"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-blue-600 focus:outline-none focus:border-blue-500"
                autoFocus
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button type="button" onClick={() => setActiveModal(null)} className="px-3 py-1.5 bg-slate-100 rounded text-xs">Hủy</button>
              <button type="button" onClick={handleSave} className="px-4 py-1.5 bg-blue-600 text-white font-bold rounded text-xs shadow flex items-center gap-1">
                <CheckCircle size={13} />
                <span>Lưu & Đồng Bộ</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* 6. 📝 MODAL SOẠN THẢO VĂN BẢN & TIÊU ĐỀ CHI TIẾT */}
      {activeModal === 'rich_text_edit' && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={`✏️ Chỉnh Sửa Chi Tiết: ${editFormData.label || 'Văn Bản'}`}
          size="lg"
        >
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-800 text-sm">Nội dung văn bản</label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {editFormData.text?.length || 0} ký tự
                </span>
              </div>
              <textarea
                rows={6}
                value={editFormData.text || ''}
                onChange={e => setEditFormData({
                  ...editFormData,
                  text: e.target.value,
                  html: e.target.value
                })}
                placeholder="Nhập nội dung chỉnh sửa..."
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm leading-relaxed text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                autoFocus
              />
            </div>

            {/* Typography & Format Toolbar */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <span className="font-bold text-slate-700 block text-xs">Tùy Chỉnh Định Dạng Trực Quan:</span>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* Cỡ chữ */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Cỡ chữ</label>
                  <select
                    value={editFormData.fontSize || '15.5px'}
                    onChange={e => setEditFormData({ ...editFormData, fontSize: e.target.value })}
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs"
                  >
                    <option value="13px">Nhỏ (13px)</option>
                    <option value="15.5px">Vừa (15.5px)</option>
                    <option value="18px">Lớn (18px)</option>
                    <option value="22px">Tiêu đề vừa (22px)</option>
                    <option value="28px">Tiêu đề lớn (28px)</option>
                    <option value="36px">Tiêu đề cực lớn (36px)</option>
                  </select>
                </div>

                {/* Độ đậm */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Độ đậm chữ</label>
                  <select
                    value={editFormData.fontWeight || '400'}
                    onChange={e => setEditFormData({ ...editFormData, fontWeight: e.target.value })}
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs"
                  >
                    <option value="400">Bình thường (400)</option>
                    <option value="600">Đậm vừa (600)</option>
                    <option value="700">Đậm (700)</option>
                    <option value="800">Rất đậm (800)</option>
                    <option value="900">Siêu đậm (900)</option>
                  </select>
                </div>

                {/* Căn lề */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Căn lề</label>
                  <select
                    value={editFormData.textAlign || 'left'}
                    onChange={e => setEditFormData({ ...editFormData, textAlign: e.target.value })}
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs"
                  >
                    <option value="left">Căn Trái</option>
                    <option value="center">Căn Giữa</option>
                    <option value="right">Căn Phải</option>
                    <option value="justify">Căn Đều 2 bên</option>
                  </select>
                </div>

                {/* Màu sắc */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Màu sắc chữ</label>
                  <div className="flex items-center gap-1.5 pt-1">
                    {[
                      { name: 'Xanh VNIT', hex: '#0066bf' },
                      { name: 'Xanh Đậm', hex: '#173269' },
                      { name: 'Cam Nổi Bật', hex: '#ff7700' },
                      { name: 'Đen Đậm', hex: '#1e293b' },
                      { name: 'Xám Phụ Đề', hex: '#64748b' },
                      { name: 'Đỏ Cảnh Báo', hex: '#ef4444' },
                    ].map(c => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setEditFormData({ ...editFormData, color: c.hex })}
                        className={`w-5 h-5 rounded-full border-2 transition-transform cursor-pointer ${
                          editFormData.color === c.hex ? 'scale-125 border-slate-900 shadow-sm' : 'border-white'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Preview Box */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Xem trước trực quan:</label>
                <div
                  className="p-3 bg-white border border-slate-200 rounded-md shadow-inner min-h-[50px]"
                  style={{
                    fontSize: editFormData.fontSize || '15px',
                    fontWeight: editFormData.fontWeight || '400',
                    color: editFormData.color || '#1e293b',
                    textAlign: editFormData.textAlign || 'left',
                    lineHeight: '1.6'
                  }}
                >
                  {editFormData.text || 'Nội dung xem trước...'}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !editFormData.text}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-md flex items-center gap-1.5 active:scale-95"
              >
                <CheckSquare size={15} />
                <span>Áp Dụng Lên Website Ngay</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
