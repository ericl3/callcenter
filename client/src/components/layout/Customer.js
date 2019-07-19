import React, { Component } from 'react';
import '../../App.css'
import CallBlock from '../CallBlock'
import { Container } from 'react-bootstrap'

class Customer extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Container>
                <h1> Customer Page </h1>
                <CallBlock userType="Customer" />
            </Container>
        )
    }
}


export default Customer