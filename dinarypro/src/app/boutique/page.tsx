"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext"; // On importe le hook d'authentification

const BoutiquePage = () => {
  const { user, merchantProfile, isLoading } = useAuth(); // On récupère les données
  const [notification, setNotification] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");

  // Afficher une notification
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2000);
  };

  // Affichage pendant le chargement des données
  if (isLoading || !user || !merchantProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Données de démo pour les parties non encore dynamiques
  const storeData = {
    owner: user.fullName,
    email: user.email,
    subscriptionEndDate: "15 juin 2025",
    address: "12 Rue des Lilas, Alger", // À remplacer par des données dynamiques si disponibles
    phone: "+213 55 123 4567", // À remplacer
  };

  return (
    <main className="p-4 pb-20 bg-gray-50 min-h-screen">
      {notification && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm shadow-lg z-50">
          {notification}
        </div>
      )}

      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-blue-600">
              ← Retour
            </Link>
            <h1 className="font-bold text-xl">Ma Boutique</h1>
          </div>
        </div>
      </header>

      <section className="bg-white rounded-lg p-4 shadow-sm mb-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl">
            {merchantProfile.name.charAt(0)}
          </div>
          <div>
            <h2 className="font-bold text-lg">{merchantProfile.name}</h2>
            <p className="text-sm text-gray-500">{merchantProfile.category}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Chiffre du mois</p>
            <p className="font-bold text-lg">25 400 DA</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500">Clients</p>
            <p className="font-bold text-lg">47</p>
          </div>
        </div>

        <div className="flex justify-center">
          <Link href="/rapports" className="text-sm text-blue-600">
            Voir tous les rapports →
          </Link>
        </div>
      </section>

      <div className="flex border-b mb-5">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-1 py-2 text-center text-sm ${
            activeTab === "profile"
              ? "border-b-2 border-blue-500 font-medium"
              : "text-gray-500"
          }`}
        >
          Informations
        </button>
        <button
          onClick={() => setActiveTab("subscription")}
          className={`flex-1 py-2 text-center text-sm ${
            activeTab === "subscription"
              ? "border-b-2 border-blue-500 font-medium"
              : "text-gray-500"
          }`}
        >
          Abonnement
        </button>
      </div>

      {activeTab === "profile" && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-bold mb-4">Informations de la boutique</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Adresse</p>
              <p className="text-sm text-gray-600 mt-1">{storeData.address}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Contact</p>
              <p className="text-sm text-gray-600 mt-1">{storeData.phone}</p>
              <p className="text-sm text-gray-600">{storeData.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Propriétaire</p>
              <p className="text-sm text-gray-600 mt-1">{storeData.owner}</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-yellow-500 text-xl">⚠️</span>
                <div>
                  <p className="text-sm font-medium text-yellow-700">
                    Action requise
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Veuillez mettre à jour votre attestation d'assurance qui
                    expire dans 15 jours.
                  </p>
                  <button className="mt-2 text-xs text-purple-600 underline">
                    Téléverser le document
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "subscription" && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-bold mb-4">Votre abonnement</h2>
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-4 text-white mb-5">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="font-bold text-lg">Premium</p>
                <p className="text-sm text-purple-100">
                  Expire le {storeData.subscriptionEndDate}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                ⭐
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <button className="w-full py-2 bg-purple-600 text-white rounded-lg">
              Renouveler mon abonnement
            </button>
            <button className="w-full py-2 text-purple-600 mt-2">
              Changer de forfait
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default BoutiquePage;
