'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target, 
  Calendar,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
  RefreshCw
} from 'lucide-react';
import commissionService from '@/lib/commissionService';
import {
  CommissionReport,
  CommissionSummary,
  CommissionType,
  CommissionStatus,
  CommissionTrend
} from '@/types/commission';

const commissionTypeLabels: Record<CommissionType, string> = {
  'transaction': 'Transaction',
  'referral': 'Parrainage',
  'merchant_onboarding': 'Onboarding Marchand',
  'user_registration': 'Inscription',
  'subscription': 'Abonnement',
  'affiliate': 'Affilié',
  'performance': 'Performance',
  'bonus': 'Bonus',
  'custom': 'Personnalisé'
};

const commissionStatusLabels: Record<CommissionStatus, string> = {
  'pending': 'En attente',
  'calculated': 'Calculée',
  'approved': 'Approuvée',
  'paid': 'Payée',
  'cancelled': 'Annulée',
  'disputed': 'Contestée',
  'expired': 'Expirée'
};

const periodOptions = [
  { value: '7d', label: '7 derniers jours' },
  { value: '30d', label: '30 derniers jours' },
  { value: '90d', label: '90 derniers jours' },
  { value: '1y', label: '1 an' },
  { value: 'custom', label: 'Période personnalisée' }
];

const getStatusColor = (status: CommissionStatus) => {
  switch (status) {
    case 'paid':
      return 'text-green-600 bg-green-100';
    case 'approved':
      return 'text-blue-600 bg-blue-100';
    case 'pending':
      return 'text-yellow-600 bg-yellow-100';
    case 'cancelled':
      return 'text-red-600 bg-red-100';
    case 'disputed':
      return 'text-orange-600 bg-orange-100';
    case 'expired':
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const getStatusIcon = (status: CommissionStatus) => {
  switch (status) {
    case 'paid':
      return <CheckCircle className="w-4 h-4" />;
    case 'approved':
      return <Target className="w-4 h-4" />;
    case 'pending':
      return <Clock className="w-4 h-4" />;
    case 'cancelled':
      return <XCircle className="w-4 h-4" />;
    case 'disputed':
      return <AlertTriangle className="w-4 h-4" />;
    case 'expired':
      return <XCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;  }
};

export default function CommissionAnalyticsPage() {
  const [report, setReport] = useState<CommissionReport | null>(null);
  const [summary, setSummary] = useState<CommissionSummary | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const [reportData, summaryData] = await Promise.all([
        commissionService.getCommissionReport(selectedPeriod),
        commissionService.getCommissionSummary(selectedPeriod)
      ]);
      setReport(reportData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Erreur lors du chargement des analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatPercentage = (value: number, total: number) => {
    if (total === 0) return '0%';
    return `${((value / total) * 100).toFixed(1)}%`;
  };

  // Calcul des tendances (simulé)
  const calculateTrend = (current: number, previous: number = current * 0.85) => {
    const change = ((current - previous) / previous) * 100;
    return {
      percentage: Math.abs(change).toFixed(1),
      isPositive: change >= 0
    };
  };

  if (isLoading && !report) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics des Commissions</h1>
          <p className="text-gray-600">Analysez les performances de votre système de commission</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {periodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Exporter le rapport
          </button>
        </div>
      </div>

      {/* Métriques principales */}
      {summary && report && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Commissions Totales</p>
                  <p className="text-2xl font-bold text-gray-900">{report.totalCommissions}</p>
                  <div className="flex items-center mt-1">
                    {calculateTrend(report.totalCommissions).isPositive ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${
                      calculateTrend(report.totalCommissions).isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {calculateTrend(report.totalCommissions).percentage}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs période précédente</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Montant Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(report.totalAmount)}
                  </p>
                  <div className="flex items-center mt-1">
                    {calculateTrend(report.totalAmount).isPositive ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${
                      calculateTrend(report.totalAmount).isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {calculateTrend(report.totalAmount).percentage}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs période précédente</span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Commission Moyenne</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(report.totalAmount / Math.max(report.totalCommissions, 1))}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+12.3%</span>
                    <span className="text-sm text-gray-500 ml-1">vs période précédente</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">Top Earners</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.topEarners.length}</p>
                  <p className="text-sm text-gray-500">
                    {summary.topEarners.length > 0 && 
                      formatCurrency(summary.topEarners[0].totalEarned)} max
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Répartition par type */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Répartition par Type</h2>
                <PieChart className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {Object.entries(report.byType)
                  .filter(([_, data]) => data.count > 0)
                  .sort((a, b) => b[1].amount - a[1].amount)
                  .map(([type, data]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                        <span className="text-sm font-medium text-gray-700">
                          {commissionTypeLabels[type as CommissionType]}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(data.amount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {data.count} • {formatPercentage(data.amount, report.totalAmount)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Répartition par statut */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Répartition par Statut</h2>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {Object.entries(report.byStatus)
                  .filter(([_, data]) => data.count > 0)
                  .sort((a, b) => b[1].amount - a[1].amount)
                  .map(([status, data]) => {
                    const getStatusColor = (status: string) => {
                      switch (status) {
                        case 'paid': return 'bg-green-500';
                        case 'approved': return 'bg-blue-500';
                        case 'calculated': return 'bg-yellow-500';
                        case 'pending': return 'bg-gray-500';
                        case 'cancelled': case 'expired': return 'bg-red-500';
                        case 'disputed': return 'bg-orange-500';
                        default: return 'bg-gray-400';
                      }
                    };

                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(status)} mr-3`}></div>
                          <span className="text-sm font-medium text-gray-700">
                            {commissionStatusLabels[status as CommissionStatus]}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(data.amount)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {data.count} • {formatPercentage(data.amount, report.totalAmount)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Tendances temporelles */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Évolution des Commissions</h2>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            
            {/* Graphique simplifié avec barres */}
            <div className="grid grid-cols-5 gap-4 h-64">
              {report.trends.map((trend, index) => {
                const maxAmount = Math.max(...report.trends.map(t => t.totalAmount));
                const height = (trend.totalAmount / maxAmount) * 100;
                
                return (
                  <div key={trend.date} className="flex flex-col items-center">
                    <div className="flex-1 flex items-end">
                      <div 
                        className="w-full bg-blue-500 rounded-t"
                        style={{ height: `${height}%`, minHeight: '4px' }}
                        title={`${formatCurrency(trend.totalAmount)} - ${trend.commissionsCount} commissions`}
                      ></div>
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-xs font-medium text-gray-900">
                        {new Date(trend.date).toLocaleDateString('fr-FR', { 
                          day: '2-digit', 
                          month: '2-digit' 
                        })}
                      </p>
                      <p className="text-xs text-gray-500">{trend.commissionsCount}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Earners */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Top Earners</h2>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">
                      Rang
                    </th>
                    <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">
                      Utilisateur
                    </th>
                    <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">
                      Total Gagné
                    </th>
                    <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">
                      Nb Commissions
                    </th>
                    <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase">
                      Moyenne
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {summary.topEarners.map((earner, index) => (
                    <tr key={earner.userId}>
                      <td className="py-3 text-sm">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-3 text-sm font-medium text-gray-900">
                        {earner.userName}
                      </td>
                      <td className="py-3 text-sm text-gray-900">
                        {formatCurrency(earner.totalEarned)}
                      </td>
                      <td className="py-3 text-sm text-gray-500">
                        {earner.commissionsCount}
                      </td>
                      <td className="py-3 text-sm text-gray-500">
                        {formatCurrency(earner.averageCommission)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activité récente */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Activité Récente</h2>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {summary.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'commission_earned' ? 'bg-green-100' :
                    activity.type === 'commission_paid' ? 'bg-blue-100' :
                    'bg-gray-100'
                  }`}>
                    {activity.type === 'commission_earned' && <TrendingUp className="w-4 h-4 text-green-600" />}
                    {activity.type === 'commission_paid' && <DollarSign className="w-4 h-4 text-blue-600" />}
                    {activity.type === 'rule_created' && <Target className="w-4 h-4 text-gray-600" />}
                    {activity.type === 'rule_updated' && <Target className="w-4 h-4 text-gray-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    {activity.amount && (
                      <p className="text-sm font-medium text-green-600">
                        {formatCurrency(activity.amount)}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(activity.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
