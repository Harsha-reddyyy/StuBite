import "./Menu.css";
import { useParams, Link } from "react-router-dom";
import { useEffect, useContext } from "react";
import { IoArrowBack } from "react-icons/io5";
import { CartContext } from "../context/CartContext";

function Menu() {

  const { canteenName } = useParams();

  const { cartItems, setCartItems } = useContext(CartContext);

  // Scroll page to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Convert URL name → Proper title
  const canteenTitles = {
    maincanteen: "Main Canteen",
    foodcourt: "Food Court",
    juicepoint: "Juice Point",
    pizzahub: "Pizza Hub",
    southindiancorner: "South Indian Corner",
    snackstation: "Snack Station"
  };

  const title = canteenTitles[canteenName] || "Menu";

  const menuData = {

    maincanteen: [
      {
        name: "Veg Meal",
        price: 80,
        image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d"
      },
      {
        name: "Fried Rice",
        price: 70,
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b"
      }
    ],

    foodcourt: [
      {
        name: "Burger",
        price: 60,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd"
      },
      {
        name: "Pizza",
        price: 120,
        image: "https://images.unsplash.com/photo-1548365328-8b849b7c7b1a"
      }
    ]

  };

  const items = menuData[canteenName] || [];

  // ADD ITEM
  const addToCart = (item) => {

    const existingItem = cartItems.find(
      (cartItem) => cartItem.name === item.name
    );

    if (existingItem) {

      const updatedCart = cartItems.map((cartItem) =>
        cartItem.name === item.name
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );

      setCartItems(updatedCart);

    } else {

      setCartItems([
        ...cartItems,
        { ...item, quantity: 1 }
      ]);

    }

  };


  // REMOVE ITEM
  const removeFromCart = (itemName) => {

    const existingItem = cartItems.find(
      (cartItem) => cartItem.name === itemName
    );

    if (!existingItem) return;

    if (existingItem.quantity === 1) {

      const updatedCart = cartItems.filter(
        (cartItem) => cartItem.name !== itemName
      );

      setCartItems(updatedCart);

    } else {

      const updatedCart = cartItems.map((cartItem) =>
        cartItem.name === itemName
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );

      setCartItems(updatedCart);

    }

  };


  // GET ITEM QUANTITY
  const getItemQuantity = (itemName) => {

    const item = cartItems.find(
      (cartItem) => cartItem.name === itemName
    );

    return item ? item.quantity : 0;

  };


  return (
    <div className="menu-page">

      <Link to="/" className="back-btn">
        <IoArrowBack className="back-icon" />
        Back to Canteens
      </Link>

      <h1>{title} Menu</h1>

      <div className="menu-grid">

        {items.map((item, index) => (
          <div className="food-card" key={index}>

            <img src={item.image} alt={item.name} />

            <h3>{item.name}</h3>

            <p>₹{item.price}</p>

            <div className="cart-controls">

              {getItemQuantity(item.name) === 0 ? (

                <button
                  className="add-btn"
                  onClick={() => addToCart(item)}
                >
                  ADD
                </button>

              ) : (

                <div className="quantity-controls">

                  <button
                    className="qty-btn"
                    onClick={() => removeFromCart(item.name)}
                  >
                    −
                  </button>

                  <span className="qty-number">
                    {getItemQuantity(item.name)}
                  </span>

                  <button
                    className="qty-btn"
                    onClick={() => addToCart(item)}
                  >
                    +
                  </button>

                </div>

              )}

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Menu;