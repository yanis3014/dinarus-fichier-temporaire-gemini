'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  UserPlus, 
  Users, 
  Search, 
  Filter, 
  Download,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Building,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Upload,
  FileText,
  Send
} from 'lucide-react';

interface UserForm {
  type: 'individual' | 'merchant';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  address: string;
  city: string;
  wilaya: string;
  businessName?: string;
  businessType?: string;
  registrationNumber?: string;
  documents: File[];
  sendWelcomeEmail: boolean;
  requireEmailVerification: boolean;
  initialStatus: 'active' | 'pending' | 'suspended';
}

interface CreatedUser {
  id: string;
  type: 'individual' | 'merchant';
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'pending' | 'suspended';
  createdAt: string;
  createdBy: string;
  businessName?: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
}

export default function UserCreationPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<UserForm>({
    type: 'individual',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    wilaya: 'Alger',
    businessName: '',
    businessType: '',
    registrationNumber: '',
    documents: [],
    sendWelcomeEmail: true,
    requireEmailVerification: true,
    initialStatus: 'active'
  });

  // Mock data for created users history
  const [createdUsers] = useState<CreatedUser[]>([
    {
      id: '1',
      type: 'individual',
      name: 'Ahmed Belkacem',
      email: 'ahmed.belkacem@email.com',
      phone: '+213 555 123 456',
      status: 'active',
      createdAt: '2024-01-15T10:30:00Z',
      createdBy: 'Admin Principal',
      verificationStatus: 'verified'
    },
    {
      id: '2',
      type: 'merchant',
      name: 'Fatima Zouani',
      email: 'contact@boutiquefatima.dz',
      phone: '+213 555 234 567',
      status: 'pending',
      createdAt: '2024-01-14T14:20:00Z',
      createdBy: 'Admin Principal',
      businessName: 'Boutique Fatima',
      verificationStatus: 'pending'
    },
    {
      id: '3',
      type: 'merchant',
      name: 'Mohamed Cherif',
      email: 'mohamed.cherif@techstore.dz',
      phone: '+213 555 345 678',
      status: 'active',
      createdAt: '2024-01-13T09:15:00Z',
      createdBy: 'Admin Régional',
      businessName: 'Tech Store Algeria',
      verificationStatus: 'verified'
    },
    {
      id: '4',
      type: 'individual',
      name: 'Amina Kaddour',
      email: 'amina.kaddour@email.com',
      phone: '+213 555 456 789',
      status: 'suspended',
      createdAt: '2024-01-12T16:45:00Z',
      createdBy: 'Admin Principal',
      verificationStatus: 'rejected'
    }
  ]);

  const wilayas = [
    'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
    'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger',
    'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
    'Constantine', 'Médéa', 'Mostaganem', 'MSila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
    'Illizi', 'Bordj Bou Arreridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
    'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
    'Ghardaïa', 'Relizane'
  ];

  const businessTypes = [
    'Commerce de détail',
    'Commerce de gros',
    'Restaurant/Café',
    'Services professionnels',
    'Artisanat',
    'Agriculture',
    'Technologie',
    'Santé',
    'Éducation',
    'Transport',
    'Immobilier',
    'Autre'
  ];

  const handleInputChange = (field: keyof UserForm, value: string | boolean | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Reset form
    setFormData({
      type: 'individual',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      address: '',
      city: '',
      wilaya: 'Alger',
      businessName: '',
      businessType: '',
      registrationNumber: '',
      documents: [],
      sendWelcomeEmail: true,
      requireEmailVerification: true,
      initialStatus: 'active'
    });
    
    setIsSubmitting(false);
    alert('Utilisateur créé avec succès!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-700 bg-green-100';
      case 'pending': return 'text-yellow-700 bg-yellow-100';
      case 'suspended': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Création d'Utilisateurs</h1>
          <p className="text-gray-600">Créer de nouveaux comptes utilisateurs et marchands</p>
        </div>
        
        <div className="flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Modèle CSV
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'create'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <UserPlus className="w-4 h-4 inline mr-2" />
          Créer un Utilisateur
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'history'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Historique des Créations
        </button>
      </div>

      {/* Create User Tab */}
      {activeTab === 'create' && (
        <Card>
          <CardHeader>
            <CardTitle>Nouveau Compte Utilisateur</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Type Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">Type de compte</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="userType"
                      value="individual"
                      checked={formData.type === 'individual'}
                      onChange={(e) => handleInputChange('type', e.target.value as 'individual' | 'merchant')}
                      className="mr-2"
                    />
                    <Users className="w-4 h-4 mr-1" />
                    Particulier
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="userType"
                      value="merchant"
                      checked={formData.type === 'merchant'}
                      onChange={(e) => handleInputChange('type', e.target.value as 'individual' | 'merchant')}
                      className="mr-2"
                    />
                    <Building className="w-4 h-4 mr-1" />
                    Marchand
                  </label>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Nom *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Téléphone *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+213 555 123 456"
                    />
                  </div>
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Mot de passe *</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Confirmer le mot de passe *</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Adresse</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={2}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ville</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Wilaya</label>
                    <select
                      value={formData.wilaya}
                      onChange={(e) => handleInputChange('wilaya', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {wilayas.map(wilaya => (
                        <option key={wilaya} value={wilaya}>{wilaya}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Business Information (for merchants) */}
              {formData.type === 'merchant' && (
                <div className="border-t pt-6 space-y-4">
                  <h3 className="text-lg font-semibold">Informations Commerciales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom de l'entreprise *</label>
                      <input
                        type="text"
                        required
                        value={formData.businessName}
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Type d'activité *</label>
                      <select
                        required
                        value={formData.businessType}
                        onChange={(e) => handleInputChange('businessType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Sélectionner...</option>
                        {businessTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Numéro de registre commerce</label>
                    <input
                      type="text"
                      value={formData.registrationNumber}
                      onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Account Settings */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-semibold">Paramètres du Compte</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Statut initial</label>
                    <select
                      value={formData.initialStatus}
                      onChange={(e) => handleInputChange('initialStatus', e.target.value as 'active' | 'pending' | 'suspended')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Actif</option>
                      <option value="pending">En attente</option>
                      <option value="suspended">Suspendu</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="sendWelcomeEmail"
                      checked={formData.sendWelcomeEmail}
                      onChange={(e) => handleInputChange('sendWelcomeEmail', e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="sendWelcomeEmail" className="text-sm">Envoyer email de bienvenue</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requireEmailVerification"
                      checked={formData.requireEmailVerification}
                      onChange={(e) => handleInputChange('requireEmailVerification', e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="requireEmailVerification" className="text-sm">Vérification email requise</label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>Création en cours...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Créer le Compte
                    </>
                  )}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Filters and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Rechercher par nom, email..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Tous les types</option>
                  <option value="individual">Particuliers</option>
                  <option value="merchant">Marchands</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="pending">En attente</option>
                  <option value="suspended">Suspendu</option>
                </select>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Exporter
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <div className="grid gap-4">
            {createdUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <p className="text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-500">{user.phone}</p>
                        {user.businessName && (
                          <p className="text-sm text-blue-600 font-medium">{user.businessName}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getVerificationIcon(user.verificationStatus)}
                        <span className="text-sm capitalize">{user.verificationStatus}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.type === 'merchant' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.type === 'merchant' ? 'Marchand' : 'Particulier'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                    <div>
                      Créé le {new Date(user.createdAt).toLocaleDateString('fr-FR')} par {user.createdBy}
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">Voir détails</button>
                      <button className="text-green-600 hover:text-green-800">Modifier</button>
                      <button className="text-red-600 hover:text-red-800">Suspendre</button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
