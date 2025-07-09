import { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Form, Card, Button } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import "../pages/FoodPage.css";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

export default function FoodPage() {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://karestoapi.onrender.com/foods/active")
      .then((res) => {
        setFoods(res.data);
        setFilteredFoods(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleFilter = () => {
    let filtered = [...foods];

    if (category !== "All") {
      filtered = filtered.filter((food) => food.category === category);
    }

    if (!isNaN(parseFloat(minPrice))) {
      filtered = filtered.filter((food) => food.price >= parseFloat(minPrice));
    }

    if (!isNaN(parseFloat(maxPrice))) {
      filtered = filtered.filter((food) => food.price <= parseFloat(maxPrice));
    }

    setFilteredFoods(filtered);
  };

 const handleAddToCart = (foodId) => {
  if (!user || !user.id) {
    navigate("/login");
  } else {
    axios
      .post(
        "https://karestoapi.onrender.com/cart/add-to-cart",
        { foodId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${user.token}`, // ✅ FIXED
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message || "Item added to cart!");
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || err.response?.data?.error || "Failed to add item to cart.";
        toast.error(errorMessage);
      });
  }
};
  const uniqueCategories = ["All", ...new Set(foods.map((food) => food.category))];

  return (
    <Container className="my-4">
      <h2 className="mb-4 text-center fw-bold text-success">KAResto Menu</h2>

      <Row className="mb-4">
        <Col md={3}>
          <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
            {uniqueCategories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Control
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Button onClick={handleFilter} className="w-100 bg-success fw-semibold">
            Apply Filters
          </Button>
        </Col>
      </Row>

      <Row>
        {filteredFoods.length > 0 ? (
          filteredFoods.map((food) => (
            <Col md={4} lg={3} sm={6} xs={12} key={food._id} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={
                    food.image
                      ? food.image.startsWith("http")
                        ? food.image
                        : `https://karestoapi.onrender.com${food.image}`
                      : "https://via.placeholder.com/300x180?text=No+Image"
                  }
                  alt={food.name}
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{food.name}</Card.Title>
                  <Card.Text>{food.description}</Card.Text>
                  <Card.Text>
                    <strong>₱{food.price.toFixed(2)}</strong>
                  </Card.Text>
                  <Button
                    className="w-100 mt-2 bg-success fw-semibold"
                    onClick={() => handleAddToCart(food._id)}
                  >
                    Add to Cart
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p className="text-center">No food found.</p>
          </Col>
        )}
      </Row>

      {user && user.id && (
        <Button
          variant="success"
          className="floating-cart"
          onClick={() => navigate("/cart")}
        >
          🛒
        </Button>
      )}
    </Container>
  );
}
