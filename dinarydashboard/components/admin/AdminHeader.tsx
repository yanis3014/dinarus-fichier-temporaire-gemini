'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, Search } from 'lucide-react';

export default function AdminHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  
  // Gestion des clics en dehors des menus pour les fermer
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  const toggleNotifications = () => setIsNotificationsOpen(!isNotificationsOpen);
  
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
      {/* Left section with search */}
      <div className="flex items-center w-96">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>            <input
            type="text"
            placeholder="Rechercher utilisateurs, commerçants..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:border-dinary-turquoise focus:outline-none text-sm"
          />
        </div>
      </div>
      
      {/* Right section with notifications and profile */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={toggleNotifications} 
            className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none transition-colors duration-200"
            aria-label="Notifications"
          >
            <Bell 
              size={20} 
              className={isNotificationsOpen ? "text-dinary-turquoise" : "text-gray-600"} 
            />
            <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 border-2 border-white text-xs flex items-center justify-center text-white animate-pulse">
              3
            </span>
          </button>
          
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 border z-10 transform origin-top-right transition-all duration-200 ease-out">
              <div className="px-4 py-2 border-b flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">Notifications</h3>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">3 nouvelles</span>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {[
                  {
                    title: 'Nouvelle demande de vérification commerçant',
                    time: '5 minutes',
                    type: 'info'
                  },
                  {
                    title: 'Retrait en attente de validation',
                    time: '15 minutes',
                    type: 'warning'
                  },
                  {
                    title: 'Objectif mensuel atteint : 500 utilisateurs !',
                    time: '1 heure',
                    type: 'success'
                  }
                ].map((notification, i) => (
                  <div 
                    key={i} 
                    className={`px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 border-l-4 ${
                      notification.type === 'warning' ? 'border-l-amber-500' : 
                      notification.type === 'success' ? 'border-l-green-500' : 
                      'border-l-dinary-turquoise'
                    }`}
                  >
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-gray-500">Il y a {notification.time}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t">
                <button className="text-xs text-dinary-turquoise hover:underline w-full text-center font-medium">
                  Voir toutes les notifications
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={toggleProfile}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="h-8 w-8 rounded-full bg-dinary-turquoise flex items-center justify-center text-white font-medium">
              A
            </div>
            <span className="text-sm font-medium">Admin</span>
            <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border z-10 transform origin-top-right transition-all duration-200 ease-out">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Votre Profil</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Paramètres</a>
              <div className="border-t my-1"></div>
              <a href="#" className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100">Déconnexion</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}