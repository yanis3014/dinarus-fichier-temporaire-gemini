'use client';

import { useState, useEffect } from 'react';
import { 
  AlertTriangle, Eye, Shield, Clock, TrendingUp, 
  Filter, Search, RefreshCw, Download, Ban, Flag,
  ChevronDown, ChevronRight, Users, DollarSign
} from 'lucide-react';

interface SuspiciousActivity {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  activityType: 'multiple_logins' | 'unusual_transactions' | 'velocity_check' | 'location_anomaly';
  riskScore: number;
  description: string;
  timestamp: string;
  status: 'pending' | 'investigating' | 'resolved' | 'false_positive';
  details: {
    ipAddresses?: string[];
    transactionCount?: number;
    amount?: number;
    location?: string;
  };
}

export default function SuspiciousActivitiesPage() {
  const [activities, setActivities] = useState<SuspiciousActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<SuspiciousActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<SuspiciousActivity | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  useEffect(() => {
    const mockData: SuspiciousActivity[] = [
      {
        id: '1',
        userId: 'user_123',
        userName: 'Ahmed Benaissa',
        userEmail: 'ahmed.b@email.com',
        activityType: 'multiple_logins',
        riskScore: 85,
        description: 'Connexions multiples depuis 5 adresses IP différentes en 2 heures',
        timestamp: '2025-06-02T10:30:00Z',
        status: 'pending',
        details: {
          ipAddresses: ['192.168.1.1', '10.0.0.1', '172.16.0.1', '203.0.113.1', '198.51.100.1']
        }
      },
      {
        id: '2',
        userId: 'user_456',
        userName: 'Fatima Zerrouki',
        userEmail: 'fatima.z@email.com',
        activityType: 'unusual_transactions',
        riskScore: 92,
        description: 'Montant de transaction 400% supérieur à la moyenne habituelle',
        timestamp: '2025-06-02T09:15:00Z',
        status: 'investigating',
        details: {
          transactionCount: 15,
          amount: 250000
        }
      },
      {
        id: '3',
        userId: 'user_789',
        userName: 'Karim Messaoudi',
        userEmail: 'karim.m@email.com',
        activityType: 'velocity_check',
        riskScore: 78,
        description: 'Fréquence de transactions anormalement élevée',
        timestamp: '2025-06-02T08:45:00Z',
        status: 'resolved',
        details: {
          transactionCount: 50,
          amount: 12000
        }
      },
      {
        id: '4',
        userId: 'user_101',
        userName: 'Amina Boumediene',
        userEmail: 'amina.b@email.com',
        activityType: 'location_anomaly',
        riskScore: 65,
        description: 'Connexion depuis un pays non habituel',
        timestamp: '2025-06-02T07:20:00Z',
        status: 'false_positive',
        details: {
          location: 'France (Paris)'
        }
      }
    ];

    setTimeout(() => {
      setActivities(mockData);
      setFilteredActivities(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filtrage
  useEffect(() => {
    let filtered = activities;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(activity => activity.status === filterStatus);
    }

    if (filterRisk !== 'all') {
      filtered = filtered.filter(activity => {
        if (filterRisk === 'high') return activity.riskScore >= 80;
        if (filterRisk === 'medium') return activity.riskScore >= 60 && activity.riskScore < 80;
        if (filterRisk === 'low') return activity.riskScore < 60;
        return true;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(activity => 
        activity.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredActivities(filtered);
  }, [activities, filterStatus, filterRisk, searchTerm]);

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'investigating': return 'text-blue-600 bg-blue-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'false_positive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple_logins': return 'Connexions multiples';
      case 'unusual_transactions': return 'Transactions inhabituelles';
      case 'velocity_check': return 'Vélocité élevée';
      case 'location_anomaly': return 'Anomalie géographique';
      default: return type;
    }
  };

  const handleStatusChange = (activityId: string, newStatus: string) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === activityId 
          ? { ...activity, status: newStatus as any }
          : activity
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Comportements Suspects</h1>
          <p className="text-sm text-gray-500 mt-1">Détection et analyse des activités suspectes</p>
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
              <p className="text-sm text-gray-500">Activités Détectées</p>
              <p className="text-2xl font-bold text-red-600">{activities.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">En Attente</p>
              <p className="text-2xl font-bold text-yellow-600">
                {activities.filter(a => a.status === 'pending').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Risque Élevé</p>
              <p className="text-2xl font-bold text-orange-600">
                {activities.filter(a => a.riskScore >= 80).length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Résolues</p>
              <p className="text-2xl font-bold text-green-600">
                {activities.filter(a => a.status === 'resolved').length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-green-600" />
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
                placeholder="Rechercher par nom, email ou description..."
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
            <option value="pending">En attente</option>
            <option value="investigating">En cours d'investigation</option>
            <option value="resolved">Résolues</option>
            <option value="false_positive">Faux positifs</option>
          </select>
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les niveaux</option>
            <option value="high">Risque élevé (80+)</option>
            <option value="medium">Risque moyen (60-79)</option>
            <option value="low">Risque faible (&lt;60)</option>
          </select>
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            Activités Suspectes Détectées ({filteredActivities.length})
          </h3>
        </div>
        <div className="divide-y">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
              Chargement des activités...
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune activité suspecte trouvée</p>
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-800">{activity.userName}</span>
                        <span className="text-sm text-gray-500">({activity.userEmail})</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(activity.riskScore)}`}>
                        Risque: {activity.riskScore}%
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {activity.status === 'pending' ? 'En attente' :
                         activity.status === 'investigating' ? 'Investigation' :
                         activity.status === 'resolved' ? 'Résolue' : 'Faux positif'}
                      </span>
                    </div>
                    
                    <div className="mb-2">
                      <span className="inline-flex items-center gap-1 text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        <Flag size={12} />
                        {getActivityTypeLabel(activity.activityType)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{activity.description}</p>
                    
                    {/* Activity Details */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(activity.timestamp).toLocaleString('fr-FR')}
                      </span>
                      {activity.details.transactionCount && (
                        <span className="flex items-center gap-1">
                          <DollarSign size={12} />
                          {activity.details.transactionCount} transactions
                        </span>
                      )}
                      {activity.details.amount && (
                        <span className="flex items-center gap-1">
                          <DollarSign size={12} />
                          {activity.details.amount.toLocaleString()} DA
                        </span>
                      )}
                      {activity.details.location && (
                        <span className="flex items-center gap-1">
                          <AlertTriangle size={12} />
                          {activity.details.location}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <select
                      value={activity.status}
                      onChange={(e) => handleStatusChange(activity.id, e.target.value)}
                      className="px-3 py-1 border rounded text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">En attente</option>
                      <option value="investigating">Investigation</option>
                      <option value="resolved">Résolue</option>
                      <option value="false_positive">Faux positif</option>
                    </select>
                    <button 
                      onClick={() => setSelectedActivity(activity)}
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
      </div>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Détails de l'Activité Suspecte</h3>
              <button 
                onClick={() => setSelectedActivity(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Utilisateur</label>
                  <p className="text-gray-800">{selectedActivity.userName}</p>
                  <p className="text-sm text-gray-500">{selectedActivity.userEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Score de Risque</label>
                  <p className="text-2xl font-bold text-red-600">{selectedActivity.riskScore}%</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Type d'Activité</label>
                <p className="text-gray-800">{getActivityTypeLabel(selectedActivity.activityType)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-800">{selectedActivity.description}</p>
              </div>
              
              {selectedActivity.details.ipAddresses && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Adresses IP Détectées</label>
                  <div className="mt-1 space-y-1">
                    {selectedActivity.details.ipAddresses.map((ip, index) => (
                      <span key={index} className="inline-block bg-gray-100 px-2 py-1 rounded text-sm mr-2">
                        {ip}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => handleStatusChange(selectedActivity.id, 'investigating')}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Enquêter
                </button>
                <button 
                  onClick={() => handleStatusChange(selectedActivity.id, 'false_positive')}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Marquer comme faux positif
                </button>
                <button 
                  onClick={() => handleStatusChange(selectedActivity.id, 'resolved')}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Résoudre
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
