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
} from 'lucide-react';
import { useHRM } from '@/context/HRMContext';
import { Candidate } from '@/types';

export const TuyenDungModule: React.FC = () => {
  const { candidates, campaigns, updateCandidateStage, convertCandidateToEmployee } = useHRM();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const stages: { id: Candidate['stage']; label: string; color: string }[] = [
    { id: 'CV_NEW', label: '1. CV Mới Nhận', color: 'bg-slate-100 text-slate-800 border-slate-300' },
    { id: 'SCREENING', label: '2. Đang Sàng Lọc / Test', color: 'bg-blue-50 text-blue-800 border-blue-200' },
    { id: 'INTERVIEW', label: '3. Lên Lịch Phỏng Vấn', color: 'bg-purple-50 text-purple-800 border-purple-200' },
    { id: 'OFFER', label: '4. Đã Gửi Offer Letter', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    { id: 'HIRED', label: '5. Trúng Tuyển & Onboard', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Tuyển Dụng Nhân Sự & AI Sàng Lọc CV</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-orange-100 text-orange-700">
              ATS Pipeline & AI Match
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý chiến dịch tuyển dụng, tự động kết nối TopCV/LinkedIn/Vietnamworks, AI chấm điểm CV và kích hoạt Onboarding 1 chạm sang HSNS
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">Đang chạy: <strong>{campaigns.length} Chiến dịch</strong></span>
        </div>
      </div>

      {/* Campaigns Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map((c) => (
          <div key={c.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">{c.title}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {c.status}
              </span>
            </div>
            <p className="text-slate-500 font-mono">Mã: {c.code} • Phụ trách: {c.recruiterName}</p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-slate-600">Mục tiêu tuyển: <strong>{c.quantityHired}/{c.quantityTarget} nhân sự</strong></span>
              <span className="text-orange-600 font-semibold">Ngân sách: {c.budget.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>
        ))}
      </div>

      {/* Kanban ATS Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {stages.map((st) => {
          const stageCandidates = candidates.filter((c) => c.stage === st.id);
          return (
            <div key={st.id} className="bg-slate-100/70 p-3 rounded-xl border border-slate-200 flex flex-col min-h-[420px]">
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
                    className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-orange-300 cursor-pointer space-y-2 text-xs transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <p className="font-bold text-slate-900">{c.fullName}</p>
                      <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-orange-50 text-orange-700 font-bold text-[10px] border border-orange-200">
                        <Sparkles className="w-2.5 h-2.5" />
                        {c.aiMatchScore}% AI
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 truncate">{c.positionApplied}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Nguồn: {c.source} • {c.experienceYears} năm KN</p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {c.skills.slice(0, 2).map((sk, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-medium">
                          {sk}
                        </span>
                      ))}
                    </div>
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
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">{selectedCandidate.fullName}</h2>
                <p className="text-xs text-slate-500">{selectedCandidate.positionApplied} • Mã: {selectedCandidate.code}</p>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-bold text-orange-950">AI Sàng Lọc & Phân Tích Độ Phù Hợp JD</p>
                  <p className="text-orange-700 mt-0.5">Kỹ năng chuyên môn khớp 94% với tiêu chuẩn vị trí</p>
                </div>
              </div>
              <span className="text-2xl font-black text-orange-600">{selectedCandidate.aiMatchScore}%</span>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <p><strong>Email:</strong> {selectedCandidate.email}</p>
              <p><strong>Điện thoại:</strong> {selectedCandidate.phone}</p>
              <p><strong>Kinh nghiệm:</strong> {selectedCandidate.experienceYears} năm</p>
              {selectedCandidate.offerSalary && (
                <p><strong>Mức lương Offer:</strong> {selectedCandidate.offerSalary.toLocaleString('vi-VN')} đ</p>
              )}
              {selectedCandidate.notes && (
                <p><strong>Ghi chú:</strong> {selectedCandidate.notes}</p>
              )}
            </div>

            {/* Stage Actions */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-800">Chuyển giai đoạn tuyển dụng:</label>
              <div className="flex flex-wrap gap-2">
                {stages.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      updateCandidateStage(selectedCandidate.id, st.id);
                      setSelectedCandidate({ ...selectedCandidate, stage: st.id });
                    }}
                    className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
                      selectedCandidate.stage === st.id
                        ? 'bg-orange-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {selectedCandidate.stage === 'OFFER' && (
                <button
                  onClick={() => {
                    convertCandidateToEmployee(selectedCandidate.id);
                    setSelectedCandidate(null);
                  }}
                  className="mt-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Kích Hoạt Onboarding & Chuyển Thành Nhân Viên Mới (HSNS)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
