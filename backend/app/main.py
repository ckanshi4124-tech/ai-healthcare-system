# Entry point for FastAPI backend (to be filled in Phase 1)
from fastapi import FastAPI

app = FastAPI(
    title="AI Healthcare Diagnostic System API",
    description="Backend Service - Authentication + Diagnostics",
    version="1.0.0"
)

@app.get("/")
def root():
    return {"message": "Backend running successfully 🚀"}
