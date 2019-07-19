import React, { Component } from 'react';
import axios from 'axios';
import OpenViduSession from 'openvidu-react';
import { OpenVidu } from 'openvidu-browser';
import { Button, Input } from '@bandwidth/shared-components'
import io from 'socket.io-client';
import Visualizer from './Visualizer'
import { Row, Col } from 'react-bootstrap'
import '../App.css'
import { motion } from 'framer-motion';

class CallBlock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            session: undefined,
            token: undefined,
            callState: undefined,
            name: "",
            sessionObject: undefined,
            agentName: undefined,
            customerName: undefined,
            isMute: false,
            isWhisper: false,
        }

        this.subscriptions = [];
        this.publisher = undefined;
        this.socket = io.connect();
        if (this.props.userType === "CustomerService") {
            this.socket.on('incoming call', (session) => {
                this.setState({
                    callState: 'incomingCall',
                    agentName: session.agent,
                    customerName: session.customer,
                    sessionObject: session
                })
            })
            this.socket.on('customer hung up', () => {
                if (this.state.callState === "incomingCall" || this.state.session !== undefined) {
                    this.removeAgentFriendly();
                }
                this.subscriptions = [];
            })
        }
        if (this.props.userType === "Customer") {
            this.socket.on('call accepted', (session) => {
                this.setState({
                    callState: 'activeCall',
                    agentName: session.agent,
                    customerName: session.customer,
                    sessionObject: session
                })
                this.joinSession();
            })
            this.socket.on('call declined', () => {
                this.becomeAvailableCustomer();
            })
            this.socket.on('take agent socket id', (id) => {
                this.agentSocketId = id
            })
            this.socket.on('unsubscribe from manager', () => {
                var subscriber = this.subscriptions[this.subscriptions.length - 1].subscription;
                //this.state.session.unsubscribe(subscriber);
                subscriber.subscribeToAudio(false);
            })
            this.socket.on('subscribe to manager', () => {
                console.log("will subscribe to manager");
                //var stream = this.subscriptions[this.subscriptions.length - 1].stream;
                var subscriber = this.subscriptions[this.subscriptions.length - 1].subscription;
                //this.state.session.subscribe(stream, 'video-container');
                subscriber.subscribeToAudio(true);
            })
        }
        if (this.props.userType === "Manager") {
            this.socket.on('customer hung up', () => {
                if (this.state.session !== undefined) {
                    this.leaveSessionVidu();
                }
                this.subscriptions = [];
            })
        }

        this.joinSession = this.joinSession.bind(this);
        this.leaveSessionVidu = this.leaveSessionVidu.bind(this);
        this.onbeforeunload = this.onbeforeunload.bind(this);
        this.becomeAvailableCustomer = this.becomeAvailableCustomer.bind(this);
        this.becomeAvailableAgent = this.becomeAvailableAgent.bind(this);
        this.createSession = this.createSession.bind(this);
        this.getToken = this.getToken.bind(this);
        this.removeUserVidu = this.removeUserVidu.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.removeCustomer = this.removeCustomer.bind(this);
        this.removeAgentFriendly = this.removeAgentFriendly.bind(this);
        this.removeAgentUnexpected = this.removeAgentUnexpected.bind(this);
        this.declineCall = this.declineCall.bind(this);
        this.toggleMute = this.toggleMute.bind(this);
        this.toggleWhisper = this.toggleWhisper.bind(this);
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.onbeforeunload);
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.onbeforeunload);
    }

    onbeforeunload(event) {
        event.preventDefault();
        if (this.props.userType === "Customer") {
            this.removeCustomer();
        } else {
            this.removeAgentUnexpected();
        }
        this.socket.close();
    }

    joinSession() {
        return new Promise((resolve, reject) => {
            // 1. Get an OpenVidu Object
            this.OV = new OpenVidu();

            // 2. Init a session
            this.setState(
                {
                    session: this.OV.initSession(),
                },
                () => {
                    var mySession = this.state.session;

                    // 3. Specify the actions wwhen events take plaec in the session
                    mySession.on('streamCreated', (event) => {
                        // Subscribe to new stream to receive it
                        // Subscribe to Stream to receive it. Will append HTML video to 'video-container' id
                        var subscriber = mySession.subscribe(event.stream, 'video-container');
                        var streamObject = {
                            subscription: subscriber,
                            stream: event.stream,
                        }
                        this.subscriptions.push(streamObject);
                    });

                    mySession.on('streamDestroyed', (event) => {
                        this.subscriptions.forEach((streamObject, index, array) => {
                            if (streamObject.stream === event.stream) {
                                array.splice(index, 1);
                            }
                        })
                        console.log(this.subscriptions.length);
                    });

                    // 4. Connect to the session with a valid user token
                    this.getToken().then((token) => {
                        this.setState({
                            token: token
                        })
                        mySession.connect(token)
                            .then(() => {
                                // 5. Get your own camera stream
                                this.publisher = this.OV.initPublisher('video-container', {
                                    audioSource: undefined,
                                    videoSource: false,
                                    publishAudio: true,
                                    publishVideo: false,
                                });

                                //6 publish your stream
                                mySession.publish(this.publisher);

                                resolve(token)
                            })
                            .catch((error) => {
                                console.log('There was an error connecting to the session:', error.code, error.message);
                            })
                    })
                });

        });
    }

    leaveSessionVidu() {
        //7 leave the session by calling 'disconnect' method over the Session object
        const mySession = this.state.session;

        if (mySession) {
            mySession.disconnect();
        }

        // Empty all properties...
        this.OV = null;
        this.removeUserVidu();
        this.setState({
            session: undefined,
            token: undefined

        })
    }

    handleNameChange(event) {
        this.setState({
            name: event.target.value
        })
    }

    declineCall() {
        this.setState({
            callState: undefined
        })
        this.socket.emit('call decline request', this.state.sessionObject.customerSocketId);
    }

    toggleMute() {
        this.publisher.publishAudio(this.state.isMute);
        this.setState({
            isMute: !this.state.isMute
        })
    }

    toggleWhisper() {
        var session = this.props.session;
        if (this.state.isWhisper === false) {
            this.socket.emit('whisper requested', session.customerSocketId);
        } else {
            this.socket.emit('cancel whisper requested', session.customerSocketId);
            console.log("will subscribe back");
        }
        this.setState({
            isWhisper: !this.state.isWhisper,
        })
    }

    renderCustomer() {
        if (this.state.session === undefined) {
            if (this.state.callState === "waiting") {
                return (
                    <div>
                        <p>Hi {this.state.name}, wait for Cutsomer Service to Pick Up Call.</p>
                        <Button.Danger onClick={this.removeCustomer}>Leave Call</Button.Danger>
                    </div>
                )
            } else if (this.state.callState === undefined) {
                return (
                    <div>
                        <Row>
                            <Input className="customer-form-name" type="text" placeholder="Your Name" onChange={this.handleNameChange} value={this.state.name} id="nameForm" />
                        </Row>
                        <Row>
                            <Button onClick={this.becomeAvailableCustomer}>
                                Call Customer Support
                            </Button>
                        </Row>
                    </div>
                )
            }
        } else if (this.state.callState === "activeCall") {
            return (
                <div>
                    <div id="video-container"></div>
                    <p>In Call with Agent: {this.state.agentName} </p>
                    <Visualizer color="#00bef0" className="sound-wave" />
                    <Button.Danger onClick={this.removeCustomer}>
                        End Call
                    </Button.Danger>
                </div>
            )
        }

    }

    renderCustomerService() {
        if (this.state.session === undefined) {
            if (this.state.callState === "waiting") {
                return (
                    <div>
                        <p> Hi {this.state.name}, there are No Customer Requests Yet... </p>
                        <Button.Danger onClick={this.removeAgentUnexpected}>
                            Go Offline
                        </Button.Danger>

                    </div>
                )
            } else if (this.state.callState === undefined) {
                var variants = {
                    hidden: {opacity: 0},
                    visible: { opacity: 1 }
                }
                return (
                    <motion.div initial="hidden" animate="visible" transition={{duration: 1}} variants={variants}>
                        <Row>
                            <Input type="text" placeholder="Your Name" onChange={this.handleNameChange} value={this.state.name} id="nameForm" />
                        </Row>
                        <Row>
                            <Button onClick={this.becomeAvailableAgent}>
                                Go Online
                            </Button>
                        </Row>
                    </motion.div>
                )
            } else if (this.state.callState === "incomingCall") {
                return (
                    <div>
                        <Row>
                            <p> Incoming Call From: {this.state.sessionObject.customer} </p>
                        </Row>
                        <Row>
                            <Col>
                                <Button onClick={this.createSession}>
                                    Pick Up Call
                                </Button>
                            </Col>
                            <Col>
                                <Button.Danger onClick={this.declineCall}>
                                    Decline Call
                                </Button.Danger>
                            </Col>
                        </Row>
                    </div >
                )
            }
        } else if (this.state.callState === "activeCall") {
            return (
                <div>
                    <div id="video-container" className="col-md-6"></div>
                    <p>In Call with Customer: {this.state.customerName} </p>
                    <Visualizer color="#00bef0" className="sound-wave" />
                    <Button.Danger onClick={this.removeAgentFriendly}>
                        End Call
                    </Button.Danger>
                </div>
            )
        }
    }

    renderManager() {
        var session = this.props.session;
        if (this.state.session === undefined) {
            return (
                <div>
                    <p>Session ID: {session.sessionId}</p>
                    <p>Customer Name: {session.customer}</p>
                    <p>Agent Name: {session.agent}</p>
                    <Button onClick={this.joinSession}>Join Call</Button>
                </div>
            )
        } else {
            var buttonText = this.state.isMute ? "Unmute" : "Mute"
            var visualizerClass = this.state.isMute ? "hidden" : "sound-wave"
            var whisperText = this.state.isWhisper ? "Disable Whisper" : "Enable Whisper"
            return (
                <div>
                    <div id="video-container" className="col-md-6"></div>
                    <p>In Call with Customer: {session.customer} </p>
                    <p>In Call with Agent: {session.agent} </p>
                    <Visualizer color="#00bef0" className={visualizerClass} />
                    <Button onClick={this.toggleMute}>
                        {buttonText}
                    </Button>
                    <Button.Danger onClick={this.leaveSessionVidu}>
                        Leave Call
                    </Button.Danger>
                    <Button.Secondary onClick={this.toggleWhisper}>
                        {whisperText}
                    </Button.Secondary>
                </div>
            )
        }
    }

    render() {
        if (this.props.userType === "Customer") {
            return (
                <div>
                    {this.renderCustomer()}
                </div>
            )
        } else if (this.props.userType === "CustomerService") {
            return (
                <div>
                    {this.renderCustomerService()}
                </div>
            )
        } else if (this.props.userType === "Manager") {
            return (
                <div>
                    {this.renderManager()}
                </div>
            )
        }
    }


    /**
     * CALLS TO OUR BACK-END SERVE
     */

    // Customer will call this function to call an agent 
    becomeAvailableCustomer() {
        this.setState({
            callState: "waiting"
        })
        var data = {
            customerName: this.state.name,
            customerSocketId: this.socket.id
        }
        axios.post("/api-sessions/become-available-customer", data);
    }

    // Customer service will become available
    becomeAvailableAgent() {
        this.setState({
            callState: "waiting"
        })
        var data = {
            agentName: this.state.name,
            agentSocketId: this.socket.id
        }
        axios.post("/api-sessions/become-available-agent", data);
    }

    // Customer service will call this function to answer an existing call
    async createSession() {
        this.setState({
            callState: "activeCall",
        })
        var data = {
            session: this.state.sessionObject
        }
        await this.joinSession();
        console.log("test");
        axios.post("/api-sessions/create-session", data)
    }

    getToken() {
        return new Promise((resolve, rejects) => {
            if (this.props.userType === "Manager") {
                var data = {
                    sessionName: this.props.session.sessionId
                }
            } else {
                var data = {
                    sessionName: this.state.sessionObject.sessionId
                }
            }
            axios.post("/api-sessions-vidu/get-token", data).then(res => {
                resolve(res.data.token);
            })
        })

    }

    removeCustomer() {
        if (this.state.session !== undefined) {
            this.leaveSessionVidu();
        }
        this.setState({
            callState: undefined,
        })
        this.subscriptions = [];
        var data = {
            agentSocketId: this.agentSocketId,
            session: this.state.sessionObject,
            customerName: this.state.name,
            customerSocketId: this.socket.id
        }
        axios.post("/api-sessions/remove-customer", data);

    }

    removeAgentFriendly() {
        if (this.state.session !== undefined) {
            this.leaveSessionVidu();
        }
        this.setState({
            callState: "waiting"
        })
        var data = {
            session: this.state.sessionObject
        }
        axios.post("/api-sessions/remove-agent-friendly", data);
    }

    removeAgentUnexpected() {
        if (this.state.session !== undefined) {
            this.leaveSessionVidu();
        }
        this.setState({
            callState: undefined
        })
        var data = {
            agentName: this.state.name,
            agentSocketId: this.socket.id
        }
        axios.post("/api-sessions/remove-agent-unexpected", data);
    }

    removeUserVidu() {
        if (this.props.userType === "Manager") {
            var data = {
                sessionName: this.props.session.sessionId,
                token: this.state.token,
            }
        } else {
            var data = {
                sessionName: this.state.sessionObject.sessionId,
                token: this.state.token,
            }
        }
        axios.post("/api-sessions-vidu/remove-user", data);
    }

}

export default CallBlock