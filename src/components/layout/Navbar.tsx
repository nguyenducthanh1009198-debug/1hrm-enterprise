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
  TreePine,
  Tractor,
  Building2,
  ClipboardCheck,
  Award
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
      title: 'Tổ 1 Nông Trường 1 vừa nộp bảng công',
      desc: 'Tổ trưởng Nguyễn Văn Lực đã chấm công 42 người và nộp 1.740kg mủ cao su',
      time: '5 phút trước',
      type: 'attendance',
      isRead: false,
      actionText: 'Duyệt công',
    },
    {
      id: 'notif-2',
      title: 'Đơn xin nghỉ phép cần duyệt',
      desc: 'Trần Thị Huệ đã gửi đơn xin nghỉ phép năm 01 ngày (28/08)',
      time: '15 phút trước',
      type: 'leave',
      isRead: false,
      actionText: 'Duyệt ngay',
    },
    {
      id: 'notif-3',
      title: 'Tờ trình tổng hợp công tháng 08/2026',
      desc: 'Phòng HCTH đã lập tờ trình chuyển Ban Tổng Giám Đốc phê duyệt',
      time: '1 giờ trước',
      type: 'system',
      isRead: false,
      actionText: 'Xem tờ trình',
    },
    {
      id: 'notif-4',
      title: 'Phiếu lương Tháng 08/2026 đã sẵn sàng',
      desc: 'Bảng lương đã tính theo Luật Thuế TNCN số 109/2025/QH15 mới nhất (Giảm trừ 15.5M)',
      time: '3 giờ trước',
      type: 'salary',
      isRead: true,
      actionText: 'Xem phiếu',
    },
    {
      id: 'notif-5',
      title: 'Cập nhật tiến độ Mục tiêu OKR Nông Trường',
      desc: 'Sản lượng mủ thu hoạch toàn 3 nông trường đạt 92% kế hoạch Q3',
      time: 'Hôm qua',
      type: 'okr',
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

  // Close notifications dropdown on outside click
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
    {
      role: 'ADMIN',
      label: 'Lê Việt Thắng (Tổng Giám Đốc)',
      desc: '5. Ban TGĐ: Dashboard điều hành & Duyệt 1-click',
      icon: Award,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      role: 'HR_MANAGER',
      label: 'Phạm Thùy Linh (Trưởng Phòng HCTH)',
      desc: '4. Phòng HCTH: Tổng hợp VP+NT & Chốt công tính lương',
      icon: ClipboardCheck,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      role: 'PLANTATION_DIRECTOR',
      label: 'Nguyễn Văn Hùng (GĐ Nông Trường)',
      desc: '2. BGĐ Nông Trường: Check-in lô cạo & Duyệt công tổ',
      icon: Tractor,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      role: 'TEAM_LEADER',
      label: 'Nguyễn Văn Lực (Tổ Trưởng)',
      desc: '1. Tổ Trưởng: Chấm công tổ 1-chạm & Giao nộp mủ (Offline)',
      icon: TreePine,
      color: 'text-orange-600 bg-orange-50',
    },
    {
      role: 'DEPARTMENT_LEAD',
      label: 'Trần Thị Huệ (Khối Văn Phòng)',
      desc: '3. Khối Văn Phòng: FaceID/Vân tay & Duyệt đơn',
      icon: Building2,
      color: 'text-emerald-600 bg-emerald-50',
    },
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
            placeholder="Tìm kiếm nhân sự, lô cạo, tổ sản xuất, đơn từ..."
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
          onClick={() => handleCheckIn('Mobile GPS', 'Trụ sở chính 1HRM - Five Star')}
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
                {currentRole === 'ADMIN' && '5. Ban Tổng Giám Đốc'}
                {currentRole === 'HR_MANAGER' && '4. Phòng HCTH (Admin)'}
                {currentRole === 'PLANTATION_DIRECTOR' && '2. BGĐ Nông Trường'}
                {currentRole === 'TEAM_LEADER' && '1. Tổ Trưởng Nông Trường'}
                {currentRole === 'DEPARTMENT_LEAD' && '3. Khối Văn Phòng'}
                {currentRole === 'EMPLOYEE' && 'Nhân Viên (Self-Service)'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-1" />
          </div>

          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-1 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-500">
              CHỌN VAI TRÒ CHẤM CÔNG THEO ẢNH
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

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative transition-all cursor-pointer"
            title="Trung tâm thông báo"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Menu */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Thông Báo Hệ Thống</h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Bạn có {unreadCount} thông báo chưa đọc
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> Đọc tất cả
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                      !n.isRead ? 'bg-orange-50/40' : ''
                    }`}
                  >
                    <div className="p-2 bg-slate-100 rounded-xl shrink-0 mt-0.5">
                      {getNotifIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs font-bold truncate ${!n.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                          {n.title}
                        </p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                        {n.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <img
            src={currentUser.avatar}
            alt={currentUser.fullName}
            className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
          />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-900 leading-none">{currentUser.fullName}</p>
            <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{currentUser.positionTitle}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
