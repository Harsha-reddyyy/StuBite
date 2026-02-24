import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo"> 🍔 StuBite</div>

      <ul className="nav-links">
        <li>Home</li>
        <li>Menu</li>
        <li>Orders</li>
      </ul>
      <button className="login-btn">Login</button>
    </nav>
  );
}

export default Navbar;