'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/layouts/PageHeader';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link'; // Ajout de l'import de Link

// Types pour nos missions
interface BaseMission {
  id: number;
  title: string;
  description: string;
  reward: string;
  xpValue: number;
  icon: keyof typeof missionEmojis;
}

interface StandardMission extends BaseMission {
  status: "completed" | "pending" | "in-progress";
  progress?: number;
  total?: number;
}

interface StarPointMission extends BaseMission {
  status: "locked" | "unlocked";
  requiredStarPoints: number;
}

type Mission = StandardMission | StarPointMission;

// Emojis pour les missions
const missionEmojis = {
  transaction: "💳",
  invite: "👥",
  profile: "🧑‍💼",
  stores: "🏪",
  daily: "📆",
  goal: "🎯",
  vip: "👑"
};

// Emojis pour les récompenses
const rewardEmojis = {
  discount: "🏷️",
  badge: "🏅",
  cashback: "💰",
  vip: "👑"
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function MissionsPage() {  const [showCompletedMissions, setShowCompletedMissions] = useState(true);
  const [showLockedMissions, setShowLockedMissions] = useState(false);
  const userLevel = 3;
  const userXP = 280;
  const userStarPoints = 450; // Points étoilés accumulés
  const xpToNextLevel = 500;
  const xpPercentage = (userXP / xpToNextLevel) * 100;
  
  // Missions standard
  const standardMissions = [
    {
      id: 1,
      title: "Première transaction",
      description: "Effectuez votre première transaction",
      reward: "50 points",
      xpValue: 50,
      status: "completed",
      icon: "transaction"
    },
    {
      id: 2,
      title: "Inviter un ami",
      description: "Invitez un ami à rejoindre l'application",
      reward: "100 points",
      xpValue: 100,
      status: "pending",
      icon: "invite"
    },
    {
      id: 3,
      title: "Compléter votre profil",
      description: "Ajoutez une photo de profil",
      reward: "30 points",
      xpValue: 30,
      status: "pending",
      icon: "profile"
    },
    {
      id: 4,
      title: "Visiter 5 commerces",
      description: "Scannez votre QR code dans 5 commerces",
      reward: "200 points",
      xpValue: 200,
      status: "in-progress",
      progress: 2,
      total: 5,
      icon: "stores"
    },
    {
      id: 5,
      title: "Connexion quotidienne",
      description: "Ouvrez l'application 7 jours d'affilée",
      reward: "75 points",
      xpValue: 75,
      status: "in-progress",
      progress: 4,
      total: 7,
      icon: "daily"
    },
    {
      id: 6,
      title: "Atteindre un objectif",
      description: "Réalisez votre premier objectif d'économie",
      reward: "150 points",
      xpValue: 150,
      status: "pending",
      icon: "goal"
    }
  ];
  
  // Missions premium débloquées avec des points étoilés
  const starPointMissions = [
    {
      id: 7,
      title: "Mission VIP Shopping",
      description: "Accès à des réductions exclusives pendant 24h",
      reward: "500 points + 20€ de remise",
      xpValue: 500,
      status: userStarPoints >= 300 ? "unlocked" : "locked",
      requiredStarPoints: 300,
      icon: "vip"
    },
    {
      id: 8,
      title: "Coaching financier",
      description: "Session privée avec un expert financier",
      reward: "250 points + consultation gratuite",
      xpValue: 250,
      status: userStarPoints >= 800 ? "unlocked" : "locked",
      requiredStarPoints: 800,
      icon: "goal"
    },
    {
      id: 9,
      title: "Évènement exclusif",
      description: "Invitation à notre prochain événement",
      reward: "400 points + entrée VIP",
      xpValue: 400,
      status: userStarPoints >= 1000 ? "unlocked" : "locked",
      requiredStarPoints: 1000,
      icon: "invite"
    }
  ];
  
  // Combiner les missions standards et à points étoilés
  const missions = [...standardMissions, ...starPointMissions.filter(mission => 
    mission.status === "unlocked" || showLockedMissions
  )];

  // Récompenses avec des emojis
  // Type pour les récompenses
  interface Reward {
    id: number; 
    name: string; 
    available: boolean; 
    description: string; 
    icon: keyof typeof rewardEmojis;
    level?: number;
  }

  const unlockedRewards: Reward[] = [
    { 
      id: 1, 
      name: "Remise 5%", 
      available: true, 
      description: "Sur tous les achats", 
      icon: "discount" 
    },
    { 
      id: 2, 
      name: "Badge Explorateur", 
      available: true, 
      description: "Statut spécial dans l'app", 
      icon: "badge" 
    },
  ];
  
  const lockedRewards: Reward[] = [
    { 
      id: 3, 
      name: "Cashback Premium", 
      level: 5, 
      available: false, 
      description: "10% de cashback", 
      icon: "cashback" 
    },
    { 
      id: 4, 
      name: "Traitement VIP", 
      level: 7, 
      available: false, 
      description: "Accès prioritaire", 
      icon: "vip" 
    }
  ];

  return (
    <div className="pb-20 bg-white">
      <PageHeader title="Missions" emoji="🏆" showBackButton />
      
      {/* Banner améliorée avec emoji */}
      <div className="relative h-16 bg-black flex items-center justify-center overflow-hidden mb-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_20%,_#000_70%)]"></div>
          <div className="grid grid-cols-10 h-full">
            {[...Array(30)].map((_, i) => (
              <div 
                key={i}
                className="w-2 h-2 rounded-full bg-white absolute"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.25
                }}
              />
            ))}
          </div>
        </div>
        <div className="text-white font-medium flex items-center relative z-10">
          <span className="text-xl mr-2">✨</span>
          Gagnez des points. Déverrouillez des avantages.
        </div>
      </div>
      
      <div className="p-6">
        {/* Carte de niveau avec emojis */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-sm text-gray-500 font-medium flex items-center">
              <span className="mr-1">📈</span> Progression
            </h2>
            <span className="text-sm text-gray-500">{userXP} / {xpToNextLevel}</span>
          </div>
          
          <div className="w-full h-1 bg-gray-100 rounded-full">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${xpPercentage}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-black rounded-full relative"
            >
              {/* Sparkling effect at the end of progress bar */}
              <span className="absolute -right-1 -top-1.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-30"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-black"></span>
              </span>
            </motion.div>
          </div>
          
          <div className="flex justify-between items-center mt-3">
            <div>
              <h3 className="text-xl font-medium">Niveau {userLevel} <span className="ml-1">🚀</span></h3>
              <p className="text-sm text-gray-500">Explorateur</p>
            </div>
            <Link href="/progression">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-black text-white text-sm rounded-full flex items-center"
              >
                <span>Voir le détail</span>
                <span className="ml-1">👉</span>
              </motion.div>
            </Link>
          </div>
          
          {/* Level Preview - Added visual element */}
          <div className="flex justify-between mt-6 relative">
            <div className="absolute h-0.5 bg-gray-200 top-4 left-7 right-7 -z-10"></div>
            {[...Array(5)].map((_, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className={`flex flex-col items-center ${i + 1 <= userLevel ? 'text-black' : 'text-gray-400'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                  ${i + 1 <= userLevel ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {i + 1}
                </div>
                {i + 1 === 1 && <span className="text-xs mt-1">Débutant 🌱</span>}
                {i + 1 === 3 && <span className="text-xs mt-1">Actif 🔥</span>}
                {i + 1 === 5 && <span className="text-xs mt-1">Expert 🌟</span>}
              </motion.div>
            ))}
          </div>
        </motion.div>
          {/* Filtres avec emojis */}
        <div className="flex flex-wrap border-b border-gray-200 mb-6">
          <button
            onClick={() => {
              setShowCompletedMissions(true);
              setShowLockedMissions(false);
            }}
            className={`mr-4 pb-2 text-sm font-medium flex items-center ${
              showCompletedMissions && !showLockedMissions
                ? 'border-b-2 border-black text-black' 
                : 'text-gray-500'
            }`}
          >
            <span className="mr-1">📋</span> Toutes
          </button>
          <button
            onClick={() => {
              setShowCompletedMissions(false);
              setShowLockedMissions(false);
            }}
            className={`mr-4 pb-2 text-sm font-medium flex items-center ${
              !showCompletedMissions && !showLockedMissions
                ? 'border-b-2 border-black text-black' 
                : 'text-gray-500'
            }`}
          >
            <span className="mr-1">📌</span> À compléter
          </button>
          <button
            onClick={() => {
              setShowLockedMissions(true);
              setShowCompletedMissions(true);
            }}
            className={`pb-2 text-sm font-medium flex items-center ${
              showLockedMissions
                ? 'border-b-2 border-black text-black' 
                : 'text-gray-500'
            }`}
          >
            <span className="mr-1">⭐</span> Points étoilés
          </button>
        </div>
        
        {/* Points étoilés info */}
        <div className="mb-6 flex items-center justify-between bg-yellow-50 rounded-xl p-3">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-xl mr-3">
              ⭐
            </div>
            <div>
              <h3 className="font-medium">Vos points étoilés</h3>
              <p className="text-sm text-gray-600">{userStarPoints} points disponibles</p>
            </div>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-black text-white text-xs px-3 py-2 rounded-lg"
          >
            En gagner plus
          </motion.div>
        </div>        {/* Missions - Using container animation for list */}
        <motion.div 
          className="space-y-5 mb-10"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {missions
            .filter(mission => showCompletedMissions || (mission.status !== 'completed' && mission.status !== 'unlocked' && mission.status !== 'locked'))
            .map((mission) => (
              <motion.div 
                key={mission.id}
                variants={itemVariants}
                className="border-b border-gray-100 pb-5"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start">                    <div className={`w-10 h-10 mr-3 rounded-lg flex items-center justify-center text-xl
                      ${mission.status === "completed" ? "bg-green-50 text-green-600" : 
                        mission.status === "in-progress" ? "bg-blue-50 text-blue-600" : 
                        mission.status === "unlocked" ? "bg-purple-50 text-purple-600" :
                        mission.status === "locked" ? "bg-gray-50 text-gray-400" :
                        "bg-gray-50 text-gray-600"}`}
                    >
                      {missionEmojis[mission.icon as keyof typeof missionEmojis]}
                    </div>
                    <div className="pr-4">
                      <h3 className="font-medium text-base mb-1">
                        {mission.title}
                        {'requiredStarPoints' in mission && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            ⭐ Points
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500">{mission.description}</p>
                        {'progress' in mission && 'total' in mission && mission.progress && mission.total && mission.status === 'in-progress' && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                            <span>{mission.progress}/{mission.total} complétés</span>
                            <span>{Math.round((mission.progress / mission.total) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(mission.progress / mission.total) * 100}%` }}
                              transition={{ duration: 0.8 }}
                              className="h-full bg-black rounded-full relative"
                            />
                          </div>
                        </div>
                      )}
                      
                      {'requiredStarPoints' in mission && mission.status === 'locked' && (
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <span className="text-yellow-500 mr-1">⭐</span>
                          <span>Nécessite {mission.requiredStarPoints} points étoilés</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="bg-gray-50 px-2 py-0.5 rounded-full flex items-center">
                      <span className="text-yellow-500 mr-0.5">⭐</span>
                      <span className="font-medium text-sm">{mission.xpValue}</span>
                    </div>
                    
                    {mission.status === 'completed' ? (
                      <div className="mt-2 flex items-center text-xs text-green-600">
                        <span className="mr-1">✅</span>
                        Complété
                      </div>
                    ) : mission.status === 'in-progress' ? (
                      <span className="mt-2 text-xs text-gray-500 flex items-center">
                        <span className="mr-1 animate-spin inline-block">⏳</span>
                        En cours
                      </span>
                    ) : mission.status === 'unlocked' ? (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-2 bg-purple-600 text-white text-xs px-3 py-1.5 rounded-full flex items-center"
                      >
                        <span className="mr-1">✨</span> Démarrer
                      </motion.button>
                    ) : mission.status === 'locked' ? (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-2 bg-gray-300 text-gray-600 text-xs px-3 py-1.5 rounded-full flex items-center cursor-not-allowed"
                      >
                        <span className="mr-1">🔒</span> Verrouillé
                      </motion.button>
                    ) : (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-2 bg-black text-white text-xs px-3 py-1.5 rounded-full flex items-center"
                      >
                        <span className="mr-1">▶️</span> Commencer
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
        </motion.div>
        
        {/* Récompenses avec emojis */}
        <div className="pt-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium flex items-center">
              <span className="mr-2">🎁</span> Vos avantages
            </h2>
            <span className="bg-yellow-50 text-gray-700 text-xs px-2 py-1 rounded-full flex items-center">
              <span className="text-yellow-500 mr-1">🌟</span>
              <span>{unlockedRewards.length}/{unlockedRewards.length + lockedRewards.length} débloqués</span>
            </span>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {[...unlockedRewards, ...lockedRewards].map(reward => (
              <motion.div 
                key={reward.id}
                variants={itemVariants}
                className={`flex justify-between items-center p-4 rounded-lg ${
                  reward.available ? 'bg-gray-50 border-l-4 border-black' : 'bg-gray-50 border-l-4 border-gray-200 opacity-70'
                }`}
              >
                <div className="flex items-center">                  <div className={`w-10 h-10 rounded-lg mr-3 flex items-center justify-center text-xl
                    ${reward.available ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {rewardEmojis[reward.icon as keyof typeof rewardEmojis]}
                  </div>
                  <div>
                    <h4 className="font-medium">{reward.name}</h4>
                    <p className="text-xs text-gray-500">{reward.description || ''}
                      {!reward.available && (
                        <span className="ml-1">• Niveau {reward.level}</span>
                      )}
                    </p>
                  </div>
                </div>
                {reward.available ? (
                  <span className="text-green-600 text-lg">✅</span>
                ) : (
                  <span className="text-gray-400 text-lg">🔒</span>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Achievement notification amélioré */}
      <motion.div
        className="fixed bottom-20 left-0 right-0 flex justify-center pointer-events-none"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <div className="bg-black text-white px-5 py-3 rounded-lg flex items-center shadow-lg">
          <div className="mr-3 bg-white/20 rounded-full p-1.5 flex items-center justify-center">
            <span className="text-lg">🔔</span>
          </div>
          <div>
            <p className="text-xs text-gray-300">Nouvelle mission disponible</p>
            <p className="font-medium">Faites 3 transactions en une semaine</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}