'use client'

import { useState } from 'react';
import { 
  Bell, Search, Filter, Users, Store, 
  AlertTriangle, CheckCircle, Calendar, Clock,
  Send, Edit, Trash2, Plus, Settings, ChevronDown
} from 'lucide-react';

// Données fictives pour les notifications
const notifications = [
  {
    id: "n001",
    title: "Nouveau commerçant en attente de validation",
    content: "Le commerçant 'Café de Paris' a soumis une demande de partenariat.",
    type: "merchant",
    priority: "high",
    status: "unread",
    createdAt: "2023-05-14T09:30:00",
    link: "/admin/merchants",
    icon: <Store className="h-5 w-5" />,
    actions: ["view", "approve", "reject"],
    recipients: {
      type: "role",
      value: "admin",
    },
  },
  {
    id: "n002",
    title: "5 nouvelles inscriptions aujourd'hui",
    content: "5 nouveaux utilisateurs se sont inscrits aujourd'hui. Vérifiez leurs informations.",
    type: "user",
    priority: "medium",
    status: "unread",
    createdAt: "2023-05-14T08:15:00",
    link: "/admin/users",
    icon: <Users className="h-5 w-5" />,
    actions: ["view"],
    recipients: {
      type: "role",
      value: "admin",
    },
  },
  {
    id: "n003",
    title: "Alerte : Volume inhabituel de retraits",
    content: "Un volume anormalement élevé de demandes de retrait a été détecté. Vérification requise.",
    type: "system",
    priority: "critical",
    status: "unread",
    createdAt: "2023-05-14T07:45:00",
    link: "/admin/withdrawals",
    icon: <AlertTriangle className="h-5 w-5" />,
    actions: ["view"],
    recipients: {
      type: "role",
      value: "admin",
    },
  },
  {
    id: "n004",
    title: "Maintenance programmée",
    content: "Une maintenance du système est programmée pour demain à 2:00 AM. La plateforme sera indisponible pendant environ 30 minutes.",
    type: "system",
    priority: "medium",
    status: "read",
    createdAt: "2023-05-13T14:20:00",
    link: "#",
    icon: <Settings className="h-5 w-5" />,
    actions: ["view"],
    recipients: {
      type: "all",
      value: null,
    },
  },
  {
    id: "n005",
    title: "Nouvelle mission ajoutée",
    content: "La mission 'Parrainage Premium' a été ajoutée et est maintenant active pour tous les utilisateurs.",
    type: "mission",
    priority: "low",
    status: "read",
    createdAt: "2023-05-13T11:05:00",
    link: "/admin/missions",
    icon: <CheckCircle className="h-5 w-5" />,
    actions: ["view"],
    recipients: {
      type: "role",
      value: "admin",
    },
  },
  {
    id: "n006",
    title: "Bilan hebdomadaire disponible",
    content: "Le bilan hebdomadaire de l'activité et des performances est maintenant disponible.",
    type: "report",
    priority: "low",
    status: "read",
    createdAt: "2023-05-12T10:00:00",
    link: "/admin/dashboard",
    icon: <Calendar className="h-5 w-5" />,
    actions: ["view"],
    recipients: {
      type: "role",
      value: "admin",
    },
  }
];

// Templates de notification
const notificationTemplates = [
  {
    id: "t001",
    name: "Bienvenue",
    type: "user",
    title: "Bienvenue sur Dinary !",
    content: "Merci de vous être inscrit. Découvrez toutes les fonctionnalités de notre application.",
    recipients: {
      type: "trigger",
      value: "new_user",
    },
  },
  {
    id: "t002",
    name: "Confirmation de retrait",
    type: "transaction",
    title: "Votre retrait a été traité",    content: "Votre demande de retrait de {{amount}} DZD a été traitée avec succès.",
    recipients: {
      type: "trigger",
      value: "withdrawal_processed",
    },
  },
  {
    id: "t003",
    name: "Alerte de sécurité",
    type: "security",
    title: "Connexion depuis un nouvel appareil",
    content: "Une connexion a été détectée depuis un nouvel appareil. Si ce n'était pas vous, veuillez sécuriser votre compte.",
    recipients: {
      type: "trigger",
      value: "new_device_login",
    },
  },
];

export default function NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [view, setView] = useState('notifications'); // 'notifications' ou 'templates'
  
  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }
  };
  
  // Filtrer les notifications
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch = searchTerm === '' ||
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.content.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    const matchesPriority = priorityFilter === 'all' || notification.priority === priorityFilter;
    
    return matchesSearch && matchesType && matchesPriority;
  });
  
  // Notification Priority Badge
  const PriorityBadge = ({ priority }) => {
    switch (priority) {
      case 'critical':
        return (
          <span className="badge badge-danger">
            Critique
          </span>
        );
      case 'high':
        return (
          <span className="badge badge-warning">
            Élevée
          </span>
        );
      case 'medium':
        return (
          <span className="badge badge-info">
            Moyenne
          </span>
        );
      case 'low':
        return (
          <span className="badge badge-success">
            Basse
          </span>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Bell className="mr-2 text-dinary-turquoise" /> 
            Centre de notifications
          </h1>
          <p className="text-sm text-gray-500 mt-1">Gérez et envoyez des notifications aux utilisateurs</p>
        </div>
        
        <div className="flex space-x-2">
          <button 
            className={`btn-secondary ${view === 'notifications' ? 'bg-gray-100' : ''}`}
            onClick={() => setView('notifications')}
          >
            Notifications
          </button>
          <button 
            className={`btn-secondary ${view === 'templates' ? 'bg-gray-100' : ''}`}
            onClick={() => setView('templates')}
          >
            Templates
          </button>
          <button className="btn-primary flex items-center">
            <Plus size={16} className="mr-1" />
            Nouvelle notification
          </button>
        </div>
      </div>
      
      {/* Notification Management Section */}
      {view === 'notifications' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="admin-card">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-dinary-turquoise/10 mr-4">
                  <Bell className="h-6 w-6 text-dinary-turquoise" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-bold">{notifications.length}</p>
                </div>
              </div>
            </div>
            
            <div className="admin-card">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 mr-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Non lues</p>
                  <p className="text-2xl font-bold">{notifications.filter(n => n.status === 'unread').length}</p>
                </div>
              </div>
            </div>
            
            <div className="admin-card">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 mr-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Critiques</p>
                  <p className="text-2xl font-bold">{notifications.filter(n => n.priority === 'critical').length}</p>
                </div>
              </div>
            </div>
            
            <div className="admin-card">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 mr-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Traitées</p>
                  <p className="text-2xl font-bold">{notifications.filter(n => n.status === 'read').length}</p>
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
                placeholder="Rechercher des notifications..."
                className="input-primary pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Bell size={18} className="text-gray-500 mr-2" />
                <select
                  className="select-primary"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">Tous les types</option>
                  <option value="user">Utilisateur</option>
                  <option value="merchant">Commerçant</option>
                  <option value="system">Système</option>
                  <option value="mission">Mission</option>
                  <option value="report">Rapport</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <Filter size={18} className="text-gray-500 mr-2" />
                <select
                  className="select-primary"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="all">Toutes les priorités</option>
                  <option value="critical">Critique</option>
                  <option value="high">Élevée</option>
                  <option value="medium">Moyenne</option>
                  <option value="low">Basse</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="admin-card text-center py-10">
                <p className="text-gray-500">Aucune notification ne correspond à vos critères.</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`admin-card ${notification.status === 'unread' ? 'border-l-4 border-l-dinary-turquoise' : ''} hover:shadow-md`}
                >
                  <div className="flex items-start">
                    <div className={`rounded-full p-3 mr-4 ${
                      notification.priority === 'critical' ? 'bg-red-100 text-red-600' :
                      notification.priority === 'high' ? 'bg-yellow-100 text-yellow-600' :
                      notification.priority === 'medium' ? 'bg-blue-100 text-blue-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {notification.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                        <h3 className="text-base font-medium">{notification.title}</h3>
                        <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                          <PriorityBadge priority={notification.priority} />
                          <span className="text-xs text-gray-500">{formatDate(notification.createdAt)}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{notification.content}</p>
                      
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-2">
                          {notification.actions.includes('view') && (
                            <a 
                              href={notification.link} 
                              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
                            >
                              Voir
                            </a>
                          )}
                          
                          {notification.actions.includes('approve') && (
                            <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-green-100 hover:bg-green-200 text-green-700">
                              <CheckCircle size={14} className="mr-1" /> Approuver
                            </button>
                          )}
                          
                          {notification.actions.includes('reject') && (
                            <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md bg-red-100 hover:bg-red-200 text-red-700">
                              <AlertTriangle size={14} className="mr-1" /> Rejeter
                            </button>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                            <Edit size={16} />
                          </button>
                          <button className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-600">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
      
      {/* Templates Section */}
      {view === 'templates' && (
        <>
          {/* Templates Header */}
          <div className="admin-card">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">Templates de notification</h2>
              <button className="btn-primary flex items-center">
                <Plus size={16} className="mr-1" />
                Nouveau template
              </button>
            </div>
            
            <p className="text-sm text-gray-600">
              Créez et gérez des modèles de notification qui peuvent être envoyés automatiquement 
              en fonction de différents déclencheurs ou manuellement à des groupes d'utilisateurs.
            </p>
          </div>
          
          {/* Templates List */}
          <div className="space-y-4">
            {notificationTemplates.map((template) => (
              <div key={template.id} className="admin-card hover:shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium">{template.name}</h3>
                      <span className="ml-2 badge badge-info">{template.type}</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">Déclencheur: {template.recipients.value}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="btn-secondary text-sm py-1.5 flex items-center">
                      <Send size={14} className="mr-1" />
                      Tester
                    </button>
                    <button className="btn-secondary text-sm py-1.5">Modifier</button>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium mb-1">{template.title}</p>
                  <p className="text-gray-600 text-sm">{template.content}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Advanced Options */}
          <div className="admin-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Options avancées</h3>
              <button className="text-dinary-turquoise flex items-center text-sm">
                Configuration <ChevronDown size={16} className="ml-1" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-sm mb-2">Planifier des notifications</h4>
                <p className="text-xs text-gray-600">Créez des notifications programmées pour des dates et heures spécifiques.</p>
                <button className="mt-3 btn-secondary text-xs py-1 w-full">Configurer</button>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-sm mb-2">Segmentation utilisateurs</h4>
                <p className="text-xs text-gray-600">Ciblez des groupes spécifiques d'utilisateurs en fonction de critères.</p>
                <button className="mt-3 btn-secondary text-xs py-1 w-full">Configurer</button>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-sm mb-2">Notifications automatiques</h4>
                <p className="text-xs text-gray-600">Définissez des règles pour envoyer des notifications basées sur des événements.</p>
                <button className="mt-3 btn-secondary text-xs py-1 w-full">Configurer</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
