import { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import UserContext from "../context/UserContext";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user && user.token) {
      axios
        .get("https://karestoapi.onrender.com/cart/get-cart", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          console.log("Cart data:", res.data); // Optional for debugging
          setCart(res.data);
        })
        .catch((err) => {
          console.error("Error loading cart:", err);
        });
    }
  }, [user]);

  return (
    <Container className="my-4">
      <h2 className="mb-4 text-center text-success fw-bold">Your Cart</h2>
      <Row>
        {cart && cart.items.length > 0 ? (
          cart.items.map((item, index) => (
            <Col md={4} sm={6} xs={12} key={index} className="mb-3">
              <Card>
                <Card.Img
                  variant="top"
                  src={
                    item.food.image?.startsWith("http")
                      ? item.food.image
                      : `https://karestoapi.onrender.com${item.food.image}`
                  }
                  style={{ height: "180px", objectFit: "cover" }}
                  alt={item.food.name}
                />
                <Card.Body>
                  <Card.Title>{item.food.name}</Card.Title>
                  <Card.Text>{item.food.description}</Card.Text>
                  <Card.Text>Quantity: {item.quantity}</Card.Text>
                  <Card.Text>
                    <strong>₱{item.subtotal.toFixed(2)}</strong>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center">Your cart is empty.</p>
        )}
      </Row>

      {cart && (
        <h4 className="text-end mt-4 fw-bold text-success">
          Total: ₱{cart.totalPrice.toFixed(2)}
        </h4>
      )}
    </Container>
  );
}
