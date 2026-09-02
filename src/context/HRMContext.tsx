'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Employee,
  Department,
  Position,
  Shift,
  RequestForm,
  Payslip,
  Candidate,
  RecruitmentCampaign,
  OKRObjective,
  ASKEvaluation,
  IVANRecord,
  AttendanceRecord,
} from '@/types';
import {
  MOCK_EMPLOYEES,
  MOCK_DEPARTMENTS,
  MOCK_POSITIONS,
  MOCK_SHIFTS,
  MOCK_REQUESTS,
  MOCK_PAYSLIPS,
  MOCK_CANDIDATES,
  MOCK_CAMPAIGNS,
  MOCK_OKRS,
  MOCK_ASK_EVALUATION,
  MOCK_IVAN_RECORDS,
} from '@/lib/mockData';
import { evaluateFormula, SYSTEM_FORMULA_PRESETS } from '@/lib/formulaEngine';

interface HRMContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: Employee;
  employees: Employee[];
  departments: Department[];
  positions: Position[];
  shifts: Shift[];
  requests: RequestForm[];
  payslips: Payslip[];
  candidates: Candidate[];
  campaigns: RecruitmentCampaign[];
  okrs: OKRObjective[];
  askEvaluation: ASKEvaluation;
  ivanRecords: IVANRecord[];
  todayAttendance: AttendanceRecord[];
  
  // Actions
  handleCheckIn: (source?: string, location?: string) => void;
  handleCheckOut: () => void;
  createRequest: (request: Partial<RequestForm>) => void;
  approveRequest: (requestId: string, note?: string) => void;
  rejectRequest: (requestId: string, note?: string) => void;
  updateCandidateStage: (candidateId: string, newStage: Candidate['stage']) => void;
  convertCandidateToEmployee: (candidateId: string) => void;
  updateOKRProgress: (keyResultId: string, newValue: number) => void;
  recalculatePayroll: () => void;
  addEmployee: (emp: Partial<Employee>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
}

const HRMContext = createContext<HRMContextType | undefined>(undefined);

export const HRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('ADMIN');
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [departments] = useState<Department[]>(MOCK_DEPARTMENTS);
  const [positions] = useState<Position[]>(MOCK_POSITIONS);
  const [shifts] = useState<Shift[]>(MOCK_SHIFTS);
  const [requests, setRequests] = useState<RequestForm[]>(MOCK_REQUESTS);
  const [payslips, setPayslips] = useState<Payslip[]>(MOCK_PAYSLIPS);
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [campaigns] = useState<RecruitmentCampaign[]>(MOCK_CAMPAIGNS);
  const [okrs, setOkrs] = useState<OKRObjective[]>(MOCK_OKRS);
  const [askEvaluation, setAskEvaluation] = useState<ASKEvaluation>(MOCK_ASK_EVALUATION);
  const [ivanRecords, setIvanRecords] = useState<IVANRecord[]>(MOCK_IVAN_RECORDS);

  // Current logged in user based on role
  const currentUser = employees.find((e) => {
    if (currentRole === 'ADMIN') return e.id === 'emp-2';
    if (currentRole === 'HR_MANAGER') return e.id === 'emp-1';
    if (currentRole === 'DEPARTMENT_LEAD') return e.id === 'emp-3';
    return e.id === 'emp-4';
  }) || employees[0];

  // Today attendance state
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord[]>([
    {
      id: 'att-1',
      employeeId: 'emp-1',
      date: new Date().toISOString().split('T')[0],
      dayOfWeek: 'T5',
      shiftId: 'shift-1',
      shiftName: 'Ca Hành Chính',
      checkIn: '08:15',
      workUnits: 1.0,
      lateMinutes: 0,
      earlyMinutes: 0,
      otHours: 0,
      status: 'Đúng giờ',
      checkInSource: 'Máy ZKTeco',
      checkInLocation: 'Cửa ra vào Tầng 3 - Tòa nhà Five Star',
    },
    {
      id: 'att-2',
      employeeId: 'emp-2',
      date: new Date().toISOString().split('T')[0],
      dayOfWeek: 'T5',
      shiftId: 'shift-1',
      shiftName: 'Ca Hành Chính',
      checkIn: '08:24',
      workUnits: 1.0,
      lateMinutes: 0,
      earlyMinutes: 0,
      otHours: 0,
      status: 'Đúng giờ',
      checkInSource: 'Mobile GPS',
      checkInLocation: 'Tọa độ: 20.9982, 105.8174 (Định vị GPS)',
    }
  ]);

  const handleCheckIn = (source = 'Mobile GPS', location = 'Văn phòng Công ty (Định vị GPS)') => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const todayStr = now.toISOString().split('T')[0];

    const isLate = now.getHours() > 8 || (now.getHours() === 8 && now.getMinutes() > 30);
    const lateMins = isLate ? (now.getHours() - 8) * 60 + now.getMinutes() - 30 : 0;

    const existingIndex = todayAttendance.findIndex((a) => a.employeeId === currentUser.id);
    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeId: currentUser.id,
      date: todayStr,
      dayOfWeek: 'Hôm nay',
      shiftId: 'shift-1',
      shiftName: 'Ca Hành Chính',
      checkIn: timeStr,
      workUnits: 1.0,
      lateMinutes: lateMins,
      earlyMinutes: 0,
      otHours: 0,
      status: isLate ? 'Đi muộn' : 'Đúng giờ',
      checkInSource: source as any,
      checkInLocation: location,
    };

    if (existingIndex >= 0) {
      const updated = [...todayAttendance];
      updated[existingIndex] = { ...updated[existingIndex], ...newRecord };
      setTodayAttendance(updated);
    } else {
      setTodayAttendance([newRecord, ...todayAttendance]);
    }
  };

  const handleCheckOut = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    setTodayAttendance((prev) =>
      prev.map((item) =>
        item.employeeId === currentUser.id
          ? {
              ...item,
              checkOut: timeStr,
            }
          : item
      )
    );
  };

  const createRequest = (requestData: Partial<RequestForm>) => {
    const newReq: RequestForm = {
      id: `req-${Date.now()}`,
      code: `DON-${Math.floor(10000 + Math.random() * 90000)}`,
      type: requestData.type || 'LEAVE',
      typeName: requestData.typeName || 'Đơn xin nghỉ phép',
      employeeId: currentUser.id,
      employeeName: currentUser.fullName,
      departmentName: currentUser.departmentName,
      createdAt: new Date().toLocaleString('vi-VN'),
      startDate: requestData.startDate || new Date().toISOString().split('T')[0],
      endDate: requestData.endDate,
      durationDays: requestData.durationDays || 1,
      durationHours: requestData.durationHours,
      reason: requestData.reason || '',
      approverId: 'emp-1',
      approverName: 'Phạm Thùy Linh (HRM)',
      status: 'PENDING',
      workflowStep: 1,
      workflowMaxSteps: 2,
    };
    setRequests([newReq, ...requests]);
  };

  const approveRequest = (requestId: string, note?: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: 'APPROVED',
              approvalNote: note || 'Đã duyệt qua hệ thống tự động BPA',
              approvedAt: new Date().toLocaleString('vi-VN'),
              workflowStep: req.workflowMaxSteps,
            }
          : req
      )
    );
  };

  const rejectRequest = (requestId: string, note?: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: 'REJECTED',
              approvalNote: note || 'Không chấp thuận',
              workflowStep: req.workflowMaxSteps,
            }
          : req
      )
    );
  };

  const updateCandidateStage = (candidateId: string, newStage: Candidate['stage']) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, stage: newStage } : c))
    );
  };

  const convertCandidateToEmployee = (candidateId: string) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) return;

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      code: `NV-00${employees.length + 1}`,
      fullName: candidate.fullName,
      gender: 'Nam',
      birthday: '1996-01-01',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      email: candidate.email,
      phone: candidate.phone,
      idCard: '001196001234',
      idCardDate: '2020-01-01',
      idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
      address: 'Hà Nội',
      nativePlace: 'Hà Nội',
      taxCode: '8025320999',
      socialInsuranceCode: '0120149999',
      bankName: 'MBBank',
      bankAccount: '098786857589999',
      bankBranch: 'Hà Nội',
      departmentId: 'dept-2',
      departmentName: 'Khối Kỹ Thuật & Công Nghệ',
      positionId: 'pos-4',
      positionTitle: candidate.positionApplied,
      role: 'EMPLOYEE',
      joinDate: new Date().toISOString().split('T')[0],
      contractType: 'Thử việc 2 tháng',
      status: 'Thử việc',
      baseSalary: candidate.offerSalary || 30000000,
      allowance: 2000000,
      workEfficiency: 100,
      completedTasks: 0,
      lateTimes: 0,
      earlyTimes: 0,
      leaveDaysRemaining: 12,
      totalLeaveDays: 12,
      assets: [],
      debts: [],
      workHistory: [],
      contracts: [],
      decisions: [],
    };

    setEmployees([...employees, newEmp]);
    updateCandidateStage(candidateId, 'HIRED');
  };

  const updateOKRProgress = (keyResultId: string, newValue: number) => {
    setOkrs((prev) =>
      prev.map((obj) => {
        const hasKR = obj.keyResults.some((kr) => kr.id === keyResultId);
        if (!hasKR) return obj;

        const updatedKRs = obj.keyResults.map((kr) => {
          if (kr.id === keyResultId) {
            const progress = Math.min(100, Math.round((newValue / kr.targetValue) * 100));
            return { ...kr, currentValue: newValue, progress };
          }
          return kr;
        });

        const totalProgress = Math.round(
          updatedKRs.reduce((acc, curr) => acc + curr.progress * (curr.weight / 100), 0)
        );

        return {
          ...obj,
          keyResults: updatedKRs,
          progress: totalProgress,
          status: totalProgress >= 100 ? 'Completed' : totalProgress >= 70 ? 'On track' : 'At risk',
        };
      })
    );
  };

  const recalculatePayroll = () => {
    // Tự động tính lại toàn bộ bảng lương bằng Formula Platform
    const updated = payslips.map((p) => {
      const context = {
        LUONG_CO_BAN: p.baseSalary,
        CONG_THUC_TE: p.actualDays,
        GIO_OT: p.otHours,
        PHU_CAP_CHUC_VU: p.positionAllowance,
        PHU_CAP_AN_TRUA: p.lunchAllowance,
        THUONG_KPI: p.kpiBonus,
        HOA_HONG: p.commission,
        LUONG_DONG_BH: p.baseSalary,
        SO_NGUOI_PHU_THUOC: p.dependentDeduction > 0 ? 1 : 0,
        TAM_UNG: p.advancePayment,
        TIEN_PHAT: p.penalties,
      };

      const luongCong = evaluateFormula('(LUONG_CO_BAN / 22) * CONG_THUC_TE', context);
      const tienOT = evaluateFormula('(LUONG_CO_BAN / 22 / 8) * GIO_OT * 1.5', context);
      const tongThuNhap = luongCong + p.positionAllowance + p.lunchAllowance + p.kpiBonus + tienOT + p.commission;
      const cappedInsuranceSalary = Math.min(p.baseSalary, 46_800_000);
      const baoHiem = Math.round(cappedInsuranceSalary * 0.105);
      const thueTNCN = evaluateFormula('SA_PIT(MAX(0, ' + tongThuNhap + ' - ' + baoHiem + ' - 15500000 - ' + (context.SO_NGUOI_PHU_THUOC * 6200000) + '))', context);
      const thucNhan = tongThuNhap - baoHiem - thueTNCN - p.advancePayment - p.penalties;

      return {
        ...p,
        actualBaseSalary: Math.round(luongCong),
        totalIncome: Math.round(tongThuNhap),
        totalInsurance: Math.round(baoHiem),
        personalDeduction: 15500000,
        dependentDeduction: context.SO_NGUOI_PHU_THUOC * 6200000,
        pitTax: Math.round(thueTNCN),
        netSalary: Math.round(thucNhan),
      };
    });
    setPayslips(updated);
  };

  const addEmployee = (empData: Partial<Employee>) => {
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      code: `NV-00${employees.length + 1}`,
      fullName: empData.fullName || 'Nhân viên mới',
      gender: empData.gender || 'Nam',
      birthday: empData.birthday || '1995-01-01',
      avatar: empData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      email: empData.email || 'nv@1hrm.vn',
      phone: empData.phone || '0900000000',
      idCard: empData.idCard || '001195000000',
      idCardDate: '2020-01-01',
      idCardPlace: 'Cục Cảnh sát QLHC về TTXH',
      address: empData.address || 'Hà Nội',
      nativePlace: 'Hà Nội',
      taxCode: '8025320000',
      socialInsuranceCode: '0120140000',
      bankName: 'MBBank',
      bankAccount: '098786857580000',
      bankBranch: 'Hà Nội',
      departmentId: empData.departmentId || 'dept-2',
      departmentName: empData.departmentName || 'Khối Kỹ Thuật & Công Nghệ',
      positionId: empData.positionId || 'pos-4',
      positionTitle: empData.positionTitle || 'Chuyên viên',
      role: empData.role || 'EMPLOYEE',
      joinDate: new Date().toISOString().split('T')[0],
      contractType: 'Có thời hạn 1 năm',
      status: 'Đang làm việc',
      baseSalary: empData.baseSalary || 15000000,
      allowance: 1000000,
      workEfficiency: 100,
      completedTasks: 0,
      lateTimes: 0,
      earlyTimes: 0,
      leaveDaysRemaining: 12,
      totalLeaveDays: 12,
      assets: [],
      debts: [],
      workHistory: [],
      contracts: [],
      decisions: [],
    };
    setEmployees([...employees, newEmp]);
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
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
        shifts,
        requests,
        payslips,
        candidates,
        campaigns,
        okrs,
        askEvaluation,
        ivanRecords,
        todayAttendance,
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
      }}
    >
      {children}
    </HRMContext.Provider>
  );
};

export const useHRM = () => {
  const context = useContext(HRMContext);
  if (!context) throw new Error('useHRM must be used within an HRMProvider');
  return context;
};
