'use client';

import React from 'react';
import {
  Users,
  CalendarCheck,
  FileText,
  DollarSign,
  UserPlus,
  Target,
  Award,
  ShieldCheck,
  BarChart3,
  Building2,
  Download,
  TreePine
} from 'lucide-react';
import { useHRM } from '@/context/HRMContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { requests, candidates, currentRole } = useHRM();

  const pendingRequestsCount = requests.filter((r) => r.status === 'PENDING').length;
  const interviewingCandidates = candidates.filter((c) => c.stage === 'INTERVIEW' || c.stage === 'OFFER').length;

  const isExecutiveOrHR = ['ADMIN', 'EXECUTIVE_DIRECTOR', 'HR_MANAGER', 'HR_ADMIN'].includes(currentRole);
  const isPlantationDirector = currentRole === 'PLANTATION_DIRECTOR';
  const isTeamLeader = currentRole === 'TEAM_LEADER';

  // Build menu items dynamically based on role - ALL TEXT TAGS (Mobile, Formula, Radar, etc.) REMOVED
  let menuItems: { id: string; name: string; icon: any; notifCount?: number; group: string }[] = [];

  if (isExecutiveOrHR) {
    // BGĐ và HR: Quản trị bao quát toàn hệ thống (Có Dashboard BI)
    menuItems = [
      { id: 'dashboard', name: 'Dashboard BI & Báo Cáo', icon: BarChart3, group: 'TỔNG QUAN' },
      { id: 'download-app', name: 'Tải & Cài Đặt App', icon: Download, group: 'TỔNG QUAN' },
      { id: 'hsns', name: 'Hồ Sơ Nhân Sự 360°', icon: Users, group: 'QUẢN TRỊ NHÂN LỰC' },
      { id: 'cham-cong', name: 'Chấm Công Toàn Hệ Thống', icon: CalendarCheck, group: 'QUẢN TRỊ NHÂN LỰC' },
      { id: 'don-tu', name: 'Đơn Từ & Workflow BPA', icon: FileText, notifCount: pendingRequestsCount, group: 'QUẢN TRỊ NHÂN LỰC' },
      { id: 'tien-luong', name: 'Tiền Lương & Quỹ Lương', icon: DollarSign, group: 'C&B & TIỀN LƯƠNG' },
      { id: 'bhxh-ivan', name: '1-IVAN BHXH Điện Tử', icon: ShieldCheck, group: 'C&B & TIỀN LƯƠNG' },
      { id: 'tuyen-dung', name: 'Tuyển Dụng ATS & AI', icon: UserPlus, notifCount: interviewingCandidates, group: 'PHÁT TRIỂN & HIỆU SUẤT' },
      { id: 'kpi-okr', name: 'Mục Tiêu OKR & KPI', icon: Target, group: 'PHÁT TRIỂN & HIỆU SUẤT' },
      { id: 'danh-gia-ask', name: 'Đánh Giá ASK & Đào Tạo', icon: Award, group: 'PHÁT TRIỂN & HIỆU SUẤT' },
    ];
  } else if (isPlantationDirector) {
    // Giám Đốc Nông Trường: Quản lý quân số các tổ, sản lượng mủ
    menuItems = [
      { id: 'cham-cong', name: 'Quân Số & Các Tổ Nông Trường', icon: TreePine, group: 'ĐIỀU HÀNH NÔNG TRƯỜNG' },
      { id: 'don-tu', name: 'Phê Duyệt Đơn Từ Tổ', icon: FileText, notifCount: pendingRequestsCount, group: 'ĐIỀU HÀNH NÔNG TRƯỜNG' },
      { id: 'hsns', name: 'Hồ Sơ CBNV Nông Trường', icon: Users, group: 'ĐIỀU HÀNH NÔNG TRƯỜNG' },
      { id: 'tien-luong', name: 'Quỹ Lương & Phiếu Lương', icon: DollarSign, group: 'C&B' },
      { id: 'download-app', name: 'Tải & Cài Đặt App', icon: Download, group: 'TIỆN ÍCH' },
    ];
  } else if (isTeamLeader) {
    // Tổ Trưởng: Quản lý công nhân trong tổ, điểm danh, choàng lô, nhập mủ, xuất file 3 sheet
    menuItems = [
      { id: 'cham-cong', name: 'Chấm Công & Sản Lượng Tổ', icon: CalendarCheck, group: 'TỔ KHAI THÁC MỦ' },
      { id: 'don-tu', name: 'Đơn Từ & Xin Nghỉ Phép', icon: FileText, group: 'TỔ KHAI THÁC MỦ' },
      { id: 'tien-luong', name: 'Phiếu Lương Cá Nhân', icon: DollarSign, group: 'THU NHẬP' },
      { id: 'download-app', name: 'Tải App Mobile', icon: Download, group: 'TIỆN ÍCH' },
    ];
  } else {
    // Khối Văn Phòng: Chấm công cá nhân, Đơn từ không dùng giấy, Theo dõi duyệt 3 bước, Tra cứu quỹ phép, Phiếu lương
    menuItems = [
      { id: 'cham-cong', name: 'Bảng Chấm Công Cá Nhân', icon: CalendarCheck, group: 'KHỐI VĂN PHÒNG' },
      { id: 'don-tu', name: 'Đơn Từ Điện Tử (Không Giấy)', icon: FileText, group: 'KHỐI VĂN PHÒNG' },
      { id: 'tien-luong', name: 'Phiếu Lương & Thu Nhập', icon: DollarSign, group: 'CÁ NHÂN' },
      { id: 'kpi-okr', name: 'Mục Tiêu Cá Nhân (OKR)', icon: Target, group: 'CÁ NHÂN' },
      { id: 'download-app', name: 'Tải App Mobile', icon: Download, group: 'TIỆN ÍCH' },
    ];
  }

  // Group items
  const groups = Array.from(new Set(menuItems.map((item) => item.group)));

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col h-screen border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 gap-3 border-b border-slate-800 bg-slate-950/70">
        <div className="w-9 h-9 rounded-md bg-[#E05600] flex items-center justify-center shadow-sm text-white font-bold text-lg">
          1
        </div>
        <div>
          <div className="flex items-center gap-1.5 font-semibold text-[16px] leading-6 tracking-tight text-white">
            <span>1HRM</span>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-[#FFF4ED] text-[#E05600] font-medium">
              Enterprise
            </span>
          </div>
          <p className="text-[12px] font-medium text-slate-400">
            {isExecutiveOrHR
              ? 'Quản trị Bao quát BGĐ & HR'
              : isPlantationDirector
              ? 'GĐ Nông Trường Quản lý'
              : isTeamLeader
              ? 'Tổ Trưởng Quản lý Công nhân'
              : 'Giao diện Khối Văn Phòng'}
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5 custom-scrollbar">
        {groups.map((group) => (
          <div key={group} className="space-y-1">
            <h4 className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-3 mb-1.5">
              {group}
            </h4>
            {menuItems
              .filter((item) => item.group === group)
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-[6px] text-[13px] transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-[#E05600] text-white font-semibold shadow-xs'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white font-normal'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </div>

                    {/* Notification Dot or Clean Numeric Count */}
                    {item.notifCount && item.notifCount > 0 ? (
                      <span className="w-5 h-5 rounded-full bg-[#DC2626] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                        {item.notifCount}
                      </span>
                    ) : null}
                  </button>
                );
              })}
          </div>
        ))}
      </div>

      {/* Role Badge Indicator at Footer */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/40 text-[12px] text-slate-400 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-[11px]">Góc nhìn:</span>
          <span className="text-[#E05600] font-bold text-[11px] font-mono">{currentRole}</span>
        </div>
        <p className="text-[11px] text-slate-500 truncate">
          {isExecutiveOrHR
            ? '✓ Quyền hạn cao nhất toàn hệ thống'
            : isPlantationDirector
            ? '✓ Quản lý quân số các tổ nông trường'
            : isTeamLeader
            ? '✓ Quản lý công nhân & xuất 3 sheet'
            : '✓ Chấm công cá nhân & đơn không giấy'}
        </p>
      </div>
    </aside>
  );
};
