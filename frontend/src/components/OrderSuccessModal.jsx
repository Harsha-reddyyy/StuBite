import "./OrderSuccessModal.css";

function OrderSuccessModal({ isOpen, closeModal }) {

  if (!isOpen) return null;

  return (

    <div className="success-overlay">

      <div className="success-modal">

        <button className="success-close" onClick={closeModal}>
          ✕
        </button>

        <h1>🎉 Order Placed Successfully</h1>

        <p>Your food is being prepared.</p>

        <p>Check it in your Orders History.</p>

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