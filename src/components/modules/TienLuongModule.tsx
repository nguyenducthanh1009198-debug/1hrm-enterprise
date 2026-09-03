'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  Lock,
  Calculator,
  Eye,
  CheckCircle,
  FileSpreadsheet,
  Building,
  CreditCard,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';
import { useHRM } from '@/context/HRMContext';
import { Payslip } from '@/types';
import { SYSTEM_FORMULA_PRESETS, evaluateFormula } from '@/lib/formulaEngine';

export const TienLuongModule: React.FC = () => {
  const { payslips, recalculatePayroll, currentRole, currentUser } = useHRM();
  const canViewSalary = ['ADMIN', 'EXECUTIVE_DIRECTOR', 'HR_MANAGER', 'HR_ADMIN'].includes(currentRole);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [activeTab, setActiveTab] = useState<'payroll' | 'formula_playground' | 'banking'>('payroll');
  const [isCalculated, setIsCalculated] = useState(false);

  // Playground formula test
  const [testFormula, setTestFormula] = useState('SA_PIT(35000000 - 15500000 - 6200000)');
  const [formulaResult, setFormulaResult] = useState<number | null>(null);

  const handleRunRecalculate = () => {
    recalculatePayroll();
    setIsCalculated(true);
    setTimeout(() => setIsCalculated(false), 3000);
  };

  const handleTestFormula = () => {
    const res = evaluateFormula(testFormula, {
      LUONG_CO_BAN: 30000000,
      CONG_THUC_TE: 22,
      GIO_OT: 4,
      LUONG_DONG_BH: 30000000,
    });
    setFormulaResult(res);
  };

  const totalCompanyPayroll = payslips.reduce((acc, p) => acc + p.netSalary, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-[#E2E8F0] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Quản Lý Tiền Lương & Formula Platform</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#ECFDF5] text-[#047857]">
              Luật Thuế TNCN 109/2025/QH15 (5 Bậc)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tự động tính thuế TNCN theo Luật 109/2025/QH15 (Giảm trừ bản thân 15.5tr, phụ thuộc 6.2tr, biểu thuế 5 bậc), bảo hiểm xã hội trần lương tham chiếu và chi lương qua MBBank
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['payroll', 'formula_playground', 'banking'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === tab
                  ? 'bg-[#047857] text-white shadow-sm shadow-orange-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab === 'payroll' && 'Bảng Lương Tổng Hợp'}
              {tab === 'formula_playground' && 'Bộ Máy Công Thức (Formula)'}
              {tab === 'banking' && 'Chi Lương Ngân Hàng (MBBank)'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'payroll' && (
        <div className="space-y-4">
      {/* Role Security Alert */}
      {!canViewSalary && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3 text-xs text-amber-900">
          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <strong>Phân Quyền Bảo Mật Lương:</strong> Bạn đang ở góc nhìn{' '}
            <span className="font-bold underline">{currentRole}</span>. Mức lương và bảo hiểm của toàn thể nhân viên được bảo mật tuyệt đối, chỉ <strong className="text-[#047857]">Ban Giám Đốc (BGĐ)</strong> và <strong className="text-[#047857]">Nhân Sự (HR/HCTH)</strong> mới có quyền xem toàn bộ. (Nhân viên chỉ xem được phiếu lương của chính mình).
          </div>
        </div>
      )}

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border border-[#E2E8F0] shadow-xs">
              <p className="text-xs text-slate-500 font-medium">Tổng Quỹ Lương Thực Nhận Tháng 08/2026</p>
              {canViewSalary ? (
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {totalCompanyPayroll.toLocaleString('vi-VN')} đ
                </p>
              ) : (
                <p className="text-lg font-black text-slate-400 mt-1 font-mono flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-slate-400" />
                  <span>****** đ (Bảo mật - Chỉ BGĐ & HR)</span>
                </p>
              )}
              <p className="text-[11px] text-emerald-600 mt-1 font-semibold">Đã bao gồm Thuế & Bảo hiểm</p>
            </div>

            <div className="p-4 bg-white rounded-lg border border-[#E2E8F0] shadow-xs">
              <p className="text-xs text-slate-500 font-medium">Quy Trình Phê Duyệt Bảng Lương</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                  4/4 Bước Đã Hoàn Tất
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Kế toán &gt; Giám đốc &gt; KTT &gt; Thủ quỹ</p>
            </div>

            <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-[#D1FAE5] shadow-xs flex flex-col justify-between">
              <div>
                <p className="text-xs text-orange-900 font-bold">Tính Toán Tự Động Bằng Formula Engine</p>
                <p className="text-[11px] text-[#047857] mt-0.5">Nạp dữ liệu công + KPI và chạy công thức</p>
              </div>
              <button
                onClick={handleRunRecalculate}
                className="mt-2 flex items-center justify-center gap-1.5 py-2 bg-[#047857] hover:bg-orange-700 text-white rounded-lg text-xs font-bold shadow-md shadow-orange-600/20 transition-all cursor-pointer"
              >
                <Calculator className="w-4 h-4" />
                <span>{isCalculated ? '✓ Đã Tính Toán Xong!' : 'Chạy Tính Lương Tự Động'}</span>
              </button>
            </div>
          </div>

          {/* Payroll Table */}
          <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F8FAFC] text-slate-600 border-b border-[#E2E8F0] font-semibold uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Nhân sự</th>
                    <th className="py-3 px-3">Lương cơ bản</th>
                    <th className="py-3 px-3">Ngày công</th>
                    <th className="py-3 px-3">Phụ cấp & KPI</th>
                    <th className="py-3 px-3">Tổng thu nhập</th>
                    <th className="py-3 px-3 text-rose-600">Bảo hiểm (10.5%)</th>
                    <th className="py-3 px-3 text-rose-600">Thuế TNCN</th>
                    <th className="py-3 px-4 text-emerald-700 font-bold">Thực nhận (Net)</th>
                    <th className="py-3 px-4 text-right">Phiếu lương</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payslips.map((p) => {
                    const isSelf = p.employeeId === currentUser.id;
                    const canView = canViewSalary || isSelf;

                    return (
                      <tr key={p.id} className="hover:bg-[#ECFDF5]/30">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div>
                              <p className="font-bold text-slate-900">{p.employeeName}</p>
                              <p className="text-[11px] text-slate-500 font-mono">{p.employeeCode} • {p.departmentName}</p>
                            </div>
                            {isSelf && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                                Bạn
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800">
                          {canView ? (
                            <span>{p.baseSalary.toLocaleString('vi-VN')} đ</span>
                          ) : (
                            <span className="font-mono text-slate-400 flex items-center gap-1 text-[11px]">
                              <Lock className="w-3 h-3 text-slate-400" /> ****** đ
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-bold text-emerald-600">{p.actualDays} công</td>
                        <td className="py-3 px-3 text-slate-700">
                          {canView ? (
                            <span>{(p.positionAllowance + p.lunchAllowance + p.kpiBonus + p.commission).toLocaleString('vi-VN')} đ</span>
                          ) : (
                            <span className="font-mono text-slate-400 text-[11px]">****** đ</span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-bold text-slate-900">
                          {canView ? (
                            <span>{p.totalIncome.toLocaleString('vi-VN')} đ</span>
                          ) : (
                            <span className="font-mono text-slate-400 text-[11px]">****** đ</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-rose-600 font-semibold">
                          {canView ? (
                            <span>-{p.totalInsurance.toLocaleString('vi-VN')} đ</span>
                          ) : (
                            <span className="font-mono text-slate-400 text-[11px]">****** đ</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-rose-600 font-semibold">
                          {canView ? (
                            <span>-{p.pitTax.toLocaleString('vi-VN')} đ</span>
                          ) : (
                            <span className="font-mono text-slate-400 text-[11px]">****** đ</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-black text-emerald-600 text-sm">
                          {canView ? (
                            <span>{p.netSalary.toLocaleString('vi-VN')} đ</span>
                          ) : (
                            <span className="font-mono text-slate-400 flex items-center gap-1 text-xs font-semibold">
                              <Lock className="w-3 h-3 text-slate-400" /> ****** đ
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {canView ? (
                            <button
                              onClick={() => setSelectedPayslip(p)}
                              className="px-3 py-1 bg-[#ECFDF5] hover:bg-[#ECFDF5] text-[#047857] rounded-lg font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Xem Phiếu</span>
                            </button>
                          ) : (
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-400 rounded-lg text-[10px] font-semibold inline-flex items-center gap-1">
                              <Lock className="w-3 h-3 text-slate-400" />
                              <span>Bảo mật</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Formula Platform Playground */}
      {activeTab === 'formula_playground' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#F1F5F9] pb-3">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <h3 className="font-bold text-slate-900 text-base">Hệ Thống Hàm Công Thức Động (Formula Platform)</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              1HRM xây dựng bộ Engine công thức trực quan, hỗ trợ tính toán phức tạp như biểu thuế lũy tiến từng phần, trích xuất dữ liệu từ KPI và Bảng công theo thời gian thực.
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">Biểu thức tính thử nghiệm:</label>
              <textarea
                rows={3}
                value={testFormula}
                onChange={(e) => setTestFormula(e.target.value)}
                className="w-full p-3 font-mono text-xs bg-slate-900 text-amber-400 rounded-lg focus:ring-2 focus:ring-[#047857] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handleTestFormula}
                className="px-4 py-2 bg-[#047857] hover:bg-orange-700 text-white rounded-lg text-xs font-bold shadow-md shadow-orange-600/20"
              >
                Chạy Kiểm Thử Biểu Thức
              </button>

              {formulaResult !== null && (
                <div className="text-right">
                  <span className="text-[11px] text-slate-500">Kết quả:</span>
                  <p className="text-base font-mono font-bold text-emerald-600">
                    {formulaResult.toLocaleString('vi-VN')} đ
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-[#F1F5F9] pb-2">
              Thư Viện Công Thức Mặc Định (1HRM System Presets)
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {SYSTEM_FORMULA_PRESETS.map((f, i) => (
                <div key={i} className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#047857]">{f.code}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-bold">
                      {f.category}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-800">{f.name}</p>
                  <p className="font-mono text-[11px] text-slate-600 bg-white p-1.5 rounded border border-[#F1F5F9]">
                    {f.expression}
                  </p>
                  <p className="text-[11px] text-slate-500 italic">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: MBBank Instant Payment */}
      {activeTab === 'banking' && (
        <div className="bg-white p-6 rounded-lg border border-[#E2E8F0] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                MB
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Thanh Toán Lương Tự Động & Bảo Mật MBBank</h3>
                <p className="text-xs text-slate-500">Tích hợp Open Banking API, chi lương 1 chạm tới hàng ngàn tài khoản</p>
              </div>
            </div>

            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-600/20">
              Xác Nhận Lệnh Chi Lương (MBBank)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
              <span className="text-slate-500">Tài khoản nguồn chi trả:</span>
              <p className="font-bold text-slate-900 mt-1">09878685758 - CÔNG TY CỔ PHẦN 1HRM</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">Số dư khả dụng: 5,450,000,000 đ</p>
            </div>

            <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
              <span className="text-slate-500">Số lượng người nhận:</span>
              <p className="font-bold text-slate-900 mt-1">{payslips.length} Nhân sự</p>
              <p className="text-[11px] text-slate-500 mt-1">Đã xác thực số tài khoản</p>
            </div>

            <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
              <span className="text-slate-500">Tổng số tiền chi đợt này:</span>
              <p className="font-black text-[#047857] text-lg mt-0.5">
                {totalCompanyPayroll.toLocaleString('vi-VN')} đ
              </p>
              <p className="text-[11px] text-slate-500">Kỳ lương: Tháng 08/2026</p>
            </div>
          </div>
        </div>
      )}

      {/* Payslip Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-2xl border border-[#E2E8F0] space-y-4">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">PHIẾU LƯƠNG ĐIỆN TỬ (PAYSLIP)</h2>
                <p className="text-xs text-slate-500 font-semibold">Kỳ lương: Tháng {selectedPayslip.month}</p>
              </div>
              <button onClick={() => setSelectedPayslip(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="p-4 bg-[#ECFDF5]/70 rounded-lg border border-[#D1FAE5] flex items-center justify-between">
              <div>
                <p className="text-xs text-orange-900 font-bold">{selectedPayslip.employeeName}</p>
                <p className="text-[11px] text-[#047857]">{selectedPayslip.departmentName} • {selectedPayslip.employeeCode}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-orange-800">Thực Nhận</span>
                <p className="text-xl font-black text-[#047857]">{selectedPayslip.netSalary.toLocaleString('vi-VN')} đ</p>
              </div>
            </div>

            <div className="space-y-3 text-xs divide-y divide-slate-100">
              <div className="pt-2 space-y-1 text-slate-700">
                <p className="font-bold text-slate-900">I. CÁC KHOẢN THU NHẬP</p>
                <div className="flex justify-between">
                  <span>Lương cơ bản (theo công {selectedPayslip.actualDays}/{selectedPayslip.standardDays}):</span>
                  <span className="font-semibold">{selectedPayslip.actualBaseSalary.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phụ cấp chức vụ & trách nhiệm:</span>
                  <span className="font-semibold">{selectedPayslip.positionAllowance.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phụ cấp ăn trưa:</span>
                  <span className="font-semibold">{selectedPayslip.lunchAllowance.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Thưởng hiệu suất KPI & Doanh số:</span>
                  <span className="font-semibold text-emerald-600">+{(selectedPayslip.kpiBonus + selectedPayslip.commission).toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1">
                  <span>Tổng thu nhập:</span>
                  <span>{selectedPayslip.totalIncome.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>

              <div className="pt-2 space-y-1 text-slate-700">
                <p className="font-bold text-slate-900">II. CÁC KHOẢN KHẤU TRỪ & THUẾ (LUẬT 109/2025/QH15)</p>
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>Giảm trừ gia cảnh bản thân:</span>
                  <span className="font-semibold text-emerald-700">-{selectedPayslip.personalDeduction.toLocaleString('vi-VN')} đ</span>
                </div>
                {selectedPayslip.dependentDeduction > 0 && (
                  <div className="flex justify-between text-slate-600 text-[11px]">
                    <span>Giảm trừ người phụ thuộc:</span>
                    <span className="font-semibold text-emerald-700">-{selectedPayslip.dependentDeduction.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
                <div className="flex justify-between text-rose-600">
                  <span>Bảo hiểm bắt buộc NLĐ (10.5%):</span>
                  <span>-{selectedPayslip.totalInsurance.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Thuế TNCN (Biểu lũy tiến 5 bậc Luật 109/2025/QH15):</span>
                  <span>-{selectedPayslip.pitTax.toLocaleString('vi-VN')} đ</span>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center font-bold text-slate-900 text-sm">
                <span>LƯƠNG CHUYỂN KHOẢN (NET):</span>
                <span className="text-emerald-600 font-black text-base">{selectedPayslip.netSalary.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-lg text-[11px] text-slate-500">
              Tài khoản nhận: <strong>{selectedPayslip.bankAccount}</strong> ({selectedPayslip.bankName})
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedPayslip(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
