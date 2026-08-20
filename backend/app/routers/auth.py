from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database import models
from app.schemas.schemas import (
    UserRegister, UserLogin, Token, SaltResponse, VerifyVerifierRequest
)
from app.core.security import (
    hash_password, verify_password, create_access_token, get_current_user
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/salt", response_model=SaltResponse)
def get_salt(email: str, db: Session = Depends(get_db)):
    """
    Returns the master password salt for a given email.
    Frontend uses this to derive encryption key before login.
    """
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"salt": user.master_password_salt}


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new user.
    password = auth verifier (hex) derived from master password.
    """
    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = models.User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        master_password_salt=payload.master_password_salt,
        master_password_verifier=payload.master_password_verifier
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully", "email": new_user.email}


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    """
    Login with email and auth verifier.
    Returns a JWT access token.
    """
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/verify-verifier")
def verify_verifier(
    payload: VerifyVerifierRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Verifies master password verifier for locked vault operations.
    """
    if verify_password(payload.verifier, current_user.hashed_password):
        return {"valid": True}
    raise HTTPException(status_code=401, detail="Invalid verifier")


@router.get("/me")
def get_me(current_user: models.User = Depends(get_current_user)):
    """Get current authenticated user info."""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "created_at": current_user.created_at
    }
