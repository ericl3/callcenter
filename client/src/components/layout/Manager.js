import React, { Component } from 'react';
import '../../App.css'
import CallBlock from '../CallBlock'
import { Container, Row } from 'react-bootstrap'
import ActiveCalls from '../ActiveCalls'
import axios from 'axios';

class Manager extends Component {

    render() {
        return (
            <div className="full-height manager-container">
                <h1> Hi, Ms. Manager. </h1>
                <Row>
                    <h2> Active Calls Available for Joining</h2>
                    <ActiveCalls />
                </Row>
            </div>            
        )
    }
}

export default Manager;