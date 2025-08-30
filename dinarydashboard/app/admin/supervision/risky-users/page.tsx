'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, AlertTriangle, User, Eye, Ban, Flag,
  Search, RefreshCw, Download, Clock, MapPin,
  Activity, DollarSign, Mail, Phone, Calendar
} from 'lucide-react';

interface RiskyUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationDate: string;
  lastActivity: string;
  riskScore: number;
  riskFactors: string[];
  status: 'active' | 'suspended' | 'under_review' | 'banned';
  transactionCount: number;
  totalAmount: number;
  flaggedTransactions: number;
  ipAddresses: string[];
  location: string;
  verificationStatus: 'verified' | 'partial' | 'unverified';
  notes?: string;
}

export default function RiskyUsersPage() {
  const [users, setUsers] = useState<RiskyUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<RiskyUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<RiskyUser | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock data
  useEffect(() => {
    const mockData: RiskyUser[] = [
      {
        id: 'user_001',
        name: 'Ahmed Benaissa',
        email: 'ahmed.b@email.com',
        phone: '+213555123456',
        registrationDate: '2025-01-15T10:30:00Z',
        lastActivity: '2025-06-02T08:45:00Z',
        riskScore: 92,
        riskFactors: ['Transactions vélocité élevée', 'Connexions multiples IP', 'Montants inhabituels'],
        status: 'under_review',
        transactionCount: 157,
        totalAmount: 2850000,
        flaggedTransactions: 12,
        ipAddresses: ['192.168.1.1', '10.0.0.1', '203.0.113.1'],
        location: 'Alger, Algérie',
        verificationStatus: 'partial',
        notes: 'Activité suspecte détectée le 01/06/2025'
      },
      {
        id: 'user_002',
        name: 'Fatima Zerrouki',
        email: 'fatima.z@email.com',
        phone: '+213556789012',
        registrationDate: '2024-11-20T14:20:00Z',
        lastActivity: '2025-06-02T09:30:00Z',
        riskScore: 87,
        riskFactors: ['Tentatives de login échouées', 'Changements fréquents de mot de passe', 'Géolocalisation suspecte'],
        status: 'active',
        transactionCount: 89,
        totalAmount: 1250000,
        flaggedTransactions: 8,
        ipAddresses: ['172.16.0.1', '198.51.100.1'],
        location: 'Oran, Algérie',
        verificationStatus: 'unverified'
      },
      {
        id: 'user_003',
        name: 'Karim Messaoudi',
        email: 'karim.m@email.com',
        phone: '+213557345678',
        registrationDate: '2025-03-10T09:15:00Z',
        lastActivity: '2025-06-01T22:10:00Z',
        riskScore: 78,
        riskFactors: ['Activité nocturne anormale', 'Transactions de montants ronds', 'Profil incomplet'],
        status: 'suspended',
        transactionCount: 234,
        totalAmount: 980000,
        flaggedTransactions: 5,
        ipAddresses: ['10.0.0.2'],
        location: 'Constantine, Algérie',
        verificationStatus: 'partial',
        notes: 'Suspendu temporairement pour vérification'
      },
      {
        id: 'user_004',
        name: 'Amina Boumediene',
        email: 'amina.b@email.com',
        phone: '+213558901234',
        registrationDate: '2024-08-05T16:45:00Z',
        lastActivity: '2025-05-30T14:20:00Z',
        riskScore: 65,
        riskFactors: ['Pas d\'activité récente', 'Documents expirés', 'Informations incohérentes'],
        status: 'active',
        transactionCount: 45,
        totalAmount: 320000,
        flaggedTransactions: 2,
        ipAddresses: ['192.168.1.5'],
        location: 'Annaba, Algérie',
        verificationStatus: 'verified'
      },
      {
        id: 'user_005',
        name: 'Omar Benali',
        email: 'omar.benali@email.com',
        phone: '+213559012345',
        registrationDate: '2025-04-12T11:30:00Z',
        lastActivity: '2025-06-02T07:15:00Z',
        riskScore: 95,
        riskFactors: ['Tentatives de fraude détectées', 'Connexions depuis VPN', 'Activité automatisée suspectée'],
        status: 'banned',
        transactionCount: 5,
        totalAmount: 50000,
        flaggedTransactions: 5,
        ipAddresses: ['45.32.1.1', '104.28.1.1', '185.199.1.1'],
        location: 'Localisation masquée',
        verificationStatus: 'unverified',
        notes: 'Compte banni définitivement pour fraude avérée'
      }
    ];

    setTimeout(() => {
      setUsers(mockData);
      setFilteredUsers(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filtrage
  useEffect(() => {
    let filtered = users;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => user.status === filterStatus);
    }

    if (filterRisk !== 'all') {
      filtered = filtered.filter(user => {
        if (filterRisk === 'critical') return user.riskScore >= 90;
        if (filterRisk === 'high') return user.riskScore >= 75 && user.riskScore < 90;
        if (filterRisk === 'medium') return user.riskScore >= 60 && user.riskScore < 75;
        if (filterRisk === 'low') return user.riskScore < 60;
        return true;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, filterStatus, filterRisk, searchTerm]);

  const getRiskColor = (score: number) => {
    if (score >= 90) return 'text-red-700 bg-red-100';
    if (score >= 75) return 'text-red-600 bg-red-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'suspended': return 'text-yellow-600 bg-yellow-100';
      case 'under_review': return 'text-blue-600 bg-blue-100';
      case 'banned': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-100';
      case 'partial': return 'text-yellow-600 bg-yellow-100';
      case 'unverified': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleStatusChange = (userId: string, newStatus: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, status: newStatus as any }
          : user
      )
    );
  };

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Utilisateurs à Risque</h1>
          <p className="text-sm text-gray-500 mt-1">Surveillance et gestion des comptes utilisateurs à risque</p>
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
              <p className="text-sm text-gray-500">Utilisateurs Surveillés</p>
              <p className="text-2xl font-bold text-red-600">{users.length}</p>
            </div>
            <Shield className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Risque Critique</p>
              <p className="text-2xl font-bold text-red-700">
                {users.filter(u => u.riskScore >= 90).length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-700" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Comptes Suspendus</p>
              <p className="text-2xl font-bold text-yellow-600">
                {users.filter(u => u.status === 'suspended').length}
              </p>
            </div>
            <Ban className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Non Vérifiés</p>
              <p className="text-2xl font-bold text-orange-600">
                {users.filter(u => u.verificationStatus === 'unverified').length}
              </p>
            </div>
            <Flag className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher par nom, email ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
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
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            Utilisateurs à Risque ({filteredUsers.length})
          </h3>
        </div>
        <div className="divide-y">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
              Chargement des utilisateurs...
            </div>
          ) : currentUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun utilisateur à risque trouvé</p>
            </div>
          ) : (
            currentUsers.map((user) => (
              <div key={user.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-800">{user.name}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(user.riskScore)}`}>
                        Risque: {user.riskScore}%
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status === 'active' ? 'Actif' :
                         user.status === 'suspended' ? 'Suspendu' :
                         user.status === 'under_review' ? 'En révision' : 'Banni'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVerificationColor(user.verificationStatus)}`}>
                        {user.verificationStatus === 'verified' ? 'Vérifié' :
                         user.verificationStatus === 'partial' ? 'Partiel' : 'Non vérifié'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Mail size={12} />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Phone size={12} />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin size={12} />
                        <span>{user.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Activity size={12} />
                        <span>{user.transactionCount} transactions</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <DollarSign size={12} />
                        <span>{user.totalAmount.toLocaleString()} DA</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Flag size={12} />
                        <span>{user.flaggedTransactions} signalées</span>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <p className="text-sm text-gray-500 mb-1">Facteurs de risque:</p>
                      <div className="flex flex-wrap gap-1">
                        {user.riskFactors.map((factor, index) => (
                          <span key={index} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {user.notes && (
                      <p className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
                        <strong>Notes:</strong> {user.notes}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <select
                      value={user.status}
                      onChange={(e) => handleStatusChange(user.id, e.target.value)}
                      className="px-3 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Actif</option>
                      <option value="suspended">Suspendu</option>
                      <option value="under_review">En révision</option>
                      <option value="banned">Banni</option>
                    </select>
                    <button 
                      onClick={() => setSelectedUser(user)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Affichage {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} sur {filteredUsers.length}
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
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Profil Utilisateur Détaillé</h3>
              <button 
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Informations Personnelles</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Nom:</strong> {selectedUser.name}</p>
                    <p><strong>Email:</strong> {selectedUser.email}</p>
                    <p><strong>Téléphone:</strong> {selectedUser.phone}</p>
                    <p><strong>Localisation:</strong> {selectedUser.location}</p>
                    <p><strong>Inscription:</strong> {new Date(selectedUser.registrationDate).toLocaleDateString('fr-FR')}</p>
                    <p><strong>Dernière activité:</strong> {new Date(selectedUser.lastActivity).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Statut & Vérification</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span>Statut du compte:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                        {selectedUser.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Vérification:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVerificationColor(selectedUser.verificationStatus)}`}>
                        {selectedUser.verificationStatus}
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(selectedUser.riskScore)}`}>
                        {selectedUser.riskScore}%
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">Facteurs de risque:</p>
                      <div className="space-y-1">
                        {selectedUser.riskFactors.map((factor, index) => (
                          <span key={index} className="block text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Activité Transactionnelle</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Nombre de transactions:</strong> {selectedUser.transactionCount}</p>
                    <p><strong>Montant total:</strong> {selectedUser.totalAmount.toLocaleString()} DA</p>
                    <p><strong>Transactions signalées:</strong> {selectedUser.flaggedTransactions}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Adresses IP</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.ipAddresses.map((ip, index) => (
                    <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                      {ip}
                    </span>
                  ))}
                </div>
              </div>
              
              {selectedUser.notes && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Notes</h4>
                  <p className="text-sm bg-gray-100 p-3 rounded">{selectedUser.notes}</p>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 pt-6 border-t">
              <button 
                onClick={() => handleStatusChange(selectedUser.id, 'under_review')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Mettre en révision
              </button>
              <button 
                onClick={() => handleStatusChange(selectedUser.id, 'suspended')}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Suspendre
              </button>
              <button 
                onClick={() => handleStatusChange(selectedUser.id, 'banned')}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Bannir
              </button>
              <button 
                onClick={() => handleStatusChange(selectedUser.id, 'active')}
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
