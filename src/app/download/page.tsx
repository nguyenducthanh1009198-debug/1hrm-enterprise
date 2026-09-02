'use client';

import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Check,
  Copy,
  ArrowRight,
  ShieldCheck,
  Download,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Radio,
  FileCheck,
} from 'lucide-react';
import Link from 'next/link';

export default function DownloadPage() {
  const [copied, setCopied] = useState(false);
  const [activePlatform, setActivePlatform] = useState<'ios' | 'android'>('ios');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.origin);
    }
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleInstallOTA = (platform: 'ios' | 'android') => {
    if (platform === 'ios') {
      const manifestUrl = currentUrl ? `${currentUrl}/app/manifest.plist` : 'https://hrm-demo.vercel.app/app/manifest.plist';
      window.location.href = `itms-services://?action=download-manifest&url=${manifestUrl}`;
    } else {
      const link = document.createElement('a');
      link.href = '/app/1HRM.apk';
      link.download = '1HRM-Demo.apk';
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-orange-600/30">
              1
            </div>
            <div>
              <span className="font-black text-sm text-white tracking-tight">1HRM Enterprise</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-orange-400 font-bold border border-slate-700">
                Cổng Tải Ứng Dụng
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/mobile"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-orange-600/20"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mở Bản Mobile Demo</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-all border border-slate-700"
          >
            <span>Về Trang Quản Trị</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Title & Badge */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Cài Đặt OTA Trực Tiếp (Over-The-Air)
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Cổng Cài Đặt Ứng Dụng 1HRM Cho iPhone & Android
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Hỗ trợ cài đặt tự động qua sóng không dây OTA cho toàn bộ nhân viên: Chấm công GPS Geofencing, duyệt đơn và xem phiếu lương bảo mật tức thì.
          </p>
        </div>

        {/* Big Card with QR Code & Smart Links */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* QR Code Column */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-3">
            <div className="p-3 bg-white rounded-2xl shadow-xl relative group">
              <div className="w-40 h-40 bg-slate-950 rounded-xl p-2 flex items-center justify-center relative">
                <QrCode className="w-full h-full text-white" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-9 h-9 rounded-xl bg-orange-600 text-white font-black text-base flex items-center justify-center border-2 border-white shadow-lg">
                    1
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="font-bold text-white text-sm">Quét Bằng Camera Điện Thoại</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Tự động nhận diện thiết bị & Cài đặt OTA</p>
            </div>

            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-700 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã Sao Chép Link!' : 'Sao Chép Link Cài Đặt'}</span>
            </button>
          </div>

          {/* Platform Actions Column */}
          <div className="lg:col-span-7 space-y-5">
            {/* Direct Browser Demo Button */}
            <Link
              href="/mobile"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-2xl font-bold text-xs shadow-xl shadow-orange-600/25 flex items-center justify-between transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-black text-sm">Mở Bản Mobile Demo Trực Tiếp (Web App)</p>
                  <p className="text-[11px] text-white/80">Trải nghiệm chấm công GPS, đơn từ, phiếu lương tức thì</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5" />
            </Link>

            {/* Tabs with image icons */}
            <div className="flex gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setActivePlatform('ios')}
                className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activePlatform === 'ios'
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <img src="/images/apple-icon.png" alt="Apple iOS" className="w-5 h-5 object-contain" />
                <span>OTA Cho iPhone (iOS)</span>
              </button>

              <button
                onClick={() => setActivePlatform('android')}
                className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activePlatform === 'android'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <img src="/images/android-icon.png" alt="Android" className="w-5 h-5 object-contain" />
                <span>OTA Cho Android (.APK)</span>
              </button>
            </div>

            {/* iOS OTA Action & Guide */}
            {activePlatform === 'ios' && (
              <div className="space-y-4 text-xs">
                <button
                  onClick={() => handleInstallOTA('ios')}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <img src="/images/apple-icon.png" alt="" className="w-5 h-5 object-contain brightness-0 invert" />
                  <span>BẤM VÀO ĐÂY ĐỂ CÀI ĐẶT OTA CHO IPHONE</span>
                </button>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-slate-300">
                  <p className="font-bold text-white text-xs flex items-center gap-1.5 text-orange-400">
                    <ShieldCheck className="w-4 h-4" />
                    3 Bước Xác Thực Sau Khi Tải Xong (Chỉ thực hiện lần đầu):
                  </p>
                  <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-400 leading-relaxed pl-1">
                    <li>Mở <strong className="text-slate-200">Cài đặt (Settings)</strong> trên iPhone &gt; Chọn <strong className="text-slate-200">Cài đặt chung (General)</strong>.</li>
                    <li>Vào mục <strong className="text-slate-200">Quản lý VPN & Thiết bị (VPN & Device Management)</strong>.</li>
                    <li>Bấm vào tên Doanh nghiệp <strong className="text-slate-200">1HRM Enterprise Corp</strong> &gt; Chọn <strong className="text-emerald-400 font-bold">Tin cậy (Trust)</strong> để hoàn tất.</li>
                  </ol>
                </div>
              </div>
            )}

            {/* Android OTA Action & Guide */}
            {activePlatform === 'android' && (
              <div className="space-y-4 text-xs">
                <button
                  onClick={() => handleInstallOTA('android')}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <img src="/images/android-icon.png" alt="" className="w-5 h-5 object-contain brightness-0 invert" />
                  <span>TẢI TRỰC TIẾP FILE 1HRM-DEMO.APK</span>
                </button>

                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-slate-300">
                  <p className="font-bold text-white text-xs flex items-center gap-1.5 text-emerald-400">
                    <FileCheck className="w-4 h-4" />
                    Hướng Dẫn Cài Đặt Android:
                  </p>
                  <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-400 leading-relaxed pl-1">
                    <li>Bấm nút tải tệp tin <strong className="text-slate-200">1HRM-Demo.apk</strong> về điện thoại.</li>
                    <li>Mở file từ thanh thông báo hoặc thư mục Tải về &gt; Chọn <strong className="text-slate-200">Cài đặt</strong>.</li>
                    <li>Nếu máy hỏi xác nhận nguồn: Bấm <strong className="text-emerald-400 font-bold">Cho phép từ nguồn này</strong> để cài đặt ngay lập tức.</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© 2026 1HRM Platform. Giải pháp quản trị nhân sự & chấm công GPS tiêu chuẩn Doanh nghiệp.</p>
      </footer>
    </div>
  );
}
