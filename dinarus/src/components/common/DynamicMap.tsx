"use client";

import React, { useState, useEffect } from "react-leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useRouter } from "next/navigation";

// Correction d'une erreur de configuration des icônes de marqueur
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/icons/marker-icon-2x.png",
  iconUrl: "/icons/marker-icon.png",
  shadowUrl: "/icons/marker-shadow.png",
});

// Importez l'interface de votre backend
import { Commerce } from "@/app/carte/page";

interface DynamicMapProps {
  initialPosition: [number, number];
  merchants: Commerce[];
  onMoveEnd: (latitude: number, longitude: number) => void;
}

// Coordonnées pour définir les frontières de l'Algérie
const algeriaBounds = [
  [18.9, -8.6], // Sud-ouest (approx.)
  [37.2, 11.9], // Nord-est (approx.)
];

export default function DynamicMap({
  initialPosition,
  merchants,
  onMoveEnd,
}: DynamicMapProps) {
  const router = useRouter();

  // Le composant MapEvents écoute les événements de la carte
  const MapEvents = () => {
    useMapEvents({
      moveend(e) {
        const center = e.target.getCenter();
        onMoveEnd(center.lat, center.lng);
      },
    });
    return null;
  };

  const handleMarkerClick = (merchant: Commerce) => {
    // Rediriger ou ouvrir un modal d'information
    router.push(`/carte?commerceId=${merchant.id}`);
  };

  return (
    <div className="rounded-xl overflow-hidden h-[400px] bg-slate-100 relative mt-2">
      <MapContainer
        center={initialPosition}
        zoom={6} // Un zoom initial plus bas est préférable pour voir l'ensemble du pays
        minZoom={6} // Le niveau de zoom minimum est maintenant 6
        maxBounds={algeriaBounds} // Restriction des frontières
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents />

        {merchants.map((merchant) => (
          <Marker
            key={merchant.id}
            position={[merchant.location.latitude, merchant.location.longitude]}
            eventHandlers={{
              click: () => handleMarkerClick(merchant),
            }}
          >
            <Popup>{merchant.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
