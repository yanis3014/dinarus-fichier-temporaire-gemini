'use client'

import { useState } from 'react';
import { 
  Target, Search, Filter, CheckCircle, Award,
  Calendar, Trophy, Star, Users, Plus, Trash2,
  Edit, Eye, ChevronDown, ArrowUpDown, Clock
} from 'lucide-react';

// Interface pour les missions
interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  rewardType: 'points' | 'starPoints' | 'xp' | 'percentage';
  userType: 'user' | 'merchant' | 'both';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  participants: number;
  completions: number;
  status: 'active' | 'expired' | 'upcoming' | 'draft';
  createdAt: string;
  expiresAt: string | null;
  featured: boolean;
  levelRequired: number;
}

// Type pour la configuration de tri
interface SortConfig {
  key: keyof Mission;
  direction: 'asc' | 'desc';
}

// Données fictives pour les missions
const missions: Mission[] = [
  {
    id: "m001",
    title: "Première transaction",
    description: "Effectuez votre première transaction avec un commerçant partenaire",
    reward: 100,
    rewardType: "points", 
    userType: "user", 
    category: "onboarding",
    difficulty: "easy",
    participants: 458,
    completions: 312,
    status: "active",
    createdAt: "2023-01-15",
    expiresAt: "2025-12-31",
    featured: true,
    levelRequired: 0,
  },{
    id: "m002",
    title: "Parrainage Premium",
    description: "Parrainez 5 amis qui réalisent une transaction dans les 7 jours",
    reward: 500,
    rewardType: "points",
    userType: "user",
    category: "referral",
    difficulty: "medium",
    participants: 237,
    completions: 98,
    status: "active",
    createdAt: "2023-02-10",
    expiresAt: "2023-08-31",
    featured: true,
    levelRequired: 2,
  },
  {
    id: "m003",
    title: "Explorateur Urbain",
    description: "Visitez 3 commerces différents dans votre quartier",
    reward: 200,
    rewardType: "points",
    category: "discovery",
    difficulty: "easy",
    participants: 654,
    completions: 412,
    status: "active",
    createdAt: "2023-03-05",
    expiresAt: "2023-09-30",
    featured: false,
  },
  {
    id: "m004",
    title: "Fidélité Or",
    description: "Effectuez 10 transactions chez le même commerçant",
    reward: 300,
    rewardType: "points",
    category: "loyalty",
    difficulty: "medium",
    participants: 542,
    completions: 187,
    status: "active",
    createdAt: "2023-02-20",
    expiresAt: "2024-02-20",
    featured: false,
  },
  {
    id: "m005",
    title: "Mission Flash - Week-end Gourmand",
    description: "Effectuez une transaction dans un restaurant ce week-end",
    reward: 150,
    rewardType: "points",
    category: "flash",
    difficulty: "easy",
    participants: 876,
    completions: 543,
    status: "expired",
    createdAt: "2023-04-10",
    expiresAt: "2023-04-16",
    featured: false,
  },
  {
    id: "m006",
    title: "Pro du paiement mobile",
    description: "Réalisez 20 transactions avec l'application en un mois",
    reward: 400,
    rewardType: "points",
    category: "usage",
    difficulty: "hard",
    participants: 321,
    completions: 75,
    status: "active",
    createdAt: "2023-04-01",
    expiresAt: "2024-04-01",
    featured: true,
  },
  {
    id: "m007",
    title: "Collection de badges",
    description: "Obtenez 5 badges différents dans l'application",
    reward: 250,
    rewardType: "points",
    category: "collection",
    difficulty: "medium",
    participants: 425,
    completions: 132,
    status: "draft",
    createdAt: "2023-05-05",
    expiresAt: null,
    featured: false,
  },  {
    id: "m008",
    title: "Cashback Boost",
    description: "Bénéficiez d'un cashback majoré pendant 1 semaine",
    reward: 5,
    rewardType: "percentage",
    userType: "both",
    category: "promo",
    difficulty: "easy",
    participants: 0,
    completions: 0,
    status: "draft",
    createdAt: "2023-05-12",
    expiresAt: null,
    featured: false,
    levelRequired: 0,
  },
  {
    id: "m009",
    title: "Expert en paiement",
    description: "Réalisez 50 transactions en un mois",
    reward: 30,
    rewardType: "starPoints",
    userType: "user",
    category: "challenge",
    difficulty: "hard",
    participants: 125,
    completions: 42,
    status: "active",
    createdAt: "2023-06-01",
    expiresAt: "2024-06-01",
    featured: true,
    levelRequired: 3,
  },
  {
    id: "m010",
    title: "Commerçant d'or",
    description: "Recevez 100 paiements différents via l'application",
    reward: 50,
    rewardType: "starPoints",
    userType: "merchant",
    category: "challenge",
    difficulty: "hard",
    participants: 75,
    completions: 12,
    status: "active",
    createdAt: "2023-05-15",
    expiresAt: "2024-05-15",
    featured: true,
    levelRequired: 4,
  },
  {
    id: "m011",
    title: "Boost de progression",
    description: "Terminez 3 missions cette semaine",
    reward: 500,
    rewardType: "xp",
    userType: "user",
    category: "boost",
    difficulty: "medium",
    participants: 320,
    completions: 95,
    status: "active",
    createdAt: "2023-06-10",
    expiresAt: "2023-12-31",
    featured: false,
    levelRequired: 1,
  },
];

export default function MissionsPage() {  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userTypeFilter, setUserTypeFilter] = useState('all');const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'createdAt', direction: 'desc' });
  const [expandedMission, setExpandedMission] = useState<string | null>(null);
    // Filtrer les missions
  const filteredMissions = missions.filter((mission) => {
    const matchesSearch = searchTerm === '' || 
      mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = categoryFilter === 'all' || mission.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || mission.status === statusFilter;
    const matchesUserType = userTypeFilter === 'all' || mission.userType === userTypeFilter;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesUserType;
  });
    // Trier les missions
  const sortedMissions = [...filteredMissions].sort((a, b) => {
    const aValue = a[sortConfig.key] ?? '';
    const bValue = b[sortConfig.key] ?? '';
    
    // Conversion en chaîne pour comparaison sécurisée
    const aString = String(aValue);
    const bString = String(bValue);
    
    if (aString < bString) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aString > bString) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  // Fonction pour changer le tri
  const requestSort = (key: keyof Mission) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Formater la date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit'
    }).format(date);
  };
  
  // Badge pour la difficulté
  const DifficultyBadge = ({ difficulty }: { difficulty: Mission['difficulty'] }) => {
    switch (difficulty) {
      case 'easy':
        return (
          <span className="badge badge-success">
            <Star size={12} className="mr-1" /> Facile
          </span>
        );
      case 'medium':
        return (
          <span className="badge badge-warning">
            <Star size={12} className="mr-1" /> Moyen
          </span>
        );
      case 'hard':
        return (
          <span className="badge badge-danger">
            <Star size={12} className="mr-1" /> Difficile
          </span>
        );
      default:
        return null;
    }
  };
  
  // Badge pour le statut
  const StatusBadge = ({ status }: { status: Mission['status'] }) => {
    switch (status) {
      case 'active':
        return (
          <span className="badge badge-success">
            <CheckCircle size={12} className="mr-1" /> Actif
          </span>
        );
      case 'draft':
        return (
          <span className="badge badge-info">
            <Edit size={12} className="mr-1" /> Brouillon
          </span>
        );
      case 'expired':
        return (
          <span className="badge badge-danger">
            <Clock size={12} className="mr-1" /> Expiré
          </span>
        );
      default:
        return null;
    }
  };
  
  // Calculer les statistiques
  const activeMissions = missions.filter(m => m.status === 'active').length;
  const totalCompletions = missions.reduce((acc, m) => acc + m.completions, 0);
  const totalParticipants = missions.reduce((acc, m) => acc + m.participants, 0);
  
  // Toggle mission details
  const toggleMissionDetails = (missionId: string) => {
    if (expandedMission === missionId) {
      setExpandedMission(null);
    } else {
      setExpandedMission(missionId);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Target className="mr-2 text-dinary-turquoise" /> 
            Gestion des missions
          </h1>
          <p className="text-sm text-gray-500 mt-1">Créez et gérez des missions d'engagement pour vos utilisateurs</p>
        </div>
        <button className="btn-primary flex items-center">
          <Plus size={16} className="mr-1" />
          Nouvelle mission
        </button>
      </div>
      
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="admin-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Missions actives</p>
              <p className="text-2xl font-bold">{activeMissions}</p>
            </div>
          </div>
        </div>
        
        <div className="admin-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <Trophy className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Missions accomplies</p>
              <p className="text-2xl font-bold">{totalCompletions}</p>
            </div>
          </div>
        </div>
        
        <div className="admin-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Participants</p>
              <p className="text-2xl font-bold">{totalParticipants}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher une mission..."
            className="input-primary pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
          <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-gray-500" />
            <select
              className="select-primary"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Toutes les catégories</option>
              <option value="onboarding">Onboarding</option>
              <option value="referral">Parrainage</option>
              <option value="discovery">Découverte</option>
              <option value="loyalty">Fidélité</option>
              <option value="flash">Flash</option>
              <option value="usage">Utilisation</option>
              <option value="collection">Collection</option>
              <option value="promo">Promotion</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Users size={18} className="text-gray-500" />
            <select
              className="select-primary"
              value={userTypeFilter}
              onChange={(e) => setUserTypeFilter(e.target.value)}
            >
              <option value="all">Tous les types</option>
              <option value="user">Utilisateurs</option>
              <option value="merchant">Commerçants</option>
              <option value="both">Les deux</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <select
              className="select-primary"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actives</option>
              <option value="draft">Brouillons</option>
              <option value="expired">Expirées</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Missions List */}
      <div className="space-y-4">
        {sortedMissions.length === 0 ? (
          <div className="admin-card text-center py-10">
            <p className="text-gray-500">Aucune mission ne correspond à vos critères de recherche.</p>
          </div>
        ) : (
          sortedMissions.map((mission) => (
            <div key={mission.id} className="admin-card hover:border-dinary-turquoise/30 transition-colors">
              {/* Mission header */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-full ${
                    mission.featured 
                      ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {mission.featured ? <Trophy className="h-6 w-6" /> : <Target className="h-6 w-6" />}
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-lg font-bold text-gray-800 mr-2">{mission.title}</h3>
                      {mission.featured && (
                        <span className="badge badge-info">
                          <Star size={10} className="mr-1" /> Vedette
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{mission.description}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 mt-4 lg:mt-0">
                  <StatusBadge status={mission.status} />
                  <DifficultyBadge difficulty={mission.difficulty} />
                  
                  <button 
                    className="btn-secondary flex items-center py-1.5 text-xs"
                    onClick={() => toggleMissionDetails(mission.id)}
                  >
                    <Eye size={14} className="mr-1" />
                    {expandedMission === mission.id ? 'Masquer' : 'Détails'}
                    <ChevronDown 
                      size={14} 
                      className={`ml-1 transition-transform ${expandedMission === mission.id ? 'rotate-180' : ''}`} 
                    />
                  </button>
                </div>
              </div>
                {/* Mission summary */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-500">Récompense</p>
                  <p className="text-sm font-medium">
                    {mission.reward} 
                    {mission.rewardType === 'points' ? ' points' : 
                     mission.rewardType === 'starPoints' ? ' ★' : 
                     mission.rewardType === 'xp' ? ' XP' : '%'}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500">Type d'utilisateur</p>
                  <p className="text-sm font-medium">
                    {mission.userType === 'user' ? 'Utilisateur' : 
                     mission.userType === 'merchant' ? 'Commerçant' : 'Les deux'}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500">Participants</p>
                  <p className="text-sm font-medium">{mission.participants.toLocaleString()}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500">Complétions</p>
                  <p className="text-sm font-medium">{mission.completions.toLocaleString()}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500">Date d'expiration</p>
                  <p className="text-sm font-medium">{mission.expiresAt ? formatDate(mission.expiresAt) : 'Aucune'}</p>
                </div>
              </div>
              
              {/* Expanded details */}
              {expandedMission === mission.id && (
                <div className="mt-6 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Mission details */}
                    <div className="col-span-2">
                      <h4 className="text-sm font-semibold mb-2">Détails de la mission</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                          <dt className="text-xs text-gray-500">ID</dt>
                          <dd className="text-sm">{mission.id}</dd>
                          
                          <dt className="text-xs text-gray-500">Catégorie</dt>
                          <dd className="text-sm capitalize">{mission.category}</dd>
                          
                          <dt className="text-xs text-gray-500">Créée le</dt>
                          <dd className="text-sm">{formatDate(mission.createdAt)}</dd>
                          
                          <dt className="text-xs text-gray-500">Expire le</dt>
                          <dd className="text-sm">{mission.expiresAt ? formatDate(mission.expiresAt) : 'Aucune'}</dd>
                          
                          <dt className="text-xs text-gray-500">Taux de complétion</dt>
                          <dd className="text-sm">
                            {mission.participants > 0 
                              ? `${Math.round((mission.completions / mission.participants) * 100)}%`
                              : '0%'
                            }
                          </dd>
                        </dl>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Actions</h4>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <button className="btn-secondary w-full flex items-center justify-center">
                          <Edit size={14} className="mr-1.5" /> Modifier
                        </button>
                        
                        {mission.status === 'draft' && (
                          <button className="btn-primary w-full flex items-center justify-center">
                            <CheckCircle size={14} className="mr-1.5" /> Publier
                          </button>
                        )}
                        
                        {mission.status === 'active' && (
                          <button className="btn-secondary w-full flex items-center justify-center">
                            <Clock size={14} className="mr-1.5" /> Terminer
                          </button>
                        )}
                        
                        {!mission.featured && mission.status === 'active' && (
                          <button className="btn-secondary w-full flex items-center justify-center">
                            <Star size={14} className="mr-1.5" /> Mettre en vedette
                          </button>
                        )}
                        
                        <button className="btn-danger w-full flex items-center justify-center">
                          <Trash2 size={14} className="mr-1.5" /> Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">Progression</span>
                      <span className="font-medium">
                        {mission.completions} / {mission.participants} utilisateurs
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-dinary-turquoise"
                        style={{ 
                          width: mission.participants > 0 
                            ? `${(mission.completions / mission.participants) * 100}%` 
                            : '0%'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-between items-center border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-500">
          Affichage de <span className="font-medium">{sortedMissions.length}</span> missions sur <span className="font-medium">{missions.length}</span>
        </p>
        
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
  );
}
