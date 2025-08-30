"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/layouts/PageHeader";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  calculateXPForLevel,
  getLevelTitle,
  getLevelEmoji,
  getLevelData,
  getLevelRewards,
} from "@/utils/levelUtils";

// Interface pour les données dynamiques
interface GamificationProfile {
  level: number;
  xp: number;
  totalXP: number; // Assurez-vous que votre backend renvoie bien ce champ
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function ProgressionPage() {
  // --- HOOKS AU NIVEAU SUPÉRIEUR ---
  const [gamificationProfile, setGamificationProfile] =
    useState<GamificationProfile | null>(null);
  const { user, token, isLoading } = useAuth();

  useEffect(() => {
    const fetchGamificationProfile = async () => {
      if (!token) return;
      try {
        const response = await fetch(
          "http://localhost:3001/api/gamification/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.ok) {
          const data = await response.json();
          // Assumons que le backend ne renvoie pas totalXP, on le simule pour l'instant
          setGamificationProfile({ ...data, totalXP: data.xp + 1500 }); // Simulation
        }
      } catch (error) {
        console.error(
          "Erreur de récupération du profil de gamification:",
          error
        );
      }
    };
    fetchGamificationProfile();
  }, [token]);

  // --- VARIABLES ET CALCULS MÉMORISÉS ---
  // Ces calculs ne seront effectués que si gamificationProfile existe
  const xpToNextLevel = useMemo(
    () =>
      gamificationProfile ? calculateXPForLevel(gamificationProfile.level) : 1,
    [gamificationProfile]
  );

  const progressPercentage = useMemo(
    () =>
      gamificationProfile ? (gamificationProfile.xp / xpToNextLevel) * 100 : 0,
    [gamificationProfile, xpToNextLevel]
  );

  const currentLevelData = useMemo(
    () =>
      gamificationProfile ? getLevelData(gamificationProfile.level) : null,
    [gamificationProfile]
  );

  const displayLevels = useMemo(() => {
    if (!gamificationProfile || !currentLevelData) return [];
    const levels = [];
    for (
      let i = Math.max(1, gamificationProfile.level - 2);
      i < gamificationProfile.level;
      i++
    ) {
      levels.push(getLevelData(i));
    }
    levels.push(currentLevelData);
    for (
      let i = gamificationProfile.level + 1;
      i <= gamificationProfile.level + 2;
      i++
    ) {
      levels.push(getLevelData(i));
    }
    return levels;
  }, [gamificationProfile, currentLevelData]);

  const nextImportantReward = useMemo(() => {
    if (!gamificationProfile) return { name: "", level: 0 };
    const nextLevel = gamificationProfile.level + 1;
    return {
      name:
        nextLevel === 4
          ? "Priorité support"
          : nextLevel === 5
          ? "Cashback 10%"
          : "Avantages supplémentaires",
      level: nextLevel,
    };
  }, [gamificationProfile]);

  // --- GESTION DU RENDU ---
  if (isLoading || !user || !gamificationProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Chargement de la progression...</p>
      </div>
    );
  }

  // Historique des points gagnés (statique pour l'instant)
  const xpHistory = [
    {
      id: 1,
      action: "Transaction marchande",
      date: "12 mai 2025",
      points: 15,
      icon: "💳",
    },
    {
      id: 2,
      action: "Défi quotidien",
      date: "11 mai 2025",
      points: 25,
      icon: "📆",
    },
    {
      id: 3,
      action: "Parrainage",
      date: "08 mai 2025",
      points: 100,
      icon: "👥",
    },
    {
      id: 4,
      action: "Mission complétée",
      date: "05 mai 2025",
      points: 50,
      icon: "🎯",
    },
    {
      id: 5,
      action: "Première transaction",
      date: "01 mai 2025",
      points: 50,
      icon: "💰",
    },
  ];

  return (
    <div className="bg-white min-h-screen pb-16">
      <PageHeader
        title="Progression"
        emoji=""
        showBackButton
        backTo="/missions"
      />

      <div className="bg-black text-white px-6 py-3">
        <div className="flex items-center justify-center mb-1">
          <h1 className="text-lg font-medium">
            Niveau {gamificationProfile.level}
          </h1>
        </div>
        <p className="text-white/80 text-xs text-center mb-2">
          {currentLevelData?.title}
        </p>

        <div className="flex justify-between text-[10px] text-white/80 px-1 mb-1">
          <span>Niveau {gamificationProfile.level}</span>
          <span>
            {gamificationProfile.xp} / {xpToNextLevel} XP
          </span>
          <span>Niveau {gamificationProfile.level + 1}</span>
        </div>
        <div className="w-full h-1 bg-white/20 rounded-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-white rounded-full"
          />
        </div>
      </div>

      <div className="px-6 pt-4">
        <motion.div
          className="bg-white mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex justify-between">
            <div className="text-center flex-1">
              <p className="font-bold text-lg">{gamificationProfile.totalXP}</p>
              <p className="text-xs text-gray-500">XP Total</p>
            </div>
            <div className="text-center flex-1 border-l border-r border-gray-100">
              <p className="font-bold text-lg">73</p>
              <p className="text-xs text-gray-500">Jours actifs</p>
            </div>
            <div className="text-center flex-1">
              <p className="font-bold text-lg">8</p>
              <p className="text-xs text-gray-500">Missions</p>
            </div>
          </div>

          <div className="mt-4 py-2 flex items-center">
            <span className="text-amber-500 mr-2 text-lg">🔒</span>
            <p className="text-sm">
              Prochain : Niveau {nextImportantReward.level} –{" "}
              {nextImportantReward.name}
            </p>
          </div>
        </motion.div>

        <div className="mb-6">
          <div className="flex items-center mb-4">
            <span className="text-amber-500 mr-2 text-lg">🏅</span>
            <h2 className="text-lg font-medium">Paliers et avantages</h2>
          </div>

          <motion.div
            className="space-y-2"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {displayLevels.map((level) => (
              <motion.div
                key={level.level}
                variants={itemVariants}
                className={`rounded-lg p-3 flex items-center ${
                  level.level <= gamificationProfile.level
                    ? "bg-black text-white"
                    : "bg-gray-50 text-gray-600"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex-shrink-0 mr-3 flex items-center justify-center ${
                    level.level <= gamificationProfile.level
                      ? "bg-white/20"
                      : "bg-gray-200"
                  }`}
                >
                  <span className="text-base">{level.emoji}</span>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">
                        Nv. {level.level} : {level.title}
                      </span>
                      {level.level === gamificationProfile.level && (
                        <span className="ml-1.5 text-xs bg-white/20 px-1.5 py-0.5 rounded text-white">
                          Actuel
                        </span>
                      )}
                    </div>
                    <span className="text-xs">{level.xp} XP</span>
                  </div>
                </div>
                <span className="ml-2 text-sm">
                  {level.level <= gamificationProfile.level ? (
                    <span className="text-green-300">✓</span>
                  ) : (
                    <span className="text-amber-500">🔒</span>
                  )}
                </span>
              </motion.div>
            ))}

            <div className="text-center py-3 text-gray-400">
              <span>•••</span>
              <p className="text-xs mt-1">Les niveaux continuent à l'infini</p>
            </div>
          </motion.div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <span className="text-lg mr-2">📊</span>
              <h2 className="text-lg font-medium">Historique des points</h2>
            </div>
            <Link href="/historique" className="text-sm text-gray-500">
              Tout voir
            </Link>
          </div>

          <motion.div
            className="space-y-0"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {xpHistory.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="flex items-center py-3 border-b border-gray-100"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 mr-3 flex items-center justify-center text-blue-500">
                  <span className="text-base">{item.icon}</span>
                </div>
                <div className="flex-grow">
                  <h4 className="text-sm font-medium">{item.action}</h4>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
                <div className="text-right">
                  <span className="font-medium text-green-500 flex items-center">
                    +{item.points}{" "}
                    <span className="text-yellow-500 ml-1 text-xs">⭐</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
