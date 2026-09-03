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
  Shield
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
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-md shadow-2xl border border-emerald-500 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner with Excel Export Only */}
      <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950 rounded-lg text-white shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-orange-500 text-white font-bold text-[11px] uppercase tracking-wider">
              1HRM ENTERPRISE
            </span>
            <span className="text-slate-400 text-xs font-mono">Báo Cáo Tổng Hợp Dữ Liệu Bảng Biểu</span>
            {!canViewSalary && (
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Chế độ bảo mật lương đang bật
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black tracking-tight mt-2 text-white">
            Trung Tâm Báo Cáo Phân Tích Nhân Sự & Nông Trường
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Hệ thống báo cáo chi tiết dạng bảng biểu chuẩn hóa: Nhân sự tổng hợp, Cơ cấu lao động, Đi muộn về sớm, Con ốm, Quỹ lương và Biến động 12 tháng.
          </p>
        </div>

        {/* Pure Excel Export Button Group */}
        <div className="flex flex-wrap items-center gap-2 bg-white/10 p-2.5 rounded-lg border border-white/10 backdrop-blur-xs">
          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 rounded-md btn-primary font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            title="Xuất bảng Excel"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Xuất Báo Cáo Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Role Security Notice for Non-HR / Non-BGD */}
      {!canViewSalary && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-md flex items-center gap-3 text-xs text-amber-900">
          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <strong>Phân Quyền Bảo Mật Lương:</strong> Bạn đang ở góc nhìn{' '}
            <span className="font-bold underline">{currentRole}</span>. Dữ liệu mức lương, quỹ lương và thu nhập nhân viên được bảo mật tuyệt đối, chỉ <strong className="text-orange-700">Ban Giám Đốc (BGĐ)</strong> và <strong className="text-orange-700">Nhân Sự (HR)</strong> mới có quyền truy cập.
          </div>
        </div>
      )}

      {/* Incomplete Profile Alert Callout */}
      {incompleteProfilesCount > 0 && (
        <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-300 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-amber-500/20 flex items-center justify-center text-amber-700 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-amber-950 text-sm">
                Cảnh Báo Hồ Sơ: Có {incompleteProfilesCount} nhân sự mới Onboard chưa hoàn thiện đủ giấy tờ
              </p>
              <p className="text-amber-800 mt-0.5">
                Các giấy tờ cần bổ sung: Bản sao CCCD 2 mặt công chứng, Giấy khám sức khỏe định kỳ và Sổ BHXH gốc.
              </p>
            </div>
          </div>
          <button
            onClick={() => exportBaoCaoNhanSuTongHop(employees)}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-md shadow-xs shrink-0"
          >
            Xuất DS Cần Bổ Sung Excel
          </button>
        </div>
      )}

      {/* Unit Filter Bar for HR (Từng Nông Trường & Các Khối Văn Phòng) */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-orange-600 shrink-0" />
          <span className="font-black text-slate-900">Phạm Vi Báo Cáo HR:</span>
          <span className="text-slate-500 text-[11px] hidden sm:inline">Xem theo từng Nông trường hoặc Văn phòng</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'ALL', label: 'Toàn Công Ty (Tổng Hợp)' },
            { id: 'Nông Trường 1', label: 'Nông Trường 1 (Bình Phước)' },
            { id: 'Nông Trường 2', label: 'Nông Trường 2 (Bình Dương)' },
            { id: 'Nông Trường 3', label: 'Nông Trường 3 (Tây Ninh)' },
            { id: 'Khối Văn Phòng', label: 'Khối Văn Phòng Tổng CT' },
            { id: 'Hành Chính', label: 'Phòng HCTH & HR' },
          ].map((unit) => (
            <button
              key={unit.id}
              onClick={() => setSelectedUnitFilter(unit.id)}
              className={`px-3 py-1.5 rounded-md font-bold transition-all text-xs ${
                selectedUnitFilter === unit.id
                  ? 'bg-[#E05600] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {unit.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Selector for 5 Comprehensive Report Suites */}
      <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          <button
            onClick={() => setActiveReportTab('HR_GENERAL')}
            className={`p-3.5 rounded-md text-left transition-all border flex flex-col justify-between gap-1.5 ${
              activeReportTab === 'HR_GENERAL'
                ? 'bg-orange-50 border-orange-500 text-orange-950 ring-2 ring-orange-500/20 shadow-xs'
                : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
                <Users className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">Mẫu 1</span>
            </div>
            <div>
              <p className="text-xs font-black">1. Nhân Sự Tổng Hợp</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Quy mô, cơ cấu tuổi, giới tính, học vấn</p>
            </div>
          </button>

          <button
            onClick={() => setActiveReportTab('COMPLIANCE')}
            className={`p-3.5 rounded-md text-left transition-all border flex flex-col justify-between gap-1.5 ${
              activeReportTab === 'COMPLIANCE'
                ? 'bg-purple-50 border-purple-500 text-purple-950 ring-2 ring-purple-500/20 shadow-xs'
                : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-purple-100 text-purple-600">
                <ShieldAlert className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">Mẫu 2</span>
            </div>
            <div>
              <p className="text-xs font-black">2. Chấp Hành Nội Quy & Công Ca</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Đi muộn, về sớm, con ốm, công tác, OT</p>
            </div>
          </button>

          <button
            onClick={() => setActiveReportTab('INCOME')}
            className={`p-3.5 rounded-md text-left transition-all border flex flex-col justify-between gap-1.5 ${
              activeReportTab === 'INCOME'
                ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-500/20 shadow-xs'
                : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-600">
                <DollarSign className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 flex items-center gap-1">
                {!canViewSalary && <Lock className="w-2.5 h-2.5 text-amber-600" />} Mẫu 3
              </span>
            </div>
            <div>
              <p className="text-xs font-black flex items-center gap-1">
                3. Tình Hình Quỹ Lương {!canViewSalary && <span className="text-[10px] text-amber-600 font-semibold">(Bảo Mật)</span>}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">Cơ cấu lương, BHXH, Thuế Luật 109</p>
            </div>
          </button>

          <button
            onClick={() => setActiveReportTab('TURNOVER')}
            className={`p-3.5 rounded-md text-left transition-all border flex flex-col justify-between gap-1.5 ${
              activeReportTab === 'TURNOVER'
                ? 'bg-blue-50 border-blue-500 text-blue-950 ring-2 ring-blue-500/20 shadow-xs'
                : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                <TrendingUp className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">Mẫu 4</span>
            </div>
            <div>
              <p className="text-xs font-black">4. Biến Động Nhân Sự 12T</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Dư đầu, tuyển mới, nghỉ việc theo tháng</p>
            </div>
          </button>

          <button
            onClick={() => setActiveReportTab('RECRUITMENT_TRAINING')}
            className={`p-3.5 rounded-md text-left transition-all border flex flex-col justify-between gap-1.5 ${
              activeReportTab === 'RECRUITMENT_TRAINING'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600">
                <UserPlus className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">Mẫu 5</span>
            </div>
            <div>
              <p className="text-xs font-black">5. Tuyển Dụng & Đào Tạo</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Phễu ứng viên, chi phí & khóa học</p>
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MẪU 1: BÁO CÁO NHÂN SỰ TỔNG HỢP & CƠ CẤU LAO ĐỘNG (DẠNG BẢNG CHI TIẾT) */}
      {/* ========================================================================= */}
      {activeReportTab === 'HR_GENERAL' && (
        <div className="space-y-6">
          {/* Bảng 1.1: Phân Bổ Nhân Lực Theo Đơn Vị & Nông Trường */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 h-10 px-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900">
                Bảng 1.1: Tổng Hợp Quy Mô Nhân Sự Theo Phòng Ban & Nông Trường
              </h3>
              <span className="text-xs font-bold text-orange-600">Tổng: {hrGeneralData.totalHeadcount} CBNV</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="data-table-header">
                    <th className="py-3 px-4">STT</th>
                    <th className="py-3 px-4">Đơn Vị / Phòng Ban / Nông Trường</th>
                    <th className="py-3 px-3 text-right">Số Lượng Nhân Sự</th>
                    <th className="py-3 px-3 text-right">Tỷ Trọng (%)</th>
                    <th className="py-3 px-4">Cán Bộ Phụ Trách</th>
                    <th className="py-3 px-4">Phạm Vi / Vùng Quản Lý</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {hrGeneralData.byDepartment.map((d, idx) => (
                    <tr key={idx} className="data-table-row">
                      <td className="py-3 px-4 font-mono font-bold text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{d.name}</td>
                      <td className="py-3 px-3 text-right font-black text-slate-900">{d.count} người</td>
                      <td className="py-3 px-3 text-right font-bold text-orange-600">{d.ratio}</td>
                      <td className="py-3 px-4 text-slate-700">
                        {idx === 0 ? 'Nguyễn Văn Hùng (GĐ Nông trường)' : idx === 1 ? 'Vũ Quốc Toản (GĐ Nông trường)' : idx === 2 ? 'Trần Đình Trọng (GĐ Nông trường)' : 'Phạm Thùy Linh (Trưởng phòng)'}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {idx === 0 ? '1.250 ha vườn cạo' : idx === 1 ? '1.450 ha vườn cạo' : idx === 2 ? '980 ha vườn cạo' : 'Văn phòng điều hành'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bảng 1.2: Cơ Cấu Nhân Sự Theo Độ Tuổi, Giới Tính, Học Vấn */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 h-10 px-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-black text-slate-900">
                  Bảng 1.2A: Cơ Cấu Độ Tuổi Lực Lượng Lao Động
                </h3>
              </div>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="data-table-header">
                    <th className="py-3 px-4">Nhóm Độ Tuổi</th>
                    <th className="py-3 px-3 text-right">Số Lượng (Người)</th>
                    <th className="py-3 px-3 text-right">Tỷ Lệ Phần Trăm</th>
                    <th className="py-3 px-4">Đánh Giá Phân Bổ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {hrGeneralData.byAge.map((a, idx) => (
                    <tr key={idx} className="data-table-row">
                      <td className="py-3 px-4 font-bold text-slate-900">{a.range}</td>
                      <td className="py-3 px-3 text-right font-black text-slate-900">{a.count} người</td>
                      <td className="py-3 px-3 text-right font-black text-blue-600">{a.percent}%</td>
                      <td className="py-3 px-4 text-slate-600">
                        {idx === 1 ? 'Lực lượng cạo mủ nòng cốt' : idx === 0 ? 'Lao động trẻ mới tuyển' : idx === 2 ? 'Kinh nghiệm thâm niên cao' : 'Cán bộ kỹ thuật kỳ cựu'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 h-10 px-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-black text-slate-900">
                  Bảng 1.2B: Cơ Cấu Trình Độ Học Vấn & Giới Tính
                </h3>
              </div>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="data-table-header">
                    <th className="py-3 px-4">Trình Độ Học Vấn</th>
                    <th className="py-3 px-3 text-right">Số Lượng</th>
                    <th className="py-3 px-3 text-right">Tỷ Lệ (%)</th>
                    <th className="py-3 px-4">Cơ Cấu Giới Tính</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="data-table-row">
                    <td className="py-3 px-4 font-bold text-slate-900">Phổ Thông / Sơ Cấp (Công nhân)</td>
                    <td className="py-3 px-3 text-right font-black text-slate-900">768 người</td>
                    <td className="py-3 px-3 text-right font-bold text-orange-600">75.4%</td>
                    <td className="py-3 px-4 text-slate-700">Nam: 58% | Nữ: 42%</td>
                  </tr>
                  <tr className="data-table-row">
                    <td className="py-3 px-4 font-bold text-slate-900">Trung Cấp / Cao Đẳng Kỹ Thuật</td>
                    <td className="py-3 px-3 text-right font-black text-slate-900">142 người</td>
                    <td className="py-3 px-3 text-right font-bold text-orange-600">14.0%</td>
                    <td className="py-3 px-4 text-slate-700">Nam: 65% | Nữ: 35%</td>
                  </tr>
                  <tr className="data-table-row">
                    <td className="py-3 px-4 font-bold text-slate-900">Đại Học (Kỹ sư, Cử nhân)</td>
                    <td className="py-3 px-3 text-right font-black text-slate-900">96 người</td>
                    <td className="py-3 px-3 text-right font-bold text-orange-600">9.4%</td>
                    <td className="py-3 px-4 text-slate-700">Nam: 50% | Nữ: 50%</td>
                  </tr>
                  <tr className="data-table-row">
                    <td className="py-3 px-4 font-bold text-slate-900">Thạc Sĩ / Sau Đại Học (BGĐ)</td>
                    <td className="py-3 px-3 text-right font-black text-slate-900">12 người</td>
                    <td className="py-3 px-3 text-right font-bold text-orange-600">1.2%</td>
                    <td className="py-3 px-4 text-slate-700">Nam: 75% | Nữ: 25%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bảng 1.3: Danh Sách Nhân Sự & Tiến Độ Hồ Sơ (Lương có bảo mật) */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 h-10 px-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-900">
                Bảng 1.3: Trích Lục Danh Sách Hồ Sơ Nhân Sự & Tình Trạng Giấy Tờ Onboarding
              </h3>
              <button
                onClick={() => exportBaoCaoNhanSuTongHop(employees)}
                className="px-3 py-1 btn-primary font-bold text-xs rounded-lg shadow-xs flex items-center gap-1"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Xuất Toàn Bộ DS Excel
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="data-table-header">
                    <th className="py-3 px-4">Mã NV</th>
                    <th className="py-3 px-4">Họ Và Tên</th>
                    <th className="py-3 px-3">Phòng Ban / Nông Trường</th>
                    <th className="py-3 px-3">Chức Danh</th>
                    <th className="py-3 px-3 text-right">Lương Cơ Bản</th>
                    <th className="py-3 px-3 text-center">Tiến Độ Hồ Sơ</th>
                    <th className="py-3 px-4">Cảnh Báo Giấy Tờ Còn Thiếu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredEmployees.map((e) => (
                    <tr key={e.id} className="data-table-row">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">{e.code}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{e.fullName}</td>
                      <td className="py-3 px-3 text-slate-700">{e.departmentName}</td>
                      <td className="py-3 px-3 text-slate-900 font-medium">{e.positionTitle}</td>
                      <td className="py-3 px-3 text-right font-black">
                        {canViewSalary ? (
                          <span className="text-slate-900">{e.baseSalary.toLocaleString('vi-VN')} đ</span>
                        ) : (
                          <span className="text-slate-400 font-mono text-[10px] flex items-center justify-end gap-1">
                            <Lock className="w-3 h-3 text-amber-500" /> [Bảo mật BGĐ/HR]
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded font-black text-[11px] ${e.isProfileComplete !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {e.profileCompleteness || 100}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {e.isProfileComplete !== false ? (
                          <span className="text-emerald-700 font-semibold">✓ Đầy đủ 100% giấy tờ</span>
                        ) : (
                          <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
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
      {/* MẪU 2: BÁO CÁO TÌNH HÌNH CHẤP HÀNH NỘI QUY VỀ CÔNG, CA LÀM & ĐƠN PHÁT SINH */}
      {/* ========================================================================= */}
      {activeReportTab === 'COMPLIANCE' && (
        <div className="space-y-6">
          {/* Bảng 2.1: Tổng Hợp Các Đơn Phát Sinh (Đi muộn, về sớm, con ốm, ốm đau) */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 h-10 px-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-900">
                Bảng 2.1: Sổ Theo Dõi Chi Tiết Các Đơn Phát Sinh (Đi Muộn, Về Sớm, Con Ốm, Ốm Đau, Nghỉ Phép)
              </h3>
              <button
                onClick={() => exportBaoCaoDonTuVaNoiQuy(requests)}
                className="px-3 py-1 btn-primary font-bold text-xs rounded-lg shadow-xs flex items-center gap-1"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Xuất Excel Đơn Từ
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="data-table-header">
                    <th className="py-3 px-4">Mã Đơn</th>
                    <th className="py-3 px-4">Nhân Sự Tạo Đơn</th>
                    <th className="py-3 px-3">Phòng Ban / Nông Trường</th>
                    <th className="py-3 px-3">Loại Đơn Phát Sinh</th>
                    <th className="py-3 px-3">Thời Gian</th>
                    <th className="py-3 px-4">Chi Tiết Nghiệp Vụ (Số phút muộn, Con ốm, Mã C65-HD)</th>
                    <th className="py-3 px-3">Người Duyệt</th>
                    <th className="py-3 px-3 text-center">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredRequests.map((r) => (
                    <tr key={r.id} className="data-table-row">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">{r.code}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{r.employeeName}</td>
                      <td className="py-3 px-3 text-slate-700">{r.departmentName}</td>
                      <td className="py-3 px-3">
                        <span className="px-2.5 py-1 rounded-lg font-bold text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
                          {r.typeName}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">
                        {r.startDate} {r.durationDays > 0 ? `(${r.durationDays}N)` : `(${r.durationHours}h)`}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {r.specificDetails && <b className="text-blue-700 block mb-0.5">{r.specificDetails}</b>}
                        <span className="italic text-slate-500">{r.reason}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-700">{r.approverName || 'Chờ duyệt'}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-emerald-100 text-emerald-800">
                          {r.status === 'APPROVED' ? 'Đã duyệt' : 'Chờ duyệt'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bảng 2.2: Báo Cáo Làm Thêm Giờ (OT) & Công Tác */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 h-10 px-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-black text-slate-900">Bảng 2.2: Danh Sách Nhân Sự Đăng Ký Làm Thêm Giờ (OT)</h3>
              </div>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="data-table-header">
                    <th className="py-3 px-4">Nhân Sự</th>
                    <th className="py-3 px-3">Ngày Làm OT</th>
                    <th className="py-3 px-3 text-right">Số Giờ OT</th>
                    <th className="py-3 px-4">Mục Đích / Ca Làm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="data-table-row">
                    <td className="py-3 px-4 font-bold text-slate-900">Nguyễn Văn Minh (Nông Trường 1)</td>
                    <td className="py-3 px-3 font-mono">30/08/2026</td>
                    <td className="py-3 px-3 text-right font-black text-orange-600">4 Giờ</td>
                    <td className="py-3 px-4 text-slate-600">Cân & phân loại mủ nước trạm 2 (Ca đêm 200%)</td>
                  </tr>
                  <tr className="data-table-row">
                    <td className="py-3 px-4 font-bold text-slate-900">Trần Văn Mạnh (Tổ 1 - NT1)</td>
                    <td className="py-3 px-3 font-mono">01/09/2026</td>
                    <td className="py-3 px-3 text-right font-black text-orange-600">3 Giờ</td>
                    <td className="py-3 px-4 text-slate-600">Trực kiểm soát bảo vệ vườn cây ngày nghỉ lễ</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 h-10 px-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-black text-slate-900">Bảng 2.3: Danh Sách Nhân Sự Đi Công Tác Nông Trường</h3>
              </div>
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="data-table-header">
                    <th className="py-3 px-4">Cán Bộ Công Tác</th>
                    <th className="py-3 px-3">Thời Gian</th>
                    <th className="py-3 px-4">Địa Điểm Đến</th>
                    <th className="py-3 px-4">Nội Dung Chỉ Đạo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="data-table-row">
                    <td className="py-3 px-4 font-bold text-slate-900">Phạm Thùy Linh (Trưởng phòng)</td>
                    <td className="py-3 px-3 font-mono">05/09 - 07/09</td>
                    <td className="py-3 px-4 font-semibold text-emerald-700">Nông Trường 1 & Nông Trường 2</td>
                    <td className="py-3 px-4 text-slate-600">Khảo sát định mức lô cạo và hướng dẫn app 1HRM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MẪU 3: BÁO CÁO TÌNH HÌNH QUỸ LƯƠNG NHÂN SỰ & THUẾ TNCN (BẢO MẬT BGĐ & HR) */}
      {/* ========================================================================= */}
      {activeReportTab === 'INCOME' && (
        <div className="space-y-6">
          {!canViewSalary ? (
            <div className="p-12 bg-white rounded-lg border border-slate-200 shadow-xs text-center space-y-4">
              <div className="w-16 h-16 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-slate-900 text-lg">Báo Cáo Quỹ Lương Thuộc Phạm Vi Bảo Mật Cấp Cao</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Chỉ thành viên <strong>Ban Tổng Giám Đốc (BGĐ)</strong> và <strong>Phòng Nhân Sự (HR/HCTH)</strong> mới được phân quyền truy cập thông tin bảng lương, thuế TNCN và tổng quỹ chi trả của công ty.
                </p>
              </div>
              <p className="text-[11px] text-amber-800 bg-amber-50 px-4 py-2 rounded-md inline-block border border-amber-200">
                Vai trò hiện tại của bạn: <b>{currentRole}</b> • Vui lòng chuyển sang vai trò Ban Giám Đốc hoặc HR trên thanh Menu để xem.
              </p>
            </div>
          ) : (
            <>
              {/* Bảng 3.1: Tổng Quan Quỹ Lương Theo Đơn Vị */}
              <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 h-10 px-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-sm font-black text-slate-900">
                    Bảng 3.1: Tổng Quan Chi Trả Lương & Sản Lượng Mủ Thu Hoạch Toàn Hệ Thống
                  </h3>
                  <span className="text-xs font-black text-emerald-600">
                    Tổng quỹ: {(incomePayrollData.totalPayrollMonth / 1000000000).toFixed(2)} Tỷ VNĐ
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="data-table-header">
                        <th className="py-3 px-4">Nông Trường / Đơn Vị</th>
                        <th className="py-3 px-3 text-right">Quân Số</th>
                        <th className="py-3 px-3 text-right">Tổng Quỹ Lương (VNĐ)</th>
                        <th className="py-3 px-3 text-right">Thu Nhập Bình Quân</th>
                        <th className="py-3 px-3 text-right">Sản Lượng Mủ (Tấn)</th>
                        <th className="py-3 px-4 text-right">Đơn Giá Tiền Lương/Kg</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {incomePayrollData.byPlantationComparison.map((p, idx) => (
                        <tr key={idx} className="data-table-row">
                          <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                          <td className="py-3 px-3 text-right text-slate-700">{p.workers} người</td>
                          <td className="py-3 px-3 text-right font-black text-slate-900">{p.payroll.toLocaleString('vi-VN')} đ</td>
                          <td className="py-3 px-3 text-right font-black text-blue-600">{p.avgIncome.toLocaleString('vi-VN')} đ</td>
                          <td className="py-3 px-3 text-right font-black text-orange-600">{p.latexTons > 0 ? `${p.latexTons} Tấn` : '-'}</td>
                          <td className="py-3 px-4 text-right font-mono text-slate-600">{p.latexTons > 0 ? '8.570 đ/kg' : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bảng 3.2: Bảng Thanh Toán Lương Chi Tiết */}
              <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 h-10 px-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-sm font-black text-slate-900">
                    Bảng 3.2: Bảng Thanh Toán Lương & Khấu Trừ Thuế TNCN (Luật 109/2025/QH15)
                  </h3>
                  <button
                    onClick={() => exportBaoCaoQuyLuong(payslips, incomePayrollData.totalPayrollMonth)}
                    className="px-3 py-1 btn-primary font-bold text-xs rounded-lg shadow-xs flex items-center gap-1"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" /> Xuất Bảng Lương Excel
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="data-table-header">
                        <th className="py-3 px-4">Mã NV</th>
                        <th className="py-3 px-4">Họ Và Tên</th>
                        <th className="py-3 px-3">Phòng Ban</th>
                        <th className="py-3 px-3 text-right">Lương Cơ Bản</th>
                        <th className="py-3 px-3 text-right">Phụ Cấp</th>
                        <th className="py-3 px-3 text-right">Thưởng KPI/Mủ</th>
                        <th className="py-3 px-3 text-right">Tổng Thu Nhập</th>
                        <th className="py-3 px-3 text-right">BHXH (10.5%)</th>
                        <th className="py-3 px-3 text-right">Thuế TNCN (Luật 109)</th>
                        <th className="py-3 px-3 text-right">Thực Lĩnh (NET)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredPayslips.map((p) => (
                        <tr key={p.id} className="data-table-row">
                          <td className="py-3 px-4 font-mono font-bold text-slate-800">{p.employeeCode}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">{p.employeeName}</td>
                          <td className="py-3 px-3 text-slate-700">{p.departmentName}</td>
                          <td className="py-3 px-3 text-right font-medium">{p.baseSalary.toLocaleString('vi-VN')} đ</td>
                          <td className="py-3 px-3 text-right font-medium">{(p.lunchAllowance + p.positionAllowance).toLocaleString('vi-VN')} đ</td>
                          <td className="py-3 px-3 text-right font-medium text-orange-600">{(p.kpiBonus + p.commission).toLocaleString('vi-VN')} đ</td>
                          <td className="py-3 px-3 text-right font-black text-slate-900">{p.totalIncome.toLocaleString('vi-VN')} đ</td>
                          <td className="py-3 px-3 text-right font-medium text-rose-600">-{p.totalInsurance.toLocaleString('vi-VN')} đ</td>
                          <td className="py-3 px-3 text-right font-medium text-amber-600">-{p.pitTax.toLocaleString('vi-VN')} đ</td>
                          <td className="py-3 px-3 text-right font-black text-emerald-600">{p.netSalary.toLocaleString('vi-VN')} đ</td>
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
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 h-10 px-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-900">
                Bảng 4.1: Ma Trận Biến Động Nhân Sự 12 Tháng Trong Năm 2026
              </h3>
              <button
                onClick={() => exportBaoCaoBienDongNhanSu(hrGeneralData)}
                className="px-3 py-1 btn-primary font-bold text-xs rounded-lg shadow-xs flex items-center gap-1"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Xuất Biến Động 12T Excel
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="data-table-header">
                    <th className="py-3 px-4">Chỉ Tiêu Biến Động</th>
                    <th className="py-3 px-2 text-center">T1</th>
                    <th className="py-3 px-2 text-center">T2</th>
                    <th className="py-3 px-2 text-center">T3</th>
                    <th className="py-3 px-2 text-center">T4</th>
                    <th className="py-3 px-2 text-center">T5</th>
                    <th className="py-3 px-2 text-center">T6</th>
                    <th className="py-3 px-2 text-center">T7</th>
                    <th className="py-3 px-2 text-center bg-orange-100 text-orange-900 font-black">T8 (Hiện tại)</th>
                    <th className="py-3 px-2 text-center text-slate-400">T9 (Dự kiến)</th>
                    <th className="py-3 px-2 text-center text-slate-400">T10</th>
                    <th className="py-3 px-2 text-center text-slate-400">T11</th>
                    <th className="py-3 px-2 text-center text-slate-400">T12</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="data-table-row">
                    <td className="py-3 px-4 font-bold text-slate-900">1. Dư đầu tháng</td>
                    {[940, 952, 965, 980, 992, 1005, 998, 1018, 1042, 1065, 1070, 1075].map((v, i) => (
                      <td key={i} className={`py-3 px-2 text-center font-mono ${i === 7 ? 'bg-orange-50 font-black text-orange-950' : ''}`}>{v}</td>
                    ))}
                  </tr>
                  <tr className="data-table-row">
                    <td className="py-3 px-4 font-bold text-emerald-700">2. Tuyển mới trong tháng</td>
                    {[24, 28, 32, 25, 30, 18, 38, 42, 35, 20, 15, 12].map((v, i) => (
                      <td key={i} className={`py-3 px-2 text-center font-mono font-bold text-emerald-600 ${i === 7 ? 'bg-orange-50 font-black' : ''}`}>+{v}</td>
                    ))}
                  </tr>
                  <tr className="data-table-row">
                    <td className="py-3 px-4 font-bold text-rose-700">3. Thôi việc / nghỉ việc</td>
                    {[12, 15, 17, 13, 17, 25, 18, 18, 12, 15, 10, 8].map((v, i) => (
                      <td key={i} className={`py-3 px-2 text-center font-mono font-bold text-rose-600 ${i === 7 ? 'bg-orange-50 font-black' : ''}`}>-{v}</td>
                    ))}
                  </tr>
                  <tr className="data-table-row">
                    <td className="py-3 px-4 font-bold text-blue-700">4. Điều chuyển nội bộ</td>
                    {[8, 10, 12, 9, 14, 11, 15, 14, 10, 8, 6, 5].map((v, i) => (
                      <td key={i} className={`py-3 px-2 text-center font-mono text-blue-600 ${i === 7 ? 'bg-orange-50 font-black' : ''}`}>{v}</td>
                    ))}
                  </tr>
                  <tr className="data-table-row">
                    <td className="py-3 px-4 font-bold text-purple-700">5. Thăng chức / bổ nhiệm</td>
                    {[3, 5, 4, 6, 5, 4, 8, 9, 6, 5, 4, 4].map((v, i) => (
                      <td key={i} className={`py-3 px-2 text-center font-mono text-purple-600 ${i === 7 ? 'bg-orange-50 font-black' : ''}`}>{v}</td>
                    ))}
                  </tr>
                  <tr className="bg-slate-50 font-black text-slate-950">
                    <td className="py-3 px-4">6. Dư cuối tháng</td>
                    {[952, 965, 980, 992, 1005, 998, 1018, 1042, 1065, 1070, 1075, 1079].map((v, i) => (
                      <td key={i} className={`py-3 px-2 text-center font-mono ${i === 7 ? 'bg-orange-200 text-orange-950' : ''}`}>{v}</td>
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
          {/* Bảng 5.1: Tiến Độ Tuyển Dụng Theo Đơn Vị */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 h-10 px-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-black text-slate-900">
                Bảng 5.1: Báo Cáo Kế Hoạch Tuyển Dụng & Phễu Chuyển Đổi 5 Vòng
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="data-table-header">
                    <th className="py-3 px-4">Đơn Vị Có Nhu Cầu</th>
                    <th className="py-3 px-3 text-right">Chỉ Tiêu</th>
                    <th className="py-3 px-3 text-right">Đã Tuyển Dụng</th>
                    <th className="py-3 px-3 text-right">Tỷ Lệ Đạt</th>
                    <th className="py-3 px-4">Nguồn Tuyển Hiệu Quả Nhất</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {recruitmentReportData.byDepartmentNeeds.map((r, idx) => (
                    <tr key={idx} className="data-table-row">
                      <td className="py-3 px-4 font-bold text-slate-900">{r.dept}</td>
                      <td className="py-3 px-3 text-right font-medium">{r.target} người</td>
                      <td className="py-3 px-3 text-right font-black text-emerald-600">{r.hired} người</td>
                      <td className="py-3 px-3 text-right font-black text-orange-600">{r.rate}</td>
                      <td className="py-3 px-4 text-slate-700">
                        {idx === 0 ? 'Giới thiệu nội bộ (62%)' : idx === 1 ? 'Ngày hội việc làm địa phương (45%)' : 'Mạng xã hội & Zalo'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bảng 5.2: Danh Sách Các Khóa Đào Tạo Nghiệp Vụ */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 h-10 px-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-black text-slate-900">
                Bảng 5.2: Báo Cáo Đào Tạo & Đánh Giá Mức Độ Ứng Dụng Sau Đào Tạo
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="data-table-header">
                    <th className="py-3 px-4">Mã Khóa</th>
                    <th className="py-3 px-4">Tên Khóa Đào Tạo</th>
                    <th className="py-3 px-3">Hình Thức</th>
                    <th className="py-3 px-3 text-right">Số Học Viên</th>
                    <th className="py-3 px-3 text-right">Tổng Chi Phí</th>
                    <th className="py-3 px-3 text-center">Điểm Đánh Giá</th>
                    <th className="py-3 px-4">Mức Độ Áp Dụng Thực Tế</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {trainingCourses.map((c) => (
                    <tr key={c.id} className="data-table-row">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">{c.code}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{c.title}</td>
                      <td className="py-3 px-3 text-blue-700 font-semibold">{c.method}</td>
                      <td className="py-3 px-3 text-right font-black text-slate-900">{c.participantsCount} người</td>
                      <td className="py-3 px-3 text-right font-black text-orange-600">{c.totalCost.toLocaleString('vi-VN')} đ</td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-600">{c.feedbackScore}/5.0 (Đỗ {c.examPassRate}%)</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{c.applicationLevel}</td>
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
