'use client';

import React from 'react';
import { X, Star, Award, TrendingUp, CreditCard, Calendar, MapPin, Phone, Mail, ExternalLink, Users, Store } from 'lucide-react';
import { format } from 'date-fns';
import UserLevelSystem from './UserLevelSystem';

interface Transaction {
  id: string;
  amount: number;
  date: string;
  [key: string]: any;
}

interface MerchantProps {
  merchant: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
    category?: string;
    status?: string;
    registered?: string;
    lastActive?: string;
    balance?: number;
    points?: number;
    level?: number;
    starPoints?: number;
    transactions?: Transaction[];
    rating?: number;
    [key: string]: any;
  };
  onClose: () => void;
}

const MerchantDetailModal: React.FC<MerchantProps> = ({ merchant, onClose }) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMM yyyy');
  };

  // Statistiques du commerçant
  const merchantStats = {
    avgTransactionValue: 27.5, // Valeur moyenne des transactions
    totalRevenueMonth: 2350.75, // Revenus ce mois
    totalCustomers: 163, // Nombre total de clients
    repeatCustomers: 87, // Clients fidèles
    topProducts: ['Café Expresso', 'Croissant', 'Pain au chocolat'],
    peakHours: '12:00 - 14:00',
  };

  // Calcul du pourcentage de clients fidèles
  const loyaltyPercentage = Math.round((merchantStats.repeatCustomers / merchantStats.totalCustomers) * 100);

  // Génération des étoiles pour l'affichage de la note
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400/50" />);
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-amber-200" />);
      }
    }
    return stars;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-50 border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-amber-500 text-white text-xl flex items-center justify-center font-medium">
              <Store className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {merchant.name}
                <span className={`px-2 py-1 text-xs font-medium rounded-full 
                  ${merchant.status === 'verified' ? 'bg-green-100 text-green-800 border border-green-200' : 
                    merchant.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 
                    'bg-red-100 text-red-800 border border-red-200'}`}>
                  {merchant.status ? merchant.status.charAt(0).toUpperCase() + merchant.status.slice(1) : 'Non spécifié'}
                </span>
                <span className="text-sm text-gray-500">#{merchant.id}</span>
              </h2>
              <div className="flex flex-wrap items-center mt-1 gap-x-4 gap-y-1 text-sm text-gray-600">
                <div className="flex items-center">
                  <Mail size={14} className="mr-1" /> {merchant.email}
                </div>
                <div className="flex items-center">
                  <Phone size={14} className="mr-1" /> {merchant.phone}
                </div>
                <div className="flex items-center">
                  <MapPin size={14} className="mr-1" /> {merchant.address || 'Adresse non spécifiée'}
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Content area with scroll */}
        <div className="overflow-y-auto p-6 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Colonne 1 - Infos générales et système de niveaux */}
            <div className="space-y-6">
              {/* Informations générales */}
              <div className="bg-white border rounded-lg p-5 shadow-sm">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Informations générales</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Catégorie</span>
                    <span className="text-sm font-medium">{merchant.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Inscrit le</span>
                    <span className="text-sm font-medium">{merchant.registered && formatDate(merchant.registered)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Dernière activité</span>
                    <span className="text-sm font-medium">{merchant.lastActive && formatDate(merchant.lastActive)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Transactions</span>
                    <span className="text-sm font-medium">{merchant.transactions?.length?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Note</span>
                    <span className="flex items-center">
                      {renderStars(merchant.rating || 0)}
                      <span className="ml-1 text-sm font-medium">{merchant.rating}</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Solde</span>
                    <span className="text-sm font-medium">{merchant.balance?.toFixed(2)} DZD</span>
                  </div>
                </div>
              </div>
              
              {/* Système de niveaux et points */}
              <UserLevelSystem 
                userType="merchant"
                level={merchant.level || 0}
                points={merchant.points || 0}
                starPoints={merchant.starPoints || 0}
                challenges={[
                  {
                    title: "Champion des paiements",
                    description: "Recevoir 50 paiements cette semaine",
                    progress: 32,
                    total: 50,
                    reward: 15,
                    rewardType: "starPoints",
                    status: "active",
                    daysLeft: 3
                  },
                  {
                    title: "Partenaire élite",
                    description: "Maintenir une note de 4.5+ pendant un mois",
                    progress: 25,
                    total: 30,
                    reward: 100,
                    rewardType: "points",
                    status: "active",
                    daysLeft: 5
                  }
                ]}
              />
            </div>
            
            {/* Colonne 2 - Statistiques de ventes */}
            <div className="bg-white border rounded-lg p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Statistiques</h3>
              </div>
              
              <div className="space-y-6">
                {/* Statistiques financières */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-3">Performance financière</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Panier moyen</p>
                      <p className="text-lg font-semibold">{merchantStats.avgTransactionValue.toFixed(2)} DZD</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Revenus ce mois</p>
                      <p className="text-lg font-semibold">{merchantStats.totalRevenueMonth.toFixed(2)} DZD</p>
                    </div>
                  </div>
                </div>
                
                {/* Statistiques clients */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-3">Clientèle</h4>
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <div className="flex justify-between mb-1">
                      <p className="text-xs text-gray-500">Fidélisation clients</p>
                      <p className="text-xs font-medium">{loyaltyPercentage}%</p>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-2 bg-amber-500 rounded-full" 
                        style={{ width: `${loyaltyPercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{merchantStats.repeatCustomers} clients fidèles</span>
                      <span>{merchantStats.totalCustomers} clients total</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Heure de pointe</p>
                      <p className="text-sm font-medium">{merchantStats.peakHours}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">Nouveaux clients (mois)</p>
                      <p className="text-sm font-medium">+{Math.round(merchantStats.totalCustomers * 0.15)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Produits populaires */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Produits populaires</h4>
                  <ul className="space-y-2">
                    {merchantStats.topProducts.map((product, index) => (
                      <li key={index} className="bg-gray-50 px-3 py-2 rounded-md flex justify-between items-center">
                        <span className="text-sm">{product}</span>
                        <span className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                          #{index + 1}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Colonne 3 - Graphique d'activité */}
            <div className="bg-white border rounded-lg p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Activité récente</h3>
              </div>
              
              {/* Graphique d'activité */}
              <div className="h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-500">
                Graphique d'activité (placeholder)
              </div>
              
              {/* Événements récents */}
              <div className="space-y-3 mt-6">
                <h4 className="text-sm font-medium text-gray-600">Derniers événements</h4>
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 p-1.5 rounded-full">
                      <CreditCard size={14} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">24 transactions</span> effectuées aujourd'hui
                      </p>
                      <p className="text-xs text-gray-500">il y a 2 heures</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-1.5 rounded-full">
                      <Users size={14} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">5 nouveaux clients</span> aujourd'hui
                      </p>
                      <p className="text-xs text-gray-500">il y a 5 heures</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-amber-100 p-1.5 rounded-full">
                      <Star size={14} className="text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">Nouvelle note 5 étoiles</span> reçue
                      </p>
                      <p className="text-xs text-gray-500">il y a 1 jour</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-100 p-1.5 rounded-full">
                      <Award size={14} className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">Niveau 2</span> atteint
                      </p>
                      <p className="text-xs text-gray-500">il y a 3 jours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Programmes de fidélité et challenges */}
          <div className="mt-6 border rounded-lg p-5 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Programmes de fidélité</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-medium flex items-center">
                    <Star className="h-4 w-4 text-amber-500 mr-1.5" />
                    Programme "Clients fidèles"
                  </h4>
                  <span className="badge-active">Actif</span>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  Offrir une réduction de 10% après 5 achats chez {merchant.name}
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">78 participants actifs</span>
                  <span className="text-amber-700 font-medium">32 récompenses distribuées</span>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-medium flex items-center">
                    <Calendar className="h-4 w-4 text-gray-600 mr-1.5" />
                    Programme "Happy Hour"
                  </h4>
                  <span className="badge-inactive">Inactif</span>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  Points doublés pendant les heures creuses (15h-17h)
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Durée: 2h par jour</span>
                  <button className="text-dinary-turquoise font-medium">Activer</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer avec actions */}
        <div className="bg-gray-50 border-t px-6 py-4 flex justify-between items-center sticky bottom-0">
          <div className="flex space-x-2">
            <button 
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center text-sm"
            >
              <ExternalLink size={16} className="mr-2" />
              Espace commerçant
            </button>
            <button 
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md flex items-center text-sm hover:bg-blue-100"
            >
              <Mail size={16} className="mr-2" />
              Contacter
            </button>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-amber-50 text-amber-600 rounded-md flex items-center text-sm hover:bg-amber-100">
              <TrendingUp size={16} className="mr-2" />
              Ajouter des points
            </button>
            <button className="px-4 py-2 bg-green-50 text-green-600 rounded-md flex items-center text-sm hover:bg-green-100">
              <Award size={16} className="mr-2" />
              Modifier niveau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantDetailModal;
