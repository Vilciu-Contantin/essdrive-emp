
from fastapi import FastAPI

app = FastAPI(
    title="ESSDRIVE EMP API",
    description="Backend pentru platforma ESSDRIVE EMP",
    version="0.1.0",
)


@app.get("/")
def home():
    return {
        "app": "ESSDRIVE EMP",
        "status": "online",
    }


@app.get("/api/v1/health")
def health():
    return {
        "status": "ok",
        "database": "not_connected",
    }
