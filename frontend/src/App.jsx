import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Menu from "./pages/Menu";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import "./App.css";

function App() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const transitionDirection =
    navigationType === "POP" ? "backward" : "forward";

  // On normal route changes, we reset the page to the top.
  // If the URL includes a hash, we scroll straight to that section instead.
  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.replace("#", "");

      requestAnimationFrame(() => {
        const targetElement = document.getElementById(elementId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });

      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.hash, location.pathname, location.search]);

  return (
    <div className="app-shell">
      <Navbar />

      {/* Keying by pathname lets each route transition animate cleanly. */}
      <div
        key={location.pathname}
        className={`route-stage route-stage-${transitionDirection}`}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/menu/:canteenName" element={<Menu />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route path="/order-success" element={<OrderSuccess />} />
        </Routes>
      </div>

      <Footer />

      {/* One shared toast container keeps messaging consistent across the app. */}
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="dark"
        className="stubite-toast"
      />
    </div>
  );
}

export default App;
