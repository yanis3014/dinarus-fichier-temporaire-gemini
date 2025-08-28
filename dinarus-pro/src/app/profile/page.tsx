'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const ProfilePage = () => {
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [supportForm, setSupportForm] = useState({
    issue: '',
    urgency: 'normale',
    description: ''
  });
  const [step, setStep] = useState(1);
    const userData = {
    name: 'Mohammed Cherif',
    email: 'mohammed@dinarypro.dz',
    phone: '+213 555 123 456',
    storeName: 'Café Express',
    storeId: 'DIN-7842',
    memberSince: 'Mars 2025',
    plan: 'Business'
  };
  
  const handleLogout = () => {
    setShowConfirmLogout(true);
  };
  
  const confirmLogout = () => {
    // Logique de déconnexion ici
    alert('Déconnexion réussie !');
    setShowConfirmLogout(false);
  };
  
  const openSupportForm = (e) => {
    e.preventDefault();
    setShowSupportForm(true);
  };

  const handleSupportChange = (e) => {
    const { name, value } = e.target;
    setSupportForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Construction du message préformatté pour WhatsApp
      const message = encodeURIComponent(
        `Problème: ${supportForm.issue}\n` +
        `Urgence: ${supportForm.urgency}\n` +
        `Description: ${supportForm.description}\n` +
        `ID Boutique: ${userData.storeId}`
      );
      
      // Redirection vers WhatsApp avec le message préformatté
      window.open(`https://wa.me/+213555123456?text=${message}`, '_blank');
      setShowSupportForm(false);
      setStep(1);
      setSupportForm({
        issue: '',
        urgency: 'normale',
        description: ''
      });
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      setShowSupportForm(false);
    }
  };
  
  return (
    <main className="p-4 pb-32 bg-gradient-to-b from-white to-blue-50 min-h-screen">
      <header className="mb-6 relative">
        <Link href="/" className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md">
          <span className="text-gray-600">←</span>
        </Link>
        <div className="p-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md rounded-lg">
          <h1 className="text-lg font-bold text-center">👤 Mon Profil</h1>
          <p className="text-sm text-center">Gérez vos informations</p>
        </div>
      </header>
      
      {/* Carte profil */}
      <section className="mb-6 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            MC
          </div>
          <div>
            <h2 className="text-lg font-bold">{userData.name}</h2>
            <p className="text-sm text-purple-600">Niveau 12 • 320 points</p>
            <p className="text-xs text-gray-500">{userData.plan} • Depuis {userData.memberSince}</p>
          </div>
        </div>
        <div className="px-6 pb-4 flex gap-3">
          <button className="flex-1 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
            ✏️ Modifier
          </button>
          <button className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
            👁️ Aperçu public
          </button>
        </div>
      </section>
      
      {/* Informations */}
      <section className="mb-6 bg-white rounded-xl p-4 shadow-md">
        <h3 className="text-sm font-bold mb-3 text-gray-700">📋 Informations</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <div>
              <p className="text-xs text-gray-500">Nom du commerce</p>
              <p className="font-semibold">{userData.storeName}</p>
            </div>
            <button className="text-purple-600">✏️</button>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-semibold">{userData.email}</p>
            </div>
            <button className="text-purple-600">✏️</button>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <div>
              <p className="text-xs text-gray-500">Téléphone</p>
              <p className="font-semibold">{userData.phone}</p>
            </div>
            <button className="text-purple-600">✏️</button>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <div>
              <p className="text-xs text-gray-500">ID Boutique</p>
              <p className="font-semibold">{userData.storeId}</p>
            </div>
            <button className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">Copier</button>
          </div>
        </div>
      </section>
      
      {/* Menu des paramètres */}
      <section className="mb-6 bg-white rounded-xl p-4 shadow-md">
        <h3 className="text-sm font-bold mb-3 text-gray-700">⚙️ Paramètres</h3>
        <div className="space-y-3 text-sm">
          <Link href="#" className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-gray-600 text-lg">🔔</span>
              <p className="font-medium">Notifications</p>
            </div>
            <span className="text-gray-400">→</span>
          </Link>
          
          <Link href="#" className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-gray-600 text-lg">🔒</span>
              <p className="font-medium">Sécurité</p>
            </div>
            <span className="text-gray-400">→</span>
          </Link>
          
          <Link href="#" className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-gray-600 text-lg">📱</span>
              <p className="font-medium">Appareils connectés</p>
            </div>
            <span className="text-gray-400">→</span>
          </Link>
          
          <Link href="#" className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-gray-600 text-lg">💳</span>
              <p className="font-medium">Méthodes de paiement</p>
            </div>
            <span className="text-gray-400">→</span>
          </Link>
        </div>
      </section>
      
      {/* Support */}
      <section className="mb-6 bg-white rounded-xl p-4 shadow-md">
        <h3 className="text-sm font-bold mb-3 text-gray-700">🛟 Aide et Support</h3>
        <div className="space-y-3 text-sm">
          <Link href="#" className="flex justify-between items-center p-3 bg-blue-50 text-blue-700 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-blue-600 text-lg">📚</span>
              <p className="font-medium">Guide d'utilisation</p>
            </div>
            <span className="text-blue-400">→</span>
          </Link>
          
          <a href="#" onClick={openSupportForm} className="flex justify-between items-center p-3 bg-green-50 text-green-700 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-green-600 text-lg">💬</span>
              <p className="font-medium">Contacter le support</p>
            </div>
            <span className="text-green-400">→</span>
          </a>
          
          <Link href="#" className="flex justify-between items-center p-3 bg-orange-50 text-orange-700 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-orange-600 text-lg">🐞</span>
              <p className="font-medium">Signaler un problème</p>
            </div>
            <span className="text-orange-400">→</span>
          </Link>
        </div>
      </section>
      
      {/* Bouton Déconnexion */}
      <button
        onClick={handleLogout}
        className="w-full py-3 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition"
      >
        🚪 Se déconnecter
      </button>
      
      {/* Confirmation de déconnexion */}
      {showConfirmLogout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">Déconnexion</h3>
            <p className="text-gray-600 mb-6">Êtes-vous sûr de vouloir vous déconnecter de votre compte ?</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowConfirmLogout(false)}
                className="flex-1 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg"
              >
                Annuler
              </button>
              <button 
                onClick={confirmLogout}
                className="flex-1 py-2 bg-red-500 text-white font-medium rounded-lg"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questionnaire de support */}
      {showSupportForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Contacter le support</h3>
              <button 
                onClick={() => setShowSupportForm(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Étape {step}/3</span>
                <span>{step === 1 ? 'Type de problème' : step === 2 ? 'Urgence' : 'Description'}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{ width: `${(step/3)*100}%` }}></div>
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-4 mb-6">
                <p className="text-gray-600 text-sm">Quelle catégorie correspond à votre demande ?</p>
                <div className="space-y-2">
                  {['Problème technique', 'Question de facturation', 'Demande de fonctionnalité', 'Bug applicatif', 'Autre'].map((issue) => (
                    <label key={issue} className="flex items-center p-3 bg-gray-50 rounded-xl cursor-pointer">
                      <input 
                        type="radio" 
                        name="issue" 
                        value={issue} 
                        checked={supportForm.issue === issue}
                        onChange={handleSupportChange}
                        className="mr-3"
                      />
                      <span>{issue}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 mb-6">
                <p className="text-gray-600 text-sm">Quel est le niveau d'urgence de votre demande ?</p>
                <div className="space-y-2">
                  {[
                    { value: 'basse', label: 'Basse - Information générale', icon: '🟢' },
                    { value: 'normale', label: 'Normale - Requiert une assistance', icon: '🟡' },
                    { value: 'élevée', label: 'Élevée - Affecte mon activité', icon: '🟠' },
                    { value: 'critique', label: 'Critique - Je ne peux plus travailler', icon: '🔴' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center p-3 bg-gray-50 rounded-xl cursor-pointer">
                      <input 
                        type="radio" 
                        name="urgency" 
                        value={option.value} 
                        checked={supportForm.urgency === option.value}
                        onChange={handleSupportChange}
                        className="mr-3"
                      />
                      <span>{option.icon} {option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 mb-6">
                <p className="text-gray-600 text-sm">Décrivez votre problème en détail :</p>
                <textarea
                  name="description"
                  value={supportForm.description}
                  onChange={handleSupportChange}
                  placeholder="Décrivez votre problème ici..."
                  className="w-full p-3 border border-gray-300 rounded-xl h-32 text-sm"
                ></textarea>
                <p className="text-xs text-gray-500">
                  En soumettant ce formulaire, vous serez redirigé vers WhatsApp pour contacter directement notre équipe de support.
                </p>
              </div>
            )}
            
            <div className="flex gap-4 mt-2">
              <button 
                onClick={prevStep}
                className="flex-1 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg"
              >
                {step === 1 ? 'Annuler' : 'Retour'}
              </button>
              <button 
                onClick={nextStep}
                disabled={step === 1 && !supportForm.issue || step === 3 && !supportForm.description}
                className={`flex-1 py-2 ${step === 3 ? 'bg-green-500' : 'bg-blue-500'} text-white font-medium rounded-lg flex items-center justify-center gap-2 ${(step === 1 && !supportForm.issue || step === 3 && !supportForm.description) ? 'opacity-50' : ''}`}
              >
                {step === 3 ? (
                  <>
                    <span>Contacter via WhatsApp</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.6 6.31999C16.8 5.49999 15.8 4.89999 14.7 4.49999C13.6 4.09999 12.5 3.99999 11.3 4.09999C10.1 4.19999 9.00001 4.49999 7.90001 5.09999C6.80001 5.59999 5.90001 6.39999 5.10001 7.29999C4.30001 8.19999 3.80001 9.29999 3.40001 10.4C3.00001 11.5 2.90001 12.7 3.00001 13.9C3.10001 15.1 3.40001 16.2 4.00001 17.3C4.60001 18.4 5.40001 19.3 6.30001 20.1C7.20001 20.9 8.30001 21.4 9.40001 21.8C10.5 22.2 11.7 22.3 12.9 22.2C14.1 22.1 15.2 21.8 16.3 21.2C17.4 20.6 18.3 19.8 19.1 18.9C19.9 18 20.4 16.9 20.8 15.8C21.2 14.7 21.3 13.5 21.2 12.3C21.1 11.1 20.8 10 20.2 8.89999C20 8.49999 19.8 8.19999 19.5 7.89999C19.3 7.59999 19 7.39999 18.7 7.09999C18.4 6.79999 18.1 6.59999 17.8 6.39999C17.7 6.39999 17.7 6.29999 17.6 6.31999Z" stroke="white" strokeWidth="1.5"/>
                      <path d="M14.3 16.8C13.4 16.4 12.5 16 11.7 15.4C11 14.9 10.3 14.3 9.69999 13.7C9.09999 13.1 8.49999 12.4 7.99999 11.7C7.39999 10.9 6.99999 10.1 6.59999 9.19999L6.69999 9.09999C7.29999 8.39999 8.09999 7.89999 8.99999 7.69999C9.19999 7.59999 9.39999 7.69999 9.49999 7.89999C9.79999 8.49999 10.1 9.09999 10.5 9.59999C10.7 9.79999 10.7 10.1 10.5 10.4L9.79999 11.4C9.69999 11.6 9.69999 11.8 9.79999 12C10.3 12.9 11 13.7 11.9 14.3C12 14.4 12.3 14.4 12.5 14.3L13.5 13.6C13.8 13.4 14.1 13.4 14.3 13.6C14.8 14 15.4 14.3 16 14.6C16.2 14.7 16.3 14.9 16.2 15.1C16.1 16 15.6 16.8 14.9 17.4L14.8 17.5C14.5 17.4 14.1 17.3 13.8 17.1" stroke="white" strokeWidth="1.5"/>
                    </svg>
                  </>
                ) : 'Suivant'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProfilePage;