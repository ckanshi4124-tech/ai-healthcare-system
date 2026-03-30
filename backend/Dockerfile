# -------- Backend Dockerfile --------
FROM python:3.11-slim

# Keep Python output unbuffered & no .pyc files
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Install system-level dependencies (opencv, OCR, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    tesseract-ocr \
    poppler-utils \
  && rm -rf /var/lib/apt/lists/*

# All paths below are relative to /app inside the container
WORKDIR /app

# 1️⃣ Copy only requirements first (better caching)
COPY requirements.txt .

# 2️⃣ Install Python deps
RUN pip install --no-cache-dir -r requirements.txt

# 3️⃣ Copy the rest of the backend code
COPY . .

# Expose FastAPI port
EXPOSE 8000

# 4️⃣ Start FastAPI with Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
