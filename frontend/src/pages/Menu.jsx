import "./Menu.css";
import { useParams, Link } from "react-router-dom";
import { useEffect, useContext, useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import { apiRequest } from "../lib/api";
import { getFallbackMenu } from "../lib/catalogFallback";

function Menu() {

  const { canteenName } = useParams();
  const { cartItems, setCartItems } = useContext(CartContext);
  const [title, setTitle] = useState("Menu");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const fallbackToastShownRef = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadMenu = async () => {
      setLoading(true);
      try {
        const data = await apiRequest(`/api/canteens/${canteenName}/menu`);
        setTitle(data.canteen?.name || "Menu");
        setItems(data.items || []);
        fallbackToastShownRef.current = false;
      } catch (error) {
        const fallbackMenu = getFallbackMenu(canteenName);

        if (fallbackMenu) {
          setTitle(fallbackMenu.name);
          setItems(fallbackMenu.items || []);

          if (!fallbackToastShownRef.current) {
            toast.warning("Backend unavailable. Showing saved menu.");
            fallbackToastShownRef.current = true;
          }
        } else {
          setTitle("Menu");
          setItems([]);
          toast.error(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, [canteenName]);

  const addToCart = (item) => {
    const existingItem = cartItems.find(
      (cartItem) => cartItem.name === item.name
    );

    if (existingItem) {

      const updatedCart = cartItems.map((cartItem) =>
        cartItem.name === item.name
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );

      setCartItems(updatedCart);

    } else {

      setCartItems([
        ...cartItems,
        { ...item, quantity: 1 }
      ]);

    }

  };

  const removeFromCart = (itemName) => {

    const existingItem = cartItems.find(
      (cartItem) => cartItem.name === itemName
    );

    if (!existingItem) return;

    if (existingItem.quantity === 1) {

      const updatedCart = cartItems.filter(
        (cartItem) => cartItem.name !== itemName
      );

      setCartItems(updatedCart);

    } else {

      const updatedCart = cartItems.map((cartItem) =>
        cartItem.name === itemName
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );

      setCartItems(updatedCart);

    }

  };

  const getItemQuantity = (itemName) => {

    const item = cartItems.find(
      (cartItem) => cartItem.name === itemName
    );

    return item ? item.quantity : 0;

  };


  return (
    <div className="menu-page">

      <Link to="/" className="back-btn">
        <IoArrowBack className="back-icon" />
        Back to Canteens
      </Link>

      <h1>{title} Menu</h1>

      <div className="menu-grid">
        {loading && <p>Loading menu...</p>}

        {!loading && items.map((item, index) => (
          <div className="food-card" key={index}>

            <img src={item.image} alt={item.name} />

            <h3>{item.name}</h3>

            <p>₹{item.price}</p>

            <div className="cart-controls">

              {getItemQuantity(item.name) === 0 ? (

                <button
                  className="add-btn"
                  onClick={() => addToCart(item)}
                >
                  ADD
                </button>

              ) : (

                <div className="quantity-controls">

                  <button
                    className="qty-btn"
                    onClick={() => removeFromCart(item.name)}
                  >
                    −
                  </button>

                  <span className="qty-number">
                    {getItemQuantity(item.name)}
                  </span>

                  <button
                    className="qty-btn"
                    onClick={() => addToCart(item)}
                  >
                    +
                  </button>

                </div>

              )}

            </div>

          </div>
        ))}

        {!loading && items.length === 0 && (
          <p>No menu items available for this canteen yet.</p>
        )}

      </div>

    </div>
  );
}

export default Menu;
