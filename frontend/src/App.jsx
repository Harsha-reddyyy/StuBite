import { useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Menu from "./pages/Menu";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import "./App.css";

const routeOrder = {
  "/": 0,
  "/about": 1,
  "/menu": 2,
  "/dashboard": 3,
  "/checkout": 4,
  "/order-success": 5
};

const getRouteRank = (pathname) => {
  if (pathname.startsWith("/menu/")) {
    return routeOrder["/menu"];
  }

  return routeOrder[pathname] ?? 0;
};

function App() {
  const location = useLocation();
  const previousRankRef = useRef(getRouteRank(location.pathname));
  const currentRank = getRouteRank(location.pathname);
  const transitionDirection =
    currentRank >= previousRankRef.current ? "forward" : "backward";

  useEffect(() => {
    previousRankRef.current = currentRank;
  }, [currentRank]);

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
