// socket.io-client

const io = require('socket.io-client');
const socket = io('http://localhost:3000');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Connect to the server
socket.on('connect', () => {
    console.log('Connected to the server');
});

// Disconnected from the server
socket.on('disconnect', () => {
    console.log('Disconnected from the server');
});

// Listen for messages from the server
socket.on('message', (message) => {
    console.log(message);
});

// Listen for aquire from the server
socket.on('ping', (message) => {
    console.log("Server aquired with sucess.");
    socket.emit('pong', 'pong');
});

socket.on("status", (message) => {
    console.log(message);
});

socket.on("help", (message) => {
    console.log(message);
});

socket.on("error", (message) => {
    console.log(message);
});


// Interface for sending commands
rl.on('line', (input) => {
    socket.emit('servercommand', input);
});

// Close the connection when the user exits
rl.on('close', () => {
    socket.close();
    process.exit(0);
});