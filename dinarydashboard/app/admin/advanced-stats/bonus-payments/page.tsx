'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Gift, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Users,
  Calendar,
  Download,
  Filter,
  Star,
  Award,
  Percent,
  Target
} from 'lucide-react';

interface BonusMetric {
  name: string;
  amount: number;
  recipients: number;
  avgPerUser: number;
  trend: 'up' | 'down' | 'stable';
  growth: number;
}

interface BonusDistribution {
  category: string;
  amount: number;
  users: number;
  percentage: number;
  color: string;
}

interface BonusHistory {
  month: string;
  totalAmount: number;
  recipients: number;
  avgBonus: number;
  roi: number;
}

interface TopRecipient {
  id: string;
  name: string;
  email: string;
  totalBonus: number;
  bonusCount: number;
  lastBonus: string;
  performance: number;
}

export default function BonusPaymentsPage() {
  const [bonusMetrics, setBonusMetrics] = useState<BonusMetric[]>([]);
  const [distribution, setDistribution] = useState<BonusDistribution[]>([]);
  const [history, setHistory] = useState<BonusHistory[]>([]);
  const [topRecipients, setTopRecipients] = useState<TopRecipient[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation de récupération des données
    setTimeout(() => {
      setBonusMetrics([
        { name: 'Bonus Parrainage', amount: 125400, recipients: 1254, avgPerUser: 100, trend: 'up', growth: 15.2 },
        { name: 'Bonus Performance', amount: 89600, recipients: 448, avgPerUser: 200, trend: 'up', growth: 8.7 },
        { name: 'Bonus Fidélité', amount: 67200, recipients: 1344, avgPerUser: 50, trend: 'up', growth: 12.3 },
        { name: 'Bonus Événementiel', amount: 45800, recipients: 916, avgPerUser: 50, trend: 'down', growth: -5.4 },
        { name: 'Bonus Promotion', amount: 38500, recipients: 770, avgPerUser: 50, trend: 'stable', growth: 0.8 },
        { name: 'Bonus Premium', amount: 28700, recipients: 143, avgPerUser: 200, trend: 'up', growth: 22.1 }
      ]);

      setDistribution([
        { category: 'Parrainage', amount: 125400, users: 1254, percentage: 35.2, color: '#3B82F6' },
        { category: 'Performance', amount: 89600, users: 448, percentage: 25.1, color: '#10B981' },
        { category: 'Fidélité', amount: 67200, users: 1344, percentage: 18.9, color: '#F59E0B' },
        { category: 'Événementiel', amount: 45800, users: 916, percentage: 12.8, color: '#EF4444' },
        { category: 'Promotion', amount: 38500, users: 770, percentage: 10.8, color: '#8B5CF6' },
        { category: 'Premium', amount: 28700, users: 143, percentage: 8.1, color: '#F97316' }
      ]);

      setHistory([
        { month: 'Jan 2024', totalAmount: 280500, recipients: 2805, avgBonus: 100, roi: 3.2 },
        { month: 'Fév 2024', totalAmount: 298400, recipients: 2984, avgBonus: 100, roi: 3.4 },
        { month: 'Mar 2024', totalAmount: 321800, recipients: 3218, avgBonus: 100, roi: 3.8 },
        { month: 'Avr 2024', totalAmount: 345600, recipients: 3456, avgBonus: 100, roi: 4.1 },
        { month: 'Mai 2024', totalAmount: 362200, recipients: 3622, avgBonus: 100, roi: 4.3 },
        { month: 'Juin 2024', totalAmount: 395200, recipients: 3952, avgBonus: 100, roi: 4.6 }
      ]);

      setTopRecipients([
        { id: '1', name: 'Marie Dubois', email: 'marie.dubois@email.com', totalBonus: 2850, bonusCount: 15, lastBonus: '2024-06-15', performance: 95 },
        { id: '2', name: 'Ahmed Ben Ali', email: 'ahmed.benali@email.com', totalBonus: 2640, bonusCount: 12, lastBonus: '2024-06-14', performance: 92 },
        { id: '3', name: 'Sophie Martin', email: 'sophie.martin@email.com', totalBonus: 2380, bonusCount: 14, lastBonus: '2024-06-13', performance: 88 },
        { id: '4', name: 'Karim Mansouri', email: 'karim.mansouri@email.com', totalBonus: 2150, bonusCount: 11, lastBonus: '2024-06-12', performance: 85 },
        { id: '5', name: 'Fatima Zahra', email: 'fatima.zahra@email.com', totalBonus: 1980, bonusCount: 13, lastBonus: '2024-06-11', performance: 82 }
      ]);

      setLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
  };

  const getTrendColor = (trend: string, growth: number) => {
    if (trend === 'up' || growth > 0) return 'text-green-600';
    if (trend === 'down' || growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'bg-green-100 text-green-800';
    if (performance >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
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

  const totalAmount = bonusMetrics.reduce((sum, metric) => sum + metric.amount, 0);
  const totalRecipients = bonusMetrics.reduce((sum, metric) => sum + metric.recipients, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analyse des Paiements Bonus</h1>
              <p className="text-gray-600">Suivi des récompenses et incitations utilisateurs</p>
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

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bonus Distribués</p>
                  <p className="text-2xl font-bold text-blue-600">{totalAmount.toLocaleString()}€</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12.3% vs mois dernier
                  </p>
                </div>
                <Gift className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bénéficiaires Uniques</p>
                  <p className="text-2xl font-bold text-green-600">{totalRecipients.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8.7% vs mois dernier
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bonus Moyen</p>
                  <p className="text-2xl font-bold text-purple-600">{Math.round(totalAmount / totalRecipients)}€</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +3.2% vs mois dernier
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ROI Moyen</p>
                  <p className="text-2xl font-bold text-orange-600">4.6x</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +0.3x vs mois dernier
                  </p>
                </div>
                <Target className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bonus Metrics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Types de Bonus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bonusMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{metric.name}</p>
                        {getTrendIcon(metric.trend)}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Montant</p>
                          <p className="font-medium">{metric.amount.toLocaleString()}€</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Utilisateurs</p>
                          <p className="font-medium">{metric.recipients}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Moyenne</p>
                          <p className="font-medium">{metric.avgPerUser}€</p>
                        </div>
                      </div>
                      <p className={`text-xs mt-2 ${getTrendColor(metric.trend, metric.growth)}`}>
                        {metric.growth > 0 ? '+' : ''}{metric.growth}% vs période précédente
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Percent className="h-5 w-5 mr-2" />
                Distribution des Bonus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {distribution.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.category}</span>
                      <span className="text-sm text-gray-600">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${item.percentage}%`,
                          backgroundColor: item.color
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{item.amount.toLocaleString()}€</span>
                      <span>{item.users} utilisateurs</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Historical Trend */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Évolution Historique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Période</th>
                    <th className="text-center py-3 px-2">Montant Total</th>
                    <th className="text-center py-3 px-2">Bénéficiaires</th>
                    <th className="text-center py-3 px-2">Bonus Moyen</th>
                    <th className="text-center py-3 px-2">ROI</th>
                    <th className="text-center py-3 px-2">Tendance</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium">{item.month}</td>
                      <td className="py-3 px-2 text-center">{item.totalAmount.toLocaleString()}€</td>
                      <td className="py-3 px-2 text-center">{item.recipients.toLocaleString()}</td>
                      <td className="py-3 px-2 text-center">{item.avgBonus}€</td>
                      <td className="py-3 px-2 text-center">
                        <Badge className="bg-green-100 text-green-800">
                          {item.roi}x
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${Math.min((item.roi / 5) * 100, 100)}%` }}
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

        {/* Top Recipients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Top Bénéficiaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRecipients.map((recipient, index) => (
                <div key={recipient.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{recipient.name}</p>
                      <p className="text-sm text-gray-500">{recipient.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">{recipient.totalBonus}€</p>
                      <p className="text-xs text-gray-500">Total</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-lg font-medium">{recipient.bonusCount}</p>
                      <p className="text-xs text-gray-500">Bonus</p>
                    </div>
                    
                    <div className="text-center">
                      <Badge className={getPerformanceColor(recipient.performance)}>
                        {recipient.performance}%
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">Performance</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">{recipient.lastBonus}</p>
                      <p className="text-xs text-gray-500">Dernier bonus</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
