import uuid
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return pwd_context.verify(password, password_hash)
    except Exception:
        return False


def _base_claims(user) -> dict:
    tenant_id = str(user.tenant_id)
    return {
        "sub": str(user.id),
        "user_id": str(user.id),
        "tenant_id": tenant_id,
        "school_id": str(user.school_id) if getattr(user, "school_id", None) else tenant_id,
        "company_id": tenant_id,
        "school_name": user.school.school_name if getattr(user, "school", None) else "",
        "school_code": user.school.school_code if getattr(user, "school", None) else "",
        "role": user.role,
        "permissions": user.permissions_list(),
    }


def create_access_token(user) -> tuple[str, int]:
    now = datetime.now(timezone.utc)
    exp = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        **_base_claims(user),
        "type": "access",
        "jti": str(uuid.uuid4()),
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
    }
    if settings.JWT_ISSUER:
        payload["iss"] = settings.JWT_ISSUER
    if settings.JWT_AUDIENCE:
        payload["aud"] = settings.JWT_AUDIENCE
    token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return token, int(exp.timestamp() * 1000)


def create_refresh_token(user, jti: str | None = None) -> tuple[str, int, str]:
    now = datetime.now(timezone.utc)
    exp = now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    jti = jti or str(uuid.uuid4())
    payload = {
        **_base_claims(user),
        "type": "refresh",
        "jti": jti,
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
    }
    if settings.JWT_ISSUER:
        payload["iss"] = settings.JWT_ISSUER
    if settings.JWT_AUDIENCE:
        payload["aud"] = settings.JWT_AUDIENCE
    token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return token, int(exp.timestamp() * 1000), jti


def decode_token(token: str) -> dict | None:
    try:
        kwargs: dict = {"algorithms": [settings.JWT_ALGORITHM]}
        if settings.JWT_ISSUER:
            kwargs["issuer"] = settings.JWT_ISSUER
        if settings.JWT_AUDIENCE:
            kwargs["audience"] = settings.JWT_AUDIENCE
        return jwt.decode(token, settings.JWT_SECRET_KEY, **kwargs)
    except JWTError:
        return None
