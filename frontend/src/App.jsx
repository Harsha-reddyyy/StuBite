import Navbar from "./components/Navbar";
import Hero from "./components/hero";
import Canteens from "./components/Canteens";
import Menu from "./pages/Menu";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Footer from "./components/Footer";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Home Page */}
        <Route path="/"element={<><Hero /><Canteens /></>}/>
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
    </>
  );
}

export default App;