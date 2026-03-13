import "./OrderSuccessModal.css";

function OrderSuccessModal({ isOpen, closeModal }) {
  if (!isOpen) return null;

  return (
    <div className="success-overlay">
      {/* This modal is intentionally brief so checkout ends on a clear success state, not another task list. */}
      <div className="success-modal">
        <div className="success-badge">Order Confirmed</div>

        <button className="success-close" onClick={closeModal}>
          ✕
        </button>

        <h1>Order Placed Successfully</h1>

        <p>Your food is now in the canteen queue.</p>

        <p>Track it anytime from your order history in the dashboard.</p>

        <button
          className="success-btn"
          onClick={closeModal}
        >
          Continue Ordering
        </button>
      </div>
    </div>
  );
}

export default OrderSuccessModal;
