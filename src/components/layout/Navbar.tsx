'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Search,
  User,
  Shield,
  Briefcase,
  ChevronDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Target,
  Check,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useHRM } from '@/context/HRMContext';
import { UserRole } from '@/types';

interface NavbarProps {
  onOpenDownloadModal?: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'leave' | 'attendance' | 'salary' | 'okr' | 'system';
  isRead: boolean;
  actionText?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDownloadModal }) => {
  const { currentRole, setCurrentRole, currentUser, handleCheckIn, todayAttendance } = useHRM();

  const isCheckedInToday = todayAttendance.some((a) => a.employeeId === currentUser.id);

  // Notifications State
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Đơn xin nghỉ phép cần duyệt',
      desc: 'Trần Thị Huệ đã gửi đơn xin nghỉ phép năm 01 ngày (28/08)',
      time: '10 phút trước',
      type: 'leave',
      isRead: false,
      actionText: 'Duyệt ngay',
    },
    {
      id: 'notif-2',
      title: 'Chấm công GPS thành công',
      desc: 'Check-in đúng giờ lúc 08:24 AM tại Trụ sở chính Five Star',
      time: '1 giờ trước',
      type: 'attendance',
      isRead: false,
    },
    {
      id: 'notif-3',
      title: 'Phiếu lương Tháng 08/2026 đã sẵn sàng',
      desc: 'Bảng lương đã tính theo Luật Thuế TNCN số 109/2025/QH15 mới nhất',
      time: '3 giờ trước',
      type: 'salary',
      isRead: false,
      actionText: 'Xem phiếu',
    },
    {
      id: 'notif-4',
      title: 'Cập nhật tiến độ Mục tiêu OKR',
      desc: 'Khối Kỹ thuật đã cập nhật tiến độ Key Result "Triển khai hệ thống HRM" lên 90%',
      time: 'Hôm qua',
      type: 'okr',
      isRead: true,
    },
    {
      id: 'notif-5',
      title: 'Hồ sơ ứng viên AI Match cao',
      desc: 'Ứng viên Nguyễn Thị Mai Lan đạt 92% điểm phù hợp vị trí Senior React Lead',
      time: '2 ngày trước',
      type: 'system',
      isRead: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles: { role: UserRole; label: string; desc: string; icon: any; color: string }[] = [
    { role: 'ADMIN', label: 'Lê Việt Thắng (CTO / Admin)', desc: 'Toàn quyền cấu hình & Quản trị', icon: Shield, color: 'text-purple-600 bg-purple-50' },
    { role: 'HR_MANAGER', label: 'Phạm Thùy Linh (HRM)', desc: 'Quản lý Nhân sự, Xem lương & BHXH', icon: Briefcase, color: 'text-orange-600 bg-orange-50' },
    { role: 'DEPARTMENT_LEAD', label: 'Trần Thị Huệ (Lead)', desc: 'Duyệt đơn, Đánh giá OKR nhóm', icon: User, color: 'text-blue-600 bg-blue-50' },
    { role: 'EMPLOYEE', label: 'Nguyễn Thu Trang (Nhân viên)', desc: 'Self-service: Chấm công, Xem lương mình', icon: User, color: 'text-emerald-600 bg-emerald-50' },
  ];

  const getNotifIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'leave':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'attendance':
        return <Clock className="w-4 h-4 text-emerald-600" />;
      case 'salary':
        return <DollarSign className="w-4 h-4 text-amber-600" />;
      case 'okr':
        return <Target className="w-4 h-4 text-purple-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-orange-600" />;
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Search Bar */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm nhân sự (mã NV, họ tên, phòng ban), đơn từ, tài liệu..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>
      </div>

      {/* Actions & Role Switcher */}
      <div className="flex items-center gap-3">
        {/* Direct Download App Modal Button */}
        {onOpenDownloadModal && (
          <button
            onClick={onOpenDownloadModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs border border-slate-800 hover:border-slate-700 cursor-pointer"
          >
            <span className="text-orange-400 font-bold">📲</span>
            <span>Cài App Di Động</span>
          </button>
        )}

        {/* Quick GPS Punch In button */}
        <button
          onClick={() => handleCheckIn('Mobile GPS', 'Trụ sở chính 1Office - Five Star')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-xs cursor-pointer ${
            isCheckedInToday
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-orange-500/20'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{isCheckedInToday ? 'Đã Chấm Công (Hôm nay)' : 'Chấm Công GPS (1 Chạm)'}</span>
        </button>

        {/* Role Switcher dropdown */}
        <div className="relative group">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg cursor-pointer transition-all">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-left">
              <p className="text-[10px] text-slate-500 uppercase font-bold leading-none">Góc nhìn vai trò</p>
              <p className="text-xs font-semibold text-slate-800 leading-tight">
                {currentRole === 'ADMIN' && 'Tổng Quản Trị (Admin)'}
                {currentRole === 'HR_MANAGER' && 'Trưởng Phòng Nhân Sự (HRM)'}
                {currentRole === 'DEPARTMENT_LEAD' && 'Quản Lý Bộ Phận (Lead)'}
                {currentRole === 'EMPLOYEE' && 'Nhân Viên (Self-Service)'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-1" />
          </div>

          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-1 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-500">
              CHỌN VAI TRÒ ĐỂ TRẢI NGHIỆM HỆ THỐNG
            </div>
            {roles.map((r) => {
              const isCurrent = currentRole === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => setCurrentRole(r.role)}
                  className={`w-full text-left px-3 py-2 flex items-start gap-2.5 transition-colors cursor-pointer ${
                    isCurrent ? 'bg-orange-50/70 border-l-2 border-orange-500' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${r.color}`}>
                    <r.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${isCurrent ? 'text-orange-600' : 'text-slate-800'}`}>
                      {r.label}
                    </p>
                    <p className="text-[11px] text-slate-500 leading-tight">{r.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg cursor-pointer transition-colors"
            title="Thông báo hệ thống"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-orange-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              
              {/* Notif Header */}
              <div className="p-3.5 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-xs">Thông Báo Hệ Thống</h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800">
                      {unreadCount} mới
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 cursor-pointer"
                  >
                    Đánh dấu đã đọc tất cả
                  </button>
                )}
              </div>

              {/* Notif List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-400">Không có thông báo mới</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-slate-50/80 ${
                        !n.isRead ? 'bg-orange-50/30' : ''
                      }`}
                    >
                      <div className="p-2 bg-slate-100 rounded-xl shrink-0 mt-0.5">
                        {getNotifIcon(n.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className={`font-bold ${!n.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{n.desc}</p>
                        {n.actionText && (
                          <span className="inline-block mt-1 text-[11px] font-bold text-orange-600 hover:underline">
                            {n.actionText} &rarr;
                          </span>
                        )}
                      </div>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-orange-600 shrink-0 mt-2" />
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Notif Footer */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center text-[11px]">
                <span className="text-slate-500">Tự động đồng bộ thời gian thực (Realtime)</span>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Info */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <img
            src={currentUser.avatar}
            alt={currentUser.fullName}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-500/20"
          />
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">{currentUser.fullName}</p>
            <p className="text-[11px] text-slate-500 leading-tight">{currentUser.positionTitle}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
