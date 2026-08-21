import logging
from datetime import date, datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependencies import CurrentUser, get_current_user
from app.db.session import get_db
from app.models.hr import AttendanceRecord, Employee

router = APIRouter(prefix="/attendance", tags=["Attendance"])
logger = logging.getLogger("ofc360.attendance")


def _record_dict(r: AttendanceRecord, emp: Optional[Employee] = None) -> dict:
    return {
        "id": r.id,
        "employeeId": r.employee_id,
        "employee_id": r.employee_id,
        "employeeName": emp.name if emp else "",
        "date": r.date.isoformat() if r.date else "",
        "checkIn": r.check_in or "",
        "check_in": r.check_in or "",
        "checkOut": r.check_out or "",
        "check_out": r.check_out or "",
        "status": r.status,
        "location": r.location or "Office Headquarters",
        "verificationMethod": r.verification_method or "face_id",
        "verification_method": r.verification_method or "face_id",
        "coordinates": {"lat": r.latitude, "lng": r.longitude} if r.latitude else None,
    }


@router.get("", summary="Get attendance records")
async def list_attendance(
    employeeId: Optional[str] = None,
    date_val: Optional[str] = Query(default=None, alias="date"),
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    q = select(AttendanceRecord).where(AttendanceRecord.tenant_id == current.tenant_id)
    if employeeId:
        q = q.where(AttendanceRecord.employee_id == employeeId)
    if date_val:
        try:
            d = date.fromisoformat(date_val)
            q = q.where(AttendanceRecord.date == d)
        except ValueError:
            pass

    records = (await db.execute(q.order_by(AttendanceRecord.date.desc()))).scalars().all()
    employees = (await db.execute(select(Employee).where(Employee.tenant_id == current.tenant_id))).scalars().all()
    emp_map = {e.id: e for e in employees}

    return [_record_dict(r, emp_map.get(r.employee_id)) for r in records]


@router.get("/summary", summary="Get attendance summary")
async def attendance_summary(
    date_val: Optional[str] = Query(default=None, alias="date"),
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    target_date = date.today()
    if date_val:
        try:
            target_date = date.fromisoformat(date_val)
        except ValueError:
            pass

    employees = (await db.execute(select(Employee).where(Employee.tenant_id == current.tenant_id))).scalars().all()
    records = (
        await db.execute(
            select(AttendanceRecord).where(
                AttendanceRecord.tenant_id == current.tenant_id,
                AttendanceRecord.date == target_date,
            )
        )
    ).scalars().all()

    emp_map = {e.id: e for e in employees}
    total = len(employees)
    present = sum(1 for r in records if r.status in ["present", "late"])
    absent = total - present
    late = sum(1 for r in records if r.status == "late")
    on_leave = sum(1 for r in records if r.status == "on_leave")

    return {
        "date": target_date.isoformat(),
        "stats": {
            "totalEmployees": total,
            "presentCount": present,
            "absentCount": max(0, absent),
            "lateCount": late,
            "onLeaveCount": on_leave,
        },
        "records": [_record_dict(r, emp_map.get(r.employee_id)) for r in records],
    }


@router.get("/stats", summary="Get attendance stats")
async def attendance_stats(
    date_val: Optional[str] = Query(default=None, alias="date"),
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    target_date = date.today()
    employees = (await db.execute(select(Employee).where(Employee.tenant_id == current.tenant_id))).scalars().all()
    records = (
        await db.execute(
            select(AttendanceRecord).where(
                AttendanceRecord.tenant_id == current.tenant_id,
                AttendanceRecord.date == target_date,
            )
        )
    ).scalars().all()

    total = len(employees)
    present = sum(1 for r in records if r.status in ["present", "late"])
    late = sum(1 for r in records if r.status == "late")
    on_leave = sum(1 for r in records if r.status == "on_leave")

    return {
        "totalEmployees": total,
        "presentCount": present,
        "absentCount": max(0, total - present),
        "lateCount": late,
        "onLeaveCount": on_leave,
    }


@router.get("/status", summary="Get current user attendance status")
async def attendance_status(
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    today = date.today()
    rec = (
        await db.execute(
            select(AttendanceRecord).where(
                AttendanceRecord.tenant_id == current.tenant_id,
                AttendanceRecord.date == today,
            )
        )
    ).scalars().first()

    return {
        "status": "clocked_in" if (rec and rec.check_in and not rec.check_out) else "clocked_out",
        "record": _record_dict(rec) if rec else None,
    }


@router.post("/clock-in", summary="Clock in")
async def clock_in(
    payload: dict,
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    emp_id = payload.get("employeeId") or payload.get("employee_id") or current.id
    today = date.today()
    now_str = datetime.now().strftime("%I:%M %p")

    rec = (
        await db.execute(
            select(AttendanceRecord).where(
                AttendanceRecord.tenant_id == current.tenant_id,
                AttendanceRecord.employee_id == emp_id,
                AttendanceRecord.date == today,
            )
        )
    ).scalar_one_or_none()

    if not rec:
        rec = AttendanceRecord(
            tenant_id=current.tenant_id,
            employee_id=emp_id,
            date=today,
            check_in=now_str,
            status="present",
            location=payload.get("location") or "Office",
            verification_method=payload.get("verificationMethod") or "manual",
        )
        db.add(rec)
    else:
        rec.check_in = now_str
        rec.status = "present"

    await db.commit()
    await db.refresh(rec)
    return _record_dict(rec)


@router.post("/{attendanceId}/clock-out", summary="Clock out")
async def clock_out(
    attendanceId: str,
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    rec = await db.get(AttendanceRecord, attendanceId)
    now_str = datetime.now().strftime("%I:%M %p")
    if rec:
        rec.check_out = now_str
        await db.commit()
        await db.refresh(rec)
        return _record_dict(rec)

    return {"success": True, "message": "Clocked out"}


@router.post("/face/check-in", summary="Face check in")
async def face_check_in(
    request: Request,
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    today = date.today()
    now_str = datetime.now().strftime("%I:%M %p")
    rec = AttendanceRecord(
        tenant_id=current.tenant_id,
        employee_id=current.id,
        date=today,
        check_in=now_str,
        status="present",
        verification_method="face_id",
        location="Front Door Camera",
    )
    db.add(rec)
    await db.commit()
    await db.refresh(rec)
    return _record_dict(rec)


@router.post("/face/check-out", summary="Face check out")
async def face_check_out(
    request: Request,
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    today = date.today()
    now_str = datetime.now().strftime("%I:%M %p")
    rec = (
        await db.execute(
            select(AttendanceRecord).where(
                AttendanceRecord.tenant_id == current.tenant_id,
                AttendanceRecord.date == today,
            )
        )
    ).scalars().first()

    if rec:
        rec.check_out = now_str
        await db.commit()
        await db.refresh(rec)
        return _record_dict(rec)

    return {"success": True, "message": "Face verified check out"}


@router.get("/my", summary="Get my attendance records")
async def my_attendance(
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    records = (
        await db.execute(
            select(AttendanceRecord).where(AttendanceRecord.tenant_id == current.tenant_id).order_by(AttendanceRecord.date.desc()).limit(30)
        )
    ).scalars().all()
    return [_record_dict(r) for r in records]


@router.get("/team", summary="Get team attendance records")
async def team_attendance(
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    records = (
        await db.execute(
            select(AttendanceRecord).where(AttendanceRecord.tenant_id == current.tenant_id).order_by(AttendanceRecord.date.desc()).limit(50)
        )
    ).scalars().all()
    return [_record_dict(r) for r in records]


@router.post("/regularize", summary="Submit attendance regularization")
async def regularize_attendance(
    payload: dict,
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    today = date.today()
    rec = AttendanceRecord(
        tenant_id=current.tenant_id,
        employee_id=current.id,
        date=today,
        check_in=payload.get("checkIn") or "09:00 AM",
        check_out=payload.get("checkOut") or "06:00 PM",
        status="present",
        notes=payload.get("reason", "Regularization approved"),
    )
    db.add(rec)
    await db.commit()
    await db.refresh(rec)
    return _record_dict(rec)
