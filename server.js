import { WebSocketServer } from "ws";
import express from "express";
const app = express();

const wss = new WebSocketServer({
    port: 8000,
});

let clients = [];
let rooms = [];

function getEvent(ws, event) {
    const clientEvent = JSON.parse(event);
    let point = clientEvent.status;
    console.log(clientEvent);
    if (clientEvent.event == "SHIPPED") {
        for (let i = point; i <= 100; i++) {
            setTimeout(() => {
                ws.send(i);
            }, 2000);
        }
    } else if (clientEvent.event == "DELIVERY") {
        let point = 500;
        for (let i = 1; i <= point; i++) {
            ws.send(i);
        }
    } else {
        GiveMessage();
    }
}
wss.on("connection", (ws, req) => {
    ws.id = Math.floor(Math.random() * 124);
    clients.push({
        ws: ws,
    });

    ws.on("message", (data) => {
        getEvent(ws, data);
    });

    ws.on("close", () => {
        clients.pop();
    });
});

function GiveMessage() {
    clients[0].ws.send(200);
}

app.get("/", (req, res) => {
    GiveMessage();
    res.json({
        msg: "Hello Brooooo",
    });
});

app.listen(3000, () => console.log("Server is listening..."));