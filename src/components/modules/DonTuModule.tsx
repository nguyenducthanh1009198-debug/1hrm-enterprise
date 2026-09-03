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
  X,
  Bell,
  DollarSign,
  Layers,
  Sparkles,
  ChevronRight,
  AlertTriangle,
  Lock,
  Cpu,
  Zap,
  RotateCw
} from 'lucide-react';
import { useHRM } from '@/context/HRMContext';
import { RequestType } from '@/types';
import { exportBaoCaoDonTuVaNoiQuy } from '@/lib/exportEngine';

export const DonTuModule: React.FC = () => {
  const { requests, createRequest, approveRequest, rejectRequest, currentRole, currentUser, payslips } = useHRM();
  const [filterType, setFilterType] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'my_requests' | 'all_requests' | 'leave_balance' | 'workflow_tracking'>('my_requests');

  // Form states for comprehensive incident requests
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
  const [tripVehicle, setTripVehicle] = useState('Xe công vụ công ty');
  const [otStartTime, setOtStartTime] = useState('18:00');
  const [otEndTime, setOtEndTime] = useState('21:00');
  const [overtimeHours, setOvertimeHours] = useState(3);
  const [missedTimeType, setMissedTimeType] = useState<'MAY_HONG' | 'MAT_DIEN' | 'QUEN_QUET_THE'>('QUEN_QUET_THE');
  const [missedTimeIn, setMissedTimeIn] = useState('08:00');
  const [missedTimeOut, setMissedTimeOut] = useState('17:30');
  const [reason, setReason] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const isExecutiveOrHR = ['ADMIN', 'EXECUTIVE_DIRECTOR', 'HR_MANAGER', 'HR_ADMIN'].includes(currentRole);
  const myPayslip = payslips.find((p) => p.employeeId === currentUser.id) || payslips[0];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const requestTypeDefinitions: { id: RequestType; label: string; icon: any; color: string; desc: string; category: string }[] = [
    { id: 'PHEP_NAM', label: '1. Đơn xin nghỉ phép năm', icon: Calendar, color: 'text-blue-600 bg-blue-50', desc: 'Trừ vào quỹ 12 ngày phép năm tiêu chuẩn', category: 'NGHI_PHEP' },
    { id: 'OM_DAU', label: '2. Đơn nghỉ ốm đau bản thân', icon: Activity, color: 'text-rose-600 bg-rose-50', desc: 'Nghỉ điều trị ốm đau có giấy xác nhận của cơ sở y tế', category: 'NGHI_PHEP' },
    { id: 'CON_OM', label: '3. Đơn nghỉ chế độ con ốm (BHXH)', icon: Baby, color: 'text-pink-600 bg-pink-50', desc: 'Nghỉ chăm con ốm theo chế độ BHXH Luật Lao Động (Mẫu C65-HD)', category: 'NGHI_PHEP' },
    { id: 'NGHI_KHONG_LUONG', label: '4. Đơn nghỉ việc riêng (Có lương / Không lương)', icon: FileText, color: 'text-slate-600 bg-slate-100', desc: 'Nghỉ việc gia đình, cưới hỏi, tang chế', category: 'NGHI_PHEP' },
    { id: 'THAI_SAN', label: '5. Đơn nghỉ thai sản / Khám thai', icon: Baby, color: 'text-purple-600 bg-purple-50', desc: 'Nghỉ thai sản 6 tháng hoặc khám thai định kỳ', category: 'NGHI_PHEP' },
    { id: 'GIAI_TRINH_CONG', label: '6. Đơn giải trình chấm công (Bổ sung công)', icon: CheckCircle2, color: 'text-cyan-600 bg-cyan-50', desc: 'Dùng khi máy chấm công hỏng, mất điện, hoặc quên quẹt thẻ/vân tay', category: 'CONG_CA' },
    { id: 'CONG_TAC', label: '7. Đơn công tác / Làm việc bên ngoài', icon: Briefcase, color: 'text-emerald-600 bg-emerald-50', desc: 'Ghi rõ địa điểm, thời gian ra ngoài xử lý công việc', category: 'CONG_CA' },
    { id: 'LAM_THEM_GIO', label: '8. Đơn đăng ký làm thêm giờ (OT)', icon: Flame, color: 'text-orange-600 bg-orange-50', desc: 'Ghi rõ khung giờ và lý do tăng ca (Hưởng 150% - 200% lương OT)', category: 'CONG_CA' },
    { id: 'DI_MUON', label: '9. Đơn giải trình đi muộn', icon: Clock, color: 'text-amber-600 bg-amber-50', desc: 'Đi muộn do kẹt xe, thời tiết hoặc việc đột xuất', category: 'CONG_CA' },
    { id: 'VE_SOM', label: '10. Đơn xin về sớm', icon: Clock, color: 'text-amber-600 bg-amber-50', desc: 'Rời vị trí làm việc trước giờ kết thúc ca', category: 'CONG_CA' },
    { id: 'CHOANG_LO', label: '11. Đơn đăng ký choàng lô / Cạo thay', icon: TreePine, color: 'text-emerald-700 bg-emerald-50', desc: 'Cạo thay diện tích lô nhận phụ cấp sản lượng mủ', category: 'NONG_TRUONG' },
  ];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedDef = requestTypeDefinitions.find((d) => d.id === reqType);
    let specificDetails = '';

    if (reqType === 'GIAI_TRINH_CONG') {
      const reasonType =
        missedTimeType === 'MAY_HONG'
          ? 'Máy chấm công hỏng'
          : missedTimeType === 'MAT_DIEN'
          ? 'Tòa nhà mất điện'
          : 'Quên quẹt thẻ / vân tay';
      specificDetails = `Bổ sung giờ: Vào ${missedTimeIn} - Ra ${missedTimeOut} (${reasonType})`;
    } else if (reqType === 'CONG_TAC') {
      specificDetails = `Địa điểm: ${tripDestination} | Phương tiện: ${tripVehicle}`;
    } else if (reqType === 'LAM_THEM_GIO') {
      specificDetails = `Khung giờ OT: ${otStartTime} đến ${otEndTime} (${overtimeHours} giờ) | Hưởng 200% lương`;
    } else if (reqType === 'DI_MUON') {
      specificDetails = `Đi muộn: ${lateMinutes} phút`;
    } else if (reqType === 'VE_SOM') {
      specificDetails = `Về sớm: ${earlyMinutes} phút`;
    } else if (reqType === 'CON_OM') {
      specificDetails = `Con: ${childName || 'Bé nhỏ'} (${childAge} tuổi) | Giấy viện C65-HD: ${hospitalCertCode || 'Đã nộp bản cứng'}`;
    } else if (reqType === 'OM_DAU') {
      specificDetails = `Mã giấy viện / TTYT: ${hospitalCertCode || 'Giấy khám TTYT'}`;
    } else if (reqType === 'CHOANG_LO') {
      specificDetails = 'Choàng lô cạo thay nhận phụ cấp sản lượng mủ';
    }

    createRequest({
      type: reqType,
      typeName: selectedDef?.label.replace(/^\d+\.\s*/, '') || 'Đơn phát sinh',
      startDate,
      endDate: endDate || startDate,
      durationDays: reqType === 'DI_MUON' || reqType === 'VE_SOM' ? 0 : Number(durationDays),
      durationHours: reqType === 'DI_MUON' ? lateMinutes / 60 : reqType === 'VE_SOM' ? earlyMinutes / 60 : reqType === 'LAM_THEM_GIO' ? overtimeHours : 0,
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
    showToast('✓ Đã tạo đơn điện tử thành công và chuyển lên Trưởng phòng phê duyệt!');
  };

  const handleExportExcel = () => {
    exportBaoCaoDonTuVaNoiQuy(requests);
    showToast('✓ Đã xuất Báo cáo Đơn từ phát sinh Excel thành công!');
  };

  const myRequests = requests.filter((r) => r.employeeId === currentUser.id || r.employeeName === currentUser.fullName);
  const displayRequests = activeTab === 'my_requests' ? myRequests : requests;

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
            <h1 className="text-xl font-bold text-slate-900">Quản Lý Đơn Từ Điện Tử (Không Giấy) & Workflow BPA</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-orange-100 text-orange-700">
              100% Số Hóa Không Dùng Giấy
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quy trình phê duyệt tự động 3 bước: <b>[1] Chờ Trưởng phòng duyệt</b> $\rightarrow$ <b>[2] Chờ HCTH xác nhận</b> $\rightarrow$ <b>[3] Đã duyệt & Đồng bộ bảng lương</b>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isExecutiveOrHR && (
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Xuất Sổ Đơn Từ (.xlsx)</span>
            </button>
          )}

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Đơn Điện Tử Mới</span>
          </button>
        </div>
      </div>

      {/* Tra cứu Quỹ Ngày Phép & Tiện ích Khối Văn Phòng */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">Quỹ Phép Năm Chuẩn</p>
            <p className="text-lg font-black text-slate-900 mt-0.5">12 Ngày</p>
            <p className="text-[10px] text-blue-600 font-semibold">+1 ngày phép thâm niên</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">Đã Sử Dụng Trong Năm</p>
            <p className="text-lg font-black text-amber-600 mt-0.5">2 Ngày</p>
            <p className="text-[10px] text-slate-400">100% có đơn điện tử</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">Quỹ Phép Còn Lại (Khả dụng)</p>
            <p className="text-lg font-black text-emerald-600 mt-0.5">11 Ngày</p>
            <p className="text-[10px] text-emerald-700 font-semibold">Được chuyển tiếp sang 2027</p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-slate-500 font-medium">Phiếu Lương Tháng 08/2026</p>
            <p className="text-base font-black text-slate-900 mt-0.5 truncate">
              {myPayslip.netSalary.toLocaleString('vi-VN')} đ
            </p>
            <p className="text-[10px] text-purple-700 font-semibold">Luật 109 Giảm trừ 15.5M</p>
          </div>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-2 text-xs">
        <button
          onClick={() => setActiveTab('my_requests')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'my_requests'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          Đơn Của Tôi ({myRequests.length})
        </button>

        {isExecutiveOrHR && (
          <button
            onClick={() => setActiveTab('all_requests')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'all_requests'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tất Cả Đơn Toàn Công Ty ({requests.length})
          </button>
        )}

        <button
          onClick={() => setActiveTab('workflow_tracking')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'workflow_tracking'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5" /> Theo Dõi Tiến Độ Duyệt 3 Bước
        </button>

        <button
          onClick={() => setActiveTab('leave_balance')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'leave_balance'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" /> Tra Cứu Quỹ Phép Chi Tiết
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION: DANH SÁCH ĐƠN & TIẾN ĐỘ PHÊ DUYỆT */}
      {/* ========================================================================= */}
      {(activeTab === 'my_requests' || activeTab === 'all_requests') && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                  <th className="py-3 px-4">Mã Đơn</th>
                  <th className="py-3 px-4">Nhân Sự Tạo Đơn</th>
                  <th className="py-3 px-3">Phòng Ban / Nông Trường</th>
                  <th className="py-3 px-3">Loại Đơn Điện Tử</th>
                  <th className="py-3 px-3">Thời Gian</th>
                  <th className="py-3 px-4">Chi Tiết Nghiệp Vụ</th>
                  <th className="py-3 px-4 text-center">Tiến Độ Phê Duyệt (3 Bước)</th>
                  <th className="py-3 px-3 text-center">Trạng Thái</th>
                  {isExecutiveOrHR && <th className="py-3 px-3 text-center">Thao Tác</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {displayRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
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
                    <td className="py-3 px-4">
                      {r.specificDetails && (
                        <span className="font-bold text-blue-700 block mb-0.5">{r.specificDetails}</span>
                      )}
                      <span className="italic text-slate-500">{r.reason}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1 text-[10px] font-bold">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">1. TP Duyệt ✓</span>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                        <span className={`px-1.5 py-0.5 rounded ${r.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {r.status === 'APPROVED' ? '2. HCTH Xác Nhận ✓' : '2. Chờ HCTH'}
                        </span>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                        <span className={`px-1.5 py-0.5 rounded ${r.status === 'APPROVED' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                          3. Hoàn tất
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          r.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.status === 'APPROVED' ? 'Đã duyệt' : r.status === 'REJECTED' ? 'Từ chối' : 'Chờ duyệt'}
                      </span>
                    </td>
                    {isExecutiveOrHR && (
                      <td className="py-3 px-3 text-center">
                        {r.status === 'PENDING' ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => {
                                approveRequest(r.id);
                                showToast(`✓ Đã phê duyệt đơn ${r.code}!`);
                              }}
                              className="p-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
                              title="Duyệt đơn"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                rejectRequest(r.id);
                                showToast(`Đã từ chối đơn ${r.code}`);
                              }}
                              className="p-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white"
                              title="Từ chối"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono text-[10px]">Đã xử lý</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION: THEO DÕI TIẾN ĐỘ DUYỆT 3 BƯỚC TRỰC QUAN (WORKFLOW APPROVAL TRACKER) */}
      {/* ========================================================================= */}
      {activeTab === 'workflow_tracking' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-black text-slate-900 text-base">Sơ Đồ Luồng Duyệt Đơn Tự Động (BPA 3 Bước)</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Nhân viên có thể theo dõi realtime tình trạng xử lý đơn tại từng phòng ban
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs">
              Chuẩn ISO 9001:2015
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-orange-600 text-white font-black flex items-center justify-center text-xs">
                  1
                </span>
                <h4 className="font-bold text-orange-950 text-xs">Bước 1: Trưởng Phòng / GĐ Phê Duyệt</h4>
              </div>
              <p className="text-xs text-orange-900 leading-relaxed">
                Trưởng bộ phận trực tiếp kiểm tra lý do, quỹ phép và bố trí người thay thế công việc (thời gian xử lý dưới 2 giờ).
              </p>
              <div className="pt-2 border-t border-orange-200/60 text-[11px] text-orange-800 font-semibold">
                ✓ SLA phản hồi: Tối đa 4 giờ
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center text-xs">
                  2
                </span>
                <h4 className="font-bold text-purple-950 text-xs">Bước 2: Phòng HCTH / HR Xác Nhận</h4>
              </div>
              <p className="text-xs text-purple-900 leading-relaxed">
                Chuyên viên C&B đối soát chứng từ y tế (C65-HD), đối chiếu dữ liệu máy chấm công và xác nhận chế độ bảo hiểm.
              </p>
              <div className="pt-2 border-t border-purple-200/60 text-[11px] text-purple-800 font-semibold">
                ✓ Tự động kiểm tra mã giấy viện
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-xs">
                  3
                </span>
                <h4 className="font-bold text-emerald-950 text-xs">Bước 3: Hoàn Tất & Đồng Bộ Lương</h4>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                Hệ thống tự động bù công, cập nhật ngày nghỉ phép vào Bảng chấm công và tính đúng lương vào phiếu lương tháng.
              </p>
              <div className="pt-2 border-t border-emerald-200/60 text-[11px] text-emerald-800 font-semibold">
                ✓ 100% Không dùng giấy tờ
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION: TRA CỨU QUỸ PHÉP CHI TIẾT */}
      {/* ========================================================================= */}
      {activeTab === 'leave_balance' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h3 className="font-black text-slate-900 text-sm">Bảng Kê Chi Tiết Quỹ Phép Năm 2026 - {currentUser.fullName}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                  <th className="py-3 px-4">Hạng Mục Phép</th>
                  <th className="py-3 px-3 text-right">Tổng Định Mức</th>
                  <th className="py-3 px-3 text-right">Đã Sử Dụng</th>
                  <th className="py-3 px-3 text-right">Khả Dụng Còn Lại</th>
                  <th className="py-3 px-4">Quy Định Áp Dụng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">Phép năm tiêu chuẩn 2026</td>
                  <td className="py-3 px-3 text-right font-black">12.0 Ngày</td>
                  <td className="py-3 px-3 text-right font-bold text-amber-600">2.0 Ngày</td>
                  <td className="py-3 px-3 text-right font-black text-emerald-600">10.0 Ngày</td>
                  <td className="py-3 px-4 text-slate-600">Điều 113 Bộ Luật Lao Động 2019</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">Phép thâm niên công tác (&gt;5 năm)</td>
                  <td className="py-3 px-3 text-right font-black">+1.0 Ngày</td>
                  <td className="py-3 px-3 text-right font-bold text-slate-400">0.0 Ngày</td>
                  <td className="py-3 px-3 text-right font-black text-emerald-600">+1.0 Ngày</td>
                  <td className="py-3 px-4 text-slate-600">Mỗi 5 năm cộng thêm 1 ngày phép</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">Nghỉ việc riêng hưởng nguyên lương</td>
                  <td className="py-3 px-3 text-right font-black">3.0 Ngày</td>
                  <td className="py-3 px-3 text-right font-bold text-slate-400">0.0 Ngày</td>
                  <td className="py-3 px-3 text-right font-black text-emerald-600">3.0 Ngày</td>
                  <td className="py-3 px-4 text-slate-600">Kết hôn, con kết hôn, cha mẹ mất</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">Chế độ con ốm đau (Luật BHXH)</td>
                  <td className="py-3 px-3 text-right font-black">20.0 Ngày</td>
                  <td className="py-3 px-3 text-right font-bold text-purple-600">1.0 Ngày</td>
                  <td className="py-3 px-3 text-right font-black text-purple-600">19.0 Ngày</td>
                  <td className="py-3 px-4 text-slate-600">Hưởng 75% mức lương đóng BHXH từ cơ quan BHXH</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TẠO ĐƠN ĐIỆN TỬ MỚI (ĐẦY ĐỦ CÁC LOẠI ĐƠN KHỐI VĂN PHÒNG & NÔNG TRƯỜNG) */}
      {/* ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden space-y-4 max-h-[90vh] flex flex-col">
            <div className="p-5 bg-gradient-to-r from-slate-950 to-orange-950 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-black text-base">Tạo Đơn Điện Tử Mới (100% Không Dùng Giấy)</h3>
                <p className="text-xs text-orange-200">Đơn sẽ được tự động chuyển đến Trưởng phòng duyệt theo quy trình 3 bước</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Chọn Loại Đơn Điện Tử</label>
                <select
                  value={reqType}
                  onChange={(e) => setReqType(e.target.value as RequestType)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl font-bold text-slate-900 bg-slate-50 focus:bg-white"
                >
                  <optgroup label="1. Khối Đơn Nghỉ Phép & Chế Độ">
                    <option value="PHEP_NAM">Đơn xin nghỉ phép năm (Trừ quỹ phép)</option>
                    <option value="OM_DAU">Đơn nghỉ ốm đau bản thân (Có giấy viện)</option>
                    <option value="CON_OM">Đơn nghỉ chế độ con ốm (Luật BHXH mã C65-HD)</option>
                    <option value="NGHI_KHONG_LUONG">Đơn nghỉ việc riêng (Có lương / Không lương)</option>
                    <option value="THAI_SAN">Đơn nghỉ thai sản / Khám thai</option>
                  </optgroup>
                  <optgroup label="2. Khối Công Ca, Bổ Sung Công & Công Tác">
                    <option value="GIAI_TRINH_CONG">Đơn giải trình chấm công (Bổ sung công: Máy hỏng, mất điện, quên quẹt thẻ)</option>
                    <option value="CONG_TAC">Đơn công tác / Làm việc bên ngoài</option>
                    <option value="LAM_THEM_GIO">Đơn đăng ký làm thêm giờ (OT)</option>
                    <option value="DI_MUON">Đơn giải trình đi muộn</option>
                    <option value="VE_SOM">Đơn xin về sớm</option>
                  </optgroup>
                  <optgroup label="3. Khối Nông Trường">
                    <option value="CHOANG_LO">Đơn đăng ký choàng lô / Cạo thay</option>
                  </optgroup>
                </select>
              </div>

              {/* Dynamic Sub-form: Đơn giải trình chấm công / Bổ sung công */}
              {reqType === 'GIAI_TRINH_CONG' && (
                <div className="p-3.5 bg-cyan-50 rounded-xl border border-cyan-200 space-y-3">
                  <h4 className="font-bold text-cyan-950 text-xs">Chi Tiết Giải Trình Bổ Sung Công</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'MAY_HONG', label: 'Máy chấm công hỏng' },
                      { id: 'MAT_DIEN', label: 'Mất điện tòa nhà' },
                      { id: 'QUEN_QUET_THE', label: 'Quên quẹt thẻ / vân tay' },
                    ].map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setMissedTimeType(item.id as any)}
                        className={`p-2 rounded-lg font-bold text-[11px] border transition-all ${
                          missedTimeType === item.id
                            ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                            : 'bg-white text-cyan-900 border-cyan-200 hover:bg-cyan-100'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-cyan-900 block mb-0.5">Giờ Vào Cần Bổ Sung</label>
                      <input
                        type="time"
                        value={missedTimeIn}
                        onChange={(e) => setMissedTimeIn(e.target.value)}
                        className="w-full px-3 py-1.5 border border-cyan-300 rounded-lg bg-white font-mono font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-cyan-900 block mb-0.5">Giờ Ra Cần Bổ Sung</label>
                      <input
                        type="time"
                        value={missedTimeOut}
                        onChange={(e) => setMissedTimeOut(e.target.value)}
                        className="w-full px-3 py-1.5 border border-cyan-300 rounded-lg bg-white font-mono font-bold"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Sub-form: Đơn công tác */}
              {reqType === 'CONG_TAC' && (
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-3">
                  <h4 className="font-bold text-emerald-950 text-xs">Thông Tin Chuyến Công Tác / Ra Ngoài</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-emerald-900 block mb-0.5">Địa Điểm Đến / Xử Lý Việc</label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Nông Trường 1 (Bình Phước) hoặc Sở LĐTBXH"
                        value={tripDestination}
                        onChange={(e) => setTripDestination(e.target.value)}
                        className="w-full px-3 py-1.5 border border-emerald-300 rounded-lg bg-white font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-emerald-900 block mb-0.5">Phương Tiện Di Chuyển</label>
                      <input
                        type="text"
                        placeholder="Xe công vụ / Xe cá nhân / Máy bay"
                        value={tripVehicle}
                        onChange={(e) => setTripVehicle(e.target.value)}
                        className="w-full px-3 py-1.5 border border-emerald-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Sub-form: Đơn làm thêm giờ (OT) */}
              {reqType === 'LAM_THEM_GIO' && (
                <div className="p-3.5 bg-orange-50 rounded-xl border border-orange-200 space-y-3">
                  <h4 className="font-bold text-orange-950 text-xs">Khung Giờ Đăng Ký Làm Thêm Giờ (OT)</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-orange-900 block mb-0.5">Từ Khung Giờ</label>
                      <input
                        type="time"
                        value={otStartTime}
                        onChange={(e) => setOtStartTime(e.target.value)}
                        className="w-full px-3 py-1.5 border border-orange-300 rounded-lg bg-white font-mono font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-orange-900 block mb-0.5">Đến Khung Giờ</label>
                      <input
                        type="time"
                        value={otEndTime}
                        onChange={(e) => setOtEndTime(e.target.value)}
                        className="w-full px-3 py-1.5 border border-orange-300 rounded-lg bg-white font-mono font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-orange-900 block mb-0.5">Tổng Giờ OT (Tiếng)</label>
                      <input
                        type="number"
                        value={overtimeHours}
                        onChange={(e) => setOvertimeHours(Number(e.target.value))}
                        className="w-full px-3 py-1.5 border border-orange-300 rounded-lg bg-white font-bold"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Sub-form: Con ốm */}
              {reqType === 'CON_OM' && (
                <div className="p-3.5 bg-pink-50 rounded-xl border border-pink-200 space-y-3">
                  <h4 className="font-bold text-pink-950 text-xs">Chế Độ Nghỉ Chăm Con Ốm (Mẫu C65-HD)</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="font-bold text-pink-900 block mb-0.5">Họ Và Tên Của Con</label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Lê Gia Hưng (3 tuổi)"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        className="w-full px-3 py-1.5 border border-pink-300 rounded-lg bg-white font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-pink-900 block mb-0.5">Mã Giấy Viện C65</label>
                      <input
                        type="text"
                        placeholder="BV-NHI-88992"
                        value={hospitalCertCode}
                        onChange={(e) => setHospitalCertCode(e.target.value)}
                        className="w-full px-3 py-1.5 border border-pink-300 rounded-lg bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Date & Reason Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Từ Ngày</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono bg-slate-50"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Đến Ngày</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Lý Do Chi Tiết</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  placeholder="Ghi rõ nội dung và lý do để quản lý phê duyệt..."
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 font-bold rounded-xl text-slate-700"
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
