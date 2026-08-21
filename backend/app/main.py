import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.db.base import Base
from app.db.seed_data import seed_database
from app.db.session import AsyncSessionLocal, engine

from app.api.v1 import (
    ai_chat,
    ai_insights,
    attendance,
    auth,
    company,
    dashboard,
    documents,
    engagement,
    exit_management,
    employees,
    leaves,
    notifications,
    payroll,
    performance,
    recruitment,
    users,
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("ofc360")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up %s (env=%s)", settings.APP_NAME, settings.ENVIRONMENT)
    # Create all database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables initialized successfully.")

    # Seed initial data
    async with AsyncSessionLocal() as session:
        await seed_database(session)
    logger.info("Initial data check and seeding completed.")

    yield
    logger.info("Shutting down %s", settings.APP_NAME)


app = FastAPI(
    title="OFC360 – AI-Powered Workforce & HR Management Platform",
    description="Production-ready FastAPI backend for OFC360 enterprise workforce, payroll, ATS, attendance, and AI copilot.",
    version="2.0.0",
    lifespan=lifespan,
)

# Enable CORS for all allowed origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    detail = exc.detail
    if isinstance(detail, dict) and "error" in detail:
        return JSONResponse(status_code=exc.status_code, content=detail)
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "error": {"code": "ERROR", "message": str(detail)}},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": {"code": "VALIDATION_ERROR", "message": "Invalid request data", "details": exc.errors()},
        },
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error on %s %s: %s", request.method, request.url.path, str(exc))
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": {"code": "INTERNAL_ERROR", "message": "An internal server error occurred"}},
    )


API_PREFIX = "/api/v1"

for router in (
    auth.router,
    employees.router,
    attendance.router,
    leaves.router,
    payroll.router,
    recruitment.router,
    documents.router,
    performance.router,
    exit_management.router,
    engagement.router,
    ai_chat.router,
    company.router,
    dashboard.router,
    notifications.router,
    users.router,
    ai_insights.router,
):
    app.include_router(router, prefix=API_PREFIX)


@app.get("/", tags=["Health"])
async def root():
    return {"app": "OFC360 Enterprise API", "status": "ok", "version": "2.0.0"}


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "database": "connected"}
