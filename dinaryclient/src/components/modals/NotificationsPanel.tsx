"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Notification } from "@/components/common/NotificationsContext";

// Type pour une notification individuelle - L'IMPORTANT EST ICI
// Ajoute le mot-clé 'export' ici

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllAsRead: () => void;
  onNotificationClick: (notification: Notification) => void;
}

export default function NotificationsPanel({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onNotificationClick,
}: NotificationsPanelProps) {
  const [showPanel, setShowPanel] = useState(false);
  const [showFullPanel, setShowFullPanel] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShowPanel(true), 50);
      if (showFullPanel) document.body.style.overflow = "hidden";
    } else {
      setShowPanel(false);
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, showFullPanel]);

  if (!isOpen) return null;

  // Fonction pour formater les dates
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `Aujourd'hui, ${hours}:${minutes}`;
    } else if (diffDays === 1) {
      return "Hier";
    } else {
      const day = date.getDate();
      const month = date.toLocaleString("fr-FR", { month: "long" });
      return `${day} ${month}`;
    }
  };

  // Fonction pour obtenir l'icône par type
  const getIconByType = (type: string, customIcon?: string) => {
    if (customIcon) return customIcon;

    switch (type) {
      case "transaction":
        return "💳";
      case "reward":
        return "🏆";
      case "promo":
        return "🎁";
      case "alert":
        return "⚠️";
      case "system":
        return "🔔";
      default:
        return "📩";
    }
  };

  // Fonction pour obtenir les styles de couleur par type
  const getStylesByType = (type: string) => {
    switch (type) {
      case "transaction":
        return {
          bgGradient: "from-blue-100/70 to-blue-50/50",
          iconGradient: "from-blue-500 to-blue-600",
          borderColor: "border-blue-200/50",
          textColor: "text-blue-800",
        };
      case "reward":
        return {
          bgGradient: "from-amber-100/70 to-amber-50/50",
          iconGradient: "from-amber-500 to-amber-600",
          borderColor: "border-amber-200/50",
          textColor: "text-amber-800",
        };
      case "promo":
        return {
          bgGradient: "from-green-100/70 to-green-50/50",
          iconGradient: "from-green-500 to-green-600",
          borderColor: "border-green-200/50",
          textColor: "text-green-800",
        };
      case "alert":
        return {
          bgGradient: "from-red-100/70 to-red-50/50",
          iconGradient: "from-red-500 to-red-600",
          borderColor: "border-red-200/50",
          textColor: "text-red-800",
        };
      case "system":
      default:
        return {
          bgGradient: "from-gray-100/70 to-gray-50/50",
          iconGradient: "from-gray-500 to-gray-700",
          borderColor: "border-gray-200/50",
          textColor: "text-gray-800",
        };
    }
  };

  const groupedNotifications: Record<string, Notification[]> = {};
  notifications.forEach((notification) => {
    const date = formatDate(notification.timestamp);
    if (!groupedNotifications[date]) groupedNotifications[date] = [];
    groupedNotifications[date].push(notification);
  });

  const hasUnreadNotifications = notifications.some((n) => !n.isRead);
  const limitedNotifications = Object.entries(groupedNotifications)
    .slice(0, 1)
    .flatMap(([date, items]) =>
      items.slice(0, 3).map((item) => ({ date, notification: item }))
    );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay semi-transparent uniquement en mode plein écran */}
          {showFullPanel && (
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFullPanel(false)}
            />
          )}

          {/* Panneau de notifications */}
          <motion.div
            className={`fixed z-50 ${
              showFullPanel
                ? "inset-x-0 top-0 bottom-0 sm:top-4 sm:bottom-4 sm:left-auto sm:right-4 sm:w-96 sm:max-w-full flex flex-col"
                : "top-4 right-4 w-96 max-w-[calc(100vw-2rem)]"
            }`}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className={`relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50 flex flex-col ${
                showFullPanel
                  ? "h-full sm:max-h-[80vh] max-h-[90vh]"
                  : "max-h-[32rem]"
              }`}
            >
              {/* En-tête */}
              <div className="py-3 px-4 flex justify-between items-center border-b border-gray-200/50 sticky top-0 z-10 backdrop-blur-sm bg-white/80">
                <div className="flex items-center">
                  <motion.button
                    onClick={onClose}
                    className="mr-3 relative"
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-7 h-7 rounded-full bg-black/5 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-sm">✕</span>
                    </div>
                  </motion.button>
                  <h2 className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Notifications
                  </h2>
                </div>

                <div className="flex items-center space-x-3">
                  {hasUnreadNotifications && (
                    <motion.button
                      className="text-xs font-medium bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent"
                      onClick={onMarkAllAsRead}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Tout marquer
                    </motion.button>
                  )}

                  <motion.button
                    onClick={() => setShowFullPanel(!showFullPanel)}
                    className="w-7 h-7 rounded-full bg-black/5 backdrop-blur-sm flex items-center justify-center"
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-sm">
                      {showFullPanel ? "🔼" : "🔽"}
                    </span>
                  </motion.button>
                </div>
              </div>

              {/* Contenu des notifications */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={showFullPanel ? "full" : "compact"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`${
                    showFullPanel
                      ? "flex-grow overflow-y-auto overscroll-contain"
                      : "overflow-y-auto max-h-[calc(32rem-3rem)]"
                  }`}
                >
                  {/* Mode compact */}
                  {!showFullPanel && (
                    <div className="py-2">
                      {limitedNotifications.length > 0 ? (
                        limitedNotifications.map(({ date, notification }) => {
                          const styles = getStylesByType(notification.type);
                          return (
                            <motion.div
                              key={notification.id}
                              className={`py-3 mx-2 border-b ${
                                styles.borderColor
                              } ${
                                !notification.isRead
                                  ? "bg-gradient-to-r " +
                                    styles.bgGradient +
                                    " backdrop-blur-sm"
                                  : "hover:bg-gray-50/50"
                              } 
                                rounded-xl my-1 px-3 relative overflow-hidden cursor-pointer`}
                              onClick={() => onNotificationClick(notification)}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="flex">
                                <div className="relative">
                                  <div
                                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${styles.iconGradient} flex items-center justify-center mr-3 flex-shrink-0 text-white shadow-sm`}
                                  >
                                    <span className="text-lg">
                                      {getIconByType(
                                        notification.type,
                                        notification.icon
                                      )}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex-grow">
                                  <div
                                    className={`font-medium text-sm ${
                                      !notification.isRead
                                        ? styles.textColor
                                        : ""
                                    }`}
                                  >
                                    {notification.title}
                                  </div>
                                  <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">
                                    {notification.message}
                                  </p>
                                </div>

                                {!notification.isRead && (
                                  <div className="ml-2 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0 mt-1.5 shadow-sm"></div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500 text-sm">
                            Aucune notification
                          </p>
                        </div>
                      )}

                      {notifications.length > 3 && (
                        <div className="text-center pt-1 pb-2">
                          <button
                            onClick={() => setShowFullPanel(true)}
                            className="text-xs text-blue-600 font-medium px-4 py-2 hover:bg-blue-50/50 rounded-full"
                          >
                            Voir toutes les notifications (
                            {notifications.length})
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mode plein écran */}
                  {showFullPanel &&
                    (Object.keys(groupedNotifications).length > 0 ? (
                      <div className="pb-4 h-full">
                        {Object.entries(groupedNotifications).map(
                          ([date, items]) => (
                            <div key={date} className="mb-3">
                              <div className="sticky top-0 bg-gradient-to-r from-gray-100/80 to-gray-50/80 backdrop-blur-md py-2 px-4 z-10">
                                <h3 className="font-medium text-xs text-gray-600">
                                  {date}
                                </h3>
                              </div>
                              <div className="px-2">
                                {items.map((notification) => {
                                  const styles = getStylesByType(
                                    notification.type
                                  );
                                  return (
                                    <motion.div
                                      key={notification.id}
                                      className={`py-3 border-b ${
                                        styles.borderColor
                                      } ${
                                        !notification.isRead
                                          ? "bg-gradient-to-r " +
                                            styles.bgGradient +
                                            " backdrop-blur-sm"
                                          : "hover:bg-gray-50/50"
                                      } 
                                      rounded-xl my-1 mx-2 px-3 relative overflow-hidden cursor-pointer`}
                                      onClick={() =>
                                        onNotificationClick(notification)
                                      }
                                      whileHover={{ scale: 1.01 }}
                                      whileTap={{ scale: 0.99 }}
                                    >
                                      {/* Effet de brillance en arrière-plan */}
                                      {!notification.isRead && (
                                        <div className="absolute inset-0 overflow-hidden">
                                          <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
                                        </div>
                                      )}

                                      <div className="flex">
                                        <div className="relative">
                                          <div
                                            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${styles.iconGradient} flex items-center justify-center mr-3 flex-shrink-0 text-white shadow-sm`}
                                          >
                                            <span className="text-lg">
                                              {getIconByType(
                                                notification.type,
                                                notification.icon
                                              )}
                                            </span>
                                          </div>
                                          {/* Effet de lueur */}
                                          <div
                                            className={`absolute inset-0 bg-gradient-to-br ${styles.iconGradient} rounded-xl blur-md -z-10 opacity-20`}
                                          ></div>
                                        </div>

                                        <div className="flex-grow pr-2">
                                          <div
                                            className={`font-medium text-sm ${
                                              !notification.isRead
                                                ? styles.textColor
                                                : ""
                                            }`}
                                          >
                                            {notification.title}
                                          </div>
                                          <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">
                                            {notification.message}
                                          </p>
                                          {notification.link && (
                                            <Link
                                              href={notification.link}
                                              className={`text-xs ${styles.textColor} mt-1.5 inline-block font-medium`}
                                              onClick={(e) =>
                                                e.stopPropagation()
                                              }
                                            >
                                              Voir les détails →
                                            </Link>
                                          )}
                                        </div>

                                        {!notification.isRead && (
                                          <div className="ml-1 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0 mt-1 shadow-sm">
                                            {/* Effet de lueur */}
                                            <div className="absolute w-2.5 h-2.5 rounded-full bg-blue-500 blur-md opacity-40"></div>
                                          </div>
                                        )}
                                      </div>
                                    </motion.div>
                                  );
                                })}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <motion.div
                        className="flex flex-col items-center justify-center h-full pb-16"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
                            <span className="text-2xl">🔔</span>
                          </div>
                          {/* Effet de lueur */}
                          <div className="absolute inset-0 rounded-full bg-gray-100 blur-xl -z-10 opacity-50"></div>
                        </div>

                        <p className="text-base font-medium mb-1 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                          Aucune notification
                        </p>
                        <p className="text-xs text-gray-500 text-center max-w-xs">
                          Nous vous avertirons ici lorsque vous recevrez de
                          nouvelles notifications.
                        </p>
                      </motion.div>
                    ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
