import "./Hero.css";

function Hero() {
  // The hero only needs one job: move first-time visitors straight to the canteen list.
  const scrollToCanteens = () => {
    const section = document.getElementById("canteens");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero">
      <div className="hero-shell">
        <div className="hero-copy">
          <h1>Order canteen food from your hostel room.</h1>
          <p>
            Choose a campus canteen, add your items, and place your order in a few simple steps.
          </p>
          <button className="hero-btn" onClick={scrollToCanteens}>
            Explore Canteens
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
