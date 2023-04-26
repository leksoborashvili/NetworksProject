const express = require('express');
const app = express();
const PORT = 4000;

const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());
let users = [];

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

socketIO.on('connection', (socket) => {
    console.log(`${socket.id} user just connected!`);
    
    socket.on('message', (data) => {
        socketIO.emit('messageResponse', data);
        console.log(data);
    });
    socket.on('newUser', (data) => {
        users.push(data);

        socketIO.emit('newUserResponse', users);
    });

    socket.on('disconnect', () => {
        console.log(`A user disconnected`);

        users = users.filter((user) => user.socketID !== socket.id);

        socket.emit('newUserResponse', users);
        socket.disconnect();
    });
})

app.get('/api', (req, res) => {
    res.json({
        message: 'Hello world',
    });
});

http.listen(PORT, () => {
    console.log(`Sever listening on ${PORT}`);
});

// app.listen(PORT, () => {
//     console.log(`Server listening on ${PORT}`);
// })
