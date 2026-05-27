from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import users, categories, records
from app.core.database import engine, Base
from app.models.models import Category

Base.metadata.create_all(bind=engine)

app = FastAPI(title="购物管理系统 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def init_default_categories(db):
    existing = db.query(Category).first()
    if not existing:
        defaults = [
            Category(name="食品", emoji="🍞", sort_order=0, is_default=True),
            Category(name="服装", emoji="👕", sort_order=1, is_default=True),
            Category(name="数码", emoji="📱", sort_order=2, is_default=True),
            Category(name="日用", emoji="🏠", sort_order=3, is_default=True),
            Category(name="美妆", emoji="💄", sort_order=4, is_default=True),
            Category(name="娱乐", emoji="🎬", sort_order=5, is_default=True),
            Category(name="交通", emoji="🚗", sort_order=6, is_default=True),
            Category(name="教育", emoji="📚", sort_order=7, is_default=True),
            Category(name="医疗", emoji="🏥", sort_order=8, is_default=True),
            Category(name="其他", emoji="📦", sort_order=9, is_default=True),
        ]
        for cat in defaults:
            db.add(cat)
        db.commit()


@app.on_event("startup")
def startup():
    from app.core.database import SessionLocal
    db = SessionLocal()
    try:
        init_default_categories(db)
    finally:
        db.close()

app.include_router(users.router)
app.include_router(categories.router)
app.include_router(records.router)


@app.get("/")
def root():
    return {"message": "购物管理系统 API", "docs": "/docs"}