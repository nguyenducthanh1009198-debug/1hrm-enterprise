import type { Metadata } from 'next';
import './globals.css';
import { HRMProvider } from '@/context/HRMContext';

export const metadata: Metadata = {
  title: '1HRM - Bộ Công Cụ Quản Lý Nhân Sự Toàn Diện',
  description: 'Nền tảng số hóa quản trị nhân sự, chấm công máy/GPS, tính lương tự động và quản trị mục tiêu OKR/KPI theo chuẩn 1Office.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '1HRM',
  },
  icons: {
    apple: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased bg-slate-100 text-slate-900 selection:bg-orange-500 selection:text-white" suppressHydrationWarning>
        <HRMProvider>
          {children}
        </HRMProvider>
      </body>
    </html>
  );
}
