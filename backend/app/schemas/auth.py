from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    school_code: str
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str | None = None
    refreshToken: str | None = None


class ProfileUpdateRequest(BaseModel):
    name: str | None = None
    avatar: str | None = None
    password: str | None = None


class TenantOut(BaseModel):
    tenant_id: str
    school_id: str
    school_code: str
    school_name: str
    status: str

    class Config:
        from_attributes = True


class SessionUserOut(BaseModel):
    id: str
    name: str
    email: str
    role: str
    avatar: str | None = None
    status: str
    tenant_id: str
    school_id: str
    school_code: str
    school_name: str
    permissions: list[str]


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    access_expires_at: int
    refresh_expires_at: int
    user: SessionUserOut
    tenant: TenantOut


class TokenPairOut(BaseModel):
    access_token: str
    refresh_token: str
    access_expires_at: int
    refresh_expires_at: int
