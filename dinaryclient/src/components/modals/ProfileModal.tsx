"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfileModal } from "@/components/common/ProfileModalContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
// CORRECTION : On importe UNIQUEMENT les fonctions qui existent vraiment.
import { getXpForLevel } from "@/utils/levelUtils";

export default function ProfileModal() {
  const router = useRouter();
  const { isOpen, closeModal, setComingFromProfileModal } = useProfileModal();
  const { user, gamificationProfile, logout } = useAuth();

  if (!isOpen || !user || !gamificationProfile) {
    return null;
  }

  // CORRECTION : On utilise le nom de fonction correct : `calculateXPForLevel`
  const xpForNextLevel = getXpForLevel(gamificationProfile.level);
  const handleLogout = () => {
    closeModal();
    logout();
  };

  const handleNavigation = (path: string) => {
    setComingFromProfileModal(true);
    closeModal();
    router.push(path);
  };

  const menuItems = [
    { icon: "👤", label: "Mon Compte", path: "/profile/account" },
    { icon: "🎨", label: "Apparence", path: "/profile/appearance" },
    { icon: "🔒", label: "Sécurité", path: "/profile/security" },
    { icon: "🔔", label: "Notifications", path: "/profile/notifications" },
    { icon: "❓", label: "Aide", path: "/profile/help" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <motion.div
            className="w-full max-w-md"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-t-3xl p-4 pb-0 shadow-lg">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

              <div className="flex items-center p-2">
                <div className="w-16 h-16 rounded-2xl bg-gray-200 flex-shrink-0 mr-4" />
                <div className="flex-grow">
                  <h3 className="font-bold text-lg">{user.fullName}</h3>
                  <p className="text-gray-500 text-sm">@{user.username}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-3 my-4">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-xs font-semibold">
                    Niveau {gamificationProfile.level}
                  </div>
                  <div className="text-xs font-bold text-purple-600">
                    Dinarus Prime
                  </div>
                </div>
                <progress
                  className="progress progress-primary w-full h-2"
                  value={gamificationProfile.xp}
                  max={xpForNextLevel}
                ></progress>
                <div className="text-xs text-gray-500 w-full text-right mt-1">
                  {gamificationProfile.xp}/{xpForNextLevel} XP
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {menuItems.map((item) => (
                  <div
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center mr-3">
                        <span className="text-lg">{item.icon}</span>
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <span className="text-gray-400">→</span>
                  </div>
                ))}

                <div
                  className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-red-50"
                  onClick={handleLogout}
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
                </div>
              </div>

              <div className="text-center mt-8 mb-2">
                <p className="text-xs text-gray-400">Dinary v2.5.1</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
