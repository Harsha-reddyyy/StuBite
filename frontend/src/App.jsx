import Navbar from "./components/navbar";
import Footer from "./components/footer";

function App() {
  return (
    <>
      <Navbar />
      <div className="main-content">
        <h1>Welcome to StuBite 🍔</h1>
      </div>
      <Footer />
    </>
  );
}

export default App;