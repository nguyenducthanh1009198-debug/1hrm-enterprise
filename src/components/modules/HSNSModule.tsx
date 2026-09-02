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
} from 'lucide-react';
import { useHRM } from '@/context/HRMContext';
import { Employee, LaborContract, AdminDecision } from '@/types';

export const HSNSModule: React.FC = () => {
  const { employees, departments, positions, addEmployee, currentRole } = useHRM();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [activeTab360, setActiveTab360] = useState<'profile' | 'contract' | 'performance' | 'assets' | 'decisions'>('profile');
  const [showAddModal, setShowAddModal] = useState(false);

  // New employee form state
  const [newEmpForm, setNewEmpForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    departmentId: 'dept-2',
    positionId: 'pos-4',
    baseSalary: 20000000,
    address: 'Hà Nội',
    joinDate: '2026-08-01',
    contractType: 'Có thời hạn 1 năm',
  });

  const filteredEmployees = employees.filter((emp) => {
    const matchSearch =
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.positionTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = selectedDept === 'ALL' || emp.departmentId === selectedDept;
    return matchSearch && matchDept;
  });

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    const dept = departments.find((d) => d.id === newEmpForm.departmentId);
    const pos = positions.find((p) => p.id === newEmpForm.positionId);

    addEmployee({
      fullName: newEmpForm.fullName,
      email: newEmpForm.email,
      phone: newEmpForm.phone,
      departmentId: newEmpForm.departmentId,
      departmentName: dept?.name || 'Khối Kỹ Thuật',
      positionId: newEmpForm.positionId,
      positionTitle: pos?.title || 'Chuyên viên',
      baseSalary: Number(newEmpForm.baseSalary),
      address: newEmpForm.address,
      contractType: newEmpForm.contractType,
    });

    setShowAddModal(false);
    setNewEmpForm({
      fullName: '',
      email: '',
      phone: '',
      departmentId: 'dept-2',
      positionId: 'pos-4',
      baseSalary: 20000000,
      address: 'Hà Nội',
      joinDate: '2026-08-01',
      contractType: 'Có thời hạn 1 năm',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Hồ Sơ Nhân Sự (HSNS 360°)</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-orange-100 text-orange-700">
              {employees.length} Nhân sự
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Số hóa & lưu trữ toàn bộ bức chân dung 360 độ nhân viên: Sơ yếu lý lịch, Hợp đồng, Ý thức, Năng suất, Tài sản & Khen thưởng
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold shadow-md shadow-orange-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Nhân Sự Mới</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 flex-1 min-w-[300px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo họ tên, mã nhân viên, chức danh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-700 font-medium"
            >
              <option value="ALL">Tất cả phòng ban ({departments.length})</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Employees Grid / Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Nhân sự</th>
                <th className="py-3.5 px-4">Mã NV</th>
                <th className="py-3.5 px-4">Phòng ban</th>
                <th className="py-3.5 px-4">Chức danh</th>
                <th className="py-3.5 px-4">Lương cơ bản</th>
                <th className="py-3.5 px-4">Hiệu suất</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  className="hover:bg-orange-50/40 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatar}
                        alt={emp.fullName}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
                      />
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{emp.fullName}</p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {emp.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">{emp.code}</td>
                  <td className="py-3.5 px-4 text-slate-700">{emp.departmentName}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-medium">
                      {emp.positionTitle}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {currentRole === 'HR_MANAGER' ? (
                      <span>{emp.baseSalary.toLocaleString('vi-VN')} đ</span>
                    ) : (
                      <span className="text-slate-400 font-mono flex items-center gap-1 text-[11px]" title="Chỉ HR mới xem được lương">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>****** đ</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            emp.workEfficiency >= 100
                              ? 'bg-emerald-500'
                              : emp.workEfficiency >= 90
                              ? 'bg-blue-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(100, emp.workEfficiency)}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-700">{emp.workEfficiency}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEmployee(emp);
                      }}
                      className="p-1.5 hover:bg-orange-100 rounded-lg text-orange-600 transition-colors inline-flex items-center gap-1 font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem 360°</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 360 Profile Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header with 360 Banner */}
            <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white relative">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                ✕
              </button>
              <div className="flex items-start gap-4">
                <img
                  src={selectedEmployee.avatar}
                  alt={selectedEmployee.fullName}
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-orange-500/40 shadow-lg"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{selectedEmployee.fullName}</h2>
                    <span className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-orange-500 text-white">
                      {selectedEmployee.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {selectedEmployee.positionTitle} • {selectedEmployee.departmentName}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-300">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-orange-400" />
                      {selectedEmployee.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-orange-400" />
                      {selectedEmployee.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-orange-400" />
                      Gia nhập: {selectedEmployee.joinDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* 360 Tabs */}
              <div className="flex items-center gap-2 mt-6 border-t border-slate-700/60 pt-4 overflow-x-auto text-xs">
                {[
                  { id: 'profile', label: 'Sơ yếu lý lịch & Liên hệ', icon: Users },
                  { id: 'contract', label: 'Hợp đồng & Ký số', icon: FileBadge },
                  { id: 'performance', label: 'Ý thức & Năng suất', icon: UserCheck },
                  { id: 'assets', label: 'Tài sản & Công nợ', icon: Laptop },
                  { id: 'decisions', label: 'Quyết định hành chính', icon: Award },
                ].map((t) => {
                  const Icon = t.icon;
                  const isActive = activeTab360 === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab360(t.id as any)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-220px)] space-y-6">
              {activeTab360 === 'profile' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <h3 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-2">
                      Thông tin cá nhân & Pháp lý
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-slate-600">
                      <span className="text-slate-500">Giới tính:</span>
                      <span className="font-semibold text-slate-800">{selectedEmployee.gender}</span>
                      <span className="text-slate-500">Ngày sinh:</span>
                      <span className="font-semibold text-slate-800">{selectedEmployee.birthday}</span>
                      <span className="text-slate-500">CCCD/Hộ chiếu:</span>
                      <span className="font-semibold text-slate-800">{selectedEmployee.idCard}</span>
                      <span className="text-slate-500">Mã số thuế:</span>
                      <span className="font-semibold text-slate-800">{selectedEmployee.taxCode}</span>
                      <span className="text-slate-500">Mã số BHXH:</span>
                      <span className="font-semibold text-slate-800">{selectedEmployee.socialInsuranceCode}</span>
                      <span className="text-slate-500">Địa chỉ thường trú:</span>
                      <span className="font-semibold text-slate-800">{selectedEmployee.address}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <h3 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-2">
                      Tài khoản Ngân hàng & Chi lương
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-slate-600">
                      <span className="text-slate-500">Ngân hàng:</span>
                      <span className="font-semibold text-slate-800">{selectedEmployee.bankName}</span>
                      <span className="text-slate-500">Số tài khoản:</span>
                      <span className="font-mono font-bold text-orange-600">{selectedEmployee.bankAccount}</span>
                      <span className="text-slate-500">Chi nhánh:</span>
                      <span className="font-semibold text-slate-800">{selectedEmployee.bankBranch}</span>
                      <span className="text-slate-500">Lương cơ bản:</span>
                      {currentRole === 'HR_MANAGER' ? (
                        <span className="font-bold text-slate-900">{selectedEmployee.baseSalary.toLocaleString('vi-VN')} đ</span>
                      ) : (
                        <span className="font-mono text-slate-400 flex items-center gap-1 text-xs">
                          <Lock className="w-3 h-3 text-slate-400" />
                          <span>****** đ (Chỉ HR)</span>
                        </span>
                      )}
                      <span className="text-slate-500">Phụ cấp cố định:</span>
                      {currentRole === 'HR_MANAGER' ? (
                        <span className="font-semibold text-slate-800">{selectedEmployee.allowance.toLocaleString('vi-VN')} đ</span>
                      ) : (
                        <span className="font-mono text-slate-400 flex items-center gap-1 text-xs">
                          <Lock className="w-3 h-3 text-slate-400" />
                          <span>****** đ (Chỉ HR)</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab360 === 'contract' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm">Danh sách Hợp đồng Lao động</h3>
                    <span className="text-xs px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                      Hợp đồng hiệu lực
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div>
                        <p className="font-bold text-slate-800 text-xs">HỢP ĐỒNG LAO ĐỘNG SỐ HĐ-2023/1HRM</p>
                        <p className="text-[11px] text-slate-500">Loại: {selectedEmployee.contractType}</p>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Đã ký số (Viettel CA)</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500">Ngày bắt đầu:</span>
                        <p className="font-semibold text-slate-800">{selectedEmployee.joinDate}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Lương đóng BHXH:</span>
                        {currentRole === 'HR_MANAGER' ? (
                          <p className="font-semibold text-slate-800">{selectedEmployee.baseSalary.toLocaleString('vi-VN')} đ</p>
                        ) : (
                          <p className="font-mono text-slate-400 flex items-center gap-1 text-xs">
                            <Lock className="w-3 h-3 text-slate-400" />
                            <span>****** đ (Chỉ HR)</span>
                          </p>
                        )}
                      </div>
                      <div>
                        <span className="text-slate-500">Người ký đại diện:</span>
                        <p className="font-semibold text-slate-800">Nguyễn Đức Minh (CEO)</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Tình trạng:</span>
                        <p className="font-semibold text-emerald-600">Đang lưu trữ điện tử</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab360 === 'performance' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-orange-50/60 p-4 rounded-xl border border-orange-200 text-center">
                    <p className="text-slate-600 font-medium">Hiệu suất công việc</p>
                    <p className="text-2xl font-black text-orange-600 mt-1">{selectedEmployee.workEfficiency}%</p>
                    <p className="text-[11px] text-slate-500 mt-1">Đạt chỉ tiêu đề ra</p>
                  </div>
                  <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 text-center">
                    <p className="text-slate-600 font-medium">Ý thức làm việc</p>
                    <p className="text-2xl font-black text-emerald-600 mt-1">{selectedEmployee.lateTimes} lần</p>
                    <p className="text-[11px] text-slate-500 mt-1">Đi muộn trong tháng</p>
                  </div>
                  <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200 text-center">
                    <p className="text-slate-600 font-medium">Số ngày phép còn lại</p>
                    <p className="text-2xl font-black text-blue-600 mt-1">{selectedEmployee.leaveDaysRemaining} / {selectedEmployee.totalLeaveDays}</p>
                    <p className="text-[11px] text-slate-500 mt-1">Ngày phép năm</p>
                  </div>
                </div>
              )}

              {activeTab360 === 'assets' && (
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Tài sản đang sử dụng</h3>
                  {selectedEmployee.assets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedEmployee.assets.map((ast) => (
                        <div key={ast.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-slate-800">{ast.name}</p>
                            <p className="text-[11px] text-slate-500 font-mono">Mã: {ast.code} • Cấp: {ast.assignedDate}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            {ast.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Chưa bàn giao tài sản thiết bị</p>
                  )}
                </div>
              )}

              {activeTab360 === 'decisions' && (
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Quyết định Hành chính & Khen thưởng</h3>
                  {selectedEmployee.decisions.length > 0 ? (
                    <div className="space-y-2">
                      {selectedEmployee.decisions.map((dec) => (
                        <div key={dec.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{dec.code}</span>
                              <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 font-bold text-[10px]">
                                {dec.type}
                              </span>
                            </div>
                            <p className="text-slate-600 mt-1">{dec.reason}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Hiệu lực: {dec.effectiveDate} • Người ban hành: {dec.issuedBy}</p>
                          </div>
                          {dec.amount && (
                            <span className="font-bold text-emerald-600 text-sm">
                              +{dec.amount.toLocaleString('vi-VN')} đ
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Chưa có quyết định hành chính nào</p>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Thêm Nhân Sự Mới</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Họ và tên *</label>
                <input
                  type="text"
                  required
                  value={newEmpForm.fullName}
                  onChange={(e) => setNewEmpForm({ ...newEmpForm, fullName: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email công ty *</label>
                  <input
                    type="email"
                    required
                    value={newEmpForm.email}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, email: e.target.value })}
                    placeholder="a.nguyen@1hrm.vn"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    value={newEmpForm.phone}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, phone: e.target.value })}
                    placeholder="0988..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phòng ban</label>
                  <select
                    value={newEmpForm.departmentId}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, departmentId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Chức danh</label>
                  <select
                    value={newEmpForm.positionId}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, positionId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    {positions.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lương cơ bản (VND)</label>
                  <input
                    type="number"
                    value={newEmpForm.baseSalary}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, baseSalary: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Loại hợp đồng</label>
                  <select
                    value={newEmpForm.contractType}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, contractType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Thử việc 2 tháng">Thử việc 2 tháng</option>
                    <option value="Có thời hạn 1 năm">Có thời hạn 1 năm</option>
                    <option value="Có thời hạn 3 năm">Có thời hạn 3 năm</option>
                    <option value="Không xác định thời hạn">Không xác định thời hạn</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold"
                >
                  Lưu Nhân Sự
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
