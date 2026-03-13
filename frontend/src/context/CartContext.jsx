import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import { useAuth } from "./AuthContext";
import { apiRequest } from "../lib/api";
import { toast } from "react-toastify";

export const CartContext = createContext();
const GUEST_CART_STORAGE_KEY = "stubite-guest-cart";

const getStoredGuestCart = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(GUEST_CART_STORAGE_KEY);
    if (!storedValue) {
      return [];
    }

    const parsed = JSON.parse(storedValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    window.localStorage.removeItem(GUEST_CART_STORAGE_KEY);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [cartItems, setCartItemsState] = useState(getStoredGuestCart);
  const lastSyncedCartRef = useRef("[]");
  const activeRequestRef = useRef(false);

  const setCartItems = useCallback((updater) => {
    setCartItemsState((prev) => {
      const nextValue =
        typeof updater === "function" ? updater(prev) : updater;
      return nextValue;
    });
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          GUEST_CART_STORAGE_KEY,
          JSON.stringify(cartItems)
        );
      }
      return;
    }

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(GUEST_CART_STORAGE_KEY);
    }
  }, [cartItems, isAuthenticated, token]);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      lastSyncedCartRef.current = JSON.stringify(cartItems);
      return;
    }

    const syncCart = async () => {
      if (activeRequestRef.current) {
        return;
      }

      const serializedCart = JSON.stringify(cartItems);

      if (serializedCart === lastSyncedCartRef.current) {
        return;
      }

      activeRequestRef.current = true;

      try {
        const data = await apiRequest("/api/user/cart", {
          method: "PUT",
          token,
          body: JSON.stringify({ items: cartItems })
        });

        lastSyncedCartRef.current = JSON.stringify(data.cart || []);
        setCartItemsState(data.cart || []);
      } catch (error) {
        toast.error(error.message);
      } finally {
        activeRequestRef.current = false;
      }
    };

    syncCart();
  }, [cartItems, isAuthenticated, token]);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      const guestCart = getStoredGuestCart();
      setCartItemsState(guestCart);
      lastSyncedCartRef.current = JSON.stringify(guestCart);
      return;
    }

    const loadCart = async () => {
      activeRequestRef.current = true;

      try {
        const existingGuestCart = getStoredGuestCart();

        if (existingGuestCart.length > 0) {
          const syncData = await apiRequest("/api/user/cart", {
            method: "PUT",
            token,
            body: JSON.stringify({ items: existingGuestCart })
          });

          lastSyncedCartRef.current = JSON.stringify(syncData.cart || []);
          setCartItemsState(syncData.cart || []);
          window.localStorage.removeItem(GUEST_CART_STORAGE_KEY);
        } else {
          const data = await apiRequest("/api/user/cart", { token });
          lastSyncedCartRef.current = JSON.stringify(data.cart || []);
          setCartItemsState(data.cart || []);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        activeRequestRef.current = false;
      }
    };

    loadCart();
  }, [isAuthenticated, token]);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems }}>
      {children}
    </CartContext.Provider>
  );

};

export const useCart = () => useContext(CartContext);
