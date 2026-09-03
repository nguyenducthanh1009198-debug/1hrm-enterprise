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
  Download,
  FileSpreadsheet,
  AlertCircle,
  Baby,
  Activity,
  Calendar,
  Briefcase,
  Flame,
  TreePine,
  Check,
  X
} from 'lucide-react';
import { useHRM } from '@/context/HRMContext';
import { RequestType } from '@/types';
import { exportBaoCaoDonTuVaNoiQuy } from '@/lib/exportEngine';

export const DonTuModule: React.FC = () => {
  const { requests, createRequest, approveRequest, rejectRequest, currentRole, currentUser } = useHRM();
  const [filterType, setFilterType] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'bpa_builder'>('list');

  // Form state for comprehensive incident requests
  const [reqType, setReqType] = useState<RequestType>('PHEP_NAM');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [durationDays, setDurationDays] = useState(1);
  const [durationHours, setDurationHours] = useState(0);
  const [lateMinutes, setLateMinutes] = useState(15);
  const [earlyMinutes, setEarlyMinutes] = useState(30);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState(3);
  const [hospitalCertCode, setHospitalCertCode] = useState('');
  const [tripDestination, setTripDestination] = useState('Nông Trường 1 (Bình Phước)');
  const [overtimeHours, setOvertimeHours] = useState(2);
  const [reason, setReason] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const requestTypeDefinitions: { id: RequestType; label: string; icon: any; color: string; desc: string }[] = [
    { id: 'DI_MUON', label: '1. Đơn giải trình đi muộn', icon: Clock, color: 'text-amber-600 bg-amber-50', desc: 'Đi muộn do kẹt xe, thời tiết hoặc việc đột xuất' },
    { id: 'VE_SOM', label: '2. Đơn xin về sớm', icon: Clock, color: 'text-amber-600 bg-amber-50', desc: 'Rời vị trí làm việc trước giờ kết thúc ca' },
    { id: 'CON_OM', label: '3. Đơn nghỉ chế độ con ốm (BHXH)', icon: Baby, color: 'text-pink-600 bg-pink-50', desc: 'Nghỉ chăm con ốm theo chế độ BHXH Luật Lao Động' },
    { id: 'OM_DAU', label: '4. Đơn nghỉ ốm đau bản thân', icon: Activity, color: 'text-rose-600 bg-rose-50', desc: 'Nghỉ điều trị ốm đau có giấy xác nhận của cơ sở y tế' },
    { id: 'PHEP_NAM', label: '5. Đơn xin nghỉ phép năm', icon: Calendar, color: 'text-blue-600 bg-blue-50', desc: 'Trừ vào quỹ 12 ngày phép năm tiêu chuẩn' },
    { id: 'NGHI_KHONG_LUONG', label: '6. Đơn nghỉ việc riêng không hưởng lương', icon: FileText, color: 'text-slate-600 bg-slate-100', desc: 'Nghỉ việc gia đình khi hết quỹ phép' },
    { id: 'THAI_SAN', label: '7. Đơn nghỉ thai sản / Khám thai / Dưỡng sức', icon: Baby, color: 'text-purple-600 bg-purple-50', desc: 'Nghỉ thai sản 6 tháng hoặc khám thai định kỳ' },
    { id: 'CONG_TAC', label: '8. Đơn đăng ký đi công tác nông trường', icon: Briefcase, color: 'text-emerald-600 bg-emerald-50', desc: 'Đi công tác khảo sát, chỉ đạo lô cạo nông trường' },
    { id: 'LAM_THEM_GIO', label: '9. Đơn đăng ký làm thêm giờ (OT)', icon: Flame, color: 'text-orange-600 bg-orange-50', desc: 'OT thu hoạch cao điểm / trực ca đêm nhà máy' },
    { id: 'CHOANG_LO', label: '10. Đơn đăng ký choàng lô / Cạo thay', icon: TreePine, color: 'text-emerald-700 bg-emerald-50', desc: 'Cạo thay diện tích lô cho công nhân nghỉ phép' },
    { id: 'GIAI_TRINH_CONG', label: '11. Đơn giải trình quên chấm công', icon: CheckCircle2, color: 'text-cyan-600 bg-cyan-50', desc: 'Quên check-in / lỗi thiết bị máy chấm công' },
  ];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedDef = requestTypeDefinitions.find((d) => d.id === reqType);
    let specificDetails = '';

    if (reqType === 'DI_MUON') {
      specificDetails = `Đi muộn: ${lateMinutes} phút`;
    } else if (reqType === 'VE_SOM') {
      specificDetails = `Về sớm: ${earlyMinutes} phút`;
    } else if (reqType === 'CON_OM') {
      specificDetails = `Con: ${childName || 'Con nhỏ'} (${childAge} tuổi) | Giấy viện C65: ${hospitalCertCode || 'Đã nộp bản cứng'}`;
    } else if (reqType === 'OM_DAU') {
      specificDetails = `Mã giấy viện / TTYT: ${hospitalCertCode || 'Giấy KSK TTYT'}`;
    } else if (reqType === 'CONG_TAC') {
      specificDetails = `Địa điểm: ${tripDestination}`;
    } else if (reqType === 'LAM_THEM_GIO') {
      specificDetails = `Làm thêm: ${overtimeHours} giờ (Hưởng 200% lương OT)`;
    } else if (reqType === 'CHOANG_LO') {
      specificDetails = 'Choàng lô cạo thay nhận phụ cấp sản lượng mủ';
    }

    createRequest({
      type: reqType,
      typeName: selectedDef?.label.replace(/^\d+\.\s*/, '') || 'Đơn phát sinh',
      startDate,
      endDate: endDate || startDate,
      durationDays: reqType === 'DI_MUON' || reqType === 'VE_SOM' ? 0 : Number(durationDays),
      durationHours: reqType === 'DI_MUON' ? lateMinutes / 60 : reqType === 'VE_SOM' ? earlyMinutes / 60 : durationHours,
      lateMinutes,
      earlyMinutes,
      childName,
      childAge,
      hospitalCertCode,
      tripDestination,
      overtimeHours,
      specificDetails,
      reason,
    });

    setShowCreateModal(false);
    setReason('');
    showToast('✓ Đã tạo đơn phát sinh thành công và chuyển quản lý phê duyệt!');
  };

  const handleExportExcel = () => {
    exportBaoCaoDonTuVaNoiQuy(requests);
    showToast('✓ Đã xuất Báo cáo Đơn từ phát sinh Excel chuẩn 1HRM Enterprise thành công!');
  };

  const filteredRequests = requests.filter((r) => {
    if (filterType === 'ALL') return true;
    return r.status === filterType;
  });

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
            <h1 className="text-xl font-bold text-slate-900">Quản Lý Đơn Từ & Các Sự Việc Phát Sinh</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-orange-100 text-orange-700">
              Chuẩn 1HRM Enterprise 11 Loại Đơn
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ghi nhận và tổng hợp tự động tất cả các trường hợp: Đi muộn, Về sớm, Con ốm, Ốm đau bản thân, Nghỉ phép, Thai sản, Công tác, OT & Choàng lô.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export Excel 1HRM Enterprise Button */}
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Xuất Excel Đơn Từ (1HRM Enterprise)</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Đơn Phát Sinh Mới</span>
          </button>
        </div>
      </div>

      {/* Incident Request Types Grid (Visual Directory) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Danh Mục Các Loại Đơn Phát Sinh Được Hệ Thống Tiếp Nhận & Tổng Hợp
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {requestTypeDefinitions.slice(0, 8).map((def) => (
            <div
              key={def.id}
              onClick={() => {
                setReqType(def.id);
                setShowCreateModal(true);
              }}
              className="p-2.5 rounded-xl border border-slate-200 hover:border-orange-400 bg-slate-50/70 hover:bg-orange-50/50 cursor-pointer transition-all flex items-start gap-2.5"
            >
              <div className={`p-2 rounded-lg shrink-0 ${def.color}`}>
                <def.icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-xs text-slate-900 truncate">{def.label}</p>
                <p className="text-[10px] text-slate-500 leading-tight line-clamp-1">{def.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-slate-700">Lọc theo trạng thái:</span>
            <div className="flex gap-1">
              {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterType(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    filterType === st
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {st === 'ALL' && 'Tất Cả'}
                  {st === 'PENDING' && 'Chờ Duyệt'}
                  {st === 'APPROVED' && 'Đã Duyệt'}
                  {st === 'REJECTED' && 'Từ Chối'}
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs text-slate-500 font-semibold">
            Tổng cộng: <b>{filteredRequests.length}</b> đơn
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                <th className="py-3 px-4">Mã Đơn</th>
                <th className="py-3 px-4">Nhân Sự Tạo Đơn</th>
                <th className="py-3 px-3">Loại Đơn Phát Sinh</th>
                <th className="py-3 px-3">Thời Gian / Thời Lượng</th>
                <th className="py-3 px-4">Chi Tiết Nghiệp Vụ & Lý Do</th>
                <th className="py-3 px-3">Người Duyệt</th>
                <th className="py-3 px-3 text-center">Trạng Thái</th>
                <th className="py-3 px-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">{req.code}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={req.employeeAvatar}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{req.employeeName}</p>
                        <p className="text-[10px] text-slate-500">{req.departmentName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-1 rounded-lg font-bold text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
                      {req.typeName}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-mono font-semibold text-slate-900">{req.startDate}</p>
                    <p className="text-[10px] text-slate-500 font-bold">
                      {req.durationDays > 0 ? `${req.durationDays} Ngày` : `${req.durationHours || 0} Giờ`}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    {req.specificDetails && (
                      <p className="font-bold text-blue-700 text-[11px] bg-blue-50/80 px-2 py-0.5 rounded mb-0.5">
                        {req.specificDetails}
                      </p>
                    )}
                    <p className="text-slate-600 italic">{req.reason}</p>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">{req.approverName || 'Chờ duyệt'}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                        req.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {req.status === 'APPROVED' && 'Đã Duyệt'}
                      {req.status === 'REJECTED' && 'Từ Chối'}
                      {req.status === 'PENDING' && 'Chờ Duyệt'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {req.status === 'PENDING' && (currentRole === 'ADMIN' || currentRole === 'HR_MANAGER' || currentRole === 'DEPARTMENT_LEAD' || currentRole === 'PLANTATION_DIRECTOR') ? (
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            approveRequest(req.id);
                            showToast(`✓ Đã duyệt đơn ${req.code}!`);
                          }}
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold"
                          title="Duyệt đơn"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            rejectRequest(req.id);
                            showToast(`✕ Đã từ chối đơn ${req.code}`);
                          }}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold"
                          title="Từ chối"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[10px]">--</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Request Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden space-y-4">
            <div className="p-5 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Tạo Đơn Phát Sinh & Chế Độ (Chuẩn 1HRM Enterprise)</h3>
                <p className="text-xs text-orange-100">Đi muộn, Về sớm, Con ốm, Ốm đau, Nghỉ phép, Công tác, OT...</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              {/* Type selector */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Loại Đơn Phát Sinh</label>
                <select
                  value={reqType}
                  onChange={(e) => setReqType(e.target.value as RequestType)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {requestTypeDefinitions.map((def) => (
                    <option key={def.id} value={def.id}>
                      {def.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Inputs based on request type */}
              {reqType === 'DI_MUON' && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                  <label className="font-bold text-amber-900 block">Số Phút Đi Muộn (Phút)</label>
                  <input
                    type="number"
                    value={lateMinutes}
                    onChange={(e) => setLateMinutes(Number(e.target.value))}
                    min="1"
                    max="480"
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg font-bold text-amber-950 bg-white"
                    required
                  />
                  <p className="text-[10px] text-amber-700">Ví dụ: 15 phút, 30 phút. Hệ thống sẽ tự trừ tương ứng trong bảng công.</p>
                </div>
              )}

              {reqType === 'VE_SOM' && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                  <label className="font-bold text-amber-900 block">Số Phút Về Sớm (Phút)</label>
                  <input
                    type="number"
                    value={earlyMinutes}
                    onChange={(e) => setEarlyMinutes(Number(e.target.value))}
                    min="1"
                    max="480"
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg font-bold text-amber-950 bg-white"
                    required
                  />
                </div>
              )}

              {reqType === 'CON_OM' && (
                <div className="p-3.5 bg-pink-50 rounded-xl border border-pink-200 space-y-3">
                  <p className="font-bold text-pink-900">Thông Tin Con & Giấy Viện BHXH (Mẫu C65-HD)</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-0.5">Họ Tên Con</label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Lê Gia Hưng"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-pink-300 rounded-lg bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-0.5">Tuổi Của Con</label>
                      <input
                        type="number"
                        value={childAge}
                        onChange={(e) => setChildAge(Number(e.target.value))}
                        min="0"
                        max="7"
                        className="w-full px-2.5 py-1.5 border border-pink-300 rounded-lg bg-white"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-0.5">Mã Số Giấy Chứng Nhận Nghỉ Việc Hưởng BHXH (C65-HD)</label>
                    <input
                      type="text"
                      placeholder="Mã số bệnh viện cấp (e.g. BV-NHI-C65-88992)"
                      value={hospitalCertCode}
                      onChange={(e) => setHospitalCertCode(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-pink-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              )}

              {reqType === 'OM_DAU' && (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 space-y-2">
                  <label className="font-bold text-rose-900 block">Mã Số Giấy Nghỉ Ốm Hưởng BHXH / Cơ Sở Y Tế</label>
                  <input
                    type="text"
                    placeholder="Mã số giấy C65-HD hoặc tên TTYT điều trị"
                    value={hospitalCertCode}
                    onChange={(e) => setHospitalCertCode(e.target.value)}
                    className="w-full px-3 py-2 border border-rose-300 rounded-lg bg-white"
                  />
                </div>
              )}

              {reqType === 'CONG_TAC' && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                  <label className="font-bold text-emerald-900 block">Địa Điểm & Mục Đích Công Tác</label>
                  <input
                    type="text"
                    value={tripDestination}
                    onChange={(e) => setTripDestination(e.target.value)}
                    className="w-full px-3 py-2 border border-emerald-300 rounded-lg bg-white font-semibold"
                    required
                  />
                </div>
              )}

              {reqType === 'LAM_THEM_GIO' && (
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-200 space-y-2">
                  <label className="font-bold text-orange-900 block">Số Giờ Đăng Ký Làm Thêm (OT)</label>
                  <input
                    type="number"
                    value={overtimeHours}
                    onChange={(e) => setOvertimeHours(Number(e.target.value))}
                    min="1"
                    max="12"
                    className="w-full px-3 py-2 border border-orange-300 rounded-lg bg-white font-bold"
                    required
                  />
                  <p className="text-[10px] text-orange-700">Hệ số lương OT sẽ tự động được cộng vào bảng lương tháng.</p>
                </div>
              )}

              {/* Date Pickers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Từ Ngày</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Đến Ngày (Nếu có)</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-slate-50 font-mono"
                  />
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Lý Do Chi Tiết</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ghi rõ diễn biến sự việc, thông tin chứng từ hoặc lý do phát sinh..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Gửi Đơn Lên Quản Lý
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
