'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {   LayoutDashboard, Users, Store, Wallet, DollarSign,
  Trophy, ShoppingBag, MessageSquare, Bell, Settings, 
  LogOut, ChevronRight, ChevronDown, Sparkles, Boxes,
  Shield, HelpCircle, BarChart2, Map, ShieldCheck, Eye,
  Activity, MapPin, Gamepad2, Target, Zap, AlertTriangle,
  TrendingUp, Archive, Sliders, UserPlus
} from 'lucide-react';
import { useState } from 'react';

interface SidebarIconProps {
  icon: React.ReactNode;
  text: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
  isCategory?: boolean;
  isExpanded?: boolean;
  children?: React.ReactNode;
}

const SidebarIcon = ({ 
  icon, 
  text, 
  href, 
  active, 
  onClick,
  isCategory,
  isExpanded,
  children 
}: SidebarIconProps) => {
  if (isCategory) {
    return (
      <div className="w-full">
        <button
          onClick={onClick}
          className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md
            ${active ? 'text-dinary-turquoise' : 'text-gray-600 hover:text-dinary-turquoise hover:bg-gray-50'}`}
        >
          <div className="flex items-center flex-1">
            {icon}
            <span className="ml-3 hidden group-hover:block">{text}</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        {isExpanded && children}
      </div>
    );
  }
  
  return (
    <Link href={href || '#'} className="w-full group">
      <div className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
        active ? 'text-white bg-dinary-turquoise' : 'text-gray-600 hover:text-dinary-turquoise hover:bg-gray-50'
      }`}>
        {icon}
        <span className="ml-3 hidden group-hover:block">{text}</span>
      </div>
    </Link>
  );
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  
  const isActive = (path: string) => {
    if (path === '/admin/dashboard' && pathname === '/admin/dashboard') {
      return true;
    }
    if (path !== '/admin/dashboard' && pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const isCategoryExpanded = (category: string) => expandedCategories.includes(category);
  
  return (
    <div className="fixed h-screen w-16 hover:w-64 bg-white border-r flex flex-col justify-between shadow-sm z-10 transition-all duration-300 group">
      {/* Logo Area */}
      <div className="flex items-center h-16 border-b px-4">
        <Link href="/admin/dashboard" className="flex items-center">
          <div className="h-10 w-10 bg-dinary-turquoise text-white flex items-center justify-center text-xl font-bold rounded-lg">
            D
          </div>
          <span className="ml-3 font-semibold text-xl text-gray-900 hidden group-hover:block">
            Dinary
          </span>
        </Link>
      </div>
      
      {/* Navigation Icons */}
      <div className="flex flex-col flex-1 py-4 space-y-1 overflow-y-auto">
        <SidebarIcon
          icon={<LayoutDashboard size={20} className="min-w-[20px]" />}
          text="Tableau de bord"
          href="/admin/dashboard"
          active={isActive('/admin/dashboard')}
        />

        {/* Utilisateurs & Commerçants */}
        <SidebarIcon
          icon={<Users size={20} className="min-w-[20px]" />}
          text="Gestion des comptes"
          isCategory
          active={isActive('/admin/users') || isActive('/admin/merchants')}
          isExpanded={isCategoryExpanded('accounts')}
          onClick={() => toggleCategory('accounts')}
        >
          <div className="ml-6 space-y-1">
            <SidebarIcon
              icon={<Users size={20} className="min-w-[20px]" />}
              text="Utilisateurs"
              href="/admin/users"
              active={isActive('/admin/users')}
            />
            <SidebarIcon
              icon={<Store size={20} className="min-w-[20px]" />}
              text="Gestion des commerçants"
              isCategory
              active={isActive('/admin/merchants')}
              isExpanded={isCategoryExpanded('merchants')}
              onClick={() => toggleCategory('merchants')}
            >
              <div className="pl-11 space-y-1">
                <Link href="/admin/merchants" className={`block py-2 px-3 text-sm rounded-md ${
                  pathname === '/admin/merchants' ? 'text-white bg-dinary-turquoise' : 'text-gray-600 hover:text-dinary-turquoise hover:bg-gray-50'
                }`}>
                  Liste des commerçants
                </Link>
                <Link href="/admin/merchants/map" className={`block py-2 px-3 text-sm rounded-md ${
                  pathname === '/admin/merchants/map' ? 'text-white bg-dinary-turquoise' : 'text-gray-600 hover:text-dinary-turquoise hover:bg-gray-50'
                }`}>
                  Carte des commerçants
                </Link>
                <Link href="/admin/merchants/requests" className={`block py-2 px-3 text-sm rounded-md ${
                  pathname === '/admin/merchants/requests' ? 'text-white bg-dinary-turquoise' : 'text-gray-600 hover:text-dinary-turquoise hover:bg-gray-50'
                }`}>
                  Demandes d'inscription
                </Link>
                <Link href="/admin/merchants/withdrawals" className={`block py-2 px-3 text-sm rounded-md ${
                  pathname === '/admin/merchants/withdrawals' ? 'text-white bg-dinary-turquoise' : 'text-gray-600 hover:text-dinary-turquoise hover:bg-gray-50'
                }`}>
                  Demandes de retrait
                </Link>
              </div>
            </SidebarIcon>
          </div>        </SidebarIcon>

        {/* Finances */}
        <SidebarIcon          icon={<DollarSign size={20} className="min-w-[20px]" />}
          text="Finances"
          isCategory
          active={isActive('/admin/revenues') || isActive('/admin/withdrawals') || isActive('/admin/commissions') || isActive('/admin/recharges')}
          isExpanded={isCategoryExpanded('finances')}
          onClick={() => toggleCategory('finances')}
        >
          <div className="ml-6 space-y-1">
            <SidebarIcon
              icon={<BarChart2 size={20} className="min-w-[20px]" />}
              text="Revenus"
              href="/admin/revenues"
              active={isActive('/admin/revenues')}
            />            <SidebarIcon
              icon={<Wallet size={20} className="min-w-[20px]" />}
              text="Retraits"
              href="/admin/withdrawals"
              active={isActive('/admin/withdrawals')}
            />
            <SidebarIcon
              icon={<Wallet size={20} className="min-w-[20px]" />}
              text="Recharges de comptes"
              href="/admin/recharges"
              active={isActive('/admin/recharges')}
            />
            <SidebarIcon
              icon={<DollarSign size={20} className="min-w-[20px]" />}
              text="Gestion des commissions"
              isCategory
              active={isActive('/admin/commissions')}
              isExpanded={isCategoryExpanded('commissions')}
              onClick={() => toggleCategory('commissions')}
            >
              <div className="pl-11 space-y-1">
                <Link href="/admin/commissions" className={`block py-2 px-3 text-sm rounded-md ${
                  pathname === '/admin/commissions' ? 'text-white bg-dinary-turquoise' : 'text-gray-600 hover:text-dinary-turquoise hover:bg-gray-50'
                }`}>
                  Commissions
                </Link>
                <Link href="/admin/commissions/rules" className={`block py-2 px-3 text-sm rounded-md ${
                  pathname === '/admin/commissions/rules' ? 'text-white bg-dinary-turquoise' : 'text-gray-600 hover:text-dinary-turquoise hover:bg-gray-50'
                }`}>
                  Règles de Commission
                </Link>
                <Link href="/admin/commissions/payouts" className={`block py-2 px-3 text-sm rounded-md ${
                  pathname === '/admin/commissions/payouts' ? 'text-white bg-dinary-turquoise' : 'text-gray-600 hover:text-dinary-turquoise hover:bg-gray-50'
                }`}>
                  Payouts
                </Link>
                <Link href="/admin/commissions/analytics" className={`block py-2 px-3 text-sm rounded-md ${
                  pathname === '/admin/commissions/analytics' ? 'text-white bg-dinary-turquoise' : 'text-gray-600 hover:text-dinary-turquoise hover:bg-gray-50'
                }`}>
                  Analytics
                </Link>
              </div>
            </SidebarIcon>
          </div>
        </SidebarIcon>        {/* Engagement */}
        <SidebarIcon
          icon={<Sparkles size={20} className="min-w-[20px]" />}
          text="Engagement"
          isCategory
          active={isActive('/admin/missions') || isActive('/admin/shop')}
          isExpanded={isCategoryExpanded('engagement')}
          onClick={() => toggleCategory('engagement')}
        >
          <div className="ml-6 space-y-1">
            <SidebarIcon
              icon={<Trophy size={20} className="min-w-[20px]" />}
              text="Missions"
              href="/admin/missions"
              active={isActive('/admin/missions')}
            />
            <SidebarIcon
              icon={<ShoppingBag size={20} className="min-w-[20px]" />}
              text="Boutique"
              href="/admin/shop"
              active={isActive('/admin/shop')}
            />
          </div>
        </SidebarIcon>        {/* Parrainages */}
        <SidebarIcon
          icon={<UserPlus size={20} className="min-w-[20px]" />}
          text="Parrainages"
          href="/admin/parrainages"
          active={isActive('/admin/parrainages')}
        />

        {/* Communication */}
        <SidebarIcon
          icon={<MessageSquare size={20} className="min-w-[20px]" />}
          text="Communication"
          isCategory
          active={isActive('/admin/messages') || isActive('/admin/notifications')}
          isExpanded={isCategoryExpanded('communication')}
          onClick={() => toggleCategory('communication')}
        >
          <div className="ml-6 space-y-1">
            <SidebarIcon
              icon={<MessageSquare size={20} className="min-w-[20px]" />}
              text="Messages"
              href="/admin/messages"
              active={isActive('/admin/messages')}
            />
            <SidebarIcon
              icon={<Bell size={20} className="min-w-[20px]" />}
              text="Notifications"
              href="/admin/notifications"
              active={isActive('/admin/notifications')}
            />
          </div>
        </SidebarIcon>

        {/* Supervision - New Advanced Section */}
        <SidebarIcon
          icon={<Eye size={20} className="min-w-[20px]" />}
          text="Supervision"
          isCategory
          active={isActive('/admin/supervision')}
          isExpanded={isCategoryExpanded('supervision')}
          onClick={() => toggleCategory('supervision')}
        >
          <div className="ml-6 space-y-1">
            <SidebarIcon
              icon={<AlertTriangle size={20} className="min-w-[20px]" />}
              text="Comportements suspects"
              href="/admin/supervision/suspicious"
              active={isActive('/admin/supervision/suspicious')}
            />
            <SidebarIcon
              icon={<Archive size={20} className="min-w-[20px]" />}
              text="Historique actions admin"
              href="/admin/supervision/history"
              active={isActive('/admin/supervision/history')}
            />
            <SidebarIcon
              icon={<Shield size={20} className="min-w-[20px]" />}
              text="Utilisateurs à risque"
              href="/admin/supervision/risky-users"
              active={isActive('/admin/supervision/risky-users')}
            />
            <SidebarIcon
              icon={<Store size={20} className="min-w-[20px]" />}
              text="Commerçants suspects"
              href="/admin/supervision/risky-merchants"
              active={isActive('/admin/supervision/risky-merchants')}
            />
          </div>
        </SidebarIcon>

        {/* Advanced Statistics - New Section */}
        <SidebarIcon
          icon={<TrendingUp size={20} className="min-w-[20px]" />}
          text="Statistiques avancées"
          isCategory
          active={isActive('/admin/advanced-stats')}
          isExpanded={isCategoryExpanded('advanced-stats')}
          onClick={() => toggleCategory('advanced-stats')}
        >
          <div className="ml-6 space-y-1">
            <SidebarIcon
              icon={<Activity size={20} className="min-w-[20px]" />}
              text="Taux de rétention"
              href="/admin/advanced-stats/retention"
              active={isActive('/admin/advanced-stats/retention')}
            />
            <SidebarIcon
              icon={<BarChart2 size={20} className="min-w-[20px]" />}
              text="Taux de conversion"
              href="/admin/advanced-stats/conversion"
              active={isActive('/admin/advanced-stats/conversion')}
            />
            <SidebarIcon
              icon={<DollarSign size={20} className="min-w-[20px]" />}
              text="Paiements de bonus"
              href="/admin/advanced-stats/bonus-payments"
              active={isActive('/admin/advanced-stats/bonus-payments')}
            />
            <SidebarIcon
              icon={<TrendingUp size={20} className="min-w-[20px]" />}
              text="Analyse de churn"
              href="/admin/advanced-stats/churn"
              active={isActive('/admin/advanced-stats/churn')}
            />
          </div>
        </SidebarIcon>

        {/* Activity Map - New Section */}
        <SidebarIcon
          icon={<MapPin size={20} className="min-w-[20px]" />}
          text="Carte d'activité"
          isCategory
          active={isActive('/admin/activity-map')}
          isExpanded={isCategoryExpanded('activity-map')}
          onClick={() => toggleCategory('activity-map')}
        >
          <div className="ml-6 space-y-1">
            <SidebarIcon
              icon={<Map size={20} className="min-w-[20px]" />}
              text="Carte interactive"
              href="/admin/activity-map/interactive"
              active={isActive('/admin/activity-map/interactive')}
            />
            <SidebarIcon
              icon={<Zap size={20} className="min-w-[20px]" />}
              text="Zones chaudes"
              href="/admin/activity-map/hot-zones"
              active={isActive('/admin/activity-map/hot-zones')}
            />
            <SidebarIcon
              icon={<Store size={20} className="min-w-[20px]" />}
              text="Nouveaux commerçants"
              href="/admin/activity-map/new-merchants"
              active={isActive('/admin/activity-map/new-merchants')}
            />
          </div>
        </SidebarIcon>

        {/* Gamification - New Section */}
        <SidebarIcon
          icon={<Gamepad2 size={20} className="min-w-[20px]" />}
          text="Gamification"
          isCategory
          active={isActive('/admin/gamification')}
          isExpanded={isCategoryExpanded('gamification')}
          onClick={() => toggleCategory('gamification')}
        >
          <div className="ml-6 space-y-1">
            <SidebarIcon
              icon={<Trophy size={20} className="min-w-[20px]" />}
              text="Missions & défis"
              href="/admin/gamification/missions"
              active={isActive('/admin/gamification/missions')}
            />
            <SidebarIcon
              icon={<Sparkles size={20} className="min-w-[20px]" />}
              text="Boosts & multiplicateurs"
              href="/admin/gamification/boosts"
              active={isActive('/admin/gamification/boosts')}
            />
            <SidebarIcon
              icon={<Activity size={20} className="min-w-[20px]" />}
              text="Système XP"
              href="/admin/gamification/xp"
              active={isActive('/admin/gamification/xp')}
            />
            <SidebarIcon
              icon={<BarChart2 size={20} className="min-w-[20px]" />}
              text="Classements"
              href="/admin/gamification/rankings"
              active={isActive('/admin/gamification/rankings')}
            />
          </div>
        </SidebarIcon>

        {/* Weekly Objectives - New Section */}
        <SidebarIcon
          icon={<Target size={20} className="min-w-[20px]" />}
          text="Objectifs hebdomadaires"
          isCategory
          active={isActive('/admin/weekly-objectives')}
          isExpanded={isCategoryExpanded('weekly-objectives')}
          onClick={() => toggleCategory('weekly-objectives')}
        >
          <div className="ml-6 space-y-1">
            <SidebarIcon
              icon={<Target size={20} className="min-w-[20px]" />}
              text="Progrès des objectifs"
              href="/admin/weekly-objectives/progress"
              active={isActive('/admin/weekly-objectives/progress')}
            />
            <SidebarIcon
              icon={<Bell size={20} className="min-w-[20px]" />}
              text="Alertes & notifications"
              href="/admin/weekly-objectives/alerts"
              active={isActive('/admin/weekly-objectives/alerts')}
            />
            <SidebarIcon
              icon={<Settings size={20} className="min-w-[20px]" />}
              text="Configuration objectifs"
              href="/admin/weekly-objectives/config"
              active={isActive('/admin/weekly-objectives/config')}
            />
          </div>
        </SidebarIcon>

        {/* Control Center - New Section */}
        <SidebarIcon
          icon={<Sliders size={20} className="min-w-[20px]" />}
          text="Centre de contrôle"
          isCategory
          active={isActive('/admin/control-center')}
          isExpanded={isCategoryExpanded('control-center')}
          onClick={() => toggleCategory('control-center')}
        >
          <div className="ml-6 space-y-1">
            <SidebarIcon
              icon={<Users size={20} className="min-w-[20px]" />}
              text="Création d'utilisateurs"
              href="/admin/control-center/user-creation"
              active={isActive('/admin/control-center/user-creation')}
            />
            <SidebarIcon
              icon={<Wallet size={20} className="min-w-[20px]" />}
              text="Déblocage paiements"
              href="/admin/control-center/payment-unlock"
              active={isActive('/admin/control-center/payment-unlock')}
            />
            <SidebarIcon
              icon={<Shield size={20} className="min-w-[20px]" />}
              text="Gel de comptes"
              href="/admin/control-center/account-freeze"
              active={isActive('/admin/control-center/account-freeze')}
            />
            <SidebarIcon
              icon={<Bell size={20} className="min-w-[20px]" />}
              text="Envoi notifications"
              href="/admin/control-center/notifications"
              active={isActive('/admin/control-center/notifications')}
            />
          </div>
        </SidebarIcon>

        {/* Support & Configuration */}
        <SidebarIcon
          icon={<ShieldCheck size={20} className="min-w-[20px]" />}
          text="Administration"
          isCategory
          active={isActive('/admin/settings') || isActive('/admin/security')}
          isExpanded={isCategoryExpanded('admin')}
          onClick={() => toggleCategory('admin')}
        >
          <div className="ml-6 space-y-1">
            <SidebarIcon
              icon={<Shield size={20} className="min-w-[20px]" />}
              text="Sécurité"
              href="/admin/security"
              active={isActive('/admin/security')}
            />
            <SidebarIcon
              icon={<Settings size={20} className="min-w-[20px]" />}
              text="Paramètres"
              href="/admin/settings"
              active={isActive('/admin/settings')}
            />
            <SidebarIcon
              icon={<HelpCircle size={20} className="min-w-[20px]" />}
              text="Support"
              href="/admin/support"
              active={isActive('/admin/support')}
            />
          </div>
        </SidebarIcon>
      </div>

      {/* User Area */}
      <div className="border-t p-4">
        <button
          onClick={() => console.log('logout')}
          className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut size={20} className="min-w-[20px]" />
          <span className="ml-3 hidden group-hover:block">
            Déconnexion
          </span>
        </button>
      </div>
    </div>
  );
}