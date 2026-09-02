'use client';

import React from 'react';
import {
  Users,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  Award,
  Clock,
  Sparkles,
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { useHRM } from '@/context/HRMContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

export const DashboardModule: React.FC = () => {
  const { employees, payslips, requests, candidates, okrs } = useHRM();

  const totalHeadcount = employees.length;
  const totalPayroll = payslips.reduce((acc, p) => acc + p.netSalary, 0);
  const pendingRequests = requests.filter((r) => r.status === 'PENDING').length;
  const avgEfficiency = Math.round(
    employees.reduce((acc, e) => acc + e.workEfficiency, 0) / (employees.length || 1)
  );

  // Department distribution for chart
  const deptData = [
    { name: 'Kỹ Thuật & Dev', value: 45, color: '#3b82f6' },
    { name: 'Kinh Doanh', value: 32, color: '#ea580c' },
    { name: 'Marketing', value: 14, color: '#8b5cf6' },
    { name: 'Nhân Sự & HC', value: 8, color: '#10b981' },
    { name: 'Tài Chính KT', value: 6, color: '#f59e0b' },
  ];

  // Payroll trend data (last 6 months)
  const payrollTrend = [
    { month: 'T3/2026', total: 285000000 },
    { month: 'T4/2026', total: 310000000 },
    { month: 'T5/2026', total: 345000000 },
    { month: 'T6/2026', total: 360000000 },
    { month: 'T7/2026', total: 380000000 },
    { month: 'T8/2026', total: 420000000 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950 rounded-2xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-orange-500 text-white font-bold text-[11px]">
              1HRM BI Analytics
            </span>
            <span className="text-slate-400 text-xs font-mono">Thời gian thực (Live Dashboard)</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight mt-2 text-white">
            Trung Tâm Điều Hành Quản Trị Nhân Sự
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Hệ thống tự động đồng bộ và trực quan hóa số liệu toàn diện: Định biên, Biến động nhân sự, Chấm công máy, Quỹ lương và Cây mục tiêu OKR.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/10 backdrop-blur-xs">
          <div className="text-right">
            <p className="text-[10px] text-slate-300 font-semibold uppercase">Tiến độ OKR Công ty</p>
            <p className="text-xl font-black text-orange-400">74%</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-orange-500/30 flex items-center justify-center text-orange-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Quick KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Tổng Quy Mô Nhân Sự</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalHeadcount} Người</p>
            <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12% so với quý trước
            </p>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Quỹ Lương Kỳ Này</p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {(totalPayroll / 1_000_000).toFixed(1)} Tr đ
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Formula Platform tự động</p>
          </div>
          <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Đơn Chờ Phê Duyệt</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{pendingRequests} Đơn</p>
            <p className="text-[11px] text-amber-700 font-medium mt-1">Cần quản lý duyệt</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Hiệu Suất Trung Bình</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{avgEfficiency}%</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Đạt chuẩn kỳ đánh giá</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payroll Trend Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Biến Động Quỹ Lương Doanh Nghiệp (6 Tháng Gần Nhất)</h3>
              <p className="text-xs text-slate-500">Tự động đối soát chi phí lương & thưởng KPI</p>
            </div>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
              VND (Triệu đồng)
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payrollTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(val) => `${val / 1_000_000}M`}
                />
                <Tooltip
                  formatter={(val: any) => [`${(Number(val) / 1_000_000).toFixed(1)} Triệu VNĐ`, 'Quỹ lương']}
                />
                <Bar dataKey="total" fill="#ea580c" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Headcount by Dept Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Cơ Cấu Nhân Sự Theo Khối</h3>
            <p className="text-xs text-slate-500">Tỷ trọng định biên phòng ban</p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [`${val} Nhân sự`, 'Quy mô']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {deptData.map((d, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-600 font-medium">{d.name}</span>
                </div>
                <span className="font-bold text-slate-900">{d.value} người</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
