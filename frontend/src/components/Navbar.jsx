import { Link } from "react-router-dom";
import logo from "../assets/stubite-logo.png";
import "./Navbar.css";
import LoginModal from "./LoginModal";
import { CartContext } from "../context/CartContext";
import CartSidebar from "./CartSidebar";

import { useState, useEffect, useContext, useRef } from "react";
import { IoPersonCircleOutline, IoCartOutline } from "react-icons/io5";

function Navbar() {

  const { cartItems } = useContext(CartContext);

  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {

    const savedUser = localStorage.getItem("stubiteUser");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

  }, []);
  useEffect(() => {

    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);

  const handleLogout = () => {
    localStorage.removeItem("stubiteUser");
    setUser(null);
    setProfileOpen(false);
  };

  return (
    <>
      <nav className="navbar">

        <div className="nav-left">
          <Link to="/">
            <img src={logo} alt="StuBite Logo" className="logo-img" />
          </Link>
        </div>

        <div className="nav-center">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </div>

        <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
          <IoCartOutline className="cart-svg" />
          <span className="cart-text">Cart</span>

          {cartCount > 0 && (
            <span className="cart-count">{cartCount}</span>
          )}
        </div>

        <div className="nav-right">

          {user ? (

            <div
              ref={profileRef}
              className="profile-section"
              onClick={() => setProfileOpen(!profileOpen)}
            >

              <IoPersonCircleOutline className="profile-icon" />
              <span>{user.name}</span>

              {profileOpen && (
                <div className="profile-dropdown">

                  <Link to="/dashboard">Dashboard</Link>

                  <Link to="/dashboard">Order History</Link>

                  <button onClick={handleLogout}>
                    Logout
                  </button>

                </div>
              )}

            </div>

          ) : (

            <button
              className="login-btn"
              onClick={() => setLoginOpen(true)}
            >
              Login
            </button>

          )}

        </div>

      </nav>

      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={setUser}
      />

      <CartSidebar
        isOpen={isCartOpen}
        closeCart={() => setIsCartOpen(false)}
        openLogin={() => setLoginOpen(true)}
      />
    </>
  );
}

export default Navbar;