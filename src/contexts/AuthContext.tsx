"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { useGetMe } from "@/lib/mockApi";

type AuthUser = { id: number; name: string; email: string; createdAt: string };
type AuthTab = "login" | "register";

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authModalOpen: boolean;
  authModalTab: AuthTab;
  openAuthModal: (tab?: AuthTab) => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<AuthTab>("login");

  const { data: user, isLoading } = useGetMe({
    query: { retry: false, refetchOnWindowFocus: false }
  });

  const openAuthModal = useCallback((tab: AuthTab = "login") => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => setAuthModalOpen(false), []);

  return (
    <AuthContext.Provider value={{
      user: user ?? null,
      isAuthenticated: !!user,
      isLoading,
      authModalOpen,
      authModalTab,
      openAuthModal,
      closeAuthModal,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
