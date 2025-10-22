'use client'

import { useCurrentUtilisateur, } from "@/hooks/useUtilisateurs";
import { createContext, useContext } from "react";

interface UserContextProps {
  utilisateur: any;
  isAdmin: boolean;
  isLoading: boolean;
  logout: () => void;
 
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children}: { children: React.ReactNode }) => {
  const { utilisateur, isAdmin,logout , isLoading } = useCurrentUtilisateur();

  return (
    <UserContext.Provider value={{utilisateur, isAdmin, logout, isLoading}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser used with  UserProvider");
  return context;
}