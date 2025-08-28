// dinary-temp/dinarus/src/app/login/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isLoading, user } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // On appelle la fonction 'login' du contexte, qui s'occupe de TOUT.
    const success = await login(email, password);

    if (!success) {
      setError(
        "La connexion a échoué. Vérifiez vos identifiants ou la console."
      );
    }

    // On ne fait rien d'autre ici. La redirection est gérée par le contexte.
    setLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Vérification de la session...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-2">Connectez-vous à Dinary</h1>
        <p className="text-gray-500 mb-6">
          Connectez-vous à votre portefeuille
        </p>
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          Vous n'avez pas de compte ?{" "}
          <Link
            href="/register"
            className="text-purple-600 font-medium hover:underline"
          >
            Inscrivez-vous
          </Link>
        </p>
      </div>
    </div>
  );
}
