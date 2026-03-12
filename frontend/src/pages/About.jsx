import "./About.css";

function About() {

  return (

    <div className="about-page">

      {/* HERO SECTION */}
      <section className="about-hero">

        <h1>About StuBite 🍔</h1>

        <p>
          StuBite is a smart campus food ordering platform designed
          for students. It allows you to browse canteen menus,
          order food instantly, and get it delivered directly to
          your hostel room without standing in long queues.
        </p>

      </section>


      {/* PROBLEM SECTION */}

      <section className="about-section">

        <h2>The Problem</h2>

        <p>
          Students often waste time waiting in long queues at
          college canteens. During peak hours it becomes difficult
          to order food quickly and efficiently.
        </p>

      </section>


      {/* SOLUTION SECTION */}

      <section className="about-section">

        <h2>Our Solution</h2>

        <p>
          StuBite simplifies campus food ordering. Students can
          explore menus from different canteens, place orders
          instantly, and receive food directly at their hostel rooms.
        </p>

      </section>


      {/* FEATURES */}

      <section className="features">

        <h2>Features</h2>

        <div className="feature-grid">

          <div className="feature-card">
            <h3>⚡ Fast Ordering</h3>
            <p>Order food in minutes from campus canteens.</p>
          </div>

          <div className="feature-card">
            <h3>🏠 Hostel Delivery</h3>
            <p>Get your food delivered directly to your hostels.</p>
          </div>

          <div className="feature-card">
            <h3>📱 Smart Dashboard</h3>
            <p>Manage addresses and track order history easily.</p>
          </div>

          <div className="feature-card">
            <h3>💳 Easy Payments</h3>
            <p>Pay using Cash on Delivery or UPI.</p>
          </div>

        </div>

      </section>


      {/* BUILDER */}

      <section className="about-builder">

        <h2>Built by a Student</h2>

        <p>
          StuBite was built by <strong>Harshavardhan Reddy</strong>,
          a BTech student at Marwadi University.
          This project was created to improve the food ordering
          experience for students using modern web technologies.
        </p>

      </section>

    </div>
  );
}

export default About;