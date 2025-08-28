'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingDown, 
  TrendingUp, 
  Users,
  AlertTriangle,
  Clock,
  Target,
  Download,
  Filter,
  UserX,
  ArrowDown,
  Calendar,
  Shield
} from 'lucide-react';

interface ChurnMetric {
  name: string;
  current: number;
  previous: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  risk: 'low' | 'medium' | 'high';
}

interface ChurnSegment {
  segment: string;
  totalUsers: number;
  churned: number;
  churnRate: number;
  avgLifetime: number;
  revenueImpact: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface ChurnReason {
  reason: string;
  percentage: number;
  users: number;
  impact: number;
  actionable: boolean;
}

interface AtRiskUser {
  id: string;
  name: string;
  email: string;
  riskScore: number;
  lastActivity: string;
  lifetime: number;
  revenue: number;
  predictedChurn: number;
}

export default function ChurnAnalysisPage() {
  const [churnMetrics, setChurnMetrics] = useState<ChurnMetric[]>([]);
  const [segments, setSegments] = useState<ChurnSegment[]>([]);
  const [reasons, setReasons] = useState<ChurnReason[]>([]);
  const [atRiskUsers, setAtRiskUsers] = useState<AtRiskUser[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation de récupération des données
    setTimeout(() => {
      setChurnMetrics([
        { name: 'Taux de Churn Global', current: 12.5, previous: 14.2, target: 10.0, trend: 'down', risk: 'medium' },
        { name: 'Churn Précoce (7j)', current: 8.3, previous: 9.1, target: 6.0, trend: 'down', risk: 'high' },
        { name: 'Churn Mensuel', current: 5.2, previous: 5.8, target: 4.0, trend: 'down', risk: 'medium' },
        { name: 'Churn Premium', current: 3.1, previous: 2.8, target: 2.0, trend: 'up', risk: 'low' },
        { name: 'Récupération Churn', current: 22.5, previous: 18.3, target: 25.0, trend: 'up', risk: 'low' },
        { name: 'Temps Avant Churn', current: 45, previous: 42, target: 60, trend: 'up', risk: 'medium' }
      ]);

      setSegments([
        { segment: 'Nouveaux Utilisateurs', totalUsers: 5240, churned: 890, churnRate: 17.0, avgLifetime: 15, revenueImpact: 45200, riskLevel: 'high' },
        { segment: 'Utilisateurs Actifs', totalUsers: 12650, churned: 1012, churnRate: 8.0, avgLifetime: 85, revenueImpact: 89600, riskLevel: 'medium' },
        { segment: 'Utilisateurs Premium', totalUsers: 3280, churned: 102, churnRate: 3.1, avgLifetime: 180, revenueImpact: 25600, riskLevel: 'low' },
        { segment: 'Utilisateurs Inactifs', totalUsers: 8490, churned: 2122, churnRate: 25.0, avgLifetime: 8, revenueImpact: 32800, riskLevel: 'high' },
        { segment: 'Utilisateurs Mobile', totalUsers: 18920, churned: 2081, churnRate: 11.0, avgLifetime: 65, revenueImpact: 125400, riskLevel: 'medium' },
        { segment: 'Utilisateurs Desktop', totalUsers: 6850, churned: 616, churnRate: 9.0, avgLifetime: 95, revenueImpact: 58200, riskLevel: 'medium' }
      ]);

      setReasons([
        { reason: 'Manque de fonctionnalités', percentage: 28.5, users: 1140, impact: 85600, actionable: true },
        { reason: 'Prix trop élevé', percentage: 22.3, users: 892, impact: 67200, actionable: true },
        { reason: 'Problèmes techniques', percentage: 18.7, users: 748, impact: 52400, actionable: true },
        { reason: 'Service client', percentage: 12.8, users: 512, impact: 35800, actionable: true },
        { reason: 'Concurrent meilleur', percentage: 9.2, users: 368, impact: 28400, actionable: false },
        { reason: 'Plus besoin du service', percentage: 8.5, users: 340, impact: 22600, actionable: false }
      ]);

      setAtRiskUsers([
        { id: '1', name: 'Sophie Moreau', email: 'sophie.moreau@email.com', riskScore: 85, lastActivity: '2024-06-10', lifetime: 120, revenue: 1250, predictedChurn: 7 },
        { id: '2', name: 'Youssef El Amrani', email: 'youssef.elamrani@email.com', riskScore: 78, lastActivity: '2024-06-08', lifetime: 85, revenue: 980, predictedChurn: 10 },
        { id: '3', name: 'Emma Lefevre', email: 'emma.lefevre@email.com', riskScore: 72, lastActivity: '2024-06-07', lifetime: 95, revenue: 1150, predictedChurn: 14 },
        { id: '4', name: 'Mehdi Bouazza', email: 'mehdi.bouazza@email.com', riskScore: 68, lastActivity: '2024-06-06', lifetime: 78, revenue: 850, predictedChurn: 18 },
        { id: '5', name: 'Camille Durand', email: 'camille.durand@email.com', riskScore: 65, lastActivity: '2024-06-05', lifetime: 110, revenue: 1380, predictedChurn: 21 }
      ]);

      setLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'high') return 'bg-red-100 text-red-800';
    if (risk === 'medium') return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'bg-red-100 text-red-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getProgressColor = (current: number, target: number) => {
    const ratio = current / target;
    if (ratio <= 1) return 'bg-green-500';
    if (ratio <= 1.5) return 'bg-yellow-500';
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analyse du Churn</h1>
              <p className="text-gray-600">Prédiction et prévention de l'attrition des utilisateurs</p>
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

        {/* Churn Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {churnMetrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                    <Badge className={getRiskColor(metric.risk)}>
                      {metric.risk}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-gray-900">
                      {metric.name.includes('Temps') ? `${metric.current}j` : `${metric.current}%`}
                    </p>
                    {getTrendIcon(metric.trend)}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Objectif: {metric.target}{metric.name.includes('Temps') ? 'j' : '%'}</span>
                      <span>{((metric.current / metric.target) * 100).toFixed(0)}%</span>
                    </div>
                    <Progress 
                      value={Math.min((metric.current / metric.target) * 100, 100)} 
                      className="h-2"
                    />
                  </div>

                  <p className="text-xs text-gray-500">
                    {metric.trend === 'down' ? '↓' : metric.trend === 'up' ? '↑' : '→'} 
                    {Math.abs(metric.current - metric.previous).toFixed(1)}
                    {metric.name.includes('Temps') ? 'j' : '%'} vs période précédente
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Churn by Segment */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Churn par Segment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Segment</th>
                    <th className="text-center py-3 px-2">Utilisateurs</th>
                    <th className="text-center py-3 px-2">Churned</th>
                    <th className="text-center py-3 px-2">Taux</th>
                    <th className="text-center py-3 px-2">Durée Vie Moy.</th>
                    <th className="text-center py-3 px-2">Impact Revenus</th>
                    <th className="text-center py-3 px-2">Risque</th>
                  </tr>
                </thead>
                <tbody>
                  {segments.map((segment, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium">{segment.segment}</td>
                      <td className="py-3 px-2 text-center">{segment.totalUsers.toLocaleString()}</td>
                      <td className="py-3 px-2 text-center">{segment.churned.toLocaleString()}</td>
                      <td className="py-3 px-2 text-center">
                        <Badge className={
                          segment.churnRate >= 20 ? 'bg-red-100 text-red-800' :
                          segment.churnRate >= 10 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }>
                          {segment.churnRate}%
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-center">{segment.avgLifetime}j</td>
                      <td className="py-3 px-2 text-center font-medium">
                        {segment.revenueImpact.toLocaleString()}€
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Badge className={getRiskColor(segment.riskLevel)}>
                          {segment.riskLevel}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Churn Reasons & At Risk Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Raisons du Churn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reasons.map((reason, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{reason.reason}</span>
                        {reason.actionable && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            Actionnable
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-600">{reason.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${reason.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{reason.users} utilisateurs</span>
                      <span>Impact: {reason.impact.toLocaleString()}€</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserX className="h-5 w-5 mr-2" />
                Utilisateurs à Risque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {atRiskUsers.map((user, index) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <Badge className={getRiskScoreColor(user.riskScore)}>
                          {user.riskScore}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{user.email}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-gray-500">Dernière activité</p>
                          <p className="font-medium">{user.lastActivity}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Revenus</p>
                          <p className="font-medium">{user.revenue}€</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Churn prédit dans {user.predictedChurn}j</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-red-500 h-1 rounded-full"
                            style={{ width: `${100 - user.predictedChurn * 3}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Recommandations d'Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg bg-red-50">
                <div className="flex items-center mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <p className="font-medium text-red-900">Urgence Élevée</p>
                </div>
                <p className="text-sm text-red-700 mb-3">
                  890 nouveaux utilisateurs à risque de churn précoce
                </p>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  Lancer campagne de rétention
                </Button>
              </div>

              <div className="p-4 border rounded-lg bg-yellow-50">
                <div className="flex items-center mb-3">
                  <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                  <p className="font-medium text-yellow-900">Action Préventive</p>
                </div>
                <p className="text-sm text-yellow-700 mb-3">
                  Améliorer l'onboarding pour réduire le churn à 7 jours
                </p>
                <Button size="sm" variant="outline" className="border-yellow-600 text-yellow-700">
                  Optimiser onboarding
                </Button>
              </div>

              <div className="p-4 border rounded-lg bg-blue-50">
                <div className="flex items-center mb-3">
                  <Target className="h-5 w-5 text-blue-600 mr-2" />
                  <p className="font-medium text-blue-900">Opportunité</p>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  Offres personnalisées pour récupérer 22.5% des churned
                </p>
                <Button size="sm" variant="outline" className="border-blue-600 text-blue-700">
                  Créer campagne win-back
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
