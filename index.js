
// --> DEPENDENCIES <--
const express = require('express');
const expressWs = require('express-ws');
const path = require('path');

// --> SERVER INITIALIZATION <--
const college = express()
const collegeWs = expressWs(college)

// --> LOAD ROUTERS <--
const chat = express.Router();

college.enable('trust proxy');
college.set('port', (process.env.PORT || 5000))
college.use(express.json())

// --> HANDLE ENDPOINTS <--
college.use('/', express.static(__dirname));
college.use('/', chat)

chat.get('/chat', express.static(path.join(__dirname, 'chat')))
chat.ws('/chat', (ws, res) => {
    // Handle new chat
    ws.onmessage = msg => {
        collegeWs.getWss().clients.forEach(client => {
            client.send(msg.data)
        })
    }
})

// --> NOTIFY STARTUP <--
college.listen(college.get('port'), () => {
    console.log('Node app is running at localhost:' + college.get('port'))
})