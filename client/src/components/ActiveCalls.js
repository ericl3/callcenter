import React, { Component } from 'react';
import CallBlock from './CallBlock'
import '../App.css'
import axios from 'axios'
import io from 'socket.io-client';
import { Col } from 'react-bootstrap'

class ActiveCalls extends Component {
    constructor() {
        super();
        this.state = {
            activeCalls: []
        }
        this.socket = io.connect();
        this.socket.on("added active call", () => {
            this.getActiveCalls();
        })
        this.socket.on("removed active call", () => {
            this.getActiveCalls();
        })

        this.getActiveCalls = this.getActiveCalls.bind(this);

    }

    componentDidMount() {
        this.getActiveCalls();
    }

    renderNoActive() {
        return (
            <p> No active calls to join... </p>
        )

    }

    renderActiveCalls() {
        return this.state.activeCalls.map((call, i) => {
            return (
                <Col key={i}>
                    <CallBlock userType="Manager" session={call} />
                </Col>
            )
        })
    }

    render() {
        return (this.state.activeCalls.length == 0 ? this.renderNoActive() : this.renderActiveCalls());
    }


    /* REQUESTS TO THE BACK END */
    getActiveCalls() {
        axios.get("/api-sessions/get-sessions").then(res => {
            this.setState({
                activeCalls: res.data.activeCalls
            })
        })
    }
}

export default ActiveCalls;