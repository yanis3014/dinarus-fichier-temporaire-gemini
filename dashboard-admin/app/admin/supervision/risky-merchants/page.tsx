'use client';

import { useState, useEffect } from 'react';
import { 
  Store, AlertTriangle, Eye, Ban, Flag, Search,
  RefreshCw, Download, Clock, MapPin, Activity,
  DollarSign, Mail, Phone, Calendar, Shield,
  TrendingUp, Users, CreditCard
} from 'lucide-react';

interface RiskyMerchant {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: string;
  lastActivity: string;
  riskScore: number;
  riskFactors: string[];
  status: 'active' | 'suspended' | 'under_review' | 'banned' | 'pending';
  transactionCount: number;
  totalVolume: number;
  avgTicket: number;
  flaggedTransactions: number;
  chargebackRate: number;
  refundRate: number;
  businessCategory: string;
  verificationStatus: 'verified' | 'partial' | 'unverified';
  documents: {
    commercialRegister: 'valid' | 'expired' | 'missing';
    taxCertificate: 'valid' | 'expired' | 'missing';
    bankStatement: 'valid' | 'expired' | 'missing';
  };
  notes?: string;
}

export default function RiskyMerchantsPage() {
  const [merchants, setMerchants] = useState<RiskyMerchant[]>([]);
  const [filteredMerchants, setFilteredMerchants] = useState<RiskyMerchant[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState<RiskyMerchant | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Mock data
  useEffect(() => {
    const mockData: RiskyMerchant[] = [
      {
        id: 'merchant_001',
        businessName: 'ElectroMax',
        ownerName: 'Khaled Bencheikh',
        email: 'contact@electromax.dz',
        phone: '+213770123456',
        address: 'Rue Didouche Mourad, Alger',
        registrationDate: '2025-01-20T10:30:00Z',
        lastActivity: '2025-06-02T09:15:00Z',
        riskScore: 88,
        riskFactors: ['Taux de rétrofacturation élevé', 'Transactions de nuit fréquentes', 'Montants inhabituels'],
        status: 'under_review',
        transactionCount: 1250,
        totalVolume: 15500000,
        avgTicket: 12400,
        flaggedTransactions: 45,
        chargebackRate: 4.2,
        refundRate: 8.5,
        businessCategory: 'Électronique',
        verificationStatus: 'partial',
        documents: {
          commercialRegister: 'valid',
          taxCertificate: 'expired',
          bankStatement: 'valid'
        },
        notes: 'Pic d\'activité suspect détecté en mai 2025'
      },
      {
        id: 'merchant_002',
        businessName: 'Fashion Store',
        ownerName: 'Amira Boudjedra',
        email: 'info@fashionstore.dz',
        phone: '+213771234567',
        address: 'Boulevard Mohamed V, Oran',
        registrationDate: '2024-09-15T14:20:00Z',
        lastActivity: '2025-06-01T22:30:00Z',
        riskScore: 92,
        riskFactors: ['Documents manquants', 'Activité géographique suspecte', 'Clients récurrents identiques'],
        status: 'suspended',
        transactionCount: 890,
        totalVolume: 8900000,
        avgTicket: 10000,
        flaggedTransactions: 67,
        chargebackRate: 6.8,
        refundRate: 12.3,
        businessCategory: 'Mode & Vêtements',
        verificationStatus: 'unverified',
        documents: {
          commercialRegister: 'missing',
          taxCertificate: 'missing',
          bankStatement: 'expired'
        },
        notes: 'Plusieurs tentatives de contournement des limites détectées'
      },
      {
        id: 'merchant_003',
        businessName: 'Digital Services Pro',
        ownerName: 'Yacine Hamidi',
        email: 'admin@digitalpro.dz',
        phone: '+213772345678',
        address: 'Cité El Mokrani, Constantine',
        registrationDate: '2025-03-10T11:45:00Z',
        lastActivity: '2025-06-02T08:20:00Z',
        riskScore: 75,
        riskFactors: ['Nouveau commerçant', 'Croissance anormalement rapide', 'Profil de transactions atypique'],
        status: 'active',
        transactionCount: 567,
        totalVolume: 3400000,
        avgTicket: 6000,
        flaggedTransactions: 12,
        chargebackRate: 2.1,
        refundRate: 5.2,
        businessCategory: 'Services Numériques',
        verificationStatus: 'verified',
        documents: {
          commercialRegister: 'valid',
          taxCertificate: 'valid',
          bankStatement: 'valid'
        }
      },
      {
        id: 'merchant_004',
        businessName: 'Auto Parts Algeria',
        ownerName: 'Mohamed Larbi',
        email: 'contact@autoparts.dz',
        phone: '+213773456789',
        address: 'Zone Industrielle, Sétif',
        registrationDate: '2024-06-30T16:15:00Z',
        lastActivity: '2025-05-28T19:45:00Z',
        riskScore: 95,
        riskFactors: ['Fraude avérée', 'Utilisation de faux documents', 'Transactions automatisées suspectées'],
        status: 'banned',
        transactionCount: 234,
        totalVolume: 1200000,
        avgTicket: 5128,
        flaggedTransactions: 156,
        chargebackRate: 15.2,
        refundRate: 25.8,
        businessCategory: 'Automobile',
        verificationStatus: 'unverified',
        documents: {
          commercialRegister: 'missing',
          taxCertificate: 'missing',
          bankStatement: 'missing'
        },
        notes: 'Commerçant banni définitivement pour fraude documentaire'
      },
      {
        id: 'merchant_005',
        businessName: 'Health & Beauty Corner',
        ownerName: 'Fatima Zohra Belaid',
        email: 'info@healthbeauty.dz',
        phone: '+213774567890',
        address: 'Centre Commercial Bab Ezzouar, Alger',
        registrationDate: '2024-12-05T09:30:00Z',
        lastActivity: '2025-06-02T10:10:00Z',
        riskScore: 69,
        riskFactors: ['Variations de volume importantes', 'Clients sans historique', 'Géolocalisation incohérente'],
        status: 'active',
        transactionCount: 789,
        totalVolume: 4500000,
        avgTicket: 5700,
        flaggedTransactions: 23,
        chargebackRate: 3.5,
        refundRate: 7.1,
        businessCategory: 'Santé & Beauté',
        verificationStatus: 'partial',
        documents: {
          commercialRegister: 'valid',
          taxCertificate: 'valid',
          bankStatement: 'expired'
        }
      }
    ];

    setTimeout(() => {
      setMerchants(mockData);
      setFilteredMerchants(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filtrage
  useEffect(() => {
    let filtered = merchants;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(merchant => merchant.status === filterStatus);
    }

    if (filterRisk !== 'all') {
      filtered = filtered.filter(merchant => {
        if (filterRisk === 'critical') return merchant.riskScore >= 90;
        if (filterRisk === 'high') return merchant.riskScore >= 75 && merchant.riskScore < 90;
        if (filterRisk === 'medium') return merchant.riskScore >= 60 && merchant.riskScore < 75;
        if (filterRisk === 'low') return merchant.riskScore < 60;
        return true;
      });
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(merchant => merchant.businessCategory === filterCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(merchant => 
        merchant.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMerchants(filtered);
    setCurrentPage(1);
  }, [merchants, filterStatus, filterRisk, filterCategory, searchTerm]);

  const getRiskColor = (score: number) => {
    if (score >= 90) return 'text-red-700 bg-red-100';
    if (score >= 75) return 'text-red-600 bg-red-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-blue-600 bg-blue-100';
      case 'suspended': return 'text-yellow-600 bg-yellow-100';
      case 'under_review': return 'text-orange-600 bg-orange-100';
      case 'banned': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDocumentStatus = (status: string) => {
    switch (status) {
      case 'valid': return 'text-green-600 bg-green-100';
      case 'expired': return 'text-orange-600 bg-orange-100';
      case 'missing': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleStatusChange = (merchantId: string, newStatus: string) => {
    setMerchants(prev => 
      prev.map(merchant => 
        merchant.id === merchantId 
          ? { ...merchant, status: newStatus as any }
          : merchant
      )
    );
  };

  // Pagination
  const totalPages = Math.ceil(filteredMerchants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMerchants = filteredMerchants.slice(startIndex, endIndex);

  const uniqueCategories = Array.from(new Set(merchants.map(m => m.businessCategory)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Commerçants Suspects</h1>
          <p className="text-sm text-gray-500 mt-1">Surveillance et gestion des commerçants à risque</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.location.reload()}
            className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <RefreshCw size={20} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Commerçants Surveillés</p>
              <p className="text-2xl font-bold text-red-600">{merchants.length}</p>
            </div>
            <Store className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Risque Critique</p>
              <p className="text-2xl font-bold text-red-700">
                {merchants.filter(m => m.riskScore >= 90).length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-700" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Taux Rétrofacturation Moyen</p>
              <p className="text-2xl font-bold text-orange-600">
                {(merchants.reduce((acc, m) => acc + m.chargebackRate, 0) / merchants.length).toFixed(1)}%
              </p>
            </div>
            <CreditCard className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Comptes Bannis</p>
              <p className="text-2xl font-bold text-red-600">
                {merchants.filter(m => m.status === 'banned').length}
              </p>
            </div>
            <Ban className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par nom d'entreprise, propriétaire ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="pending">En attente</option>
            <option value="suspended">Suspendus</option>
            <option value="under_review">En révision</option>
            <option value="banned">Bannis</option>
          </select>
          
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les risques</option>
            <option value="critical">Critique (90+)</option>
            <option value="high">Élevé (75-89)</option>
            <option value="medium">Moyen (60-74)</option>
            <option value="low">Faible (&lt;60)</option>
          </select>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toutes les catégories</option>
            {uniqueCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Merchants Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {isLoading ? (
          <div className="col-span-full bg-white p-8 text-center text-gray-500 rounded-lg shadow-sm border">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
            Chargement des commerçants...
          </div>
        ) : currentMerchants.length === 0 ? (
          <div className="col-span-full bg-white p-8 text-center text-gray-500 rounded-lg shadow-sm border">
            <Store className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun commerçant suspect trouvé</p>
          </div>
        ) : (
          currentMerchants.map((merchant) => (
            <div key={merchant.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Store className="w-5 h-5 text-gray-400" />
                      <h3 className="font-semibold text-gray-800">{merchant.businessName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(merchant.riskScore)}`}>
                        {merchant.riskScore}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{merchant.ownerName}</p>
                    <p className="text-sm text-gray-500">{merchant.businessCategory}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(merchant.status)}`}>
                      {merchant.status === 'active' ? 'Actif' :
                       merchant.status === 'pending' ? 'En attente' :
                       merchant.status === 'suspended' ? 'Suspendu' :
                       merchant.status === 'under_review' ? 'En révision' : 'Banni'}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Transactions:</span>
                    <p className="font-medium">{merchant.transactionCount}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Volume:</span>
                    <p className="font-medium">{(merchant.totalVolume / 1000000).toFixed(1)}M DA</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Ticket moyen:</span>
                    <p className="font-medium">{merchant.avgTicket.toLocaleString()} DA</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Signalées:</span>
                    <p className="font-medium text-red-600">{merchant.flaggedTransactions}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Rétrofacturation:</span>
                    <p className={`font-medium ${merchant.chargebackRate > 5 ? 'text-red-600' : 'text-green-600'}`}>
                      {merchant.chargebackRate}%
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Remboursements:</span>
                    <p className={`font-medium ${merchant.refundRate > 10 ? 'text-red-600' : 'text-green-600'}`}>
                      {merchant.refundRate}%
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Facteurs de risque:</p>
                  <div className="flex flex-wrap gap-1">
                    {merchant.riskFactors.slice(0, 2).map((factor, index) => (
                      <span key={index} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        {factor}
                      </span>
                    ))}
                    {merchant.riskFactors.length > 2 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        +{merchant.riskFactors.length - 2} autres
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <select
                    value={merchant.status}
                    onChange={(e) => handleStatusChange(merchant.id, e.target.value)}
                    className="px-3 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Actif</option>
                    <option value="pending">En attente</option>
                    <option value="suspended">Suspendu</option>
                    <option value="under_review">En révision</option>
                    <option value="banned">Banni</option>
                  </select>
                  <button 
                    onClick={() => setSelectedMerchant(merchant)}
                    className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Eye size={14} />
                    Détails
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Affichage {startIndex + 1}-{Math.min(endIndex, filteredMerchants.length)} sur {filteredMerchants.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Précédent
            </button>
            <span className="px-3 py-1 bg-blue-600 text-white rounded">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* Merchant Detail Modal */}
      {selectedMerchant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Profil Commerçant Détaillé</h3>
              <button 
                onClick={() => setSelectedMerchant(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Informations Entreprise</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Nom commercial:</strong> {selectedMerchant.businessName}</p>
                    <p><strong>Propriétaire:</strong> {selectedMerchant.ownerName}</p>
                    <p><strong>Email:</strong> {selectedMerchant.email}</p>
                    <p><strong>Téléphone:</strong> {selectedMerchant.phone}</p>
                    <p><strong>Adresse:</strong> {selectedMerchant.address}</p>
                    <p><strong>Catégorie:</strong> {selectedMerchant.businessCategory}</p>
                    <p><strong>Inscription:</strong> {new Date(selectedMerchant.registrationDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Documents</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Registre de commerce:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getDocumentStatus(selectedMerchant.documents.commercialRegister)}`}>
                        {selectedMerchant.documents.commercialRegister === 'valid' ? 'Valide' :
                         selectedMerchant.documents.commercialRegister === 'expired' ? 'Expiré' : 'Manquant'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Certificat fiscal:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getDocumentStatus(selectedMerchant.documents.taxCertificate)}`}>
                        {selectedMerchant.documents.taxCertificate === 'valid' ? 'Valide' :
                         selectedMerchant.documents.taxCertificate === 'expired' ? 'Expiré' : 'Manquant'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Relevé bancaire:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getDocumentStatus(selectedMerchant.documents.bankStatement)}`}>
                        {selectedMerchant.documents.bankStatement === 'valid' ? 'Valide' :
                         selectedMerchant.documents.bankStatement === 'expired' ? 'Expiré' : 'Manquant'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Analyse de Risque</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span>Score de risque:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(selectedMerchant.riskScore)}`}>
                        {selectedMerchant.riskScore}%
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Facteurs de risque:</p>
                      <div className="space-y-1">
                        {selectedMerchant.riskFactors.map((factor, index) => (
                          <span key={index} className="block text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Performances Transactionnelles</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Transactions:</span>
                      <p className="font-medium">{selectedMerchant.transactionCount}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Volume total:</span>
                      <p className="font-medium">{selectedMerchant.totalVolume.toLocaleString()} DA</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Ticket moyen:</span>
                      <p className="font-medium">{selectedMerchant.avgTicket.toLocaleString()} DA</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Signalées:</span>
                      <p className="font-medium text-red-600">{selectedMerchant.flaggedTransactions}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Rétrofacturation:</span>
                      <p className={`font-medium ${selectedMerchant.chargebackRate > 5 ? 'text-red-600' : 'text-green-600'}`}>
                        {selectedMerchant.chargebackRate}%
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Remboursements:</span>
                      <p className={`font-medium ${selectedMerchant.refundRate > 10 ? 'text-red-600' : 'text-green-600'}`}>
                        {selectedMerchant.refundRate}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {selectedMerchant.notes && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-800 mb-2">Notes</h4>
                <p className="text-sm bg-gray-100 p-3 rounded">{selectedMerchant.notes}</p>
              </div>
            )}
            
            <div className="flex gap-3 pt-6 border-t">
              <button 
                onClick={() => handleStatusChange(selectedMerchant.id, 'under_review')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Mettre en révision
              </button>
              <button 
                onClick={() => handleStatusChange(selectedMerchant.id, 'suspended')}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Suspendre
              </button>
              <button 
                onClick={() => handleStatusChange(selectedMerchant.id, 'banned')}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Bannir
              </button>
              <button 
                onClick={() => handleStatusChange(selectedMerchant.id, 'active')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Réactiver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
