'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotifications } from './NotificationsContext';

// Types pour les données de parrainage
interface ReferralUser {
  id: string;
  name: string;
  date: number; // timestamp
  status: 'pending' | 'completed';
  type: 'personal' | 'merchant';
  reward?: number;
}

interface ReferralStats {
  totalEarned: number;
  pendingRewards: number;
  totalInvited: number;
  pendingInvites: number;
  referralCode: string;
}

interface ReferralContextType {
  referrals: ReferralUser[];
  stats: ReferralStats;
  referralLink: string;
  inviteUser: (email: string, type: 'personal' | 'merchant') => Promise<boolean>;
  inviteMultipleUsers: (emails: string[], type: 'personal' | 'merchant') => Promise<number>;
  getReferralCode: () => string;
  copyReferralLink: () => Promise<boolean>;
  shareReferralLink: () => Promise<boolean>;
}

// Contexte de parrainage
const ReferralContext = createContext<ReferralContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte de parrainage
export const useReferral = () => {
  const context = useContext(ReferralContext);
  if (context === undefined) {
    throw new Error('useReferral doit être utilisé à l\'intérieur d\'un ReferralProvider');
  }
  return context;
};

// Données de démo pour les parrainages
const demoReferrals: ReferralUser[] = [
  {
    id: '1',
    name: 'Ahmed Benmoussa',
    date: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 jours
    status: 'completed',
    type: 'personal',
    reward: 500
  },
  {
    id: '2',
    name: 'Bio&Co',
    date: Date.now() - 1000 * 60 * 60 * 24 * 10, // 10 jours
    status: 'completed',
    type: 'merchant',
    reward: 1000
  },
  {
    id: '3',
    name: 'Samira Hadj',
    date: Date.now() - 1000 * 60 * 60 * 2, // 2 heures
    status: 'pending',
    type: 'personal'
  }
];

// Statistiques de démo
const demoStats: ReferralStats = {
  totalEarned: 1500,
  pendingRewards: 500,
  totalInvited: 3,
  pendingInvites: 1,
  referralCode: 'MARIAM2025'
};

// Fournisseur de contexte pour le parrainage
export const ReferralProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [referrals, setReferrals] = useState<ReferralUser[]>([]);
  const [stats, setStats] = useState<ReferralStats>({
    totalEarned: 0,
    pendingRewards: 0,
    totalInvited: 0,
    pendingInvites: 0,
    referralCode: 'CODE'
  });
  const { addNotification } = useNotifications();
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const referralLink = `${baseUrl}/signup?ref=${stats.referralCode}`;

  // Chargement initial des données
  useEffect(() => {
    // Dans une app réelle, on chargerait ces données depuis une API
    setReferrals(demoReferrals);
    setStats(demoStats);
  }, []);

  // Inviter un utilisateur par email
  const inviteUser = async (email: string, type: 'personal' | 'merchant'): Promise<boolean> => {
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Ajouter à la liste des invitations
      const newReferral: ReferralUser = {
        id: Date.now().toString(),
        name: email.split('@')[0], // Nom d'utilisateur à partir de l'email
        date: Date.now(),
        status: 'pending',
        type
      };
      
      setReferrals(prev => [newReferral, ...prev]);
      setStats(prev => ({
        ...prev,
        totalInvited: prev.totalInvited + 1,
        pendingInvites: prev.pendingInvites + 1
      }));
      
      // Notifier l'utilisateur du succès
      addNotification({
        title: 'Invitation envoyée',
        message: `Votre invitation à ${email} a été envoyée avec succès.`,
        type: 'system'
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'invitation:', error);
      return false;
    }
  };

  // Inviter plusieurs utilisateurs à la fois
  const inviteMultipleUsers = async (emails: string[], type: 'personal' | 'merchant'): Promise<number> => {
    let successCount = 0;
    
    for (const email of emails) {
      const success = await inviteUser(email, type);
      if (success) successCount++;
    }
    
    return successCount;
  };

  // Obtenir le code de parrainage
  const getReferralCode = (): string => {
    return stats.referralCode;
  };

  // Copier le lien de parrainage dans le presse-papier
  const copyReferralLink = async (): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(referralLink);
      
      addNotification({
        title: 'Lien copié',
        message: 'Le lien de parrainage a été copié dans votre presse-papier.',
        type: 'system'
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la copie du lien:', error);
      return false;
    }
  };

  // Partager le lien de parrainage
  const shareReferralLink = async (): Promise<boolean> => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Rejoignez-moi sur Dinary!',
          text: 'Utilisez mon code de parrainage pour obtenir un bonus de bienvenue!',
          url: referralLink
        });
        return true;
      } else {
        return await copyReferralLink();
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      return false;
    }
  };

  const value = {
    referrals,
    stats,
    referralLink,
    inviteUser,
    inviteMultipleUsers,
    getReferralCode,
    copyReferralLink,
    shareReferralLink
  };

  return (
    <ReferralContext.Provider value={value}>
      {children}
    </ReferralContext.Provider>
  );
};