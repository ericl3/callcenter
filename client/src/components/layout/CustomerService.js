import React, { Component } from 'react';
import '../../App.css'
import CallBlock from '../CallBlock'
import { Container } from 'react-bootstrap'

class CustomerService extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Container>
                {/* <h1> Customer Service Page </h1> */}
                <CallBlock userType="CustomerService" />
            </Container>
        )
    }
}

export default CustomerService