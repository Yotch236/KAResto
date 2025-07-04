import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Card, Button } from "react-bootstrap";
import axios from "axios";

export default function FoodPage() {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    axios.get("https://karestoapi.onrender.com/foods/active") // ✔️ live backend
      .then(res => {
        setFoods(res.data);
        setFilteredFoods(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const handleFilter = () => {
    let filtered = foods;

    if (category !== "All") {
      filtered = filtered.filter(food => food.category === category);
    }

    if (minPrice !== "") {
      filtered = filtered.filter(food => food.price >= parseFloat(minPrice));
    }

    if (maxPrice !== "") {
      filtered = filtered.filter(food => food.price <= parseFloat(maxPrice));
    }

    setFilteredFoods(filtered);
  };

  const uniqueCategories = ["All", ...new Set(foods.map(food => food.category))];

  return (
    <Container className="my-4">
      <h2 className="mb-4 text-center fw-bold text-success">KAResto Menu</h2>

      <Row className="mb-4">
        <Col md={3}>
          <Form.Select value={category} onChange={e => setCategory(e.target.value)}>
            {uniqueCategories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Control
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Button onClick={handleFilter} className="w-100 bg-success fw-semibold">Apply Filters</Button>
        </Col>
      </Row>

      <Row>
        {filteredFoods.length > 0 ? (
          filteredFoods.map(food => (
            <Col md={4} lg={3} sm={6} xs={12} key={food._id} className="mb-4">
              <Card>
                <Card.Img
  variant="top"
  src={
    food.image.startsWith("http")
      ? food.image
      : `https://karestoapi.onrender.com${food.image}`
  }
  alt={food.name}
  style={{ height: "180px", objectFit: "cover" }}
/>

                <Card.Body>
                  <Card.Title>{food.name}</Card.Title>
                  <Card.Text>{food.description}</Card.Text>
                  <Card.Text><strong>₱{food.price.toFixed(2)}</strong></Card.Text>
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
    </Container>
  );
}
