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
  RotateCw
} from 'lucide-react';
import { useHRM } from '@/context/HRMContext';
import { RequestType, WorkerAttendanceStatus } from '@/types';
import {
  exportBangChamCongExcel,
  exportPhieuLuongCaNhanExcel,
  exportBaoCaoDonTuVaNoiQuy,
} from '@/lib/exportEngine';

export const MobileAppView: React.FC = () => {
  const {
    currentUser,
    currentRole,
    todayAttendance,
    handleCheckIn,
    handleCheckOut,
    requests,
    createRequest,
    payslips,
    teamBatches,
    updateWorkerAttendanceStatus,
    updateRubberYield,
    toggleOfflineSync,
    approveTeamBatch,
    toggleDocumentUpload,
  } = useHRM();

  const [activeBottomNav, setActiveBottomNav] = useState<'home' | 'attendance' | 'requests' | 'payroll' | 'profile'>('home');
  const [requestFilter, setRequestFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [showNewRequestSheet, setShowNewRequestSheet] = useState(false);
  const [showMobileNotifSheet, setShowMobileNotifSheet] = useState(false);
  const [showYieldModal, setShowYieldModal] = useState<any | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

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

  // PHÂN QUYỀN BẢO MẬT: Chỉ Ban Giám Đốc (BGĐ) và Nhân Sự (HR) mới được xem mức lương toàn công ty
  const canViewSalary = ['ADMIN', 'EXECUTIVE_DIRECTOR', 'HR_MANAGER', 'HR_ADMIN'].includes(currentRole);

  const myPayslip = payslips.find((p) => p.employeeId === currentUser.id) || payslips[0];
  const activeBatch = teamBatches[0];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let specificDetails = '';
    let typeName = 'Đơn xin nghỉ phép năm';

    if (reqType === 'DI_MUON') {
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
    showToast('✓ Đã gửi đơn phát sinh thành công lên quản lý duyệt!');
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

        {/* Top App Bar with Role & Notification Bell */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950 text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-2.5">
            <img
              src={currentUser.avatar}
              alt=""
              className="w-9 h-9 rounded-full object-cover border-2 border-orange-500 shadow-sm"
            />
            <div>
              <p className="font-black text-xs leading-tight">{currentUser.fullName}</p>
              <p className="text-[10px] text-orange-200 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {currentRole === 'TEAM_LEADER'
                  ? 'Tổ Trưởng Nông Trường'
                  : currentRole === 'PLANTATION_DIRECTOR'
                  ? 'GĐ Nông Trường'
                  : currentRole === 'ADMIN'
                  ? 'Tổng Giám Đốc'
                  : 'CBNV 1HRM'}
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
          {/* TAB 1: HOME (TỔNG QUAN / 1-TAP ACTION) */}
          {/* ========================================================================= */}
          {activeBottomNav === 'home' && (
            <div className="space-y-4">
              {/* Live Time Card & 1-Tap Check-in */}
              <div className="p-4 bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl text-white shadow-lg space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-black/20 text-[10px] font-bold">
                      Ca Sáng: 05:00 - 13:00
                    </span>
                    <h2 className="text-2xl font-black mt-1 font-mono tracking-tight">
                      {isMounted ? timeString : '08:30:00'}
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-orange-100">Định vị GPS Lô cạo</p>
                    <p className="font-bold text-xs flex items-center justify-end gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-300" /> Nông Trường 1
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      handleCheckIn('Mobile GPS', 'Nông Trường 1 (Bình Phước)');
                      showToast('✓ Đã Check-in chấm công thành công!');
                    }}
                    className="py-2.5 bg-white text-orange-950 font-black rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Check-in Vào Ca</span>
                  </button>

                  <button
                    onClick={() => {
                      handleCheckOut();
                      showToast('✓ Đã Check-out kết thúc ca làm việc!');
                    }}
                    className="py-2.5 bg-slate-950/40 text-white font-bold rounded-xl border border-white/20 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Clock className="w-4 h-4 text-amber-300" />
                    <span>Check-out Hết Ca</span>
                  </button>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setActiveBottomNav('attendance')}
                  className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center gap-1.5 active:bg-orange-50 transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-[11px] text-slate-800">Chấm Công</span>
                </button>

                <button
                  onClick={() => setShowNewRequestSheet(true)}
                  className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center gap-1.5 active:bg-orange-50 transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-[11px] text-slate-800">Tạo Đơn Từ</span>
                </button>

                <button
                  onClick={() => setActiveBottomNav('payroll')}
                  className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center gap-1.5 active:bg-orange-50 transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-[11px] text-slate-800">Phiếu Lương</span>
                </button>
              </div>

              {/* Quick Export Cards (Bảng Chấm Công & Phiếu Lương) */}
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-xs">Xuất File Báo Cáo Nhanh (Excel)</span>
                  <span className="text-[10px] text-slate-400 font-mono">Tải trực tiếp</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      exportBangChamCongExcel(activeBatch, activeBatch.teamName);
                      showToast('✓ Đã tải Bảng chấm công tổ về máy!');
                    }}
                    className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all text-[11px]"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Xuất Bảng Công</span>
                  </button>

                  <button
                    onClick={() => {
                      exportPhieuLuongCaNhanExcel(myPayslip);
                      showToast('✓ Đã tải Phiếu lương cá nhân về máy!');
                    }}
                    className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all text-[11px]"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-600" />
                    <span>Xuất Phiếu Lương</span>
                  </button>
                </div>
              </div>

              {/* Production Team Summary (Tổ Khai Thác Mủ) */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <TreePine className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-900">{activeBatch.teamName}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {activeBatch.presentCount}/{activeBatch.totalMembers} Đủ
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <p className="text-[10px] text-slate-500">Diện Tích</p>
                    <p className="font-black text-slate-900 mt-0.5">{activeBatch.totalLotAreaHectares} ha</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <p className="text-[10px] text-slate-500">Mủ Nước</p>
                    <p className="font-black text-orange-600 mt-0.5">{activeBatch.totalLatexYieldKg} kg</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <p className="text-[10px] text-slate-500">Độ TSC</p>
                    <p className="font-black text-blue-600 mt-0.5">{activeBatch.avgTscDegree}°</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: ATTENDANCE (CHẤM CÔNG 1-CHẠM & SẢN LƯỢNG MỦ) */}
          {/* ========================================================================= */}
          {activeBottomNav === 'attendance' && (
            <div className="space-y-3">
              {/* Header & Offline Sync Toggle */}
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="font-black text-slate-900 text-xs">Chấm Công Danh Sách Tổ</h3>
                  <p className="text-[10px] text-slate-500">{activeBatch.teamName} ({activeBatch.totalMembers} người)</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      toggleOfflineSync(activeBatch.id);
                      showToast(activeBatch.isOfflineSync ? '⚡ Đã chuyển sang chế độ Online 5G' : '📡 Đã bật chế độ Lưu Offline trong vườn');
                    }}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border flex items-center gap-1 transition-all ${
                      activeBatch.isOfflineSync
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    }`}
                  >
                    <Wifi className="w-3 h-3" />
                    {activeBatch.isOfflineSync ? 'Offline' : 'Online 5G'}
                  </button>

                  <button
                    onClick={() => {
                      exportBangChamCongExcel(activeBatch, activeBatch.teamName);
                      showToast('✓ Đã xuất Bảng chấm công tổ Excel!');
                    }}
                    className="p-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                    title="Xuất Excel bảng công"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Worker Attendance List with 1-Tap Status & Yield */}
              <div className="space-y-2">
                {activeBatch.items.map((worker) => (
                  <div key={worker.workerId} className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={worker.avatar}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{worker.workerName}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{worker.workerCode} • {worker.lotAssigned}</p>
                        </div>
                      </div>

                      {/* Yield Button */}
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

                    {/* 1-Tap Status Selector */}
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
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: REQUESTS (ĐƠN TỪ PHÁT SINH & CHẾ ĐỘ) */}
          {/* ========================================================================= */}
          {activeBottomNav === 'requests' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="font-black text-slate-900 text-xs">Đơn Từ & Chế Độ Phát Sinh</h3>
                  <p className="text-[10px] text-slate-500">Đi muộn, về sớm, con ốm, OT, công tác...</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      exportBaoCaoDonTuVaNoiQuy(requests);
                      showToast('✓ Đã xuất Sổ đơn từ phát sinh Excel!');
                    }}
                    className="p-1.5 rounded-xl bg-slate-900 text-white"
                    title="Xuất Excel Đơn từ"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                  </button>

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
                {requests.map((r) => (
                  <div key={r.id} className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-[10px] text-slate-500">{r.code}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          r.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.status === 'APPROVED' ? 'Đã duyệt' : r.status === 'REJECTED' ? 'Từ chối' : 'Chờ duyệt'}
                      </span>
                    </div>

                    <p className="font-bold text-slate-900 text-xs">{r.typeName}</p>
                    {r.specificDetails && (
                      <p className="font-bold text-blue-700 text-[10px] bg-blue-50 px-2 py-0.5 rounded">
                        {r.specificDetails}
                      </p>
                    )}
                    <p className="text-[10px] text-slate-500 italic">{r.reason}</p>
                    <p className="text-[9px] text-slate-400 font-mono pt-1 border-t border-slate-100">
                      Thời gian: {r.startDate} • Người gửi: {r.employeeName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: PAYROLL (PHIẾU LƯƠNG CÁ NHÂN & BẢO MẬT) */}
          {/* ========================================================================= */}
          {activeBottomNav === 'payroll' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="font-black text-slate-900 text-xs">Phiếu Lương Cá Nhân Tháng 08/2026</h3>
                  <p className="text-[10px] text-emerald-600 font-bold">Thuế Luật 109/2025/QH15 (5 Bậc)</p>
                </div>

                <button
                  onClick={() => {
                    exportPhieuLuongCaNhanExcel(myPayslip);
                    showToast('✓ Đã tải phiếu lương cá nhân Excel!');
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] flex items-center gap-1 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" /> Xuất Excel
                </button>
              </div>

              {/* Net Salary Highlight Card */}
              <div className="p-4 bg-gradient-to-br from-slate-950 to-slate-900 rounded-2xl text-white shadow-xl space-y-2 border border-slate-800">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  Thực Lĩnh Chuyển Khoản (NET)
                </p>
                <h2 className="text-2xl font-black text-emerald-400 font-mono">
                  {myPayslip.netSalary.toLocaleString('vi-VN')} đ
                </h2>
                <div className="flex justify-between items-center text-[10px] text-slate-300 pt-2 border-t border-slate-800">
                  <span>Tổng thu nhập: <b>{myPayslip.totalIncome.toLocaleString('vi-VN')} đ</b></span>
                  <span>Đã thanh toán qua MBBank</span>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-3.5 space-y-2 text-xs">
                <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-wider border-b border-slate-100 pb-1.5">
                  Chi Tiết Các Khoản Mục Thu Nhập
                </h4>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Lương cơ bản ({myPayslip.actualDays}/{myPayslip.standardDays} công)</span>
                    <span className="font-bold text-slate-900">{myPayslip.actualBaseSalary.toLocaleString('vi-VN')} đ</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-600">Phụ cấp ăn ca & trách nhiệm</span>
                    <span className="font-bold text-slate-900">{(myPayslip.lunchAllowance + myPayslip.positionAllowance).toLocaleString('vi-VN')} đ</span>
                  </div>

                  {myPayslip.commission > 0 && (
                    <div className="flex justify-between">
                      <span className="text-orange-700 font-bold">Thưởng sản lượng mủ cao su</span>
                      <span className="font-black text-orange-600">+{myPayslip.commission.toLocaleString('vi-VN')} đ</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-slate-600">Thưởng hiệu quả KPI</span>
                    <span className="font-bold text-slate-900">+{myPayslip.kpiBonus.toLocaleString('vi-VN')} đ</span>
                  </div>

                  <div className="flex justify-between pt-1 border-t border-slate-100 text-rose-600">
                    <span>Trích nộp BHXH, BHYT, BHTN (10.5%)</span>
                    <span className="font-bold">-{myPayslip.totalInsurance.toLocaleString('vi-VN')} đ</span>
                  </div>

                  <div className="flex justify-between text-amber-700">
                    <span>Thuế TNCN (Luật 109 - Giảm trừ 15.5M)</span>
                    <span className="font-bold">-{myPayslip.pitTax.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: PROFILE (HỒ SƠ CÁ NHÂN & CẢNH BÁO THIẾU GIẤY TỜ) */}
          {/* ========================================================================= */}
          {activeBottomNav === 'profile' && (
            <div className="space-y-3">
              {/* Profile Card */}
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

              {/* Incomplete Profile Alert & Checklist */}
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

                {currentUser.isProfileComplete === false && (
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[10px] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>⚠️ Bạn còn thiếu {currentUser.missingDocuments?.length} loại giấy tờ cần nộp bổ sung.</span>
                  </div>
                )}

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
                          showToast(`✓ Đã cập nhật trạng thái "${docName}"!`);
                        }}
                        className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer text-[10px] ${
                          isMissing
                            ? 'bg-amber-50/50 border-amber-200 text-amber-900'
                            : 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
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
            { id: 'profile', label: 'Cá Nhân', icon: User },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveBottomNav(tab.id as any)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                activeBottomNav === tab.id
                  ? 'text-orange-600 font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeBottomNav === tab.id ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[9px]">{tab.label}</span>
            </button>
          ))}
        </div>

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

        {/* Modal Sheet: Tạo Đơn Từ Mới Trên Mobile */}
        {showNewRequestSheet && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end justify-center">
            <div className="bg-white rounded-t-3xl p-5 w-full shadow-2xl space-y-3 text-xs max-h-[85%] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h4 className="font-black text-slate-900 text-sm">Tạo Đơn Phát Sinh Mới</h4>
                <button onClick={() => setShowNewRequestSheet(false)} className="text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Loại Đơn</label>
                  <select
                    value={reqType}
                    onChange={(e) => setReqType(e.target.value as RequestType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50"
                  >
                    <option value="DI_MUON">1. Đơn giải trình đi muộn</option>
                    <option value="VE_SOM">2. Đơn xin về sớm</option>
                    <option value="CON_OM">3. Đơn nghỉ con ốm (Luật BHXH)</option>
                    <option value="OM_DAU">4. Đơn nghỉ ốm đau bản thân</option>
                    <option value="PHEP_NAM">5. Đơn xin nghỉ phép năm</option>
                    <option value="CONG_TAC">6. Đơn đăng ký công tác nông trường</option>
                    <option value="LAM_THEM_GIO">7. Đơn đăng ký làm thêm giờ (OT)</option>
                    <option value="CHOANG_LO">8. Đơn choàng lô / cạo thay</option>
                  </select>
                </div>

                {reqType === 'DI_MUON' && (
                  <div className="p-2.5 bg-amber-50 rounded-xl space-y-1">
                    <label className="font-bold text-amber-900 block">Số phút đi muộn</label>
                    <input
                      type="number"
                      value={reqLateMinutes}
                      onChange={(e) => setReqLateMinutes(Number(e.target.value))}
                      className="w-full px-3 py-1.5 border border-amber-300 rounded-lg bg-white font-bold"
                      required
                    />
                  </div>
                )}

                {reqType === 'CON_OM' && (
                  <div className="p-2.5 bg-pink-50 rounded-xl space-y-2">
                    <div>
                      <label className="font-bold text-pink-900 block">Tên & Tuổi của con</label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Lê Gia Hưng (3 tuổi)"
                        value={reqChildName}
                        onChange={(e) => setReqChildName(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-pink-300 rounded-lg bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-pink-900 block">Mã số giấy viện C65-HD</label>
                      <input
                        type="text"
                        placeholder="BV-NHI-C65-88992"
                        value={reqHospitalCode}
                        onChange={(e) => setReqHospitalCode(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-pink-300 rounded-lg bg-white font-mono"
                      />
                    </div>
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
                    placeholder="Ghi rõ lý do..."
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
                    Gửi Đơn Lên Quản Lý
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
