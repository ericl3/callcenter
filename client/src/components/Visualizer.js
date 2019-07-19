import React, { Component } from 'react';
import { ReactMic } from 'react-mic';

class Visualizer extends Component {
    constructor(props) {
        super(props);
        this.record = true;
    }

    render() {
        return (
            <div>
                <ReactMic
                    record={this.record}
                    className={this.props.className}
                    strokeColor={this.props.color}
                    backgroundColor="white" />
            </div>
        )
    }
}

export default Visualizer