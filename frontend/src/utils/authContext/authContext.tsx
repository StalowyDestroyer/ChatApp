import { createContext, ReactNode, useState } from "react";
import { useQuery } from "react-query";
import { refreshToken } from "../../services/authService";
import { UserData } from "../../types/types";

interface AuthContextProps {
  isAuth: boolean | null;
  isAuthLoading: boolean;
  user: UserData | undefined;
  login: (data: UserData) => void;
  logout: () => void;
}

interface ProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthContextProvider: React.FC<ProviderProps> = ({ children }) => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [user, setUser] = useState<UserData | undefined>(undefined);
  const login = (data: UserData) => {
    setIsAuth(true);
    setUser(data);
  };
  const logout = () => setIsAuth(false);

  const { isLoading } = useQuery(
    "refreshToken",
    async () => await refreshToken(),
    {
      onSuccess: (res) => {
        setIsAuth(res.status === 200);
        setUser(res.data);
      },
      onError: () => {
        setIsAuth(false);
        console.log("Nie poszło");
      },
      enabled: isAuth === null || isAuth,
      refetchInterval: 1000 * 20,
    }
  );

  return (
    <AuthContext.Provider
      value={{ isAuth, login, logout, isAuthLoading: isLoading, user: user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
