import { useState, useEffect, useContext } from 'react';
import { Row, Col, Container, Form, Button } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { jwtDecode } from "jwt-decode";

import '../index.css';

export default function Login() {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (email.length > 0 && password.length > 0) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [email, password]);

    useEffect(() => {
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: "491015704724-86pa319rhejvtsbcfkd0jmg8bv0snt3f.apps.googleusercontent.com",
                callback: handleGoogleCallback
            });

            window.google.accounts.id.renderButton(
                document.getElementById("googleSignInDiv"),
                { theme: "outline", size: "large", width: "100%" }
            );
        }
    }, []);

    function handleGoogleCallback(response) {
        const decoded = jwtDecode(response.credential);

        console.log("Google user:", decoded);

        fetch("https://karestoapi.onrender.com/users/google-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: decoded.email })
        })
            .then(res => res.json())
            .then(data => {
                if (data.access) {
                    localStorage.setItem("token", data.access);
                    retrieveUserDetails(data.access);

                    setTimeout(() => navigate("/foods"), 500);
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Google Login Failed",
                        text: data.message || "Could not log in via Google"
                    });
                }
            })
            .catch(err => {
                console.error("Google login error:", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.message
                });
            });
    }

    function authenticate(e) {
        e.preventDefault();
        fetch('https://karestoapi.onrender.com/users/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(errorData => {
                        throw new Error(errorData.message || "Login failed due to server error.");
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
                        text: data.message || "An unexpected error occurred.",
                    });
                }
            })
            .catch(error => {
                console.error("Authentication error:", error);
                Swal.fire({
                    icon: "error",
                    title: "Network Error",
                    text: error.message,
                });
            });
    }

    function retrieveUserDetails(token) {
        fetch("https://karestoapi.onrender.com/users/details", {
            headers: {
                Authorization: `Bearer ${token}`
            }
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
                        title: data.isAdmin ? "Welcome Admin" : `Welcome, ${data.firstName || 'User'}`,
                        showConfirmButton: false,
                        timer: 1500
                    });

                    setUser({ id: data._id, isAdmin: data.isAdmin });
                    setTimeout(() => navigate("/foods"), 500);
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Failed to retrieve user details.",
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `Error fetching user details: ${error.message}`,
                });
            });
    }

    useEffect(() => {
        if (user.id !== null) {
            navigate("/foods");
        }
    }, [user, navigate]);

    return (
        user.id !== null ? <Navigate to="/foods" />
            :
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
                                        id="loginBtn"
                                        className={`fw-semibold w-100 mt-3 ${isActive ? "bg-success" : "bg-danger"}`}
                                        disabled={!isActive}
                                    >
                                        Login
                                    </Button>

                                    <div className='text-center mt-3'>
                                        <span className='fw-semibold'>Don't have an account?</span>
                                        <a href="/register" className='fw-semibold text-success'> Register</a>
                                    </div>

                                    <div className="text-center mt-4">
                                        <div id="googleSignInDiv"></div>
                                    </div>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
    );
}
