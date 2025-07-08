import { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import UserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [cart, setCart] = useState({ cartItems: [] });
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.token) {
      fetchCart();
    } else {
      navigate("/login");
    }
  }, [user]);

  const fetchCart = () => {
    setLoading(true);
    axios
      .get("https://karestoapi.onrender.com/cart/get-cart", {
        headers: { Authorization: user.token },
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCart({ cartItems: [] }); // backend returns [] if empty
        } else {
          setCart(res.data);
        }
      })
      .catch(() => {
        toast.error("Failed to load cart");
      })
      .finally(() => setLoading(false));
  };

  const handleRemove = (foodId) => {
    axios
      .delete(`https://karestoapi.onrender.com/cart/remove/${foodId}`, {
        headers: { Authorization: user.token },
      })
      .then((res) => {
        toast.success(res.data.message || "Item removed");
        setCart(res.data.cart);
      })
      .catch(() => toast.error("Failed to remove item"));
  };

  const handleQuantityChange = (foodId, newQty) => {
    if (newQty < 1) return;

    axios
      .patch(
        `https://karestoapi.onrender.com/cart/update/${foodId}`,
        { quantity: newQty },
        { headers: { Authorization: user.token } }
      )
      .then((res) => {
        setCart(res.data.cart);
        toast.success(res.data.message || "Quantity updated");
      })
      .catch((err) => {
        const msg = err.response?.data?.message || "Update failed";
        toast.error(msg);
      });
  };

  const handleClearCart = () => {
    axios
      .delete("https://karestoapi.onrender.com/cart/clear", {
        headers: { Authorization: user.token },
      })
      .then((res) => {
        toast.success(res.data.message || "Cart cleared");
        setCart(res.data.cart);
      })
      .catch(() => toast.error("Failed to clear cart"));
  };

  const calculateTotal = () => {
    if (!cart?.cartItems?.length) return 0;
    return cart.cartItems.reduce(
      (sum, item) => sum + item.foodId.price * item.quantity,
      0
    );
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="success" />
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2 className="text-center text-success fw-bold mb-4">Your Cart</h2>

      {cart?.cartItems?.length > 0 ? (
        <>
          <Row>
            {cart.cartItems.map((item) => (
              <Col md={4} key={item.foodId._id} className="mb-4">
                <Card>
                  <Card.Img
                    variant="top"
                    src={
                      item.foodId.image?.startsWith("http")
                        ? item.foodId.image
                        : `https://karestoapi.onrender.com${item.foodId.image || ""}`
                    }
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title>{item.foodId.name || "Unnamed Food"}</Card.Title>
                    <Card.Text>₱{item.foodId.price.toFixed(2)}</Card.Text>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(item.foodId._id, item.quantity - 1)
                        }
                      >
                        −
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() =>
                          handleQuantityChange(item.foodId._id, item.quantity + 1)
                        }
                      >
                        +
                      </Button>
                    </div>
                    <Button
                      variant="danger"
                      className="w-100 fw-semibold"
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
            <Button variant="outline-danger" className="me-2" onClick={handleClearCart}>
              Clear Cart
            </Button>
            <Button variant="success" onClick={() => toast.success("Order placed!")}>
              Place Order
            </Button>
          </div>
        </>
      ) : (
        <p className="text-center">Your cart is empty.</p>
      )}
    </Container>
  );
}
