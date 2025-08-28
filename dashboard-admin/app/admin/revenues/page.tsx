'use client'

import { useState } from 'react';
import { 
  DollarSign, 
  Filter, 
  Download, 
  Calendar, 
  Search, 
  ChevronDown, 
  PieChart,
  BarChart3,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import { platformRevenues } from '@/lib/mock-data';
import ChartComponent from '@/components/admin/ChartComponent';

// Interface pour le tableau historique
interface CommissionHistoryEntry {
  id: string;
  date: string;  // ISO date
  type: 'payment' | 'withdrawal' | 'transfer' | 'recharge';
  transactionAmount: number;
  commissionAmount: number;
  commissionRate: string;
  userId?: string;
  userName?: string;
  merchantId?: string;
  merchantName?: string;
  details: string;
}

export default function RevenuesPage() {
  const [period, setPeriod] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Données simulées pour l'historique des commissions
  const commissionHistory: CommissionHistoryEntry[] = [
    {
      id: 'COM00123',
      date: '2025-05-14T13:45:20',
      type: 'payment',
      transactionAmount: 15600.00,
      commissionAmount: 234.00,
      commissionRate: '1.5%',
      userId: 'U00456',
      userName: 'Ahmed Benali',
      merchantId: 'M00123',
      merchantName: 'Café de Paris',
      details: 'Paiement en magasin'
    },
    {
      id: 'COM00122',
      date: '2025-05-14T11:32:15',
      type: 'withdrawal',
      transactionAmount: 32500.00,
      commissionAmount: 325.00,
      commissionRate: '1.0%',
      merchantId: 'M00321',
      merchantName: 'Librairie Moderne',
      details: 'Retrait vers compte bancaire'
    },
    {
      id: 'COM00121',
      date: '2025-05-13T16:15:40',
      type: 'transfer',
      transactionAmount: 1200.00,
      commissionAmount: 5.00,
      commissionRate: '5 DZD',
      userId: 'U00212',
      userName: 'Karim Hamadi',
      details: 'Virement instantané'
    },
    {
      id: 'COM00120',
      date: '2025-05-13T10:50:12',
      type: 'payment',
      transactionAmount: 8750.00,
      commissionAmount: 131.25,
      commissionRate: '1.5%',
      userId: 'U00189',
      userName: 'Sofia Merad',
      merchantId: 'M00045',
      merchantName: 'Épicerie du Quartier',
      details: 'Paiement en magasin'
    },
    {
      id: 'COM00119',
      date: '2025-05-12T18:22:05',
      type: 'transfer',
      transactionAmount: 2500.00,
      commissionAmount: 5.00,
      commissionRate: '5 DZD',
      userId: 'U00212',
      userName: 'Karim Hamadi',
      details: 'Virement instantané'
    },
    {
      id: 'COM00118',
      date: '2025-05-12T14:15:30',
      type: 'payment',
      transactionAmount: 5300.00,
      commissionAmount: 79.50,
      commissionRate: '1.5%',
      userId: 'U00456',
      userName: 'Ahmed Benali',
      merchantId: 'M00023',
      merchantName: 'La Boulangerie',
      details: 'Paiement en magasin'
    },
    {
      id: 'COM00117',
      date: '2025-05-11T09:40:22',
      type: 'withdrawal',
      transactionAmount: 25000.00,
      commissionAmount: 250.00,
      commissionRate: '1.0%',
      merchantId: 'M00123',
      merchantName: 'Café de Paris',
      details: 'Retrait vers compte bancaire'
    },
    {
      id: 'COM00116',
      date: '2025-05-10T14:30:10',
      type: 'recharge',
      transactionAmount: 10000.00,
      commissionAmount: 0.00,
      commissionRate: '0%',
      userId: 'U00456',
      userName: 'Ahmed Benali',
      details: 'Recharge compte'
    },
    {
      id: 'COM00115',
      date: '2025-05-09T11:20:45',
      type: 'payment',
      transactionAmount: 4200.00,
      commissionAmount: 63.00,
      commissionRate: '1.5%',
      userId: 'U00189',
      userName: 'Sofia Merad',
      merchantId: 'M00045',
      merchantName: 'Épicerie du Quartier',
      details: 'Paiement en magasin'
    },
    {
      id: 'COM00114',
      date: '2025-05-08T16:15:30',
      type: 'transfer',
      transactionAmount: 3000.00,
      commissionAmount: 5.00,
      commissionRate: '5 DZD',
      userId: 'U00189',
      userName: 'Sofia Merad',
      details: 'Virement instantané'
    }
  ];

  // Filtrer les données
  const filteredData = commissionHistory.filter(entry => {
    // Filtre par type
    if (filterType !== 'all' && entry.type !== filterType) {
      return false;
    }

    // Filtre par recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        entry.id.toLowerCase().includes(searchLower) ||
        entry.userName?.toLowerCase().includes(searchLower) ||
        entry.merchantName?.toLowerCase().includes(searchLower) ||
        entry.details.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  // Trier les données
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortField === 'date') {
      return sortDirection === 'asc' 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortField === 'amount') {
      return sortDirection === 'asc'
        ? a.commissionAmount - b.commissionAmount
        : b.commissionAmount - a.commissionAmount;
    }
    return 0;
  });

  // Calculer les statistiques de commission
  const totalCommissions = filteredData.reduce((sum, entry) => sum + entry.commissionAmount, 0);
  const paymentCommissions = filteredData
    .filter(entry => entry.type === 'payment')
    .reduce((sum, entry) => sum + entry.commissionAmount, 0);
  const withdrawalCommissions = filteredData
    .filter(entry => entry.type === 'withdrawal')
    .reduce((sum, entry) => sum + entry.commissionAmount, 0);
  const transferCommissions = filteredData
    .filter(entry => entry.type === 'transfer')
    .reduce((sum, entry) => sum + entry.commissionAmount, 0);

  // Données pour les graphiques
  const commissionByTypeData = {
    labels: ['Paiements', 'Retraits', 'Virements'],
    datasets: [
      {
        data: [paymentCommissions, withdrawalCommissions, transferCommissions],
        backgroundColor: ['#4DD0E1', '#66BB6A', '#FFA726'],
        borderWidth: 1,
        borderColor: '#fff',
      },
    ],
  };

  // Format monétaire
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-DZ', { 
      style: 'currency', 
      currency: 'DZD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-DZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simuler un rafraîchissement des données
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center">
          <DollarSign className="mr-2 text-dinary-turquoise" size={24} />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Revenus de la plateforme</h1>
            <p className="text-sm text-gray-500 mt-1">
              Suivez toutes vos sources de revenus et analysez les tendances
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={isRefreshing}
          >
            <RefreshCw size={18} className={`text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          
          <div className="relative inline-block">
            <select 
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="appearance-none border rounded-lg pl-3 pr-8 py-2 bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-dinary-turquoise focus:border-dinary-turquoise focus:outline-none"
            >
              <option value="day">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
              <option value="year">Cette année</option>
              <option value="all">Tout</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown size={16} />
            </div>
          </div>
          
          <button className="flex items-center px-3 py-2 bg-dinary-turquoise hover:bg-dinary-turquoise/90 text-white rounded-lg">
            <Download size={16} className="mr-2" />
            Exporter
          </button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Commissions totales</p>
          <h3 className="text-xl font-bold">{formatCurrency(totalCommissions)}</h3>
          <div className="flex items-center mt-2 text-xs text-green-500">
            <ArrowUpRight size={14} className="mr-1" />
            <span>+5.3% vs période précédente</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Commissions paiements</p>
          <h3 className="text-xl font-bold">{formatCurrency(paymentCommissions)}</h3>
          <div className="flex items-center mt-2 text-xs text-green-500">
            <ArrowUpRight size={14} className="mr-1" />
            <span>+6.2% vs période précédente</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Commissions retraits</p>
          <h3 className="text-xl font-bold">{formatCurrency(withdrawalCommissions)}</h3>
          <div className="flex items-center mt-2 text-xs text-green-500">
            <ArrowUpRight size={14} className="mr-1" />
            <span>+3.1% vs période précédente</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Frais de virements</p>
          <h3 className="text-xl font-bold">{formatCurrency(transferCommissions)}</h3>
          <div className="flex items-center mt-2 text-xs text-red-500">
            <ArrowUpRight size={14} className="mr-1 rotate-180" />
            <span>-1.4% vs période précédente</span>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800">Répartition des commissions</h3>
            <p className="text-sm text-gray-500">Par type de transaction</p>
          </div>
          <div className="h-64">
            <ChartComponent 
              type="pie"
              data={commissionByTypeData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      boxWidth: 12,
                      padding: 15,
                      usePointStyle: true
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context: any) {
                        const value = context.raw;
                        const percentage = ((value / totalCommissions) * 100).toFixed(1);
                        return `${formatCurrency(value)} (${percentage}%)`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800">Tendance des commissions</h3>
            <p className="text-sm text-gray-500">Suivi mensuel</p>
          </div>
          <div className="h-64">
            <ChartComponent 
              type="line"
              data={platformRevenues.commissionsChartData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      boxWidth: 12,
                      padding: 15,
                      usePointStyle: true
                    }
                  }
                },
                scales: {
                  y: {
                    ticks: {
                      callback: function(value: any) {
                        return value.toLocaleString('fr-DZ') + ' DZD';
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-5">
          <h3 className="text-lg font-medium text-gray-800">Historique détaillé des commissions</h3>
          
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-10 pr-3 py-2 border rounded-lg w-full md:w-64 focus:ring-2 focus:ring-dinary-turquoise focus:border-dinary-turquoise"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none border rounded-lg px-3 py-2 pr-8 bg-white text-gray-800 focus:ring-2 focus:ring-dinary-turquoise focus:border-dinary-turquoise"
              >
                <option value="all">Tous les types</option>
                <option value="payment">Paiements</option>
                <option value="withdrawal">Retraits</option>
                <option value="transfer">Virements</option>
                <option value="recharge">Recharges</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown size={16} />
              </div>
            </div>
            
            <button className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
              <Filter size={16} className="mr-2 text-gray-600" />
              Plus de filtres
            </button>
          </div>
        </div>
        
        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('date')}
                >
                  <div className="flex items-center">
                    Date
                    {sortField === 'date' && (
                      sortDirection === 'asc' 
                      ? <ArrowUp size={14} className="ml-1" /> 
                      : <ArrowDown size={14} className="ml-1" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant transaction
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => toggleSort('amount')}
                >
                  <div className="flex items-center">
                    Commission
                    {sortField === 'amount' && (
                      sortDirection === 'asc' 
                      ? <ArrowUp size={14} className="ml-1" /> 
                      : <ArrowDown size={14} className="ml-1" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taux
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client/Marchand
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Détails
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(entry.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      entry.type === 'payment' ? 'bg-blue-100 text-blue-800' :
                      entry.type === 'withdrawal' ? 'bg-green-100 text-green-800' :
                      entry.type === 'transfer' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {entry.type === 'payment' ? 'Paiement' :
                       entry.type === 'withdrawal' ? 'Retrait' :
                       entry.type === 'transfer' ? 'Virement' :
                       'Recharge'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(entry.transactionAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {entry.commissionAmount > 0 ? '+' : ''}{formatCurrency(entry.commissionAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.commissionRate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.merchantName ? (
                      <span className="text-dinary-turquoise hover:underline cursor-pointer">
                        {entry.merchantName}
                      </span>
                    ) : entry.userName ? (
                      <span className="text-dinary-turquoise hover:underline cursor-pointer">
                        {entry.userName}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="py-3 flex items-center justify-between border-t border-gray-200 mt-4">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Précédent
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Suivant
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Affichage de <span className="font-medium">1</span> à <span className="font-medium">{sortedData.length}</span> sur <span className="font-medium">{sortedData.length}</span> résultats
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Précédent</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-dinary-turquoise text-sm font-medium text-white">
                  2
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Suivant</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
