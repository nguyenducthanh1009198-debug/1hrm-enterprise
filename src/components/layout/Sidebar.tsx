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
} from 'lucide-react';
import { useHRM } from '@/context/HRMContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { requests, candidates, payslips } = useHRM();

  const pendingRequestsCount = requests.filter((r) => r.status === 'PENDING').length;
  const interviewingCandidates = candidates.filter((c) => c.stage === 'INTERVIEW' || c.stage === 'OFFER').length;

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard BI & Báo cáo', icon: BarChart3, badge: null, group: 'TỔNG QUAN' },
    { id: 'download-app', name: 'Tải & Cài Đặt App', icon: Download, badge: 'QR/Link', group: 'TỔNG QUAN' },
    { id: 'hsns', name: 'Hồ sơ nhân sự 360°', icon: Users, badge: null, group: 'QUẢN TRỊ NHÂN LỰC' },
    { id: 'cham-cong', name: 'Chấm công & Phân ca', icon: CalendarCheck, badge: 'Realtime', group: 'QUẢN TRỊ NHÂN LỰC' },
    { id: 'don-tu', name: 'Đơn từ & Workflow BPA', icon: FileText, badge: pendingRequestsCount > 0 ? pendingRequestsCount : null, group: 'QUẢN TRỊ NHÂN LỰC' },
    { id: 'tien-luong', name: 'Tiền lương & Formula', icon: DollarSign, badge: 'Formula', group: 'C&B & LƯƠNG' },
    { id: 'bhxh-ivan', name: '1-IVAN BHXH Điện tử', icon: ShieldCheck, badge: null, group: 'C&B & LƯƠNG' },
    { id: 'tuyen-dung', name: 'Tuyển dụng ATS & AI', icon: UserPlus, badge: interviewingCandidates > 0 ? interviewingCandidates : null, group: 'PHÁT TRIỂN & HIỆU SUẤT' },
    { id: 'kpi-okr', name: 'Mục tiêu OKR & KPI', icon: Target, badge: null, group: 'PHÁT TRIỂN & HIỆU SUẤT' },
    { id: 'danh-gia-ask', name: 'Đánh giá ASK & Đào tạo', icon: Award, badge: 'Radar', group: 'PHÁT TRIỂN & HIỆU SUẤT' },
  ];

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
          <p className="text-[11px] text-slate-400">Bộ công cụ Quản trị Nhân sự</p>
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
                            : item.badge === 'Realtime'
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

      {/* Footer info */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span>Formula Engine 2.0</span>
        </div>
        <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50">Online</span>
      </div>
    </aside>
  );
};
