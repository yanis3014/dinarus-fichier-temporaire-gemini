'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/layouts/PageHeader';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Animation variants
const buttonTapAnimation = {
  tap: { scale: 0.95, transition: { duration: 0.1 } }
};

const contactItemAnimation = {
  tap: { scale: 0.98, transition: { duration: 0.1 } }
};

export default function AmisPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('amis');

  // Liste des contacts exemple
  const contacts = [
    {
      id: 1,
      name: 'Amina Benali',
      username: 'aminaB',
      avatar: '👩🏽',
      lastActive: 'En ligne',
      isOnline: true,
      isFavorite: true
    },
    {
      id: 2,
      name: 'Karim Hadj',
      username: 'karimH',
      avatar: '👨🏽',
      lastActive: 'Il y a 5h',
      isOnline: false,
      isFavorite: true
    },
    {
      id: 3,
      name: 'Sarah Mansouri',
      username: 'sarahM',
      avatar: '👩🏽‍🦱',
      lastActive: 'Hier',
      isOnline: false,
      isFavorite: false
    },
    {
      id: 4,
      name: 'Mohammed Kaci',
      username: 'mohaK',
      avatar: '👨🏽‍🦰',
      lastActive: 'Il y a 3j',
      isOnline: false,
      isFavorite: false
    },
    {
      id: 5,
      name: 'Yasmine Taleb',
      username: 'yasmineT',
      avatar: '👩🏽‍🦰',
      lastActive: 'En ligne',
      isOnline: true,
      isFavorite: false
    }
  ];

  // Fonction pour rediriger vers la page d'envoi avec les infos du contact sélectionné
  const handleSelectContact = (contact) => {
    // Enregistrer les informations du contact dans le localStorage pour les récupérer dans la page envoyer
    localStorage.setItem('selectedContact', JSON.stringify({
      id: String(contact.id),
      nom: contact.name,
      username: contact.username,
      photo: contact.avatar,
      numero: `075${contact.id}${contact.id}${contact.id}${contact.id}${contact.id}`, // Simulé pour l'exemple
    }));
    
    // Rediriger vers la page d'envoi
    router.push('/envoyer');
  };

  const filteredContacts = contacts.filter(contact => {
    if (!searchQuery) return true;
    return contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           contact.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Séparer les contacts en ligne et hors ligne
  const onlineContacts = filteredContacts.filter(contact => contact.isOnline);
  const offlineContacts = filteredContacts.filter(contact => !contact.isOnline);
  const favoriteContacts = filteredContacts.filter(contact => contact.isFavorite);

  const renderContactList = (contactsList) => {
    return contactsList.length > 0 ? (
      <div className="space-y-3">
        {contactsList.map(contact => (
          <motion.div
            key={contact.id}
            whileTap="tap"
            variants={contactItemAnimation}
            className="flex items-center p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => handleSelectContact(contact)}
          >
            <div className="relative mr-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-xl">
                {contact.avatar}
              </div>
              {contact.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{contact.name}</h3>
              <p className="text-sm text-gray-500">@{contact.username}</p>
            </div>
            <div className="flex space-x-2">
              <motion.button 
                whileTap="tap"
                variants={buttonTapAnimation}
                className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                onClick={(e) => {
                  e.stopPropagation(); // Empêche le déclenchement du onClick du parent
                  handleSelectContact(contact);
                }}
              >
                <span className="text-sm">💸</span>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    ) : (
      <div className="py-8 text-center">
        <p className="text-gray-500">Aucun contact trouvé</p>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen mb-16">
      <PageHeader 
        title="Mes Amis" 
        emoji="👥" 
        actionButton={
          <Link href="/inviter">
            <motion.button 
              whileTap="tap"
              variants={buttonTapAnimation}
              className="p-2 text-blue-600"
            >
              <span className="text-lg">➕</span>
            </motion.button>
          </Link>
        }
      />

      <div className="px-5 py-2">
        {/* Barre de recherche */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-gray-500">🔍</span>
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Rechercher un ami..."
          />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-4">
          <button 
            className={`pb-2 flex-1 text-center ${activeTab === 'amis' ? 'border-b-2 border-blue-600 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('amis')}
          >
            Tous
          </button>
          <button 
            className={`pb-2 flex-1 text-center ${activeTab === 'favoris' ? 'border-b-2 border-blue-600 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('favoris')}
          >
            Favoris
          </button>
          <button 
            className={`pb-2 flex-1 text-center ${activeTab === 'enligne' ? 'border-b-2 border-blue-600 font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('enligne')}
          >
            En ligne
          </button>
        </div>

        {/* Section Actions */}
        <div className="mb-6">
          <div className="flex space-x-2 mb-4">
            <Link href="/inviter" className="flex-1">
              <motion.button
                whileTap="tap"
                variants={buttonTapAnimation}
                className="w-full bg-blue-600 text-white py-2.5 rounded-xl flex items-center justify-center"
              >
                <span className="text-sm mr-2">➕</span>
                <span className="text-sm font-medium">Inviter des amis</span>
              </motion.button>
            </Link>
            <Link href="/scanner" className="flex-1">
              <motion.button
                whileTap="tap"
                variants={buttonTapAnimation}
                className="w-full bg-gray-800 text-white py-2.5 rounded-xl flex items-center justify-center"
              >
                <span className="text-sm mr-2">📱</span>
                <span className="text-sm font-medium">Scanner un code</span>
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Liste des contacts */}
        {activeTab === 'amis' && (
          <>
            {onlineContacts.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">En ligne</h3>
                {renderContactList(onlineContacts)}
              </div>
            )}
            {offlineContacts.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Récents</h3>
                {renderContactList(offlineContacts)}
              </div>
            )}
          </>
        )}

        {activeTab === 'favoris' && (
          <>
            {renderContactList(favoriteContacts)}
          </>
        )}

        {activeTab === 'enligne' && (
          <>
            {renderContactList(onlineContacts)}
          </>
        )}
      </div>
    </div>
  );
}