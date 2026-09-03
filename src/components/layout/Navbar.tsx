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
  Award,
  Smartphone,
  Download
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
      desc: 'Ban TGĐ: Dashboard điều hành & Duyệt 1-click',
      icon: Award,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      role: 'HR_MANAGER',
      label: 'Phạm Thùy Linh (Trưởng Phòng HCTH)',
      desc: 'Phòng HCTH: Tổng hợp VP+NT & Chốt công tính lương',
      icon: ClipboardCheck,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      role: 'PLANTATION_DIRECTOR',
      label: 'Nguyễn Văn Hùng (GĐ Nông Trường)',
      desc: 'BGĐ Nông Trường: Check-in lô cạo & Duyệt công tổ',
      icon: Tractor,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      role: 'TEAM_LEADER',
      label: 'Nguyễn Văn Lực (Tổ Trưởng)',
      desc: 'Tổ Trưởng: Chấm công tổ 1-chạm & Giao nộp mủ (Offline)',
      icon: TreePine,
      color: 'text-emerald-700 bg-emerald-50',
    },
    {
      role: 'DEPARTMENT_LEAD',
      label: 'Trần Thị Huệ (Khối Văn Phòng)',
      desc: 'Khối Văn Phòng: FaceID/Vân tay & Duyệt đơn trực tuyến',
      icon: Building2,
      color: 'text-emerald-600 bg-emerald-50',
    },
  ];

  return (
    <header className="h-14 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Search Bar */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm nhân sự, lô cạo, tổ sản xuất, đơn từ..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#047857]/20 focus:border-[#047857] transition-all placeholder:text-slate-400 text-[#0F172A]"
          />
        </div>
      </div>

      {/* Actions & Role Switcher */}
      <div className="flex items-center gap-3">
        {/* Quick GPS Punch In button */}
        <button
          onClick={() => handleCheckIn('Mobile GPS', 'Trụ sở chính 1HRM - Five Star')}
          className={`btn-primary text-xs py-1.5 px-3.5 ${
            isCheckedInToday
              ? 'bg-[#ECFDF5] text-[#047857] border border-[#BBF7D0] hover:bg-[#D1FAE5]'
              : ''
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{isCheckedInToday ? 'Đã Chấm Công (Hôm nay)' : 'Chấm Công GPS (1 Chạm)'}</span>
        </button>

        {/* Role Switcher dropdown */}
        <div className="relative group">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F8FAFC] hover:bg-slate-100 border border-[#E2E8F0] rounded-lg cursor-pointer transition-all">
            <div className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <div className="text-left">
              <p className="text-[10px] text-slate-400 uppercase font-semibold leading-none">Góc nhìn vai trò</p>
              <p className="text-xs font-semibold text-[#0F172A] leading-tight mt-0.5">
                {currentRole === 'ADMIN' && 'Ban Tổng Giám Đốc'}
                {currentRole === 'HR_MANAGER' && 'Phòng HCTH (HR)'}
                {currentRole === 'PLANTATION_DIRECTOR' && 'GĐ Nông Trường'}
                {currentRole === 'TEAM_LEADER' && 'Tổ Trưởng Nông Trường'}
                {currentRole === 'DEPARTMENT_LEAD' && 'Khối Văn Phòng'}
                {currentRole === 'EMPLOYEE' && 'Nhân Viên'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-1" />
          </div>

          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-1 w-80 bg-white rounded-lg shadow-xl border border-[#E2E8F0] py-1.5 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="px-3 py-1.5 border-b border-[#F1F5F9] text-[11px] font-semibold text-slate-400 uppercase">
              CHỌN VAI TRÒ ĐIỀU HÀNH
            </div>
            {roles.map((r) => {
              const isCurrent = currentRole === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => setCurrentRole(r.role)}
                  className={`w-full text-left px-3 py-2 flex items-start gap-2.5 transition-colors cursor-pointer ${
                    isCurrent ? 'bg-[#ECFDF5] border-l-2 border-[#047857]' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${r.color}`}>
                    <r.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${isCurrent ? 'text-[#047857]' : 'text-slate-800'}`}>
                      {r.label}
                    </p>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{r.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications Icon with Indicator */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#DC2626] ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Flyout */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-2xl border border-[#E2E8F0] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-[#F1F5F9] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Thông báo hệ thống</h4>
                  <p className="text-[11px] text-slate-500">{unreadCount} thông báo chưa đọc</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-semibold text-[#047857] hover:underline"
                  >
                    Đọc tất cả
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#F1F5F9]">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`p-3 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 items-start ${
                      !n.isRead ? 'bg-[#F0FDF4]/50' : ''
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-700 shrink-0">
                      <FileText className="w-4 h-4 text-[#047857]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-900 truncate">{n.title}</p>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{n.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with App Download Modal Link */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E2E8F0]">
          <img
            src={currentUser.avatar}
            alt=""
            className="w-8 h-8 rounded-full object-cover border border-[#E2E8F0]"
          />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-tight">{currentUser.fullName}</p>
            <p className="text-[10px] text-slate-500 font-mono">{currentUser.code}</p>
          </div>

          {onOpenDownloadModal && (
            <button
              onClick={onOpenDownloadModal}
              title="Cài App Mobile 1HRM"
              className="p-1.5 rounded-lg text-slate-500 hover:text-[#047857] hover:bg-slate-100 transition-colors cursor-pointer ml-1"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
