import "./CartSummary.css";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function CartSummary({ title = "Your Cart" }) {

  const { cartItems, setCartItems } = useContext(CartContext);

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

  // Subtotal
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Delivery Fee
  const deliveryFee = cartItems.length > 0 ? 10 : 0;

  // Final Total
  const total = subtotal + deliveryFee;

  return (

    <div className="cart-summary">
      <h2>{title}</h2>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty</p>
      ) : (
        <>
          {cartItems.map((item, index) => (

            <div className="summary-item" key={index}>

              <div className="summary-left">
                <h4>{item.name}</h4>
                <p>₹{item.price}</p>
              </div>

              <div className="summary-qty">

                <button onClick={() => decreaseQty(item.name)}>−</button>

                <span>{item.quantity}</span>

                <button onClick={() => increaseQty(item.name)}>+</button>

              </div>

            </div>

          ))}

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>₹{deliveryFee}</span>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </>
      )}

    </div>
  );
}

export default CartSummary;
