import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from 'react';

interface User {
  id: number;
  nombre: string;
  email: string;
  documento: string;
  foto_perfil: string;
  tipo_usuario: string;
  role: string | null;
  exp: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const MY_AUTH_APP = 'isAuthorized';
const USER_DATA_KEY = 'userData';

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export default function AuthContextProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => !!localStorage.getItem(MY_AUTH_APP)
  );
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(USER_DATA_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = useCallback((userData: User) => {
    localStorage.setItem(MY_AUTH_APP, 'true');
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(MY_AUTH_APP);
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      login,
      logout,
      isAuthenticated,
      user,
    }),
    [isAuthenticated, login, logout, user]
  );

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (user && user.exp < Date.now() / 1000) {
        logout();
      }
    };

    checkTokenExpiration();
    const intervalId = setInterval(checkTokenExpiration, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [logout, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
