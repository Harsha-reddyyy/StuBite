import "./Login.css";

function Login() {
  return (
    <div className="login-container">
      {/* This standalone page is mostly a backup since the app now prefers the shared auth modal. */}
      <div className="login-card">
        <h2>Welcome to StuBite 🍔</h2>
        <p>Login using your college email</p>

        <input
          type="email"
          placeholder="Enter College Email"
          className="login-input"
        />

        <input
          type="password"
          placeholder="Password"
          className="login-input"
        />

        <button className="login-btn-main">
          Login
        </button>

        <p className="login-note">
          Only college students can access StuBite
        </p>
      </div>
    </div>
  );
}

export default Login;
