const express = require('express');
var OpenVidu = require('openvidu-node-client').OpenVidu;
var OpenViduRole = require('openvidu-node-client').OpenViduRole
var Session = require('openvidu-node-client').Session;
var TokenOptions = require('openvidu-node-client').TokenOptions

class OpenViduRouter {
    constructor(OV) {
        this.router = express.Router();
        this.OV = OV;
        this.mapSessions = {};
        this.mapSessionNamesTokens = {};

        this.router.post("/get-token", this.getToken.bind(this));
        this.router.post("/remove-user", this.removeUserVidu.bind(this));
    }

    getToken(req, res) {
        var sessionName = req.body.sessionName;
        // Come in as publisher
        var role = OpenViduRole.PUBLISHER;
        var tokenOptions = {
            role: role,
        }


        if (this.mapSessions[sessionName]) {
            // Session already exists
            console.log('Existing session: ' + sessionName);

            // Get existing Session from the collection;
            var mySession = this.mapSessions[sessionName];

            // Generate a new token asynchronously with the recentry created tokenOptions
            mySession.generateToken(tokenOptions)
                .then(token => {

                    console.log("Token: " + token);

                    // Store the new token in the collection of tokens
                    this.mapSessionNamesTokens[sessionName].push(token);

                    // Return the token to the client
                    res.status(200).send({
                        token: token
                    });
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            console.log("New session: " + sessionName);
            // new session
            this.OV.createSession()
                .then(session => {
                    // Store the new Session in the collection of Sessions
                    this.mapSessions[sessionName] = session;
                    // Store a new empty array in the collection of tokens
                    this.mapSessionNamesTokens[sessionName] = [];

                    // Generate a new token asynchronously with the recentry created tokenOptions
                    session.generateToken(tokenOptions)
                        .then(token => {

                            console.log("Token: " + token);

                            // Store the new token in the collection of tokens
                            this.mapSessionNamesTokens[sessionName].push(token);

                            // Return the Tkoen to the client
                            res.status(200).send({
                                token: token
                            });
                        })
                        .catch(error => {
                            console.error(error);
                        });
                })
                .catch(error => {
                    console.error(error);
                })
        }

    }

    removeUserVidu(req, res) {
        var sessionName = req.body.sessionName;
        var token = req.body.token;
        console.log('Removing user | {sessionName, token}={' + sessionName + ', ' + token + '}');

        //I If session exists
        if (this.mapSessions[sessionName] && this.mapSessionNamesTokens[sessionName]) {
            var tokens = this.mapSessionNamesTokens[sessionName];
            var index = tokens.indexOf(token);

            // If the token exists
            if (index !== -1) {
                tokens.splice(index, 1);
                console.log(sessionName + "tokens remaining: " + tokens.toString());
            } else {
                var msg = 'Problems in the app server: the TOKEN wasn\'t valid';
                console.log(msg);
                res.status(500).send(msg);
            }
            if (tokens.length == 0) {
                console.log(sessionName + ' empty!');
                delete this.mapSessions[sessionName];
            }
            res.status(200).send();
        } else {
            var msg = "Problems in the app server: the SESSION does not exist";
            console.log(msg);
            res.status(500).send(msg);
        }
    }
}




module.exports = OpenViduRouter;