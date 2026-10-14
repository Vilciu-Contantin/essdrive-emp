
import { useEffect, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'

type Station = {
  id: number
  name: string
  city: string
  lat: number
  lng: number
  power: number
  connector: string
  price: number
  available: boolean
}

type ApiStation = {
  id: number
  name: string
  city: string
  latitude: number
  longitude: number
  power_kw: number
  connector: string
  price_ron_kwh: number
  available: boolean
}

type StationsResponse = {
  count: number
  stations: ApiStation[]
}

function MapFocus({ station }: { station: Station | null }) {
  const map = useMap()

  useEffect(() => {
    if (station) {
      map.flyTo([station.lat, station.lng], 12, { duration: 0.8 })
    }
  }, [station, map])

  return null
}

function App() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Station | null>(null)
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadStations() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(
          'http://localhost:8000/api/v1/stations',
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data: StationsResponse = await response.json()

        const mappedStations: Station[] = data.stations.map((station) => ({
          id: station.id,
          name: station.name,
          city: station.city,
          lat: station.latitude,
          lng: station.longitude,
          power: station.power_kw,
          connector: station.connector,
          price: station.price_ron_kwh,
          available: station.available,
        }))

        setStations(mappedStations)
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return
        }

        console.error('Failed to load stations:', err)
        setError(
          'Nu am putut încărca stațiile. Verifică dacă backend-ul FastAPI rulează.',
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadStations()

    return () => controller.abort()
  }, [])

  const filteredStations = stations.filter((station) =>
    `${station.name} ${station.city} ${station.connector}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  )

  return (
    <main className="app">
      <header className="topbar">
        <a className="brand" href="#">ESS<span>DRIVE</span></a>
        <span className="demo-label">EMP · DEMO</span>
        <button
          className="login-button"
          onClick={() => alert('Autentificarea va fi adăugată ulterior.')}
        >
          Sign in
        </button>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">ELECTRIC MOBILITY</span>
          <h1>Charge smarter.<br />Drive further.</h1>
          <p>Find charging stations and explore electric mobility with ESSDRIVE.</p>
          <a className="primary-button" href="#stations">
            Explore charging stations ↓
          </a>
        </div>
        <div className="hero-visual">
          <div className="visual-circle">
            <span className="bolt">ϟ</span>
            <span className="visual-caption">ELECTRIC MOBILITY</span>
          </div>
        </div>
      </section>

      <section className="stations-section" id="stations">
        <div className="section-heading">
          <div>
            <span className="eyebrow">EXPLORE THE NETWORK</span>
            <h2>Charging stations</h2>
            <p>Select a map marker or a station card to view its details.</p>
          </div>
          <span className="station-count">
            {loading ? 'Loading stations…' : `${filteredStations.length} stations`}
          </span>
        </div>

        <input
          className="search-input"
          type="search"
          placeholder="Search by city, station or connector..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search charging stations"
        />

        {loading && <p>Loading charging stations from ESSDRIVE API…</p>}
        {error && <p role="alert">{error}</p>}

        {!loading && !error && stations.length === 0 && (
          <p>No stations are currently returned by the API.</p>
        )}

        <div className="map-layout">
          <div className="map-frame">
            <MapContainer
              center={[45.7, 24.8]}
              zoom={6}
              scrollWheelZoom={true}
              className="charging-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapFocus station={selected} />

              {filteredStations.map((station) => (
                <Marker
                  key={station.id}
                  position={[station.lat, station.lng]}
                  eventHandlers={{
                    click: () => setSelected(station),
                  }}
                >
                  <Popup>
                    <strong>{station.name}</strong>
                    <br />
                    {station.city}
                    <br />
                    {station.power} kW · {station.connector}
                    <br />
                    {station.price.toFixed(2)} RON/kWh · demo
                    <br />
                    <button onClick={() => setSelected(station)}>
                      View details
                    </button>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <aside className="map-sidebar">
            <h3>Stations on the map</h3>
            {filteredStations.map((station) => (
              <button
                className={`map-station ${selected?.id === station.id ? 'selected' : ''}`}
                key={station.id}
                onClick={() => setSelected(station)}
              >
                <span className="map-station-icon">ϟ</span>
                <span className="map-station-info">
                  <strong>{station.city}</strong>
                  <small>{station.power} kW · {station.connector}</small>
                  <small>{station.price.toFixed(2)} RON/kWh · demo</small>
                </span>
                <span className={station.available ? 'status available' : 'status unavailable'}>
                  {station.available ? 'Available*' : 'Unavailable*'}
                </span>
              </button>
            ))}
            <p className="map-disclaimer">
              *Simulated status. These are demo locations, not verified charging stations.
            </p>
          </aside>
        </div>

        {selected && (
          <section className="selected-station">
            <button
              className="close-button"
              onClick={() => setSelected(null)}
              aria-label="Close details"
            >
              ×
            </button>
            <span className="eyebrow">SELECTED STATION · DEMO</span>
            <h3>{selected.name}</h3>
            <p>{selected.city}, Romania</p>
            <div className="station-specs">
              <span>{selected.power} kW</span>
              <span>{selected.connector}</span>
              <span>{selected.price.toFixed(2)} RON/kWh</span>
            </div>
            <p className="demo-notice">
              Demo only. No real charging session or payment can be started.
            </p>
          </section>
        )}

        <p className="demo-notice">
          ESSDRIVE EMP prototype. Map markers, station status and prices are illustrative.
          Map tiles require an internet connection.
        </p>
      </section>

      <footer className="footer">
        <a className="brand" href="#">ESS<span>DRIVE</span></a>
        <p>Electric mobility, made simpler.</p>
        <small>© 2026 ESSDRIVE · Prototype</small>
      </footer>
    </main>
  )
}

export default App
