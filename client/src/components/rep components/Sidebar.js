import "./sidebar.css"
import React from "react";
import { Button, Input } from '@bandwidth/shared-components'

const Sidebar = (props) => {
    // function calculateTime(){
    //     var start = props.startTime;
    //     var now = Date.now();

    //     var diff = now - start;
    //     var diff_hours = new Date(diff);

    //     return diff_hours.getHours();
    // }

    return(
        <div>
            <div className="fullHeight sidebar">
                <h2>{props.companyName}.</h2>
                <img alt="rep profile" className="profilePic" src={props.repImage} />
                {/* TODO: add rating */}
                <h4>Hi, {props.repName}.</h4>
                <br/>
                {/* <p>Online for: <span className="heavier">{calculateTime}</span></p> */}
                <p>Calls taken: <span className="heavier">{props.repCallCount}</span></p>
                <p>Avg. Duration: <span className="heavier">{props.repAvgDuration}</span></p>
                <p>Earned: <span className="heavier">${props.repSessionIncome}</span></p>
                <br/>
                <br/>
                <Button.Danger>Log Out</Button.Danger>
            </div>
        </div>
    );
}

export default Sidebar;