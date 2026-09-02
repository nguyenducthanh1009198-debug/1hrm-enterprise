'use client';

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  GitBranch,
  ArrowRight,
  Filter,
  UserCheck,
  Building,
} from 'lucide-react';
import { useHRM } from '@/context/HRMContext';
import { RequestType } from '@/types';

export const DonTuModule: React.FC = () => {
  const { requests, createRequest, approveRequest, rejectRequest, currentRole, currentUser } = useHRM();
  const [filterType, setFilterType] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'bpa_builder'>('list');

  // Form state
  const [reqType, setReqType] = useState<RequestType>('LEAVE');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [durationDays, setDurationDays] = useState(1);
  const [durationHours, setDurationHours] = useState(0);
  const [reason, setReason] = useState('');

  const requestTypeNames: Record<RequestType, string> = {
    LEAVE: 'Đơn xin nghỉ phép năm',
    ABSENCE: 'Đơn vắng mặt giữa giờ',
    OVERTIME: 'Đơn làm thêm giờ (OT)',
    CHECKIN_OUT: 'Đơn giải trình quên chấm công',
    BUSINESS_TRIP: 'Đơn đăng ký công tác',
    SPECIAL_REGIME: 'Đơn làm việc theo chế độ (con nhỏ/thai sản)',
    SHIFT_CHANGE: 'Đơn xin đổi ca làm việc',
    RESIGNATION: 'Đơn xin thôi việc',
    SHIFT_REGISTER: 'Đơn đăng ký ca kíp',
    OTHER: 'Đơn đề xuất hành chính khác',
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRequest({
      type: reqType,
      typeName: requestTypeNames[reqType],
      startDate,
      endDate: endDate || startDate,
      durationDays: Number(durationDays),
      durationHours: Number(durationHours),
      reason,
    });
    setShowCreateModal(false);
    setReason('');
  };

  const filteredRequests = requests.filter((r) => {
    if (filterType === 'ALL') return true;
    return r.status === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Đơn Từ & Tự Động Hóa Quy Trình Duyệt (BPA)</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-orange-100 text-orange-700">
              10 Loại Đơn Mặc Định
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Loại bỏ hoàn toàn giấy tờ & email, nhân viên tạo đơn trên Mobile/Web, hệ thống tự động định tuyến duyệt đa cấp và đẩy dữ liệu sang Bảng công
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab(activeTab === 'list' ? 'bpa_builder' : 'list')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all cursor-pointer"
          >
            <GitBranch className="w-4 h-4 text-orange-600" />
            <span>{activeTab === 'list' ? 'Sơ Đồ Luồng Duyệt BPA' : 'Danh Sách Đơn Từ'}</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold shadow-md shadow-orange-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Đơn Mới</span>
          </button>
        </div>
      </div>

      {activeTab === 'bpa_builder' ? (
        /* Visual Workflow BPA Diagram */
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Sơ Đồ Luồng Phê Duyệt Tự Động (BPA Engine)</h3>
              <p className="text-xs text-slate-500">Quy trình rẽ nhánh tự động theo loại đơn và thẩm quyền duyệt</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold text-xs border border-emerald-200">
              Đang hoạt động (Active)
            </span>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 overflow-x-auto">
            {/* Step 1: Start */}
            <div className="p-4 bg-white rounded-xl border-2 border-orange-500 shadow-md text-center min-w-[180px]">
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold mx-auto flex items-center justify-center mb-2">
                1
              </div>
              <p className="font-bold text-slate-900 text-xs">Nhân Viên Nộp Đơn</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Mobile App / Web Portal</p>
            </div>

            <ArrowRight className="w-6 h-6 text-slate-400 shrink-0 hidden md:block" />

            {/* Step 2: Logic Rule */}
            <div className="p-4 bg-amber-50 rounded-xl border-2 border-amber-400 shadow-md text-center min-w-[200px]">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 font-bold mx-auto flex items-center justify-center mb-2">
                2
              </div>
              <p className="font-bold text-slate-900 text-xs">Quản Lý Trực Tiếp Duyệt</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Team Lead / Trưởng Phòng</p>
            </div>

            <ArrowRight className="w-6 h-6 text-slate-400 shrink-0 hidden md:block" />

            {/* Step 3: HR Verify */}
            <div className="p-4 bg-blue-50 rounded-xl border-2 border-blue-400 shadow-md text-center min-w-[200px]">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold mx-auto flex items-center justify-center mb-2">
                3
              </div>
              <p className="font-bold text-slate-900 text-xs">HR / C&B Xác Nhận</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Kiểm tra phép & chế độ</p>
            </div>

            <ArrowRight className="w-6 h-6 text-slate-400 shrink-0 hidden md:block" />

            {/* Step 4: Auto-sync */}
            <div className="p-4 bg-emerald-50 rounded-xl border-2 border-emerald-500 shadow-md text-center min-w-[200px]">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 font-bold mx-auto flex items-center justify-center mb-2">
                ✓
              </div>
              <p className="font-bold text-emerald-900 text-xs">Tự Động Cập Nhật Bảng Công</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">Đồng bộ sang Bảng Lương</p>
            </div>
          </div>
        </div>
      ) : (
        /* Requests List */
        <div className="space-y-4">
          <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-600">Lọc theo trạng thái:</span>
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterType(st)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  filterType === st
                    ? 'bg-orange-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'ALL' && 'Tất cả đơn'}
                {st === 'PENDING' && 'Chờ duyệt'}
                {st === 'APPROVED' && 'Đã phê duyệt'}
                {st === 'REJECTED' && 'Bị từ chối'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRequests.map((req) => {
              const canApprove = currentRole === 'ADMIN' || currentRole === 'HR_MANAGER' || currentRole === 'DEPARTMENT_LEAD';
              return (
                <div
                  key={req.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-orange-200 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{req.typeName}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                          {req.code}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Người gửi: <strong className="text-slate-800">{req.employeeName}</strong> • {req.departmentName}
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        req.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : req.status === 'PENDING'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {req.status === 'APPROVED' && 'Đã Duyệt'}
                      {req.status === 'PENDING' && 'Chờ Phê Duyệt'}
                      {req.status === 'REJECTED' && 'Đã Từ Chối'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 text-slate-700">
                    <p>
                      <strong>Thời gian:</strong> {req.startDate} {req.endDate ? `đến ${req.endDate}` : ''} ({req.durationDays ? `${req.durationDays} ngày` : `${req.durationHours} giờ`})
                    </p>
                    <p>
                      <strong>Lý do:</strong> {req.reason}
                    </p>
                    {req.approvalNote && (
                      <p className="text-emerald-700 pt-1 border-t border-slate-200 font-medium">
                        <strong>Ghi chú duyệt:</strong> {req.approvalNote}
                      </p>
                    )}
                  </div>

                  {/* Actions for Approvers */}
                  {req.status === 'PENDING' && canApprove && (
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => rejectRequest(req.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Từ Chối</span>
                      </button>
                      <button
                        onClick={() => approveRequest(req.id)}
                        className="flex items-center gap-1 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Phê Duyệt (1 Chạm)</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Tạo Đơn Từ Mới</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Loại đơn từ *</label>
                <select
                  value={reqType}
                  onChange={(e) => setReqType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                >
                  {Object.entries(requestTypeNames).map(([key, name]) => (
                    <option key={key} value={key}>{name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Từ ngày *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Đến ngày</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lý do cụ thể *</label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Nhập lý do chi tiết..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold shadow-md shadow-orange-600/20"
                >
                  Gửi Đơn Duyệt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
