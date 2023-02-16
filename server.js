import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({
    port: 8000
})

let clients = []
let rooms = []
wss.on('connection', (ws) => {
    ws.clientId = Math.floor(Math.random() * 1532)
    ws.roomname = "group"

    rooms.push({
        ws: ws,
        roomname: ws.roomname,
        id: ws.clientId
    })

    rooms.map((clients) => {
        console.log(clients.ws)
    })
    ws.send(JSON.stringify({
        roomname: ws.roomname,
        id: ws.clientId
    }));

    ws.on('message', (data) => {
        const { sender, receiver } = JSON.parse(data.toString());


        for (let client of rooms) {
            if (client.id == receiver) {
                client.ws.send(JSON.stringify({
                    msg: `Hello! My Client  : ${sender}`
                }));
                break;
            }
        }
    })
})