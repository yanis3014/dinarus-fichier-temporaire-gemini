'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Merchant } from '@/types/merchant';

interface SuggestedMerchant {
  name: string;
  address: string;
  category: string;
  location: {
    lat: number;
    lng: number;
  };
  suggestedBy: {
    id: string;
    name: string;
    phone: string;
  };
  suggestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface MerchantSuggestionFormProps {
  suggestion: SuggestedMerchant;
  onClose: () => void;
  onApprove: (merchant: Merchant) => void;
  onReject: (id: string) => void;
}

export default function MerchantSuggestionForm({
  suggestion,
  onClose,
  onApprove,
  onReject
}: MerchantSuggestionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      const newMerchant: Merchant = {
        id: crypto.randomUUID(),
        name: suggestion.name,
        category: suggestion.category,
        rating: 0,
        location: suggestion.location,
        address: suggestion.address,
        status: 'active',
        tags: [],
        services: []
      };
      
      await onApprove(newMerchant);
      onClose();
    } catch (error) {
      console.error('Error approving merchant:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      await onReject(suggestion.suggestedBy.id);
      onClose();
    } catch (error) {
      console.error('Error rejecting merchant:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Suggestion de commerçant</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Informations du commerçant */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Informations du commerce</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Nom :</span> {suggestion.name}</p>
              <p><span className="font-medium">Adresse :</span> {suggestion.address}</p>
              <p><span className="font-medium">Catégorie :</span> {suggestion.category}</p>
              <p><span className="font-medium">Coordonnées :</span> {suggestion.location.lat}, {suggestion.location.lng}</p>
            </div>
          </div>

          {/* Informations du suggéreur */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Suggéré par</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Nom :</span> {suggestion.suggestedBy.name}</p>
              <p><span className="font-medium">Téléphone :</span> {suggestion.suggestedBy.phone}</p>
              <p><span className="font-medium">Date :</span> {new Date(suggestion.suggestedAt).toLocaleDateString('fr-DZ')}</p>
            </div>
          </div>

          {/* Aperçu sur la carte */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Aperçu sur la carte</h3>
            <div className="h-48 bg-gray-100 rounded-lg">
              <iframe
                className="w-full h-full rounded-lg"
                frameBorder="0"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${suggestion.location.lng - 0.01},${suggestion.location.lat - 0.01},${suggestion.location.lng + 0.01},${suggestion.location.lat + 0.01}&layer=mapnik&marker=${suggestion.location.lat},${suggestion.location.lng}`}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 bg-gray-50 rounded-b-lg">
          <button
            onClick={handleReject}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Rejeter
          </button>
          <button
            onClick={handleApprove}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-dinary-turquoise rounded-md hover:bg-dinary-turquoise-dark"
          >
            Approuver
          </button>
        </div>
      </div>
    </div>
  );
}
