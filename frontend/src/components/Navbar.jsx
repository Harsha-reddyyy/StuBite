import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import {
  IoChevronDown,
  IoGridOutline,
  IoLogOutOutline,
  IoPersonCircleOutline,
  IoReceiptOutline,
  IoCartOutline
} from "react-icons/io5";

import logo from "../assets/stubite-logo.png";
import "./Navbar.css";
import LoginModal from "./LoginModal";
import CartSidebar from "./CartSidebar";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { cartItems } = useContext(CartContext);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [loginOpen, setLoginOpen] = useState(false);
  const [authView, setAuthView] = useState("register");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Closing the account menu on outside clicks keeps the dropdown feeling controlled.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Query params let protected pages open the auth modal with the right starting view.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const auth = params.get("auth");

    if (!user && (auth === "login" || auth === "register")) {
      setAuthView(auth);
      setLoginOpen(true);
    }
  }, [location.search, user]);

  const clearAuthQuery = () => {
    const params = new URLSearchParams(location.search);
    params.delete("auth");
    params.delete("redirect");

    navigate(
      {
        pathname: location.pathname,
        search: params.toString() ? `?${params.toString()}` : ""
      },
      { replace: true }
    );
  };

  const handleOpenAuth = (nextView = "register") => {
    setAuthView(nextView);
    setLoginOpen(true);
  };

  const handleCloseAuth = () => {
    setLoginOpen(false);

    const params = new URLSearchParams(location.search);
    if (params.has("auth") || params.has("redirect")) {
      clearAuthQuery();
    }
  };

  // After login we either continue the original protected action or send the user to the dashboard.
  const handleAuthSuccess = () => {
    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect");

    if (params.has("auth") || params.has("redirect")) {
      clearAuthQuery();
    }

    if (redirect && redirect.startsWith("/")) {
      navigate(redirect, { replace: true });
      return;
    }

    navigate("/dashboard", { replace: true });
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="brand-link">
          <img src={logo} alt="StuBite Logo" className="logo-img" />
          <span className="brand-title">StuBite</span>
        </Link>

        <div className="nav-center">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            About
          </NavLink>
          {user && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              Dashboard
            </NavLink>
          )}
        </div>

        <div className="nav-right">
          {/* Cart stays visible for both guests and signed-in users because browsing should feel lightweight. */}
          <button className="cart-button" onClick={() => setIsCartOpen(true)}>
            <IoCartOutline className="cart-icon-svg" />
            <span>Cart</span>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>

          {user ? (
            <div
              ref={profileRef}
              className="profile-section"
              onClick={() => setProfileOpen((prev) => !prev)}
            >
              <IoPersonCircleOutline className="profile-icon" />
              <span className="profile-name">{user.name}</span>
              <IoChevronDown className={`profile-caret ${profileOpen ? "open" : ""}`} />

              {profileOpen && (
                // The account menu keeps the most common signed-in actions within one click.
                <div className="profile-dropdown">
                  <Link to="/dashboard" onClick={() => setProfileOpen(false)}>
                    <IoGridOutline />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/dashboard?tab=orders"
                    onClick={() => setProfileOpen(false)}
                  >
                    <IoReceiptOutline />
                    <span>Orders</span>
                  </Link>
                  <button onClick={handleLogout}>
                    <IoLogOutOutline />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="guest-actions">
              <button
                className="ghost-auth-btn"
                onClick={() => handleOpenAuth("login")}
              >
                Login
              </button>
              <button
                className="login-btn"
                onClick={() => handleOpenAuth("register")}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </nav>

      <LoginModal
        isOpen={loginOpen}
        onClose={handleCloseAuth}
        initialView={authView}
        onAuthSuccess={handleAuthSuccess}
      />

      <CartSidebar
        isOpen={isCartOpen}
        closeCart={() => setIsCartOpen(false)}
        openLogin={() => handleOpenAuth("login")}
      />
    </>
  );
}

export default Navbar;
