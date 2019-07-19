### Users
- Customers (many, non-unique)
- Agents (many, unique)

### Sessions
- Customers and Agents "belong" to a session. Each session will have one customer, and one agent. Will also need to know the socketID for both the agent and the customer
{
    session:
        {
            sessionId: [alphanumeric value randomly generated on customer call],
            customer: "{Customer Name}",
            agent: "{Agent Name}",
            customerSocketId: `${SocketID}`,
            agentSocketId: `${SocketID}`,
        } 
}

### Data Structures
- Waiting list/queue for customers. Customers will be added (RPUSH) to customer waiting queue when they want to contact customer support (Call Customer Support button). SocketID will be attached as well, and so will session ID. These are sessions
- Available Agent list/queue for agents. Agents online will be on the available list of agents (as soon as they enter their unique name). When they pick up calls or leave the browser, they will be taken off this list. When they return from a call, they will be added back to the available list (as lonog as they don't exit the browser)
- Active call list for active sessions. When an agent picks up a call, they will add to the existing json object, stringfy it, and add it to the active sessions list. They will also remove themselves from the available agent list. When they end the call, they will be added back to the available list (don't exit browser)
- (On exit from browser by either customer or agent, the customer will be removed completey from all lists/scope. Agents will be placed into the available list if they are still online. Otherwise, they will be removed from all lists (close from browser))

### Dynamic Notification
- Will use Socket.IO for real time communication.
- When customer starts call -> call REST API, send to proper socket id 
