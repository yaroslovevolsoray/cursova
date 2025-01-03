import { Circle } from './circle/Circle.js';
import { Player } from './circle/Player.js';
import { Ball } from './circle/Ball.js';
import { Line } from './line/Line.js';
import { Wall } from './line/Wall.js';
const PLAYER_RADIUS = 20;
const BALL_RADIUS = 10;
const LEFT_TEAM_COLOR = '#eb8b78';
const RIGHT_TEAM_COLOR = '#7891eb';
const LEFT_TEAM_ACTION_COLOR = 'red';
const RIGHT_TEAM_ACTION_COLOR = 'blue';
const STADIUM_COLOR = '#e4f5e4';
const BALL_COLOR = '#c44bd6';

export class Game {
  constructor() {
    this._width = 990;
    this._height = this._width * 0.5;
    this._isGoal = false;
    this._score = [0, 0];
    /** @type {Player[]} */
    this._players = [];
    /** @type {Player[]} */
    this._leftTeam = [];
    /** @type {Player[]} */
    this._rightTeam = [];
    /** @type {Ball} */
    this._ball = new Ball({
      x: this._width / 2,
      y: this._height / 2,
      r: BALL_RADIUS,
      fillStyle: BALL_COLOR
    })
    this._stadium = {
      /** @type {Wall[]} */
      walls: [],
      /** @type {Line[]} */
      lines: [],
      /** @type {Circle[]} */
      circles: []
    }
    this._leftSpawnPoints = [];
    this._rightSpawnPoints = [];
    this._gameLoopTimeoutId;
    this._tickRate = 1000 / 60;
  }
  /** 
   * @param {String} playerId 
   * @returns {PlayerInitData}
   * */
  addPlayer(playerId, name) {
    let x, y, fillStyle, actionStyle;
    //first player is always in left team
    if (this._leftTeam.length > this._rightTeam.length) {
      fillStyle = RIGHT_TEAM_COLOR;
      actionStyle = RIGHT_TEAM_ACTION_COLOR;
      [x, y] = this._rightSpawnPoints[this._rightTeam.length];
    } else {
      fillStyle = LEFT_TEAM_COLOR;
      actionStyle = LEFT_TEAM_ACTION_COLOR;
      [x, y] = this._leftSpawnPoints[this._leftTeam.length];
    }

    const newPlayer = new Player({
      id: playerId,
      name,
      x,
      y,
      r: PLAYER_RADIUS,
      lineWidth: Math.round(PLAYER_RADIUS / 10),
      fillStyle,
      actionStyle,
    });

    if (this._leftTeam.length > this._rightTeam.length) {
      this._rightTeam.push(newPlayer);
    } else {
      this._leftTeam.push(newPlayer);
    }

    this._players.push(newPlayer);
    return newPlayer.initData();
  }
  /** 
   * @param {String} playerId
   * @returns {PlayerInitData}changed player
   */
  removePlayer(playerId) {
    /** @type {Player | null} */
    let reorderedPlayer = null;
    let x, y, fillStyle, actionStyle;

    //remove player from team
    for (let i = 0; i < this._players.length / 2; i++) {
      if (this._leftTeam[i]?.id === playerId) {
        this._leftTeam.splice(i, 1);
        break;
      } else if (this._rightTeam[i]?.id === playerId) {
        this._rightTeam.splice(i, 1);
        break;
      }
    }

    //reorder teams 
    //think about changing radius of team to be proportional to the opposite radius team
    if (this._leftTeam.length - 1 > this._rightTeam.length) {
      reorderedPlayer = this._leftTeam.pop();
      this._rightTeam.push(reorderedPlayer);
      [x, y] = this._rightSpawnPoints[this._rightTeam.length - 1];
      fillStyle = RIGHT_TEAM_COLOR;
      actionStyle = RIGHT_TEAM_ACTION_COLOR;
    } else if (this._leftTeam.length < this._rightTeam.length - 1) {
      reorderedPlayer = this._rightTeam.pop();
      this._leftTeam.push(reorderedPlayer);
      [x, y] = this._leftSpawnPoints[this._leftTeam.length - 1];
      fillStyle = LEFT_TEAM_COLOR;
      actionStyle = LEFT_TEAM_ACTION_COLOR;
    }

    this._players = this._players.filter((player) => {
      return player.id !== playerId;
    });

    if (reorderedPlayer) {
      reorderedPlayer.reset({ x, y, fillStyle, actionStyle });
      return reorderedPlayer.initData();
    }
    return null;
  }

  updatePlayerControls(playerId, controls) {
    this._players.find((player) => player._id === playerId).controls = controls;
  }

  start() {
    clearTimeout(this._gameLoopTimeoutId);
    // possible questions???
    let previousTime = performance.now();
    let remainder = 0;

    const gameLoop = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - previousTime;
      // |____1000____|15|____2000____|30|
      if (deltaTime + remainder > this._tickRate) {
        previousTime = currentTime;
        remainder = (deltaTime + remainder) % this._tickRate;
        //game update
        this.updateGameState(this._tickRate);
      }
      this._gameLoopTimeoutId = setTimeout(gameLoop, 0);
    };
    gameLoop();
  }

  stop() {
    clearTimeout(this._gameLoopTimeoutId);
  }

  /** @returns {GameRestartData} */
  resetRound() {
    this._ball.reset(this._width / 2, this._height / 2);
    this._isGoal = false;

    //remove player from team
    for (let i = 0; i < this._leftTeam.length; i++) {
      let [x, y] = this._leftSpawnPoints[i];
      this._leftTeam[i].reset({ x, y });
    }
    for (let i = 0; i < this._rightTeam.length; i++) {
      let [x, y] = this._rightSpawnPoints[i];
      this._rightTeam[i].reset({ x, y });
    }

    return {
      score: this._score,
      ball: this._ball.initData(),
      players: this._players.map((player) => player.initData()),
    }
  }

  /** @returns {GameRestartData} */
  restart() { //////////////////////change 
    this._isGoal = false;
    this._score = [0, 0];
    this._ball.reset(this._width / 2, this._height / 2);
    // restart players position

    this._leftTeam = [];
    this._rightTeam = [];
    const randomOffset = Math.floor(Math.random() * this._players.length);
    for (let i = 0; i < this._players.length; i++) {
      const newI = (i + randomOffset) % this._players.length;
      let x, y, fillStyle, actionStyle;
      if (newI % 2 === 1) {
        fillStyle = RIGHT_TEAM_COLOR;
        actionStyle = RIGHT_TEAM_ACTION_COLOR;
        [x, y] = this._rightSpawnPoints[Math.floor(newI / 2)];
        this._rightTeam.push(this._players[i]);
      } else {
        fillStyle = LEFT_TEAM_COLOR;
        actionStyle = LEFT_TEAM_ACTION_COLOR;
        [x, y] = this._leftSpawnPoints[Math.floor(newI / 2)];
        this._leftTeam.push(this._players[i]);
      }
      this._players[i].reset({ x, y, fillStyle, actionStyle });
    }
    return {
      score: this._score,
      ball: this._ball.initData(),
      players: this._players.map((player) => player.initData()),
    }
  }

  /** @param {number} deltaTime  */
  updateGameState(deltaTime) {
    this._players.forEach((player) => {
      player.move(deltaTime);
    })
    this._ball.move(deltaTime);


    //collision with walls (possible optimization when placing walls one after the other. if there is collision check also adjacent  wall)
    for (let wall of this._stadium.walls) {
      this._players.forEach((player) => {
        const pwClosestPoint = player.checkWallCollision(wall);
        pwClosestPoint && player.resolveWallCollision(wall, pwClosestPoint);
      })
      if (wall.type === 'goal-line') {
        continue;
      }
      const bwClosestPoint = this._ball.checkWallCollision(wall);
      bwClosestPoint && this._ball.resolveWallCollision(wall, bwClosestPoint);
    }


    //collision player-player
    for (let currentPlayer = 0; currentPlayer < this._players.length - 1; currentPlayer++) {
      for (let nextPlayer = currentPlayer + 1; nextPlayer < this._players.length; nextPlayer++) {
        if (this._players[currentPlayer].checkCircleCollision(this._players[nextPlayer])) {
          this._players[currentPlayer].resolveCircleCollision(this._players[nextPlayer]);
        }
      }
    }

    //players-ball collision
    this._players.forEach((player) => {
      if (player.checkCircleCollision(this._ball)) {
        player.resolveCircleCollision(this._ball);
      }
    })

    !this._isGoal && this.checkGoal();
  }

  checkGoal() {
    if (this._ball.x <= 0 - this._ball.r) {
      this._score[1]++;
      this._isGoal = true;
    } else if (this._ball.x >= this._width + this._ball.r) {
      this._score[0]++;
      this._isGoal = true;
    }
    return false;
  }

  createSpawnPoints(playersLimit) {
    if (!playersLimit || playersLimit % 2 === 1) {
      throw new Error(`Inappropriate players limit: ${playersLimit}`)
    }
    const r = this._height / 4;
    const leftCentre = {
      x: this._width / 4,
      y: this._height / 2,
    }
    const rightCentre = {
      x: 3 * this._width / 4,
      y: this._height / 2,
    }
    for (let i = 0; i <= (playersLimit / 2) - 1; i++) {
      const x = (Math.cos(i / (playersLimit / 2) * 2 * Math.PI) * r) + leftCentre.x;
      const y = (Math.sin(i / (playersLimit / 2) * 2 * Math.PI) * r) + leftCentre.y;
      this._leftSpawnPoints.push([x, y]);
    }
    for (let i = 0; i <= (playersLimit / 2) - 1; i++) {
      const x = (Math.cos(i / (playersLimit / 2) * 2 * Math.PI + Math.PI) * r) + rightCentre.x;
      const y = (Math.sin(i / (playersLimit / 2) * 2 * Math.PI + Math.PI) * r) + rightCentre.y;
      this._rightSpawnPoints.push([x, y]);
    }
  }

  buildStadium() {
    const goalLineSize = Math.min(BALL_RADIUS * 10, this._height);
    const goalLineY0 = this._height / 2 - goalLineSize / 2;
    const goalLineY1 = goalLineY0 + goalLineSize;
    const lineWidth = Math.round(BALL_RADIUS / 10);

    //rectangle
    this._stadium.walls.push(new Wall({
      x0: 0,
      y0: goalLineY0,
      x1: 0,
      y1: 0,
      lineWidth,
    }), new Wall({
      x0: 0,
      y0: 0,
      x1: this._width,
      y1: 0,
      lineWidth,
    }), new Wall({
      x0: this._width,
      y0: 0,
      x1: this._width,
      y1: goalLineY0,
      lineWidth,
    }), new Wall({
      x0: this._width,
      y0: goalLineY0,
      x1: this._width,
      y1: goalLineY1,
      type: 'goal-line',
      color: 'blue',
      lineWidth: lineWidth * 2,
    }), new Wall({
      x0: this._width,
      y0: goalLineY1,
      x1: this._width,
      y1: this._height,
      lineWidth,
    }), new Wall({
      x0: this._width,
      y0: this._height,
      x1: 0,
      y1: this._height,
      lineWidth,
    }), new Wall({
      x0: 0,
      y0: this._height,
      x1: 0,
      y1: goalLineY1,
      lineWidth,
    }), new Wall({
      x0: 0,
      y0: goalLineY1,
      x1: 0,
      y1: goalLineY0,
      type: 'goal-line',
      color: 'red',
      lineWidth: lineWidth * 2,
    }),
    );

    //corners
    this._stadium.walls.push(new Wall({
      x0: 0,
      y0: PLAYER_RADIUS * 2,
      x1: PLAYER_RADIUS * 2,
      y1: 0,
      lineWidth
    }), new Wall({
      x0: this._width - PLAYER_RADIUS * 2,
      y0: 0,
      x1: this._width,
      y1: PLAYER_RADIUS * 2,
      lineWidth
    }), new Wall({
      x0: this._width,
      y0: this._height - PLAYER_RADIUS * 2,
      x1: this._width - PLAYER_RADIUS * 2,
      y1: this._height,
      lineWidth,
    }), new Wall({
      x0: PLAYER_RADIUS * 2,
      y0: this._height,
      x1: 0,
      y1: this._height - PLAYER_RADIUS * 2,
      lineWidth,
    })
    );

    //centre line
    this._stadium.lines.push(new Line({
      x0: this._width / 2,
      y0: 0,
      x1: this._width / 2,
      y1: this._height,
      lineWidth,
    }))

    //centre circle and side circles
    this._stadium.circles.push(new Circle({
      x: this._width / 2,
      y: this._height / 2,
      r: goalLineSize / 2,
      lineWidth,
    }), new Circle({
      x: 0,
      y: this._height / 2,
      r: goalLineSize / 2,
      lineWidth,
    }), new Circle({
      x: this._width,
      y: this._height / 2,
      r: goalLineSize / 2,
      lineWidth,
    }));

    this._leftSpawnPoints.forEach((point) => {
      this._stadium.circles.push(new Circle({
        x: point[0],
        y: point[1],
        r: BALL_RADIUS / 2,
        lineWidth,
        fillStyle: 'red'
      }), new Circle({
        x: point[0],
        y: point[1],
        r: BALL_RADIUS,
        lineWidth,
        strokeStyle: 'red'
      }))
    });

    this._rightSpawnPoints.forEach((point) => {
      this._stadium.circles.push(new Circle({
        x: point[0],
        y: point[1],
        r: BALL_RADIUS / 2,
        lineWidth,
        fillStyle: 'blue'
      }), new Circle({
        x: point[0],
        y: point[1],
        r: BALL_RADIUS,
        lineWidth,
        strokeStyle: 'blue'
      }))
    })
  }

  get score() {
    return [this._score[0], this._score[1]]
  }
  /** @returns {GameInitData} */
  get initData() {
    return {
      players: this._players.map((player) => player.initData()),
      ball: this._ball.initData(),
      stadium: {
        width: this._width,
        height: this._height,
        color: STADIUM_COLOR,
        walls: this._stadium.walls.map((wall) => wall.initData()),
        lines: this._stadium.lines.map((line) => line.initData()),
        circles: this._stadium.circles.map((circle) => circle.initData())
      },
      score: this.score
    }
  }

  get gameState() {
    return {
      players: this._players.map((player) => player.stateData()),
      ball: this._ball.stateData(),
    }
  }

  get isGoal() {
    return this._isGoal;
  }
}