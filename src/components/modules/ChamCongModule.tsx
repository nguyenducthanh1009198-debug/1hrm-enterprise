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
  Scale
} from 'lucide-react';
import { useHRM } from '@/context/HRMContext';
import { WorkerAttendanceStatus } from '@/types';

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
    handleCheckIn,
    handleCheckOut,
    updateWorkerAttendanceStatus,
    updateRubberYield,
    approveTeamBatch,
    addFieldInspection,
    approveMonthlySubmission,
    toggleOfflineSync,
  } = useHRM();

  // 5 Tabs strictly matching the 5 roles in the picture
  const [activeTierTab, setActiveTierTab] = useState<
    'TO_TRUONG' | 'BGD_NONG_TRUONG' | 'KHOI_VAN_PHONG' | 'PHONG_HCTH' | 'BAN_TGD'
  >('TO_TRUONG');

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

  // Auto-switch tier tab based on user's active role if applicable
  useEffect(() => {
    if (currentRole === 'TEAM_LEADER') setActiveTierTab('TO_TRUONG');
    else if (currentRole === 'PLANTATION_DIRECTOR') setActiveTierTab('BGD_NONG_TRUONG');
    else if (currentRole === 'DEPARTMENT_LEAD' || currentRole === 'OFFICE_STAFF') setActiveTierTab('KHOI_VAN_PHONG');
    else if (currentRole === 'HR_MANAGER' || currentRole === 'HR_ADMIN') setActiveTierTab('PHONG_HCTH');
    else if (currentRole === 'ADMIN' || currentRole === 'EXECUTIVE_DIRECTOR') setActiveTierTab('BAN_TGD');
  }, [currentRole]);

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
              1HRM Plantation & Corporate
            </span>
            <span className="text-slate-400 text-xs font-mono">
              Hệ thống Chấm công & Điều hành 5 Cấp
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight mt-2 text-white">
            Quy Trình Chấm Công & Quản Trị Hiện Trường Nông Trường
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Kết nối xuyên suốt từ Tổ trưởng cạo mủ tại hiện trường $\rightarrow$ Cán bộ kiểm tra lô $\rightarrow$ Khối Văn phòng FaceID $\rightarrow$ Phòng HCTH chốt công $\rightarrow$ Ban TGĐ phê duyệt 1-click.
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

      {/* 5-Tier Role Matrix Navigation Bar (Matching User Image) */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          <button
            onClick={() => setActiveTierTab('TO_TRUONG')}
            className={`p-3.5 rounded-xl text-left transition-all flex flex-col justify-between gap-2 border ${
              activeTierTab === 'TO_TRUONG'
                ? 'bg-orange-50 border-orange-500 text-orange-950 ring-2 ring-orange-500/20 shadow-xs'
                : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-orange-100 text-orange-600">
                <TreePine className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                Cấp 1
              </span>
            </div>
            <div>
              <p className="text-xs font-black">1. Tổ Trưởng</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Chấm công tổ 1-chạm & Giao nộp mủ</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTierTab('BGD_NONG_TRUONG')}
            className={`p-3.5 rounded-xl text-left transition-all flex flex-col justify-between gap-2 border ${
              activeTierTab === 'BGD_NONG_TRUONG'
                ? 'bg-blue-50 border-blue-500 text-blue-950 ring-2 ring-blue-500/20 shadow-xs'
                : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <Tractor className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                Cấp 2
              </span>
            </div>
            <div>
              <p className="text-xs font-black">2. BGĐ Nông Trường</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Check-in lô cạo & Duyệt công tổ</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTierTab('KHOI_VAN_PHONG')}
            className={`p-3.5 rounded-xl text-left transition-all flex flex-col justify-between gap-2 border ${
              activeTierTab === 'KHOI_VAN_PHONG'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                <Building2 className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                Cấp 3
              </span>
            </div>
            <div>
              <p className="text-xs font-black">3. Khối Văn Phòng</p>
              <p className="text-[11px] text-slate-500 mt-0.5">FaceID/Vân tay & Duyệt đơn trực tuyến</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTierTab('PHONG_HCTH')}
            className={`p-3.5 rounded-xl text-left transition-all flex flex-col justify-between gap-2 border ${
              activeTierTab === 'PHONG_HCTH'
                ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-500/20 shadow-xs'
                : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-amber-100 text-amber-600">
                <ClipboardCheck className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                Cấp 4
              </span>
            </div>
            <div>
              <p className="text-xs font-black">4. Phòng HCTH</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Tổng hợp VP+NT & Chốt bảng công</p>
            </div>
          </button>

          <button
            onClick={() => setActiveTierTab('BAN_TGD')}
            className={`p-3.5 rounded-xl text-left transition-all flex flex-col justify-between gap-2 border ${
              activeTierTab === 'BAN_TGD'
                ? 'bg-purple-50 border-purple-500 text-purple-950 ring-2 ring-purple-500/20 shadow-xs'
                : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-lg bg-purple-100 text-purple-600">
                <Award className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                Cấp 5
              </span>
            </div>
            <div>
              <p className="text-xs font-black">5. Ban Tổng Giám Đốc</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Dashboard điều hành & Duyệt 1-click</p>
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TIER 1: TỔ TRƯỞNG NÔNG TRƯỜNG */}
      {/* ========================================================================= */}
      {activeTierTab === 'TO_TRUONG' && (
        <div className="space-y-6">
          {/* Top Control Bar for Team Leader */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 flex items-center gap-1">
                  <TreePine className="w-3.5 h-3.5" /> Giao diện Tổ Trưởng (Mobile & Web)
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  {activeBatch.teamName} - {activeBatch.plantationName}
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 mt-1">
                Bảng Chấm Công Tổ Sản Xuất (Tối đa 50 người) & Ghi Nhận Sản Lượng Mủ
              </h2>
            </div>

            {/* Offline Sync Mode Switcher */}
            <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                {activeBatch.isOfflineSync ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg">
                    <WifiOff className="w-3.5 h-3.5 animate-pulse" /> Đang Lưu Offline (Vườn mất sóng)
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                    <Radio className="w-3.5 h-3.5 animate-pulse" /> Đã Đồng Bộ 4G/Wifi
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  toggleOfflineSync(activeBatch.id);
                  showToast(
                    activeBatch.isOfflineSync
                      ? '✓ Đã kích hoạt chế độ trực tuyến & Đồng bộ dữ liệu lên máy chủ!'
                      : '✓ Đã chuyển sang chế độ Lưu Trữ Offline trong vườn cây!'
                  );
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs"
              >
                {activeBatch.isOfflineSync ? 'Bấm để Đồng bộ Online' : 'Bật chế độ Offline'}
              </button>
            </div>
          </div>

          {/* Quick Metrics of Active Batch */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <p className="text-[11px] font-semibold text-slate-500">Quân số tổ</p>
              <p className="text-xl font-black text-slate-900 mt-1">{activeBatch.totalMembers} Người</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Mặc định: Đi làm đủ</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 shadow-xs">
              <p className="text-[11px] font-semibold text-emerald-800">Có mặt thực tế</p>
              <p className="text-xl font-black text-emerald-900 mt-1">{activeBatch.presentCount} Người</p>
              <p className="text-[10px] text-emerald-700 font-bold mt-0.5">1-Chạm xác nhận</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 shadow-xs">
              <p className="text-[11px] font-semibold text-blue-800">Choàng lô (Cạo thay)</p>
              <p className="text-xl font-black text-blue-900 mt-1">{activeBatch.coveredCount} Người</p>
              <p className="text-[10px] text-blue-700 font-bold mt-0.5">Hưởng phụ cấp choàng</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 shadow-xs">
              <p className="text-[11px] font-semibold text-amber-800">Nghỉ phép / Ốm</p>
              <p className="text-xl font-black text-amber-900 mt-1">{activeBatch.leaveCount} Người</p>
              <p className="text-[10px] text-amber-700 font-bold mt-0.5">Có đơn xin phép</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 shadow-xs">
              <p className="text-[11px] font-semibold text-orange-800">Tổng sản lượng mủ</p>
              <p className="text-xl font-black text-orange-900 mt-1">{activeBatch.totalLatexYieldKg} kg</p>
              <p className="text-[10px] text-orange-700 font-bold mt-0.5">Mủ nước & mủ chén</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 shadow-xs">
              <p className="text-[11px] font-semibold text-purple-800">Độ khô trung bình</p>
              <p className="text-xl font-black text-purple-900 mt-1">{activeBatch.avgTscDegree}° TSC</p>
              <p className="text-[10px] text-purple-700 font-bold mt-0.5">Tiêu chuẩn $\ge 32^\circ$</p>
            </div>
          </div>

          {/* 1-Tap Attendance & Rubber Yield Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  Danh Sách Công Nhân Cạo Mủ Trong Tổ (1-Chạm Đổi Trạng Thái)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mặc định hệ thống tự điền <b>ĐỦ</b> cho toàn tổ. Tổ trưởng chỉ cần tick chọn người <b>Nghỉ</b> hoặc <b>Choàng lô</b> và nhập cân nặng mủ.
                </p>
              </div>
              <button
                onClick={() => {
                  showToast('✓ Bảng công tổ đã được lưu và gửi tới Cán bộ / BGĐ Nông Trường xét duyệt!');
                }}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Gửi Bảng Công & Mủ Lên Cấp Trên
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                    <th className="py-3 px-4">Công Nhân</th>
                    <th className="py-3 px-3">Lô Được Giao</th>
                    <th className="py-3 px-3">Trạng Thái Chấm Công (1 Chạm)</th>
                    <th className="py-3 px-3 text-right">Sản Lượng Mủ Nước (kg)</th>
                    <th className="py-3 px-3 text-right">Mủ Chén/Đông (kg)</th>
                    <th className="py-3 px-3 text-center">Độ TSC (%)</th>
                    <th className="py-3 px-4">Ghi Chú Nghiệp Vụ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {activeBatch.items.map((worker) => (
                    <tr key={worker.workerId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={worker.avatar}
                            alt={worker.workerName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{worker.workerName}</p>
                            <p className="text-[11px] text-slate-500 font-mono">{worker.workerCode}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-semibold text-slate-700">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 text-[11px]">
                          {worker.lotAssigned}
                        </span>
                      </td>

                      {/* 1-Tap Status Switch Buttons */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            onClick={() =>
                              updateWorkerAttendanceStatus(activeBatch.id, worker.workerId, 'DU')
                            }
                            className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                              worker.status === 'DU'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            ✓ Đủ
                          </button>

                          <button
                            onClick={() =>
                              updateWorkerAttendanceStatus(activeBatch.id, worker.workerId, 'CHOANG_LO', 'Hoàng Văn Phúc')
                            }
                            className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                              worker.status === 'CHOANG_LO'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            ⚡ Choàng Lô
                          </button>

                          <button
                            onClick={() =>
                              updateWorkerAttendanceStatus(activeBatch.id, worker.workerId, 'NGHI_PHEP')
                            }
                            className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                              worker.status === 'NGHI_PHEP'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Phép
                          </button>

                          <button
                            onClick={() =>
                              updateWorkerAttendanceStatus(activeBatch.id, worker.workerId, 'NGHI_KHONG_PHEP')
                            }
                            className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                              worker.status === 'NGHI_KHONG_PHEP'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Vắng
                          </button>
                        </div>
                      </td>

                      {/* Yield Inputs */}
                      <td className="py-3 px-3 text-right">
                        <input
                          type="number"
                          step="0.1"
                          disabled={worker.status === 'NGHI_PHEP' || worker.status === 'NGHI_KHONG_PHEP'}
                          value={worker.latexYieldKg || ''}
                          onChange={(e) =>
                            updateRubberYield(
                              activeBatch.id,
                              worker.workerId,
                              parseFloat(e.target.value) || 0,
                              worker.cupLumpYieldKg || 0,
                              worker.tscDegree || 34.0
                            )
                          }
                          className="w-20 px-2 py-1 text-right text-xs font-bold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-slate-100"
                        />
                      </td>

                      <td className="py-3 px-3 text-right">
                        <input
                          type="number"
                          step="0.1"
                          disabled={worker.status === 'NGHI_PHEP' || worker.status === 'NGHI_KHONG_PHEP'}
                          value={worker.cupLumpYieldKg || ''}
                          onChange={(e) =>
                            updateRubberYield(
                              activeBatch.id,
                              worker.workerId,
                              worker.latexYieldKg || 0,
                              parseFloat(e.target.value) || 0,
                              worker.tscDegree || 34.0
                            )
                          }
                          className="w-18 px-2 py-1 text-right text-xs font-bold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-slate-100"
                        />
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className="font-mono font-bold text-slate-800">
                          {worker.tscDegree ? `${worker.tscDegree}°` : '-'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        {worker.coveredForWorkerName && (
                          <span className="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                            Choàng thêm phần của {worker.coveredForWorkerName}
                          </span>
                        )}
                        {worker.note && <span className="italic">{worker.note}</span>}
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
      {/* TIER 2: CÁN BỘ CẤP TRÊN / BGĐ NÔNG TRƯỜNG */}
      {/* ========================================================================= */}
      {activeTierTab === 'BGD_NONG_TRUONG' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 flex items-center gap-1">
                  <Tractor className="w-3.5 h-3.5" /> Giao diện BGĐ Nông Trường & Cán Bộ Cấp Trên
                </span>
                <span className="text-xs font-semibold text-slate-600">Nông Trường 1 (Bình Phước)</span>
              </div>
              <h2 className="text-lg font-black text-slate-900 mt-1">
                Kiểm Tra Thực Địa Lô Cạo & Phê Duyệt Bảng Công Các Tổ Trực Thuộc
              </h2>
            </div>

            <button
              onClick={() => setShowInspectionModal(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <Camera className="w-4 h-4" /> Check-in Kiểm Tra Hiện Trường (GPS + Ảnh)
            </button>
          </div>

          {/* Pending Batches to Approve */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-blue-600" /> Bảng Chấm Công Các Tổ Chờ Phê Duyệt Ngày Hôm Nay
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamBatches.map((batch) => (
                <div
                  key={batch.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-blue-400 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase font-mono">
                        {batch.teamId}
                      </span>
                      <h4 className="font-black text-slate-900 text-sm mt-1">{batch.teamName}</h4>
                      <p className="text-xs text-slate-500">{batch.leaderName}</p>
                    </div>

                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        batch.status === 'APPROVED_SUPERVISOR'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {batch.status === 'APPROVED_SUPERVISOR' ? '✓ Đã Phê Duyệt' : 'Chờ Ban GĐ Duyệt'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl text-center text-xs">
                    <div>
                      <p className="text-slate-500 text-[10px]">Đi làm / Tổng</p>
                      <p className="font-bold text-slate-900">{batch.presentCount}/{batch.totalMembers}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px]">Sản lượng mủ</p>
                      <p className="font-bold text-orange-600">{batch.totalLatexYieldKg} kg</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px]">Độ khô TSC</p>
                      <p className="font-bold text-purple-600">{batch.avgTscDegree}°</p>
                    </div>
                  </div>

                  {batch.supervisorComment && (
                    <p className="text-xs italic text-slate-600 bg-blue-50/70 p-2.5 rounded-lg border border-blue-100">
                      💬 Nhận xét: {batch.supervisorComment}
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    {batch.status !== 'APPROVED_SUPERVISOR' ? (
                      <button
                        onClick={() => {
                          approveTeamBatch(batch.id, 'Đã kiểm tra đối soát sản lượng lô cạo. Đạt yêu cầu.');
                          showToast(`✓ Đã phê duyệt bảng công cho ${batch.teamName}!`);
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" /> Phê Duyệt Bảng Công
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Đã hoàn tất duyệt lúc {batch.approvedAt}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Field Inspection Logs */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-600" /> Nhật Ký Kiểm Tra Thực Địa & Chụp Ảnh Hiện Trường Lô Cạo
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fieldInspections.map((insp) => (
                <div
                  key={insp.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row gap-4 items-start"
                >
                  <img
                    src={insp.photoUrl}
                    alt="Hiện trường"
                    className="w-full sm:w-32 h-28 rounded-lg object-cover border border-slate-200 shadow-xs shrink-0"
                  />
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900">{insp.lotChecked}</span>
                      <span className="text-slate-400 font-mono text-[10px]">{insp.timestamp}</span>
                    </div>
                    <p className="text-slate-600 font-semibold">{insp.supervisorName}</p>
                    <p className="text-[11px] text-blue-700 font-mono flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" /> {insp.gpsCoordinates}
                    </p>
                    <p className="text-slate-600 italic bg-white p-2 rounded border border-slate-200 mt-1">
                      "{insp.notes}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TIER 3: KHỐI VĂN PHÒNG (TRƯỞNG PHÒNG / NHÂN VIÊN) */}
      {/* ========================================================================= */}
      {activeTierTab === 'KHOI_VAN_PHONG' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" /> Giao diện Khối Văn Phòng & Tòa Nhà Trụ Sở
                </span>
                <span className="text-xs font-semibold text-slate-600">Trụ sở Hà Nội & Chi nhánh TP.HCM</span>
              </div>
              <h2 className="text-lg font-black text-slate-900 mt-1">
                Chấm Công FaceID / Vân Tay & Duyệt Đơn Nghỉ Phép Trực Tuyến
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  handleCheckIn('FaceID', 'Sảnh Tòa Nhà Five Star (FaceID Camera)');
                  showToast('✓ Chấm công FaceID sảnh văn phòng thành công!');
                }}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" /> Chấm FaceID / Vân Tay Sảnh
              </button>
            </div>
          </div>

          {/* Today Attendance Log of Office */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900">
              Nhật Ký Chấm Công Khối Văn Phòng Hôm Nay (Kết nối Máy ZKTeco / Hikvision)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                    <th className="py-3 px-4">Nhân Viên</th>
                    <th className="py-3 px-3">Phòng Ban</th>
                    <th className="py-3 px-3">Phương Thức</th>
                    <th className="py-3 px-3">Giờ Vào</th>
                    <th className="py-3 px-3">Giờ Ra</th>
                    <th className="py-3 px-3">Địa Điểm</th>
                    <th className="py-3 px-4 text-center">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {todayAttendance.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{rec.employeeName}</td>
                      <td className="py-3 px-3 text-slate-600">{currentUser.departmentName}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[11px]">
                          {rec.checkInMethod}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-700">{rec.checkIn || '--:--'}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-700">{rec.checkOut || '--:--'}</td>
                      <td className="py-3 px-3 text-slate-600">{rec.checkInLocation}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 text-[11px]">
                          {rec.status}
                        </span>
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
      {/* TIER 4: PHÒNG HÀNH CHÍNH TỔNG HỢP (HCTH) */}
      {/* ========================================================================= */}
      {activeTierTab === 'PHONG_HCTH' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 flex items-center gap-1">
                  <ClipboardCheck className="w-3.5 h-3.5" /> Giao diện Quản Trị Phòng HCTH (Admin)
                </span>
                <span className="text-xs font-semibold text-slate-600">Phòng Hành Chính Tổng Hợp & HR</span>
              </div>
              <h2 className="text-lg font-black text-slate-900 mt-1">
                Trung Tâm Tổng Hợp Dữ Liệu Chấm Công VP & Các Nông Trường
              </h2>
            </div>

            <button
              onClick={() => {
                showToast('✓ Đã khởi tạo Tờ trình tổng hợp công tháng chuyển Ban TGĐ phê duyệt!');
              }}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" /> Lập Tờ Trình Chốt Công Tháng
            </button>
          </div>

          {/* Plantation Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plantations.map((plant) => (
              <div key={plant.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                    {plant.code}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-700">
                    Đã nộp đủ công
                  </span>
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-sm">{plant.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">GĐ: {plant.directorName}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 text-xs space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Tổng quân số:</span>
                    <strong className="text-slate-900">{plant.workerCount} người</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Diện tích lô cạo:</span>
                    <strong className="text-slate-900">{plant.totalHectares} ha</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Số tổ hoạt động:</span>
                    <strong className="text-slate-900">{plant.activeTeamsCount} tổ</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chốt công chuyển kế toán */}
          <div className="p-5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl border border-amber-300 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-black text-amber-950 text-sm">Chốt Dữ Liệu Bảng Công Sang Kế Toán Tính Lương</h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Đồng bộ số ngày công thực tế, sản lượng mủ và tiền thưởng vượt định mức sang Module Tiền Lương (Luật 109/2025/QH15).
              </p>
            </div>
            <button
              onClick={() => showToast('✓ Đã đồng bộ 100% dữ liệu công sang Module Tiền Lương!')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0"
            >
              Chốt & Chuyển Tính Lương
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TIER 5: BAN TỔNG GIÁM ĐỐC */}
      {/* ========================================================================= */}
      {activeTierTab === 'BAN_TGD' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Giao diện Điều Hành Ban Tổng Giám Đốc (Executive)
                </span>
                <span className="text-xs font-semibold text-slate-600">Lê Việt Thắng (Tổng Giám Đốc)</span>
              </div>
              <h2 className="text-lg font-black text-slate-900 mt-1">
                Dashboard Điều Hành Trực Quan & Phê Duyệt Tờ Trình Công 1-Click
              </h2>
            </div>
          </div>

          {/* 1-Click Executive Approval Card */}
          {monthlySubmissions.map((sub) => (
            <div
              key={sub.id}
              className="bg-gradient-to-r from-purple-900 via-slate-900 to-slate-950 text-white p-6 rounded-2xl shadow-xl border border-purple-800/50 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-purple-500 text-white uppercase">
                    Tờ trình số 08/2026/TTr-1HRM
                  </span>
                  <h3 className="text-lg font-black text-white mt-2">{sub.title}</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Người trình: <b>{sub.submittedBy}</b> | Ngày trình: {sub.submittedDate} | Tổng quân số đối soát:{' '}
                    <b>{sub.totalEmployees} CBNV & Công nhân</b>
                  </p>
                </div>

                <div>
                  {sub.isApprovedByExecutive ? (
                    <div className="bg-emerald-500/20 border border-emerald-500 px-4 py-2.5 rounded-xl text-center">
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 justify-center">
                        <CheckCircle2 className="w-5 h-5" /> ĐÃ PHÊ DUYỆT 1-CLICK
                      </span>
                      <p className="text-[10px] text-slate-300 mt-0.5">Duyệt bởi {sub.executiveApproverName}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        approveMonthlySubmission(sub.id);
                        showToast('✓ Tổng Giám Đốc đã phê duyệt Tờ trình tổng hợp công tháng 08/2026 thành công!');
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm rounded-xl shadow-lg transition-all flex items-center gap-2"
                    >
                      <Sparkles className="w-5 h-5" /> Phê Duyệt Tờ Trình 1-Click
                    </button>
                  )}
                </div>
              </div>

              {/* Summary Table */}
              <div className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-xs overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-300 border-b border-white/10 text-[11px] uppercase">
                      <th className="py-2 px-3">Đơn Vị / Nông Trường</th>
                      <th className="py-2 px-3 text-right">Quân Số Đi Làm</th>
                      <th className="py-2 px-3 text-right">Ngày Công Bình Quân</th>
                      <th className="py-2 px-3 text-right">Sản Lượng Mủ (Tấn)</th>
                      <th className="py-2 px-3 text-center">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {sub.plantationSummary.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 font-bold text-white">{item.plantationName}</td>
                        <td className="py-2.5 px-3 text-right text-slate-200">{item.totalWorkers} người</td>
                        <td className="py-2.5 px-3 text-right text-slate-200">{item.actualDaysAvg} ngày</td>
                        <td className="py-2.5 px-3 text-right text-orange-400 font-bold">{item.totalLatexYieldTons} Tấn</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Field Inspection Modal */}
      {showInspectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden space-y-4">
            <div className="p-5 bg-gradient-to-r from-blue-900 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base">Check-in Hiện Trường Kiểm Tra Lô Cạo</h3>
              </div>
              <button
                onClick={() => setShowInspectionModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInspectionSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Chọn Nông Trường</label>
                <select
                  value={inspectionPlantation}
                  onChange={(e) => setInspectionPlantation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold text-slate-800"
                >
                  {plantations.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Vị Trí Lô Cạo Kiểm Tra</label>
                <input
                  type="text"
                  value={inspectionLot}
                  onChange={(e) => setInspectionLot(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Định Vị GPS Thực Địa</label>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2 text-blue-800 font-mono">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>11.4590° N, 106.8935° E (Độ chính xác: 3 mét)</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Ghi Chú Nghiệm Thu Mặt Cạo & BHLĐ</label>
                <textarea
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800"
                  required
                />
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
                  Lưu & Hoàn Tất Check-in
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
