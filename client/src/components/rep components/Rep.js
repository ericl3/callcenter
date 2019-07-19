import "./rep.css"
import React, { Component } from 'react';
import Sidebar from "./Sidebar";
import CallArea from "./CallArea";

class Rep extends Component{
    render(){
        return(
            <div className="rep-container">
                <div>
                    <Sidebar companyName="Bouncy Beds" repImage="https://randomuser.me/api/portraits/lego/1.jpg" repName="Jim" startTime={Date.now()} repCallCount="12" repAvgDuration="4 mins" repSessionIncome="15" />
                </div>
                <div>
                    <CallArea manager="false"/>
                </div>
            </div>
        )
    }
}

export default Rep;