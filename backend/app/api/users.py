from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random
import string
from app.core.database import get_db
from app.models.models import User, SmsCode
from app.schemas.schemas import UserCreate, UserUpdate, UserResponse, SmsCodeSendRequest, SmsCodeLoginRequest, LoginResponse

router = APIRouter(prefix="/users", tags=["users"])


def generate_token():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=32))


@router.post("/send-sms", response_model=dict)
def send_sms_code(req: SmsCodeSendRequest, db: Session = Depends(get_db)):
    code = ''.join(random.choices(string.digits, k=6))
    expires_at = datetime.now() + timedelta(minutes=5)
    sms = SmsCode(phone=req.phone, code=code, expires_at=expires_at)
    db.add(sms)
    db.commit()
    # 实际生产环境应接入短信网关，这里仅返回验证码
    return {"message": "验证码已发送", "code": code}


@router.post("/login", response_model=LoginResponse)
def login_by_sms(req: SmsCodeLoginRequest, db: Session = Depends(get_db)):
    sms = db.query(SmsCode).filter(
        SmsCode.phone == req.phone,
        SmsCode.code == req.code,
        SmsCode.is_used == False
    ).order_by(SmsCode.created_at.desc()).first()

    if not sms or sms.expires_at < datetime.now():
        raise HTTPException(status_code=400, detail="验证码无效或已过期")

    sms.is_used = True
    user = db.query(User).filter(User.phone == req.phone).first()
    if not user:
        user = User(phone=req.phone)
        db.add(user)
        db.commit()
        db.refresh(user)

    token = generate_token()
    return LoginResponse(user=user, token=token)


@router.post("/wx-login", response_model=LoginResponse)
def wx_login(code: str = Query(...), db: Session = Depends(get_db)):
    # 微信登录：code 换取 openid/session_key（需配合微信接口）
    # 此处简化处理，实际需调用微信接口
    phone = f"wx_{code[:8]}"
    user = db.query(User).filter(User.phone == phone).first()
    if not user:
        user = User(phone=phone, nickname="微信用户")
        db.add(user)
        db.commit()
        db.refresh(user)
    token = generate_token()
    return LoginResponse(user=user, token=token)


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    return user


@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="用户不存在")
    for key, value in user.model_dump(exclude_unset=True).items():
        setattr(db_user, key, value)
    db.commit()
    db.refresh(db_user)
    return db_user