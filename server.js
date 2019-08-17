var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3000);

app.get('/', (req, res) =>{
    res.sendFile( __dirname +'/chatroom.html')
});

// socket connection

io.sockets.on('connection', (socket) =>{

    connections.push(socket);
    console.log('Connected : %s sockets connected', connections.length)

    //Disconnected
        socket.on('disconnect', function(data){
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected : %s sockets connected', connections.length);
    });

    //send message
    socket.on('Send Message', (data)=>{
        console.log(data);
        io.sockets.emit('New Message', {msg: data, user: socket.username});
    });

    //new user
    socket.on('New User', (data, callback) =>{
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });
    function updateUsernames(){
        io.sockets.emit('Get User', users);
    }
});