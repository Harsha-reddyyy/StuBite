import "./Checkout.css";
import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import CartSummary from "../components/CartSummary";
import OrderSuccessModal from "../components/OrderSuccessModal";
import { useNavigate } from "react-router-dom";

function Checkout() {

  const { cartItems, setCartItems } = useContext(CartContext);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const addresses =
    JSON.parse(localStorage.getItem("stubiteAddresses")) || [];

  const defaultAddress = addresses.find((a) => a.isDefault);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee = 10;
  const total = subtotal + deliveryFee;


  const placeOrder = () => {

    if (!defaultAddress) {
      alert("Please add a delivery address before placing order");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    const existingOrders =
      JSON.parse(localStorage.getItem("stubiteOrders")) || [];

    const newOrder = {
      id: Date.now(),
      items: cartItems,
      total: total,
      date: new Date().toLocaleString()
    };

    const updatedOrders = [...existingOrders, newOrder];

    localStorage.setItem(
      "stubiteOrders",
      JSON.stringify(updatedOrders)
    );

    setCartItems([]);

    setShowSuccess(true);

  };

  return (

    <div className="checkout-layout">

      {/* LEFT SIDE */}
      <div className="checkout-left">

        <h1 className="checkout-title">Checkout</h1>


        {/* DELIVERY ADDRESS */}

        <div className="checkout-card">

          <h2>Delivery Address</h2>

          {defaultAddress ? (

            <div className="address-box">

              <h3>{defaultAddress.name}</h3>

              <p>{defaultAddress.phone}</p>

              <p>
                {defaultAddress.block} • Floor {defaultAddress.floor} • Room {defaultAddress.room}
              </p>

            </div>

          ) : (

            <div className="no-address">

              <p>No default address selected</p>

              <button
                className="add-address-btn"
                onClick={() => navigate("/dashboard")}
              >
                Add Address
              </button>

            </div>

          )}

        </div>


        {/* ORDER SUMMARY */}

        <div className="checkout-card">

          <h2>Order Summary</h2>

          {cartItems.map((item, index) => (

            <div className="order-row" key={index}>

              <span>
                {item.name} x{item.quantity}
              </span>

              <span>
                ₹{item.price * item.quantity}
              </span>

            </div>

          ))}

          <div className="order-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="order-row">
            <span>Delivery Fee</span>
            <span>₹{deliveryFee}</span>
          </div>

          <div className="order-total">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

        </div>


        {/* PAYMENT */}

        <div className="checkout-card">

          <h2>Payment Method</h2>

          <label className="payment-option">
            <input type="radio" name="payment" defaultChecked />
            Cash on Delivery
          </label>

          <label className="payment-option">
            <input type="radio" name="payment" />
            UPI
          </label>

        </div>


        <button
          className="place-order-btn"
          onClick={placeOrder}
        >
          Place Order
        </button>

      </div>


      {/* RIGHT SIDE CART */}

      <div className="checkout-right">
        <CartSummary />
      </div>


      {/* SUCCESS MODAL */}

      <OrderSuccessModal
        isOpen={showSuccess}
        closeModal={() => {
          setShowSuccess(false);
          navigate("/");
        }}
      />

    </div>

  );
}

export default Checkout;