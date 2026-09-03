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
  Filter,
  Check,
  ChevronRight,
  TrendingDown,
  Building2,
  TreePine,
  AlertTriangle,
  Scale,
  Baby,
  Activity,
  Calendar,
  Flame,
  FileText,
  Lock,
  Shield,
  BarChart3,
  Percent,
  CheckSquare
} from 'lucide-react';
import { useHRM } from '@/context/HRMContext';
import {
  exportToExcel,
  exportMultiSheetExcel,
  exportBaoCaoNhanSuTongHop,
  exportBaoCaoDonTuVaNoiQuy,
  exportBaoCaoQuyLuong,
  exportBaoCaoBienDongNhanSu,
} from '@/lib/exportEngine';

export const DashboardModule: React.FC = () => {
  const {
    currentRole,
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

  const [activeReportTab, setActiveReportTab] = useState<'HR_GENERAL' | 'COMPLIANCE' | 'INCOME' | 'TURNOVER' | 'RECRUITMENT_TRAINING'>('HR_GENERAL');
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // PHÂN QUYỀN BẢO MẬT: Chỉ Ban Giám Đốc (BGĐ) và Nhân Sự (HR) mới được xem mức lương
  const canViewSalary = ['ADMIN', 'EXECUTIVE_DIRECTOR', 'HR_MANAGER', 'HR_ADMIN'].includes(currentRole);

  // Bộ lọc theo từng Nông trường & Văn phòng cho HR
  const filteredEmployees = employees.filter((e) => {
    if (selectedUnitFilter === 'ALL') return true;
    return e.departmentName.includes(selectedUnitFilter) || e.departmentId === selectedUnitFilter;
  });

  const filteredPayslips = payslips.filter((p) => {
    if (selectedUnitFilter === 'ALL') return true;
    return p.departmentName.includes(selectedUnitFilter);
  });

  const filteredRequests = requests.filter((r) => {
    if (selectedUnitFilter === 'ALL') return true;
    return r.departmentName.includes(selectedUnitFilter);
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Export handlers
  const handleExportExcel = () => {
    if (activeReportTab === 'HR_GENERAL') {
      const sanitizedEmployees = filteredEmployees.map((e) => ({
        ...e,
        baseSalary: canViewSalary ? e.baseSalary : ('[BẢO MẬT]' as any),
        allowance: canViewSalary ? e.allowance : ('[BẢO MẬT]' as any),
      }));
      exportBaoCaoNhanSuTongHop(sanitizedEmployees);
    } else if (activeReportTab === 'COMPLIANCE') {
      exportBaoCaoDonTuVaNoiQuy(requests);
    } else if (activeReportTab === 'INCOME') {
      if (!canViewSalary) {
        showToast('⚠️ Bạn không có quyền xuất dữ liệu quỹ lương bảo mật!');
        return;
      }
      exportBaoCaoQuyLuong(payslips, incomePayrollData.totalPayrollMonth);
    } else if (activeReportTab === 'TURNOVER') {
      exportBaoCaoBienDongNhanSu(hrGeneralData);
    } else if (activeReportTab === 'RECRUITMENT_TRAINING') {
      const s1Headers = ['STT', 'Đơn Vị Có Nhu Cầu', 'Chỉ Tiêu Tuyển', 'Đã Tuyển Được', 'Tỷ Lệ Đạt (%)', 'Chi Phí Tuyển Dụng (VNĐ)', 'Kênh Tuyển Dụng Trọng Tâm'];
      const s1Rows = recruitmentReportData.byDepartmentNeeds.map((r, idx) => [
        idx + 1,
        r.dept,
        r.target,
        r.hired,
        r.rate,
        1500000 * r.hired,
        idx === 0 ? 'Giới thiệu nội bộ địa phương (62%)' : idx === 1 ? 'Ngày hội việc làm Tỉnh Bình Dương (45%)' : 'Mạng xã hội & Zalo tuyển dụng',
      ]);

      const s2Headers = ['STT', 'Mã Khóa', 'Tên Khóa Đào Tạo', 'Hình Thức Đào Tạo', 'Số Lượng Học Viên', 'Tổng Chi Phí (VNĐ)', 'Điểm Đánh Giá Sát Hạch', 'Mức Độ Áp Dụng Thực Tế'];
      const s2Rows = trainingCourses.map((c, idx) => [
        idx + 1,
        c.code,
        c.title,
        c.method,
        c.participantsCount,
        c.totalCost,
        `${c.feedbackScore}/5.0 (Đỗ ${c.examPassRate}%)`,
        c.applicationLevel,
      ]);

      exportMultiSheetExcel('Bao_Cao_Dao_Tao_Va_Tuyen_Dung_2Sheets', [
        {
          sheetName: 'Kế hoạch & Phễu tuyển dụng',
          title: 'BÁO CÁO KẾ HOẠCH TUYỂN DỤNG & PHỄU CHUYỂN ĐỔI 5 VÒNG',
          headers: s1Headers,
          rows: s1Rows,
          summaryStats: { 'Chỉ tiêu toàn công ty': `${recruitmentReportData.totalTarget} người`, 'Đã tuyển': `${recruitmentReportData.totalHired} người` },
        },
        {
          sheetName: 'Các khóa đào tạo nghiệp vụ',
          title: 'BÁO CÁO CÁC KHÓA ĐÀO TẠO NGHIỆP VỤ & ĐÁNH GIÁ ỨNG DỤNG',
          headers: s2Headers,
          rows: s2Rows,
          summaryStats: { 'Tổng khóa học': trainingCourses.length, 'Tổng học viên': trainingCourses.reduce((a, b) => a + b.participantsCount, 0) },
        },
      ]);
    }
    showToast('✓ Đã xuất file Báo cáo Excel thành công!');
  };

  const incompleteProfilesCount = employees.filter((e) => e.isProfileComplete === false).length;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-lg shadow-xl border border-[#047857] flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Area: Clean Minimalist Card */}
      <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#ECFDF5] text-[#047857] font-semibold text-[11px] uppercase tracking-wider">
              1HRM Enterprise
            </span>
            <span className="text-slate-400 text-xs font-mono">Báo Cáo Phân Tích & Dashboard BI 360°</span>
            {!canViewSalary && (
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold text-[11px] border border-amber-200 flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-600" /> Chế độ bảo mật lương
              </span>
            )}
          </div>
          <h1 className="page-title mt-1.5">
            Trung Tâm Báo Cáo Phân Tích Nhân Sự & Nông Trường
          </h1>
          <p className="text-[14px] text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Hệ thống dữ liệu bảng biểu chuẩn hóa: Nhân sự tổng hợp, Cơ cấu lao động, Đi muộn về sớm, Con ốm, Quỹ lương và Biến động 12 tháng.
          </p>
        </div>

        {/* Action Button: Primary Emerald */}
        <button
          onClick={handleExportExcel}
          className="btn-primary shrink-0"
          title="Xuất bảng Excel"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Xuất Báo Cáo Excel (.xlsx)</span>
        </button>
      </div>

      {/* 2. Executive KPI Cards: Minimalist Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs space-y-2 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="caption-meta uppercase tracking-wider">Tổng Quân Số Toàn Công Ty</span>
            <span className="p-1.5 rounded-lg bg-[#ECFDF5] text-[#047857]">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <p className="kpi-metric">1.018</p>
          <p className="text-[12px] text-[#15803D] font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +2.4% so với tháng trước
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs space-y-2 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="caption-meta uppercase tracking-wider">Tỷ Lệ Đi Làm Đủ Hôm Nay</span>
            <span className="p-1.5 rounded-lg bg-[#F0FDF4] text-[#15803D]">
              <CalendarCheck className="w-4 h-4" />
            </span>
          </div>
          <p className="kpi-metric text-[#15803D]">97.6%</p>
          <p className="text-[12px] text-slate-500 font-medium">
            ✓ 994/1.018 CBNV có mặt đúng giờ
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs space-y-2 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="caption-meta uppercase tracking-wider">Sản Lượng Mủ Ngày (3 NT)</span>
            <span className="p-1.5 rounded-lg bg-[#ECFDF5] text-[#047857]">
              <TreePine className="w-4 h-4" />
            </span>
          </div>
          <p className="kpi-metric">42.8 <span className="text-sm font-normal text-slate-400">Tấn</span></p>
          <p className="text-[12px] text-[#047857] font-medium">
            ✓ Đạt 104.2% chỉ tiêu kế hoạch
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs space-y-2 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="caption-meta uppercase tracking-wider">Tổng Quỹ Lương Thực Chi</span>
            <span className="p-1.5 rounded-lg bg-[#FFFBEB] text-[#B45309]">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <p className="kpi-metric font-mono">
            {canViewSalary ? '11.25' : '******'} <span className="text-sm font-normal text-slate-400">Tỷ đ</span>
          </p>
          <p className="text-[12px] text-slate-500 font-medium">
            {canViewSalary ? 'Áp dụng Luật 109 Giảm trừ 15.5M' : '🔒 Chỉ BGĐ & HR được xem'}
          </p>
        </div>
      </div>

      {/* 3. Incomplete Profile Alert (If any) */}
      {incompleteProfilesCount > 0 && (
        <div className="p-4 bg-[#FFFBEB] rounded-xl border border-[#FDE68A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FEF3C7] flex items-center justify-center text-[#B45309] shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-[#0F172A] text-sm">
                Cảnh Báo Hồ Sơ: Có {incompleteProfilesCount} nhân sự mới Onboard chưa hoàn tất đủ giấy tờ
              </p>
              <p className="text-[#B45309] mt-0.5">
                Các giấy tờ cần bổ sung: Bản sao CCCD 2 mặt công chứng, Giấy khám sức khỏe định kỳ và Sổ BHXH gốc.
              </p>
            </div>
          </div>
          <button
            onClick={() => exportBaoCaoNhanSuTongHop(employees)}
            className="btn-secondary text-xs py-1.5 px-3 shrink-0"
          >
            Xuất DS Cần Bổ Sung Excel
          </button>
        </div>
      )}

      {/* 4. Scope Filter Bar (Segmented Control) */}
      <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#047857] shrink-0" />
          <span className="font-semibold text-[#0F172A]">Phạm Vi Báo Cáo:</span>
          <span className="text-slate-400 hidden sm:inline">• Lọc theo Nông trường hoặc Văn phòng</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'ALL', label: 'Toàn Công Ty' },
            { id: 'Nông Trường 1', label: 'Nông Trường 1' },
            { id: 'Nông Trường 2', label: 'Nông Trường 2' },
            { id: 'Nông Trường 3', label: 'Nông Trường 3' },
            { id: 'Khối Văn Phòng', label: 'Khối Văn Phòng' },
            { id: 'Hành Chính', label: 'Phòng HCTH' },
          ].map((unit) => (
            <button
              key={unit.id}
              onClick={() => setSelectedUnitFilter(unit.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all text-xs cursor-pointer ${
                selectedUnitFilter === unit.id
                  ? 'bg-[#ECFDF5] text-[#047857] font-semibold border border-[#BBF7D0] shadow-2xs'
                  : 'bg-slate-100/70 text-slate-600 hover:bg-slate-100 hover:text-[#0F172A]'
              }`}
            >
              {unit.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Minimalist Tab Navigation for 5 Report Suites */}
      <div className="bg-white p-2 rounded-xl border border-[#E2E8F0] shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {[
            { id: 'HR_GENERAL', label: '1. Nhân Sự Tổng Hợp', desc: 'Quy mô, cơ cấu tuổi, giới tính', icon: Users },
            { id: 'COMPLIANCE', label: '2. Tuân Thủ & Đơn Từ', desc: 'Đi muộn, con ốm, công tác, OT', icon: ShieldAlert },
            { id: 'INCOME', label: '3. Tình Hình Quỹ Lương', desc: 'Cơ cấu lương, BHXH, Thuế 109', icon: DollarSign, isSecure: !canViewSalary },
            { id: 'TURNOVER', label: '4. Biến Động Nhân Sự', desc: 'Tuyển mới, nghỉ việc 12 tháng', icon: TrendingUp },
            { id: 'RECRUITMENT_TRAINING', label: '5. Tuyển Dụng & Đào Tạo', desc: 'Phễu ứng viên & khóa học', icon: UserPlus },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeReportTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveReportTab(tab.id as any)}
                className={`p-3.5 rounded-lg text-left transition-all border flex flex-col justify-between gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#ECFDF5] border-[#047857] text-[#047857] shadow-2xs'
                    : 'bg-[#F8FAFC]/70 border-transparent text-slate-700 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`p-1.5 rounded-lg ${isActive ? 'bg-[#047857] text-white' : 'bg-slate-200/70 text-slate-600'}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  {tab.isSecure && <Lock className="w-3 h-3 text-amber-600" />}
                </div>
                <div>
                  <p className={`text-xs font-semibold ${isActive ? 'text-[#047857]' : 'text-[#0F172A]'}`}>{tab.label}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{tab.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MẪU 1: BÁO CÁO NHÂN SỰ TỔNG HỢP & CƠ CẤU LAO ĐỘNG */}
      {/* ========================================================================= */}
      {activeReportTab === 'HR_GENERAL' && (
        <div className="space-y-6">
          {/* Bảng 1.1: Phân Bổ Nhân Lực Theo Đơn Vị */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
            <div className="h-10 px-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Bảng 1.1: Tổng Hợp Quy Mô Nhân Sự Theo Phòng Ban & Nông Trường
              </h3>
              <span className="badge-success">Tổng: {hrGeneralData.totalHeadcount} CBNV</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="data-table-header">
                    <th className="px-4 text-left">STT</th>
                    <th className="px-4 text-left">Đơn Vị / Phòng Ban / Nông Trường</th>
                    <th className="px-3 text-right">Số Lượng</th>
                    <th className="px-3 text-right">Tỷ Trọng</th>
                    <th className="px-4 text-left">Cán Bộ Phụ Trách</th>
                    <th className="px-4 text-left">Phạm Vi Quản Lý</th>
                  </tr>
                </thead>
                <tbody>
                  {hrGeneralData.byDepartment.map((d, idx) => (
                    <tr key={idx} className="data-table-row">
                      <td className="px-4 font-mono text-slate-400 text-xs">{idx + 1}</td>
                      <td className="px-4 font-medium text-[#0F172A] text-[14px]">{d.name}</td>
                      <td className="px-3 text-right font-bold text-[#0F172A] tabular-nums text-[14px]">{d.count} người</td>
                      <td className="px-3 text-right font-semibold text-[#047857] tabular-nums text-[14px]">{d.ratio}</td>
                      <td className="px-4 text-slate-700 text-[14px]">
                        {idx === 0 ? 'Nguyễn Văn Hùng (GĐ NT1)' : idx === 1 ? 'Vũ Quốc Toản (GĐ NT2)' : idx === 2 ? 'Trần Đình Trọng (GĐ NT3)' : 'Phạm Thùy Linh (Trưởng phòng HCTH)'}
                      </td>
                      <td className="px-4 text-slate-500 text-xs">
                        {idx === 0 ? '1.250 ha vườn cạo' : idx === 1 ? '1.450 ha vườn cạo' : idx === 2 ? '980 ha vườn cạo' : 'Văn phòng điều hành'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bảng 1.2: Cơ Cấu Độ Tuổi & Trình Độ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
              <div className="h-10 px-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Bảng 1.2A: Cơ Cấu Độ Tuổi Lao Động
                </h3>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="data-table-header">
                    <th className="px-4 text-left">Nhóm Độ Tuổi</th>
                    <th className="px-3 text-right">Số Lượng</th>
                    <th className="px-3 text-right">Tỷ Lệ</th>
                    <th className="px-4 text-left">Đặc Điểm Phân Bổ</th>
                  </tr>
                </thead>
                <tbody>
                  {hrGeneralData.byAge.map((a, idx) => (
                    <tr key={idx} className="data-table-row">
                      <td className="px-4 font-medium text-[#0F172A] text-[14px]">{a.range}</td>
                      <td className="px-3 text-right font-bold text-[#0F172A] tabular-nums text-[14px]">{a.count} người</td>
                      <td className="px-3 text-right font-semibold text-[#047857] tabular-nums text-[14px]">{a.percent}%</td>
                      <td className="px-4 text-slate-600 text-xs">
                        {idx === 1 ? 'Lực lượng cạo mủ nòng cốt' : idx === 0 ? 'Lao động trẻ mới tuyển' : idx === 2 ? 'Kinh nghiệm thâm niên cao' : 'Cán bộ kỹ thuật kỳ cựu'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
              <div className="h-10 px-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Bảng 1.2B: Cơ Cấu Trình Độ Học Vấn & Giới Tính
                </h3>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="data-table-header">
                    <th className="px-4 text-left">Trình Độ Học Vấn</th>
                    <th className="px-3 text-right">Số Lượng</th>
                    <th className="px-3 text-right">Tỷ Lệ</th>
                    <th className="px-4 text-left">Cơ Cấu Giới Tính</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="data-table-row">
                    <td className="px-4 font-medium text-[#0F172A] text-[14px]">Phổ Thông / Sơ Cấp (Công nhân)</td>
                    <td className="px-3 text-right font-bold text-[#0F172A] tabular-nums text-[14px]">768 người</td>
                    <td className="px-3 text-right font-semibold text-[#047857] tabular-nums text-[14px]">75.4%</td>
                    <td className="px-4 text-slate-600 text-xs">Nam: 58% | Nữ: 42%</td>
                  </tr>
                  <tr className="data-table-row">
                    <td className="px-4 font-medium text-[#0F172A] text-[14px]">Trung Cấp / Cao Đẳng Kỹ Thuật</td>
                    <td className="px-3 text-right font-bold text-[#0F172A] tabular-nums text-[14px]">142 người</td>
                    <td className="px-3 text-right font-semibold text-[#047857] tabular-nums text-[14px]">14.0%</td>
                    <td className="px-4 text-slate-600 text-xs">Nam: 65% | Nữ: 35%</td>
                  </tr>
                  <tr className="data-table-row">
                    <td className="px-4 font-medium text-[#0F172A] text-[14px]">Đại Học (Kỹ sư, Cử nhân)</td>
                    <td className="px-3 text-right font-bold text-[#0F172A] tabular-nums text-[14px]">96 người</td>
                    <td className="px-3 text-right font-semibold text-[#047857] tabular-nums text-[14px]">9.4%</td>
                    <td className="px-4 text-slate-600 text-xs">Nam: 50% | Nữ: 50%</td>
                  </tr>
                  <tr className="data-table-row">
                    <td className="px-4 font-medium text-[#0F172A] text-[14px]">Thạc Sĩ / Sau Đại Học (BGĐ)</td>
                    <td className="px-3 text-right font-bold text-[#0F172A] tabular-nums text-[14px]">12 người</td>
                    <td className="px-3 text-right font-semibold text-[#047857] tabular-nums text-[14px]">1.2%</td>
                    <td className="px-4 text-slate-600 text-xs">Nam: 75% | Nữ: 25%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bảng 1.3: Trích Lục Danh Sách Hồ Sơ Nhân Sự */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
            <div className="h-10 px-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex justify-between items-center">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Bảng 1.3: Danh Sách Hồ Sơ Nhân Sự & Tiến Độ Giấy Tờ Onboarding
              </h3>
              <button
                onClick={() => exportBaoCaoNhanSuTongHop(employees)}
                className="btn-secondary text-[12px] py-1 px-3"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#047857]" /> Xuất Toàn Bộ DS Excel
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="data-table-header">
                    <th className="px-4 text-left">Mã NV</th>
                    <th className="px-4 text-left">Họ Và Tên</th>
                    <th className="px-3 text-left">Phòng Ban / Nông Trường</th>
                    <th className="px-3 text-left">Chức Danh</th>
                    <th className="px-3 text-right">Lương Cơ Bản</th>
                    <th className="px-3 text-center">Tiến Độ Hồ Sơ</th>
                    <th className="px-4 text-left">Tình Trạng Giấy Tờ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((e) => (
                    <tr key={e.id} className="data-table-row">
                      <td className="px-4 font-mono text-xs font-medium text-slate-700">{e.code}</td>
                      <td className="px-4 font-medium text-[#0F172A] text-[14px]">{e.fullName}</td>
                      <td className="px-3 text-slate-700 text-[14px]">{e.departmentName}</td>
                      <td className="px-3 text-slate-900 text-[14px]">{e.positionTitle}</td>
                      <td className="px-3 text-right font-medium text-[14px] tabular-nums">
                        {canViewSalary ? (
                          <span className="text-[#0F172A]">{e.baseSalary.toLocaleString('vi-VN')} đ</span>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px] flex items-center justify-end gap-1">
                            <Lock className="w-3 h-3 text-amber-500" /> [Bảo mật]
                          </span>
                        )}
                      </td>
                      <td className="px-3 text-center">
                        <span className={e.isProfileComplete !== false ? 'badge-success' : 'badge-warning'}>
                          {e.profileCompleteness || 100}%
                        </span>
                      </td>
                      <td className="px-4 text-xs">
                        {e.isProfileComplete !== false ? (
                          <span className="text-[#047857] font-medium">✓ Đầy đủ giấy tờ</span>
                        ) : (
                          <span className="text-[#B45309] font-medium">
                            Thiếu: {e.missingDocuments?.join(', ')}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MẪU 2: BÁO CÁO TUÂN THỦ & ĐƠN TỪ PHÁT SINH */}
      {/* ========================================================================= */}
      {activeReportTab === 'COMPLIANCE' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
            <div className="h-10 px-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex justify-between items-center">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Bảng 2.1: Sổ Theo Dõi Đơn Từ Phát Sinh (Đi Muộn, Về Sớm, Con Ốm, Nghỉ Phép)
              </h3>
              <button
                onClick={() => exportBaoCaoDonTuVaNoiQuy(requests)}
                className="btn-secondary text-[12px] py-1 px-3"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#047857]" /> Xuất Excel Đơn Từ
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="data-table-header">
                    <th className="px-4 text-left">Mã Đơn</th>
                    <th className="px-4 text-left">Nhân Sự Tạo Đơn</th>
                    <th className="px-3 text-left">Đơn Vị</th>
                    <th className="px-3 text-left">Loại Đơn</th>
                    <th className="px-3 text-left">Thời Gian</th>
                    <th className="px-4 text-left">Chi Tiết Nghiệp Vụ</th>
                    <th className="px-3 text-left">Người Duyệt</th>
                    <th className="px-3 text-center">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((r) => (
                    <tr key={r.id} className="data-table-row">
                      <td className="px-4 font-mono text-xs font-medium text-slate-700">{r.code}</td>
                      <td className="px-4 font-medium text-[#0F172A] text-[14px]">{r.employeeName}</td>
                      <td className="px-3 text-slate-700 text-[14px]">{r.departmentName}</td>
                      <td className="px-3 text-[14px]">
                        <span className="badge-neutral">{r.typeName}</span>
                      </td>
                      <td className="px-3 font-mono text-xs text-slate-600">
                        {r.startDate} {r.durationDays > 0 ? `(${r.durationDays}N)` : `(${r.durationHours}h)`}
                      </td>
                      <td className="px-4 text-xs text-slate-700">
                        {r.specificDetails && <b className="text-[#047857] block mb-0.5">{r.specificDetails}</b>}
                        <span className="italic text-slate-500">{r.reason}</span>
                      </td>
                      <td className="px-3 text-slate-700 text-xs">{r.approverName || 'Chờ duyệt'}</td>
                      <td className="px-3 text-center">
                        <span className={r.status === 'APPROVED' ? 'badge-success' : 'badge-warning'}>
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

      {/* ========================================================================= */}
      {/* MẪU 3: BÁO CÁO TÌNH HÌNH QUỸ LƯƠNG NHÂN SỰ & THUẾ TNCN */}
      {/* ========================================================================= */}
      {activeReportTab === 'INCOME' && (
        <div className="space-y-6">
          {!canViewSalary ? (
            <div className="p-12 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-amber-50 text-[#B45309] flex items-center justify-center mx-auto border border-[#FDE68A]">
                <Lock className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-[#0F172A] text-base">Báo Cáo Quỹ Lương Thuộc Phạm Vi Bảo Mật Cấp Cao</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Chỉ thành viên <strong>Ban Tổng Giám Đốc (BGĐ)</strong> và <strong>Phòng Nhân Sự (HR/HCTH)</strong> mới được phân quyền truy cập thông tin bảng lương và thuế TNCN toàn công ty.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Bảng 3.1: Tổng Quan Quỹ Lương Theo Đơn Vị */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
                <div className="h-10 px-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex justify-between items-center">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Bảng 3.1: Tổng Quan Chi Trả Lương & Sản Lượng Mủ Thu Hoạch Toàn Hệ Thống
                  </h3>
                  <span className="badge-success">
                    Tổng quỹ: {(incomePayrollData.totalPayrollMonth / 1000000000).toFixed(2)} Tỷ VNĐ
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="data-table-header">
                        <th className="px-4 text-left">Nông Trường / Đơn Vị</th>
                        <th className="px-3 text-right">Quân Số</th>
                        <th className="px-3 text-right">Tổng Quỹ Lương (VNĐ)</th>
                        <th className="px-3 text-right">Thu Nhập Bình Quân</th>
                        <th className="px-3 text-right">Sản Lượng Mủ (Tấn)</th>
                        <th className="px-4 text-right">Đơn Giá Tiền Lương/Kg</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incomePayrollData.byPlantationComparison.map((p, idx) => (
                        <tr key={idx} className="data-table-row">
                          <td className="px-4 font-medium text-[#0F172A] text-[14px]">{p.name}</td>
                          <td className="px-3 text-right text-slate-700 text-[14px] tabular-nums">{p.workers} người</td>
                          <td className="px-3 text-right font-bold text-[#0F172A] text-[14px] tabular-nums">{p.payroll.toLocaleString('vi-VN')} đ</td>
                          <td className="px-3 text-right font-semibold text-[#0369A1] text-[14px] tabular-nums">{p.avgIncome.toLocaleString('vi-VN')} đ</td>
                          <td className="px-3 text-right font-bold text-[#047857] text-[14px] tabular-nums">{p.latexTons > 0 ? `${p.latexTons} Tấn` : '-'}</td>
                          <td className="px-4 text-right font-mono text-slate-600 text-xs">{p.latexTons > 0 ? '8.570 đ/kg' : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bảng 3.2: Bảng Thanh Toán Lương Chi Tiết */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
                <div className="h-10 px-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex justify-between items-center">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Bảng 3.2: Bảng Thanh Toán Lương & Khấu Trừ Thuế TNCN (Luật 109/2025/QH15)
                  </h3>
                  <button
                    onClick={() => exportBaoCaoQuyLuong(payslips, incomePayrollData.totalPayrollMonth)}
                    className="btn-secondary text-[12px] py-1 px-3"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#047857]" /> Xuất Bảng Lương Excel
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="data-table-header">
                        <th className="px-4 text-left">Mã NV</th>
                        <th className="px-4 text-left">Họ Và Tên</th>
                        <th className="px-3 text-left">Phòng Ban</th>
                        <th className="px-3 text-right">Lương Cơ Bản</th>
                        <th className="px-3 text-right">Phụ Cấp</th>
                        <th className="px-3 text-right">Thưởng KPI/Mủ</th>
                        <th className="px-3 text-right">Tổng Thu Nhập</th>
                        <th className="px-3 text-right">BHXH (10.5%)</th>
                        <th className="px-3 text-right">Thuế TNCN (Luật 109)</th>
                        <th className="px-3 text-right">Thực Lĩnh (NET)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayslips.map((p) => (
                        <tr key={p.id} className="data-table-row">
                          <td className="px-4 font-mono text-xs font-medium text-slate-700">{p.employeeCode}</td>
                          <td className="px-4 font-medium text-[#0F172A] text-[14px]">{p.employeeName}</td>
                          <td className="px-3 text-slate-700 text-[14px]">{p.departmentName}</td>
                          <td className="px-3 text-right text-slate-800 text-[14px] tabular-nums">{p.baseSalary.toLocaleString('vi-VN')} đ</td>
                          <td className="px-3 text-right text-slate-800 text-[14px] tabular-nums">{(p.lunchAllowance + p.positionAllowance).toLocaleString('vi-VN')} đ</td>
                          <td className="px-3 text-right font-semibold text-[#047857] text-[14px] tabular-nums">{(p.kpiBonus + p.commission).toLocaleString('vi-VN')} đ</td>
                          <td className="px-3 text-right font-bold text-[#0F172A] text-[14px] tabular-nums">{p.totalIncome.toLocaleString('vi-VN')} đ</td>
                          <td className="px-3 text-right font-semibold text-[#B91C1C] text-[14px] tabular-nums">-{p.totalInsurance.toLocaleString('vi-VN')} đ</td>
                          <td className="px-3 text-right font-semibold text-[#B45309] text-[14px] tabular-nums">-{p.pitTax.toLocaleString('vi-VN')} đ</td>
                          <td className="px-3 text-right font-bold text-[#047857] text-[14px] tabular-nums">{p.netSalary.toLocaleString('vi-VN')} đ</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MẪU 4: BÁO CÁO BIẾN ĐỘNG NHÂN SỰ 12 THÁNG */}
      {/* ========================================================================= */}
      {activeReportTab === 'TURNOVER' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
            <div className="h-10 px-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex justify-between items-center">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Bảng 4.1: Ma Trận Biến Động Nhân Sự 12 Tháng Năm 2026
              </h3>
              <button
                onClick={() => exportBaoCaoBienDongNhanSu(hrGeneralData)}
                className="btn-secondary text-[12px] py-1 px-3"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#047857]" /> Xuất Biến Động 12T Excel
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="data-table-header">
                    <th className="px-4 text-left">Chỉ Tiêu Biến Động</th>
                    <th className="px-2 text-center">T1</th>
                    <th className="px-2 text-center">T2</th>
                    <th className="px-2 text-center">T3</th>
                    <th className="px-2 text-center">T4</th>
                    <th className="px-2 text-center">T5</th>
                    <th className="px-2 text-center">T6</th>
                    <th className="px-2 text-center">T7</th>
                    <th className="px-2 text-center bg-[#ECFDF5] text-[#047857] font-bold">T8 (Hiện tại)</th>
                    <th className="px-2 text-center text-slate-400">T9</th>
                    <th className="px-2 text-center text-slate-400">T10</th>
                    <th className="px-2 text-center text-slate-400">T11</th>
                    <th className="px-2 text-center text-slate-400">T12</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="data-table-row">
                    <td className="px-4 font-medium text-[#0F172A] text-[14px]">1. Dư đầu tháng</td>
                    {[940, 952, 965, 980, 992, 1005, 998, 1018, 1042, 1065, 1070, 1075].map((v, i) => (
                      <td key={i} className={`px-2 text-center font-mono text-xs ${i === 7 ? 'bg-[#ECFDF5] font-bold text-[#047857]' : 'text-slate-700'}`}>{v}</td>
                    ))}
                  </tr>
                  <tr className="data-table-row">
                    <td className="px-4 font-medium text-[#15803D] text-[14px]">2. Tuyển mới trong tháng</td>
                    {[24, 28, 32, 25, 30, 18, 38, 42, 35, 20, 15, 12].map((v, i) => (
                      <td key={i} className={`px-2 text-center font-mono text-xs font-semibold text-[#15803D] ${i === 7 ? 'bg-[#ECFDF5]' : ''}`}>+{v}</td>
                    ))}
                  </tr>
                  <tr className="data-table-row">
                    <td className="px-4 font-medium text-[#B91C1C] text-[14px]">3. Thôi việc / nghỉ việc</td>
                    {[12, 15, 17, 13, 17, 25, 18, 18, 12, 15, 10, 8].map((v, i) => (
                      <td key={i} className={`px-2 text-center font-mono text-xs font-semibold text-[#B91C1C] ${i === 7 ? 'bg-[#ECFDF5]' : ''}`}>-{v}</td>
                    ))}
                  </tr>
                  <tr className="data-table-row">
                    <td className="px-4 font-medium text-[#0369A1] text-[14px]">4. Điều chuyển nội bộ</td>
                    {[8, 10, 12, 9, 14, 11, 15, 14, 10, 8, 6, 5].map((v, i) => (
                      <td key={i} className={`px-2 text-center font-mono text-xs text-[#0369A1] ${i === 7 ? 'bg-[#ECFDF5]' : ''}`}>{v}</td>
                    ))}
                  </tr>
                  <tr className="data-table-row">
                    <td className="px-4 font-medium text-purple-700 text-[14px]">5. Thăng chức / bổ nhiệm</td>
                    {[3, 5, 4, 6, 5, 4, 8, 9, 6, 5, 4, 4].map((v, i) => (
                      <td key={i} className={`px-2 text-center font-mono text-xs text-purple-700 ${i === 7 ? 'bg-[#ECFDF5]' : ''}`}>{v}</td>
                    ))}
                  </tr>
                  <tr className="h-12 bg-[#F8FAFC] font-semibold text-[#0F172A] border-t border-[#E2E8F0]">
                    <td className="px-4 text-[14px]">6. Dư cuối tháng</td>
                    {[952, 965, 980, 992, 1005, 998, 1018, 1042, 1065, 1070, 1075, 1079].map((v, i) => (
                      <td key={i} className={`px-2 text-center font-mono text-xs font-bold ${i === 7 ? 'bg-[#ECFDF5] text-[#047857]' : ''}`}>{v}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MẪU 5: BÁO CÁO HIỆU QUẢ TUYỂN DỤNG & ĐÀO TẠO */}
      {/* ========================================================================= */}
      {activeReportTab === 'RECRUITMENT_TRAINING' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
            <div className="h-10 px-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Bảng 5.1: Báo Cáo Kế Hoạch Tuyển Dụng & Nguồn Tuyển Dụng Trọng Tâm
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="data-table-header">
                    <th className="px-4 text-left">Đơn Vị Có Nhu Cầu</th>
                    <th className="px-3 text-right">Chỉ Tiêu</th>
                    <th className="px-3 text-right">Đã Tuyển</th>
                    <th className="px-3 text-right">Tỷ Lệ Đạt</th>
                    <th className="px-4 text-left">Nguồn Tuyển Hiệu Quả Nhất</th>
                  </tr>
                </thead>
                <tbody>
                  {recruitmentReportData.byDepartmentNeeds.map((r, idx) => (
                    <tr key={idx} className="data-table-row">
                      <td className="px-4 font-medium text-[#0F172A] text-[14px]">{r.dept}</td>
                      <td className="px-3 text-right text-slate-700 text-[14px] tabular-nums">{r.target} người</td>
                      <td className="px-3 text-right font-bold text-[#15803D] text-[14px] tabular-nums">{r.hired} người</td>
                      <td className="px-3 text-right font-semibold text-[#047857] text-[14px] tabular-nums">{r.rate}</td>
                      <td className="px-4 text-slate-700 text-xs">
                        {idx === 0 ? 'Giới thiệu nội bộ địa phương (62%)' : idx === 1 ? 'Ngày hội việc làm Tỉnh Bình Dương (45%)' : 'Mạng xã hội & Zalo'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
            <div className="h-10 px-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Bảng 5.2: Báo Cáo Đào Tạo & Đánh Giá Mức Độ Ứng Dụng Sau Đào Tạo
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="data-table-header">
                    <th className="px-4 text-left">Mã Khóa</th>
                    <th className="px-4 text-left">Tên Khóa Đào Tạo</th>
                    <th className="px-3 text-left">Hình Thức</th>
                    <th className="px-3 text-right">Số Học Viên</th>
                    <th className="px-3 text-right">Tổng Chi Phí</th>
                    <th className="px-3 text-center">Điểm Đánh Giá</th>
                    <th className="px-4 text-left">Mức Độ Áp Dụng Thực Tế</th>
                  </tr>
                </thead>
                <tbody>
                  {trainingCourses.map((c) => (
                    <tr key={c.id} className="data-table-row">
                      <td className="px-4 font-mono text-xs font-medium text-slate-700">{c.code}</td>
                      <td className="px-4 font-medium text-[#0F172A] text-[14px]">{c.title}</td>
                      <td className="px-3 text-xs font-medium text-[#0369A1]">{c.method}</td>
                      <td className="px-3 text-right font-bold text-[#0F172A] text-[14px] tabular-nums">{c.participantsCount} người</td>
                      <td className="px-3 text-right font-bold text-[#047857] text-[14px] tabular-nums">{c.totalCost.toLocaleString('vi-VN')} đ</td>
                      <td className="px-3 text-center">
                        <span className="badge-success">{c.feedbackScore}/5.0 (Đỗ {c.examPassRate}%)</span>
                      </td>
                      <td className="px-4 text-xs font-medium text-slate-800">{c.applicationLevel}</td>
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
