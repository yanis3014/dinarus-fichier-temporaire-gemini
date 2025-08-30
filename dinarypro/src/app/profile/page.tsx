// src/app/page.tsx (Version finale qui combine les deux)

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProfileClient from "@/components/ProfileClient"; // <-- On utilise notre nouveau composant

export default function HomePage() {
  // On récupère toutes les données nécessaires, y compris `logout`
  const { user, merchantProfile, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers la page de connexion si la vérification est terminée et qu'il n'y a pas d'utilisateur
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Afficher l'écran de chargement (le style que tu voulais) pendant la vérification de l'utilisateur
  if (isLoading || !user || !merchantProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-2">Vérification de la session...</p>
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Si l'utilisateur est un commerçant, afficher le composant de profil
  if (user.role === "MERCHANT") {
    // On passe les données au composant ProfileClient qui gère l'affichage
    return <ProfileClient user={user} merchantProfile={merchantProfile} />;
  }

  // Cas par défaut : si l'utilisateur n'est pas un commerçant (le style que tu voulais)
  return (
    <div className="flex items-center justify-center min-h-screen text-center p-4">
      <div>
        <h1 className="text-2xl font-bold mb-2">Accès refusé</h1>
        <p className="text-gray-600">
          Votre compte n'est pas un compte de commerçant.
        </p>
        <button onClick={logout} className="mt-4 text-purple-600 underline">
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
