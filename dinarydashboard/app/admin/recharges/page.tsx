'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Wallet,
  Search,
  Filter,
  Plus,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  X,
  Eye,
  CreditCard,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  FileText,
  Ticket,
  Info as InfoIcon
} from 'lucide-react';
import BaridimobVerification from './baridimob-verification';
import RejectionModal from './rejection-modal';
import BaridimobGuide from './baridimob-guide';

// Interface pour les données de recharge
interface UserRechargeData {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  amount: number;
  method: 'virement';  // Uniquement virement BaridiMob pour l'instant
  status: 'en_attente' | 'approuvee' | 'refusee';
  reference: string;
  baridimobReference?: string;  // Référence du virement BaridiMob
  transactionDate?: string;      // Date de la transaction BaridiMob
  dateCreated: string;
  dateProcessed?: string;
  processedBy?: string;
  notes?: string;
  rejectionReason?: 'reference_invalide' | 'montant_incorrect' | 'delai_expire' | 'informations_manquantes' | 'autre';
}

// Statistiques de recharge
interface RechargeStats {
  totalToday: number;
  totalWeek: number;
  totalMonth: number;
  pendingCount: number;
  avgAmount: number;
  topMethod: string;
  changePercentage: number;
}

export default function RechargesPage() {
  const [recharges, setRecharges] = useState<UserRechargeData[]>([]);
  const [stats, setStats] = useState<RechargeStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedRecharge, setSelectedRecharge] = useState<UserRechargeData | null>(null);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [rejectNotes, setRejectNotes] = useState<string>('');
  const [rechargeToReject, setRechargeToReject] = useState<string | null>(null);  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
    // États pour la nouvelle recharge
  const [newRechargeUser, setNewRechargeUser] = useState('');
  const [newRechargeAmount, setNewRechargeAmount] = useState<number>(0);
  const [newRechargeReference, setNewRechargeReference] = useState<string>('');
  const [isCreatingRecharge, setIsCreatingRecharge] = useState(false);
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [isDirectRecharge, setIsDirectRecharge] = useState(false);

  // Liste simulée d'utilisateurs pour la démonstration
  const mockUsers = [
    { name: "Amina Benali", email: "amina.benali@email.com", phone: "+213551234567" },
    { name: "Karim Hadj", email: "karim.hadj@email.com", phone: "+213770123456" },
    { name: "Lina Kaci", email: "lina.kaci@email.com", phone: "+213661234987" },
    { name: "Mounir Ziane", email: "mounir.z@email.com", phone: "+213550987654" },
    { name: "Nassima Amrani", email: "nassima.a@email.com", phone: "+213667890123" }
  ];

  // Données de test
  useEffect(() => {
    setTimeout(() => {      const mockRecharges: UserRechargeData[] = [
        {
          id: 'rech_001',
          userId: 'usr_001',
          userName: 'Ahmed Benali',
          userEmail: 'ahmed.benali@email.com',
          userPhone: '+213551234567',
          amount: 5000,
          method: 'virement',
          status: 'approuvee',
          reference: 'DINARY-VIR-001',
          baridimobReference: 'BRDM-76543210',
          transactionDate: '2025-06-09T14:28:00',
          dateCreated: '2025-06-09T14:30:00',
          dateProcessed: '2025-06-09T14:35:00',
          processedBy: 'admin_jamal',
          notes: 'Virement BaridiMob vérifié'
        },
        {
          id: 'rech_002',
          userId: 'usr_002',
          userName: 'Sarah Kahli',
          userEmail: 'sarah.k@email.com',
          userPhone: '+213667890123',
          amount: 3000,
          method: 'virement',
          status: 'en_attente',
          reference: 'DINARY-VIR-002',
          baridimobReference: 'BRDM-98765432',
          transactionDate: '2025-06-10T09:10:00',
          dateCreated: '2025-06-10T09:15:00'
        },
        {
          id: 'rech_003',
          userId: 'usr_003',
          userName: 'Karim Hadj',
          userEmail: 'karim.h@email.com',
          userPhone: '+213770123456',
          amount: 10000,
          method: 'virement',
          status: 'en_attente',
          reference: 'DINARY-VIR-003',
          dateCreated: '2025-06-10T11:45:00',
          notes: 'En attente de vérification BaridiMob'
        },
        {
          id: 'rech_004',
          userId: 'usr_004',
          userName: 'Amina Zerrouki',
          userEmail: 'amina.z@email.com',
          userPhone: '+213550987654',
          amount: 2000,
          method: 'virement',
          status: 'approuvee',
          reference: 'DINARY-VIR-004',
          baridimobReference: 'BRDM-45678901',
          transactionDate: '2025-06-08T16:15:00',
          dateCreated: '2025-06-08T16:20:00',
          dateProcessed: '2025-06-08T16:22:00',
          processedBy: 'admin_sofia',
          notes: 'Virement BaridiMob vérifié'
        },
        {
          id: 'rech_005',
          userId: 'usr_005',
          userName: 'Malik Bensalem',
          userEmail: 'malik.b@email.com',
          userPhone: '+213661234987',
          amount: 7500,
          method: 'virement',
          status: 'approuvee',
          reference: 'DINARY-VIR-005',
          baridimobReference: 'BRDM-12345678',
          transactionDate: '2025-06-07T10:25:00',
          dateCreated: '2025-06-07T10:30:00',
          dateProcessed: '2025-06-07T11:15:00',
          processedBy: 'admin_jamal',
          notes: 'Virement BaridiMob vérifié'
        },
        {
          id: 'rech_006',
          userId: 'usr_001',
          userName: 'Ahmed Benali',
          userEmail: 'ahmed.benali@email.com',
          userPhone: '+213551234567',
          amount: 1500,
          method: 'virement',
          status: 'refusee',
          reference: 'DINARY-VIR-006',
          dateCreated: '2025-06-06T17:40:00',
          dateProcessed: '2025-06-06T17:42:00',
          processedBy: 'admin_sofia',
          rejectionReason: 'reference_invalide',
          notes: 'Référence BaridiMob invalide ou non trouvée'
        }
      ];
      
      setRecharges(mockRecharges);
      
      // Calculer les statistiques
      const totalToday = mockRecharges
        .filter(r => new Date(r.dateCreated).toDateString() === new Date().toDateString() && r.status === 'approuvee')
        .reduce((sum, r) => sum + r.amount, 0);
        
      const totalWeek = mockRecharges
        .filter(r => {
          const rechDate = new Date(r.dateCreated);
          const now = new Date();
          const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
          return rechDate >= oneWeekAgo && r.status === 'approuvee';
        })
        .reduce((sum, r) => sum + r.amount, 0);
        
      const totalMonth = mockRecharges
        .filter(r => {
          const rechDate = new Date(r.dateCreated);
          const now = new Date();
          return rechDate.getMonth() === now.getMonth() && rechDate.getFullYear() === now.getFullYear() && r.status === 'approuvee';
        })
        .reduce((sum, r) => sum + r.amount, 0);
      
      const pendingCount = mockRecharges.filter(r => r.status === 'en_attente').length;
      
      const approvedRecharges = mockRecharges.filter(r => r.status === 'approuvee');
      const avgAmount = approvedRecharges.length > 0 
        ? approvedRecharges.reduce((sum, r) => sum + r.amount, 0) / approvedRecharges.length 
        : 0;
        // Statistiques générales
      const totalAmount = mockRecharges
        .filter(r => r.status === 'approuvee')
        .reduce((sum, r) => sum + r.amount, 0);
      
      const averageAmount = approvedRecharges.length > 0 
        ? totalAmount / approvedRecharges.length 
        : 0;
        setStats({
        totalToday,
        totalWeek,
        totalMonth,
        pendingCount,
        avgAmount,
        topMethod: 'Virement BaridiMob', // Nous n'avons qu'une seule méthode
        changePercentage: 15.2 // Simulé pour la démonstration
      });
        setLoading(false);
    }, 800);
  }, []);

  const handleApproveRecharge = (id: string) => {
    // Vérifier si la référence BaridiMob est présente
    const recharge = recharges.find(r => r.id === id);
    if (!recharge?.baridimobReference) {
      alert('Impossible d\'approuver: Référence BaridiMob manquante');
      return;
    }
    
    setRecharges(prev => prev.map(r => 
      r.id === id 
        ? {
            ...r, 
            status: 'approuvee', 
            dateProcessed: new Date().toISOString(), 
            processedBy: 'admin_current',
            notes: (r.notes ? r.notes + '\n' : '') + 'Référence BaridiMob vérifiée: ' + r.baridimobReference
          } 
        : r
    ));
  };

  const openRejectModal = (id: string) => {
    setRechargeToReject(id);
    setShowRejectionModal(true);
  };

  const handleRejectRecharge = () => {
    if (!rechargeToReject) return;
    
    setRecharges(prev => prev.map(r => 
      r.id === rechargeToReject 
        ? {
            ...r, 
            status: 'refusee', 
            dateProcessed: new Date().toISOString(), 
            processedBy: 'admin_current',
            rejectionReason: rejectReason as any,
            notes: (r.notes ? r.notes + '\n' : '') + `Rejet: ${rejectReason}`
          } 
        : r
    ));
    
    setShowRejectionModal(false);
    setRejectReason('');
    setRechargeToReject(null);
  };
    const handleViewDetails = (recharge: UserRechargeData) => {
    setSelectedRecharge(recharge);
    setShowDetailModal(true);
  };
  
  // Fonction pour générer une référence unique pour la recharge
  const generateUniqueReference = () => {
    const date = new Date();
    const year = date.getFullYear().toString().substr(2); // 2025 -> 25
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `DINARY-VIR-${year}${month}${day}-${random}`;
  };
  // Fonction pour créer une nouvelle recharge
  const handleCreateRecharge = () => {
    // Vérifier que les champs sont remplis
    if (!newRechargeUser.trim()) {
      alert('Veuillez sélectionner un utilisateur');
      return;
    }
    
    // Utiliser soit le montant personnalisé soit le montant prédéfini
    const finalAmount = isCustomAmount 
      ? parseInt(customAmount) || 0
      : newRechargeAmount;
    
    if (finalAmount < 100) {
      alert('Veuillez entrer un montant valide (minimum 100 DA)');
      return;
    }
    
    setIsCreatingRecharge(true);
    
    // Simuler un appel API
    setTimeout(() => {
      // Calculer le montant final (personnalisé ou prédéfini)
      const finalAmount = isCustomAmount 
        ? parseInt(customAmount) 
        : newRechargeAmount;

      if (isDirectRecharge) {
        // Créer un nouvel objet de recharge directe (déjà approuvée)
        const newDirectRecharge: UserRechargeData = {
          id: `rech_${Date.now()}`,
          userId: `usr_${Date.now()}`, // À remplacer par l'ID réel
          userName: newRechargeUser,
          userEmail: `${newRechargeUser.toLowerCase().replace(/\s+/g, '.')}@email.com`, // Exemple
          userPhone: '+2135XXXXXXXX', // À remplacer par le numéro réel
          amount: finalAmount,
          method: 'virement',
          status: 'approuvee',
          reference: `ADMIN-DIRECT-${Date.now()}`,
          dateCreated: new Date().toISOString(),
          dateProcessed: new Date().toISOString(),
          processedBy: 'admin_current',
          notes: 'Recharge directe par administrateur'
        };
        
        // Ajouter la nouvelle recharge à la liste
        setRecharges(prev => [newDirectRecharge, ...prev]);
        
        // Mettre à jour les statistiques
        if (stats) {
          setStats({
            ...stats,
            totalToday: stats.totalToday + finalAmount,
            totalWeek: stats.totalWeek + finalAmount,
            totalMonth: stats.totalMonth + finalAmount
          });
        }
        
        // Afficher confirmation
        alert(`Compte de ${newRechargeUser} alimenté avec succès de ${finalAmount.toLocaleString()} DA!`);
      } else {
        // Générer une référence unique pour une recharge classique
        const reference = generateUniqueReference();
        setNewRechargeReference(reference);
        
        // Créer un nouvel objet de recharge classique
        const newRecharge: UserRechargeData = {
          id: `rech_${Date.now()}`,
          userId: `usr_${Date.now()}`, // À remplacer par l'ID réel
          userName: newRechargeUser,
          userEmail: `${newRechargeUser.toLowerCase().replace(/\s+/g, '.')}@email.com`, // Exemple
          userPhone: '+2135XXXXXXXX', // À remplacer par le numéro réel
          amount: finalAmount,
          method: 'virement',
          status: 'en_attente',
          reference: reference,
          dateCreated: new Date().toISOString()
        };
        
        // Ajouter la nouvelle recharge à la liste
        setRecharges(prev => [newRecharge, ...prev]);
        
        // Mettre à jour les statistiques
        if (stats) {
          setStats({
            ...stats,
            pendingCount: stats.pendingCount + 1
          });
        }
        
        // Afficher la référence générée
        alert(`Recharge créée avec succès!\nRéférence: ${reference}\n\nCommuniquez cette référence à l'utilisateur pour qu'il puisse effectuer son virement BaridiMob.`);
      }
      
      // Réinitialiser les états
      setIsCreatingRecharge(false);
      setNewRechargeUser('');
      setNewRechargeAmount(0);
      setCustomAmount('');
      setIsCustomAmount(false);
      setIsDirectRecharge(false);
      
      // Fermer le modal
      setShowRechargeModal(false);
    }, 1000);
  };
    const filteredRecharges = recharges.filter(recharge => {
    // Filtre de recherche
    const matchesSearch = 
      recharge.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recharge.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recharge.userPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recharge.reference.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Filtre de statut
    const matchesStatus = statusFilter === 'all' || recharge.status === statusFilter;
    
    // Filtre de date
    let matchesDate = true;
    const now = new Date();
    const rechargeDate = new Date(recharge.dateCreated);
    
    if (dateFilter === 'today') {
      matchesDate = rechargeDate.toDateString() === now.toDateString();
    } else if (dateFilter === 'week') {
      const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      matchesDate = rechargeDate >= oneWeekAgo;
    } else if (dateFilter === 'month') {
      matchesDate = rechargeDate.getMonth() === now.getMonth() && rechargeDate.getFullYear() === now.getFullYear();
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  // Helper pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Recharges</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez les recharges des comptes utilisateurs</p>
        </div>
        <Button onClick={() => setShowRechargeModal(true)} className="bg-dinary-turquoise hover:bg-dinary-turquoise/90">
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle recharge
        </Button>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Recharges du jour
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">{stats.totalToday.toLocaleString()} DA</div>
                <Badge variant="outline" className={stats.changePercentage >= 0 ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}>
                  {stats.changePercentage >= 0 ? (
                    <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5 mr-1" />
                  )}
                  {Math.abs(stats.changePercentage)}%
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Recharges en attente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingCount}</div>
              <p className="text-xs text-gray-500 mt-1">
                Montant moyen: {stats.avgAmount.toLocaleString()} DA
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total hebdomadaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWeek.toLocaleString()} DA</div>
            </CardContent>
          </Card>
            <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Méthode de recharge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Virement BaridiMob</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalMonth.toLocaleString()} DA ce mois-ci
              </p>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher un utilisateur, email, téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dinary-turquoise"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-dinary-turquoise"
            >
              <option value="all">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="approuvee">Approuvée</option>
              <option value="refusee">Refusée</option>
            </select>
              <div className="py-2 px-3 border rounded-md text-sm bg-gray-100 text-gray-700">
              Méthode: Virement BaridiMob
            </div>
            
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="py-2 px-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-dinary-turquoise"
            >
              <option value="all">Toutes les dates</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Table des recharges */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Méthode
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Chargement des données...
                  </td>
                </tr>
              ) : filteredRecharges.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Aucune recharge trouvée
                  </td>
                </tr>
              ) : (
                filteredRecharges.map((recharge) => (
                  <tr key={recharge.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="font-medium text-gray-900">{recharge.userName}</div>
                          <div className="text-sm text-gray-500">{recharge.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {recharge.amount.toLocaleString()} DA
                    </td>                    <td className="px-6 py-4 whitespace-nowrap">
                      Virement BaridiMob
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatDate(recharge.dateCreated)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        className={
                          recharge.status === 'approuvee' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                          recharge.status === 'refusee' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 
                          'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }
                      >
                        {recharge.status === 'approuvee' && 'Approuvée'}
                        {recharge.status === 'refusee' && 'Refusée'}
                        {recharge.status === 'en_attente' && 'En attente'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => handleViewDetails(recharge)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye size={18} />
                        </button>
                        
                        {recharge.status === 'en_attente' && (
                          <>
                            <button 
                              onClick={() => handleApproveRecharge(recharge.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Check size={18} />
                            </button>
                              <button 
                              onClick={() => openRejectModal(recharge.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <X size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal de détails de recharge */}
      {showDetailModal && selectedRecharge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Détails de la recharge</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">Informations utilisateur</h3>
                  <div className="bg-gray-50 p-3 rounded space-y-2">
                    <p><span className="text-gray-600">Nom:</span> {selectedRecharge.userName}</p>
                    <p><span className="text-gray-600">Email:</span> {selectedRecharge.userEmail}</p>
                    <p><span className="text-gray-600">Téléphone:</span> {selectedRecharge.userPhone}</p>
                    <p><span className="text-gray-600">ID:</span> {selectedRecharge.userId}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">Informations recharge</h3>                  <div className="bg-gray-50 p-3 rounded space-y-2">
                    <p><span className="text-gray-600">Référence Dinary:</span> {selectedRecharge.reference}</p>
                    <p><span className="text-gray-600">Date créée:</span> {formatDate(selectedRecharge.dateCreated)}</p>
                    <p><span className="text-gray-600">Montant:</span> {selectedRecharge.amount.toLocaleString()} DA</p>
                    <p>
                      <span className="text-gray-600">Statut:</span> 
                      <Badge
                        className={`ml-2 ${
                          selectedRecharge.status === 'approuvee' ? 'bg-green-100 text-green-800' : 
                          selectedRecharge.status === 'refusee' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {selectedRecharge.status === 'approuvee' && 'Approuvée'}
                        {selectedRecharge.status === 'refusee' && 'Refusée'}
                        {selectedRecharge.status === 'en_attente' && 'En attente'}
                      </Badge>
                    </p>

                    {selectedRecharge.method === 'virement' && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="font-medium text-blue-600 mb-2">Vérification BaridiMob</p>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-600">Référence BaridiMob:</span>
                          <span className="font-medium">{selectedRecharge.baridimobReference || 'Non fournie'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Date transaction:</span>
                          <span className="font-medium">
                            {selectedRecharge.transactionDate 
                              ? formatDate(selectedRecharge.transactionDate) 
                              : 'Non fournie'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
                <div>
                <h3 className="font-semibold text-gray-700 mb-1">Méthode de paiement</h3>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <ArrowUpRight className="h-5 w-5 text-green-700" />
                    </div>
                    <div className="flex-1">
                      <span>Virement BaridiMob</span>
                      {selectedRecharge.status === 'en_attente' && (
                        <div className="mt-3 border-t pt-3">
                          <BaridimobVerification 
                            baridimobReference={selectedRecharge.baridimobReference}
                            transactionDate={selectedRecharge.transactionDate}
                            onUpdate={(data) => {
                              setSelectedRecharge({
                                ...selectedRecharge,
                                ...data
                              });
                            }}
                          />
                          <Button 
                            variant="outline"
                            onClick={() => setShowGuideModal(true)}
                            className="text-blue-600 border-blue-300 hover:bg-blue-50 text-sm mt-2"
                            size="sm"
                          >
                            <InfoIcon className="mr-1 h-4 w-4" />
                            Voir le guide de vérification
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedRecharge.processedBy && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">Informations de traitement</h3>
                  <div className="bg-gray-50 p-3 rounded space-y-2">
                    <p><span className="text-gray-600">Traité par:</span> {selectedRecharge.processedBy}</p>
                    <p><span className="text-gray-600">Date de traitement:</span> {formatDate(selectedRecharge.dateProcessed || '')}</p>
                  </div>
                </div>
              )}
              
              {selectedRecharge.notes && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">Notes</h3>
                  <div className="bg-gray-50 p-3 rounded">
                    <p>{selectedRecharge.notes}</p>
                  </div>
                </div>
              )}
                {selectedRecharge.status === 'en_attente' && (
                <>
                  {selectedRecharge.method === 'virement' && (
                    <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-4">
                      <h4 className="text-sm font-semibold text-yellow-700 mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Vérifications importantes
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-700">
                        <li>Vérifiez que la référence BaridiMob est valide</li>
                        <li>Confirmez que le montant du virement correspond au montant demandé</li>
                        <li>Assurez-vous que la date de la transaction est récente</li>
                        <li>Vérifiez que le nom du titulaire du compte correspond à l'utilisateur</li>
                      </ul>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Motif de rejet (optionnel)</h4>
                      <select
                        className="w-full p-2 border rounded-md mb-2"
                        value={rejectReason || ''}
                        onChange={(e) => setRejectReason(e.target.value)}
                      >
                        <option value="">Sélectionnez un motif</option>
                        <option value="reference_invalide">Référence BaridiMob invalide ou non trouvée</option>
                        <option value="montant_incorrect">Montant du virement incorrect</option>
                        <option value="delai_expire">Délai de paiement expiré</option>
                        <option value="informations_manquantes">Informations incomplètes</option>
                        <option value="autre">Autre raison</option>
                      </select>
                      
                      {rejectReason === 'autre' && (
                        <textarea
                          className="w-full p-2 border rounded-md"
                          placeholder="Précisez la raison du rejet..."
                          rows={2}
                          value={rejectNotes || ''}
                          onChange={(e) => setRejectNotes(e.target.value)}
                        />
                      )}
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-50"
                        onClick={() => {
                          if (rejectReason || confirm('Êtes-vous sûr de vouloir rejeter sans préciser de motif ?')) {
                            handleRejectRecharge();
                            setShowDetailModal(false);
                          }
                        }}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Refuser
                      </Button>
                      
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          if (selectedRecharge.method === 'virement' && !selectedRecharge.baridimobReference) {
                            alert('Veuillez entrer la référence BaridiMob avant d\'approuver');
                            return;
                          }
                          handleApproveRecharge(selectedRecharge.id);
                          setShowDetailModal(false);
                        }}
                        disabled={selectedRecharge.method === 'virement' && !selectedRecharge.baridimobReference}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Approuver
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
        {/* Modal de nouvelle recharge */}
      {showRechargeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">Nouvelle recharge</h2>
              <button
                onClick={() => setShowRechargeModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">              <div>
                <h3 className="text-lg font-medium mb-2">Recharge utilisateur</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {isDirectRecharge 
                    ? "Créez une recharge directe pour alimenter immédiatement le compte de l'utilisateur." 
                    : "Créez une demande de recharge via BaridiMob pour un utilisateur avec un montant libre."}
                </p>
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="rechargeType"
                      className="w-4 h-4 text-dinary-turquoise"
                      checked={!isDirectRecharge}
                      onChange={() => setIsDirectRecharge(false)}
                    />
                    <span className="ml-2 text-sm">Recharge avec référence BaridiMob</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="rechargeType"
                      className="w-4 h-4 text-dinary-turquoise"
                      checked={isDirectRecharge}
                      onChange={() => setIsDirectRecharge(true)}
                    />
                    <span className="ml-2 text-sm">Alimentation directe du compte</span>
                  </label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="user-search" className="block text-sm font-medium text-gray-700 mb-1">
                    Rechercher un utilisateur
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />                    <input
                      id="user-search"
                      type="text"
                      placeholder="Nom, email ou téléphone..."
                      className="pl-10 w-full py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-dinary-turquoise"
                      value={newRechargeUser}
                      onChange={(e) => setNewRechargeUser(e.target.value)}
                    />
                  </div>
                </div>
                  <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Montant (DA)
                  </label>
                  {isCustomAmount ? (
                    <div className="relative">
                      <input
                        id="amount"
                        type="number"
                        min="100"
                        placeholder="Montant personnalisé..."
                        className="w-full py-2 px-3 border-2 border-dinary-turquoise rounded-md focus:outline-none focus:ring-2 focus:ring-dinary-turquoise/50"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-dinary-turquoise font-semibold">
                        Personnalisé
                      </span>
                      <button 
                        className="absolute right-24 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700"
                        onClick={() => {
                          setIsCustomAmount(false);
                          setCustomAmount('');
                        }}
                      >
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <input
                      id="amount"
                      type="number"
                      min="100"
                      placeholder="Montant libre (min 100 DA)"
                      className="w-full py-2 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-dinary-turquoise"
                      value={newRechargeAmount > 0 ? newRechargeAmount : ''}
                      onChange={(e) => setNewRechargeAmount(parseInt(e.target.value) || 0)}
                      onFocus={() => {
                        if (!isCustomAmount) {
                          setIsCustomAmount(true);
                          setCustomAmount(newRechargeAmount > 0 ? newRechargeAmount.toString() : '');
                          setNewRechargeAmount(0);
                        }
                      }}
                    />
                  )}
                  <p className="text-xs text-gray-500 mt-1">Montant minimum: 100 DA</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montants suggérés
                </label>
                <div className="flex flex-wrap gap-2">
                  {[1000, 2000, 3000, 5000, 10000].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      onClick={() => {
                        setNewRechargeAmount(amount);
                        setIsCustomAmount(false);
                        setCustomAmount('');
                      }}
                      className={`bg-white hover:bg-gray-50 ${!isCustomAmount && newRechargeAmount === amount ? 'ring-2 ring-dinary-turquoise' : ''}`}
                    >
                      {amount.toLocaleString()} DA
                    </Button>                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCustomAmount(true);
                      setNewRechargeAmount(0);
                      setCustomAmount('');
                    }}
                    className={`bg-gray-100 hover:bg-gray-200 ${isCustomAmount ? 'ring-2 ring-dinary-turquoise' : ''}`}
                  >
                    <span className="flex items-center">
                      <Plus size={16} className="mr-1" />
                      Montant personnalisé
                    </span>
                  </Button>
                </div>
              </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <h4 className="text-sm font-semibold text-blue-700 mb-2 flex items-center">
                    <InfoIcon className="w-4 h-4 mr-1" />
                    Comment ça marche
                  </h4>
                  {isDirectRecharge ? (
                    <ol className="list-decimal pl-5 space-y-1 text-sm text-blue-700">
                      <li>Sélectionnez l'utilisateur dont vous souhaitez alimenter le compte</li>
                      <li>Choisissez le montant à créditer sur son compte</li>
                      <li>Confirmez l'opération pour créditer immédiatement son compte</li>
                      <li>L'utilisateur verra le nouveau solde reflété dans son application</li>
                    </ol>
                  ) : (
                    <ol className="list-decimal pl-5 space-y-1 text-sm text-blue-700">
                      <li>Générez une demande de recharge avec le montant souhaité</li>
                      <li>Communiquez la référence générée à l'utilisateur</li>
                      <li>L'utilisateur effectue un virement BaridiMob du montant indiqué</li>
                      <li>Il soumet ensuite la référence BaridiMob pour vérification</li>
                      <li>Vous pourrez alors valider le paiement après vérification</li>
                    </ol>
                  )}
                </div>                <div className={`p-4 rounded-md border ${isDirectRecharge ? "bg-green-50" : "bg-yellow-50"}`} style={{borderColor: isDirectRecharge ? "#dcfce7" : "#fef9c3"}}>
                  <h4 className="text-sm font-semibold mb-2 flex items-center" style={{color: isDirectRecharge ? "#15803d" : "#854d0e"}}>
                    <InfoIcon className="w-4 h-4 mr-1" />
                    {isDirectRecharge ? "Recharge directe" : "Montants personnalisés"}
                  </h4>
                  {isDirectRecharge ? (
                    <ul className="list-disc pl-5 space-y-1 text-sm text-green-700">
                      <li>La recharge est immédiatement créditée sur le compte</li>
                      <li>Aucune vérification BaridiMob n'est nécessaire</li>
                      <li>Cette action est réservée aux administrateurs</li>
                      <li>Toutes les recharges directes sont tracées dans l'historique</li>
                    </ul>
                  ) : (
                    <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-700">
                      <li>Utilisez les montants suggérés pour une sélection rapide</li>
                      <li>Ou créez un montant personnalisé pour des besoins spécifiques</li>
                      <li>Le montant minimum est de 100 DA</li>
                      <li>Une vérification BaridiMob sera nécessaire</li>
                    </ul>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">                <Button variant="outline" onClick={() => setShowRechargeModal(false)}>
                  Annuler
                </Button>                <Button 
                  className="bg-dinary-turquoise hover:bg-dinary-turquoise/90"
                  onClick={handleCreateRecharge}
                  disabled={isCreatingRecharge || !newRechargeUser || (isCustomAmount ? !customAmount || parseInt(customAmount) < 100 : newRechargeAmount < 100)}
                >
                  {isCreatingRecharge 
                    ? 'Traitement en cours...' 
                    : isDirectRecharge 
                      ? 'Alimenter le compte' 
                      : 'Générer la demande'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de guide BaridiMob */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <BaridimobGuide onClose={() => setShowGuideModal(false)} />
        </div>
      )}
      
      {/* Modal de rejet */}
      {showRejectionModal && (
        <RejectionModal
          onClose={() => setShowRejectionModal(false)}
          onReject={(reason, notes) => {
            setRejectReason(reason);
            setRejectNotes(notes);
            handleRejectRecharge();
          }}
          isVirement={recharges.find(r => r.id === rechargeToReject)?.method === 'virement' || false}
        />
      )}
    </div>
  );
}
