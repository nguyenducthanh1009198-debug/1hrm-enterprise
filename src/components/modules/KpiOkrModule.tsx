'use client';

import React, { useState } from 'react';
import {
  Target,
  TrendingUp,
  Award,
  Plus,
  CheckCircle2,
  ChevronRight,
  Layers,
  Sparkles,
  Lock,
  Shield,
} from 'lucide-react';
import { useHRM } from '@/context/HRMContext';

export const KpiOkrModule: React.FC = () => {
  const { okrs, updateOKRProgress, currentRole } = useHRM();
  const isSeniorLeader = currentRole === 'ADMIN' || currentRole === 'HR_MANAGER' || currentRole === 'DEPARTMENT_LEAD';
  const [activeTab, setActiveTab] = useState<'okr' | 'kpi'>('okr');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Quản Trị Mục Tiêu OKR & Hiệu Suất KPI</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-purple-100 text-purple-700">
              Cây Mục Tiêu Đa Tầng
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Liên kết mục tiêu công ty &gt; phòng ban &gt; cá nhân, cập nhật tiến độ Key Results thời gian thực và liên thông tự động sang Bảng lương
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['okr', 'kpi'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === tab
                  ? 'bg-[#047857] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab === 'okr' && 'Cây Mục Tiêu OKR'}
              {tab === 'kpi' && 'Thư Viện Tiêu Chí KPI'}
            </button>
          ))}
        </div>
      </div>

            {/* Subtab OKR Tree */}
      {activeTab === 'okr' && (
        <div className="space-y-4">
          {/* Role Permission Alert */}
          {!isSeniorLeader ? (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <strong>Chế Độ Chỉ Xem Mục Tiêu:</strong> Bạn đang ở góc nhìn{' '}
                <span className="font-bold underline">{currentRole}</span>. Chỉ các cấp quản lý cao (Admin, Trưởng Phòng Nhân Sự, Trưởng Bộ Phận) mới có quyền chỉnh sửa và cập nhật tiến độ cây mục tiêu OKR.
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Bạn đang đăng nhập với quyền <strong>{currentRole}</strong> (Có toàn quyền cập nhật & điều chỉnh tiến độ OKR).</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-200/60 font-bold text-[10px] text-emerald-800">
                Quyền Quản Trị
              </span>
            </div>
          )}

          {okrs.map((obj) => (
            <div
              key={obj.id}
              className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1F5F9] pb-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                      obj.level === 'COMPANY'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {obj.level === 'COMPANY' ? 'CẤP CÔNG TY' : 'CẤP PHÒNG BAN'}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">{obj.title}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-32 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${obj.progress}%` }}
                    />
                  </div>
                  <span className="font-black text-[#047857] text-sm">{obj.progress}%</span>
                </div>
              </div>

              {/* Key Results List */}
              <div className="space-y-2.5 pl-2 sm:pl-4">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  KẾT QUẢ THEN CHỐT (KEY RESULTS):
                </p>
                {obj.keyResults.map((kr) => (
                  <div
                    key={kr.id}
                    className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{kr.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Mục tiêu: {kr.targetValue.toLocaleString('vi-VN')} {kr.unit} • Trọng số: {kr.weight}%
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 text-[11px]">Đạt được:</span>
                        <input
                          type="number"
                          disabled={!isSeniorLeader}
                          value={kr.currentValue}
                          onChange={(e) => updateOKRProgress(kr.id, Number(e.target.value))}
                          title={!isSeniorLeader ? 'Chỉ cấp quản lý mới có quyền sửa tiến độ' : 'Nhập tiến độ mới'}
                          className={`w-24 px-2 py-1 rounded font-bold text-right transition-all ${
                            isSeniorLeader
                              ? 'bg-white border border-slate-300 text-slate-900 focus:ring-2 focus:ring-[#047857] focus:border-[#047857] cursor-text'
                              : 'bg-slate-100 border border-[#E2E8F0] text-slate-500 cursor-not-allowed select-none'
                          }`}
                        />
                        <span className="font-semibold text-slate-600">{kr.unit}</span>
                      </div>

                      <span className="font-bold text-emerald-600 text-xs min-w-[45px] text-right">
                        {kr.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subtab KPI */}
      {activeTab === 'kpi' && (
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
            <h3 className="font-bold text-slate-900 text-sm">Thư Viện Tiêu Chí Đánh Giá KPI Tự Động</h3>
            <span className="text-xs text-slate-500 font-semibold">Tự động chấm điểm 80% chỉ số</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { code: 'KPI_DOANH_THU', name: 'Doanh thu ký mới tháng', source: 'Lấy từ CRM/Hợp đồng', target: '300,000,000 đ', weight: '40%' },
              { code: 'KPI_TY_LE_CHUYEN_DOI', name: 'Tỷ lệ khách hàng quay lại', source: 'Tự động tính từ đơn hàng', target: '35%', weight: '20%' },
              { code: 'KPI_SO_BUG_PROD', name: 'Số lỗi phát sinh trên môi trường Live', source: 'Lấy từ Jira/Gitlab API', target: '0 lỗi', weight: '20%' },
              { code: 'KPI_DUNG_HAN_CV', name: 'Tỷ lệ hoàn thành công việc đúng hạn', source: 'Lấy từ Phân hệ Công việc', target: '95%', weight: '20%' },
            ].map((kpi, i) => (
              <div key={i} className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#047857]">{kpi.code}</span>
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold">
                    Trọng số: {kpi.weight}
                  </span>
                </div>
                <p className="font-bold text-slate-900">{kpi.name}</p>
                <p className="text-slate-500">Nguồn thu thập: {kpi.source}</p>
                <p className="text-emerald-600 font-semibold">Chỉ tiêu yêu cầu: {kpi.target}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
