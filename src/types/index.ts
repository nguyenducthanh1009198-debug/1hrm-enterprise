// 1HRM Data Types & Interfaces - SureHCS Analytics

export type UserRole =
  | 'ADMIN'
  | 'HR_MANAGER'
  | 'DEPARTMENT_LEAD'
  | 'EMPLOYEE'
  | 'TEAM_LEADER'            // Tổ Trưởng Nông Trường
  | 'PLANTATION_DIRECTOR'    // Cán bộ cấp trên / BGĐ Nông trường
  | 'OFFICE_STAFF'           // Khối Văn phòng
  | 'HR_ADMIN'               // Phòng HCTH
  | 'EXECUTIVE_DIRECTOR';    // Ban Tổng Giám Đốc

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

  // Onboarding & Profile Completeness Checklist
  profileCompleteness?: number; // 0 - 100%
  isProfileComplete?: boolean;
  missingDocuments?: string[]; // e.g. ['Ảnh CCCD 2 mặt', 'Bằng cấp', 'Giấy KSK', 'Sổ BHXH']
  emergencyContact?: string;
  emergencyPhone?: string;

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
  startTime: string;
  endTime: string;
  lunchBreakStart?: string;
  lunchBreakEnd?: string;
  standardHours: number;
  type: 'Hành chính' | 'Ca cạo mủ sáng' | 'Ca gác vườn' | 'Ca nhà máy chế biến';
}

// -------------------------------------------------------------
// CÁC LOẠI ĐƠN TỪ PHÁT SINH (SUREHCS STANDARD)
// -------------------------------------------------------------

export type RequestType =
  | 'DI_MUON'            // Đi muộn (số phút muộn, lý do)
  | 'VE_SOM'             // Về sớm (số phút về sớm, lý do)
  | 'CON_OM'             // Con ốm (theo Luật BHXH, đính kèm giấy C65)
  | 'OM_DAU'             // Bản thân ốm đau (giấy viện)
  | 'PHEP_NAM'           // Nghỉ phép năm
  | 'NGHI_KHONG_LUONG'   // Nghỉ việc riêng không lương
  | 'THAI_SAN'           // Chế độ thai sản / khám thai / dưỡng sức
  | 'CONG_TAC'           // Đi công tác / kiểm tra nông trường
  | 'LAM_THEM_GIO'       // Làm thêm giờ (OT ca đêm / ngày lễ)
  | 'CHOANG_LO'          // Choàng lô cạo thay
  | 'GIAI_TRINH_CONG'    // Giải trình quên chấm công / lỗi máy
  | 'LEAVE'              // Backward compatibility
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
  durationHours?: number;
  lateMinutes?: number;
  earlyMinutes?: number;
  childName?: string;
  childAge?: number;
  hospitalCertCode?: string;
  tripDestination?: string;
  overtimeHours?: number;
  specificDetails?: string;
  attachmentFileName?: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approverName?: string;
  approvalComment?: string;
  createdAt: string;
}

// -------------------------------------------------------------
// NÔNG TRƯỜNG & CHẤM CÔNG 5 CẤP MODEL
// -------------------------------------------------------------

export interface PlantationUnit {
  id: string;
  name: string;
  code: string;
  location: string;
  directorName: string;
  totalHectares: number;
  workerCount: number;
  activeTeamsCount: number;
}

export interface ProductionTeam {
  id: string;
  name: string;
  code: string;
  plantationId: string;
  plantationName: string;
  leaderId: string;
  leaderName: string;
  lotAssigned: string;
  lotAreaHectares: number;
  memberCount: number;
}

export type WorkerAttendanceStatus = 'DU' | 'NGHI_PHEP' | 'NGHI_KHONG_PHEP' | 'CHOANG_LO';

export interface TeamWorkerAttendanceItem {
  workerId: string;
  workerCode: string;
  workerName: string;
  avatar: string;
  lotAssigned: string;
  status: WorkerAttendanceStatus;
  coveredForWorkerName?: string;
  latexYieldKg?: number;
  cupLumpYieldKg?: number;
  tscDegree?: number;
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
  gpsCoordinates: string;
  distanceMeters: number;
  photoUrl: string;
  notes: string;
  timestamp: string;
  approvedTeamsCount: number;
}

export interface MonthlyAttendanceSubmission {
  id: string;
  month: string;
  title: string;
  submittedBy: string;
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

export interface Payslip {
  id: string;
  month: string;
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
  stage: 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'HIRED' | 'REJECTED' | 'CV_NEW';
  aiMatchScore: number;
  source: string;
  appliedDate: string;
  idCard?: string;
  birthday?: string;
  address?: string;
  gender?: 'Nam' | 'Nữ' | 'Khác';
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
  quarter: string;
  progress: number;
  status: 'On track' | 'At risk' | 'Behind' | 'Completed';
  keyResults: OKRKeyResult[];
}

export interface OKRKeyResult {
  id: string;
  objectiveId: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  progress: number;
  weight: number;
}

export interface ASKEvaluation {
  id: string;
  employeeId: string;
  employeeName: string;
  positionTitle: string;
  period: string;
  evaluatorName: string;
  averageScore: number;
  grade: 'A - Xuất sắc' | 'B - Tốt' | 'C - Đạt' | 'D - Cần cải thiện';
  items: any[];
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
  feedbackScore: number;
  examPassRate: number;
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
  type: string;
  disciplineForm: string;
  status: 'Đã xử lý' | 'Đang giải trình';
}
