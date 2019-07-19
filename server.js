/* Config Open Vidu*/
var OpenVidu = require('openvidu-node-client').OpenVidu;
var Session = require('openvidu-node-client').Session;
var TokenOptions = require('openvidu-node-client').TokenOptions

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

// Node imports
var express = require('express');
var fs = require('fs');
var session = require('express-session');
var https = require('https');
var bodyParser = require('body-parser');
var path = require("path");
var app = express();

// server config
app.use(session({
    saveUninitialized: true,
    resave: false,
    secret: 'MY_SECRET'
}));
app.use(express.static(__dirname + '../public'));
// app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../public/index.html"));
// });
app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));

// Listen (start app with node server.js)
var options = {
    key: fs.readFileSync('openvidukey.pem'),
    cert: fs.readFileSync('openviducert.pem')
}
var server = https.Server(options, app)

/* Config Socket.io while allowing server to listen to port 5000*/
const io = require('socket.io')(server);
server.listen(5000);
io.on('connection', (socket) => {
    console.log("connected: " + socket.id);
    socket.on('disconnect', () => {
        console.log("disconnected: " + socket.id);
    })
    socket.on('call decline request', (customerSocketId) => {
        io.to(`${customerSocketId}`).emit('call declined');
    })
    socket.on('whisper requested', (customerSocketId) => {
        io.to(`${customerSocketId}`).emit('unsubscribe from manager');
    })
    socket.on('cancel whisper requested', (customerSocketId) => {
        console.log("oh yea");
        io.to(`${customerSocketId}`).emit('subscribe to manager');
    })
})

//Do redis stuff
var redis = require('redis');
var redisClient = redis.createClient();
redisClient.on('connect', () => {
    console.log("Redis client connected");
})


var OPENVIDU_URL = "rtc.rand.bandwidth.com:4443"
var OPENVIDU_SECRET = "sudomakemeasandwich"
// var OPENVIDU_URL = "localhost:4443"
// var OPENVIDU_SECRET = "MY_SECRET"
var OV = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);

console.log("App listening on port 5000");

const APISessionsRouter = require("./routes/api/api-sessions");
const OVRouter = require("./routes/api/api-sessions-vidu");

let api_sessions = new APISessionsRouter(OV, redisClient, io);
let api_sessions_vidu = new OVRouter(OV);

app.use('/api-sessions', api_sessions.router);
app.use('/api-sessions-vidu', api_sessions_vidu.router);
