'use client';

import React, { useState } from 'react';
import {
  X,
  QrCode,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Download,
  Smartphone,
} from 'lucide-react';
import Link from 'next/link';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'ios' | 'android'>('ios');

  if (!isOpen) return null;

  const getDownloadUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/download`;
    }
    return 'http://localhost:3000/download';
  };

  const getMobileDemoUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/mobile`;
    }
    return 'http://localhost:3000/mobile';
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getDownloadUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInstallOTA = (platform: 'ios' | 'android') => {
    if (platform === 'ios') {
      const manifestUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/app/manifest.plist`
        : 'https://hrm-demo.vercel.app/app/manifest.plist';
      window.location.href = `itms-services://?action=download-manifest&url=${manifestUrl}`;
    } else {
      const link = document.createElement('a');
      link.href = '/app/1HRM.apk';
      link.download = '1HRM-Demo.apk';
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative text-white space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 pr-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Cài Đặt OTA Trực Tiếp & Dùng Thử Demo
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Cài Đặt Ứng Dụng 1HRM Trực Tiếp
          </h2>
          <p className="text-xs text-slate-400">
            Quét mã QR bằng điện thoại hoặc chọn tải file cài đặt demo / dùng thử trực tiếp
          </p>
        </div>

        {/* QR Code & Link Copy */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
          <div className="p-2.5 bg-white rounded-xl shadow-lg shrink-0">
            <div className="w-24 h-24 bg-slate-950 rounded-lg p-1.5 flex items-center justify-center relative">
              <QrCode className="w-full h-full text-white" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 rounded-md bg-orange-600 text-white font-black text-xs flex items-center justify-center border border-white">
                  1
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-2 text-center sm:text-left">
            <p className="font-bold text-xs text-white">Quét QR hoặc Sao chép link gửi nhân viên:</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={getDownloadUrl()}
                className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 font-mono select-all focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Quick Demo Actions */}
        <div className="space-y-3">
          {/* Instant Browser Demo Button */}
          <Link
            href="/mobile"
            onClick={onClose}
            className="w-full py-3 px-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-2xl font-bold text-xs shadow-lg shadow-orange-600/25 flex items-center justify-between transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="font-black text-xs">Mở Trực Tiếp Bản Mobile Demo Trên Trình Duyệt</p>
                <p className="text-[10px] text-white/80">Trải nghiệm ngay không cần tải file hay cài đặt</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Platform Tab Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleInstallOTA('ios')}
              className="py-3 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl flex items-center gap-2.5 transition-all text-left cursor-pointer"
            >
              <img src="/images/apple-icon.png" alt="Apple" className="w-6 h-6 object-contain shrink-0" />
              <div>
                <p className="font-bold text-xs text-white">Tải Cho iPhone</p>
                <p className="text-[10px] text-slate-400">OTA 1-Chạm iOS</p>
              </div>
            </button>

            <button
              onClick={() => handleInstallOTA('android')}
              className="py-3 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl flex items-center gap-2.5 transition-all text-left cursor-pointer"
            >
              <img src="/images/android-icon.png" alt="Android" className="w-6 h-6 object-contain shrink-0" />
              <div>
                <p className="font-bold text-xs text-white">Tải Cho Android</p>
                <p className="text-[10px] text-slate-400">Tải File .APK Demo</p>
              </div>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Hỗ trợ iOS 14+ & Android 8+</span>
          <Link
            href="/download"
            onClick={onClose}
            className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>Mở trang hướng dẫn chi tiết</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
