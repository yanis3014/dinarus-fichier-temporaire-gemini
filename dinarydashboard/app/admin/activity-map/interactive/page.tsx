'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Users, 
  TrendingUp, 
  Activity,
  Download,
  Filter,
  RefreshCw,
  Zap,
  Target,
  Globe
} from 'lucide-react';

interface RegionData {
  id: string;
  name: string;
  users: number;
  transactions: number;
  revenue: number;
  growth: number;
  activity: 'high' | 'medium' | 'low';
  coordinates: [number, number];
}

interface ActivityHeatmap {
  region: string;
  intensity: number;
  color: string;
  users: number;
  transactions: number;
}

export default function InteractiveMapPage() {
  const [regionsData, setRegionsData] = useState<RegionData[]>([]);
  const [heatmapData, setHeatmapData] = useState<ActivityHeatmap[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [mapView, setMapView] = useState<'activity' | 'revenue' | 'growth'>('activity');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation de récupération des données
    setTimeout(() => {
      setRegionsData([
        { id: 'alger', name: 'Alger', users: 15420, transactions: 48650, revenue: 892400, growth: 12.5, activity: 'high', coordinates: [36.7538, 3.0588] },
        { id: 'oran', name: 'Oran', users: 8960, transactions: 28420, revenue: 521800, growth: 8.3, activity: 'high', coordinates: [35.6976, -0.6337] },
        { id: 'constantine', name: 'Constantine', users: 6780, transactions: 21340, revenue: 389600, growth: 15.2, activity: 'medium', coordinates: [36.3650, 6.6147] },
        { id: 'setif', name: 'Sétif', users: 4320, transactions: 13680, revenue: 245800, growth: 6.7, activity: 'medium', coordinates: [36.1919, 5.4131] },
        { id: 'annaba', name: 'Annaba', users: 3890, transactions: 12460, revenue: 218900, growth: 9.4, activity: 'medium', coordinates: [36.9000, 7.7667] },
        { id: 'blida', name: 'Blida', users: 3560, transactions: 11280, revenue: 198500, growth: 11.8, activity: 'medium', coordinates: [36.4711, 2.8277] },
        { id: 'batna', name: 'Batna', users: 2980, transactions: 9450, revenue: 165400, growth: 4.2, activity: 'low', coordinates: [35.5559, 6.1740] },
        { id: 'tlemcen', name: 'Tlemcen', users: 2654, transactions: 8420, revenue: 148200, growth: 7.1, activity: 'low', coordinates: [34.8914, -1.3150] }
      ]);

      setHeatmapData([
        { region: 'Alger', intensity: 95, color: '#DC2626', users: 15420, transactions: 48650 },
        { region: 'Oran', intensity: 75, color: '#EA580C', users: 8960, transactions: 28420 },
        { region: 'Constantine', intensity: 60, color: '#F59E0B', users: 6780, transactions: 21340 },
        { region: 'Sétif', intensity: 45, color: '#EAB308', users: 4320, transactions: 13680 },
        { region: 'Annaba', intensity: 40, color: '#84CC16', users: 3890, transactions: 12460 },
        { region: 'Blida', intensity: 35, color: '#22C55E', users: 3560, transactions: 11280 },
        { region: 'Batna', intensity: 25, color: '#10B981', users: 2980, transactions: 9450 },
        { region: 'Tlemcen', intensity: 20, color: '#06B6D4', users: 2654, transactions: 8420 }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getActivityColor = (activity: string) => {
    if (activity === 'high') return 'bg-red-100 text-red-800';
    if (activity === 'medium') return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 80) return '#DC2626';
    if (intensity >= 60) return '#EA580C';
    if (intensity >= 40) return '#F59E0B';
    if (intensity >= 20) return '#EAB308';
    return '#22C55E';
  };

  const totalUsers = regionsData.reduce((sum, region) => sum + region.users, 0);
  const totalTransactions = regionsData.reduce((sum, region) => sum + region.transactions, 0);
  const totalRevenue = regionsData.reduce((sum, region) => sum + region.revenue, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Carte Interactive des Activités</h1>
              <p className="text-gray-600">Visualisation géographique en temps réel de l'activité utilisateur</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
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

        {/* View Controls */}
        <div className="mb-6">
          <div className="flex gap-2">
            {[
              { key: 'activity', label: 'Activité', icon: Activity },
              { key: 'revenue', label: 'Revenus', icon: TrendingUp },
              { key: 'growth', label: 'Croissance', icon: Target }
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={mapView === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMapView(key as any)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilisateurs Total</p>
                  <p className="text-2xl font-bold text-blue-600">{totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8.2% ce mois
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Transactions</p>
                  <p className="text-2xl font-bold text-green-600">{totalTransactions.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12.5% ce mois
                  </p>
                </div>
                <Zap className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenus Total</p>
                  <p className="text-2xl font-bold text-purple-600">{totalRevenue.toLocaleString()}€</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +15.3% ce mois
                  </p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Régions Actives</p>
                  <p className="text-2xl font-bold text-orange-600">48</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +3 nouvelles
                  </p>
                </div>
                <Globe className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Carte d'Activité - Algérie
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-blue-50 rounded-lg p-8 h-96">
                  {/* SVG Map of Algeria with activity indicators */}
                  <svg viewBox="0 0 800 600" className="w-full h-full">
                    {/* Algeria outline - simplified */}
                    <path
                      d="M100 100 L700 100 L700 500 L100 500 Z"
                      fill="#E5E7EB"
                      stroke="#9CA3AF"
                      strokeWidth="2"
                    />
                    
                    {/* Activity Points */}
                    {regionsData.map((region, index) => {
                      const x = 150 + (index * 80);
                      const y = 150 + (index % 3) * 100;
                      const size = Math.max(8, (region.users / 1000) * 2);
                      
                      return (
                        <g key={region.id}>
                          <circle
                            cx={x}
                            cy={y}
                            r={size}
                            fill={getIntensityColor(heatmapData.find(h => h.region === region.name)?.intensity || 0)}
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setSelectedRegion(region)}
                          />
                          <text
                            x={x}
                            y={y + size + 15}
                            textAnchor="middle"
                            className="text-xs font-medium fill-gray-700"
                          >
                            {region.name}
                          </text>
                          <text
                            x={x}
                            y={y + size + 28}
                            textAnchor="middle"
                            className="text-xs fill-gray-500"
                          >
                            {region.users.toLocaleString()}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                  
                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md">
                    <p className="text-xs font-medium text-gray-700 mb-2">Intensité d'activité</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-xs text-gray-600">Faible</span>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-xs text-gray-600">Moyenne</span>
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-xs text-gray-600">Élevée</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Region Details */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  {selectedRegion ? `Détails - ${selectedRegion.name}` : 'Sélectionnez une région'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedRegion ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Utilisateurs</p>
                        <p className="text-lg font-bold text-blue-600">{selectedRegion.users.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Transactions</p>
                        <p className="text-lg font-bold text-green-600">{selectedRegion.transactions.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Revenus</p>
                        <p className="text-lg font-bold text-purple-600">{selectedRegion.revenue.toLocaleString()}€</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Croissance</p>
                        <p className="text-lg font-bold text-orange-600">+{selectedRegion.growth}%</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Niveau d'activité</p>
                      <Badge className={getActivityColor(selectedRegion.activity)}>
                        {selectedRegion.activity === 'high' ? 'Élevé' : 
                         selectedRegion.activity === 'medium' ? 'Moyen' : 'Faible'}
                      </Badge>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-500 mb-2">Métriques clés</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Tx par utilisateur</span>
                          <span className="font-medium">{Math.round(selectedRegion.transactions / selectedRegion.users)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Revenu par utilisateur</span>
                          <span className="font-medium">{Math.round(selectedRegion.revenue / selectedRegion.users)}€</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Valeur moyenne tx</span>
                          <span className="font-medium">{Math.round(selectedRegion.revenue / selectedRegion.transactions)}€</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Cliquez sur une région de la carte pour voir les détails</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Regional Performance Table */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Performance par Région
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Région</th>
                    <th className="text-center py-3 px-2">Utilisateurs</th>
                    <th className="text-center py-3 px-2">Transactions</th>
                    <th className="text-center py-3 px-2">Revenus</th>
                    <th className="text-center py-3 px-2">Croissance</th>
                    <th className="text-center py-3 px-2">Activité</th>
                    <th className="text-center py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {regionsData.map((region, index) => (
                    <tr key={region.id} className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedRegion(region)}>
                      <td className="py-3 px-2 font-medium">{region.name}</td>
                      <td className="py-3 px-2 text-center">{region.users.toLocaleString()}</td>
                      <td className="py-3 px-2 text-center">{region.transactions.toLocaleString()}</td>
                      <td className="py-3 px-2 text-center">{region.revenue.toLocaleString()}€</td>
                      <td className="py-3 px-2 text-center">
                        <div className="flex items-center justify-center">
                          <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                          <span className="text-green-600">+{region.growth}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Badge className={getActivityColor(region.activity)}>
                          {region.activity === 'high' ? 'Élevé' : 
                           region.activity === 'medium' ? 'Moyen' : 'Faible'}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Button size="sm" variant="outline">
                          Détails
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
