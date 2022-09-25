const express = require('express');
const app = express();
const server = app.listen(8000, () => {
    console.log("Server is running on port: 8000");
});
const socket = require('socket.io');
const io = socket(server);
const path = require('path');

const messages = [];
const users = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/index.html'))
});

io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);
    socket.on('message', (message) => {
        console.log('Oh, I\'ve got something from ' + socket.id);
        messages.push(message);
        socket.broadcast.emit('message', message);
    });
    socket.on('user', (user) => {
        users.push(user);
        socket.broadcast.emit('user', user);
    });
    socket.on('disconnect', () => {
        console.log('Oh, socket ' + socket.id + ' has left');
        const index = users.findIndex(user => user.id === socket.id);
        const userRemove = users[index];
        users.splice(index, 1);
        socket.broadcast.emit('userRemove', userRemove);
    });
});