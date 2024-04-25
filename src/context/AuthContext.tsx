import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  authUser: any; // Change `any` to the type of your auth user object
  setAuthUser: React.Dispatch<React.SetStateAction<any>>; // Change `any` to the type of your auth user object
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
};

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [authUser, setAuthUser] = useState<any>(null);
  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
