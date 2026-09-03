// 1HRM Enterprise Export Engine - Xuất File Excel Đa Sheet (Multi-Sheet Worksheets)

export interface ExcelSheetData {
  sheetName: string;
  title: string;
  headers: string[];
  rows: (string | number)[][];
  summaryStats?: Record<string, string | number>;
}

/**
 * Xuất File Excel Đa Sheet chuẩn định dạng XML Spreadsheet 2003 (Hỗ trợ 100% tất cả các Sheet trong Excel)
 */
export const exportMultiSheetExcel = (fileName: string, sheets: ExcelSheetData[]) => {
  const dateStr = new Date().toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  const escapeXml = (str: any) => {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const worksheetsXml = sheets
    .map((s) => {
      const cleanSheetName = escapeXml(s.sheetName.substring(0, 31));

      // Title & Subtitle Rows
      let rowsXml = `
        <Row ss:Height="22">
          <Cell ss:StyleID="CompanyHeader" ss:MergeAcross="${Math.max(0, s.headers.length - 1)}">
            <Data ss:Type="String">TỔNG CÔNG TY CAO SU &amp; NÔNG TRƯỜNG 1HRM ENTERPRISE</Data>
          </Cell>
        </Row>
        <Row ss:Height="18">
          <Cell ss:StyleID="SubHeader" ss:MergeAcross="${Math.max(0, s.headers.length - 1)}">
            <Data ss:Type="String">Hệ thống Quản trị Nhân sự &amp; Điều hành Sản xuất 1HRM | Ngày xuất: ${dateStr}</Data>
          </Cell>
        </Row>
        <Row ss:Height="26">
          <Cell ss:StyleID="ReportTitle" ss:MergeAcross="${Math.max(0, s.headers.length - 1)}">
            <Data ss:Type="String">${escapeXml(s.title.toUpperCase())}</Data>
          </Cell>
        </Row>
      `;

      // Summary Stats Row if any
      if (s.summaryStats && Object.keys(s.summaryStats).length > 0) {
        const statsStr = Object.entries(s.summaryStats)
          .map(([k, v]) => `${k}: ${v}`)
          .join('   |   ');
        rowsXml += `
          <Row ss:Height="20">
            <Cell ss:StyleID="StatsHeader" ss:MergeAcross="${Math.max(0, s.headers.length - 1)}">
              <Data ss:Type="String">CHỈ SỐ TỔNG HỢP: ${escapeXml(statsStr)}</Data>
            </Cell>
          </Row>
        `;
      }

      // Space
      rowsXml += `<Row ss:Height="6"></Row>`;

      // Header Row
      rowsXml += `
        <Row ss:Height="24">
          ${s.headers
            .map(
              (h) => `
            <Cell ss:StyleID="HeaderCell">
              <Data ss:Type="String">${escapeXml(h)}</Data>
            </Cell>
          `
            )
            .join('')}
        </Row>
      `;

      // Data Rows
      s.rows.forEach((row, rIdx) => {
        const styleId = rIdx % 2 === 0 ? 'DataRowEven' : 'DataRowOdd';
        const numStyleId = rIdx % 2 === 0 ? 'NumberCellEven' : 'NumberCellOdd';

        rowsXml += `
          <Row ss:Height="19">
            ${row
              .map((cell) => {
                if (typeof cell === 'number') {
                  return `
                    <Cell ss:StyleID="${numStyleId}">
                      <Data ss:Type="Number">${cell}</Data>
                    </Cell>
                  `;
                }
                return `
                  <Cell ss:StyleID="${styleId}">
                    <Data ss:Type="String">${escapeXml(cell)}</Data>
                  </Cell>
                `;
              })
              .join('')}
          </Row>
        `;
      });

      return `
        <Worksheet ss:Name="${cleanSheetName}">
          <Table ss:DefaultRowHeight="18">
            ${s.headers.map(() => `<Column ss:AutoFitWidth="1" ss:Width="130"/>`).join('')}
            ${rowsXml}
          </Table>
          <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
            <Selected/>
            <DisplayGridlines/>
          </WorksheetOptions>
        </Worksheet>
      `;
    })
    .join('');

  const xmlWorkbook = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#0F172A"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="CompanyHeader">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="11" ss:Bold="1" ss:Color="#1E3A8A"/>
  </Style>
  <Style ss:ID="SubHeader">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Italic="1" ss:Color="#64748B"/>
  </Style>
  <Style ss:ID="ReportTitle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="14" ss:Bold="1" ss:Color="#EA580C"/>
  </Style>
  <Style ss:ID="StatsHeader">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Bold="1" ss:Color="#0F172A"/>
   <Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
  </Style>
  <Style ss:ID="HeaderCell">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#1E3A8A" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#94A3B8"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#94A3B8"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#94A3B8"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#94A3B8"/>
   </Borders>
  </Style>
  <Style ss:ID="DataRowEven">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Color="#1E293B"/>
   <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="DataRowOdd">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Color="#1E293B"/>
   <Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="NumberCellEven">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Color="#0F172A" ss:Bold="1"/>
   <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="NumberCellOdd">
   <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Color="#0F172A" ss:Bold="1"/>
   <Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/>
   <NumberFormat ss:Format="#,##0"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
 </Styles>
 ${worksheetsXml}
</Workbook>`;

  const blob = new Blob([xmlWorkbook], {
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

export const exportToExcel = (
  reportTitle: string,
  fileName: string,
  headers: string[],
  rows: (string | number)[][],
  summaryStats?: Record<string, string | number>
) => {
  exportMultiSheetExcel(fileName, [
    {
      sheetName: reportTitle.substring(0, 30),
      title: reportTitle,
      headers,
      rows,
      summaryStats,
    },
  ]);
};

// ----------------------------------------------------------------------
// 1. BÁO CÁO NHÂN SỰ TỔNG HỢP (6 SHEETS ĐẦY ĐỦ NHƯ MẪU)
// ----------------------------------------------------------------------

export const exportBaoCaoNhanSuTongHop = (employees: any[]) => {
  // Sheet 1: 1. Danh sách nhân sự
  const s1Headers = ['STT', 'Mã nhân viên (Mã chấm công)', 'Họ', 'Tên', 'Email cá nhân', 'Email nội bộ', 'Số điện thoại', 'Ngày sinh', 'Giới tính', 'Bộ phận', 'Vị trí', 'Loại hợp đồng', 'Ngày vào làm', 'Trạng thái'];
  const s1Rows = employees.map((e, idx) => {
    const parts = e.fullName.trim().split(' ');
    const firstName = parts[parts.length - 1];
    const lastName = parts.slice(0, parts.length - 1).join(' ');
    return [
      idx + 1,
      e.code,
      lastName,
      firstName,
      e.email,
      `${e.code.toLowerCase()}@1hrm.vn`,
      e.phone,
      e.birthday,
      e.gender,
      e.departmentName,
      e.positionTitle,
      e.contractType,
      e.joinDate,
      e.status,
    ];
  });

  // Sheet 2: 2. Hồ sơ cá nhân
  const s2Headers = ['STT', 'Mã nhân viên', 'Họ và Tên', 'Số CCCD/CMND', 'Ngày cấp', 'Nơi cấp', 'Địa chỉ thường trú', 'Quê quán', 'Mã số thuế', 'Mã số BHXH', 'Ngân hàng', 'Số tài khoản'];
  const s2Rows = employees.map((e, idx) => [
    idx + 1,
    e.code,
    e.fullName,
    e.idCard,
    e.idCardDate,
    e.idCardPlace,
    e.address,
    e.nativePlace,
    e.taxCode,
    e.socialInsuranceCode || 'Chờ cấp',
    e.bankName,
    e.bankAccount,
  ]);

  // Sheet 3: 3. Hợp đồng
  const s3Headers = ['STT', 'Mã nhân viên', 'Họ và Tên', 'Phòng ban / Nông trường', 'Loại hợp đồng', 'Ngày hiệu lực', 'Lương cơ bản (VNĐ)', 'Lương đóng bảo hiểm', 'Người đại diện ký', 'Trạng thái hợp đồng'];
  const s3Rows = employees.map((e, idx) => [
    idx + 1,
    e.code,
    e.fullName,
    e.departmentName,
    e.contractType,
    e.joinDate,
    e.baseSalary,
    Math.min(e.baseSalary, 46800000),
    'Lê Việt Thắng (Tổng Giám Đốc)',
    'Hiệu lực',
  ]);

  // Sheet 4: 4. Nhân sự mới
  const s4Headers = ['STT', 'Thời gian Onboard', 'Ngày bắt đầu', 'Mã nhân viên', 'Họ và Tên', 'Vị trí công việc', 'Bộ phận', 'Tiến độ hồ sơ (%)', 'Trạng thái Onboard', 'Tài liệu còn thiếu'];
  const newHires = employees.filter((e) => e.status === 'Thử việc' || (e.profileCompleteness && e.profileCompleteness < 100));
  const s4Rows = (newHires.length > 0 ? newHires : employees.slice(0, 3)).map((e, idx) => [
    idx + 1,
    'Tháng 08/2026',
    e.joinDate,
    e.code,
    e.fullName,
    e.positionTitle,
    e.departmentName,
    `${e.profileCompleteness || 60}%`,
    e.isProfileComplete !== false ? 'Đã hoàn tất 100%' : '⚠️ Cần bổ sung hồ sơ',
    (e.missingDocuments && e.missingDocuments.length > 0) ? e.missingDocuments.join(', ') : 'Đã nộp đủ',
  ]);

  // Sheet 5: 5. Nhân sự nghỉ việc
  const s5Headers = ['STT', 'Thời gian', 'Ngày nghỉ việc', 'Mã nhân viên', 'Họ và Tên', 'Bộ phận', 'Vị trí', 'Lý do thôi việc', 'Bàn giao tài sản'];
  const s5Rows = [
    [1, 'Tháng 08/2026', '15/08/2026', 'NV-0088', 'Trịnh Quốc Tuấn', 'Nông Trường 2 (Bình Dương)', 'Công nhân cạo mủ', 'Chuyển nơi cư trú về quê', 'Đã bàn giao 100%'],
    [2, 'Tháng 08/2026', '28/08/2026', 'NV-0092', 'Lý Thu Trang', 'Khối Văn Phòng', 'Chuyên viên kế toán', 'Lý do cá nhân', 'Đã bàn giao 100%'],
  ];

  // Sheet 6: 6. Biến động tiền lương
  const s6Headers = ['STT', 'Mã nhân viên', 'Họ và Tên', 'Bộ phận', 'Mức lương cũ (VNĐ)', 'Mức lương mới (VNĐ)', 'Tỷ lệ tăng (%)', 'Ngày có hiệu lực', 'Quyết định ban hành'];
  const s6Rows = [
    [1, 'NV-0001', 'Phạm Thùy Linh', 'Phòng Hành Chính Tổng Hợp & HR', 25000000, 28000000, 12.0, '01/08/2026', 'QĐ-TL-2026-081'],
    [2, 'NV-0003', 'Trần Thị Huệ', 'Khối Văn Phòng & Kỹ Thuật', 19000000, 22000000, 15.8, '01/08/2026', 'QĐ-TL-2026-082'],
  ];

  const sheets: ExcelSheetData[] = [
    {
      sheetName: '1. Danh sách nhân sự',
      title: 'DANH SÁCH THEO DÕI THÔNG TIN NHÂN SỰ TOÀN HỆ THỐNG',
      headers: s1Headers,
      rows: s1Rows,
      summaryStats: { 'Tổng quân số': `${employees.length} CBNV` },
    },
    {
      sheetName: '2. Hồ sơ cá nhân',
      title: 'HỒ SƠ LÝ LỊCH CÁ NHÂN & THÔNG TIN ĐỊNH DANH 360°',
      headers: s2Headers,
      rows: s2Rows,
    },
    {
      sheetName: '3. Hợp đồng',
      title: 'THEO DÕI HỢP ĐỒNG LAO ĐỘNG & MỨC ĐÓNG BẢO HIỂM',
      headers: s3Headers,
      rows: s3Rows,
    },
    {
      sheetName: '4. Nhân sự mới',
      title: 'THEO DÕI TIẾP NHẬN NHÂN SỰ MỚI (ONBOARDING) & CHECKLIST HỒ SƠ',
      headers: s4Headers,
      rows: s4Rows,
    },
    {
      sheetName: '5. Nhân sự nghỉ việc',
      title: 'DANH SÁCH NHÂN SỰ NGHỈ VIỆC & THỦ TỤC THÔI VIỆC',
      headers: s5Headers,
      rows: s5Rows,
    },
    {
      sheetName: '6. Biến động tiền lương',
      title: 'THEO DÕI BIẾN ĐỘNG & ĐIỀU CHỈNH TIỀN LƯƠNG NHÂN VIÊN',
      headers: s6Headers,
      rows: s6Rows,
    },
  ];

  exportMultiSheetExcel('Bao_Cao_Nhan_Su_Tong_Hop_6Sheets', sheets);
};

// ----------------------------------------------------------------------
// 2. BÁO CÁO TÌNH HÌNH CHẤP HÀNH NỘI QUY VỀ CÔNG, CA LÀM (7 SHEETS ĐẦY ĐỦ)
// ----------------------------------------------------------------------

export const exportBaoCaoDonTuVaNoiQuy = (requests: any[]) => {
  // Sheet 1: 01.DASHBOARDS
  const s1Headers = ['Chỉ Số Chấm Công & Tuân Thủ', 'Nông Trường 1', 'Nông Trường 2', 'Nông Trường 3', 'Khối Văn Phòng', 'Toàn Công Ty'];
  const s1Rows = [
    ['Tỷ lệ đi làm đúng giờ (%)', 98.2, 96.8, 97.5, 97.1, 97.4],
    ['Tỷ lệ tuân thủ quy chế công (%)', 99.1, 97.8, 98.4, 99.0, 98.6],
    ['Số lượt đi muộn trong tháng', 14, 22, 18, 5, 59],
    ['Số lượt về sớm trong tháng', 8, 12, 10, 4, 34],
    ['Số đơn nghỉ con ốm (Luật BHXH)', 6, 8, 9, 3, 26],
    ['Số vụ vi phạm nội quy xử lý', 5, 8, 9, 4, 26],
  ];

  // Sheet 2: 02.BCC Vào Ra
  const s2Headers = ['Mã NV', 'Tên nhân viên', 'Giới tính', 'Phòng ban / Nông trường', 'Chức vụ', 'Ngày làm việc', 'Giờ Vào (IN)', 'Giờ Ra (OUT)', 'Trạng Thái Chấm Công'];
  const s2Rows = [
    ['NV-0001', 'Phạm Thùy Linh', 'Nữ', 'Phòng Hành Chính Tổng Hợp', 'Trưởng phòng', '02/09/2026', '08:15', '17:35', 'Đúng giờ'],
    ['NV-0002', 'Lê Việt Thắng', 'Nam', 'Ban Tổng Giám Đốc', 'Tổng Giám Đốc', '02/09/2026', '08:00', '18:10', 'Đúng giờ'],
    ['NV-0003', 'Trần Thị Huệ', 'Nữ', 'Khối Văn Phòng', 'Trưởng khối', '02/09/2026', '08:55', '17:30', 'Đi muộn 25p (Có đơn)'],
    ['NV-0004', 'Nguyễn Văn Minh', 'Nam', 'Nông Trường 1 (Bình Phước)', 'Kỹ sư nông nghiệp', '01/09/2026', '05:30', '16:30', 'Về sớm 60p (Có đơn)'],
  ];

  // Sheet 3: BCNV đi muộn, về sớm, nghỉ
  const s3Headers = ['STT', 'Mã Đơn', 'Nhân Sự', 'Bộ Phận', 'Loại Đơn Phát Sinh', 'Từ Ngày', 'Đến Ngày', 'Thời Lượng', 'Chi Tiết (Số phút muộn, Con ốm, Mã C65-HD)', 'Người Duyệt', 'Trạng Thái'];
  const s3Rows = requests.map((r, idx) => [
    idx + 1,
    r.code,
    r.employeeName,
    r.departmentName,
    r.typeName,
    r.startDate,
    r.endDate || r.startDate,
    r.durationDays > 0 ? `${r.durationDays} Ngày` : `${r.durationHours || 0} Giờ`,
    r.specificDetails || r.reason,
    r.approverName || 'Chờ duyệt',
    r.status === 'APPROVED' ? 'Đã duyệt' : 'Chờ duyệt',
  ]);

  // Sheet 4: Tình hình nghỉ phép năm
  const s4Headers = ['STT', 'Mã NV', 'Họ Và Tên', 'Phòng Ban / Nông Trường', 'Quỹ Phép Năm (Ngày)', 'Đã Nghỉ (Ngày)', 'Còn Lại (Ngày)', 'Tỷ Lệ Đã Dùng (%)'];
  const s4Rows = [
    [1, 'NV-0001', 'Phạm Thùy Linh', 'Phòng HCTH & HR', 12, 2, 10, 16.7],
    [2, 'NV-0002', 'Lê Việt Thắng', 'Ban Tổng Giám Đốc', 12, 0, 12, 0.0],
    [3, 'NV-0003', 'Trần Thị Huệ', 'Khối Văn Phòng', 12, 4, 8, 33.3],
    [4, 'NV-0004', 'Nguyễn Văn Minh', 'Nông Trường 1', 12, 0, 12, 0.0],
  ];

  // Sheet 5: DSNV đi công tác
  const s5Headers = ['STT', 'Mã Đơn', 'Cán Bộ Đi Công Tác', 'Bộ Phận', 'Từ Ngày', 'Đến Ngày', 'Địa Điểm Công Tác', 'Phương Tiện', 'Mục Đích Chỉ Đạo'];
  const s5Rows = [
    [1, 'ĐƠN-CT06', 'Phạm Thùy Linh', 'Phòng HCTH & HR', '05/09/2026', '07/09/2026', 'Nông Trường 1 & Nông Trường 2', 'Xe công vụ', 'Khảo sát định mức lô cạo và hướng dẫn app 1HRM'],
  ];

  // Sheet 6: DSNV làm thêm giờ (OT)
  const s6Headers = ['STT', 'Mã Đơn', 'Nhân Sự Làm OT', 'Bộ Phận', 'Ngày Làm Thêm', 'Số Giờ OT', 'Loại Ca (Ngày/Đêm/Nghỉ)', 'Hệ Số Lương (%)', 'Lý Do & Nội Dung'];
  const s6Rows = [
    [1, 'ĐƠN-OT07', 'Nguyễn Văn Minh', 'Nông Trường 1 (Bình Phước)', '30/08/2026', 4, 'Ca đêm thu mua mủ', 200, 'Hỗ trợ trạm thu mua mủ nước số 2 phân loại và cân mủ'],
  ];

  // Sheet 7: Xử lý vi phạm kỷ luật
  const s7Headers = ['STT', 'Mã Vi Phạm', 'Nhân Sự', 'Đơn Vị', 'Ngày Vi Phạm', 'Hành Vi Vi Phạm', 'Hình Thức Xử Lý', 'Trạng Thái'];
  const s7Rows = [
    [1, 'VP-001', 'Trần Văn Bình', 'Tổ 2 - Nông Trường 1', '28/08/2026', 'Vi phạm kỹ thuật cạo mủ', 'Nhắc nhở nội bộ', 'Đã xử lý'],
    [2, 'VP-002', 'Lê Hoàng Nam', 'Tổ 4 - Nông Trường 2', '25/08/2026', 'Không đội mũ BHLĐ', 'Nhắc nhở nội bộ', 'Đã xử lý'],
  ];

  const sheets: ExcelSheetData[] = [
    { sheetName: '01.DASHBOARDS', title: 'TỔNG QUAN THEO DÕI CHẤP HÀNH NỘI QUY & CÔNG CA', headers: s1Headers, rows: s1Rows },
    { sheetName: '02.BCC Vào Ra', title: 'BẢNG CHẤM CÔNG CHI TIẾT VÀO RA - ĐI MUỘN VỀ SỚM', headers: s2Headers, rows: s2Rows },
    { sheetName: 'BCNV đi muộn, về sớm, nghỉ', title: 'SỔ THEO DÕI ĐƠN PHÁT SINH (ĐI MUỘN, CON ỐM, NGHỈ PHÉP)', headers: s3Headers, rows: s3Rows },
    { sheetName: 'Tình hình nghỉ phép năm', title: 'THEO DÕI QUỸ PHÉP NĂM VÀ TÌNH HÌNH SỬ DỤNG', headers: s4Headers, rows: s4Rows },
    { sheetName: 'DSNV đi công tác', title: 'DANH SÁCH NHÂN SỰ ĐI CÔNG TÁC HIỆN TRƯỜNG & NÔNG TRƯỜNG', headers: s5Headers, rows: s5Rows },
    { sheetName: 'DSNV làm thêm giờ (OT)', title: 'BÁO CÁO DANH SÁCH NHÂN SỰ LÀM THÊM GIỜ (OT)', headers: s6Headers, rows: s6Rows },
    { sheetName: 'Xử lý vi phạm kỷ luật', title: 'SỔ THEO DÕI VI PHẠM KỶ LUẬT VÀ HÌNH THỨC XỬ LÝ', headers: s7Headers, rows: s7Rows },
  ];

  exportMultiSheetExcel('Bao_Cao_Chap_Hanh_Noi_Quy_Cong_Ca_7Sheets', sheets);
};

// ----------------------------------------------------------------------
// 3. BÁO CÁO TÌNH HÌNH QUỸ LƯƠNG NHÂN SỰ (6 SHEETS ĐẦY ĐỦ)
// ----------------------------------------------------------------------

export const exportBaoCaoQuyLuong = (payslips: any[], totalIncomeMonth: number) => {
  // Sheet 1: 6.Dashboard Tổng quan
  const s1Headers = ['Chỉ Số Quỹ Lương & Thu Nhập', 'Tháng 08/2026 (VNĐ)', 'So Với Tháng Trước (%)', 'Ghi Chú Nghiệp Vụ'];
  const s1Rows = [
    ['Tổng Lương Cứng (Cơ bản)', 7200000000, 2.5, 'Lương định mức theo chức danh'],
    ['Tổng Tiền Lương Tháng', 10120000000, 3.8, 'Theo công thực tế & thời gian'],
    ['Tổng Phụ Cấp Ăn Ca / Độc Hại', 1450000000, 1.2, 'Theo quy chế nông trường'],
    ['Tổng Thưởng Sản Lượng Mủ Cao Su', 3445000000, 8.5, 'Sản lượng vượt định mức giao nộp'],
    ['TỔNG QUỸ LƯƠNG & THU NHẬP', 12850000000, 4.8, 'Tổng quỹ chi trả toàn công ty'],
    ['Tổng BHXH Trích Nộp (10.5%)', 1349250000, 2.0, 'Trích nộp theo Luật BHXH'],
    ['Tổng Thuế TNCN (Luật 109/2025/QH15)', 245000000, -12.4, 'Giảm trừ 15.5M bản thân, 6.2M phụ thuộc'],
    ['TỔNG THỰC LĨNH (NET)', 11255750000, 5.2, 'Chi trả qua tài khoản ngân hàng'],
  ];

  // Sheet 2: 5.Phân tích mức lương
  const s2Headers = ['Phân Khúc Mức Thu Nhập', 'Số Lượng Nhân Sự', 'Tỷ Lệ (%)', 'Cơ Cấu Vị Trí'];
  const s2Rows = [
    ['Dưới 5 triệu VNĐ', 18, 1.8, 'Học việc / thử việc ngắn hạn'],
    ['Từ 5 - 10 triệu VNĐ', 186, 18.3, 'Công nhân cạo mủ mới tiếp nhận'],
    ['Từ 10 - 20 triệu VNĐ', 684, 67.2, 'Công nhân cạo mủ chính thức & Chuyên viên'],
    ['Từ 20 - 30 triệu VNĐ', 112, 11.0, 'Tổ trưởng sản xuất & Kỹ sư nông nghiệp'],
    ['Trên 30 triệu VNĐ', 18, 1.8, 'Ban Giám Đốc Nông trường & Trưởng phòng'],
  ];

  // Sheet 3: 4.Phiếu lương mẫu
  const s3Headers = ['Khoản Mục Chi Trả', 'Công Thức / Định Mức', 'Số Tiền (VNĐ)'];
  const s3Rows = [
    ['1. Lương cơ bản', 'Lương hợp đồng', 28000000],
    ['2. Ngày công chuẩn', '24 ngày', 24],
    ['3. Ngày công thực tế', '24 ngày', 24],
    ['4. Lương thời gian thực tế', '(Lương CB / 24) * 24', 28000000],
    ['5. Phụ cấp trách nhiệm / chức vụ', 'Theo quy chế', 3000000],
    ['6. Phụ cấp ăn ca', '1.500.000 đ', 1500000],
    ['7. Thưởng hiệu quả KPI', 'KPI xếp loại A', 5000000],
    ['TỔNG THU NHẬP', 'Mục 4 + 5 + 6 + 7', 37500000],
    ['8. Trừ BHXH, BHYT, BHTN (10.5%)', '28.000.000 * 10.5%', -2940000],
    ['9. Giảm trừ gia cảnh bản thân', 'Luật 109/2025/QH15', -15500000],
    ['10. Thuế TNCN phải nộp', 'Biểu thuế lũy tiến 5 bậc', -1256000],
    ['THỰC LĨNH (NET)', 'Tổng thu nhập - Bảo hiểm - Thuế', 33304000],
  ];

  // Sheet 4: 3.Bảng lương chi tiết
  const s4Headers = ['STT', 'Mã NV', 'Họ Và Tên', 'Phòng Ban / Nông Trường', 'Chức Danh', 'Lương Cơ Bản', 'Công Chuẩn', 'Công Thực Tế', 'Lương Thực Tế', 'Phụ Cấp', 'Thưởng Mủ Cao Su', 'Thưởng KPI', 'TỔNG THU NHẬP', 'BHXH (10.5%)', 'Thuế TNCN (Luật 109)', 'THỰC LĨNH (NET)'];
  const s4Rows = payslips.map((p, idx) => [
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
  ]);

  // Sheet 5: 2.BCC Sản lượng Nông trường
  const s5Headers = ['Nông Trường / Đơn Vị', 'Quân Số Khai Thác', 'Diện Tích Vườn Cạo (ha)', 'Sản Lượng Mủ Nước (Tấn)', 'Độ Khô TSC TB (%)', 'Tổng Quỹ Lương Nông Trường (VNĐ)', 'Thu Nhập TB / Công Nhân'];
  const s5Rows = [
    ['Nông Trường 1 (Bình Phước)', 320, 1250, 485.2, 34.5, 4160000000, 13000000],
    ['Nông Trường 3 (Tây Ninh)', 380, 1450, 540.8, 34.2, 4788000000, 12600000],
    ['Nông Trường 2 (Bình Dương)', 240, 980, 362.0, 34.8, 2976000000, 12400000],
    ['Khối Văn Phòng Tổng Công Ty', 78, 0, 0, 0, 926000000, 11870000],
  ];

  // Sheet 6: 1.DS QLNS
  const s6Headers = ['STT', 'Mã NV', 'Họ Và Tên', 'Phòng Ban', 'Chức Danh', 'Mức Lương Đóng BH', 'Số Sổ BHXH', 'Ngân Hàng Chi Lương', 'Số Tài Khoản'];
  const s6Rows = payslips.map((p, idx) => [
    idx + 1,
    p.employeeCode,
    p.employeeName,
    p.departmentName,
    p.positionTitle,
    Math.min(p.baseSalary, 46800000),
    '0120142545',
    'MBBank / Vietcombank',
    '098786857584839',
  ]);

  const sheets: ExcelSheetData[] = [
    { sheetName: '6.Dashboard Tổng quan', title: 'TỔNG QUAN CHI TRẢ LƯƠNG & QUỸ THU NHẬP TOÀN CÔNG TY', headers: s1Headers, rows: s1Rows },
    { sheetName: '5.Phân tích mức lương', title: 'PHÂN TÍCH PHÂN BỔ MỨC LƯƠNG & THU NHẬP CBNV', headers: s2Headers, rows: s2Rows },
    { sheetName: '4.Phiếu lương', title: 'PHIẾU THANH TOÁN LƯƠNG MẪU (THEO LUẬT THUẾ 109/2025/QH15)', headers: s3Headers, rows: s3Rows },
    { sheetName: '3.Bảng lương', title: 'BẢNG THANH TOÁN LƯƠNG CHI TIẾT TOÀN THỂ CÁN BỘ NHÂN VIÊN', headers: s4Headers, rows: s4Rows },
    { sheetName: '2.BCC Sản lượng Nông trường', title: 'THEO DÕI SẢN LƯỢNG MỦ CAO SU VÀ QUỸ LƯƠNG NÔNG TRƯỜNG', headers: s5Headers, rows: s5Rows },
    { sheetName: '1.DS QLNS', title: 'DANH SÁCH QUẢN LÝ NHÂN SỰ & THÔNG TIN TÀI KHOẢN CHI LƯƠNG', headers: s6Headers, rows: s6Rows },
  ];

  exportMultiSheetExcel('Bao_Cao_Quy_Luong_Nhan_Su_6Sheets', sheets);
};

// ----------------------------------------------------------------------
// 4. BÁO CÁO BIẾN ĐỘNG NHÂN SỰ 12 THÁNG (3 SHEETS)
// ----------------------------------------------------------------------

export const exportBaoCaoBienDongNhanSu = (hrData: any) => {
  // Sheet 1: Biến động 12 tháng
  const s1Headers = ['Chỉ Tiêu Biến Động', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8 (Hiện tại)', 'T9 (Dự kiến)', 'T10', 'T11', 'T12'];
  const s1Rows = [
    ['1. Dư đầu tháng', 940, 952, 965, 980, 992, 1005, 998, 1018, 1042, 1065, 1070, 1075],
    ['2. Tuyển mới trong tháng', 24, 28, 32, 25, 30, 18, 38, 42, 35, 20, 15, 12],
    ['3. Thôi việc / nghỉ việc', 12, 15, 17, 13, 17, 25, 18, 18, 12, 15, 10, 8],
    ['4. Điều chuyển nội bộ', 8, 10, 12, 9, 14, 11, 15, 14, 10, 8, 6, 5],
    ['5. Thăng chức / bổ nhiệm', 3, 5, 4, 6, 5, 4, 8, 9, 6, 5, 4, 4],
    ['6. Dư cuối tháng', 952, 965, 980, 992, 1005, 998, 1018, 1042, 1065, 1070, 1075, 1079],
  ];

  // Sheet 2: Phân tích theo đơn vị
  const s2Headers = ['Nông Trường / Đơn Vị', 'Quân Số Hiện Tại', 'Tuyển Mới (Năm)', 'Thôi Việc (Năm)', 'Tỷ Lệ Duy Trì (%)', 'Tỷ Lệ Nghỉ Việc (%)'];
  const s2Rows = [
    ['Nông Trường 1 (Bình Phước)', 320, 72, 24, 95.2, 4.8],
    ['Nông Trường 3 (Tây Ninh)', 380, 85, 30, 94.6, 5.4],
    ['Nông Trường 2 (Bình Dương)', 240, 48, 22, 93.8, 6.2],
    ['Khối Văn Phòng Tổng Công Ty', 78, 12, 4, 96.5, 3.5],
  ];

  // Sheet 3: Dự báo mùa vụ Q4
  const s3Headers = ['Khu Vực Cần Bổ Sung', 'Số Lượng Cần Tuyển', 'Thời Gian Hoàn Tất', 'Nguồn Tuyển Trọng Tâm'];
  const s3Rows = [
    ['Nông Trường 1 (Cao điểm cạo mủ Q4)', 25, '15/09/2026', 'Giới thiệu nội bộ địa phương'],
    ['Nông Trường 3 (Mở rộng diện tích lô)', 25, '20/09/2026', 'Ngày hội việc làm Tỉnh Tây Ninh'],
    ['Nông Trường 2 (Bổ sung cạo thay)', 15, '30/09/2026', 'Mạng xã hội & Zalo tuyển dụng'],
  ];

  const sheets: ExcelSheetData[] = [
    { sheetName: 'Biến động nhân sự 12 tháng', title: 'BÁO CÁO BIẾN ĐỘNG NHÂN SỰ 12 THÁNG NĂM 2026', headers: s1Headers, rows: s1Rows },
    { sheetName: 'Phân tích theo Đơn vị', title: 'PHÂN TÍCH TỶ LỆ DUY TRÌ VÀ BIẾN ĐỘNG THEO NÔNG TRƯỜNG', headers: s2Headers, rows: s2Rows },
    { sheetName: 'Dự báo mùa vụ Q4', title: 'KẾ HOẠCH BỔ SUNG LAO ĐỘNG MÙA VỤ CAO ĐIỂM Q4/2026', headers: s3Headers, rows: s3Rows },
  ];

  exportMultiSheetExcel('Bao_Cao_Bien_Dong_Nhan_Su_3Sheets', sheets);
};

// ----------------------------------------------------------------------
// 5. BÁO CÁO MOBILE: XUẤT BẢNG CHẤM CÔNG & PHIẾU LƯƠNG CÁ NHÂN / TỔ
// ----------------------------------------------------------------------

export const exportBangChamCongExcel = (attendanceBatch: any, teamName = 'Tổ Khai Thác 1') => {
  const headers = ['STT', 'Mã Công Nhân', 'Họ Và Tên', 'Lô Cạo Phụ Trách', 'Trạng Thái Chấm Công', 'Sản Lượng Mủ Nước (kg)', 'Mủ Chén (kg)', 'Độ Khô TSC (%)', 'Ghi Chú'];
  const rows = (attendanceBatch?.items || []).map((item: any, idx: number) => [
    idx + 1,
    item.workerCode,
    item.workerName,
    item.lotAssigned,
    item.status === 'DU' ? 'Đủ công' : item.status === 'CHOANG_LO' ? `Choàng lô (${item.coveredForWorkerName || ''})` : item.status === 'NGHI_PHEP' ? 'Nghỉ phép' : 'Vắng',
    item.latexYieldKg || 0,
    item.cupLumpYieldKg || 0,
    item.tscDegree || 0,
    item.note || '',
  ]);

  exportToExcel(
    `BẢNG CHẤM CÔNG & SẢN LƯỢNG MỦ CAO SU - ${teamName.toUpperCase()}`,
    `Bang_Cham_Cong_${teamName.replace(/\s+/g, '_')}`,
    headers,
    rows,
    {
      'Tổng quân số': `${attendanceBatch?.totalMembers || rows.length} người`,
      'Đi làm đủ': `${attendanceBatch?.presentCount || rows.length} người`,
      'Tổng sản lượng mủ': `${attendanceBatch?.totalLatexYieldKg || 0} kg`,
      'Độ TSC TB': `${attendanceBatch?.avgTscDegree || 34.5}°`,
    }
  );
};

export const exportPhieuLuongCaNhanExcel = (payslip: any) => {
  const headers = ['Khoản Mục Chi Trả Thu Nhập', 'Chi Tiết / Công Thức', 'Số Tiền (VNĐ)'];
  const rows = [
    ['Họ và tên nhân viên', payslip.employeeName, ''],
    ['Mã số nhân viên', payslip.employeeCode, ''],
    ['Phòng ban / Nông trường', payslip.departmentName, ''],
    ['Chức vụ công việc', payslip.positionTitle, ''],
    ['1. Lương cơ bản theo hợp đồng', 'Định mức tháng', payslip.baseSalary],
    ['2. Ngày công chuẩn trong tháng', 'Ngày công hành chính', payslip.standardDays],
    ['3. Ngày công đi làm thực tế', 'Chấm công GPS / Vân tay', payslip.actualDays],
    ['4. Tiền lương thời gian thực tế', '(Lương CB / Chuẩn) * Thực tế', payslip.actualBaseSalary],
    ['5. Phụ cấp chức vụ / trách nhiệm', 'Theo quy chế', payslip.positionAllowance],
    ['6. Phụ cấp ăn ca / độc hại', 'Ăn trưa & bồi dưỡng', payslip.lunchAllowance],
    ['7. Thưởng sản lượng mủ cao su', 'Sản lượng vượt khoán', payslip.commission],
    ['8. Thưởng hiệu quả công việc KPI', 'Đánh giá xếp loại A', payslip.kpiBonus],
    ['TỔNG THU NHẬP TRONG THÁNG', 'Mục 4 + 5 + 6 + 7 + 8', payslip.totalIncome],
    ['9. Trừ Bảo Hiểm Xã Hội (8%)', 'Lương đóng BH * 8%', -Math.round(payslip.socialInsuranceEmp || payslip.baseSalary * 0.08)],
    ['10. Trừ Bảo Hiểm Y Tế (1.5%)', 'Lương đóng BH * 1.5%', -Math.round(payslip.healthInsuranceEmp || payslip.baseSalary * 0.015)],
    ['11. Trừ BHTN (1%)', 'Lương đóng BH * 1%', -Math.round(payslip.unemploymentInsuranceEmp || payslip.baseSalary * 0.01)],
    ['12. Giảm trừ gia cảnh bản thân', 'Luật Thuế 109/2025/QH15', -15500000],
    ['13. Thuế Thu Nhập Cá Nhân (TNCN)', 'Biểu thuế 5 bậc Luật 109', -payslip.pitTax],
    ['THỰC LĨNH CHUYỂN KHOẢN (NET)', 'Tổng thu nhập - Bảo hiểm - Thuế', payslip.netSalary],
  ];

  exportToExcel(
    `PHIẾU THANH TOÁN TIỀN LƯƠNG - ${payslip.employeeName.toUpperCase()} (${payslip.month || '08/2026'})`,
    `Phieu_Luong_${payslip.employeeCode}_${payslip.month?.replace('/', '_') || '08_2026'}`,
    headers,
    rows
  );
};
