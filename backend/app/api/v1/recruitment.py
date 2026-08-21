import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependencies import CurrentUser, get_current_user
from app.db.session import get_db
from app.models.hr import Candidate, JobPosting

router = APIRouter(prefix="/recruitment", tags=["Recruitment"])
logger = logging.getLogger("ofc360.recruitment")


def _job_dict(j: JobPosting) -> dict:
    return {
        "id": j.id,
        "title": j.title,
        "slug": j.slug,
        "department": j.department,
        "designation": j.designation or j.title,
        "location": j.location,
        "employment_type": j.employment_type,
        "min_experience": j.min_experience,
        "max_experience": j.max_experience,
        "min_salary": j.min_salary,
        "max_salary": j.max_salary,
        "vacancies": j.vacancies,
        "job_description": j.job_description,
        "requirements": j.requirements,
        "responsibilities": j.responsibilities,
        "benefits": j.benefits,
        "status": j.status,
        "created_at": j.created_at.isoformat() if j.created_at else "",
    }


def _candidate_dict(c: Candidate) -> dict:
    return {
        "id": c.id,
        "job_id": c.job_id,
        "name": c.name,
        "email": c.email,
        "phone": c.phone or "",
        "job_title": c.job_title,
        "stage": c.stage,
        "ats_score": c.ats_score,
        "experience_years": c.experience_years,
        "skills": c.skills or "",
        "resume_url": c.resume_url or "",
        "ai_summary": c.ai_summary or "",
        "source": c.source or "Direct Application",
        "created_at": c.created_at.isoformat() if c.created_at else "",
    }


@router.get("/jobs", summary="List job postings")
async def list_jobs(
    status: Optional[str] = None,
    department: Optional[str] = None,
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    q = select(JobPosting).where(JobPosting.tenant_id == current.tenant_id)
    if status and status != "ALL":
        q = q.where(func.lower(JobPosting.status) == status.lower())
    if department and department != "ALL":
        q = q.where(func.lower(JobPosting.department) == department.lower())

    rows = (await db.execute(q.order_by(JobPosting.created_at.desc()))).scalars().all()
    return {
        "items": [_job_dict(j) for j in rows],
        "total": len(rows),
        "page": 1,
        "limit": 100,
        "pages": 1,
    }


@router.get("/jobs/{id}", summary="Get job details")
async def get_job_by_id(
    id: str,
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    j = await db.get(JobPosting, id)
    if not j or j.tenant_id != current.tenant_id:
        raise HTTPException(status_code=404, detail="Job posting not found")
    return _job_dict(j)


@router.post("/jobs", status_code=status.HTTP_201_CREATED, summary="Create job posting")
async def create_job(
    payload: dict,
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    title = payload.get("title", "New Position")
    slug = title.lower().replace(" ", "-").replace("/", "-")

    job = JobPosting(
        tenant_id=current.tenant_id,
        title=title,
        slug=slug,
        department=payload.get("department", "Engineering"),
        designation=payload.get("designation", title),
        location=payload.get("location", "Remote"),
        employment_type=payload.get("employment_type", "Full-Time"),
        min_experience=int(payload.get("min_experience", 2)),
        max_experience=int(payload.get("max_experience", 5)) if payload.get("max_experience") else None,
        min_salary=float(payload.get("min_salary", 80000)) if payload.get("min_salary") else None,
        max_salary=float(payload.get("max_salary", 120000)) if payload.get("max_salary") else None,
        vacancies=int(payload.get("vacancies", 1)),
        job_description=payload.get("job_description", ""),
        requirements=payload.get("requirements", ""),
        status="Active",
    )
    db.add(job)
    await db.commit()
    await db.refresh(job)
    return _job_dict(job)


@router.patch("/jobs/{id}", summary="Update job posting")
async def update_job(
    id: str,
    payload: dict,
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    job = await db.get(JobPosting, id)
    if not job or job.tenant_id != current.tenant_id:
        raise HTTPException(status_code=404, detail="Job posting not found")

    for k, v in payload.items():
        if hasattr(job, k) and v is not None:
            setattr(job, k, v)

    await db.commit()
    await db.refresh(job)
    return _job_dict(job)


@router.delete("/jobs/{id}", summary="Delete job posting")
async def delete_job(
    id: str,
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    job = await db.get(JobPosting, id)
    if job and job.tenant_id == current.tenant_id:
        await db.delete(job)
        await db.commit()
    return {"success": True}


@router.get("/candidates", summary="List candidates")
async def list_candidates(
    job_id: Optional[str] = None,
    stage: Optional[str] = None,
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    q = select(Candidate).where(Candidate.tenant_id == current.tenant_id)
    if job_id:
        q = q.where(Candidate.job_id == job_id)
    if stage and stage != "ALL":
        q = q.where(func.lower(Candidate.stage) == stage.lower())

    rows = (await db.execute(q.order_by(Candidate.ats_score.desc()))).scalars().all()
    return {
        "items": [_candidate_dict(c) for c in rows],
        "total": len(rows),
    }


@router.get("/candidates/{id}", summary="Get candidate details")
async def get_candidate_by_id(
    id: str,
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    c = await db.get(Candidate, id)
    if not c or c.tenant_id != current.tenant_id:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return _candidate_dict(c)


@router.post("/candidates", status_code=status.HTTP_201_CREATED, summary="Create/Apply candidate")
async def create_candidate(
    payload: dict,
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    c = Candidate(
        tenant_id=current.tenant_id,
        job_id=payload.get("job_id"),
        name=payload.get("name", "Applicant"),
        email=payload.get("email", "applicant@example.com"),
        phone=payload.get("phone", ""),
        job_title=payload.get("job_title", "Candidate"),
        stage=payload.get("stage", "Applied"),
        ats_score=float(payload.get("ats_score", 85.0)),
        experience_years=float(payload.get("experience_years", 3.0)),
        skills=payload.get("skills", ""),
        ai_summary=payload.get("ai_summary", "Candidate resume evaluated with matching domain competencies."),
        source=payload.get("source", "Careers Portal"),
    )
    db.add(c)
    await db.commit()
    await db.refresh(c)
    return _candidate_dict(c)


@router.patch("/candidates/{id}", summary="Update candidate stage")
async def update_candidate(
    id: str,
    payload: dict,
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    c = await db.get(Candidate, id)
    if not c or c.tenant_id != current.tenant_id:
        raise HTTPException(status_code=404, detail="Candidate not found")

    for k, v in payload.items():
        if hasattr(c, k) and v is not None:
            setattr(c, k, v)

    await db.commit()
    await db.refresh(c)
    return _candidate_dict(c)


@router.post("/rank-candidates", summary="AI Rank Candidates for Job")
async def rank_candidates(
    payload: dict,
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    rows = (await db.execute(select(Candidate).where(Candidate.tenant_id == current.tenant_id))).scalars().all()
    ranked = sorted(rows, key=lambda x: x.ats_score, reverse=True)
    return {
        "success": True,
        "ranked_candidates": [_candidate_dict(c) for c in ranked],
        "total_analyzed": len(ranked),
    }


@router.get("/top-ranked", summary="Get top ranked candidates")
async def top_ranked_candidates(
    limit: int = 10,
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    rows = (
        await db.execute(
            select(Candidate).where(Candidate.tenant_id == current.tenant_id).order_by(Candidate.ats_score.desc()).limit(limit)
        )
    ).scalars().all()
    return [_candidate_dict(c) for c in rows]


@router.get("/pipeline", summary="Get recruitment pipeline counts")
async def get_pipeline_counts(
    current: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    rows = (await db.execute(select(Candidate).where(Candidate.tenant_id == current.tenant_id))).scalars().all()
    counts = {
        "Applied": sum(1 for c in rows if c.stage == "Applied"),
        "Screening": sum(1 for c in rows if c.stage == "Screening"),
        "Interview": sum(1 for c in rows if c.stage == "Interview"),
        "Offered": sum(1 for c in rows if c.stage == "Offered"),
        "Hired": sum(1 for c in rows if c.stage == "Hired"),
        "Rejected": sum(1 for c in rows if c.stage == "Rejected"),
    }
    return {"stages": counts, "total": len(rows)}
