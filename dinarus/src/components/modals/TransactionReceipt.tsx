'use client';

import React, { useEffect, useState } from 'react';

// Type pour une transaction
export interface TransactionDetails {
  id: number;
  type: string;
  category: string;
  icon: string;
  bgColor: string;
  iconColor: string;
  name: string;
  date: string;
  amount: string;
  isPositive: boolean;
  points: string;
  // Informations supplémentaires pour le reçu
  reference?: string;
  time?: string;
  description?: string;
  merchant?: {
    name: string;
    address?: string;
    phone?: string;
  };
}

interface TransactionReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: TransactionDetails | null;
}

export default function TransactionReceipt({
  isOpen,
  onClose,
  transaction
}: TransactionReceiptProps) {
  // État pour gérer l'animation
  const [isVisible, setIsVisible] = useState(false);

  // Empêcher le défilement quand le modal est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Déclencher l'animation d'entrée
      setTimeout(() => setIsVisible(true), 10);
    } else {
      document.body.style.overflow = 'auto';
      setIsVisible(false);
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Extraire la date et l'heure
  const extractDateTime = (dateString: string) => {
    const parts = dateString.split('•').map(part => part.trim());
    return {
      date: parts[0] || '',
      time: parts[1] || '00:00'
    };
  };

  // Déterminer le statut de la transaction
  const getTransactionStatus = (type: string, isPositive: boolean) => {
    if (type === 'recharge' || (type === 'reward' && isPositive)) {
      return { text: 'Reçu', color: 'text-green-600', bgColor: 'bg-green-100' };
    } else if (type === 'payment' && !isPositive) {
      return { text: 'Payé', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    } else {
      return { text: 'Complété', color: 'text-gray-600', bgColor: 'bg-gray-100' };
    }
  };

  // Générer une référence si elle n'existe pas
  const generateReference = (id: number) => {
    return `TXN${id.toString().padStart(6, '0')}`;
  };

  // Fonction pour empêcher la propagation des clics à l'intérieur du reçu
  const handleReceiptClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  // Fonction pour déterminer si c'est un paiement en magasin
  const isInStorePayment = (transaction: TransactionDetails) => {
    return transaction.type === 'payment' && !transaction.isPositive && transaction.merchant;
  };

  // Fonction pour détecter les appareils mobiles
  const isMobile = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640;
    }
    return false;
  };

  if (!transaction || !isOpen) return null;

  const { date, time } = extractDateTime(transaction.date);
  const status = getTransactionStatus(transaction.type, transaction.isPositive);
  const reference = transaction.reference || generateReference(transaction.id);

  return (
    <>
      {/* Overlay avec effet de flou - ferme le reçu quand on clique dessus */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      
      {/* Reçu avec effet glassmorphisme - Centré sur l'écran avec animation CSS */}
      <div 
        className={`fixed inset-0 flex items-center justify-center z-50 px-4 py-6 sm:p-5 overflow-y-auto transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      >
        <div
          className={`relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/50 w-full max-w-md max-h-[80vh] mb-16 overflow-y-auto transition-all duration-300 ${isVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-5'}`}
          onClick={handleReceiptClick}
        >
          {/* Effets décoratifs */}
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-br from-amber-500/10 to-pink-500/10 blur-xl"></div>
          
          {/* En-tête du reçu */}
          <div className="relative pt-6 px-4 sm:px-6 pb-4 border-b border-gray-200/50">
            <div className="absolute top-4 right-4">
              <button 
                onClick={onClose} 
                className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
                aria-label="Fermer"
              >
                <span className="text-sm">✕</span>
              </button>
            </div>
            
            <div className="flex items-start">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${transaction.bgColor} rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4`}>
                <span className="text-xl sm:text-2xl">{transaction.icon}</span>
              </div>
              <div className="flex-grow">
                <h2 className="text-lg sm:text-xl font-bold">{transaction.name}</h2>
                <div className="flex items-center mt-1 flex-wrap">
                  <span className={`px-2 py-0.5 text-xs ${status.bgColor} ${status.color} rounded-full mr-2 font-medium mb-1 sm:mb-0`}>
                    {status.text}
                  </span>
                  <span className="text-xs text-gray-500">{reference}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Montant en évidence avec animation */}
          <div 
            className={`pt-5 sm:pt-6 pb-3 sm:pb-4 px-4 sm:px-6 text-center bg-gradient-to-r from-white/40 to-gray-50/40 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
          >
            <p className="text-sm text-gray-500">Montant</p>
            <p className={`text-2xl sm:text-3xl font-bold mt-1 ${transaction.isPositive ? 'text-green-600' : ''}`}>
              {transaction.amount} DA
            </p>
            <p className="text-xs text-gray-500 mt-1">{transaction.points}</p>
          </div>
          
          {/* Détails de la transaction */}
          <div 
            className={`px-4 sm:px-6 py-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="space-y-3">
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Date</p>
                <p className="text-sm font-medium">{date}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Heure</p>
                <p className="text-sm font-medium">{time}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Catégorie</p>
                <p className="text-sm font-medium">{transaction.category}</p>
              </div>
              
              {transaction.description && (
                <div className="pt-2">
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-sm mt-1 break-words">{transaction.description}</p>
                </div>
              )}
              
              {transaction.merchant && (
                <div className="pt-2">
                  <p className="text-sm text-gray-500 mb-1">Commerçant</p>
                  <div className="bg-gray-50/70 rounded-xl p-3">
                    <p className="text-sm font-medium">{transaction.merchant.name}</p>
                    {transaction.merchant.address && (
                      <p className="text-xs text-gray-500 mt-1 break-words">{transaction.merchant.address}</p>
                    )}
                    {transaction.merchant.phone && (
                      <p className="text-xs text-gray-500 mt-0.5">{transaction.merchant.phone}</p>
                    )}
                  </div>
                </div>
              )}
              
              {/* QR Code pour les paiements en magasin - Rendu réactif */}
              {isInStorePayment(transaction) && (
                <div className="pt-4 border-t border-gray-200/50 flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-2">Scannez pour effectuer un remboursement</div>
                  <div className="w-24 sm:w-28 h-24 sm:h-28 bg-white border border-gray-200 rounded-lg p-2 relative overflow-hidden">
                    {/* Structure du QR code préservée */}
                    <div className="w-full h-full grid grid-cols-7 grid-rows-7 gap-0.5">
                      {/* Coins du QR code */}
                      <div className="col-span-2 row-span-2 bg-black rounded-tl-lg"></div>
                      <div className="col-span-1 row-span-2 bg-white"></div>
                      <div className="col-span-1 row-span-2 bg-white"></div>
                      <div className="col-span-1 row-span-2 bg-white"></div>
                      <div className="col-span-2 row-span-2 bg-black rounded-tr-lg"></div>
                      
                      {/* Deuxième ligne */}
                      <div className="col-span-1 row-span-1 bg-black"></div>
                      <div className="col-span-1 row-span-1 bg-white"></div>
                      <div className="col-span-1 row-span-1 bg-black"></div>
                      <div className="col-span-1 row-span-1 bg-white"></div>
                      <div className="col-span-1 row-span-1 bg-black"></div>
                      <div className="col-span-1 row-span-1 bg-white"></div>
                      <div className="col-span-1 row-span-1 bg-black"></div>
                      
                      {/* Autres lignes de la grille simulée de QR code */}
                      {Array(5 * 7).fill(null).map((_, index) => (
                        <div 
                          key={index} 
                          className={`col-span-1 row-span-1 ${Math.random() > 0.7 ? 'bg-black' : 'bg-white'}`}
                        ></div>
                      ))}
                      
                      {/* Coins du bas du QR code */}
                      <div className="col-span-2 row-span-2 bg-black rounded-bl-lg"></div>
                      <div className="col-span-1 row-span-2 bg-white"></div>
                      <div className="col-span-1 row-span-2 bg-black"></div>
                      <div className="col-span-1 row-span-2 bg-white"></div>
                      <div className="col-span-2 row-span-2 bg-white"></div>
                    </div>
                    
                    {/* Petit logo Dinary au centre du QR code */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-[8px] font-bold">D</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{reference}</div>
                </div>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div 
            className={`px-4 sm:px-6 py-4 border-t border-gray-200/50 flex space-x-3 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          >
            <button className="flex-1 bg-black text-white py-2.5 sm:py-3 rounded-xl font-medium text-sm hover:bg-black/90 active:scale-[0.98] transition-all">
              Télécharger
            </button>
            <button className="w-11 h-11 sm:w-12 sm:h-12 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 active:scale-[0.98] transition-all">
              <span>📤</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}