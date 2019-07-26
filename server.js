# Call Center Demo
The call center demo demonstrates Bandwidth's growing WebRTC offerings. This demo is audio only and has no PSTN interconnect. All of the call are created as conferences, but there are only "customer", "customer service", and "manager" profiles.  

Using a React front end, calls can be placed between different browsers using the /customer page and the /customer-service page. The /manager page allows a "manager" to listen in on a call, barge in on a call, and enable whisper.

See below for more information on how to download, run, and install.

## Required Tools & Services
- [NodeJS](https://nodejs.org/en/download/)
- [NPM](https://www.npmjs.com/get-npm) (Installed with NodeJS)
- [Yarn](https://yarnpkg.com/lang/en/docs/cli/install/)
- [Redis](https://redis.io/topics/quickstart) (We recommend using the CLI tools)
- [Docker](https://docs.docker.com/install/)
- [ngrok](https://ngrok.com/download) (Not necessary, but it makes the demo much more usable)


## Requirements Before Starting
- This call center project uses Bandwidth's development OpenVidu Stack. You can also use your own OpenVidu server by navigating to
    - [Docker](https://hub.docker.com/r/openvidu/openvidu-server)
    - Secrets may be changed in the server.js folder within the root directory
- This project also requires redis. Follow the link below to install redis-server and redis-cli
    - [Redis](https://redis.io/topics/quickstart)
- OpenVidu and other WebRTC technology requires an https connection. Also, if you would like to expose this project to a local network for testing, you must use a technology like ngrok to expose your localhost and port to the internet.
    - [ngrok](https://ngrok.com/) to learn more about ngrok and to download ngrok tools
    - Note that since the react front-end is by default hosted on port 3000, you may run this command to create a tunnel: 
`ngrok http -subdomain=[YOUR SUBDOMAIN] --host-header=rewrite 3000`
    - You may then access the project at [YOUR SUBDOMAIN].ngrok.io
        
## Available Scripts

In the main project directory, you can run:

### Running the Development Server

#### `node server.js`
This starts the development server four the call center demo

### Running the React App
You can navigate to the client folder in a separate terminal and run:

#### `npm start`
This will start the standalone react app

### Running both backend development server and react app concurrently
In the root folder you can run: 

#### `yarn dev`
This will run both back-end and front-end concurrently in one terminal


## Please Read Before Starting (Something's not Working)
- If you are trying to establish an OpenVidu session and you cannot hear any audio or obtain a token, then you need to accept the certificate at https://[OpenViduUrl]:4443. At this page, there is most likely a warning saying that your connection is not secure. You need to click the understand warning section and proceed. This accepts the certificate and now you should be able to create a session. Restart your server and front-end, and flush redis. 
- When running many back to back sessions (starting and stopping the server), you may notice that an error is thrown when attempting to start the back-end (port 5000 is taken). 
    - In this scenario you must run
    `sudo lsof -i tcp:5000`
    - This will generate the process that your node.js server was running on, and then you need copy that PID and run
    `kill [PID]`
- Make sure that the package.json within the /client folder has the correct IP address for your machine. This IP address changes frequently, if you disconnect and reconnect from the local internet connection. Please check your ip address and update it accordingly (port 5000 or whatever you choose to have your port as)
- If you are running back to back sessions (starting and stopping the server) while not completely terminating or clearing your OpenVidu sessions, the Redis queues will not be cleared. It is best practice to keep a `redis-cli` session running in a terminal window, so that you can use command `flushall` every time you restart to ensure that your call queues have been cleareda
