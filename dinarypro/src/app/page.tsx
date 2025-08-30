// src/app/page.tsx (Mis à jour)

"use client";

import { useAuth } from "@/context/AuthContext";
import ProfileClient from "@/components/ProfileClient"; // <-- On importe le composant

export default function HomePage() {
  const { user, wallet, merchantProfile, isLoading } = useAuth();

  if (isLoading || !user || !wallet || !merchantProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // On passe les données au composant qui s'occupe de l'affichage
  return <ProfileClient user={user} merchantProfile={merchantProfile} />;
}
