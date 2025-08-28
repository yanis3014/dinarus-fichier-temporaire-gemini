"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Notification } from "../modals/NotificationsPanel";
import { useAuth } from "@/context/AuthContext";

// Définition des types pour le contexte
interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "isRead" | "timestamp">
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

// Mock de données initiales pour les notifications
const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Paiement reçu",
    message: "Vous avez reçu un paiement de 200,00 DA de la part de Ahmed B.",
    type: "transaction",
    isRead: false,
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    link: "/historique",
  },
  {
    id: "2",
    title: "Récompense débloquée",
    message:
      "Félicitations! Vous avez débloqué une récompense de 50 points pour votre fidélité.",
    type: "reward",
    isRead: false,
    timestamp: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
    link: "/rewards",
    icon: "🎉",
  },
  {
    id: "3",
    title: "Promotion spéciale",
    message:
      "Bio&Co offre 10% de cashback supplémentaire aujourd'hui. Profitez-en!",
    type: "promo",
    isRead: true,
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    link: "/carte",
  },
  {
    id: "4",
    title: "Opération système",
    message:
      "Maintenance planifiée ce soir à 23h00. Le service pourrait être perturbé pendant 15 minutes.",
    type: "system",
    isRead: true,
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
  },
];

// Création du contexte
const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

// Hook personnalisé pour utiliser le contexte de notifications
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications doit être utilisé à l'intérieur d'un NotificationsProvider"
    );
  }
  return context;
};

// Fournisseur du contexte
export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // État pour stocker les notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { token } = useAuth();

  // Charger les notifications au montage du composant
  useEffect(() => {
    // Ici, on charge les notifications à partir du local storage ou on utilise les données initiales
    const storedNotifications = localStorage.getItem("notifications");

    if (storedNotifications) {
      try {
        setNotifications(JSON.parse(storedNotifications));
      } catch (error) {
        console.error("Erreur lors du chargement des notifications:", error);
        setNotifications(initialNotifications);
      }
    } else {
      setNotifications(initialNotifications);
    }
  }, []);

  // Sauvegarder les notifications quand elles changent
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem("notifications", JSON.stringify(notifications));
    }
  }, [notifications]);

  // Nombre de notifications non lues
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Ajouter une nouvelle notification
  const addNotification = (
    notification: Omit<Notification, "id" | "isRead" | "timestamp">
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      isRead: false,
      timestamp: Date.now(),
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Optionnellement, afficher une notification système
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/icons/logo.png", // Remplacer par le chemin de l'icône de l'application
      });
    }
  };

  // Marquer une notification comme lue
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  // Supprimer une notification
  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  // Supprimer toutes les notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Valeur du contexte
  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};
