'use client';

import React, { useState, useEffect } from 'react';
import {
  Home,
  CalendarCheck,
  FileText,
  DollarSign,
  User,
  MapPin,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Send,
  Sparkles,
  Wifi,
  ShieldCheck,
  AlertCircle,
  Bell,
  ArrowRight,
  TrendingUp,
  X,
  Eye,
  Check,
  FileSpreadsheet,
  Download,
  Baby,
  Activity,
  Calendar,
  Briefcase,
  Flame,
  TreePine,
  AlertTriangle,
  Lock,
  Camera,
  Layers,
  RotateCw,
  Tractor,
  Building2,
  Users,
  CheckSquare,
  Award,
  ChevronDown
} from 'lucide-react';
import { useHRM } from '@/context/HRMContext';
import { RequestType, WorkerAttendanceStatus, Role } from '@/types';
import {
  exportBangChamCongExcel,
  exportPhieuLuongCaNhanExcel,
  exportBaoCaoDonTuVaNoiQuy,
  exportBaoCaoChamCongToTruong,
  exportBaoCaoQuyLuong
} from '@/lib/exportEngine';

export const MobileAppView: React.FC = () => {
  const {
    currentUser,
    currentRole,
    switchRole,
    todayAttendance,
    handleCheckIn,
    handleCheckOut,
    requests,
    createRequest,
    approveRequest,
    rejectRequest,
    payslips,
    teamBatches,
    updateWorkerAttendanceStatus,
    updateRubberYield,
    toggleOfflineSync,
    approveTeamBatch,
    toggleDocumentUpload,
    employees,
    fieldInspections,
    addFieldInspection
  } = useHRM();

  const [activeBottomNav, setActiveBottomNav] = useState<'home' | 'attendance' | 'requests' | 'payroll' | 'profile'>('home');
  const [showNewRequestSheet, setShowNewRequestSheet] = useState(false);
  const [showMobileNotifSheet, setShowMobileNotifSheet] = useState(false);
  const [showRoleSelectorSheet, setShowRoleSelectorSheet] = useState(false);
  const [showYieldModal, setShowYieldModal] = useState<any | null>(null);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Inspection state for Plantation Director
  const [inspectionLot, setInspectionLot] = useState('Lô A1 - A5 (Tổ 1)');
  const [inspectionNotes, setInspectionNotes] = useState('Kiểm tra dăm cạo mủ đạt chuẩn độ sâu, trang bị BHLĐ đầy đủ.');

  // Form states for comprehensive incident requests
  const [reqType, setReqType] = useState<RequestType>('PHEP_NAM');
  const [reqStartDate, setReqStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [reqEndDate, setReqEndDate] = useState('');
  const [reqDurationDays, setReqDurationDays] = useState(1);
  const [reqLateMinutes, setReqLateMinutes] = useState(15);
  const [reqEarlyMinutes, setReqEarlyMinutes] = useState(30);
  const [reqChildName, setReqChildName] = useState('');
  const [reqChildAge, setReqChildAge] = useState(3);
  const [reqHospitalCode, setReqHospitalCode] = useState('');
  const [reqTripDest, setReqTripDest] = useState('Nông Trường 1 (Bình Phước)');
  const [reqOtHours, setReqOtHours] = useState(2);
  const [missedTimeType, setMissedTimeType] = useState<'MAY_HONG' | 'MAT_DIEN' | 'QUEN_QUET_THE'>('QUEN_QUET_THE');
  const [missedTimeIn, setMissedTimeIn] = useState('08:00');
  const [missedTimeOut, setMissedTimeOut] = useState('17:30');
  const [reqReason, setReqReason] = useState('');

  // Yield inputs in modal
  const [latexYieldInput, setLatexYieldInput] = useState(42.5);
  const [cupLumpYieldInput, setCupLumpYieldInput] = useState(6.0);
  const [tscDegreeInput, setTscDegreeInput] = useState(34.5);

  // Client-safe Clock State
  const [isMounted, setIsMounted] = useState(false);
  const [timeString, setTimeString] = useState('08:30:00');
  const [statusTime, setStatusTime] = useState('08:30');

  useEffect(() => {
    setIsMounted(true);
    const updateTimes = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('vi-VN'));
      setStatusTime(now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTimes();
    const timer = setInterval(updateTimes, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Determine current role category
  const isTeamLeader = currentRole === 'TEAM_LEADER';
  const isPlantationDirector = currentRole === 'PLANTATION_DIRECTOR';
  const isOffice = currentRole === 'OFFICE_STAFF' || currentRole === 'EMPLOYEE' || currentRole === 'DEPARTMENT_LEAD';
  const isExecutiveOrHR = ['ADMIN', 'EXECUTIVE_DIRECTOR', 'HR_MANAGER', 'HR_ADMIN'].includes(currentRole);
  const canViewSalary = isExecutiveOrHR;

  const myPayslip = payslips.find((p) => p.employeeId === currentUser.id) || payslips[0];
  const activeBatch = teamBatches[0];
  const ntRequests = requests.filter((r) => r.departmentName.includes('Nông Trường') || r.departmentName.includes('Tổ'));
  const ntEmployees = employees.filter((e) => e.departmentName.includes('Nông Trường 1') || e.departmentName.includes('Tổ'));
  const myRequests = requests.filter((r) => r.employeeId === currentUser.id || r.employeeName === currentUser.fullName);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let specificDetails = '';
    let typeName = 'Đơn xin nghỉ phép năm';

    if (reqType === 'GIAI_TRINH_CONG') {
      const reasonLabel = missedTimeType === 'MAY_HONG' ? 'Máy hỏng' : missedTimeType === 'MAT_DIEN' ? 'Mất điện' : 'Quên quẹt thẻ';
      typeName = 'Đơn giải trình chấm công (Bổ sung công)';
      specificDetails = `Bổ sung giờ: Vào ${missedTimeIn} - Ra ${missedTimeOut} (${reasonLabel})`;
    } else if (reqType === 'DI_MUON') {
      typeName = 'Đơn giải trình đi muộn';
      specificDetails = `Đi muộn: ${reqLateMinutes} phút`;
    } else if (reqType === 'VE_SOM') {
      typeName = 'Đơn xin về sớm';
      specificDetails = `Về sớm: ${reqEarlyMinutes} phút`;
    } else if (reqType === 'CON_OM') {
      typeName = 'Đơn nghỉ chế độ con ốm (BHXH)';
      specificDetails = `Con: ${reqChildName || 'Con nhỏ'} (${reqChildAge} tuổi) | Giấy viện: ${reqHospitalCode || 'Mẫu C65-HD'}`;
    } else if (reqType === 'OM_DAU') {
      typeName = 'Đơn nghỉ ốm đau bản thân';
      specificDetails = `Giấy viện / TTYT: ${reqHospitalCode || 'Đã nộp giấy KSK'}`;
    } else if (reqType === 'CONG_TAC') {
      typeName = 'Đơn đăng ký công tác nông trường';
      specificDetails = `Địa điểm: ${reqTripDest}`;
    } else if (reqType === 'LAM_THEM_GIO') {
      typeName = 'Đơn đăng ký làm thêm giờ (OT)';
      specificDetails = `Làm thêm: ${reqOtHours} giờ (Hưởng 200% lương OT)`;
    } else if (reqType === 'CHOANG_LO') {
      typeName = 'Đơn đăng ký choàng lô / cạo thay';
      specificDetails = 'Choàng lô nhận phụ cấp sản lượng mủ';
    }

    createRequest({
      type: reqType,
      typeName,
      startDate: reqStartDate,
      endDate: reqEndDate || reqStartDate,
      durationDays: reqType === 'DI_MUON' || reqType === 'VE_SOM' ? 0 : Number(reqDurationDays),
      durationHours: reqType === 'DI_MUON' ? reqLateMinutes / 60 : reqType === 'VE_SOM' ? reqEarlyMinutes / 60 : 0,
      lateMinutes: reqLateMinutes,
      earlyMinutes: reqEarlyMinutes,
      childName: reqChildName,
      childAge: reqChildAge,
      hospitalCertCode: reqHospitalCode,
      tripDestination: reqTripDest,
      overtimeHours: reqOtHours,
      specificDetails,
      reason: reqReason,
    });

    setShowNewRequestSheet(false);
    setReqReason('');
    showToast('✓ Đã tạo đơn điện tử thành công và chuyển lên quản lý duyệt!');
  };

  const handleSaveYield = () => {
    if (!showYieldModal) return;
    updateRubberYield(
      activeBatch.id,
      showYieldModal.workerId,
      Number(latexYieldInput),
      Number(cupLumpYieldInput),
      Number(tscDegreeInput)
    );
    setShowYieldModal(null);
    showToast(`✓ Đã ghi nhận sản lượng mủ cho ${showYieldModal.workerName}!`);
  };

  const handleSaveInspection = (e: React.FormEvent) => {
    e.preventDefault();
    addFieldInspection({
      date: new Date().toLocaleDateString('vi-VN'),
      supervisorId: currentUser.id,
      supervisorName: `${currentUser.fullName} (GĐ Nông Trường)`,
      plantationId: 'plant-1',
      plantationName: 'Nông Trường 1 (Bình Phước)',
      lotChecked: inspectionLot,
      gpsCoordinates: '11.4590° N, 106.8935° E (GPS Chính xác: 3m)',
      distanceMeters: 12,
      photoUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400&auto=format&fit=crop&q=80',
      notes: inspectionNotes,
      approvedTeamsCount: 1,
    });
    setShowInspectionModal(false);
    showToast('✓ Đã lưu kết quả kiểm tra thực địa lô cạo!');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-start sm:py-6 sm:px-4 select-none">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-emerald-500 flex items-center gap-2 text-xs font-bold animate-bounce max-w-[90%]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Mobile Device Frame */}
      <div className="w-full max-w-[420px] bg-slate-50 min-h-screen sm:min-h-[844px] sm:max-h-[880px] sm:rounded-[44px] shadow-2xl overflow-hidden flex flex-col relative border-4 border-slate-800">
        {/* iOS Dynamic Island & Status Bar */}
        <div className="bg-slate-950 text-white pt-3 px-6 pb-2 flex justify-between items-center text-xs font-bold shrink-0">
          <span className="font-mono">{isMounted ? statusTime : '08:30'}</span>
          <div className="w-24 h-4 bg-black rounded-full mx-auto" />
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-mono">5G</span>
            <div className="w-5 h-2.5 border border-white/80 rounded-xs p-0.5 flex items-center">
              <div className="w-full h-full bg-emerald-400 rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Top App Bar with Role Switcher & Bell */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950 text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0">
          <div
            onClick={() => setShowRoleSelectorSheet(true)}
            className="flex items-center gap-2.5 cursor-pointer active:opacity-80"
          >
            <img
              src={currentUser.avatar}
              alt=""
              className="w-9 h-9 rounded-full object-cover border-2 border-orange-500 shadow-sm"
            />
            <div>
              <p className="font-black text-xs leading-tight flex items-center gap-1">
                <span>{currentUser.fullName}</span>
                <ChevronDown className="w-3 h-3 text-orange-400" />
              </p>
              <p className="text-[10px] text-orange-200 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {isTeamLeader
                  ? 'Tổ Trưởng Nông Trường'
                  : isPlantationDirector
                  ? 'Giám Đốc Nông Trường'
                  : isOffice
                  ? 'Khối Văn Phòng'
                  : 'HR & Ban Giám Đốc'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowMobileNotifSheet(true)}
              className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
            </button>
          </div>
        </div>

        {/* Main Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs pb-20">
          {/* ========================================================================= */}
          {/* TAB 1: HOME (TỔNG QUAN THEO CẤP BẬC) */}
          {/* ========================================================================= */}
          {activeBottomNav === 'home' && (
            <div className="space-y-4">
              {/* 1.1 Tổ Trưởng Home View */}
              {isTeamLeader && (
                <>
                  <div className="p-4 bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl text-white shadow-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-black/20 text-[10px] font-bold">
                          Tổ Khai Thác 1 • Ca Sáng (05:00 - 13:00)
                        </span>
                        <h2 className="text-2xl font-black mt-1 font-mono tracking-tight">
                          {isMounted ? timeString : '08:30:00'}
                        </h2>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-orange-100">Lô Cạo Vườn Cây</p>
                        <p className="font-bold text-xs flex items-center justify-end gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-300" /> Lô A1 - A10 (35 ha)
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => setActiveBottomNav('attendance')}
                        className="py-2.5 bg-white text-orange-950 font-black rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                      >
                        <CalendarCheck className="w-4 h-4 text-orange-600" />
                        <span>Điểm Danh Tổ 1-Chạm</span>
                      </button>

                      <button
                        onClick={() => {
                          exportBaoCaoChamCongToTruong(activeBatch, activeBatch.teamName);
                          showToast('✓ Đã tải file Chấm công & Sản lượng 3 Sheet!');
                        }}
                        className="py-2.5 bg-slate-950/40 text-white font-bold rounded-xl border border-white/20 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
                        <span>Xuất Excel 3 Sheet</span>
                      </button>
                    </div>
                  </div>

                  {/* Team Production Summary */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <TreePine className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-slate-900">{activeBatch.teamName}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {activeBatch.presentCount}/{activeBatch.totalMembers} Đi làm đủ
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-slate-50 rounded-xl">
                        <p className="text-[10px] text-slate-500">Mủ Nước</p>
                        <p className="font-black text-orange-600 mt-0.5">{activeBatch.totalLatexYieldKg} kg</p>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-xl">
                        <p className="text-[10px] text-slate-500">Độ TSC</p>
                        <p className="font-black text-blue-600 mt-0.5">{activeBatch.avgTscDegree}°</p>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-xl">
                        <p className="text-[10px] text-slate-500">Trạng Thái</p>
                        <p className="font-bold text-emerald-700 mt-0.5">Đạt Khoán</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* 1.2 Giám Đốc Nông Trường Home View */}
              {isPlantationDirector && (
                <>
                  <div className="p-4 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-2xl text-white shadow-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-black/20 text-[10px] font-bold">
                          Giám Đốc Nông Trường 1 (Bình Phước)
                        </span>
                        <h2 className="text-2xl font-black mt-1 font-mono tracking-tight">320 Công Nhân</h2>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-blue-200">Sản Lượng Ngày</p>
                        <p className="font-black text-lg text-orange-300">13.250 kg</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => {
                          approveTeamBatch(activeBatch.id);
                          showToast('✓ Giám đốc đã 1-click phê duyệt toàn bộ các tổ!');
                        }}
                        className="py-2.5 bg-white text-blue-950 font-black rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                      >
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                        <span>1-Click Duyệt Bảng Công</span>
                      </button>

                      <button
                        onClick={() => setShowInspectionModal(true)}
                        className="py-2.5 bg-slate-950/40 text-white font-bold rounded-xl border border-white/20 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                      >
                        <Camera className="w-4 h-4 text-emerald-300" />
                        <span>Check-in Hiện Trường</span>
                      </button>
                    </div>
                  </div>

                  {/* Plantation Teams Breakdown */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 text-xs">Tổng Hợp Các Tổ Sản Xuất</span>
                      <span className="text-[10px] text-blue-600 font-bold">3 Tổ Trực Thuộc</span>
                    </div>

                    <div className="space-y-2">
                      {teamBatches.map((b) => (
                        <div key={b.id} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
                          <div>
                            <p className="font-bold text-slate-900">{b.teamName}</p>
                            <p className="text-[10px] text-slate-500">Tổ trưởng: {b.leaderName} • {b.totalMembers} người</p>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-orange-600">{b.totalLatexYieldKg} kg</span>
                            <p className="text-[10px] text-emerald-700 font-bold">✓ {b.presentCount} đủ</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* 1.3 Khối Văn Phòng Home View */}
              {isOffice && (
                <>
                  <div className="p-4 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl text-white shadow-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-black/20 text-[10px] font-bold">
                          Ca Hành Chính (08:00 - 17:30)
                        </span>
                        <h2 className="text-2xl font-black mt-1 font-mono tracking-tight">
                          {isMounted ? timeString : '08:30:00'}
                        </h2>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-emerald-100">Wifi Công Ty</p>
                        <p className="font-bold text-xs flex items-center justify-end gap-1">
                          <Building2 className="w-3.5 h-3.5 text-emerald-200" /> Five Star Kim Giang
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => {
                          handleCheckIn('FaceID / Wifi', 'Văn Phòng Tổng Công Ty');
                          showToast('✓ Đã Check-in vào ca làm việc!');
                        }}
                        className="py-2.5 bg-white text-emerald-950 font-black rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Check-in FaceID</span>
                      </button>

                      <button
                        onClick={() => {
                          handleCheckOut();
                          showToast('✓ Đã Check-out hết ca làm việc!');
                        }}
                        className="py-2.5 bg-slate-950/40 text-white font-bold rounded-xl border border-white/20 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                      >
                        <Clock className="w-4 h-4 text-amber-300" />
                        <span>Check-out Hết Ca</span>
                      </button>
                    </div>
                  </div>

                  {/* Leave Balance & Paperless Request Shortcut */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
                      <p className="text-[10px] text-slate-500 font-medium">Quỹ Phép Năm Còn Lại</p>
                      <p className="text-lg font-black text-emerald-600">11 Ngày</p>
                      <p className="text-[9px] text-slate-400">Đã dùng: 2 ngày</p>
                    </div>

                    <div
                      onClick={() => setShowNewRequestSheet(true)}
                      className="p-3 bg-orange-50 rounded-2xl border border-orange-200 shadow-xs space-y-1 cursor-pointer active:scale-95 transition-all"
                    >
                      <p className="text-[10px] text-orange-950 font-bold">Tạo Đơn Điện Tử</p>
                      <p className="text-xs font-bold text-orange-700 flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5" /> Nghỉ phép / Quên công
                      </p>
                      <p className="text-[9px] text-orange-600">Duyệt tự động 3 bước</p>
                    </div>
                  </div>
                </>
              )}

              {/* 1.4 HR & Ban Giám Đốc Home View */}
              {isExecutiveOrHR && (
                <>
                  <div className="p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 rounded-2xl text-white shadow-lg space-y-3 border border-slate-800">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="px-2.5 py-0.5 rounded bg-orange-500 text-white font-bold text-[10px]">
                          ĐIỀU HÀNH TOÀN HỆ THỐNG
                        </span>
                        <h2 className="text-2xl font-black mt-1 font-mono tracking-tight">1.018 Cán Bộ CNV</h2>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400">Sản Lượng Toàn Công Ty</p>
                        <p className="font-black text-lg text-orange-400">42.8 Tấn / Ngày</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="p-2 bg-white/10 rounded-xl text-center">
                        <p className="text-[10px] text-slate-300">Khối Cạo Mủ (3 NT)</p>
                        <p className="font-black text-white text-sm">940 Người</p>
                      </div>
                      <div className="p-2 bg-white/10 rounded-xl text-center">
                        <p className="text-[10px] text-slate-300">Khối Văn Phòng</p>
                        <p className="font-black text-white text-sm">78 Người</p>
                      </div>
                    </div>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
                      <p className="text-[10px] text-slate-500">Tỷ Lệ Đúng Giờ</p>
                      <p className="text-lg font-black text-blue-600">97.5%</p>
                      <p className="text-[9px] text-emerald-700 font-bold">✓ 3 Nông trường + VP</p>
                    </div>
                    <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
                      <p className="text-[10px] text-slate-500">Chốt Bảng Lương</p>
                      <p className="text-lg font-black text-purple-600">100% Đồng Bộ</p>
                      <p className="text-[9px] text-purple-700 font-bold">Luật Thuế 109/2025</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: ATTENDANCE (CHẤM CÔNG THEO PHÂN CẤP) */}
          {/* ========================================================================= */}
          {activeBottomNav === 'attendance' && (
            <div className="space-y-3">
              {/* Tổ Trưởng Attendance */}
              {isTeamLeader && (
                <>
                  <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-slate-900 text-xs">Chấm Công Danh Sách Tổ</h3>
                      <p className="text-[10px] text-slate-500">{activeBatch.teamName} ({activeBatch.totalMembers} người)</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          toggleOfflineSync(activeBatch.id);
                          showToast(activeBatch.isOfflineSync ? '⚡ Online 5G' : '📡 Lưu Offline vườn cạo');
                        }}
                        className={`px-2 py-1 rounded-xl text-[10px] font-bold border ${activeBatch.isOfflineSync ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-emerald-100 text-emerald-900 border-emerald-300'}`}
                      >
                        <Wifi className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => {
                          exportBaoCaoChamCongToTruong(activeBatch, activeBatch.teamName);
                          showToast('✓ Đã xuất file Chấm công & Sản lượng 3 Sheet!');
                        }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-[10px] flex items-center gap-1"
                      >
                        <FileSpreadsheet className="w-3 h-3" /> Xuất 3 Sheet
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {activeBatch.items.map((worker) => (
                      <div key={worker.workerId} className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img src={worker.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                            <div>
                              <p className="font-bold text-slate-900 text-xs">{worker.workerName}</p>
                              <p className="text-[10px] text-slate-500 font-mono">{worker.workerCode} • {worker.lotAssigned}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setShowYieldModal(worker);
                              setLatexYieldInput(worker.latexYieldKg || 42.5);
                              setCupLumpYieldInput(worker.cupLumpYieldKg || 6.0);
                              setTscDegreeInput(worker.tscDegree || 34.5);
                            }}
                            className="px-2 py-1 bg-orange-50 text-orange-700 font-bold rounded-lg border border-orange-200 text-[10px] flex items-center gap-1"
                          >
                            <TreePine className="w-3 h-3" />
                            <span>{worker.latexYieldKg ? `${worker.latexYieldKg} kg (${worker.tscDegree}°)` : 'Nhập mủ'}</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-4 gap-1">
                          {[
                            { id: 'DU', label: '✓ Đủ', color: worker.status === 'DU' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700' },
                            { id: 'CHOANG_LO', label: '⚡ Choàng', color: worker.status === 'CHOANG_LO' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-700' },
                            { id: 'NGHI_PHEP', label: 'Phép', color: worker.status === 'NGHI_PHEP' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700' },
                            { id: 'NGHI_KHONG_PHEP', label: 'Vắng', color: worker.status === 'NGHI_KHONG_PHEP' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700' },
                          ].map((st) => (
                            <button
                              key={st.id}
                              onClick={() => {
                                updateWorkerAttendanceStatus(activeBatch.id, worker.workerId, st.id as WorkerAttendanceStatus);
                                showToast(`Đã cập nhật ${worker.workerName}: ${st.label}`);
                              }}
                              className={`py-1 rounded-lg text-[10px] font-bold transition-all ${st.color}`}
                            >
                              {st.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Giám Đốc Nông Trường Attendance */}
              {isPlantationDirector && (
                <>
                  <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-slate-900 text-xs">Tổng Hợp Chấm Công 3 Tổ</h3>
                      <p className="text-[10px] text-slate-500">Nông Trường 1 • 320 Công nhân</p>
                    </div>

                    <button
                      onClick={() => {
                        approveTeamBatch(activeBatch.id);
                        showToast('✓ Giám đốc đã 1-click phê duyệt toàn bộ các tổ!');
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-[11px] flex items-center gap-1 shadow-xs"
                    >
                      <CheckSquare className="w-3.5 h-3.5" /> 1-Click Duyệt
                    </button>
                  </div>

                  <div className="space-y-2">
                    {teamBatches.map((b) => (
                      <div key={b.id} className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900 text-xs">{b.teamName}</span>
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${b.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {b.status === 'APPROVED' ? 'Đã duyệt' : 'Chờ GĐ duyệt'}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                          <div className="p-1.5 bg-slate-50 rounded-lg">
                            <p className="text-slate-400">Quân số</p>
                            <p className="font-bold text-slate-900">{b.totalMembers} người</p>
                          </div>
                          <div className="p-1.5 bg-slate-50 rounded-lg">
                            <p className="text-slate-400">Đi làm</p>
                            <p className="font-bold text-emerald-700">{b.presentCount} đủ</p>
                          </div>
                          <div className="p-1.5 bg-slate-50 rounded-lg">
                            <p className="text-slate-400">Sản lượng mủ</p>
                            <p className="font-bold text-orange-600">{b.totalLatexYieldKg} kg</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Khối Văn Phòng Attendance */}
              {isOffice && (
                <>
                  <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-slate-900 text-xs">Lịch Chấm Công Cá Nhân Tháng 08</h3>
                      <p className="text-[10px] text-emerald-600 font-bold">Công chuẩn 24 • Thực tế 24 (100%)</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-3 space-y-2">
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                      {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d) => (
                        <div key={d} className="font-bold text-slate-400 py-1">{d}</div>
                      ))}
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                        const isWeekend = day % 7 === 6 || day % 7 === 0;
                        return (
                          <div
                            key={day}
                            className={`p-1.5 rounded-lg border text-center ${isWeekend ? 'bg-slate-50 border-slate-100 text-slate-300' : 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-bold'}`}
                          >
                            <p className="text-[9px] text-slate-400">{day}</p>
                            <p className="text-[10px] font-black">{isWeekend ? '-' : '1.0'}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* HR & Ban Giám Đốc Attendance */}
              {isExecutiveOrHR && (
                <>
                  <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-slate-900 text-xs">Đối Soát Công Ca Toàn Công Ty</h3>
                      <p className="text-[10px] text-slate-500">3 Nông Trường + Khối Văn Phòng</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[
                      { name: 'Nông Trường 1 (Bình Phước)', workers: 320, present: 312, yieldTons: '14.5 Tấn' },
                      { name: 'Nông Trường 3 (Tây Ninh)', workers: 380, present: 371, yieldTons: '17.2 Tấn' },
                      { name: 'Nông Trường 2 (Bình Dương)', workers: 240, present: 235, yieldTons: '11.1 Tấn' },
                      { name: 'Khối Văn Phòng Tổng Công Ty', workers: 78, present: 76, yieldTons: '-' },
                    ].map((unit, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{unit.name}</p>
                          <p className="text-[10px] text-slate-500">{unit.workers} CBNV • {unit.present} đi làm đủ</p>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-orange-600 text-xs">{unit.yieldTons}</span>
                          <p className="text-[10px] text-emerald-700 font-bold">✓ Đã chốt công</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: REQUESTS (QUẢN LÝ ĐƠN TỪ THEO PHÂN CẤP) */}
          {/* ========================================================================= */}
          {activeBottomNav === 'requests' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="font-black text-slate-900 text-xs">
                    {isPlantationDirector ? 'Phê Duyệt Đơn Nông Trường' : 'Đơn Từ Điện Tử (Không Giấy)'}
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    {isPlantationDirector ? `Có ${ntRequests.length} đơn nộp lên từ các tổ` : 'Phép năm, quên công, công tác, OT...'}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowNewRequestSheet(true)}
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tạo Đơn
                  </button>
                </div>
              </div>

              {/* Requests List */}
              <div className="space-y-2">
                {(isPlantationDirector ? ntRequests : isExecutiveOrHR ? requests : myRequests).map((r) => (
                  <div key={r.id} className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-[10px] text-slate-500">{r.code} • {r.employeeName}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          r.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.status === 'APPROVED' ? 'Đã duyệt' : 'Chờ duyệt'}
                      </span>
                    </div>

                    <p className="font-bold text-slate-900 text-xs">{r.typeName}</p>
                    {r.specificDetails && (
                      <p className="font-bold text-blue-700 text-[10px] bg-blue-50 px-2 py-0.5 rounded">
                        {r.specificDetails}
                      </p>
                    )}
                    <p className="text-[10px] text-slate-500 italic">{r.reason}</p>

                    {/* Actions for Plantation Director or HR */}
                    {(isPlantationDirector || isExecutiveOrHR) && r.status === 'PENDING' && (
                      <div className="flex items-center justify-end gap-1.5 pt-1.5 border-t border-slate-100">
                        <button
                          onClick={() => {
                            approveRequest(r.id);
                            showToast(`✓ Đã duyệt đơn ${r.code}!`);
                          }}
                          className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px]"
                        >
                          Duyệt Đơn
                        </button>
                        <button
                          onClick={() => {
                            rejectRequest(r.id);
                            showToast(`Đã từ chối đơn ${r.code}`);
                          }}
                          className="px-2.5 py-1 bg-rose-100 text-rose-800 rounded-lg font-bold text-[11px]"
                        >
                          Từ chối
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: PAYROLL (TIỀN LƯƠNG THEO CẤP BẬC) */}
          {/* ========================================================================= */}
          {activeBottomNav === 'payroll' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="font-black text-slate-900 text-xs">
                    {isExecutiveOrHR ? 'Quỹ Lương Toàn Công Ty' : 'Phiếu Lương Cá Nhân'}
                  </h3>
                  <p className="text-[10px] text-emerald-600 font-bold">Luật Thuế 109/2025/QH15 (5 Bậc)</p>
                </div>

                <button
                  onClick={() => {
                    if (isExecutiveOrHR) {
                      exportBaoCaoQuyLuong(payslips, 12850000000);
                      showToast('✓ Đã tải Báo cáo Quỹ lương 6 Sheet!');
                    } else {
                      exportPhieuLuongCaNhanExcel(myPayslip);
                      showToast('✓ Đã tải Phiếu lương cá nhân!');
                    }
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] flex items-center gap-1 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" /> Xuất Excel
                </button>
              </div>

              {/* Net Salary Highlight Card */}
              <div className="p-4 bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl text-white shadow-xl space-y-2 border border-slate-800">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  {isExecutiveOrHR ? 'Tổng Quỹ Lương Thực Chi (NET)' : 'Thực Lĩnh Chuyển Khoản (NET)'}
                </p>
                <h2 className="text-2xl font-black text-emerald-400 font-mono">
                  {isExecutiveOrHR ? '11.255.750.000 đ' : `${myPayslip.netSalary.toLocaleString('vi-VN')} đ`}
                </h2>
                <p className="text-[10px] text-slate-300 pt-2 border-t border-slate-800">
                  {isExecutiveOrHR ? 'Chi trả toàn thể CBNV qua MBBank' : `Lương cơ bản: ${myPayslip.baseSalary.toLocaleString('vi-VN')} đ • Thưởng mủ: +${myPayslip.commission.toLocaleString('vi-VN')} đ`}
                </p>
              </div>

              {/* Salary Breakdown */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-3.5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Lương thời gian ({myPayslip.actualDays}/{myPayslip.standardDays} công)</span>
                  <span className="font-bold text-slate-900">{myPayslip.actualBaseSalary.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Phụ cấp ăn ca & trách nhiệm</span>
                  <span className="font-bold text-slate-900">{(myPayslip.lunchAllowance + myPayslip.positionAllowance).toLocaleString('vi-VN')} đ</span>
                </div>
                {myPayslip.commission > 0 && (
                  <div className="flex justify-between text-orange-600">
                    <span className="font-bold">Thưởng sản lượng mủ cao su</span>
                    <span className="font-black">+{myPayslip.commission.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
                <div className="flex justify-between text-rose-600 pt-1 border-t border-slate-100">
                  <span>BHXH, BHYT, BHTN (10.5%)</span>
                  <span className="font-bold">-{myPayslip.totalInsurance.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between text-amber-700">
                  <span>Thuế TNCN (Luật 109 Giảm trừ 15.5M)</span>
                  <span className="font-bold">-{myPayslip.pitTax.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: PROFILE (HỒ SƠ CÁ NHÂN HOẶC NHÂN SỰ NÔNG TRƯỜNG) */}
          {/* ========================================================================= */}
          {activeBottomNav === 'profile' && (
            <div className="space-y-3">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
                <img
                  src={currentUser.avatar}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover border-2 border-orange-500 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-slate-900 text-sm truncate">{currentUser.fullName}</h3>
                  <p className="text-[10px] text-slate-500 font-mono">{currentUser.code} • {currentUser.phone}</p>
                  <p className="text-[10px] text-orange-600 font-semibold">{currentUser.positionTitle}</p>
                </div>
              </div>

              {/* Plantation Personnel for Plantation Director */}
              {isPlantationDirector ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-3.5 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs">Báo Cáo Nhân Sự Nông Trường 1 ({ntEmployees.length} người)</h4>
                  <div className="space-y-1.5 max-h-64 overflow-y-auto">
                    {ntEmployees.map((e) => (
                      <div key={e.id} className="p-2 bg-slate-50 rounded-xl flex items-center justify-between text-[11px]">
                        <div>
                          <p className="font-bold text-slate-900">{e.fullName}</p>
                          <p className="text-[9px] text-slate-500">{e.code} • {e.positionTitle}</p>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700">{e.profileCompleteness || 100}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Checklist for Individual Worker */
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">Tiến Độ Hoàn Tất Hồ Sơ</h4>
                      <p className="text-[10px] text-slate-500">Checklist giấy tờ Onboarding gốc</p>
                    </div>
                    <span className="font-black text-orange-600 text-sm font-mono">
                      {currentUser.profileCompleteness || 100}%
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {[
                      'Bản sao CCCD 2 mặt (Công chứng)',
                      'Giấy khám sức khỏe định kỳ (Dưới 6 tháng)',
                      'Bản sao Bằng cấp chuyên môn',
                      'Sổ Bảo Hiểm Xã Hội gốc',
                    ].map((docName) => {
                      const isMissing = currentUser.missingDocuments?.includes(docName);
                      return (
                        <div
                          key={docName}
                          onClick={() => {
                            toggleDocumentUpload(currentUser.id, docName);
                            showToast(`✓ Đã cập nhật "${docName}"!`);
                          }}
                          className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer text-[10px] ${
                            isMissing ? 'bg-amber-50/50 border-amber-200 text-amber-900' : 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                          }`}
                        >
                          <span className="font-semibold">{docName}</span>
                          <span className={`px-2 py-0.5 rounded font-bold ${isMissing ? 'bg-amber-200 text-amber-950' : 'bg-emerald-200 text-emerald-950'}`}>
                            {isMissing ? 'Chưa nộp' : 'Đã nộp'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM NAVIGATION BAR */}
        {/* ========================================================================= */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 flex justify-around items-center z-40">
          {[
            { id: 'home', label: 'Trang Chủ', icon: Home },
            { id: 'attendance', label: 'Chấm Công', icon: CalendarCheck },
            { id: 'requests', label: 'Đơn Từ', icon: FileText },
            { id: 'payroll', label: 'Tiền Lương', icon: DollarSign },
            { id: 'profile', label: isPlantationDirector ? 'Nhân Sự' : 'Cá Nhân', icon: User },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveBottomNav(tab.id as any)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                activeBottomNav === tab.id ? 'text-orange-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeBottomNav === tab.id ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[9px]">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Sheet: Chuyển Đổi Góc Nhìn Vai Trò Trên Mobile */}
        {showRoleSelectorSheet && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end justify-center">
            <div className="bg-white rounded-t-3xl p-5 w-full shadow-2xl space-y-3 text-xs max-h-[80%] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h4 className="font-black text-slate-900 text-sm">Chuyển Đổi Góc Nhìn Phân Cấp</h4>
                <button onClick={() => setShowRoleSelectorSheet(false)} className="text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'TEAM_LEADER', label: '1. Tổ Trưởng Nông Trường', desc: 'Chấm công 1-chạm, nhập mủ, xuất 3 Sheet' },
                  { id: 'PLANTATION_DIRECTOR', label: '2. Giám Đốc Nông Trường', desc: 'Quản lý quân số các tổ, duyệt đơn, tổng hợp công' },
                  { id: 'OFFICE_STAFF', label: '3. Khối Văn Phòng', desc: 'Chấm công FaceID, đơn điện tử không giấy' },
                  { id: 'HR_MANAGER', label: '4. Phòng Nhân Sự (HR)', desc: 'Báo cáo nhân sự 3 nông trường, văn phòng, bảng lương' },
                  { id: 'ADMIN', label: '5. Ban Tổng Giám Đốc', desc: 'Bao quát toàn hệ thống & điều hành cấp cao' },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      switchRole(r.id as Role);
                      setShowRoleSelectorSheet(false);
                      showToast(`✓ Đã chuyển sang góc nhìn ${r.label}!`);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex flex-col gap-0.5 transition-all ${
                      currentRole === r.id ? 'bg-orange-50 border-orange-500 text-orange-950 ring-2 ring-orange-500/20' : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <p className="font-bold text-xs">{r.label}</p>
                    <p className="text-[10px] text-slate-500">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Nhập Sản Lượng Mủ (Yield) */}
        {showYieldModal && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-5 w-full max-w-xs shadow-2xl space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <div>
                  <h4 className="font-black text-slate-900 text-sm">{showYieldModal.workerName}</h4>
                  <p className="text-[10px] text-slate-500">{showYieldModal.lotAssigned}</p>
                </div>
                <button onClick={() => setShowYieldModal(null)} className="text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-0.5">Sản lượng mủ nước (kg)</label>
                  <input
                    type="number"
                    value={latexYieldInput}
                    onChange={(e) => setLatexYieldInput(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-0.5">Mủ chén / mủ đông (kg)</label>
                  <input
                    type="number"
                    value={cupLumpYieldInput}
                    onChange={(e) => setCupLumpYieldInput(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-0.5">Độ khô TSC (%)</label>
                  <input
                    type="number"
                    value={tscDegreeInput}
                    onChange={(e) => setTscDegreeInput(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowYieldModal(null)}
                  className="px-3 py-1.5 bg-slate-100 font-bold rounded-xl text-slate-600"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleSaveYield}
                  className="px-4 py-1.5 bg-orange-600 font-bold text-white rounded-xl shadow-xs"
                >
                  Lưu Sản Lượng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Sheet: Kiểm Tra Hiện Trường (Giám Đốc Nông Trường) */}
        {showInspectionModal && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end justify-center">
            <div className="bg-white rounded-t-3xl p-5 w-full shadow-2xl space-y-3 text-xs max-h-[85%] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h4 className="font-black text-slate-900 text-sm">Check-in Kiểm Tra Thực Địa Lô Cạo</h4>
                <button onClick={() => setShowInspectionModal(false)} className="text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveInspection} className="space-y-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Lô cạo kiểm tra</label>
                  <input
                    type="text"
                    value={inspectionLot}
                    onChange={(e) => setInspectionLot(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ghi chú kỹ thuật dăm cạo</label>
                  <textarea
                    value={inspectionNotes}
                    onChange={(e) => setInspectionNotes(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    required
                  />
                </div>

                <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 text-[10px] flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>GPS: 11.4590° N, 106.8935° E (Khớp 100% tọa độ Nông Trường 1)</span>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowInspectionModal(false)}
                    className="px-3 py-1.5 bg-slate-100 font-bold rounded-xl"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 font-bold text-white rounded-xl shadow-xs"
                  >
                    Lưu Kết Quả
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Sheet: Tạo Đơn Từ Mới Trên Mobile */}
        {showNewRequestSheet && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end justify-center">
            <div className="bg-white rounded-t-3xl p-5 w-full shadow-2xl space-y-3 text-xs max-h-[85%] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h4 className="font-black text-slate-900 text-sm">Tạo Đơn Điện Tử (Không Dùng Giấy)</h4>
                <button onClick={() => setShowNewRequestSheet(false)} className="text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Loại Đơn Điện Tử</label>
                  <select
                    value={reqType}
                    onChange={(e) => setReqType(e.target.value as RequestType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
                  >
                    <option value="PHEP_NAM">1. Đơn xin nghỉ phép năm (Trừ quỹ phép)</option>
                    <option value="GIAI_TRINH_CONG">2. Đơn giải trình chấm công (Bổ sung công)</option>
                    <option value="CON_OM">3. Đơn nghỉ chế độ con ốm (Mẫu C65-HD)</option>
                    <option value="OM_DAU">4. Đơn nghỉ ốm đau bản thân</option>
                    <option value="CONG_TAC">5. Đơn công tác / Làm việc bên ngoài</option>
                    <option value="LAM_THEM_GIO">6. Đơn đăng ký làm thêm giờ (OT)</option>
                    <option value="DI_MUON">7. Đơn giải trình đi muộn</option>
                    <option value="VE_SOM">8. Đơn xin về sớm</option>
                    <option value="CHOANG_LO">9. Đơn choàng lô / cạo thay</option>
                  </select>
                </div>

                {reqType === 'GIAI_TRINH_CONG' && (
                  <div className="p-2.5 bg-cyan-50 rounded-xl space-y-2">
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { id: 'MAY_HONG', label: 'Máy hỏng' },
                        { id: 'MAT_DIEN', label: 'Mất điện' },
                        { id: 'QUEN_QUET_THE', label: 'Quên thẻ' },
                      ].map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setMissedTimeType(item.id as any)}
                          className={`py-1 rounded-lg text-[10px] font-bold border ${missedTimeType === item.id ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-white text-cyan-900 border-cyan-200'}`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-cyan-900 block">Giờ Vào</label>
                        <input
                          type="time"
                          value={missedTimeIn}
                          onChange={(e) => setMissedTimeIn(e.target.value)}
                          className="w-full px-2 py-1 border border-cyan-300 rounded-lg bg-white font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-cyan-900 block">Giờ Ra</label>
                        <input
                          type="time"
                          value={missedTimeOut}
                          onChange={(e) => setMissedTimeOut(e.target.value)}
                          className="w-full px-2 py-1 border border-cyan-300 rounded-lg bg-white font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {reqType === 'CON_OM' && (
                  <div className="p-2.5 bg-pink-50 rounded-xl space-y-2">
                    <input
                      type="text"
                      placeholder="Họ tên & tuổi của con (Ví dụ: Lê Gia Hưng 3 tuổi)"
                      value={reqChildName}
                      onChange={(e) => setReqChildName(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-pink-300 rounded-lg bg-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Mã số giấy viện C65-HD (BV-NHI-88992)"
                      value={reqHospitalCode}
                      onChange={(e) => setReqHospitalCode(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-pink-300 rounded-lg bg-white font-mono"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-0.5">Từ ngày</label>
                    <input
                      type="date"
                      value={reqStartDate}
                      onChange={(e) => setReqStartDate(e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded-xl bg-slate-50 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-0.5">Đến ngày</label>
                    <input
                      type="date"
                      value={reqEndDate}
                      onChange={(e) => setReqEndDate(e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-300 rounded-xl bg-slate-50 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-0.5">Lý do chi tiết</label>
                  <textarea
                    value={reqReason}
                    onChange={(e) => setReqReason(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-xl"
                    placeholder="Ghi rõ lý do để quản lý phê duyệt..."
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowNewRequestSheet(false)}
                    className="px-3 py-1.5 bg-slate-100 font-bold rounded-xl"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-orange-600 font-bold text-white rounded-xl shadow-xs"
                  >
                    Gửi Đơn Điện Tử
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Sheet: Thông Báo Mobile */}
        {showMobileNotifSheet && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end justify-center">
            <div className="bg-white rounded-t-3xl p-5 w-full shadow-2xl space-y-3 text-xs max-h-[80%] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h4 className="font-black text-slate-900 text-sm">Trung Tâm Thông Báo</h4>
                <button onClick={() => setShowMobileNotifSheet(false)} className="text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-orange-50 rounded-2xl border border-orange-200">
                  <p className="font-bold text-orange-950">Phiếu lương Tháng 08/2026 đã chốt</p>
                  <p className="text-[10px] text-orange-800">Tính thuế TNCN theo Luật 109/2025/QH15 mức giảm trừ 15.5 triệu.</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <p className="font-bold text-emerald-950">Chấm công GPS thành công</p>
                  <p className="text-[10px] text-emerald-800">Đã check-in lúc 05:15 AM tại Nông Trường 1 (Bình Phước).</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
