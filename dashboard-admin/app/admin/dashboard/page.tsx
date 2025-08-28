'use client'

import { useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import StatCard from '@/components/admin/StatCard';
import ChartComponent from '@/components/admin/ChartComponent';
import {
  Users, CreditCard, Store, TrendingUp,
  AlertTriangle, CheckCircle, Clock, RefreshCw, 
  LayoutGrid, Eye
} from 'lucide-react';

// Version de base fonctionnelle qui sera améliorée progressivement
export default function DashboardPage() {
  // État local
  const [activeView, setActiveView] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Mock data
  const mockStats = {
    totalUsers: { value: 1234, change: 5.2 },
    activeTransactions: { value: 567, change: -2.1 },
    dailyRevenue: { value: 89012, change: 7.3 },
    activeMerchants: { value: 89, change: 0.5 },
    alerts: [
      { id: '1', type: 'warning', message: 'Pic de transactions détecté', time: '5 minutes' },
      { id: '2', type: 'success', message: 'Mise à jour du système réussie', time: '1 heure' },
      { id: '3', type: 'info', message: 'Nouveau marchand en attente', time: '3 heures' }
    ],
    chartsData: {
      transactions: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
        datasets: [{
          label: 'Transactions',
          data: [1200, 1900, 3000, 5000, 4000, 6000],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      userActivity: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
        datasets: [{
          label: 'Utilisateurs actifs',
          data: [500, 800, 1200, 1800, 1500, 2000],
          backgroundColor: 'rgba(53, 162, 235, 0.5)'
        }]
      },
      revenueDistribution: {
        labels: ['Paiements', 'Transferts', 'Abonnements', 'Autres'],
        datasets: [{
          data: [40, 30, 20, 10],
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(255, 99, 132, 0.7)'
          ]
        }]
      }
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
          <p className="text-sm text-gray-500 mt-1">Vue d'ensemble de la plateforme en temps réel</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className={`p-2 text-gray-500 rounded-lg hover:bg-gray-100 transition-colors ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            disabled={isRefreshing}
          >
            <RefreshCw size={20} />
          </button>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveView('overview')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                activeView === 'overview' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              <Eye className="w-4 h-4" />
              Vue Standard
            </button>
            <button
              onClick={() => setActiveView('advanced')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                activeView === 'advanced' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Vue Avancée
            </button>
          </div>
          <select
            className="px-3 py-2 bg-white border rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-dinary-turquoise"
          >
            <option value="day">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
        </div>
      </div>

      {activeView === 'overview' ? (
        <>
          {/* Stats Cards */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Utilisateurs Total"
              value={mockStats.totalUsers.value}
              change={mockStats.totalUsers.change}
              icon={<Users className="w-6 h-6" />}
              prefix=""
            />
            <StatCard
              title="Transactions Actives"
              value={mockStats.activeTransactions.value}
              change={mockStats.activeTransactions.change}
              icon={<CreditCard className="w-6 h-6" />}
              prefix=""
            />
            <StatCard
              title="Revenus du Jour"
              value={mockStats.dailyRevenue.value}
              change={mockStats.dailyRevenue.change}
              icon={<TrendingUp className="w-6 h-6" />}
              prefix="DA "
            />
            <StatCard
              title="Marchands Actifs"
              value={mockStats.activeMerchants.value}
              change={mockStats.activeMerchants.change}
              icon={<Store className="w-6 h-6" />}
              prefix=""
            />
          </div>

          {/* Charts */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Aperçu des Transactions
              </h3>
              <div className="h-[300px] w-full">
                <ChartComponent 
                  type="line"
                  data={mockStats.chartsData.transactions}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true
                  }}
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Activité Utilisateurs
              </h3>
              <div className="h-[300px] w-full">
                <ChartComponent 
                  type="bar"
                  data={mockStats.chartsData.userActivity}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true
                  }}
                />
              </div>
            </div>
          </div>

          {/* Revenue Distribution and Alerts */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Distribution des Revenus
              </h3>
              <div className="aspect-square max-w-[400px] mx-auto">
                <ChartComponent 
                  type="doughnut"
                  data={mockStats.chartsData.revenueDistribution}
                  options={{
                    responsive: true
                  }}
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Alertes Système
              </h3>
              <div className="space-y-4">
                {mockStats.alerts.map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
                  >
                    {alert.type === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    ) : alert.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <Clock className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">Il y a {alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Vue Avancée */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Vue Avancée</h2>
            <p className="text-gray-600">
              La vue avancée sera implémentée dans une prochaine phase. 
              Nous y ajouterons les composants KPI Avancés, Carte Interactive, 
              Historique des Actions, etc.
            </p>
            <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-lg">
              <p>✨ Fonctionnalités à venir :</p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Dashboard AI Insights</li>
                <li>KPI Avancés</li>
                <li>Carte Interactive</li>
                <li>Demandes en Attente</li>
                <li>Historique des Actions</li>
                <li>Détection de Comportements Suspects</li>
                <li>Objectifs Hebdomadaires</li>
                <li>Statistiques de Gamification</li>
                <li>Centre de Contrôle Rapide</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}