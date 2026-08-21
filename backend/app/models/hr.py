import json
from datetime import date, datetime
from sqlalchemy import Date, DateTime, Float, ForeignKey, Integer, String, Text, Boolean, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, new_uuid


class Employee(Base, TimestampMixin):
    __tablename__ = "employees"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    tenant_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id"), index=True, nullable=False)
    user_id: Mapped[str | None] = mapped_column(String(36), nullable=True, index=True)

    first_name: Mapped[str] = mapped_column(String(128), nullable=False)
    last_name: Mapped[str] = mapped_column(String(128), default="", nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)

    personal_email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    company_email: Mapped[str | None] = mapped_column(String(255), nullable=True, index=True)
    email: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    phone: Mapped[str | None] = mapped_column(String(32), nullable=True)

    department: Mapped[str] = mapped_column(String(128), default="General", nullable=False)
    designation: Mapped[str] = mapped_column(String(128), default="Employee", nullable=False)
    role: Mapped[str] = mapped_column(String(32), default="employee", nullable=False)
    system_role: Mapped[str] = mapped_column(String(32), default="employee", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="Active", nullable=False)  # Active, On Leave, Probation, Inactive

    employment_type: Mapped[str] = mapped_column(String(32), default="FULL_TIME", nullable=False)
    joining_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    joined_at: Mapped[str | None] = mapped_column(String(32), nullable=True)

    salary: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    ctc: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    avatar: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    location: Mapped[str | None] = mapped_column(String(255), default="Headquarters", nullable=True)
    branch: Mapped[str | None] = mapped_column(String(255), nullable=True)
    shift: Mapped[str | None] = mapped_column(String(64), default="General Shift (9 AM - 6 PM)", nullable=True)
    reporting_manager_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    extra_data: Mapped[str | None] = mapped_column(Text, nullable=True)


class AttendanceRecord(Base, TimestampMixin):
    __tablename__ = "attendance_records"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    tenant_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id"), index=True, nullable=False)
    employee_id: Mapped[str] = mapped_column(String(36), ForeignKey("employees.id"), index=True, nullable=False)

    date: Mapped[date] = mapped_column(Date, index=True, nullable=False)
    check_in: Mapped[str | None] = mapped_column(String(32), nullable=True)
    check_out: Mapped[str | None] = mapped_column(String(32), nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="present", nullable=False)  # present, absent, half_day, late, on_leave
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    verification_method: Mapped[str | None] = mapped_column(String(32), default="manual", nullable=True)  # face_id, gps, wifi, manual
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    notes: Mapped[str | None] = mapped_column(String(512), nullable=True)


class LeaveRequest(Base, TimestampMixin):
    __tablename__ = "leave_requests"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    tenant_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id"), index=True, nullable=False)
    employee_id: Mapped[str] = mapped_column(String(36), ForeignKey("employees.id"), index=True, nullable=False)

    employee_name: Mapped[str] = mapped_column(String(255), default="", nullable=False)
    leave_type: Mapped[str] = mapped_column(String(64), nullable=False)  # Sick Leave, Casual Leave, Annual Leave, Maternity Leave
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    days: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="pending", nullable=False)  # pending, approved, rejected, cancelled
    applied_at: Mapped[str] = mapped_column(String(64), default="", nullable=False)
    reviewed_at: Mapped[str | None] = mapped_column(String(64), nullable=True)
    reviewed_by: Mapped[str | None] = mapped_column(String(255), nullable=True)
    review_comments: Mapped[str | None] = mapped_column(Text, nullable=True)


class LeaveBalance(Base, TimestampMixin):
    __tablename__ = "leave_balances"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    tenant_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id"), index=True, nullable=False)
    employee_id: Mapped[str] = mapped_column(String(36), ForeignKey("employees.id"), index=True, nullable=False)

    leave_type: Mapped[str] = mapped_column(String(64), nullable=False)
    total: Mapped[float] = mapped_column(Float, default=18.0, nullable=False)
    used: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    remaining: Mapped[float] = mapped_column(Float, default=18.0, nullable=False)


class PayrollPeriod(Base, TimestampMixin):
    __tablename__ = "payroll_periods"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    tenant_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id"), index=True, nullable=False)

    name: Mapped[str] = mapped_column(String(128), nullable=False)  # "March 2026", "April 2026"
    month: Mapped[int] = mapped_column(Integer, default=3, nullable=False)
    year: Mapped[int] = mapped_column(Integer, default=2026, nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    pay_date: Mapped[date | None] = mapped_column(Date, nullable=True)

    status: Mapped[str] = mapped_column(String(32), default="DRAFT", nullable=False)  # DRAFT, PROCESSING, COMPLETED, FINALIZED
    total_gross: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    total_net: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    total_deductions: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    employee_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class Payslip(Base, TimestampMixin):
    __tablename__ = "payslips"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    tenant_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id"), index=True, nullable=False)
    employee_id: Mapped[str] = mapped_column(String(36), ForeignKey("employees.id"), index=True, nullable=False)
    period_id: Mapped[str] = mapped_column(String(36), ForeignKey("payroll_periods.id"), index=True, nullable=False)

    employee_name: Mapped[str] = mapped_column(String(255), default="", nullable=False)
    department: Mapped[str] = mapped_column(String(128), default="", nullable=False)
    designation: Mapped[str] = mapped_column(String(128), default="", nullable=False)

    basic_salary: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    hra: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    special_allowances: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    gross_salary: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    pf: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    esi: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    tax: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    total_deductions: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    net_salary: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    status: Mapped[str] = mapped_column(String(32), default="PAID", nullable=False)  # GENERATED, PAID
    generated_at: Mapped[str] = mapped_column(String(64), default="", nullable=False)


class JobPosting(Base, TimestampMixin):
    __tablename__ = "job_postings"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    tenant_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id"), index=True, nullable=False)

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    department: Mapped[str] = mapped_column(String(128), nullable=False)
    designation: Mapped[str] = mapped_column(String(128), default="", nullable=False)
    location: Mapped[str] = mapped_column(String(128), default="Remote / Hybrid", nullable=False)
    employment_type: Mapped[str] = mapped_column(String(64), default="Full-Time", nullable=False)

    min_experience: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    max_experience: Mapped[int | None] = mapped_column(Integer, nullable=True)
    min_salary: Mapped[float | None] = mapped_column(Float, nullable=True)
    max_salary: Mapped[float | None] = mapped_column(Float, nullable=True)
    vacancies: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    job_description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    requirements: Mapped[str | None] = mapped_column(Text, nullable=True)
    responsibilities: Mapped[str | None] = mapped_column(Text, nullable=True)
    benefits: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="Active", nullable=False)  # Active, Closed, Draft


class Candidate(Base, TimestampMixin):
    __tablename__ = "candidates"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    tenant_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id"), index=True, nullable=False)
    job_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("job_postings.id"), nullable=True)

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    phone: Mapped[str | None] = mapped_column(String(32), nullable=True)
    job_title: Mapped[str] = mapped_column(String(255), default="Applicant", nullable=False)
    stage: Mapped[str] = mapped_column(String(64), default="Applied", nullable=False)  # Applied, Screening, Interview, Offered, Hired, Rejected
    ats_score: Mapped[float] = mapped_column(Float, default=85.0, nullable=False)
    experience_years: Mapped[float] = mapped_column(Float, default=2.0, nullable=False)
    skills: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON or comma-separated
    resume_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    ai_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    source: Mapped[str] = mapped_column(String(64), default="Direct Application", nullable=False)


class DocumentRecord(Base, TimestampMixin):
    __tablename__ = "document_records"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    tenant_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id"), index=True, nullable=False)

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(64), default="Policy", nullable=False)  # Contract, Policy, Report, Offer, Template
    type: Mapped[str] = mapped_column(String(64), default="pdf", nullable=False)
    size: Mapped[str] = mapped_column(String(32), default="1.2 MB", nullable=False)
    author: Mapped[str] = mapped_column(String(128), default="HR Admin", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="Active", nullable=False)
    url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    file_path: Mapped[str | None] = mapped_column(String(1024), nullable=True)


class PerformanceReview(Base, TimestampMixin):
    __tablename__ = "performance_reviews"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    tenant_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id"), index=True, nullable=False)
    employee_id: Mapped[str] = mapped_column(String(36), ForeignKey("employees.id"), index=True, nullable=False)

    cycle: Mapped[str] = mapped_column(String(64), default="Q1 2026", nullable=False)
    rating: Mapped[float] = mapped_column(Float, default=4.5, nullable=False)
    feedback: Mapped[str | None] = mapped_column(Text, nullable=True)
    strengths: Mapped[str | None] = mapped_column(Text, nullable=True)
    areas_of_improvement: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="COMPLETED", nullable=False)


class GoalOKR(Base, TimestampMixin):
    __tablename__ = "goals_okrs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    tenant_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id"), index=True, nullable=False)
    employee_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("employees.id"), nullable=True)

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    category: Mapped[str] = mapped_column(String(64), default="Company", nullable=False)  # Company, Department, Individual
    progress: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    target: Mapped[str] = mapped_column(String(128), default="100%", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="In Progress", nullable=False)
    due_date: Mapped[str | None] = mapped_column(String(64), nullable=True)


class ExitCase(Base, TimestampMixin):
    __tablename__ = "exit_cases"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    tenant_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id"), index=True, nullable=False)
    employee_id: Mapped[str] = mapped_column(String(36), ForeignKey("employees.id"), index=True, nullable=False)

    employee_name: Mapped[str] = mapped_column(String(255), nullable=False)
    department: Mapped[str] = mapped_column(String(128), default="", nullable=False)
    role: Mapped[str] = mapped_column(String(128), default="", nullable=False)
    resignation_date: Mapped[date] = mapped_column(Date, nullable=False)
    last_working_day: Mapped[date] = mapped_column(Date, nullable=False)
    reason: Mapped[str] = mapped_column(String(512), default="Career Growth", nullable=False)
    status: Mapped[str] = mapped_column(String(64), default="Under Review", nullable=False)  # Under Review, Notice Period, Clearance Done, Completed
    clearance_step: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    fnf_status: Mapped[str] = mapped_column(String(32), default="Pending", nullable=False)


class EngagementKudos(Base, TimestampMixin):
    __tablename__ = "engagement_kudos"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    tenant_id: Mapped[str] = mapped_column(String(36), ForeignKey("schools.id"), index=True, nullable=False)

    from_user: Mapped[str] = mapped_column(String(255), default="Team Member", nullable=False)
    to_user: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    badge: Mapped[str] = mapped_column(String(64), default="Star Performer", nullable=False)
    date: Mapped[str] = mapped_column(String(64), default="Just now", nullable=False)
