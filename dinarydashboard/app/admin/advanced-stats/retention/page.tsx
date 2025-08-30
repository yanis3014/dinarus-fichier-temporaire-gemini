'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Clock,
  UserCheck
} from 'lucide-react';

interface RetentionData {
  period: string;
  newUsers: number;
  retained: number;
  retentionRate: number;
  churnRate: number;
  avgLifetime: number;
}

interface RetentionCohort {
  cohort: string;
  users: number;
  day1: number;
  day7: number;
  day30: number;
  day90: number;
  day365: number;
}

export default function RetentionAnalysisPage() {
  const [retentionData, setRetentionData] = useState<RetentionData[]>([]);
  const [cohortData, setCohortData] = useState<RetentionCohort[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation de récupération des données
    setTimeout(() => {
      setRetentionData([
        { period: 'Janvier 2024', newUsers: 1250, retained: 875, retentionRate: 70, churnRate: 30, avgLifetime: 180 },
        { period: 'Février 2024', newUsers: 1420, retained: 994, retentionRate: 70, churnRate: 30, avgLifetime: 175 },
        { period: 'Mars 2024', newUsers: 1680, retained: 1176, retentionRate: 70, churnRate: 30, avgLifetime: 185 },
        { period: 'Avril 2024', newUsers: 1520, retained: 1140, retentionRate: 75, churnRate: 25, avgLifetime: 195 },
        { period: 'Mai 2024', newUsers: 1890, retained: 1512, retentionRate: 80, churnRate: 20, avgLifetime: 210 },
        { period: 'Juin 2024', newUsers: 2100, retained: 1785, retentionRate: 85, churnRate: 15, avgLifetime: 225 }
      ]);

      setCohortData([
        { cohort: 'Jan 2024', users: 1250, day1: 95, day7: 78, day30: 70, day90: 55, day365: 45 },
        { cohort: 'Fév 2024', users: 1420, day1: 94, day7: 76, day30: 68, day90: 52, day365: 42 },
        { cohort: 'Mar 2024', users: 1680, day1: 96, day7: 80, day30: 72, day90: 58, day365: 48 },
        { cohort: 'Avr 2024', users: 1520, day1: 97, day7: 82, day30: 75, day90: 62, day365: 52 },
        { cohort: 'Mai 2024', users: 1890, day1: 98, day7: 85, day30: 80, day90: 68, day365: 58 },
        { cohort: 'Juin 2024', users: 2100, day1: 99, day7: 87, day30: 85, day90: 72, day365: 65 }
      ]);

      setLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  const getRetentionColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRetentionBadge = (rate: number) => {
    if (rate >= 80) return 'bg-green-100 text-green-800';
    if (rate >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getCohortColor = (rate: number) => {
    const opacity = Math.max(0.2, rate / 100);
    return `rgba(59, 130, 246, ${opacity})`;
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analyse de Rétention</h1>
              <p className="text-gray-600">Suivi de la fidélisation et du cycle de vie des utilisateurs</p>
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

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taux de Rétention Moyen</p>
                  <p className="text-2xl font-bold text-green-600">75.5%</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5.2% vs mois dernier
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taux de Churn</p>
                  <p className="text-2xl font-bold text-red-600">22.8%</p>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    -3.1% vs mois dernier
                  </p>
                </div>
                <Users className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Durée de Vie Moyenne</p>
                  <p className="text-2xl font-bold text-blue-600">198 jours</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12 jours vs mois dernier
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Nouveaux Utilisateurs</p>
                  <p className="text-2xl font-bold text-purple-600">2,100</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +18.2% vs mois dernier
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Retention Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Évolution de la Rétention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {retentionData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.period}</p>
                      <p className="text-sm text-gray-500">{item.newUsers} nouveaux utilisateurs</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getRetentionBadge(item.retentionRate)}>
                        {item.retentionRate}%
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">{item.retained} retenus</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Distribution de la Rétention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Rétention Excellente (80%+)</span>
                    <span>35%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Rétention Bonne (60-79%)</span>
                    <span>42%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Rétention Faible (&lt;60%)</span>
                    <span>23%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cohort Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Analyse par Cohorte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Cohorte</th>
                    <th className="text-center py-3 px-2">Utilisateurs</th>
                    <th className="text-center py-3 px-2">Jour 1</th>
                    <th className="text-center py-3 px-2">Jour 7</th>
                    <th className="text-center py-3 px-2">Jour 30</th>
                    <th className="text-center py-3 px-2">Jour 90</th>
                    <th className="text-center py-3 px-2">Jour 365</th>
                  </tr>
                </thead>
                <tbody>
                  {cohortData.map((cohort, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-2 font-medium">{cohort.cohort}</td>
                      <td className="py-3 px-2 text-center">{cohort.users.toLocaleString()}</td>
                      <td className="py-3 px-2 text-center">
                        <div 
                          className="rounded px-2 py-1 text-xs font-medium text-white"
                          style={{ backgroundColor: getCohortColor(cohort.day1) }}
                        >
                          {cohort.day1}%
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div 
                          className="rounded px-2 py-1 text-xs font-medium text-white"
                          style={{ backgroundColor: getCohortColor(cohort.day7) }}
                        >
                          {cohort.day7}%
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div 
                          className="rounded px-2 py-1 text-xs font-medium text-white"
                          style={{ backgroundColor: getCohortColor(cohort.day30) }}
                        >
                          {cohort.day30}%
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div 
                          className="rounded px-2 py-1 text-xs font-medium text-white"
                          style={{ backgroundColor: getCohortColor(cohort.day90) }}
                        >
                          {cohort.day90}%
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div 
                          className="rounded px-2 py-1 text-xs font-medium text-white"
                          style={{ backgroundColor: getCohortColor(cohort.day365) }}
                        >
                          {cohort.day365}%
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
