"use client";

import React, { useState } from "react";
import PageHeader from "@/components/layouts/PageHeader";
import { useReferral } from "@/components/common/ReferralContext";
import Link from "next/link";

export default function RewardsPage() {
  const [activeCategory, setActiveCategory] = useState<
    "tous" | "badges" | "parrainage" | "cashback"
  >("tous");

  // Correction : Utilisez directement les données du contexte
  const { stats, referrals } = useReferral();

  // Données de badges (statiques pour l'instant)
  const badges = [
    {
      id: 1,
      name: "Premier pas",
      icon: "🚶",
      color: "bg-blue-100",
      description: "Première transaction effectuée",
      earned: true,
      date: "12/05/2025",
      category: "débutant",
    },
    {
      id: 2,
      name: "Acheteur régulier",
      icon: "🛍️",
      color: "bg-green-100",
      description: "10 transactions commerciales",
      earned: true,
      date: "02/05/2025",
      category: "shopping",
    },
    {
      id: 3,
      name: "Super parrain",
      icon: "👑",
      color: "bg-purple-100",
      description: "5 amis parrainés",
      earned: true,
      date: "30/04/2025",
      category: "parrainage",
    },
    {
      id: 4,
      name: "Top commerçant",
      icon: "🏪",
      color: "bg-amber-100",
      description: "Inviter 3 commerçants",
      earned: false,
      progress: 1,
      total: 3,
      category: "parrainage",
    },
    {
      id: 5,
      name: "Grand dépensier",
      icon: "💸",
      color: "bg-pink-100",
      description: "Dépenser 50 000 DA",
      earned: false,
      progress: 32500,
      total: 50000,
      category: "shopping",
    },
  ];

  // Fonctions d'aide pour le formatage
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const calculateProgress = (progress: number, total: number) => {
    return Math.min(Math.round((progress / total) * 100), 100);
  };

  const filteredBadges =
    activeCategory === "tous"
      ? badges
      : badges.filter((badge) => badge.category === activeCategory);

  const getBadgeCountByCategory = (category: string) => {
    return category === "tous"
      ? badges.length
      : badges.filter((b) => b.category === category).length;
  };

  const getEarnedBadgeCountByCategory = (category: string) => {
    return category === "tous"
      ? badges.filter((b) => b.earned).length
      : badges.filter((b) => b.category === category && b.earned).length;
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <PageHeader title="Récompenses" emoji="🏆" showBackButton={true} />

      {/* Bannière des points accumulés - Dynamisée ici */}
      <div className="px-5">
        <div className="my-4 relative bg-gradient-to-br from-amber-400 to-amber-600 text-white p-5 rounded-xl overflow-hidden shadow-lg">
          <div className="absolute right-0 top-0 w-40 h-40 rounded-full bg-gradient-to-br from-white/20 to-amber-500/10 -mr-20 -mt-20 blur-xl"></div>
          <div className="absolute left-0 bottom-0 w-40 h-40 rounded-full bg-gradient-to-br from-amber-700/20 to-amber-800/20 -ml-20 -mb-20 blur-xl"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm opacity-80">Total de récompenses</p>
              <div className="px-2 py-0.5 bg-white/20 rounded-full text-xs backdrop-blur-sm">
                Mise à jour: {formatDate(Date.now())}
              </div>
            </div>

            <h1 className="text-3xl font-bold">
              {formatNumber(stats.totalEarned)} DA
            </h1>

            <div className="mt-4 flex items-center">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center mr-3 backdrop-blur-sm">
                <span className="text-lg">🎁</span>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-sm">Parrainage</p>
                  <p className="font-bold">
                    {formatNumber(stats.totalEarned)} DA
                  </p>
                </div>
                {stats.pendingRewards > 0 && (
                  <p className="text-xs text-amber-100">
                    + {formatNumber(stats.pendingRewards)} DA en attente
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 flex justify-between">
              <Link
                href="/inviter"
                className="flex-1 mr-2 py-2 bg-white/20 backdrop-blur-sm text-white text-sm rounded-lg flex items-center justify-center hover:bg-white/30 active:scale-95 transition-all"
              >
                <span className="mr-2">👥</span>
                Inviter
              </Link>
              <Link
                href="/historique"
                className="flex-1 ml-2 py-2 bg-white/20 backdrop-blur-sm text-white text-sm rounded-lg flex items-center justify-center hover:bg-white/30 active:scale-95 transition-all"
              >
                <span className="mr-2">📊</span>
                Historique
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 mb-4">
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {["tous", "badges", "parrainage", "cashback"].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category as any)}
              className={`py-2 px-4 rounded-full whitespace-nowrap text-sm font-medium flex items-center ${
                activeCategory === category
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="mr-1">
                {category === "badges"
                  ? "🏅"
                  : category === "parrainage"
                  ? "🎁"
                  : category === "cashback"
                  ? "💰"
                  : "🔍"}
              </span>
              {category.charAt(0).toUpperCase() + category.slice(1)}
              <span className="ml-1.5 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
                {getEarnedBadgeCountByCategory(category)}/
                {getBadgeCountByCategory(category)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 space-y-6">
        {(activeCategory === "tous" || activeCategory === "badges") && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center">
                <span className="mr-2">🏅</span> Mes badges
              </h2>
              <span className="text-sm text-gray-500">
                {badges.filter((b) => b.earned).length} sur {badges.length}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`bg-white border border-gray-100 p-3 rounded-xl shadow-sm ${
                    !badge.earned && "opacity-70"
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <div
                      className={`w-10 h-10 rounded-full ${badge.color} flex items-center justify-center text-xl mr-2`}
                    >
                      <span>{badge.icon}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm line-clamp-1">
                        {badge.name}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          badge.earned
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {badge.earned ? "Obtenu" : "En cours"}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-1.5 line-clamp-2 h-8">
                    {badge.description}
                  </p>
                  {!badge.earned && badge.progress && badge.total && (
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{
                          width: `${calculateProgress(
                            badge.progress,
                            badge.total
                          )}%`,
                        }}
                      ></div>
                      <p className="text-xs text-gray-500 mt-1 text-right">
                        {badge.progress}/{badge.total}
                      </p>
                    </div>
                  )}
                  {badge.earned && badge.date && (
                    <p className="text-xs text-gray-400 text-right mt-1">
                      Obtenu le {badge.date}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <Link
              href="/rewards/badges"
              className="w-full py-2 border border-gray-200 text-sm font-medium rounded-lg flex items-center justify-center hover:bg-gray-50 active:scale-[0.98] transition-all"
            >
              <span className="mr-2">👀</span>
              Voir tous les badges
            </Link>
          </div>
        )}

        {(activeCategory === "tous" || activeCategory === "parrainage") && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center">
                <span className="mr-2">🎁</span> Programme de parrainage
              </h2>
              <span className="text-sm text-gray-500">
                {stats.totalInvited} invités
              </span>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Gagnez à chaque invitation</p>
                  <Link
                    href="/inviter"
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all"
                  >
                    Inviter
                  </Link>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-lg mr-3">
                      👨
                    </span>
                    <div>
                      <p className="font-medium text-sm">Ami</p>
                      <p className="text-xs text-gray-500">
                        Pour chaque ami qui s'inscrit
                      </p>
                    </div>
                  </div>
                  <div className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm font-medium">
                    +500 DA
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <span className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-lg mr-3">
                      🏪
                    </span>
                    <div>
                      <p className="font-medium text-sm">Commerçant</p>
                      <p className="text-xs text-gray-500">
                        Pour chaque commerçant qui s'inscrit
                      </p>
                    </div>
                  </div>
                  <div className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm font-medium">
                    +1000 DA
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {(activeCategory === "tous" || activeCategory === "cashback") && (
          <div className="space-y-4 mb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center">
                <span className="mr-2">💰</span> Programme de cashback
              </h2>
              <span className="text-sm text-gray-500">Niveau Silver</span>
            </div>

            <div className="space-y-3">
              <div className="bg-white border-2 border-green-200 p-4 rounded-xl relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 bg-green-100 px-2 py-1 text-xs text-green-700 rounded-bl-lg">
                  Actuel
                </div>
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-xl mr-3 text-white shadow-inner">
                    <span>🥈</span>
                  </div>
                  <div>
                    <p className="font-medium">Niveau Silver</p>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                      <p className="text-xs text-gray-500">
                        Votre niveau actuel
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-medium inline-block">
                  5% Cashback
                </div>
              </div>

              <div className="bg-white border border-gray-100 p-4 rounded-xl opacity-80 shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-amber-400 flex items-center justify-center text-xl mr-3 text-white">
                    <span>🥇</span>
                  </div>
                  <div>
                    <p className="font-medium">Niveau Gold</p>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-gray-300 mr-1"></div>
                      <p className="text-xs text-gray-500">
                        2000 points requis
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="bg-gray-100 text-gray-500 px-3 py-2 rounded-lg text-sm font-medium">
                    7% Cashback
                  </div>

                  <div className="flex items-center">
                    <div className="h-1.5 w-20 bg-gray-100 rounded-full overflow-hidden mr-2">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">1200/2000</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 p-4 rounded-xl opacity-70 shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-200 to-cyan-300 flex items-center justify-center text-xl mr-3 text-white">
                    <span>💎</span>
                  </div>
                  <div>
                    <p className="font-medium">Niveau Diamond</p>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-gray-300 mr-1"></div>
                      <p className="text-xs text-gray-500">
                        5000 points requis
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="bg-gray-100 text-gray-500 px-3 py-2 rounded-lg text-sm font-medium">
                    10% Cashback
                  </div>

                  <div className="flex items-center">
                    <div className="h-1.5 w-20 bg-gray-100 rounded-full overflow-hidden mr-2">
                      <div
                        className="h-full bg-blue-400 rounded-full"
                        style={{ width: "24%" }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">1200/5000</span>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/learn"
              className="block w-full py-3 bg-black text-white text-sm font-medium rounded-lg text-center hover:bg-gray-800 active:scale-[0.98] transition-all"
            >
              Comment gagner plus de points
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
