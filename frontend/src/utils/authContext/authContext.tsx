import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useQuery } from "react-query";
import { refreshToken } from "../../services/authService";
import { UserData } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { queryClient } from "../../configs/queryClient";

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
  const navigate = useNavigate();
  const login = (data: UserData) => {
    setIsAuth(true);
    setUser(data);
  };

  const logout = useCallback(() => {
    setIsAuth(false);
    setUser(undefined);
    if (location.pathname != "/register") navigate("/login");
    queryClient.clear();
  }, [navigate]);

  const { isLoading } = useQuery(
    "refreshToken",
    async () => await refreshToken(),
    {
      onSuccess: (res) => {
        login(res.data);
        console.log("Odswiezono");
      },
      onError: () => {
        logout();
        console.log("Nie poszło");
      },
      enabled: isAuth === null || isAuth,
      refetchInterval: 1000 * 60 * 2,
    }
  );

  useEffect(() => {
    window.addEventListener("unauthorized", logout);
  }, [navigate, logout]);

  useEffect(() => {
    if (
      isAuth &&
      (location.pathname == "/login" || location.pathname == "/register")
    )
      navigate("/home");
  }, [isAuth, navigate]);

  return (
    <AuthContext.Provider
      value={{ isAuth, login, logout, isAuthLoading: isLoading, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
