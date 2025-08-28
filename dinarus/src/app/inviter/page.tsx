'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/layouts/PageHeader';
import { useReferral } from '@/components/common/ReferralContext';

export default function InviterPage() {
  const [activeTab, setActiveTab] = useState<'amis' | 'commercants'>('amis');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSteps, setShowSteps] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Utiliser le contexte de parrainage
  const { 
    stats, 
    referralLink, 
    inviteUser, 
    inviteMultipleUsers,
    copyReferralLink,
    shareReferralLink 
  } = useReferral();
  
  // Formater les nombres avec séparateurs pour meilleure lisibilité
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Gérer l'ajout d'un email à la liste
  const handleAddEmail = () => {
    if (email && !emails.includes(email) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmails([...emails, email]);
      setEmail('');
      setErrorMessage('');
      inputRef.current?.focus();
    } else if (email) {
      setErrorMessage('Veuillez entrer une adresse email valide et unique.');
    }
  };

  // Gérer la suppression d'un email de la liste
  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter(e => e !== emailToRemove));
  };

  // Gérer l'invitation des amis
  const handleInviteAmis = async () => {
    if (emails.length === 0) {
      setErrorMessage('Veuillez ajouter au moins une adresse email.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const successCount = await inviteMultipleUsers(emails, 'personal');
      
      if (successCount > 0) {
        setSuccessMessage(`${successCount} invitation${successCount > 1 ? 's' : ''} envoyée${successCount > 1 ? 's' : ''} avec succès!`);
        setEmails([]);
      } else {
        setErrorMessage('Échec de l\'envoi des invitations. Veuillez réessayer.');
      }
    } catch (error) {
      setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer l'invitation d'un commerçant
  const handleInviteCommercant = async () => {
    if (!name || !email || !phone) {
      setErrorMessage('Veuillez remplir tous les champs.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Veuillez entrer une adresse email valide.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      // Simulation d'envoi d'invitation commercant
      const success = await inviteUser(email, 'merchant');
      
      if (success) {
        setSuccessMessage('Invitation du commerçant envoyée avec succès!');
        setName('');
        setEmail('');
        setPhone('');
      } else {
        setErrorMessage('Échec de l\'envoi de l\'invitation. Veuillez réessayer.');
      }
    } catch (error) {
      setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer le partage du code de parrainage
  const handleShare = async () => {
    await shareReferralLink();
  };

  // Gérer la copie du code de parrainage
  const handleCopy = async () => {
    await copyReferralLink();
  };

  // Afficher le QR Code
  const handleShowQRCode = () => {
    setShowQRCode(true);
  };

  // Animation pour les onglets
  const tabVariants = {
    active: { 
      borderBottomColor: '#000',
      color: '#000',
      fontWeight: 500
    },
    inactive: { 
      borderBottomColor: 'transparent',
      color: '#6b7280',
      fontWeight: 400
    }
  };

  return (
    <div className="bg-white min-h-screen mb-16">
      <PageHeader 
        title="Inviter" 
        emoji="👥" 
        showBackButton={true}
      />

      <div className="px-5">
        {/* Section de récompense */}
        <div className="my-4 relative bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-5 rounded-xl overflow-hidden">
          {/* Effet visuel premium */}
          <div className="absolute right-0 top-0 w-40 h-40 rounded-full bg-gradient-to-br from-white/20 to-white/5 -mr-20 -mt-20 blur-xl"></div>
          <div className="absolute left-0 bottom-0 w-40 h-40 rounded-full bg-gradient-to-br from-yellow-700/30 to-yellow-800/30 -ml-20 -mb-20 blur-xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">🎁</span>
              <h2 className="text-xl font-bold">Programme de parrainage</h2>
            </div>
            <p className="mb-4 text-sm text-yellow-50">
              Parrainez vos amis et gagnez <strong>500 DA</strong> par ami et <strong>1000 DA</strong> par commerçant!
            </p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-80">Total gagné</p>
                <h3 className="text-2xl font-bold">{formatNumber(stats.totalEarned)} DA</h3>
                {stats.pendingRewards > 0 && (
                  <p className="text-xs text-yellow-100">+{formatNumber(stats.pendingRewards)} DA en attente</p>
                )}
              </div>
              <button 
                onClick={() => setShowSteps(!showSteps)}
                className="bg-white text-yellow-600 px-3 py-2 rounded-lg text-sm font-medium"
              >
                Comment ça marche
              </button>
            </div>
          </div>
        </div>

        {/* Comment ça marche */}
        {showSteps && (
          <motion.div 
            className="my-4 bg-yellow-50 p-4 rounded-xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-semibold mb-3 text-yellow-800">Comment ça marche</h3>
            <ol className="space-y-3">
              <li className="flex">
                <span className="bg-yellow-200 text-yellow-800 w-5 h-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0">1</span>
                <p className="text-sm text-yellow-800">Partagez votre code de parrainage avec vos amis ou invitez directement des commerçants</p>
              </li>
              <li className="flex">
                <span className="bg-yellow-200 text-yellow-800 w-5 h-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0">2</span>
                <p className="text-sm text-yellow-800">Lorsqu'ils s'inscrivent avec votre code, ils reçoivent un bonus de bienvenue</p>
              </li>
              <li className="flex">
                <span className="bg-yellow-200 text-yellow-800 w-5 h-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0">3</span>
                <p className="text-sm text-yellow-800">Après leur première transaction, vous recevez votre récompense: 500 DA par ami, 1000 DA par commerçant</p>
              </li>
            </ol>
            <button 
              className="w-full mt-3 py-2 text-sm text-yellow-800 border border-yellow-300 rounded-lg"
              onClick={() => setShowSteps(false)}
            >
              Fermer
            </button>
          </motion.div>
        )}

        {/* Code de parrainage */}
        <div className="my-4 bg-gray-50 p-4 rounded-xl">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Votre code de parrainage</h3>
            <span className="text-sm text-gray-500">{stats.totalInvited} invitations</span>
          </div>
          
          <div className="flex items-center bg-white border border-gray-200 rounded-lg p-3 mb-4">
            <span className="text-lg mr-3">🏷️</span>
            <div className="flex-grow">
              <p className="font-bold tracking-wider">{stats.referralCode}</p>
            </div>
            <button 
              onClick={handleCopy}
              className="text-sm text-blue-600 font-medium"
            >
              Copier
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button 
              onClick={handleShare}
              className="bg-black text-white py-3 rounded-lg flex items-center justify-center font-medium"
            >
              <span className="mr-2">📤</span>
              Partager
            </button>
            
            <button 
              onClick={handleShowQRCode}
              className="bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center font-medium"
            >
              <span className="mr-2">📱</span>
              QR Code
            </button>
          </div>
        </div>

        {/* QR Code Modal */}
        {showQRCode && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-5">
            <div className="bg-white rounded-xl max-w-sm w-full overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Votre QR Code</h3>
                  <button 
                    onClick={() => setShowQRCode(false)}
                    className="text-gray-500 p-1"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6 flex flex-col items-center">
                <div className="bg-white p-3 rounded-lg border border-gray-200 mb-4">
                  {/* Simuler un QR code avec un carré noir */}
                  <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 bg-[#f0f0f0] flex items-center justify-center">
                      <div className="w-[90%] h-[90%] bg-[#f9f9f9] flex items-center justify-center">
                        <div className="w-[80%] h-[80%] bg-white p-3">
                          <div className="w-full h-full relative">
                            {/* Coins */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-black" />
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-black" />
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-black" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-black" />
                            
                            {/* QR Code pattern (simulé) */}
                            <div className="absolute inset-0 p-6 grid grid-cols-7 grid-rows-7 gap-1">
                              {Array(49).fill(0).map((_, i) => (
                                <div 
                                  key={i} 
                                  className={`${Math.random() > 0.65 ? 'bg-black' : 'bg-white'}`}
                                ></div>
                              ))}
                            </div>

                            {/* Logo au centre */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center shadow-sm">
                                <span className="text-xl">💰</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-3">{referralLink}</p>
                </div>

                <p className="text-sm text-center text-gray-600 mb-4">
                  Scannez ce QR code pour rejoindre Dinary avec votre code de parrainage.
                </p>
                
                <div className="flex flex-col w-full space-y-3">
                  <button 
                    onClick={handleShare}
                    className="w-full bg-black text-white py-3 rounded-lg flex items-center justify-center font-medium"
                  >
                    <span className="mr-2">📤</span>
                    Partager le QR code
                  </button>
                  <button 
                    onClick={() => setShowQRCode(false)}
                    className="w-full border border-gray-300 py-3 rounded-lg flex items-center justify-center font-medium"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages de succès et d'erreur */}
        {successMessage && (
          <div className="my-4 bg-green-50 border border-green-100 text-green-800 p-3 rounded-lg">
            <div className="flex items-center">
              <span className="text-lg mr-2">✓</span>
              <p>{successMessage}</p>
            </div>
          </div>
        )}
        
        {errorMessage && (
          <div className="my-4 bg-red-50 border border-red-100 text-red-800 p-3 rounded-lg">
            <div className="flex items-center">
              <span className="text-lg mr-2">⚠️</span>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Onglets pour basculer entre l'invitation d'amis et de commerçants */}
        <div className="border-b border-gray-200 flex mt-6">
          <motion.button
            className={`flex-1 pb-3 text-center border-b-2`}
            variants={tabVariants}
            initial="inactive"
            animate={activeTab === 'amis' ? "active" : "inactive"}
            onClick={() => setActiveTab('amis')}
          >
            Inviter des amis
          </motion.button>
          <motion.button
            className={`flex-1 pb-3 text-center border-b-2`}
            variants={tabVariants}
            initial="inactive"
            animate={activeTab === 'commercants' ? "active" : "inactive"}
            onClick={() => setActiveTab('commercants')}
          >
            Inviter des commerçants
          </motion.button>
        </div>

        {/* Contenu des onglets */}
        <div className="mt-4 pb-16">
          {activeTab === 'amis' ? (
            <>
              {/* Formulaire pour inviter des amis */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse email
                </label>
                <div className="flex">
                  <input
                    type="email"
                    ref={inputRef}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@exemple.com"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddEmail();
                      }
                    }}
                  />
                  <button
                    onClick={handleAddEmail}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Liste des emails ajoutés */}
              {emails.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {emails.length} adresse{emails.length > 1 ? 's' : ''} ajoutée{emails.length > 1 ? 's' : ''}
                  </p>
                  <div className="space-y-2">
                    {emails.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                        <span className="text-sm">{item}</span>
                        <button
                          onClick={() => handleRemoveEmail(item)}
                          className="text-red-500 p-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleInviteAmis}
                disabled={isLoading || emails.length === 0}
                className={`w-full py-3 rounded-lg font-medium mt-3 ${
                  isLoading || emails.length === 0
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-blue-600 text-white'
                }`}
              >
                {isLoading ? 'Envoi en cours...' : 'Envoyer les invitations'}
              </button>
            </>
          ) : (
            <>
              {/* Formulaire pour inviter un commerçant */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du commerce
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Café Bio"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email du commerçant
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@exemple.com"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de téléphone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: 06 12 34 56 78"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="flex">
                    <span className="text-yellow-800 text-lg mr-2">💰</span>
                    <p className="text-sm text-yellow-800">
                      Recevez 1000 DA pour chaque commerçant qui rejoint et utilise Dinary grâce à vous!
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleInviteCommercant}
                  disabled={isLoading || !name || !email || !phone}
                  className={`w-full py-3 rounded-lg font-medium mt-3 ${
                    isLoading || !name || !email || !phone
                      ? 'bg-gray-300 text-gray-500'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {isLoading ? 'Envoi en cours...' : 'Envoyer l\'invitation'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}