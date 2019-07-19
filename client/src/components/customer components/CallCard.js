import React, { Component } from 'react';
import Customer from '../layout/Customer';
import { Button } from '@bandwidth/shared-components';


class CallCard extends Component {
    componentDidMount(){
        console.log(this.state);
    }
    state = {
        callActive: true
    }

    renderCallActive = () => {
        if(this.state.callActive){
            return(
                <div>
                    {/* <p className="text-center">Call Active</p> */}
                    <Customer />
                    {/* <div className="row">
                        <Button.Danger onClick={() => this.callClicked()} className="top-margin-fifteen" >Hide</Button.Danger>
                    </div> */}
                </div>
            )
        }
        else{
            return(
                <div><Button onClick={() => this.callClicked()}>Call to Book</Button></div>
            )
        }
    }

    render(){
        return(
            <div className="call-card">
                <h3>Your Rep:</h3>
                <p className="no-margin lighter">Jim</p>
                <img alt="profile of employee" src="https://randomuser.me/api/portraits/lego/1.jpg" className="call-area-rep"/>
                <br />
                {this.renderCallActive()}
            </div>
        )
    }
}

export default CallCard;