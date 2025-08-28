'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

export default function ProgressionPage() {
  // Données utilisateur
  const userData = {
    name: 'Mon Commerce',
    level: 12,
    currentXP: 925,
    nextLevelXP: 1000,
    totalPoints: 320,
    daysActive: 63,
    transactionsCount: 247,
    clientsCount: 85,
  };

  // Animation controls
  const progressControls = useAnimation();
  
  // Animation de la barre de progression après le chargement de la page
  useEffect(() => {
    progressControls.start({ width: `${progressPercent}%`, transition: { duration: 1, ease: "easeOut" } });
  }, []);

  // Calcul de la progression
  const maxXP = 1000 + 200 * (userData.level - 1);
  const progressPercent = Math.min(100, Math.round((userData.currentXP / maxXP) * 100));
  const xpToNextLevel = maxXP - userData.currentXP;
  // Avantages du niveau
  const levelBenefits = [
    'Remise 5% boutique',
    'Badge "Expert Dinary Pro"',
    'Support premium'
  ];

  // Missions
  const missions = [
    { id: 1, title: 'Effectuer 3 ventes', done: false, points: 50 },
    { id: 2, title: 'Ajouter un client', done: true, points: 30 },
    { id: 3, title: 'Consulter le rapport', done: false, points: 20 },
  ];

  // État pour contrôler les animations des badges
  const [activeBadge, setActiveBadge] = useState<number | null>(null);
  // Badges
  const badges = [
    { id: 1, name: 'Commerçant débutant', icon: '🔰', unlocked: true, level: 1 },
    { id: 2, name: 'Vendeur régulier', icon: '🏅', unlocked: true, level: 5 },
    { id: 3, name: 'Expert Dinary Pro', icon: '🏆', unlocked: true, level: 10 },
    { id: 4, name: 'Maître du commerce', icon: '👑', unlocked: false, level: 15 },
  ];
  return (
    <main className="p-4 pb-20 bg-gradient-to-b from-blue-50 to-white min-h-screen max-w-md mx-auto">
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center mb-6"
      >
        <Link href="/" className="text-blue-600 font-medium flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span className="ml-1">Accueil</span>
        </Link>
        <h1 className="text-xl font-bold text-center">Ma Progression</h1>
        <div className="w-24"></div>
      </motion.header>

      {/* Profil amélioré avec animation */}
      <motion.div 
        className="bg-white p-6 rounded-xl shadow-md mb-6 relative overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div 
          className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg font-bold"
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          Niveau {userData.level}
        </motion.div>

        <div className="flex flex-col items-center text-center gap-4 mb-5">
          <motion.div 
            className="w-18 h-18 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-3xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white font-bold">{userData.level}</span>
          </motion.div>
          <div>
            <h2 className="font-bold text-xl">{userData.name}</h2>
            <p className="text-blue-600 font-medium">
              <motion.span
                className="inline-block"
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
              >
                ✨ {userData.totalPoints} points
              </motion.span>
            </p>
          </div>
        </div>
          {/* Barre de progression animée améliorée avec effets visuels */}        <div className="mb-4">
          <motion.div 
            className="flex flex-col items-center text-center text-sm mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.span 
              className="font-medium text-gray-700 flex items-center mb-2"
              whileHover={{ scale: 1.05 }}
            >
              <motion.span 
                className="inline-block mr-1 text-blue-500"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                🚀
              </motion.span>
              Progression vers niveau {userData.level + 1}
            </motion.span>
            
            <motion.span 
              className="font-bold text-blue-600 px-2 py-0.5 bg-blue-100 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
            >
              {progressPercent}%
            </motion.span>
          </motion.div>
          
          <motion.div 
            className="w-full h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner p-0.5"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full relative"
              initial={{ width: 0 }}
              animate={progressControls}
            >
              {progressPercent > 15 && (
                <motion.div 
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-2 w-2 bg-white rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
          </motion.div>
          
          <motion.p 
            className="text-sm text-gray-600 mt-3 text-center font-medium"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.span 
              className="inline-block"
              whileHover={{ color: "#3B82F6", scale: 1.05 }}
            >
              {xpToNextLevel} XP pour atteindre le prochain niveau
            </motion.span>
          </motion.p>
        </div>
        
        {/* Avantages du niveau actuel */}
        <motion.div 
          className="mt-4 bg-blue-50 p-3 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm font-medium text-blue-700 mb-2">Avantages de votre niveau :</p>
          <ul className="space-y-1">
            {levelBenefits.map((benefit, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.2 }}
                className="flex items-center text-sm"
              >
                <span className="text-blue-500 mr-2">✓</span> {benefit}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>      {/* Badges améliorés avec effets interactifs */}
      <motion.div 
        className="bg-white p-6 rounded-xl shadow-md mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)" }}
      >
        <div className="flex justify-between items-center mb-4">
          <motion.h2 
            className="font-bold text-lg flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.span 
              className="mr-2 text-yellow-500"
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              🏆
            </motion.span>
            Mes badges
          </motion.h2>
          <motion.span 
            className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
          >
            {badges.filter(b => b.unlocked).length}/{badges.length}
          </motion.span>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {badges.map((badge, index) => (
            <motion.div 
              key={badge.id}
              className={`flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer ${
                badge.unlocked ? 'bg-gradient-to-br from-blue-50 to-indigo-50' : 'bg-gray-100 opacity-60'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (index * 0.1) }}
              whileHover={badge.unlocked ? { scale: 1.1, y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" } : {}}
              onClick={() => setActiveBadge(activeBadge === badge.id ? null : badge.id)}
            >
              <motion.span 
                className="text-2xl mb-1"
                animate={badge.unlocked ? { rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 + index }}
              >
                {badge.icon}
              </motion.span>
              <span className="text-xs text-center truncate w-full font-medium">
                {badge.name}
              </span>
                {activeBadge === badge.id && (
                <AnimatePresence>
                  <motion.div 
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setActiveBadge(null)}
                  >
                    <motion.div 
                      className="bg-white p-6 rounded-xl max-w-xs w-full shadow-2xl"
                      onClick={(e) => e.stopPropagation()}
                      initial={{ scale: 0.5, y: 100, opacity: 0 }}
                      animate={{ scale: 1, y: 0, opacity: 1 }}
                      exit={{ scale: 0.5, y: 100, opacity: 0 }}
                      transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    >
                      <div className="text-center mb-4">
                        <motion.span 
                          className="text-6xl block mb-4 inline-block"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: [1, 1.2, 1], opacity: 1, rotate: [0, 10, -10, 0] }}
                          transition={{ 
                            duration: 1.5,
                            times: [0, 0.2, 0.5, 1],
                            ease: "easeInOut"
                          }}
                        >
                          {badge.icon}
                        </motion.span>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <h3 className="text-xl font-bold mb-1">{badge.name}</h3>
                          <p className="text-sm text-gray-500 mb-3">Débloqué au niveau {badge.level}</p>
                          {badge.unlocked ? (
                            <div className="bg-green-50 text-green-700 text-xs py-1 px-3 rounded-full inline-block mb-3">
                              Badge débloqué
                            </div>
                          ) : (
                            <div className="bg-gray-100 text-gray-500 text-xs py-1 px-3 rounded-full inline-block mb-3">
                              Badge verrouillé
                            </div>
                          )}
                        </motion.div>
                      </div>
                      <motion.div 
                        className="text-center mt-5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >                        <motion.button 
                          onClick={() => setActiveBadge(null)}
                          className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Fermer
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>      {/* Statistiques améliorées avec gradient et effets visuels */}
      <motion.div 
        className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-md mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)" }}
      >
        <motion.h2 
          className="font-bold text-lg mb-4 flex items-center"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.span 
            className="mr-2 text-blue-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
          >
            📊
          </motion.span>
          Statistiques
        </motion.h2>
        <div className="grid grid-cols-3 gap-4">
          <motion.div 
            className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg text-center shadow-sm"
            whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.p 
              className="text-3xl font-bold text-blue-700"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.6 }}
              whileHover={{ scale: 1.1 }}
            >
              {userData.daysActive}
            </motion.p>
            <p className="text-sm text-blue-600 font-medium mt-1">Jours actifs</p>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg text-center shadow-sm"
            whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.p 
              className="text-3xl font-bold text-blue-700"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.7 }}
              whileHover={{ scale: 1.1 }}
            >
              {userData.transactionsCount}
            </motion.p>
            <p className="text-sm text-blue-600 font-medium mt-1">Transactions</p>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg text-center shadow-sm"
            whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.p 
              className="text-3xl font-bold text-blue-700"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.8 }}
              whileHover={{ scale: 1.1 }}
            >
              {userData.clientsCount}
            </motion.p>
            <p className="text-sm text-blue-600 font-medium mt-1">Clients</p>
          </motion.div>
        </div>
      </motion.div>{/* Missions améliorées avec effets visuels avancés */}
      <motion.div 
        className="bg-white p-6 rounded-xl shadow-md mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)" }}
      >
        <div className="flex justify-between items-center mb-4">
          <motion.h2 
            className="font-bold text-lg flex items-center"
            initial={{ x: -10 }}
            animate={{ x: 0 }}
          >
            <motion.span 
              className="mr-2 text-blue-500"
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            >
              🎯
            </motion.span>
            Missions du jour
          </motion.h2>
          <motion.span 
            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {missions.filter(m => m.done).length}/{missions.length} complétées
          </motion.span>
        </div>
        
        <ul className="space-y-3">
          {missions.map((mission, index) => (
            <motion.li 
              key={mission.id}
              className={`p-3 rounded-lg border flex items-center justify-between ${
                mission.done 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + (index * 0.1) }}
              whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              <div className="flex items-center">
                <motion.span
                  className={`mr-3 flex items-center justify-center w-6 h-6 rounded-full ${
                    mission.done 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}
                  animate={mission.done ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {mission.done ? '✓' : ' '}
                </motion.span>
                <span className={mission.done ? 'line-through text-gray-500' : ''}>
                  {mission.title}
                </span>
              </div>
              <span className="text-sm font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                +{mission.points} pts
              </span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Récompenses améliorées */}
      <motion.div 
        className="bg-white p-6 rounded-xl shadow-md mb-6 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="font-bold text-lg mb-2">Points et récompenses</h2>
        <motion.div
          className="flex items-center justify-center gap-2 mb-4"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7, type: "spring" }}
        >
          <span className="text-yellow-500 text-xl">✨</span>
          <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            {userData.totalPoints}
          </span>
          <span className="text-yellow-500 text-xl">✨</span>
        </motion.div>
        
        <p className="text-sm text-gray-600 mb-5">
          Utilisez vos points pour débloquer des remises exclusives et des avantages
        </p>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            href="/rewards" 
            className="block w-full p-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-center rounded-lg font-medium shadow-lg"
          >
            Voir mes récompenses
          </Link>
        </motion.div>
      </motion.div>

      {/* Navigation améliorée */}
      <motion.footer 
        className="fixed bottom-0 left-0 w-full bg-white border-t py-3 px-4 shadow-lg"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
      >
        <div className="flex justify-around">
          <Link href="/" className="text-gray-500 text-center">
            <motion.span 
              className="block text-2xl"
              whileHover={{ y: -3, color: "#3b82f6" }}
            >
              🏠
            </motion.span>
            <span className="text-xs">Accueil</span>
          </Link>
          
          <Link href="/boutique" className="text-gray-500 text-center">
            <motion.span 
              className="block text-2xl"
              whileHover={{ y: -3, color: "#3b82f6" }}
            >
              🛍️
            </motion.span>
            <span className="text-xs">Boutique</span>
          </Link>
          
          <Link href="/progression" className="text-blue-600 text-center">
            <motion.span 
              className="block text-2xl"
              animate={{ y: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              📈
            </motion.span>
            <span className="text-xs font-medium">Progression</span>
          </Link>
          
          <Link href="/rewards" className="text-gray-500 text-center">
            <motion.span 
              className="block text-2xl"
              whileHover={{ y: -3, color: "#3b82f6" }}
            >
              🎁
            </motion.span>
            <span className="text-xs">Récompenses</span>
          </Link>
        </div>
      </motion.footer>
      
      {/* Modal pour les badges */}
      <AnimatePresence>
        {activeBadge !== null && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveBadge(null)}
          >
            {/* Le contenu du modal est dans le composant de badge */}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}