from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.v1.attendance import attendance_report, export_csv as attendance_export_csv
from app.api.v1.fees import fee_summary
from app.db.dependencies import CurrentUser, require_permission
from app.db.session import get_db
from app.schemas.attendance import AttendanceReportRow
from app.schemas.fee import FeeSummary

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("/attendance", response_model=list[AttendanceReportRow])
async def reports_attendance(start_date: date | None = None, end_date: date | None = None,
                              current: CurrentUser = Depends(require_permission("reports:read")), db: AsyncSession = Depends(get_db)):
    return await attendance_report(start_date=start_date, end_date=end_date, class_name=None, section=None, student_id=None, current=current, db=db)


@router.get("/fees", response_model=FeeSummary)
async def reports_fees(current: CurrentUser = Depends(require_permission("reports:read")), db: AsyncSession = Depends(get_db)):
    return await fee_summary(current=current, db=db)


@router.get("/attendance/export")
async def reports_attendance_export(start_date: date | None = None, end_date: date | None = None,
                                     current: CurrentUser = Depends(require_permission("reports:read")), db: AsyncSession = Depends(get_db)):
    return await attendance_export_csv(start_date=start_date, end_date=end_date, current=current, db=db)


@router.get("/fees/export")
async def reports_fees_export(current: CurrentUser = Depends(require_permission("reports:read")), db: AsyncSession = Depends(get_db)):
    import csv
    import io

    from fastapi.responses import StreamingResponse
    from sqlalchemy import select

    from app.api.v1.fees import _out
    from app.models.fee import Fee

    rows = [_out(f) for f in (await db.execute(select(Fee).where(Fee.tenant_id == current.tenant_id))).scalars().all()]
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["Student ID", "Fee Type", "Amount", "Paid", "Pending", "Status", "Due Date"])
    for r in rows:
        writer.writerow([r.student_id, r.fee_type, r.amount, r.paid_amount, r.pending_amount, r.payment_status, r.due_date])
    buf.seek(0)
    return StreamingResponse(buf, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=fees_report.csv"})
