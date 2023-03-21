const { WebSocketServer } = require("ws");
const express = require("express");
const { Worker } = require("worker_threads");
const path = require("path");
const app = express();

const wss = new WebSocketServer({
    port: 8000,
});

let clients = [];
let rooms = [];

function callEvents(ws, event) {
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
        callEvents(ws, data);
    });

    ws.on("close", () => {
        clients.pop();
    });
});

function GiveMessage() {
    const data = new Worker("./worker.js");
    if (clients.length > 0) {
        data.on("message", (chunk) => {
            clients[0].ws.send(
                JSON.stringify({
                    msg: chunk.toString(),
                })
            );
        });
    }
}

app.get("/", (req, res) => {
    GiveMessage();
    res.json({
        msg: "Hello Brooooo",
    });
});

console.log(__dirname);

app.get("/home", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/heavy", (req, res) => {
    const data = new Worker("./worker.js");
    data.on("message", (chunk) => {
        console.log(chunk.toString());
        res.status(200).json({
            msg: chunk.toString(),
        });
    });
});

app.listen(3000, () => console.log("Server is listening..."));