from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 🚀 FastAPI App
app = FastAPI(
    title="AI Healthcare Diagnostic System API",
    description="Backend Service - Authentication + Diagnostics",
    version="1.0.0"
)

# 🌍 CORS Middleware (for frontend later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🏠 Root Endpoint
@app.get("/")
def root():
    return {"message": "Backend running successfully 🚀"}

# 🔑 Include Authentication Routes
from backend.app.api.routes_auth import router as auth_router
app.include_router(auth_router)
