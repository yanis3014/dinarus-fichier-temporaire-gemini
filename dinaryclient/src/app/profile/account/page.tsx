'use client';

import React from 'react';
import PageHeader from '@/components/layouts/PageHeader';

export default function AccountPage() {
  return (
    <div className="bg-white min-h-screen mb-16">
      <PageHeader 
        title="Compte" 
        emoji="👤" 
        hasBackButton={true}
        openProfileModalOnBack={true}
      />

      <div className="px-5 py-4">
        {/* Informations personnelles */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Informations personnelles</h2>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm text-gray-500">Nom complet</h3>
                <p className="font-medium">Mariam Benali</p>
              </div>
              <button className="text-sm text-blue-600">Modifier</button>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm text-gray-500">Email</h3>
                <p className="font-medium">mariam.benali@exemple.com</p>
              </div>
              <button className="text-sm text-blue-600">Modifier</button>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm text-gray-500">Téléphone</h3>
                <p className="font-medium">+213 XX XX XX XX</p>
              </div>
              <button className="text-sm text-blue-600">Modifier</button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm text-gray-500">Date de naissance</h3>
                <p className="font-medium">15 mai 1992</p>
              </div>
              <button className="text-sm text-blue-600">Modifier</button>
            </div>
          </div>
        </div>
        
        {/* Adresse */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Adresse</h2>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-full">
                <p className="font-medium">123 Rue des Oliviers</p>
                <p className="text-gray-600">Apt 4B</p>
                <p className="text-gray-600">16000 Alger, Algérie</p>
              </div>
              <button className="text-sm text-blue-600">Modifier</button>
            </div>
          </div>
        </div>
        
        {/* Préférences de communication */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Préférences de communication</h2>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <span className="text-lg mr-2">📱</span>
                <p className="font-medium">Notifications push</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked />
                <div className="w-11 h-6 bg-gray-300 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <span className="text-lg mr-2">✉️</span>
                <p className="font-medium">Emails</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked />
                <div className="w-11 h-6 bg-gray-300 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-lg mr-2">📢</span>
                <p className="font-medium">Offres et promotions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        {/* Options de compte */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Options de compte</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100">
              <div className="flex items-center">
                <span className="text-lg mr-2">🔒</span>
                <p className="font-medium">Changer le mot de passe</p>
              </div>
              <span className="text-gray-400">→</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100">
              <div className="flex items-center">
                <span className="text-lg mr-2">🔐</span>
                <p className="font-medium">Authentification à deux facteurs</p>
              </div>
              <span className="text-gray-400">→</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100">
              <div className="flex items-center">
                <span className="text-lg mr-2">📱</span>
                <p className="font-medium">Appareils connectés</p>
              </div>
              <span className="text-gray-400">→</span>
            </button>
            
            <button className="w-full flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100 hover:bg-red-100 text-red-600">
              <div className="flex items-center">
                <span className="text-lg mr-2">❌</span>
                <p className="font-medium">Désactiver mon compte</p>
              </div>
              <span className="text-red-400">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}