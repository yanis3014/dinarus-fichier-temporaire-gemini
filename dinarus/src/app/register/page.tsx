// dinary-temp/dinarus/src/app/register/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(""); // NOUVEAU
  const [phoneNumber, setPhoneNumber] = useState(""); // NOUVEAU
  const [isMerchant, setIsMerchant] = useState(false);
  const [merchantName, setMerchantName] = useState("");
  const [merchantAddress, setMerchantAddress] = useState("");
  const [merchantCategory, setMerchantCategory] = useState("restaurant");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userData = { email, username, password, fullName, phoneNumber }; // MODIFIÉ
      let response;

      if (isMerchant) {
        // Inscription en tant que vendeur
        const merchantData = {
          ...userData,
          name: merchantName,
          address: merchantAddress,
          category: merchantCategory,
        };
        response = await fetch(
          "http://localhost:3001/api/auth/register-merchant",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(merchantData),
          }
        );
      } else {
        // Inscription en tant qu'utilisateur standard
        response = await fetch("http://localhost:3001/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Échec de l'inscription");
      }

      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-2">Inscrivez-vous à Dinary</h1>
        <p className="text-gray-500 mb-6">
          Créez votre compte en quelques secondes
        </p>
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nom complet"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Numéro de téléphone"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nom d'utilisateur"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />

          {/* Option pour l'inscription en tant que vendeur */}
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              checked={isMerchant}
              onChange={(e) => setIsMerchant(e.target.checked)}
              id="isMerchant"
              className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isMerchant"
              className="text-sm font-medium text-gray-700"
            >
              S'inscrire en tant que vendeur
            </label>
          </div>

          {isMerchant && (
            <div className="space-y-4 mt-4 transition-all duration-300">
              <input
                type="text"
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                placeholder="Nom de la boutique"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                value={merchantAddress}
                onChange={(e) => setMerchantAddress(e.target.value)}
                placeholder="Adresse de la boutique"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
              <select
                value={merchantCategory}
                onChange={(e) => setMerchantCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="restaurant">Restaurant</option>
                <option value="groceries">Épicerie</option>
                <option value="retail">Commerce de détail</option>
                <option value="fashion">Mode</option>
                <option value="health">Santé</option>
                <option value="tech">Technologie</option>
                <option value="loisirs">Loisirs</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Vous avez déjà un compte ?{" "}
          <Link
            href="/login"
            className="text-purple-600 font-medium hover:underline"
          >
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
}
