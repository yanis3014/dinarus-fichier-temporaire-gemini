'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bell, 
  BellOff, 
  Send, 
  Search, 
  Filter, 
  Plus,
  Edit3,
  Trash2,
  Eye,
  Users,
  UserCheck,
  Building,
  AlertTriangle,
  CheckCircle,
  Info,
  Megaphone,
  Calendar,
  Clock,
  Target,
  Globe,
  Smartphone,
  Mail,
  MessageCircle
} from 'lucide-react';

interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  category: 'system' | 'promotion' | 'security' | 'maintenance';
  channels: ('push' | 'email' | 'sms' | 'in_app')[];
  targetAudience: 'all' | 'users' | 'merchants' | 'custom';
  customSegments?: string[];
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
  usageCount: number;
}

interface NotificationCampaign {
  id: string;
  name: string;
  template: string;
  targetUsers: number;
  sentUsers: number;
  deliveredUsers: number;
  readUsers: number;
  clickedUsers: number;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduledDate?: string;
  sentDate?: string;
  channels: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface NewNotification {
  templateId: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  channels: string[];
  targetAudience: 'all' | 'users' | 'merchants' | 'custom';
  customFilter: {
    userTypes?: string[];
    regions?: string[];
    activityLevel?: string;
    registrationDate?: { from: string; to: string };
  };
  scheduledDate?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  sendImmediately: boolean;
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'send' | 'templates' | 'campaigns' | 'analytics'>('send');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Mock data for notification templates
  const [templates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      name: 'Bienvenue Nouvel Utilisateur',
      title: 'Bienvenue sur Dinary !',
      content: 'Félicitations {userName} ! Votre compte a été créé avec succès. Découvrez nos fonctionnalités.',
      type: 'success',
      category: 'system',
      channels: ['push', 'email', 'in_app'],
      targetAudience: 'users',
      isActive: true,
      createdAt: '2024-01-01T10:00:00Z',
      lastUsed: '2024-01-15T14:30:00Z',
      usageCount: 156
    },
    {
      id: '2',
      name: 'Maintenance Programmée',
      title: 'Maintenance du système',
      content: 'Une maintenance est programmée le {date} de {startTime} à {endTime}. Certains services pourraient être temporairement indisponibles.',
      type: 'warning',
      category: 'maintenance',
      channels: ['push', 'email', 'sms', 'in_app'],
      targetAudience: 'all',
      isActive: true,
      createdAt: '2024-01-01T10:00:00Z',
      lastUsed: '2024-01-10T09:00:00Z',
      usageCount: 8
    },
    {
      id: '3',
      name: 'Promotion Spéciale',
      title: 'Offre spéciale - {promoName}',
      content: 'Profitez de notre offre spéciale ! {promoDetails}. Offre valable jusqu\'au {expiryDate}.',
      type: 'info',
      category: 'promotion',
      channels: ['push', 'email', 'in_app'],
      targetAudience: 'all',
      isActive: true,
      createdAt: '2024-01-01T10:00:00Z',
      lastUsed: '2024-01-12T16:20:00Z',
      usageCount: 24
    },
    {
      id: '4',
      name: 'Alerte Sécurité',
      title: 'Alerte de sécurité importante',
      content: 'Une activité suspecte a été détectée sur votre compte. Veuillez vérifier vos informations immédiatement.',
      type: 'urgent',
      category: 'security',
      channels: ['push', 'email', 'sms', 'in_app'],
      targetAudience: 'custom',
      customSegments: ['high_risk_users'],
      isActive: true,
      createdAt: '2024-01-01T10:00:00Z',
      lastUsed: '2024-01-14T11:45:00Z',
      usageCount: 3
    }
  ]);

  // Mock data for notification campaigns
  const [campaigns] = useState<NotificationCampaign[]>([
    {
      id: '1',
      name: 'Campagne Nouvel An 2024',
      template: 'Promotion Spéciale',
      targetUsers: 15000,
      sentUsers: 14850,
      deliveredUsers: 14200,
      readUsers: 8520,
      clickedUsers: 2130,
      status: 'sent',
      sentDate: '2024-01-01T00:00:00Z',
      channels: ['push', 'email'],
      priority: 'high'
    },
    {
      id: '2',
      name: 'Maintenance Janvier',
      template: 'Maintenance Programmée',
      targetUsers: 25000,
      sentUsers: 25000,
      deliveredUsers: 24750,
      readUsers: 18600,
      clickedUsers: 850,
      status: 'sent',
      sentDate: '2024-01-08T09:00:00Z',
      channels: ['push', 'email', 'sms'],
      priority: 'urgent'
    },
    {
      id: '3',
      name: 'Offre Valentine',
      template: 'Promotion Spéciale',
      targetUsers: 12000,
      sentUsers: 0,
      deliveredUsers: 0,
      readUsers: 0,
      clickedUsers: 0,
      status: 'scheduled',
      scheduledDate: '2024-02-10T08:00:00Z',
      channels: ['push', 'email'],
      priority: 'medium'
    }
  ]);

  const [newNotification, setNewNotification] = useState<NewNotification>({
    templateId: '',
    title: '',
    content: '',
    type: 'info',
    channels: ['push'],
    targetAudience: 'all',
    customFilter: {},
    priority: 'medium',
    sendImmediately: true
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="w-4 h-4 text-blue-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'urgent': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'text-blue-700 bg-blue-100';
      case 'warning': return 'text-yellow-700 bg-yellow-100';
      case 'success': return 'text-green-700 bg-green-100';
      case 'urgent': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-green-700 bg-green-100';
      case 'sending': return 'text-blue-700 bg-blue-100';
      case 'scheduled': return 'text-yellow-700 bg-yellow-100';
      case 'draft': return 'text-gray-700 bg-gray-100';
      case 'failed': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'push': return <Smartphone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <MessageCircle className="w-4 h-4" />;
      case 'in_app': return <Bell className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const handleChannelToggle = (channel: string) => {
    setNewNotification(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  const handleSendNotification = () => {
    console.log('Sending notification:', newNotification);
    // Reset form
    setNewNotification({
      templateId: '',
      title: '',
      content: '',
      type: 'info',
      channels: ['push'],
      targetAudience: 'all',
      customFilter: {},
      priority: 'medium',
      sendImmediately: true
    });
  };

  const calculateEngagementRate = (campaign: NotificationCampaign) => {
    if (campaign.deliveredUsers === 0) return 0;
    return Math.round((campaign.readUsers / campaign.deliveredUsers) * 100);
  };

  const calculateClickRate = (campaign: NotificationCampaign) => {
    if (campaign.readUsers === 0) return 0;
    return Math.round((campaign.clickedUsers / campaign.readUsers) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Centre de Notifications</h1>
          <p className="text-gray-600">Gérer les notifications et campagnes de communication</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowTemplateModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouveau Modèle
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('send')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'send'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Send className="w-4 h-4 inline mr-2" />
          Envoyer
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'templates'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Bell className="w-4 h-4 inline mr-2" />
          Modèles
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'campaigns'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Megaphone className="w-4 h-4 inline mr-2" />
          Campagnes
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'analytics'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Target className="w-4 h-4 inline mr-2" />
          Analytiques
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Envoyées Aujourd'hui</p>
                <p className="text-2xl font-bold text-blue-600">2,341</p>
              </div>
              <Send className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux de Lecture</p>
                <p className="text-2xl font-bold text-green-600">78%</p>
              </div>
              <Eye className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Campagnes Actives</p>
                <p className="text-2xl font-bold text-yellow-600">5</p>
              </div>
              <Megaphone className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Utilisateurs Ciblés</p>
                <p className="text-2xl font-bold text-purple-600">25K</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Send Notification Tab */}
      {activeTab === 'send' && (
        <Card>
          <CardHeader>
            <CardTitle>Nouvelle Notification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Modèle (optionnel)</label>
                <select
                  value={newNotification.templateId}
                  onChange={(e) => {
                    const template = templates.find(t => t.id === e.target.value);
                    setNewNotification(prev => ({
                      ...prev,
                      templateId: e.target.value,
                      title: template?.title || prev.title,
                      content: template?.content || prev.content,
                      type: template?.type || prev.type,
                      channels: template?.channels || prev.channels
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Créer à partir de zéro</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>{template.name}</option>
                  ))}
                </select>
              </div>

              {/* Title and Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Titre *</label>
                  <input
                    type="text"
                    required
                    value={newNotification.title}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Titre de la notification"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={newNotification.type}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="info">Information</option>
                    <option value="warning">Avertissement</option>
                    <option value="success">Succès</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Contenu *</label>
                <textarea
                  required
                  value={newNotification.content}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contenu de la notification..."
                />
              </div>

              {/* Channels */}
              <div>
                <label className="block text-sm font-medium mb-3">Canaux de diffusion</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['push', 'email', 'sms', 'in_app'].map(channel => (
                    <label key={channel} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={newNotification.channels.includes(channel)}
                        onChange={() => handleChannelToggle(channel)}
                        className="mr-3"
                      />
                      <div className="flex items-center gap-2">
                        {getChannelIcon(channel)}
                        <span className="capitalize">{channel.replace('_', ' ')}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium mb-3">Audience cible</label>
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="audience"
                        value="all"
                        checked={newNotification.targetAudience === 'all'}
                        onChange={(e) => setNewNotification(prev => ({ ...prev, targetAudience: e.target.value as any }))}
                        className="mr-2"
                      />
                      <Globe className="w-4 h-4 mr-1" />
                      Tous les utilisateurs
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="audience"
                        value="users"
                        checked={newNotification.targetAudience === 'users'}
                        onChange={(e) => setNewNotification(prev => ({ ...prev, targetAudience: e.target.value as any }))}
                        className="mr-2"
                      />
                      <UserCheck className="w-4 h-4 mr-1" />
                      Particuliers uniquement
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="audience"
                        value="merchants"
                        checked={newNotification.targetAudience === 'merchants'}
                        onChange={(e) => setNewNotification(prev => ({ ...prev, targetAudience: e.target.value as any }))}
                        className="mr-2"
                      />
                      <Building className="w-4 h-4 mr-1" />
                      Marchands uniquement
                    </label>
                  </div>
                </div>
              </div>

              {/* Scheduling */}
              <div>
                <label className="block text-sm font-medium mb-3">Programmation</label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="scheduling"
                      checked={newNotification.sendImmediately}
                      onChange={() => setNewNotification(prev => ({ ...prev, sendImmediately: true }))}
                      className="mr-2"
                    />
                    Envoyer immédiatement
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="scheduling"
                      checked={!newNotification.sendImmediately}
                      onChange={() => setNewNotification(prev => ({ ...prev, sendImmediately: false }))}
                      className="mr-2"
                    />
                    Programmer l'envoi
                  </label>
                  {!newNotification.sendImmediately && (
                    <div className="ml-6">
                      <input
                        type="datetime-local"
                        value={newNotification.scheduledDate}
                        onChange={(e) => setNewNotification(prev => ({ ...prev, scheduledDate: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium mb-2">Priorité</label>
                <select
                  value={newNotification.priority}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Faible</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Élevée</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowPreview(true)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Aperçu
                </button>
                <button
                  onClick={handleSendNotification}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {newNotification.sendImmediately ? 'Envoyer' : 'Programmer'}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Modèles de Notifications</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un modèle..."
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(template.type)}
                      <div>
                        <h3 className="font-semibold text-lg">{template.name}</h3>
                        <p className="text-gray-600">{template.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(template.type)}`}>
                        {template.type.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        template.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {template.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{template.content}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Catégorie</p>
                      <p className="font-semibold capitalize">{template.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Audience</p>
                      <p className="font-semibold capitalize">{template.targetAudience}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Utilisations</p>
                      <p className="font-semibold">{template.usageCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Dernière utilisation</p>
                      <p className="font-semibold">
                        {template.lastUsed ? new Date(template.lastUsed).toLocaleDateString('fr-FR') : 'Jamais'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-sm text-gray-600">Canaux:</span>
                    <div className="flex gap-2">
                      {template.channels.map((channel, index) => (
                        <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {getChannelIcon(channel)}
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      Voir
                    </button>
                    <button className="px-3 py-1 text-green-600 hover:bg-green-50 rounded transition-colors flex items-center gap-1">
                      <Send className="w-4 h-4" />
                      Utiliser
                    </button>
                    <button className="px-3 py-1 text-gray-600 hover:bg-gray-50 rounded transition-colors flex items-center gap-1">
                      <Edit3 className="w-4 h-4" />
                      Modifier
                    </button>
                    <button className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors flex items-center gap-1">
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Campagnes de Notifications</h2>
          </div>

          <div className="grid gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{campaign.name}</h3>
                      <p className="text-gray-600">Modèle: {campaign.template}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Cibles</p>
                      <p className="font-bold text-lg">{campaign.targetUsers.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Envoyées</p>
                      <p className="font-bold text-lg text-blue-600">{campaign.sentUsers.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Livrées</p>
                      <p className="font-bold text-lg text-green-600">{campaign.deliveredUsers.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Lues</p>
                      <p className="font-bold text-lg text-purple-600">{campaign.readUsers.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{calculateEngagementRate(campaign)}% d'engagement</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Clics</p>
                      <p className="font-bold text-lg text-orange-600">{campaign.clickedUsers.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{calculateClickRate(campaign)}% de clics</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">Canaux:</span>
                      <div className="flex gap-2">
                        {campaign.channels.map((channel, index) => (
                          <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">
                            {getChannelIcon(channel)}
                            {channel}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        Détails
                      </button>
                      {campaign.status === 'draft' && (
                        <button className="px-3 py-1 text-green-600 hover:bg-green-50 rounded transition-colors flex items-center gap-1">
                          <Send className="w-4 h-4" />
                          Envoyer
                        </button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Analytiques des Notifications</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance par Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { channel: 'Push', sent: 15000, delivered: 14200, read: 8500, rate: 60 },
                    { channel: 'Email', sent: 12000, delivered: 11800, read: 7800, rate: 66 },
                    { channel: 'SMS', sent: 3000, delivered: 2950, read: 2400, rate: 81 },
                    { channel: 'In-App', sent: 18000, delivered: 18000, read: 12600, rate: 70 }
                  ].map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        {getChannelIcon(stat.channel.toLowerCase())}
                        <span className="font-medium">{stat.channel}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{stat.rate}% de lecture</p>
                        <p className="text-sm text-gray-600">{stat.read.toLocaleString()} / {stat.delivered.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tendances Hebdomadaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { day: 'Lundi', sent: 3200, engagement: 68 },
                    { day: 'Mardi', sent: 2800, engagement: 72 },
                    { day: 'Mercredi', sent: 3500, engagement: 65 },
                    { day: 'Jeudi', sent: 4100, engagement: 70 },
                    { day: 'Vendredi', sent: 2900, engagement: 74 },
                    { day: 'Samedi', sent: 1800, engagement: 78 },
                    { day: 'Dimanche', sent: 1600, engagement: 81 }
                  ].map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="font-medium">{stat.day}</span>
                      <div className="text-right">
                        <p className="font-semibold">{stat.engagement}% d'engagement</p>
                        <p className="text-sm text-gray-600">{stat.sent.toLocaleString()} envoyées</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
