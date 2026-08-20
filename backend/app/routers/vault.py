from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database.database import get_db
from app.database import models
from app.schemas.schemas import VaultItemCreate, VaultItemUpdate, VaultItemOut
from app.core.security import get_current_user

router = APIRouter(prefix="/vault", tags=["Vault"])


@router.get("/", response_model=List[VaultItemOut])
def get_vault(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all vault items for the authenticated user."""
    items = db.query(models.VaultItem).filter(
        models.VaultItem.owner_id == current_user.id
    ).order_by(models.VaultItem.updated_at.desc()).all()
    return items


@router.post("/", response_model=VaultItemOut, status_code=status.HTTP_201_CREATED)
def create_vault_item(
    payload: VaultItemCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new vault item."""
    item = models.VaultItem(
        owner_id=current_user.id,
        title=payload.title,
        url=payload.url or "",
        email=payload.email or "",
        username=payload.username or "",
        encrypted_password=payload.encrypted_password,
        category=payload.category or "Others",
        notes=payload.notes or "",
        is_favorite=payload.is_favorite or False,
        tags=payload.tags or ""
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{item_id}", response_model=VaultItemOut)
def update_vault_item(
    item_id: int,
    payload: VaultItemUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update an existing vault item."""
    item = db.query(models.VaultItem).filter(
        models.VaultItem.id == item_id,
        models.VaultItem.owner_id == current_user.id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Vault item not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)

    item.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vault_item(
    item_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a vault item."""
    item = db.query(models.VaultItem).filter(
        models.VaultItem.id == item_id,
        models.VaultItem.owner_id == current_user.id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Vault item not found")

    db.delete(item)
    db.commit()


@router.get("/favorites", response_model=List[VaultItemOut])
def get_favorites(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all favorite vault items."""
    items = db.query(models.VaultItem).filter(
        models.VaultItem.owner_id == current_user.id,
        models.VaultItem.is_favorite == True
    ).order_by(models.VaultItem.updated_at.desc()).all()
    return items


@router.get("/stats")
def get_vault_stats(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get vault statistics for the dashboard."""
    total = db.query(models.VaultItem).filter(
        models.VaultItem.owner_id == current_user.id
    ).count()

    favorites = db.query(models.VaultItem).filter(
        models.VaultItem.owner_id == current_user.id,
        models.VaultItem.is_favorite == True
    ).count()

    categories = db.query(
        models.VaultItem.category
    ).filter(
        models.VaultItem.owner_id == current_user.id
    ).distinct().all()

    return {
        "total_items": total,
        "favorites": favorites,
        "categories": [c[0] for c in categories],
        "categories_count": len(categories)
    }
