
DEMO_STATIONS = [
    {
        "id": 1,
        "name": "ESSDRIVE Bucuresti",
        "city": "Bucuresti",
        "latitude": 44.4268,
        "longitude": 26.1025,
        "power_kw": 150,
        "connector": "CCS2",
        "price_ron_kwh": 2.25,
        "available": True,
    },
    {
        "id": 2,
        "name": "ESSDRIVE Cluj",
        "city": "Cluj-Napoca",
        "latitude": 46.7712,
        "longitude": 23.6236,
        "power_kw": 50,
        "connector": "CCS2",
        "price_ron_kwh": 1.95,
        "available": True,
    },
    {
        "id": 3,
        "name": "ESSDRIVE Timisoara",
        "city": "Timisoara",
        "latitude": 45.7489,
        "longitude": 21.2087,
        "power_kw": 22,
        "connector": "Type 2",
        "price_ron_kwh": 1.75,
        "available": False,
    },
]


def get_all_stations():
    return DEMO_STATIONS


def get_station_by_id(station_id: int):
    for station in DEMO_STATIONS:
        if station["id"] == station_id:
            return station

    return None



def filter_stations(
    city: str | None = None,
    available: bool | None = None,
    min_power_kw: float | None = None,
    sort_by: str | None = None,
):
    stations = get_all_stations()

    if city:
        stations = [
            station for station in stations
            if station["city"].casefold() == city.strip().casefold()
        ]

    if available is not None:
        stations = [
            station for station in stations
            if station["available"] is available
        ]

    if min_power_kw is not None:
        stations = [
            station for station in stations
            if station["power_kw"] >= min_power_kw
        ]

    if sort_by == "price":
        stations.sort(key=lambda station: station["price_ron_kwh"])
    elif sort_by == "power":
        stations.sort(
            key=lambda station: station["power_kw"],
            reverse=True,
        )

    return stations


