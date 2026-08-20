from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.database import models
from app.schemas.schemas import HistoryItemCreate, HistoryItemOut
from app.core.security import get_current_user

router = APIRouter(prefix="/history", tags=["Password History"])


@router.get("/", response_model=List[HistoryItemOut])
def get_history(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get password generation history for current user."""
    items = db.query(models.PasswordHistory).filter(
        models.PasswordHistory.owner_id == current_user.id
    ).order_by(models.PasswordHistory.created_at.desc()).limit(100).all()
    return items


@router.post("/", response_model=HistoryItemOut, status_code=status.HTTP_201_CREATED)
def add_history(
    payload: HistoryItemCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save a generated password to history."""
    item = models.PasswordHistory(
        owner_id=current_user.id,
        label=payload.label or "",
        encrypted_password=payload.encrypted_password,
        strength_score=payload.strength_score or 0,
        strength_label=payload.strength_label or "Unknown"
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_history_item(
    item_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a history entry."""
    item = db.query(models.PasswordHistory).filter(
        models.PasswordHistory.id == item_id,
        models.PasswordHistory.owner_id == current_user.id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="History item not found")

    db.delete(item)
    db.commit()


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
def clear_history(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Clear all password history for current user."""
    db.query(models.PasswordHistory).filter(
        models.PasswordHistory.owner_id == current_user.id
    ).delete()
    db.commit()
