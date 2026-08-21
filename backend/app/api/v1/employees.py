import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependencies import CurrentUser, get_current_user
from app.db.session import get_db
from app.models.hr import Employee
from app.schemas.hr import EmployeeCreate, EmployeeOut, EmployeeUpdate

router = APIRouter(prefix="/employees", tags=["Employees"])
logger = logging.getLogger("ofc360.employees")


def _normalize_emp_dict(emp: Employee) -> dict:
    return {
        "id": emp.id,
        "tenant_id": emp.tenant_id,
        "name": emp.name,
        "first_name": emp.first_name,
        "last_name": emp.last_name,
        "email": emp.email,
        "personal_email": emp.personal_email or emp.email,
        "company_email": emp.company_email or emp.email,
        "phone": emp.phone or "",
        "department": emp.department,
        "designation": emp.designation,
        "role": emp.role,
        "backendRole": emp.role,
        "portalRole": emp.role,
        "systemRole": emp.system_role or emp.role,
        "status": emp.status,
        "employment_type": emp.employment_type,
        "salary": emp.salary,
        "ctc": emp.ctc or emp.salary,
        "joinedAt": emp.joined_at or (emp.joining_date.isoformat() if emp.joining_date else ""),
        "joining_date": emp.joining_date.isoformat() if emp.joining_date else "",
        "avatar": emp.avatar or "",
        "location": emp.location or "Headquarters",
        "shift": emp.shift or "General Shift",
    }


@router.get("", summary="List all employees with filtering and search")
async def list_employees(
    department: Optional[str] = None,
    status: Optional[str] = None,
    role: Optional[str] = None,
    search: Optional[str] = None,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=100, ge=1, le=500),
    sort: Optional[str] = None,
    order: Optional[str] = "asc",
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    q = select(Employee).where(Employee.tenant_id == current.tenant_id)

    if department and department != "ALL":
        q = q.where(func.lower(Employee.department) == department.lower())
    if status and status != "ALL":
        q = q.where(func.lower(Employee.status) == status.lower())
    if role and role != "ALL":
        q = q.where(func.lower(Employee.role) == role.lower())
    if search and search.strip():
        term = f"%{search.strip().lower()}%"
        q = q.where(
            or_(
                func.lower(Employee.name).like(term),
                func.lower(Employee.email).like(term),
                func.lower(Employee.department).like(term),
                func.lower(Employee.designation).like(term),
            )
        )

    # Count total
    total_q = select(func.count()).select_from(q.subquery())
    total = (await db.execute(total_q)).scalar() or 0

    # Order
    q = q.order_by(Employee.created_at.desc() if order == "desc" else Employee.created_at.asc())
    q = q.offset((page - 1) * limit).limit(limit)

    rows = (await db.execute(q)).scalars().all()
    results = [_normalize_emp_dict(r) for r in rows]

    return {
        "success": True,
        "data": results,
        "total": total,
        "page": page,
        "limit": limit,
    }


@router.get("/stats", summary="Get workforce overview stats")
async def employee_stats(
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    rows = (await db.execute(select(Employee).where(Employee.tenant_id == current.tenant_id))).scalars().all()

    total = len(rows)
    active = sum(1 for e in rows if (e.status or "").lower() == "active")
    on_leave = sum(1 for e in rows if "leave" in (e.status or "").lower())
    probation = sum(1 for e in rows if "probation" in (e.status or "").lower())

    dept_counts: dict[str, int] = {}
    for e in rows:
        dept = e.department or "General"
        dept_counts[dept] = dept_counts.get(dept, 0) + 1

    return {
        "success": True,
        "data": {
            "totalEmployees": total,
            "activeEmployees": active,
            "onLeaveEmployees": on_leave,
            "probationEmployees": probation,
            "departmentCounts": dept_counts,
        },
    }


@router.get("/dashboard", summary="Get employee dashboard metrics")
async def employee_dashboard(
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    rows = (await db.execute(select(Employee).where(Employee.tenant_id == current.tenant_id))).scalars().all()
    dept_counts: dict[str, int] = {}
    for e in rows:
        dept = e.department or "General"
        dept_counts[dept] = dept_counts.get(dept, 0) + 1

    distribution = [{"department": k, "count": v} for k, v in dept_counts.items()]

    return {
        "success": True,
        "data": {
            "totalCount": len(rows),
            "activeCount": sum(1 for e in rows if (e.status or "").lower() == "active"),
            "newHiresThisMonth": sum(1 for e in rows if e.joining_date and e.joining_date.month == 3),
            "turnoverRate": 1.4,
            "departmentDistribution": distribution,
        },
    }


@router.get("/departments", summary="List distinct departments")
async def list_departments(
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    rows = (await db.execute(select(Employee.department).where(Employee.tenant_id == current.tenant_id).distinct())).scalars().all()
    return {"success": True, "data": [r for r in rows if r]}


@router.get("/{id}", summary="Get employee by ID")
async def get_employee(
    id: str,
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    emp = await db.get(Employee, id)
    if not emp or emp.tenant_id != current.tenant_id:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"success": True, "data": _normalize_emp_dict(emp)}


@router.post("", status_code=status.HTTP_201_CREATED, summary="Create new employee")
async def create_employee(
    payload: dict,
    request: Request,
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    first_name = (payload.get("first_name") or payload.get("firstName") or (payload.get("name", "").split(" ")[0]) or "Employee").strip()
    last_name = (payload.get("last_name") or payload.get("lastName") or (" ".join(payload.get("name", "").split(" ")[1:])) or "").strip()
    name = f"{first_name} {last_name}".strip()

    email = (payload.get("email") or payload.get("personal_email") or payload.get("personalEmail") or payload.get("company_email") or f"{first_name.lower()}.{last_name.lower() or 'emp'}@ofc360.com").strip()

    salary = float(payload.get("salary") or payload.get("ctc") or payload.get("basic_salary") or 0.0)

    emp = Employee(
        tenant_id=current.tenant_id,
        first_name=first_name,
        last_name=last_name,
        name=name,
        email=email,
        personal_email=payload.get("personal_email") or email,
        company_email=payload.get("company_email") or email,
        phone=payload.get("phone") or payload.get("phone_number") or "",
        department=payload.get("department") or payload.get("department_name") or "General",
        designation=payload.get("designation") or "Employee",
        role=payload.get("role") or "employee",
        system_role=payload.get("system_role") or payload.get("role") or "employee",
        status=payload.get("status") or "Active",
        employment_type=payload.get("employment_type") or "FULL_TIME",
        salary=salary,
        ctc=salary,
        location=payload.get("location") or payload.get("work_location") or "Headquarters",
        avatar=payload.get("avatar") or payload.get("profile_photo_url") or "",
    )
    db.add(emp)
    await db.commit()
    await db.refresh(emp)

    return {"success": True, "data": _normalize_emp_dict(emp)}


@router.patch("/{id}", summary="Update employee")
async def update_employee(
    id: str,
    payload: dict,
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    emp = await db.get(Employee, id)
    if not emp or emp.tenant_id != current.tenant_id:
        raise HTTPException(status_code=404, detail="Employee not found")

    for key, value in payload.items():
        if hasattr(emp, key) and value is not None:
            setattr(emp, key, value)

    if payload.get("name"):
        emp.name = payload["name"]
    if payload.get("first_name") or payload.get("last_name"):
        emp.name = f"{emp.first_name} {emp.last_name}".strip()

    await db.commit()
    await db.refresh(emp)
    return {"success": True, "data": _normalize_emp_dict(emp)}


@router.delete("/{id}", summary="Delete employee")
async def delete_employee(
    id: str,
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    emp = await db.get(Employee, id)
    if not emp or emp.tenant_id != current.tenant_id:
        raise HTTPException(status_code=404, detail="Employee not found")
    await db.delete(emp)
    await db.commit()
    return {"success": True, "message": "Employee deleted successfully"}
