import "./LoginModal.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../lib/api";

function LoginModal({ isOpen, onClose, initialView = "register", onAuthSuccess }) {
  const { login } = useAuth();
  const [view, setView] = useState(initialView);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetStep, setResetStep] = useState("request");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setResetCode("");
    setNewPassword("");
    setResetStep("request");
    setShowForgotPassword(false);
  };

  useEffect(() => {
    if (!isOpen) {
      setView(initialView);
      resetForm();
    }
  }, [initialView, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      resetForm();
    }
  }, [initialView, isOpen]);

  const switchView = (nextView) => {
    setView(nextView);
    resetForm();
  };

  const handleClose = () => {
    setView(initialView);
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    const trimmedResetCode = resetCode.trim();
    const trimmedNewPassword = newPassword.trim();

    if (view === "forgot") {
      if (!trimmedEmail) {
        toast.error("Please enter your email");
        return;
      }

      if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
        toast.error("Please enter a valid email address");
        return;
      }

      if (resetStep === "verify") {
        if (!trimmedResetCode || !trimmedNewPassword) {
          toast.error("Please enter the verification code and your new password");
          return;
        }

        if (trimmedNewPassword.length < 6) {
          toast.error("Password must be at least 6 characters long");
          return;
        }
      }
    } else if ((!trimmedName && view === "register") || !trimmedEmail || !trimmedPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (view === "register" && trimmedPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      if (view === "forgot") {
        if (resetStep === "request") {
          const data = await apiRequest("/api/auth/forgot-password", {
            method: "POST",
            body: JSON.stringify({ email: trimmedEmail })
          });

          toast.success(data.message);
          if (data.debugCode) {
            setResetCode(data.debugCode);
            toast.info(`Development reset code: ${data.debugCode}`);
          }
          setResetStep("verify");
        } else {
          const data = await apiRequest("/api/auth/reset-password", {
            method: "POST",
            body: JSON.stringify({
              email: trimmedEmail,
              code: trimmedResetCode,
              newPassword: trimmedNewPassword
            })
          });

          toast.success(data.message);
          setPassword("");
          switchView("login");
          setEmail(trimmedEmail);
        }
      } else {
        const endpoint = view === "register" ? "register" : "login";
        const data = await apiRequest(`/api/auth/${endpoint}`, {
          method: "POST",
          body: JSON.stringify(
            view === "register"
              ? { name: trimmedName, email: trimmedEmail, password: trimmedPassword }
              : { email: trimmedEmail, password: trimmedPassword }
          )
        });

        login({
          user: data.user,
          token: data.token
        });
        resetForm();
        onClose();
        onAuthSuccess?.();
      }
    } catch (error) {
      if (view === "login" && error.message === "Invalid email or password") {
        setShowForgotPassword(true);
      }

      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-overlay">

      <div className="login-modal">

        <button className="close-btn" onClick={handleClose}>✖</button>

        <h2>
          {view === "register" && "Register for StuBite 🍔"}
          {view === "login" && "Login to StuBite 🍔"}
          {view === "forgot" && "Reset Your Password"}
        </h2>

        {view === "forgot" && (
          <p className="reset-helper-text">
            {resetStep === "request"
              ? "Enter your email to receive a verification code."
              : "Enter the code from your email and choose a new password."}
          </p>
        )}

        {view === "register" && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Enter your college email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {view !== "forgot" && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}

        {view === "forgot" && resetStep === "verify" && (
          <>
            <input
              type="text"
              placeholder="Enter verification code"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
            />

            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </>
        )}

        <button
          className="login-submit"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Please wait..."
            : view === "register"
              ? "Register"
              : view === "login"
                ? "Login"
                : resetStep === "request"
                  ? "Send Verification Code"
                  : "Update Password"}
        </button>

        {view === "login" && showForgotPassword && (
          <button
            type="button"
            className="forgot-password-btn"
            onClick={() => switchView("forgot")}
          >
            Forgot password?
          </button>
        )}

        {view !== "forgot" && (
          <p className="auth-switch-text">
            {view === "register" ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              className="auth-switch-btn"
              onClick={() => switchView(view === "register" ? "login" : "register")}
            >
              {view === "register" ? "Login" : "Register"}
            </button>
          </p>
        )}

        {view === "forgot" && (
          <button
            type="button"
            className="auth-switch-btn auth-secondary-btn"
            onClick={() => switchView("login")}
          >
            Back to Login
          </button>
        )}

      </div>

    </div>
  );
}

export default LoginModal;
