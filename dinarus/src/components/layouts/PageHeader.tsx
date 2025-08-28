"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import ProfileModal from "@/components/modals/ProfileModal";
import { useProfileModal } from "@/components/common/ProfileModalContext";
import { useNotifications } from "@/components/common/NotificationsContext";
import NotificationsPanel from "@/components/modals/NotificationsPanel";
import BackToProfileButton from "@/components/layouts/BackToProfileButton";
import { useAuth } from "@/context/AuthContext"; // 👈 NOUVEL IMPORT

interface PageHeaderProps {
  title: string;
  emoji?: string;
  showBackButton?: boolean;
  hasBackButton?: boolean; // Pour compatibilité avec les pages existantes
  backTo?: string;
  actionButton?: React.ReactNode;
  userName?: string;
  openProfileModalOnBack?: boolean; // Nouvelle prop pour ouvrir le modal de profil au retour
  onBackClick?: () => void; // Callback personnalisé pour le bouton retour
  showAppName?: boolean; // Nouvelle prop pour afficher le nom de l'app au centre
  withScrollBehavior?: boolean; // Pour activer le comportement de rétractation lors du défilement
}

export default function PageHeader({
  title,
  emoji = "📱",
  showBackButton = false,
  hasBackButton = false, // Pour compatibilité avec les pages existantes
  backTo = "/dashboard",
  actionButton,
  userName = "Mariam Benali",
  openProfileModalOnBack = false,
  onBackClick,
  showAppName = true, // Par défaut, affiche le nom de l'app
  withScrollBehavior = true, // Par défaut, active le comportement de rétractation
}: PageHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { openModal, comingFromProfileModal } = useProfileModal();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { user } = useAuth(); // 👈 RÉCUPÉRATION DE L'UTILISATEUR VIA LE CONTEXTE

  // Hook pour détecter le défilement
  const { scrollY } = useScroll();

  // Transformer les propriétés en fonction du défilement si le comportement est activé
  const headerPadding = withScrollBehavior
    ? useTransform(scrollY, [0, 50], ["14px", "8px"])
    : "14px";
  const headerHeight = withScrollBehavior
    ? useTransform(scrollY, [0, 50], ["auto", "auto"])
    : "auto";
  const titleSize = withScrollBehavior
    ? useTransform(scrollY, [0, 50], ["1.5rem", "1.2rem"])
    : "1.5rem";
  const appNameSize = withScrollBehavior
    ? useTransform(scrollY, [0, 50], ["1.25rem", "1rem"])
    : "1.25rem";

  // Mettre à jour l'état lorsque la position de défilement change
  useEffect(() => {
    if (withScrollBehavior) {
      const updateScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };

      window.addEventListener("scroll", updateScroll);
      return () => {
        window.removeEventListener("scroll", updateScroll);
      };
    }
  }, [withScrollBehavior]);

  // Vérifier si nous sommes sur une page de profil
  const isProfilePage = pathname.startsWith("/profile/");

  // Calculer les initiales de l'utilisateur de manière dynamique
  const dynamicUserName = user?.fullName || "Utilisateur"; // 👈 NOUVEAU: Nom dynamique
  const dynamicInitials = dynamicUserName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase();

  // Utiliser hasBackButton si fourni, sinon utiliser showBackButton pour compatibilité
  const shouldShowBackButton = hasBackButton || showBackButton;

  // Gérer le clic sur le bouton retour
  const handleBackClick = (e: React.MouseEvent) => {
    if (openProfileModalOnBack) {
      e.preventDefault();
      openModal();
    } else if (onBackClick) {
      e.preventDefault();
      onBackClick();
    }
    // Si ni openProfileModalOnBack ni onBackClick ne sont définis, le comportement par défaut du lien sera utilisé
  };

  // Gérer le clic sur une notification
  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);

    // Si la notification a un lien, naviguer vers cette page
    if (notification.link) {
      setShowNotifications(false);
      // La navigation sera gérée par le lien dans le composant
    }
  };

  return (
    <>
      <motion.div
        className={`bg-white sticky top-0 z-30 ${
          isScrolled ? "shadow-sm" : ""
        } transition-shadow`}
        style={{
          paddingTop: headerPadding,
          height: headerHeight,
        }}
      >
        <div className="flex justify-between items-center px-5 pb-3">
          {/* Partie gauche: uniquement bouton retour ou initiales */}
          <div className="flex items-center">
            {isProfilePage && comingFromProfileModal ? (
              <BackToProfileButton className="mr-3" />
            ) : shouldShowBackButton ? (
              <Link href={backTo} className="mr-3" onClick={handleBackClick}>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <span className="text-lg">←</span>
                </div>
              </Link>
            ) : (
              <button
                className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center shadow-sm text-sm font-medium"
                onClick={openModal}
              >
                {dynamicInitials} {/* 👈 AFFICHAGE DYNAMIQUE DES INITIALES */}
              </button>
            )}
          </div>

          {/* Centre: nom de l'application avec le nom de la page en dessous */}
          {showAppName && (
            <motion.div className="absolute left-1/2 transform -translate-x-1/2 text-center flex flex-col items-center">
              <motion.div
                style={{ fontSize: appNameSize }}
                className="font-bold"
              >
                Dinary
              </motion.div>

              {/* Nom de la page sous le nom de l'application */}
              <motion.div
                className="text-xs text-gray-500 mt-0.5"
                style={{
                  opacity: useTransform(scrollY, [0, 30], [1, 0]),
                  height: useTransform(scrollY, [0, 30], ["16px", "0px"]),
                  scale: useTransform(scrollY, [0, 30], [1, 0.8]),
                }}
              >
                {title}
              </motion.div>
            </motion.div>
          )}

          {/* Droite: bouton d'action ou notifications - remplacé par emoji cloche */}
          <div>
            {actionButton || (
              <button
                className="relative p-2"
                onClick={() => setShowNotifications(true)}
              >
                <span className="text-2xl">🔔</span>

                {/* Badge de nombre de notifications non lues */}
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Panel des notifications */}
      <NotificationsPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkAllAsRead={markAllAsRead}
        onNotificationClick={handleNotificationClick}
      />

      {/* Le composant ProfileModal utilise maintenant le contexte pour son état */}
      <ProfileModal
        userName={dynamicUserName} // 👈 PASSE LE NOM DYNAMIQUE
        userLevel="Silver"
        userPoints={1240}
      />
    </>
  );
}
