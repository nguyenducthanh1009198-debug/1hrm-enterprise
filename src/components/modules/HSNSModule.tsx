'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  FileBadge,
  Award,
  CreditCard,
  Briefcase,
  ShieldCheck,
  Lock,
  Calendar,
  Building,
  UserCheck,
  ChevronRight,
  Eye,
  Mail,
  Phone,
  MapPin,
  FileText,
  Clock,
  Laptop,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Upload,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import { useHRM } from '@/context/HRMContext';
import { Employee, LaborContract, AdminDecision } from '@/types';
import { exportBaoCaoNhanSuTongHop } from '@/lib/exportEngine';

export const HSNSModule: React.FC = () => {
  const { employees, departments, positions, addEmployee, updateEmployee, toggleDocumentUpload, currentRole } = useHRM();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [profileStatusFilter, setProfileStatusFilter] = useState<'ALL' | 'INCOMPLETE' | 'COMPLETE'>('ALL');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [activeTab360, setActiveTab360] = useState<'profile' | 'checklist' | 'contract' | 'performance' | 'assets'>('profile');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New employee form state
  const [newEmpForm, setNewEmpForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    idCard: '',
    birthday: '1998-01-01',
    gender: 'Nam' as 'Nam' | 'Nữ',
    departmentId: 'dept-2',
    positionId: 'pos-5',
    baseSalary: 15000000,
    address: 'Hà Nội',
    joinDate: new Date().toISOString().split('T')[0],
    contractType: 'Có thời hạn 1 năm',
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchSearch =
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.positionTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = selectedDept === 'ALL' || emp.departmentId === selectedDept;
    const matchProfile =
      profileStatusFilter === 'ALL'
        ? true
        : profileStatusFilter === 'INCOMPLETE'
        ? emp.isProfileComplete === false
        : emp.isProfileComplete !== false;
    return matchSearch && matchDept && matchProfile;
  });

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const dept = departments.find((d) => d.id === newEmpForm.departmentId);
    const pos = positions.find((p) => p.id === newEmpForm.positionId);

    addEmployee({
      fullName: newEmpForm.fullName,
      email: newEmpForm.email,
      phone: newEmpForm.phone,
      idCard: newEmpForm.idCard || '001098000000',
      birthday: newEmpForm.birthday,
      gender: newEmpForm.gender,
      departmentId: newEmpForm.departmentId,
      departmentName: dept?.name || 'Nông Trường 1 (Bình Phước)',
      positionId: newEmpForm.positionId,
      positionTitle: pos?.title || 'Công Nhân Cạo Mủ',
      baseSalary: Number(newEmpForm.baseSalary),
      address: newEmpForm.address,
      contractType: newEmpForm.contractType,
      profileCompleteness: 60,
      isProfileComplete: false,
      missingDocuments: ['Bản sao CCCD 2 mặt', 'Giấy khám sức khỏe', 'Sổ BHXH'],
    });

    setShowAddModal(false);
    showToast('✓ Đã tiếp nhận nhân sự mới! Hệ thống tự động kích hoạt cảnh báo thiếu hồ sơ.');
  };

  const handleExportExcel = () => {
    exportBaoCaoNhanSuTongHop(employees);
    showToast('✓ Đã xuất file Báo cáo Nhân sự Tổng hợp Excel chuẩn 1HRM Enterprise thành công!');
  };

  const incompleteCount = employees.filter((e) => e.isProfileComplete === false).length;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-500 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Hồ Sơ Nhân Sự (HSNS 360°) & Onboarding</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-orange-100 text-orange-700">
              {employees.length} Nhân Sự
            </span>
            {incompleteCount > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> {incompleteCount} Hồ sơ cần bổ sung
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý hồ sơ số hóa toàn diện: Tự động fill thông tin Onboard từ tuyển dụng, theo dõi checklist tài liệu còn thiếu và xuất báo cáo chuẩn 1HRM Enterprise.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export Excel 1HRM Enterprise Button */}
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Xuất Excel Nhân Sự (1HRM Enterprise)</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tiếp Nhận Nhân Sự Mới</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 w-full md:w-80">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo họ tên, mã NV, vị trí..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <span className="font-bold text-slate-700 shrink-0">Bộ lọc hồ sơ:</span>
          <button
            onClick={() => setProfileStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
              profileStatusFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất Cả ({employees.length})
          </button>

          <button
            onClick={() => setProfileStatusFilter('INCOMPLETE')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              profileStatusFilter === 'INCOMPLETE'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Chưa Đủ Hồ Sơ ({incompleteCount})
          </button>

          <button
            onClick={() => setProfileStatusFilter('COMPLETE')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
              profileStatusFilter === 'COMPLETE'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ✓ Đã Đầy Đủ ({employees.length - incompleteCount})
          </button>
        </div>
      </div>

      {/* Incomplete Profile Alert Callout */}
      {incompleteCount > 0 && profileStatusFilter !== 'COMPLETE' && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 text-xs text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-amber-950">
              Cảnh Báo Quản Trị: Có {incompleteCount} nhân sự mới Onboard chưa nộp đủ giấy tờ theo quy định
            </h4>
            <p className="text-amber-800 leading-relaxed">
              Các giấy tờ còn thiếu phổ biến gồm: <b>Bản sao CCCD công chứng, Giấy khám sức khỏe định kỳ & Sổ BHXH gốc</b>. Bấm vào chi tiết nhân viên để xem Checklist và cập nhật trạng thái khi nhân sự nộp bổ sung.
            </p>
          </div>
        </div>
      )}

      {/* Employees Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                <th className="py-3 px-4">Nhân Sự</th>
                <th className="py-3 px-3">Phòng Ban / Nông Trường</th>
                <th className="py-3 px-3">Vị Trí Chức Danh</th>
                <th className="py-3 px-3">Hợp Đồng / Vào Làm</th>
                <th className="py-3 px-4 text-center">Tiến Độ Hồ Sơ</th>
                <th className="py-3 px-4">Cảnh Báo Giấy Tờ Thiếu</th>
                <th className="py-3 px-4 text-center">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredEmployees.map((emp) => {
                const completeness = emp.profileCompleteness || 100;
                const isComplete = emp.isProfileComplete !== false;

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-xs"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{emp.fullName}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{emp.code} • {emp.phone}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-semibold text-slate-700">{emp.departmentName}</td>
                    <td className="py-3 px-3 text-slate-900 font-medium">{emp.positionTitle}</td>

                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800">{emp.contractType}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Ngày vào: {emp.joinDate}</p>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex flex-col items-center gap-1 w-24">
                        <div className="flex justify-between w-full text-[10px] font-bold">
                          <span className={isComplete ? 'text-emerald-700' : 'text-amber-700'}>
                            {completeness}%
                          </span>
                          <span className="text-slate-400">{isComplete ? 'Đủ' : 'Thiếu'}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isComplete ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${completeness}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {isComplete ? (
                        <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 text-[11px] inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Hồ sơ hợp lệ 100%
                        </span>
                      ) : (
                        <div className="space-y-0.5">
                          <span className="px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-900 text-[10px] inline-flex items-center gap-1 border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-600" /> Chưa đủ giấy tờ
                          </span>
                          <p className="text-[10px] text-slate-500 italic truncate max-w-xs">
                            Thiếu: {emp.missingDocuments?.join(', ')}
                          </p>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedEmployee(emp)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-orange-50 text-slate-700 hover:text-orange-600 font-bold text-xs transition-all"
                      >
                        Xem 360°
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 360° Profile Modal with Checklist */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden space-y-4 max-h-[85vh] flex flex-col">
            <div className="p-5 bg-gradient-to-r from-slate-950 to-orange-950 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={selectedEmployee.avatar}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover border-2 border-orange-500 shadow-md"
                />
                <div>
                  <h3 className="font-black text-base">{selectedEmployee.fullName}</h3>
                  <p className="text-xs text-slate-300 font-mono">
                    {selectedEmployee.code} • {selectedEmployee.positionTitle} - {selectedEmployee.departmentName}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedEmployee(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-tabs */}
            <div className="px-5 flex gap-2 border-b border-slate-100 shrink-0">
              <button
                onClick={() => setActiveTab360('profile')}
                className={`pb-2.5 font-bold text-xs border-b-2 transition-all ${
                  activeTab360 === 'profile'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                1. Thông Tin Lý Lịch
              </button>

              <button
                onClick={() => setActiveTab360('checklist')}
                className={`pb-2.5 font-bold text-xs border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab360 === 'checklist'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                2. Checklist Hồ Sơ Onboard
                {selectedEmployee.isProfileComplete === false && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {activeTab360 === 'profile' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <p className="text-slate-400 font-semibold text-[10px]">Email & Số Điện Thoại</p>
                    <p className="font-bold text-slate-900">{selectedEmployee.email}</p>
                    <p className="font-mono text-slate-700">{selectedEmployee.phone}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <p className="text-slate-400 font-semibold text-[10px]">Số CCCD & Ngày Cấp</p>
                    <p className="font-mono font-bold text-slate-900">{selectedEmployee.idCard}</p>
                    <p className="text-slate-600">{selectedEmployee.idCardPlace}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <p className="text-slate-400 font-semibold text-[10px]">Địa Chỉ Thường Trú</p>
                    <p className="font-bold text-slate-900">{selectedEmployee.address}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                    <p className="text-slate-400 font-semibold text-[10px]">Tài Khoản Ngân Hàng</p>
                    <p className="font-bold text-slate-900">{selectedEmployee.bankName}</p>
                    <p className="font-mono text-slate-700">{selectedEmployee.bankAccount}</p>
                  </div>
                </div>
              )}

              {activeTab360 === 'checklist' && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-xl border border-orange-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-orange-950 text-sm">Tiến Độ Hoàn Tất Hồ Sơ Nhân Viên</p>
                      <p className="text-xs text-orange-800">
                        {selectedEmployee.isProfileComplete !== false
                          ? '✓ Nhân sự đã nộp đầy đủ 100% hồ sơ giấy tờ gốc'
                          : `⚠️ Chưa hoàn thiện: Còn thiếu ${selectedEmployee.missingDocuments?.length} loại giấy tờ`}
                      </p>
                    </div>
                    <span className="text-xl font-black text-orange-600 font-mono">
                      {selectedEmployee.profileCompleteness || 100}%
                    </span>
                  </div>

                  <div className="space-y-2">
                    {[
                      'Bản sao CCCD 2 mặt (Công chứng)',
                      'Giấy khám sức khỏe định kỳ (Dưới 6 tháng)',
                      'Bản sao Bằng cấp chuyên môn',
                      'Sổ Bảo Hiểm Xã Hội gốc',
                    ].map((docName) => {
                      const isMissing = selectedEmployee.missingDocuments?.includes(docName);
                      return (
                        <div
                          key={docName}
                          onClick={() => {
                            toggleDocumentUpload(selectedEmployee.id, docName);
                            showToast(`✓ Đã cập nhật trạng thái giấy tờ "${docName}"!`);
                          }}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isMissing
                              ? 'bg-amber-50/60 border-amber-300 hover:bg-amber-100/70'
                              : 'bg-emerald-50/60 border-emerald-300 hover:bg-emerald-100/70'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs ${
                                isMissing ? 'bg-amber-200 text-amber-800' : 'bg-emerald-600 text-white'
                              }`}
                            >
                              {isMissing ? '!' : '✓'}
                            </span>
                            <div>
                              <p className={`font-bold ${isMissing ? 'text-amber-950' : 'text-emerald-950'}`}>
                                {docName}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                {isMissing ? 'Chưa nộp (Bấm để đánh dấu đã nhận)' : 'Đã tiếp nhận hợp lệ'}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                              isMissing
                                ? 'bg-amber-200/80 text-amber-900'
                                : 'bg-emerald-200/80 text-emerald-900'
                            }`}
                          >
                            {isMissing ? 'Cần bổ sung' : 'Đã nộp'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden space-y-4">
            <div className="p-5 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Tiếp Nhận Nhân Sự Mới (Onboarding)</h3>
                <p className="text-xs text-orange-100">Hệ thống sẽ tự động gán mã và kích hoạt checklist hồ sơ</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Họ Và Tên</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Nguyễn Văn An"
                    value={newEmpForm.fullName}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Số CCCD / CMND</label>
                  <input
                    type="text"
                    placeholder="12 số CCCD"
                    value={newEmpForm.idCard}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, idCard: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={newEmpForm.email}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Số Điện Thoại</label>
                  <input
                    type="text"
                    value={newEmpForm.phone}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phòng Ban / Nông Trường</label>
                  <select
                    value={newEmpForm.departmentId}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, departmentId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold text-slate-800"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mức Lương Cơ Bản (VNĐ)</label>
                  <input
                    type="number"
                    value={newEmpForm.baseSalary}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, baseSalary: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Nhân sự mới sẽ được kích hoạt cảnh báo thiếu hồ sơ cho tới khi nộp đủ CCCD, Giấy KSK và Sổ BHXH.</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Xác Nhận Onboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
