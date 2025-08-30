"use client";

import { useState, useEffect } from 'react';
import { 
  Target, 
  Trophy, 
  Clock, 
  Users, 
  Coins, 
  Star,
  Plus,
  Filter,
  Search,
  Calendar,
  MapPin,
  Zap,
  Award,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Edit,
  Trash2
} from 'lucide-react';

interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  category: 'transactions' | 'referrals' | 'engagement' | 'milestones';
  status: 'active' | 'paused' | 'completed' | 'draft';
  reward: {
    type: 'coins' | 'xp' | 'badge' | 'multiplier';
    amount: number;
    description: string;
  };
  requirements: {
    target: number;
    current: number;
    unit: string;
  };
  participants: number;
  completionRate: number;
  startDate: string;
  endDate: string;
  isRepeating: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  regions?: string[];
  userTypes?: string[];
  createdAt: string;
  lastUpdated: string;
}

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [filteredMissions, setFilteredMissions] = useState<Mission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data
  useEffect(() => {
    const mockMissions: Mission[] = [
      {
        id: '1',
        title: 'Transaction Pioneer',
        description: 'Complete 10 transactions this week to earn bonus XP',
        type: 'weekly',
        category: 'transactions',
        status: 'active',
        reward: {
          type: 'xp',
          amount: 500,
          description: '500 XP + Transaction Master Badge'
        },
        requirements: {
          target: 10,
          current: 7,
          unit: 'transactions'
        },
        participants: 1247,
        completionRate: 68.5,
        startDate: '2025-06-01',
        endDate: '2025-06-07',
        isRepeating: true,
        difficulty: 'easy',
        regions: ['Alger', 'Oran', 'Constantine'],
        userTypes: ['standard', 'premium'],
        createdAt: '2025-05-15',
        lastUpdated: '2025-06-01'
      },
      {
        id: '2',
        title: 'Referral Champion',
        description: 'Invite 5 new users and earn massive rewards',
        type: 'monthly',
        category: 'referrals',
        status: 'active',
        reward: {
          type: 'coins',
          amount: 1000,
          description: '1000 Dinary Coins + Referral King Badge'
        },
        requirements: {
          target: 5,
          current: 2,
          unit: 'referrals'
        },
        participants: 856,
        completionRate: 42.3,
        startDate: '2025-06-01',
        endDate: '2025-06-30',
        isRepeating: true,
        difficulty: 'medium',
        regions: ['All'],
        userTypes: ['all'],
        createdAt: '2025-05-20',
        lastUpdated: '2025-06-01'
      },
      {
        id: '3',
        title: 'Daily Streak Master',
        description: 'Login daily for 7 consecutive days',
        type: 'daily',
        category: 'engagement',
        status: 'active',
        reward: {
          type: 'multiplier',
          amount: 2,
          description: '2x XP Multiplier for 24 hours'
        },
        requirements: {
          target: 7,
          current: 5,
          unit: 'days'
        },
        participants: 2341,
        completionRate: 71.8,
        startDate: '2025-06-01',
        endDate: '2025-06-07',
        isRepeating: true,
        difficulty: 'easy',
        regions: ['All'],
        userTypes: ['all'],
        createdAt: '2025-05-10',
        lastUpdated: '2025-06-02'
      },
      {
        id: '4',
        title: 'Milestone Achiever',
        description: 'Reach 10,000 total transaction volume',
        type: 'special',
        category: 'milestones',
        status: 'active',
        reward: {
          type: 'badge',
          amount: 1,
          description: 'Elite Trader Badge + 2000 XP'
        },
        requirements: {
          target: 10000,
          current: 6750,
          unit: 'DZD'
        },
        participants: 423,
        completionRate: 28.9,
        startDate: '2025-05-01',
        endDate: '2025-07-31',
        isRepeating: false,
        difficulty: 'expert',
        regions: ['Alger', 'Oran'],
        userTypes: ['premium', 'vip'],
        createdAt: '2025-04-25',
        lastUpdated: '2025-06-01'
      },
      {
        id: '5',
        title: 'Weekend Warrior',
        description: 'Complete 5 transactions during weekends',
        type: 'weekly',
        category: 'transactions',
        status: 'paused',
        reward: {
          type: 'coins',
          amount: 300,
          description: '300 Dinary Coins'
        },
        requirements: {
          target: 5,
          current: 0,
          unit: 'weekend transactions'
        },
        participants: 634,
        completionRate: 0,
        startDate: '2025-06-01',
        endDate: '2025-06-07',
        isRepeating: true,
        difficulty: 'medium',
        regions: ['All'],
        userTypes: ['standard'],
        createdAt: '2025-05-18',
        lastUpdated: '2025-06-01'
      }
    ];

    setTimeout(() => {
      setMissions(mockMissions);
      setFilteredMissions(mockMissions);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter missions
  useEffect(() => {
    let filtered = missions;

    if (searchTerm) {
      filtered = filtered.filter(mission =>
        mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mission.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedFilter !== 'all') {
      filtered = filtered.filter(mission => mission.status === selectedFilter);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(mission => mission.category === selectedCategory);
    }

    setFilteredMissions(filtered);
  }, [missions, searchTerm, selectedFilter, selectedCategory]);

  const getStatusColor = (status: Mission['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: Mission['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-orange-600 bg-orange-100';
      case 'expert': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'coins': return <Coins className="w-4 h-4 text-yellow-500" />;
      case 'xp': return <Star className="w-4 h-4 text-blue-500" />;
      case 'badge': return <Award className="w-4 h-4 text-purple-500" />;
      case 'multiplier': return <Zap className="w-4 h-4 text-orange-500" />;
      default: return <Trophy className="w-4 h-4 text-gray-500" />;
    }
  };

  const stats = {
    totalMissions: missions.length,
    activeMissions: missions.filter(m => m.status === 'active').length,
    totalParticipants: missions.reduce((sum, m) => sum + m.participants, 0),
    avgCompletionRate: missions.reduce((sum, m) => sum + m.completionRate, 0) / missions.length || 0
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mission Management</h1>
            <p className="text-gray-600">Create and manage gamification missions for user engagement</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Mission
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Missions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMissions}</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Missions</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeMissions}</p>
              </div>
              <Play className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Participants</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalParticipants.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Completion</p>
                <p className="text-2xl font-bold text-orange-600">{stats.avgCompletionRate.toFixed(1)}%</p>
              </div>
              <Trophy className="w-8 h-8 text-orange-500" />
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
                  placeholder="Search missions..."
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
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="transactions">Transactions</option>
              <option value="referrals">Referrals</option>
              <option value="engagement">Engagement</option>
              <option value="milestones">Milestones</option>
            </select>
          </div>
        </div>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMissions.map((mission) => (
          <div key={mission.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{mission.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(mission.status)}`}>
                      {mission.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">{mission.description}</p>
                </div>
              </div>

              {/* Mission Type & Difficulty */}
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                  {mission.type}
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-600 rounded-full">
                  {mission.category}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(mission.difficulty)}`}>
                  {mission.difficulty}
                </span>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-600">
                    {mission.requirements.current}/{mission.requirements.target} {mission.requirements.unit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((mission.requirements.current / mission.requirements.target) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">{mission.completionRate}% completion rate</span>
                  <span className="text-xs text-gray-500">{mission.participants} participants</span>
                </div>
              </div>

              {/* Reward */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  {getRewardIcon(mission.reward.type)}
                  <span className="text-sm font-medium text-gray-700">Reward</span>
                </div>
                <p className="text-sm text-gray-600">{mission.reward.description}</p>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(mission.startDate).toLocaleDateString()}</span>
                </div>
                <span>-</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(mission.endDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  {mission.status === 'active' ? (
                    <button className="flex items-center gap-1 px-3 py-1 text-sm text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                      <Pause className="w-4 h-4" />
                      Pause
                    </button>
                  ) : mission.status === 'paused' ? (
                    <button className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Play className="w-4 h-4" />
                      Resume
                    </button>
                  ) : null}
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

      {filteredMissions.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No missions found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create First Mission
          </button>
        </div>
      )}
    </div>
  );
}
