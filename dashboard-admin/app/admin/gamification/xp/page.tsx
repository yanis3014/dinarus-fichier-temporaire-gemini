"use client";

import { useState, useEffect } from 'react';
import { 
  Star, 
  TrendingUp, 
  Award, 
  Users, 
  Zap,
  Plus,
  Filter,
  Search,
  Calendar,
  Target,
  Crown,
  Medal,
  Trophy,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  BarChart3,
  Gift,
  Clock
} from 'lucide-react';

interface XPRule {
  id: string;
  action: string;
  category: 'transactions' | 'referrals' | 'social' | 'milestones' | 'engagement';
  xpValue: number;
  multiplier: number;
  conditions?: string[];
  isActive: boolean;
  description: string;
}

interface Level {
  id: string;
  level: number;
  name: string;
  xpRequired: number;
  xpRange: {
    min: number;
    max: number;
  };
  rewards: {
    coins: number;
    gems: number;
    boosts: string[];
    badges: string[];
    perks: string[];
  };
  users: {
    current: number;
    percentage: number;
  };
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
}

interface UserProgression {
  id: string;
  username: string;
  currentLevel: number;
  currentXP: number;
  totalXP: number;
  xpToNextLevel: number;
  progressPercentage: number;
  recentActivity: {
    action: string;
    xpEarned: number;
    timestamp: string;
  }[];
  achievements: string[];
  streakDays: number;
  lastActive: string;
}

export default function XPSystemPage() {
  const [xpRules, setXpRules] = useState<XPRule[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [userProgressions, setUserProgressions] = useState<UserProgression[]>([]);
  const [activeTab, setActiveTab] = useState<'rules' | 'levels' | 'users'>('rules');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock data
  useEffect(() => {
    const mockXpRules: XPRule[] = [
      {
        id: '1',
        action: 'Complete Transaction',
        category: 'transactions',
        xpValue: 10,
        multiplier: 1,
        conditions: ['Transaction amount > 100 DZD'],
        isActive: true,
        description: 'Earn XP for completing transactions'
      },
      {
        id: '2',        action: 'Successful Referral',
        category: 'referrals',
        xpValue: 100,
        multiplier: 1.5,
        conditions: ['Referred user completes first transaction'],
        isActive: true,
        description: 'Bonus XP for bringing new users'
      },
      {
        id: '3',
        action: 'Daily Login',
        category: 'engagement',
        xpValue: 5,
        multiplier: 1,
        isActive: true,
        description: 'Reward for daily app usage'
      },
      {
        id: '4',
        action: 'Weekly Streak',
        category: 'engagement',
        xpValue: 50,
        multiplier: 2,
        conditions: ['7 consecutive days login'],
        isActive: true,
        description: 'Bonus for maintaining streaks'
      },
      {
        id: '5',
        action: 'Profile Completion',
        category: 'milestones',
        xpValue: 25,
        multiplier: 1,
        conditions: ['100% profile completion'],
        isActive: true,
        description: 'One-time bonus for complete profile'
      }
    ];

    const mockLevels: Level[] = [
      {
        id: '1',
        level: 1,
        name: 'Bronze Beginner',
        xpRequired: 0,
        xpRange: { min: 0, max: 99 },
        rewards: {
          coins: 50,
          gems: 0,
          boosts: [],
          badges: ['Welcome'],
          perks: ['Basic features']
        },
        users: { current: 2145, percentage: 35.2 },
        color: '#CD7F32',
        icon: '🥉',
        isActive: true,
        createdAt: '2025-01-01'
      },
      {
        id: '2',
        level: 2,
        name: 'Bronze Explorer',
        xpRequired: 100,
        xpRange: { min: 100, max: 249 },
        rewards: {
          coins: 100,
          gems: 1,
          boosts: ['Time Warp'],
          badges: ['Explorer'],
          perks: ['Reduced fees']
        },
        users: { current: 1876, percentage: 30.8 },
        color: '#CD7F32',
        icon: '🥉',
        isActive: true,
        createdAt: '2025-01-01'
      },
      {
        id: '3',
        level: 3,
        name: 'Silver Achiever',
        xpRequired: 250,
        xpRange: { min: 250, max: 499 },
        rewards: {
          coins: 200,
          gems: 3,
          boosts: ['XP Thunder', 'Coin Rain'],
          badges: ['Achiever', 'Silver Star'],
          perks: ['Priority support', 'Bonus referral rewards']
        },
        users: { current: 1234, percentage: 20.3 },
        color: '#C0C0C0',
        icon: '🥈',
        isActive: true,
        createdAt: '2025-01-01'
      },
      {
        id: '4',
        level: 4,
        name: 'Gold Master',
        xpRequired: 500,
        xpRange: { min: 500, max: 999 },
        rewards: {
          coins: 500,
          gems: 5,
          boosts: ['Streak Shield', 'Mission Blitz'],
          badges: ['Master', 'Gold Crown'],
          perks: ['VIP status', 'Exclusive missions', 'Higher limits']
        },
        users: { current: 567, percentage: 9.3 },
        color: '#FFD700',
        icon: '🥇',
        isActive: true,
        createdAt: '2025-01-01'
      },
      {
        id: '5',
        level: 5,
        name: 'Platinum Elite',
        xpRequired: 1000,
        xpRange: { min: 1000, max: 1999 },
        rewards: {
          coins: 1000,
          gems: 10,
          boosts: ['Golden Hour', 'Double Rewards'],
          badges: ['Elite', 'Platinum Badge'],
          perks: ['Personal advisor', 'Custom features', 'Beta access']
        },
        users: { current: 198, percentage: 3.3 },
        color: '#E5E4E2',
        icon: '💎',
        isActive: true,
        createdAt: '2025-01-01'
      },
      {
        id: '6',
        level: 6,
        name: 'Diamond Legend',
        xpRequired: 2000,
        xpRange: { min: 2000, max: 999999 },
        rewards: {
          coins: 2000,
          gems: 25,
          boosts: ['All Available'],
          badges: ['Legend', 'Diamond Crown'],
          perks: ['All premium features', 'Exclusive events', 'Direct contact']
        },
        users: { current: 67, percentage: 1.1 },
        color: '#B9F2FF',
        icon: '👑',
        isActive: true,
        createdAt: '2025-01-01'
      }
    ];

    const mockUserProgressions: UserProgression[] = [
      {
        id: '1',
        username: 'ahmed_pro',
        currentLevel: 4,
        currentXP: 750,
        totalXP: 750,
        xpToNextLevel: 250,
        progressPercentage: 75,
        recentActivity: [
          { action: 'Transaction completed', xpEarned: 10, timestamp: '2025-06-02T10:30:00Z' },
          { action: 'Daily login', xpEarned: 5, timestamp: '2025-06-02T08:00:00Z' },
          { action: 'Referral bonus', xpEarned: 100, timestamp: '2025-06-01T15:20:00Z' }
        ],
        achievements: ['Master', 'Gold Crown', 'Transaction Pro'],
        streakDays: 12,
        lastActive: '2025-06-02T10:30:00Z'
      },
      {
        id: '2',
        username: 'sara_trader',
        currentLevel: 5,
        currentXP: 1450,
        totalXP: 1450,
        xpToNextLevel: 550,
        progressPercentage: 72.5,
        recentActivity: [
          { action: 'Weekly streak bonus', xpEarned: 50, timestamp: '2025-06-02T09:00:00Z' },
          { action: 'Profile completion', xpEarned: 25, timestamp: '2025-06-01T14:00:00Z' }
        ],
        achievements: ['Elite', 'Platinum Badge', 'Streak Master'],
        streakDays: 28,
        lastActive: '2025-06-02T09:00:00Z'
      },
      {
        id: '3',
        username: 'mohamed_new',
        currentLevel: 2,
        currentXP: 180,
        totalXP: 180,
        xpToNextLevel: 70,
        progressPercentage: 72,
        recentActivity: [
          { action: 'First transaction', xpEarned: 10, timestamp: '2025-06-02T11:00:00Z' },
          { action: 'Daily login', xpEarned: 5, timestamp: '2025-06-02T08:30:00Z' }
        ],
        achievements: ['Explorer', 'Welcome'],
        streakDays: 3,
        lastActive: '2025-06-02T11:00:00Z'
      }
    ];

    setTimeout(() => {
      setXpRules(mockXpRules);
      setLevels(mockLevels);
      setUserProgressions(mockUserProgressions);
      setLoading(false);
    }, 1000);
  }, []);

  const stats = {
    totalUsers: userProgressions.length,
    totalXPAwarded: userProgressions.reduce((sum, user) => sum + user.totalXP, 0),
    activeRules: xpRules.filter(rule => rule.isActive).length,
    avgLevel: userProgressions.reduce((sum, user) => sum + user.currentLevel, 0) / userProgressions.length || 0
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">XP System Management</h1>
            <p className="text-gray-600">Manage experience points, levels, and user progression</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5 mr-2" />
            Add Rule/Level
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">XP Awarded</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalXPAwarded.toLocaleString()}</p>
              </div>
              <Star className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Rules</p>
                <p className="text-2xl font-bold text-purple-600">{stats.activeRules}</p>
              </div>
              <Zap className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Level</p>
                <p className="text-2xl font-bold text-orange-600">{stats.avgLevel.toFixed(1)}</p>
              </div>
              <Trophy className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('rules')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'rules'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                XP Rules
              </button>
              <button
                onClick={() => setActiveTab('levels')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'levels'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Level System
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                User Progress
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Content */}
            {activeTab === 'rules' && (
              <div className="space-y-4">
                {xpRules.map((rule) => (
                  <div key={rule.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{rule.action}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            rule.category === 'transactions' ? 'bg-blue-100 text-blue-600' :
                            rule.category === 'referrals' ? 'bg-green-100 text-green-600' :
                            rule.category === 'social' ? 'bg-purple-100 text-purple-600' :
                            rule.category === 'milestones' ? 'bg-orange-100 text-orange-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {rule.category}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            rule.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{rule.description}</p>
                        {rule.conditions && (
                          <div className="text-xs text-gray-500">
                            Conditions: {rule.conditions.join(', ')}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">{rule.xpValue} XP</div>
                          {rule.multiplier > 1 && (
                            <div className="text-sm text-orange-600">×{rule.multiplier} multiplier</div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'levels' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {levels.map((level) => (
                  <div key={level.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{level.icon}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Level {level.level}</h3>
                          <p className="text-sm text-gray-600">{level.name}</p>
                        </div>
                      </div>
                      <Crown className="w-6 h-6" style={{ color: level.color }} />
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">XP Range</span>
                        <span className="text-sm text-gray-600">
                          {level.xpRange.min.toLocaleString()} - {level.xpRange.max.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${level.users.percentage}%`,
                            backgroundColor: level.color
                          }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">{level.users.current} users</span>
                        <span className="text-xs text-gray-500">{level.users.percentage}%</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Rewards</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <span>🪙</span>
                          <span>{level.rewards.coins} coins</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>💎</span>
                          <span>{level.rewards.gems} gems</span>
                        </div>
                      </div>
                      {level.rewards.badges.length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs text-gray-600">Badges: {level.rewards.badges.join(', ')}</div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        level.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {level.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-4">
                {userProgressions.map((user) => (
                  <div key={user.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-lg">{levels.find(l => l.level === user.currentLevel)?.icon || '👤'}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{user.username}</h3>
                          <p className="text-sm text-gray-600">
                            Level {user.currentLevel} • {user.totalXP.toLocaleString()} Total XP
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 mb-1">
                          {user.xpToNextLevel} XP to next level
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${user.progressPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{user.progressPercentage}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h4>
                        <div className="space-y-1">
                          {user.recentActivity.slice(0, 3).map((activity, index) => (
                            <div key={index} className="text-xs text-gray-600">
                              <span className="font-medium">+{activity.xpEarned} XP</span> - {activity.action}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Achievements</h4>
                        <div className="flex flex-wrap gap-1">
                          {user.achievements.slice(0, 3).map((achievement, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-yellow-100 text-yellow-600 rounded-full">
                              {achievement}
                            </span>
                          ))}
                          {user.achievements.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                              +{user.achievements.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Stats</h4>
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            <span>{user.streakDays} day streak</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3" />
                            <span>Last active: {new Date(user.lastActive).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
