// 1HRM Formula Platform Engine
// Handles custom dynamic calculation of salary formulas, attendance formulas, and tax calculations.

export interface FormulaContext {
  [key: string]: number | string | boolean | any;
}

/**
 * Tính thuế Thu nhập cá nhân (TNCN) theo Luật Thuế TNCN số 109/2025/QH15
 * Biểu thuế lũy tiến từng phần 5 bậc mới:
 * - Bậc 1: Đến 10 triệu đồng -> 5%
 * - Bậc 2: Trên 10 đến 30 triệu đồng -> 10% (trừ 500.000 đ)
 * - Bậc 3: Trên 30 đến 60 triệu đồng -> 20% (trừ 3.500.000 đ)
 * - Bậc 4: Trên 60 đến 100 triệu đồng -> 30% (trừ 9.500.000 đ)
 * - Bậc 5: Trên 100 triệu đồng -> 35% (trừ 14.500.000 đ)
 */
export function calculateVietnamesePIT(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  
  if (taxableIncome <= 10_000_000) {
    return taxableIncome * 0.05;
  } else if (taxableIncome <= 30_000_000) {
    return taxableIncome * 0.10 - 500_000;
  } else if (taxableIncome <= 60_000_000) {
    return taxableIncome * 0.20 - 3_500_000;
  } else if (taxableIncome <= 100_000_000) {
    return taxableIncome * 0.30 - 9_500_000;
  } else {
    return taxableIncome * 0.35 - 14_500_000;
  }
}

/**
 * Tính tổng bảo hiểm bắt buộc người lao động đóng (10.5% theo Luật BHXH 2024 & Luật Việc làm)
 * BHXH: 8%, BHYT: 1.5%, BHTN: 1%
 * Mức trần đóng BHXH/BHYT tối đa 20 lần mức lương tham chiếu (20 * 2,340,000 = 46,800,000 đ).
 */
export function calculateInsurance(insuranceSalary: number): {
  socialInsurance: number;
  healthInsurance: number;
  unemploymentInsurance: number;
  totalInsurance: number;
} {
  const cappedInsuranceSalary = Math.min(insuranceSalary, 46_800_000);
  const social = Math.round(cappedInsuranceSalary * 0.08);
  const health = Math.round(cappedInsuranceSalary * 0.015);
  const unemployment = Math.round(insuranceSalary * 0.01);
  return {
    socialInsurance: social,
    healthInsurance: health,
    unemploymentInsurance: unemployment,
    totalInsurance: social + health + unemployment,
  };
}

/**
 * Safe expression evaluator for Formula Platform
 */
export function evaluateFormula(expression: string, context: FormulaContext): number {
  try {
    let expr = expression;

    // Xử lý SA_PIT(x)
    expr = expr.replace(/SA_PIT\(([^)]+)\)/g, (_, arg) => {
      const val = evaluateFormula(arg, context);
      return calculateVietnamesePIT(val).toString();
    });

    // Xử lý MAX, MIN, ROUND, IF
    expr = expr.replace(/MAX\(([^,]+),([^)]+)\)/g, (_, a, b) => {
      return Math.max(evaluateFormula(a, context), evaluateFormula(b, context)).toString();
    });
    
    expr = expr.replace(/MIN\(([^,]+),([^)]+)\)/g, (_, a, b) => {
      return Math.min(evaluateFormula(a, context), evaluateFormula(b, context)).toString();
    });

    expr = expr.replace(/ROUND\(([^)]+)\)/g, (_, a) => {
      return Math.round(evaluateFormula(a, context)).toString();
    });

    // Thay thế các biến từ context
    const sortedKeys = Object.keys(context).sort((a, b) => b.length - a.length);
    for (const key of sortedKeys) {
      const val = context[key];
      const numVal = typeof val === 'number' ? val : (Number(val) || 0);
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      expr = expr.replace(regex, numVal.toString());
    }

    // Làm sạch
    const sanitized = expr.replace(/[^0-9+\-*/().><=?! ]/g, '');
    
    const result = Function('"use strict"; return (' + sanitized + ')')();
    return typeof result === 'number' && !isNaN(result) ? result : 0;
  } catch (err) {
    console.warn(`Error evaluating formula: "${expression}"`, err);
    return 0;
  }
}

export const SYSTEM_FORMULA_PRESETS = [
  {
    code: 'SA_LUONG_CONG',
    name: 'Lương theo ngày công thực tế',
    expression: '(LUONG_CO_BAN / 22) * CONG_THUC_TE',
    description: 'Tính lương thực tế dựa trên số ngày công làm việc',
    category: 'Thu nhập',
  },
  {
    code: 'SA_TIEN_OT',
    name: 'Tiền làm thêm giờ (OT)',
    expression: '(LUONG_CO_BAN / 22 / 8) * GIO_OT * 1.5',
    description: 'Tính tiền OT hệ số 1.5 ngày thường',
    category: 'Thu nhập',
  },
  {
    code: 'SA_TONG_THU_NHAP',
    name: 'Tổng thu nhập',
    expression: 'SA_LUONG_CONG + PHU_CAP_CHUC_VU + PHU_CAP_AN_TRUA + THUONG_KPI + SA_TIEN_OT + HOA_HONG',
    description: 'Tổng tất cả các khoản thu nhập trước khấu trừ',
    category: 'Thu nhập',
  },
  {
    code: 'SA_BHXH_BHYT_BHTN',
    name: 'Tổng bảo hiểm người lao động (10.5%)',
    expression: 'LUONG_DONG_BH * 0.105',
    description: 'Trừ 8% BHXH + 1.5% BHYT + 1% BHTN',
    category: 'Bảo hiểm',
  },
  {
    code: 'SA_THU_NHAP_TINH_THUE',
    name: 'Thu nhập tính thuế TNCN (Luật 109/2025/QH15)',
    expression: 'MAX(0, SA_TONG_THU_NHAP - SA_BHXH_BHYT_BHTN - 15500000 - (SO_NGUOI_PHU_THUOC * 6200000))',
    description: 'Giảm trừ bản thân 15.5trđ/tháng, người phụ thuộc 6.2trđ/người/tháng theo Luật 109/2025/QH15',
    category: 'Thuế',
  },
  {
    code: 'SA_THUE_TNCN',
    name: 'Thuế thu nhập cá nhân (Biểu 5 bậc mới)',
    expression: 'SA_PIT(SA_THU_NHAP_TINH_THUE)',
    description: 'Tính theo biểu thuế lũy tiến 5 bậc Luật 109/2025/QH15 (5%, 10%, 20%, 30%, 35%)',
    category: 'Thuế',
  },
  {
    code: 'SA_LUONG_THUC_NHAN',
    name: 'Lương thực nhận (Net Salary)',
    expression: 'SA_TONG_THU_NHAP - SA_BHXH_BHYT_BHTN - SA_THUE_TNCN - TAM_UNG - TIEN_PHAT',
    description: 'Số tiền thực tế chuyển khoản cho nhân viên',
    category: 'Tổng',
  }
];
