
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from app.services.station_service import (
    get_all_stations,
    get_station_by_id,
    filter_stations,
)

app = FastAPI(
    title="ESSDRIVE EMP API",
    description="Backend pentru platforma ESSDRIVE EMP",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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



@app.get("/api/v1/stations")
def get_stations(
    city: str | None = None,
    available: bool | None = None,
    min_power_kw: float | None = Query(default=None, ge=0),
    sort_by: str | None = Query(
        default=None,
        pattern="^(price|power)$",
    ),
):
    stations = filter_stations(
        city=city,
        available=available,
        min_power_kw=min_power_kw,
        sort_by=sort_by,
    )

    return {
        "count": len(stations),
        "stations": stations,
    }



@app.get("/api/v1/stations/{station_id}")
def get_station(station_id: int):
    station = get_station_by_id(station_id)

    if station is None:
        raise HTTPException(
            status_code=404,
            detail="Station not found",
        )

    return station
