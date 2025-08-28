"use client";

import { useState, useEffect } from 'react';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  Award,
  TrendingUp,
  Users,
  Target,
  Zap,
  Filter,
  Search,
  Calendar,
  ArrowUp,
  ArrowDown,
  Eye,
  Edit,
  MoreHorizontal,
  Gift,
  Timer,
  Flame
} from 'lucide-react';

interface User {
  id: string;
  username: string;
  avatar?: string;
  level: number;
  totalXP: number;
  weeklyXP: number;
  monthlyXP: number;
  rank: number;
  previousRank: number;
  badges: string[];
  achievements: number;
  streakDays: number;
  lastActive: string;
  region: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
}

interface Leaderboard {
  id: string;
  name: string;
  type: 'global' | 'regional' | 'weekly' | 'monthly' | 'tier_based';
  period: 'real_time' | 'daily' | 'weekly' | 'monthly' | 'all_time';
  criteria: 'total_xp' | 'weekly_xp' | 'monthly_xp' | 'achievements' | 'streak_days';
  users: User[];
  isActive: boolean;
  rewards: {
    rank: number;
    reward: string;
    value: number;
  }[];
  participants: number;
  lastUpdated: string;
}

interface RankingStats {
  totalUsers: number;
  activeUsers: number;
  avgXP: number;
  topPerformer: User | null;
}

export default function RankingsPage() {
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<string>('global');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all_time');
  const [loading, setLoading] = useState(true);

  // Mock data
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        username: 'AhmedKing',
        level: 25,
        totalXP: 15420,
        weeklyXP: 1250,
        monthlyXP: 4680,
        rank: 1,
        previousRank: 2,
        badges: ['Legend', 'Master Trader', 'Streak King'],
        achievements: 47,
        streakDays: 89,
        lastActive: '2025-06-02T10:30:00Z',
        region: 'Alger',
        tier: 'diamond'
      },
      {
        id: '2',
        username: 'SaraElite',
        level: 24,
        totalXP: 14850,
        weeklyXP: 980,
        monthlyXP: 4320,
        rank: 2,
        previousRank: 1,
        badges: ['Elite Trader', 'Referral Queen', 'Social Star'],
        achievements: 45,
        streakDays: 67,
        lastActive: '2025-06-02T09:15:00Z',
        region: 'Oran',
        tier: 'diamond'
      },
      {
        id: '3',
        username: 'MohamedPro',
        level: 22,
        totalXP: 12340,
        weeklyXP: 1150,
        monthlyXP: 3890,
        rank: 3,
        previousRank: 4,
        badges: ['Pro Trader', 'Mission Master'],
        achievements: 38,
        streakDays: 45,
        lastActive: '2025-06-02T08:45:00Z',
        region: 'Constantine',
        tier: 'platinum'
      },
      {
        id: '4',
        username: 'FatimaRise',
        level: 21,
        totalXP: 11680,
        weeklyXP: 890,
        monthlyXP: 3560,
        rank: 4,
        previousRank: 3,
        badges: ['Rising Star', 'Consistent Trader'],
        achievements: 35,
        streakDays: 32,
        lastActive: '2025-06-01T16:20:00Z',
        region: 'Alger',
        tier: 'platinum'
      },
      {
        id: '5',
        username: 'YacineFlash',
        level: 20,
        totalXP: 10950,
        weeklyXP: 1420,
        monthlyXP: 4120,
        rank: 5,
        previousRank: 8,
        badges: ['Speed Trader', 'Weekly Warrior'],
        achievements: 32,
        streakDays: 28,
        lastActive: '2025-06-02T11:00:00Z',
        region: 'Oran',
        tier: 'gold'
      }
    ];

    const mockLeaderboards: Leaderboard[] = [
      {
        id: 'global',
        name: 'Global Leaderboard',
        type: 'global',
        period: 'all_time',
        criteria: 'total_xp',
        users: mockUsers,
        isActive: true,
        rewards: [
          { rank: 1, reward: 'Diamond Crown + 5000 XP', value: 5000 },
          { rank: 2, reward: 'Platinum Medal + 3000 XP', value: 3000 },
          { rank: 3, reward: 'Gold Medal + 2000 XP', value: 2000 }
        ],
        participants: 15420,
        lastUpdated: '2025-06-02T12:00:00Z'
      },
      {
        id: 'weekly',
        name: 'Weekly Champions',
        type: 'weekly',
        period: 'weekly',
        criteria: 'weekly_xp',
        users: mockUsers.sort((a, b) => b.weeklyXP - a.weeklyXP),
        isActive: true,
        rewards: [
          { rank: 1, reward: 'Weekly Crown + 1000 XP', value: 1000 },
          { rank: 2, reward: 'Weekly Medal + 500 XP', value: 500 },
          { rank: 3, reward: 'Weekly Badge + 250 XP', value: 250 }
        ],
        participants: 8650,
        lastUpdated: '2025-06-02T12:00:00Z'
      },
      {
        id: 'regional_alger',
        name: 'Alger Region',
        type: 'regional',
        period: 'all_time',
        criteria: 'total_xp',
        users: mockUsers.filter(u => u.region === 'Alger'),
        isActive: true,
        rewards: [
          { rank: 1, reward: 'Regional Crown + 2000 XP', value: 2000 },
          { rank: 2, reward: 'Regional Medal + 1000 XP', value: 1000 }
        ],
        participants: 3240,
        lastUpdated: '2025-06-02T12:00:00Z'
      }
    ];

    setTimeout(() => {
      setLeaderboards(mockLeaderboards);
      setLoading(false);
    }, 1000);
  }, []);

  const currentLeaderboard = leaderboards.find(board => board.id === selectedBoard);
  
  const stats: RankingStats = {
    totalUsers: leaderboards.reduce((sum, board) => sum + board.participants, 0),
    activeUsers: leaderboards.filter(board => board.isActive).length * 1000, // Mock active users
    avgXP: currentLeaderboard?.users.reduce((sum, user) => sum + user.totalXP, 0) / (currentLeaderboard?.users.length || 1) || 0,
    topPerformer: currentLeaderboard?.users[0] || null
  };

  const getTierColor = (tier: User['tier']) => {
    switch (tier) {
      case 'bronze': return 'text-orange-600 bg-orange-100';
      case 'silver': return 'text-gray-600 bg-gray-100';
      case 'gold': return 'text-yellow-600 bg-yellow-100';
      case 'platinum': return 'text-purple-600 bg-purple-100';
      case 'diamond': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTierIcon = (tier: User['tier']) => {
    switch (tier) {
      case 'bronze': return '🥉';
      case 'silver': return '🥈';
      case 'gold': return '🥇';
      case 'platinum': return '💎';
      case 'diamond': return '👑';
      default: return '📊';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-orange-500" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankChange = (user: User) => {
    const change = user.previousRank - user.rank;
    if (change > 0) {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <ArrowUp className="w-4 h-4" />
          <span className="text-xs">+{change}</span>
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center gap-1 text-red-600">
          <ArrowDown className="w-4 h-4" />
          <span className="text-xs">{change}</span>
        </div>
      );
    }
    return (
      <div className="text-gray-400 text-xs">-</div>
    );
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Rankings & Leaderboards</h1>
            <p className="text-gray-600">Track user rankings and competitive standings</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Trophy className="w-5 h-5 mr-2" />
            Export Rankings
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
                <p className="text-sm font-medium text-gray-600">Active Competitors</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeUsers.toLocaleString()}</p>
              </div>
              <Zap className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg XP</p>
                <p className="text-2xl font-bold text-purple-600">{Math.round(stats.avgXP).toLocaleString()}</p>
              </div>
              <Star className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top Performer</p>
                <p className="text-lg font-bold text-orange-600">{stats.topPerformer?.username || 'N/A'}</p>
                <p className="text-sm text-gray-500">{stats.topPerformer?.totalXP.toLocaleString()} XP</p>
              </div>
              <Crown className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Leaderboard Selection */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex gap-2">
                {leaderboards.map((board) => (
                  <button
                    key={board.id}
                    onClick={() => setSelectedBoard(board.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedBoard === board.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {board.name}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 ml-auto">
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                  <option value="all_time">All Time</option>
                  <option value="monthly">This Month</option>
                  <option value="weekly">This Week</option>
                  <option value="daily">Today</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                  <option value="all">All Tiers</option>
                  <option value="diamond">Diamond</option>
                  <option value="platinum">Platinum</option>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="bronze">Bronze</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative max-w-md">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">XP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Achievements</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Streak</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentLeaderboard?.users.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {getRankIcon(user.rank)}
                        <span className="text-sm font-medium text-gray-900">#{user.rank}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTierColor(user.tier)}`}>
                              {getTierIcon(user.tier)} {user.tier}
                            </span>
                            <span className="text-xs text-gray-500">{user.region}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.level}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.totalXP.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">
                        {currentLeaderboard?.criteria === 'weekly_xp' ? `+${user.weeklyXP} this week` : 
                         currentLeaderboard?.criteria === 'monthly_xp' ? `+${user.monthlyXP} this month` : 'Total XP'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-900">{user.achievements}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-gray-900">{user.streakDays}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRankChange(user)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:bg-gray-50 rounded">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Rewards Info */}
          {currentLeaderboard && currentLeaderboard.rewards.length > 0 && (
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ranking Rewards</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentLeaderboard.rewards.map((reward, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    {index === 0 && <Crown className="w-6 h-6 text-yellow-500" />}
                    {index === 1 && <Medal className="w-6 h-6 text-gray-400" />}
                    {index === 2 && <Award className="w-6 h-6 text-orange-500" />}
                    <div>
                      <div className="text-sm font-medium text-gray-900">Rank #{reward.rank}</div>
                      <div className="text-xs text-gray-600">{reward.reward}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
