import React, { Component } from 'react';
import { Button, Input } from '@bandwidth/shared-components'
class Employee extends Component {
    state = {callActive: false }

    renderJoin = () => {
        if(this.props.active !== "true"){
            return(
                <button className="answer" disabled>Call Rep</button>
            );
        }
        if(!this.state.callActive){
            return(
                <Button onClick={this.props.joinSession}>Join Call</Button>
            );
        }

        else{
            return(
                <Button className="disabled" disabled> In Call</Button>
            );
        }
    }


    renderActiveCall(){
        if(this.state.callActive){
            return(
            <div className="manager-card">
                <p>On the phone with: <span className="heavier">Jim Fletcherson</span></p>
                <p className="no-margin">Call Duration: <span className="heavier">2:32</span></p>
                <br />
                <Button.danger className="decline" onClick={this.endCall}>End Call</Button.danger>
            </div>
            )
        }
    }

    activateCall = () =>{
        if(!this.state.callActive){
            this.setState({ callActive: true });
        }
        else{
            this.setState({ callActive: false });
        }
    }

    endCall = () => {
        this.setState({ callActive: false });
    }

    renderCallInfo() {
        if(this.props.active === "true"){
            return(
                <div>
                    <h4 className="heavier">Call Info</h4>
                    <p className="no-margin">Customer Name: <span className="heavier">{this.props.customerName}</span></p>
                    <p className="">Topic: <span className="heavier">Booking</span></p>
                </div>
            )
        }
        else{
            return(
                <div>
                    <h4>Currently Inactive</h4>
                    <p className="no-margin">Duration: --</p>
                    <p className="">Topic: --</p>
                </div>
            )
        }
    }

    render(){
        return(
            <div>
                <div className="manager-card">
                    <div className="flex-row">
                        <img alt="employee profile" src="https://randomuser.me/api/portraits/lego/1.jpg" className="call-profile" />
                        <h3>{this.props.name}</h3>
                    </div>
                    {this.renderCallInfo()}
                    <br />
                    <div className="flex-row">
                        {this.renderJoin()}
                    </div>
                </div>
                {this.renderActiveCall()}
            </div>
        )
    }
};

export default Employee;