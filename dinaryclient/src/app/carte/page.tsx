// src/app/carte/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import PageHeader from "@/components/layouts/PageHeader";
import PromoBanner from "@/components/common/PromoBanner";
import SuggestCommerceModal, {
  CommerceSubmission,
} from "@/components/modals/SuggestCommerceModal";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic"; // 👈 Importez dynamic pour charger le composant côté client

// ... (le reste de vos interfaces et fonctions d'aide, comme StarRating)

// Chargez le composant de carte de manière dynamique
const DynamicMap = dynamic(() => import("@/components/common/DynamicMap"), {
  ssr: false, // C'est crucial pour Leaflet, qui est une librairie client
});

// Emojis iOS pour les catégories
const CategoryEmojis: Record<string, string> = {
  restaurant: "🍽️",
  groceries: "🥬",
  retail: "🛍️",
  fashion: "👕",
  health: "💊",
  tech: "📱",
  loisirs: "🎮",
  all: "🔍",
};

// ... (votre composant StarRating et autres fonctions)
const StarRating = ({ rating }: { rating: number }) => {
  const safeRating = Math.max(0, Math.min(5, rating));
  const fullStars = Math.floor(safeRating);
  const partialStar = safeRating % 1;
  const emptyStars = 5 - fullStars - (partialStar > 0 ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <svg
          key={`full-${i}`}
          className="w-4 h-4 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {partialStar > 0 && (
        <div className="relative w-4 h-4">
          <svg
            className="absolute w-4 h-4 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <div
            className="absolute overflow-hidden"
            style={{ width: `${partialStar * 100}%` }}
          >
            <svg
              className="w-4 h-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={`empty-${i}`}
          className="w-4 h-4 text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-xs text-gray-600 font-medium">
        {safeRating.toFixed(1)}
      </span>
    </div>
  );
};
const CommerceItem = ({
  commerce,
  onSelect,
}: {
  commerce: Commerce;
  onSelect: (commerce: Commerce) => void;
}) => {
  const isSuggested = commerce.isSuggested;
  const bgColor = isSuggested ? "bg-purple-100 hover:bg-purple-50" : "bg-white";
  const iconBgColor = commerce.promoActive
    ? "bg-green-600"
    : isSuggested
    ? "bg-purple-600"
    : "bg-gray-900";

  return (
    <div
      className={`flex flex-col py-4 border-b border-gray-200 cursor-pointer ${bgColor} rounded-lg mb-1 px-2`}
      onClick={() => onSelect(commerce)}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div
            className={`w-10 h-10 rounded-xl ${iconBgColor} flex items-center justify-center text-white shadow-sm mr-3`}
          >
            <span className="text-base">
              {CategoryEmojis[commerce.category]}
            </span>
          </div>
          <div>
            <div className="flex items-center">
              <h3 className="font-medium text-base">{commerce.name}</h3>
              {isSuggested && (
                <span className="ml-2 text-xs bg-purple-200 text-purple-800 py-0.5 px-2 rounded-full">
                  Suggéré
                </span>
              )}
            </div>
            <div className="flex items-center">
              <p className="text-sm text-gray-500 mr-2">
                À {commerce.distance}m
              </p>
              {commerce.rating && <StarRating rating={commerce.rating} />}
              {isSuggested && commerce.suggestedBy && (
                <span className="ml-2 text-xs text-gray-500">
                  par {commerce.suggestedBy}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          {commerce.promoActive && (
            <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full mb-1">
              {commerce.promoValue}
            </span>
          )}
          <span className="text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};
const CommerceDetail = ({
  commerce,
  onClose,
}: {
  commerce: Commerce;
  onClose: () => void;
}) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-t-3xl w-full max-w-lg p-5 pb-24"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        style={{ maxHeight: "calc(100vh - 20px)", overflowY: "auto" }}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="font-bold text-xl">{commerce.name}</h2>
            <p className="text-sm text-gray-500">{commerce.description}</p>
            {commerce.rating && <StarRating rating={commerce.rating} />}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="bg-gray-100 h-48 w-full rounded-xl flex items-center justify-center text-6xl mb-4">
          {CategoryEmojis[commerce.category]}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-100 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">Distance</p>
            <p className="font-bold">{commerce.distance}m</p>
          </div>
          <div className="bg-gray-100 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">Popularité</p>
            <p className="font-bold">{commerce.popularityScore}%</p>
          </div>
        </div>

        {commerce.isNew && (
          <div className="bg-blue-50 rounded-xl p-3 mb-4">
            <div className="flex items-center">
              <span className="text-xl mr-2">🆕</span>
              <div>
                <h3 className="font-bold text-blue-900">Nouveau sur Dinary</h3>
                <p className="text-sm text-blue-800">
                  Soyez le premier à payer ici et gagnez des points bonus
                </p>
              </div>
            </div>
          </div>
        )}

        {commerce.isSuggested && (
          <div className="bg-purple-50 rounded-xl p-3 mb-4">
            <div className="flex items-center">
              <span className="text-xl mr-2">📋</span>
              <div>
                <h3 className="font-bold text-purple-900">Suggestion</h3>
                <p className="text-sm text-purple-800">
                  Ce commerçant a été suggéré par un utilisateur Dinary.
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default function CartePage() {
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [selectedCommerce, setSelectedCommerce] = useState<Commerce | null>(
    null
  );
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState<boolean>(false);
  const [suggestedCommerces, setSuggestedCommerces] = useState<
    CommerceSubmission[]
  >([]);

  const [merchants, setMerchants] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const { token, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // Utilisez l'état de la carte pour stocker la position et le zoom
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [mapZoom, setMapZoom] = useState(13);

  // Fonction pour charger les commerçants à partir de l'API
  const fetchMerchants = async (latitude: number, longitude: number) => {
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/merchants/nearby?latitude=${latitude}&longitude=${longitude}&radius=5000`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.ok) {
        const data = await response.json();
        setMerchants(data);
      } else {
        console.error("Erreur de récupération des commerçants.");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les commerçants au premier rendu
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          setMapCenter(newPosition);
          fetchMerchants(newPosition[0], newPosition[1]);
        },
        (error) => {
          console.error("Erreur de géolocalisation :", error);
          setLoading(false);
        }
      );
    } else {
      console.log("Géolocalisation non supportée par le navigateur.");
      setLoading(false);
    }
  }, [token]);

  // Gérer le déplacement de la carte
  const handleMapMoveEnd = (latitude: number, longitude: number) => {
    setMapCenter([latitude, longitude]);
    fetchMerchants(latitude, longitude);
  };

  const demoBusinesses = [
    // ... (Vos données de démo statiques)
  ];

  const allBusinesses = [
    ...merchants.map((m: any) => ({
      ...m,
      isSuggested: false,
      promoActive: Math.random() > 0.7,
      userVisited: Math.random() > 0.5,
      popularityScore: Math.floor(Math.random() * 50) + 50,
      rating: Math.random() * 1.5 + 3.5,
      location: {
        latitude: m.latitude, // Utilisez les nouvelles données de l'API
        longitude: m.longitude,
      },
      distance: m.distance, // Assurez-vous que l'API renvoie la distance
    })),
    ...suggestedCommerces.map((s) => ({
      ...s,
      id: `suggested-${s.name}`,
      isSuggested: true,
      pendingApproval: true,
      promoActive: false,
      userVisited: false,
      popularityScore: 0,
      distance: 0,
      rating: 0,
      location: {
        latitude: 36.776,
        longitude: 3.058,
      },
    })),
  ];

  const filteredBusinesses =
    filterCategory === "all"
      ? allBusinesses
      : allBusinesses.filter((b) => b.category === filterCategory);

  if (loading || isAuthLoading || !mapCenter) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Chargement de la carte...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <PageHeader
        title="Carte"
        emoji="📍"
        actionButton={
          <button className="p-2">
            <span className="text-lg">🔍</span>
          </button>
        }
      />

      <div className="px-5">
        <div className="my-4">
          <PromoBanner
            title="+1000DA"
            description="Parraine un commerçant et gagne +1000DA"
            emoji="🎁"
            action={() => router.push("/inviter")}
            actionLabel="Parrainer"
          />
        </div>

        <h2 className="text-xl font-semibold mb-3">Commerçants durables</h2>

        {/* Remplacer par le composant de carte dynamique */}
        <DynamicMap
          initialPosition={mapCenter}
          merchants={filteredBusinesses.filter((b) => b.location)}
          onMoveEnd={handleMapMoveEnd}
        />

        <div className="mt-2 mb-20">
          <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-hide">
            {Object.entries(CategoryEmojis).map(([category, emoji]) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`flex items-center px-3 py-1.5 rounded-full whitespace-nowrap ${
                  filterCategory === category
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <span className="mr-1.5">{emoji}</span>
                <span className="text-sm font-medium">
                  {category === "all"
                    ? "Tous"
                    : category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
              </button>
            ))}
          </div>
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map((business) => (
              <CommerceItem
                key={business.id}
                commerce={business}
                onSelect={() => setSelectedCommerce(business)}
              />
            ))
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-500">
                Aucun commerçant dans cette catégorie
              </p>
            </div>
          )}
        </div>

        <div className="fixed bottom-20 right-5 flex flex-col items-end space-y-3">
          <Link
            href="/suggestions"
            className="bg-white text-black py-2 px-4 rounded-full shadow-md border border-gray-200 flex items-center text-sm"
          >
            <span className="mr-1">📋</span> Mes suggestions (
            {suggestedCommerces.length})
          </Link>
          <button
            className="bg-black text-white py-3 px-5 rounded-full shadow-lg flex items-center"
            onClick={() => setIsSuggestModalOpen(true)}
          >
            <span className="mr-2">➕</span> Suggérer un commerce
          </button>
        </div>
      </div>

      {selectedCommerce && (
        <CommerceDetail
          commerce={selectedCommerce}
          onClose={() => setSelectedCommerce(null)}
        />
      )}

      {isSuggestModalOpen && (
        <SuggestCommerceModal
          isOpen={isSuggestModalOpen}
          onClose={() => setIsSuggestModalOpen(false)}
          onSubmit={() => {}}
        />
      )}
    </div>
  );
}
