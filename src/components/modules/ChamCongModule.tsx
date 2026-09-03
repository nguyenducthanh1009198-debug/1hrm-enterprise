'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Clock,
  MapPin,
  Wifi,
  Server,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  Shield,
  Compass,
  TreePine,
  Tractor,
  Building2,
  ClipboardCheck,
  Award,
  Camera,
  Check,
  X,
  FileText,
  UserCheck,
  TrendingUp,
  Radio,
  WifiOff,
  Flame,
  Layers,
  Sparkles,
  ArrowRight,
  Droplets,
  Scale,
  FileSpreadsheet,
  Users,
  Eye,
  CheckSquare
} from 'lucide-react';
import { useHRM } from '@/context/HRMContext';
import { WorkerAttendanceStatus } from '@/types';
import {
  exportToExcel,
  exportBaoCaoChamCongToTruong,
  exportBangChamCongExcel,
  exportBaoCaoDonTuVaNoiQuy
} from '@/lib/exportEngine';

export const ChamCongModule: React.FC = () => {
  const {
    currentRole,
    currentUser,
    plantations,
    productionTeams,
    teamBatches,
    fieldInspections,
    monthlySubmissions,
    todayAttendance,
    employees,
    requests,
    approveRequest,
    rejectRequest,
    handleCheckIn,
    handleCheckOut,
    updateWorkerAttendanceStatus,
    updateRubberYield,
    approveTeamBatch,
    addFieldInspection,
    approveMonthlySubmission,
    toggleOfflineSync,
  } = useHRM();

  // Client-safe Live Clock State
  const [isMounted, setIsMounted] = useState(false);
  const [liveTime, setLiveTime] = useState('08:30:00');
  const [liveDate, setLiveDate] = useState('Thứ Năm, 3 tháng 9, 2026');

  // Inspection Modal & Form state
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [inspectionLot, setInspectionLot] = useState('Lô A1 - A5 (Tổ 1)');
  const [inspectionNotes, setInspectionNotes] = useState('Kiểm tra dăm cạo mủ đạt chuẩn độ sâu, trang bị BHLĐ đầy đủ.');
  const [inspectionPlantation, setInspectionPlantation] = useState('plant-1');

  // Active Team Batch selection for Team Leader
  const [selectedBatchId, setSelectedBatchId] = useState<string>('batch-001');
  const activeBatch = teamBatches.find((b) => b.id === selectedBatchId) || teamBatches[0];

  // Plantation Director tab inside view
  const [ntActiveTab, setNtActiveTab] = useState<'tong_hop' | 'duyet_don' | 'nhan_su_to' | 'hien_truong'>('tong_hop');

  // Success Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const update = () => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString('vi-VN'));
      setLiveDate(
        now.toLocaleDateString('vi-VN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleInspectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPlant = plantations.find((p) => p.id === inspectionPlantation);
    addFieldInspection({
      date: new Date().toLocaleDateString('vi-VN'),
      supervisorId: currentUser.id,
      supervisorName: `${currentUser.fullName} (${currentUser.positionTitle})`,
      plantationId: inspectionPlantation,
      plantationName: selectedPlant?.name || 'Nông Trường 1 (Bình Phước)',
      lotChecked: inspectionLot,
      gpsCoordinates: '11.4590° N, 106.8935° E (GPS Chính xác: 3m)',
      distanceMeters: 12,
      photoUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400&auto=format&fit=crop&q=80',
      notes: inspectionNotes,
      approvedTeamsCount: 1,
    });
    setShowInspectionModal(false);
    showToast('✓ Check-in kiểm tra thực địa lô cạo thành công!');
  };

  // Determine role perspective
  const isTeamLeader = currentRole === 'TEAM_LEADER';
  const isPlantationDirector = currentRole === 'PLANTATION_DIRECTOR';
  const isOffice = currentRole === 'OFFICE_STAFF' || currentRole === 'EMPLOYEE' || currentRole === 'DEPARTMENT_LEAD';
  const isExecutiveOrHR = ['ADMIN', 'EXECUTIVE_DIRECTOR', 'HR_MANAGER', 'HR_ADMIN'].includes(currentRole);

  const ntRequests = requests.filter((r) => r.departmentName.includes('Nông Trường') || r.departmentName.includes('Tổ'));
  const ntEmployees = employees.filter((e) => e.departmentName.includes('Nông Trường 1') || e.departmentName.includes('Tổ'));

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-500 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950 p-6 rounded-2xl text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-orange-500 text-white font-bold text-[11px] uppercase tracking-wider">
              1HRM ENTERPRISE
            </span>
            <span className="text-slate-400 text-xs font-mono">
              {isTeamLeader
                ? 'Góc Nhìn: Tổ Trưởng Khai Thác Mủ'
                : isPlantationDirector
                ? 'Góc Nhìn: Giám Đốc Nông Trường'
                : isOffice
                ? 'Góc Nhìn: Chấm Công Cá Nhân (Khối Văn Phòng)'
                : 'Góc Nhìn: Quản Trị Chấm Công Toàn Hệ Thống (HR & BGĐ)'}
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight mt-2 text-white">
            {isTeamLeader
              ? 'Quản Lý Công Nhân & Chấm Công Sản Lượng Tổ'
              : isPlantationDirector
              ? 'Quản Lý Quân Số Các Tổ & Phê Duyệt Chấm Công Nông Trường'
              : isOffice
              ? 'Bảng Chấm Công Cá Nhân & Lịch Công Ca'
              : 'Trung Tâm Quản Trị Chấm Công Toàn Hệ Thống (Nông Trường & Văn Phòng)'}
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {isTeamLeader
              ? 'Điểm danh nhanh 1-chạm, gán choàng lô, nhập sản lượng mủ và xuất file báo cáo 3 Sheet gửi Giám đốc nông trường.'
              : isPlantationDirector
              ? 'Quản lý quân số các tổ 1, 2, 3, phê duyệt đơn từ của công nhân, tổng hợp chấm công & xem báo cáo nhân sự các tổ.'
              : isOffice
              ? 'Theo dõi giờ vào/ra, số ngày công chuẩn/thực tế, chấm công FaceID/Wifi trực tuyến.'
              : 'Bao quát đồng thời 3 Nông trường cạo mủ và Khối Văn phòng Tổng công ty, đối soát công ca và chốt bảng lương.'}
          </p>
        </div>

        {/* Live Clock Card */}
        <div className="flex items-center gap-3 bg-white/10 p-3.5 rounded-xl border border-white/10 backdrop-blur-xs min-w-[220px]">
          <div className="w-10 h-10 rounded-lg bg-orange-500/30 flex items-center justify-center text-orange-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-300 font-semibold" suppressHydrationWarning>
              {isMounted ? liveDate : 'Đang đồng bộ...'}
            </p>
            <p className="text-lg font-black text-orange-400 font-mono" suppressHydrationWarning>
              {isMounted ? liveTime : '08:30:00'}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. GIAO DIỆN TỔ TRƯỞNG (TEAM_LEADER) */}
      {/* ========================================================================= */}
      {isTeamLeader && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                <TreePine className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900">{activeBatch.teamName}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {activeBatch.presentCount}/{activeBatch.totalMembers} Đi làm đủ
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quản lý {activeBatch.totalLotAreaHectares} ha vườn cạo • Lô A1 - A10
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  toggleOfflineSync(activeBatch.id);
                  showToast(activeBatch.isOfflineSync ? '⚡ Đã chuyển sang Online 5G' : '📡 Đã bật chế độ Lưu Ngoại Tuyến (Offline)');
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  activeBatch.isOfflineSync
                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                }`}
              >
                <Wifi className="w-4 h-4" />
                <span>{activeBatch.isOfflineSync ? 'Offline (Đang lưu thiết bị)' : 'Online 5G Realtime'}</span>
              </button>

              <button
                onClick={() => {
                  exportBaoCaoChamCongToTruong(activeBatch, activeBatch.teamName);
                  showToast(`✓ Đã xuất file Chấm công & Sản lượng 3 Sheet (${activeBatch.teamName}) thành công!`);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Xuất Excel 3 Sheet (Công, Sản Lượng, Báo Nghỉ)</span>
              </button>
            </div>
          </div>

          {/* Worker Attendance Table with 1-Tap Status & Yield */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900">
                Danh Sách Công Nhân Trong Tổ & Điểm Danh 1-Chạm
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                Tổng mủ nước: <b className="text-orange-600">{activeBatch.totalLatexYieldKg} kg</b> • Độ TSC TB: <b className="text-blue-600">{activeBatch.avgTscDegree}°</b>
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                    <th className="py-3 px-4">Công Nhân</th>
                    <th className="py-3 px-3">Lô Cạo Phụ Trách</th>
                    <th className="py-3 px-3 text-center">Điểm Danh 1-Chạm</th>
                    <th className="py-3 px-3 text-right">Mủ Nước (kg)</th>
                    <th className="py-3 px-3 text-right">Mủ Chén (kg)</th>
                    <th className="py-3 px-3 text-center">Độ Khô TSC (%)</th>
                    <th className="py-3 px-4">Choàng Lô / Ghi Chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {activeBatch.items.map((worker) => (
                    <tr key={worker.workerId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img src={worker.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                          <div>
                            <p className="font-bold text-slate-900">{worker.workerName}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{worker.workerCode}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700">{worker.lotAssigned}</td>
                      <td className="py-3 px-3 text-center">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => updateWorkerAttendanceStatus(activeBatch.id, worker.workerId, 'DU')}
                            className={`px-2.5 py-1 rounded-lg font-bold text-xs ${worker.status === 'DU' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                          >
                            ✓ Đủ
                          </button>
                          <button
                            onClick={() => updateWorkerAttendanceStatus(activeBatch.id, worker.workerId, 'CHOANG_LO', 'Hoàng Văn Phúc')}
                            className={`px-2.5 py-1 rounded-lg font-bold text-xs ${worker.status === 'CHOANG_LO' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                          >
                            ⚡ Choàng
                          </button>
                          <button
                            onClick={() => updateWorkerAttendanceStatus(activeBatch.id, worker.workerId, 'NGHI_PHEP')}
                            className={`px-2.5 py-1 rounded-lg font-bold text-xs ${worker.status === 'NGHI_PHEP' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                          >
                            Phép
                          </button>
                          <button
                            onClick={() => updateWorkerAttendanceStatus(activeBatch.id, worker.workerId, 'NGHI_KHONG_PHEP')}
                            className={`px-2.5 py-1 rounded-lg font-bold text-xs ${worker.status === 'NGHI_KHONG_PHEP' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                          >
                            Vắng
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-black text-slate-900">{worker.latexYieldKg || 42.5}</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-700">{worker.cupLumpYieldKg || 6.0}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-blue-600">{worker.tscDegree || 34.5}°</td>
                      <td className="py-3 px-4 text-slate-600">
                        {worker.coveredForWorkerName ? (
                          <span className="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                            Choàng thêm phần của {worker.coveredForWorkerName}
                          </span>
                        ) : (
                          <span className="italic text-slate-400">Đúng định mức</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. GIAO DIỆN GIÁM ĐỐC NÔNG TRƯỜNG (PLANTATION_DIRECTOR) */}
      {/* ========================================================================= */}
      {isPlantationDirector && (
        <div className="space-y-6">
          {/* Top Plantation Sub-nav */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setNtActiveTab('tong_hop')}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  ntActiveTab === 'tong_hop' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                1. Quân Số & Tổng Hợp Chấm Công Các Tổ
              </button>
              <button
                onClick={() => setNtActiveTab('duyet_don')}
                className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  ntActiveTab === 'duyet_don' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                2. Phê Duyệt Đơn Từ Các Tổ ({ntRequests.length})
              </button>
              <button
                onClick={() => setNtActiveTab('nhan_su_to')}
                className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  ntActiveTab === 'nhan_su_to' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                3. Báo Cáo Nhân Sự Nông Trường ({ntEmployees.length})
              </button>
              <button
                onClick={() => setNtActiveTab('hien_truong')}
                className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  ntActiveTab === 'hien_truong' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                4. Kiểm Tra Hiện Trường (GPS & Camera)
              </button>
            </div>

            <button
              onClick={() => setShowInspectionModal(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <Camera className="w-4 h-4 text-blue-400" /> Check-in Kiểm Tra Lô
            </button>
          </div>

          {/* Sub-tab 1: Tổng hợp quân số & duyệt công tổ */}
          {ntActiveTab === 'tong_hop' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                  <p className="text-xs text-slate-500">Tổng Quân Số Khai Thác Nông Trường 1</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">320 Công Nhân</p>
                  <p className="text-xs text-emerald-600 font-bold mt-1">312 Đi làm đủ (97.5%)</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                  <p className="text-xs text-slate-500">Tổng Sản Lượng Mủ Nước Ngày</p>
                  <p className="text-2xl font-black text-orange-600 mt-1">13.250 kg</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Vượt 4.2% định mức khoán</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                  <p className="text-xs text-slate-500">Độ Khô TSC Trung Bình</p>
                  <p className="text-2xl font-black text-blue-600 mt-1">34.5%</p>
                  <p className="text-xs text-emerald-700 font-bold mt-1">✓ Đạt tiêu chuẩn xuất khẩu</p>
                </div>
              </div>

              {/* Batches Table to Approve */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900">
                    Tổng Hợp Chấm Công Nộp Lên Từ Các Tổ Trưởng (Nông Trường 1)
                  </h3>
                  <button
                    onClick={() => {
                      approveTeamBatch(activeBatch.id);
                      showToast('✓ Đã phê duyệt và chốt bảng chấm công toàn Nông trường 1!');
                    }}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                  >
                    <CheckSquare className="w-4 h-4" /> 1-Click Duyệt Toàn Bộ Các Tổ
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                        <th className="py-3 px-4">Tổ Sản Xuất</th>
                        <th className="py-3 px-3">Tổ Trưởng Phụ Trách</th>
                        <th className="py-3 px-3 text-right">Quân Số</th>
                        <th className="py-3 px-3 text-right">Đi Làm Đủ</th>
                        <th className="py-3 px-3 text-right">Vắng / Phép</th>
                        <th className="py-3 px-3 text-right">Sản Lượng Mủ</th>
                        <th className="py-3 px-3 text-center">Trạng Thái Duyệt</th>
                        <th className="py-3 px-4 text-center">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {teamBatches.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold text-slate-900">{b.teamName}</td>
                          <td className="py-3 px-3 text-slate-700">{b.leaderName}</td>
                          <td className="py-3 px-3 text-right font-black">{b.totalMembers} người</td>
                          <td className="py-3 px-3 text-right font-black text-emerald-600">{b.presentCount}</td>
                          <td className="py-3 px-3 text-right font-bold text-rose-600">{b.absentCount}</td>
                          <td className="py-3 px-3 text-right font-black text-orange-600">{b.totalLatexYieldKg} kg ({b.avgTscDegree}°)</td>
                          <td className="py-3 px-3 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${b.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                              {b.status === 'APPROVED' ? 'Đã duyệt' : 'Chờ GĐ duyệt'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => {
                                approveTeamBatch(b.id);
                                showToast(`✓ Đã duyệt bảng công ${b.teamName}!`);
                              }}
                              className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg"
                            >
                              Duyệt Tổ
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab 2: Phê duyệt đơn từ các tổ */}
          {ntActiveTab === 'duyet_don' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-900">
                  Danh Sách Đơn Từ Của Công Nhân & Tổ Trưởng Thuộc Nông Trường
                </h3>
                <button
                  onClick={() => exportBaoCaoDonTuVaNoiQuy(ntRequests)}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" /> Xuất Excel Đơn Từ
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                      <th className="py-3 px-4">Mã Đơn</th>
                      <th className="py-3 px-4">Công Nhân / Tổ Trưởng</th>
                      <th className="py-3 px-3">Tổ Sản Xuất</th>
                      <th className="py-3 px-3">Loại Đơn</th>
                      <th className="py-3 px-3">Thời Gian</th>
                      <th className="py-3 px-4">Lý Do / Chế Độ</th>
                      <th className="py-3 px-3 text-center">Trạng Thái</th>
                      <th className="py-3 px-4 text-center">Giám Đốc Phê Duyệt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {ntRequests.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{r.code}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{r.employeeName}</td>
                        <td className="py-3 px-3 text-slate-700">{r.departmentName}</td>
                        <td className="py-3 px-3 font-semibold">{r.typeName}</td>
                        <td className="py-3 px-3 font-mono text-slate-600">{r.startDate}</td>
                        <td className="py-3 px-4 text-slate-600">{r.specificDetails || r.reason}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${r.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {r.status === 'APPROVED' ? 'Đã duyệt' : 'Chờ GĐ duyệt'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {r.status === 'PENDING' ? (
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => {
                                  approveRequest(r.id);
                                  showToast(`✓ Giám đốc đã duyệt đơn ${r.code}!`);
                                }}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                              >
                                Duyệt
                              </button>
                              <button
                                onClick={() => {
                                  rejectRequest(r.id);
                                  showToast(`Đã từ chối đơn ${r.code}`);
                                }}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs"
                              >
                                Từ chối
                              </button>
                            </div>
                          ) : (
                            <span className="text-emerald-700 font-bold text-xs">✓ Đã phê duyệt</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-tab 3: Báo cáo nhân sự nông trường */}
          {ntActiveTab === 'nhan_su_to' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <h3 className="text-sm font-black text-slate-900">
                  Báo Cáo Nhân Sự & Danh Sách Công Nhân Thuộc Nông Trường 1
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                      <th className="py-3 px-4">Mã NV</th>
                      <th className="py-3 px-4">Họ Và Tên</th>
                      <th className="py-3 px-3">Tổ Trực Thuộc</th>
                      <th className="py-3 px-3">Chức Danh</th>
                      <th className="py-3 px-3">Hợp Đồng</th>
                      <th className="py-3 px-3 text-center">Tiến Độ Hồ Sơ</th>
                      <th className="py-3 px-4">Tình Trạng Giấy Tờ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {ntEmployees.map((e) => (
                      <tr key={e.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{e.code}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{e.fullName}</td>
                        <td className="py-3 px-3 text-slate-700">{e.departmentName}</td>
                        <td className="py-3 px-3 font-semibold">{e.positionTitle}</td>
                        <td className="py-3 px-3">{e.contractType}</td>
                        <td className="py-3 px-3 text-center font-bold text-emerald-600">{e.profileCompleteness || 100}%</td>
                        <td className="py-3 px-4">
                          {e.isProfileComplete !== false ? (
                            <span className="text-emerald-700 font-semibold">✓ Đầy đủ giấy tờ</span>
                          ) : (
                            <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold">
                              Thiếu: {e.missingDocuments?.join(', ')}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-tab 4: Hiện trường GPS & Camera */}
          {ntActiveTab === 'hien_truong' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fieldInspections.map((insp) => (
                  <div key={insp.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <img src={insp.photoUrl} alt="" className="w-full h-44 object-cover rounded-xl border border-slate-200" />
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900 text-sm">{insp.lotChecked}</span>
                        <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                          {insp.gpsCoordinates}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 italic">{insp.notes}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-2 pt-2 border-t border-slate-100">
                        Cán bộ kiểm tra: {insp.supervisorName} • Ngày: {insp.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. GIAO DIỆN KHỐI VĂN PHÒNG (OFFICE_STAFF / EMPLOYEE) */}
      {/* ========================================================================= */}
      {isOffice && (
        <div className="space-y-6">
          {/* 1-Tap Online Check-in Card */}
          <div className="p-6 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-black/20 text-xs font-bold font-mono">
                Ca Hành Chính Văn Phòng (08:00 - 17:30)
              </span>
              <h2 className="text-2xl font-black mt-2">Chấm Công Trực Tuyến FaceID & Wifi Công Ty</h2>
              <p className="text-xs text-emerald-100 mt-1">
                Địa điểm: Trụ sở Five Star Kim Giang • IP Wifi: 192.168.97.103 (Hợp lệ)
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  handleCheckIn('FaceID / IP Wifi', 'Văn Phòng Tổng Công Ty');
                  showToast('✓ Đã Check-in vào ca thành công!');
                }}
                className="px-5 py-3 bg-white text-emerald-950 font-black rounded-xl shadow-lg flex items-center gap-2 active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Check-in Vào Ca
              </button>

              <button
                onClick={() => {
                  handleCheckOut();
                  showToast('✓ Đã Check-out hết ca làm việc!');
                }}
                className="px-5 py-3 bg-emerald-950/40 text-white font-bold rounded-xl border border-white/20 flex items-center gap-2 active:scale-95 transition-all"
              >
                <Clock className="w-5 h-5" /> Check-out Hết Ca
              </button>
            </div>
          </div>

          {/* Monthly Attendance Calendar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-black text-slate-900 text-sm">Bảng Chấm Công Cá Nhân Tháng 08/2026 - {currentUser.fullName}</h3>
                <p className="text-xs text-slate-500">Mã NV: {currentUser.code} • Phòng Ban: {currentUser.departmentName}</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="text-emerald-700">Công chuẩn: 24 ngày</span>
                <span className="text-blue-700">Công thực tế: 24 ngày (100%)</span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d) => (
                <div key={d} className="font-bold text-slate-500 py-1">{d}</div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                const isWeekend = day % 7 === 6 || day % 7 === 0;
                return (
                  <div
                    key={day}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      isWeekend
                        ? 'bg-slate-50 border-slate-100 text-slate-400'
                        : 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-bold'
                    }`}
                  >
                    <p className="text-[10px] text-slate-400">{day}</p>
                    <p className="text-xs font-black mt-0.5">{isWeekend ? 'Nghỉ' : '1.0'}</p>
                    {!isWeekend && <p className="text-[9px] text-emerald-700 font-mono">08:15-17:35</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. GIAO DIỆN HR & BAN GIÁM ĐỐC TOÀN HỆ THỐNG (ADMIN, EXECUTIVE, HR) */}
      {/* ========================================================================= */}
      {isExecutiveOrHR && (
        <div className="space-y-6">
          {/* High-Level Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs text-slate-500">Tổng Quân Số Khối Cạo Mủ (3 Nông Trường)</p>
              <p className="text-2xl font-black text-slate-900 mt-1">940 Người</p>
              <p className="text-xs text-emerald-600 font-bold mt-1">918 Công nhân đi làm đủ (97.6%)</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs text-slate-500">Tổng Quân Số Khối Văn Phòng</p>
              <p className="text-2xl font-black text-blue-600 mt-1">78 Cán Bộ</p>
              <p className="text-xs text-blue-700 font-bold mt-1">76 Người có mặt đúng giờ (97.4%)</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs text-slate-500">Tổng Sản Lượng Mủ Giao Nộp Ngày</p>
              <p className="text-2xl font-black text-orange-600 mt-1">42.8 Tấn</p>
              <p className="text-xs text-orange-700 font-semibold mt-1">Độ khô TSC TB: 34.5°</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs text-slate-500">Chốt Bảng Công Tự Động Sang Tiền Lương</p>
              <p className="text-2xl font-black text-purple-600 mt-1">100% Đồng Bộ</p>
              <p className="text-xs text-purple-700 font-bold mt-1">Đã áp dụng Luật Thuế 109</p>
            </div>
          </div>

          {/* Cross-Plantation Attendance Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-900">
                Báo Cáo Đối Soát Chấm Công Toàn Diện 3 Nông Trường & Khối Văn Phòng
              </h3>
              <span className="text-xs font-bold text-emerald-600">Đã chốt công Tháng 08/2026</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                    <th className="py-3 px-4">Đơn Vị / Khối</th>
                    <th className="py-3 px-3 text-right">Tổng Quân Số</th>
                    <th className="py-3 px-3 text-right">Đi Làm Đủ</th>
                    <th className="py-3 px-3 text-right">Tỷ Lệ Đúng Giờ (%)</th>
                    <th className="py-3 px-3 text-right">Sản Lượng Mủ (Tấn)</th>
                    <th className="py-3 px-4 text-center">Trạng Thái Chốt Công</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">Nông Trường 1 (Bình Phước)</td>
                    <td className="py-3 px-3 text-right font-black">320 người</td>
                    <td className="py-3 px-3 text-right font-black text-emerald-600">312</td>
                    <td className="py-3 px-3 text-right font-bold text-blue-600">97.5%</td>
                    <td className="py-3 px-3 text-right font-black text-orange-600">14.5 Tấn</td>
                    <td className="py-3 px-4 text-center text-emerald-700 font-bold">✓ Đã chốt & chuyển lương</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">Nông Trường 3 (Tây Ninh)</td>
                    <td className="py-3 px-3 text-right font-black">380 người</td>
                    <td className="py-3 px-3 text-right font-black text-emerald-600">371</td>
                    <td className="py-3 px-3 text-right font-bold text-blue-600">97.6%</td>
                    <td className="py-3 px-3 text-right font-black text-orange-600">17.2 Tấn</td>
                    <td className="py-3 px-4 text-center text-emerald-700 font-bold">✓ Đã chốt & chuyển lương</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">Nông Trường 2 (Bình Dương)</td>
                    <td className="py-3 px-3 text-right font-black">240 người</td>
                    <td className="py-3 px-3 text-right font-black text-emerald-600">235</td>
                    <td className="py-3 px-3 text-right font-bold text-blue-600">97.9%</td>
                    <td className="py-3 px-3 text-right font-black text-orange-600">11.1 Tấn</td>
                    <td className="py-3 px-4 text-center text-emerald-700 font-bold">✓ Đã chốt & chuyển lương</td>
                  </tr>
                  <tr className="hover:bg-slate-50 bg-slate-50/60 font-semibold">
                    <td className="py-3 px-4 font-bold text-slate-900">Khối Văn Phòng Tổng Công Ty</td>
                    <td className="py-3 px-3 text-right font-black">78 người</td>
                    <td className="py-3 px-3 text-right font-black text-emerald-600">76</td>
                    <td className="py-3 px-3 text-right font-bold text-blue-600">97.4%</td>
                    <td className="py-3 px-3 text-right text-slate-400">-</td>
                    <td className="py-3 px-4 text-center text-emerald-700 font-bold">✓ Đã chốt & chuyển lương</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Field Inspection Modal */}
      {showInspectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden space-y-4">
            <div className="p-5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Check-in Kiểm Tra Hiện Trường Lô Cạo</h3>
                <p className="text-xs text-blue-100">Hệ thống sẽ tự động đối soát tọa độ GPS và gắn ảnh</p>
              </div>
              <button onClick={() => setShowInspectionModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInspectionSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Chọn Nông Trường</label>
                <select
                  value={inspectionPlantation}
                  onChange={(e) => setInspectionPlantation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900"
                >
                  {plantations.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Lô Cạo Cần Kiểm Tra</label>
                <input
                  type="text"
                  value={inspectionLot}
                  onChange={(e) => setInspectionLot(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ghi Chú Kiểm Tra Kỹ Thuật</label>
                <textarea
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 text-[11px] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Tọa độ GPS tự động: 11.4590° N, 106.8935° E (Bán kính hợp lệ 12m)</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInspectionModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Lưu Kết Quả Kiểm Tra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
