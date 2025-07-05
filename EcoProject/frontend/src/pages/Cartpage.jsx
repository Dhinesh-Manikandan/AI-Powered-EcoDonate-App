import { useEffect, useState } from "react";
import axios from "axios";
import '../styles/CartPage.css'; // ✅ Import CSS

const CartPage = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const removeFromCart = (id) => {
    const updated = cart.filter(item => item._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || !user.id) {
      alert("⚠️ Please login first.");
      return;
    }

    try {
      for (const item of cart) {
        await axios.put(
          `http://localhost:5000/api/donations/${item._id}/claim`,
          { orgId: user.id },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }

      alert("✅ Checkout successful! Your items have been claimed.");
      setCart([]);
      localStorage.removeItem("cart");

    } catch (err) {
      console.error("❌ Error during checkout:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <p className="cart-empty-text">No items in cart.</p>
      ) : (
        <>
          <div className="cart-items-grid">
            {cart.map((item) => (
              <div key={item._id} className="cart-item-card">
                {item.image && (
                <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.wasteName} />
              )}
                <h3 className="item-title">{item.wasteName}</h3>
                <p><strong>📦 Quantity:</strong> {item.quantity}</p>
                <p><strong>📍 Location:</strong> {item.pickupLocation}</p>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item._id)}
                >
                  ❌   Remove
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleCheckout}
            className="checkout-btn"
          >
            ✅ Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;
