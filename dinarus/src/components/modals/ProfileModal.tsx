"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useProfileModal } from "@/components/common/ProfileModalContext";
import { useRouter } from "next/navigation";
import {
  calculateXPForLevel,
  getLevelTitle,
  getLevelEmoji,
} from "@/utils/levelUtils";
import { useAuth } from "@/context/AuthContext";

interface ProfileModalProps {
  userName: string;
  userLevel: string;
  userPoints: number;
}

export default function ProfileModal(props: ProfileModalProps) {
  const [showQRModal, setShowQRModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"myQR" | "scanner">("myQR");
  const [showPanel, setShowPanel] = useState(false);

  // Appels aux hooks au niveau supérieur du composant
  const { isOpen, closeModal, setComingFromProfileModal } = useProfileModal();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  // Déclarations de données et mémorisations au niveau supérieur, avant toute condition
  const userData = {
    level: 3,
    xp: 280,
    totalXP: 1780,
    title: getLevelTitle(3),
    daysActive: 73,
    missionsCompleted: 8,
  };

  const xpToNextLevel = useMemo(
    () => calculateXPForLevel(userData.level),
    [userData.level]
  );
  const progressPercentage = (userData.xp / xpToNextLevel) * 100;

  // Effet pour gérer le style de la page
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const bottomNavbar = document.querySelector("[data-bottom-navbar]");
      if (bottomNavbar) bottomNavbar.classList.add("hidden");
      setTimeout(() => setShowPanel(true), 50);
    } else {
      setShowPanel(false);
      document.body.style.overflow = "auto";
      const bottomNavbar = document.querySelector("[data-bottom-navbar]");
      if (bottomNavbar) bottomNavbar.classList.remove("hidden");
    }
    return () => {
      document.body.style.overflow = "auto";
      const bottomNavbar = document.querySelector("[data-bottom-navbar]");
      if (bottomNavbar) bottomNavbar.classList.remove("hidden");
    };
  }, [isOpen]);

  const handleProfileLinkClick = (path: string) => {
    setComingFromProfileModal(true);
    closeModal();
    router.push(path);
  };

  // Condition de retour anticipé pour ne pas afficher le modal si les données ne sont pas prêtes
  if (!isOpen || isLoading || !user) {
    return null;
  }

  // Calculs sécurisés des données de l'utilisateur
  const initials = user.fullName
    ? user.fullName
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .toUpperCase()
    : "?";
  const username = user.username || "utilisateur";
  const fullName = user.fullName || "Utilisateur Dinary";

  if (showQRModal) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 bg-white z-50 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="p-4 flex justify-between items-center border-b border-gray-200/50 relative z-10 backdrop-blur-sm bg-white/80">
            <motion.button
              onClick={() => setShowQRModal(false)}
              className="p-2 relative"
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-9 h-9 rounded-full bg-black/5 backdrop-blur-sm flex items-center justify-center">
                <span className="text-xl">←</span>
              </div>
            </motion.button>
            <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {activeTab === "myQR" ? "Mon QR Code" : "Scanner un QR code"}
            </h2>
            <div className="w-8"></div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-16 px-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/60 backdrop-blur-sm"
            onClick={closeModal}
          ></div>

          <motion.div
            className="bg-white/90 backdrop-blur-md rounded-2xl w-full max-w-md mx-auto max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: showPanel ? 0 : 30, opacity: showPanel ? 1 : 0 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-200/50 sticky top-0 z-10 backdrop-blur-sm bg-white/80 rounded-t-2xl">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Mon Profil
              </h2>
              <motion.button
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-black/5 backdrop-blur-sm flex items-center justify-center"
                whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-lg">✕</span>
              </motion.button>
            </div>

            <div className="p-5 overflow-y-auto flex-grow relative z-10">
              <motion.div
                className="flex flex-col items-center mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center text-3xl font-bold mb-4 shadow-lg">
                    {initials}
                  </div>
                </div>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => setShowQRModal(true)}
                >
                  <p className="font-medium text-xl text-center bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {fullName}
                  </p>
                </div>
                <motion.p
                  className="text-sm text-gray-600 mb-1"
                  onClick={() => setShowQRModal(true)}
                  whileHover={{ color: "#3B82F6" }}
                >
                  @{username}
                </motion.p>
                <p className="text-xs text-gray-500 mb-4">
                  Membre depuis Mai 2024
                </p>

                <motion.div
                  className="w-full bg-black text-white px-5 py-3 rounded-xl mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center justify-center mb-1">
                    <h1 className="text-lg font-medium">
                      Niveau {userData.level}
                    </h1>
                  </div>
                  <p className="text-white/80 text-xs text-center mb-2">
                    {userData.title}
                  </p>

                  <div className="flex justify-between text-[10px] text-white/80 px-1 mb-1">
                    <span>Niveau {userData.level}</span>
                    <span>
                      {userData.xp} / {xpToNextLevel} XP
                    </span>
                    <span>Niveau {userData.level + 1}</span>
                  </div>
                  <div className="w-full h-1 bg-white/20 rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>

                  <div className="flex justify-between mt-3 pt-2 border-t border-white/10">
                    <div className="text-center flex-1">
                      <p className="font-bold text-sm">{userData.totalXP}</p>
                      <p className="text-[10px] text-white/70">XP Total</p>
                    </div>
                    <div className="text-center flex-1 border-l border-r border-white/10">
                      <p className="font-bold text-sm">{userData.daysActive}</p>
                      <p className="text-[10px] text-white/70">Jours actifs</p>
                    </div>
                    <div className="text-center flex-1">
                      <p className="font-bold text-sm">
                        {userData.missionsCompleted}
                      </p>
                      <p className="text-[10px] text-white/70">Missions</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                className="flex justify-around mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  className="flex flex-col items-center justify-center"
                  onClick={() => {
                    setActiveTab("myQR");
                    setShowQRModal(true);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-2 shadow-md">
                    <span className="text-2xl">🔄</span>
                  </div>
                  <span className="text-sm text-gray-700">Mon QR Code</span>
                </motion.button>
                <motion.button
                  className="flex flex-col items-center justify-center"
                  onClick={() => {
                    setActiveTab("scanner");
                    setShowQRModal(true);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-2 shadow-md">
                    <span className="text-2xl">📷</span>
                  </div>
                  <span className="text-sm text-gray-700">Scanner</span>
                </motion.button>
              </motion.div>

              <motion.div
                className="mb-7"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-xs uppercase font-medium mb-3 pl-1 bg-gradient-to-r from-gray-700 to-gray-500 bg-clip-text text-transparent">
                  Services
                </h3>
                <div className="space-y-1.5 rounded-2xl overflow-hidden bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm shadow-sm border border-white/50">
                  <div
                    className="block"
                    onClick={() => handleProfileLinkClick("/profile/help")}
                  >
                    <motion.div
                      className="flex items-center justify-between p-3.5 cursor-pointer"
                      whileHover={{
                        backgroundColor: "rgba(59, 130, 246, 0.05)",
                      }}
                    >
                      <div className="flex items-center min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-lg">❓</span>
                        </div>
                        <span className="font-medium truncate text-gray-800">
                          Aide
                        </span>
                      </div>
                      <span className="text-blue-500 flex-shrink-0">→</span>
                    </motion.div>
                  </div>

                  <div
                    className="block"
                    onClick={() => handleProfileLinkClick("/profile/account")}
                  >
                    <motion.div
                      className="flex items-center justify-between p-3.5 cursor-pointer"
                      whileHover={{
                        backgroundColor: "rgba(59, 130, 246, 0.05)",
                      }}
                    >
                      <div className="flex items-center min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-lg">👤</span>
                        </div>
                        <span className="font-medium truncate text-gray-800">
                          Compte
                        </span>
                      </div>
                      <span className="text-blue-500 flex-shrink-0">→</span>
                    </motion.div>
                  </div>

                  <div
                    className="block"
                    onClick={() => handleProfileLinkClick("/profile/documents")}
                  >
                    <motion.div
                      className="flex items-center justify-between p-3.5 cursor-pointer"
                      whileHover={{
                        backgroundColor: "rgba(59, 130, 246, 0.05)",
                      }}
                    >
                      <div className="flex items-center min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-lg">📄</span>
                        </div>
                        <span className="font-medium truncate text-gray-800">
                          Documents
                        </span>
                      </div>
                      <span className="text-blue-500 flex-shrink-0">→</span>
                    </motion.div>
                  </div>

                  <div
                    className="block"
                    onClick={() => handleProfileLinkClick("/profile/inbox")}
                  >
                    <motion.div
                      className="flex items-center justify-between p-3.5 cursor-pointer"
                      whileHover={{
                        backgroundColor: "rgba(59, 130, 246, 0.05)",
                      }}
                    >
                      <div className="flex items-center min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-lg">📩</span>
                        </div>
                        <span className="font-medium truncate text-gray-800">
                          Boîte de réception
                        </span>
                      </div>
                      <span className="text-blue-500 flex-shrink-0">→</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="mb-7"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-xs uppercase font-medium mb-3 pl-1 bg-gradient-to-r from-gray-700 to-gray-500 bg-clip-text text-transparent">
                  Paramètres
                </h3>
                <div className="space-y-1.5 rounded-2xl overflow-hidden bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm shadow-sm border border-white/50">
                  <div
                    className="block"
                    onClick={() => handleProfileLinkClick("/profile/security")}
                  >
                    <motion.div
                      className="flex items-center justify-between p-3.5 cursor-pointer"
                      whileHover={{
                        backgroundColor: "rgba(59, 130, 246, 0.05)",
                      }}
                    >
                      <div className="flex items-center min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-lg">🔒</span>
                        </div>
                        <span className="font-medium truncate text-gray-800">
                          Sécurité
                        </span>
                      </div>
                      <span className="text-blue-500 flex-shrink-0">→</span>
                    </motion.div>
                  </div>

                  <div
                    className="block"
                    onClick={() =>
                      handleProfileLinkClick("/profile/notifications")
                    }
                  >
                    <motion.div
                      className="flex items-center justify-between p-3.5 cursor-pointer"
                      whileHover={{
                        backgroundColor: "rgba(59, 130, 246, 0.05)",
                      }}
                    >
                      <div className="flex items-center min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-lg">🔔</span>
                        </div>
                        <span className="font-medium truncate text-gray-800">
                          Paramètres de notification
                        </span>
                      </div>
                      <span className="text-blue-500 flex-shrink-0">→</span>
                    </motion.div>
                  </div>

                  <div
                    className="block"
                    onClick={() =>
                      handleProfileLinkClick("/profile/accessibility")
                    }
                  >
                    <motion.div
                      className="flex items-center justify-between p-3.5 cursor-pointer"
                      whileHover={{
                        backgroundColor: "rgba(59, 130, 246, 0.05)",
                      }}
                    >
                      <div className="flex items-center min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-lg">♿</span>
                        </div>
                        <span className="font-medium truncate text-gray-800">
                          Accessibilité
                        </span>
                      </div>
                      <span className="text-blue-500 flex-shrink-0">→</span>
                    </motion.div>
                  </div>

                  <div
                    className="block"
                    onClick={() => handleProfileLinkClick("/profile/features")}
                  >
                    <motion.div
                      className="flex items-center justify-between p-3.5 cursor-pointer"
                      whileHover={{
                        backgroundColor: "rgba(59, 130, 246, 0.05)",
                      }}
                    >
                      <div className="flex items-center min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-lg">✨</span>
                        </div>
                        <span className="font-medium truncate text-gray-800">
                          Nouvelles fonctionnalités
                        </span>
                      </div>
                      <span className="text-blue-500 flex-shrink-0">→</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="mb-7"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-xs uppercase font-medium mb-3 pl-1 bg-gradient-to-r from-gray-700 to-gray-500 bg-clip-text text-transparent">
                  À propos
                </h3>
                <div className="space-y-1.5 rounded-2xl overflow-hidden bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm shadow-sm border border-white/50">
                  <div
                    className="block"
                    onClick={() => handleProfileLinkClick("/profile/feedback")}
                  >
                    <motion.div
                      className="flex items-center justify-between p-3.5 cursor-pointer"
                      whileHover={{
                        backgroundColor: "rgba(59, 130, 246, 0.05)",
                      }}
                    >
                      <div className="flex items-center min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-lg">💬</span>
                        </div>
                        <span className="font-medium truncate text-gray-800">
                          Donner son avis
                        </span>
                      </div>
                      <span className="text-blue-500 flex-shrink-0">→</span>
                    </motion.div>
                  </div>

                  <div
                    className="block"
                    onClick={() => handleProfileLinkClick("/profile/about")}
                  >
                    <motion.div
                      className="flex items-center justify-between p-3.5 cursor-pointer"
                      whileHover={{
                        backgroundColor: "rgba(59, 130, 246, 0.05)",
                      }}
                    >
                      <div className="flex items-center min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-lg">ℹ️</span>
                        </div>
                        <span className="font-medium truncate text-gray-800">
                          À propos de Dinary
                        </span>
                      </div>
                      <span className="text-blue-500 flex-shrink-0">→</span>
                    </motion.div>
                  </div>

                  <div className="block cursor-pointer" onClick={logout}>
                    <motion.div
                      className="flex items-center justify-between p-3.5 cursor-pointer"
                      whileHover={{
                        backgroundColor: "rgba(239, 68, 68, 0.05)",
                      }}
                    >
                      <div className="flex items-center min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="text-lg">🚪</span>
                        </div>
                        <span className="font-medium truncate text-red-600">
                          Se déconnecter
                        </span>
                      </div>
                      <span className="text-red-500 flex-shrink-0">→</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="text-center mt-8 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-xs bg-gradient-to-r from-gray-500 to-gray-400 bg-clip-text text-transparent">
                  Dinary v2.5.1
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
