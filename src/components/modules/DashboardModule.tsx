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
  FileText,
  Presentation,
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
import { exportToExcel, exportToWord, exportToPowerPoint } from '@/lib/exportEngine';

export const DashboardModule: React.FC = () => {
  const {
    employees,
    payslips,
    plantations,
    trainingCourses,
    complianceData,
    hrGeneralData,
    recruitmentReportData,
    incomePayrollData,
  } = useHRM();

  // Active Report Suite Tab (1 to 5)
  const [activeReportTab, setActiveReportTab] = useState<'HR_GENERAL' | 'TRAINING' | 'RECRUITMENT' | 'INCOME' | 'COMPLIANCE'>('HR_GENERAL');
  const [reportPeriod, setReportPeriod] = useState<'MONTH' | 'QUARTER' | 'YEAR'>('MONTH');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // -------------------------------------------------------------
  // EXPORT HANDLERS FOR CURRENT ACTIVE SUITE & FULL CONSOLIDATED
  // -------------------------------------------------------------

  const handleExportExcel = () => {
    if (activeReportTab === 'HR_GENERAL') {
      const headers = ['Đơn Vị / Phòng Ban', 'Quân Số Thực Tế', 'Tỷ Trọng (%)', 'Độ Tuổi Bình Quân', 'Trình Độ Học Vấn Chủ Yếu'];
      const rows = hrGeneralData.byDepartment.map((d) => [d.name, d.count, d.ratio, '33.5 tuổi', 'Công nhân KT & ĐH']);
      exportToExcel(
        'Báo Cáo 1: Tổng Quan Tình Hình Nhân Sự & Cơ Cấu Lao Động',
        'Bao_Cao_Nhan_Su_1HRM',
        headers,
        rows,
        {
          'Tổng quy mô': `${hrGeneralData.totalHeadcount} CBNV`,
          'Tỷ lệ duy trì': `${hrGeneralData.retentionRate}%`,
          'Tỷ lệ thôi việc': `${hrGeneralData.turnoverRate}%`,
          'Tuyển mới kỳ': `${hrGeneralData.fluctuations.newHires} người`,
        }
      );
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
        'Báo Cáo 2: Tình Hình Đào Tạo Nhân Lực & Đánh Giá Hiệu Quả',
        'Bao_Cao_Dao_Tao_1HRM',
        headers,
        rows,
        {
          'Tổng số khóa': trainingCourses.length,
          'Tổng học viên': trainingCourses.reduce((a, b) => a + b.participantsCount, 0),
          'Tổng ngân sách đào tạo': `${(trainingCourses.reduce((a, b) => a + b.totalCost, 0)).toLocaleString('vi-VN')} đ`,
        }
      );
    } else if (activeReportTab === 'RECRUITMENT') {
      const headers = ['Vị Trí / Phòng Ban Cần Tuyển', 'Chỉ Tiêu', 'Đã Tuyển', 'Tỷ Lệ Đạt (%)', 'Chi Phí Ước Tính (VNĐ)'];
      const rows = recruitmentReportData.byDepartmentNeeds.map((r) => [r.dept, r.target, r.hired, r.rate, 1500000 * r.hired]);
      exportToExcel(
        'Báo Cáo 3: Hiệu Quả Tuyển Dụng & Phễu Chuyển Đổi Ứng Viên',
        'Bao_Cao_Tuyen_Dung_1HRM',
        headers,
        rows,
        {
          'Chỉ tiêu tuyển': `${recruitmentReportData.totalTarget} người`,
          'Đã tuyển dụng': `${recruitmentReportData.totalHired} người (${recruitmentReportData.hiringRate}%)`,
          'Thời gian tuyển TB': `${recruitmentReportData.avgTimeToHireDays} ngày`,
          'Chi phí TB/ứng viên': `${recruitmentReportData.costPerHiredCandidate.toLocaleString('vi-VN')} đ`,
        }
      );
    } else if (activeReportTab === 'INCOME') {
      const headers = ['Nông Trường / Đơn Vị', 'Số Lao Động', 'Tổng Quỹ Lương (VNĐ)', 'Thu Nhập Bình Quân (VNĐ)', 'Sản Lượng Mủ (Tấn)'];
      const rows = incomePayrollData.byPlantationComparison.map((p) => [
        p.name,
        p.workers,
        p.payroll,
        p.avgIncome,
        p.latexTons,
      ]);
      exportToExcel(
        'Báo Cáo 4: Thu Nhập Nhân Sự, Quỹ Lương & Thuế TNCN Luật 109/2025',
        'Bao_Cao_Thu_Nhap_1HRM',
        headers,
        rows,
        {
          'Tổng quỹ lương': `${(incomePayrollData.totalPayrollMonth).toLocaleString('vi-VN')} đ`,
          'Thu nhập bình quân': `${(incomePayrollData.avgIncomePerWorker).toLocaleString('vi-VN')} đ/người`,
          'Tổng BHXH (10.5%)': `${(incomePayrollData.deductions.totalSocialInsurance).toLocaleString('vi-VN')} đ`,
          'Tổng Thuế TNCN (Luật 109)': `${(incomePayrollData.deductions.totalPitTaxNewLaw).toLocaleString('vi-VN')} đ`,
        }
      );
    } else if (activeReportTab === 'COMPLIANCE') {
      const headers = ['Mã Vi Phạm', 'Họ Và Tên', 'Đơn Vị / Tổ', 'Ngày Vi Phạm', 'Nội Dung Vi Phạm', 'Hình Thức Xử Lý', 'Trạng Thái'];
      const rows = complianceData.violationsList.map((v) => [
        v.code,
        v.employeeName,
        v.departmentOrPlantation,
        v.date,
        v.type,
        v.disciplineForm,
        v.status,
      ]);
      exportToExcel(
        'Báo Cáo 5: Tình Hình Tuân Thủ Nội Quy, Chấm Công & Kỷ Luật Lao Động',
        'Bao_Cao_Tuan_Thu_1HRM',
        headers,
        rows,
        {
          'Tỷ lệ đi làm đúng giờ': `${complianceData.onTimeRate}%`,
          'Tỷ lệ tuân thủ chấm công': `${complianceData.attendanceComplianceRate}%`,
          'Tổng vi phạm trong kỳ': `${complianceData.totalViolationsMonth} vụ`,
          'Đã nhắc nhở / Khiển trách': `${complianceData.totalWarnings} vụ`,
        }
      );
    }
    showToast('✓ Đã xuất file Báo cáo Excel thành công!');
  };

  const handleExportWord = () => {
    let reportTitle = '';
    let sections: any[] = [];

    if (activeReportTab === 'HR_GENERAL') {
      reportTitle = 'BÁO CÁO TỔNG QUAN TÌNH HÌNH NHÂN SỰ & BIẾN ĐỘNG LAO ĐỘNG';
      sections = [
        {
          title: 'Quy Mô Nhân Sự & Cơ Cấu Phân Bổ Theo Đơn Vị',
          content: `Tính đến tháng 08/2026, toàn hệ thống Tổng Công Ty & Các Nông Trường có tổng cộng ${hrGeneralData.totalHeadcount} cán bộ công nhân viên. Cơ cấu nhân sự được duy trì ổn định, trong đó khối Nông trường chiếm hơn 92% lực lượng lao động trực tiếp khai thác mủ cao su.`,
          kpis: {
            'Tổng quy mô nhân sự': `${hrGeneralData.totalHeadcount} Người`,
            'Tỷ lệ duy trì nhân sự': `${hrGeneralData.retentionRate}%`,
            'Tỷ lệ biến động / nghỉ việc': `${hrGeneralData.turnoverRate}%`,
          },
          table: {
            headers: ['Đơn Vị / Nông Trường', 'Quân Số', 'Tỷ Trọng (%)'],
            rows: hrGeneralData.byDepartment.map((d) => [d.name, d.count, d.ratio]),
          },
        },
        {
          title: 'Cơ Cấu Độ Tuổi, Giới Tính, Học Vấn & Thâm Niên',
          content: 'Lực lượng lao động có độ tuổi vàng từ 26-35 tuổi chiếm 45.4%, đảm bảo sức khỏe và kỹ thuật khai thác mủ dẻo dai. Trình độ công nhân kỹ thuật và sơ cấp chiếm 51.1%.',
          table: {
            headers: ['Nhóm Độ Tuổi', 'Số Lượng', 'Tỷ Lệ (%)'],
            rows: hrGeneralData.byAge.map((a) => [a.range, a.count, `${a.percent}%`]),
          },
        },
        {
          title: 'Dự Báo Xu Hướng Nhân Sự & Kiến Nghị Điều Hành',
          content: `${hrGeneralData.aiForecast.riskPlantations}. Khuyến nghị Phòng Tuyển dụng phối hợp cùng BGĐ Nông trường 2 tổ chức ngày hội tuyển dụng địa phương trước ngày 20/09/2026.`,
        },
      ];
    } else if (activeReportTab === 'TRAINING') {
      reportTitle = 'BÁO CÁO TÌNH HÌNH ĐÀO TẠO NHÂN LỰC & ĐÁNH GIÁ HIỆU QUẢ';
      sections = [
        {
          title: 'Tổng Hợp Các Khóa Đào Tạo Nghiệp Vụ & Nông Trường Đã Triển Khai',
          content: 'Trong kỳ vừa qua, Phòng HCTH đã tổ chức thành công 4 chương trình đào tạo trọng điểm về kỹ thuật cạo mủ chuẩn quốc tế, an toàn vệ sinh lao động và kỹ năng số 1HRM Mobile cho các Tổ trưởng.',
          kpis: {
            'Tổng số khóa học': `${trainingCourses.length} khóa`,
            'Lượt nhân sự tham gia': `${trainingCourses.reduce((a, b) => a + b.participantsCount, 0)} lượt`,
            'Tỷ lệ đạt sát hạch TB': '97.0%',
          },
          table: {
            headers: ['Tên Khóa Đào Tạo', 'Hình Thức', 'Học Viên', 'Tổng Chi Phí (VNĐ)', 'Điểm Đánh Giá'],
            rows: trainingCourses.map((c) => [c.title, c.method, c.participantsCount, c.totalCost, `${c.feedbackScore}/5.0`]),
          },
        },
      ];
    } else if (activeReportTab === 'RECRUITMENT') {
      reportTitle = 'BÁO CÁO HIỆU QUẢ TUYỂN DỤNG & PHỄU ỨNG VIÊN';
      sections = [
        {
          title: 'Kết Quả Tuyển Dụng Theo Phòng Ban & Nông Trường',
          content: `Toàn công ty đã tiếp nhận ${recruitmentReportData.conversionFunnel[0].count} hồ sơ ứng viên, hoàn tất tuyển dụng và ký hợp đồng chính thức với ${recruitmentReportData.totalHired}/${recruitmentReportData.totalTarget} chỉ tiêu (Đạt ${recruitmentReportData.hiringRate}%).`,
          kpis: {
            'Chỉ tiêu tuyển': `${recruitmentReportData.totalTarget} người`,
            'Đã tuyển dụng': `${recruitmentReportData.totalHired} người`,
            'Thời gian tuyển TB': `${recruitmentReportData.avgTimeToHireDays} ngày`,
          },
          table: {
            headers: ['Đơn Vị', 'Chỉ Tiêu', 'Đã Tuyển', 'Tỷ Lệ Đạt'],
            rows: recruitmentReportData.byDepartmentNeeds.map((n) => [n.dept, n.target, n.hired, n.rate]),
          },
        },
      ];
    } else if (activeReportTab === 'INCOME') {
      reportTitle = 'BÁO CÁO THU NHẬP NHÂN SỰ, QUỸ LƯƠNG & THUẾ TNCN LUẬT 109/2025';
      sections = [
        {
          title: 'Tổng Quỹ Lương & Cơ Cấu Thu Nhập Toàn Hệ Thống',
          content: 'Quỹ lương tháng 08/2026 đạt 12.85 tỷ đồng, tăng 4.8% so với tháng trước nhờ năng suất sản lượng mủ cao su vượt định mức. Thu nhập bình quân của công nhân nông trường đạt 12.62 triệu đồng/tháng.',
          kpis: {
            'Tổng quỹ lương chi trả': `${(incomePayrollData.totalPayrollMonth).toLocaleString('vi-VN')} đ`,
            'Thu nhập bình quân': `${(incomePayrollData.avgIncomePerWorker).toLocaleString('vi-VN')} đ/người`,
            'Thuế TNCN (Luật 109/2025)': `${(incomePayrollData.deductions.totalPitTaxNewLaw).toLocaleString('vi-VN')} đ`,
          },
          table: {
            headers: ['Đơn Vị / Nông Trường', 'Số CBNV', 'Tổng Quỹ Lương (VNĐ)', 'Thu Nhập TB (VNĐ)'],
            rows: incomePayrollData.byPlantationComparison.map((p) => [p.name, p.workers, p.payroll, p.avgIncome]),
          },
        },
      ];
    } else if (activeReportTab === 'COMPLIANCE') {
      reportTitle = 'BÁO CÁO TÌNH HÌNH TUÂN THỦ NỘI QUY, CHẤM CÔNG & KỶ LUẬT';
      sections = [
        {
          title: 'Chỉ Số Tuân Thủ Giờ Giấc & Quy Trình Khai Thác Mủ',
          content: 'Tỷ lệ đi làm đúng giờ toàn hệ thống đạt 97.4%, tỷ lệ tuân thủ chấm công đạt 98.6%. Các trường hợp vi phạm chủ yếu là lỗi kỹ thuật cạo mủ và quên trang bị BHLĐ đã được nhắc nhở xử lý dứt điểm.',
          kpis: {
            'Tỷ lệ đi làm đúng giờ': `${complianceData.onTimeRate}%`,
            'Tuân thủ chấm công': `${complianceData.attendanceComplianceRate}%`,
            'Tổng số vụ vi phạm': `${complianceData.totalViolationsMonth} vụ`,
          },
          table: {
            headers: ['Mã Vi Phạm', 'Nhân Sự', 'Đơn Vị', 'Hành Vi Vi Phạm', 'Hình Thức Xử Lý'],
            rows: complianceData.violationsList.map((v) => [v.code, v.employeeName, v.departmentOrPlantation, v.type, v.disciplineForm]),
          },
        },
      ];
    }

    exportToWord(reportTitle, `Bao_Cao_${activeReportTab}_1HRM`, sections);
    showToast('✓ Đã xuất file Báo cáo Word chuẩn văn bản hành chính!');
  };

  const handleExportPowerPoint = () => {
    let slides: any[] = [];
    const presTitle = `BÁO CÁO ĐIỀU HÀNH BI EXECUTIVE - 1HRM PLATFORM`;

    if (activeReportTab === 'HR_GENERAL') {
      slides = [
        {
          title: 'Tổng Quan Quy Mô & Cơ Cấu Lao Động',
          subtitle: 'Kỳ Báo Cáo: Tháng 08/2026 | Toàn Tổng Công Ty',
          stats: [
            { label: 'Tổng Quân Số', value: `${hrGeneralData.totalHeadcount} CBNV` },
            { label: 'Tỷ Lệ Duy Trì', value: `${hrGeneralData.retentionRate}%` },
            { label: 'Tỷ Lệ Nghỉ Việc', value: `${hrGeneralData.turnoverRate}%` },
          ],
          bulletPoints: [
            'Khối nông trường chiếm 92.3% tổng nhân sự toàn công ty.',
            'Lực lượng lao động trong độ tuổi vàng (26-35 tuổi) đạt 45.4%.',
            'Tỷ lệ gắn bó trên 3 năm chiếm hơn 57.6% toàn bộ nhân sự.',
          ],
        },
        {
          title: 'Cơ Cấu Phân Bổ Quân Số Theo Nông Trường',
          table: {
            headers: ['Đơn Vị', 'Số Lượng CBNV', 'Tỷ Trọng'],
            rows: hrGeneralData.byDepartment.map((d) => [d.name, d.count, d.ratio]),
          },
          bulletPoints: [
            'Nông trường 3 có quy mô lớn nhất với 380 công nhân (37.3%).',
            'Dự báo cần bổ sung thêm 65 lao động thời vụ cho mùa cạo cao điểm Q4.',
          ],
        },
      ];
    } else if (activeReportTab === 'TRAINING') {
      slides = [
        {
          title: 'Kết Quả Triển Khai Đào Tạo Nguồn Nhân Lực',
          stats: [
            { label: 'Khóa Đào Tạo', value: '4 Khóa' },
            { label: 'Lượt Học Viên', value: `${trainingCourses.reduce((a, b) => a + b.participantsCount, 0)} Người` },
            { label: 'Điểm Hài Lòng', value: '4.85 / 5.0' },
          ],
          bulletPoints: [
            '100% công nhân cạo mủ mới hoàn thành sát hạch kỹ thuật dăm cạo.',
            '48 Tổ trưởng hoàn tất đào tạo chuyển đổi số chấm công 1HRM Mobile.',
            'Tổng chi phí đào tạo thực tế tiết kiệm 12% so với ngân sách dự toán.',
          ],
        },
      ];
    } else if (activeReportTab === 'RECRUITMENT') {
      slides = [
        {
          title: 'Hiệu Quả Tuyển Dụng & Phễu Chuyển Đổi Ứng Viên',
          stats: [
            { label: 'Đã Tuyển Dụng', value: `${recruitmentReportData.totalHired} / ${recruitmentReportData.totalTarget}` },
            { label: 'Tỷ Lệ Đạt', value: `${recruitmentReportData.hiringRate}%` },
            { label: 'Time-to-Hire', value: `${recruitmentReportData.avgTimeToHireDays} Ngày` },
          ],
          bulletPoints: [
            'Nguồn giới thiệu nội bộ đạt hiệu quả cao nhất (chiếm 58.3% tổng số tuyển).',
            'Chi phí bình quân trên 1 ứng viên tuyển thành công đạt 1.78 triệu VNĐ.',
          ],
        },
      ];
    } else if (activeReportTab === 'INCOME') {
      slides = [
        {
          title: 'Báo Cáo Thu Nhập & Quỹ Lương (Luật 109/2025)',
          stats: [
            { label: 'Tổng Quỹ Lương', value: '12.85 Tỷ VNĐ' },
            { label: 'Thu Nhập TB', value: '12.62 Triệu/Người' },
            { label: 'Tăng Trưởng', value: '+4.8% YoY' },
          ],
          bulletPoints: [
            'Áp dụng biểu thuế TNCN 5 bậc và mức giảm trừ 15.5 triệu theo Luật 109/2025/QH15.',
            'Thưởng sản lượng mủ cao su chiếm 26.8% tổng thu nhập của người lao động.',
          ],
        },
      ];
    } else if (activeReportTab === 'COMPLIANCE') {
      slides = [
        {
          title: 'Tình Hình Tuân Thủ Kỷ Luật & Nội Quy Lao Động',
          stats: [
            { label: 'Đúng Giờ', value: `${complianceData.onTimeRate}%` },
            { label: 'Tuân Thủ Công', value: `${complianceData.attendanceComplianceRate}%` },
            { label: 'Vi Phạm Đã Xử Lý', value: '100%' },
          ],
          bulletPoints: [
            'Nông trường 1 đạt danh hiệu Đơn vị tuân thủ xuất sắc nhất tháng 08.',
            'Không xảy ra sự cố tai nạn lao động nghiêm trọng trong kỳ khai thác.',
          ],
        },
      ];
    }

    exportToPowerPoint(presTitle, `Thuyet_Trinh_${activeReportTab}_1HRM`, slides);
    showToast('✓ Đã xuất bộ Slide PowerPoint thuyết trình thành công!');
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-500 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner with 3 Export Buttons */}
      <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950 rounded-2xl text-white shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-orange-500 text-white font-bold text-[11px] uppercase tracking-wider">
              1HRM BI Executive Analytics
            </span>
            <span className="text-slate-400 text-xs font-mono">Báo Cáo Điều Hành Trực Quan Đa Chiều</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight mt-2 text-white">
            Trung Tâm Báo Cáo Nhân Sự & Nông Trường 1HRM
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Hệ thống tự động đồng bộ số liệu 5 bộ báo cáo chuyên sâu: Tổng quan nhân sự, Đào tạo, Tuyển dụng, Thu nhập quỹ lương và Tuân thủ nội quy.
          </p>
        </div>

        {/* 3 Export Buttons Bar */}
        <div className="flex flex-wrap items-center gap-2 bg-white/10 p-2.5 rounded-2xl border border-white/10 backdrop-blur-xs">
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
            title="Xuất file Excel bảng số liệu chi tiết"
          >
            <FileSpreadsheet className="w-4 h-4" /> Xuất Excel (.xlsx)
          </button>

          <button
            onClick={handleExportWord}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
            title="Xuất file Word báo cáo văn bản hành chính"
          >
            <FileText className="w-4 h-4" /> Xuất Word (.doc)
          </button>

          <button
            onClick={handleExportPowerPoint}
            className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
            title="Xuất slide thuyết trình PowerPoint"
          >
            <Presentation className="w-4 h-4" /> Xuất PowerPoint (.ppt)
          </button>
        </div>
      </div>

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
              <p className="text-xs font-black">5. Tuân Thủ & Kỷ Luật</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Đúng giờ, vi phạm, kỷ luật lao động</p>
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BỘ 1: BÁO CÁO TỔNG QUAN TÌNH HÌNH NHÂN SỰ */}
      {/* ========================================================================= */}
      {activeReportTab === 'HR_GENERAL' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
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

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Phân bổ theo đơn vị / nông trường */}
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

            {/* Chart 2: Cơ cấu độ tuổi & Giới tính */}
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

          {/* AI Forecast & Recommendation Banner */}
          <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-orange-400">Dự Báo Xu Hướng & Cảnh Báo Định Biên (1HRM Forecast AI)</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {hrGeneralData.aiForecast.riskPlantations}. Dự báo toàn hệ thống duy trì mức tăng trưởng sản lượng 4.8%/tháng nếu đảm bảo bổ sung đủ nhân sự trước tháng 10.
              </p>
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

          {/* Training Courses Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-900">Danh Sách Các Khóa Đào Tạo & Đánh Giá Hiệu Quả Nghiệp Vụ</h3>
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
                    <th className="py-3 px-4 text-center">Mức Áp Dụng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {trainingCourses.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900 text-sm">{c.title}</p>
                        <p className="text-[11px] text-slate-500">{c.topic} | Giảng viên: {c.trainerName}</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[11px]">
                          {c.method}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-mono">
                        {c.startDate} - {c.endDate} ({c.durationHours}h)
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900">{c.participantsCount} người</td>
                      <td className="py-3 px-3 text-right font-bold text-orange-600">
                        {c.totalCost.toLocaleString('vi-VN')} đ
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-bold text-slate-900">{c.feedbackScore}/5.0</span>
                        <span className="text-[10px] text-emerald-600 block font-semibold">{c.examPassRate}% Đạt</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 text-[11px]">
                          {c.applicationLevel}
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
      {/* BỘ 3: BÁO CÁO HIỆU QUẢ TUYỂN DỤNG */}
      {/* ========================================================================= */}
      {activeReportTab === 'RECRUITMENT' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">Chỉ Tiêu Tuyển Dụng</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{recruitmentReportData.totalTarget} Chỉ Tiêu</p>
              <p className="text-[11px] text-slate-500 mt-1">Đã tuyển: <b>{recruitmentReportData.totalHired} người</b></p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">Tỷ Lệ Hoàn Thành</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">{recruitmentReportData.hiringRate}%</p>
              <p className="text-[11px] text-emerald-600 mt-1 font-medium">Tiến độ vượt kế hoạch</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">Thời Gian Tuyển TB (Time-to-Hire)</p>
              <p className="text-2xl font-black text-blue-600 mt-1">{recruitmentReportData.avgTimeToHireDays} Ngày</p>
              <p className="text-[11px] text-blue-700 mt-1">Nhanh hơn 3 ngày so với quý trước</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">Chi Phí / Ứng Viên Thành Công</p>
              <p className="text-2xl font-black text-orange-600 mt-1">
                {recruitmentReportData.costPerHiredCandidate.toLocaleString('vi-VN')} đ
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Tổng ngân sách: 128.5M đ</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Phễu chuyển đổi */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900">Phễu Chuyển Đổi Tuyển Dụng Qua 5 Vòng</h3>
              <div className="space-y-3">
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

            {/* Nguồn ứng viên */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-slate-900">Hiệu Quả Các Nguồn Tuyển Dụng</h3>
              <div className="space-y-3">
                {recruitmentReportData.candidateSources.map((s, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200">
                    <div>
                      <p className="font-bold text-xs text-slate-900">{s.source}</p>
                      <p className="text-[11px] text-slate-500">Tiếp nhận: {s.count} hồ sơ</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-emerald-600 text-sm">{s.hired} đã tuyển</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{s.percent}% thành công</p>
                    </div>
                  </div>
                ))}
              </div>
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
              <p className="text-[11px] text-blue-700 mt-1">Bao gồm lương cứng & thưởng mủ</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">Chi Phí Bảo Hiểm Xã Hội (10.5%)</p>
              <p className="text-2xl font-black text-purple-600 mt-1">
                {(incomePayrollData.deductions.totalSocialInsurance / 1000000).toFixed(1)} Triệu đ
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Trích nộp cơ quan BHXH</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">Thuế TNCN (Luật 109/2025)</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {(incomePayrollData.deductions.totalPitTaxNewLaw / 1000000).toFixed(1)} Triệu đ
              </p>
              <p className="text-[11px] text-emerald-700 mt-1 font-medium">Giảm trừ 15.5M/người</p>
            </div>
          </div>

          {/* Plantation Income Comparison */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-black text-slate-900">So Sánh Quỹ Lương & Năng Suất Giữa Các Nông Trường</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                    <th className="py-3 px-4">Nông Trường / Đơn Vị</th>
                    <th className="py-3 px-3 text-right">Quân Số</th>
                    <th className="py-3 px-3 text-right">Tổng Quỹ Lương Chi Trả</th>
                    <th className="py-3 px-3 text-right">Thu Nhập Bình Quân / Người</th>
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
      {/* BỘ 5: BÁO CÁO TÌNH HÌNH TUÂN THỦ NỘI QUY */}
      {/* ========================================================================= */}
      {activeReportTab === 'COMPLIANCE' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">Tỷ Lệ Đi Làm Đúng Giờ</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">{complianceData.onTimeRate}%</p>
              <p className="text-[11px] text-slate-500 mt-1">Toàn bộ 3 nông trường & VP</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">Tỷ Lệ Tuân Thủ Chấm Công</p>
              <p className="text-2xl font-black text-blue-600 mt-1">{complianceData.attendanceComplianceRate}%</p>
              <p className="text-[11px] text-blue-700 mt-1 font-medium">Chấm công 1-chạm & FaceID</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">Tổng Số Vụ Vi Phạm</p>
              <p className="text-2xl font-black text-rose-600 mt-1">{complianceData.totalViolationsMonth} Vụ</p>
              <p className="text-[11px] text-slate-500 mt-1">Đã xử lý dứt điểm: 100%</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">Hình Thức: Khiển Trách / Nhắc Nhở</p>
              <p className="text-2xl font-black text-amber-600 mt-1">{complianceData.totalWarnings} Nhắc Nhở</p>
              <p className="text-[11px] text-amber-800 mt-1">8 trường hợp trừ chuyên cần</p>
            </div>
          </div>

          {/* Violations List Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-black text-slate-900">Sổ Nhật Ký Xử Lý Vi Phạm Kỷ Luật Lao Động & Nội Quy</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                    <th className="py-3 px-4">Mã Số</th>
                    <th className="py-3 px-3">Nhân Sự Vi Phạm</th>
                    <th className="py-3 px-3">Đơn Vị / Tổ</th>
                    <th className="py-3 px-3">Ngày Xảy Ra</th>
                    <th className="py-3 px-3">Hành Vi Vi Phạm</th>
                    <th className="py-3 px-3">Hình Thức Xử Lý</th>
                    <th className="py-3 px-4 text-center">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {complianceData.violationsList.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">{v.code}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{v.employeeName}</td>
                      <td className="py-3 px-3 text-slate-600">{v.departmentOrPlantation}</td>
                      <td className="py-3 px-3 font-mono text-slate-500">{v.date}</td>
                      <td className="py-3 px-3 font-semibold text-rose-700">{v.type}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 font-semibold text-[11px]">
                          {v.disciplineForm}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 text-[11px]">
                          {v.status}
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
