import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../assets/KARestoLogo.png';
import Nav from 'react-bootstrap/Nav';
import UserContext from '../context/UserContext';
import { useContext } from 'react';
import { NavLink } from 'react-router-dom';

export default function AppNavBar() {
  const { user } = useContext(UserContext);

  return (
    <Navbar expand="lg" className="bg-success">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="text-white fw-bold">
          <img
            alt="Logo"
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          KAResto
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" className="text-white fw-semibold" end>
              Home
            </Nav.Link>

            <Nav.Link as={NavLink} to="/order" className="text-white fw-semibold">
              Order
            </Nav.Link>

            {user.id ? (
              <>
                <Nav.Link as={NavLink} to="/logout" className="text-white fw-semibold">
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login" className="text-white fw-semibold">
                  Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="/register" className="text-white fw-semibold">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
