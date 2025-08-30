"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// --- Les interfaces ne changent pas ---
interface User {
  id: string;
  email: string;
  role: "ADMIN" | "MERCHANT" | "USER";
  fullName: string;
}
interface Wallet {
  balance: number;
}
interface MerchantProfile {
  id: string;
  name: string;
  category: string;
}
interface AuthContextType {
  user: User | null;
  wallet: Wallet | null;
  merchantProfile: MerchantProfile | null;
  token: string | null;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const LOGIN_APP_URL = "http://localhost:3000/login";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [merchantProfile, setMerchantProfile] =
    useState<MerchantProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("access_token", tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
      setToken(tokenFromUrl);
    } else {
      const storedToken = localStorage.getItem("access_token");
      if (storedToken) {
        setToken(storedToken);
      } else {
        window.location.href = LOGIN_APP_URL;
      }
    }
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!token) {
        // Si aucun token n'est trouvé après la vérification initiale, on arrête le chargement.
        // La redirection sera gérée par le premier useEffect.
        setIsLoading(false);
        return;
      }

      try {
        const [userRes, walletRes, merchantRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/wallet/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/merchants/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!userRes.ok || !walletRes.ok || !merchantRes.ok) {
          throw new Error("Token invalide ou une des requêtes a échoué.");
        }

        const userData: User | null = await userRes.json();

        if (!userData) {
          throw new Error(
            "Impossible de récupérer les données de l'utilisateur."
          );
        }

        if (userData.role !== "MERCHANT") {
          alert("Accès refusé. Ce compte n'est pas un compte commerçant.");
          throw new Error("Utilisateur non autorisé");
        }

        setUser(userData);
        setWallet(await walletRes.json());
        setMerchantProfile(await merchantRes.json());
      } catch (error) {
        console.error("Déconnexion suite à une erreur:", error);
        localStorage.removeItem("access_token");
        window.location.href = LOGIN_APP_URL;
      } finally {
        setIsLoading(false); // On arrête le chargement dans tous les cas
      }
    };

    fetchAllData();
  }, [token]);

  const logout = () => {
    localStorage.removeItem("access_token");
    window.location.href = LOGIN_APP_URL;
  };

  return (
    <AuthContext.Provider
      value={{ user, wallet, merchantProfile, token, isLoading, logout }}
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
