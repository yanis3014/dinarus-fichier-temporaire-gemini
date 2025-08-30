'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageHeader from '@/components/layouts/PageHeader';
import TransactionReceipt, { TransactionDetails } from '@/components/modals/TransactionReceipt';

export default function HistoriquePage() {
  const [selectedFilter, setSelectedFilter] = useState('Tout');
  const filters = ['Tout', 'Entrées', 'Sorties', 'Récompenses'];
  
  // États pour gérer l'affichage du reçu
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetails | null>(null);

  // Fonction pour ouvrir le reçu de transaction
  const handleTransactionClick = (transaction: TransactionDetails) => {
    // Enrichir la transaction avec des données supplémentaires pour le reçu
    const enhancedTransaction = {
      ...transaction,
      // Ajout d'informations spécifiques selon le type de transaction
      merchant: transaction.type === 'payment' ? {
        name: transaction.name,
        address: transaction.name === 'Café Parisien' ? '15 rue de la Paix, Paris' : 
                transaction.name === 'Supermarché Leclerc' ? 'Centre Commercial Les Floralies' : 
                transaction.name === 'Boulangerie Martin' ? '7 avenue des Lilas' : 
                transaction.name === 'Restaurant La Trattoria' ? '23 rue Voltaire' : undefined,
        phone: transaction.name === 'Café Parisien' ? '+33 1 23 45 67 89' : 
               transaction.name === 'Restaurant La Trattoria' ? '+33 1 87 65 43 21' : undefined
      } : undefined,
      description: transaction.type === 'reward' ? 'Récompense obtenue pour votre activité' : 
                  transaction.type === 'recharge' ? 'Rechargement de votre compte via carte bancaire' : undefined
    };
    
    setSelectedTransaction(enhancedTransaction);
    setShowReceipt(true);
  };

  // Données simulées des transactions
  const transactions = {
    'Mai 2025': [
      {
        id: 1,
        type: 'recharge',
        category: 'Entrée',
        icon: '📥',
        bgColor: 'bg-green-100',
        iconColor: 'text-green-600',
        name: 'Recharge compte',
        date: '11 mai • 14:32',
        amount: '+200,00',
        isPositive: true,
        points: '+20 points'
      },
      {
        id: 2,
        type: 'payment',
        category: 'Sortie',
        icon: '🍽️',
        bgColor: 'bg-red-100',
        iconColor: 'text-red-600',
        name: 'Café Parisien',
        date: '11 mai • 11:15',
        amount: '-4,50',
        isPositive: false,
        points: '+5 points'
      },
      {
        id: 3,
        type: 'payment',
        category: 'Sortie',
        icon: '🛒',
        bgColor: 'bg-red-100',
        iconColor: 'text-red-600',
        name: 'Supermarché Leclerc',
        date: '10 mai • 17:42',
        amount: '-35,75',
        isPositive: false,
        points: '+10 points'
      },
      {
        id: 4,
        type: 'reward',
        category: 'Récompense',
        icon: '🎯',
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600',
        name: 'Défi quotidien complété',
        date: '9 mai • 22:15',
        amount: 'Récompense',
        isPositive: true,
        points: '+50 points'
      },
      {
        id: 5,
        type: 'payment',
        category: 'Sortie',
        icon: '🚇',
        bgColor: 'bg-red-100',
        iconColor: 'text-red-600',
        name: 'Transport en commun',
        date: '7 mai • 08:30',
        amount: '-1,90',
        isPositive: false,
        points: '+2 points'
      }
    ],
    'Avril 2025': [
      {
        id: 6,
        type: 'reward',
        category: 'Entrée',
        icon: '🏆',
        bgColor: 'bg-green-100',
        iconColor: 'text-green-600',
        name: 'Récompense niveau 5',
        date: '25 avril • 09:15',
        amount: '+15,00',
        isPositive: true,
        points: '+0 points'
      },
      {
        id: 7,
        type: 'payment',
        category: 'Sortie',
        icon: '🥖',
        bgColor: 'bg-red-100',
        iconColor: 'text-red-600',
        name: 'Boulangerie Martin',
        date: '23 avril • 10:20',
        amount: '-3,25',
        isPositive: false,
        points: '+3 points'
      },
      {
        id: 8,
        type: 'payment',
        category: 'Sortie',
        icon: '🍝',
        bgColor: 'bg-red-100',
        iconColor: 'text-red-600',
        name: 'Restaurant La Trattoria',
        date: '21 avril • 20:15',
        amount: '-42,50',
        isPositive: false,
        points: '+15 points'
      }
    ]
  };

  // Filtrer les transactions en fonction du filtre sélectionné
  const filterTransactions = (month, filter) => {
    if (filter === 'Tout') return transactions[month];
    return transactions[month].filter(t => {
      if (filter === 'Entrées') return t.isPositive && t.type !== 'reward';
      if (filter === 'Sorties') return !t.isPositive;
      if (filter === 'Récompenses') return t.type === 'reward';
      return true;
    });
  };

  return (
    <div className="bg-white min-h-screen mb-16">
      <PageHeader 
        title="Historique" 
        emoji="📊" 
        showBackButton={true} 
        backTo="/dashboard"
        actionButton={
          <button className="p-2 relative">
            <span className="text-lg">🔍</span>
          </button>
        }
      />
      
      <div className="px-5 pb-10">
        {/* Filtres */}
        <div className="mb-6 flex items-center overflow-x-auto pb-2 -mx-1 px-1">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 ${
                selectedFilter === filter 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } text-sm rounded-full whitespace-nowrap mr-2 transition-colors`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        
        {/* Sections mensuelles */}
        {Object.keys(transactions).map((month) => {
          const filteredTransactions = filterTransactions(month, selectedFilter);
          
          if (filteredTransactions.length === 0) return null;
          
          return (
            <motion.div 
              key={month} 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-bold mb-4">{month}</h2>
              
              <div className="space-y-4">
                {filteredTransactions.map((transaction, index) => (
                  <motion.div 
                    key={transaction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: index * 0.05,
                      duration: 0.2
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
                    onClick={() => handleTransactionClick(transaction)}
                  >
                    <div className="flex justify-between">
                      <div className="flex items-start">
                        <div className={`w-11 h-11 ${transaction.bgColor} rounded-xl flex items-center justify-center mr-3`}>
                          <span className="text-xl">{transaction.icon}</span>
                        </div>
                        <div>
                          <p className="font-medium">{transaction.name}</p>
                          <div className="flex items-center">
                            <p className="text-xs text-gray-500 mr-2">{transaction.date}</p>
                            <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full">{transaction.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${transaction.isPositive ? 'text-green-600' : ''}`}>
                          {typeof transaction.amount === 'string' && transaction.amount.startsWith('+') 
                            ? transaction.amount 
                            : transaction.amount} DA
                        </p>
                        <p className="text-xs text-gray-500">{transaction.points}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
        
        {/* Bouton pour voir plus */}
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl inline-flex items-center transition-colors">
            Voir plus d'historique
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="ml-2">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </motion.div>
      </div>

      {/* Composant du reçu de transaction */}
      <TransactionReceipt 
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
}