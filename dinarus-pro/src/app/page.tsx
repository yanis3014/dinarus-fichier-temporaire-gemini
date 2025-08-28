// dinary-temp/dinaruspro-frontend/src/app/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import MerchantDashboard from "./boutique/page";

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers la page de connexion si pas d'utilisateur
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Afficher un écran de chargement pendant la vérification de l'utilisateur
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-2">Vérification de la session...</p>
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Si l'utilisateur est un commerçant, afficher le tableau de bord
  // Sinon, on pourrait rediriger vers une page d'erreur ou d'onboarding
  if (user.role === "MERCHANT") {
    return <MerchantDashboard />;
  }

  // Cas par défaut si l'utilisateur est connecté mais n'est pas un commerçant
  return (
    <div className="flex items-center justify-center min-h-screen text-center p-4">
      <div>
        <h1 className="text-2xl font-bold mb-2">Accès refusé</h1>
        <p className="text-gray-600">
          Votre compte n'est pas un compte de commerçant. Veuillez utiliser
          l'application Dinary pour les clients.
        </p>
        <button onClick={logout} className="mt-4 text-purple-600 underline">
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
