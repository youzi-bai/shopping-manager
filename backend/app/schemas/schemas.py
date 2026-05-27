from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    nickname: str = ""
    avatar_url: str = ""


class UserCreate(BaseModel):
    phone: str


class UserUpdate(BaseModel):
    nickname: Optional[str] = None
    avatar_url: Optional[str] = None


class UserResponse(UserBase):
    id: int
    phone: str
    created_at: datetime

    class Config:
        from_attributes = True


class SmsCodeSendRequest(BaseModel):
    phone: str = Field(..., min_length=11, max_length=20)


class SmsCodeLoginRequest(BaseModel):
    phone: str
    code: str = Field(..., min_length=6, max_length=6)


class LoginResponse(BaseModel):
    user: UserResponse
    token: str


class CategoryBase(BaseModel):
    name: str
    emoji: str = "🛒"


class CategoryCreate(CategoryBase):
    sort_order: int = 0
    is_default: bool = False


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    emoji: Optional[str] = None
    sort_order: Optional[int] = None


class CategoryResponse(CategoryBase):
    id: int
    sort_order: int
    is_default: bool

    class Config:
        from_attributes = True


class ProductRecordBase(BaseModel):
    name: str
    price: float
    quantity: int = 1
    store_name: Optional[str] = ""
    category_id: Optional[int] = None
    platform_id: Optional[str] = ""
    remark: Optional[str] = ""


class ProductRecordCreate(ProductRecordBase):
    user_id: int
    purchase_time: Optional[datetime] = None


class ProductRecordUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None
    store_name: Optional[str] = None
    category_id: Optional[int] = None
    platform_id: Optional[str] = None
    remark: Optional[str] = None


class ProductRecordResponse(ProductRecordBase):
    id: int
    purchase_time: datetime
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True