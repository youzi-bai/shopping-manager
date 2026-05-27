from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from datetime import datetime
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nickname = Column(String(50), default="")
    avatar_url = Column(String(255), default="")
    phone = Column(String(20), unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.now)


class SmsCode(Base):
    __tablename__ = "sms_codes"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String(20), index=True, nullable=False)
    code = Column(String(6), nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    emoji = Column(String(10), default="🛒")
    sort_order = Column(Integer, default=0)
    is_default = Column(Boolean, default=False)


class ProductRecord(Base):
    __tablename__ = "product_records"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, default=1)
    purchase_time = Column(DateTime, default=datetime.now)
    store_name = Column(String(100), default="")
    category_id = Column(Integer, index=True)
    platform_id = Column(String(50), default="")
    remark = Column(String(500), default="")
    user_id = Column(Integer, index=True)
    created_at = Column(DateTime, default=datetime.now)