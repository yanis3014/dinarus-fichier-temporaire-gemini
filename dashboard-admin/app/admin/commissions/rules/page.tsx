'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  Plus, 
  Search, 
  Filter,
  Download,
  Upload,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreVertical,
  ArrowUpDown,
  Copy,
  Calendar,
  Users,
  TrendingUp,
  AlertCircle,
  Info,
  Zap,
  Target,
  Award,
  DollarSign
} from 'lucide-react';
import commissionService from '@/lib/commissionService';
import {
  CommissionRule,
  CommissionType,
  CommissionStructure,
  CommissionCondition
} from '@/types/commission';

const commissionTypeLabels: Record<CommissionType, string> = {
  'transaction': 'Transaction',
  'referral': 'Parrainage',
  'merchant_onboarding': 'Onboarding Marchand',
  'user_registration': 'Inscription Utilisateur',
  'subscription': 'Abonnement',
  'affiliate': 'Affilié',
  'performance': 'Performance',
  'bonus': 'Bonus',
  'custom': 'Personnalisé'
};

const commissionTypeIcons: Record<CommissionType, React.ReactNode> = {
  'transaction': <DollarSign className="w-4 h-4" />,
  'referral': <Users className="w-4 h-4" />,
  'merchant_onboarding': <Target className="w-4 h-4" />,
  'user_registration': <Users className="w-4 h-4" />,
  'subscription': <Calendar className="w-4 h-4" />,
  'affiliate': <TrendingUp className="w-4 h-4" />,
  'performance': <Award className="w-4 h-4" />,
  'bonus': <Zap className="w-4 h-4" />,
  'custom': <Settings className="w-4 h-4" />
};

interface RuleFormData {
  name: string;
  description: string;
  type: CommissionType;
  structure: CommissionStructure;
  priority: number;
  conditions: CommissionCondition[];
  isActive: boolean;
}

const initialFormData: RuleFormData = {
  name: '',
  description: '',
  type: 'transaction',
  structure: {
    type: 'percentage',
    value: 0,
    minAmount: 0,
    maxAmount: undefined
  },
  priority: 1,
  conditions: [],
  isActive: true
};

export default function CommissionRulesPage() {
  const [rules, setRules] = useState<CommissionRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<CommissionRule | null>(null);  const [formData, setFormData] = useState<RuleFormData>(initialFormData);

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      setIsLoading(true);
      const rulesData = await commissionService.getCommissionRules();
      setRules(rulesData);
    } catch (error) {
      console.error('Erreur lors du chargement des règles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRule = async (ruleId: string) => {
    try {
      await commissionService.toggleRuleStatus(ruleId);
      await loadRules();
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette règle ?')) return;
    
    try {
      await commissionService.deleteCommissionRule(ruleId);
      await loadRules();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleEditRule = (rule: CommissionRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      description: rule.description,
      type: rule.type,
      structure: rule.structure,
      conditions: rule.conditions,
      priority: rule.priority,
      isActive: rule.isActive
    });
    setShowForm(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingRule) {
        await commissionService.updateCommissionRule(editingRule.id, {
          ...formData,
          updatedAt: new Date().toISOString()
        });
      } else {
        await commissionService.createCommissionRule({
          ...formData,
          createdBy: 'admin_current' // En réalité, on prendrait l'utilisateur connecté
        });
      }
      
      setShowForm(false);
      setEditingRule(null);
      resetForm();
      await loadRules();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };
  const resetForm = () => {
    setFormData(initialFormData);
  };

  const addCondition = () => {
    setFormData(prev => ({
      ...prev,
      conditions: [
        ...prev.conditions,
        { field: '', operator: 'equals', value: '' }
      ]
    }));
  };

  const removeCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const updateCondition = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.map((condition, i) => 
        i === index ? { ...condition, [field]: value } : condition
      )
    }));
  };

  const formatStructureDescription = (structure: CommissionStructure) => {
    switch (structure.type) {
      case 'fixed':
        return `${structure.value}€ fixe`;
      case 'percentage':
        return `${structure.value}% du montant`;
      case 'tiered':
        return `Commission progressive (${structure.tiers?.length || 0} niveaux)`;
      case 'hybrid':
        return `${structure.fixedPart}€ + ${structure.percentagePart}%`;
      default:
        return 'Non définie';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Règles de Commission</h1>
          <p className="text-gray-600">Configurez les règles de calcul des commissions</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Règle
        </button>
      </div>

      {/* Liste des règles */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Règles Actives</h2>
            <div className="text-sm text-gray-500">
              {rules.filter(r => r.isActive).length} sur {rules.length} règles actives
            </div>
          </div>

          <div className="space-y-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={`border rounded-lg p-4 ${
                  rule.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{rule.name}</h3>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {commissionTypeLabels[rule.type]}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        rule.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                        Priorité {rule.priority}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{rule.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Structure</h4>
                        <p className="text-sm text-gray-600">
                          {formatStructureDescription(rule.structure)}
                        </p>
                        {rule.structure.minAmount && (
                          <p className="text-xs text-gray-500">
                            Min: {rule.structure.minAmount}€
                          </p>
                        )}
                        {rule.structure.maxAmount && (
                          <p className="text-xs text-gray-500">
                            Max: {rule.structure.maxAmount}€
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Conditions</h4>
                        {rule.conditions.length > 0 ? (
                          <div className="space-y-1">
                            {rule.conditions.map((condition, index) => (
                              <p key={index} className="text-sm text-gray-600">
                                {condition.field} {condition.operator} {JSON.stringify(condition.value)}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">Aucune condition</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Créée le {new Date(rule.createdAt).toLocaleDateString('fr-FR')} par {rule.createdBy}
                      {rule.updatedAt !== rule.createdAt && (
                        <span> • Modifiée le {new Date(rule.updatedAt).toLocaleDateString('fr-FR')}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleToggleRule(rule.id)}
                      className={`p-2 rounded-lg ${
                        rule.isActive 
                          ? 'text-green-600 hover:bg-green-100' 
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={rule.isActive ? 'Désactiver' : 'Activer'}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>                    <button
                      onClick={() => handleEditRule(rule)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                      title="Modifier"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {rules.length === 0 && (
            <div className="text-center py-12">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune règle configurée</h3>
              <p className="text-gray-500 mb-4">
                Commencez par créer votre première règle de commission.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer une règle
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de formulaire */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingRule ? 'Modifier la règle' : 'Nouvelle règle de commission'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingRule(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitForm} className="space-y-6">
                {/* Informations de base */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom de la règle *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type de commission *
                    </label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as CommissionType }))}
                    >
                      {Object.entries(commissionTypeLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                {/* Structure de commission */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Structure de Commission</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type de structure *
                      </label>
                      <select
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={formData.structure.type}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          structure: {
                            ...prev.structure,
                            type: e.target.value as any
                          }
                        }))}
                      >
                        <option value="fixed">Montant fixe</option>
                        <option value="percentage">Pourcentage</option>
                        <option value="tiered">Progressive</option>
                        <option value="hybrid">Hybride</option>
                      </select>
                    </div>

                    {(formData.structure.type === 'fixed' || formData.structure.type === 'percentage') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Valeur {formData.structure.type === 'percentage' ? '(%)' : '(€)'}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          value={formData.structure.value || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            structure: {
                              ...prev.structure,
                              value: parseFloat(e.target.value) || 0
                            }
                          }))}
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priorité
                      </label>
                      <input
                        type="number"
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                  </div>

                  {/* Limites min/max */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Montant minimum (€)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={formData.structure.minAmount || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          structure: {
                            ...prev.structure,
                            minAmount: parseFloat(e.target.value) || undefined
                          }
                        }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Montant maximum (€)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={formData.structure.maxAmount || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          structure: {
                            ...prev.structure,
                            maxAmount: parseFloat(e.target.value) || undefined
                          }
                        }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Conditions */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Conditions</h3>
                    <button
                      type="button"
                      onClick={addCondition}
                      className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter une condition
                    </button>
                  </div>

                  {formData.conditions.map((condition, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        placeholder="Champ (ex: transaction.amount)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={condition.field}
                        onChange={(e) => updateCondition(index, 'field', e.target.value)}
                      />
                      
                      <select
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={condition.operator}
                        onChange={(e) => updateCondition(index, 'operator', e.target.value)}
                      >
                        <option value="equals">égal à</option>
                        <option value="greater_than">supérieur à</option>
                        <option value="less_than">inférieur à</option>
                        <option value="contains">contient</option>
                        <option value="in">dans la liste</option>
                      </select>
                      
                      <input
                        type="text"
                        placeholder="Valeur"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={condition.value}
                        onChange={(e) => updateCondition(index, 'value', e.target.value)}
                      />
                      
                      <button
                        type="button"
                        onClick={() => removeCondition(index)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Statut */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Règle active
                  </label>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingRule(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
                  >
                    {editingRule ? 'Mettre à jour' : 'Créer la règle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
