import logging
from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependencies import CurrentUser, get_current_user
from app.db.session import get_db
from app.models.hr import ExitCase, Employee

router = APIRouter(prefix="/exit-management", tags=["Exit Management"])
logger = logging.getLogger("ofc360.exit_management")


@router.get("/cases", summary="List separation cases")
async def list_cases(
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    rows = (await db.execute(select(ExitCase).where(ExitCase.tenant_id == current.tenant_id))).scalars().all()
    return [
        {
            "id": c.id,
            "employeeId": c.employee_id,
            "name": c.employee_name,
            "department": c.department,
            "role": c.role,
            "resignationDate": c.resignation_date.isoformat(),
            "lastWorkingDay": c.last_working_day.isoformat(),
            "reason": c.reason,
            "status": c.status,
            "clearanceStep": c.clearance_step,
            "fnfStatus": c.fnf_status,
        }
        for c in rows
    ]


@router.post("/cases", status_code=status.HTTP_201_CREATED, summary="Initiate separation case")
async def create_case(
    payload: dict,
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    emp = (await db.execute(select(Employee).where(Employee.tenant_id == current.tenant_id))).scalars().first()
    case = ExitCase(
        tenant_id=current.tenant_id,
        employee_id=payload.get("employeeId") or (emp.id if emp else current.id),
        employee_name=payload.get("name") or (emp.name if emp else "Employee"),
        department=payload.get("department") or (emp.department if emp else "General"),
        role=payload.get("role") or (emp.designation if emp else "Staff"),
        resignation_date=date.today(),
        last_working_day=date.today(),
        reason=payload.get("reason", "Career Transition"),
        status="Under Review",
        clearance_step=1,
        fnf_status="Pending",
    )
    db.add(case)
    await db.commit()
    await db.refresh(case)
    return {
        "id": case.id,
        "employeeId": case.employee_id,
        "name": case.employee_name,
        "department": case.department,
        "role": case.role,
        "status": case.status,
    }
