import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependencies import CurrentUser, get_current_user
from app.db.session import get_db
from app.models.hr import Employee
from app.models.school import School

router = APIRouter(tags=["Company"])
logger = logging.getLogger("ofc360.company")


@router.get("/company", summary="Get company profile")
async def get_company(
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    school = await db.get(School, current.tenant_id)
    return {
        "success": True,
        "data": {
            "id": school.id if school else current.tenant_id,
            "name": school.school_name if school else "EquinoxSphere OFC360",
            "legal_name": "EquinoxSphere Technologies Inc.",
            "registration_number": "EQX-2026-9901",
            "tax_id": "TAX-US-991203",
            "address": "100 Market Street, Suite 400",
            "city": "San Francisco",
            "state": "California",
            "country": "United States",
            "phone": "+1 (555) 019-2834",
            "email": "contact@ofc360.com",
            "website": "https://www.ofc360.com",
            "is_active": True,
            "created_at": "2024-01-01T00:00:00Z",
            "updated_at": "2026-03-01T00:00:00Z",
        },
    }


@router.get("/company/settings", summary="Get company settings")
@router.get("/settings", summary="Get settings")
async def get_settings(
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return {
        "success": True,
        "data": {
            "id": "set-1",
            "company_id": current.tenant_id,
            "timezone": "America/Los_Angeles",
            "date_format": "YYYY-MM-DD",
            "time_format": "12h",
            "currency": "USD",
            "language": "en",
            "fiscal_year_start": 1,
        },
    }


@router.get("/departments", summary="List departments")
async def list_departments(
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    dept_names = ["Engineering", "Product", "Human Resources", "Design", "Marketing", "Sales", "Operations"]
    data = [
        {
            "id": f"dept-{i+1}",
            "name": name,
            "description": f"{name} business department",
            "is_active": True,
            "created_at": "2024-01-01T00:00:00Z",
            "updated_at": "2026-03-01T00:00:00Z",
        }
        for i, name in enumerate(dept_names)
    ]
    return {"success": True, "data": data}


@router.get("/designations", summary="List designations")
async def list_designations(
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    designations = [
        "Principal Software Architect",
        "VP of Product Strategy",
        "Senior Full-Stack Engineer",
        "Director of People Operations",
        "Lead UI/UX Designer",
        "Growth Marketing Lead",
        "Enterprise Account Executive",
        "DevOps & Cloud Engineer",
        "Compliance & Security Officer",
    ]
    data = [
        {
            "id": f"desig-{i+1}",
            "title": title,
            "is_active": True,
            "created_at": "2024-01-01T00:00:00Z",
            "updated_at": "2026-03-01T00:00:00Z",
        }
        for i, title in enumerate(designations)
    ]
    return {"success": True, "data": data}


@router.get("/branches", summary="List branches")
async def list_branches(
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    branches = [
        {"id": "br-1", "name": "San Francisco Headquarters", "city": "San Francisco", "state": "CA", "is_head_office": True},
        {"id": "br-2", "name": "New York Tech Hub", "city": "New York", "state": "NY", "is_head_office": False},
        {"id": "br-3", "name": "Austin Innovation Center", "city": "Austin", "state": "TX", "is_head_office": False},
    ]
    return {"success": True, "data": branches}


@router.get("/managers", summary="List managers")
async def list_managers(
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    rows = (
        await db.execute(
            select(Employee).where(Employee.tenant_id == current.tenant_id, Employee.role.in_(["admin", "manager", "hr"]))
        )
    ).scalars().all()
    return {
        "success": True,
        "data": [
            {
                "id": e.id,
                "name": e.name,
                "email": e.email,
                "department": e.department,
                "designation": e.designation,
                "role": e.role,
                "avatar": e.avatar,
            }
            for e in rows
        ],
    }
