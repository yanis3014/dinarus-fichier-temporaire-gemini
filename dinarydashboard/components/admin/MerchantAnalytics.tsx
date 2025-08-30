'use client';

import { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Clock, TrendingUp, Users, ShoppingBag } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface MerchantAnalyticsProps {
  className?: string;
}

export default function MerchantAnalytics({ className = '' }: MerchantAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [activeTab, setActiveTab] = useState<'traffic' | 'sales' | 'ratings'>('traffic');

  const trafficData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Visiteurs',
        data: [150, 230, 180, 290, 320, 450, 380],
        backgroundColor: 'rgba(0, 165, 165, 0.5)',
        borderColor: '#00a5a5',
        borderWidth: 2,
      },
    ],
  };

  const salesData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Ventes',
        data: [1200, 1900, 1600, 2100, 2400, 3200, 2800],
        backgroundColor: 'rgba(52, 211, 153, 0.5)',
        borderColor: '#34d399',
        borderWidth: 2,
      },
    ],
  };

  const ratingData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Avis',
        data: [4.2, 4.5, 4.3, 4.7, 4.6, 4.8, 4.4],
        backgroundColor: 'rgba(251, 191, 36, 0.5)',
        borderColor: '#fbbf24',
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const quickStats = [
    {
      icon: Users,
      label: 'Visiteurs aujourd\'hui',
      value: '342',
      trend: '+12%',
      color: 'text-blue-500',
    },
    {
      icon: ShoppingBag,
      label: 'Commandes',
      value: '28',
      trend: '+8%',
      color: 'text-green-500',
    },
    {
      icon: TrendingUp,
      label: 'Taux de conversion',
      value: '8.2%',
      trend: '+2%',
      color: 'text-purple-500',
    },
    {
      icon: Clock,
      label: 'Temps moyen',
      value: '24min',
      trend: '-5%',
      color: 'text-orange-500',
    },
  ];

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      {/* En-tête avec sélection de période */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Analyses des commerçants</h2>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-1.5 border rounded-md text-sm focus:ring-2 focus:ring-dinary-turquoise focus:border-transparent"
          >
            <option value="day">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
          </select>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {quickStats.map((stat, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color} mr-2`} />
              <span className="text-sm text-gray-600">{stat.label}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold">{stat.value}</span>
              <span className={`text-sm ${
                stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Onglets des graphiques */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('traffic')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            activeTab === 'traffic'
              ? 'bg-dinary-turquoise text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Trafic
        </button>
        <button
          onClick={() => setActiveTab('sales')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            activeTab === 'sales'
              ? 'bg-dinary-turquoise text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Ventes
        </button>
        <button
          onClick={() => setActiveTab('ratings')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            activeTab === 'ratings'
              ? 'bg-dinary-turquoise text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Avis
        </button>
      </div>

      {/* Zone du graphique */}
      <div className="h-[300px]">
        {activeTab === 'traffic' && <Bar data={trafficData} options={options} />}
        {activeTab === 'sales' && <Bar data={salesData} options={options} />}
        {activeTab === 'ratings' && <Line data={ratingData} options={options} />}
      </div>
    </div>
  );
}
