'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  ShieldOff, 
  Search, 
  Filter, 
  AlertTriangle,
  Clock,
  User,
  Building,
  Calendar,
  FileText,
  Eye,
  Download,
  Snowflake,
  Unlock,
  Ban,
  UserX,
  DollarSign,
  CreditCard,
  Activity
} from 'lucide-react';

interface FrozenAccount {
  id: string;
  userId: string;
  userName: string;
  userType: 'individual' | 'merchant';
  email: string;
  phone: string;
  freezeReason: string;
  freezeDate: string;
  frozenBy: string;
  severity: 'temporary' | 'serious' | 'permanent';
  status: 'frozen' | 'partial' | 'reviewing' | 'unfrozen';
  accountBalance: number;
  lastActivity: string;
  frozenFeatures: string[];
  documents: string[];
  reviewDate?: string;
  autoUnfreezeDate?: string;
  riskScore: number;
  violations: number;
}

interface UnfreezeRequest {
  accountId: string;
  reason: string;
  restoreFeatures: string[];
  notifyUser: boolean;
  requireAdditionalVerification: boolean;
}

export default function AccountFreezePage() {
  const [activeTab, setActiveTab] = useState<'frozen' | 'requests' | 'history'>('frozen');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [showUnfreezeModal, setShowUnfreezeModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');

  // Mock data for frozen accounts
  const [frozenAccounts] = useState<FrozenAccount[]>([
    {
      id: '1',
      userId: 'USR001',
      userName: 'Ahmed Belkacem',
      userType: 'individual',
      email: 'ahmed.belkacem@email.com',
      phone: '+213 555 123 456',
      freezeReason: 'Activité suspecte détectée - Transactions multiples inhabituelles',
      freezeDate: '2024-01-15T10:30:00Z',
      frozenBy: 'Système Anti-Fraude',
      severity: 'serious',
      status: 'frozen',
      accountBalance: 125000,
      lastActivity: '2024-01-15T09:45:00Z',
      frozenFeatures: ['transactions', 'withdrawals', 'transfers'],
      documents: ['suspicious_activity_report.pdf', 'transaction_history.pdf'],
      reviewDate: '2024-01-18T10:00:00Z',
      riskScore: 85,
      violations: 3
    },
    {
      id: '2',
      userId: 'MER001',
      userName: 'Boutique Fatima',
      userType: 'merchant',
      email: 'contact@boutiquefatima.dz',
      phone: '+213 555 234 567',
      freezeReason: 'Vérification KYC échouée - Documents expirés',
      freezeDate: '2024-01-14T14:20:00Z',
      frozenBy: 'Équipe Conformité',
      severity: 'temporary',
      status: 'partial',
      accountBalance: 75000,
      lastActivity: '2024-01-14T12:30:00Z',
      frozenFeatures: ['new_transactions'],
      documents: ['expired_license.pdf'],
      autoUnfreezeDate: '2024-01-21T14:20:00Z',
      riskScore: 35,
      violations: 1
    },
    {
      id: '3',
      userId: 'USR002',
      userName: 'Mohamed Cherif',
      userType: 'individual',
      email: 'mohamed.cherif@email.com',
      phone: '+213 555 345 678',
      freezeReason: 'Violation répétée des conditions d\'utilisation',
      freezeDate: '2024-01-13T16:45:00Z',
      frozenBy: 'Modérateur Principal',
      severity: 'permanent',
      status: 'frozen',
      accountBalance: 0,
      lastActivity: '2024-01-13T16:00:00Z',
      frozenFeatures: ['all'],
      documents: ['violation_report.pdf', 'user_history.pdf'],
      riskScore: 95,
      violations: 8
    },
    {
      id: '4',
      userId: 'MER002',
      userName: 'Tech Store Algeria',
      userType: 'merchant',
      email: 'contact@techstore.dz',
      phone: '+213 555 456 789',
      freezeReason: 'Révision de sécurité de routine',
      freezeDate: '2024-01-12T11:15:00Z',
      frozenBy: 'Analyste Sécurité',
      severity: 'temporary',
      status: 'reviewing',
      accountBalance: 250000,
      lastActivity: '2024-01-12T10:30:00Z',
      frozenFeatures: ['large_transactions'],
      documents: [],
      reviewDate: '2024-01-16T11:15:00Z',
      riskScore: 25,
      violations: 0
    }
  ]);

  const [unfreezeRequest, setUnfreezeRequest] = useState<UnfreezeRequest>({
    accountId: '',
    reason: '',
    restoreFeatures: [],
    notifyUser: true,
    requireAdditionalVerification: false
  });

  const availableFeatures = [
    'transactions',
    'withdrawals', 
    'transfers',
    'deposits',
    'new_transactions',
    'large_transactions',
    'international_transfers',
    'commission_withdrawal'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'frozen': return 'text-red-700 bg-red-100';
      case 'partial': return 'text-yellow-700 bg-yellow-100';
      case 'reviewing': return 'text-blue-700 bg-blue-100';
      case 'unfrozen': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'permanent': return 'text-red-600 bg-red-50 border-red-200';
      case 'serious': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'temporary': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'frozen': return <ShieldOff className="w-4 h-4 text-red-600" />;
      case 'partial': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'reviewing': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'unfrozen': return <Shield className="w-4 h-4 text-green-600" />;
      default: return <Shield className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleSelectAccount = (accountId: string) => {
    setSelectedAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleSelectAll = () => {
    const filteredAccounts = getFilteredAccounts();
    if (selectedAccounts.length === filteredAccounts.length) {
      setSelectedAccounts([]);
    } else {
      setSelectedAccounts(filteredAccounts.map(a => a.id));
    }
  };

  const getFilteredAccounts = () => {
    return frozenAccounts.filter(account => {
      const matchesSearch = account.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           account.freezeReason.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || account.status === statusFilter;
      const matchesSeverity = !severityFilter || account.severity === severityFilter;
      
      return matchesSearch && matchesStatus && matchesSeverity;
    });
  };

  const handleUnfreeze = (accountId: string) => {
    const account = frozenAccounts.find(a => a.id === accountId);
    if (account) {
      setSelectedAccount(accountId);
      setUnfreezeRequest({ 
        ...unfreezeRequest, 
        accountId,
        restoreFeatures: account.frozenFeatures 
      });
      setShowUnfreezeModal(true);
    }
  };

  const handleBulkUnfreeze = () => {
    if (selectedAccounts.length === 0) return;
    console.log('Bulk unfreezing accounts:', selectedAccounts);
    setSelectedAccounts([]);
  };

  const submitUnfreezeRequest = () => {
    console.log('Submitting unfreeze request:', unfreezeRequest);
    setShowUnfreezeModal(false);
    setUnfreezeRequest({
      accountId: '',
      reason: '',
      restoreFeatures: [],
      notifyUser: true,
      requireAdditionalVerification: false
    });
    setSelectedAccount(null);
  };

  const handleFeatureToggle = (feature: string) => {
    setUnfreezeRequest(prev => ({
      ...prev,
      restoreFeatures: prev.restoreFeatures.includes(feature)
        ? prev.restoreFeatures.filter(f => f !== feature)
        : [...prev.restoreFeatures, feature]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gel des Comptes</h1>
          <p className="text-gray-600">Gérer les comptes gelés et les demandes de dégel</p>
        </div>
        
        <div className="flex gap-2">
          {selectedAccounts.length > 0 && (
            <button
              onClick={handleBulkUnfreeze}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              Dégeler Sélectionnés ({selectedAccounts.length})
            </button>
          )}
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
            <Snowflake className="w-4 h-4" />
            Nouveau Gel
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('frozen')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'frozen'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Snowflake className="w-4 h-4 inline mr-2" />
          Comptes Gelés
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'requests'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Clock className="w-4 h-4 inline mr-2" />
          Demandes en Cours
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'history'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Historique
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Comptes Gelés</p>
                <p className="text-2xl font-bold text-red-600">18</p>
              </div>
              <ShieldOff className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Partiellement Gelés</p>
                <p className="text-2xl font-bold text-yellow-600">12</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fonds Bloqués</p>
                <p className="text-2xl font-bold text-blue-600">5.2M DZD</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dégelés Aujourd'hui</p>
                <p className="text-2xl font-bold text-green-600">3</p>
              </div>
              <Unlock className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email, raison..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les statuts</option>
              <option value="frozen">Gelé</option>
              <option value="partial">Partiellement gelé</option>
              <option value="reviewing">En révision</option>
              <option value="unfrozen">Dégelé</option>
            </select>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes sévérités</option>
              <option value="temporary">Temporaire</option>
              <option value="serious">Sérieux</option>
              <option value="permanent">Permanent</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Frozen Accounts Tab */}
      {activeTab === 'frozen' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Comptes Gelés</CardTitle>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedAccounts.length === getFilteredAccounts().length && getFilteredAccounts().length > 0}
                  onChange={handleSelectAll}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">Tout sélectionner</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getFilteredAccounts().map((account) => (
                <div key={account.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedAccounts.includes(account.id)}
                        onChange={() => handleSelectAccount(account.id)}
                        className="rounded"
                      />
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {account.userName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold">{account.userName}</h3>
                        <p className="text-sm text-gray-600">{account.email}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        account.userType === 'merchant' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {account.userType === 'merchant' ? 'Marchand' : 'Particulier'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(account.riskScore)}`}>
                        Risque: {account.riskScore}%
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(account.severity)}`}>
                        {account.severity.charAt(0).toUpperCase() + account.severity.slice(1)}
                      </span>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(account.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(account.status)}`}>
                          {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Solde du compte</p>
                      <p className="font-bold text-lg">{account.accountBalance.toLocaleString()} DZD</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Date de gel</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(account.freezeDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Dernière activité</p>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-gray-400" />
                        <span>{new Date(account.lastActivity).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Violations</p>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="font-semibold text-red-600">{account.violations}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Raison du gel</p>
                    <p className="text-gray-900">{account.freezeReason}</p>
                    <p className="text-sm text-gray-500">Gelé par: {account.frozenBy}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Fonctionnalités gelées</p>
                    <div className="flex flex-wrap gap-2">
                      {account.frozenFeatures.map((feature, index) => (
                        <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                          <Ban className="w-3 h-3" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {account.autoUnfreezeDate && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">Dégel automatique prévu</p>
                      <p className="text-green-600 font-medium">
                        {new Date(account.autoUnfreezeDate).toLocaleDateString('fr-FR')} à {new Date(account.autoUnfreezeDate).toLocaleTimeString('fr-FR')}
                      </p>
                    </div>
                  )}

                  {account.documents.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Documents joints</p>
                      <div className="flex gap-2">
                        {account.documents.map((doc, index) => (
                          <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">
                            <FileText className="w-3 h-3" />
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      Détails
                    </button>
                    {account.status !== 'unfrozen' && (
                      <button
                        onClick={() => handleUnfreeze(account.id)}
                        className="px-3 py-1 text-green-600 hover:bg-green-50 rounded transition-colors flex items-center gap-1"
                      >
                        <Unlock className="w-4 h-4" />
                        Dégeler
                      </button>
                    )}
                    <button className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors flex items-center gap-1">
                      <UserX className="w-4 h-4" />
                      Suspendre Définitivement
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Unfreeze Modal */}
      {showUnfreezeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Dégeler le Compte</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Raison du dégel *</label>
                <textarea
                  required
                  value={unfreezeRequest.reason}
                  onChange={(e) => setUnfreezeRequest({ ...unfreezeRequest, reason: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Expliquez pourquoi ce compte doit être dégelé..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Fonctionnalités à restaurer</label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {availableFeatures.map((feature) => (
                    <label key={feature} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={unfreezeRequest.restoreFeatures.includes(feature)}
                        onChange={() => handleFeatureToggle(feature)}
                        className="mr-2"
                      />
                      <span className="text-sm capitalize">{feature.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifyUser"
                    checked={unfreezeRequest.notifyUser}
                    onChange={(e) => setUnfreezeRequest({ ...unfreezeRequest, notifyUser: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="notifyUser" className="text-sm">Notifier l'utilisateur</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requireVerification"
                    checked={unfreezeRequest.requireAdditionalVerification}
                    onChange={(e) => setUnfreezeRequest({ ...unfreezeRequest, requireAdditionalVerification: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="requireVerification" className="text-sm">Exiger une vérification supplémentaire</label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowUnfreezeModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={submitUnfreezeRequest}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                Dégeler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
