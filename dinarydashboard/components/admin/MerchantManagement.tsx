'use client';

import React from 'react';
import {
  Check,
  PhoneCall,
  X,
  ChevronRight,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { updateSuggestionStatus } from '../../app/admin/merchants/actions';

interface Location {
  address: string;
  city: string;
  postalCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface MerchantSuggestion {
  id: string;
  name: string;
  businessType: string;
  location: Location;
  phone: string;
  email: string;
  notes: string;
  suggestedBy: string;
  suggestedAt: string;
  status: 'pending' | 'contacted' | 'approved' | 'rejected';
}

interface Props {
  suggestions: MerchantSuggestion[];
  onRefresh: () => void;
}

export default function MerchantManagement({ suggestions = [], onRefresh }: Props) {
  const handleStatusUpdate = async (id: string, status: MerchantSuggestion['status']) => {
    try {
      const result = await updateSuggestionStatus({ id, status });
      if (result.success) {
        onRefresh();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  if (suggestions.length === 0) {
    return (
      <div className="text-center py-12">
        <HelpCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune suggestion</h3>
        <p className="mt-1 text-sm text-gray-500">
          Il n'y a pas de nouvelles suggestions de commerçants à traiter.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {suggestions.map((suggestion) => (
          <li key={suggestion.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="truncate">
                  <div className="flex items-center space-x-3">
                    <h3 className="truncate text-sm font-medium text-gray-900">
                      {suggestion.name}
                    </h3>
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                      {suggestion.businessType}
                    </span>
                  </div>
                  <div className="mt-2 flex">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="truncate">
                        {suggestion.location.address}, {suggestion.location.city}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-shrink-0 gap-2">
                  <button
                    onClick={() => handleStatusUpdate(suggestion.id, 'contacted')}
                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dinary-turquoise"
                  >
                    <PhoneCall className="mr-1.5 h-4 w-4 text-gray-500" />
                    Contacté
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(suggestion.id, 'approved')}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Check className="mr-1.5 h-4 w-4" />
                    Approuver
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(suggestion.id, 'rejected')}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <X className="mr-1.5 h-4 w-4" />
                    Rejeter
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <div className="sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <AlertCircle className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                      {suggestion.status === 'pending' ? (
                        <span className="text-yellow-600">En attente de traitement</span>
                      ) : suggestion.status === 'contacted' ? (
                        <span className="text-blue-600">Contact établi</span>
                      ) : suggestion.status === 'approved' ? (
                        <span className="text-green-600">Approuvé</span>
                      ) : (
                        <span className="text-red-600">Rejeté</span>
                      )}
                    </div>
                    <div className="mr-6 flex items-center text-sm text-gray-500">
                      <span className="ml-2">
                        Suggéré le {new Date(suggestion.suggestedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <a
                      href={`mailto:${suggestion.email}`}
                      className="text-dinary-turquoise hover:text-dinary-turquoise-dark"
                    >
                      {suggestion.email}
                    </a>
                    <ChevronRight className="ml-1 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
