import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

import { Room } from './game/Room.js';
 
const app = express();
const server = createServer(app); 
const ioServer = new Server(server);
const port = process.env.PORT || 3000

if(process.env.DEVELOPMENT) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  app.use(express.static(join(__dirname, '../client/dist')));
}

//return information about available rooms
app.get('/rooms', (req, res) => {
  const rooms = roomList.map((room) => {
    return {
      id: room.id,
      playerNumber: room.players,
      playerLimit: room.playersLimit,
      name: room.name,
    }
  })
  res.json(rooms);
})

const roomList = Array(5).fill(null).map((_, i) => {
  return new Room({ioServer, roomName: `room ${i + 1}`, playersLimit: 2 * (i + 1), winningScore: i + 1, gameTimeLimit: 60000 * (i + 1)});
})   
roomList.forEach((room) => {
  room.startGame();
});

//todo: make some auth
ioServer.use((socket, next) => {
  socket;
  next(); 
})

ioServer.on('connection', (socket) => {
  const {roomId, name} = socket.handshake.query;
  const roomToConnect = roomList.find((room) => room.id === roomId);
  if (!roomToConnect || typeof name !== 'string') {
    socket.disconnect(true);
    return;
  }
  roomToConnect.handlePlayerConnection(socket, name.slice(0, 10));
})

server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});