from datetime import date
from pydantic import BaseModel, Field
from typing import Any


class EmployeeBase(BaseModel):
    first_name: str
    last_name: str = ""
    personal_email: str | None = None
    company_email: str | None = None
    email: str | None = None
    phone: str | None = None
    department: str = "General"
    designation: str = "Employee"
    role: str = "employee"
    system_role: str = "employee"
    status: str = "Active"
    employment_type: str = "FULL_TIME"
    joining_date: date | None = None
    salary: float = 0.0
    ctc: float = 0.0
    avatar: str | None = None
    location: str | None = "Headquarters"
    branch: str | None = None
    shift: str | None = "General Shift (9 AM - 6 PM)"
    reporting_manager_id: str | None = None


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    department: str | None = None
    designation: str | None = None
    role: str | None = None
    status: str | None = None
    salary: float | None = None
    ctc: float | None = None
    avatar: str | None = None
    location: str | None = None
    shift: str | None = None


class EmployeeOut(EmployeeBase):
    id: str
    tenant_id: str
    name: str
    joined_at: str | None = None

    class Config:
        from_attributes = True


class AttendanceRecordOut(BaseModel):
    id: str
    employee_id: str
    date: str
    check_in: str | None = None
    check_out: str | None = None
    status: str
    location: str | None = None
    verification_method: str | None = "manual"
    latitude: float | None = None
    longitude: float | None = None

    class Config:
        from_attributes = True


class ClockInRequest(BaseModel):
    employee_id: str | None = None
    employeeId: str | None = None
    location: str | None = "Office"
    verification_method: str | None = "manual"
    verificationMethod: str | None = "manual"
    coordinates: dict[str, float] | None = None


class LeaveRequestIn(BaseModel):
    employee_id: str | None = None
    employeeId: str | None = None
    leave_type: str | None = None
    leaveType: str | None = None
    start_date: str | None = None
    startDate: str | None = None
    end_date: str | None = None
    endDate: str | None = None
    days: float = 1.0
    reason: str = ""
    is_half_day: bool = False
    isHalfDay: bool = False


class LeaveRequestOut(BaseModel):
    id: str
    employee_id: str
    employee_name: str
    leave_type: str
    start_date: str
    end_date: str
    days: float
    reason: str
    status: str
    applied_at: str
    reviewed_at: str | None = None
    reviewed_by: str | None = None
    review_comments: str | None = None

    class Config:
        from_attributes = True


class PayrollPeriodOut(BaseModel):
    id: str
    name: str
    month: int
    year: int
    start_date: str
    end_date: str
    pay_date: str | None = None
    status: str
    total_gross: float
    total_net: float
    total_deductions: float
    employee_count: int

    class Config:
        from_attributes = True


class PayslipOut(BaseModel):
    id: str
    employee_id: str
    period_id: str
    employee_name: str
    department: str
    designation: str
    basic_salary: float
    hra: float
    special_allowances: float
    gross_salary: float
    pf: float
    esi: float
    tax: float
    total_deductions: float
    net_salary: float
    status: str
    generated_at: str

    class Config:
        from_attributes = True


class JobPostingOut(BaseModel):
    id: str
    title: str
    slug: str
    department: str
    designation: str
    location: str
    employment_type: str
    min_experience: int
    max_experience: int | None = None
    min_salary: float | None = None
    max_salary: float | None = None
    vacancies: int
    job_description: str
    requirements: str | None = None
    responsibilities: str | None = None
    benefits: str | None = None
    status: str

    class Config:
        from_attributes = True


class CandidateOut(BaseModel):
    id: str
    job_id: str | None = None
    name: str
    email: str
    phone: str | None = None
    job_title: str
    stage: str
    ats_score: float
    experience_years: float
    skills: str | None = None
    resume_url: str | None = None
    ai_summary: str | None = None
    source: str

    class Config:
        from_attributes = True


class DocumentRecordOut(BaseModel):
    id: str
    name: str
    category: str
    type: str
    size: str
    author: str
    status: str
    url: str | None = None
    updated_at: str | None = None

    class Config:
        from_attributes = True


class PerformanceReviewOut(BaseModel):
    id: str
    employee_id: str
    cycle: str
    rating: float
    feedback: str | None = None
    strengths: str | None = None
    areas_of_improvement: str | None = None
    status: str

    class Config:
        from_attributes = True


class GoalOKROut(BaseModel):
    id: str
    employee_id: str | None = None
    title: str
    description: str | None = None
    category: str
    progress: int
    target: str
    status: str
    due_date: str | None = None

    class Config:
        from_attributes = True


class ExitCaseOut(BaseModel):
    id: str
    employee_id: str
    employee_name: str
    department: str
    role: str
    resignation_date: str
    last_working_day: str
    reason: str
    status: str
    clearance_step: int
    fnf_status: str

    class Config:
        from_attributes = True


class EngagementKudosOut(BaseModel):
    id: str
    from_user: str
    to_user: str
    message: str
    badge: str
    date: str

    class Config:
        from_attributes = True


class AIChatRequest(BaseModel):
    message: str | None = None
    prompt: str | None = None
    query: str | None = None
    context: dict[str, Any] | None = None


class AIChatResponse(BaseModel):
    response: str
    sources: list[str] = []
    intent: str = "general"
    timestamp: str
