'use client';

import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Calendar, 
  Filter, 
  Download, 
  Plus, 
  Search, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  XCircle,
  CreditCard,
  Banknote,
  Smartphone,
  Wallet,
  MoreVertical,
  Eye,
  RefreshCw,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Send,
  Edit3,
  Trash2,
  Settings
} from 'lucide-react';
import commissionService from '@/lib/commissionService';
import {
  CommissionPayout,
  PayoutFilters,
  PayoutStatus,
  PayoutMethod
} from '@/types/commission';

const payoutMethodLabels: Record<PayoutMethod, string> = {
  'bank_transfer': 'Virement bancaire',
  'paypal': 'PayPal',
  'crypto': 'Cryptomonnaie',
  'internal_wallet': 'Portefeuille interne',
  'check': 'Chèque',
  'mobile_money': 'Mobile Money'
};

const payoutStatusLabels: Record<PayoutStatus, string> = {
  'scheduled': 'Programmé',
  'processing': 'En cours',
  'completed': 'Complété',
  'failed': 'Échoué',
  'cancelled': 'Annulé'
};

const payoutMethodIcons: Record<PayoutMethod, React.ReactNode> = {
  'bank_transfer': <Banknote className="w-4 h-4" />,
  'paypal': <CreditCard className="w-4 h-4" />,
  'crypto': <DollarSign className="w-4 h-4" />,
  'internal_wallet': <Wallet className="w-4 h-4" />,
  'check': <FileText className="w-4 h-4" />,
  'mobile_money': <Smartphone className="w-4 h-4" />
};

const getStatusIcon = (status: PayoutStatus) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'processing':
      return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
    case 'scheduled':
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case 'failed':
      return <XCircle className="w-4 h-4 text-red-500" />;
    case 'cancelled':
      return <XCircle className="w-4 h-4 text-gray-500" />;
    default:
      return <Clock className="w-4 h-4 text-gray-500" />;
  }
};

const getMethodIcon = (method: PayoutMethod) => {
  switch (method) {
    case 'bank_transfer':
      return <Banknote className="w-4 h-4 text-blue-600" />;
    case 'paypal':
      return <CreditCard className="w-4 h-4 text-blue-600" />;
    case 'crypto':
      return <DollarSign className="w-4 h-4 text-orange-600" />;
    case 'internal_wallet':
      return <Wallet className="w-4 h-4 text-purple-600" />;
    case 'mobile_money':
      return <Smartphone className="w-4 h-4 text-green-600" />;
    default:
      return <CreditCard className="w-4 h-4 text-gray-600" />;
  }
};

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<CommissionPayout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<PayoutFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPayouts, setSelectedPayouts] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadPayouts();
  }, [filters]);

  const loadPayouts = async () => {
    try {
      setIsLoading(true);
      const payoutsData = await commissionService.getPayouts(filters);
      setPayouts(payoutsData);
    } catch (error) {
      console.error('Erreur lors du chargement des payouts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<PayoutFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const handleStatusUpdate = async (payoutId: string, newStatus: PayoutStatus) => {
    try {
      await commissionService.updatePayoutStatus(payoutId, newStatus);
      await loadPayouts();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const togglePayoutSelection = (payoutId: string) => {
    setSelectedPayouts(prev => 
      prev.includes(payoutId)
        ? prev.filter(id => id !== payoutId)
        : [...prev, payoutId]
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

  // Calculs pour les statistiques
  const stats = {
    total: payouts.length,
    totalAmount: payouts.reduce((sum, p) => sum + p.totalAmount, 0),
    pending: payouts.filter(p => p.status === 'scheduled' || p.status === 'processing').length,
    pendingAmount: payouts
      .filter(p => p.status === 'scheduled' || p.status === 'processing')
      .reduce((sum, p) => sum + p.totalAmount, 0),
    completed: payouts.filter(p => p.status === 'completed').length,
    completedAmount: payouts
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.totalAmount, 0),
    fees: payouts.reduce((sum, p) => sum + (p.fees || 0), 0)
  };

  if (isLoading && payouts.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Payouts</h1>
          <p className="text-gray-600">Gérez les versements des commissions aux utilisateurs</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Payout
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payouts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">{formatCurrency(stats.totalAmount)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En Attente</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              <p className="text-sm text-gray-500">{formatCurrency(stats.pendingAmount)}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Complétés</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-sm text-gray-500">{formatCurrency(stats.completedAmount)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Frais Totaux</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.fees)}</p>
              <p className="text-sm text-gray-500">
                {stats.totalAmount > 0 ? ((stats.fees / stats.totalAmount) * 100).toFixed(2) : 0}% du total
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un payout..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                // Pas de recherche texte dans PayoutFilters, mais on peut l'ajouter
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

          {selectedPayouts.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedPayouts.length} sélectionné(s)
              </span>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    selectedPayouts.forEach(id => 
                      handleStatusUpdate(id, e.target.value as PayoutStatus)
                    );
                    setSelectedPayouts([]);
                  }
                }}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
                defaultValue=""
              >
                <option value="" disabled>Changer le statut</option>
                <option value="processing">Mettre en cours</option>
                <option value="completed">Marquer complété</option>
                <option value="cancelled">Annuler</option>
              </select>
            </div>
          )}
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={filters.status?.[0] || ''}
                onChange={(e) => handleFilterChange({ 
                  status: e.target.value ? [e.target.value as PayoutStatus] : undefined 
                })}
              >
                <option value="">Tous les statuts</option>
                {Object.entries(payoutStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Méthode</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={filters.method?.[0] || ''}
                onChange={(e) => handleFilterChange({ 
                  method: e.target.value ? [e.target.value as PayoutMethod] : undefined 
                })}
              >
                <option value="">Toutes les méthodes</option>
                {Object.entries(payoutMethodLabels).map(([value, label]) => (
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

      {/* Liste des payouts */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedPayouts.length === payouts.length && payouts.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPayouts(payouts.map(p => p.id));
                      } else {
                        setSelectedPayouts([]);
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payout
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Méthode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date programmée
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedPayouts.includes(payout.id)}
                      onChange={() => togglePayoutSelection(payout.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{payout.id}</div>
                      <div className="text-gray-500">
                        {payout.commissionIds.length} commission(s)
                      </div>
                      {payout.reference && (
                        <div className="text-xs text-gray-400">Réf: {payout.reference}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payout.userId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getMethodIcon(payout.method)}
                      <span className="ml-2 text-sm text-gray-900">
                        {payoutMethodLabels[payout.method]}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {formatCurrency(payout.totalAmount, payout.currency)}
                      </div>
                      {payout.fees && payout.fees > 0 && (
                        <div className="text-red-600 text-xs">
                          -{formatCurrency(payout.fees, payout.currency)} frais
                        </div>
                      )}
                      <div className="text-green-600 text-xs font-medium">
                        Net: {formatCurrency(payout.netAmount, payout.currency)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(payout.status)}
                      <span className="ml-2 text-sm text-gray-900">
                        {payoutStatusLabels[payout.status]}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="text-gray-900">{formatDate(payout.scheduledDate)}</div>
                      {payout.processedDate && (
                        <div className="text-green-600 text-xs">
                          Traité: {formatDate(payout.processedDate)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {payout.status === 'scheduled' && (
                        <button
                          onClick={() => handleStatusUpdate(payout.id, 'processing')}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Traiter
                        </button>
                      )}
                      {payout.status === 'processing' && (
                        <button
                          onClick={() => handleStatusUpdate(payout.id, 'completed')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Compléter
                        </button>
                      )}
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
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

        {payouts.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun payout trouvé</h3>
            <p className="text-gray-500">
              {Object.keys(filters).length > 0 
                ? 'Aucun payout ne correspond à vos critères de recherche.'
                : 'Aucun payout n\'a encore été créé.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
