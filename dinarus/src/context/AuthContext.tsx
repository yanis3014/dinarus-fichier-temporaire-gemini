"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

// Assurez-vous que ces interfaces correspondent à vos vrais types
interface User {
  id: string;
  email: string;
  role: "ADMIN" | "MERCHANT" | "USER";
  fullName: string;
  username: string;
}
interface Wallet {
  balance: number;
}
interface GamificationProfile {
  level: number;
  xp: number;
}

interface AuthContextType {
  user: User | null;
  wallet: Wallet | null;
  gamificationProfile: GamificationProfile | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [gamificationProfile, setGamificationProfile] =
    useState<GamificationProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        // CORRECTION : On récupère toutes les données en même temps
        const [userRes, walletRes, gamificationRes] = await Promise.all([
          fetch("http://localhost:3001/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:3001/api/wallet/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:3001/api/gamification/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // On vérifie que TOUTES les réponses sont valides
        if (!userRes.ok || !walletRes.ok || !gamificationRes.ok) {
          throw new Error(
            "Erreur de récupération des données. Une des requêtes a échoué."
          );
        }

        // On stocke toutes les données
        setUser(await userRes.json());
        setWallet(await walletRes.json());
        setGamificationProfile(await gamificationRes.json());
      } catch (error) {
        console.error("Erreur de récupération des données :", error);
        localStorage.removeItem("access_token");
        setToken(null);
        setUser(null);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token, router]);

  const login = async (email, password) => {
    try {
      // 1. Appel au backend pour se connecter
      const loginResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!loginResponse.ok) {
        throw new Error("Email ou mot de passe incorrect.");
      }

      const { access_token } = await loginResponse.json();

      if (access_token) {
        // Stocker le token
        localStorage.setItem("access_token", access_token);

        // 2. Récupérer les informations de l'utilisateur, y compris son rôle
        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );

        if (!userResponse.ok) {
          throw new Error(
            "Impossible de récupérer les informations de l'utilisateur."
          );
        }

        const userData: User = await userResponse.json();

        // 3. Rediriger en fonction du rôle
        switch (userData.role) {
          case "ADMIN":
            // ON AJOUTE LE TOKEN DANS L'URL
            window.location.href = `http://localhost:3002/admin/dashboard?token=${access_token}`;
            break;
          case "MERCHANT":
            // ON AJOUTE LE TOKEN DANS L'URL
            window.location.href = `http://localhost:3003?token=${access_token}`; // Adaptez le port pour le vendeur si besoin
            break;
          case "USER":
            // L'utilisateur normal reste ici
            setToken(access_token);
            router.push("/dashboard"); // ou une autre page de l'application client
            break;
          default:
            throw new Error("Rôle utilisateur non reconnu.");
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    setUser(null);
    setWallet(null);
    setGamificationProfile(null);
    // Redirige toujours vers la page de connexion principale
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        wallet,
        gamificationProfile,
        token,
        login,
        logout,
        isLoading,
      }}
    >
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
