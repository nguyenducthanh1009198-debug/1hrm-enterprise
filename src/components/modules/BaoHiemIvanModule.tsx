'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  FileCheck,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Plus,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { useHRM } from '@/context/HRMContext';

export const BaoHiemIvanModule: React.FC = () => {
  const { ivanRecords, employees, currentRole } = useHRM();
  const [showDeclareModal, setShowDeclareModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Phân Hệ 1-IVAN: Bảo Hiểm Xã Hội Điện Tử</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#ECFDF5] text-[#047857]">
              Kết Nối BHXH Việt Nam
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kê khai, ký số điện tử và nộp hồ sơ bảo hiểm trực tuyến (Báo tăng, báo giảm, điều chỉnh mức đóng) liên thông trực tiếp với Cơ quan Bảo hiểm Xã hội
          </p>
        </div>

        <button
          onClick={() => setShowDeclareModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 btn-primary text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Hồ Sơ Kê Khai Mới</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-xs">
          <p className="text-slate-500 font-medium">Tổng số lao động tham gia BHXH</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{employees.length} / {employees.length}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">100% đã cấp mã định danh BHXH</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-xs">
          <p className="text-slate-500 font-medium">Hồ sơ đã nộp thành công</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {ivanRecords.filter((r) => r.status === 'Hồ sơ hợp lệ').length} Hồ sơ
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Cơ quan BHXH đã phê duyệt</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-xs">
          <p className="text-slate-500 font-medium">Chứng thư số Ký số IVAN</p>
          <p className="text-sm font-bold text-[#047857] mt-1 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#047857]" />
            Viettel-CA Cloud Sign (Hiệu lực 2028)
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Sẵn sàng ký số nộp online</p>
        </div>
      </div>

      {/* IVAN Submissions Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#F1F5F9] flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
            Lịch Sử Kê Khai & Trạng Thái Xử Lý Hồ Sơ Điện Tử
          </h3>
          <span className="text-xs text-slate-500 font-mono">Cổng kết nối: IVAN-BHXHVN-GATEWAY</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FAFC] text-slate-600 border-b border-[#E2E8F0] font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Mã hồ sơ</th>
                <th className="py-3 px-4">Kỳ kê khai</th>
                <th className="py-3 px-4">Người lao động</th>
                <th className="py-3 px-4">Nghiệp vụ</th>
                <th className="py-3 px-4">Mức lương đóng</th>
                <th className="py-3 px-4">Ngày nộp</th>
                <th className="py-3 px-4">Trạng thái tiếp nhận</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ivanRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-emerald-50/30">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{rec.code}</td>
                  <td className="py-3 px-4 text-slate-700">Tháng {rec.month}</td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{rec.employeeName}</p>
                    <p className="text-[11px] text-slate-500 font-mono">Mã BHXH: {rec.socialInsuranceCode}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[11px]">
                      {rec.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {currentRole === 'HR_MANAGER' ? (
                      <span>{rec.newSalary.toLocaleString('vi-VN')} đ</span>
                    ) : (
                      <span className="font-mono text-slate-400 flex items-center gap-1 text-[11px] font-normal" title="Chỉ HR mới có quyền xem mức lương đóng BHXH">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>****** đ</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{rec.submittedDate}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        rec.status === 'Hồ sơ hợp lệ'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
