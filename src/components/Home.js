import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../context/UserContext';
import '../index.css';

export default function Home() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const handleOrderClick = () => {
        if (user && user.id !== null) {
            navigate('/order'); // user is logged in
        } else {
            navigate('/login'); // user is not logged in
        }
    };

    return (
        <Row>
            <Col className='mt-5 pt-5 text-center mx-auto'>
                <h1>Welcome to KAResto</h1>
                <p className='fw-semibold'>All You Can Think, All You Can Eat</p>
                <button className='btn btn-success fw-semibold' onClick={handleOrderClick}>
                    Order Now
                </button>
            </Col>
        </Row>
    );
}
