import { Link } from "react-router-dom";
import "./About.css";

function About() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-hero-copy">
          <h1>Campus food ordering made simple.</h1>
          <p>
            StuBite helps students order from canteens without standing in line.
            The goal is simple: less waiting, faster ordering, easier delivery.
          </p>
        </div>
      </section>

      <section className="about-section">
        <div className="about-grid">
          <article className="about-card">
            <h2>What StuBite does</h2>
            <p>
              Students can browse canteens, add food to cart, save hostel addresses,
              and place orders from one clean interface.
            </p>
          </article>

          <article className="about-card">
            <h2>Why it matters</h2>
            <p>
              College canteens get crowded during peak hours. StuBite reduces the
              time spent waiting and makes ordering more convenient.
            </p>
          </article>

          <article className="about-card">
            <h2>Who it is for</h2>
            <p>
              StuBite is built for students who want a faster way to order food
              on campus and receive it at their hostel room.
            </p>
          </article>
        </div>
      </section>

      <section className="about-flow">
        <div className="about-section-heading">
          <h2>How it works</h2>
        </div>

        <div className="about-flow-grid">
          <div className="about-flow-step">
            <span>1</span>
            <h3>Choose a canteen</h3>
            <p>Open the canteen you want and view the menu.</p>
          </div>

          <div className="about-flow-step">
            <span>2</span>
            <h3>Add your order</h3>
            <p>Select food items and review them in your cart.</p>
          </div>

          <div className="about-flow-step">
            <span>3</span>
            <h3>Checkout</h3>
            <p>Confirm your hostel address and place the order.</p>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <h2>Ready to order?</h2>
        <p>Explore the available canteens and place your next campus order.</p>
        <Link to="/" className="about-cta-btn">
          Go to Home
        </Link>
      </section>
    </main>
  );
}

export default About;
