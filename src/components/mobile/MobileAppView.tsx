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
} from 'lucide-react';
import { useHRM } from '@/context/HRMContext';
import { RequestType } from '@/types';

export const MobileAppView: React.FC = () => {
  const {
    currentUser,
    todayAttendance,
    handleCheckIn,
    handleCheckOut,
    requests,
    createRequest,
    payslips,
    shifts,
  } = useHRM();

  const [activeBottomNav, setActiveBottomNav] = useState<'home' | 'attendance' | 'requests' | 'payroll' | 'profile'>('home');
  const [attendanceViewMode, setAttendanceViewMode] = useState<'month' | 'week' | 'stats'>('month');
  const [requestFilter, setRequestFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [showNewRequestSheet, setShowNewRequestSheet] = useState(false);
  const [showMobileNotifSheet, setShowMobileNotifSheet] = useState(false);
  const [selectedReqType, setSelectedReqType] = useState<RequestType>('LEAVE');
  const [reqReason, setReqReason] = useState('');
  const [reqDuration, setReqDuration] = useState('1');

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

  // Mobile Notifications State
  const [mobileNotifications, setMobileNotifications] = useState([
    {
      id: 'm-notif-1',
      title: 'Phiếu lương Tháng 08/2026',
      desc: 'Phiếu lương mới theo Luật Thuế TNCN 109/2025/QH15 đã chốt',
      time: '15 phút trước',
      type: 'salary',
      isRead: false,
      tabTarget: 'payroll' as const,
    },
    {
      id: 'm-notif-2',
      title: 'Chấm công GPS thành công',
      desc: 'Đã check-in lúc 08:24 AM tại Trụ sở Five Star Kim Giang',
      time: '1 giờ trước',
      type: 'attendance',
      isRead: false,
      tabTarget: 'attendance' as const,
    },
    {
      id: 'm-notif-3',
      title: 'Đơn nghỉ phép năm',
      desc: 'Đơn DXP-00123 của bạn đã được quản lý phê duyệt',
      time: '3 giờ trước',
      type: 'requests',
      isRead: false,
      tabTarget: 'requests' as const,
    },
    {
      id: 'm-notif-4',
      title: 'Mục tiêu OKR Quý 3/2026',
      desc: 'Hạn chót cập nhật kết quả Key Results trước ngày 30',
      time: 'Hôm qua',
      type: 'system',
      isRead: true,
      tabTarget: 'home' as const,
    },
  ]);

  const mobileUnreadCount = mobileNotifications.filter((n) => !n.isRead).length;

  const markAllMobileNotifRead = () => {
    setMobileNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotifClick = (notif: typeof mobileNotifications[0]) => {
    setMobileNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );
    if (notif.tabTarget) {
      setActiveBottomNav(notif.tabTarget);
      setShowMobileNotifSheet(false);
    }
  };

  const myPayslip = payslips.find((p) => p.employeeId === currentUser.id) || payslips[0];
  const isCheckedIn = todayAttendance.some((a) => a.employeeId === currentUser.id && a.checkIn);
  const todayRec = todayAttendance.find((a) => a.employeeId === currentUser.id);

  const requestTypeOptions = [
    { type: 'LEAVE', name: 'Đơn xin nghỉ', desc: 'Nghỉ 1 hoặc nhiều ngày làm việc', color: 'text-purple-600 bg-purple-100' },
    { type: 'ABSENCE', name: 'Đơn vắng mặt', desc: 'Vắng mặt 1 khoảng thời gian trong ngày', color: 'text-amber-600 bg-amber-100' },
    { type: 'OVERTIME', name: 'Đơn làm thêm', desc: 'Làm ngoài ca / tăng ca OT', color: 'text-emerald-600 bg-emerald-100' },
    { type: 'CHECKIN_OUT', name: 'Đơn Checkin/out', desc: 'Quên chấm công lúc đến/về', color: 'text-blue-600 bg-blue-100' },
    { type: 'BUSINESS_TRIP', name: 'Đơn công tác', desc: 'Đi công tác ngoài văn phòng', color: 'text-indigo-600 bg-indigo-100' },
    { type: 'SPECIAL_REGIME', name: 'Đơn làm theo chế độ', desc: 'Chế độ con nhỏ, thai sản', color: 'text-pink-600 bg-pink-100' },
    { type: 'SHIFT_CHANGE', name: 'Đơn đổi ca', desc: 'Đổi ca trực với đồng nghiệp', color: 'text-cyan-600 bg-cyan-100' },
    { type: 'RESIGNATION', name: 'Đơn thôi việc', desc: 'Đề xuất dừng làm việc', color: 'text-rose-600 bg-rose-100' },
  ];

  const handleMobileSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const typeObj = requestTypeOptions.find((t) => t.type === selectedReqType);
    createRequest({
      type: selectedReqType,
      typeName: typeObj?.name || 'Đơn từ',
      durationDays: Number(reqDuration),
      reason: reqReason || 'Nhân viên gửi qua Mobile App',
      startDate: new Date().toISOString().split('T')[0],
    });
    setShowNewRequestSheet(false);
    setReqReason('');
    setActiveBottomNav('requests');
  };

  const filteredMyRequests = requests.filter((r) => {
    if (requestFilter === 'pending') return r.status === 'PENDING';
    if (requestFilter === 'approved') return r.status === 'APPROVED';
    return true;
  });

  return (
    <div className="flex justify-center items-center py-4">
      {/* Smartphone Device Mockup (iPhone 15 Pro Frame) */}
      <div className="w-[375px] h-[780px] bg-slate-950 rounded-[48px] p-3.5 shadow-2xl ring-12 ring-slate-900/80 border-4 border-slate-700 flex flex-col relative select-none overflow-hidden">
        
        {/* Dynamic Island / Speaker */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-950 ring-1 ring-slate-800 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-blue-900/60" />
          </div>
        </div>

        {/* Screen Container */}
        <div className="w-full h-full bg-slate-50 rounded-[38px] flex flex-col overflow-hidden text-slate-900 relative">
          
          {/* iOS Top Status Bar */}
          <div className="h-10 px-6 flex items-center justify-between text-[11px] font-bold text-slate-900 pt-2 z-40">
            <span suppressHydrationWarning>{isMounted ? statusTime : '08:30'}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px]">5G</span>
              <Wifi className="w-3.5 h-3.5" />
              <div className="w-5 h-2.5 rounded border border-slate-900 p-0.5 flex items-center">
                <div className="w-3 h-full bg-slate-900 rounded-xs" />
              </div>
            </div>
          </div>

          {/* Top Universal App Bar (With Notification Bell) */}
          <div className="px-4 py-2 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-xs z-30">
            <div className="flex items-center gap-2">
              <img
                src={currentUser.avatar}
                alt=""
                className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-500/30"
              />
              <div>
                <p className="text-[10px] text-slate-400 font-medium leading-none">1HRM Mobile</p>
                <h2 className="font-bold text-xs text-slate-900 leading-tight">{currentUser.fullName}</h2>
              </div>
            </div>

            {/* Notification Bell Button */}
            <button
              type="button"
              onClick={() => setShowMobileNotifSheet(true)}
              className="p-2 rounded-full bg-slate-100 hover:bg-orange-50 active:bg-orange-100 relative text-slate-700 hover:text-orange-600 transition-all cursor-pointer"
              title="Xem thông báo"
            >
              <Bell className="w-4 h-4" />
              {mobileUnreadCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-orange-600 text-white text-[9px] font-bold absolute -top-1 -right-1 flex items-center justify-center ring-2 ring-white animate-pulse">
                  {mobileUnreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Screen Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-20 pt-2">
            
            {/* 1. HOME TAB */}
            {activeBottomNav === 'home' && (
              <div className="space-y-4">
                {/* GPS Punch-in Widget */}
                <div className="p-4 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 rounded-2xl text-white shadow-lg shadow-orange-500/20 space-y-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 opacity-90">
                      <MapPin className="w-3.5 h-3.5" />
                      Trụ sở 1Office - Five Star
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-semibold backdrop-blur-xs text-[10px]">
                      GPS Hợp lệ
                    </span>
                  </div>

                  <div className="text-center py-2">
                    <p className="text-2xl font-black font-mono tracking-wider" suppressHydrationWarning>
                      {isMounted ? timeString : '08:30:00'}
                    </p>
                    <p className="text-[11px] opacity-90 mt-0.5">Ca làm việc: 08:30 - 17:30 (Ca HC)</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleCheckIn('Mobile GPS', 'Định vị GPS Smartphone')}
                      className={`py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${
                        isCheckedIn
                          ? 'bg-white text-orange-600'
                          : 'bg-slate-950 text-white hover:bg-slate-900'
                      }`}
                    >
                      {isCheckedIn ? '✓ Đã Check-in' : 'Chấm Công Vào'}
                    </button>
                    <button
                      onClick={handleCheckOut}
                      className="py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white rounded-xl font-bold text-xs transition-all cursor-pointer"
                    >
                      Chấm Công Ra
                    </button>
                  </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <p className="text-[10px] text-slate-500">Công tháng</p>
                    <p className="font-bold text-sm text-slate-900 mt-0.5">22.5</p>
                    <p className="text-[9px] text-emerald-600">Chuẩn: 24</p>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <p className="text-[10px] text-slate-500">Phép còn lại</p>
                    <p className="font-bold text-sm text-slate-900 mt-0.5">9.5</p>
                    <p className="text-[9px] text-blue-600">Ngày phép</p>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <p className="text-[10px] text-slate-500">Đi muộn</p>
                    <p className="font-bold text-sm text-amber-600 mt-0.5">0</p>
                    <p className="text-[9px] text-slate-400">Lần</p>
                  </div>
                </div>

                {/* Quick Actions Shortcuts */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <h3 className="font-bold text-xs text-slate-800">Tiện ích nhanh</h3>
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] text-slate-600">
                    <button
                      onClick={() => setShowNewRequestSheet(true)}
                      className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 flex flex-col items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="font-semibold">Tạo đơn</span>
                    </button>
                    <button
                      onClick={() => setActiveBottomNav('payroll')}
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex flex-col items-center gap-1 transition-colors cursor-pointer"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold">Xem lương</span>
                    </button>
                    <button
                      onClick={() => setActiveBottomNav('attendance')}
                      className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 flex flex-col items-center gap-1 transition-colors cursor-pointer"
                    >
                      <CalendarCheck className="w-4 h-4" />
                      <span className="font-semibold">Bảng công</span>
                    </button>
                    <button
                      onClick={() => setShowMobileNotifSheet(true)}
                      className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 flex flex-col items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Bell className="w-4 h-4" />
                      <span className="font-semibold">Thông báo</span>
                    </button>
                  </div>
                </div>

                {/* Recent Activity List */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs text-slate-800">Lịch sử chấm công gần nhất</h3>
                    <span className="text-[10px] text-slate-400">Hôm nay</span>
                  </div>
                  {todayRec ? (
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-[11px]">Vào ca thành công</p>
                          <p className="text-[10px] text-slate-500">{todayRec.checkInLocation}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-emerald-700 text-xs">{todayRec.checkIn}</span>
                    </div>
                  ) : (
                    <p className="text-center text-xs text-slate-400 py-3">Chưa có lượt chấm công nào hôm nay</p>
                  )}
                </div>
              </div>
            )}

            {/* 2. ATTENDANCE TAB */}
            {activeBottomNav === 'attendance' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 text-xs">
                  <h3 className="font-bold text-slate-900">Bảng chấm công cá nhân</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                    Tháng 08/2026
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-500">Tổng công thực tế</p>
                      <p className="text-lg font-black text-emerald-600">22.5</p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-500">Nghỉ có lương (Phép)</p>
                      <p className="text-lg font-black text-blue-600">1.0</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-slate-500 px-1">Chi tiết từng ngày:</p>
                  {[
                    { day: '28/08 (T6)', in: '08:24', out: '17:35', status: 'Đủ công', color: 'text-emerald-700 bg-emerald-50' },
                    { day: '27/08 (T5)', in: '08:29', out: '17:40', status: 'Đủ công', color: 'text-emerald-700 bg-emerald-50' },
                    { day: '26/08 (T4)', in: '08:30', out: '17:30', status: 'Đủ công', color: 'text-emerald-700 bg-emerald-50' },
                    { day: '25/08 (T3)', in: '08:22', out: '17:32', status: 'Đủ công', color: 'text-emerald-700 bg-emerald-50' },
                    { day: '24/08 (T2)', in: '08:25', out: '17:30', status: 'Đủ công', color: 'text-emerald-700 bg-emerald-50' },
                  ].map((r, i) => (
                    <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-900 text-[11px]">{r.day}</p>
                        <p className="text-[10px] text-slate-500">Vào: {r.in} • Ra: {r.out}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${r.color}`}>
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. REQUESTS TAB */}
            {activeBottomNav === 'requests' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200">
                  <h3 className="font-bold text-xs text-slate-900">Quản lý Đơn từ ({filteredMyRequests.length})</h3>
                  <button
                    onClick={() => setShowNewRequestSheet(true)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-[10px] font-bold shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tạo đơn</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {filteredMyRequests.map((req) => (
                    <div key={req.id} className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-[11px]">{req.typeName}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          req.status === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {req.status === 'APPROVED' ? 'Đã duyệt' : 'Chờ duyệt'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-600">{req.reason}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-1.5">
                        <span>Thời lượng: {req.durationDays} ngày</span>
                        <span>Ngày tạo: {req.startDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. PAYROLL TAB */}
            {activeBottomNav === 'payroll' && (
              <div className="space-y-3">
                <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl text-white shadow-md space-y-2">
                  <p className="text-[11px] text-slate-400">Lương thực nhận Tháng 08/2026</p>
                  <p className="text-2xl font-black font-mono text-emerald-400">
                    {myPayslip.netSalary.toLocaleString('vi-VN')} đ
                  </p>
                  <p className="text-[10px] text-slate-400">Đã trừ Thuế TNCN (Luật 109/2025) & BHXH 10.5%</p>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs divide-y divide-slate-100">
                  <div className="space-y-1 pt-1">
                    <p className="font-bold text-slate-800 text-[11px] text-orange-600">I. THU NHẬP</p>
                    <div className="flex justify-between text-slate-600 text-[11px]">
                      <span>Lương cơ bản ({myPayslip.actualDays} công):</span>
                      <span className="font-semibold text-slate-900">{myPayslip.actualBaseSalary.toLocaleString('vi-VN')} đ</span>
                    </div>
                    <div className="flex justify-between text-slate-600 text-[11px]">
                      <span>Phụ cấp chức vụ:</span>
                      <span className="font-semibold text-slate-900">{myPayslip.positionAllowance.toLocaleString('vi-VN')} đ</span>
                    </div>
                    <div className="flex justify-between text-slate-600 text-[11px]">
                      <span>Phụ cấp ăn trưa:</span>
                      <span className="font-semibold text-slate-900">{myPayslip.lunchAllowance.toLocaleString('vi-VN')} đ</span>
                    </div>
                    <div className="flex justify-between text-slate-600 text-[11px]">
                      <span>Thưởng KPI & Doanh số:</span>
                      <span className="font-bold text-emerald-600">+{(myPayslip.kpiBonus + myPayslip.commission).toLocaleString('vi-VN')} đ</span>
                    </div>
                  </div>

                  <div className="space-y-1 pt-2">
                    <p className="font-bold text-slate-800 text-[11px] text-rose-600">II. KHẤU TRỪ & THUẾ (LUẬT 109/2025/QH15)</p>
                    <div className="flex justify-between text-slate-600 text-[11px]">
                      <span>Giảm trừ gia cảnh bản thân:</span>
                      <span className="font-semibold text-emerald-700">-15.500.000 đ</span>
                    </div>
                    <div className="flex justify-between text-rose-600 text-[11px]">
                      <span>Bảo hiểm bắt buộc NLĐ (10.5%):</span>
                      <span>-{myPayslip.totalInsurance.toLocaleString('vi-VN')} đ</span>
                    </div>
                    <div className="flex justify-between text-rose-600 text-[11px]">
                      <span>Thuế TNCN (Biểu 5 bậc mới):</span>
                      <span>-{myPayslip.pitTax.toLocaleString('vi-VN')} đ</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. PROFILE TAB */}
            {activeBottomNav === 'profile' && (
              <div className="space-y-3 text-xs">
                <div className="text-center p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <img
                    src={currentUser.avatar}
                    alt=""
                    className="w-16 h-16 rounded-full object-cover mx-auto ring-4 ring-orange-500/20"
                  />
                  <h3 className="font-bold text-sm text-slate-900">{currentUser.fullName}</h3>
                  <p className="text-[11px] text-slate-500">{currentUser.positionTitle}</p>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700">
                    Mã NV: {currentUser.code}
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2 text-slate-600 text-[11px]">
                  <p><strong>Email:</strong> {currentUser.email}</p>
                  <p><strong>Điện thoại:</strong> {currentUser.phone}</p>
                  <p><strong>Phòng ban:</strong> {currentUser.departmentName}</p>
                  <p><strong>Hợp đồng:</strong> {currentUser.contractType}</p>
                  <p><strong>Số tài khoản:</strong> {currentUser.bankAccount} ({currentUser.bankName})</p>
                </div>
              </div>
            )}

          </div>

          {/* Mobile Notifications Bottom Sheet Modal */}
          {showMobileNotifSheet && (
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex flex-col justify-end animate-in fade-in duration-150">
              <div className="bg-white rounded-t-3xl max-h-[85%] flex flex-col p-4 shadow-2xl border-t border-slate-200 animate-in slide-in-from-bottom duration-200">
                {/* Sheet Handle */}
                <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-3" />

                {/* Sheet Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs">Thông Báo Của Bạn</h3>
                      <p className="text-[10px] text-slate-400">{mobileUnreadCount} thông báo chưa đọc</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {mobileUnreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllMobileNotifRead}
                        className="text-[10px] font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                      >
                        Đọc tất cả
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowMobileNotifSheet(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs p-1 rounded-full hover:bg-slate-100 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100 my-2 text-xs">
                  {mobileNotifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotifClick(n)}
                      className={`py-3 px-2 flex items-start gap-2.5 transition-colors cursor-pointer active:bg-slate-100 rounded-xl ${
                        !n.isRead ? 'bg-orange-50/50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                        n.type === 'salary' ? 'bg-amber-100 text-amber-600' :
                        n.type === 'attendance' ? 'bg-emerald-100 text-emerald-600' :
                        n.type === 'requests' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                      }`}>
                        {n.type === 'salary' && <DollarSign className="w-3.5 h-3.5" />}
                        {n.type === 'attendance' && <Clock className="w-3.5 h-3.5" />}
                        {n.type === 'requests' && <FileText className="w-3.5 h-3.5" />}
                        {n.type === 'system' && <Sparkles className="w-3.5 h-3.5" />}
                      </div>

                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <p className={`text-[11px] font-bold ${!n.isRead ? 'text-slate-900 font-extrabold' : 'text-slate-700'}`}>
                            {n.title}
                          </p>
                          <span className="text-[9px] text-slate-400 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-tight">{n.desc}</p>
                        <span className="inline-block text-[9px] font-bold text-orange-600">Chạm để mở &rarr;</span>
                      </div>

                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-orange-600 shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Sheet Footer */}
                <button
                  type="button"
                  onClick={() => setShowMobileNotifSheet(false)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer mt-1"
                >
                  Đóng Bảng Thông Báo
                </button>
              </div>
            </div>
          )}

          {/* New Request Bottom Sheet / Modal */}
          {showNewRequestSheet && (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex flex-col justify-end">
              <div className="bg-white rounded-t-3xl p-4 space-y-3 max-h-[85%] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-xs text-slate-900">Tạo Đơn Từ Mới (10 Mẫu Mặc Định)</h4>
                  <button type="button" onClick={() => setShowNewRequestSheet(false)} className="text-slate-400 text-xs cursor-pointer">✕</button>
                </div>

                <form onSubmit={handleMobileSubmitRequest} className="space-y-2.5 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">Chọn loại đơn:</label>
                    <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                      {requestTypeOptions.map((opt) => (
                        <button
                          key={opt.type}
                          type="button"
                          onClick={() => setSelectedReqType(opt.type as any)}
                          className={`p-2 rounded-xl text-left text-[10px] border transition-all cursor-pointer ${
                            selectedReqType === opt.type
                              ? 'border-orange-500 bg-orange-50/60 font-bold text-orange-900'
                              : 'border-slate-200 bg-slate-50 text-slate-700'
                          }`}
                        >
                          <p className="font-bold truncate">{opt.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">Số ngày / giờ xin nghỉ:</label>
                    <input
                      type="number"
                      value={reqDuration}
                      onChange={(e) => setReqDuration(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">Lý do cụ thể:</label>
                    <textarea
                      rows={2}
                      value={reqReason}
                      onChange={(e) => setReqReason(e.target.value)}
                      placeholder="Nhập lý do gửi cấp quản lý duyệt..."
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowNewRequestSheet(false)}
                      className="flex-1 py-2 bg-slate-100 rounded-xl font-bold text-slate-700 text-xs cursor-pointer"
                    >
                      Đóng
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-orange-600 rounded-xl font-bold text-white text-xs shadow-md shadow-orange-600/30 cursor-pointer"
                    >
                      Gửi Đơn Duyệt
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* iOS Bottom Navigation Bar */}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 flex items-center justify-around z-40">
            {[
              { id: 'home', label: 'Trang chủ', icon: Home },
              { id: 'attendance', label: 'Bảng công', icon: CalendarCheck },
              { id: 'requests', label: 'Đơn từ', icon: FileText },
              { id: 'payroll', label: 'Phiếu lương', icon: DollarSign },
              { id: 'profile', label: 'Hồ sơ', icon: User },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeBottomNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveBottomNav(item.id as any)}
                  className={`flex flex-col items-center gap-0.5 text-[9px] font-semibold transition-all cursor-pointer ${
                    isActive ? 'text-orange-600 scale-105' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* iOS Home Indicator */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-300 rounded-full z-50 pointer-events-none" />

        </div>
      </div>
    </div>
  );
};
