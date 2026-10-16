// ============================================================
// FILE: src/pages/BackupRestorePage.jsx
// Trung Tâm Sao Lưu & Phục Hồi Dữ Liệu Doanh Nghiệp (Backup & Restore)
// ============================================================

import { useState, useEffect, useRef } from 'react';
import {
  Download, Upload, RefreshCw, CheckCircle2, AlertTriangle,
  Database, ShieldCheck, Clock, FileJson, Trash2, ArrowUpRight,
  HardDrive, Layers, Server, Sparkles, Check, Info
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import {
  createFullBackup, downloadBackupFile, validateBackupData,
  restoreFromBackup, getLocalSnapshotRecords, deleteLocalSnapshotRecord
} from '../services/backupService';
import { formatBytes } from '../utils/imageOptimizer';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '../firebase';

export default function BackupRestorePage() {
  // Trạng thái thống kê hệ thống hiện tại
  const [stats, setStats] = useState({
    services: 0,
    projects: 0,
    news: 0,
    visualEdits: 0,
    loading: true
  });

  // Backup states
  const [backingUp, setBackingUp] = useState(false);
  const [lastBackupInfo, setLastBackupInfo] = useState(null);

  // Restore states
  const [restoreFile, setRestoreFile] = useState(null);
  const [validatedData, setValidatedData] = useState(null);
  const [restoreMode, setRestoreMode] = useState('overwrite'); // 'overwrite' | 'merge'
  const [restoring, setRestoring] = useState(false);
  const [restoreProgress, setRestoreProgress] = useState({ percent: 0, message: '' });
  const [restoreSuccess, setRestoreSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Snapshots history
  const [snapshots, setSnapshots] = useState([]);
  const fileInputRef = useRef(null);

  // Tải thống kê và lịch sử snapshot
  const loadSystemStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));

      const [srvSnap, prjSnap, newsSnap] = await Promise.all([
        getCountFromServer(collection(db, 'services')).catch(() => ({ data: () => ({ count: 0 }) })),
        getCountFromServer(collection(db, 'projects')).catch(() => ({ data: () => ({ count: 0 }) })),
        getCountFromServer(collection(db, 'news')).catch(() => ({ data: () => ({ count: 0 }) }))
      ]);

      let editsCount = 0;
      try {
        const rawEdits = localStorage.getItem('vnit_cms_local_edits');
        if (rawEdits) editsCount = Object.keys(JSON.parse(rawEdits)).length;
      } catch (e) {}

      setStats({
        services: srvSnap.data().count,
        projects: prjSnap.data().count,
        news: newsSnap.data().count,
        visualEdits: editsCount,
        loading: false
      });
    } catch (e) {
      console.warn('Lỗi tải thống kê:', e);
      setStats(prev => ({ ...prev, loading: false }));
    }

    setSnapshots(getLocalSnapshotRecords());
  };

  useEffect(() => {
    loadSystemStats();
  }, []);

  // 1. XỬ LÝ TẠO BẢN SAO LƯU (BACKUP)
  const handleCreateBackup = async () => {
    try {
      setBackingUp(true);
      setErrorMessage('');

      // Thu thập dữ liệu toàn hệ thống
      const backupData = await createFullBackup('Admin Quản Trị');

      // Tải file về máy tính
      const result = downloadBackupFile(backupData);

      setLastBackupInfo({
        fileName: result.fileName,
        sizeBytes: result.size,
        timestamp: new Date().toLocaleString('vi-VN'),
        stats: backupData.stats
      });

      // Cập nhật lại danh sách snapshot
      setSnapshots(getLocalSnapshotRecords());
    } catch (err) {
      setErrorMessage('Lỗi khi tạo bản sao lưu: ' + err.message);
    } finally {
      setBackingUp(false);
    }
  };

  // 2. CHỌN FILE ĐỂ KHÔI PHỤC (SELECT FILE)
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage('');
    setRestoreSuccess(false);

    if (!file.name.endsWith('.json')) {
      setErrorMessage('Vui lòng chỉ chọn tệp sao lưu có định dạng .json');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const validation = validateBackupData(parsed);

        if (!validation.isValid) {
          setErrorMessage(validation.message || 'Tệp sao lưu không hợp lệ.');
          setValidatedData(null);
          return;
        }

        setRestoreFile({
          name: file.name,
          size: file.size,
          rawJson: parsed
        });
        setValidatedData(validation);
      } catch (err) {
        setErrorMessage('Tệp sao lưu bị lỗi cấu trúc JSON: ' + err.message);
        setValidatedData(null);
      }
    };
    reader.readAsText(file);
  };

  // 3. TIẾN HÀNH KHÔI PHỤC (EXECUTE RESTORE)
  const handleExecuteRestore = async () => {
    if (!restoreFile?.rawJson) return;

    const confirmMsg = restoreMode === 'overwrite'
      ? 'CẢNH BÁO: Chế độ "Ghi đè sạch" sẽ đồng bộ và thay thế toàn bộ dữ liệu hiện tại bằng dữ liệu trong bản sao lưu. Bạn có chắc chắn muốn tiếp tục?'
      : 'Xác nhận khôi phục và hợp nhất dữ liệu từ bản sao lưu vào hệ thống?';

    if (!window.confirm(confirmMsg)) return;

    try {
      setRestoring(true);
      setErrorMessage('');
      setRestoreSuccess(false);

      await restoreFromBackup(restoreFile.rawJson, {
        overwrite: restoreMode === 'overwrite',
        onProgress: (prog) => {
          setRestoreProgress(prog);
        }
      });

      setRestoreSuccess(true);
      await loadSystemStats();
    } catch (err) {
      setErrorMessage('Lỗi trong quá trình khôi phục: ' + err.message);
    } finally {
      setRestoring(false);
    }
  };

  // 4. KHÔI PHỤC NHANH TỪ SNAPSHOT LỊCH SỬ
  const handleQuickRestoreSnapshot = (snapshot) => {
    if (!snapshot?.snapshotData) return;
    setRestoreFile({
      name: snapshot.name,
      size: snapshot.sizeBytes,
      rawJson: snapshot.snapshotData
    });
    setValidatedData(validateBackupData(snapshot.snapshotData));
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  // 5. XÓA BẢN GHI SNAPSHOT
  const handleDeleteSnapshot = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa bản sao lưu này khỏi lịch sử trình duyệt?')) {
      const updated = deleteLocalSnapshotRecord(id);
      setSnapshots(updated);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Trung Tâm Sao Lưu & Phục Hồi Dữ Liệu"
        subtitle="Bảo toàn 100% dữ liệu website, dịch vụ, dự án, tin tức & cấu hình trực quan trước mỗi lần bảo trì"
      />

      {/* OVERVIEW METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Server size={22} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">
              {stats.loading ? '...' : stats.services}
            </div>
            <div className="text-xs text-slate-500 font-medium">Dịch vụ kỹ thuật</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
            <Layers size={22} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">
              {stats.loading ? '...' : stats.projects}
            </div>
            <div className="text-xs text-slate-500 font-medium">Dự án công trình</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center shrink-0">
            <FileJson size={22} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">
              {stats.loading ? '...' : stats.news}
            </div>
            <div className="text-xs text-slate-500 font-medium">Bài viết & Tin tức</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles size={22} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">
              {stats.loading ? '...' : stats.visualEdits}
            </div>
            <div className="text-xs text-slate-500 font-medium">Chỉnh sửa trực quan</div>
          </div>
        </div>
      </div>

      {/* ERROR BANNER */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm">
          <AlertTriangle className="shrink-0 mt-0.5 text-red-600" size={18} />
          <div>
            <p className="font-bold">Đã có lỗi xảy ra:</p>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* TWO PRIMARY COLUMNS: BACKUP & RESTORE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* CỘT 1: SAO LƯU DỮ LIỆU (BACKUP) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <Download size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">Tạo Bản Sao Lưu (Export Backup)</h3>
                <p className="text-xs text-slate-500">Đóng gói toàn bộ cơ sở dữ liệu hệ thống ra tệp .JSON</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  Quy tắc bảo toàn dữ liệu & Tối ưu hóa:
                </div>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                  <li><strong>Bảo toàn 100%</strong>: Dịch vụ, Dự án, Tin tức, Cài đặt chung, Tên công ty, Hotline, Email, Địa chỉ.</li>
                  <li><strong>Bảo toàn Chỉnh sửa Trực quan</strong>: Tất cả các can thiệp nội dung trực tiếp trên giao diện website.</li>
                  <li><strong>Tối ưu dung lượng ảnh</strong>: Hình ảnh đã được lưu trữ sẵn trên Firebase Storage / CDN nên file backup <strong>chỉ lưu URL và metadata</strong>, hoàn toàn loại bỏ chuỗi base64 nặng nề để file nhẹ tênh (&lt; 100KB), tải về máy chỉ trong 1 giây.</li>
                </ul>
              </div>

              {lastBackupInfo && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold">Đã sao lưu thành công lúc {lastBackupInfo.timestamp}</span>
                    <div className="text-[11px] text-emerald-700 mt-0.5">
                      Tệp: <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">{lastBackupInfo.fileName}</code> ({formatBytes(lastBackupInfo.sizeBytes)})
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateBackup}
            disabled={backingUp}
            className="w-full py-3.5 px-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            {backingUp ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span>Đang quét & nén dữ liệu hệ thống...</span>
              </>
            ) : (
              <>
                <Download size={18} />
                <span>Tải Bản Sao Lưu Về Máy (.JSON)</span>
              </>
            )}
          </button>
        </div>

        {/* CỘT 2: KHÔI PHỤC DỮ LIỆU (RESTORE) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Upload size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">Phục Hồi Dữ Liệu (Import & Restore)</h3>
                <p className="text-xs text-slate-500">Khôi phục website về trạng thái sao lưu bất kỳ</p>
              </div>
            </div>

            {/* VÙNG CHỌN FILE JSON */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/40 rounded-xl p-5 text-center cursor-pointer transition-colors mb-4"
            >
              <FileJson size={32} className="mx-auto text-indigo-500 mb-2" />
              <p className="text-xs font-bold text-slate-700">
                {restoreFile ? restoreFile.name : 'Nhấp để chọn file sao lưu (.JSON) từ máy tính'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {restoreFile ? `Dung lượng: ${formatBytes(restoreFile.size)}` : 'Hỗ trợ tất cả bản backup do VNIT CMS tạo ra'}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {/* PREVIEW THÔNG TIN BẢN SAO LƯU */}
            {validatedData && (
              <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-3 mb-4 text-xs">
                <div className="flex items-center justify-between font-bold text-indigo-900 pb-2 border-b border-indigo-200/60">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-emerald-600" />
                    Bản sao lưu hợp lệ (Phiên bản v{validatedData.version})
                  </span>
                  <span className="text-[11px] font-normal text-indigo-700">
                    Tạo bởi: {validatedData.exportedBy}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>• Dịch vụ: <strong>{validatedData.counts.services} mục</strong></div>
                  <div>• Dự án: <strong>{validatedData.counts.projects} mục</strong></div>
                  <div>• Tin tức: <strong>{validatedData.counts.news} mục</strong></div>
                  <div>• Chỉnh sửa trực quan: <strong>{validatedData.counts.visualEdits} mục</strong></div>
                </div>

                {/* TÙY CHỌN CHẾ ĐỘ PHỤC HỒI */}
                <div className="pt-2 border-t border-indigo-200/60">
                  <div className="font-semibold text-slate-700 mb-1.5">Chế độ khôi phục:</div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                      <input
                        type="radio"
                        name="restoreMode"
                        value="overwrite"
                        checked={restoreMode === 'overwrite'}
                        onChange={() => setRestoreMode('overwrite')}
                        className="text-indigo-600"
                      />
                      <span>Ghi đè sạch (Đồng bộ 100%)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                      <input
                        type="radio"
                        name="restoreMode"
                        value="merge"
                        checked={restoreMode === 'merge'}
                        onChange={() => setRestoreMode('merge')}
                        className="text-indigo-600"
                      />
                      <span>Hợp nhất bổ sung</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TIẾN TRÌNH KHÔI PHỤC */}
            {restoring && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2 mb-4">
                <div className="flex justify-between text-xs font-bold text-blue-900">
                  <span>{restoreProgress.message}</span>
                  <span>{restoreProgress.percent}%</span>
                </div>
                <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${restoreProgress.percent}%` }}
                  />
                </div>
              </div>
            )}

            {/* THÀNH CÔNG */}
            {restoreSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 mb-4">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span className="font-bold">Đã khôi phục toàn bộ dữ liệu thành công! Website đã được đồng bộ mới nhất.</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleExecuteRestore}
            disabled={!restoreFile || restoring}
            className="w-full py-3.5 px-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            {restoring ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span>Đang ghi dữ liệu vào hệ thống...</span>
              </>
            ) : (
              <>
                <Upload size={18} />
                <span>Tiến Hành Khôi Phục Dữ Liệu</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* DANH SÁCH CÁC ĐIỂM PHỤC HỒI ĐÃ LƯU TRÊN TRÌNH DUYỆT (SNAPSHOTS HISTORY) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2.5">
            <Clock size={18} className="text-slate-600" />
            <h3 className="font-extrabold text-slate-800 text-sm">Điểm Khôi Phục Nhanh Gần Đây (Snapshots)</h3>
          </div>
          <span className="text-xs text-slate-500">
            Tự động lưu trữ tối đa 10 bản sao lưu gần nhất trên trình duyệt
          </span>
        </div>

        {snapshots.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            Chưa có điểm khôi phục nhanh nào. Hãy nhấn "Tải Bản Sao Lưu Về Máy" để tạo bản đầu tiên.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {snapshots.map((snap) => (
              <div key={snap.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <FileJson size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{snap.name}</p>
                    <p className="text-[11px] text-slate-400">
                      Tạo ngày {new Date(snap.createdAt).toLocaleString('vi-VN')} • Dung lượng: {formatBytes(snap.sizeBytes)} • {snap.stats?.servicesCount || 0} dịch vụ, {snap.stats?.projectsCount || 0} dự án
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickRestoreSnapshot(snap)}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    title="Nạp vào khu vực khôi phục"
                  >
                    <ArrowUpRight size={14} />
                    <span>Nạp Khôi Phục</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSnapshot(snap.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Xóa khỏi lịch sử"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
