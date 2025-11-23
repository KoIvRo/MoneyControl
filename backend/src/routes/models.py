from pydantic import BaseModel, EmailStr


class UserRegistration(BaseModel):
    email: EmailStr
    password: str
    name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str