'use client';

import React, { useState, useEffect } from 'react';
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
import { useHRM } from '@/context/HRMContext';

export default function HomePage() {
  const { currentRole } = useHRM();
  const isExecutiveOrHR = ['ADMIN', 'EXECUTIVE_DIRECTOR', 'HR_MANAGER', 'HR_ADMIN'].includes(currentRole);

  const [activeTab, setActiveTab] = useState<string>(isExecutiveOrHR ? 'dashboard' : 'cham-cong');
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  // Sync tab when role switches
  useEffect(() => {
    if (!isExecutiveOrHR && activeTab === 'dashboard') {
      setActiveTab('cham-cong');
    }
  }, [currentRole, isExecutiveOrHR, activeTab]);

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
            {activeTab === 'dashboard' && isExecutiveOrHR && <DashboardModule />}
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
