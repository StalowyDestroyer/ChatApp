import { createContext, ReactNode, useState } from "react";
import { useQuery } from "react-query";
import { refreshToken } from "../../services/authService";

interface AuthContextProps {
  isAuth: boolean | null;
  isAuthLoading: boolean;
  login: () => void;
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

  const login = () => setIsAuth(true);
  const logout = () => setIsAuth(false);

  const { isLoading } = useQuery(
    "refreshToken",
    async () => await refreshToken(),
    {
      onSuccess: (res) => {
        setIsAuth(res.status === 200);
        console.log(res.data);
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
      value={{ isAuth, login, logout, isAuthLoading: isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
