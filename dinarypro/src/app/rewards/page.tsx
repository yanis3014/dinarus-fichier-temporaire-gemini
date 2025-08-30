'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const badges = [
  { id: 1, name: 'Premier paiement', icon: '🥇', description: 'Complétez votre première transaction', unlocked: true, points: 50 },
  { id: 2, name: 'Top 10 commerçants', icon: '🔥', description: 'Soyez parmi les 10 meilleurs de votre région', unlocked: false, points: 200 },
  { id: 3, name: 'Niveau 5', icon: '🚀', description: 'Atteignez le niveau 5', unlocked: true, points: 100 },
  { id: 4, name: 'Champion des ventes', icon: '👑', description: 'Réalisez 50 transactions en une semaine', unlocked: false, points: 150 },
  { id: 5, name: 'Expert Dinary', icon: '⭐️', description: 'Utilisez toutes les fonctionnalités', unlocked: true, points: 75 },
];

const missions = [
  { id: 1, name: 'Effectuer 3 encaissements', reward: '50', rewardIcon: '🪙', progress: 2, total: 3, type: 'daily', expire: '10 Mai', icon: '💰', bgColor: 'from-green-400 to-emerald-500' },
  { id: 2, name: 'Ajouter 5 produits', reward: '25', rewardIcon: '🪙', progress: 5, total: 5, completed: true, type: 'daily', expire: '10 Mai', icon: '📦', bgColor: 'from-teal-400 to-green-500' },
  { id: 3, name: 'Inviter un commerçant', reward: '100', rewardIcon: '🪙', progress: 0, total: 1, type: 'weekly', expire: '13 Mai', icon: '👥', bgColor: 'from-blue-400 to-indigo-500' },
  { id: 4, name: 'Réaliser 10 ventes', reward: '75', rewardIcon: '🪙', progress: 3, total: 10, type: 'weekly', expire: '13 Mai', icon: '🛒', bgColor: 'from-indigo-400 to-blue-500' },
  { id: 5, name: 'Compléter votre profil', reward: '15', rewardIcon: '🪙', progress: 1, total: 1, completed: true, type: 'challenge', icon: '📝', bgColor: 'from-yellow-400 to-amber-500' },
  { id: 6, name: 'Atteindre 100K de ventes', reward: '200', rewardIcon: '🪙', progress: 45000, total: 100000, type: 'challenge', icon: '📈', bgColor: 'from-orange-400 to-red-500' },
  { id: 7, name: 'Obtenir 5 badges', reward: '1', rewardIcon: '🏆', progress: 3, total: 5, type: 'challenge', icon: '🏅', bgColor: 'from-amber-400 to-yellow-500' },
  { id: 8, name: 'Parrainage réussi', reward: '250', rewardIcon: '🪙', progress: 1, total: 3, type: 'challenge', icon: '🤝', bgColor: 'from-purple-400 to-pink-500' }
];

const referrals = {
  yourCode: "DINAR25JK8",
  totalEarned: 750,
  pending: 2,
  completed: 3,
  referredFriends: [
    { name: "Karim B.", status: "completed", reward: 250, date: "28 Avr", avatar: "👨🏽‍💼" },
    { name: "Leila M.", status: "completed", reward: 250, date: "02 Mai", avatar: "👩🏽‍🦱" },
    { name: "Yacine D.", status: "completed", reward: 250, date: "05 Mai", avatar: "👨🏽‍🦱" },
    { name: "Sara T.", status: "pending", reward: 0, date: "09 Mai", avatar: "👩🏽" },
    { name: "Ahmed K.", status: "pending", reward: 0, date: "10 Mai", avatar: "👨🏽" },
  ],
  bonuses: [
    { milestone: 3, reward: "500 points", achieved: true },
    { milestone: 5, reward: "1000 points", achieved: false },
    { milestone: 10, reward: "Statut VIP", achieved: false },
    { milestone: 25, reward: "2% commission à vie", achieved: false },
  ]
};

const RewardsPage = () => {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'missions');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showParticles, setShowParticles] = useState(false);
  const [referralCode, setReferralCode] = useState(referrals.yourCode);
  const [showCopied, setShowCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const referralCodeRef = useRef(null);

  useEffect(() => {
    if (tabParam && ['missions', 'badges', 'boutique', 'parrainage'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    if (showParticles) {
      const timer = setTimeout(() => setShowParticles(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showParticles]);

  useEffect(() => {
    if (showCopied) {
      const timer = setTimeout(() => setShowCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showCopied]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const totalPoints = 320;
  const badgesUnlocked = badges.filter(badge => badge.unlocked).length;
  const missionsCompleted = missions.filter(mission => mission.completed).length;

  const claimReward = () => {
    setShowParticles(true);
  };

  const copyReferralCode = () => {
    if (referralCodeRef.current) {
      navigator.clipboard.writeText(referralCode);
      setShowCopied(true);
    }
  };

  const sendInvite = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setInviteEmail('');
  };

  return (
    <main className="p-4 pb-24 bg-white min-h-screen text-gray-800 font-sans relative">
      {/* Tooltip de succès avec animation */}
      {showCopied && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg animate-bounce z-50">
          Code copié avec succès!
        </div>
      )}
      
      {showSuccess && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg animate-bounce z-50">
          Invitation envoyée avec succès!
        </div>
      )}
      
      {/* Header simplifié */}
      <section className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white flex items-center justify-center shadow-sm">
            ←
          </Link>
          <div>
            <p className="font-medium text-purple-800">Récompenses</p>
            <p className="text-xs text-gray-500">{totalPoints} points accumulés</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/profile">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shadow-sm relative border border-gray-200">
              <span className="text-sm font-medium text-gray-700">MC</span>
              <span className="absolute bottom-0 right-0 bg-green-500 w-2 h-2 rounded-full border border-white"></span>
            </div>
          </Link>
        </div>
      </section>

      {/* Résumé des récompenses */}
      <section className="mb-6 bg-gradient-to-r from-indigo-400 to-purple-500 shadow-md rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
              🏆
            </div>
            <div>
              <h1 className="text-xl font-bold">Vos récompenses</h1>
              <p className="text-indigo-100 text-sm">Niveau 5 débloqué</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white/20 rounded-lg px-3 py-1">
              <p className="text-sm">{totalPoints}</p>
              <p className="text-xs text-indigo-100">Points</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/20 rounded-lg p-2 text-center">
            <p className="text-2xl">{badgesUnlocked}/5</p>
            <p className="text-xs mt-1">Badges</p>
          </div>
          <div className="bg-white/20 rounded-lg p-2 text-center">
            <p className="text-2xl">{missionsCompleted}/8</p>
            <p className="text-xs mt-1">Missions</p>
          </div>
          <div className="bg-white/20 rounded-lg p-2 text-center">
            <p className="text-2xl">{referrals.completed}</p>
            <p className="text-xs mt-1">Parrainages</p>
          </div>
        </div>
      </section>

      {/* Navigation par onglets stylisée */}
      <div className="flex overflow-x-auto gap-2 mb-4 pb-1 no-scrollbar">
        <button
          onClick={() => setActiveTab('missions')}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
            activeTab === 'missions'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          ✅ Missions
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
            activeTab === 'badges'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          🥇 Badges
        </button>
        <button
          onClick={() => setActiveTab('boutique')}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
            activeTab === 'boutique'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          🎁 Boutique
        </button>
        <button
          onClick={() => setActiveTab('parrainage')}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
            activeTab === 'parrainage'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          👥 Parrainage
        </button>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'missions' && (
        <div>
          {/* Filtres des missions */}
          <div className="flex overflow-x-auto gap-2 mb-4 pb-1 no-scrollbar">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition ${
                activeCategory === 'all'
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'bg-gray-50 text-gray-500 border border-gray-100'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setActiveCategory('daily')}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition ${
                activeCategory === 'daily'
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'bg-gray-50 text-gray-500 border border-gray-100'
              }`}
            >
              Quotidiennes
            </button>
            <button
              onClick={() => setActiveCategory('weekly')}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition ${
                activeCategory === 'weekly'
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'bg-gray-50 text-gray-500 border border-gray-100'
              }`}
            >
              Hebdomadaires
            </button>
            <button
              onClick={() => setActiveCategory('challenge')}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition ${
                activeCategory === 'challenge'
                  ? 'bg-purple-100 text-purple-700 border border-purple-200'
                  : 'bg-gray-50 text-gray-500 border border-gray-100'
              }`}
            >
              Défis
            </button>
          </div>

          {/* Liste des missions */}
          <div className="space-y-3">
            {missions
              .filter(mission => activeCategory === 'all' || mission.type === activeCategory)
              .map(mission => (
                <div 
                  key={mission.id} 
                  className={`bg-white border border-gray-100 shadow-sm rounded-xl p-4 ${
                    mission.completed ? 'opacity-75' : ''
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${mission.bgColor} text-white flex items-center justify-center shadow-sm`}>
                        <span className="text-xl">{mission.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{mission.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <span className={`px-2 py-0.5 rounded-full ${
                            mission.type === 'daily' ? 'bg-green-100 text-green-700' :
                            mission.type === 'weekly' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {mission.type === 'daily' ? 'Quotidienne' : 
                             mission.type === 'weekly' ? 'Hebdomadaire' : 'Défi'}
                          </span>
                          {mission.expire && (
                            <span>Expire: {mission.expire}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 justify-end mb-1">
                        <span className="text-lg">{mission.rewardIcon}</span>
                        <span className="font-bold text-purple-600">+{mission.reward}</span>
                      </div>
                      {mission.completed ? (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Complété</span>
                      ) : (
                        <button 
                          onClick={claimReward}
                          disabled={mission.progress < mission.total}
                          className={`text-xs px-3 py-1 rounded-full ${
                            mission.progress >= mission.total
                              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-sm hover:shadow-md'
                              : 'bg-gray-100 text-gray-400 cursor-default'
                          }`}
                        >
                          {mission.progress >= mission.total ? 'Réclamer' : 'En cours'}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Barre de progression */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progression</span>
                      <span>{mission.progress}/{mission.total}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${mission.bgColor}`} 
                        style={{ width: `${Math.min(100, (mission.progress / mission.total) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      
      {activeTab === 'badges' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {badges.map(badge => (
              <div 
                key={badge.id} 
                className={`bg-white border ${badge.unlocked ? 'border-purple-200' : 'border-gray-100'} rounded-xl p-4 text-center shadow-sm relative ${badge.unlocked ? '' : 'opacity-60'}`}
              >
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl ${
                  badge.unlocked 
                    ? 'bg-gradient-to-r from-indigo-400 to-purple-500 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-300'
                }`}>
                  {badge.icon}
                </div>
                <h3 className="mt-3 font-bold text-gray-800">{badge.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                <div className="mt-3 flex items-center justify-center gap-1 text-purple-600">
                  <span className="text-lg">🪙</span>
                  <span className="font-bold">+{badge.points}</span>
                </div>
                {badge.unlocked && (
                  <div className="absolute top-2 right-2 bg-green-100 rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'boutique' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 1, name: 'Carte cadeau 10€', points: 1000, icon: '🎫', outOfStock: false },
              { id: 2, name: 'Statut VIP 1 mois', points: 500, icon: '👑', outOfStock: false },
              { id: 3, name: 'Theme exclusif', points: 250, icon: '🎨', outOfStock: false },
              { id: 4, name: 'Badge Premium', points: 150, icon: '🏅', outOfStock: true },
            ].map(item => (
              <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-md mb-3">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-800">{item.name}</h3>
                <div className="mt-2 flex items-center justify-center gap-1 text-purple-600">
                  <span className="text-sm">🪙</span>
                  <span className="font-bold">{item.points} points</span>
                </div>
                <button 
                  disabled={totalPoints < item.points || item.outOfStock}
                  className={`w-full mt-3 py-1.5 rounded-lg text-xs ${
                    item.outOfStock
                      ? 'bg-gray-100 text-gray-400'
                      : totalPoints >= item.points
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {item.outOfStock 
                    ? 'Épuisé' 
                    : totalPoints >= item.points 
                      ? 'Échanger' 
                      : `${totalPoints}/${item.points}`}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'parrainage' && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-3">Votre code de parrainage</h2>
            <div className="flex bg-gray-50 border border-gray-100 rounded-lg overflow-hidden">
              <div ref={referralCodeRef} className="bg-gray-50 py-2 px-4 flex-grow text-center font-mono">
                {referralCode}
              </div>
              <button 
                onClick={copyReferralCode}
                className="px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              >
                Copier
              </button>
            </div>
            <div className="mt-4">
              <form onSubmit={sendInvite} className="flex gap-2">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Email de votre ami"
                  className="flex-grow bg-gray-50 border border-gray-100 rounded-lg px-4 py-2 text-sm"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm shadow-sm"
                >
                  Inviter
                </button>
              </form>
            </div>
          </div>
          
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-800">Vos parrainages</h2>
              <div className="flex items-center gap-2">
                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                  {referrals.pending} en attente
                </span>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                  {referrals.completed} complétés
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              {referrals.referredFriends.map((friend, index) => (
                <div key={index} className="flex items-center justify-between border-b border-gray-50 last:border-0 py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      {friend.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{friend.name}</p>
                      <p className="text-xs text-gray-500">{friend.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {friend.status === 'completed' ? (
                      <div className="flex flex-col items-end">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Complété</span>
                        <span className="mt-1 text-xs flex items-center gap-1">
                          <span>🪙</span> +{friend.reward}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">En attente</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-3">Bonus de parrainage</h2>
            <div className="space-y-3">
              {referrals.bonuses.map((bonus, index) => (
                <div key={index} className={`rounded-lg p-3 ${bonus.achieved ? 'bg-purple-50 border border-purple-100' : 'bg-gray-50 border border-gray-100'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">
                        {bonus.milestone} {bonus.milestone === 1 ? 'parrainage' : 'parrainages'}
                      </p>
                      <p className="text-xs text-gray-600">Récompense: {bonus.reward}</p>
                    </div>
                    {bonus.achieved ? (
                      <div className="bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-xs">✓</span>
                      </div>
                    ) : (
                      <div className="text-xs">
                        <span className="font-medium text-purple-600">{referrals.completed}/{bonus.milestone}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Particules de récompense */}
      {showParticles && (
        <div className="fixed inset-0 pointer-events-none z-30 flex items-center justify-center">
          <div className="relative w-full h-full">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `confetti ${1 + Math.random() * 2}s forwards`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              >
                {['🪙', '✨', '🎉', '🌟'][Math.floor(Math.random() * 4)]}
              </div>
            ))}
          </div>
        </div>
      )}      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
};

export default RewardsPage;