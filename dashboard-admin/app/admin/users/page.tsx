'use client';

import { useState, useEffect } from 'react';
import { 
  Search, Filter, MoreHorizontal, MessageSquare, 
  Shield, UserX, TrendingUp, RefreshCw, CheckCircle,
  XCircle, Download, Upload, Clock, AlertCircle, Eye,
  CreditCard, DollarSign, User, UserCheck, BarChart2, FileText,
  ChevronDown, PlusCircle, ArrowUpRight, Mail, Phone, X
} from 'lucide-react';
import { format } from 'date-fns';
import { userService, rechargeService } from '@/lib/supabase';
import UserLevelSystem from '@/components/admin/UserLevelSystem';
import { userStats as mockUserStats } from '@/lib/mock-data';

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Tabs interface component
const Tabs = ({ tabs, activeTab, setActiveTab, rechargeData, verificationData }: { 
  tabs: { id: string, label: string, icon: React.ReactNode }[],
  activeTab: string,
  setActiveTab: (id: string) => void,
  rechargeData: any[],
  verificationData: any[]
}) => {
  return (
    <div className="flex space-x-1 overflow-x-auto pb-2 border-b">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 flex items-center space-x-2 rounded-t-lg transition-colors ${
            activeTab === tab.id 
              ? 'bg-white text-dinary-turquoise border-b-2 border-dinary-turquoise font-medium'
              : 'text-gray-600 hover:text-dinary-turquoise hover:bg-gray-50'
          }`}
        >
          {tab.icon}
          <span>{tab.label}</span>
          {tab.id === 'recharge-requests' && (
            <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
              {rechargeData.filter((req: any) => req.status === 'pending').length}
            </span>
          )}
          {tab.id === 'verifications' && (
            <span className="bg-amber-100 text-amber-600 text-xs px-2 py-0.5 rounded-full">
              {verificationData.filter((ver: any) => ver.status === 'pending').length}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

// Modal pour les détails d'un utilisateur
const UserDetailModal = ({ 
  user,
  onClose,
}: { 
  user: any, 
  onClose: () => void,
}) => {
  // Données simulées pour les activités et transactions récentes de l'utilisateur
  const userActivities = [
    { type: 'login', date: '2023-11-06T10:24:00', details: 'Connexion depuis un appareil mobile' },
    { type: 'payment', date: '2023-11-05T16:45:00', details: 'Paiement de 35.50 DZD chez Café Paris' },
    { type: 'boost', date: '2023-11-05T14:20:00', details: 'Gain de 25 points boost (mission quotidienne)' },
    { type: 'payment', date: '2023-11-04T11:30:00', details: 'Paiement de 12.75 DZD chez Boulangerie St Michel' },
    { type: 'topup', date: '2023-11-03T09:15:00', details: 'Recharge de 100 DZD (virement bancaire)' },
    { type: 'login', date: '2023-11-02T08:30:00', details: 'Connexion depuis un nouveau appareil' },
  ];

  const userTransactions = [
    { id: 'TX89012', merchant: 'Café Paris', amount: 35.50, date: '2023-11-05T16:45:00', status: 'completed' },
    { id: 'TX89011', merchant: 'Boulangerie St Michel', amount: 12.75, date: '2023-11-04T11:30:00', status: 'completed' },
    { id: 'TX89005', merchant: 'Librairie Moderne', amount: 48.20, date: '2023-11-01T15:10:00', status: 'completed' },
    { id: 'TX88990', merchant: 'Épicerie du Quartier', amount: 67.35, date: '2023-10-28T17:22:00', status: 'completed' },
  ];

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMM yyyy');
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMM yyyy, HH:mm');
  };
  
  // Fonction pour obtenir l'icône en fonction du type d'activité
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <User className="h-5 w-5 text-blue-500" />;
      case 'payment':
        return <CreditCard className="h-5 w-5 text-green-500" />;
      case 'topup':
        return <Upload className="h-5 w-5 text-purple-500" />;
      case 'boost':
        return <TrendingUp className="h-5 w-5 text-amber-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  // Statistiques de l'utilisateur
  const userStats = {
    totalSpent: userTransactions.reduce((sum, tx) => sum + tx.amount, 0),
    avgTransaction: userTransactions.reduce((sum, tx) => sum + tx.amount, 0) / userTransactions.length,
    mostFrequentMerchant: 'Café Paris',
    lastLogin: new Date('2023-11-06T10:24:00'),
    deviceUsed: 'Mobile (Android)',
    successRate: 98.5,
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-50 border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-dinary-turquoise text-white text-xl flex items-center justify-center font-medium">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {user.name}
                <StatusBadge status={user.status} />
                <span className="text-sm text-gray-500">#{user.id}</span>
              </h2>
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <div className="flex items-center mr-4">
                  <Mail size={14} className="mr-1" /> {user.email}
                </div>
                <div className="flex items-center">
                  <Phone size={14} className="mr-1" /> {user.phone}
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Content area with scroll */}
        <div className="overflow-y-auto p-6 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Colonne 1 - Infos générales */}
            <div className="space-y-6">              <div className="bg-white border rounded-lg p-5 shadow-sm">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Informations générales</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Inscrit le</span>
                    <span className="text-sm font-medium">{formatDate(user.registered)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Dernière activité</span>
                    <span className="text-sm font-medium">{formatDate(user.lastActive)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Statut</span>
                    <StatusBadge status={user.status} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Transactions</span>
                    <span className="text-sm font-medium">{user.transactions}</span>
                  </div>
                </div>
              </div>
              
              {/* Composant système de progression */}
              <UserLevelSystem 
                userType="user"
                level={user.level}
                xp={user.xp}
                xpToNextLevel={user.xpToNextLevel}
                points={user.points}
                starPoints={user.starPoints}
                challenges={[
                  {
                    title: "Fidélité mensuelle",
                    description: "Effectuer 5 paiements en 1 semaine",
                    progress: 3,
                    total: 5,
                    reward: 10,
                    rewardType: "starPoints",
                    status: "active",
                    daysLeft: 2
                  },
                  {
                    title: "Défi des commerçants",
                    description: "Payer chez 3 nouveaux commerçants",
                    progress: 3,
                    total: 3,
                    reward: 25,
                    rewardType: "starPoints",
                    status: "completed"
                  },
                  {
                    title: "Expert des paiements",
                    description: "Atteindre 100 transactions totales",
                    progress: user.transactions,
                    total: 100,
                    reward: 50,
                    rewardType: "starPoints",
                    status: "active"
                  }
                ]}
              />
              
              <div className="bg-white border rounded-lg p-5 shadow-sm">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Statistiques</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total dépensé</span>
                    <span className="text-sm font-medium">{userStats.totalSpent.toFixed(2)} DZD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Panier moyen</span>
                    <span className="text-sm font-medium">{userStats.avgTransaction.toFixed(2)} DZD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Commerçant fréquent</span>
                    <span className="text-sm font-medium">{userStats.mostFrequentMerchant}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Dernière connexion</span>
                    <span className="text-sm font-medium">{format(userStats.lastLogin, 'dd MMM, HH:mm')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Appareil utilisé</span>
                    <span className="text-sm font-medium">{userStats.deviceUsed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Taux de succès</span>
                    <span className="text-sm font-medium">{userStats.successRate}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Colonne 2 - Activités récentes */}
            <div className="bg-white border rounded-lg p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Activités récentes</h3>
                <button className="text-xs text-dinary-turquoise hover:underline">
                  Voir tout
                </button>
              </div>
              <div className="space-y-4">
                {userActivities.map((activity, idx) => (
                  <div key={idx} className="flex items-start border-b border-gray-100 pb-3 last:border-0">
                    <div className="bg-gray-100 rounded-full p-2 mr-3">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.details}</p>
                      <p className="text-xs text-gray-500">{formatDateTime(activity.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Colonne 3 - Transactions récentes */}
            <div className="bg-white border rounded-lg p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Dernières transactions</h3>
                <button className="text-xs text-dinary-turquoise hover:underline">
                  Voir tout
                </button>
              </div>
              <div className="space-y-4">
                {userTransactions.map((transaction, idx) => (
                  <div key={idx} className="border-b border-gray-100 pb-3 last:border-0">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{transaction.merchant}</span>
                      <span className="text-sm font-medium text-green-600">{transaction.amount.toFixed(2)} DZD</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">{transaction.id}</span>
                      <span className="text-xs text-gray-500">{format(new Date(transaction.date), 'dd MMM, HH:mm')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
            {/* Missions et défis liés aux points étoilés */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Missions et défis</h3>
              <div className="space-y-4">
                <div className="border border-amber-200 bg-amber-50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-amber-800">Fidélité mensuelle</span>
                    <span className="px-2 py-1 bg-amber-200 text-amber-800 text-xs rounded-full">10 points étoilés</span>
                  </div>
                  <p className="text-sm text-amber-700">Effectuer 5 paiements en 1 semaine</p>
                  <div className="mt-2 w-full bg-white rounded-full h-2">
                    <div className="bg-amber-400 h-2 rounded-full" style={{width: '60%'}}></div>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-amber-700">
                    <span>3/5 complétés</span>
                    <span>2j restants</span>
                  </div>
                </div>

                <div className="border border-green-200 bg-green-50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-green-800">Défi des commerçants</span>
                    <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full">25 points étoilés</span>
                  </div>
                  <p className="text-sm text-green-700">Payer chez 3 nouveaux commerçants</p>
                  <div className="mt-2 w-full bg-white rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '100%'}}></div>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-green-700">
                    <span>3/3 complétés</span>
                    <span className="font-medium text-green-600">Terminé</span>
                  </div>
                </div>

                <div className="border border-purple-200 bg-purple-50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-purple-800">Expert des paiements</span>
                    <span className="px-2 py-1 bg-purple-200 text-purple-800 text-xs rounded-full">50 points étoilés</span>
                  </div>
                  <p className="text-sm text-purple-700">Atteindre 100 transactions totales</p>
                  <div className="mt-2 w-full bg-white rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{width: '43%'}}></div>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-purple-700">
                    <span>{user.transactions}/100 transactions</span>
                    <span>En cours</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Graph section */}
            <div className="bg-white border rounded-lg p-5 shadow-sm">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Progression du niveau</h3>
              <div className="h-64">
                {/* Placeholder pour un graphique */}
                <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                  Graphique de progression des niveaux et points
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer avec actions */}
        <div className="bg-gray-50 border-t px-6 py-4 flex justify-between items-center sticky bottom-0">
          <div className="flex space-x-2">
            <button 
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md flex items-center text-sm hover:bg-blue-100"
            >
              <MessageSquare size={16} className="mr-2" />
              Envoyer un message
            </button>
            <button 
              className="px-4 py-2 bg-purple-50 text-purple-600 rounded-md flex items-center text-sm hover:bg-purple-100"
            >
              <TrendingUp size={16} className="mr-2" />
              Ajouter des points
            </button>
          </div>
          <div className="flex space-x-2">
            {user.status === 'blocked' ? (
              <button className="px-4 py-2 bg-green-50 text-green-600 rounded-md flex items-center text-sm hover:bg-green-100">
                <Shield size={16} className="mr-2" />
                Débloquer l'utilisateur
              </button>
            ) : (
              <button className="px-4 py-2 bg-amber-50 text-amber-600 rounded-md flex items-center text-sm hover:bg-amber-100">
                <Shield size={16} className="mr-2" />
                Bloquer l'utilisateur
              </button>
            )}
            <button className="px-4 py-2 bg-red-50 text-red-600 rounded-md flex items-center text-sm hover:bg-red-100">
              <UserX size={16} className="mr-2" />
              Supprimer le compte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Rechargement details modal component
const RechargeDetailModal = ({ 
  recharge, 
  onClose, 
  onApprove, 
  onReject 
}: { 
  recharge: any, 
  onClose: () => void, 
  onApprove: (id: string, note: string) => void,
  onReject: (id: string, reason: string) => void
}) => {
  const [note, setNote] = useState('');
  const [reason, setReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Demande de rechargement</h3>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            recharge.status === 'pending' ? 'bg-amber-100 text-amber-800' :
            recharge.status === 'approved' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {recharge.status === 'pending' ? 'En attente' :
             recharge.status === 'approved' ? 'Approuvé' : 'Rejeté'}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between border-b pb-3">
            <span className="text-gray-500">ID</span>
            <span className="font-medium">{recharge.id}</span>
          </div>
          
          <div className="flex justify-between border-b pb-3">
            <span className="text-gray-500">Utilisateur</span>
            <span className="font-medium">{recharge.userName}</span>
          </div>
          
          <div className="flex justify-between border-b pb-3">
            <span className="text-gray-500">Montant</span>
            <span className="font-medium text-green-600">{recharge.amount.toFixed(2)} DZD</span>
          </div>
          
          <div className="flex justify-between border-b pb-3">
            <span className="text-gray-500">Date de demande</span>
            <span className="font-medium">{format(new Date(recharge.requestDate), 'dd MMM yyyy, HH:mm')}</span>
          </div>
          
          <div className="flex justify-between border-b pb-3">
            <span className="text-gray-500">Méthode de paiement</span>
            <span className="font-medium">
              {recharge.paymentMethod === 'bank_transfer' ? 'Virement bancaire' : 'Mobile Money'}
            </span>
          </div>
          
          <div className="flex justify-between border-b pb-3">
            <span className="text-gray-500">Référence</span>
            <span className="font-medium">{recharge.reference}</span>
          </div>
          
          <div className="border-b pb-3">
            <span className="text-gray-500 block mb-2">Justificatif</span>
            <div className="border rounded-lg overflow-hidden bg-gray-100 flex justify-center">
              <img 
                src="https://via.placeholder.com/300x150?text=Proof+Document" 
                alt="Justificatif" 
                className="max-h-40 object-contain"
              />
            </div>
            <button className="mt-2 text-sm flex items-center text-dinary-turquoise">
              <Download size={14} className="mr-1" /> Télécharger le justificatif
            </button>
          </div>
          
          {recharge.status === 'pending' ? (
            <>
              {isRejecting ? (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Raison du rejet
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:border-dinary-turquoise focus:outline-none"
                    rows={3}
                    placeholder="Expliquez la raison du rejet..."
                  />
                </div>
              ) : (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note (optionnelle)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:border-dinary-turquoise focus:outline-none"
                    rows={2}
                    placeholder="Ajouter une note..."
                  />
                </div>
              )}
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Annuler
                </button>
                
                {isRejecting ? (
                  <>
                    <button
                      onClick={() => setIsRejecting(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Retour
                    </button>
                    <button
                      onClick={() => onReject(recharge.id, reason)}
                      className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700"
                      disabled={!reason.trim()}
                    >
                      Confirmer le rejet
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsRejecting(true)}
                      className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      Rejeter
                    </button>
                    <button
                      onClick={() => onApprove(recharge.id, note)}
                      className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      Approuver
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex justify-end mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Stats card component
const UserStatCard = ({ title, value, icon, colorClass }: { 
  title: string, 
  value: string | number, 
  icon: React.ReactNode,
  colorClass: string
}) => {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 transition-transform hover:shadow-md hover:scale-[1.02] duration-300">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-2 rounded-full ${colorClass}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRecharge, setSelectedRecharge] = useState<any>(null);
  const [selectedUserDetail, setSelectedUserDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Real data state management
  const [users, setUsers] = useState<any[]>([]);
  const [rechargeData, setRechargeData] = useState<any[]>([]);
  const [verificationData, setVerificationData] = useState<any[]>([]);
  const [userStats, setUserStats] = useState({
    ...mockUserStats, // Use mock data as initial state
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    totalTransactions: 0
  });

  // Create new manual recharge
  const [showNewRechargeModal, setShowNewRechargeModal] = useState(false);
  const [newRechargeData, setNewRechargeData] = useState({
    userId: '',
    amount: '',
    paymentMethod: 'bank_transfer',
    reference: ''
  });

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch users
        const usersData = await userService.getUsers();
        setUsers(usersData);
        
        // Fetch recharge requests
        const rechargesData = await rechargeService.getRechargeRequests();
        setRechargeData(rechargesData);
        
        // Set verification data (empty for now)
        setVerificationData([]);
          // Calculate user stats
        setUserStats(prevStats => ({
          ...prevStats, // Keep other mock stats
          totalUsers: usersData.length,
          activeUsers: usersData.filter((user: any) => user.status === 'active').length,
          newUsers: usersData.filter((user: any) => {
            const createdAt = new Date(user.created_at);
            const lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);
            return createdAt > lastWeek;
          }).length,
          totalTransactions: usersData.reduce((sum: number, user: any) => sum + (user.star_points || 0), 0)
        }));
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Approve a recharge request
  const handleApproveRecharge = async (rechargeId: string, note: string) => {
    try {
      await rechargeService.updateRechargeRequest(rechargeId, {
        status: 'approved',
        notes: note || 'Approved by admin'
      });
      
      // Refresh recharge data
      const rechargesData = await rechargeService.getRechargeRequests();
      setRechargeData(rechargesData);
      setSelectedRecharge(null);
    } catch (error) {
      console.error('Error approving recharge:', error);
    }
  };

  // Reject a recharge request
  const handleRejectRecharge = async (rechargeId: string, reason: string) => {
    try {
      await rechargeService.updateRechargeRequest(rechargeId, {
        status: 'rejected',
        notes: reason
      });
      
      // Refresh recharge data
      const rechargesData = await rechargeService.getRechargeRequests();
      setRechargeData(rechargesData);
      setSelectedRecharge(null);
    } catch (error) {
      console.error('Error rejecting recharge:', error);
    }
  };

  // Create new manual recharge
  const handleCreateRecharge = async () => {
    try {
      await rechargeService.createRechargeRequest({
        user_id: newRechargeData.userId,
        amount: parseFloat(newRechargeData.amount),
        payment_method: newRechargeData.paymentMethod,
        reference_code: newRechargeData.reference,
        status: 'pending'
      });
      
      // Refresh recharge data
      const rechargesData = await rechargeService.getRechargeRequests();
      setRechargeData(rechargesData);
      setShowNewRechargeModal(false);
    } catch (error) {
      console.error('Error creating recharge:', error);
    }
  };
  
  // Handle opening action modal
  const handleAction = (userId: string, action: string) => {
    setSelectedUser(userId);
    setActionType(action);
    setShowActionModal(true);
  };
  
  // Close action modal
  const closeModal = () => {
    setShowActionModal(false);
    setSelectedUser(null);
    setActionType(null);
  };
  
  // Mock function for user actions
  const performAction = () => {
    // Here we would normally call an API to perform the action
    console.log(`Performing ${actionType} action on user ${selectedUser}`);
    closeModal();
    // Show success message (would use a toast in a real app)
    alert(`Action ${actionType} performed successfully`);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMM yyyy');
  };
  // Filter users based on search query and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (user.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (user.phone || '').includes(searchQuery);
    
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Tabs configuration
  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <BarChart2 size={18} className="text-blue-500" /> },
    { id: 'users-list', label: 'Liste utilisateurs', icon: <User size={18} className="text-purple-500" /> },
    { id: 'recharge-requests', label: 'Demandes de rechargement', icon: <CreditCard size={18} className="text-green-500" /> },
    { id: 'manual-recharge', label: 'Rechargement libre', icon: <DollarSign size={18} className="text-amber-500" /> },
    { id: 'verifications', label: 'Vérifications', icon: <UserCheck size={18} className="text-red-500" /> },
  ];
  return (
    <div className="space-y-6">
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dinary-turquoise"></div>
        </div>
      )}

      {!loading && (
        <>
          {/* Page Title */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Gestion des utilisateurs</h1>
            <button 
              className="bg-dinary-turquoise text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center space-x-2"
              onClick={() => {
                // In a real app, this would fetch fresh data
                console.log('Refreshing data...');
              }}
            >
              <RefreshCw size={16} />
              <span>Actualiser</span>
            </button>
          </div>

          {/* Tabs */}
          <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} rechargeData={rechargeData} verificationData={verificationData} />
          
          {/* Tab Content */}
          <div className="bg-white rounded-lg p-6 border shadow-sm">{/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Statistiques utilisateurs</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <UserStatCard 
                title="Total utilisateurs" 
                value={userStats.totalUsers} 
                icon={<User className="h-5 w-5 text-white" />} 
                colorClass="bg-blue-500"
              />
              <UserStatCard 
                title="Utilisateurs actifs" 
                value={userStats.activeUsers} 
                icon={<UserCheck className="h-5 w-5 text-white" />} 
                colorClass="bg-green-500"
              />
              <UserStatCard 
                title="Nouveaux aujourd'hui" 
                value={userStats.newUsersToday} 
                icon={<TrendingUp className="h-5 w-5 text-white" />} 
                colorClass="bg-purple-500"
              />
              <UserStatCard 
                title="Demandes en attente" 
                value={userStats.pendingRecharges} 
                icon={<Clock className="h-5 w-5 text-white" />} 
                colorClass="bg-amber-500"
              />
            </div>
            
            {/* Nouvelles statistiques pour niveaux et points */}
            <div className="mt-8">
              <h3 className="text-md font-medium text-gray-700 mb-3">Système de progression</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <UserStatCard 
                  title="Niveau moyen" 
                  value={userStats.averageLevel} 
                  icon={<BarChart2 className="h-5 w-5 text-white" />} 
                  colorClass="bg-indigo-500"
                />
                <UserStatCard 
                  title="Niveau max atteint" 
                  value={userStats.highestLevel} 
                  icon={<TrendingUp className="h-5 w-5 text-white" />} 
                  colorClass="bg-pink-500"
                />                <UserStatCard 
                  title="Total XP généré" 
                  value={userStats.totalXpEarned ? userStats.totalXpEarned.toLocaleString() : '0'} 
                  icon={<ArrowUpRight className="h-5 w-5 text-white" />} 
                  colorClass="bg-cyan-500"
                />                <UserStatCard 
                  title="Points étoilés distribués" 
                  value={userStats.totalStarPoints ? userStats.totalStarPoints.toLocaleString() : '0'} 
                  icon={<Download className="h-5 w-5 text-white" />} 
                  colorClass="bg-amber-500"
                />
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-md font-medium text-gray-700 mb-3">Aperçu de l'état des comptes</h3>
              <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                <div className="flex h-full">
                  <div 
                    className="bg-green-500 flex items-center justify-center text-xs font-medium text-white"
                    style={{ width: `${(userStats.activeUsers / userStats.totalUsers) * 100}%` }}
                  >
                    {Math.round((userStats.activeUsers / userStats.totalUsers) * 100)}% Actifs
                  </div>
                  <div 
                    className="bg-amber-400 flex items-center justify-center text-xs font-medium text-white"
                    style={{ width: `${(userStats.inactiveUsers / userStats.totalUsers) * 100}%` }}
                  >
                    {Math.round((userStats.inactiveUsers / userStats.totalUsers) * 100)}% Inactifs
                  </div>
                  <div 
                    className="bg-red-500 flex items-center justify-center text-xs font-medium text-white"
                    style={{ width: `${(userStats.blockedUsers / userStats.totalUsers) * 100}%` }}
                  >
                    {Math.round((userStats.blockedUsers / userStats.totalUsers) * 100)}% Bloqués
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <div className="border rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-700 mb-3">Derniers utilisateurs inscrits</h3>
                <div className="space-y-3">
                  {users.slice(0, 5).map(user => (
                    <div key={user.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-dinary-turquoise text-white flex items-center justify-center">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-3 flex-grow">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{formatDate(user.registered)}</p>
                      </div>
                      <StatusBadge status={user.status} />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-700 mb-3">Dernières demandes de rechargement</h3>
                <div className="space-y-3">
                  {rechargeData.slice(0, 5).map(recharge => (
                    <div key={recharge.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                        recharge.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                        recharge.status === 'approved' ? 'bg-green-100 text-green-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {recharge.status === 'pending' ? <Clock size={16} /> :
                         recharge.status === 'approved' ? <CheckCircle size={16} /> :
                         <XCircle size={16} />}
                      </div>
                      <div className="ml-3 flex-grow">
                        <p className="text-sm font-medium">{recharge.userName}</p>
                        <p className="text-xs text-gray-500">{recharge.amount.toFixed(2)} DZD • {format(new Date(recharge.requestDate), 'dd/MM/yyyy')}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedRecharge(recharge)}
                        className="text-xs text-dinary-turquoise hover:underline"
                      >
                        Voir
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Users List Tab */}
        {activeTab === 'users-list' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="relative w-full sm:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par nom, email ou téléphone"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-dinary-turquoise focus:outline-none text-sm"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter size={18} className="text-gray-500" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-dinary-turquoise bg-white text-gray-800 text-sm"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="blocked">Bloqué</option>
                </select>
              </div>
            </div>
            
            {/* Users Table */}
            <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inscription</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dernière activité</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">                    {filteredUsers.map((user) => (
                      <tr 
                        key={user.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedUserDetail(user)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-dinary-turquoise text-white flex items-center justify-center">
                              {user.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-xs text-gray-500">{user.email}</div>
                              <div className="text-xs text-gray-500">{user.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={user.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.registered)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.lastActive)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.points}</div>
                          <div className="text-xs text-gray-500">Boosts</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.transactions}</div>
                          <div className="text-xs text-gray-500">Paiements</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                          <div className="relative group">
                            <button className="text-gray-400 hover:text-gray-500">
                              <MoreHorizontal size={20} />
                            </button>
                            <div className="absolute right-0 w-48 mt-2 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
                              <div className="py-1">
                                <button 
                                  onClick={() => handleAction(user.id, 'message')}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <MessageSquare size={16} className="mr-2 text-dinary-turquoise" />
                                  Message
                                </button>
                                <button 
                                  onClick={() => handleAction(user.id, 'block')}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Shield size={16} className="mr-2 text-amber-500" />
                                  {user.status === 'blocked' ? 'Débloquer' : 'Bloquer'}
                                </button>
                                <button 
                                  onClick={() => handleAction(user.id, 'boost')}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <TrendingUp size={16} className="mr-2 text-green-500" />
                                  Ajouter des points
                                </button>
                                <button 
                                  onClick={() => handleAction(user.id, 'delete')}
                                  className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <UserX size={16} className="mr-2" />
                                  Supprimer le compte
                                </button>
                                <button 
                                  onClick={() => setSelectedUserDetail(user)}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Eye size={16} className="mr-2 text-blue-500" />
                                  Voir détails
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                          Aucun utilisateur ne correspond à vos critères
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* Recharge Requests Tab */}
        {activeTab === 'recharge-requests' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">Demandes de rechargement</h3>
              <div className="flex space-x-2">
                <div className="relative">
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-dinary-turquoise bg-white text-gray-800 text-sm appearance-none pr-8"
                    defaultValue="all"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="approved">Approuvés</option>
                    <option value="rejected">Rejetés</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={14} />
                  </div>
                </div>
                
                <div className="relative">
                  <select 
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-dinary-turquoise bg-white text-gray-800 text-sm appearance-none pr-8"
                    defaultValue="newest"
                  >
                    <option value="newest">Plus récents</option>
                    <option value="oldest">Plus anciens</option>
                    <option value="highest">Montant plus élevé</option>
                    <option value="lowest">Montant plus bas</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown size={14} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="overflow-hidden rounded-lg border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rechargeData.map((recharge) => (
                    <tr key={recharge.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {recharge.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-dinary-turquoise text-white flex items-center justify-center">
                            {recharge.userName.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{recharge.userName}</div>
                            <div className="text-xs text-gray-500">ID: {recharge.userId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {recharge.amount.toFixed(2)} DZD
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(recharge.requestDate), 'dd MMM yyyy, HH:mm')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {recharge.paymentMethod === 'bank_transfer' ? 'Virement' : 'Mobile Money'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          recharge.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          recharge.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {recharge.status === 'pending' ? 'En attente' :
                           recharge.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <div className="flex justify-center space-x-2">
                          <button 
                            className="text-dinary-turquoise hover:text-dinary-turquoise/80"
                            onClick={() => setSelectedRecharge(recharge)}
                          >
                            <Eye size={18} />
                          </button>
                          
                          {recharge.status === 'pending' && (
                            <>
                              <button 
                                className="text-green-600 hover:text-green-700" 
                                onClick={() => handleApproveRecharge(recharge.id, '')}
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button 
                                className="text-red-600 hover:text-red-700"
                                onClick={() => setSelectedRecharge(recharge)}
                              >
                                <XCircle size={18} />
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
          </div>
        )}
        
        {/* Manual Recharge Tab */}
        {activeTab === 'manual-recharge' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-800">Rechargement libre</h3>
              <button 
                className="bg-dinary-turquoise text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center space-x-2"
                onClick={() => setShowNewRechargeModal(true)}
              >
                <PlusCircle size={16} />
                <span>Nouveau rechargement</span>
              </button>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Informations importantes</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Le rechargement libre permet d'ajouter des fonds au compte d'un utilisateur sans demande préalable.</p>
                    <p className="mt-1">
                      <strong>Note :</strong> Cette opération sera enregistrée dans l'historique administrateur avec vos informations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border rounded-lg p-6">
              <div className="space-y-6 max-w-lg mx-auto">
                <div>
                  <label htmlFor="user-select" className="block text-sm font-medium text-gray-700 mb-1">
                    Utilisateur
                  </label>
                  <div className="relative">
                    <select
                      id="user-select"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-dinary-turquoise text-sm"
                      value={newRechargeData.userId}
                      onChange={(e) => setNewRechargeData({...newRechargeData, userId: e.target.value})}
                    >
                      <option value="">Sélectionner un utilisateur</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Montant (DZD)
                  </label>
                  <input
                    type="number"
                    id="amount"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-dinary-turquoise text-sm"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={newRechargeData.amount}
                    onChange={(e) => setNewRechargeData({...newRechargeData, amount: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Méthode de rechargement
                  </label>
                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <input
                        id="payment-method-bank"
                        name="paymentMethod"
                        type="radio"
                        checked={newRechargeData.paymentMethod === 'bank_transfer'}
                        onChange={() => setNewRechargeData({...newRechargeData, paymentMethod: 'bank_transfer'})}
                        className="h-4 w-4 text-dinary-turquoise focus:ring-dinary-turquoise border-gray-300"
                      />
                      <label htmlFor="payment-method-bank" className="ml-2 block text-sm text-gray-700">
                        Virement bancaire
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="payment-method-mobile"
                        name="paymentMethod"
                        type="radio"
                        checked={newRechargeData.paymentMethod === 'mobile_money'}
                        onChange={() => setNewRechargeData({...newRechargeData, paymentMethod: 'mobile_money'})}
                        className="h-4 w-4 text-dinary-turquoise focus:ring-dinary-turquoise border-gray-300"
                      />
                      <label htmlFor="payment-method-mobile" className="ml-2 block text-sm text-gray-700">
                        Mobile Money
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="payment-method-manual"
                        name="paymentMethod"
                        type="radio"
                        checked={newRechargeData.paymentMethod === 'manual'}
                        onChange={() => setNewRechargeData({...newRechargeData, paymentMethod: 'manual'})}
                        className="h-4 w-4 text-dinary-turquoise focus:ring-dinary-turquoise border-gray-300"
                      />
                      <label htmlFor="payment-method-manual" className="ml-2 block text-sm text-gray-700">
                        Ajout manuel
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
                    Référence
                  </label>
                  <input
                    type="text"
                    id="reference"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-dinary-turquoise text-sm"
                    placeholder="Référence du paiement"
                    value={newRechargeData.reference}
                    onChange={(e) => setNewRechargeData({...newRechargeData, reference: e.target.value})}
                  />
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Note (optionnelle)
                  </label>
                  <textarea
                    id="notes"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:border-dinary-turquoise text-sm"
                    rows={3}
                    placeholder="Ajoutez une note à propos de cette transaction..."
                  />
                </div>
                  <div className="flex justify-end">
                  <button 
                    type="button"
                    onClick={handleCreateRecharge}
                    className="bg-dinary-turquoise text-white px-6 py-2 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dinary-turquoise"
                    disabled={!newRechargeData.userId || !newRechargeData.amount}
                  >
                    Effectuer le rechargement
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
          {/* Verifications Tab */}
        {activeTab === 'verifications' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Vérifications en attente</h3>
            
            {verificationData.length === 0 ? (
              <div className="bg-gray-50 p-8 rounded-lg border border-dashed border-gray-300 text-center">
                <p className="text-gray-600">Aucune vérification en attente</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {verificationData.map((verification) => (
                  <div key={verification.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                      <div className="font-medium text-gray-900">{verification.userName}</div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800`}>
                        En attente
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-32">Email:</span>
                        <span className="font-medium">{verification.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-32">Téléphone:</span>
                        <span className="font-medium">{verification.phone}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-32">Type de document:</span>
                        <span className="font-medium">
                          {verification.documentType === 'id_card' ? 'Carte d\'identité' :
                           verification.documentType === 'passport' ? 'Passeport' : 'Permis de conduire'}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-32">Date de soumission:</span>
                        <span className="font-medium">
                          {format(new Date(verification.submissionDate), 'dd MMM yyyy, HH:mm')}
                        </span>
                      </div>
                      
                      <div className="border-t pt-3 mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Documents</p>                        <div className="grid grid-cols-2 gap-2">
                          {verification.documentUrls.map((url: string, index: number) => (
                            <div key={index} className="bg-gray-100 rounded-md h-20 flex items-center justify-center">
                              <FileText className="text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2 pt-3">
                        <button 
                          className="py-1 px-3 bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          Rejeter
                        </button>
                        <button 
                          className="py-1 px-3 bg-green-100 text-green-700 rounded hover:bg-green-200"
                        >
                          Approuver
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
        {/* Action Modal - Generic User Actions */}
      {showActionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {actionType === 'message' && 'Envoyer un message'}
              {actionType === 'block' && 'Bloquer l\'utilisateur'}
              {actionType === 'boost' && 'Ajouter des points Boost'}
              {actionType === 'delete' && 'Supprimer le compte utilisateur'}
            </h3>
            
            {actionType === 'message' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md focus:border-dinary-turquoise focus:outline-none"
                  rows={4}
                  placeholder="Entrez votre message ici..."
                />
              </div>
            )}            {actionType === 'block' && (
              <div className="mb-4">
                <p className="text-gray-600 mb-4">
                  Êtes-vous sûr de vouloir bloquer cet utilisateur ? Il ne pourra pas utiliser la plateforme jusqu'à son déblocage.
                </p>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Raison du blocage
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md focus:border-dinary-turquoise focus:outline-none"
                  rows={2}
                  placeholder="Indiquez une raison pour le blocage..."
                />
              </div>
            )}
              {actionType === 'boost' && (
              <div className="mb-4">
                <div className="flex space-x-4 mb-4">
                  <div className="flex items-center">
                    <input
                      id="point-type-boost"
                      name="pointType"
                      type="radio"
                      defaultChecked
                      className="h-4 w-4 text-dinary-turquoise focus:ring-dinary-turquoise border-gray-300"
                    />
                    <label htmlFor="point-type-boost" className="ml-2 block text-sm text-gray-700">
                      Points Boost
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="point-type-star"
                      name="pointType"
                      type="radio"
                      className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-300"
                    />
                    <label htmlFor="point-type-star" className="ml-2 block text-sm text-gray-700">
                      Points Étoilés
                    </label>
                  </div>
                </div>
                
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points à ajouter
                </label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md focus:border-dinary-turquoise focus:outline-none"
                  placeholder="Entrez le montant"
                  min={1}
                />
                
                <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
                  Raison
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md focus:border-dinary-turquoise focus:outline-none">
                  <option value="">Sélectionnez une raison</option>
                  <option value="loyalty">Récompense de fidélité</option>
                  <option value="mission">Complétion de mission</option>
                  <option value="challenge">Défi accompli</option>
                  <option value="compensation">Compensation</option>
                  <option value="promotion">Promotion</option>
                  <option value="other">Autre</option>
                </select>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Informations utilisateur</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <div>
                      <span className="text-gray-500">Niveau actuel:</span>
                      <span className="ml-1 font-medium">5</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Points Boost:</span>
                      <span className="ml-1 font-medium">750</span>
                    </div>
                    <div>
                      <span className="text-gray-500">XP:</span>
                      <span className="ml-1 font-medium">1250/1500</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Points Étoilés:</span>
                      <span className="ml-1 font-medium">120</span>
                    </div>
                  </div>
                </div>
              </div>            )}
            {actionType === 'delete' && (
              <div className="mb-4">
                <p className="text-red-600 font-medium mb-2">Attention : Cette action est irréversible !</p>
                <p className="text-gray-600 mb-4">
                  Êtes-vous sûr de vouloir supprimer définitivement ce compte utilisateur ? Toutes les données associées seront perdues.
                </p>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tapez 'SUPPRIMER' pour confirmer
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:border-dinary-turquoise focus:outline-none"
                  placeholder="Tapez SUPPRIMER pour confirmer"
                />
              </div>
            )}
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={performAction}
                className={`px-4 py-2 rounded-md text-white ${
                  actionType === 'delete' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-dinary-turquoise hover:bg-opacity-90'
                }`}
              >
                Confirmer
              </button>
            </div>
          </div>        </div>
      )}
      
      {/* Recharge Detail Modal */}
      {selectedRecharge && (
        <RechargeDetailModal
          recharge={selectedRecharge}
          onClose={() => setSelectedRecharge(null)}
          onApprove={handleApproveRecharge}
          onReject={handleRejectRecharge}
        />
      )}

      {/* User Detail Modal */}
      {selectedUserDetail && (
        <UserDetailModal
          user={selectedUserDetail}
          onClose={() => setSelectedUserDetail(null)}
        />
      )}
        </>
      )}
    </div>
  );
}