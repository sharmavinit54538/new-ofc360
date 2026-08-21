import logging
from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependencies import CurrentUser, get_current_user
from app.db.session import get_db
from app.models.hr import LeaveBalance, LeaveRequest, Employee

router = APIRouter(prefix="/leaves", tags=["Leaves"])
logger = logging.getLogger("ofc360.leaves")


def _leave_dict(l: LeaveRequest) -> dict:
    return {
        "id": l.id,
        "employeeId": l.employee_id,
        "employee_id": l.employee_id,
        "employeeName": l.employee_name,
        "leaveType": l.leave_type,
        "leave_type": l.leave_type,
        "startDate": l.start_date.isoformat() if l.start_date else "",
        "start_date": l.start_date.isoformat() if l.start_date else "",
        "endDate": l.end_date.isoformat() if l.end_date else "",
        "end_date": l.end_date.isoformat() if l.end_date else "",
        "days": l.days,
        "reason": l.reason,
        "status": l.status,
        "appliedAt": l.applied_at or "",
        "reviewedAt": l.reviewed_at,
        "reviewedBy": l.reviewed_by,
        "reviewComments": l.review_comments,
    }


@router.get("/balances", summary="Get leave balances")
async def get_leave_balances(
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    rows = (
        await db.execute(select(LeaveBalance).where(LeaveBalance.tenant_id == current.tenant_id))
    ).scalars().all()

    if not rows:
        return [
            {"leaveType": "Casual Leave", "total": 12, "used": 2, "remaining": 10},
            {"leaveType": "Sick Leave", "total": 12, "used": 1, "remaining": 11},
            {"leaveType": "Annual Leave", "total": 18, "used": 4, "remaining": 14},
        ]

    # Aggregate by leave type
    by_type: dict[str, dict] = {}
    for r in rows:
        if r.leave_type not in by_type:
            by_type[r.leave_type] = {"leaveType": r.leave_type, "total": 0, "used": 0, "remaining": 0}
        by_type[r.leave_type]["total"] += r.total
        by_type[r.leave_type]["used"] += r.used
        by_type[r.leave_type]["remaining"] += r.remaining

    return list(by_type.values())


@router.get("/balances/{employeeId}", summary="Get leave balance for specific employee")
async def get_employee_leave_balances(
    employeeId: str,
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    rows = (
        await db.execute(
            select(LeaveBalance).where(
                LeaveBalance.tenant_id == current.tenant_id,
                LeaveBalance.employee_id == employeeId,
            )
        )
    ).scalars().all()

    if not rows:
        return [
            {"leaveType": "Casual Leave", "total": 12, "used": 1, "remaining": 11},
            {"leaveType": "Sick Leave", "total": 12, "used": 0, "remaining": 12},
            {"leaveType": "Annual Leave", "total": 18, "used": 2, "remaining": 16},
        ]

    return [{"leaveType": r.leave_type, "total": r.total, "used": r.used, "remaining": r.remaining} for r in rows]


@router.post("/apply", summary="Apply for leave")
async def apply_leave(
    payload: dict,
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    emp = (await db.execute(select(Employee).where(Employee.tenant_id == current.tenant_id))).scalars().first()
    emp_name = current.name or (emp.name if emp else "Employee")

    leave_type = payload.get("leaveType") or payload.get("leave_type") or "Casual Leave"
    start_str = payload.get("startDate") or payload.get("start_date") or date.today().isoformat()
    end_str = payload.get("endDate") or payload.get("end_date") or start_str

    req = LeaveRequest(
        tenant_id=current.tenant_id,
        employee_id=emp.id if emp else current.id,
        employee_name=emp_name,
        leave_type=leave_type,
        start_date=date.fromisoformat(start_str),
        end_date=date.fromisoformat(end_str),
        days=float(payload.get("days", 1.0)),
        reason=payload.get("reason", "Personal leave"),
        status="pending",
        applied_at=date.today().isoformat(),
    )
    db.add(req)
    await db.commit()
    await db.refresh(req)
    return _leave_dict(req)


@router.get("/history", summary="Get leave history")
async def leave_history(
    employeeId: Optional[str] = None,
    status: Optional[str] = None,
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    q = select(LeaveRequest).where(LeaveRequest.tenant_id == current.tenant_id)
    if employeeId:
        q = q.where(LeaveRequest.employee_id == employeeId)
    if status and status != "ALL":
        q = q.where(LeaveRequest.status == status.lower())

    rows = (await db.execute(q.order_by(LeaveRequest.created_at.desc()))).scalars().all()
    return [_leave_dict(r) for r in rows]


@router.get("/pending", summary="Get pending leave requests")
async def pending_leaves(
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    rows = (
        await db.execute(
            select(LeaveRequest)
            .where(LeaveRequest.tenant_id == current.tenant_id, LeaveRequest.status == "pending")
            .order_by(LeaveRequest.created_at.desc())
        )
    ).scalars().all()
    return [_leave_dict(r) for r in rows]


@router.post("/{leaveId}/review", summary="Review leave request")
async def review_leave(
    leaveId: str,
    payload: dict,
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    req = await db.get(LeaveRequest, leaveId)
    if not req or req.tenant_id != current.tenant_id:
        raise HTTPException(status_code=404, detail="Leave request not found")

    action = payload.get("action", "approve")
    req.status = "approved" if action == "approve" else "rejected"
    req.reviewed_at = date.today().isoformat()
    req.reviewed_by = current.name or "Manager"
    req.review_comments = payload.get("comments")

    await db.commit()
    await db.refresh(req)
    return _leave_dict(req)


@router.post("/{leaveId}/cancel", summary="Cancel leave request")
async def cancel_leave(
    leaveId: str,
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    req = await db.get(LeaveRequest, leaveId)
    if req and req.tenant_id == current.tenant_id:
        req.status = "cancelled"
        await db.commit()
    return {"success": True}


@router.get("/policies", summary="Get leave policies")
async def get_leave_policies(
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return [
        {"id": "pol-1", "name": "Standard Casual Leave", "leaveType": "Casual Leave", "maxDays": 12, "carryForward": True, "requiresApproval": True},
        {"id": "pol-2", "name": "Annual Paid Vacation", "leaveType": "Annual Leave", "maxDays": 18, "carryForward": True, "requiresApproval": True},
        {"id": "pol-3", "name": "Medical & Sick Policy", "leaveType": "Sick Leave", "maxDays": 12, "carryForward": False, "requiresApproval": False},
    ]


@router.get("/types", summary="Get leave types")
async def get_leave_types(
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return ["Casual Leave", "Sick Leave", "Annual Leave", "Maternity Leave", "Paternity Leave", "Bereavement Leave"]
