"use client";

import { useState, useEffect } from 'react';
import { 
  Zap, 
  TrendingUp, 
  Clock, 
  Users, 
  Star,
  Plus,
  Filter,
  Search,
  Calendar,
  Target,
  Award,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Edit,
  Trash2,
  BarChart3,
  Timer,
  Sparkles
} from 'lucide-react';

interface Boost {
  id: string;
  name: string;
  description: string;
  type: 'xp_multiplier' | 'coin_bonus' | 'streak_protection' | 'double_rewards' | 'time_extension' | 'auto_complete';
  category: 'performance' | 'protection' | 'convenience' | 'special';
  status: 'active' | 'inactive' | 'limited' | 'expired';
  effect: {
    multiplier?: number;
    bonus?: number;
    duration: number; // in hours
    description: string;
  };
  cost: {
    type: 'coins' | 'gems' | 'premium' | 'free';
    amount: number;
  };
  usage: {
    total: number;
    thisWeek: number;
    thisMonth: number;
  };
  availability: {
    userLevels: string[];
    regions: string[];
    maxPerUser: number;
    cooldown: number; // in hours
  };
  effectiveness: {
    avgRating: number;
    totalRatings: number;
    conversionRate: number;
  };
  isPopular: boolean;
  isNew: boolean;
  createdAt: string;
  lastUpdated: string;
}

export default function BoostsPage() {
  const [boosts, setBoosts] = useState<Boost[]>([]);
  const [filteredBoosts, setFilteredBoosts] = useState<Boost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBoost, setSelectedBoost] = useState<Boost | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data
  useEffect(() => {
    const mockBoosts: Boost[] = [
      {
        id: '1',
        name: 'XP Thunder',
        description: 'Double your XP earnings for the next 2 hours',
        type: 'xp_multiplier',
        category: 'performance',
        status: 'active',
        effect: {
          multiplier: 2,
          duration: 2,
          description: '2x XP multiplier for 2 hours'
        },
        cost: {
          type: 'coins',
          amount: 100
        },
        usage: {
          total: 15420,
          thisWeek: 1250,
          thisMonth: 5680
        },
        availability: {
          userLevels: ['bronze', 'silver', 'gold', 'platinum'],
          regions: ['All'],
          maxPerUser: 5,
          cooldown: 6
        },
        effectiveness: {
          avgRating: 4.7,
          totalRatings: 2341,
          conversionRate: 68.5
        },
        isPopular: true,
        isNew: false,
        createdAt: '2025-01-15',
        lastUpdated: '2025-06-01'
      },
      {
        id: '2',
        name: 'Coin Rain',
        description: 'Get 500 bonus coins instantly',
        type: 'coin_bonus',
        category: 'performance',
        status: 'active',
        effect: {
          bonus: 500,
          duration: 0,
          description: 'Instant 500 coin bonus'
        },
        cost: {
          type: 'gems',
          amount: 10
        },
        usage: {
          total: 8340,
          thisWeek: 890,
          thisMonth: 3420
        },
        availability: {
          userLevels: ['silver', 'gold', 'platinum', 'diamond'],
          regions: ['All'],
          maxPerUser: 3,
          cooldown: 24
        },
        effectiveness: {
          avgRating: 4.5,
          totalRatings: 1456,
          conversionRate: 72.3
        },
        isPopular: true,
        isNew: false,
        createdAt: '2025-02-01',
        lastUpdated: '2025-06-01'
      },
      {
        id: '3',
        name: 'Streak Shield',
        description: 'Protect your daily streak from breaking for 3 days',
        type: 'streak_protection',
        category: 'protection',
        status: 'active',
        effect: {
          duration: 72,
          description: 'Streak protection for 3 days'
        },
        cost: {
          type: 'premium',
          amount: 1
        },
        usage: {
          total: 3240,
          thisWeek: 420,
          thisMonth: 1680
        },
        availability: {
          userLevels: ['gold', 'platinum', 'diamond'],
          regions: ['All'],
          maxPerUser: 2,
          cooldown: 168
        },
        effectiveness: {
          avgRating: 4.9,
          totalRatings: 891,
          conversionRate: 89.2
        },
        isPopular: false,
        isNew: true,
        createdAt: '2025-05-15',
        lastUpdated: '2025-06-01'
      },
      {
        id: '4',
        name: 'Mission Blitz',
        description: 'Complete any mission instantly',
        type: 'auto_complete',
        category: 'convenience',
        status: 'limited',
        effect: {
          duration: 0,
          description: 'Instant mission completion'
        },
        cost: {
          type: 'gems',
          amount: 25
        },
        usage: {
          total: 1840,
          thisWeek: 150,
          thisMonth: 640
        },
        availability: {
          userLevels: ['platinum', 'diamond'],
          regions: ['Alger', 'Oran'],
          maxPerUser: 1,
          cooldown: 72
        },
        effectiveness: {
          avgRating: 4.3,
          totalRatings: 234,
          conversionRate: 45.8
        },
        isPopular: false,
        isNew: false,
        createdAt: '2025-03-20',
        lastUpdated: '2025-06-01'
      },
      {
        id: '5',
        name: 'Time Warp',
        description: 'Extend current mission deadline by 24 hours',
        type: 'time_extension',
        category: 'convenience',
        status: 'active',
        effect: {
          duration: 24,
          description: '24-hour mission extension'
        },
        cost: {
          type: 'coins',
          amount: 50
        },
        usage: {
          total: 6720,
          thisWeek: 680,
          thisMonth: 2840
        },
        availability: {
          userLevels: ['bronze', 'silver', 'gold'],
          regions: ['All'],
          maxPerUser: 10,
          cooldown: 12
        },
        effectiveness: {
          avgRating: 4.1,
          totalRatings: 1024,
          conversionRate: 61.7
        },
        isPopular: false,
        isNew: false,
        createdAt: '2025-01-30',
        lastUpdated: '2025-06-01'
      },
      {
        id: '6',
        name: 'Golden Hour',
        description: 'Triple rewards for the next hour',
        type: 'double_rewards',
        category: 'special',
        status: 'inactive',
        effect: {
          multiplier: 3,
          duration: 1,
          description: '3x rewards for 1 hour'
        },
        cost: {
          type: 'gems',
          amount: 50
        },
        usage: {
          total: 1250,
          thisWeek: 0,
          thisMonth: 0
        },
        availability: {
          userLevels: ['diamond'],
          regions: ['All'],
          maxPerUser: 1,
          cooldown: 168
        },
        effectiveness: {
          avgRating: 5.0,
          totalRatings: 89,
          conversionRate: 95.5
        },
        isPopular: false,
        isNew: true,
        createdAt: '2025-05-01',
        lastUpdated: '2025-06-01'
      }
    ];

    setTimeout(() => {
      setBoosts(mockBoosts);
      setFilteredBoosts(mockBoosts);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter boosts
  useEffect(() => {
    let filtered = boosts;

    if (searchTerm) {
      filtered = filtered.filter(boost =>
        boost.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        boost.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(boost => boost.status === selectedFilter);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(boost => boost.category === selectedCategory);
    }

    setFilteredBoosts(filtered);
  }, [boosts, searchTerm, selectedFilter, selectedCategory]);

  const getStatusColor = (status: Boost['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'limited': return 'text-yellow-600 bg-yellow-100';
      case 'expired': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: Boost['category']) => {
    switch (category) {
      case 'performance': return 'text-blue-600 bg-blue-100';
      case 'protection': return 'text-green-600 bg-green-100';
      case 'convenience': return 'text-purple-600 bg-purple-100';
      case 'special': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'xp_multiplier': return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'coin_bonus': return <Star className="w-5 h-5 text-blue-500" />;
      case 'streak_protection': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'double_rewards': return <Award className="w-5 h-5 text-purple-500" />;
      case 'time_extension': return <Clock className="w-5 h-5 text-orange-500" />;
      case 'auto_complete': return <Target className="w-5 h-5 text-red-500" />;
      default: return <Sparkles className="w-5 h-5 text-gray-500" />;
    }
  };

  const getCostIcon = (type: string) => {
    switch (type) {
      case 'coins': return '🪙';
      case 'gems': return '💎';
      case 'premium': return '⭐';
      case 'free': return '🆓';
      default: return '❓';
    }
  };

  const stats = {
    totalBoosts: boosts.length,
    activeBoosts: boosts.filter(b => b.status === 'active').length,
    totalUsage: boosts.reduce((sum, b) => sum + b.usage.total, 0),
    avgRating: boosts.reduce((sum, b) => sum + b.effectiveness.avgRating, 0) / boosts.length || 0
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Boost Management</h1>
            <p className="text-gray-600">Manage power-ups and boosts for enhanced user experience</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Boost
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Boosts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBoosts}</p>
              </div>
              <Zap className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Boosts</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeBoosts}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Usage</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsage.toLocaleString()}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-orange-600">{stats.avgRating.toFixed(1)}⭐</p>
              </div>
              <Star className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search boosts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="limited">Limited</option>
              <option value="expired">Expired</option>
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="performance">Performance</option>
              <option value="protection">Protection</option>
              <option value="convenience">Convenience</option>
              <option value="special">Special</option>
            </select>
          </div>
        </div>
      </div>

      {/* Boosts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBoosts.map((boost) => (
          <div key={boost.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getTypeIcon(boost.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{boost.name}</h3>
                      {boost.isNew && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-600 rounded-full">
                          New
                        </span>
                      )}
                      {boost.isPopular && (
                        <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-600 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{boost.description}</p>
                  </div>
                </div>
              </div>

              {/* Status & Category */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(boost.status)}`}>
                  {boost.status}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(boost.category)}`}>
                  {boost.category}
                </span>
              </div>

              {/* Effect & Cost */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-700">Effect</span>
                  </div>
                  <p className="text-xs text-blue-600">{boost.effect.description}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{getCostIcon(boost.cost.type)}</span>
                    <span className="text-sm font-medium text-green-700">Cost</span>
                  </div>
                  <p className="text-xs text-green-600">
                    {boost.cost.amount} {boost.cost.type}
                  </p>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Usage</span>
                  <span className="text-sm text-gray-600">{boost.usage.total.toLocaleString()} total</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>This week: {boost.usage.thisWeek}</div>
                  <div>This month: {boost.usage.thisMonth}</div>
                </div>
              </div>

              {/* Effectiveness */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Effectiveness</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">{boost.effectiveness.avgRating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{boost.effectiveness.totalRatings} ratings</span>
                  <span>{boost.effectiveness.conversionRate}% conversion</span>
                </div>
              </div>

              {/* Availability */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700">Availability</span>
                </div>
                <div className="text-xs text-gray-600">
                  <div>Max per user: {boost.availability.maxPerUser}</div>
                  <div>Cooldown: {boost.availability.cooldown}h</div>
                  <div>Levels: {boost.availability.userLevels.join(', ')}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  {boost.status === 'active' ? (
                    <button className="flex items-center gap-1 px-3 py-1 text-sm text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                      <Pause className="w-4 h-4" />
                      Deactivate
                    </button>
                  ) : (
                    <button className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Play className="w-4 h-4" />
                      Activate
                    </button>
                  )}
                  <button className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                </div>
                <button className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBoosts.length === 0 && (
        <div className="text-center py-12">
          <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No boosts found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create First Boost
          </button>
        </div>
      )}
    </div>
  );
}
