import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* The footer repeats the product promise and gives users one obvious next action. */}
        <div className="footer-brand">
          <h2>StuBite</h2>
          <p>Fast campus food ordering with a cleaner student experience.</p>
          <Link to="/#canteens" className="footer-cta">
            Explore Canteens
          </Link>
        </div>

        <div className="footer-column">
          <h3>Navigation</h3>
          <div className="footer-links">
            {/* These links mirror the main navigation so the footer still feels useful. */}
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
        </div>

        <div className="footer-column">
          <h3>Why StuBite</h3>
          <ul className="footer-points">
            <li>No long canteen queues</li>
            <li>Hostel address based delivery</li>
            <li>Simple dashboard and order history</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 StuBite</span>
        <span>Built for campus delivery</span>
      </div>
    </footer>
  );
}

export default Footer;
