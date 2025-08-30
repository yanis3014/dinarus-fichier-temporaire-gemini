'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Store, 
  TrendingUp, 
  MapPin,
  Calendar,
  Users,
  Star,
  Download,
  Filter,
  Plus,
  Eye,
  CheckCircle,
  Clock,
  Award
} from 'lucide-react';

interface NewMerchant {
  id: string;
  name: string;
  businessName: string;
  category: string;
  location: string;
  registrationDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  revenue: number;
  transactions: number;
  rating: number;
  documents: number;
  completionRate: number;
  riskScore: number;
  onboardingStep: number;
  totalSteps: number;
}

interface OnboardingMetric {
  name: string;
  completed: number;
  total: number;
  percentage: number;
  avgTime: number;
  dropoffRate: number;
}

interface GeographicData {
  region: string;
  newMerchants: number;
  approved: number;
  pending: number;
  growth: number;
}

export default function NewMerchantsPage() {
  const [merchants, setMerchants] = useState<NewMerchant[]>([]);
  const [metrics, setMetrics] = useState<OnboardingMetric[]>([]);
  const [geoData, setGeoData] = useState<GeographicData[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedMerchant, setSelectedMerchant] = useState<NewMerchant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation de récupération des données
    setTimeout(() => {
      setMerchants([
        {
          id: '1',
          name: 'Ahmed Benali',
          businessName: 'Electronics Store Alger',
          category: 'Électronique',
          location: 'Alger Centre',
          registrationDate: '2024-06-14',
          status: 'pending',
          revenue: 0,
          transactions: 0,
          rating: 0,
          documents: 3,
          completionRate: 85,
          riskScore: 25,
          onboardingStep: 4,
          totalSteps: 6
        },
        {
          id: '2',
          name: 'Fatima Zahra',
          businessName: 'Mode & Beauté Oran',
          category: 'Mode',
          location: 'Oran Centre',
          registrationDate: '2024-06-13',
          status: 'under_review',
          revenue: 1250,
          transactions: 15,
          rating: 4.2,
          documents: 5,
          completionRate: 95,
          riskScore: 15,
          onboardingStep: 5,
          totalSteps: 6
        },
        {
          id: '3',
          name: 'Karim Meziane',
          businessName: 'Restaurant La Perle',
          category: 'Restauration',
          location: 'Constantine',
          registrationDate: '2024-06-12',
          status: 'approved',
          revenue: 3650,
          transactions: 42,
          rating: 4.7,
          documents: 6,
          completionRate: 100,
          riskScore: 10,
          onboardingStep: 6,
          totalSteps: 6
        },
        {
          id: '4',
          name: 'Samira Boudaoud',
          businessName: 'Pharmacie Santé Plus',
          category: 'Santé',
          location: 'Sétif',
          registrationDate: '2024-06-11',
          status: 'approved',
          revenue: 2890,
          transactions: 68,
          rating: 4.5,
          documents: 6,
          completionRate: 100,
          riskScore: 8,
          onboardingStep: 6,
          totalSteps: 6
        },
        {
          id: '5',
          name: 'Youssef Kadi',
          businessName: 'Tech Solutions',
          category: 'Services',
          location: 'Annaba',
          registrationDate: '2024-06-10',
          status: 'rejected',
          revenue: 0,
          transactions: 0,
          rating: 0,
          documents: 2,
          completionRate: 45,
          riskScore: 75,
          onboardingStep: 2,
          totalSteps: 6
        },
        {
          id: '6',
          name: 'Leila Hamidi',
          businessName: 'Artisanat Traditionnel',
          category: 'Artisanat',
          location: 'Tlemcen',
          registrationDate: '2024-06-09',
          status: 'pending',
          revenue: 450,
          transactions: 8,
          rating: 3.8,
          documents: 4,
          completionRate: 70,
          riskScore: 35,
          onboardingStep: 3,
          totalSteps: 6
        }
      ]);

      setMetrics([
        { name: 'Inscription Initiale', completed: 156, total: 156, percentage: 100, avgTime: 5, dropoffRate: 0 },
        { name: 'Vérification Documents', completed: 142, total: 156, percentage: 91, avgTime: 24, dropoffRate: 9 },
        { name: 'Validation Identité', completed: 128, total: 142, percentage: 90, avgTime: 48, dropoffRate: 10 },
        { name: 'Configuration Paiements', completed: 115, total: 128, percentage: 90, avgTime: 12, dropoffRate: 10 },
        { name: 'Tests Transactions', completed: 98, total: 115, percentage: 85, avgTime: 6, dropoffRate: 15 },
        { name: 'Activation Finale', completed: 89, total: 98, percentage: 91, avgTime: 2, dropoffRate: 9 }
      ]);

      setGeoData([
        { region: 'Alger', newMerchants: 45, approved: 38, pending: 7, growth: 22.5 },
        { region: 'Oran', newMerchants: 32, approved: 28, pending: 4, growth: 18.2 },
        { region: 'Constantine', newMerchants: 28, approved: 24, pending: 4, growth: 15.8 },
        { region: 'Sétif', newMerchants: 18, approved: 15, pending: 3, growth: 12.3 },
        { region: 'Annaba', newMerchants: 15, approved: 12, pending: 3, growth: 8.7 },
        { region: 'Tlemcen', newMerchants: 12, approved: 9, pending: 3, growth: 10.5 },
        { region: 'Autres', newMerchants: 24, approved: 19, pending: 5, growth: 14.2 }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Approuvé';
      case 'pending': return 'En attente';
      case 'under_review': return 'En révision';
      case 'rejected': return 'Rejeté';
      default: return status;
    }
  };

  const getRiskColor = (score: number) => {
    if (score <= 20) return 'bg-green-100 text-green-800';
    if (score <= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getRiskLabel = (score: number) => {
    if (score <= 20) return 'Faible';
    if (score <= 50) return 'Moyen';
    return 'Élevé';
  };

  const filteredMerchants = selectedStatus === 'all' 
    ? merchants 
    : merchants.filter(m => m.status === selectedStatus);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const totalMerchants = merchants.length;
  const approvedMerchants = merchants.filter(m => m.status === 'approved').length;
  const pendingMerchants = merchants.filter(m => m.status === 'pending').length;
  const avgCompletionRate = merchants.reduce((sum, m) => sum + m.completionRate, 0) / merchants.length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Nouveaux Marchands</h1>
              <p className="text-gray-600">Suivi des inscriptions et processus d'onboarding</p>
            </div>
            <div className="flex gap-3">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Inviter Marchand
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div className="mb-6">
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'Tous' },
              { key: 'pending', label: 'En attente' },
              { key: 'under_review', label: 'En révision' },
              { key: 'approved', label: 'Approuvés' },
              { key: 'rejected', label: 'Rejetés' }
            ].map(({ key, label }) => (
              <Button
                key={key}
                variant={selectedStatus === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedStatus(key)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Nouveaux Marchands</p>
                  <p className="text-2xl font-bold text-blue-600">{totalMerchants}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12 cette semaine
                  </p>
                </div>
                <Store className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approuvés</p>
                  <p className="text-2xl font-bold text-green-600">{approvedMerchants}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((approvedMerchants / totalMerchants) * 100)}% du total
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Attente</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingMerchants}</p>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Action requise
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taux Completion</p>
                  <p className="text-2xl font-bold text-purple-600">{Math.round(avgCompletionRate)}%</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +3% vs mois dernier
                  </p>
                </div>
                <Award className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Onboarding Funnel */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Entonnoir d'Onboarding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{metric.name}</span>
                      <span className="text-sm text-gray-600">
                        {metric.completed}/{metric.total} ({metric.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full"
                        style={{ width: `${metric.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Temps moyen: {metric.avgTime}h</span>
                      <span>Abandon: {metric.dropoffRate}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Geographic Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Distribution Géographique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {geoData.map((region, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{region.region}</span>
                      <span className="text-sm text-gray-600">{region.newMerchants}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Approuvés: </span>
                        <span className="font-medium text-green-600">{region.approved}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">En attente: </span>
                        <span className="font-medium text-yellow-600">{region.pending}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Croissance</span>
                      <span className="text-xs text-green-600">+{region.growth}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Merchants List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Store className="h-5 w-5 mr-2" />
              Liste des Marchands ({filteredMerchants.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMerchants.map((merchant) => (
                <div key={merchant.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{merchant.businessName}</h3>
                    <Badge className={getStatusColor(merchant.status)}>
                      {getStatusLabel(merchant.status)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">{merchant.name}</p>
                    <p className="text-sm text-gray-500">{merchant.category} • {merchant.location}</p>
                    <p className="text-xs text-gray-400">
                      Inscrit le {new Date(merchant.registrationDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progression</span>
                        <span>{merchant.onboardingStep}/{merchant.totalSteps}</span>
                      </div>
                      <Progress value={(merchant.onboardingStep / merchant.totalSteps) * 100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Complétion</span>
                        <span>{merchant.completionRate}%</span>
                      </div>
                      <Progress value={merchant.completionRate} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Revenus</p>
                        <p className="font-medium">{merchant.revenue.toLocaleString()}€</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Transactions</p>
                        <p className="font-medium">{merchant.transactions}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Risque:</span>
                        <Badge className={getRiskColor(merchant.riskScore)} size="sm">
                          {getRiskLabel(merchant.riskScore)}
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => setSelectedMerchant(merchant)}>
                        <Eye className="h-3 w-3 mr-1" />
                        Détails
                      </Button>
                    </div>
                    
                    {merchant.rating > 0 && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{merchant.rating}</span>
                        <span className="text-xs text-gray-500">({merchant.transactions} avis)</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Merchant Details Modal */}
        {selectedMerchant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{selectedMerchant.businessName}</h2>
                <Button variant="outline" size="sm" onClick={() => setSelectedMerchant(null)}>
                  Fermer
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Propriétaire</p>
                    <p className="font-medium">{selectedMerchant.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Statut</p>
                    <Badge className={getStatusColor(selectedMerchant.status)}>
                      {getStatusLabel(selectedMerchant.status)}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Catégorie</p>
                    <p className="font-medium">{selectedMerchant.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Localisation</p>
                    <p className="font-medium">{selectedMerchant.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Inscription</p>
                    <p className="font-medium">{new Date(selectedMerchant.registrationDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                
                {/* Additional detailed information would go here */}
                <div className="flex gap-3 pt-4">
                  <Button size="sm">Approuver</Button>
                  <Button size="sm" variant="outline">Demander Documents</Button>
                  <Button size="sm" variant="destructive">Rejeter</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
