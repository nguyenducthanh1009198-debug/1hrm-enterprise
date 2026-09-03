// 1HRM Enterprise Export Engine (Excel, Word, PowerPoint)

/**
 * Xuất dữ liệu báo cáo ra file Excel (.xlsx / .xls format)
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
      <tr style="background-color: #f8fafc; font-weight: bold;">
        <td colspan="${headers.length}" style="padding: 10px; border: 1px solid #cbd5e1;">
          <strong>CHỈ SỐ TỔNG HỢP:</strong> ${Object.entries(summaryStats)
            .map(([k, v]) => `<b>${k}:</b> ${v}`)
            .join(' &nbsp;|&nbsp; ')}
        </td>
      </tr>
    `;
  }

  const tableHeaderHtml = headers
    .map(
      (h) =>
        `<th style="background-color: #ea580c; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #cbd5e1; text-align: left;">${h}</th>`
    )
    .join('');

  const tableRowsHtml = rows
    .map(
      (row, idx) => `
      <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        ${row
          .map(
            (cell) =>
              `<td style="padding: 8px 10px; border: 1px solid #cbd5e1; text-align: ${
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
        body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; }
        table { border-collapse: collapse; width: 100%; }
        .header-title { font-size: 16pt; font-weight: bold; color: #1e293b; }
        .company-name { font-size: 12pt; font-weight: bold; color: #ea580c; }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <td colspan="${headers.length}" class="company-name">TỔNG CÔNG TY CAO SU & NÔNG TRƯỜNG 1HRM ENTERPRISE</td>
        </tr>
        <tr>
          <td colspan="${headers.length}" class="header-title">${reportTitle.toUpperCase()}</td>
        </tr>
        <tr>
          <td colspan="${headers.length}" style="color: #64748b; padding-bottom: 15px;">Thời gian kết xuất: ${dateStr} | Hệ thống quản trị 1HRM BI Analytics</td>
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
 * Xuất dữ liệu báo cáo ra file văn bản Word (.doc format) chuẩn hành chính
 */
export const exportToWord = (
  reportTitle: string,
  fileName: string,
  sections: {
    title: string;
    content?: string;
    table?: { headers: string[]; rows: (string | number)[][] };
    kpis?: Record<string, string | number>;
  }[]
) => {
  const dateStr = new Date().toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const sectionsHtml = sections
    .map(
      (sec, idx) => `
      <div style="margin-bottom: 24px;">
        <h3 style="color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 4px; font-size: 13pt; margin-top: 16px;">
          ${idx + 1}. ${sec.title.toUpperCase()}
        </h3>
        ${sec.content ? `<p style="line-height: 1.6; text-align: justify; margin: 8px 0;">${sec.content}</p>` : ''}
        
        ${
          sec.kpis
            ? `
          <div style="background-color: #fff7ed; border: 1px solid #fed7aa; padding: 12px; margin: 10px 0; border-radius: 6px;">
            <table style="width: 100%; border: none;">
              <tr>
                ${Object.entries(sec.kpis)
                  .map(
                    ([k, v]) => `
                  <td style="padding: 6px 12px; border: none;">
                    <div style="font-size: 9pt; color: #9a3412;">${k}</div>
                    <div style="font-size: 14pt; font-weight: bold; color: #ea580c;">${v}</div>
                  </td>
                `
                  )
                  .join('')}
              </tr>
            </table>
          </div>
        `
            : ''
        }

        ${
          sec.table
            ? `
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 10pt;">
            <thead>
              <tr style="background-color: #1e293b; color: #ffffff;">
                ${sec.table.headers
                  .map(
                    (h) =>
                      `<th style="border: 1px solid #94a3b8; padding: 8px; text-align: left;">${h}</th>`
                  )
                  .join('')}
              </tr>
            </thead>
            <tbody>
              ${sec.table.rows
                .map(
                  (r, rIdx) => `
                <tr style="background-color: ${rIdx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                  ${r
                    .map(
                      (c) =>
                        `<td style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: ${
                          typeof c === 'number' ? 'right' : 'left'
                        };">${typeof c === 'number' ? c.toLocaleString('vi-VN') : c}</td>`
                    )
                    .join('')}
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        `
            : ''
        }
      </div>
    `
    )
    .join('');

  const wordTemplate = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${reportTitle}</title>
      <style>
        body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.4; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .bold { font-weight: bold; }
        .header-box { margin-bottom: 20px; }
      </style>
    </head>
    <body style="padding: 20px;">
      <!-- Header Quốc hiệu / Tiêu ngữ & Doanh nghiệp -->
      <table style="width: 100%; border: none; margin-bottom: 25px;">
        <tr>
          <td style="width: 45%; text-align: center; vertical-align: top; border: none;">
            <p style="margin: 0; font-size: 10pt; font-weight: bold; text-transform: uppercase;">TỔNG CÔNG TY CAO SU & NÔNG TRƯỜNG 1HRM</p>
            <p style="margin: 0; font-size: 9pt; font-weight: bold; color: #ea580c;">HỆ THỐNG BI EXECUTIVE ANALYTICS</p>
            <p style="margin: 2px 0 0 0; font-size: 9pt;">Số: ...../BC-1HRM</p>
          </td>
          <td style="width: 55%; text-align: center; vertical-align: top; border: none;">
            <p style="margin: 0; font-size: 10pt; font-weight: bold; text-transform: uppercase;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
            <p style="margin: 0; font-size: 10pt; font-weight: bold; text-decoration: underline;">Độc lập - Tự do - Hạnh phúc</p>
            <p style="margin: 4px 0 0 0; font-size: 9pt; font-style: italic;">Hà Nội, ${dateStr}</p>
          </td>
        </tr>
      </table>

      <!-- Main Title -->
      <div style="text-align: center; margin: 25px 0 30px 0;">
        <h1 style="font-size: 16pt; font-weight: bold; margin: 0; text-transform: uppercase; color: #0f172a;">${reportTitle}</h1>
        <p style="font-size: 10.5pt; font-style: italic; color: #475569; margin: 5px 0 0 0;">(Kỳ báo cáo: Tháng 08/2026 - Toàn hệ thống Công ty & Các Nông trường)</p>
      </div>

      <!-- Content Sections -->
      ${sectionsHtml}

      <!-- Signature Section -->
      <table style="width: 100%; margin-top: 40px; border: none;">
        <tr>
          <td style="width: 50%; text-align: center; vertical-align: top; border: none;">
            <p style="font-weight: bold; margin: 0;">NGƯỜI LẬP BÁO CÁO</p>
            <p style="font-style: italic; font-size: 9pt; margin: 2px 0 60px 0;">(Ký, ghi rõ họ tên)</p>
            <p style="font-weight: bold; margin: 0;">Phạm Thùy Linh</p>
            <p style="font-size: 9pt; color: #64748b; margin: 0;">Trưởng Phòng HCTH / HRM</p>
          </td>
          <td style="width: 50%; text-align: center; vertical-align: top; border: none;">
            <p style="font-weight: bold; margin: 0;">TỔNG GIÁM ĐỐC PHÊ DUYỆT</p>
            <p style="font-style: italic; font-size: 9pt; margin: 2px 0 60px 0;">(Ký, đóng dấu)</p>
            <p style="font-weight: bold; margin: 0;">Lê Việt Thắng</p>
            <p style="font-size: 9pt; color: #64748b; margin: 0;">Tổng Giám Đốc Điều Hành</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + wordTemplate], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}_${new Date().toISOString().slice(0, 10)}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Xuất dữ liệu báo cáo ra file thuyết trình PowerPoint (.ppt format)
 */
export const exportToPowerPoint = (
  presentationTitle: string,
  fileName: string,
  slides: {
    title: string;
    subtitle?: string;
    bulletPoints?: string[];
    stats?: { label: string; value: string | number }[];
    table?: { headers: string[]; rows: (string | number)[][] };
  }[]
) => {
  const slidesHtml = slides
    .map(
      (s, index) => `
      <div style="page-break-after: always; width: 960px; height: 540px; padding: 40px; box-sizing: border-box; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; font-family: 'Segoe UI', Arial, sans-serif; position: relative; margin-bottom: 20px; border-radius: 8px;">
        
        <!-- Slide Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #ea580c; padding-bottom: 12px; margin-bottom: 20px;">
          <div>
            <span style="font-size: 11px; background-color: #ea580c; padding: 3px 8px; border-radius: 4px; font-weight: bold; text-transform: uppercase;">SLIDE ${index + 1} / ${slides.length}</span>
            <h2 style="font-size: 20pt; font-weight: bold; margin: 6px 0 0 0; color: #ffffff;">${s.title}</h2>
            ${s.subtitle ? `<p style="font-size: 11pt; color: #94a3b8; margin: 3px 0 0 0;">${s.subtitle}</p>` : ''}
          </div>
          <div style="text-align: right;">
            <div style="font-size: 12pt; font-weight: bold; color: #ea580c;">1HRM BI Executive</div>
            <div style="font-size: 9pt; color: #64748b;">Nông Trường & Doanh Nghiệp</div>
          </div>
        </div>

        <!-- Slide Stats Grid -->
        ${
          s.stats
            ? `
          <div style="display: flex; gap: 15px; margin-bottom: 20px;">
            ${s.stats
              .map(
                (st) => `
              <div style="flex: 1; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(234, 88, 12, 0.4); padding: 12px; border-radius: 8px; text-align: center;">
                <div style="font-size: 10pt; color: #cbd5e1;">${st.label}</div>
                <div style="font-size: 18pt; font-weight: bold; color: #fb923c; margin-top: 4px;">${st.value}</div>
              </div>
            `
              )
              .join('')}
          </div>
        `
            : ''
        }

        <!-- Slide Bullet Points -->
        ${
          s.bulletPoints
            ? `
          <div style="background: rgba(255, 255, 255, 0.04); padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <ul style="margin: 0; padding-left: 20px; font-size: 12pt; line-height: 1.8; color: #e2e8f0;">
              ${s.bulletPoints.map((bp) => `<li style="margin-bottom: 6px;">${bp}</li>`).join('')}
            </ul>
          </div>
        `
            : ''
        }

        <!-- Slide Table -->
        ${
          s.table
            ? `
          <table style="width: 100%; border-collapse: collapse; font-size: 10pt; background: rgba(255,255,255,0.03); border-radius: 6px; overflow: hidden;">
            <thead>
              <tr style="background-color: #ea580c; color: #ffffff;">
                ${s.table.headers.map((h) => `<th style="padding: 8px; text-align: left; border: 1px solid #334155;">${h}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${s.table.rows
                .slice(0, 5)
                .map(
                  (r, rIdx) => `
                <tr style="background-color: ${rIdx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.06)'};">
                  ${r
                    .map(
                      (c) =>
                        `<td style="padding: 6px 8px; border: 1px solid #334155; text-align: ${
                          typeof c === 'number' ? 'right' : 'left'
                        }; color: #e2e8f0;">${typeof c === 'number' ? c.toLocaleString('vi-VN') : c}</td>`
                    )
                    .join('')}
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        `
            : ''
        }

        <!-- Slide Footer -->
        <div style="position: absolute; bottom: 15px; left: 40px; right: 40px; display: flex; justify-content: space-between; font-size: 9pt; color: #64748b; border-top: 1px solid #334155; padding-top: 8px;">
          <span>Báo Cáo Điều Hành Ban Tổng Giám Đốc | 1HRM Platform</span>
          <span>Tháng 08/2026</span>
        </div>
      </div>
    `
    )
    .join('');

  const pptTemplate = `
    <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:p="urn:schemas-microsoft-com:office:powerpoint" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>${presentationTitle}</title>
      <style>
        body { margin: 0; padding: 20px; background-color: #020617; }
      </style>
    </head>
    <body>
      ${slidesHtml}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + pptTemplate], {
    type: 'application/vnd.ms-powerpoint;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}_${new Date().toISOString().slice(0, 10)}.ppt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
