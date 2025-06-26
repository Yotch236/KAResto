import {  Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../index.css';

export default function Home() {


    return (
        <Row>
           <Col className='mt-5 pt-5 text-center mx-auto'>
              <h1>Welcome to KAResto</h1>
              <p className='fw-semibold'>All You Can Think, All You Can Eat</p>
              <Link className='btn btn-success fw-semibold' to={"/register"}>Order Now</Link>
           </Col>
        </Row>
    )
}