import Navbar from "./components/navbar";
import Hero from "./components/Hero";
import About from "./pages/About";
import Canteens from "./components/Canteens";
import Menu from "./pages/Menu";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Footer from "./components/Footer";

import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Home Page */}
        <Route path="/" element={<><Hero /><Canteens /></>} />

        <Route path="/about" element={<About />} />
        {/* Menu Page */}
        <Route path="/menu/:canteenName" element={<Menu />} />
        {/* Dashboard Page */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Checkout Page */}
        <Route path="/checkout" element={<Checkout />} />
        {/* Order Success */}
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>


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
    </>
  );
}

export default App;