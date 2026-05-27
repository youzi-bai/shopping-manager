from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from typing import Optional
from app.core.database import get_db
from app.models.models import ProductRecord
from app.schemas.schemas import ProductRecordCreate, ProductRecordUpdate, ProductRecordResponse

router = APIRouter(prefix="/records", tags=["records"])


@router.post("/", response_model=ProductRecordResponse)
def create_record(record: ProductRecordCreate, db: Session = Depends(get_db)):
    data = record.model_dump()
    if data.get("purchase_time") is None:
        data["purchase_time"] = datetime.now()
    new_record = ProductRecord(**data)
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record


@router.get("/", response_model=list[ProductRecordResponse])
def list_records(
    user_id: Optional[int] = None,
    category_id: Optional[int] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(ProductRecord)
    if user_id:
        query = query.filter(ProductRecord.user_id == user_id)
    if category_id:
        query = query.filter(ProductRecord.category_id == category_id)
    if start_date:
        query = query.filter(ProductRecord.purchase_time >= start_date)
    if end_date:
        query = query.filter(ProductRecord.purchase_time <= end_date)
    records = query.order_by(ProductRecord.purchase_time.desc()).offset(skip).limit(limit).all()
    return records


@router.get("/{record_id}", response_model=ProductRecordResponse)
def get_record(record_id: int, db: Session = Depends(get_db)):
    record = db.query(ProductRecord).filter(ProductRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="记录不存在")
    return record


@router.put("/{record_id}", response_model=ProductRecordResponse)
def update_record(record_id: int, record: ProductRecordUpdate, db: Session = Depends(get_db)):
    db_record = db.query(ProductRecord).filter(ProductRecord.id == record_id).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="记录不存在")
    for key, value in record.model_dump(exclude_unset=True).items():
        setattr(db_record, key, value)
    db.commit()
    db.refresh(db_record)
    return db_record


@router.delete("/{record_id}")
def delete_record(record_id: int, db: Session = Depends(get_db)):
    record = db.query(ProductRecord).filter(ProductRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="记录不存在")
    db.delete(record)
    db.commit()
    return {"message": "记录已删除"}


@router.get("/stats/monthly")
def get_monthly_stats(
    year: int = Query(default=2026),
    month: int = Query(default=5),
    user_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    from calendar import monthrange
    _, last_day = monthrange(year, month)
    start_date = datetime(year, month, 1)
    end_date = datetime(year, month, last_day, 23, 59, 59)

    query = db.query(ProductRecord).filter(
        ProductRecord.purchase_time >= start_date,
        ProductRecord.purchase_time <= end_date
    )
    if user_id:
        query = query.filter(ProductRecord.user_id == user_id)

    records = query.all()
    total = sum(r.price * r.quantity for r in records)

    by_category = {}
    for r in records:
        cat_id = r.category_id or 0
        if cat_id not in by_category:
            by_category[cat_id] = 0
        by_category[cat_id] += r.price * r.quantity

    return {
        "year": year,
        "month": month,
        "total": total,
        "count": len(records),
        "by_category": by_category
    }