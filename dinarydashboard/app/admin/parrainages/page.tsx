'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  Gift
} from 'lucide-react';

export default function ParrainagesPage() {
  const [activeTab, setActiveTab] = useState('tous');
  
  // Données statistiques de base
  const stats = {
    totalReferrals: 124,
    pendingReferrals: 32,
    completedReferrals: 78,
    rewardedReferrals: 72,
    cancelledReferrals: 14,
    totalRewards: 42500,
    conversionRate: 62.9
  };
  
  // Données de base pour les meilleurs parrains
  const topReferrers = [
    { id: 'user1', name: 'Ahmed Benali', referrals: 14, rewards: 7000 },
    { id: 'user2', name: 'Fatima Khadra', referrals: 12, rewards: 6000 },
    { id: 'user3', name: 'Mohamed Saidi', referrals: 8, rewards: 4000 },
    { id: 'user4', name: 'Amina Taleb', referrals: 7, rewards: 3500 },
    { id: 'user5', name: 'Karim Boudiaf', referrals: 6, rewards: 3000 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Parrainages</h1>
          <p className="text-sm text-gray-500 mt-1">
            Suivez et gérez les parrainages, les conversions et les récompenses
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-medium">Parrainages Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-800">{stats.totalReferrals}</p>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="text-green-600 font-medium">{stats.conversionRate}%</span> taux de conversion
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-medium">En Attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-800">{stats.pendingReferrals}</p>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="text-orange-600 font-medium">
                    {Math.round((stats.pendingReferrals / stats.totalReferrals) * 100)}%
                  </span> du total
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-medium">Récompensés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-800">{stats.rewardedReferrals}</p>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="text-green-600 font-medium">
                    {Math.round((stats.rewardedReferrals / stats.completedReferrals) * 100)}%
                  </span> des complétés
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Gift className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500 font-medium">Récompenses Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-800">{stats.totalRewards.toLocaleString()} DA</p>
                <p className="text-sm text-gray-500 mt-1">
                  <span className="text-blue-600 font-medium">
                    {Math.round(stats.totalRewards / stats.rewardedReferrals).toLocaleString()}
                  </span> par parrainage
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Referrers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Parrains</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 font-medium text-gray-600">Parrain</th>
                  <th className="pb-3 font-medium text-gray-600 text-right">Parrainages</th>
                  <th className="pb-3 font-medium text-gray-600 text-right">Gains</th>
                </tr>
              </thead>
              <tbody>
                {topReferrers.map((referrer, index) => (
                  <tr 
                    key={referrer.id} 
                    className={index !== topReferrers.length - 1 ? "border-b border-gray-100" : ""}
                  >
                    <td className="py-3">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                          index === 0 ? 'bg-yellow-500' : 
                          index === 1 ? 'bg-gray-400' : 
                          index === 2 ? 'bg-amber-700' : 'bg-blue-500'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="ml-3 font-medium">{referrer.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-right font-medium">{referrer.referrals}</td>
                    <td className="py-3 text-right font-medium">{referrer.rewards.toLocaleString()} DA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for statut des parrainages */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="border-b border-gray-200 mb-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            <button
              className={`px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'tous' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('tous')}
            >
              Tous les parrainages
            </button>
            <button
              className={`px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'en_attente' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('en_attente')}
            >
              En attente
            </button>
            <button
              className={`px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'completes' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('completes')}
            >
              Complétés
            </button>
            <button
              className={`px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'recompenses' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('recompenses')}
            >
              Récompensés
            </button>
            <button
              className={`px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'annules' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('annules')}
            >
              Annulés
            </button>
          </div>
        </div>
        
        <div className="py-4">
          <p className="text-gray-500 text-center py-10">
            Contenu détaillé des parrainages à implémenter.
            <br />
            La version complète affichera les parrainages filtrés par statut.
          </p>
        </div>
      </div>
    </div>
  );
}