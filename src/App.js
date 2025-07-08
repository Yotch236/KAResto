import AppNavBar from './components/AppNavBar';
import { UserProvider } from './context/UserContext';
import Container from 'react-bootstrap/Container';
import { useState, useEffect } from 'react';
import Home from './components/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import FoodPage from './pages/FoodPage';
import CartPage from './pages/CartPage';
import Error from './pages/ErrorPage';
import RestaurantSpinner from './components/RestaurantSpinner';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null,
    token: localStorage.getItem('token'),
  });

  const [loading, setLoading] = useState(true);

  const unsetUser = () => {
    localStorage.clear();
    setUser({ id: null, isAdmin: null, token: null });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      fetch(`https://karestoapi.onrender.com/users/details`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.auth !== 'Failed') {
            setUser({
              id: data._id,
              isAdmin: data.isAdmin,
              token: token,
            });
          } else {
            unsetUser();
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <RestaurantSpinner />;
  }

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavBar />
        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/foods" element={<FoodPage />} />
            <Route
              path="/cart"
              element={user.id ? <CartPage /> : <Navigate to="/login" />}
            />
            <Route path="*" element={<Error />} />
          </Routes>
        </Container>

        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </UserProvider>
  );
}

export default App;
