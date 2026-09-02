'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Clock,
  MapPin,
  Wifi,
  Server,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  Shield,
  Compass,
} from 'lucide-react';
import { useHRM } from '@/context/HRMContext';

export const ChamCongModule: React.FC = () => {
  const { employees, shifts, todayAttendance, handleCheckIn, handleCheckOut, currentUser } = useHRM();
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'geofence' | 'mobile' | 'shifts' | 'devices'>('matrix');
  const [selectedMonth, setSelectedMonth] = useState('08/2026');

  // Client-safe Live Clock State
  const [isMounted, setIsMounted] = useState(false);
  const [liveTime, setLiveTime] = useState('08:30:00');
  const [liveDate, setLiveDate] = useState('Thứ Tư, 2 tháng 9, 2026');

  useEffect(() => {
    setIsMounted(true);
    const update = () => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString('vi-VN'));
      setLiveDate(now.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  // Days in month simulation (1 to 31)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // Geofencing office locations state
  const [offices, setOffices] = useState([
    {
      id: 'off-1',
      name: 'Trụ sở chính Hà Nội - Tòa nhà Five Star',
      address: 'Số 2 Kim Giang, Q. Thanh Xuân, TP. Hà Nội',
      lat: 20.9982,
      lng: 105.8174,
      radiusMeters: 80, // Bán kính cho phép 80 mét
      wifiBSSID: '1Office_HN_5G / E4:C7:22:1A:89:FE',
      status: 'Đang hoạt động',
      allowRemote: false,
    },
    {
      id: 'off-2',
      name: 'Chi nhánh TP. Hồ Chí Minh - Tòa nhà Pax Sky',
      address: 'Số 222 Hoàng Hoa Thám, P.12, Q. Tân Bình, TP. HCM',
      lat: 10.7995,
      lng: 106.6533,
      radiusMeters: 100, // Bán kính 100 mét
      wifiBSSID: '1Office_HCM_Guest / 8C:3B:AD:45:90:12',
      status: 'Đang hoạt động',
      allowRemote: false,
    },
    {
      id: 'off-3',
      name: 'Văn phòng Đà Nẵng (Co-working Space)',
      address: 'Đường Nguyễn Văn Linh, Q. Hải Châu, TP. Đà Nẵng',
      lat: 16.0601,
      lng: 108.2198,
      radiusMeters: 150,
      wifiBSSID: 'Enouvo_Space_5G',
      status: 'Đang hoạt động',
      allowRemote: true,
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Quản Lý Chấm Công, Phân Ca & GPS Geofencing</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-700">
              Realtime Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Khoanh vùng định vị GPS (Geofencing), đối soát BSSID Wifi nội bộ, chống Fake GPS và tích hợp máy chấm công ZKTeco/Hikvision
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['matrix', 'geofence', 'mobile', 'shifts', 'devices'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeSubTab === tab
                  ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab === 'matrix' && 'Bảng Chấm Công Tổng Hợp'}
              {tab === 'geofence' && 'Khoanh Vùng GPS (Geofencing)'}
              {tab === 'mobile' && 'Chấm Công GPS Mobile'}
              {tab === 'shifts' && 'Quản Lý Phân Ca'}
              {tab === 'devices' && 'Kết Nối Máy Chấm Công'}
            </button>
          ))}
        </div>
      </div>

      {/* Subtab 1: Monthly Matrix Timesheet */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Kỳ chấm công:</span>
              <div className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-lg text-xs font-semibold text-slate-800">
                <ChevronLeft className="w-4 h-4 cursor-pointer text-slate-500 hover:text-slate-800" />
                <span>Tháng {selectedMonth}</span>
                <ChevronRight className="w-4 h-4 cursor-pointer text-slate-500 hover:text-slate-800" />
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600 font-medium">1.0 (Đủ công)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-slate-600 font-medium">0.5 (Nửa công)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-slate-600 font-medium">P (Nghỉ phép)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="text-slate-600 font-medium">CN (Nghỉ tuần)</span>
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold">
                    <th className="py-3 px-3 text-left sticky left-0 bg-slate-50 z-10 w-48 border-r border-slate-200">
                      Nhân sự
                    </th>
                    <th className="py-3 px-2 border-r border-slate-200">Tổng công</th>
                    <th className="py-3 px-2 border-r border-slate-200 text-amber-600">Đi muộn</th>
                    <th className="py-3 px-2 border-r border-slate-200 text-blue-600">Nghỉ phép</th>
                    {daysInMonth.map((d) => {
                      const isWeekend = d % 7 === 0 || d % 7 === 6;
                      return (
                        <th
                          key={d}
                          className={`py-2 px-1 min-w-[28px] border-r border-slate-200 text-[10px] ${
                            isWeekend ? 'bg-slate-100 text-slate-400' : 'bg-slate-50 text-slate-700'
                          }`}
                        >
                          {d}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-orange-50/30">
                      <td className="py-2.5 px-3 text-left font-semibold text-slate-900 sticky left-0 bg-white z-10 border-r border-slate-200">
                        <div className="flex items-center gap-2">
                          <img src={emp.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                          <span className="truncate">{emp.fullName}</span>
                        </div>
                      </td>
                      <td className="py-2 px-2 font-bold text-emerald-600 border-r border-slate-200">
                        22.0
                      </td>
                      <td className="py-2 px-2 font-semibold text-amber-600 border-r border-slate-200">
                        {emp.lateTimes}
                      </td>
                      <td className="py-2 px-2 font-semibold text-blue-600 border-r border-slate-200">
                        1.0
                      </td>
                      {daysInMonth.map((d) => {
                        const isWeekend = d % 7 === 0 || d % 7 === 6;
                        if (isWeekend) {
                          return (
                            <td key={d} className="py-1 px-1 bg-slate-50/60 text-slate-300 text-[10px] border-r border-slate-100">
                              -
                            </td>
                          );
                        }
                        const isLeaveDay = d === 28;
                        return (
                          <td key={d} className="py-1 px-1 border-r border-slate-100 text-[11px] font-semibold">
                            {isLeaveDay ? (
                              <span className="text-blue-600 font-bold bg-blue-50 px-1 rounded">P</span>
                            ) : (
                              <span className="text-emerald-700 font-bold">1.0</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Geofencing Configuration (KHOANH VÙNG VỊ TRÍ) */}
      {activeSubTab === 'geofence' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Cấu Hình Vùng Địa Lý Chấm Công (Geofencing Settings)</h3>
                <p className="text-xs text-slate-500">
                  Quy định bán kính và tọa độ GPS hợp lệ. Nhân viên chỉ được chấp nhận chấm công khi điện thoại ở trong vùng này.
                </p>
              </div>
              <button className="flex items-center gap-1.5 px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold shadow-xs">
                <Plus className="w-4 h-4" />
                <span>Thêm Địa Điểm / Chi Nhánh</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {offices.map((off) => (
                <div key={off.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{off.name}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        {off.address}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {off.status}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tọa độ GPS:</span>
                      <span className="font-bold text-slate-800">{off.lat}, {off.lng}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Bán kính cho phép:</span>
                      <span className="font-bold text-orange-600">{off.radiusMeters} mét (Geofence)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">BSSID Wifi:</span>
                      <span className="font-semibold text-blue-600 truncate max-w-[150px]">{off.wifiBSSID}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-slate-500">Chống Fake GPS:</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Bật
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* How Geofencing Works Box */}
            <div className="p-4 bg-orange-50/70 rounded-xl border border-orange-200 text-xs space-y-2 text-slate-700">
              <h4 className="font-bold text-orange-950 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-orange-600" />
                Cơ Chế Tính Khoảng Cách Haversine Formula & Xác Thực Vùng:
              </h4>
              <p className="leading-relaxed">
                Khi nhân viên bấm <strong>"Chấm Công Vào"</strong> trên điện thoại:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
                <li>Ứng dụng yêu cầu quyền truy cập định vị chính xác (High Accuracy GPS Coordinates: <code>Lat, Lng</code>).</li>
                <li>Hệ thống tính toán khoảng cách đường chim bay từ tọa độ của máy tới tâm văn phòng.</li>
                <li>Nếu khoảng cách <strong>&le; {offices[0].radiusMeters}m</strong> $\rightarrow$ Chấm công <strong>Hợp Lệ</strong>.</li>
                <li>Nếu khoảng cách <strong>&gt; {offices[0].radiusMeters}m</strong> $\rightarrow$ Cảnh báo <strong>"Ngoài Phạm Vi"</strong> và chặn chấm công (hoặc yêu cầu kèm giải trình gửi sếp duyệt).</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: Mobile GPS Simulator */}
      {activeSubTab === 'mobile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
              <Smartphone className="w-5 h-5 text-orange-500" />
              <span>Chấm Công 1 Chạm (Mobile Self-Service)</span>
            </div>

            <div className="p-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl text-white space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-400" />
                  Văn phòng Hà Nội (Tòa Five Star Kim Giang)
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  GPS Hợp lệ (&lt; 80m)
                </span>
              </div>

              <div className="text-center py-4">
                <p className="text-3xl font-mono font-bold tracking-wider text-orange-400" suppressHydrationWarning>
                  {isMounted ? liveTime : '08:30:00'}
                </p>
                <p className="text-xs text-slate-400 mt-1" suppressHydrationWarning>
                  {isMounted ? liveDate : 'Thứ Tư, 2 tháng 9, 2026'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleCheckIn('Mobile GPS', 'Tọa độ: 20.9982, 105.8174 (Khoảng cách: 12m)')}
                  className="py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
                >
                  Check-in Vào Ca
                </button>
                <button
                  onClick={handleCheckOut}
                  className="py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Check-out Ra Ca
                </button>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-2">
              <p className="font-semibold text-slate-800">Lịch sử check-in hôm nay:</p>
              {todayAttendance.map((rec) => (
                <div key={rec.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{rec.shiftName}</p>
                    <p className="text-[11px] text-slate-500">{rec.checkInLocation}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-600 text-sm">
                      {rec.checkIn || '--:--'} - {rec.checkOut || '--:--'}
                    </span>
                    <p className="text-[10px] text-slate-400">{rec.checkInSource}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              Cơ Chế Bảo Mật & Chống Gian Lận Chấm Công
            </h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-900">Geofencing GPS Chính Xác</p>
                  <p className="text-emerald-700 mt-0.5">Bán kính cho phép check-in trong phạm vi 80m quanh tâm văn phòng.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                <Wifi className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-blue-900">Xác thực BSSID Wifi Nội Bộ</p>
                  <p className="text-blue-700 mt-0.5">Chỉ chấp nhận chấm công khi kết nối vào mạng Wifi được phê duyệt.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                <Smartphone className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-purple-900">Phát Hiện & Chặn Fake GPS</p>
                  <p className="text-purple-700 mt-0.5">Phát hiện ứng dụng Mock Location hoặc thay đổi vị trí ảo trên thiết bị.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 4: Shifts */}
      {activeSubTab === 'shifts' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Danh Mục Ca Làm Việc Trong Doanh Nghiệp</h3>
            <span className="text-xs font-semibold text-slate-500">{shifts.length} Ca đã định nghĩa</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shifts.map((s) => (
              <div key={s.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{s.name}</span>
                  <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 font-bold text-[10px]">
                    {s.code}
                  </span>
                </div>
                <p className="text-slate-600">
                  Thời gian: <strong className="text-slate-900">{s.startTime} - {s.endTime}</strong>
                </p>
                <p className="text-slate-500">
                  Nghỉ giữa ca: {s.breakStartTime} - {s.breakEndTime}
                </p>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[11px]">
                  <span className="text-slate-500">Công chuẩn:</span>
                  <span className="font-bold text-emerald-600">{s.standardWorkUnits} công</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 5: Hardware Devices ZKTeco */}
      {activeSubTab === 'devices' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-orange-500" />
              <h3 className="font-bold text-slate-900 text-sm">Tool Tích Hợp SDK Máy Chấm Công (&gt; 90% dòng máy)</h3>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Đồng Bộ Log Ngay</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {[
              { name: '1Office HN - Cửa sảnh T3', ip: '192.168.1.23', port: '4370', type: 'ZKTeco Bio G3', logs: 4960, status: 'Online' },
              { name: '1Office CP WW - Cửa kính', ip: '28.6.4.58', port: '4370', type: 'Ronald Jack X628', logs: 1203, status: 'Online' },
              { name: '1Office HCM - Tòa Pax Sky', ip: '28.6.4.59', port: '4370', type: 'Hikvision FaceID DS-K1T671', logs: 2181, status: 'Online' },
            ].map((dev, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-900">{dev.name}</p>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {dev.status}
                  </span>
                </div>
                <p className="text-slate-500">IP: {dev.ip}:{dev.port} • Model: {dev.type}</p>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px]">
                  <span className="text-slate-500">Số log đã tải:</span>
                  <span className="font-bold text-orange-600">{dev.logs.toLocaleString()} logs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
