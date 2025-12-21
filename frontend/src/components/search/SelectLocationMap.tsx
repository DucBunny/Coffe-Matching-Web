import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { useState } from 'react'

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

interface Props {
  onConfirm: (lat: number, lng: number) => void
}

export default function SelectLocationMap({ onConfirm }: Props) {
  const [position, setPosition] = useState<{
    lat: number
    lng: number
  } | null>(null)

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        setPosition({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        })
      },
    })
    return null
  }

  return (
    <div>
      <MapContainer
        center={[21.03, 105.85]} // Hà Nội mặc định
        zoom={13}
        style={{ height: '400px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MapClickHandler />

        {position && (
          <Marker position={[position.lat, position.lng]} icon={markerIcon} />
        )}
      </MapContainer>

      <button
        disabled={!position}
        onClick={() => position && onConfirm(position.lat, position.lng)}
        style={{ marginTop: 12 }}>
        Xác nhận vị trí
      </button>
    </div>
  )
}
