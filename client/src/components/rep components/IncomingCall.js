import React, { Component } from 'react';
import { Button } from '@bandwidth/shared-components'

class IncomingCall extends Component{
    state = {
        callActive: false,
        callPending: true
    }

    answer= () => {
        this.setState({callActive: true, callPending: false});
        this.props.createSession();
    }

    decline = () => {
        this.setState({callActive: false});
        this.props.declineCall();
    }
    
    renderCallMessage = () => {
        if(this.state.callActive){
            return(
                <span>Talking To</span>
            )
        }
        else{
            return(
                <span>Call From</span>
            )
        }
    }

    resetState = () => {
        this.setState({callActive: false, callPending: false});
    }

    renderButtons = () => {
        if(this.state.callActive){
            return(
                <Button.danger>End Call</Button.danger>
            )
        }
        else{
            return(
                <div className="incoming-call-buttons">
                        {/* <Button onClick={() => this.setState({callActive: true, callPending: false})} className="margin-right-small">Answer</Button> */}
                        <Button onClick={() => this.answer()} className="margin-right-small">Answer</Button>
                        <Button.Danger onClick={() => this.decline()} className="">Decline</Button.Danger>
                </div>
            )
        }
    }

    renderIncomingCall = () => {
        if(this.state.callPending || this.state.callActive){
            return(
                <div>
                    <div className="call-info">
                        <img alt="employee profile" src="https://randomuser.me/api/portraits/lego/5.jpg" className="call-profile" />
                        <div className="call-info-call">
                            <p className="no-margin">{this.renderCallMessage()}</p>
                            <h5 className="no-margin">{this.props.customerName}</h5>
                        </div>
                    </div>
                    <br></br>
                    {this.renderButtons()}
                </div>
            )
        }
    }

    render(){
        return(
            <div>
                {this.renderIncomingCall()}
            </div>
        )
    }
}

export default IncomingCall;