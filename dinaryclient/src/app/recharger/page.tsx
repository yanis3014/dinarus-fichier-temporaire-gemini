"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "@/components/layouts/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation"; // 👈 Import manquant ajouté ici

// Types pour les étapes du processus de recharge
type RechargeStep = "montant" | "paiement" | "confirmation";

// Interface pour les données du portefeuille
interface WalletData {
  balance: number;
  currency: string;
}

export default function RechargerPage() {
  const [currentStep, setCurrentStep] = useState<RechargeStep>("montant");
  const [montant, setMontant] = useState<string>("");
  const [reference, setReference] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [rechargeSuccess, setRechargeSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [wallet, setWallet] = useState<WalletData | null>(null);
  const { token, user } = useAuth(); // J'ajoute user car on l'utilise plus bas
  const router = useRouter();

  // Effet pour récupérer le solde de l'utilisateur
  useEffect(() => {
    const fetchWalletData = async () => {
      if (token) {
        try {
          const response = await fetch("http://localhost:3001/api/wallet/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data: WalletData = await response.json();
            setWallet(data);
          }
        } catch (error) {
          console.error("Erreur de connexion:", error);
        }
      }
    };
    fetchWalletData();
  }, [token]);

  const montantsPredefinits = ["500", "1000", "2000", "5000"];

  const handleNextStep = () => {
    if (currentStep === "montant" && parseFloat(montant) >= 100) {
      setCurrentStep("paiement");
      setError(null);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === "paiement") {
      setCurrentStep("montant");
    }
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!token) {
      setError("Session expirée. Veuillez vous reconnecter.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3001/api/wallet/recharge",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: parseFloat(montant),
            // La référence est envoyée ici, le backend devrait la stocker pour validation
            reference: reference,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "La demande de recharge a échoué.");
      }

      setRechargeSuccess(true);
      setCurrentStep("confirmation");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const formatMontant = (montant: string | number) => {
    if (!montant) return "0";
    const num = typeof montant === "string" ? parseFloat(montant) : montant;
    return num.toLocaleString("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="bg-white min-h-screen mb-16">
      <PageHeader title="Recharger" emoji="💰" hasBackButton={true} />

      <div className="px-4">
        <div className="my-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white p-4 rounded-2xl shadow-md">
          <p className="text-xs opacity-80">Solde actuel</p>
          <h1 className="text-2xl font-bold mt-1 mb-1">
            {wallet
              ? `${formatMontant(wallet.balance)} ${wallet.currency}`
              : "Chargement..."}
          </h1>
        </div>

        <div className="my-5 px-2">
          <div className="flex justify-between">
            <div
              className={`text-xs font-medium ${
                currentStep === "montant" ? "text-gray-800" : "text-gray-400"
              }`}
            >
              1. Montant
            </div>
            <div
              className={`text-xs font-medium ${
                currentStep === "paiement" ? "text-gray-800" : "text-gray-400"
              }`}
            >
              2. Paiement
            </div>
            <div
              className={`text-xs font-medium ${
                currentStep === "confirmation"
                  ? "text-gray-800"
                  : "text-gray-400"
              }`}
            >
              3. Confirmation
            </div>
          </div>

          <div className="h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gray-500 transition-all duration-300 ease-out"
              style={{
                width:
                  currentStep === "montant"
                    ? "33%"
                    : currentStep === "paiement"
                    ? "66%"
                    : "100%",
              }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentStep === "montant" && (
            <motion.div
              key="montant-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium mb-2">
                  Montant à recharger
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    className="w-full p-4 bg-gray-50 rounded-xl text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500 text-center"
                    value={montant}
                    onChange={(e) =>
                      setMontant(e.target.value.replace(/[^0-9]/g, ""))
                    }
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    DA
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {montantsPredefinits.map((preset) => (
                    <button
                      key={preset}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      onClick={() => setMontant(preset)}
                    >
                      {formatMontant(preset)} DA
                    </button>
                  ))}
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Min: 100 DA • Max: 10 000 DA
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl flex items-center">
                <div className="relative w-8 h-8 mr-3">
                  <Image
                    src="/icons/baridimob.svg"
                    alt="BaridiMob"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">BaridiMob</p>
                  <p className="text-xs text-gray-600">
                    Rechargez votre compte via l'application BaridiMob
                  </p>
                </div>
              </div>

              <button
                className={`w-full py-4 rounded-xl font-medium ${
                  parseFloat(montant) >= 100
                    ? "bg-gray-800 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
                disabled={parseFloat(montant) < 100}
                onClick={handleNextStep}
              >
                Continuer
              </button>
            </motion.div>
          )}

          {currentStep === "paiement" && (
            <motion.div
              key="paiement-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Montant:</span>
                  <span className="font-semibold">
                    {formatMontant(montant)} DA
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Méthode:</span>
                  <span className="font-medium">BaridiMob</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-medium mb-3">Comment procéder</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0">
                      1
                    </div>
                    <p className="text-sm">
                      Effectuez un virement de{" "}
                      <span className="font-medium">
                        {formatMontant(montant)} DA
                      </span>{" "}
                      sur notre RIB.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0">
                      2
                    </div>
                    <p className="text-sm">
                      Dans le détail de votre virement, utilisez votre nom
                      d'utilisateur Dinary ({user?.username}) comme motif.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0">
                      3
                    </div>
                    <p className="text-sm">
                      Entrez la référence de la transaction ci-dessous, puis
                      cliquez sur confirmer.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleConfirmPayment}>
                <label className="block text-sm font-medium mb-2">
                  Référence de transaction
                </label>
                <input
                  type="text"
                  placeholder="Ex: REF123456789"
                  className="w-full p-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 mb-4"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  required
                />

                {error && (
                  <p className="text-red-500 text-center text-sm mb-4">
                    {error}
                  </p>
                )}

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handlePreviousStep}
                    className="flex-1 py-3 bg-gray-100 rounded-xl font-medium"
                    disabled={loading}
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !reference}
                    className="flex-1 py-3 bg-gray-800 text-white rounded-xl font-medium"
                  >
                    {loading ? "Vérification..." : "Confirmer"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {currentStep === "confirmation" && rechargeSuccess && (
            <motion.div
              key="confirmation-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                <div className="text-3xl">⏱️</div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-1">
                  Recharge en cours de traitement
                </h2>
                <p className="text-gray-600">
                  Nous avons bien reçu votre demande
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Montant:</span>
                    <span className="font-medium">
                      {formatMontant(montant)} DA
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Méthode:</span>
                    <span className="font-medium">Virement bancaire</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Référence:</span>
                    <span className="font-mono text-sm">{reference}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {new Date().toLocaleDateString("fr-FR")}
                    </span>
                  </div>

                  <div className="pt-2 mt-2 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Statut:</span>
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">
                        En attente
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl flex items-start">
                <div className="text-xl mr-2 flex-shrink-0">ℹ️</div>
                <div className="text-left">
                  <p className="text-sm mb-1 font-medium">
                    Délai de traitement
                  </p>
                  <p className="text-xs text-gray-600">
                    Votre compte sera crédité après validation manuelle. Vous
                    recevrez une notification.
                  </p>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <Link
                  href="/historique"
                  className="flex-1 py-3.5 bg-gray-100 rounded-xl font-medium text-center"
                >
                  Historique
                </Link>
                <Link
                  href="/dashboard"
                  className="flex-1 py-3.5 bg-gray-800 text-white rounded-xl font-medium text-center"
                >
                  Accueil
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {(currentStep === "montant" || currentStep === "paiement") && (
          <div className="mt-8 pt-4 border-t border-gray-100 space-y-4">
            <h3 className="font-medium text-gray-700">Questions fréquentes</h3>

            <div className="bg-gray-50 p-3 rounded-xl">
              <p className="font-medium text-sm mb-1">
                Combien de temps prend une recharge? ⏱️
              </p>
              <p className="text-xs text-gray-600">
                Les recharges par virement sont traitées manuellement par notre
                équipe, généralement en quelques heures ouvrées.
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl">
              <p className="font-medium text-sm mb-1">Y a-t-il des frais? 💸</p>
              <p className="text-xs text-gray-600">
                Non, toutes les recharges sont gratuites sur Dinary.
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl">
              <p className="font-medium text-sm mb-1">
                Comment puis-je accélérer la validation? 🚀
              </p>
              <p className="text-xs text-gray-600">
                Assurez-vous d'avoir bien indiqué votre nom d'utilisateur dans
                le motif de votre virement.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
