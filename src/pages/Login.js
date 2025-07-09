import { useState, useEffect, useContext } from 'react';
import { Row, Col, Container, Form, Button } from 'react-bootstrap';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import UserContext from '../context/UserContext';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../index.css';

export default function Login() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/foods"; // fallback if no previous path

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsActive(email.length > 0 && password.length > 0);
  }, [email, password]);

  function authenticate(e) {
    e.preventDefault();
    setIsSubmitting(true);

    fetch('https://karestoapi.onrender.com/users/login', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(errorData => {
          throw new Error(errorData.message || "Incorrect email or password.");
        });
      }
      return res.json();
    })
    .then(data => {
      if (data.access) {
        localStorage.setItem('token', data.access);
        retrieveUserDetails(data.access);
        setEmail('');
        setPassword('');
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Unexpected login response.",
        });
        setIsSubmitting(false);
      }
    })
    .catch(error => {
      const isNetworkError = error.message.includes("Failed to fetch");
      Swal.fire({
        icon: "error",
        title: isNetworkError ? "Server Error" : "Login Failed",
        text: isNetworkError
          ? "Cannot connect to the server. Try again later."
          : error.message,
      });
      setIsSubmitting(false);
    });
  }

  function retrieveUserDetails(token) {
    fetch("https://karestoapi.onrender.com/users/details", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(errorData => {
          throw new Error(errorData.message || "Failed to fetch user details.");
        });
      }
      return res.json();
    })
    .then(data => {
      if (data._id) {
        Swal.fire({
          icon: "success",
          title: data.isAdmin ? "Welcome Admin" : `Welcome, ${data.FirstName + " " + data.LastName || 'User'}`,
          showConfirmButton: false,
          timer: 1500
        });

        setUser({ id: data._id, isAdmin: data.isAdmin, token });

        setTimeout(() => navigate(from), 1000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "User ID missing from server response.",
        });
        setIsSubmitting(false);
      }
    })
    .catch(error => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Error retrieving user info",
      });
      setIsSubmitting(false);
    });
  }

  // Prevent forced redirect to /foods on every login
  useEffect(() => {
    if (user.id !== null) {
      navigate(from);
    }
  }, [user, from, navigate]);

  return user.id !== null ? (
    <Navigate to={from} />
  ) : (
    <div id="wrapper" className="d-flex justify-content-center align-items-center vh-100">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={6} lg={4}>
            <div className="p-4 shadow rounded bg-white">
              <Form onSubmit={authenticate}>
                <h1 className="my-5 text-center">Login</h1>

                <Form.Group>
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    required
                    value={email}
                    className="mb-3"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <div className='input-group'>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder='Password'
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </div>
                </Form.Group>

                <Button
                  type="submit"
                  className="w-100 mt-3 fw-semibold"
                  variant={isActive ? "success" : "danger"}
                  disabled={!isActive || isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>

                <div className='text-center mt-3'>
                  <span className='fw-semibold'>Don't have an account?</span>
                  <a href="/register" className='fw-semibold text-success'> Register</a>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
