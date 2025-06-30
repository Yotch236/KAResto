import {useState, useEffect} from 'react';
import {Row, Col, Container} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import RestaurantSpinner from '../components/RestaurantSpinner';
import errorImage from '../assets/image.png';

export default function Error(){
    return(
         <Container fluid className="d-flex align-items-center justify-content-center vh-100">
            <Row>
                <Col className="text-center">
                    <img 
                        src={errorImage} 
                        alt="Error illustration" 
                        style={{ maxWidth: '300px', marginBottom: '20px' }} 
                    />
                    <h1>Lost in Appetite?</h1>
                    <p>Go back Home and we will soon serve this page</p>
                    <Link to="/" className="btn btn-success fw-semibold">Back to Home</Link>
                </Col>
            </Row>
        </Container>
    );
}