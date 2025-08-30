'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Unlock, 
  Lock, 
  Search, 
  Filter, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  User,
  Calendar,
  CreditCard,
  FileText,
  Eye,
  Download,
  RefreshCw,
  XCircle,
  Banknote,
  ArrowUpDown
} from 'lucide-react';

interface BlockedPayment {
  id: string;
  userId: string;
  userName: string;
  userType: 'individual' | 'merchant';
  paymentType: 'deposit' | 'withdrawal' | 'transfer' | 'commission';
  amount: number;
  currency: string;
  blockReason: string;
  blockDate: string;
  blockedBy: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'blocked' | 'reviewing' | 'approved' | 'rejected';
  requestedUnlockDate?: string;
  approvedBy?: string;
  rejectionReason?: string;
  documents: string[];
  riskScore: number;
}

interface UnlockRequest {
  paymentId: string;
  reason: string;
  evidence: File[];
  priority: 'normal' | 'urgent';
  notifyUser: boolean;
}

export default function PaymentUnlockPage() {
  const [activeTab, setActiveTab] = useState<'blocked' | 'requests' | 'history'>('blocked');
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Mock data for blocked payments
  const [blockedPayments] = useState<BlockedPayment[]>([
    {
      id: '1',
      userId: 'USR001',
      userName: 'Ahmed Belkacem',
      userType: 'individual',
      paymentType: 'withdrawal',
      amount: 50000,
      currency: 'DZD',
      blockReason: 'Montant suspect - dépassement du seuil habituel',
      blockDate: '2024-01-15T10:30:00Z',
      blockedBy: 'Système Anti-Fraude',
      priority: 'high',
      status: 'blocked',
      documents: ['id_verification.pdf', 'bank_statement.pdf'],
      riskScore: 75
    },
    {
      id: '2',
      userId: 'MER001',
      userName: 'Boutique Fatima',
      userType: 'merchant',
      paymentType: 'commission',
      amount: 25000,
      currency: 'DZD',
      blockReason: 'Vérification KYC en cours',
      blockDate: '2024-01-14T14:20:00Z',
      blockedBy: 'Équipe Conformité',
      priority: 'medium',
      status: 'reviewing',
      requestedUnlockDate: '2024-01-15T09:00:00Z',
      documents: ['business_license.pdf'],
      riskScore: 45
    },
    {
      id: '3',
      userId: 'USR002',
      userName: 'Mohamed Cherif',
      userType: 'individual',
      paymentType: 'transfer',
      amount: 100000,
      currency: 'DZD',
      blockReason: 'Transaction internationale suspecte',
      blockDate: '2024-01-13T16:45:00Z',
      blockedBy: 'Analyste Senior',
      priority: 'urgent',
      status: 'blocked',
      documents: ['transaction_proof.pdf', 'source_funds.pdf'],
      riskScore: 90
    },
    {
      id: '4',
      userId: 'MER002',
      userName: 'Tech Store Algeria',
      userType: 'merchant',
      paymentType: 'deposit',
      amount: 75000,
      currency: 'DZD',
      blockReason: 'Compte temporairement gelé',
      blockDate: '2024-01-12T11:15:00Z',
      blockedBy: 'Support Client',
      priority: 'low',
      status: 'approved',
      approvedBy: 'Manager Régional',
      documents: [],
      riskScore: 20
    }
  ]);

  const [unlockRequest, setUnlockRequest] = useState<UnlockRequest>({
    paymentId: '',
    reason: '',
    evidence: [],
    priority: 'normal',
    notifyUser: true
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'blocked': return 'text-red-700 bg-red-100';
      case 'reviewing': return 'text-yellow-700 bg-yellow-100';
      case 'approved': return 'text-green-700 bg-green-100';
      case 'rejected': return 'text-gray-700 bg-gray-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPaymentTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowUpDown className="w-4 h-4 text-green-600" />;
      case 'withdrawal': return <Banknote className="w-4 h-4 text-blue-600" />;
      case 'transfer': return <RefreshCw className="w-4 h-4 text-purple-600" />;
      case 'commission': return <DollarSign className="w-4 h-4 text-yellow-600" />;
      default: return <CreditCard className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const handleSelectPayment = (paymentId: string) => {
    setSelectedPayments(prev => 
      prev.includes(paymentId) 
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const handleSelectAll = () => {
    const filteredPayments = getFilteredPayments();
    if (selectedPayments.length === filteredPayments.length) {
      setSelectedPayments([]);
    } else {
      setSelectedPayments(filteredPayments.map(p => p.id));
    }
  };

  const getFilteredPayments = () => {
    return blockedPayments.filter(payment => {
      const matchesSearch = payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           payment.blockReason.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || payment.status === statusFilter;
      const matchesPriority = !priorityFilter || payment.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  };

  const handleUnlock = (paymentId: string) => {
    setSelectedPayment(paymentId);
    setUnlockRequest({ ...unlockRequest, paymentId });
    setShowUnlockModal(true);
  };

  const handleBulkUnlock = () => {
    if (selectedPayments.length === 0) return;
    // Process bulk unlock
    console.log('Bulk unlocking payments:', selectedPayments);
    setSelectedPayments([]);
  };

  const submitUnlockRequest = () => {
    console.log('Submitting unlock request:', unlockRequest);
    setShowUnlockModal(false);
    setUnlockRequest({
      paymentId: '',
      reason: '',
      evidence: [],
      priority: 'normal',
      notifyUser: true
    });
    setSelectedPayment(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Déblocage des Paiements</h1>
          <p className="text-gray-600">Gérer les paiements bloqués et les demandes de déblocage</p>
        </div>
        
        <div className="flex gap-2">
          {selectedPayments.length > 0 && (
            <button
              onClick={handleBulkUnlock}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              Débloquer Sélectionnés ({selectedPayments.length})
            </button>
          )}
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('blocked')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'blocked'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Lock className="w-4 h-4 inline mr-2" />
          Paiements Bloqués
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
                <p className="text-sm text-gray-600">Paiements Bloqués</p>
                <p className="text-2xl font-bold text-red-600">12</p>
              </div>
              <Lock className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Révision</p>
                <p className="text-2xl font-bold text-yellow-600">8</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Montant Bloqué</p>
                <p className="text-2xl font-bold text-blue-600">2.5M DZD</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Débloqués Aujourd'hui</p>
                <p className="text-2xl font-bold text-green-600">5</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
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
                  placeholder="Rechercher par nom, raison..."
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
              <option value="blocked">Bloqué</option>
              <option value="reviewing">En révision</option>
              <option value="approved">Approuvé</option>
              <option value="rejected">Rejeté</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes priorités</option>
              <option value="urgent">Urgent</option>
              <option value="high">Élevée</option>
              <option value="medium">Moyenne</option>
              <option value="low">Faible</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Blocked Payments Tab */}
      {activeTab === 'blocked' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Paiements Bloqués</CardTitle>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedPayments.length === getFilteredPayments().length && getFilteredPayments().length > 0}
                  onChange={handleSelectAll}
                  className="rounded"
                />
                <span className="text-sm text-gray-600">Tout sélectionner</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getFilteredPayments().map((payment) => (
                <div key={payment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedPayments.includes(payment.id)}
                        onChange={() => handleSelectPayment(payment.id)}
                        className="rounded"
                      />
                      <div className="flex items-center gap-2">
                        {getPaymentTypeIcon(payment.paymentType)}
                        <span className="font-medium capitalize">{payment.paymentType}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(payment.priority)}`}>
                        {payment.priority.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(payment.riskScore)}`}>
                        Risque: {payment.riskScore}%
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Utilisateur</p>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{payment.userName}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          payment.userType === 'merchant' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {payment.userType === 'merchant' ? 'Marchand' : 'Particulier'}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Montant</p>
                      <p className="font-bold text-lg">{payment.amount.toLocaleString()} {payment.currency}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Date de blocage</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(payment.blockDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Raison du blocage</p>
                    <p className="text-gray-900">{payment.blockReason}</p>
                    <p className="text-sm text-gray-500">Bloqué par: {payment.blockedBy}</p>
                  </div>

                  {payment.documents.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Documents joints</p>
                      <div className="flex gap-2">
                        {payment.documents.map((doc, index) => (
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
                    {payment.status === 'blocked' && (
                      <button
                        onClick={() => handleUnlock(payment.id)}
                        className="px-3 py-1 text-green-600 hover:bg-green-50 rounded transition-colors flex items-center gap-1"
                      >
                        <Unlock className="w-4 h-4" />
                        Débloquer
                      </button>
                    )}
                    <button className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      Rejeter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Unlock Modal */}
      {showUnlockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Débloquer le Paiement</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Raison du déblocage *</label>
                <textarea
                  required
                  value={unlockRequest.reason}
                  onChange={(e) => setUnlockRequest({ ...unlockRequest, reason: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Expliquez pourquoi ce paiement doit être débloqué..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Priorité</label>
                <select
                  value={unlockRequest.priority}
                  onChange={(e) => setUnlockRequest({ ...unlockRequest, priority: e.target.value as 'normal' | 'urgent' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="normal">Normale</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifyUser"
                  checked={unlockRequest.notifyUser}
                  onChange={(e) => setUnlockRequest({ ...unlockRequest, notifyUser: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="notifyUser" className="text-sm">Notifier l'utilisateur</label>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowUnlockModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={submitUnlockRequest}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                Débloquer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
