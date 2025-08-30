'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Composant simulé pour remplacer react-qr-reader
const QrReader = ({ delay, onError, onScan, style, facingMode }) => {
  const [demoInput, setDemoInput] = useState('');
  
  // Exemple de données QR pour la démo
  const exempleQrData = [
    { id: 'TRX-2025-001', label: 'Transaction Galaxy S30' },
    { id: 'TRX-2025-002', label: 'Transaction Laptop Pro X15' },
    { id: 'TRX-2025-003', label: 'Transaction Tablette Air 5' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      // Si l'input est un ID de transaction valide, on génère un faux scan
      const transactionId = demoInput.trim() || 'TRX-2025-001';
      onScan(JSON.stringify({ transactionId }));
    } catch (err) {
      onError(new Error('Format incorrect'));
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-500 mb-2">Scanner QR simulé</p>
        <div className="w-full h-40 bg-gray-100 rounded flex items-center justify-center mb-4">
          <span className="text-4xl">📷</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm text-gray-600 block mb-1">ID de transaction à simuler:</label>
          <input
            type="text"
            value={demoInput}
            onChange={(e) => setDemoInput(e.target.value)}
            placeholder="Ex: TRX-2025-001"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        
        <div>
          <p className="text-xs text-gray-500 mb-2">Exemples:</p>
          <div className="space-y-1">
            {exempleQrData.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setDemoInput(item.id)}
                className="block w-full text-left text-xs bg-gray-50 hover:bg-gray-100 p-2 rounded"
              >
                {item.label} ({item.id})
              </button>
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          Simuler la lecture
        </button>
      </form>
    </div>
  );
};

interface Transaction {
  id: string;
  client: string;
  montant: number;
  date: string;
  articles: { nom: string; prix: number; quantite: number }[];
  statut: 'terminée' | 'remboursable' | 'remboursée' | 'annulée';
}

export default function RemboursementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [remboursementPartiel, setRemboursementPartiel] = useState(false);
  const [articlesRemboursables, setArticlesRemboursables] = useState<{nom: string; prix: number; quantite: number; aRembourser: number}[]>([]);
  const [motifRemboursement, setMotifRemboursement] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pointsGagnés, setPointsGagnés] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [scannerFacing, setScannerFacing] = useState('environment'); // 'environment' pour la caméra arrière
  const [scanError, setScanError] = useState('');

  // Simulation de récupération des transactions
  useEffect(() => {
    const mockTransactions: Transaction[] = [
      {
        id: 'TRX-2025-001',
        client: 'Ahmed Benali',
        montant: 8499.99,
        date: '10/05/2025',
        articles: [
          { nom: 'Smartphone Galaxy S30', prix: 7499.99, quantite: 1 },
          { nom: 'Coque protection', prix: 500, quantite: 2 },
        ],
        statut: 'remboursable'
      },
      {
        id: 'TRX-2025-002',
        client: 'Lina Hadj',
        montant: 12999.99,
        date: '09/05/2025',
        articles: [
          { nom: 'Laptop Pro X15', prix: 12999.99, quantite: 1 },
        ],
        statut: 'remboursable'
      },
      {
        id: 'TRX-2025-003',
        client: 'Karim Ziani',
        montant: 3499.99,
        date: '08/05/2025',
        articles: [
          { nom: 'Tablette Air 5', prix: 2999.99, quantite: 1 },
          { nom: 'Étui de protection', prix: 500, quantite: 1 },
        ],
        statut: 'remboursable'
      },
      {
        id: 'TRX-2025-004',
        client: 'Sofia Menad',
        montant: 1899.97,
        date: '07/05/2025',
        articles: [
          { nom: 'Écouteurs sans fil Pro', prix: 1499.99, quantite: 1 },
          { nom: 'Chargeur rapide', prix: 399.99, quantite: 1 },
        ],
        statut: 'remboursée'
      },
    ];
    
    setTransactions(mockTransactions);
  }, []);

  const handleSelectTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    const articles = transaction.articles.map(article => ({
      ...article,
      aRembourser: 0
    }));
    setArticlesRemboursables(articles);
    setRemboursementPartiel(false);
  };

  const handleRemboursementComplet = async () => {
    if (!selectedTransaction) return;
    
    setLoading(true);
    
    // Simuler un appel à l'API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mettre à jour la liste des transactions
    const updatedTransactions = transactions.map(t => 
      t.id === selectedTransaction.id ? {...t, statut: 'remboursée' as const} : t
    );
    
    setTransactions(updatedTransactions);
    
    // Calculer les points gagnés pour la gamification
    const pointsCalculés = Math.floor(selectedTransaction.montant / 1000) * 5;
    setPointsGagnés(pointsCalculés);
    
    setLoading(false);
    setShowSuccess(true);
    
    // Réinitialiser après quelques secondes
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedTransaction(null);
      setMotifRemboursement('');
    }, 3000);
  };

  const handleRemboursementPartiel = async () => {
    if (!selectedTransaction) return;
    
    // Vérifier qu'au moins un article est sélectionné pour remboursement
    const articlesSélectionnés = articlesRemboursables.filter(a => a.aRembourser > 0);
    if (articlesSélectionnés.length === 0) return;
    
    setLoading(true);
    
    // Calculer le montant à rembourser
    const montantRemboursement = articlesSélectionnés.reduce(
      (total, article) => total + (article.prix * article.aRembourser), 0
    );
    
    // Simuler un appel à l'API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Pour la démo, on marque la transaction comme remboursée si tous les articles sont remboursés
    const tousArticlesRemboursés = articlesSélectionnés.every(
      (article, idx) => article.aRembourser === selectedTransaction.articles[idx].quantite
    );
    
    const nouveauStatut = tousArticlesRemboursés ? 'remboursée' : 'remboursable';
    
    // Mettre à jour la liste des transactions
    const updatedTransactions = transactions.map(t => 
      t.id === selectedTransaction.id ? {...t, statut: nouveauStatut as any} : t
    );
    
    setTransactions(updatedTransactions);
    
    // Calculer les points gagnés pour la gamification
    const pointsCalculés = Math.floor(montantRemboursement / 1000) * 3;
    setPointsGagnés(pointsCalculés);
    
    setLoading(false);
    setShowSuccess(true);
    
    // Réinitialiser après quelques secondes
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedTransaction(null);
      setMotifRemboursement('');
    }, 3000);
  };

  const handleAdjustQuantity = (index: number, change: number) => {
    const updatedArticles = [...articlesRemboursables];
    const nouvelleQuantite = updatedArticles[index].aRembourser + change;
    
    if (nouvelleQuantite >= 0 && nouvelleQuantite <= updatedArticles[index].quantite) {
      updatedArticles[index].aRembourser = nouvelleQuantite;
      setArticlesRemboursables(updatedArticles);
    }
  };

  const filteredTransactions = transactions.filter(transaction => 
    (transaction.statut === 'remboursable' || transaction.statut === 'terminée') &&
    (transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
     transaction.client.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const montantTotalRemboursement = articlesRemboursables.reduce(
    (total, article) => total + (article.prix * article.aRembourser), 0
  );

  // Fonctions pour la gestion du QR code
  const handleScanQr = (data: string | null) => {
    if (data) {
      try {
        // Supposons que le QR code contient l'ID de la transaction au format JSON
        const scannedData = JSON.parse(data);
        
        if (scannedData && scannedData.transactionId) {
          // Chercher la transaction correspondante
          const transaction = transactions.find(t => t.id === scannedData.transactionId);
          
          if (transaction) {
            setShowQrScanner(false); // Fermer le scanner
            
            // Sélectionner la transaction
            handleSelectTransaction(transaction);
            
            // Si un seul article, proposer directement le remboursement complet
            if (transaction.articles.length === 1) {
              setRemboursementPartiel(false);
            } else {
              // Si plusieurs articles, activer le mode remboursement partiel
              setRemboursementPartiel(true);
            }
          } else {
            setScanError('Transaction non trouvée. Veuillez réessayer.');
          }
        } else {
          setScanError('QR code invalide ou mal formaté.');
        }
      } catch (error) {
        setScanError('Erreur lors de la lecture du QR code. Format invalide.');
      }
    }
  };

  const handleScanError = (error: any) => {
    setScanError('Erreur lors de l\'accès à la caméra. Veuillez vérifier vos permissions.');
    console.error(error);
  };

  const toggleCamera = () => {
    setScannerFacing(prev => prev === 'environment' ? 'user' : 'environment');
  };

  return (
    <main className="p-4 bg-gradient-to-b from-white to-blue-50 min-h-screen pb-24">
      <header className="mb-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent text-center">
          Remboursement Client
        </h1>
        <p className="text-gray-500 text-center text-sm">Gérez les remboursements et retours clients</p>
      </header>

      {showQrScanner ? (
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={() => setShowQrScanner(false)}
              className="text-purple-600 flex items-center gap-1 text-sm font-medium"
            >
              <span>←</span> Retour
            </button>
            <button
              onClick={toggleCamera}
              className="text-purple-600 text-sm font-medium flex items-center gap-1"
            >
              <span>🔄</span> Changer caméra
            </button>
          </div>
          
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 text-center">Scanner le QR code du ticket</h2>
            <p className="text-gray-500 text-center text-sm mb-4">Positionnez le QR code dans le cadre</p>
            
            <div className="qr-reader-container max-w-sm mx-auto">
              <QrReader
                delay={300}
                onError={handleScanError}
                onScan={handleScanQr}
                style={{ width: '100%' }}
                facingMode={scannerFacing}
              />
            </div>
            
            {scanError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mt-4 text-sm text-center">
                {scanError}
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher par ID ou nom client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span className="absolute right-3 top-3 text-gray-400">🔍</span>
            </div>
            
            <button
              onClick={() => {
                setShowQrScanner(true);
                setScanError('');
              }}
              className="mt-4 w-full bg-purple-600 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors"
            >
              <span className="text-xl">📷</span>
              Scanner le QR code du ticket client
            </button>
          </div>

          {!selectedTransaction ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-medium text-gray-700">Transactions récentes</h2>
                <span className="text-sm text-purple-600 font-medium">
                  {filteredTransactions.length} transactions trouvées
                </span>
              </div>
              
              {filteredTransactions.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {filteredTransactions.map((transaction) => (
                    <div 
                      key={transaction.id}
                      onClick={() => handleSelectTransaction(transaction)}
                      className="p-4 hover:bg-purple-50 transition-colors cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800">{transaction.id}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              transaction.statut === 'remboursable' ? 'bg-green-100 text-green-700' : 
                              transaction.statut === 'remboursée' ? 'bg-blue-100 text-blue-700' : 
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {transaction.statut === 'remboursable' ? 'Remboursable' : 
                               transaction.statut === 'remboursée' ? 'Déjà remboursée' : 'Terminée'}
                            </span>
                          </div>
                          <p className="text-gray-600">{transaction.client}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">{transaction.montant.toLocaleString()} DA</p>
                          <p className="text-xs text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h3 className="text-gray-800 font-medium mb-1">Aucune transaction trouvée</h3>
                  <p className="text-gray-500 text-sm">Modifiez votre recherche ou vérifiez plus tard</p>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <button 
                    onClick={() => setSelectedTransaction(null)} 
                    className="text-purple-600 flex items-center gap-1 text-sm font-medium"
                  >
                    <span>←</span> Retour
                  </button>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedTransaction.statut === 'remboursable' ? 'bg-green-100 text-green-700' : 
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedTransaction.statut === 'remboursable' ? 'Remboursable' : 'Terminée'}
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Détails de la Transaction</h2>
                  <div className="grid grid-cols-2 gap-y-2 mt-2 text-sm">
                    <div className="text-gray-600">ID Transaction:</div>
                    <div className="font-medium text-gray-800">{selectedTransaction.id}</div>
                    <div className="text-gray-600">Client:</div>
                    <div className="font-medium text-gray-800">{selectedTransaction.client}</div>
                    <div className="text-gray-600">Date:</div>
                    <div className="font-medium text-gray-800">{selectedTransaction.date}</div>
                    <div className="text-gray-600">Montant total:</div>
                    <div className="font-medium text-gray-800">{selectedTransaction.montant.toLocaleString()} DA</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">Articles achetés</h3>
                    <div className="flex items-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={remboursementPartiel} 
                          onChange={() => setRemboursementPartiel(!remboursementPartiel)} 
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        <span className="ml-2 text-sm font-medium text-gray-600">
                          Remboursement partiel
                        </span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Liste des articles */}
                  <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                    <div className="divide-y divide-gray-100">
                      {selectedTransaction.articles.map((article, index) => (
                        <div key={index} className="p-3 flex justify-between items-center">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{article.nom}</p>
                            <div className="flex gap-4 text-sm text-gray-600">
                              <span>{article.prix.toLocaleString()} DA</span>
                              <span>× {article.quantite}</span>
                              <span className="font-medium">
                                {(article.prix * article.quantite).toLocaleString()} DA
                              </span>
                            </div>
                          </div>
                          
                          {remboursementPartiel && (
                            <div className="flex items-center">
                              <button 
                                onClick={() => handleAdjustQuantity(index, -1)}
                                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-l-lg border border-gray-300 hover:bg-gray-200 transition-colors"
                                disabled={articlesRemboursables[index].aRembourser <= 0}
                              >
                                -
                              </button>
                              <div className="w-10 h-8 flex items-center justify-center border-t border-b border-gray-300 bg-white">
                                {articlesRemboursables[index].aRembourser}
                              </div>
                              <button 
                                onClick={() => handleAdjustQuantity(index, 1)}
                                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-r-lg border border-gray-300 hover:bg-gray-200 transition-colors"
                                disabled={articlesRemboursables[index].aRembourser >= article.quantite}
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Motif du remboursement
                  </label>
                  <select
                    value={motifRemboursement}
                    onChange={(e) => setMotifRemboursement(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Sélectionnez un motif...</option>
                    <option value="defectueux">Produit défectueux</option>
                    <option value="attentes">Ne répond pas aux attentes</option>
                    <option value="erreur">Erreur de commande</option>
                    <option value="double">Achat en double</option>
                    <option value="autre">Autre raison</option>
                  </select>
                </div>
                
                {remboursementPartiel && (
                  <div className="bg-purple-50 rounded-lg p-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-purple-800">Montant à rembourser:</span>
                      <span className="font-bold text-lg text-purple-800">
                        {montantTotalRemboursement.toLocaleString()} DA
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-center gap-4">
                  {remboursementPartiel ? (
                    <button
                      onClick={handleRemboursementPartiel}
                      disabled={loading || !motifRemboursement || montantTotalRemboursement === 0}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Traitement...
                        </>
                      ) : (
                        "Rembourser les articles sélectionnés"
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleRemboursementComplet}
                      disabled={loading || !motifRemboursement}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Traitement...
                        </>
                      ) : (
                        "Rembourser le montant complet"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}
      
      {/* Modal de succès */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl p-6 max-w-xs w-full mx-4 transform animate-scale-in text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Remboursement réussi!</h3>
            <p className="text-gray-600 mb-4">Le remboursement a été traité avec succès.</p>
            
            {/* Animation de points gagnés */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="text-sm font-medium text-gray-600">Vous avez gagné</div>
              <div className="flex items-center gap-1 text-amber-600 font-bold">
                <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-xs">⭐</span>
                </div>
                <div className="animate-bounce">{pointsGagnés} points</div>
              </div>
            </div>
            
            <p className="text-sm text-green-600">Le client recevra une notification du remboursement</p>
          </div>
        </div>
      )}
        {/* Les styles d'animation ont été déplacés dans globals.css */}
    </main>
  );
}