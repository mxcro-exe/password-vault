from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import engine
from app.database import models
from app.routers import auth, vault, history

# ─── Create all DB tables ─────────────────────────────────────────────────────
models.Base.metadata.create_all(bind=engine)

# ─── App Setup ────────────────────────────────────────────────────────────────
app = FastAPI(
    title="SecurePass Pro API",
    description="Backend API for SecurePass Pro – End-to-end encrypted password manager",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev
        "http://localhost:3000",   # Alt dev
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(vault.router)
app.include_router(history.router)


# ─── Root Health Check ────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {
        "status": "online",
        "app": "SecurePass Pro API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
