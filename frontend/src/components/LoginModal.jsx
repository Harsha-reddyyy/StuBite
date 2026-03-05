import "./LoginModal.css";
import { useState } from "react";

function LoginModal({ isOpen, onClose, onLogin }) {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleLogin = () => {

    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    const user = {
      name,
      email
    };

    // save user locally
    localStorage.setItem("stubiteUser", JSON.stringify(user));

    onLogin(user);
    onClose();
  };

  return (
    <div className="login-overlay">

      <div className="login-modal">

        <button className="close-btn" onClick={onClose}>✖</button>

        <h2>Login to StuBite 🍔</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter your college email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button className="login-submit" onClick={handleLogin}>
          Login
        </button>

      </div>

    </div>
  );
}

export default LoginModal;