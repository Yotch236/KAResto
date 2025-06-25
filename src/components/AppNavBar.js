import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../assets/KARestoLogo.png';
import Nav from 'react-bootstrap/Nav';

export default function AppNavBar() {
  return (
    <Navbar expand="lg" className="bg-success">
      <Container>
        <Navbar.Brand href="#home" className="text-white fw-bold">
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
            <Nav.Link href="#home" className='text-white fw-semibold'>Home</Nav.Link>
            <Nav.Link href="#order" className='text-white fw-semibold'>Order</Nav.Link>
            <Nav.Link href="#order" className='text-white fw-semibold'>Login</Nav.Link>
            <Nav.Link href="#register" className='text-white fw-semibold'>Register</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
