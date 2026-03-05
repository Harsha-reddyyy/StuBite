import "./Canteens.css";
import { Link } from "react-router-dom";

function Canteens() {
  return (
    <section id="canteens" className="canteens">
      <h2>Explore Canteens</h2>

      <div className="canteen-grid">

        {/* Main Canteen */}
        <Link to="/menu/maincanteen" className="canteen-link">
          <div className="canteen-card">
            <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9" />
            <h3>Main Canteen</h3>
            <p>Meals • Snacks • Fast Food</p>
          </div>
        </Link>

        {/* Food Court */}
        <Link to="/menu/foodcourt" className="canteen-link">
          <div className="canteen-card">
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836" />
            <h3>Food Court</h3>
            <p>Biryani • Chinese • Combos</p>
          </div>
        </Link>

        {/* Juice Point */}
        <Link to="/menu/juicepoint" className="canteen-link">
          <div className="canteen-card">
            <img src="https://images.unsplash.com/photo-1498654896293-37aacf113fd9" />
            <h3>Juice Point</h3>
            <p>Juices • Shakes • Sandwich</p>
          </div>
        </Link>

        {/* Pizza Hub */}
        <Link to="/menu/pizzahub" className="canteen-link">
          <div className="canteen-card">
            <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38" />
            <h3>Pizza Hub</h3>
            <p>Pizza • Fries • Burgers</p>
          </div>
        </Link>

        {/* South Indian Corner */}
        <Link to="/menu/southindian" className="canteen-link">
          <div className="canteen-card">
            <img src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092" />
            <h3>South Indian Corner</h3>
            <p>Dosa • Idli • Meals</p>
          </div>
        </Link>

        {/* Snack Station */}
        <Link to="/menu/snackstation" className="canteen-link">
          <div className="canteen-card">
            <img src="https://images.unsplash.com/photo-1550547660-d9450f859349" />
            <h3>Snack Station</h3>
            <p>Puffs • Tea • Maggi</p>
          </div>
        </Link>

      </div>
    </section>
  );
}

export default Canteens;