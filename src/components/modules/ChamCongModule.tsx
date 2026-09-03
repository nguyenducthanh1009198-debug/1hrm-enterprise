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
        <div className="fixed top-5 right-5 z-50 bg-gray-900 text-white px-5 py-3 rounded-md shadow-lg border border-emerald-500 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner - Clean Professional Design System */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#FFF4ED] text-[#E05600] font-semibold text-[12px] uppercase tracking-wider">
              1HRM Enterprise
            </span>
            <span className="text-gray-500 text-[12px] font-medium">
              {isTeamLeader
                ? 'Góc nhìn: Tổ Trưởng Khai Thác Mủ'
                : isPlantationDirector
                ? 'Góc nhìn: Giám Đốc Nông Trường'
                : isOffice
                ? 'Góc nhìn: Chấm Công Cá Nhân (Khối Văn Phòng)'
                : 'Góc nhìn: Quản Trị Chấm Công Toàn Hệ Thống (HR & BGĐ)'}
            </span>
          </div>
          <h1 className="text-[20px] font-semibold leading-7 text-gray-900 mt-1">
            {isTeamLeader
              ? 'Quản Lý Công Nhân & Chấm Công Sản Lượng Tổ'
              : isPlantationDirector
              ? 'Quản Lý Quân Số Các Tổ & Phê Duyệt Chấm Công Nông Trường'
              : isOffice
              ? 'Bảng Chấm Công Cá Nhân & Lịch Công Ca'
              : 'Trung Tâm Quản Trị Chấm Công Toàn Hệ Thống (Nông Trường & Văn Phòng)'}
          </h1>
          <p className="text-[14px] font-normal leading-5 text-gray-500 mt-1 max-w-2xl">
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
        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200 min-w-[210px]">
          <div className="w-10 h-10 rounded-md bg-[#FFF4ED] flex items-center justify-center text-[#E05600]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[12px] text-gray-500 font-medium" suppressHydrationWarning>
              {isMounted ? liveDate : 'Đang đồng bộ...'}
            </p>
            <p className="text-[18px] font-bold text-gray-900 font-mono" suppressHydrationWarning>
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
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-[#FFF4ED] flex items-center justify-center text-[#E05600] font-bold">
                <TreePine className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[16px] font-semibold leading-6 text-gray-900">{activeBatch.teamName}</h2>
                  <span className="badge-success">
                    {activeBatch.presentCount}/{activeBatch.totalMembers} Đi làm đủ
                  </span>
                </div>
                <p className="text-[12px] text-gray-500 font-medium mt-0.5">
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
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-[13px] font-semibold border transition-all cursor-pointer ${
                  activeBatch.isOfflineSync
                    ? 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
                    : 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]'
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
                className="btn-primary"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Xuất Excel 3 Sheet</span>
              </button>
            </div>
          </div>

          {/* Worker Attendance Table with 1-Tap Status & Yield */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
            <div className="h-10 px-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-gray-900">
                Danh Sách Công Nhân Trong Tổ & Điểm Danh 1-Chạm
              </h3>
              <span className="text-[12px] text-gray-500 font-medium">
                Tổng mủ nước: <b className="text-gray-900 tabular-nums">{activeBatch.totalLatexYieldKg} kg</b> • Độ TSC TB: <b className="text-gray-900 tabular-nums">{activeBatch.avgTscDegree}°</b>
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="data-table-header">
                    <th className="px-4 text-left">Công Nhân</th>
                    <th className="px-3 text-left">Lô Cạo</th>
                    <th className="px-3 text-center">Điểm Danh 1-Chạm</th>
                    <th className="px-3 text-right">Mủ Nước (kg)</th>
                    <th className="px-3 text-right">Mủ Chén (kg)</th>
                    <th className="px-3 text-right">Độ TSC (%)</th>
                    <th className="px-4 text-left">Ghi Chú / Choàng Lô</th>
                  </tr>
                </thead>
                <tbody>
                  {activeBatch.items.map((worker) => (
                    <tr key={worker.workerId} className="data-table-row">
                      <td className="px-4">
                        <div className="flex items-center gap-2.5">
                          <img src={worker.avatar} alt="" className="w-7 h-7 rounded-full object-cover border border-gray-200" />
                          <div>
                            <p className="text-[14px] font-medium text-gray-900">{worker.workerName}</p>
                            <p className="text-[12px] text-gray-500 font-mono">{worker.workerCode}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 text-[14px] font-normal text-gray-700">{worker.lotAssigned}</td>
                      <td className="px-3 text-center">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => updateWorkerAttendanceStatus(activeBatch.id, worker.workerId, 'DU')}
                            className={`px-2.5 py-1 rounded-[4px] font-semibold text-[12px] transition-all ${
                              worker.status === 'DU' ? 'bg-[#16A34A] text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            ✓ Đủ
                          </button>
                          <button
                            onClick={() => updateWorkerAttendanceStatus(activeBatch.id, worker.workerId, 'CHOANG_LO', 'Hoàng Văn Phúc')}
                            className={`px-2.5 py-1 rounded-[4px] font-semibold text-[12px] transition-all ${
                              worker.status === 'CHOANG_LO' ? 'bg-[#E05600] text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            ⚡ Choàng
                          </button>
                          <button
                            onClick={() => updateWorkerAttendanceStatus(activeBatch.id, worker.workerId, 'NGHI_PHEP')}
                            className={`px-2.5 py-1 rounded-[4px] font-semibold text-[12px] transition-all ${
                              worker.status === 'NGHI_PHEP' ? 'bg-[#D97706] text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            Phép
                          </button>
                          <button
                            onClick={() => updateWorkerAttendanceStatus(activeBatch.id, worker.workerId, 'NGHI_KHONG_PHEP')}
                            className={`px-2.5 py-1 rounded-[4px] font-semibold text-[12px] transition-all ${
                              worker.status === 'NGHI_KHONG_PHEP' ? 'bg-[#DC2626] text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            Vắng
                          </button>
                        </div>
                      </td>
                      <td className="px-3 text-right text-[14px] font-semibold text-gray-900 tabular-nums">
                        {worker.latexYieldKg || 42.5}
                      </td>
                      <td className="px-3 text-right text-[14px] font-normal text-gray-700 tabular-nums">
                        {worker.cupLumpYieldKg || 6.0}
                      </td>
                      <td className="px-3 text-right text-[14px] font-semibold text-gray-900 tabular-nums">
                        {worker.tscDegree || 34.5}%
                      </td>
                      <td className="px-4 text-[13px] text-gray-600">
                        {worker.coveredForWorkerName ? (
                          <span className="text-[#15803D] font-medium bg-[#F0FDF4] px-2 py-0.5 rounded text-[12px]">
                            Choàng thêm phần của {worker.coveredForWorkerName}
                          </span>
                        ) : (
                          <span className="text-gray-400">Đúng định mức</span>
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
          <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setNtActiveTab('tong_hop')}
                className={`px-3.5 py-2 rounded-[6px] text-[13px] font-semibold transition-all ${
                  ntActiveTab === 'tong_hop' ? 'bg-[#E05600] text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                1. Quân Số & Tổng Hợp Chấm Công Các Tổ
              </button>
              <button
                onClick={() => setNtActiveTab('duyet_don')}
                className={`px-3.5 py-2 rounded-[6px] text-[13px] font-semibold transition-all flex items-center gap-1.5 ${
                  ntActiveTab === 'duyet_don' ? 'bg-[#E05600] text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                2. Phê Duyệt Đơn Từ Các Tổ ({ntRequests.length})
              </button>
              <button
                onClick={() => setNtActiveTab('nhan_su_to')}
                className={`px-3.5 py-2 rounded-[6px] text-[13px] font-semibold transition-all flex items-center gap-1.5 ${
                  ntActiveTab === 'nhan_su_to' ? 'bg-[#E05600] text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                3. Báo Cáo Nhân Sự Nông Trường ({ntEmployees.length})
              </button>
              <button
                onClick={() => setNtActiveTab('hien_truong')}
                className={`px-3.5 py-2 rounded-[6px] text-[13px] font-semibold transition-all flex items-center gap-1.5 ${
                  ntActiveTab === 'hien_truong' ? 'bg-[#E05600] text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                4. Kiểm Tra Hiện Trường (GPS & Camera)
              </button>
            </div>

            <button
              onClick={() => setShowInspectionModal(true)}
              className="btn-secondary text-[13px]"
            >
              <Camera className="w-4 h-4 text-gray-500" /> Check-in Kiểm Tra Lô
            </button>
          </div>

          {/* Sub-tab 1: Tổng hợp quân số & duyệt công tổ */}
          {ntActiveTab === 'tong_hop' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-white rounded-lg border border-gray-200 shadow-xs">
                  <p className="caption-meta">Tổng Quân Số Khai Thác Nông Trường 1</p>
                  <p className="kpi-metric mt-1">320 Công Nhân</p>
                  <p className="text-[12px] text-[#15803D] font-medium mt-1">312 Đi làm đủ (97.5%)</p>
                </div>
                <div className="p-5 bg-white rounded-lg border border-gray-200 shadow-xs">
                  <p className="caption-meta">Tổng Sản Lượng Mủ Nước Ngày</p>
                  <p className="kpi-metric mt-1">13.250 kg</p>
                  <p className="text-[12px] text-gray-500 font-medium mt-1">Vượt 4.2% định mức khoán</p>
                </div>
                <div className="p-5 bg-white rounded-lg border border-gray-200 shadow-xs">
                  <p className="caption-meta">Độ Khô TSC Trung Bình</p>
                  <p className="kpi-metric mt-1">34.5%</p>
                  <p className="text-[12px] text-[#15803D] font-medium mt-1">✓ Đạt tiêu chuẩn xuất khẩu</p>
                </div>
              </div>

              {/* Batches Table to Approve */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
                <div className="h-10 px-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-[14px] font-semibold text-gray-900">
                    Tổng Hợp Chấm Công Nộp Lên Từ Các Tổ Trưởng (Nông Trường 1)
                  </h3>
                  <button
                    onClick={() => {
                      approveTeamBatch(activeBatch.id);
                      showToast('✓ Đã phê duyệt và chốt bảng chấm công toàn Nông trường 1!');
                    }}
                    className="btn-primary text-[13px] py-1.5 px-3"
                  >
                    <CheckSquare className="w-4 h-4" /> 1-Click Duyệt Toàn Bộ Các Tổ
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="data-table-header">
                        <th className="px-4 text-left">Tổ Sản Xuất</th>
                        <th className="px-3 text-left">Tổ Trưởng</th>
                        <th className="px-3 text-right">Quân Số</th>
                        <th className="px-3 text-right">Đi Làm Đủ</th>
                        <th className="px-3 text-right">Vắng / Phép</th>
                        <th className="px-3 text-right">Sản Lượng Mủ</th>
                        <th className="px-3 text-center">Trạng Thái</th>
                        <th className="px-4 text-center">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamBatches.map((b) => (
                        <tr key={b.id} className="data-table-row">
                          <td className="px-4 text-[14px] font-semibold text-gray-900">{b.teamName}</td>
                          <td className="px-3 text-[14px] text-gray-700">{b.leaderName}</td>
                          <td className="px-3 text-right text-[14px] font-medium text-gray-900 tabular-nums">{b.totalMembers} người</td>
                          <td className="px-3 text-right text-[14px] font-semibold text-[#15803D] tabular-nums">{b.presentCount}</td>
                          <td className="px-3 text-right text-[14px] font-semibold text-[#B91C1C] tabular-nums">{b.absentCount}</td>
                          <td className="px-3 text-right text-[14px] font-semibold text-gray-900 tabular-nums">{b.totalLatexYieldKg} kg ({b.avgTscDegree}°)</td>
                          <td className="px-3 text-center">
                            <span className={b.status === 'APPROVED' ? 'badge-success' : 'badge-warning'}>
                              {b.status === 'APPROVED' ? 'Đã duyệt' : 'Chờ GĐ duyệt'}
                            </span>
                          </td>
                          <td className="px-4 text-center">
                            <button
                              onClick={() => {
                                approveTeamBatch(b.id);
                                showToast(`✓ Đã duyệt bảng công ${b.teamName}!`);
                              }}
                              className="btn-secondary text-[12px] py-1 px-2.5"
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
            <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
              <div className="h-10 px-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-[14px] font-semibold text-gray-900">
                  Danh Sách Đơn Từ Của Công Nhân & Tổ Trưởng Thuộc Nông Trường
                </h3>
                <button
                  onClick={() => exportBaoCaoDonTuVaNoiQuy(ntRequests)}
                  className="btn-secondary text-[12px] py-1 px-3"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-gray-500" /> Xuất Excel Đơn Từ
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="data-table-header">
                      <th className="px-4 text-left">Mã Đơn</th>
                      <th className="px-4 text-left">Công Nhân / Tổ Trưởng</th>
                      <th className="px-3 text-left">Tổ Sản Xuất</th>
                      <th className="px-3 text-left">Loại Đơn</th>
                      <th className="px-3 text-left">Thời Gian</th>
                      <th className="px-4 text-left">Lý Do / Chế Độ</th>
                      <th className="px-3 text-center">Trạng Thái</th>
                      <th className="px-4 text-center">Giám Đốc Phê Duyệt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ntRequests.map((r) => (
                      <tr key={r.id} className="data-table-row">
                        <td className="px-4 font-mono text-[13px] font-medium text-gray-700">{r.code}</td>
                        <td className="px-4 text-[14px] font-medium text-gray-900">{r.employeeName}</td>
                        <td className="px-3 text-[14px] text-gray-700">{r.departmentName}</td>
                        <td className="px-3 text-[14px] font-medium text-gray-900">{r.typeName}</td>
                        <td className="px-3 font-mono text-[13px] text-gray-600">{r.startDate}</td>
                        <td className="px-4 text-[13px] text-gray-600">{r.specificDetails || r.reason}</td>
                        <td className="px-3 text-center">
                          <span className={r.status === 'APPROVED' ? 'badge-success' : 'badge-warning'}>
                            {r.status === 'APPROVED' ? 'Đã duyệt' : 'Chờ GĐ duyệt'}
                          </span>
                        </td>
                        <td className="px-4 text-center">
                          {r.status === 'PENDING' ? (
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  approveRequest(r.id);
                                  showToast(`✓ Giám đốc đã duyệt đơn ${r.code}!`);
                                }}
                                className="btn-primary text-[12px] py-1 px-2.5"
                              >
                                Duyệt
                              </button>
                              <button
                                onClick={() => {
                                  rejectRequest(r.id);
                                  showToast(`Đã từ chối đơn ${r.code}`);
                                }}
                                className="bg-[#FEF2F2] text-[#B91C1C] hover:bg-[#FEE2E2] font-semibold rounded-[6px] text-[12px] py-1 px-2.5"
                              >
                                Từ chối
                              </button>
                            </div>
                          ) : (
                            <span className="text-[#15803D] font-medium text-[13px]">✓ Đã phê duyệt</span>
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
            <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
              <div className="h-10 px-4 bg-gray-50 border-b border-gray-200 flex items-center">
                <h3 className="text-[14px] font-semibold text-gray-900">
                  Báo Cáo Nhân Sự & Danh Sách Công Nhân Thuộc Nông Trường 1
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="data-table-header">
                      <th className="px-4 text-left">Mã NV</th>
                      <th className="px-4 text-left">Họ Và Tên</th>
                      <th className="px-3 text-left">Tổ Trực Thuộc</th>
                      <th className="px-3 text-left">Chức Danh</th>
                      <th className="px-3 text-left">Hợp Đồng</th>
                      <th className="px-3 text-right">Tiến Độ Hồ Sơ</th>
                      <th className="px-4 text-left">Tình Trạng Giấy Tờ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ntEmployees.map((e) => (
                      <tr key={e.id} className="data-table-row">
                        <td className="px-4 font-mono text-[13px] font-medium text-gray-700">{e.code}</td>
                        <td className="px-4 text-[14px] font-medium text-gray-900">{e.fullName}</td>
                        <td className="px-3 text-[14px] text-gray-700">{e.departmentName}</td>
                        <td className="px-3 text-[14px] text-gray-700">{e.positionTitle}</td>
                        <td className="px-3 text-[14px] text-gray-700">{e.contractType}</td>
                        <td className="px-3 text-right font-medium text-gray-900 tabular-nums">{e.profileCompleteness || 100}%</td>
                        <td className="px-4 text-[13px]">
                          {e.isProfileComplete !== false ? (
                            <span className="badge-success">✓ Đầy đủ giấy tờ</span>
                          ) : (
                            <span className="badge-warning">
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
                  <div key={insp.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs space-y-3">
                    <img src={insp.photoUrl} alt="" className="w-full h-44 object-cover rounded-md border border-gray-200" />
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="card-title">{insp.lotChecked}</span>
                        <span className="text-[11px] font-mono text-[#15803D] font-medium bg-[#F0FDF4] px-2 py-0.5 rounded">
                          {insp.gpsCoordinates}
                        </span>
                      </div>
                      <p className="text-[13px] text-gray-600 mt-1">{insp.notes}</p>
                      <p className="caption-meta mt-2 pt-2 border-t border-gray-100">
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
          <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded bg-gray-100 text-gray-700 text-[12px] font-medium">
                Ca Hành Chính Văn Phòng (08:00 - 17:30)
              </span>
              <h2 className="text-[20px] font-semibold text-gray-900 mt-2">Chấm Công Trực Tuyến FaceID & Wifi Công Ty</h2>
              <p className="text-[13px] text-gray-500 mt-1">
                Địa điểm: Trụ sở Five Star Kim Giang • IP Wifi: 192.168.97.103 (Hợp lệ)
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  handleCheckIn('FaceID / IP Wifi', 'Văn Phòng Tổng Công Ty');
                  showToast('✓ Đã Check-in vào ca thành công!');
                }}
                className="btn-primary"
              >
                <CheckCircle2 className="w-4 h-4" /> Check-in Vào Ca
              </button>

              <button
                onClick={() => {
                  handleCheckOut();
                  showToast('✓ Đã Check-out hết ca làm việc!');
                }}
                className="btn-secondary"
              >
                <Clock className="w-4 h-4" /> Check-out Hết Ca
              </button>
            </div>
          </div>

          {/* Monthly Attendance Calendar */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <div>
                <h3 className="card-title">Bảng Chấm Công Cá Nhân Tháng 08/2026 - {currentUser.fullName}</h3>
                <p className="caption-meta">Mã NV: {currentUser.code} • Phòng Ban: {currentUser.departmentName}</p>
              </div>
              <div className="flex items-center gap-3 text-[13px] font-semibold">
                <span className="text-gray-700">Công chuẩn: 24 ngày</span>
                <span className="text-[#15803D]">Công thực tế: 24 ngày (100%)</span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d) => (
                <div key={d} className="caption-meta py-1 font-semibold">{d}</div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                const isWeekend = day % 7 === 6 || day % 7 === 0;
                return (
                  <div
                    key={day}
                    className={`p-2.5 rounded-md border text-center transition-all ${
                      isWeekend
                        ? 'bg-gray-50 border-gray-100 text-gray-400'
                        : 'bg-[#F0FDF4] border-[#BBF7D0] text-gray-900 font-medium'
                    }`}
                  >
                    <p className="text-[11px] text-gray-400">{day}</p>
                    <p className="text-[13px] font-semibold mt-0.5">{isWeekend ? 'Nghỉ' : '1.0'}</p>
                    {!isWeekend && <p className="text-[10px] text-[#15803D] font-mono">08:15-17:35</p>}
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
            <div className="p-5 bg-white rounded-lg border border-gray-200 shadow-xs">
              <p className="caption-meta">Quân Số Khối Cạo Mủ (3 Nông Trường)</p>
              <p className="kpi-metric mt-1">940 Người</p>
              <p className="text-[12px] text-[#15803D] font-medium mt-1">918 Công nhân đi làm đủ (97.6%)</p>
            </div>
            <div className="p-5 bg-white rounded-lg border border-gray-200 shadow-xs">
              <p className="caption-meta">Quân Số Khối Văn Phòng</p>
              <p className="kpi-metric mt-1">78 Cán Bộ</p>
              <p className="text-[12px] text-gray-700 font-medium mt-1">76 Người có mặt đúng giờ (97.4%)</p>
            </div>
            <div className="p-5 bg-white rounded-lg border border-gray-200 shadow-xs">
              <p className="caption-meta">Sản Lượng Mủ Giao Nộp Ngày</p>
              <p className="kpi-metric mt-1">42.8 Tấn</p>
              <p className="text-[12px] text-gray-500 font-medium mt-1">Độ khô TSC TB: 34.5°</p>
            </div>
            <div className="p-5 bg-white rounded-lg border border-gray-200 shadow-xs">
              <p className="caption-meta">Chốt Bảng Công Sang Lương</p>
              <p className="kpi-metric mt-1">100% Đồng Bộ</p>
              <p className="text-[12px] text-[#15803D] font-medium mt-1">Đã áp dụng Luật Thuế 109</p>
            </div>
          </div>

          {/* Cross-Plantation Attendance Breakdown */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
            <div className="h-10 px-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-[14px] font-semibold text-gray-900">
                Báo Cáo Đối Soát Chấm Công Toàn Diện 3 Nông Trường & Khối Văn Phòng
              </h3>
              <span className="badge-success">Đã chốt công Tháng 08/2026</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="data-table-header">
                    <th className="px-4 text-left">Đơn Vị / Khối</th>
                    <th className="px-3 text-right">Tổng Quân Số</th>
                    <th className="px-3 text-right">Đi Làm Đủ</th>
                    <th className="px-3 text-right">Tỷ Lệ Đúng Giờ</th>
                    <th className="px-3 text-right">Sản Lượng Mủ</th>
                    <th className="px-4 text-center">Trạng Thái Chốt Công</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="data-table-row">
                    <td className="px-4 text-[14px] font-semibold text-gray-900">Nông Trường 1 (Bình Phước)</td>
                    <td className="px-3 text-right text-[14px] font-medium text-gray-900 tabular-nums">320 người</td>
                    <td className="px-3 text-right text-[14px] font-semibold text-[#15803D] tabular-nums">312</td>
                    <td className="px-3 text-right text-[14px] font-semibold text-gray-900 tabular-nums">97.5%</td>
                    <td className="px-3 text-right text-[14px] font-semibold text-gray-900 tabular-nums">14.5 Tấn</td>
                    <td className="px-4 text-center">
                      <span className="badge-success">✓ Đã chốt & chuyển lương</span>
                    </td>
                  </tr>
                  <tr className="data-table-row">
                    <td className="px-4 text-[14px] font-semibold text-gray-900">Nông Trường 3 (Tây Ninh)</td>
                    <td className="px-3 text-right text-[14px] font-medium text-gray-900 tabular-nums">380 người</td>
                    <td className="px-3 text-right text-[14px] font-semibold text-[#15803D] tabular-nums">371</td>
                    <td className="px-3 text-right text-[14px] font-semibold text-gray-900 tabular-nums">97.6%</td>
                    <td className="px-3 text-right text-[14px] font-semibold text-gray-900 tabular-nums">17.2 Tấn</td>
                    <td className="px-4 text-center">
                      <span className="badge-success">✓ Đã chốt & chuyển lương</span>
                    </td>
                  </tr>
                  <tr className="data-table-row">
                    <td className="px-4 text-[14px] font-semibold text-gray-900">Nông Trường 2 (Bình Dương)</td>
                    <td className="px-3 text-right text-[14px] font-medium text-gray-900 tabular-nums">240 người</td>
                    <td className="px-3 text-right text-[14px] font-semibold text-[#15803D] tabular-nums">235</td>
                    <td className="px-3 text-right text-[14px] font-semibold text-gray-900 tabular-nums">97.9%</td>
                    <td className="px-3 text-right text-[14px] font-semibold text-gray-900 tabular-nums">11.1 Tấn</td>
                    <td className="px-4 text-center">
                      <span className="badge-success">✓ Đã chốt & chuyển lương</span>
                    </td>
                  </tr>
                  <tr className="data-table-row">
                    <td className="px-4 text-[14px] font-semibold text-gray-900">Khối Văn Phòng Tổng Công Ty</td>
                    <td className="px-3 text-right text-[14px] font-medium text-gray-900 tabular-nums">78 người</td>
                    <td className="px-3 text-right text-[14px] font-semibold text-[#15803D] tabular-nums">76</td>
                    <td className="px-3 text-right text-[14px] font-semibold text-gray-900 tabular-nums">97.4%</td>
                    <td className="px-3 text-right text-gray-400">-</td>
                    <td className="px-4 text-center">
                      <span className="badge-success">✓ Đã chốt & chuyển lương</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Field Inspection Modal */}
      {showInspectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-xl border border-gray-200 overflow-hidden space-y-4">
            <div className="p-4 bg-gray-900 text-white flex items-center justify-between">
              <div>
                <h3 className="card-title text-white">Check-in Kiểm Tra Hiện Trường Lô Cạo</h3>
                <p className="caption-meta text-gray-400">Đối soát tọa độ GPS và ảnh hiện trường</p>
              </div>
              <button onClick={() => setShowInspectionModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInspectionSubmit} className="p-5 space-y-4 text-[13px]">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Chọn Nông Trường</label>
                <select
                  value={inspectionPlantation}
                  onChange={(e) => setInspectionPlantation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-medium text-gray-900 bg-white"
                >
                  {plantations.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Lô Cạo Cần Kiểm Tra</label>
                <input
                  type="text"
                  value={inspectionLot}
                  onChange={(e) => setInspectionLot(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-medium text-gray-900 bg-white"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Ghi Chú Kiểm Tra Kỹ Thuật</label>
                <textarea
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
                  required
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-md border border-gray-200 text-gray-700 text-[12px] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E05600] shrink-0" />
                <span>Tọa độ GPS tự động: 11.4590° N, 106.8935° E (Bán kính hợp lệ 12m)</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowInspectionModal(false)}
                  className="btn-secondary"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Lưu Kết Quả
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
