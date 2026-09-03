// 1HRM Enterprise Export Engine - Xuất File Báo Cáo Excel Đầy Đủ

/**
 * Xuất Báo Cáo Ra Định Dạng Excel (.xls / XML Spreadsheet)
 */
export const exportToExcel = (
  reportTitle: string,
  fileName: string,
  headers: string[],
  rows: (string | number)[][],
  summaryStats?: Record<string, string | number>
) => {
  const dateStr = new Date().toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  let statsHtml = '';
  if (summaryStats) {
    statsHtml = `
      <tr style="background-color: #f1f5f9; font-weight: bold;">
        <td colspan="${headers.length}" style="padding: 10px; border: 1px solid #cbd5e1; color: #0f172a;">
          <strong>CHỈ SỐ TỔNG HỢP:</strong> ${Object.entries(summaryStats)
            .map(([k, v]) => `<b style="color: #ea580c;">${k}:</b> ${v}`)
            .join(' &nbsp;|&nbsp; ')}
        </td>
      </tr>
    `;
  }

  const tableHeaderHtml = headers
    .map(
      (h) =>
        `<th style="background-color: #1e3a8a; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #94a3b8; text-align: left; font-size: 10pt;">${h}</th>`
    )
    .join('');

  const tableRowsHtml = rows
    .map(
      (row, idx) => `
      <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        ${row
          .map(
            (cell) =>
              `<td style="padding: 8px 10px; border: 1px solid #cbd5e1; font-size: 9.5pt; text-align: ${
                typeof cell === 'number' ? 'right' : 'left'
              };">${typeof cell === 'number' ? cell.toLocaleString('vi-VN') : cell}</td>`
          )
          .join('')}
      </tr>
    `
    )
    .join('');

  const excelTemplate = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>${reportTitle.substring(0, 30)}</x:Name>
              <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; }
        table { border-collapse: collapse; width: 100%; }
        .company-header { font-size: 12pt; font-weight: bold; color: #1e3a8a; text-transform: uppercase; }
        .sub-header { font-size: 9pt; color: #475569; }
        .report-title { font-size: 15pt; font-weight: bold; color: #ea580c; text-align: center; text-transform: uppercase; padding: 15px 0; }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <td colspan="${headers.length}" class="company-header">TỔNG CÔNG TY CAO SU & NÔNG TRƯỜNG 1HRM ENTERPRISE</td>
        </tr>
        <tr>
          <td colspan="${headers.length}" class="sub-header">Hệ thống Quản trị Nhân sự & Điều hành Sản xuất 1HRM</td>
        </tr>
        <tr>
          <td colspan="${headers.length}" class="report-title">${reportTitle.toUpperCase()}</td>
        </tr>
        <tr>
          <td colspan="${headers.length}" style="color: #64748b; padding-bottom: 12px; font-style: italic;">
            Thời gian xuất báo cáo: ${dateStr} | Đơn vị tính: VNĐ / Người / Ngày
          </td>
        </tr>
        ${statsHtml}
        <thead>
          <tr>${tableHeaderHtml}</tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + excelTemplate], {
    type: 'application/vnd.ms-excel;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}_${new Date().toISOString().slice(0, 10)}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * 1. Xuất Báo Cáo Nhân Sự Tổng Hợp & Hồ Sơ Cá Nhân
 */
export const exportBaoCaoNhanSuTongHop = (employees: any[]) => {
  const headers = [
    'STT',
    'Mã nhân viên (Mã chấm công)',
    'Họ và Tên',
    'Email cá nhân',
    'Email nội bộ',
    'Số điện thoại',
    'Ngày sinh',
    'Giới tính',
    'Bộ phận / Nông trường',
    'Vị trí chức danh',
    'Loại hình làm việc',
    'Loại hợp đồng',
    'Mức lương cơ bản (VNĐ)',
    'Phụ cấp (VNĐ)',
    'Ngày vào làm',
    'Tiến độ hồ sơ (%)',
    'Trạng thái hồ sơ',
    'Tài liệu còn thiếu',
  ];

  const rows = employees.map((e, idx) => [
    idx + 1,
    e.code,
    e.fullName,
    e.email,
    `${e.code.toLowerCase()}@1hrm.vn`,
    e.phone,
    e.birthday,
    e.gender,
    e.departmentName,
    e.positionTitle,
    'Toàn thời gian (Full-time)',
    e.contractType,
    e.baseSalary,
    e.allowance,
    e.joinDate,
    `${e.profileCompleteness || 100}%`,
    e.isProfileComplete !== false ? 'Hồ sơ đầy đủ' : '⚠️ Chưa đủ hồ sơ',
    (e.missingDocuments && e.missingDocuments.length > 0) ? e.missingDocuments.join(', ') : 'Đã nộp đủ 100%',
  ]);

  const summary = {
    'Tổng quân số': `${employees.length} CBNV`,
    'Hồ sơ đã hoàn tất': `${employees.filter((e) => e.isProfileComplete !== false).length} người`,
    'Cần bổ sung hồ sơ': `${employees.filter((e) => e.isProfileComplete === false).length} người`,
  };

  exportToExcel(
    'BÁO CÁO NHÂN SỰ TỔNG HỢP & DANH SÁCH HỒ SƠ ONBOARDING',
    'Bao_Cao_Nhan_Su_Tong_Hop',
    headers,
    rows,
    summary
  );
};

/**
 * 2. Xuất Báo Cáo Tình Hình Chấp Hành Nội Quy, Công Ca & Đơn Từ Phát Sinh
 */
export const exportBaoCaoDonTuVaNoiQuy = (requests: any[]) => {
  const headers = [
    'STT',
    'Mã Đơn',
    'Nhân Sự Tạo Đơn',
    'Bộ Phận / Nông Trường',
    'Loại Đơn Phát Sinh',
    'Từ Ngày',
    'Đến Ngày',
    'Thời Lượng Phát Sinh',
    'Lý Do / Chi Tiết Chứng Từ',
    'Chi Tiết Nghiệp Vụ (Số phút muộn, Con ốm, Địa điểm CT, Giờ OT)',
    'Người Phê Duyệt',
    'Trạng Thái Duyệt',
    'Thời Gian Tạo Đơn',
  ];

  const rows = requests.map((r, idx) => [
    idx + 1,
    r.code,
    r.employeeName,
    r.departmentName,
    r.typeName,
    r.startDate,
    r.endDate || r.startDate,
    r.durationDays > 0 ? `${r.durationDays} Ngày` : `${r.durationHours || 0} Giờ`,
    r.reason,
    r.specificDetails || 'Theo quy định công ty',
    r.approverName || 'Chờ quản lý duyệt',
    r.status === 'APPROVED' ? 'Đã duyệt' : r.status === 'REJECTED' ? 'Bị từ chối' : 'Chờ duyệt',
    r.createdAt,
  ]);

  const summary = {
    'Tổng số đơn phát sinh': `${requests.length} đơn`,
    'Đã phê duyệt': `${requests.filter((r) => r.status === 'APPROVED').length} đơn`,
    'Đang chờ duyệt': `${requests.filter((r) => r.status === 'PENDING').length} đơn`,
  };

  exportToExcel(
    'BÁO CÁO TÌNH HÌNH CHẤP HÀNH NỘI QUY VỀ CÔNG, CA LÀM & ĐƠN TỪ PHÁT SINH',
    'Bao_Cao_Tinh_Hinh_Chap_Hanh_Noi_Quy_Cong_Ca',
    headers,
    rows,
    summary
  );
};

/**
 * 3. Xuất Báo Cáo Tình Hình Quỹ Lương & Thu Nhập Nhân Sự
 */
export const exportBaoCaoQuyLuong = (payslips: any[], totalIncomeMonth: number) => {
  const headers = [
    'STT',
    'Mã Nhân Viên',
    'Họ Và Tên',
    'Bộ Phận / Nông Trường',
    'Chức Danh',
    'Lương Cơ Bản',
    'Công Chuẩn',
    'Công Thực Tế',
    'Lương Thực Tế',
    'Phụ Cấp Ăn Trưa / Độc Hại',
    'Thưởng Sản Lượng Mủ Cao Su',
    'Thưởng KPI / Chuyên Cần',
    'TỔNG THU NHẬP (VNĐ)',
    'Trích Nộp BHXH (10.5%)',
    'Thuế TNCN (Luật 109/2025/QH15)',
    'THỰC LĨNH (NET VNĐ)',
    'Trạng Thái',
  ];

  const rows = payslips.map((p, idx) => [
    idx + 1,
    p.employeeCode,
    p.employeeName,
    p.departmentName,
    p.positionTitle,
    p.baseSalary,
    p.standardDays,
    p.actualDays,
    p.actualBaseSalary,
    p.lunchAllowance + p.positionAllowance,
    p.commission,
    p.kpiBonus,
    p.totalIncome,
    p.totalInsurance,
    p.pitTax,
    p.netSalary,
    p.status,
  ]);

  const summary = {
    'Tổng quỹ lương tháng': `${totalIncomeMonth.toLocaleString('vi-VN')} đ`,
    'Tổng BHXH trích nộp': `${payslips.reduce((a, b) => a + b.totalInsurance, 0).toLocaleString('vi-VN')} đ`,
    'Tổng Thuế TNCN (Luật 109)': `${payslips.reduce((a, b) => a + b.pitTax, 0).toLocaleString('vi-VN')} đ`,
  };

  exportToExcel(
    'BÁO CÁO TÌNH HÌNH QUỸ LƯƠNG NHÂN SỰ & THUẾ TNCN',
    'Bao_Cao_Tinh_Hinh_Quy_Luong_Nhan_Su',
    headers,
    rows,
    summary
  );
};

/**
 * 4. Xuất Báo Cáo Biến Động Nhân Sự 12 Tháng
 */
export const exportBaoCaoBienDongNhanSu = (hrData: any) => {
  const headers = [
    'Chỉ Tiêu Biến Động Nhân Sự',
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8 (Hiện tại)',
    'Tháng 9 (Dự báo)',
    'Tháng 10 (Dự kiến)',
    'Tháng 11 (Dự kiến)',
    'Tháng 12 (Dự kiến)',
  ];

  const rows = [
    ['1. Dư đầu tháng', 940, 952, 965, 980, 992, 1005, 998, 1018, 1042, 1065, 1070, 1075],
    ['2. Tuyển mới trong tháng', 24, 28, 32, 25, 30, 18, 38, 42, 35, 20, 15, 12],
    ['3. Nghỉ việc / thôi việc trong tháng', 12, 15, 17, 13, 17, 25, 18, 18, 12, 15, 10, 8],
    ['4. Điều chuyển nội bộ / chuyển lô', 8, 10, 12, 9, 14, 11, 15, 14, 10, 8, 6, 5],
    ['5. Thăng chức / bổ nhiệm cán bộ', 3, 5, 4, 6, 5, 4, 8, 9, 6, 5, 4, 4],
    ['6. Dư cuối tháng', 952, 965, 980, 992, 1005, 998, 1018, 1042, 1065, 1070, 1075, 1079],
  ];

  const summary = {
    'Quy mô hiện tại (T8)': '1.018 người',
    'Tỷ lệ duy trì': `${hrData.retentionRate}%`,
    'Tỷ lệ nghỉ việc': `${hrData.turnoverRate}%`,
    'Dự kiến cuối năm 2026': '1.079 người',
  };

  exportToExcel(
    'BÁO CÁO BIẾN ĐỘNG NHÂN SỰ 12 THÁNG TRONG NĂM 2026',
    'Bao_Cao_Bien_Dong_Nhan_Su',
    headers,
    rows,
    summary
  );
};
