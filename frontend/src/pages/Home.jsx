import Hero from "../components/Hero";
import Canteens from "../components/Canteens";
import "./Home.css";

function Home() {
  return (
    <main className="home-page">
      <Hero />

      {/* This section gives first-time visitors the full product flow before they start browsing. */}
      <section className="home-section">
        <div className="section-heading">
          <h2>How StuBite Works</h2>
          <p>Simple ordering for students.</p>
        </div>

        <div className="how-grid">
          <article className="info-card">
            <h3>Choose a canteen</h3>
            <p>Open the campus canteen you want and view its menu.</p>
          </article>

          <article className="info-card">
            <h3>Add your food</h3>
            <p>Select items, update quantity, and review them in your cart.</p>
          </article>

          <article className="info-card">
            <h3>Place the order</h3>
            <p>Confirm your hostel address and checkout in a few seconds.</p>
          </article>
        </div>
      </section>

      {/* The canteen list is the main action area of the homepage. */}
      <Canteens />
    </main>
  );
}

export default Home;
