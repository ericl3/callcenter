import "./rep.css"
import React, { Component } from 'react';
import Sidebar from "./Sidebar";
import CallArea from "./CallArea";
import IncomingCall from './IncomingCall';

class Rep extends Component{
    state = {
        name: "",
        online: false,
        greeting: "Hi, friend."
    }

    setName = (name) =>{
        console.log(name);
        this.setState({name: name});
        this.setState({greeting: `Hi, ${this.state.name}.`});
        this.setState({online: true});
    }

    render(){
        return(
            <div className="rep-container">
                <div>
                    <Sidebar companyName="Bouncy Beds" repImage="https://randomuser.me/api/portraits/lego/1.jpg" online={this.state.online} repName={this.state.name} startTime={Date.now()} repCallCount="12" repAvgDuration="4 mins" repSessionIncome="15" greeting={this.state.greeting}/>
                </div>
                <div>
                    <CallArea manager="false" setName={this.setName} />
                </div>
            </div>
        )
    }
}

export default Rep;