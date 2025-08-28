'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { Merchant, MERCHANT_CATEGORIES } from '@/types/merchant';
import { Search, Layers, MapPin, Target } from 'lucide-react';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/leaflet/marker-icon-2x.png',
  iconUrl: '/images/leaflet/marker-icon.png',
  shadowUrl: '/images/leaflet/marker-shadow.png',
});

interface MerchantMapProps {
  activeFilters?: string[];
  searchQuery?: string;
  onSelectLocation?: (location: { lat: number; lng: number }) => void;
}

// Fonction pour créer un marqueur d'emoji
const createEmojiMarker = (emoji: string, color: string) => {
  return L.divIcon({
    html: `<div style="
      background-color: ${color};
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    ">${emoji}</div>`,
    className: 'emoji-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
};

// Données simulées des commerçants
const mockMerchants: Merchant[] = [
  {
    id: '1',
    name: "L'Atelier des Saveurs",
    category: 'restaurants',
    rating: 4.5,
    location: { lat: 36.7525, lng: 3.0420 },
    address: "123 Rue Didouche Mourad, Alger",
    status: 'active',
    tags: ['Restaurant', 'Cuisine moderne'],
    services: ['Sur place', 'À emporter']
  },
  {
    id: '2',
    name: "Supermarché Bio",
    category: 'grocery',
    rating: 4.2,
    location: { lat: 35.6976, lng: -0.6337 },
    address: "45 Boulevard Front de Mer, Oran",
    status: 'active',
    tags: ['Bio', 'Épicerie fine'],
    services: ['Livraison', 'Click & Collect']
  },
  {
    id: '3',
    name: "Fashion Store",
    category: 'fashion',
    rating: 4.0,
    location: { lat: 36.3650, lng: 6.6147 },
    address: "78 Rue Ben M'hidi, Constantine",
    status: 'active',
    tags: ['Mode', 'Accessoires'],
    services: ['Essayage', 'Click & Collect']
  },
  {
    id: '4',
    name: "Sport Center",
    category: 'sports',
    rating: 4.3,
    location: { lat: 35.2000, lng: 0.6333 },
    address: "15 Boulevard Principal, Sétif",
    status: 'active',
    tags: ['Sport', 'Fitness'],
    services: ['Coaching', 'Équipement']
  }
];

export default function MerchantMap({ activeFilters = [], searchQuery = '', onSelectLocation }: MerchantMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.MarkerClusterGroup | null>(null);
  const [merchants] = useState<Merchant[]>(mockMerchants);
  const [selectedLocation, setSelectedLocation] = useState<L.Marker | null>(null);
  const [mapLayer, setMapLayer] = useState<'streets' | 'satellite'>('streets');
  const [isLocating, setIsLocating] = useState(false);

  // Initialisation de la carte
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('merchant-map').setView([36.7525, 3.0420], 6);

      // Ajout des différentes couches de carte
      const streetsLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      });

      const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'
      });

      // Configuration par défaut
      streetsLayer.addTo(mapRef.current);

      // Ajout des contrôles de zoom
      mapRef.current.zoomControl.setPosition('topright');

      // Initialisation du clustering
      markersRef.current = L.markerClusterGroup({
        iconCreateFunction: (cluster) => {
          return L.divIcon({
            html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
            className: 'custom-cluster',
            iconSize: L.point(40, 40)
          });
        },
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: true,
        zoomToBoundsOnClick: true
      });

      // Ajout des contrôles personnalisés
      const customControl = L.control({ position: 'topright' });
      customControl.onAdd = () => {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        div.innerHTML = `
          <div class="flex flex-col gap-2">
            <button class="map-control-button" title="Changer de vue">
              <span class="map-control-icon"><i data-feather="layers"></i></span>
            </button>
            <button class="map-control-button" title="Ma position">
              <span class="map-control-icon"><i data-feather="crosshair"></i></span>
            </button>
            <button class="map-control-button" title="Sélectionner un emplacement">
              <span class="map-control-icon"><i data-feather="map-pin"></i></span>
            </button>
          </div>
        `;

        // Gestionnaires d'événements
        const [layersBtn, locationBtn, selectBtn] = div.querySelectorAll('button');
        
        layersBtn.onclick = () => {
          setMapLayer(prev => {
            if (prev === 'streets') {
              mapRef.current?.removeLayer(streetsLayer);
              mapRef.current?.addLayer(satelliteLayer);
              return 'satellite';
            } else {
              mapRef.current?.removeLayer(satelliteLayer);
              mapRef.current?.addLayer(streetsLayer);
              return 'streets';
            }
          });
        };

        locationBtn.onclick = () => {
          setIsLocating(true);
          navigator.geolocation.getCurrentPosition(
            (position) => {
              mapRef.current?.setView(
                [position.coords.latitude, position.coords.longitude],
                13
              );
              setIsLocating(false);
            },
            (error) => {
              console.error('Error getting location:', error);
              setIsLocating(false);
            }
          );
        };

        selectBtn.onclick = () => {
          if (selectedLocation) {
            mapRef.current?.removeLayer(selectedLocation);
            setSelectedLocation(null);
          } else {
            mapRef.current?.once('click', (e: L.LeafletMouseEvent) => {
              if (selectedLocation) {
                mapRef.current?.removeLayer(selectedLocation);
              }
              const marker = L.marker(e.latlng, {
                icon: createEmojiMarker('📍', '#ef4444')
              }).addTo(mapRef.current!);
              setSelectedLocation(marker);
              onSelectLocation?.(e.latlng);
            });
          }
        };

        return div;
      };
      customControl.addTo(mapRef.current);

      // Ajout des event listeners pour la carte
      mapRef.current.on('zoomend', () => {
        const zoom = mapRef.current?.getZoom();
        if (zoom && zoom > 12) {
          // Afficher plus de détails sur les marqueurs
          document.querySelectorAll('.emoji-marker').forEach((marker: any) => {
            marker.style.transform = 'scale(1.2)';
          });
        } else {
          document.querySelectorAll('.emoji-marker').forEach((marker: any) => {
            marker.style.transform = 'scale(1)';
          });
        }
      });
    }

    // Mise à jour des marqueurs
    if (markersRef.current) {
      markersRef.current.clearLayers();
      
      const filteredMerchants = merchants.filter(merchant => {
        const matchesFilter = activeFilters.length === 0 || activeFilters.includes(merchant.category);
        const matchesSearch = searchQuery === '' || 
          merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          merchant.address.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
      });

      filteredMerchants.forEach(merchant => {
        const category = MERCHANT_CATEGORIES.find(cat => cat.id === merchant.category);
        if (category) {
          const marker = L.marker(
            [merchant.location.lat, merchant.location.lng],
            { icon: createEmojiMarker(category.emoji, category.color) }
          )
            .bindPopup(`
              <div class="merchant-popup">
                <h3 class="text-lg font-semibold">${merchant.name}</h3>
                <p class="text-gray-600 text-sm">${merchant.address}</p>
                <div class="flex items-center mt-2">
                  <span class="text-yellow-400">⭐</span>
                  <span class="ml-1">${merchant.rating.toFixed(1)}</span>
                </div>
                <div class="mt-2 flex flex-wrap gap-1">
                  ${merchant.tags.map(tag => `
                    <span class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">${tag}</span>
                  `).join('')}
                </div>
                <div class="mt-2 grid grid-cols-2 gap-2">
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=${merchant.location.lat},${merchant.location.lng}"
                    target="_blank"
                    class="px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors text-center"
                  >
                    Itinéraire
                  </a>
                  <button
                    onclick="window.dispatchEvent(new CustomEvent('merchant-select', {detail: ${JSON.stringify(merchant)}}))"
                    class="px-3 py-1.5 bg-dinary-turquoise text-white rounded-md text-sm hover:bg-dinary-turquoise-dark transition-colors"
                  >
                    Voir détails
                  </button>
                </div>
              </div>
            `, {
              minWidth: 250,
              className: 'merchant-popup-container'
            });

          markersRef.current?.addLayer(marker);
        }
      });

      if (filteredMerchants.length > 0) {
        mapRef.current?.fitBounds(markersRef.current.getBounds(), {
          padding: [50, 50]
        });
      }
    }
  }, [merchants, activeFilters, searchQuery, onSelectLocation]);

  useEffect(() => {
    // Gestionnaire d'événements globaux
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedLocation) {
        mapRef.current?.removeLayer(selectedLocation);
        setSelectedLocation(null);
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [selectedLocation]);

  return (
    <>
      <div id="merchant-map" className="w-full h-full rounded-lg z-0 relative">
        {isLocating && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg z-[1000] flex items-center">
            <div className="animate-spin mr-2 h-4 w-4 border-2 border-dinary-turquoise border-t-transparent rounded-full"></div>
            Localisation en cours...
          </div>
        )}
      </div>
      <style jsx global>{`
        .custom-cluster {
          background-color: #fff;
          border: 2px solid #00a5a5;
          border-radius: 50%;
          color: #00a5a5;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cluster-icon {
          width: 40px;
          height: 40px;
          background-color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #00a5a5;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .merchant-popup {
          padding: 12px;
        }
        .merchant-popup-container .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .merchant-popup-container .leaflet-popup-tip-container {
          filter: drop-shadow(0 4px 3px rgba(0, 0, 0, 0.07));
        }
        .map-control-button {
          width: 34px;
          height: 34px;
          background: white;
          border: 2px solid rgba(0,0,0,0.2);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .map-control-button:hover {
          background: #f8f8f8;
        }
        .map-control-icon {
          width: 16px;
          height: 16px;
          color: #666;
        }
      `}</style>
    </>
  );
}
