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
  Layers,
  Sparkles,
  Smartphone,
  Download,
  TreePine,
  UserCheck,
  Briefcase
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
  const isOfficeStaff = currentRole === 'OFFICE_STAFF' || currentRole === 'EMPLOYEE' || currentRole === 'DEPARTMENT_LEAD';

  // Build menu items dynamically based on role
  let menuItems: { id: string; name: string; icon: any; badge: any; group: string }[] = [];

  if (isExecutiveOrHR) {
    // BGĐ và HR: Quản trị bao quát toàn hệ thống (Có Dashboard BI)
    menuItems = [
      { id: 'dashboard', name: 'Dashboard BI & Báo Cáo', icon: BarChart3, badge: null, group: 'TỔNG QUAN' },
      { id: 'download-app', name: 'Tải & Cài Đặt App', icon: Download, badge: 'Mobile', group: 'TỔNG QUAN' },
      { id: 'hsns', name: 'Hồ Sơ Nhân Sự 360°', icon: Users, badge: null, group: 'QUẢN TRỊ NHÂN LỰC' },
      { id: 'cham-cong', name: 'Chấm Công Toàn Hệ Thống', icon: CalendarCheck, badge: 'Bao Quát', group: 'QUẢN TRỊ NHÂN LỰC' },
      { id: 'don-tu', name: 'Đơn Từ & Workflow BPA', icon: FileText, badge: pendingRequestsCount > 0 ? pendingRequestsCount : null, group: 'QUẢN TRỊ NHÂN LỰC' },
      { id: 'tien-luong', name: 'Tiền Lương & Quỹ Lương', icon: DollarSign, badge: 'Formula', group: 'C&B & TIỀN LƯƠNG' },
      { id: 'bhxh-ivan', name: '1-IVAN BHXH Điện Tử', icon: ShieldCheck, badge: null, group: 'C&B & TIỀN LƯƠNG' },
      { id: 'tuyen-dung', name: 'Tuyển Dụng ATS & AI', icon: UserPlus, badge: interviewingCandidates > 0 ? interviewingCandidates : null, group: 'PHÁT TRIỂN & HIỆU SUẤT' },
      { id: 'kpi-okr', name: 'Mục Tiêu OKR & KPI', icon: Target, badge: null, group: 'PHÁT TRIỂN & HIỆU SUẤT' },
      { id: 'danh-gia-ask', name: 'Đánh Giá ASK & Đào Tạo', icon: Award, badge: 'Radar', group: 'PHÁT TRIỂN & HIỆU SUẤT' },
    ];
  } else if (isPlantationDirector) {
    // Giám Đốc Nông Trường: Quản lý quân số các tổ, sản lượng mủ (Không cần Dashboard cồng kềnh)
    menuItems = [
      { id: 'cham-cong', name: 'Quân Số & Các Tổ Nông Trường', icon: TreePine, badge: 'NT1', group: 'ĐIỀU HÀNH NÔNG TRƯỜNG' },
      { id: 'don-tu', name: 'Phê Duyệt Đơn Từ Tổ', icon: FileText, badge: pendingRequestsCount > 0 ? pendingRequestsCount : null, group: 'ĐIỀU HÀNH NÔNG TRƯỜNG' },
      { id: 'hsns', name: 'Hồ Sơ CBNV Nông Trường', icon: Users, badge: null, group: 'ĐIỀU HÀNH NÔNG TRƯỜNG' },
      { id: 'tien-luong', name: 'Quỹ Lương & Phiếu Lương', icon: DollarSign, badge: null, group: 'C&B' },
      { id: 'download-app', name: 'Tải & Cài Đặt App', icon: Download, badge: 'Mobile', group: 'TIỆN ÍCH' },
    ];
  } else if (isTeamLeader) {
    // Tổ Trưởng: Quản lý công nhân trong tổ, điểm danh, choàng lô, nhập mủ, xuất file 3 sheet
    menuItems = [
      { id: 'cham-cong', name: 'Chấm Công & Sản Lượng Tổ', icon: CalendarCheck, badge: '1-Chạm', group: 'TỔ KHAI THÁC MỦ' },
      { id: 'don-tu', name: 'Đơn Từ & Xin Nghỉ Phép', icon: FileText, badge: null, group: 'TỔ KHAI THÁC MỦ' },
      { id: 'tien-luong', name: 'Phiếu Lương Cá Nhân', icon: DollarSign, badge: null, group: 'THU NHẬP' },
      { id: 'download-app', name: 'Tải App Mobile', icon: Download, badge: 'Mobile', group: 'TIỆN ÍCH' },
    ];
  } else {
    // Khối Văn Phòng: Chấm công cá nhân, Đơn từ không dùng giấy, Theo dõi duyệt 3 bước, Tra cứu quỹ phép, Phiếu lương
    menuItems = [
      { id: 'cham-cong', name: 'Bảng Chấm Công Cá Nhân', icon: CalendarCheck, badge: 'Cá Nhân', group: 'KHỐI VĂN PHÒNG' },
      { id: 'don-tu', name: 'Đơn Từ Điện Tử (Không Giấy)', icon: FileText, badge: 'Online', group: 'KHỐI VĂN PHÒNG' },
      { id: 'tien-luong', name: 'Phiếu Lương & Thu Nhập', icon: DollarSign, badge: 'Luật 109', group: 'CÁ NHÂN' },
      { id: 'kpi-okr', name: 'Mục Tiêu Cá Nhân (OKR)', icon: Target, badge: null, group: 'CÁ NHÂN' },
      { id: 'download-app', name: 'Tải App Mobile', icon: Download, badge: 'Mobile', group: 'TIỆN ÍCH' },
    ];
  }

  // Group items
  const groups = Array.from(new Set(menuItems.map((item) => item.group)));

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col h-screen border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 gap-3 border-b border-slate-800 bg-slate-950/60">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-bold text-xl">
          1
        </div>
        <div>
          <div className="flex items-center gap-1.5 font-bold text-lg tracking-tight text-white">
            <span>1HRM</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-semibold border border-orange-500/30">
              Enterprise
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
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
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 custom-scrollbar">
        {groups.map((group) => (
          <div key={group} className="space-y-1">
            <h4 className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase px-3 mb-2">
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
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-orange-600 text-white font-semibold shadow-md shadow-orange-600/30'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : item.badge === 'Realtime' || item.badge === 'Online'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
        ))}
      </div>

      {/* Role Badge Indicator at Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-[10px]">Góc nhìn hiện tại:</span>
          <span className="text-orange-400 font-bold text-[10px] font-mono">{currentRole}</span>
        </div>
        <p className="text-[10px] text-slate-500 truncate">
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
