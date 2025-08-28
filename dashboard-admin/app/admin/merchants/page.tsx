'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Store,
  TrendingUp,
  ArrowUpRight,
  DollarSign,
  Clock,
  ChevronDown,
  Search,
  Filter,
  BarChart2,
  ShoppingBag,
  Users,
  Star,
  PlusCircle
} from 'lucide-react';
import { format } from 'date-fns';
import MerchantStatCard from '../../../components/admin/MerchantStatCard';
import MerchantDetailModal from '../../../components/admin/MerchantDetailModal';
import MerchantManagement from '../../../components/admin/MerchantManagement';
import { type Merchant, merchantsData } from '../../../lib/mock-data';
import { getMerchantSuggestions } from './actions';

interface MerchantSuggestion {
  id: string;
  name: string;
  businessType: string;
  location: {
    address: string;
    city: string;
    postalCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  phone: string;
  email: string;
  notes: string;
  suggestedBy: string;
  suggestedAt: string;
  status: 'pending' | 'contacted' | 'approved' | 'rejected';
}

export default function MerchantsPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [suggestions, setSuggestions] = useState<MerchantSuggestion[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadSuggestions();
  }, []);

  async function loadSuggestions() {
    try {
      const result = await getMerchantSuggestions();
      if (result.success && result.data) {
        setSuggestions(result.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des suggestions:', error);
    }
  }

  const merchantStats = {
    totalMerchants: merchantsData.length,
    activeMerchants: merchantsData.filter((m: Merchant) => m.status === 'active').length,
    totalRevenue: merchantsData.reduce((acc: number, m: Merchant) => acc + m.revenue, 0),
    averageRating: Number(
      (merchantsData.reduce((acc: number, m: Merchant) => acc + m.rating, 0) / merchantsData.length).toFixed(1)
    ),
    totalCustomers: merchantsData.reduce((acc: number, m: Merchant) => acc + m.customersCount, 0),
    totalProducts: merchantsData.reduce((acc: number, m: Merchant) => acc + m.productsCount, 0),
    newMerchantsToday: 3,
    pendingSuggestions: merchantsData.filter(
      (m: Merchant) => m.type === 'suggested' && m.suggestion?.status === 'pending'
    ).length
  };

  const filteredMerchants = merchantsData.filter((merchant: Merchant) => {
    const nameMatch = merchant.name.toLowerCase().includes(searchQuery.toLowerCase());
    const statusMatch = selectedStatus === 'all' || merchant.status === selectedStatus;
    return nameMatch && statusMatch;
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* En-tête avec le titre et le bouton d'ajout */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Commerçants</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gérez les commerçants, leurs suggestions et leurs performances
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => router.push('/admin/merchants/nouveau')}
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-dinary-turquoise px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-dinary-turquoise-dark focus:outline-none focus:ring-2 focus:ring-dinary-turquoise focus:ring-offset-2"
          >
            <PlusCircle className="mr-2 -ml-1 h-5 w-5" />
            Nouveau commerçant
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="mt-8">
        {/* Onglets */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Onglets">
            <button
              onClick={() => setActiveTab('overview')}
              className={`${
                activeTab === 'overview'
                  ? 'border-dinary-turquoise text-dinary-turquoise'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Aperçu
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`${
                activeTab === 'suggestions'
                  ? 'border-dinary-turquoise text-dinary-turquoise'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              Suggestions
              {suggestions.length > 0 && (
                <span className="ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium bg-dinary-turquoise text-white">
                  {suggestions.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'overview' ? (
          <div className="mt-6">
            {/* Stats */}
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <MerchantStatCard
                title="Total des commerçants"
                value={merchantStats.totalMerchants}
                Icon={Store}
                trend={+15}
              />
              <MerchantStatCard
                title="Commerçants actifs"
                value={merchantStats.activeMerchants}
                Icon={TrendingUp}
                trend={+8}
              />
              <MerchantStatCard
                title="Revenu total"
                value={merchantStats.totalRevenue}
                Icon={DollarSign}
                format="currency"
                trend={+12}
              />
              <MerchantStatCard
                title="Note moyenne"
                value={merchantStats.averageRating}
                Icon={Star}
                format="decimal"
                max={5}
                trend={+0.2}
              />
            </dl>

            {/* Recherche et filtres */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="w-full sm:max-w-xs">
                <label htmlFor="search" className="sr-only">
                  Rechercher
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full rounded-md border-gray-300 pl-10 focus:border-dinary-turquoise focus:ring-dinary-turquoise sm:text-sm"
                    placeholder="Rechercher un commerçant..."
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-dinary-turquoise focus:outline-none focus:ring-dinary-turquoise sm:text-sm"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actifs</option>
                  <option value="inactive">Inactifs</option>
                  <option value="pending">En attente</option>
                </select>
              </div>
            </div>

            {/* Liste des commerçants */}
            <div className="mt-8 flex flex-col">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                        >
                          Commerçant
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Note
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Statut
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Dernière activité
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredMerchants.map((merchant) => (
                        <tr
                          key={merchant.id}
                          onClick={() => setSelectedMerchant(merchant)}
                          className="cursor-pointer hover:bg-gray-50"
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6 lg:pl-8">
                            <div className="flex items-center">
                              <div className="font-medium text-gray-900">{merchant.name}</div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              {[0, 1, 2, 3, 4].map((rating) => (
                                <Star
                                  key={rating}
                                  className={`h-5 w-5 ${
                                    rating < merchant.rating
                                      ? 'text-yellow-400'
                                      : 'text-gray-200'
                                  }`}
                                  fill="currentColor"
                                />
                              ))}
                              <span className="ml-2">{merchant.rating.toFixed(1)}</span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span
                              className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                merchant.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : merchant.status === 'inactive'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {merchant.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {format(new Date(merchant.lastActive), 'dd/MM/yyyy')}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMerchant(merchant);
                              }}
                              className="text-dinary-turquoise hover:text-dinary-turquoise-dark"
                            >
                              Voir détails
                              <span className="sr-only">, {merchant.name}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <MerchantManagement suggestions={suggestions} onRefresh={loadSuggestions} />
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {selectedMerchant && (
        <MerchantDetailModal
          merchant={selectedMerchant}
          onClose={() => setSelectedMerchant(null)}
        />
      )}
    </div>
  );
}
