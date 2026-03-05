import { Link } from "react-router-dom";
import "./OrderSuccess.css";

function OrderSuccess() {

  return (

    <div className="order-success">

      <div className="success-card">

        <h1>🎉 Order Placed Successfully</h1>

        <p>Your food is being prepared.</p>

        <p>You can track it in your order history.</p>

        <Link to="/" className="home-btn">
          Back to Home
        </Link>

      </div>

    </div>

  );
}

export default OrderSuccess;