"use client";

import { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Bell, 
  Clock, 
  TrendingDown, 
  Users, 
  Target,
  Zap,
  Filter,
  Search,
  Calendar,
  Mail,
  MessageSquare,
  Phone,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  Send,
  Pause,
  Play,
  Archive
} from 'lucide-react';

interface Alert {
  id: string;
  type: 'objective_at_risk' | 'low_participation' | 'deadline_approaching' | 'performance_decline' | 'system_issue';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
  title: string;
  description: string;
  objectiveId?: string;
  objectiveName?: string;
  metrics: {
    current: number;
    target: number;
    percentage: number;
    trend: 'up' | 'down' | 'stable';
  };
  impact: {
    usersAffected: number;
    potentialLoss: string;
    urgency: number; // 1-10 scale
  };
  recommendations: string[];
  triggeredAt: string;
  lastUpdated: string;
  resolvedAt?: string;
  assignedTo?: string;
  escalationLevel: number;
  notificationsSent: number;
  channels: ('email' | 'sms' | 'push' | 'dashboard')[];
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: Alert['type'];
  severity: Alert['severity'];
  channels: Alert['channels'];
  message: {
    subject: string;
    body: string;
  };
  triggers: {
    threshold: number;
    condition: string;
  };
  recipients: {
    admins: boolean;
    managers: boolean;
    teamLeads: boolean;
    custom: string[];
  };
  isActive: boolean;
  frequency: 'immediate' | 'hourly' | 'daily' | 'on_change';
  cooldown: number; // hours
}

export default function WeeklyObjectivesAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [activeTab, setActiveTab] = useState<'alerts' | 'templates'>('alerts');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock data
  useEffect(() => {
    const mockAlerts: Alert[] = [
      {
        id: '1',
        type: 'objective_at_risk',
        severity: 'high',
        status: 'active',
        title: 'Weekly Transaction Boost at Risk',
        description: 'Current progress is significantly below target with only 3 days remaining',
        objectiveId: 'obj_1',
        objectiveName: 'Weekly Transaction Boost',
        metrics: {
          current: 87.5,
          target: 125,
          percentage: 70,
          trend: 'down'
        },
        impact: {
          usersAffected: 5420,
          potentialLoss: '2x XP Multiplier event cancellation',
          urgency: 8
        },
        recommendations: [
          'Send push notifications to inactive users',
          'Increase transaction incentives for next 48 hours',
          'Launch emergency referral bonus campaign',
          'Consider extending objective deadline by 2 days'
        ],
        triggeredAt: '2025-06-02T09:15:00Z',
        lastUpdated: '2025-06-02T12:30:00Z',
        assignedTo: 'admin@dinary.com',
        escalationLevel: 2,
        notificationsSent: 3,
        channels: ['email', 'push', 'dashboard']
      },
      {
        id: '2',
        type: 'low_participation',
        severity: 'medium',
        status: 'acknowledged',
        title: 'Premium User Milestone - Low Engagement',
        description: 'Only 87% of premium users are actively participating in the milestone objective',
        objectiveId: 'obj_4',
        objectiveName: 'Premium User Milestone',
        metrics: {
          current: 298,
          target: 340,
          percentage: 87.6,
          trend: 'stable'
        },
        impact: {
          usersAffected: 42,
          potentialLoss: 'Reduced premium user satisfaction',
          urgency: 5
        },
        recommendations: [
          'Send personalized emails to inactive premium users',
          'Offer additional premium-exclusive rewards',
          'Schedule one-on-one check-ins with high-value users'
        ],
        triggeredAt: '2025-06-01T14:20:00Z',
        lastUpdated: '2025-06-02T08:45:00Z',
        assignedTo: 'manager@dinary.com',
        escalationLevel: 1,
        notificationsSent: 2,
        channels: ['email', 'dashboard']
      },
      {
        id: '3',
        type: 'deadline_approaching',
        severity: 'medium',
        status: 'active',
        title: 'Multiple Objectives Ending Soon',
        description: '4 active objectives are approaching their deadlines within the next 72 hours',
        metrics: {
          current: 4,
          target: 6,
          percentage: 66.7,
          trend: 'stable'
        },
        impact: {
          usersAffected: 8640,
          potentialLoss: 'Multiple reward distributions at risk',
          urgency: 6
        },
        recommendations: [
          'Prepare backup objectives for next week',
          'Send deadline reminder notifications',
          'Review performance data for improvement areas',
          'Plan post-objective engagement activities'
        ],
        triggeredAt: '2025-06-02T06:00:00Z',
        lastUpdated: '2025-06-02T11:00:00Z',
        assignedTo: 'coordinator@dinary.com',
        escalationLevel: 1,
        notificationsSent: 1,
        channels: ['email', 'dashboard']
      },
      {
        id: '4',
        type: 'performance_decline',
        severity: 'high',
        status: 'active',
        title: 'Alger Region Challenge - Performance Drop',
        description: 'Daily login rate has dropped 5% in the last 24 hours for Alger region users',
        objectiveId: 'obj_3',
        objectiveName: 'Alger Region Challenge',
        metrics: {
          current: 85.2,
          target: 90,
          percentage: 94.7,
          trend: 'down'
        },
        impact: {
          usersAffected: 1240,
          potentialLoss: 'Regional championship status',
          urgency: 7
        },
        recommendations: [
          'Investigate technical issues in Alger region',
          'Launch emergency engagement campaign',
          'Offer bonus rewards for next 24 hours',
          'Contact regional community managers'
        ],
        triggeredAt: '2025-06-02T10:30:00Z',
        lastUpdated: '2025-06-02T12:15:00Z',
        escalationLevel: 2,
        notificationsSent: 2,
        channels: ['email', 'sms', 'dashboard']
      },
      {
        id: '5',
        type: 'system_issue',
        severity: 'critical',
        status: 'resolved',
        title: 'Progress Tracking Delay',
        description: 'Progress updates were delayed by 2 hours due to database sync issues',
        metrics: {
          current: 0,
          target: 0,
          percentage: 100,
          trend: 'stable'
        },
        impact: {
          usersAffected: 15420,
          potentialLoss: 'User confusion about progress status',
          urgency: 9
        },
        recommendations: [
          'Monitor system performance closely',
          'Send status update to all users',
          'Implement backup tracking system',
          'Review database sync processes'
        ],
        triggeredAt: '2025-06-01T16:45:00Z',
        lastUpdated: '2025-06-01T19:30:00Z',
        resolvedAt: '2025-06-01T19:30:00Z',
        assignedTo: 'tech@dinary.com',
        escalationLevel: 3,
        notificationsSent: 5,
        channels: ['email', 'sms', 'push', 'dashboard']
      }
    ];

    const mockTemplates: NotificationTemplate[] = [
      {
        id: '1',
        name: 'Objective At Risk - High Priority',
        type: 'objective_at_risk',
        severity: 'high',
        channels: ['email', 'push', 'dashboard'],
        message: {
          subject: 'URGENT: {{objective_name}} requires immediate attention',
          body: 'The objective "{{objective_name}}" is at risk of failure. Current progress: {{current_progress}}%. Time remaining: {{time_remaining}}. Immediate action required.'
        },
        triggers: {
          threshold: 75,
          condition: 'progress_below_threshold_with_time_pressure'
        },
        recipients: {
          admins: true,
          managers: true,
          teamLeads: false,
          custom: []
        },
        isActive: true,
        frequency: 'immediate',
        cooldown: 4
      },
      {
        id: '2',
        name: 'Low Participation Alert',
        type: 'low_participation',
        severity: 'medium',
        channels: ['email', 'dashboard'],
        message: {
          subject: 'Low participation in {{objective_name}}',
          body: 'Participation rate has dropped to {{participation_rate}}%. Consider implementing engagement strategies to boost user involvement.'
        },
        triggers: {
          threshold: 80,
          condition: 'participation_below_threshold'
        },
        recipients: {
          admins: true,
          managers: true,
          teamLeads: true,
          custom: []
        },
        isActive: true,
        frequency: 'daily',
        cooldown: 24
      },
      {
        id: '3',
        name: 'Deadline Reminder',
        type: 'deadline_approaching',
        severity: 'medium',
        channels: ['email', 'push'],
        message: {
          subject: 'Reminder: {{objective_name}} ends in {{time_remaining}}',
          body: 'Don\'t forget! {{objective_name}} will end in {{time_remaining}}. Current progress: {{current_progress}}%.'
        },
        triggers: {
          threshold: 72,
          condition: 'hours_before_deadline'
        },
        recipients: {
          admins: true,
          managers: false,
          teamLeads: false,
          custom: []
        },
        isActive: true,
        frequency: 'on_change',
        cooldown: 12
      }
    ];

    setTimeout(() => {
      setAlerts(mockAlerts);
      setTemplates(mockTemplates);
      setFilteredAlerts(mockAlerts);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter alerts
  useEffect(() => {
    let filtered = alerts;

    if (searchTerm) {
      filtered = filtered.filter(alert =>
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(alert => alert.severity === selectedSeverity);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(alert => alert.status === selectedStatus);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(alert => alert.type === selectedType);
    }

    setFilteredAlerts(filtered);
  }, [alerts, searchTerm, selectedSeverity, selectedStatus, selectedType]);

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusColor = (status: Alert['status']) => {
    switch (status) {
      case 'active': return 'text-red-600 bg-red-100';
      case 'acknowledged': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'dismissed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: Alert['type']) => {
    switch (type) {
      case 'objective_at_risk': return <Target className="w-5 h-5 text-red-500" />;
      case 'low_participation': return <Users className="w-5 h-5 text-yellow-500" />;
      case 'deadline_approaching': return <Clock className="w-5 h-5 text-orange-500" />;
      case 'performance_decline': return <TrendingDown className="w-5 h-5 text-red-500" />;
      case 'system_issue': return <AlertTriangle className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const stats = {
    totalAlerts: alerts.length,
    activeAlerts: alerts.filter(a => a.status === 'active').length,
    criticalAlerts: alerts.filter(a => a.severity === 'critical' && a.status === 'active').length,
    avgResponseTime: '2.5 hours', // Mock data
    resolvedToday: alerts.filter(a => a.status === 'resolved').length
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Weekly Objectives Alerts</h1>
            <p className="text-gray-600">Monitor and manage alerts for objective performance</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Settings className="w-5 h-5 mr-2" />
            Alert Settings
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAlerts}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-red-600">{stats.activeAlerts}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-orange-600">{stats.criticalAlerts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved Today</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolvedToday}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold text-purple-600">{stats.avgResponseTime}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('alerts')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'alerts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Active Alerts
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'templates'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Notification Templates
              </button>
            </nav>
          </div>

          {activeTab === 'alerts' && (
            <div className="p-6">
              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search alerts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Severities</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="acknowledged">Acknowledged</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="objective_at_risk">Objective at Risk</option>
                  <option value="low_participation">Low Participation</option>
                  <option value="deadline_approaching">Deadline Approaching</option>
                  <option value="performance_decline">Performance Decline</option>
                  <option value="system_issue">System Issue</option>
                </select>
              </div>

              {/* Alerts List */}
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <div key={alert.id} className={`border rounded-lg p-6 ${getSeverityColor(alert.severity)}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        {getTypeIcon(alert.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                              {alert.severity}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(alert.status)}`}>
                              {alert.status}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3">{alert.description}</p>
                          
                          {alert.objectiveName && (
                            <div className="mb-3">
                              <span className="text-sm font-medium text-gray-600">Related Objective: </span>
                              <span className="text-sm text-blue-600">{alert.objectiveName}</span>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-1">Impact</h4>
                              <div className="text-sm text-gray-600">
                                <div>{alert.impact.usersAffected.toLocaleString()} users affected</div>
                                <div>Risk: {alert.impact.potentialLoss}</div>
                                <div>Urgency: {alert.impact.urgency}/10</div>
                              </div>
                            </div>
                            
                            {alert.metrics.target > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-1">Metrics</h4>
                                <div className="text-sm text-gray-600">
                                  <div>Current: {alert.metrics.current.toFixed(1)}</div>
                                  <div>Target: {alert.metrics.target}</div>
                                  <div>Progress: {alert.metrics.percentage.toFixed(1)}%</div>
                                </div>
                              </div>
                            )}

                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-1">Timeline</h4>
                              <div className="text-sm text-gray-600">
                                <div>Triggered: {new Date(alert.triggeredAt).toLocaleString()}</div>
                                <div>Escalation Level: {alert.escalationLevel}</div>
                                <div>Notifications: {alert.notificationsSent}</div>
                              </div>
                            </div>
                          </div>

                          {alert.recommendations.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendations</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {alert.recommendations.map((rec, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </button>
                        {alert.status === 'active' && (
                          <button className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200">
                            Acknowledge
                          </button>
                        )}
                        {alert.status === 'acknowledged' && (
                          <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
                            Resolve
                          </button>
                        )}
                        <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                          Dismiss
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Assigned to: {alert.assignedTo || 'Unassigned'}</span>
                        <span>Channels: {alert.channels.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Send className="w-4 h-4" />
                          Notify
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                          <Archive className="w-4 h-4" />
                          Archive
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="p-6">
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            template.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {template.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(template.severity)}`}>
                            {template.severity}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Message</h4>
                            <div className="text-sm text-gray-600">
                              <div><strong>Subject:</strong> {template.message.subject}</div>
                              <div><strong>Body:</strong> {template.message.body.substring(0, 100)}...</div>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Settings</h4>
                            <div className="text-sm text-gray-600">
                              <div>Frequency: {template.frequency}</div>
                              <div>Cooldown: {template.cooldown} hours</div>
                              <div>Channels: {template.channels.join(', ')}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {template.isActive ? (
                          <button className="flex items-center gap-1 px-3 py-1 text-sm text-yellow-600 hover:bg-yellow-50 rounded-lg">
                            <Pause className="w-4 h-4" />
                            Deactivate
                          </button>
                        ) : (
                          <button className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg">
                            <Play className="w-4 h-4" />
                            Activate
                          </button>
                        )}
                        <button className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Settings className="w-4 h-4" />
                          Edit
                        </button>
                      </div>
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
