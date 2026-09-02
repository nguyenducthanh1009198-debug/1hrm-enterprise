'use client';

import React, { useState } from 'react';
import {
  Award,
  Radar,
  BookOpen,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useHRM } from '@/context/HRMContext';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar as RechartsRadar,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const DanhGiaAskModule: React.FC = () => {
  const { askEvaluation } = useHRM();
  const [activeTab, setActiveTab] = useState<'ask' | 'training'>('ask');

  // Prepare data for Radar Chart
  const radarData = askEvaluation.items.map((item) => ({
    criteria: item.criteria,
    required: item.requiredScore,
    evaluated: item.evaluatedScore,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Đánh Giá Năng Lực ASK & Đào Tạo LMS</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-700">
              Radar Chart Mạng Nhện
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Đánh giá toàn diện 3 khía cạnh (Thái độ Attitude - Kỹ năng Skill - Kiến thức Knowledge), trực quan hóa biểu đồ mạng nhện và liên kết khóa học nâng cao năng lực
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['ask', 'training'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === tab
                  ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab === 'ask' && 'Biểu Đồ Đánh Giá ASK'}
              {tab === 'training' && 'Khóa Đào Tạo Nội Bộ'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'ask' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center">
            <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Biểu Đồ Mạng Nhện Năng Lực (Radar Chart)</h3>
                <p className="text-xs text-slate-500">
                  Nhân sự: <strong>{askEvaluation.employeeName}</strong> ({askEvaluation.positionTitle})
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-orange-100 text-orange-700 font-bold text-xs">
                {askEvaluation.grade}
              </span>
            </div>

            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="criteria" tick={{ fill: '#475569', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} stroke="#94a3b8" />
                  <RechartsRadar
                    name="Điểm yêu cầu chuẩn"
                    dataKey="required"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.2}
                  />
                  <RechartsRadar
                    name="Điểm thực tế đạt được"
                    dataKey="evaluated"
                    stroke="#ea580c"
                    fill="#ea580c"
                    fillOpacity={0.5}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Criteria Breakdown Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              Chi Tiết Điểm Đánh Giá ASK (Kỳ {askEvaluation.period})
            </h3>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
              {askEvaluation.items.map((item, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{item.category}</span>
                    <p className="font-semibold text-slate-900">{item.criteria}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-600 font-semibold">Chuẩn: {item.requiredScore}</span>
                    <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700 font-bold">
                      Đạt: {item.evaluatedScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1 text-emerald-900">
              <p><strong>Điểm mạnh:</strong> {askEvaluation.strengths}</p>
              <p><strong>Định hướng nâng cao:</strong> {askEvaluation.improvements}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'training' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-orange-500" />
              <h3 className="font-bold text-slate-900 text-base">Khóa Học & Lớp Đào Tạo Phát Triển Năng Lực</h3>
            </div>
            <button className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold">
              + Tạo Khóa Học Mới
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Kỹ Năng Quản Trị Mục Tiêu OKR Chuyên Sâu', trainer: 'Nguyễn Đức Minh (CEO)', hours: '8 giờ', status: 'Bắt buộc', enrolled: 12 },
              { title: 'Tối Ưu Hiệu Năng & Kiến Trúc Microservices', trainer: 'Lê Việt Thắng (CTO)', hours: '16 giờ', status: 'Khuyến khích', enrolled: 25 },
              { title: 'Luật Lao Động 2026 & Tự Động Hóa Thuế TNCN', trainer: 'Phạm Thùy Linh (HRM)', hours: '6 giờ', status: 'Bắt buộc', enrolled: 8 },
            ].map((course, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px]">
                    {course.status}
                  </span>
                  <span className="text-slate-500 text-[11px] font-mono">{course.hours}</span>
                </div>
                <p className="font-bold text-slate-900 text-xs">{course.title}</p>
                <p className="text-slate-500">Giảng viên: {course.trainer}</p>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px]">
                  <span className="text-slate-500">Học viên tham gia:</span>
                  <span className="font-bold text-emerald-600">{course.enrolled} nhân sự</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
