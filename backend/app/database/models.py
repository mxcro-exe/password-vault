from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    master_password_salt = Column(String, nullable=False)
    master_password_verifier = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    vault_items = relationship("VaultItem", back_populates="owner", cascade="all, delete-orphan")
    password_history = relationship("PasswordHistory", back_populates="owner", cascade="all, delete-orphan")


class VaultItem(Base):
    __tablename__ = "vault_items"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    url = Column(String, nullable=True)
    email = Column(String, nullable=True)
    username = Column(String, nullable=True)
    encrypted_password = Column(Text, nullable=False)
    category = Column(String, default="Others")
    notes = Column(Text, nullable=True)
    is_favorite = Column(Boolean, default=False)
    tags = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="vault_items")


class PasswordHistory(Base):
    __tablename__ = "password_history"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    label = Column(String, nullable=True)
    encrypted_password = Column(Text, nullable=False)
    strength_score = Column(Integer, default=0)
    strength_label = Column(String, default="Unknown")
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="password_history")
