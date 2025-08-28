'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Données simplifiées pour la démo
const storeData = {
  name: "Café La Perle",
  owner: "Mohamed Cherif",
  category: "Restaurant & Café",
  address: "12 Rue des Lilas, Alger",
  phone: "+213 55 123 4567",
  email: "contact@cafelaperle.com",
  subscriptionEndDate: "15 juin 2025",
  // Nouvelles données
  openingHours: {
    monday: { open: "08:00", close: "20:00" },
    tuesday: { open: "08:00", close: "20:00" },
    wednesday: { open: "08:00", close: "20:00" },
    thursday: { open: "08:00", close: "20:00" },
    friday: { open: "08:00", close: "22:00" },
    saturday: { open: "09:00", close: "22:00" },
    sunday: { open: "10:00", close: "18:00" }
  },
  badges: [
    { name: "Éco-responsable", icon: "🌱", color: "green" },
    { name: "Service Premium", icon: "⭐", color: "gold" },
    { name: "Livraison Rapide", icon: "🚚", color: "blue" },
    { name: "Top 10 Local", icon: "🏆", color: "orange" }
  ],
  products: [
    { id: 1, name: "Café Arabica Premium", price: 450, image: "/placeholder-coffee.jpg", rating: 4.8 },
    { id: 2, name: "Croissant au Beurre", price: 220, image: "/placeholder-croissant.jpg", rating: 4.5 },
    { id: 3, name: "Sandwich Club", price: 550, image: "/placeholder-sandwich.jpg", rating: 4.6 },
    { id: 4, name: "Salade César", price: 650, image: "/placeholder-salad.jpg", rating: 4.7 },
    { id: 5, name: "Thé à la Menthe", price: 300, image: "/placeholder-tea.jpg", rating: 4.9 },
    { id: 6, name: "Jus d'Orange Frais", price: 350, image: "/placeholder-juice.jpg", rating: 4.8 }
  ]
};

const BoutiquePage = () => {
  const [notification, setNotification] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'products' ou 'subscription'
  
  // Afficher une notification
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 2000);
  };
  return (
    <main className="p-4 pb-20 bg-gray-50 min-h-screen max-w-md mx-auto">
      {/* Notification */}
      {notification && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm shadow-lg z-50 animate-fade-in">
          {notification}
        </div>
      )}

      {/* En-tête */}
      <header className="mb-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/" className="text-blue-600">
              ← Retour
            </Link>
            <h1 className="font-bold text-xl">Ma Boutique</h1>
          </div>
        </div>
      </header>
      
      {/* Aperçu du profil */}
      <section className="bg-white rounded-lg p-4 shadow-sm mb-5">
        <div className="flex flex-col items-center text-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl">
            {storeData.name.charAt(0)}
          </div>
          <div className="text-center">
            <h2 className="font-bold text-lg">{storeData.name}</h2>
            <p className="text-sm text-gray-500">{storeData.category}</p>
          </div>
          
          {/* Badges du commerce */}
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {storeData.badges.map((badge, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-${badge.color}-100 text-${badge.color}-700`}
                title={badge.name}
              >
                <span>{badge.icon}</span>
                <span>{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Statistiques simples */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <p className="text-xs text-gray-500">Chiffre du mois</p>
            <p className="font-bold text-lg">25 400 DA</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-center">
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
      
      {/* Navigation par onglets */}
      <div className="flex border-b mb-5">
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 text-center text-sm ${activeTab === 'profile' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
        >
          Informations
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-2 text-center text-sm ${activeTab === 'products' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
        >
          Produits
        </button>
        <button 
          onClick={() => setActiveTab('subscription')}
          className={`flex-1 py-2 text-center text-sm ${activeTab === 'subscription' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
        >
          Abonnement
        </button>
      </div>

      {/* Onglet Informations */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-xl p-4 shadow-sm animate-fade-in">
          <h2 className="font-bold mb-4">Informations de la boutique</h2>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm font-medium">Adresse</p>
              <p className="text-sm text-gray-600 mt-1">{storeData.address}</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium">Contact</p>
              <p className="text-sm text-gray-600 mt-1">{storeData.phone}</p>
              <p className="text-sm text-gray-600">{storeData.email}</p>
            </div>
            
            {/* Horaires d'ouverture */}
            <div>
              <p className="text-sm font-medium text-center mb-2">Horaires d'ouverture</p>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm">
                    <p className="font-medium">Lundi</p>
                    <p className="text-gray-600">{storeData.openingHours.monday.open} - {storeData.openingHours.monday.close}</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Mardi</p>
                    <p className="text-gray-600">{storeData.openingHours.tuesday.open} - {storeData.openingHours.tuesday.close}</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Mercredi</p>
                    <p className="text-gray-600">{storeData.openingHours.wednesday.open} - {storeData.openingHours.wednesday.close}</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Jeudi</p>
                    <p className="text-gray-600">{storeData.openingHours.thursday.open} - {storeData.openingHours.thursday.close}</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Vendredi</p>
                    <p className="text-gray-600">{storeData.openingHours.friday.open} - {storeData.openingHours.friday.close}</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Samedi</p>
                    <p className="text-gray-600">{storeData.openingHours.saturday.open} - {storeData.openingHours.saturday.close}</p>
                  </div>
                  <div className="text-sm col-span-2">
                    <p className="font-medium">Dimanche</p>
                    <p className="text-gray-600">{storeData.openingHours.sunday.open} - {storeData.openingHours.sunday.close}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium">Propriétaire</p>
              <p className="text-sm text-gray-600 mt-1">{storeData.owner}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium">Conformité</p>
              <div className="bg-gray-50 rounded-lg p-3 mt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Vérification d'identité</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Vérifié</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Vérification d'adresse</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Vérifié</span>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-yellow-500 text-xl">⚠️</span>
                <div>
                  <p className="text-sm font-medium text-yellow-700">Action requise</p>
                  <p className="text-xs text-yellow-700 mt-1">Veuillez mettre à jour votre attestation d'assurance qui expire dans 15 jours.</p>
                  <button className="mt-2 text-xs text-purple-600 underline">Téléverser le document</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Onglet Produits */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-xl p-4 shadow-sm animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">Nos produits</h2>
            <button className="text-xs bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600">
              Gérer les produits
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {storeData.products.map((product) => (
              <div key={product.id} className="bg-gray-50 p-2 rounded-lg">
                <div className="bg-gray-200 h-24 rounded-md mb-2 flex items-center justify-center text-gray-400">
                  {/* Utiliser Image de Next.js si des images sont disponibles */}
                  <span>[Image Produit]</span>
                </div>
                <div>
                  <h3 className="font-medium text-sm truncate">{product.name}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <p className="font-bold text-sm">{product.price} DA</p>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-xs">{product.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-center">
            <Link href="/boutique/produits" className="text-sm text-blue-600">
              Voir tous les produits →
            </Link>
          </div>
        </div>
      )}
      
      {/* Onglet Abonnement */}
      {activeTab === 'subscription' && (
        <div className="bg-white rounded-xl p-4 shadow-sm animate-fade-in">
          <h2 className="font-bold mb-4 text-center">Votre abonnement</h2>
          
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-4 text-white mb-5">
            <div className="flex flex-col items-center text-center mb-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-2">
                ⭐
              </div>
              <div>
                <p className="font-bold text-lg">Premium</p>
                <p className="text-sm text-purple-100">Expire le {storeData.subscriptionEndDate}</p>
              </div>
            </div>
            <div className="bg-white/10 h-1.5 rounded-full w-full overflow-hidden mb-2">
              <div className="bg-white h-full rounded-full" style={{ width: '30%' }}></div>
            </div>
            <p className="text-xs text-right">30 jours restants</p>
          </div>
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-sm font-medium mb-2">Avantages inclus</h3>
              <div className="space-y-2 flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">Taux de commission réduit (1.5%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">Accès aux statistiques avancées</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">Support prioritaire</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm">Gestion des employés (jusqu'à 5)</span>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <button className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                Renouveler mon abonnement
              </button>
              <button className="w-full py-2 text-purple-600 mt-2 hover:bg-purple-50 transition">
                Changer de forfait
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default BoutiquePage;