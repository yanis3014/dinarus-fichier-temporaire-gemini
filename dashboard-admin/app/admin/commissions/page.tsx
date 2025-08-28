'use client';

import { useState, useEffect } from 'react';
import { 
  Euro, 
  TrendingUp, 
  Users, 
  CreditCard,
  Filter,
  Download,
  Plus,
  Search,
  Calendar,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle
} from 'lucide-react';
import commissionService from '@/lib/commissionService';
import {
  Commission,
  CommissionSummary,
  CommissionFilters,
  CommissionType,
  CommissionStatus
} from '@/types/commission';

const commissionTypeLabels: Record<CommissionType, string> = {
  'transaction': 'Transaction',
  'referral': 'Parrainage',
  'merchant_onboarding': 'Onboarding Marchand',
  'user_registration': 'Inscription Utilisateur',
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

const getStatusIcon = (status: CommissionStatus) => {
  switch (status) {
    case 'paid':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'approved':
      return <CheckCircle className="w-4 h-4 text-blue-500" />;
    case 'calculated':
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case 'pending':
      return <Clock className="w-4 h-4 text-gray-500" />;
    case 'disputed':
      return <AlertCircle className="w-4 h-4 text-orange-500" />;
    case 'cancelled':
    case 'expired':
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return <Clock className="w-4 h-4 text-gray-500" />;
  }
};

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [summary, setSummary] = useState<CommissionSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<CommissionFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCommissions, setSelectedCommissions] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [commissionsData, summaryData] = await Promise.all([
        commissionService.getCommissions(filters),
        commissionService.getCommissionSummary()
      ]);
      setCommissions(commissionsData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<CommissionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const handleStatusUpdate = async (commissionId: string, newStatus: CommissionStatus) => {
    try {
      await commissionService.updateCommissionStatus(commissionId, newStatus);
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const handleBulkStatusUpdate = async (status: CommissionStatus) => {
    if (selectedCommissions.length === 0) return;
    
    try {
      await commissionService.bulkUpdateCommissionStatus(selectedCommissions, status);
      setSelectedCommissions([]);
      await loadData();
    } catch (error) {
      console.error('Erreur lors de la mise à jour en lot:', error);
    }
  };

  const toggleCommissionSelection = (commissionId: string) => {
    setSelectedCommissions(prev => 
      prev.includes(commissionId)
        ? prev.filter(id => id !== commissionId)
        : [...prev, commissionId]
    );
  };

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  if (isLoading && !summary) {
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Commissions</h1>
          <p className="text-gray-600">Gérez et suivez toutes les commissions de la plateforme</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Commission
          </button>
        </div>
      </div>

      {/* Statistiques */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Commissions</p>
                <p className="text-2xl font-bold text-gray-900">{summary.totalCommissions}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Montant Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(summary.totalAmount)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Euro className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-2xl font-bold text-orange-600">{summary.pendingCommissions}</p>
                <p className="text-sm text-gray-500">
                  {formatCurrency(summary.pendingAmount)}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commission Moyenne</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(summary.averageCommission)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une commission..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </button>
            {Object.keys(filters).length > 0 && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                Effacer les filtres
              </button>
            )}
          </div>

          {selectedCommissions.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedCommissions.length} sélectionnée(s)
              </span>
              <select
                onChange={(e) => handleBulkStatusUpdate(e.target.value as CommissionStatus)}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
                defaultValue=""
              >
                <option value="" disabled>Changer le statut</option>
                <option value="approved">Approuver</option>
                <option value="paid">Marquer comme payée</option>
                <option value="cancelled">Annuler</option>
              </select>
            </div>
          )}
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={filters.type?.[0] || ''}
                onChange={(e) => handleFilterChange({ 
                  type: e.target.value ? [e.target.value as CommissionType] : undefined 
                })}
              >
                <option value="">Tous les types</option>
                {Object.entries(commissionTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={filters.status?.[0] || ''}
                onChange={(e) => handleFilterChange({ 
                  status: e.target.value ? [e.target.value as CommissionStatus] : undefined 
                })}
              >
                <option value="">Tous les statuts</option>
                {Object.entries(commissionStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={filters.dateFrom || ''}
                onChange={(e) => handleFilterChange({ dateFrom: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={filters.dateTo || ''}
                onChange={(e) => handleFilterChange({ dateTo: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Liste des commissions */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCommissions.length === commissions.length && commissions.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCommissions(commissions.map(c => c.id));
                      } else {
                        setSelectedCommissions([]);
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {commissions.map((commission) => (
                <tr key={commission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCommissions.includes(commission.id)}
                      onChange={() => toggleCommissionSelection(commission.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{commission.id}</div>
                      <div className="text-gray-500 truncate max-w-xs">{commission.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {commissionTypeLabels[commission.type]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {commission.userId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {formatCurrency(commission.calculatedAmount, commission.currency)}
                      </div>
                      <div className="text-gray-500">
                        sur {formatCurrency(commission.amount, commission.currency)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(commission.status)}
                      <span className="ml-2 text-sm text-gray-900">
                        {commissionStatusLabels[commission.status]}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(commission.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {commission.status === 'calculated' && (
                        <button
                          onClick={() => handleStatusUpdate(commission.id, 'approved')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approuver
                        </button>
                      )}
                      {commission.status === 'approved' && (
                        <button
                          onClick={() => handleStatusUpdate(commission.id, 'paid')}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Marquer payée
                        </button>
                      )}
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {commissions.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commission trouvée</h3>
            <p className="text-gray-500">
              {Object.keys(filters).length > 0 
                ? 'Aucune commission ne correspond à vos critères de recherche.'
                : 'Aucune commission n\'a encore été créée.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
