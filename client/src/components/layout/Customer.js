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
                <CallBlock userType="Customer" />
            </Container>
        )
    }
}


export default Customer