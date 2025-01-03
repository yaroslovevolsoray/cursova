export class Line {
  /** @param {import('../../../types').LineInitData} data  */
  constructor(data) {
    this._x0 = data.x0;
    this._y0 = data.y0;
    this._x1 = data.x1;
    this._y1 = data.y1;
    this._color = data.color || 'black';
    this._lineWidth = data.lineWidth || 1;
  }
  normalize() {
    let length = Math.sqrt((this._x1 - this._x0) ** 2 + (this._y1 - this._y0) ** 2);
    return { x: (this._x1 - this._x0) / length, y: (this._y1 - this._y0) / length };
  }

  perpendicular() {
    const normalized = this.normalize();
    return { x: -normalized.y, y: normalized.x };
  }
  getLineIntersection(x0, y0, x1, y1) {
    const s1_x = x1 - x0;
    const s1_y = y1 - y0;
    const s2_x = this._x1 - this._x0;
    const s2_y = this._y1 - this._y0;
    const s = (-s1_y * (x0 - this._x0) + s1_x * (y0 - this._y0)) / (-s2_x * s1_y + s1_x * s2_y);
    const t = (s2_x * (y0 - this._y0) - s2_y * (x0 - this._x0)) / (-s2_x * s1_y + s1_x * s2_y);
    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
      return {
        x: x0 + (t * s1_x),
        y: y0 + (t * s1_y),
      };
    }
    return null;
  }
  /** @param {CanvasRenderingContext2D} ctx  */
  draw(ctx){
    ctx.beginPath();
    ctx.moveTo(this._x0, this._y0);
    ctx.lineTo(this._x1, this._y1);
    ctx.strokeStyle = this._color;
    ctx.lineWidth = this._lineWidth;
    ctx.stroke();
  }
  
  get x0() {
    return this._x0;
  }
  get y0() {
    return this._y0;
  }
  get x1() {
    return this._x1;
  }
  get y1() {
    return this._y1;
  }
}