'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Users,
  ShoppingCart,
  CreditCard,
  Download,
  Filter,
  Zap,
  ArrowRight,
  Timer
} from 'lucide-react';

interface ConversionFunnel {
  stage: string;
  users: number;
  conversionRate: number;
  dropOffRate: number;
  icon: React.ReactNode;
}

interface ConversionMetric {
  name: string;
  current: number;
  previous: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
}

interface ConversionSegment {
  segment: string;
  users: number;
  conversions: number;
  rate: number;
  revenue: number;
}

export default function ConversionAnalysisPage() {
  const [funnelData, setFunnelData] = useState<ConversionFunnel[]>([]);
  const [metrics, setMetrics] = useState<ConversionMetric[]>([]);
  const [segments, setSegments] = useState<ConversionSegment[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation de récupération des données
    setTimeout(() => {
      setFunnelData([
        { 
          stage: 'Visiteurs', 
          users: 50000, 
          conversionRate: 100, 
          dropOffRate: 0,
          icon: <Users className="h-5 w-5" />
        },
        { 
          stage: 'Inscription', 
          users: 12500, 
          conversionRate: 25, 
          dropOffRate: 75,
          icon: <Target className="h-5 w-5" />
        },
        { 
          stage: 'Première Transaction', 
          users: 6250, 
          conversionRate: 50, 
          dropOffRate: 50,
          icon: <CreditCard className="h-5 w-5" />
        },
        { 
          stage: 'Achat Récurrent', 
          users: 3750, 
          conversionRate: 60, 
          dropOffRate: 40,
          icon: <ShoppingCart className="h-5 w-5" />
        },
        { 
          stage: 'Utilisateur Fidèle', 
          users: 2250, 
          conversionRate: 60, 
          dropOffRate: 40,
          icon: <Zap className="h-5 w-5" />
        }
      ]);

      setMetrics([
        { name: 'Taux de Conversion Global', current: 4.5, previous: 3.8, target: 5.0, trend: 'up' },
        { name: 'Conversion Inscription', current: 25.0, previous: 22.5, target: 30.0, trend: 'up' },
        { name: 'Première Transaction', current: 50.0, previous: 48.2, target: 55.0, trend: 'up' },
        { name: 'Rétention 30j', current: 68.5, previous: 65.2, target: 70.0, trend: 'up' },
        { name: 'Temps Moyen Conversion', current: 3.2, previous: 3.8, target: 2.5, trend: 'up' },
        { name: 'Valeur Moyenne Panier', current: 85.50, previous: 82.30, target: 90.0, trend: 'up' }
      ]);

      setSegments([
        { segment: 'Nouveaux Utilisateurs', users: 8500, conversions: 1275, rate: 15.0, revenue: 108750 },
        { segment: 'Utilisateurs Récurrents', users: 6200, conversions: 2790, rate: 45.0, revenue: 238950 },
        { segment: 'Mobile', users: 9800, conversions: 1960, rate: 20.0, revenue: 167800 },
        { segment: 'Desktop', users: 4900, conversions: 1470, rate: 30.0, revenue: 125900 },
        { segment: 'Recommandations', users: 2100, conversions: 735, rate: 35.0, revenue: 62850 },
        { segment: 'Marketing Direct', users: 3400, conversions: 816, rate: 24.0, revenue: 69700 }
      ]);

      setLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="h-3 w-3 text-red-600" />;
    return <div className="h-3 w-3 bg-gray-400 rounded-full" />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return 'text-green-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  const getConversionColor = (rate: number) => {
    if (rate >= 30) return 'bg-green-500';
    if (rate >= 20) return 'bg-yellow-500';
    return 'bg-red-500';
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analyse des Conversions</h1>
              <p className="text-gray-600">Optimisation du parcours utilisateur et taux de conversion</p>
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

        {/* Period Selector */}
        <div className="mb-6">
          <div className="flex gap-2">
            {['7d', '30d', '90d', '6m', '1y'].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>

        {/* Conversion Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                    {getTrendIcon(metric.trend)}
                  </div>
                  
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {metric.name.includes('Temps') ? `${metric.current}j` : 
                       metric.name.includes('Valeur') ? `${metric.current}€` : 
                       `${metric.current}%`}
                    </p>
                    <div className="flex items-center mt-2">
                      <p className={`text-xs ${getTrendColor(metric.trend)}`}>
                        {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '-' : ''}
                        {Math.abs(metric.current - metric.previous).toFixed(1)}
                        {metric.name.includes('Temps') ? 'j' : 
                         metric.name.includes('Valeur') ? '€' : '%'} vs précédent
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Objectif: {metric.target}
                        {metric.name.includes('Temps') ? 'j' : 
                         metric.name.includes('Valeur') ? '€' : '%'}
                      </span>
                      <span>{((metric.current / metric.target) * 100).toFixed(0)}%</span>
                    </div>
                    <Progress 
                      value={(metric.current / metric.target) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Conversion Funnel */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Entonnoir de Conversion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {funnelData.map((stage, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {stage.icon}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{stage.stage}</p>
                        <p className="text-sm text-gray-500">{stage.users.toLocaleString()} utilisateurs</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{stage.conversionRate}%</p>
                        <p className="text-xs text-gray-500">Conversion</p>
                      </div>
                      
                      {stage.dropOffRate > 0 && (
                        <div className="text-center">
                          <p className="text-lg font-medium text-red-600">-{stage.dropOffRate}%</p>
                          <p className="text-xs text-gray-500">Abandon</p>
                        </div>
                      )}
                      
                      {index < funnelData.length - 1 && (
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  {/* Progress bar between stages */}
                  {index < funnelData.length - 1 && (
                    <div className="mt-2 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getConversionColor(funnelData[index + 1].conversionRate)}`}
                          style={{ width: `${funnelData[index + 1].conversionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Segment Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Analyse par Segment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Segment</th>
                    <th className="text-center py-3 px-2">Utilisateurs</th>
                    <th className="text-center py-3 px-2">Conversions</th>
                    <th className="text-center py-3 px-2">Taux</th>
                    <th className="text-center py-3 px-2">Revenus</th>
                    <th className="text-center py-3 px-2">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {segments.map((segment, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium">{segment.segment}</td>
                      <td className="py-3 px-2 text-center">{segment.users.toLocaleString()}</td>
                      <td className="py-3 px-2 text-center">{segment.conversions.toLocaleString()}</td>
                      <td className="py-3 px-2 text-center">
                        <Badge className={
                          segment.rate >= 30 ? 'bg-green-100 text-green-800' :
                          segment.rate >= 20 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {segment.rate}%
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-center font-medium">
                        {segment.revenue.toLocaleString()}€
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getConversionColor(segment.rate)}`}
                            style={{ width: `${Math.min(segment.rate * 2, 100)}%` }}
                          ></div>
                        </div>
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
