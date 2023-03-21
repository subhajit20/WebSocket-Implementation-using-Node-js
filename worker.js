const { parentPort } = require("worker_threads");

let count = "";
for (let i = 0; i < 2000000; i++) {
    count = count + i;
}

parentPort.postMessage(count);