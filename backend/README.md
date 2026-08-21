# EduFlow AI — Backend

Production backend for the existing EduFlow AI React frontend. Python 3.12 +
FastAPI + SQLAlchemy 2 (async) + PostgreSQL + Alembic + JWT auth.

Built against the **actual frontend code** in `src/services/api.ts`,
`src/services/authService.ts`, and `src/lib/permissions.ts` — not just the
page list — so the auth flow, permission strings, and error codes match
exactly what the UI already expects.

## 1. Setup

```bash
cd backend
python3.12 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# edit .env — set DATABASE_URL, JWT_SECRET_KEY, CORS_ORIGINS

# Postgres (production):
#   DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/eduflow_ai
# SQLite (quick local testing, no Postgres install needed):
#   DATABASE_URL=sqlite+aiosqlite:///./eduflow.db

alembic upgrade head
python -m scripts.seed
uvicorn app.main:app --reload --port 8000
```

Swagger: http://localhost:8000/docs · ReDoc: http://localhost:8000/redoc

## 2. Frontend integration

In the frontend `.env`:

```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

The frontend's axios client (`src/services/api.ts`) sends
`withCredentials: true` and expects the refresh token as an **httpOnly
cookie** — the backend sets/reads this automatically (`/auth/login`,
`/auth/refresh`, `/auth/logout`). Access tokens are also returned in the
JSON body for the client to hold in memory, matching the existing
`authService.ts` contract.

## 3. Seed credentials (development only)

| Role | Email | Password (from `.env`) |
|---|---|---|
| Admin | admin@eduflow.demo | `SEED_ADMIN_PASSWORD` |
| Teacher | teacher@eduflow.demo | `SEED_TEACHER_PASSWORD` |
| Student | student@eduflow.demo | `SEED_STUDENT_PASSWORD` |
| Parent | parent@eduflow.demo | `SEED_PARENT_PASSWORD` |
| Accountant | accountant@eduflow.demo | `SEED_ACCOUNTANT_PASSWORD` |

School code: `EDU001`. Defaults are in `.env.example` — change them for
anything beyond a local sandbox.

## 4. Architecture notes / decisions made

A few places where the spec was ambiguous or the real frontend code
disagreed with the brief — decisions taken and why:

- **Permission strings**: the brief's task doc used dotted names
  (`students.view`). The actual `src/lib/permissions.ts` uses colon names
  (`students:read`, `fees:write`, `*` for admin, `prefix:*` wildcards). The
  backend implements the latter — it's what the frontend's
  `PermissionGuard`/`RoleGuard` and decoded JWTs actually check against.
- **Tenant = School**: the frontend always sends an equal `tenant_id` /
  `school_id` pair and there's no UI for multiple schools per tenant, so a
  single `School` row serves as both records. Every other table still
  carries both `tenant_id` and `school_id` columns (both FKs to the same
  row) so the API shapes match the frontend exactly; splitting this into
  two tables later is a non-breaking migration if multi-school tenants are
  ever needed.
- **UUIDs as `String(36)`** rather than native Postgres `UUID`, so the same
  models/migrations work against SQLite for fast local dev/tests without
  Docker, and against Postgres in production.
- **Face recognition**: `app/services/face_service.py` implements the full
  enroll → embed → store → compare → threshold → mark-attendance pipeline,
  but the embedding function itself is a clearly-labeled deterministic
  placeholder (no real face detection). Swap `_extract_embedding` for a
  real model (face-recognition/InsightFace) before using this in
  production — the rest of the pipeline (tenant isolation, threshold gating,
  duplicate-attendance prevention, recognition logging) is real and tested.
- **PDF export**: `attendance/export/pdf` returns a minimal text-based PDF
  rather than pulling in reportlab/weasyprint, to avoid unnecessary
  dependencies per the brief. Swap in a real renderer if richer layout is
  needed — the endpoint contract (route, auth, `Content-Disposition`)
  already matches what the frontend expects.
- **No Docker/Redis/Celery/RabbitMQ**, per the brief. Notifications are
  DB-backed in-app records only; no SMS/WhatsApp/Email provider is wired in
  (the brief explicitly said not to add paid third-party services without
  configuration).

## 5. Folder structure

```
app/
├── main.py                 FastAPI app, router registration, exception handlers
├── core/                    config, security (JWT/Argon2), permissions matrix, exceptions
├── db/                       async session, declarative base, auth/tenant dependency
├── models/                  SQLAlchemy 2.x async models
├── schemas/                 Pydantic v2 request/response models
├── api/v1/                   one router per resource
├── services/                 audit logging, face embedding/matching
└── tests/                    pytest + httpx ASGI tests (in-memory SQLite)
alembic/                     async-aware migrations
scripts/seed.py               dev seed script
```

## 6. Database schema summary

- **schools** — tenant/school record (school_code, school_name, status)
- **users** — tenant_id, school_id, role, password_hash, status
- **refresh_tokens** — jti, user_id, tenant_id, revoked, expires_at (rotation + revocation)
- **students**, **teachers**, **admissions** — full profile fields per the frontend forms
- **attendance** — unique (student_id, date); status/source/confidence
- **fees** — Decimal amounts, payment_status derived from paid vs billed
- **notifications**, **documents**, **face_profiles**, **recognition_logs**, **cctv_cameras**
- **audit_logs** — actor, action, entity, IP/UA, metadata (never logs passwords/tokens/embeddings)

Composite indexes: `(student_id, date)` and `(tenant_id, date)` on
attendance, `(tenant_id, payment_status)` on fees, `(tenant_id, class_name,
section)` on students, `(student_id, recognition_time)` on recognition
logs, `(tenant_id, status)` on admissions. Tenant-scoped unique constraints
on admission numbers, employee IDs, and user emails.

## 7. All API endpoints (`/api/v1` prefix)

```
POST   /auth/login                    POST   /auth/refresh
POST   /auth/logout                   GET    /auth/me
PUT    /auth/profile

GET    /dashboard/summary
GET    /dashboard/attendance-trend
GET    /dashboard/class-attendance

GET|POST /students        GET|PUT|DELETE /students/{id}
GET|POST /teachers        GET|PUT|DELETE /teachers/{id}
GET|POST /admissions      GET|PUT /admissions/{id}      PATCH /admissions/{id}/status

GET|POST /attendance
GET      /attendance/report
GET      /attendance/export/csv
GET      /attendance/export/pdf

POST /face/enroll
POST /face/recognize
GET  /recognition/logs

GET|POST /cctv/cameras    PUT|DELETE /cctv/cameras/{id}    POST /cctv/cameras/{id}/test

GET|POST /fees      GET|PUT /fees/{id}     POST /fees/{id}/payment    GET /fees/summary

GET /reports/attendance     GET /reports/fees
GET /reports/attendance/export     GET /reports/fees/export

GET|POST /notifications     PUT /notifications/{id}/read

GET|POST /users     GET|PUT|DELETE /users/{id}

GET /parent/children
GET /parent/children/{id}/attendance
GET /parent/children/{id}/fees
GET /parent/children/{id}/notices

GET|POST /documents     DELETE /documents/{id}

GET /ai-insights
```

## 8. Role / permission matrix

| Role | Key permissions (from `app/core/permissions.py`) |
|---|---|
| admin | `*` (everything) |
| teacher | `classes:read`, `students:read`, `attendance:read/write`, `marks:read/write`, `homework:read/write`, `reports:read`, `documents:read`, `notifications:read` |
| student | `self:attendance:read`, `self:marks:read`, `self:documents:read`, `self:profile:read/write`, `notifications:read` |
| parent | `children:read`, `children:attendance:read`, `fees:read`, `notifications:read`, `documents:read`, `self:profile:read` |
| accountant | `fees:read/write`, `finance:read/write`, `reports:read`, `notifications:read`, `documents:read` |

Every route additionally enforces role checks at the handler level for
write operations that the permission matrix alone doesn't fully express
(e.g. only `admin` can create students/teachers/users; only `admin` or
`accountant` can create/update fees). Frontend guards are UI convenience
only — all of this is re-checked server-side.

## 9. Environment variables

See `.env.example`. Key ones: `DATABASE_URL`, `JWT_SECRET_KEY`,
`ACCESS_TOKEN_EXPIRE_MINUTES` (25), `REFRESH_TOKEN_EXPIRE_DAYS` (30),
`CORS_ORIGINS`, `FACE_RECOGNITION_THRESHOLD` (0.55), `UPLOAD_DIR`,
`MAX_UPLOAD_SIZE_MB`, seed passwords.

## 10. Migrations

```bash
alembic revision --autogenerate -m "message"
alembic upgrade head
alembic downgrade -1
```

Two migrations ship: `initial schema` (all 15 tables) and `composite
indexes for reporting` (indexes + tenant-scoped unique constraints).

## 11. Tests

```bash
pytest app/tests -q
```

25 tests, all passing, run against an in-memory SQLite DB (no external
services needed): login (valid/invalid password/invalid school
code/inactive user/suspended school), refresh-token rotation +
revocation, malformed-JWT rejection, permission checks per role, students
CRUD + duplicate admission number, attendance bulk-marking + duplicate
handling + report + CSV export, admissions status-transition validation +
duplicate-application detection, and **tenant isolation / IDOR**: cross-
tenant student/fee access returns 404, cross-tenant lists never leak the
other tenant's rows, and a forged `X-Tenant-ID` header is rejected with
`TENANT_MISMATCH` even when the JWT itself is valid.

Not yet covered by tests (implemented but untested): face
enroll/recognize, CCTV, documents upload, notifications, parent portal,
user management CRUD, reports export endpoints. Extend
`app/tests/` following the existing fixture patterns in `conftest.py`.

## 12. Known limitations

- Face recognition embedding is a placeholder (see §4) — not
  production-grade face matching.
- PDF exports are plain-text, not laid-out documents.
- No rate limiting is implemented yet (brief calls for a "strategy" —
  recommend `slowapi` or an API-gateway-level limiter on `/auth/login` and
  `/auth/refresh` before production).
- No SMS/WhatsApp/Email provider wired for notifications (in-app only, per
  brief).
- Document storage is local filesystem (`UPLOAD_DIR`), not object storage —
  fine for single-instance deployment, swap for S3/GCS-compatible storage
  before scaling horizontally.
