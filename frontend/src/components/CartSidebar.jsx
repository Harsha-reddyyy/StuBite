import "./CartSidebar.css";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function CartSidebar({ isOpen, closeCart, openLogin }) {

  const { cartItems, setCartItems } = useContext(CartContext);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const increaseQty = (itemName) => {

    const updated = cartItems.map((item) =>
      item.name === itemName
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    setCartItems(updated);
  };

  const decreaseQty = (itemName) => {

    const updated = cartItems
      .map((item) =>
        item.name === itemName
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCartItems(updated);
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.warning("Your cart is empty 🛒");
      return;
    }

    if (!isAuthenticated) {
      closeCart();
      openLogin();
      return;
    }

    closeCart();
    navigate("/checkout");
  };

  return (

    <div className="cart-overlay">

      <div className="cart-sidebar">

        <div className="cart-header">
          <div>
            <span className="cart-eyebrow">Live summary</span>
            <h2>Your Cart</h2>
          </div>
          <button className="cart-close" onClick={closeCart}>✕</button>
        </div>

        {cartItems.length === 0 ? (

          <div className="empty-cart">
            <h3>Your cart is empty</h3>
            <p>Add items from any canteen menu to start building your order.</p>
          </div>

        ) : (

          <div className="cart-items">

            {cartItems.map((item, index) => (

              <div className="cart-item" key={index}>

                <div className="cart-left">
                  <h4>{item.name}</h4>
                  <p>₹{item.price} each</p>
                </div>

                <div className="cart-qty">

                  <button onClick={() => decreaseQty(item.name)}>−</button>

                  <span>{item.quantity}</span>

                  <button onClick={() => increaseQty(item.name)}>+</button>

                </div>

              </div>

            ))}

          </div>

        )}

        <div className="cart-footer">

          <div className="cart-total">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          {!isAuthenticated && cartItems.length > 0 && (
            <p className="cart-footnote">
              Sign in at checkout to save this cart to your account.
            </p>
          )}

          <button
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            {isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"}
          </button>

        </div>

      </div>

    </div>

  );
}

export default CartSidebar;
