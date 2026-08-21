import logging
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependencies import CurrentUser, get_current_user
from app.db.session import get_db
from app.models.hr import EngagementKudos

router = APIRouter(prefix="/engagement", tags=["Engagement"])
logger = logging.getLogger("ofc360.engagement")


@router.get("/kudos", summary="List kudos recognitions")
async def list_kudos(
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    rows = (
        await db.execute(
            select(EngagementKudos).where(EngagementKudos.tenant_id == current.tenant_id).order_by(EngagementKudos.created_at.desc())
        )
    ).scalars().all()
    return [
        {
            "id": k.id,
            "from": k.from_user,
            "to": k.to_user,
            "message": k.message,
            "badge": k.badge,
            "date": k.date,
        }
        for k in rows
    ]


@router.post("/kudos", status_code=status.HTTP_201_CREATED, summary="Send kudos recognition")
async def send_kudos(
    payload: dict,
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    kudos = EngagementKudos(
        tenant_id=current.tenant_id,
        from_user=current.name or payload.get("from") or "Manager",
        to_user=payload.get("to") or payload.get("recipient", "Team Member"),
        message=payload.get("message", "Great job!"),
        badge=payload.get("badge", "Star Performer"),
        date="Just now",
    )
    db.add(kudos)
    await db.commit()
    await db.refresh(kudos)
    return {
        "id": kudos.id,
        "from": kudos.from_user,
        "to": kudos.to_user,
        "message": kudos.message,
        "badge": kudos.badge,
        "date": kudos.date,
    }
