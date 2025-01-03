import { Circle } from './Circle.js';
import { Ball } from './Ball.js';

export class Player extends Circle {
  /** @param {PlayerConstructorData} data  */
  constructor(data) {
    const { id, actionStyle, name, ...restData } = data;
    super(data);
    this._id = id;
    this._name = name;
    this._controls = Array(5).fill(null).map(() => false);
    this._actionStyle = actionStyle || 'yellow';
  }

  move(deltaTime) {
    const deltaAcceleration = this._acceleration * deltaTime;
    if (this._controls[0]) {
      this._yVelocity -= deltaAcceleration;
    }
    if (this._controls[1]) {
      this._xVelocity += deltaAcceleration;
    }
    if (this._controls[2]) {
      this._yVelocity += deltaAcceleration;
    }
    if (this._controls[3]) {
      this._xVelocity -= deltaAcceleration;
    }
    super.move(deltaTime);
  }

/** @param {Circle} circle */
  resolveCircleCollision(circle){
    super.resolveCircleCollision(circle);
    if (this._controls[4] && circle instanceof Ball) {
     //make ball bounce off player
      const dx = this._x - circle.x;
      const dy = this._y - circle.y;
      const angle = Math.atan2(dy, dx);
      circle.xVelocity = -Math.cos(angle) * circle._acceleration * 2000;
      circle.yVelocity = -Math.sin(angle) * circle._acceleration * 2000;
      this._controls[4] = false;
    }
  }

  /** @param {Controls} arr  */
  set controls(arr) {
    this._controls = arr;
  }
  get controls() {
    return [...this._controls];
  }
  get id() {
    return this._id;
  }

  reset(data) {
    super.reset(data.x, data.y, data.fillStyle);
    this._actionStyle = data.actionStyle || this._actionStyle;
    this._controls = Array(5).map(() => false);
  }
  /** @returns {PlayerInitData} */
  initData() {
    return {
      id: this._id,
      name: this._name,
      controls: [...this._controls],
      actionStyle: this._actionStyle,
      ...super.initData()
    };
  }

  /** @returns {PlayerStateData} */
  stateData() {
    return {
      id: this._id,
      controls: [...this._controls],
      ...super.stateData()
    }
  }
}