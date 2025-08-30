'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Flame, 
  TrendingUp, 
  MapPin,
  Clock,
  Users,
  Zap,
  Download,
  Filter,
  AlertTriangle,
  Star,
  Target,
  Timer
} from 'lucide-react';

interface HotZone {
  id: string;
  name: string;
  location: string;
  intensity: number;
  users: number;
  transactions: number;
  revenue: number;
  growth: number;
  peakHours: string;
  duration: number;
  trend: 'up' | 'down' | 'stable';
  risk: 'low' | 'medium' | 'high';
}

interface TimeSlot {
  hour: string;
  activity: number;
  zones: number;
  peak: boolean;
}

interface ActivityAlert {
  id: string;
  zone: string;
  type: 'spike' | 'drop' | 'anomaly';
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: string;
  actions: string[];
}

export default function HotZonesPage() {
  const [hotZones, setHotZones] = useState<HotZone[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [alerts, setAlerts] = useState<ActivityAlert[]>([]);
  const [selectedZone, setSelectedZone] = useState<HotZone | null>(null);
  const [timeRange, setTimeRange] = useState<string>('24h');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation de récupération des données
    setTimeout(() => {
      setHotZones([
        { 
          id: '1', 
          name: 'Centre-ville Alger', 
          location: 'Alger Centre',
          intensity: 95, 
          users: 8420, 
          transactions: 28650, 
          revenue: 425800, 
          growth: 18.5, 
          peakHours: '14h-16h', 
          duration: 3.2,
          trend: 'up',
          risk: 'low'
        },
        { 
          id: '2', 
          name: 'Quartier Affaires Oran', 
          location: 'Oran Business District',
          intensity: 88, 
          users: 6250, 
          transactions: 21450, 
          revenue: 318600, 
          growth: 15.2, 
          peakHours: '10h-12h', 
          duration: 2.8,
          trend: 'up',
          risk: 'low'
        },
        { 
          id: '3', 
          name: 'Zone Universitaire Constantine', 
          location: 'Constantine Université',
          intensity: 82, 
          users: 5890, 
          transactions: 19850, 
          revenue: 289400, 
          growth: 22.1, 
          peakHours: '18h-20h', 
          duration: 4.5,
          trend: 'up',
          risk: 'medium'
        },
        { 
          id: '4', 
          name: 'Marché Central Sétif', 
          location: 'Sétif Centre Commercial',
          intensity: 75, 
          users: 4320, 
          transactions: 15680, 
          revenue: 235200, 
          growth: 8.7, 
          peakHours: '16h-18h', 
          duration: 2.1,
          trend: 'stable',
          risk: 'low'
        },
        { 
          id: '5', 
          name: 'Port Annaba', 
          location: 'Zone Portuaire Annaba',
          intensity: 68, 
          users: 3650, 
          transactions: 12890, 
          revenue: 198500, 
          growth: 12.3, 
          peakHours: '08h-10h', 
          duration: 1.8,
          trend: 'up',
          risk: 'medium'
        },
        { 
          id: '6', 
          name: 'Zone Industrielle Blida', 
          location: 'Blida Industrial',
          intensity: 62, 
          users: 2980, 
          transactions: 10450, 
          revenue: 156800, 
          growth: -2.4, 
          peakHours: '12h-14h', 
          duration: 1.5,
          trend: 'down',
          risk: 'high'
        }
      ]);

      setTimeSlots([
        { hour: '00h', activity: 15, zones: 2, peak: false },
        { hour: '02h', activity: 8, zones: 1, peak: false },
        { hour: '04h', activity: 5, zones: 0, peak: false },
        { hour: '06h', activity: 25, zones: 3, peak: false },
        { hour: '08h', activity: 65, zones: 8, peak: true },
        { hour: '10h', activity: 85, zones: 12, peak: true },
        { hour: '12h', activity: 92, zones: 15, peak: true },
        { hour: '14h', activity: 98, zones: 18, peak: true },
        { hour: '16h', activity: 89, zones: 14, peak: true },
        { hour: '18h', activity: 95, zones: 16, peak: true },
        { hour: '20h', activity: 75, zones: 11, peak: false },
        { hour: '22h', activity: 45, zones: 6, peak: false }
      ]);

      setAlerts([
        {
          id: '1',
          zone: 'Centre-ville Alger',
          type: 'spike',
          severity: 'high',
          message: 'Pic d\'activité inhabituel détecté (+180% en 30min)',
          timestamp: '2024-06-15 14:23',
          actions: ['Vérifier capacité serveur', 'Alerter équipe support', 'Monitorer performances']
        },
        {
          id: '2',
          zone: 'Zone Industrielle Blida',
          type: 'drop',
          severity: 'medium',
          message: 'Chute significative d\'activité (-45% vs moyenne)',
          timestamp: '2024-06-15 13:15',
          actions: ['Analyser cause technique', 'Contacter partenaires locaux', 'Review marketing local']
        },
        {
          id: '3',
          zone: 'Port Annaba',
          type: 'anomaly',
          severity: 'low',
          message: 'Pattern d\'utilisation inhabituel détecté',
          timestamp: '2024-06-15 12:45',
          actions: ['Surveillance renforcée', 'Analyse comportementale']
        }
      ]);

      setLoading(false);
    }, 1000);
  }, [timeRange]);

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 90) return 'bg-red-500';
    if (intensity >= 75) return 'bg-orange-500';
    if (intensity >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
    return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'high') return 'bg-red-100 text-red-800';
    if (risk === 'medium') return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getSeverityColor = (severity: string) => {
    if (severity === 'high') return 'bg-red-100 text-red-800';
    if (severity === 'medium') return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
  };

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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Zones d'Activité Intense</h1>
              <p className="text-gray-600">Détection et analyse des pics d'activité géographiques</p>
            </div>
            <div className="flex gap-3">
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

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex gap-2">
            {['1h', '6h', '24h', '7d', '30d'].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range}
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
                  <p className="text-sm font-medium text-gray-600">Zones Actives</p>
                  <p className="text-2xl font-bold text-red-600">18</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +3 vs hier
                  </p>
                </div>
                <Flame className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Intensité Moyenne</p>
                  <p className="text-2xl font-bold text-orange-600">78%</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5% vs hier
                  </p>
                </div>
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Durée Moyenne Pic</p>
                  <p className="text-2xl font-bold text-blue-600">2.8h</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +0.3h vs hier
                  </p>
                </div>
                <Timer className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Alertes Actives</p>
                  <p className="text-2xl font-bold text-purple-600">3</p>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    1 haute priorité
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Activity Timeline */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Activité par Heure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeSlots.map((slot, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium text-gray-600">
                      {slot.hour}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">Activité: {slot.activity}%</span>
                        <span className="text-sm text-gray-500">{slot.zones} zones</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            slot.peak ? 'bg-red-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${slot.activity}%` }}
                        ></div>
                      </div>
                    </div>
                    {slot.peak && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-xs text-yellow-600 ml-1">Pic</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Alertes Actives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      <span className="text-xs text-gray-500">{alert.timestamp}</span>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-1">{alert.zone}</h4>
                    <p className="text-sm text-gray-600 mb-3">{alert.message}</p>
                    
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-700">Actions recommandées:</p>
                      {alert.actions.map((action, idx) => (
                        <p key={idx} className="text-xs text-gray-600">• {action}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hot Zones List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Flame className="h-5 w-5 mr-2" />
              Zones d'Activité Intense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hotZones.map((zone) => (
                <div key={zone.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                     onClick={() => setSelectedZone(zone)}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{zone.name}</h3>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(zone.trend)}
                      <Badge className={getRiskColor(zone.risk)}>
                        {zone.risk}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{zone.location}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Intensité</span>
                        <span className="font-medium">{zone.intensity}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getIntensityColor(zone.intensity)}`}
                          style={{ width: `${zone.intensity}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Utilisateurs</p>
                        <p className="font-medium">{zone.users.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Revenus</p>
                        <p className="font-medium">{zone.revenue.toLocaleString()}€</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Pic d'activité</p>
                        <p className="font-medium">{zone.peakHours}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Durée</p>
                        <p className="font-medium">{zone.duration}h</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-gray-500">Croissance</span>
                      <span className={`text-sm font-medium ${
                        zone.growth > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {zone.growth > 0 ? '+' : ''}{zone.growth}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Zone Details Modal/Panel would go here */}
        {selectedZone && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{selectedZone.name}</h2>
                <Button variant="outline" size="sm" onClick={() => setSelectedZone(null)}>
                  Fermer
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Localisation</p>
                    <p className="font-medium">{selectedZone.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Intensité</p>
                    <p className="font-medium">{selectedZone.intensity}%</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Utilisateurs</p>
                    <p className="font-medium">{selectedZone.users.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Transactions</p>
                    <p className="font-medium">{selectedZone.transactions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Revenus</p>
                    <p className="font-medium">{selectedZone.revenue.toLocaleString()}€</p>
                  </div>
                </div>
                
                {/* Additional detailed analytics would go here */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
