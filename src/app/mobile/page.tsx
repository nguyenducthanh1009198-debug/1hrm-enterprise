'use client';

import React from 'react';
import { MobileAppView } from '@/components/mobile/MobileAppView';
import Link from 'next/link';
import { ArrowLeft, Smartphone } from 'lucide-react';

export default function MobilePage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="mb-4 flex items-center justify-between w-full max-w-sm text-white">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Web Dashboard</span>
        </Link>
        <div className="flex items-center gap-1 text-xs text-orange-400 font-bold">
          <Smartphone className="w-4 h-4" />
          <span>1HRM Mobile Self-Service</span>
        </div>
      </div>

      <MobileAppView />
    </div>
  );
}
