'use client';

import React, { useState } from 'react';
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
  Download,
  FileSpreadsheet,
  GraduationCap,
  UserPlus,
  ShieldAlert,
  PieChart as PieIcon,
  BarChart3,
  Filter,
  Check,
  ChevronRight,
  TrendingDown,
  Building2,
  TreePine,
  AlertTriangle,
  Scale
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
  Legend,
} from 'recharts';
import {
  exportToExcel,
  exportSureHCS_NhanSuTongHop,
  exportSureHCS_DonTuVaNoiQuy,
  exportSureHCS_QuyLuong,
  exportSureHCS_BienDongNhanSu,
} from '@/lib/exportEngine';

export const DashboardModule: React.FC = () => {
  const {
    employees,
    payslips,
    plantations,
    requests,
    trainingCourses,
    complianceData,
    hrGeneralData,
    recruitmentReportData,
    incomePayrollData,
  } = useHRM();

  const [activeReportTab, setActiveReportTab] = useState<'HR_GENERAL' | 'TRAINING' | 'RECRUITMENT' | 'INCOME' | 'COMPLIANCE'>('HR_GENERAL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // -------------------------------------------------------------
  // EXPORT SUREHCS EXCEL TEMPLATES
  // -------------------------------------------------------------

  const handleExportSureHCSExcel = () => {
    if (activeReportTab === 'HR_GENERAL') {
      exportSureHCS_NhanSuTongHop(employees);
    } else if (activeReportTab === 'TRAINING') {
      const headers = ['Mã Khóa', 'Tên Khóa Đào Tạo', 'Chủ Đề', 'Hình Thức', 'Học Viên', 'Tổng Chi Phí (VNĐ)', 'Chi Phí/Người (VNĐ)', 'Điểm Đánh Giá', 'Độ Áp Dụng'];
      const rows = trainingCourses.map((c) => [
        c.code,
        c.title,
        c.topic,
        c.method,
        c.participantsCount,
        c.totalCost,
        c.costPerParticipant,
        `${c.feedbackScore}/5.0 (${c.examPassRate}% Đỗ)`,
        c.applicationLevel,
      ]);
      exportToExcel(
        'BÁO CÁO TÌNH HÌNH ĐÀO TẠO NHÂN LỰC NÔNG TRƯỜNG & DOANH NGHIỆP (SUREHCS)',
        'SureHCS_Bao_Cao_Dao_Tao',
        headers,
        rows,
        {
          'Tổng số khóa': trainingCourses.length,
          'Tổng học viên': trainingCourses.reduce((a, b) => a + b.participantsCount, 0),
          'Tổng chi phí đào tạo': `${(trainingCourses.reduce((a, b) => a + b.totalCost, 0)).toLocaleString('vi-VN')} đ`,
        }
      );
    } else if (activeReportTab === 'RECRUITMENT') {
      const headers = ['Vị Trí / Phòng Ban Cần Tuyển', 'Chỉ Tiêu', 'Đã Tuyển', 'Tỷ Lệ Đạt (%)', 'Chi Phí Tuyển Dụng (VNĐ)'];
      const rows = recruitmentReportData.byDepartmentNeeds.map((r) => [r.dept, r.target, r.hired, r.rate, 1500000 * r.hired]);
      exportToExcel(
        'BÁO CÁO HIỆU QUẢ TUYỂN DỤNG & PHỄU CHUYỂN ĐỔI ỨNG VIÊN (SUREHCS)',
        'SureHCS_Bao_Cao_Tuyen_Dung',
        headers,
        rows,
        {
          'Chỉ tiêu tuyển': `${recruitmentReportData.totalTarget} người`,
          'Đã tuyển dụng': `${recruitmentReportData.totalHired} người (${recruitmentReportData.hiringRate}%)`,
          'Thời gian tuyển TB': `${recruitmentReportData.avgTimeToHireDays} ngày`,
        }
      );
    } else if (activeReportTab === 'INCOME') {
      exportSureHCS_QuyLuong(payslips, incomePayrollData.totalPayrollMonth);
    } else if (activeReportTab === 'COMPLIANCE') {
      exportSureHCS_DonTuVaNoiQuy(requests);
    }
    showToast('✓ Đã xuất bảng Báo cáo Excel chuẩn SureHCS thành công!');
  };

  const incompleteProfilesCount = employees.filter((e) => e.isProfileComplete === false).length;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-500 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner with Excel Export Only */}
      <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950 rounded-2xl text-white shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-orange-500 text-white font-bold text-[11px] uppercase tracking-wider">
              1HRM BI Analytics
            </span>
            <span className="text-slate-400 text-xs font-mono">Báo Cáo Tổng Hợp Chuẩn SureHCS</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight mt-2 text-white">
            Trung Tâm Báo Cáo Nhân Sự & Nông Trường
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Hệ thống tự động đồng bộ và kết xuất bảng dữ liệu Excel định dạng chuẩn SureHCS: Nhân sự tổng hợp, Đơn từ phát sinh, Quỹ lương và Biến động 12 tháng.
          </p>
        </div>

        {/* Pure Excel Export Button Group */}
        <div className="flex flex-wrap items-center gap-2 bg-white/10 p-2.5 rounded-2xl border border-white/10 backdrop-blur-xs">
          <button
            onClick={handleExportSureHCSExcel}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            title="Xuất bảng Excel chuẩn mẫu SureHCS"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Xuất Báo Cáo Excel (Chuẩn SureHCS)</span>
          </button>

          <button
            onClick={() => {
              exportSureHCS_BienDongNhanSu(hrGeneralData);
              showToast('✓ Đã xuất Báo cáo Biến động nhân sự 12 tháng (SureHCS)!');
            }}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <span>Xuất Biến Động 12T (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Profile Incomplete Warning Banner on Dashboard */}
      {incompleteProfilesCount > 0 && (
        <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-300 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-700 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-amber-950 text-sm">
                Cảnh Báo Quản Trị: Có {incompleteProfilesCount} nhân sự chưa hoàn thiện đủ hồ sơ Onboarding
              </p>
              <p className="text-amber-800 mt-0.5">
                Các giấy tờ cần bổ sung: Bản sao CCCD công chứng, Giấy khám sức khỏe và Sổ BHXH gốc.
              </p>
            </div>
          </div>
          <button
            onClick={() => exportSureHCS_NhanSuTongHop(employees)}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs shrink-0"
          >
            Xuất DS Cần Bổ Sung Excel
          </button>
        </div>
      )}

      {/* 5-Suite Tab Selector */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          <button
            onClick={() => setActiveReportTab('HR_GENERAL')}
            className={`p-3.5 rounded-xl text-left transition-all border flex flex-col justify-between gap-1.5 ${
              activeReportTab === 'HR_GENERAL'
                ? 'bg-orange-50 border-orange-500 text-orange-950 ring-2 ring-orange-500/20 shadow-xs'
                : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
                <Users className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">Bộ 1</span>
            </div>
            <div>
              <p className="text-xs font-black">1. Tổng Quan Nhân Sự</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Quy mô, cơ cấu, biến động & dự báo</p>
            </div>
          </button>

          <button
            onClick={() => setActiveReportTab('TRAINING')}
            className={`p-3.5 rounded-xl text-left transition-all border flex flex-col justify-between gap-1.5 ${
              activeReportTab === 'TRAINING'
                ? 'bg-blue-50 border-blue-500 text-blue-950 ring-2 ring-blue-500/20 shadow-xs'
                : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                <GraduationCap className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">Bộ 2</span>
            </div>
            <div>
              <p className="text-xs font-black">2. Đào Tạo Nhân Sự</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Khóa học, học viên, chi phí & hiệu quả</p>
            </div>
          </button>

          <button
            onClick={() => setActiveReportTab('RECRUITMENT')}
            className={`p-3.5 rounded-xl text-left transition-all border flex flex-col justify-between gap-1.5 ${
              activeReportTab === 'RECRUITMENT'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600">
                <UserPlus className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">Bộ 3</span>
            </div>
            <div>
              <p className="text-xs font-black">3. Hiệu Quả Tuyển Dụng</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Phễu ứng viên, chi phí, time-to-hire</p>
            </div>
          </button>

          <button
            onClick={() => setActiveReportTab('INCOME')}
            className={`p-3.5 rounded-xl text-left transition-all border flex flex-col justify-between gap-1.5 ${
              activeReportTab === 'INCOME'
                ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-500/20 shadow-xs'
                : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-600">
                <DollarSign className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">Bộ 4</span>
            </div>
            <div>
              <p className="text-xs font-black">4. Thu Nhập & Quỹ Lương</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Cơ cấu lương, BHXH, Thuế Luật 109</p>
            </div>
          </button>

          <button
            onClick={() => setActiveReportTab('COMPLIANCE')}
            className={`p-3.5 rounded-xl text-left transition-all border flex flex-col justify-between gap-1.5 ${
              activeReportTab === 'COMPLIANCE'
                ? 'bg-purple-50 border-purple-500 text-purple-950 ring-2 ring-purple-500/20 shadow-xs'
                : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-purple-100 text-purple-600">
                <ShieldAlert className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">Bộ 5</span>
            </div>
            <div>
              <p className="text-xs font-black">5. Tuân Thủ & Đơn Từ</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Đơn phát sinh, đúng giờ, kỷ luật</p>
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BỘ 1: BÁO CÁO TỔNG QUAN TÌNH HÌNH NHÂN SỰ */}
      {/* ========================================================================= */}
      {activeReportTab === 'HR_GENERAL' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">Tổng Quy Mô Toàn Hệ Thống</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{hrGeneralData.totalHeadcount} CBNV</p>
              <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +42 tuyển mới trong kỳ
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">Tỷ Lệ Duy Trì Nhân Sự</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">{hrGeneralData.retentionRate}%</p>
              <p className="text-[11px] text-slate-500 mt-1">Tỷ lệ nghỉ việc (Turnover): <b>{hrGeneralData.turnoverRate}%</b></p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">Biến Động: Thăng Chức / Điều Chuyển</p>
              <p className="text-2xl font-black text-blue-600 mt-1">23 Nhân Sự</p>
              <p className="text-[11px] text-blue-700 mt-1">9 thăng chức, 14 điều chuyển lô</p>
            </div>

            <div className="p-5 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-2xl border border-orange-200 shadow-xs">
              <p className="text-xs font-semibold text-orange-950">Dự Báo Nhu Cầu Nhân Sự Q4</p>
              <p className="text-2xl font-black text-orange-600 mt-1">+65 Công Nhân</p>
              <p className="text-[11px] text-orange-900 mt-1 font-medium">Cao điểm thu hoạch mủ Q4</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900">Phân Bổ Nhân Lực Theo Đơn Vị & Nông Trường</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hrGeneralData.byDepartment} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" fontSize={11} stroke="#94a3b8" />
                    <YAxis dataKey="name" type="category" width={160} fontSize={11} stroke="#64748b" />
                    <Tooltip
                      formatter={(val: any) => [`${val} người`, 'Quân số']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="count" fill="#ea580c" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900">Cơ Cấu Độ Tuổi Lực Lượng Lao Động</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={hrGeneralData.byAge}
                      dataKey="count"
                      nameKey="range"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {hrGeneralData.byAge.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BỘ 2: BÁO CÁO TÌNH HÌNH ĐÀO TẠO NHÂN SỰ */}
      {/* ========================================================================= */}
      {activeReportTab === 'TRAINING' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">Khóa Đào Tạo Đã Triển Khai</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{trainingCourses.length} Khóa Học</p>
              <p className="text-[11px] text-blue-600 font-medium mt-1">100% đạt chuẩn chỉ tiêu kế hoạch</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">Tổng Lượt Học Viên Tham Gia</p>
              <p className="text-2xl font-black text-blue-600 mt-1">
                {trainingCourses.reduce((a, b) => a + b.participantsCount, 0)} Lượt
              </p>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">Tỷ lệ đỗ sát hạch trung bình: 97%</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">Tổng Chi Phí Đào Tạo</p>
              <p className="text-2xl font-black text-orange-600 mt-1">
                {(trainingCourses.reduce((a, b) => a + b.totalCost, 0)).toLocaleString('vi-VN')} đ
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Chi phí TB: 486.000 đ/học viên</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-900">Danh Sách Các Khóa Đào Tạo Nghiệp Vụ</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                    <th className="py-3 px-4">Khóa Đào Tạo</th>
                    <th className="py-3 px-3">Hình Thức</th>
                    <th className="py-3 px-3">Thời Gian</th>
                    <th className="py-3 px-3 text-right">Số Học Viên</th>
                    <th className="py-3 px-3 text-right">Tổng Chi Phí</th>
                    <th className="py-3 px-3 text-center">Đánh Giá (Điểm / Đỗ)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {trainingCourses.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{c.title}</td>
                      <td className="py-3 px-3 text-blue-700 font-semibold">{c.method}</td>
                      <td className="py-3 px-3 font-mono text-slate-600">{c.startDate} ({c.durationHours}h)</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900">{c.participantsCount} người</td>
                      <td className="py-3 px-3 text-right font-bold text-orange-600">{c.totalCost.toLocaleString('vi-VN')} đ</td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-600">{c.feedbackScore}/5.0 ({c.examPassRate}% Đạt)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BỘ 3: BÁO CÁO HIỆU QUẢ TUYỂN DỤNG */}
      {/* ========================================================================= */}
      {activeReportTab === 'RECRUITMENT' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">Chỉ Tiêu Tuyển Dụng</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{recruitmentReportData.totalTarget} Chỉ Tiêu</p>
              <p className="text-[11px] text-slate-500 mt-1">Đã tuyển: <b>{recruitmentReportData.totalHired} người</b> ({recruitmentReportData.hiringRate}%)</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">Thời Gian Tuyển TB</p>
              <p className="text-2xl font-black text-blue-600 mt-1">{recruitmentReportData.avgTimeToHireDays} Ngày</p>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">Tối ưu chi phí nguồn ứng viên</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">Chi Phí / Ứng Viên</p>
              <p className="text-2xl font-black text-orange-600 mt-1">
                {recruitmentReportData.costPerHiredCandidate.toLocaleString('vi-VN')} đ
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Nguồn nội bộ chiếm 58.3%</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
            <h3 className="text-sm font-black text-slate-900">Phễu Chuyển Đổi Tuyển Dụng Qua 5 Vòng</h3>
            <div className="space-y-2">
              {recruitmentReportData.conversionFunnel.map((f, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-800">{f.stage}</span>
                    <span className="font-black text-orange-600">{f.count} ứng viên</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all"
                      style={{ width: `${(f.count / recruitmentReportData.conversionFunnel[0].count) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BỘ 4: BÁO CÁO THU NHẬP NHÂN SỰ & QUỸ LƯƠNG */}
      {/* ========================================================================= */}
      {activeReportTab === 'INCOME' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">Tổng Quỹ Lương Kỳ Này</p>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {(incomePayrollData.totalPayrollMonth / 1000000000).toFixed(2)} Tỷ VNĐ
              </p>
              <p className="text-[11px] text-emerald-600 font-medium mt-1">+{incomePayrollData.growthComparedToLastMonth}% so với tháng trước</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">Thu Nhập Bình Quân</p>
              <p className="text-2xl font-black text-blue-600 mt-1">
                {(incomePayrollData.avgIncomePerWorker).toLocaleString('vi-VN')} đ
              </p>
              <p className="text-[11px] text-blue-700 mt-1">Lương cứng & thưởng mủ</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">BHXH Trích Nộp (10.5%)</p>
              <p className="text-2xl font-black text-purple-600 mt-1">
                {(incomePayrollData.deductions.totalSocialInsurance / 1000000).toFixed(1)} Triệu đ
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">Thuế TNCN (Luật 109/2025)</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {(incomePayrollData.deductions.totalPitTaxNewLaw / 1000000).toFixed(1)} Triệu đ
              </p>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">Giảm trừ 15.5M/người</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-black text-slate-900">Quỹ Lương & Năng Suất Thu Hoạch Mủ Các Nông Trường</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                    <th className="py-3 px-4">Nông Trường / Đơn Vị</th>
                    <th className="py-3 px-3 text-right">Quân Số</th>
                    <th className="py-3 px-3 text-right">Tổng Quỹ Lương</th>
                    <th className="py-3 px-3 text-right">Thu Nhập TB / Người</th>
                    <th className="py-3 px-3 text-right">Sản Lượng Mủ Thu Hoạch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {incomePayrollData.byPlantationComparison.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                      <td className="py-3 px-3 text-right text-slate-700">{p.workers} người</td>
                      <td className="py-3 px-3 text-right font-black text-slate-900">{p.payroll.toLocaleString('vi-VN')} đ</td>
                      <td className="py-3 px-3 text-right font-bold text-blue-600">{p.avgIncome.toLocaleString('vi-VN')} đ</td>
                      <td className="py-3 px-3 text-right font-bold text-orange-600">{p.latexTons > 0 ? `${p.latexTons} Tấn` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BỘ 5: BÁO CÁO TÌNH HÌNH TUÂN THỦ NỘI QUY & ĐƠN TỪ */}
      {/* ========================================================================= */}
      {activeReportTab === 'COMPLIANCE' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">Tỷ Lệ Đi Làm Đúng Giờ</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">{complianceData.onTimeRate}%</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">Tuân Thủ Chấm Công</p>
              <p className="text-2xl font-black text-blue-600 mt-1">{complianceData.attendanceComplianceRate}%</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">Tổng Đơn Phát Sinh</p>
              <p className="text-2xl font-black text-orange-600 mt-1">{requests.length} Đơn</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">Vi Phạm Kỷ Luật Đã Xử Lý</p>
              <p className="text-2xl font-black text-amber-600 mt-1">{complianceData.totalViolationsMonth} Vụ</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-900">Danh Sách Đơn Từ Phát Sinh Gần Nhất (Đi muộn, con ốm, OT...)</h3>
              <button
                onClick={() => exportSureHCS_DonTuVaNoiQuy(requests)}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Xuất Excel Đơn Từ
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                    <th className="py-3 px-4">Mã Đơn</th>
                    <th className="py-3 px-4">Nhân Sự</th>
                    <th className="py-3 px-3">Loại Đơn Phát Sinh</th>
                    <th className="py-3 px-3">Ngày Phát Sinh</th>
                    <th className="py-3 px-4">Chi Tiết / Lý Do</th>
                    <th className="py-3 px-3 text-center">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {requests.slice(0, 5).map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">{r.code}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{r.employeeName}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded font-semibold text-[11px] bg-slate-100 text-slate-800">
                          {r.typeName}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">{r.startDate}</td>
                      <td className="py-3 px-4 text-slate-600">
                        {r.specificDetails && <b className="text-blue-700 block">{r.specificDetails}</b>}
                        <span className="italic">{r.reason}</span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 text-[11px]">
                          {r.status === 'APPROVED' ? 'Đã duyệt' : 'Chờ duyệt'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
