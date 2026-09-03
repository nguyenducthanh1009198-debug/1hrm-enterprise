// 1HRM Data Types & Interfaces

export type UserRole =
  | 'ADMIN'
  | 'HR_MANAGER'
  | 'DEPARTMENT_LEAD'
  | 'EMPLOYEE'
  | 'TEAM_LEADER'            // Tổ Trưởng Nông Trường (Chấm công tổ 1-chạm, giao mủ)
  | 'PLANTATION_DIRECTOR'    // Cán bộ cấp trên / BGĐ Nông trường (Check-in hiện trường, duyệt tổ)
  | 'OFFICE_STAFF'           // Khối Văn phòng (FaceID, duyệt phép)
  | 'HR_ADMIN'               // Phòng HCTH (Tổng hợp VP + Nông trường, chốt công)
  | 'EXECUTIVE_DIRECTOR';    // Ban Tổng Giám Đốc (Dashboard điều hành, duyệt tờ trình 1-click)

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
  plantationId?: string;
  plantationName?: string;
  teamId?: string;
  teamName?: string;
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
  age?: number;
  education?: 'Đại học' | 'Cao đẳng' | 'Trung cấp' | 'Phổ thông / Sơ cấp' | 'Thạc sĩ / Sau ĐH';
  seniorityYears?: number;
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
  employeeId: string;
  code: string;
  type: 'Tiếp nhận' | 'Bổ nhiệm' | 'Điều chuyển' | 'Tăng lương' | 'Khen thưởng' | 'Kỷ luật' | 'Nghỉ việc';
  effectiveDate: string;
  content: string;
  signer: string;
  status: 'Đã ban hành' | 'Dự thảo';
}

export interface WorkShift {
  id: string;
  name: string;
  code: string;
  startTime: string; // 08:30 or 04:30 (ca cạo mủ sáng sớm)
  endTime: string;   // 17:30 or 11:30
  lunchBreakStart?: string;
  lunchBreakEnd?: string;
  standardHours: number;
  type: 'Hành chính' | 'Ca cạo mủ sáng' | 'Ca gác vườn' | 'Ca nhà máy chế biến';
}

// -------------------------------------------------------------
// NÔNG TRƯỜNG & CHẤM CÔNG 5 CẤP MODEL
// -------------------------------------------------------------

export interface PlantationUnit {
  id: string;
  name: string; // Nông trường 1, Nông trường 2, Nông trường 3, Khối Văn phòng Công ty
  code: string;
  location: string;
  directorName: string;
  totalHectares: number; // Tổng diện tích lô cạo (ha)
  workerCount: number;
  activeTeamsCount: number;
}

export interface ProductionTeam {
  id: string;
  name: string; // Tổ 1, Tổ 2, Tổ 3...
  code: string;
  plantationId: string;
  plantationName: string;
  leaderId: string;
  leaderName: string;
  lotAssigned: string; // Lô A1-A5, Lô B1-B8...
  lotAreaHectares: number; // 45.5 ha
  memberCount: number; // Max 50 người
}

export type WorkerAttendanceStatus = 'DU' | 'NGHI_PHEP' | 'NGHI_KHONG_PHEP' | 'CHOANG_LO';

export interface TeamWorkerAttendanceItem {
  workerId: string;
  workerCode: string;
  workerName: string;
  avatar: string;
  lotAssigned: string;
  status: WorkerAttendanceStatus;
  coveredForWorkerName?: string; // Tên người được choàng lô
  latexYieldKg?: number;         // Sản lượng mủ nước (kg)
  cupLumpYieldKg?: number;       // Sản lượng mủ đông / mủ chén (kg)
  tscDegree?: number;            // Độ khô cao su TSC (%)
  note?: string;
}

export interface TeamAttendanceBatch {
  id: string;
  date: string;
  teamId: string;
  teamName: string;
  plantationId: string;
  plantationName: string;
  leaderId: string;
  leaderName: string;
  totalMembers: number;
  presentCount: number;
  leaveCount: number;
  absentCount: number;
  coveredCount: number;
  totalLotAreaHectares: number;
  totalLatexYieldKg: number;
  avgTscDegree: number;
  isOfflineSync: boolean;
  status: 'PENDING_SUPERVISOR' | 'APPROVED_SUPERVISOR' | 'FINALIZED_HR' | 'REJECTED';
  supervisorComment?: string;
  approvedAt?: string;
  items: TeamWorkerAttendanceItem[];
}

export interface FieldInspectionCheckIn {
  id: string;
  date: string;
  supervisorId: string;
  supervisorName: string;
  plantationId: string;
  plantationName: string;
  lotChecked: string;
  gpsCoordinates: string; // e.g. "11.4582° N, 106.8921° E"
  distanceMeters: number;
  photoUrl: string; // Ảnh chụp hiện trường lô cạo
  notes: string;
  timestamp: string;
  approvedTeamsCount: number;
}

export interface MonthlyAttendanceSubmission {
  id: string;
  month: string; // 08/2026
  title: string;
  submittedBy: string; // Phòng HCTH
  submittedDate: string;
  totalEmployees: number;
  totalWorkdays: number;
  plantationSummary: {
    plantationName: string;
    totalWorkers: number;
    actualDaysAvg: number;
    totalLatexYieldTons: number;
    status: string;
  }[];
  isApprovedByExecutive: boolean;
  executiveApproverName?: string;
  approvedAt?: string;
}

// -------------------------------------------------------------
// GENERAL HRM DATA MODELS
// -------------------------------------------------------------

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  date: string;
  shiftId: string;
  checkIn?: string;
  checkOut?: string;
  checkInMethod: 'FaceID' | 'Vân tay' | 'Mobile GPS' | 'Tổ trưởng chấm';
  checkInLocation?: string;
  status: 'Đúng giờ' | 'Đi muộn' | 'Về sớm' | 'Vắng mặt' | 'Nghỉ phép' | 'Choàng lô';
  workingHours: number;
  overtimeHours: number;
  gpsDistanceMeters?: number;
}

export type RequestType =
  | 'LEAVE'
  | 'ABSENCE'
  | 'OVERTIME'
  | 'CHECKIN_OUT'
  | 'BUSINESS_TRIP'
  | 'SPECIAL_REGIME'
  | 'SHIFT_CHANGE'
  | 'RESIGNATION';

export interface HRMRequest {
  id: string;
  code: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  departmentName: string;
  type: RequestType;
  typeName: string;
  startDate: string;
  endDate?: string;
  durationDays: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approverName?: string;
  approvalComment?: string;
  createdAt: string;
}

export interface Payslip {
  id: string;
  month: string; // 08/2026
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  departmentName: string;
  positionTitle: string;
  standardDays: number;
  actualDays: number;
  baseSalary: number;
  actualBaseSalary: number;
  positionAllowance: number;
  lunchAllowance: number;
  kpiBonus: number;
  commission: number;
  totalIncome: number;
  socialInsuranceEmp: number;
  healthInsuranceEmp: number;
  unemploymentInsuranceEmp: number;
  totalInsurance: number;
  taxableIncome: number;
  personalDeduction: number;
  dependentDeduction: number;
  taxAssessableIncome: number;
  pitTax: number;
  netSalary: number;
  status: 'Đã chốt' | 'Đã thanh toán';
}

export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  positionTitle: string;
  departmentName: string;
  experienceYears: number;
  expectedSalary: number;
  stage: 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED';
  aiMatchScore: number;
  source: string;
  appliedDate: string;
}

export interface RecruitmentPlan {
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

// -------------------------------------------------------------
// 5 BỘ BÁO CÁO BI ANALYTICS MODEL
// -------------------------------------------------------------

export interface TrainingCourse {
  id: string;
  code: string;
  title: string;
  topic: string;
  method: 'Hiện trường nông trường' | 'Trực tiếp tại hội trường' | 'E-learning Trực tuyến';
  durationHours: number;
  startDate: string;
  endDate: string;
  participantsCount: number;
  totalCost: number;
  costPerParticipant: number;
  trainerName: string;
  feedbackScore: number; // e.g. 4.8 / 5.0
  examPassRate: number;  // e.g. 96%
  applicationLevel: 'Rất cao (90-100%)' | 'Cao (80-89%)' | 'Khá (70-79%)' | 'Trung bình';
  status: 'Đã hoàn thành' | 'Đang triển khai' | 'Dự kiến';
}

export interface ComplianceViolation {
  id: string;
  code: string;
  employeeId: string;
  employeeName: string;
  departmentOrPlantation: string;
  violationDate: string;
  type: 'Đi làm trễ > 15p' | 'Nghỉ không phép' | 'Không đội mũ BHLĐ' | 'Vi phạm kỹ thuật cạo mủ' | 'Chấm công hộ';
  disciplineForm: 'Nhắc nhở nội bộ' | 'Khiển trách bằng văn bản' | 'Trừ điểm chuyên cần' | 'Kỷ luật kéo dài nâng lương';
  status: 'Đã xử lý' | 'Đang giải trình';
}
