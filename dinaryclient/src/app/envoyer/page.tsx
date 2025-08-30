"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/layouts/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// Interfaces (conservées de votre code)
interface Contact {
  id: string;
  nom: string;
  photo?: string;
  username?: string;
  numero: string;
}
type EnvoiStep = "contact" | "montant" | "confirmation" | "succes" | "erreur"; // Ajout de "erreur"

export default function EnvoyerPage() {
  // Vos états d'origine sont tous conservés
  const [currentStep, setCurrentStep] = useState<EnvoiStep>("contact");
  const [montant, setMontant] = useState<string>("");
  const [modeEnvoi, setModeEnvoi] = useState<
    "instantane" | "differe" | "planifie"
  >("instantane");
  const [contactSelectionne, setContactSelectionne] = useState<Contact | null>(
    null
  );
  const [recherche, setRecherche] = useState<string>("");
  const [showAllContacts, setShowAllContacts] = useState<boolean>(false);
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [dateEnvoi, setDateEnvoi] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { wallet, token } = useAuth(); // Récupération des données du contexte
  const [searchResults, setSearchResults] = useState<Contact[]>([]); // Pour les résultats de l'API
  const [contacts, setContacts] = useState<Contact[]>([]); // Pour les contacts récents/fréquents
  const router = useRouter();

  // --- CORRECTION 1 : Logique de recherche dynamique qui appelle le backend ---
  useEffect(() => {
    if (recherche.trim().length < 2) {
      setSearchResults([]);
      return; // Ne fait rien si la recherche est trop courte
    }

    const chercher = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/wallet/search-user?q=${recherche}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.ok) {
          const data = await response.json();
          const mappedResults: Contact[] = data.map((apiUser: any) => ({
            id: apiUser.id,
            nom: apiUser.fullName,
            username: apiUser.username,
            numero: apiUser.phoneNumber || "N/A",
          }));
          setSearchResults(mappedResults);
        }
      } catch (e) {
        console.error("Erreur de recherche:", e);
      } finally {
        setIsLoading(false);
      }
    };

    // Attendre 300ms après la dernière frappe pour lancer la recherche
    const timerId = setTimeout(chercher, 300);
    return () => clearTimeout(timerId);
  }, [recherche, token]);

  // Le reste de votre logique est conservé
  const montantsPredefinits = ["100", "200", "500", "1000"];
  const contactsPrincipaux = contacts.slice(0, 7);

  const handleContactSelect = (contact: Contact) => {
    setContactSelectionne(contact);
    setCurrentStep("montant");
    setError(null);
  };

  const handleNextStep = () => {
    if (currentStep === "montant" && parseFloat(montant) > 0) {
      setCurrentStep("confirmation");
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === "montant") setCurrentStep("contact");
    else if (currentStep === "confirmation") setCurrentStep("montant");
  };

  const handleCloseScanner = () => setShowScanner(false);

  // --- CORRECTION 2 : Logique d'envoi utilisant receiverId ---
  const handleConfirmPayment = async () => {
    if (!token || !contactSelectionne || !montant || parseFloat(montant) <= 0) {
      setError("Informations invalides.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wallet/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: parseFloat(montant),
            receiverId: contactSelectionne.id, // On envoie l'ID
          }),
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Le transfert a échoué.");
      setCurrentStep("succes");
    } catch (err: any) {
      setError(err.message);
      setCurrentStep("erreur");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showAllContacts && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showAllContacts]);

  return (
    <div className="bg-white min-h-screen mb-16">
      <PageHeader title="Envoyer" emoji="🚀" hasBackButton={true} />
      <div className="px-4">
        <div className="my-3 bg-gradient-to-r from-blue-900 to-blue-700 text-white p-4 rounded-2xl shadow-md">
          <p className="text-xs opacity-80">Solde disponible</p>
          <h1 className="text-2xl font-bold mt-1 mb-1">
            {wallet
              ? `${wallet.balance.toLocaleString("fr-FR")} DZD`
              : "Chargement..."}
          </h1>
        </div>

        <AnimatePresence mode="wait">
          {currentStep === "contact" && (
            <motion.div
              key="contact-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="@utilisateur, nom ou numéro"
                  className="w-full py-3 px-4 pl-10 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  onChange={(e) => setRecherche(e.target.value)}
                  value={recherche}
                />
                <div className="absolute left-3 top-3.5 text-gray-400">🔍</div>
              </div>

              {/* --- CORRECTION 3 : Logique d'affichage --- */}
              <div className="mt-4">
                {recherche.length < 2 ? (
                  // Si pas de recherche, affiche les contacts récents et le scanner (votre design)
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-base font-semibold">
                        Contacts récents
                      </h3>
                      <button
                        className="text-blue-600 text-sm font-medium"
                        onClick={() => setShowAllContacts(true)}
                      >
                        Voir tous
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {contactsPrincipaux.map((contact) => (
                        <button
                          key={contact.id}
                          onClick={() => handleContactSelect(contact)}
                          className="flex flex-col items-center"
                        >
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 flex items-center justify-center mb-1">
                            <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-700 text-xl">
                              {contact.nom.charAt(0)}
                            </div>
                          </div>
                          <p className="text-xs font-medium truncate w-full text-center">
                            {contact.nom}
                          </p>
                          {contact.username && (
                            <p className="text-xs text-gray-500 truncate w-full text-center">
                              @{contact.username}
                            </p>
                          )}
                        </button>
                      ))}
                      <button
                        onClick={() => setShowScanner(true)}
                        className="flex flex-col items-center"
                      >
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-center mb-1 text-white">
                          <span className="text-2xl">📷</span>
                        </div>
                        <p className="text-xs font-medium truncate w-full text-center">
                          Scanner
                        </p>
                      </button>
                    </div>
                  </div>
                ) : (
                  // Si une recherche est en cours, affiche les résultats de l'API
                  <div className="space-y-2">
                    {isLoading && (
                      <div className="flex justify-center py-4">
                        <Loader2 className="animate-spin text-blue-600" />
                      </div>
                    )}
                    {!isLoading && searchResults.length > 0
                      ? searchResults.map((contact) => (
                          <button
                            key={contact.id}
                            onClick={() => handleContactSelect(contact)}
                            className="flex items-center w-full p-3 hover:bg-gray-50 rounded-xl text-left"
                          >
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3 font-semibold text-blue-700">
                              {contact.nom.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{contact.nom}</p>
                              {contact.username && (
                                <p className="text-xs text-gray-500">
                                  @{contact.username}
                                </p>
                              )}
                            </div>
                          </button>
                        ))
                      : !isLoading && (
                          <p className="text-center text-gray-500 py-4">
                            Aucun utilisateur trouvé pour "{recherche}"
                          </p>
                        )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Le reste de vos étapes JSX (montant, confirmation, etc.) est conservé */}
          {currentStep === "montant" && contactSelectionne && (
            <motion.div
              key="montant-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {error && (
                <p className="text-red-500 text-center text-sm">{error}</p>
              )}
              <div className="flex items-center bg-blue-50 p-3 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 flex items-center justify-center mr-3">
                  <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-700 text-lg">
                    {contactSelectionne.nom.charAt(0)}
                  </div>
                </div>
                <div>
                  <p className="font-medium">{contactSelectionne.nom}</p>
                  {contactSelectionne.username && (
                    <p className="text-xs text-gray-500">
                      @{contactSelectionne.username}
                    </p>
                  )}
                </div>
                <button
                  className="ml-auto text-blue-600"
                  onClick={handlePreviousStep}
                >
                  Modifier
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Montant
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    className="w-full p-4 bg-gray-50 rounded-xl text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 text-center"
                    value={montant}
                    onChange={(e) =>
                      setMontant(e.target.value.replace(/[^0-9]/g, ""))
                    }
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    DA
                  </span>
                </div>
                <div className="flex justify-center flex-wrap gap-2 mt-3">
                  {montantsPredefinits.map((preset) => (
                    <button
                      key={preset}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      onClick={() => setMontant(preset)}
                    >
                      {preset} DA
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-2">
                <label className="block text-sm font-medium mb-2">
                  Mode d'envoi
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setModeEnvoi("instantane")}
                    className={`p-3 rounded-xl flex flex-col items-center ${
                      modeEnvoi === "instantane"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-50"
                    }`}
                  >
                    <span className="text-xl mb-1">⚡</span>
                    <span className="text-xs font-medium">Instantané</span>
                    <span className="text-[10px] mt-1">(5 DA)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModeEnvoi("differe")}
                    className={`p-3 rounded-xl flex flex-col items-center ${
                      modeEnvoi === "differe"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-50"
                    }`}
                  >
                    <span className="text-xl mb-1">🕒</span>
                    <span className="text-xs font-medium">Différé</span>
                    <span className="text-[10px] mt-1">(Gratuit)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModeEnvoi("planifie")}
                    className={`p-3 rounded-xl flex flex-col items-center ${
                      modeEnvoi === "planifie"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-50"
                    }`}
                  >
                    <span className="text-xl mb-1">📅</span>
                    <span className="text-xs font-medium">Planifié</span>
                    <span className="text-[10px] mt-1">(Gratuit)</span>
                  </button>
                </div>
              </div>
              {modeEnvoi === "planifie" && (
                <div className="pt-1">
                  <label className="block text-sm font-medium mb-2">
                    Date planifiée
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={dateEnvoi}
                    onChange={(e) => setDateEnvoi(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              )}
              <div className="pt-1">
                <label className="block text-sm font-medium mb-2">
                  Note (optionnelle)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Déjeuner de samedi"
                  className="w-full p-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              <button
                className={`w-full py-4 rounded-xl font-medium mt-4 ${
                  montant
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
                disabled={!montant || isLoading}
                onClick={handleNextStep}
              >
                Continuer
              </button>
            </motion.div>
          )}

          {currentStep === "confirmation" && contactSelectionne && (
            <motion.div
              key="confirmation-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div className="bg-blue-50 rounded-2xl p-5">
                <h3 className="text-center font-medium mb-4">Récapitulatif</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Destinataire:</span>
                    <span className="font-medium">
                      {contactSelectionne.nom}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Montant:</span>
                    <span className="font-medium">
                      {parseFloat(montant).toLocaleString("fr-FR")} DA
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mode:</span>
                    <span className="font-medium">
                      {modeEnvoi === "instantane"
                        ? "Instantané"
                        : modeEnvoi === "differe"
                        ? "Différé (24h)"
                        : "Planifié"}
                    </span>
                  </div>
                  {modeEnvoi === "planifie" && dateEnvoi && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {new Date(dateEnvoi).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frais:</span>
                    <span className="font-medium">
                      {modeEnvoi === "instantane" ? "5 DA" : "Gratuit"}
                    </span>
                  </div>
                  {note && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Note:</span>
                      <span className="font-medium">{note}</span>
                    </div>
                  )}
                  <div className="border-t border-blue-200 pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="font-medium">Total à payer:</span>
                      <span className="font-bold">
                        {(
                          parseFloat(montant) +
                          (modeEnvoi === "instantane" ? 5 : 0)
                        ).toLocaleString("fr-FR")}{" "}
                        DA
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  className="flex-1 py-3.5 bg-gray-100 rounded-xl font-medium"
                  onClick={handlePreviousStep}
                  disabled={isLoading}
                >
                  Modifier
                </button>
                <button
                  className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-medium"
                  onClick={handleConfirmPayment}
                  disabled={isLoading}
                >
                  {isLoading ? "Envoi en cours..." : "Confirmer"}
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === "succes" && contactSelectionne && (
            <motion.div
              key="succes-step"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">✅</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Transfert réussi !</h2>
              <p className="text-gray-600 mb-6">
                Vous avez envoyé{" "}
                <strong>
                  {parseFloat(montant).toLocaleString("fr-FR")} DA
                </strong>{" "}
                à <strong>{contactSelectionne.nom}</strong>.
              </p>
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-medium"
              >
                Retour à l'accueil
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showScanner && (
          <motion.div
            className="fixed inset-0 z-50 bg-black flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="p-4 flex items-center justify-between">
              <button
                onClick={handleCloseScanner}
                className="w-10 h-10 rounded-full bg-black bg-opacity-30 flex items-center justify-center text-white"
              >
                ←
              </button>
              <h3 className="text-white font-medium">Scanner un QR code</h3>
              <div className="w-10"></div>
            </div>
            <div className="flex-grow flex flex-col items-center justify-center p-6 relative">
              <div className="w-full max-w-xs aspect-square relative bg-black bg-opacity-20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2/3 h-2/3 border-2 border-white/70 rounded-lg relative">
                    <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-blue-400"></div>
                    <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-blue-400"></div>
                    <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-blue-400"></div>
                    <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-blue-400"></div>
                  </div>
                </div>
                <div className="absolute left-0 right-0 h-0.5 bg-blue-500 top-1/2 animate-[scan_2s_linear_infinite]"></div>
              </div>
              <p className="text-white text-sm mt-8">
                Placez le QR code dans le cadre pour l'ajouter
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
