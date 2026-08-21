import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependencies import CurrentUser, get_current_user
from app.db.session import get_db
from app.models.hr import GoalOKR, PerformanceReview, Employee

router = APIRouter(prefix="/performance", tags=["Performance"])
logger = logging.getLogger("ofc360.performance")


@router.get("/reviews", summary="List performance reviews")
async def list_reviews(
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    rows = (
        await db.execute(select(PerformanceReview).where(PerformanceReview.tenant_id == current.tenant_id))
    ).scalars().all()
    return [
        {
            "id": r.id,
            "employeeId": r.employee_id,
            "cycle": r.cycle,
            "rating": r.rating,
            "feedback": r.feedback,
            "strengths": r.strengths,
            "status": r.status,
        }
        for r in rows
    ]


@router.get("/goals", summary="List OKR goals")
async def list_goals(
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    rows = (await db.execute(select(GoalOKR).where(GoalOKR.tenant_id == current.tenant_id))).scalars().all()
    return [
        {
            "id": g.id,
            "title": g.title,
            "description": g.description,
            "category": g.category,
            "progress": g.progress,
            "target": g.target,
            "status": g.status,
            "dueDate": g.due_date,
        }
        for g in rows
    ]


@router.post("/goals", status_code=status.HTTP_201_CREATED, summary="Create new OKR goal")
async def create_goal(
    payload: dict,
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    goal = GoalOKR(
        tenant_id=current.tenant_id,
        title=payload.get("title", "New Goal"),
        description=payload.get("description", ""),
        category=payload.get("category", "Company"),
        progress=int(payload.get("progress", 0)),
        target=payload.get("target", "100%"),
        status=payload.get("status", "In Progress"),
        due_date=payload.get("dueDate", "End of Quarter"),
    )
    db.add(goal)
    await db.commit()
    await db.refresh(goal)
    return {
        "id": goal.id,
        "title": goal.title,
        "description": goal.description,
        "category": goal.category,
        "progress": goal.progress,
        "target": goal.target,
        "status": goal.status,
        "dueDate": goal.due_date,
    }


@router.get("/kpis", summary="Get key performance indicators")
async def list_kpis(
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return [
        {"title": "Sprint Velocity & Delivery", "target": "95%", "actual": "93%", "status": "On Track"},
        {"title": "Customer Satisfaction Score (CSAT)", "target": "4.8 / 5.0", "actual": "4.7 / 5.0", "status": "On Track"},
        {"title": "Employee Retention Rate", "target": "92%", "actual": "94.6%", "status": "Exceeded"},
    ]


@router.get("/competencies", summary="Get skill competency radar data")
async def competency_radar(
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return [
        {"subject": "Technical Craft", "A": 90, "fullMark": 100},
        {"subject": "System Architecture", "A": 85, "fullMark": 100},
        {"subject": "Leadership & Mentorship", "A": 80, "fullMark": 100},
        {"subject": "Communication", "A": 88, "fullMark": 100},
        {"subject": "Delivery Velocity", "A": 92, "fullMark": 100},
    ]
