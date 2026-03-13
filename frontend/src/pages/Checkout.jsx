import "./Checkout.css";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import CartSummary from "../components/CartSummary";
import OrderSuccessModal from "../components/OrderSuccessModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiRequest } from "../lib/api";

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useContext(CartContext);
  const { token, isAuthenticated } = useAuth();

  const [showSuccess, setShowSuccess] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      navigate("/");
      return;
    }

    const loadAddresses = async () => {
      try {
        const data = await apiRequest("/api/user/me", {
          token
        });

        setAddresses(data.addresses || []);
      } catch (error) {
        toast.error(error.message);
        navigate("/");
      }
    };

    loadAddresses();
  }, [isAuthenticated, token, navigate]);

  const defaultAddress = addresses.find((address) => address.isDefault);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee = cartItems.length > 0 ? 10 : 0;
  const total = subtotal + deliveryFee;

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty 🛒");
      return;
    }

    if (!defaultAddress) {
      toast.warning("Please add a delivery address 📍");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await apiRequest("/api/user/orders", {
        method: "POST",
        token,
        body: JSON.stringify({
          items: cartItems,
          subtotal,
          deliveryFee,
          total,
          paymentMethod,
          addressId: defaultAddress._id
        })
      });

      setCartItems([]);
      toast.success(data.message || "Order placed successfully 🎉");
      setShowSuccess(true);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-layout">
      <div className="checkout-left">
        <div className="checkout-hero">
          <span className="checkout-kicker">Final Step</span>
          <h1 className="checkout-title">Review delivery details before placing your order</h1>
          <p className="checkout-subtitle">
            Confirm the hostel address, check totals, and choose how you want to pay.
          </p>
        </div>

        <div className="checkout-card">
          <div className="checkout-card-header">
            <div>
              <h2>Delivery Address</h2>
              <p>StuBite uses your default saved address for this order.</p>
            </div>
          </div>

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
                onClick={() => navigate("/dashboard?tab=addresses")}
              >
                Add Address
              </button>
            </div>
          )}
        </div>

        <div className="checkout-card">
          <div className="checkout-card-header">
            <div>
              <h2>Order Breakdown</h2>
              <p>{cartItems.length} item{cartItems.length === 1 ? "" : "s"} in this order</p>
            </div>
          </div>

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

        <div className="checkout-card">
          <div className="checkout-card-header">
            <div>
              <h2>Payment Method</h2>
              <p>Select how the canteen should collect payment.</p>
            </div>
          </div>

          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "Cash on Delivery"}
              onChange={() => setPaymentMethod("Cash on Delivery")}
            />
            <span>
              <strong>Cash on Delivery</strong>
              <small>Pay when the order reaches your hostel.</small>
            </span>
          </label>

          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "UPI"}
              onChange={() => setPaymentMethod("UPI")}
            />
            <span>
              <strong>UPI</strong>
              <small>Complete payment digitally after confirming the order.</small>
            </span>
          </label>
        </div>

        <button
          className="place-order-btn"
          onClick={placeOrder}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Placing Order..." : "Place Order"}
        </button>
      </div>

      <div className="checkout-right">
        <CartSummary title="Cart Snapshot" />
      </div>

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
