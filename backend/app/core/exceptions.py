from fastapi import HTTPException, status


class AppError(HTTPException):
    def __init__(self, status_code: int, code: str, message: str):
        super().__init__(status_code=status_code, detail={"success": False, "error": {"code": code, "message": message}})


def invalid_credentials():
    return AppError(status.HTTP_401_UNAUTHORIZED, "INVALID_CREDENTIALS", "Invalid email or password")


def school_not_found():
    return AppError(status.HTTP_404_NOT_FOUND, "SCHOOL_NOT_FOUND", "School code not found")


def school_suspended():
    return AppError(status.HTTP_403_FORBIDDEN, "SCHOOL_SUSPENDED", "This school is suspended. Contact support.")


def user_inactive():
    return AppError(status.HTTP_403_FORBIDDEN, "USER_INACTIVE", "Your account is deactivated. Contact your school admin.")


def tenant_mismatch():
    return AppError(status.HTTP_403_FORBIDDEN, "TENANT_MISMATCH", "Tenant mismatch detected.")


def permission_denied():
    return AppError(status.HTTP_403_FORBIDDEN, "PERMISSION_DENIED", "You don't have permission to do that.")


def invalid_token():
    return AppError(status.HTTP_401_UNAUTHORIZED, "INVALID_TOKEN", "Invalid or expired token")


def not_found(entity: str = "Resource"):
    return AppError(status.HTTP_404_NOT_FOUND, "NOT_FOUND", f"{entity} not found")


def conflict(message: str, code: str = "CONFLICT"):
    return AppError(status.HTTP_409_CONFLICT, code, message)


def validation_error(message: str):
    return AppError(status.HTTP_400_BAD_REQUEST, "VALIDATION_ERROR", message)
