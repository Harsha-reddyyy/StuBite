import "./Canteens.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { apiRequest } from "../lib/api";
import { fallbackCanteens } from "../lib/catalogFallback";

function Canteens() {
  const [canteens, setCanteens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const fallbackToastShownRef = useRef(false);

  const loadCanteens = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await apiRequest("/api/canteens");
      setCanteens(data.canteens || []);
      fallbackToastShownRef.current = false;
    } catch (error) {
      setCanteens(fallbackCanteens);
      setErrorMessage("");

      if (!fallbackToastShownRef.current) {
        toast.warning("Backend unavailable. Showing saved canteen catalog.");
        fallbackToastShownRef.current = true;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCanteens();
  }, [loadCanteens]);

  return (
    <section id="canteens" className="canteens">
      <h2>Explore Canteens</h2>

      <div className="canteen-grid">
        {loading && <p>Loading canteens...</p>}

        {!loading && errorMessage && (
          <div className="canteen-state-card">
            <h3>Canteens are unavailable</h3>
            <p>{errorMessage}</p>
            <button type="button" onClick={loadCanteens}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !errorMessage && canteens.length === 0 && (
          <div className="canteen-state-card">
            <h3>No canteens found</h3>
            <p>The catalog is empty right now. Please check back in a moment.</p>
          </div>
        )}

        {!loading && !errorMessage && canteens.map((canteen) => (
          <Link
            to={`/menu/${canteen.slug}`}
            className="canteen-link"
            key={canteen.slug}
          >
            <div className="canteen-card">
              <img src={canteen.image} alt={canteen.name} />
              <h3>{canteen.name}</h3>
              <p>{canteen.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Canteens;
