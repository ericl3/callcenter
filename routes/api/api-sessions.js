const express = require('express');
var OpenVidu = require('openvidu-node-client').OpenVidu;
var OpenViduRole = require('openvidu-node-client').OpenViduRole
var Session = require('openvidu-node-client').Session;
var TokenOptions = require('openvidu-node-client').TokenOptions
var crypto = require('crypto');



class APISessionsRouter {
    constructor(OV, redisClient, io) {
        this.router = express.Router();
        this.redis = redisClient;
        this.OV = OV;
        this.io = io;

        this.prepare_session = this.prepare_session.bind(this);
        this.add_active_call_manager = this.add_active_call_manager.bind(this);
        this.remove_active_call_manager = this.remove_active_call_manager.bind(this);

        this.router.get("/get-sessions", this.getSessions.bind(this));
        this.router.post("/become-available-customer", this.becomeAvailableCustomer.bind(this));
        this.router.post("/become-available-agent", this.becomeAvailableAgent.bind(this));
        this.router.post("/create-session", this.createSession.bind(this));
        this.router.post("/remove-customer", this.removeCustomer.bind(this));
        this.router.post("/remove-agent-friendly", this.removeAgentFriendly.bind(this));
        this.router.post("/remove-agent-unexpected", this.removeAgentUnexpected.bind(this));
    }


    getSessions(req, res) {
        //this.managerSocket = req.body.managerSocket;
        //console.log("socket id: " + this.managerSocket);
        this.redis.llen('active_calls', (err, reply) => {
            if (err) {
                console.log(err);
            }
            console.log("Active Calls Count: " + reply);
            if (reply > 0) {
                var length = reply;
                this.redis.lrange('active_calls', 0, length, (err, reply) => {
                    if (err) {
                        console.log(err);
                    }
                    var activeCalls = reply;
                    var activeCallsJson = [];
                    activeCalls.forEach(call => {
                        activeCallsJson.push(JSON.parse(call));
                    })
                    res.status(200).send({
                        activeCalls: activeCallsJson
                    });
                })
            } else {
                var activeCalls = [];
                res.status(200).send({
                    activeCalls: activeCalls
                })
            }
        })
    }

    // generate key for session id
    generate_key() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }


    // Place customers on queue or grab available agent
    becomeAvailableCustomer(req, res) {
        var customerName = req.body.customerName;
        var customerSocketId = req.body.customerSocketId;
        var customerData = {
            customerName: customerName,
            customerSocketId: customerSocketId,
        }
        this.redis.llen('available_agents', (err, reply) => {
            if (err) {
                console.log(err);
            }
            console.log("Available Agents Size: " + reply);
            if (reply === 0) {
                this.redis.rpush(['available_customers', JSON.stringify(customerData)], (err, reply) => {
                    if (err) {
                        console.log(err);
                    }
                    res.status(200).send(customerData);
                    console.log("Adding availabe customer: " + customerData.customerName)
                })
            } else {
                this.redis.lpop('available_agents', (err, reply) => {
                    if (err) {
                        console.log(err);
                    }
                    var agentData = JSON.parse(reply);
                    var session = this.prepare_session(customerData, agentData);
                    res.status(200).send(session);
                })
            }
        })

    }

    check_available_on_agent_add(res, agentData) {
        this.redis.llen('available_customers', (err, reply) => {
            if (err) {
                console.log(err);
            }
            console.log("Available Customers Size: " + reply);
            if (reply === 0) {
                this.redis.rpush(['available_agents', JSON.stringify(agentData)], (err, reply) => {
                    if (err) {
                        console.log(err);
                    }
                    res.status(200).send(agentData);
                    console.log("Adding available agent: " + agentData.agentName);
                })
            } else {
                this.redis.lpop('available_customers', (err, reply) => {
                    if (err) {
                        console.log(err);
                    }
                    var customerData = JSON.parse(reply);
                    var session = this.prepare_session(customerData, agentData);
                    res.status(200).send(session);
                })
            }
        })
    }

    // Place agents on queue or grab available customer
    becomeAvailableAgent(req, res) {
        var agentName = req.body.agentName;
        var agentSocketId = req.body.agentSocketId;
        var agentData = {
            agentName: agentName,
            agentSocketId: agentSocketId,
        }
        this.check_available_on_agent_add(res, agentData);
    }


    async prepare_session(customerData, agentData) {
        var session = {
            sessionId: this.generate_key(),
            customer: customerData.customerName,
            agent: agentData.agentName,
            customerSocketId: customerData.customerSocketId,
            agentSocketId: agentData.agentSocketId,
        }
        await this.io.to(`${session.agentSocketId}`).emit("incoming call", session);
        await this.io.to(`${session.customerSocketId}`).emit("take agent socket id", session.agentSocketId);
        console.log("PREPARING SESSION with agent " + session.agent);
        return session;
    }

    async createSession(req, res) {
        var session = req.body.session;
        await this.io.to(`${session.customerSocketId}`).emit("call accepted", session);
        this.add_active_call_manager(session);
        res.status(200).send(session);
    }

    async add_active_call_manager(session) {
        await this.redis.rpush('active_calls', JSON.stringify(session), (err, reply) => {
            if (err) {
                console.log(err);
            }
            console.log("========ADDING========");
            console.log("Session added to active call lists for manager to view");
            console.log(session);
            console.log("========ADDING========");
            // Signal to manager
            //this.io.to(`${this.managerSocket}`).emit("added active call");
        })
        await this.io.emit("added active call");
    }

    async remove_active_call_manager(session) {
        await this.redis.lrem('active_calls', 0, JSON.stringify(session), (err, reply) => {
            if (err) {
                console.log(err);
            }
            if (reply > 0) {
                console.log("========REMOVING========")
                console.log("Session removed from the active call list: ");
                console.log(session);
                console.log("========REMOVING========")
            }
            // Signal to manager
        })
        await this.io.emit("removed active call");
    }

    async removeCustomer(req, res) {
        var customerName = req.body.customerName;
        var customerSocketId = req.body.customerSocketId;
        var customerData = {
            customerName: customerName,
            customerSocketId: customerSocketId,
        }

        await this.io.to(`${req.body.agentSocketId}`).emit('customer hung up');
        if (req.body.session !== undefined) {
            this.remove_active_call_manager(req.body.session);
        }
        this.redis.lrem('available_customers', 0, JSON.stringify(customerData), (err, reply) => {
            if (err) {
                console.log(err)
            }
            if (reply > 0) {
                console.log("Removing customer from available list: " + customerData.customerName);
            }
            res.status(200).send(customerData);
        })
    }

    removeAgentFriendly(req, res) {
        var session = req.body.session;
        var agentName = session.agent;
        var agentSocketId = session.agentSocketId;
        var agentData = {
            agentName: agentName,
            agentSocketId: agentSocketId,
        }
        this.check_available_on_agent_add(res, agentData);

    }

    removeAgentUnexpected(req, res) {
        var agentName = req.body.agentName;
        var agentSocketId = req.body.agentSocketId;
        var agentData = {
            agentName: agentName,
            agentSocketId: agentSocketId,
        }
        this.redis.lrem('available_agents', 0, JSON.stringify(agentData), (err, reply) => {
            if (err) {
                console.log(err);
            }
            if (reply > 0) {
                console.log("Removing agent from available list: " + agentData.agentName);
            }
            res.status(200).send(agentData);
        })

    }
}

module.exports = APISessionsRouter;