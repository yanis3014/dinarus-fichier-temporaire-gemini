'use client'

import { useState } from 'react';
import { 
  CreditCard, Search, Filter, CheckCircle, XCircle, 
  AlertCircle, Eye, Check, X, Clock, Calendar, 
  Download, ArrowUpDown, DollarSign
} from 'lucide-react';

// Données fictives pour les demandes de retrait
const withdrawals = [
  {
    id: "w001",
    userId: "u001",
    userName: "Sophie Martin",
    amount: 350.00,
    requestDate: "2023-05-13T14:23:00",
    status: "pending",
    accountInfo: "**** **** **** 5678",
    bank: "BNP Paribas",
    notes: "",
  },
  {
    id: "w002",
    userId: "u004",
    userName: "Lucas Petit",
    amount: 750.00,
    requestDate: "2023-05-12T10:45:00",
    status: "approved",
    accountInfo: "**** **** **** 1234",
    bank: "Société Générale",
    notes: "Client fidèle",
    completedDate: "2023-05-13T09:15:00",
  },
  {
    id: "w003",
    userId: "u002",
    userName: "Thomas Bernard",
    amount: 125.50,
    requestDate: "2023-05-11T16:30:00",
    status: "pending",
    accountInfo: "**** **** **** 9012",
    bank: "Crédit Agricole",
    notes: "Première demande",
  },
  {
    id: "w004",
    userId: "u007",
    userName: "Camille Dubois",
    amount: 200.00,
    requestDate: "2023-05-10T09:20:00",
    status: "approved",
    accountInfo: "**** **** **** 3456",
    bank: "La Banque Postale",
    notes: "",
    completedDate: "2023-05-11T11:45:00",
  },
  {
    id: "w005",
    userId: "u012",
    userName: "Antoine Lefèvre",
    amount: 500.00,
    requestDate: "2023-05-09T15:10:00",
    status: "rejected",
    accountInfo: "**** **** **** 7890",
    bank: "Crédit Mutuel",
    notes: "Informations incorrectes",
    rejectedReason: "Informations de compte incorrectes",
    rejectedDate: "2023-05-10T14:25:00",
  },
  {
    id: "w006",
    userId: "u008",
    userName: "Julie Moreau",
    amount: 175.25,
    requestDate: "2023-05-08T11:05:00",
    status: "pending",
    accountInfo: "**** **** **** 2345",
    bank: "BNP Paribas",
    notes: "Demande récurrente mensuelle",
  },
  {
    id: "w007",
    userId: "u015",
    userName: "Nicolas Dupont",
    amount: 1250.00,
    requestDate: "2023-05-07T16:40:00",
    status: "approved",
    accountInfo: "**** **** **** 6789",
    bank: "CIC",
    notes: "Vérification d'identité effectuée",
    completedDate: "2023-05-09T10:30:00",
  },
  {
    id: "w008",
    userId: "u006",
    userName: "Marie Leroy",
    amount: 85.75,
    requestDate: "2023-05-06T14:15:00",
    status: "rejected",
    accountInfo: "**** **** **** 0123",
    bank: "HSBC",
    notes: "Limite de retrait dépassée",
    rejectedReason: "Limite de retrait mensuelle dépassée",
    rejectedDate: "2023-05-07T09:50:00",
  },
];

export default function WithdrawalsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'requestDate', direction: 'desc' });
  const [currentWithdrawal, setCurrentWithdrawal] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Filtrer les retraits
  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    const matchesSearch = searchTerm === '' || 
      withdrawal.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || withdrawal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Trier les retraits
  const sortedWithdrawals = [...filteredWithdrawals].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  // Fonction pour changer le tri
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Formatage des dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Badge de statut
  const StatusBadge = ({ status }) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Approuvé
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={12} className="mr-1" />
            En attente
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle size={12} className="mr-1" />
            Rejeté
          </span>
        );
      default:
        return null;
    }
  };
  
  // Fonction pour ouvrir le modal de détail
  const openDetailModal = (withdrawal) => {
    setCurrentWithdrawal(withdrawal);
    setShowDetailModal(true);
  };
  
  // Calculer les statistiques
  const totalAmount = withdrawals.reduce((acc, w) => acc + w.amount, 0);
  const pendingAmount = withdrawals
    .filter(w => w.status === 'pending')
    .reduce((acc, w) => acc + w.amount, 0);
  const pendingCount = withdrawals.filter(w => w.status === 'pending').length;
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <CreditCard className="mr-2 text-dinary-turquoise" /> 
            Gestion des retraits
          </h1>
          <p className="text-sm text-gray-500 mt-1">Validez et suivez les demandes de retrait des utilisateurs</p>
        </div>
        <button className="btn-primary flex items-center">
          <Download size={16} className="mr-1" />
          Exporter les données
        </button>
      </div>
      
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="admin-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Montant total</p>
              <p className="text-2xl font-bold">{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DZD</p>
            </div>
          </div>
        </div>
        
        <div className="admin-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Montant en attente</p>
              <p className="text-2xl font-bold">{pendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DZD</p>
            </div>
          </div>
        </div>
        
        <div className="admin-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Demandes en attente</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher par nom d'utilisateur ou ID..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:border-dinary-turquoise focus:outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <select
            className="border rounded-lg px-3 py-2 focus:border-dinary-turquoise focus:outline-none text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="approved">Approuvés</option>
            <option value="rejected">Rejetés</option>
          </select>
        </div>
      </div>
      
      {/* Withdrawals Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('id')}>
                  <div className="flex items-center">
                    ID
                    <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('userName')}>
                  <div className="flex items-center">
                    Client
                    <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('amount')}>
                  <div className="flex items-center">
                    Montant
                    <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('requestDate')}>
                  <div className="flex items-center">
                    Date de demande
                    <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('status')}>
                  <div className="flex items-center">
                    Statut
                    <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedWithdrawals.map((withdrawal) => (
                <tr key={withdrawal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {withdrawal.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                        {withdrawal.userName.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{withdrawal.userName}</div>
                        <div className="text-xs text-gray-500">{withdrawal.userId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">                    {withdrawal.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DZD
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(withdrawal.requestDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={withdrawal.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2 justify-end">
                      <button 
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-dinary-turquoise"
                        onClick={() => openDetailModal(withdrawal)}
                      >
                        <Eye size={18} />
                      </button>
                      
                      {withdrawal.status === 'pending' && (
                        <>
                          <button className="p-1 rounded-full hover:bg-green-100 text-gray-500 hover:text-green-600">
                            <Check size={18} />
                          </button>
                          <button className="p-1 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600">
                            <X size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Affichage de <span className="font-medium">{sortedWithdrawals.length}</span> demandes sur <span className="font-medium">{withdrawals.length}</span>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded text-sm text-gray-500 hover:bg-gray-50" disabled>
              Précédent
            </button>
            <button className="px-3 py-1 border rounded text-sm bg-dinary-turquoise text-white">
              1
            </button>
            <button className="px-3 py-1 border rounded text-sm text-gray-500 hover:bg-gray-50" disabled>
              Suivant
            </button>
          </div>
        </div>
      </div>
      
      {/* Detail Modal */}
      {showDetailModal && currentWithdrawal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Détails du retrait</h3>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowDetailModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ID de la demande</p>
                  <p className="text-base font-medium">{currentWithdrawal.id}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Statut</p>
                  <div className="mt-1">
                    <StatusBadge status={currentWithdrawal.status} />
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Utilisateur</p>
                  <p className="text-base font-medium">{currentWithdrawal.userName}</p>
                  <p className="text-xs text-gray-500">{currentWithdrawal.userId}</p>
                </div>
                
                <div>                  <p className="text-sm text-gray-500">Montant</p>
                  <p className="text-base font-medium">{currentWithdrawal.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DZD</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Date de demande</p>
                  <p className="text-base">{formatDate(currentWithdrawal.requestDate)}</p>
                </div>
                
                {currentWithdrawal.completedDate && (
                  <div>
                    <p className="text-sm text-gray-500">Date de validation</p>
                    <p className="text-base">{formatDate(currentWithdrawal.completedDate)}</p>
                  </div>
                )}
                
                {currentWithdrawal.rejectedDate && (
                  <div>
                    <p className="text-sm text-gray-500">Date de rejet</p>
                    <p className="text-base">{formatDate(currentWithdrawal.rejectedDate)}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-500">Infos du compte</p>
                  <p className="text-base font-medium">{currentWithdrawal.accountInfo}</p>
                  <p className="text-xs text-gray-500">{currentWithdrawal.bank}</p>
                </div>
              </div>
              
              {currentWithdrawal.notes && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="text-base bg-gray-50 p-2 rounded">{currentWithdrawal.notes}</p>
                </div>
              )}
              
              {currentWithdrawal.rejectedReason && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Motif du rejet</p>
                  <p className="text-base bg-red-50 text-red-700 p-2 rounded">{currentWithdrawal.rejectedReason}</p>
                </div>
              )}
              
              {currentWithdrawal.status === 'pending' && (
                <div className="mt-6 border-t pt-4 flex justify-end space-x-3">
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dinary-turquoise">
                    Rejeter
                  </button>
                  <button className="px-4 py-2 bg-dinary-turquoise border border-transparent rounded-lg text-sm font-medium text-white hover:bg-dinary-turquoise/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dinary-turquoise">
                    Approuver
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
