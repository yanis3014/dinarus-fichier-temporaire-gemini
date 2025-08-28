'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const RetraitsPage = () => {
  // États pour gérer l'interface utilisateur et les données
  const [montant, setMontant] = useState<string>('');
  const [formValid, setFormValid] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [confirmationShown, setConfirmationShown] = useState<boolean>(false);
  const [successShown, setSuccessShown] = useState<boolean>(false);
  const [solde, setSolde] = useState<number>(1234.56);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [showInfoCCP, setShowInfoCCP] = useState<boolean>(false);
  const [showAchievement, setShowAchievement] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('demande');
  const [confetti, setConfetti] = useState<boolean>(false);
  const [motif, setMotif] = useState<string>('');
  const [accountInfo, setAccountInfo] = useState({
    ccpNumber: '00012345 78',
    name: 'Mon Commerce',
    bank: 'Algérie Poste',
    verified: true,
  });

  // Données des précédentes demandes de retrait
  const [historique, setHistorique] = useState([
    {
      id: 'TR-2025-0012',
      date: '05/05/2025',
      montant: 5000,
      frais: 75,
      status: 'success',
      duree: '2 jours',
      pointsGagnes: 50,
    },
    {
      id: 'TR-2025-0008',
      date: '15/04/2025',
      montant: 12000,
      frais: 180,
      status: 'success',
      duree: '3 jours',
      pointsGagnes: 120,
    },
    {
      id: 'TR-2025-0003',
      date: '28/03/2025',
      montant: 8500,
      frais: 127.50,
      status: 'rejected',
      motif: 'Informations CCP incorrectes',
      duree: '1 jour',
    }
  ]);

  // Statistiques des retraits
  const stats = {
    totalRetire: historique
      .filter(item => item.status === 'success')
      .reduce((sum, item) => sum + item.montant, 0),
    nombreRetraits: historique.filter(item => item.status === 'success').length,
    tempsTraitementMoyen: '2 jours',
    pointsGagnes: historique
      .filter(item => item.status === 'success')
      .reduce((sum, item) => sum + (item.pointsGagnes || 0), 0),
  };

  // Calcul du montant des frais (1.5%)
  const calculerFrais = (montant: number) => {
    return montant * 0.015;
  };

  // Vérification de la validité du formulaire
  useEffect(() => {
    const montantValue = parseFloat(montant);
    setFormValid(
      montantValue >= 1000 && // Montant minimum
      montantValue <= solde && // Ne pas dépasser le solde
      motif.length > 0
    );
  }, [montant, solde, motif]);

  // Simulation du chargement des données
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingData(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Fonction pour formater les montants en dinars algériens
  const formatMontant = (montant: number) => {
    return montant.toLocaleString('fr-DZ', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' DA';
  };

  // Fonction pour soumettre une demande de retrait
  const soumettreRetrait = () => {
    setConfirmationShown(true);
  };

  // Fonction pour confirmer un retrait
  const confirmerRetrait = () => {
    setConfirmationShown(false);
    setSuccessShown(true);
    
    // Ajout de la nouvelle demande dans l'historique
    const montantValue = parseFloat(montant);
    const fraisValue = calculerFrais(montantValue);
    
    const nouvelleDemande = {
      id: `TR-2025-${Math.floor(Math.random() * 9000) + 1000}`,
      date: '10/05/2025',
      montant: montantValue,
      frais: fraisValue,
      status: 'pending',
      duree: 'En cours',
      motif: motif
    };
    
    setHistorique([nouvelleDemande, ...historique]);
    
    // Mise à jour du solde
    setSolde(prevSolde => prevSolde - montantValue);
    
    // Déclenchement des animations
    setTimeout(() => {
      setConfetti(true);
      setShowAchievement(true);
      
      setTimeout(() => {
        setConfetti(false);
      }, 5000);
      
      setTimeout(() => {
        setShowAchievement(false);
        setActiveTab('historique'); // Bascule vers l'onglet historique
      }, 4000);
    }, 500);
    
    // Réinitialisation des champs
    setMontant('');
    setMotif('');
  };

  // Progression dans le formulaire
  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <main className="p-4 pb-24 bg-gradient-to-b from-white to-blue-50 min-h-screen text-gray-800 font-sans relative">
      {/* Effet de confetti pour les animations de réussite */}
      {confetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0">
            {Array.from({ length: 100 }).map((_, i) => (
              <div 
                key={i}
                className="absolute animate-confetti"
                style={{
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                  top: '-5%',
                  left: `${Math.random() * 100}%`,
                  background: ['#FF5E5B', '#D8D8D8', '#FFED66', '#00CECB', '#FFBA49'][Math.floor(Math.random() * 5)],
                  transform: `rotate(${Math.random() * 360}deg)`,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                  animationDelay: `${Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <Link href="/" className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md hover:scale-110 transition">
            <span className="text-gray-600">←</span>
          </Link>
          <h1 className="text-lg font-bold text-gray-800">💸 Retrait vers CCP</h1>
        </div>
        
        {/* Solde affiché */}
        <section className="bg-white shadow-md rounded-2xl p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Solde disponible</p>
              {loadingData ? (
                <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <h2 className="text-2xl font-bold text-gray-800">{formatMontant(solde)}</h2>
              )}
              <p className="text-xs text-gray-400 mt-1">Dernière mise à jour : aujourd'hui</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-green-500 text-xs font-bold bg-green-50 py-1 px-3 rounded-full">
                Retrait disponible
              </span>
              <span className="text-xs text-gray-500 mt-1">Min: 1,000 DA</span>
            </div>
          </div>
        </section>
        
        {/* Tabs */}
        <div className="bg-white shadow-md rounded-2xl p-2">
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setActiveTab('demande')}
              className={`py-2 rounded-xl transition ${
                activeTab === 'demande'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white font-bold'
                  : 'text-gray-700 hover:bg-green-50'
              }`}
            >
              🔄 Nouvelle demande
            </button>
            <button
              onClick={() => setActiveTab('historique')}
              className={`py-2 rounded-xl transition ${
                activeTab === 'historique'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold'
                  : 'text-gray-700 hover:bg-purple-50'
              }`}
            >
              📋 Historique
            </button>
          </div>
        </div>
      </header>

      {/* Nouvelle demande de retrait */}
      {activeTab === 'demande' && (
        <section className="bg-white rounded-2xl shadow-md p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold">Nouvelle demande</h2>
            <span className="text-sm text-blue-600">Étape {step}/2</span>
          </div>

          {/* Barre de progression */}
          <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${(step/2) * 100}%` }}
            ></div>
          </div>

          {/* Étape 1: Saisie du montant et motif */}
          {step === 1 && (
            <>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Montant à retirer (DA)
                    </label>
                    <span className="text-xs text-blue-600">
                      Disponible: {formatMontant(solde)}
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                      DA
                    </span>
                    <input
                      type="number"
                      value={montant}
                      onChange={(e) => setMontant(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                      placeholder="Montant minimum: 1,000 DA"
                      min="1000"
                      max={solde}
                    />
                  </div>
                  {parseFloat(montant) > solde && (
                    <p className="text-red-500 text-xs mt-1">
                      Le montant demandé dépasse votre solde disponible.
                    </p>
                  )}
                  {parseFloat(montant) < 1000 && montant !== '' && (
                    <p className="text-red-500 text-xs mt-1">
                      Le montant minimum de retrait est de 1,000 DA.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Motif du retrait
                  </label>
                  <select 
                    value={motif}
                    onChange={(e) => setMotif(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  >
                    <option value="">Sélectionner un motif</option>
                    <option value="Paiement fournisseurs">Paiement fournisseurs</option>
                    <option value="Salaires">Salaires</option>
                    <option value="Loyer">Loyer</option>
                    <option value="Investissement">Investissement</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                {/* Calcul dynamique des frais et montant net */}
                {montant && parseFloat(montant) >= 1000 && (
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-sm text-blue-700 mb-2 font-medium">Aperçu de votre demande :</p>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Montant demandé:</span>
                      <span className="font-semibold">{formatMontant(parseFloat(montant))}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Frais de service (1.5%):</span>
                      <span className="font-semibold">
                        {formatMontant(calculerFrais(parseFloat(montant)))}
                      </span>
                    </div>
                    <div className="border-t border-blue-200 my-1"></div>
                    <div className="flex justify-between text-sm font-bold">
                      <span>Montant à recevoir:</span>
                      <span>
                        {formatMontant(parseFloat(montant) - calculerFrais(parseFloat(montant)))}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={nextStep}
                disabled={!formValid}
                className={`w-full mt-6 py-3 rounded-xl text-white font-bold transition ${
                  formValid
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Continuer
              </button>
              
              {/* Information sur les frais */}
              <div className="mt-4 bg-yellow-50 p-3 rounded-xl text-sm text-yellow-800">
                <span className="font-medium flex items-center gap-1">
                  <span>ℹ️</span> Bon à savoir :
                </span>
                <p className="mt-1 text-yellow-700 text-xs">
                  Des frais de service de 1.5% sont appliqués à chaque demande de retrait. 
                  Le traitement prend généralement 2 à 3 jours ouvrables.
                </p>
              </div>
            </>
          )}

          {/* Étape 2: Confirmation des coordonnées CCP */}
          {step === 2 && (
            <>
              <div className="mb-4">
                <h3 className="text-sm font-bold mb-3 text-gray-700">Compte CCP bénéficiaire</h3>
                <div className={`bg-${accountInfo.verified ? 'green' : 'yellow'}-50 p-4 rounded-xl mb-4 relative`}>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium">{accountInfo.name}</p>
                      <p className="text-2xl font-bold tracking-wider mt-1">
                        {accountInfo.ccpNumber}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{accountInfo.bank}</p>
                    </div>
                    {accountInfo.verified && (
                      <div className="flex items-start">
                        <span className="bg-green-600 text-white text-xs rounded-full py-1 px-2 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Vérifié
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setShowInfoCCP(true)}
                  className="text-blue-600 text-sm hover:underline mb-4 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Modifier mes coordonnées CCP
                </button>

                {/* Récapitulatif de la demande */}
                <div className="bg-blue-50 p-4 rounded-xl">
                  <h3 className="text-sm font-bold text-blue-800 mb-2">Récapitulatif</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Montant demandé:</span>
                      <span className="font-bold">{formatMontant(parseFloat(montant))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Frais (1.5%):</span>
                      <span>{formatMontant(calculerFrais(parseFloat(montant)))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Montant net à recevoir:</span>
                      <span className="font-bold">{formatMontant(parseFloat(montant) - calculerFrais(parseFloat(montant)))}</span>
                    </div>
                    <div className="flex justify-between border-t border-blue-200 pt-2 mt-2">
                      <span className="text-blue-700">Motif:</span>
                      <span>{motif}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Délai estimé:</span>
                      <span>2-3 jours ouvrables</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={prevStep}
                  className="w-1/3 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
                >
                  Retour
                </button>
                <button
                  onClick={soumettreRetrait}
                  className="w-2/3 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition"
                >
                  Soumettre la demande
                </button>
              </div>
              
              {/* Gain de points */}
              <div className="mt-4 bg-purple-50 p-3 rounded-xl">
                <div className="flex items-start gap-2">
                  <span className="text-lg">🎮</span>
                  <div>
                    <p className="text-sm font-medium text-purple-800">Gagnez des points!</p>
                    <p className="text-xs text-purple-700 mt-1">
                      Chaque retrait réussi vous fait gagner des points de fidélité à échanger contre des récompenses!
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      )}

      {/* Historique de retraits */}
      {activeTab === 'historique' && (
        <>
          {/* Statistiques de retraits */}
          <section className="bg-white rounded-2xl shadow-md p-4 mb-6">
            <h2 className="text-sm font-bold mb-4">Statistiques des retraits</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-3 rounded-xl">
                <p className="text-xs text-green-700">Total retiré</p>
                <p className="text-lg font-bold text-green-800">{formatMontant(stats.totalRetire)}</p>
                <p className="text-xs text-green-600">{stats.nombreRetraits} retraits réussis</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <p className="text-xs text-blue-700">Points gagnés</p>
                <p className="text-lg font-bold text-blue-800">{stats.pointsGagnes} pts</p>
                <p className="text-xs text-blue-600">Échangeables en boutique</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl col-span-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-purple-700">Temps moyen de traitement</p>
                    <p className="text-lg font-bold text-purple-800">{stats.tempsTraitementMoyen}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-200 flex items-center justify-center">
                    <span className="text-lg">⏱️</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Liste des demandes de retrait */}
          <section className="bg-white rounded-2xl shadow-md p-4 mb-6">
            <h2 className="text-sm font-bold mb-4">Mes demandes de retrait</h2>
            
            {historique.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-3">💸</div>
                <p className="text-gray-500 mb-1">Aucune demande de retrait</p>
                <p className="text-xs text-blue-600">
                  Créez votre première demande pour voir l'historique ici
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {historique.map((item) => (
                  <div key={item.id} className={`
                    p-4 rounded-xl 
                    ${item.status === 'success' ? 'bg-green-50' : 
                      item.status === 'rejected' ? 'bg-red-50' : 'bg-yellow-50'}
                  `}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{formatMontant(item.montant)}</p>
                        <p className="text-xs text-gray-500">{item.id} • {item.date}</p>
                      </div>
                      <div className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${item.status === 'success' ? 'bg-green-200 text-green-800' : 
                          item.status === 'rejected' ? 'bg-red-200 text-red-800' : 
                          'bg-yellow-200 text-yellow-800'}
                      `}>
                        {item.status === 'success' ? 'Réussi' : 
                          item.status === 'rejected' ? 'Rejeté' : 'En attente'}
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-2 text-xs">
                      <div className="flex flex-col">
                        <span className="text-gray-500">Frais:</span>
                        <span className="font-medium">{formatMontant(item.frais)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-500">Traitement:</span>
                        <span className="font-medium">{item.duree}</span>
                      </div>
                      {item.pointsGagnes && (
                        <div className="flex flex-col items-end">
                          <span className="text-purple-600">Points gagnés:</span>
                          <span className="font-bold text-purple-700">+{item.pointsGagnes} pts</span>
                        </div>
                      )}
                    </div>
                    
                    {item.motif && (
                      <div className="mt-2 text-xs">
                        <span className="text-gray-500">Motif:</span>
                        <span className="font-medium ml-1">{item.motif}</span>
                      </div>
                    )}
                    
                    {item.status === 'rejected' && item.motif && (
                      <div className="mt-2 bg-red-100 p-2 rounded-lg text-xs text-red-700">
                        <p className="font-medium">Motif du rejet:</p>
                        <p>{item.motif}</p>
                      </div>
                    )}

                    {item.status === 'pending' && (
                      <div className="mt-2 bg-yellow-100 p-2 rounded-lg text-xs text-yellow-700">
                        <p>Votre demande sera traitée dans les 2-3 jours ouvrables.</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Conseils de succès */}
          <section className="bg-white rounded-2xl shadow-md p-4 mb-6">
            <h2 className="text-sm font-bold mb-3 flex items-center gap-2">
              <span>💡</span> Conseils pour des retraits réussis
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                  1
                </div>
                <p className="text-gray-700">Assurez-vous que les informations de votre compte CCP sont correctes</p>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                  2
                </div>
                <p className="text-gray-700">Prévoyez vos besoins avec 2-3 jours d'avance</p>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                  3
                </div>
                <p className="text-gray-700">Les retraits effectués avant 14h sont traités plus rapidement</p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Modal de confirmation */}
      {confirmationShown && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-center mb-4">Confirmer la demande</h2>
            <div className="bg-green-50 p-4 rounded-xl mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Montant demandé:</span>
                <span className="font-bold">{formatMontant(parseFloat(montant))}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Frais (1.5%):</span>
                <span>{formatMontant(calculerFrais(parseFloat(montant)))}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Vous recevrez:</span>
                <span>{formatMontant(parseFloat(montant) - calculerFrais(parseFloat(montant)))}</span>
              </div>
            </div>
            <p className="text-center text-sm text-gray-600 mb-4">
              Votre demande sera traitée par notre équipe et le montant sera transféré sur votre compte CCP sous 2-3 jours ouvrables.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmationShown(false)}
                className="w-1/3 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
              >
                Annuler
              </button>
              <button
                onClick={confirmerRetrait}
                className="w-2/3 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de succès */}
      {successShown && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Demande envoyée!</h2>
            <p className="text-gray-600 mb-4">
              Votre demande de retrait de {formatMontant(parseFloat(montant))} a été enregistrée avec succès.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Un e-mail de confirmation a été envoyé à votre adresse.
              Vous pouvez suivre l'évolution de votre demande dans l'onglet Historique.
            </p>
            <button
              onClick={() => setSuccessShown(false)}
              className="w-full py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition"
            >
              Compris
            </button>
          </div>
        </div>
      )}

      {/* Modal CCP info */}
      {showInfoCCP && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Compte CCP bénéficiaire</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de compte CCP
                </label>
                <input
                  type="text"
                  value={accountInfo.ccpNumber}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du titulaire
                </label>
                <input
                  type="text"
                  value={accountInfo.name}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled
                />
              </div>
              <div className="bg-yellow-50 p-3 rounded-xl text-sm">
                <p className="text-yellow-800">
                  <span className="font-bold">Note:</span> Pour modifier vos coordonnées bancaires,
                  veuillez contacter notre service client avec les pièces justificatives requises.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowInfoCCP(false)}
              className="w-full mt-4 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Modal d'accomplissement */}
      {showAchievement && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-2xl p-6 shadow-2xl transform animate-achievement">
            <div className="relative">
              <div className="absolute -top-12 -right-12 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <h2 className="text-xl font-bold mb-2 text-purple-700">Accomplissement débloqué!</h2>
              <p className="text-gray-600">Première demande de retrait!</p>
              <div className="mt-3 bg-purple-50 p-2 rounded-lg flex items-center justify-between">
                <span className="text-purple-700 font-medium">+50 points</span>
                <span className="text-xs text-purple-600">Niveau: Aventurier financier</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Les styles d'animation ont été déplacés dans globals.css */}
    </main>
  );
};

export default RetraitsPage;