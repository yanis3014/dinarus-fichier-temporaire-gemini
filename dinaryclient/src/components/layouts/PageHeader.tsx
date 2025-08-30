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
import { useAuth } from "@/context/AuthContext";

interface PageHeaderProps {
  title: string;
  emoji?: string;
  showBackButton?: boolean;
  hasBackButton?: boolean;
  backTo?: string;
  actionButton?: React.ReactNode;
  openProfileModalOnBack?: boolean;
  onBackClick?: () => void;
  showAppName?: boolean;
  withScrollBehavior?: boolean;
}

export default function PageHeader({
  title,
  emoji = "📱",
  showBackButton = false,
  hasBackButton = false,
  backTo = "/dashboard",
  actionButton,
  openProfileModalOnBack = false,
  onBackClick,
  showAppName = true,
  withScrollBehavior = true,
}: PageHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { openModal, comingFromProfileModal } = useProfileModal();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { user, gamificationProfile, isLoading } = useAuth();

  const { scrollY } = useScroll();
  const headerPadding = withScrollBehavior
    ? useTransform(scrollY, [0, 50], ["14px", "8px"])
    : "14px";
  const headerHeight = withScrollBehavior
    ? useTransform(scrollY, [0, 50], ["auto", "auto"])
    : "auto";
  const appNameSize = withScrollBehavior
    ? useTransform(scrollY, [0, 50], ["1.25rem", "1rem"])
    : "1.25rem";

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

  const isProfilePage = pathname.startsWith("/profile/");

  if (isLoading || !user || !gamificationProfile) {
    return (
      <header className="bg-white sticky top-0 z-30 p-4 animate-pulse">
        <div className="flex justify-between items-center px-5 pb-3">
          <div className="w-8 h-8 rounded-full bg-gray-200"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="w-8 h-8 rounded-full bg-gray-200"></div>
        </div>
      </header>
    );
  }

  const dynamicUserName = user.fullName || "Utilisateur";
  const dynamicInitials = dynamicUserName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase();

  const shouldShowBackButton = hasBackButton || showBackButton;

  const handleBackClick = (e: React.MouseEvent) => {
    if (openProfileModalOnBack) {
      e.preventDefault();
      openModal();
    } else if (onBackClick) {
      e.preventDefault();
      onBackClick();
    }
  };

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    if (notification.link) {
      setShowNotifications(false);
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
                // --- NOUVELLE SOLUTION DE STYLE ICI ---
                className="w-8 h-8 rounded-full bg-transparent border border-gray-300 text-gray-800 flex items-center justify-center text-sm font-semibold"
                onClick={openModal}
              >
                {dynamicInitials}
              </button>
            )}
          </div>

          {showAppName && (
            <motion.div className="absolute left-1/2 transform -translate-x-1/2 text-center flex flex-col items-center">
              <motion.div
                style={{ fontSize: appNameSize }}
                className="font-bold"
              >
                Dinary
              </motion.div>
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

          <div>
            {actionButton || (
              <button
                className="relative p-2"
                onClick={() => setShowNotifications(true)}
              >
                <span className="text-2xl">🔔</span>
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

      <NotificationsPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkAllAsRead={markAllAsRead}
        onNotificationClick={handleNotificationClick}
      />

      <ProfileModal />
    </>
  );
}
