
import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
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

const stations: Station[] = [
  {
    id: 1,
    name: 'ESSDRIVE Demo Station 01',
    city: 'București',
    lat: 44.4268,
    lng: 26.1025,
    power: 150,
    connector: 'CCS2',
    price: 2.25,
    available: true,
  },
  {
    id: 2,
    name: 'ESSDRIVE Demo Station 02',
    city: 'Cluj-Napoca',
    lat: 46.7712,
    lng: 23.6236,
    power: 50,
    connector: 'CCS2',
    price: 1.95,
    available: true,
  },
  {
    id: 3,
    name: 'ESSDRIVE Demo Station 03',
    city: 'Timișoara',
    lat: 45.7489,
    lng: 21.2087,
    power: 22,
    connector: 'Type 2',
    price: 1.75,
    available: false,
  },
]

function MapFocus({ station }: { station: Station | null }) {
  const map = useMap()

  if (station) {
    map.flyTo([station.lat, station.lng], 12, { duration: 0.8 })
  }

  return null
}

function App() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Station | null>(null)

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
        <button className="login-button" onClick={() => alert('Autentificarea va fi adăugată ulterior.')}>
          Sign in
        </button>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">ELECTRIC MOBILITY</span>
          <h1>Charge smarter.<br />Drive further.</h1>
          <p>Find charging stations and explore electric mobility with ESSDRIVE.</p>
          <a className="primary-button" href="#stations">Explore charging stations ↓</a>
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
          <span className="station-count">{filteredStations.length} stations</span>
        </div>

        <input
          className="search-input"
          type="search"
          placeholder="Search by city, station or connector..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search charging stations"
        />

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
            <p className="map-disclaimer">*Simulated status. These are demo locations, not verified charging stations.</p>
          </aside>
        </div>

        {selected && (
          <section className="selected-station">
            <button className="close-button" onClick={() => setSelected(null)} aria-label="Close details">×</button>
            <span className="eyebrow">SELECTED STATION · DEMO</span>
            <h3>{selected.name}</h3>
            <p>{selected.city}, Romania</p>
            <div className="station-specs">
              <span>{selected.power} kW</span>
              <span>{selected.connector}</span>
              <span>{selected.price.toFixed(2)} RON/kWh</span>
            </div>
            <p className="demo-notice">Demo only. No real charging session or payment can be started.</p>
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

