"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Types simplifiés
interface User {
  id: string;
  email: string;
  role: "ADMIN" | "MERCHANT" | "USER";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// URL de la page de connexion principale (dans l'app client dinarus)
const LOGIN_URL = "http://localhost:3001/login";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. On regarde si un token a été passé dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    let effectiveToken = localStorage.getItem("access_token");

    if (tokenFromUrl) {
      // Si oui, on le sauvegarde dans la "boîte à clés" de cette application
      localStorage.setItem("access_token", tokenFromUrl);
      effectiveToken = tokenFromUrl;
      // On nettoie l'URL pour ne pas laisser le token visible
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (!effectiveToken) {
      // Si, après tout ça, il n'y a toujours pas de token, on redirige
      window.location.href = LOGIN_URL;
      return;
    }

    const verifyUserAccess = async (tokenToVerify) => {
      try {
        const userRes = await fetch("http://localhost:3001/api/users/me", {
          headers: { Authorization: `Bearer ${tokenToVerify}` },
        });

        if (!userRes.ok) throw new Error("Token invalide");

        const userData: User = await userRes.json();

        // 2. On vérifie que c'est bien un admin
        if (userData.role !== "ADMIN") {
          alert("Accès refusé. Vous n'êtes pas un administrateur.");
          throw new Error("Accès non autorisé");
        }

        // Si tout est bon, on autorise l'accès
        setUser(userData);
        setToken(tokenToVerify);
      } catch (error) {
        console.error("Erreur de vérification:", error);
        localStorage.removeItem("access_token");
        window.location.href = LOGIN_URL;
      } finally {
        setIsLoading(false);
      }
    };

    verifyUserAccess(effectiveToken);
  }, []); // Ce code s'exécute une seule fois au chargement

  const logout = () => {
    localStorage.removeItem("access_token");
    window.location.href = LOGIN_URL;
  };

  if (isLoading) {
    return <div>Vérification de l'accès administrateur...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, token, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
