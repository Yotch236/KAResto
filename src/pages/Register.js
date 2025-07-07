import { useState, useEffect, useContext } from 'react';
import { Row, Col, Container, Form, Button } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import Swal from 'sweetalert2';

export default function Register() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (FirstName !== "" && LastName !== "" && email !== "" && password !== "") {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [FirstName, LastName, email, password]);

  function registerUser(e) {
    e.preventDefault();

     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    Swal.fire({
      icon: "warning",
      title: "Invalid Email",
      text: "Please enter a valid email address.",
    });
    return;
  }

  if (password.length < 8) {
    Swal.fire({
      icon: "warning",
      title: "Weak Password",
      text: "Password should be at least 8 characters long.",
    });
    return;
  }

    if(password.length < 8) {
      Swal.fire({
        icon: "warning",
        title: "Weak Password",
        text: "Password should be at least 8 characters long.",
      });
      return;
    }

    fetch(`https://karestoapi.onrender.com/users/register`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        FirstName,
        LastName,
        email,
        password
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.message === "Registered Successfully") {
          setFirstName("");
          setLastName("");
          setEmail("");
          setPassword("");

          Swal.fire({
            position: "center",
            icon: "success",
            title: "Registration Successful!",
            showConfirmButton: false,
            timer: 1500,
          });

          navigate("/login");
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.message || "Something went wrong.",
          });
        }
      });
  }

  return (
    user.id !== null ? (
      <Navigate to="/" />
    ) : (
      <div id="wrapper" className="d-flex justify-content-center align-items-center m-0 p-0 vh-100">
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} md={6} lg={4}>
              <div className="p-4 shadow rounded bg-white">
                <Form onSubmit={registerUser}>
                  <h1 className="my-5 text-center">Register</h1>

                  <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter First Name"
                      required
                      value={FirstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mb-3"
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Last Name"
                      required
                      value={LastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="mb-3"
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter Email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mb-3"
                    />

                    {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                    <Form.Text className="text-danger">
                      Please enter a valid email address.
                    </Form.Text>
)}
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type={[showPassword ? "text": "password"]}
                      placeholder="Enter Password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mb-3"
                    />

                     <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        className="ms-2"
                      >
      {showPassword ? "Hide" : "Show"}
    </Button>

                    {password && password.length > 0 && password.length < 8 && (
                    <Form.Text className="text-danger">
                      Password should be at least 8 characters long.
                    </Form.Text>
)}
                  </Form.Group>

                  <Button type="submit" className="w-100 mt-3" variant={isActive ? "primary" : "success"} disabled={!isActive}>
                    Register
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  );
}
