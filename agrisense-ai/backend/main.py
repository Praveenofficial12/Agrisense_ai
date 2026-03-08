from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from contextlib import asynccontextmanager
from datetime import timedelta, datetime
import secrets
import uvicorn

from auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user
)

from database import users_collection, reset_tokens_collection
from models import UserCreate, PasswordResetRequest, PasswordResetConfirm
from email_service import send_email, build_reset_email, FRONTEND_URL
from routers import websockets, ai_endpoints, farms


# ============================================================
# Lifespan (Replaces deprecated @app.on_event)
# ============================================================

@asynccontextmanager
async def lifespan(app: FastAPI):

    print("🚀 Starting AgriSense AI Backend...")

    try:
        # Seed default farmer user
        farmer = await users_collection.find_one({"username": "farmer"})
        if not farmer:
            await users_collection.insert_one({
                "username": "farmer",
                "email": "farmer@agrisense.ai",
                "role": "Farmer",
                "hashed_password": get_password_hash("farmer123"),
                "createdAt": datetime.utcnow().isoformat(),
            })
            print("✅ Default farmer user created")
    except Exception as e:
        print("❌ Startup DB Error:", e)

    yield

    print("🛑 Shutting down AgriSense AI Backend...")


# ============================================================
# App Initialization
# ============================================================

app = FastAPI(
    title="AgriSense AI Backend",
    description="Full-stack AgriTech SaaS — Crop Monitoring, AI, WebSockets",
    version="2.1.1",
    lifespan=lifespan
)


# ============================================================
# CORS Configuration
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ Change to frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Include Routers
# ============================================================

app.include_router(websockets.router)
app.include_router(ai_endpoints.router, prefix="/ai", tags=["AI"])
app.include_router(farms.router, prefix="/farms", tags=["Farms"])


# ============================================================
# Health Routes
# ============================================================

@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "ok",
        "message": "AgriSense AI Backend 🌿",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy"}


# ============================================================
# Register
# ============================================================

@app.post("/register", status_code=201, tags=["Auth"])
async def register(user: UserCreate):

    if await users_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already taken")

    if await users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user.password)

    user_data = {
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "hashed_password": hashed_password,
        "createdAt": datetime.utcnow().isoformat()
    }

    await users_collection.insert_one(user_data)

    return {
        "message": "Registered successfully",
        "username": user.username
    }


# ============================================================
# Login (JWT)
# ============================================================

@app.post("/login", tags=["Auth"])
async def login(form_data: OAuth2PasswordRequestForm = Depends()):

    user = await users_collection.find_one({"username": form_data.username})

    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    access_token = create_access_token(
        data={"sub": user["username"], "role": user["role"], "id": str(user["_id"])},
        expires_delta=timedelta(days=7)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user["role"],
        "username": user["username"]
    }


# ============================================================
# Get Current Logged User
# ============================================================

@app.get("/me", tags=["Auth"])
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

@app.get("/auth/verify", tags=["Auth"])
async def verify_token(current_user: dict = Depends(get_current_user)):
    """Simple endpoint to verify if the token is still valid."""
    return {"valid": True, "user": current_user}


# ============================================================
# Forgot Password
# ============================================================

@app.post("/auth/forgot-password", tags=["Auth"])
async def forgot_password(req: PasswordResetRequest):

    user = await users_collection.find_one({"email": req.email})

    # Always return generic message for security
    if not user:
        return {"message": "If that email is registered, a reset link has been sent."}

    token = secrets.token_urlsafe(48)
    expires_at = (datetime.utcnow() + timedelta(minutes=30)).isoformat()

    await reset_tokens_collection.delete_many({"email": req.email})

    await reset_tokens_collection.insert_one({
        "token": token,
        "username": user["username"],
        "email": req.email,
        "expires_at": expires_at
    })

    reset_url = f"{FRONTEND_URL}/reset-password?token={token}"

    html_content = build_reset_email(user["username"], reset_url)
    send_email(req.email, "Reset Your AgriSense AI Password", html_content)

    print(f"\n🔑 RESET LINK → {reset_url}\n")

    return {"message": "If that email is registered, a reset link has been sent."}


# ============================================================
# Reset Password
# ============================================================

@app.post("/auth/reset-password", tags=["Auth"])
async def reset_password(req: PasswordResetConfirm):

    record = await reset_tokens_collection.find_one({"token": req.token})

    if not record:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token.")

    if datetime.utcnow() > datetime.fromisoformat(record["expires_at"]):
        await reset_tokens_collection.delete_one({"token": req.token})
        raise HTTPException(status_code=400, detail="Token has expired.")

    if len(req.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters.")

    new_hash = get_password_hash(req.new_password)

    await users_collection.update_one(
        {"username": record["username"]},
        {"$set": {"hashed_password": new_hash}}
    )

    await reset_tokens_collection.delete_one({"token": req.token})

    return {"message": "Password reset successfully."}


# ============================================================
# Validate Reset Token
# ============================================================

@app.get("/auth/validate-reset-token", tags=["Auth"])
async def validate_reset_token(token: str):

    record = await reset_tokens_collection.find_one({"token": token})

    if not record:
        return {"valid": False, "reason": "Token not found"}

    if datetime.utcnow() > datetime.fromisoformat(record["expires_at"]):
        return {"valid": False, "reason": "Token expired"}

    return {
        "valid": True,
        "username": record["username"]
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)