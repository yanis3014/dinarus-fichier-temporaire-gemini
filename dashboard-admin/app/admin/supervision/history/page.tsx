'use client';

import { useState, useEffect } from 'react';
import { 
  Archive, User, Shield, Settings, Eye, Search, 
  RefreshCw, Download, Calendar, Clock, MapPin,
  ChevronDown, Filter, Activity, AlertTriangle
} from 'lucide-react';

interface AdminAction {
  id: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  action: string;
  targetType: 'user' | 'merchant' | 'transaction' | 'system';
  targetId?: string;
  targetName?: string;
  description: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  result: 'success' | 'failed' | 'partial';
  details?: any;
}

export default function AdminHistoryPage() {
  const [actions, setActions] = useState<AdminAction[]>([]);
  const [filteredActions, setFilteredActions] = useState<AdminAction[]>([]);
  const [selectedAction, setSelectedAction] = useState<AdminAction | null>(null);
  const [filterAdmin, setFilterAdmin] = useState<string>('all');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock data
  useEffect(() => {
    const mockData: AdminAction[] = [
      {
        id: '1',
        adminId: 'admin_001',
        adminName: 'Youcef Brahimi',
        adminEmail: 'youcef.brahimi@dinary.com',
        action: 'user_suspension',
        targetType: 'user',
        targetId: 'user_123',
        targetName: 'Ahmed Benaissa',
        description: 'Suspension du compte utilisateur pour activité suspecte',
        timestamp: '2025-06-02T10:30:00Z',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'high',
        result: 'success',
        details: {
          reason: 'Multiple failed login attempts',
          duration: '7 days'
        }
      },
      {
        id: '2',
        adminId: 'admin_002',
        adminName: 'Amina Touati',
        adminEmail: 'amina.touati@dinary.com',
        action: 'commission_update',
        targetType: 'system',
        description: 'Mise à jour des règles de commission pour les commerçants',
        timestamp: '2025-06-02T09:15:00Z',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        severity: 'medium',
        result: 'success',
        details: {
          oldRate: '2.5%',
          newRate: '2.8%',
          affectedMerchants: 150
        }
      },
      {
        id: '3',
        adminId: 'admin_001',
        adminName: 'Youcef Brahimi',
        adminEmail: 'youcef.brahimi@dinary.com',
        action: 'merchant_approval',
        targetType: 'merchant',
        targetId: 'merchant_456',
        targetName: 'Boutique El Bahdja',
        description: 'Approbation de la demande d\'inscription commerçant',
        timestamp: '2025-06-02T08:45:00Z',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'low',
        result: 'success',
        details: {
          businessType: 'Retail',
          verificationStatus: 'Complete'
        }
      },
      {
        id: '4',
        adminId: 'admin_003',
        adminName: 'Karim Messaoudi',
        adminEmail: 'karim.messaoudi@dinary.com',
        action: 'transaction_refund',
        targetType: 'transaction',
        targetId: 'txn_789',
        targetName: 'Transaction #789',
        description: 'Remboursement manuel d\'une transaction contestée',
        timestamp: '2025-06-02T07:20:00Z',
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36',
        severity: 'high',
        result: 'success',
        details: {
          amount: '15000 DA',
          reason: 'Fraud dispute'
        }
      },
      {
        id: '5',
        adminId: 'admin_002',
        adminName: 'Amina Touati',
        adminEmail: 'amina.touati@dinary.com',
        action: 'security_config',
        targetType: 'system',
        description: 'Modification des paramètres de sécurité',
        timestamp: '2025-06-01T16:30:00Z',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        severity: 'critical',
        result: 'failed',
        details: {
          setting: 'max_login_attempts',
          oldValue: '3',
          newValue: '5',
          error: 'Insufficient permissions'
        }
      }
    ];

    setTimeout(() => {
      setActions(mockData);
      setFilteredActions(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filtrage et recherche
  useEffect(() => {
    let filtered = actions;

    if (filterAdmin !== 'all') {
      filtered = filtered.filter(action => action.adminId === filterAdmin);
    }

    if (filterAction !== 'all') {
      filtered = filtered.filter(action => action.action === filterAction);
    }

    if (filterSeverity !== 'all') {
      filtered = filtered.filter(action => action.severity === filterSeverity);
    }

    if (filterDate) {
      const filterDateObj = new Date(filterDate);
      filtered = filtered.filter(action => {
        const actionDate = new Date(action.timestamp);
        return actionDate.toDateString() === filterDateObj.toDateString();
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(action => 
        action.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        action.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        action.targetName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredActions(filtered);
    setCurrentPage(1);
  }, [actions, filterAdmin, filterAction, filterSeverity, filterDate, searchTerm]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700 bg-red-100';
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'partial': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'user_suspension': return <User className="w-4 h-4" />;
      case 'merchant_approval': return <Shield className="w-4 h-4" />;
      case 'commission_update': return <Settings className="w-4 h-4" />;
      case 'transaction_refund': return <Activity className="w-4 h-4" />;
      case 'security_config': return <Shield className="w-4 h-4" />;
      default: return <Archive className="w-4 h-4" />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'user_suspension': return 'Suspension utilisateur';
      case 'merchant_approval': return 'Approbation commerçant';
      case 'commission_update': return 'Mise à jour commission';
      case 'transaction_refund': return 'Remboursement transaction';
      case 'security_config': return 'Configuration sécurité';
      default: return action;
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredActions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActions = filteredActions.slice(startIndex, endIndex);

  const uniqueAdmins = Array.from(new Set(actions.map(a => a.adminId)))
    .map(id => actions.find(a => a.adminId === id))
    .filter(Boolean) as AdminAction[];

  const uniqueActions = Array.from(new Set(actions.map(a => a.action)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Historique Actions Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Traçabilité complète des actions administrateurs</p>
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
              <p className="text-sm text-gray-500">Actions Totales</p>
              <p className="text-2xl font-bold text-blue-600">{actions.length}</p>
            </div>
            <Archive className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Admins Actifs</p>
              <p className="text-2xl font-bold text-green-600">{uniqueAdmins.length}</p>
            </div>
            <User className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Actions Critiques</p>
              <p className="text-2xl font-bold text-red-600">
                {actions.filter(a => a.severity === 'critical').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Échecs</p>
              <p className="text-2xl font-bold text-orange-600">
                {actions.filter(a => a.result === 'failed').length}
              </p>
            </div>
            <Activity className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filterAdmin}
            onChange={(e) => setFilterAdmin(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les admins</option>
            {uniqueAdmins.map((admin) => (
              <option key={admin.adminId} value={admin.adminId}>
                {admin.adminName}
              </option>
            ))}
          </select>
          
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toutes les actions</option>
            {uniqueActions.map((action) => (
              <option key={action} value={action}>
                {getActionLabel(action)}
              </option>
            ))}
          </select>
          
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toutes les sévérités</option>
            <option value="critical">Critique</option>
            <option value="high">Élevée</option>
            <option value="medium">Moyenne</option>
            <option value="low">Faible</option>
          </select>
        </div>
      </div>

      {/* Actions List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            Actions Administrateur ({filteredActions.length})
          </h3>
        </div>
        <div className="divide-y">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
              Chargement de l'historique...
            </div>
          ) : currentActions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Archive className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune action trouvée</p>
            </div>
          ) : (
            currentActions.map((action) => (
              <div key={action.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {getActionIcon(action.action)}
                        <span className="font-medium text-gray-800">
                          {getActionLabel(action.action)}
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(action.severity)}`}>
                        {action.severity}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getResultColor(action.result)}`}>
                        {action.result}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{action.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <User size={12} />
                        <span>{action.adminName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={12} />
                        <span>{new Date(action.timestamp).toLocaleString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={12} />
                        <span>{action.ipAddress}</span>
                      </div>
                      {action.targetName && (
                        <div className="flex items-center gap-2">
                          <Eye size={12} />
                          <span>{action.targetName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedAction(action)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors ml-4"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Affichage {startIndex + 1}-{Math.min(endIndex, filteredActions.length)} sur {filteredActions.length}
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

      {/* Action Detail Modal */}
      {selectedAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Détails de l'Action</h3>
              <button 
                onClick={() => setSelectedAction(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Administrateur</label>
                  <p className="text-gray-800">{selectedAction.adminName}</p>
                  <p className="text-sm text-gray-500">{selectedAction.adminEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Date & Heure</label>
                  <p className="text-gray-800">{new Date(selectedAction.timestamp).toLocaleString('fr-FR')}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Action</label>
                <p className="text-gray-800">{getActionLabel(selectedAction.action)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-800">{selectedAction.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Adresse IP</label>
                  <p className="text-gray-800 font-mono text-sm">{selectedAction.ipAddress}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Sévérité</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(selectedAction.severity)}`}>
                    {selectedAction.severity}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">User Agent</label>
                <p className="text-gray-800 text-sm break-all">{selectedAction.userAgent}</p>
              </div>
              
              {selectedAction.details && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Détails Techniques</label>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                    {JSON.stringify(selectedAction.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
