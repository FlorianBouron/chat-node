let express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server);

// This line for the port is needed if the app is run on Heroku and other cloud providers:
let port = process.env.PORT || 8080;

let users = [],
    connections = [];

// Express
server.listen(port);
app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', (socket)=>{
    //Connect
    connections.push(socket);
    console.log(`Connected: ${connections.length} sockets connected`);

    //Disconnect
    socket.on('disconnect', ()=>{
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log(`Disconnected: ${connections.length} sockets connected`);
    });

    //Send Message
    socket.on('send message', (data)=>{
        io.sockets.emit('new message', {msg: data, user: socket.username});
    });

    //New User
    socket.on('new user',(data, callback)=>{
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    let updateUsernames = () =>{
        io.sockets.emit('get users', users);
    }

});