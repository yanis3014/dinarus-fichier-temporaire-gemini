'use client';

import { useState } from 'react';
import { User, UserStatus, UserTier } from '@/types/user';
import {
  Search,
  Filter,
  MoreVertical,
  Shield,
  Ban,
  Star,
  Send,
  RefreshCw,
  UserPlus,
  Download
} from 'lucide-react';

interface UserTableProps {
  users: User[];
  onStatusChange: (userId: string, newStatus: UserStatus) => void;
  onTierChange: (userId: string, newTier: UserTier) => void;
  onSendNotification: (userId: string) => void;
  onResetPassword: (userId: string) => void;
  onExport: () => void;
}

export default function UserManagement({
  users,
  onStatusChange,
  onTierChange,
  onSendNotification,
  onResetPassword,
  onExport
}: UserTableProps) {
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [tierFilter, setTierFilter] = useState<UserTier | 'all'>('all');
  const [sortField, setSortField] = useState<keyof User>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Gestionnaires d'événements...
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterUsers(query, statusFilter, tierFilter);
  };

  const filterUsers = (query: string, status: UserStatus | 'all', tier: UserTier | 'all') => {
    let filtered = users.filter(user => {
      const matchesQuery = 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.phone.includes(query) ||
        user.email?.toLowerCase().includes(query.toLowerCase());
      
      const matchesStatus = status === 'all' || user.status === status;
      const matchesTier = tier === 'all' || user.tier === tier;

      return matchesQuery && matchesStatus && matchesTier;
    });

    setFilteredUsers(filtered);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Barre d'outils */}
      <div className="p-4 border-b space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Recherche */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-dinary-turquoise focus:border-transparent"
              placeholder="Rechercher par nom, téléphone, email..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          {/* Filtres */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as UserStatus)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-dinary-turquoise focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="pending">En attente</option>
              <option value="blocked">Bloqué</option>
            </select>

            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value as UserTier)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-dinary-turquoise focus:border-transparent"
            >
              <option value="all">Tous les niveaux</option>
              <option value="normal">Normal</option>
              <option value="vip">VIP</option>
              <option value="ambassador">Ambassadeur</option>
              <option value="risky">Risqué</option>
            </select>

            <button
              onClick={onExport}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Exporter
            </button>
          </div>
        </div>
      </div>

      {/* Table des utilisateurs */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Utilisateur</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Contact</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Statut</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Niveau</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Solde</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Points</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-600">
                        {user.name[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">
                        Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-DZ')}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900">{user.phone}</div>
                  {user.email && (
                    <div className="text-sm text-gray-500">{user.email}</div>
                  )}
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' :
                    user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {user.status === 'active' ? 'Actif' :
                     user.status === 'pending' ? 'En attente' :
                     'Bloqué'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.tier === 'vip' ? 'bg-purple-100 text-purple-800' :
                    user.tier === 'ambassador' ? 'bg-blue-100 text-blue-800' :
                    user.tier === 'risky' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.tier === 'vip' ? 'VIP' :
                     user.tier === 'ambassador' ? 'Ambassadeur' :
                     user.tier === 'risky' ? 'Risqué' :
                     'Normal'}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {user.balance.toLocaleString('fr-DZ')} DA
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {user.points.toLocaleString('fr-DZ')} pts
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onStatusChange(user.id, user.status === 'blocked' ? 'active' : 'blocked')}
                      className={`p-1 rounded-full ${
                        user.status === 'blocked' ? 'text-red-600 hover:bg-red-100' : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={user.status === 'blocked' ? 'Débloquer' : 'Bloquer'}
                    >
                      <Ban className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onTierChange(user.id, user.tier === 'vip' ? 'normal' : 'vip')}
                      className={`p-1 rounded-full ${
                        user.tier === 'vip' ? 'text-purple-600 hover:bg-purple-100' : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={user.tier === 'vip' ? 'Retirer VIP' : 'Marquer VIP'}
                    >
                      <Star className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onSendNotification(user.id)}
                      className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
                      title="Envoyer une notification"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onResetPassword(user.id)}
                      className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
                      title="Réinitialiser le mot de passe"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
