import { Socket } from 'socket.io';
import { Game } from './Game.js';
import { v4 as uuidv4 } from 'uuid';

export class Room {
  /** @param {RoomConstructorData} param */
  constructor({ ioServer, roomName, playersLimit = 2, winningScore = 1, gameTimeLimit = 60000 }) {
    this._ioServer = ioServer;
    this._id = uuidv4();
    this._name = roomName;
    /** @type {Socket[]} */
    this._players = [];
    this._playersLimit = playersLimit;

    this._winningScore = winningScore;
    this._startTime = 0;
    this._gameTimeLimit = gameTimeLimit; //ms
    this._waiting = true;

    this._playersInactivityLimit = 15000 * 10; //ms
    this._playersActivity = new Map();

    /** @type {Game} */
    this._game = new Game();
    //createSpawnPoints should go before buildStadium
    this._game.createSpawnPoints(this._playersLimit);
    this._game.buildStadium();
    this._sendUpdateRate = 1000 / 20; 
    this._sendUpdateIntervalId = setInterval(() => {}, 0);
  }
  /** @param {import('socket.io').Socket} socket  */
  handlePlayerConnection(socket, name) {
    // should be placed before 'socket:disconnect' handler. Unnecessary to handle disconnection of not yet added player
    if (this._players.length >= this._playersLimit) {
      socket.emit('disconnect:reason', 'Room is already filled');
      socket.disconnect(true);
      return;
    }
    socket.on('disconnect', () => {
      this.handlePlayerDisconnection(socket);
    });

    socket.on('player:change-controls', (controls) => {
      const validatedControls = []
      for (let i = 0; i < 5; i++) {
        validatedControls.push(!!controls[i]);
      }
      this._game.updatePlayerControls(socket.id, validatedControls);
      this._playersActivity.set(socket, Date.now());
    })

    const newPlayer = this._game.addPlayer(socket.id, name);
    socket.join(this._id);
    this._players.push(socket);
    this._playersActivity.set(socket, Date.now());

    this._ioServer.to(this._id).emit('game:add-player', newPlayer);
    const timeLeft = this._waiting ? -1 : this._gameTimeLimit - (performance.now() - this._startTime);
    socket.emit('game:init', { ...this._game.initData, timeLeft });
  }
  /** @param {import('socket.io').Socket} socket  */
  handlePlayerDisconnection(socket) {
    const changedPlayer = this._game.removePlayer(socket.id);
    this._players = this._players.filter((player) => player.id !== socket.id);
    this._playersActivity.delete(socket);
    this._ioServer.to(this._id).emit('game:remove-player', { id: socket.id, changedPlayer });
  }

  startGame() {
    clearInterval(this._sendUpdateIntervalId);
    this._waiting = false;

    this._game.start();
    this._startTime = performance.now();
    let previousPlayersActivityCheck = this._startTime;

    this._sendUpdateIntervalId = setInterval(() => {
      const currentTime = performance.now();

      if (previousPlayersActivityCheck + 1000 < currentTime) {
        this.checkPlayersActivity();
        previousPlayersActivityCheck = currentTime - (currentTime - previousPlayersActivityCheck) % 1000;
      }

      const isTimeEnd = currentTime - this._startTime > this._gameTimeLimit;
      //winning condition 
      if (this._game.isGoal || isTimeEnd) {
        const data = this._game.resetRound();
        this._ioServer.to(this._id).emit('game:restart', data);
        if (Math.max(...this._game.score) >= this._winningScore || isTimeEnd) {
          this._game.stop();
          clearInterval(this._sendUpdateIntervalId);
          this.restartGame();
        }
      }

      this._ioServer.to(this._id).emit('game:update', this._game.gameState);
    }, this._sendUpdateRate);
  }
  restartGame() {
    this._waiting = true;
    const timeout = 6000;
    this._players.forEach((player) => {
      player.timeout(timeout).emit('game:continue', {
        dateNow: Date.now(),
        timeout
      }, (err) => {
        err && player.disconnect(true);
      });
    });
    setTimeout(() => {
      const data = this._game.restart();
      this._ioServer.to(this._id).emit('game:restart', { ...data, timeLeft: this._gameTimeLimit });
      this.startGame();
    }, timeout);
  }

  checkPlayersActivity() {
    const currentTime = Date.now();
    this._playersActivity.forEach((timestamp, socket) => {
      if (timestamp + this._playersInactivityLimit < currentTime) {
        socket.emit('disconnect:reason', 'Inactivity');
        socket.disconnect(true);
      }
    });
  }

  get id() {
    return this._id;
  }
  get players() {
    return this._players.length;
  }
  get playersLimit() {
    return this._playersLimit;
  }
  get name() {
    return this._name;
  }
}