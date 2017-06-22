'use strict';

const net = require('net');
const server = net.createServer();
const Client = require('./model/client.js');

let clientPool = [];

server.on('connection', (socket) => {
  let client = new Client (socket);
  console.log(`user ${client.handle} has connected`);

  socket.write(`Welcome ${client.handle}!  Enjoy your stay here on WarezHarez`);
  clientPool.push(client);


  let disconnectHandler = () => {
    clientPool = clientPool.filter((user) => user.socket != client.socket);
    console.log(`${client.handle} has disconnected`);
  };

  let errorHandler = (err) => {
    console.log(`${client.handle} has caused an error`);
    console.error(err);
  };

  socket.on('error', errorHandler);
  socket.on('disconnect', disconnectHandler);

  socket.on('data', (buffer) => {
    let data = buffer.toString();

    if(data.startsWith('/nick')) {
      client.handle = data.split('/nick ')[1] || client.handle;
      client.handle = client.handle.trim();

      socket.write(`Congrats!  You're no longer a n00b`);
      return;
    }

    if(data.startsWith('/dm')) {
      let u = data.split('/dm ')[1];
      let pool = clientPool.filter(user => user.handle === u);
      pool.forEach((to) => {
        let message = data.split(' ').slice(2).join(' ');
        to.socket.write(`${client.handle}- ${message}`);
      });
      return;
    }

    if(data.startsWith('/troll')) {
      let ticker = data.split('/troll ')[1].slice(0,1);
      let spam = data.split(' ').slice(2).join(' ');

      for(let i = 0; i < ticker; i++) {
        clientPool.forEach((user) => {
          user.socket.write(`${client.handle}- ${spam}`);
        });
      }
      return;
    }

    if(data.startsWith('/quit')) {
      clientPool.forEach((user) => {
        user.socket.write(`${client.handle} terminated connection`);
      });
      client.socket.end();
      return;
    }

    clientPool.forEach((user) => {
      user.socket.write(`${client.handle}- ${data}`);
    });
  });
});

server.listen(3000, () => {
  console.log('Running 3000');
});
