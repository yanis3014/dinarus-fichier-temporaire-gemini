'use client';
import React, { useState } from 'react';
import Link from 'next/link';

// Type pour les articles d'une transaction
interface Article {
  nom: string;
  quantité: number;
  prix: number;
}

// Interface pour les transactions
interface Transaction {
  id: number;
  type: string;
  montant: string;
  description: string;
  source: string;
  date: string;
  dateISO: string;
  emoji: string;
  color: string;
  articles: Article[];
}

const HistoriquePage = () => {
  const [filterType, setFilterType] = useState('tous');
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exportingPDF, setExportingPDF] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Données d'exemple pour les transactions
  const transactions: Transaction[] = [
    {
      id: 1,
      type: 'paiement',
      montant: '+1 500 DA',
      description: 'Paiement reçu',
      source: 'Client #932',
      date: 'Il y a 2h',
      dateISO: '2025-05-15',
      emoji: '💰',
      color: 'green',
      articles: [
        { nom: 'Café', quantité: 2, prix: 400 },
        { nom: 'Sandwich', quantité: 2, prix: 550 }
      ]
    },
    {
      id: 2,
      type: 'retrait',
      montant: '-500 DA',
      description: 'Retrait validé',
      source: 'Vers CCP',
      date: 'Il y a 5j',
      dateISO: '2025-05-10',
      emoji: '💸',
      color: 'red',
      articles: []
    },    {
      id: 3,
      type: 'remboursement',
      montant: '-250 DA',
      description: 'Remboursement client',
      source: 'Commande #154',
      date: 'Il y a 1s',
      dateISO: '2025-05-15',
      emoji: '🔄',
      color: 'blue',
      articles: [
        { nom: 'Thé', quantité: 1, prix: 150 },
        { nom: 'Gâteau', quantité: 1, prix: 100 }
      ]
    },
    {
      id: 4,
      type: 'paiement',
      montant: '+2 000 DA',
      description: 'Paiement reçu',
      source: 'Client #845',
      date: 'Il y a 3j',
      dateISO: '2025-05-12', 
      emoji: '💰',
      color: 'green',
      articles: [
        { nom: 'Pizza', quantité: 2, prix: 600 },
        { nom: 'Glace', quantité: 3, prix: 250 },
        { nom: 'Café', quantité: 1, prix: 200 }
      ]
    }
  ];

  // Obtenir la date d'aujourd'hui au format YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];
  
  // Filtrer les transactions selon le type et les dates
  const filteredTransactions = transactions.filter(transaction => {
    let matchesType = filterType === 'tous' || transaction.type === filterType;
    
    let matchesDateRange = true;
    if (startDate && transaction.dateISO < startDate) matchesDateRange = false;
    if (endDate && transaction.dateISO > endDate) matchesDateRange = false;
    
    return matchesType && matchesDateRange;
  });

  // Fonction pour obtenir la couleur CSS en fonction du type de transaction
  const getColorClasses = (color: string) => {
    switch(color) {
      case 'green': return { bg: 'bg-green-100', text: 'text-green-600' };
      case 'red': return { bg: 'bg-red-100', text: 'text-red-600' };
      case 'blue': return { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'gray': 
      default: return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  // Calculer les totaux
  const totalEntrees = filteredTransactions
    .filter(t => t.montant.startsWith('+'))
    .reduce((total, t) => total + parseFloat(t.montant.replace('+', '').replace(' DA', '').replace(' ', '')), 0);
    
  const totalSorties = filteredTransactions
    .filter(t => t.montant.startsWith('-'))
    .reduce((total, t) => total + parseFloat(t.montant.replace('-', '').replace(' DA', '').replace(' ', '')), 0);

  // Fonction pour simuler l'exportation PDF
  const simulateExportPDF = () => {
    setExportingPDF(true);
    
    // Simulation d'un temps de traitement
    setTimeout(() => {
      setExportingPDF(false);
      
      // Afficher un message de confirmation
      const notification = document.createElement('div');
      notification.className = "fixed bottom-20 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full bg-green-500 text-white text-sm font-medium z-50";
      notification.textContent = "Export PDF généré avec succès!";
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
      
      setShowExportModal(false);
    }, 2000);
  };

  return (
    <main className="p-4 pb-24 bg-gradient-to-b from-white to-blue-50 min-h-screen text-gray-800 font-sans max-w-md mx-auto">
      {/* Header */}
      <header className="mb-6 relative">
        <div className="flex items-center gap-3 mb-3">
          <Link href="/" className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md">
            <span className="text-gray-600">←</span>
          </Link>
          <h1 className="text-lg font-bold text-gray-800">📋 Historique</h1>
        </div>
          <section className="bg-white shadow-md rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="text-xs text-gray-500">Consultez l'historique de vos transactions</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDateFilter(!showDateFilter)}
                className="text-sm text-purple-600 font-medium flex items-center gap-1"
              >
                <span>📆</span> Filtrer par date
              </button>
              <button
                onClick={() => setShowExportModal(true)}
                className="text-sm text-purple-600 font-medium flex items-center gap-1"
              >
                <span>📄</span> Exporter
              </button>
            </div>
          </div>
          
          {/* Filtre par date personnalisée */}
          {showDateFilter && (
            <div className="mt-3 bg-gray-50 p-3 rounded-lg">
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label htmlFor="start-date" className="block text-xs text-gray-500 mb-1">Date de début</label>
                  <input 
                    type="date" 
                    id="start-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    max={today}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1"
                  />
                </div>
                <div>
                  <label htmlFor="end-date" className="block text-xs text-gray-500 mb-1">Date de fin</label>
                  <input 
                    type="date" 
                    id="end-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    max={today}
                    min={startDate}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1"
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <button 
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="text-xs text-gray-500"
                >
                  Réinitialiser
                </button>
                <button 
                  onClick={() => setEndDate(today)}
                  className="text-xs text-purple-600"
                >
                  Aujourd'hui
                </button>
              </div>
            </div>
          )}
        </section>
      </header>

      {/* Filtres */}
      <section className="mb-6 flex gap-2 overflow-x-auto pb-2">
        <button 
          onClick={() => setFilterType('tous')} 
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
            filterType === 'tous' 
              ? 'bg-purple-600 text-white' 
              : 'bg-white text-gray-700'
          }`}
        >
          Tous
        </button>
        <button 
          onClick={() => setFilterType('paiement')} 
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
            filterType === 'paiement' 
              ? 'bg-green-600 text-white' 
              : 'bg-white text-gray-700'
          }`}
        >
          💰 Paiements
        </button>
        <button 
          onClick={() => setFilterType('retrait')} 
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
            filterType === 'retrait' 
              ? 'bg-red-600 text-white' 
              : 'bg-white text-gray-700'
          }`}
        >
          💸 Retraits
        </button>        <button 
          onClick={() => setFilterType('remboursement')} 
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
            filterType === 'remboursement' 
              ? 'bg-red-600 text-white' 
              : 'bg-white text-gray-700'
          }`}
        >
          🔄 Remboursements
        </button>
      </section>

      {/* Résumé */}
      <section className="bg-white shadow-md rounded-2xl p-4 mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-2">
          📊 Résumé
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-xl">
            <p className="text-xs text-gray-500">Total des entrées</p>
            <p className="text-lg font-bold text-green-600">+{totalEntrees.toFixed(2)} DA</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl">
            <p className="text-xs text-gray-500">Total des sorties</p>
            <p className="text-lg font-bold text-red-600">-{totalSorties.toFixed(2)} DA</p>
          </div>
        </div>
      </section>

      {/* Liste des transactions */}
      <section className="bg-white shadow-md rounded-2xl p-4 mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-3">
          {filteredTransactions.length} transactions
        </h3>
        
        <div className="space-y-3 text-sm">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map(transaction => {
              const colorClasses = getColorClasses(transaction.color);
              return (                <div key={transaction.id} className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${
                        transaction.type === 'remboursement' 
                          ? 'bg-red-100 text-red-600' 
                          : colorClasses.bg
                      } rounded-full flex items-center justify-center ${
                        transaction.type === 'remboursement'
                          ? 'text-red-600'
                          : colorClasses.text
                      }`}>
                        {transaction.emoji}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{transaction.source} • {transaction.date}</p>
                      </div>
                    </div>
                    <p className={`font-bold ${
                      transaction.montant.startsWith('+') 
                        ? 'text-green-600' 
                        : 'text-red-500'
                    }`}>
                      {transaction.montant}
                    </p>
                  </div>
                  
                  {/* Articles de la transaction si disponibles */}
                  {transaction.articles && transaction.articles.length > 0 && (
                    <div className="ml-11 mt-2 border-t border-gray-200 pt-2">
                      <p className="text-xs text-gray-500 mb-1">Détails:</p>
                      {transaction.articles.map((article, index) => (
                        <div key={index} className="flex justify-between text-xs text-gray-600">
                          <span>{article.nom} x{article.quantité}</span>
                          <span>{article.prix * article.quantité} DA</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-4 text-center text-gray-500">
              Aucune transaction trouvée
            </div>
          )}
        </div>
      </section>

      {/* Bouton pour charger plus */}
      {filteredTransactions.length > 0 && (
        <div className="flex justify-center mb-6">
          <button 
            className="text-purple-600 text-sm font-medium bg-white px-4 py-2 rounded-full shadow-sm hover:bg-purple-50 transition-colors"
          >
            Charger plus de transactions
          </button>
        </div>
      )}
      
      {/* Modal d'export PDF */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-5 shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center">Exporter l'historique en PDF</h2>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Sélectionnez la période pour votre export PDF:
              </p>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label htmlFor="export-start-date" className="block text-xs text-gray-500 mb-1">Date de début</label>
                  <input 
                    type="date" 
                    id="export-start-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    max={today}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="export-end-date" className="block text-xs text-gray-500 mb-1">Date de fin</label>
                  <input 
                    type="date" 
                    id="export-end-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    max={today}
                    min={startDate}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-xl mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Transactions sélectionnées:</span>
                  <span className="text-sm font-bold text-purple-600">{filteredTransactions.length}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-500">Total des entrées:</span>
                  <span className="text-xs text-green-600">+{totalEntrees.toFixed(2)} DA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Total des sorties:</span>
                  <span className="text-xs text-red-600">-{totalSorties.toFixed(2)} DA</span>
                </div>
              </div>
              
              <div className="flex justify-between mb-2">
                <button 
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="text-xs text-gray-500"
                >
                  Réinitialiser les dates
                </button>
                <button 
                  onClick={() => setEndDate(today)}
                  className="text-xs text-purple-600"
                >
                  Aujourd'hui
                </button>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 py-3 border border-gray-300 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={simulateExportPDF}
                disabled={exportingPDF}
                className={`flex-1 py-3 bg-purple-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 ${
                  exportingPDF ? 'opacity-70' : 'opacity-100'
                }`}
              >
                {exportingPDF ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Export en cours...
                  </>
                ) : 'Exporter en PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default HistoriquePage;