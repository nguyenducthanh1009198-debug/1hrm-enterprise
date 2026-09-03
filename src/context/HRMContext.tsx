'use client';

import React, { createContext, useContext, useState } from 'react';
import {
  UserRole,
  Employee,
  Department,
  Position,
  HRMRequest,
  Payslip,
  Candidate,
  RecruitmentPlan,
  OKRObjective,
  IVANRecord,
  AttendanceRecord,
  PlantationUnit,
  ProductionTeam,
  TeamAttendanceBatch,
  WorkerAttendanceStatus,
  FieldInspectionCheckIn,
  MonthlyAttendanceSubmission,
  TrainingCourse,
} from '@/types';
import {
  MOCK_EMPLOYEES,
  MOCK_DEPARTMENTS,
  MOCK_POSITIONS,
  MOCK_REQUESTS,
  MOCK_PAYSLIPS,
  MOCK_CANDIDATES,
  MOCK_RECRUITMENT_PLANS,
  MOCK_OKRS,
  MOCK_IVAN_RECORDS,
  MOCK_PLANTATIONS,
  MOCK_PRODUCTION_TEAMS,
  MOCK_TEAM_ATTENDANCE_BATCHES,
  MOCK_FIELD_INSPECTIONS,
  MOCK_MONTHLY_SUBMISSIONS,
  MOCK_TRAINING_COURSES,
  MOCK_COMPLIANCE_DATA,
  MOCK_HR_GENERAL_DATA,
  MOCK_RECRUITMENT_REPORT_DATA,
  MOCK_INCOME_PAYROLL_DATA,
} from '@/lib/mockData';

interface HRMContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: Employee;
  employees: Employee[];
  departments: Department[];
  positions: Position[];
  requests: HRMRequest[];
  payslips: Payslip[];
  candidates: Candidate[];
  recruitmentPlans: RecruitmentPlan[];
  okrs: OKRObjective[];
  ivanRecords: IVANRecord[];
  todayAttendance: AttendanceRecord[];

  // Plantation & 5-Tier Attendance States
  plantations: PlantationUnit[];
  productionTeams: ProductionTeam[];
  teamBatches: TeamAttendanceBatch[];
  fieldInspections: FieldInspectionCheckIn[];
  monthlySubmissions: MonthlyAttendanceSubmission[];
  trainingCourses: TrainingCourse[];
  complianceData: typeof MOCK_COMPLIANCE_DATA;
  hrGeneralData: typeof MOCK_HR_GENERAL_DATA;
  recruitmentReportData: typeof MOCK_RECRUITMENT_REPORT_DATA;
  incomePayrollData: typeof MOCK_INCOME_PAYROLL_DATA;

  // Actions
  handleCheckIn: (source?: string, location?: string) => void;
  handleCheckOut: () => void;
  createRequest: (request: Partial<HRMRequest>) => void;
  approveRequest: (requestId: string, note?: string) => void;
  rejectRequest: (requestId: string, note?: string) => void;
  updateCandidateStage: (candidateId: string, newStage: Candidate['stage']) => void;
  convertCandidateToEmployee: (candidateId: string, customData?: Partial<Employee>) => void;
  updateOKRProgress: (keyResultId: string, newValue: number) => void;
  recalculatePayroll: () => void;
  addEmployee: (emp: Partial<Employee>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  toggleDocumentUpload: (employeeId: string, docName: string) => void;

  // Plantation Actions
  updateWorkerAttendanceStatus: (
    batchId: string,
    workerId: string,
    status: WorkerAttendanceStatus,
    coveredForName?: string
  ) => void;
  updateRubberYield: (
    batchId: string,
    workerId: string,
    latexKg: number,
    cupLumpKg: number,
    tsc: number
  ) => void;
  approveTeamBatch: (batchId: string, supervisorComment?: string) => void;
  addFieldInspection: (inspection: Omit<FieldInspectionCheckIn, 'id' | 'timestamp'>) => void;
  approveMonthlySubmission: (submissionId: string) => void;
  toggleOfflineSync: (batchId: string) => void;
}

const HRMContext = createContext<HRMContextType | undefined>(undefined);

export const HRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('ADMIN');
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [departments] = useState<Department[]>(MOCK_DEPARTMENTS);
  const [positions] = useState<Position[]>(MOCK_POSITIONS);
  const [requests, setRequests] = useState<HRMRequest[]>(MOCK_REQUESTS);
  const [payslips, setPayslips] = useState<Payslip[]>(MOCK_PAYSLIPS);
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [recruitmentPlans] = useState<RecruitmentPlan[]>(MOCK_RECRUITMENT_PLANS);
  const [okrs, setOkrs] = useState<OKRObjective[]>(MOCK_OKRS);
  const [ivanRecords, setIvanRecords] = useState<IVANRecord[]>(MOCK_IVAN_RECORDS);

  // Plantation & 5-tier attendance states
  const [plantations] = useState<PlantationUnit[]>(MOCK_PLANTATIONS);
  const [productionTeams] = useState<ProductionTeam[]>(MOCK_PRODUCTION_TEAMS);
  const [teamBatches, setTeamBatches] = useState<TeamAttendanceBatch[]>(MOCK_TEAM_ATTENDANCE_BATCHES);
  const [fieldInspections, setFieldInspections] = useState<FieldInspectionCheckIn[]>(MOCK_FIELD_INSPECTIONS);
  const [monthlySubmissions, setMonthlySubmissions] = useState<MonthlyAttendanceSubmission[]>(MOCK_MONTHLY_SUBMISSIONS);
  const [trainingCourses, setTrainingCourses] = useState<TrainingCourse[]>(MOCK_TRAINING_COURSES);
  const [complianceData] = useState(MOCK_COMPLIANCE_DATA);
  const [hrGeneralData] = useState(MOCK_HR_GENERAL_DATA);
  const [recruitmentReportData] = useState(MOCK_RECRUITMENT_REPORT_DATA);
  const [incomePayrollData] = useState(MOCK_INCOME_PAYROLL_DATA);

  // Current logged in user based on role
  const currentUser =
    employees.find((e) => {
      if (currentRole === 'ADMIN' || currentRole === 'EXECUTIVE_DIRECTOR') return e.id === 'emp-2';
      if (currentRole === 'HR_MANAGER' || currentRole === 'HR_ADMIN') return e.id === 'emp-1';
      if (currentRole === 'DEPARTMENT_LEAD' || currentRole === 'OFFICE_STAFF') return e.id === 'emp-3';
      if (currentRole === 'TEAM_LEADER') return e.id === 'emp-tt-1';
      if (currentRole === 'PLANTATION_DIRECTOR') return e.id === 'emp-gdnt-1';
      return e.id === 'emp-1';
    }) || employees[0];

  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord[]>([
    {
      id: 'att-1',
      employeeId: 'emp-1',
      employeeName: 'Phạm Thùy Linh',
      employeeCode: 'NV-0001',
      date: new Date().toISOString().split('T')[0],
      shiftId: 'shift-1',
      checkIn: '08:15',
      checkOut: '17:35',
      checkInMethod: 'FaceID',
      checkInLocation: 'Trụ sở chính 1HRM - Five Star',
      status: 'Đúng giờ',
      workingHours: 8.0,
      overtimeHours: 0,
      gpsDistanceMeters: 12,
    },
  ]);

  const handleCheckIn = (source = 'Mobile GPS', location = 'Trụ sở chính 1HRM') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const existingIndex = todayAttendance.findIndex((a) => a.employeeId === currentUser.id);

    if (existingIndex >= 0) {
      const updated = [...todayAttendance];
      updated[existingIndex] = {
        ...updated[existingIndex],
        checkIn: timeStr,
        checkInMethod: source as any,
        checkInLocation: location,
      };
      setTodayAttendance(updated);
    } else {
      const newRec: AttendanceRecord = {
        id: `att-${Date.now()}`,
        employeeId: currentUser.id,
        employeeName: currentUser.fullName,
        employeeCode: currentUser.code,
        date: now.toISOString().split('T')[0],
        shiftId: 'shift-1',
        checkIn: timeStr,
        checkInMethod: source as any,
        checkInLocation: location,
        status: 'Đúng giờ',
        workingHours: 8.0,
        overtimeHours: 0,
        gpsDistanceMeters: 8,
      };
      setTodayAttendance([newRec, ...todayAttendance]);
    }
  };

  const handleCheckOut = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const existingIndex = todayAttendance.findIndex((a) => a.employeeId === currentUser.id);

    if (existingIndex >= 0) {
      const updated = [...todayAttendance];
      updated[existingIndex] = {
        ...updated[existingIndex],
        checkOut: timeStr,
      };
      setTodayAttendance(updated);
    }
  };

  const createRequest = (request: Partial<HRMRequest>) => {
    const newReq: HRMRequest = {
      id: `req-${Date.now()}`,
      code: `ĐƠN-${Math.floor(1000 + Math.random() * 9000)}`,
      employeeId: currentUser.id,
      employeeName: currentUser.fullName,
      employeeAvatar: currentUser.avatar,
      departmentName: currentUser.departmentName,
      type: request.type || 'PHEP_NAM',
      typeName: request.typeName || 'Đơn xin nghỉ phép năm',
      startDate: request.startDate || new Date().toISOString().split('T')[0],
      endDate: request.endDate || request.startDate || new Date().toISOString().split('T')[0],
      durationDays: request.durationDays !== undefined ? request.durationDays : 1,
      durationHours: request.durationHours || 0,
      lateMinutes: request.lateMinutes,
      earlyMinutes: request.earlyMinutes,
      childName: request.childName,
      childAge: request.childAge,
      hospitalCertCode: request.hospitalCertCode,
      tripDestination: request.tripDestination,
      overtimeHours: request.overtimeHours,
      specificDetails: request.specificDetails,
      reason: request.reason || 'Nhân viên gửi yêu cầu phát sinh',
      status: 'PENDING',
      createdAt: new Date().toLocaleString('vi-VN'),
    };
    setRequests([newReq, ...requests]);
  };

  const approveRequest = (requestId: string, note = 'Đã phê duyệt qua hệ thống') => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'APPROVED', approverName: currentUser.fullName, approvalComment: note }
          : r
      )
    );
  };

  const rejectRequest = (requestId: string, note = 'Không chấp thuận') => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'REJECTED', approverName: currentUser.fullName, approvalComment: note }
          : r
      )
    );
  };

  const updateCandidateStage = (candidateId: string, newStage: Candidate['stage']) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, stage: newStage } : c))
    );
  };

  /**
   * Tự động Fill thông tin Onboard từ Ứng viên & Thiết lập Cảnh báo Hồ sơ chưa đủ
   */
  const convertCandidateToEmployee = (candidateId: string, customData?: Partial<Employee>) => {
    const cand = candidates.find((c) => c.id === candidateId);
    if (!cand) return;

    const generatedCode = `NV-${Math.floor(1000 + Math.random() * 9000)}`;

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      code: generatedCode,
      fullName: cand.fullName,
      gender: cand.gender || 'Nam',
      birthday: cand.birthday || '1998-01-01',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      email: cand.email,
      phone: cand.phone,
      idCard: cand.idCard || '001098001122',
      idCardDate: '2020-01-01',
      idCardPlace: 'Cục CS QLHC về TTXH',
      address: cand.address || 'Việt Nam',
      nativePlace: 'Việt Nam',
      taxCode: `80253${Math.floor(10000 + Math.random() * 90000)}`,
      socialInsuranceCode: `0120${Math.floor(100000 + Math.random() * 900000)}`,
      bankName: 'Vietcombank',
      bankAccount: '1000000000',
      bankBranch: 'Hà Nội',
      departmentId: 'dept-2',
      departmentName: cand.departmentName,
      positionId: 'pos-5',
      positionTitle: cand.positionTitle,
      role: 'EMPLOYEE',
      joinDate: new Date().toISOString().split('T')[0],
      contractType: 'Thử việc 2 tháng',
      status: 'Thử việc',
      baseSalary: cand.expectedSalary || 15000000,
      allowance: 2000000,
      workEfficiency: 85,
      completedTasks: 0,
      lateTimes: 0,
      earlyTimes: 0,
      leaveDaysRemaining: 12,
      totalLeaveDays: 12,

      // Auto-set Incomplete Profile with Warning
      profileCompleteness: 60,
      isProfileComplete: false,
      missingDocuments: [
        'Bản sao CCCD 2 mặt (Công chứng)',
        'Giấy khám sức khỏe định kỳ (Dưới 6 tháng)',
        'Bản sao Bằng cấp chuyên môn',
        'Sổ Bảo Hiểm Xã Hội gốc'
      ],

      assets: [],
      debts: [],
      workHistory: [],
      contracts: [],
      decisions: [],
      ...customData,
    };

    setEmployees([newEmp, ...employees]);
    updateCandidateStage(candidateId, 'HIRED');
  };

  const toggleDocumentUpload = (employeeId: string, docName: string) => {
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id !== employeeId) return e;
        const currentMissing = e.missingDocuments || [];
        const isCurrentlyMissing = currentMissing.includes(docName);
        const newMissing = isCurrentlyMissing
          ? currentMissing.filter((d) => d !== docName)
          : [...currentMissing, docName];

        const totalRequiredDocs = 4;
        const uploadedCount = totalRequiredDocs - newMissing.length;
        const newCompleteness = Math.round((uploadedCount / totalRequiredDocs) * 100);

        return {
          ...e,
          missingDocuments: newMissing,
          isProfileComplete: newMissing.length === 0,
          profileCompleteness: newCompleteness,
        };
      })
    );
  };

  const updateOKRProgress = (keyResultId: string, newValue: number) => {
    setOkrs((prevOkrs) =>
      prevOkrs.map((obj) => {
        const updatedKRs = obj.keyResults.map((kr) => {
          if (kr.id === keyResultId) {
            const calculatedProgress = Math.min(100, Math.round((newValue / (kr.targetValue || 1)) * 100));
            return {
              ...kr,
              currentValue: newValue,
              progress: calculatedProgress,
            };
          }
          return kr;
        });

        const totalWeight = updatedKRs.reduce((acc, k) => acc + (k.weight || 0), 0) || 1;
        const totalProgress = Math.round(
          updatedKRs.reduce((acc, k) => acc + k.progress * ((k.weight || 0) / totalWeight), 0)
        );

        return {
          ...obj,
          keyResults: updatedKRs,
          progress: totalProgress,
        };
      })
    );
  };

  const recalculatePayroll = () => {
    setPayslips((prev) =>
      prev.map((p) => {
        const actualBase = Math.round((p.baseSalary / p.standardDays) * p.actualDays);
        const totalInc = actualBase + p.positionAllowance + p.lunchAllowance + p.kpiBonus + p.commission;
        const insCap = Math.min(p.baseSalary, 46800000);
        const totalIns = Math.round(insCap * 0.105);
        const taxable = Math.max(0, totalInc - p.lunchAllowance);
        const taxAssessable = Math.max(0, taxable - 15500000 - p.dependentDeduction - totalIns);

        let pit = 0;
        if (taxAssessable <= 10000000) {
          pit = taxAssessable * 0.05;
        } else if (taxAssessable <= 30000000) {
          pit = 10000000 * 0.05 + (taxAssessable - 10000000) * 0.1;
        } else if (taxAssessable <= 60000000) {
          pit = 10000000 * 0.05 + 20000000 * 0.1 + (taxAssessable - 30000000) * 0.2;
        } else if (taxAssessable <= 100000000) {
          pit = 10000000 * 0.05 + 20000000 * 0.1 + 30000000 * 0.2 + (taxAssessable - 60000000) * 0.3;
        } else {
          pit = 10000000 * 0.05 + 20000000 * 0.1 + 30000000 * 0.2 + 40000000 * 0.3 + (taxAssessable - 100000000) * 0.35;
        }

        const net = totalInc - totalIns - Math.round(pit);
        return {
          ...p,
          actualBaseSalary: actualBase,
          totalIncome: totalInc,
          totalInsurance: totalIns,
          taxAssessableIncome: taxAssessable,
          pitTax: Math.round(pit),
          netSalary: net,
        };
      })
    );
  };

  const addEmployee = (emp: Partial<Employee>) => {
    const newEmployee: Employee = {
      id: `emp-${Date.now()}`,
      code: emp.code || `NV-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: emp.fullName || 'Nhân Viên Mới',
      gender: emp.gender || 'Nam',
      birthday: emp.birthday || '1995-01-01',
      avatar: emp.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      email: emp.email || 'nv.moi@1hrm.vn',
      phone: emp.phone || '0900 000 000',
      idCard: emp.idCard || '001000000000',
      idCardDate: '2020-01-01',
      idCardPlace: 'Cục CS QLHC về TTXH',
      address: emp.address || 'Hà Nội',
      nativePlace: 'Việt Nam',
      taxCode: '8000000000',
      socialInsuranceCode: '0100000000',
      bankName: emp.bankName || 'Vietcombank',
      bankAccount: emp.bankAccount || '0000000000',
      bankBranch: 'Hà Nội',
      departmentId: emp.departmentId || 'dept-2',
      departmentName: emp.departmentName || 'Nông Trường 1 (Bình Phước)',
      positionId: emp.positionId || 'pos-5',
      positionTitle: emp.positionTitle || 'Công Nhân Cạo Mủ',
      role: emp.role || 'EMPLOYEE',
      joinDate: emp.joinDate || new Date().toISOString().split('T')[0],
      contractType: emp.contractType || 'Có thời hạn 1 năm',
      status: 'Đang làm việc',
      baseSalary: emp.baseSalary || 12000000,
      allowance: emp.allowance || 2000000,
      workEfficiency: 90,
      completedTasks: 0,
      lateTimes: 0,
      earlyTimes: 0,
      leaveDaysRemaining: 12,
      totalLeaveDays: 12,
      profileCompleteness: 60,
      isProfileComplete: false,
      missingDocuments: ['Bản sao CCCD 2 mặt', 'Giấy khám sức khỏe', 'Sổ BHXH'],
      assets: [],
      debts: [],
      workHistory: [],
      contracts: [],
      decisions: [],
    };
    setEmployees([newEmployee, ...employees]);
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const updateWorkerAttendanceStatus = (
    batchId: string,
    workerId: string,
    status: WorkerAttendanceStatus,
    coveredForName?: string
  ) => {
    setTeamBatches((prevBatches) =>
      prevBatches.map((b) => {
        if (b.id !== batchId) return b;
        const updatedItems = b.items.map((item) => {
          if (item.workerId === workerId) {
            return {
              ...item,
              status,
              coveredForWorkerName: coveredForName,
            };
          }
          return item;
        });

        const present = updatedItems.filter((i) => i.status === 'DU' || i.status === 'CHOANG_LO').length;
        const leave = updatedItems.filter((i) => i.status === 'NGHI_PHEP').length;
        const absent = updatedItems.filter((i) => i.status === 'NGHI_KHONG_PHEP').length;
        const covered = updatedItems.filter((i) => i.status === 'CHOANG_LO').length;

        return {
          ...b,
          presentCount: present,
          leaveCount: leave,
          absentCount: absent,
          coveredCount: covered,
          items: updatedItems,
        };
      })
    );
  };

  const updateRubberYield = (
    batchId: string,
    workerId: string,
    latexKg: number,
    cupLumpKg: number,
    tsc: number
  ) => {
    setTeamBatches((prevBatches) =>
      prevBatches.map((b) => {
        if (b.id !== batchId) return b;
        const updatedItems = b.items.map((item) => {
          if (item.workerId === workerId) {
            return {
              ...item,
              latexYieldKg: latexKg,
              cupLumpYieldKg: cupLumpKg,
              tscDegree: tsc,
            };
          }
          return item;
        });

        const totalYield = updatedItems.reduce((acc, i) => acc + (i.latexYieldKg || 0), 0);
        const avgTsc =
          updatedItems.filter((i) => i.tscDegree).reduce((acc, i) => acc + (i.tscDegree || 0), 0) /
          (updatedItems.filter((i) => i.tscDegree).length || 1);

        return {
          ...b,
          totalLatexYieldKg: Math.round(totalYield * 10) / 10,
          avgTscDegree: Math.round(avgTsc * 10) / 10,
          items: updatedItems,
        };
      })
    );
  };

  const approveTeamBatch = (batchId: string, supervisorComment = 'Đã kiểm tra nghiệm thu lô cạo') => {
    setTeamBatches((prev) =>
      prev.map((b) =>
        b.id === batchId
          ? {
              ...b,
              status: 'APPROVED_SUPERVISOR',
              supervisorComment,
              approvedAt: new Date().toLocaleString('vi-VN'),
            }
          : b
      )
    );
  };

  const addFieldInspection = (inspection: Omit<FieldInspectionCheckIn, 'id' | 'timestamp'>) => {
    const newInsp: FieldInspectionCheckIn = {
      ...inspection,
      id: `insp-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };
    setFieldInspections([newInsp, ...fieldInspections]);
  };

  const approveMonthlySubmission = (submissionId: string) => {
    setMonthlySubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              isApprovedByExecutive: true,
              executiveApproverName: currentUser.fullName,
              approvedAt: new Date().toLocaleString('vi-VN'),
            }
          : s
      )
    );
  };

  const toggleOfflineSync = (batchId: string) => {
    setTeamBatches((prev) =>
      prev.map((b) =>
        b.id === batchId
          ? {
              ...b,
              isOfflineSync: !b.isOfflineSync,
            }
          : b
      )
    );
  };

  return (
    <HRMContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        employees,
        departments,
        positions,
        requests,
        payslips,
        candidates,
        recruitmentPlans,
        okrs,
        ivanRecords,
        todayAttendance,

        plantations,
        productionTeams,
        teamBatches,
        fieldInspections,
        monthlySubmissions,
        trainingCourses,
        complianceData,
        hrGeneralData,
        recruitmentReportData,
        incomePayrollData,

        handleCheckIn,
        handleCheckOut,
        createRequest,
        approveRequest,
        rejectRequest,
        updateCandidateStage,
        convertCandidateToEmployee,
        updateOKRProgress,
        recalculatePayroll,
        addEmployee,
        updateEmployee,
        toggleDocumentUpload,

        updateWorkerAttendanceStatus,
        updateRubberYield,
        approveTeamBatch,
        addFieldInspection,
        approveMonthlySubmission,
        toggleOfflineSync,
      }}
    >
      {children}
    </HRMContext.Provider>
  );
};

export const useHRM = () => {
  const context = useContext(HRMContext);
  if (!context) {
    throw new Error('useHRM must be used within an HRMProvider');
  }
  return context;
};
