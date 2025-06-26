import AppNavBar from './components/AppNavBar';
import { UserProvider } from './context/UserContext';
import Container from 'react-bootstrap/Container';
import { useState, useEffect } from 'react';
import Home from './components/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null,
  });

  const unsetUser = () => {
    localStorage.clear();
    setUser({ id: null, isAdmin: null });
  };

  useEffect(() => {
    fetch(`https://karestoapi.onrender.com/users/details`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.auth !== 'Failed') {
          setUser({
            id: data._id,
            isAdmin: data.isAdmin,
          });
        } else {
          unsetUser();
        }
      });
  }, []);

  useEffect(() => {
    console.log(user);
    console.log(localStorage);
  }, [user]);

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavBar />
        <Container className="mt-4">
          <Routes>
             <Route path ="/" element={<Home />} /> 
             <Route path="/register" element={<Register />} />
             <Route path="/login" element={<Login />} />
             <Route path="/logout" element={<Logout />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;
