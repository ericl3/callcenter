import "./sidebar.css"
import React, {Component} from "react";
import { Button, Input } from '@bandwidth/shared-components'

class Sidebar extends Component {
    // function calculateTime(){
    //     var start = props.startTime;
    //     var now = Date.now();

    //     var diff = now - start;
    //     var diff_hours = new Date(diff);

    //     return diff_hours.getHours();
    // }
    renderButton() {
        if(this.props.repName != ""){
            return(
                <Button.Danger>Log Out</Button.Danger>
            )
        }

    }

    render(){
        return(
            <div>
                <div className="fullHeight sidebar">
                    <h2>{this.props.companyName}.</h2>
                    <img alt="rep profile" className="profilePic" src={this.props.repImage} />
                    {/* TODO: add rating */}
                    <h4>Hi {this.props.repName}.</h4>
                    <br/>
                    {/* <p>Online for: <span className="heavier">{calculateTime}</span></p> */}
                    <p>Calls taken: <span className="heavier">{this.props.repCallCount}</span></p>
                    <p>Avg. Duration: <span className="heavier">{this.props.repAvgDuration}</span></p>
                    <p>Earned: <span className="heavier">${this.props.repSessionIncome}</span></p>
                    <br/>
                    <br/>
                    {this.renderButton()}
                </div>
            </div>
        );
    }
}

export default Sidebar;