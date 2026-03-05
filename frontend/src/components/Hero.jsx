import "./Hero.css";

function Hero() {

  const scrollToCanteens = () => {
    const section = document.getElementById("canteens");
    section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero">
      <div className="hero-left">
        <h1>
          Skip the Queue,
          <br />
          Order from Your Hostel 🍔
        </h1>

        <p>
          StuBite lets college students order food easily from campus
          canteens.
        </p>

        <button className="hero-btn" onClick={scrollToCanteens}>
          Order Now
        </button>
      </div>
    </section>
  );
}

export default Hero;