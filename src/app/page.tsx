'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { HSNSModule } from '@/components/modules/HSNSModule';
import { ChamCongModule } from '@/components/modules/ChamCongModule';
import { DonTuModule } from '@/components/modules/DonTuModule';
import { TienLuongModule } from '@/components/modules/TienLuongModule';
import { TuyenDungModule } from '@/components/modules/TuyenDungModule';
import { KpiOkrModule } from '@/components/modules/KpiOkrModule';
import { DanhGiaAskModule } from '@/components/modules/DanhGiaAskModule';
import { BaoHiemIvanModule } from '@/components/modules/BaoHiemIvanModule';
import { DashboardModule } from '@/components/modules/DashboardModule';
import { DownloadAppModal } from '@/components/layout/DownloadAppModal';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100/70 overflow-hidden font-sans text-slate-900">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'download-app') {
            setShowDownloadModal(true);
          } else {
            setActiveTab(tab);
          }
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onOpenDownloadModal={() => setShowDownloadModal(true)} />

        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === 'dashboard' && <DashboardModule />}
            {activeTab === 'hsns' && <HSNSModule />}
            {activeTab === 'cham-cong' && <ChamCongModule />}
            {activeTab === 'don-tu' && <DonTuModule />}
            {activeTab === 'tien-luong' && <TienLuongModule />}
            {activeTab === 'bhxh-ivan' && <BaoHiemIvanModule />}
            {activeTab === 'tuyen-dung' && <TuyenDungModule />}
            {activeTab === 'kpi-okr' && <KpiOkrModule />}
            {activeTab === 'danh-gia-ask' && <DanhGiaAskModule />}
          </div>
        </main>
      </div>

      {/* Download & Installation Modal */}
      <DownloadAppModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />
    </div>
  );
}
