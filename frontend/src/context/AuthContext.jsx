import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = "stubite-auth";

const getStoredAuth = () => {
  if (typeof window === "undefined") {
    return { user: null, token: null };
  }

  try {
    const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!storedValue) {
      return { user: null, token: null };
    }

    const parsedValue = JSON.parse(storedValue);

    return {
      user: parsedValue.user || null,
      token: parsedValue.token || null
    };
  } catch (error) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return { user: null, token: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(getStoredAuth);
  const { user, token } = authState;

  const login = useCallback(({ user: nextUser, token: nextToken }) => {
    setAuthState({
      user: nextUser,
      token: nextToken
    });
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      user: null,
      token: null
    });
  }, []);

  const updateUser = useCallback((nextUser) => {
    setAuthState((prev) => ({
      ...prev,
      user: nextUser
    }));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (token) {
      window.localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ user, token })
      );
      return;
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }, [token, user]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleInvalidAuth = () => {
      setAuthState({
        user: null,
        token: null
      });
    };

    window.addEventListener("stubite:auth-invalid", handleInvalidAuth);

    return () => {
      window.removeEventListener("stubite:auth-invalid", handleInvalidAuth);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token),
        login,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
