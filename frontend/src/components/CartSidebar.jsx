import "./CartSidebar.css";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function CartSidebar({ isOpen, closeCart, openLogin }) {

  const { cartItems, setCartItems } = useContext(CartContext);
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

    const user = localStorage.getItem("stubiteUser");

    if (!user) {
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
          <h2>Your Cart</h2>
          <button className="cart-close" onClick={closeCart}>✕</button>
        </div>

        {cartItems.length === 0 ? (

          <div className="empty-cart">
            Your cart is empty
          </div>

        ) : (

          <div className="cart-items">

            {cartItems.map((item, index) => (

              <div className="cart-item" key={index}>

                <div className="cart-left">
                  <h4>{item.name}</h4>
                  <p>₹{item.price}</p>
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

          <button className="checkout-btn" onClick={handleCheckout}>
            Checkout
          </button>

        </div>

      </div>

    </div>

  );
}

export default CartSidebar;