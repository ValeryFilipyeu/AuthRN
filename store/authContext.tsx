import React, { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { checkTimestamp } from "../helpers/checkTimestamp";

type AuthContextProps = {
  token: string;
  isAuthenticated: boolean;
  authenticate: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextProps>({
  token: "",
  isAuthenticated: false,
  authenticate: (token: string) => {},
  logout: () => {},
});

const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authToken, setAuthToken] = useState("");

  async function authenticate(token: string) {
    setAuthToken(token);
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("timestamp", Date.now().toString());

    await checkTimestamp(60, logout);
  }

  async function logout() {
    setAuthToken("");
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("timestamp");
  }

  const value = {
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
