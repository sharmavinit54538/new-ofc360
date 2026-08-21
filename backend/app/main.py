import logging

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.api.v1 import (
    admissions,
    ai_insights,
    attendance,
    auth,
    cctv,
    dashboard,
    documents,
    face,
    fees,
    notifications,
    parent,
    recognition,
    reports,
    students,
    teachers,
    users,
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("eduflow")

app = FastAPI(
    title=settings.APP_NAME,
    description="EduFlow AI production backend — school management, attendance, face recognition, fees, and reporting.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    detail = exc.detail
    if isinstance(detail, dict) and "error" in detail:
        return JSONResponse(status_code=exc.status_code, content=detail)
    return JSONResponse(status_code=exc.status_code, content={"success": False, "error": {"code": "ERROR", "message": str(detail)}})


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"success": False, "error": {"code": "VALIDATION_ERROR", "message": "Invalid request data", "details": exc.errors()}},
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)
    return JSONResponse(status_code=500, content={"success": False, "error": {"code": "INTERNAL_ERROR", "message": "Something went wrong. Please try again."}})


API_PREFIX = "/api/v1"
for router in (auth.router, dashboard.router, students.router, teachers.router, admissions.router,
               attendance.router, face.router, recognition.router, cctv.router, fees.router,
               reports.router, notifications.router, users.router, parent.router, documents.router,
               ai_insights.router):
    app.include_router(router, prefix=API_PREFIX)


@app.get("/", tags=["Health"])
async def root():
    return {"app": settings.APP_NAME, "status": "ok"}


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok"}


@app.on_event("startup")
async def on_startup():
    logger.info("%s starting up (env=%s)", settings.APP_NAME, settings.ENVIRONMENT)


@app.on_event("shutdown")
async def on_shutdown():
    logger.info("%s shutting down", settings.APP_NAME)
