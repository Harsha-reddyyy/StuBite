import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = "stubite-auth";

// Restore persisted auth once on startup so refreshes do not log users out.
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

  // These helpers keep auth updates centralized instead of scattered
  // across individual components like the modal, navbar, and dashboard.
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

  // Persist auth state in localStorage so the session survives refreshes.
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

  // Any API response that marks the token invalid can broadcast this event,
  // and the provider clears the session in one place.
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
