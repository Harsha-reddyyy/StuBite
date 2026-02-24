import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">StuBite</div>

      <ul className="nav-links">
        <li>Home</li>
        <li>Menu</li>
        <li>Orders</li>
        <li>Login</li>
      </ul>
    </nav>
  );
}

export default Navbar;