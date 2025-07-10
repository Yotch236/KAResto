import { useEffect, useState, useContext } from "react";
import { Container,Row, Col,Card, Button} from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import UserContext from "../context/UserContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user || !user.token) {
      navigate("/login", { state: { from: location } });
    } else {
      fetchCart();
    }
  }, [user, navigate, location]);

  const fetchCart = () => {
    setLoading(true);
    axios
      .get("https://karestoapi.onrender.com/cart/get-cart", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setCartItems(Array.isArray(res.data.cartItems) ? res.data.cartItems : []);
      })
      .catch((err) => {
        console.error("Cart fetch error:", err);
        toast.error("Failed to load cart. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  const handleRemove = (foodId) => {
    axios
      .delete(`https://karestoapi.onrender.com/cart/remove/${foodId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        toast.success(res.data.message || "Item removed.");
        setCartItems(res.data.cart?.cartItems || []);
      })
      .catch(() => toast.error("Failed to remove item."));
  };

  const handleQuantityChange = (foodId, newQty) => {
    if (newQty < 1) return;

    setLoading(true);
    axios
      .patch(
        `https://karestoapi.onrender.com/cart/update/${foodId}`,
        { quantity: newQty },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      .then((res) => {
        setCartItems(res.data.cart?.cartItems || []);
        toast.success(res.data.message || "Quantity updated.");
      })
      .catch((err) => {
        const msg = err.response?.data?.message || "Failed to update quantity.";
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  };

  const handleClearCart = () => {
    const confirmClear = window.confirm("Are you sure you want to clear the cart?");
    if (!confirmClear) return;

    setLoading(true);
    axios
      .delete("https://karestoapi.onrender.com/cart/clear", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        toast.success(res.data.message || "Cart cleared.");
        setCartItems([]);
      })
      .catch(() => toast.error("Failed to clear cart."))
      .finally(() => setLoading(false));
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + (item.foodId?.price || 0) * item.quantity,
      0
    );
  };

  const handlePlaceOrder = () => {
    toast.success("Order placed!");
    // Example: redirect to order summary
    navigate("/order");
  };

  return (
    <Container className="my-4">
      <h2 className="text-center text-success fw-bold mb-4">Your Cart</h2>

      {cartItems.length > 0 ? (
        <>
          <Row>
            {cartItems.map((item) => (
              <Col md={4} key={item.foodId._id} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title className="text-center">{item.foodId?.name || "Unnamed Food"}</Card.Title>
                    <Card.Text className="text-center">₱{item.foodId?.price?.toFixed(2) || "0.00"}</Card.Text>
                    <Card.Text className="text-center">
                      Subtotal: ₱{((item.foodId?.price || 0) * item.quantity).toFixed(2)}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        disabled={loading}
                        onClick={() => handleQuantityChange(item.foodId._id, item.quantity - 1)}
                      >
                        −
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        disabled={loading}
                        onClick={() => handleQuantityChange(item.foodId._id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                    <Button
                      variant="success"
                      className="w-100 fw-semibold"
                      disabled={loading}
                      onClick={() => handleRemove(item.foodId._id)}
                    >
                      Remove
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="text-end mt-3 me-2">
            <h5>Total: ₱{calculateTotal().toFixed(2)}</h5>
            <Button
              variant="outline-danger"
              className="me-2"
              disabled={loading}
              onClick={handleClearCart}
            >
              Clear Cart
            </Button>
            <Button
              variant="success"
              disabled={loading}
              onClick={handlePlaceOrder}
            >
              Place Order
            </Button>
          </div>
        </>
      ) : (
        <p className="text-center text-muted fs-5 mt-5">
          🛒 Your cart is empty. Add some delicious meals!
        </p>
      )}
    </Container>
  );
}
