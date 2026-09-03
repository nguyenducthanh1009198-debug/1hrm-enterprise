'use client';

import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  Sparkles,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  Clock,
  Award,
  AlertTriangle,
  UserCheck,
  Building,
  Check,
  X
} from 'lucide-react';
import { useHRM } from '@/context/HRMContext';
import { Candidate } from '@/types';

export const TuyenDungModule: React.FC = () => {
  const { candidates, recruitmentPlans, updateCandidateStage, convertCandidateToEmployee, departments, positions, currentRole } = useHRM();
  const canViewSalary = ['ADMIN', 'EXECUTIVE_DIRECTOR', 'HR_MANAGER', 'HR_ADMIN'].includes(currentRole);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showOnboardModal, setShowOnboardModal] = useState<Candidate | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Auto-filled Onboard Form State
  const [onboardForm, setOnboardForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    idCard: '',
    birthday: '',
    gender: 'Nam' as 'Nam' | 'Nữ',
    address: '',
    departmentId: 'dept-2',
    positionTitle: '',
    baseSalary: 15000000,
    joinDate: new Date().toISOString().split('T')[0],
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const stages: { id: Candidate['stage']; label: string; color: string }[] = [
    { id: 'CV_NEW', label: '1. CV Mới Nhận', color: 'bg-slate-100 text-slate-800 border-slate-300' },
    { id: 'SCREENING', label: '2. Đang Sàng Lọc / Test', color: 'bg-blue-50 text-blue-800 border-blue-200' },
    { id: 'INTERVIEW', label: '3. Lên Lịch Phỏng Vấn', color: 'bg-purple-50 text-purple-800 border-purple-200' },
    { id: 'OFFER', label: '4. Đã Gửi Offer Letter', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { id: 'HIRED', label: '5. Trúng Tuyển & Onboard', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  ];

  const handleOpenOnboard = (candidate: Candidate) => {
    setOnboardForm({
      fullName: candidate.fullName,
      email: candidate.email,
      phone: candidate.phone,
      idCard: candidate.idCard || '070098001122',
      birthday: candidate.birthday || '1998-05-14',
      gender: candidate.gender || 'Nam',
      address: candidate.address || 'Hớn Quản, Bình Phước',
      departmentId: 'dept-2',
      positionTitle: candidate.positionTitle,
      baseSalary: candidate.expectedSalary || 15000000,
      joinDate: new Date().toISOString().split('T')[0],
    });
    setShowOnboardModal(candidate);
  };

  const handleConfirmOnboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showOnboardModal) return;

    const dept = departments.find((d) => d.id === onboardForm.departmentId);

    convertCandidateToEmployee(showOnboardModal.id, {
      fullName: onboardForm.fullName,
      email: onboardForm.email,
      phone: onboardForm.phone,
      idCard: onboardForm.idCard,
      birthday: onboardForm.birthday,
      gender: onboardForm.gender,
      address: onboardForm.address,
      departmentId: onboardForm.departmentId,
      departmentName: dept?.name || 'Nông Trường 1 (Bình Phước)',
      positionTitle: onboardForm.positionTitle,
      baseSalary: Number(onboardForm.baseSalary),
      joinDate: onboardForm.joinDate,
      profileCompleteness: 60,
      isProfileComplete: false,
      missingDocuments: ['Bản sao CCCD 2 mặt', 'Giấy khám sức khỏe', 'Sổ BHXH'],
    });

    setShowOnboardModal(null);
    setSelectedCandidate(null);
    showToast(`✓ Đã Onboard thành công nhân sự ${onboardForm.fullName}! Hệ thống đã tự động kích hoạt cảnh báo thiếu hồ sơ.`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-emerald-500 flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Tuyển Dụng & Onboarding Tự Động Hóa</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#ECFDF5] text-[#047857]">
              ATS Pipeline & Auto-Fill Onboard
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý ứng viên qua phễu 5 vòng, tự động điền toàn bộ trường thông tin sang Hồ Sơ Nhân Sự và kích hoạt cảnh báo thiếu hồ sơ.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">
            Đang chạy: <strong>{recruitmentPlans.length} Kế hoạch tuyển</strong>
          </span>
        </div>
      </div>

      {/* Recruitment Plans Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recruitmentPlans.map((c) => (
          <div key={c.id} className="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-xs space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">{c.title}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {c.status}
              </span>
            </div>
            <p className="text-slate-500 font-mono">Mã: {c.code} • Phụ trách: {c.recruiterName}</p>
            <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
              <span className="text-slate-600">
                Chỉ tiêu tuyển: <strong>{c.quantityHired}/{c.quantityTarget} người</strong>
              </span>
              <span className="text-[#047857] font-semibold">Ngân sách: {c.budget.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>
        ))}
      </div>

      {/* Kanban ATS Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {stages.map((st) => {
          const stageCandidates = candidates.filter((c) => c.stage === st.id);
          return (
            <div key={st.id} className="bg-slate-100/70 p-3 rounded-xl border border-[#E2E8F0] flex flex-col min-h-[420px]">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="font-bold text-slate-800 text-xs">{st.label}</span>
                <span className="px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                  {stageCandidates.length}
                </span>
              </div>

              <div className="space-y-2.5 flex-1 overflow-y-auto">
                {stageCandidates.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCandidate(c)}
                    className="p-3 bg-white rounded-xl border border-[#E2E8F0] shadow-xs hover:border-orange-300 cursor-pointer space-y-2 text-xs transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <p className="font-bold text-slate-900">{c.fullName}</p>
                      <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#ECFDF5] text-[#047857] font-bold text-[10px] border border-[#D1FAE5]">
                        <Sparkles className="w-2.5 h-2.5" />
                        {c.aiMatchScore}% AI
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600">{c.positionTitle}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Nguồn: {c.source} • {c.experienceYears} năm KN
                    </p>

                    {c.stage === 'OFFER' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenOnboard(c);
                        }}
                        className="w-full mt-1.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-xs transition-all flex items-center justify-center gap-1"
                      >
                        <UserCheck className="w-3.5 h-3.5" /> Xác Nhận Onboard
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-[#E2E8F0] space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">{selectedCandidate.fullName}</h2>
                <p className="text-xs text-slate-500">{selectedCandidate.positionTitle} - {selectedCandidate.departmentName}</p>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="p-3 bg-[#ECFDF5] rounded-xl border border-[#D1FAE5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#047857]" />
                <div>
                  <p className="font-bold text-[#0F172A]">AI Sàng Lọc & Khớp Hồ Sơ</p>
                  <p className="text-[11px] text-[#047857]">Kỹ năng chuyên môn khớp 94% với tiêu chuẩn</p>
                </div>
              </div>
              <span className="text-xl font-black text-[#047857]">{selectedCandidate.aiMatchScore}%</span>
            </div>

            <div className="space-y-1.5 text-slate-700 bg-[#F8FAFC] p-3 rounded-xl">
              <p><strong>Email:</strong> {selectedCandidate.email}</p>
              <p><strong>Điện thoại:</strong> {selectedCandidate.phone}</p>
              <p><strong>Số CCCD:</strong> {selectedCandidate.idCard || '070098001122'}</p>
              <p><strong>Kinh nghiệm:</strong> {selectedCandidate.experienceYears} năm</p>
              <p><strong>Mức lương kỳ vọng:</strong> {canViewSalary ? `${selectedCandidate.expectedSalary.toLocaleString('vi-VN')} đ` : '[Bảo mật BGĐ & HR]'}</p>
            </div>

            {/* Stage Actions */}
            <div className="pt-2 border-t border-[#F1F5F9] flex flex-col gap-2">
              <label className="font-bold text-slate-800">Chuyển giai đoạn tuyển dụng:</label>
              <div className="flex flex-wrap gap-1.5">
                {stages.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      updateCandidateStage(selectedCandidate.id, st.id);
                      setSelectedCandidate({ ...selectedCandidate, stage: st.id });
                    }}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      selectedCandidate.stage === st.id
                        ? 'bg-[#047857] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleOpenOnboard(selectedCandidate)}
                className="mt-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>Xác Nhận Onboard & Tự Động Chuyển Sang HSNS 360°</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-fill Onboarding Confirmation Modal */}
      {showOnboardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl border border-[#E2E8F0] overflow-hidden space-y-4">
            <div className="p-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Xác Nhận Tiếp Nhận Onboard Nhân Viên Mới</h3>
                <p className="text-xs text-emerald-100">Các trường thông tin đã được tự động điền (Auto-fill) từ hồ sơ ứng viên</p>
              </div>
              <button onClick={() => setShowOnboardModal(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmOnboard} className="p-5 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Họ Và Tên (Auto-filled)</label>
                  <input
                    type="text"
                    value={onboardForm.fullName}
                    onChange={(e) => setOnboardForm({ ...onboardForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold bg-[#F8FAFC]"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Số CCCD / CMND (Auto-filled)</label>
                  <input
                    type="text"
                    value={onboardForm.idCard}
                    onChange={(e) => setOnboardForm({ ...onboardForm, idCard: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono bg-[#F8FAFC]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={onboardForm.email}
                    onChange={(e) => setOnboardForm({ ...onboardForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-[#F8FAFC]"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Số Điện Thoại</label>
                  <input
                    type="text"
                    value={onboardForm.phone}
                    onChange={(e) => setOnboardForm({ ...onboardForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono bg-[#F8FAFC]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Vị Trí Công Việc</label>
                  <input
                    type="text"
                    value={onboardForm.positionTitle}
                    onChange={(e) => setOnboardForm({ ...onboardForm, positionTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold bg-[#F8FAFC]"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mức Lương Thỏa Thuận (VNĐ)</label>
                  <input
                    type="number"
                    value={onboardForm.baseSalary}
                    onChange={(e) => setOnboardForm({ ...onboardForm, baseSalary: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900 bg-[#F8FAFC]"
                    required
                  />
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-950">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Quy trình quản lý hồ sơ nhân viên mới Onboard:</span>
                </div>
                <p className="leading-relaxed">
                  Khi xác nhận Onboard, hệ thống sẽ tự động gán mã nhân viên, tạo hồ sơ trong HSNS 360° và <b>gắn cờ cảnh báo hồ sơ chưa đầy đủ</b> (Checklist: Thiếu bản sao CCCD công chứng, Giấy khám sức khỏe, Sổ BHXH).
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={() => setShowOnboardModal(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  Xác Nhận Hoàn Tất Onboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
