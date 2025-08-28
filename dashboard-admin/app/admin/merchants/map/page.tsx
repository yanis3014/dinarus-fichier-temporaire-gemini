'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Store, Users, DollarSign, TrendingUp, Search, BellDot, Filter, Map as MapIcon } from 'lucide-react';
import MerchantStatCard from '@/components/admin/MerchantStatCard';
import MerchantAnalytics from '@/components/admin/MerchantAnalytics';
import { MERCHANT_CATEGORIES } from '@/types/merchant';
import type { Merchant } from '@/types/merchant';
import type { SuggestedMerchant } from '@/types/suggestion';

// Mock data pour les suggestions
const mockSuggestions: SuggestedMerchant[] = [
  {
    name: "Le Petit Café",
    address: "156 Rue Larbi Ben M'hidi, Alger",
    category: "restaurants",
    location: {
      lat: 36.7539,
      lng: 3.0589
    },
    suggestedBy: {
      id: "user123",
      name: "Ahmed Benali",
      phone: "+213 555 123 456"
    },
    suggestedAt: "2025-05-14T15:30:00Z",
    status: "pending"
  },
  {
    name: "Sport & Fitness",
    address: "23 Boulevard Zighout Youcef, Oran",
    category: "sports",
    location: {
      lat: 35.6969,
      lng: -0.6331
    },
    suggestedBy: {
      id: "user456",
      name: "Karim Medjdoub",
      phone: "+213 555 789 012"
    },
    suggestedAt: "2025-05-15T09:15:00Z",
    status: "pending"
  }
];

// Load map component dynamically
const MapWithNoSSR = dynamic(() => import('@/components/admin/MerchantMap'), {
  ssr: false,
});

export default function MerchantMapPage() {
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions] = useState<SuggestedMerchant[]>(mockSuggestions);
  const [selectedSuggestion, setSelectedSuggestion] = useState<SuggestedMerchant | null>(null);
  const [view, setView] = useState<'map' | 'analytics'>('map');
  const [mapStats, setMapStats] = useState({
    totalMerchants: 1245,
    activeMerchants: 987,
    totalRevenue: 12567890,
    averageRevenue: 12734.64,
    merchantsByRegion: {
      'Alger': 450,
      'Oran': 280,
      'Constantine': 175,
      'Annaba': 120,
      'Sétif': 95,
    },
    topCities: [
      { city: 'Alger Centre', count: 145 },
      { city: 'Oran', count: 98 },
      { city: 'Constantine', count: 76 },
      { city: 'Sétif', count: 65 },
      { city: 'Annaba', count: 54 },
    ]
  });

  const toggleFilter = (categoryId: string) => {
    setActiveFilters(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleApproveSuggestion = async (newMerchant: Merchant) => {
    // TODO: Implémenter l'ajout du commerçant à la base de données
    console.log('Approving merchant:', newMerchant);
  };

  const handleRejectSuggestion = async (userId: string) => {
    // TODO: Implémenter le rejet de la suggestion
    console.log('Rejecting suggestion from user:', userId);
  };

  return (
    <div className="p-6 space-y-6">
      {/* En-tête avec les statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MerchantStatCard
          title="Total Commerçants"
          value={mapStats.totalMerchants}
          Icon={Store}
          trend={+8}
        />
        <MerchantStatCard
          title="Commerçants Actifs"
          value={mapStats.activeMerchants}
          Icon={Users}
          trend={+12}
        />
        <MerchantStatCard
          title="Revenus Totaux"
          value={mapStats.totalRevenue}
          Icon={DollarSign}
          trend={+15}
          format="currency"
        />
        <MerchantStatCard
          title="Revenu Moyen"
          value={mapStats.averageRevenue}
          Icon={TrendingUp}
          trend={+5}
          format="currency"
        />
      </div>

      {/* Barre d'outils */}
      <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Barre de recherche */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-dinary-turquoise focus:border-transparent"
              placeholder="Rechercher un commerçant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Bouton de changement de vue */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('map')}
              className={`flex items-center px-4 py-2 rounded-lg ${
                view === 'map'
                  ? 'bg-dinary-turquoise text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <MapIcon className="w-5 h-5 mr-2" />
              Carte
            </button>
            <button
              onClick={() => setView('analytics')}
              className={`flex items-center px-4 py-2 rounded-lg ${
                view === 'analytics'
                  ? 'bg-dinary-turquoise text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Analyses
            </button>
          </div>
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center mr-2">
            <Filter className="w-5 h-5 text-gray-400" />
          </div>
          {MERCHANT_CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => toggleFilter(category.id)}
              className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                ${activeFilters.includes(category.id)
                  ? 'bg-opacity-100 text-white'
                  : 'bg-opacity-10 text-gray-600 hover:bg-opacity-20'
              }`}
              style={{
                backgroundColor: activeFilters.includes(category.id)
                  ? category.color
                  : `${category.color}19`
              }}
            >
              <span className="mr-2">{category.emoji}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Carte ou Analyses */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border">
          {view === 'map' ? (
            <div className="h-[600px] relative">
              <MapWithNoSSR
                activeFilters={activeFilters}
                searchQuery={searchQuery}
              />
            </div>
          ) : (
            <MerchantAnalytics />
          )}
        </div>

        {/* Panneau latéral */}
        <div className="space-y-6">
          {/* Suggestions en attente */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Suggestions</h3>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                {suggestions.length} en attente
              </span>
            </div>
            <div className="space-y-4">
              {suggestions.map((suggestion) => (
                <div
                  key={`${suggestion.name}-${suggestion.suggestedAt}`}
                  className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setSelectedSuggestion(suggestion)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{suggestion.name}</h4>
                      <p className="text-sm text-gray-600">{suggestion.address}</p>
                    </div>
                    <BellDot className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Suggéré par {suggestion.suggestedBy.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Distribution par région */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-lg font-semibold mb-4">Distribution par Région</h3>
            <div className="space-y-3">
              {Object.entries(mapStats.merchantsByRegion).map(([region, count]) => (
                <div key={region} className="flex items-center justify-between">
                  <span className="text-gray-600">{region}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top 5 des villes */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-lg font-semibold mb-4">Top 5 des Villes</h3>
            <div className="space-y-3">
              {mapStats.topCities.map((city, index) => (
                <div key={city.city} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-6 text-sm text-gray-500">#{index + 1}</span>
                    <span className="text-gray-600">{city.city}</span>
                  </div>
                  <span className="font-semibold">{city.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedMerchant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-lg w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{selectedMerchant.name}</h2>
                <button
                  onClick={() => setSelectedMerchant(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600">{selectedMerchant.address}</p>
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">⭐</span>
                  <span>{selectedMerchant.rating.toFixed(1)}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedMerchant.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Services</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {selectedMerchant.services.map(service => (
                      <li key={service}>{service}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-b-lg flex justify-end space-x-3">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedMerchant.location.lat},${selectedMerchant.location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                Itinéraire
              </a>
              <button
                onClick={() => setSelectedMerchant(null)}
                className="px-4 py-2 bg-dinary-turquoise text-white rounded-md hover:bg-dinary-turquoise-dark transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de suggestion */}
      {selectedSuggestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-lg w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Suggestion de commerçant</h2>
                <button
                  onClick={() => setSelectedSuggestion(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-6">
                {/* Informations du commerce */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Informations du commerce</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Nom :</span> {selectedSuggestion.name}</p>
                    <p><span className="font-medium">Adresse :</span> {selectedSuggestion.address}</p>
                    <p><span className="font-medium">Catégorie :</span> {
                      MERCHANT_CATEGORIES.find(cat => cat.id === selectedSuggestion.category)?.name
                    }</p>
                  </div>
                </div>

                {/* Informations du suggéreur */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Suggéré par</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Nom :</span> {selectedSuggestion.suggestedBy.name}</p>
                    <p><span className="font-medium">Téléphone :</span> {selectedSuggestion.suggestedBy.phone}</p>
                    <p><span className="font-medium">Date :</span> {
                      new Date(selectedSuggestion.suggestedAt).toLocaleDateString('fr-DZ')
                    }</p>
                  </div>
                </div>

                {/* Mini carte */}
                <div className="h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    frameBorder="0"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                      selectedSuggestion.location.lng - 0.01
                    },${
                      selectedSuggestion.location.lat - 0.01
                    },${
                      selectedSuggestion.location.lng + 0.01
                    },${
                      selectedSuggestion.location.lat + 0.01
                    }&layer=mapnik&marker=${selectedSuggestion.location.lat},${selectedSuggestion.location.lng}`}
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-b-lg flex justify-end space-x-3">
              <button
                onClick={() => {
                  handleRejectSuggestion(selectedSuggestion.suggestedBy.id);
                  setSelectedSuggestion(null);
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                Rejeter
              </button>
              <button
                onClick={() => {
                  handleApproveSuggestion({
                    id: crypto.randomUUID(),
                    name: selectedSuggestion.name,
                    category: selectedSuggestion.category,
                    rating: 0,
                    location: selectedSuggestion.location,
                    address: selectedSuggestion.address,
                    status: 'active',
                    tags: [],
                    services: []
                  });
                  setSelectedSuggestion(null);
                }}
                className="px-4 py-2 bg-dinary-turquoise text-white rounded-md hover:bg-dinary-turquoise-dark transition-colors"
              >
                Approuver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
