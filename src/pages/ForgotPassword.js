import { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("https://karestoapi.onrender.com/users/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(data => {
          throw new Error(data.message || "Failed to send reset email");
        });
      }
      return res.json();
    })
    .then(data => {
      Swal.fire({
        icon: "success",
        title: "Reset Email Sent",
        text: data.message || "Please check your email for a password reset link.",
      });
    })
    .catch(err => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
      });
    });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={6} lg={5}>
            <div className="bg-white shadow rounded p-4">
              <h2 className="text-center mb-4">Forgot Password</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
                <Button type="submit" className="w-100 fw-semibold bg-primary">
                  Send Reset Link
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
