// 1HRM Data Types & Interfaces

export type UserRole = 'ADMIN' | 'HR_MANAGER' | 'DEPARTMENT_LEAD' | 'EMPLOYEE';

export interface Department {
  id: string;
  code: string;
  name: string;
  leaderId?: string;
  leaderName?: string;
  memberCount: number;
  description?: string;
}

export interface Position {
  id: string;
  code: string;
  title: string;
  departmentId: string;
  level: string; // Junior, Middle, Senior, Lead, Manager, Director
  baseSalaryMin: number;
  baseSalaryMax: number;
}

export interface Employee {
  id: string;
  code: string; // e.g. NV-0012
  fullName: string;
  gender: 'Nam' | 'Nữ' | 'Khác';
  birthday: string;
  avatar: string;
  email: string;
  phone: string;
  idCard: string;
  idCardDate: string;
  idCardPlace: string;
  address: string;
  nativePlace: string;
  taxCode: string;
  socialInsuranceCode: string;
  bankName: string;
  bankAccount: string;
  bankBranch: string;
  departmentId: string;
  departmentName: string;
  positionId: string;
  positionTitle: string;
  role: UserRole;
  joinDate: string;
  contractType: string;
  status: 'Đang làm việc' | 'Thử việc' | 'Nghỉ thai sản' | 'Đã nghỉ việc';
  directManagerId?: string;
  directManagerName?: string;
  baseSalary: number;
  allowance: number;
  workEfficiency: number; // 0 - 100%
  completedTasks: number;
  lateTimes: number;
  earlyTimes: number;
  leaveDaysRemaining: number;
  totalLeaveDays: number;
  assets: {
    id: string;
    name: string;
    code: string;
    assignedDate: string;
    status: string;
  }[];
  debts: {
    id: string;
    description: string;
    amount: number;
    type: 'Tạm ứng' | 'Phạt vi phạm' | 'Công nợ khác';
    status: 'Chưa thanh toán' | 'Đã hoàn tất';
  }[];
  workHistory: {
    period: string;
    company: string;
    position: string;
    note?: string;
  }[];
  contracts: LaborContract[];
  decisions: AdminDecision[];
}

export interface LaborContract {
  id: string;
  employeeId: string;
  contractNumber: string;
  contractType: 'Thử việc' | 'Có thời hạn 1 năm' | 'Có thời hạn 3 năm' | 'Không xác định thời hạn';
  signedDate: string;
  startDate: string;
  endDate?: string;
  baseSalary: number;
  insuranceSalary: number;
  status: 'Hiệu lực' | 'Sắp hết hạn' | 'Hết hiệu lực';
  signerName: string;
  signerPosition: string;
  isSignedDigitally: boolean;
  signatureProvider?: 'Viettel CA' | 'VNPT CA' | 'SmartCA' | 'One CA';
}

export interface AdminDecision {
  id: string;
  code: string; // QĐKT-0057, QĐBN-0012
  employeeId: string;
  employeeName: string;
  type: 'Khen thưởng' | 'Kỷ luật' | 'Bổ nhiệm' | 'Tăng lương' | 'Điều chuyển';
  effectiveDate: string;
  amount?: number;
  paymentMethod?: 'Cộng vào kỳ lương' | 'Tiền mặt' | 'Chuyển khoản riêng';
  reason: string;
  issuedBy: string;
  status: 'Đã duyệt' | 'Chờ duyệt' | 'Từ chối';
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: string; // T2, T3, ... CN
  shiftId: string;
  shiftName: string;
  checkIn?: string; // HH:mm
  checkOut?: string; // HH:mm
  workUnits: number; // 0, 0.5, 1.0
  lateMinutes: number;
  earlyMinutes: number;
  otHours: number;
  status: 'Đúng giờ' | 'Đi muộn' | 'Về sớm' | 'Vắng mặt' | 'Nghỉ phép' | 'Nghỉ lễ';
  checkInSource?: 'Máy ZKTeco' | 'Mobile GPS' | 'Wifi Công ty' | 'Khuôn mặt FaceID';
  checkInLocation?: string;
}

export interface Shift {
  id: string;
  code: string;
  name: string;
  startTime: string; // 08:00
  endTime: string; // 17:30
  breakStartTime: string;
  breakEndTime: string;
  standardWorkUnits: number; // 1.0
  type: 'Hành chính' | 'Ca sáng' | 'Ca chiều' | 'Ca kíp' | 'Ca đêm';
}

export type RequestType = 
  | 'LEAVE' // Đơn xin nghỉ
  | 'ABSENCE' // Đơn vắng mặt
  | 'OVERTIME' // Đơn làm thêm giờ
  | 'CHECKIN_OUT' // Đơn checkin/out quên chấm công
  | 'BUSINESS_TRIP' // Đơn công tác
  | 'SPECIAL_REGIME' // Đơn làm theo chế độ (con nhỏ, thai sản)
  | 'SHIFT_CHANGE' // Đơn đổi ca
  | 'RESIGNATION' // Đơn thôi việc
  | 'SHIFT_REGISTER' // Đơn đăng ký ca
  | 'OTHER'; // Đơn khác

export interface RequestForm {
  id: string;
  code: string; // DXP-00123
  type: RequestType;
  typeName: string;
  employeeId: string;
  employeeName: string;
  departmentName: string;
  createdAt: string;
  startDate: string;
  endDate?: string;
  durationHours?: number;
  durationDays?: number;
  reason: string;
  approverId: string;
  approverName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  approvalNote?: string;
  approvedAt?: string;
  workflowStep: number;
  workflowMaxSteps: number;
}

export interface SalaryFormula {
  id: string;
  code: string; // e.g. SA_LUONG_THUCNHAN
  name: string;
  expression: string;
  description: string;
  category: 'Thu nhập' | 'Khấu trừ' | 'Bảo hiểm' | 'Thuế' | 'Tổng';
}

export interface Payslip {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  departmentName: string;
  month: string; // 08/2026
  standardDays: number; // 22
  actualDays: number;
  otHours: number;
  baseSalary: number;
  actualBaseSalary: number;
  positionAllowance: number;
  lunchAllowance: number;
  otherAllowance: number;
  kpiBonus: number;
  commission: number;
  totalIncome: number;
  socialInsurance: number; // 8%
  healthInsurance: number; // 1.5%
  unemploymentInsurance: number; // 1%
  totalInsurance: number; // 10.5%
  taxableIncome: number;
  personalDeduction: number; // 11,000,000
  dependentDeduction: number;
  pitTax: number; // Thuế TNCN
  advancePayment: number; // Tạm ứng
  penalties: number; // Phạt
  netSalary: number; // Thực nhận
  status: 'Bản nháp' | 'Chờ duyệt' | 'Đã chốt' | 'Đã thanh toán';
  bankAccount: string;
  bankName: string;
}

export interface Candidate {
  id: string;
  code: string; // UV-0129
  fullName: string;
  email: string;
  phone: string;
  campaignId: string;
  campaignTitle: string;
  positionApplied: string;
  appliedDate: string;
  source: 'TopCV' | 'Vietnamworks' | 'LinkedIn' | 'Webform' | 'Giới thiệu' | 'Email';
  cvUrl?: string;
  aiMatchScore: number; // 0 - 100%
  skills: string[];
  experienceYears: number;
  currentSalary?: number;
  expectedSalary?: number;
  stage: 'CV_NEW' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED';
  interviewDate?: string;
  interviewScore?: number;
  offerSalary?: number;
  notes?: string;
}

export interface RecruitmentCampaign {
  id: string;
  code: string;
  title: string;
  departmentId: string;
  departmentName: string;
  quantityTarget: number;
  quantityHired: number;
  budget: number;
  spentBudget: number;
  startDate: string;
  endDate: string;
  recruiterName: string;
  status: 'Đang chạy' | 'Đã đủ người' | 'Tạm dừng';
}

export interface OKRObjective {
  id: string;
  level: 'COMPANY' | 'DEPARTMENT' | 'INDIVIDUAL';
  title: string;
  ownerName: string;
  departmentName?: string;
  quarter: string; // Q3/2026
  progress: number; // 0 - 100%
  status: 'On track' | 'At risk' | 'Behind' | 'Completed';
  keyResults: OKRKeyResult[];
}

export interface OKRKeyResult {
  id: string;
  objectiveId: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string; // %, VND, hợp đồng, ứng viên
  progress: number;
  weight: number; // 0 - 100%
}

export interface ASKCompetency {
  category: 'Thái độ (Attitude)' | 'Kỹ năng (Skill)' | 'Kiến thức (Knowledge)';
  criteria: string;
  requiredScore: number; // thang 5
  evaluatedScore: number; // thang 5
}

export interface ASKEvaluation {
  id: string;
  employeeId: string;
  employeeName: string;
  positionTitle: string;
  period: string; // 2026 - Kỳ 1
  evaluatorName: string;
  averageScore: number;
  grade: 'A - Xuất sắc' | 'B - Tốt' | 'C - Đạt' | 'D - Cần cải thiện';
  items: ASKCompetency[];
  strengths: string;
  improvements: string;
}

export interface IVANRecord {
  id: string;
  code: string;
  month: string;
  employeeCode: string;
  employeeName: string;
  idCard: string;
  socialInsuranceCode: string;
  type: 'Báo tăng mới' | 'Báo giảm' | 'Điều chỉnh mức đóng' | 'Cấp lại sổ/thẻ';
  oldSalary?: number;
  newSalary: number;
  submittedDate: string;
  status: 'Chờ nộp' | 'Đã ký số' | 'Đã tiếp nhận' | 'Hồ sơ hợp lệ' | 'Bị từ chối';
  responseNote?: string;
}
