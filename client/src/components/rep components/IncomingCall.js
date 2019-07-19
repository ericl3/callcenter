import React, { Component } from 'react';

class IncomingCall extends Component{
    state = {
        callActive: false,
        callPending: true
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
        this.props.noActiveOrIncomingCall();
    }

    renderButtons = () => {
        if(this.state.callActive){
            return(
                <button onClick={() => this.resetState()} className="decline hundred-width">End Call</button>
            )
        }
        else{
            return(
                <div className="incoming-call-buttons">
                        <button onClick={() => this.setState({callActive: true, callPending: false})} className="answer">Answer</button>
                        <button onClick={() => this.resetState()} className="decline">Decline</button>
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
                            <h5 className="no-margin">Josh</h5>
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