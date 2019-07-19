import "./rep.css"
import React, { Component } from 'react';
import Sidebar from "./Sidebar";
import CallArea from "./CallArea";

class Manager extends Component{
    render(){
        return(
            <div className="rep-container">
                <div>
                    <Sidebar companyName="Bouncy Beds" repImage="https://randomuser.me/api/portraits/lego/1.jpg" repName="Mr. Manager" startTime={Date.now()} repCallCount="12" repAvgDuration="4 mins" repSessionIncome="150" />
                </div>
                <div>
                    <CallArea manager="true" />
                </div>
            </div>
        )
    }
}

export default Manager;