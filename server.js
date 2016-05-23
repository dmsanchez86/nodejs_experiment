var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var ejs = require('ejs');
var async = require('async');
var socketio = require('socket.io');
var express = require('express');
var fs = require('fs');
var app = express();

mongoose.connect('mongodb://localhost/seriestv', function(err, res){
  if(err) console.log('Error ' + err);
  else console.log('Conectado ');
});

app.use(express.static(path.resolve(__dirname, 'client')));
app.set('view engine','ejs');

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

// app.get('/chat', function(req, res){
//   res.render('chat', {title: "Chat Online"});
// });


// app.get('/test', function(req, res){
//   res.send('You are in the main test <a href="../">Main</a>');
// });

// incluyo el archivo de las rutas
require("./routes")(app);

var server = http.createServer(app);
// var io = socketio.listen(server);

// var messages = [];
// var sockets = [];

// io.on('connection', function (socket) {
//     messages.forEach(function (data) {
//       socket.emit('message', data);
//     });

//     sockets.push(socket);

//     socket.on('disconnect', function () {
//       sockets.splice(sockets.indexOf(socket), 1);
//       updateRoster();
//     });

//     socket.on('message', function (msg) {
//       var text = String(msg || '');

//       if (!text)
//         return;

//       socket.get('name', function (err, name) {
//         var data = {
//           name: name,
//           text: text
//         };

//         broadcast('message', data);
//         messages.push(data);
//       });
//     });

//     socket.on('identify', function (name) {
//       socket.set('name', String(name || 'Anonymous'), function (err) {
//         updateRoster();
//       });
//     });
//   });

// function updateRoster() {
//   async.map(
//     sockets,
//     function (socket, callback) {
//       socket.get('name', callback);
//     },
//     function (err, names) {
//       broadcast('roster', names);
//     }
//   );
// }

// function broadcast(event, data) {
//   sockets.forEach(function (socket) {
//     socket.emit(event, data);
//   });
// }

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
