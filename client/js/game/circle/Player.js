import { Circle } from './Circle.js';
import { Ball } from './Ball.js';

export class Player extends Circle {
  /** @param {import('../../../types').PlayerInitData} data*/
  constructor(data) {
    const { id, controls, actionStyle, name, ...restData } = data;
    super(restData)
    this._id = id;
    this._name = name;
    this._controls = controls || Array(5).map(() => false);
    this._actionStyle = actionStyle || 'yellow';
  }
  /** @param {number} deltaTime  */
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
  resolveCircleCollision(circle) {
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

  /** @param {import('../../../types').PlayerStateData} data */
  updateData(data) {
    const { controls, ...restData } = data;
    super.updateData(restData);
    this._controls = data.controls;
  }

  /** @param {CanvasRenderingContext2D} ctx */
  draw(ctx) {
    super.draw(ctx);    
    if (this._controls[4]) {
      ctx.beginPath();
      ctx.arc(this._x, this._y, this._r - this._lineWidth / 2, 0, 2 * Math.PI);
      ctx.fillStyle = this._actionStyle
      ctx.fill();
    }
    ctx.fillText(this._name, this._x, this._y + this._r + 10);
  }

  /** @param {import('../../../types').Controls} arr  */
  set controls(arr) {
    this._controls = arr;
  }
  get controls() {
    return [...this._controls];
  }
  get id() {
    return this._id;
  }

}