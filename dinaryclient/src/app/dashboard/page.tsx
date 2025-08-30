"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layouts/PageHeader";
import PromoBanner from "@/components/common/PromoBanner";
import NotificationsPanel from "@/components/modals/NotificationsPanel";
import TransactionReceipt, {
  TransactionDetails,
} from "@/components/modals/TransactionReceipt";
import { useNotifications } from "@/components/common/NotificationsContext";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { getXpForLevel, getLevelTitle } from "@/utils/levelUtils";

// --- Interfaces pour les données dynamiques (INCHANGÉ) ---
interface WalletData {
  balance: number;
  currency: string;
}
interface GamificationProfile {
  level: number;
  xp: number;
}

// --- Animation variants (INCHANGÉ) ---
const buttonTapAnimation = {
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};
const sectionTapAnimation = {
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};

export default function Dashboard() {
  // --- Hooks (nettoyés pour utiliser seulement le contexte) ---
  const [showNotifications, setShowNotifications] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionDetails | null>(null);
  const router = useRouter();

  // CORRECTION 1 : On utilise UNIQUEMENT les données du contexte AuthContext.
  // Fini les useState et useEffect locaux pour wallet et gamificationProfile.
  const { user, wallet, gamificationProfile, isLoading } = useAuth();

  const {
    notifications,
    unreadCount,
    markAllAsRead,
    handleNotificationClick: openNotification, // Renommé pour clarté
  } = useNotifications();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // --- Fonctions de gestion (INCHANGÉ) ---
  const handleParrainage = () => router.push("/inviter");
  const handleTransactionClick = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowReceipt(true);
  };

  // CORRECTION 2 : La garde de chargement est renforcée pour attendre TOUTES les données.
  if (!isClient || isLoading || !user || !wallet || !gamificationProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Chargement de votre session...</p>
      </div>
    );
  }

  // CORRECTION 3 : Les calculs sont déplacés ICI, après la garde de chargement.
  // On est maintenant sûr que `gamificationProfile` n'est pas `null`.
  const xpToNextLevel = getXpForLevel(gamificationProfile.level);
  const progressPercentage = (gamificationProfile.xp / xpToNextLevel) * 100;

  // --- Données statiques pour l'exemple (INCHANGÉ) ---
  const recentTransactions = [
    {
      id: 1,
      type: "cashback",
      category: "Cashback",
      icon: "🥬",
      bgColor: "bg-green-100",
      name: "Bio&Co",
      date: "Aujourd'hui • 14:30",
      amount: "+15 DA",
      isPositive: true,
      points: "+5 points",
    },
    {
      id: 2,
      type: "payment",
      category: "Sortie",
      icon: "🍽️",
      bgColor: "bg-red-100",
      name: "Gaia Café",
      date: "Hier • 12:15",
      amount: "-80 DA",
      isPositive: false,
      points: "+8 points",
    },
    {
      id: 3,
      type: "recharge",
      category: "Entrée",
      icon: "📱",
      bgColor: "bg-blue-100",
      name: "Recharge",
      date: "12 mai • 09:45",
      amount: "+500 DA",
      isPositive: true,
      points: "+10 points",
    },
  ];

  // --- Rendu du composant (votre design est 100% conservé) ---
  return (
    <div className="bg-white min-h-screen mb-16">
      <PageHeader
        title={`Bonjour, ${user.username}`}
        emoji="🏠"
        actionButton={
          <button
            className="p-2 relative"
            onClick={() => setShowNotifications(true)}
          >
            <span className="text-lg">🔔</span>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        }
      />

      <div className="px-5">
        <div
          onClick={() => router.push("/wallet")}
          className="block cursor-pointer"
        >
          <motion.div
            whileTap="tap"
            variants={sectionTapAnimation}
            className="my-4 relative bg-gradient-to-br from-blue-900 to-gray-800 text-white p-5 rounded-xl overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-40 h-40 rounded-full bg-gradient-to-br from-yellow-400/30 to-yellow-600/20 -mr-20 -mt-20 blur-xl"></div>
            <div className="absolute left-0 bottom-0 w-40 h-40 rounded-full bg-gradient-to-br from-gray-700/30 to-gray-900/30 -ml-20 -mb-20 blur-xl"></div>
            <div className="mb-3 relative z-10">
              <p className="text-sm opacity-80">Solde disponible</p>
              <h1 className="text-3xl font-bold mt-1 text-white">
                {wallet.balance.toLocaleString("fr-FR")} DZD
              </h1>
              <span className="ml-2 text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </span>
            </div>
            <div className="flex justify-between mt-4 relative z-10">
              <Link href="/envoyer" className="flex-1 mr-2">
                <motion.button
                  whileTap="tap"
                  variants={buttonTapAnimation}
                  className="w-full bg-white/20 hover:bg-white/30 py-2 rounded-xl flex items-center justify-center backdrop-blur-sm transition-colors"
                >
                  <span className="text-sm mr-1">🚀</span>
                  <span className="text-sm">Envoyer</span>
                </motion.button>
              </Link>
              <Link href="/recharger" className="flex-1 ml-2">
                <motion.button
                  whileTap="tap"
                  variants={buttonTapAnimation}
                  className="w-full bg-white/20 hover:bg-white/30 py-2 rounded-xl flex items-center justify-center backdrop-blur-sm transition-colors"
                >
                  <span className="text-sm mr-1">📥</span>
                  <span className="text-sm">Recharger</span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="mb-5">
          <PromoBanner
            title="+1000DA"
            description="Parraine un commerçant et gagne +1000DA"
            emoji="🎁"
            action={handleParrainage}
            actionLabel="Parrainer"
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Actions rapides</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center">
              <Link href="/inviter">
                <motion.div
                  whileTap="tap"
                  variants={buttonTapAnimation}
                  className="w-14 h-14 bg-gradient-to-br from-blue-900 to-gray-800 text-white rounded-full flex items-center justify-center mb-1 overflow-hidden relative shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="absolute right-0 top-0 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400/30 to-yellow-600/20 -mr-4 -mt-4 blur-md"></div>
                  <div className="absolute left-0 bottom-0 w-8 h-8 rounded-full bg-gradient-to-br from-gray-700/30 to-gray-900/30 -ml-4 -mb-4 blur-md"></div>
                  <span className="text-xl relative z-10">👥</span>
                </motion.div>
              </Link>
              <span className="text-xs text-center">Inviter</span>
            </div>
            <div className="flex flex-col items-center">
              <Link href="/amis">
                <motion.div
                  whileTap="tap"
                  variants={buttonTapAnimation}
                  className="w-14 h-14 bg-gradient-to-br from-blue-900 to-gray-800 text-white rounded-full flex items-center justify-center mb-1 overflow-hidden relative shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="absolute right-0 top-0 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400/30 to-yellow-600/20 -mr-4 -mt-4 blur-md"></div>
                  <div className="absolute left-0 bottom-0 w-8 h-8 rounded-full bg-gradient-to-br from-gray-700/30 to-gray-900/30 -ml-4 -mb-4 blur-md"></div>
                  <span className="text-xl relative z-10">👤</span>
                </motion.div>
              </Link>
              <span className="text-xs text-center">Amis</span>
            </div>
            <div className="flex flex-col items-center">
              <Link href="/missions">
                <motion.div
                  whileTap="tap"
                  variants={buttonTapAnimation}
                  className="w-14 h-14 bg-gradient-to-br from-blue-900 to-gray-800 text-white rounded-full flex items-center justify-center mb-1 overflow-hidden relative shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="absolute right-0 top-0 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400/30 to-yellow-600/20 -mr-4 -mt-4 blur-md"></div>
                  <div className="absolute left-0 bottom-0 w-8 h-8 rounded-full bg-gradient-to-br from-gray-700/30 to-gray-900/30 -ml-4 -mb-4 blur-md"></div>
                  <span className="text-xl relative z-10">🎯</span>
                </motion.div>
              </Link>
              <span className="text-xs text-center">Missions</span>
            </div>
          </div>
        </div>

        <div className="my-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Progression</h2>
            <Link href="/progression" className="text-sm text-gray-500">
              Détails
            </Link>
          </div>

          <Link href="/progression" className="block">
            <motion.div
              whileTap="tap"
              variants={sectionTapAnimation}
              className="bg-black text-white rounded-xl p-4 transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                      <span>🔥</span>
                    </div>
                    <div>
                      <p className="font-medium">
                        Niveau {gamificationProfile.level}
                      </p>
                      <p className="text-xs text-white/80">
                        {getLevelTitle(gamificationProfile.level)}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white/20 text-white px-3 py-1 rounded-full text-xs">
                    {gamificationProfile.xp} XP
                  </div>
                </div>

                <div className="flex justify-between text-xs text-white/60 mb-1 px-1">
                  <span>Niveau {gamificationProfile.level}</span>
                  <span>
                    {gamificationProfile.xp} / {xpToNextLevel} XP
                  </span>
                  <span>Niveau {gamificationProfile.level + 1}</span>
                </div>

                <div className="bg-white/20 h-1 rounded-full mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-white rounded-full"
                  ></motion.div>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <div className="text-center flex-1 border-r border-white/20">
                    <p className="font-bold text-sm">
                      {gamificationProfile.xp}
                    </p>
                    <p className="text-xs text-white/60">XP Total</p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="font-bold text-sm">
                      {gamificationProfile.level}
                    </p>
                    <p className="text-xs text-white/60">Niveau actuel</p>
                  </div>
                </div>
              </>
            </motion.div>
          </Link>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Activité récente</h2>
            <Link href="/historique" className="text-sm text-gray-500">
              Tout voir
            </Link>
          </div>

          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                whileTap="tap"
                variants={sectionTapAnimation}
                className="flex justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => handleTransactionClick(transaction)}
              >
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-xl ${transaction.bgColor} flex items-center justify-center mr-3`}
                  >
                    <span>{transaction.icon}</span>
                  </div>
                  <div>
                    <p className="font-medium">{transaction.name}</p>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-medium ${
                      transaction.isPositive ? "text-green-600" : ""
                    }`}
                  >
                    {transaction.amount}
                  </p>
                  <p className="text-xs text-gray-500">
                    {transaction.category}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <NotificationsPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkAllAsRead={markAllAsRead}
        onNotificationClick={openNotification}
      />
      <TransactionReceipt
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
}
