from app.db.base import Base  # noqa: F401
from app.models.school import School  # noqa: F401
from app.models.user import User  # noqa: F401
from app.models.refresh_token import RefreshToken  # noqa: F401
from app.models.student import Student  # noqa: F401
from app.models.teacher import Teacher  # noqa: F401
from app.models.admission import Admission  # noqa: F401
from app.models.attendance import Attendance  # noqa: F401
from app.models.fee import Fee  # noqa: F401
from app.models.misc import (  # noqa: F401
    Notification,
    Document,
    FaceProfile,
    RecognitionLog,
    CCTVCamera,
    AuditLog,
)

__all__ = [
    "Base",
    "School",
    "User",
    "RefreshToken",
    "Student",
    "Teacher",
    "Admission",
    "Attendance",
    "Fee",
    "Notification",
    "Document",
    "FaceProfile",
    "RecognitionLog",
    "CCTVCamera",
    "AuditLog",
]
