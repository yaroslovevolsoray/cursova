export class Circle {
  /** @param {import('../../../types').CircleInitData} data  */
  constructor(data) {
    this._x = data.x;
    this._y = data.y;
    this._prevX = data.x;
    this._prevY = data.y;
    this._serverX = data.x;
    this._serverY = data.y;
    this._xVelocity = data.xVelocity;
    this._yVelocity = data.yVelocity;
    this._r = data.r;
    this._acceleration = data.acceleration;
    this._friction = data.friction;
    this._lineWidth = data.lineWidth || 1;
    this._strokeStyle = data.strokeStyle || 'black';
    // purposly can be set to null to avoid drawing fill
    this._fillStyle = data.fillStyle;
  }
  /** @param {number} deltaTime  */
  move(deltaTime) {
    const deltaAcceleration = this._acceleration * deltaTime;
    const deltaFriction = this._friction * deltaTime;

    if (Math.abs(this._xVelocity) < deltaAcceleration) {
      this._xVelocity = 0;
    } else {
      this._xVelocity *= 1 - deltaFriction;
    }
    if (Math.abs(this._yVelocity) < deltaAcceleration) {
      this._yVelocity = 0;
    } else {
      this._yVelocity *= 1 - deltaFriction;
    }
    this._prevX = this._x;
    this._prevY = this._y;

    this._x += this._xVelocity * deltaTime;
    this._y += this._yVelocity * deltaTime;

    this._serverX += this._xVelocity * deltaTime;
    this._serverY += this._yVelocity * deltaTime;
  }
  // Eliminate jerks between server responses
  interpolate(deltaTime) {
    const distanceX = this._serverX - this._x;
    const distanceY = this._serverY - this._y;
    if (distanceX ** 2 + distanceY ** 2 > this._r * 100) {
      this._x = this._serverX;
      this._y = this._serverY;
      return;
    }
    this._x += distanceX * deltaTime / 100;
    this._y += distanceY * deltaTime / 100;
  }

  /** 
   * @param {import('../line/Wall.js').Wall} wall
   * @returns {{x: number, y: number, method: string}} closest point on the wall to the circle
   */
  checkWallCollision(wall) {
    //should be first check
    const intersection = wall.getLineIntersection(this._prevX, this._prevY, this._x, this._y);
    if (intersection) {
      return { x: intersection.x, y: intersection.y, method: 'intersection' };
    }

    const dx = wall.x1 - wall.x0;
    const dy = wall.y1 - wall.y0;
    const l2 = dx * dx + dy * dy;
    if (l2 === 0) {
      return null;
    }
    const t = Math.max(0, Math.min(1, ((this._x - wall.x0) * dx + (this._y - wall.y0) * dy) / l2));
    const projectionX = wall.x0 + t * dx;
    const projectionY = wall.y0 + t * dy;
    const distanceToWall = Math.sqrt((this._x - projectionX) ** 2 + (this._y - projectionY) ** 2);

    if (distanceToWall < this._r) {
      return { x: projectionX, y: projectionY, method: 'overlap' };
    }
    return null;
  }
  /** @param {import('../line/Wall.js').Wall} wall  */
  resolveWallCollision(wall, closestPoint) {
    if (closestPoint.method === 'intersection') {
      const perpendicular = wall.perpendicular();
      this._x = closestPoint.x + perpendicular.x * (this._r - 1);
      this._y = closestPoint.y + perpendicular.y * (this._r - 1);
    }

    const distance = Math.sqrt((this._x - closestPoint.x) ** 2 + (this._y - closestPoint.y) ** 2);
    const overlap = this._r - distance;

    const collisionNormal = {
      x: (this._x - closestPoint.x) / distance,
      y: (this._y - closestPoint.y) / distance,
    };
    this._x += overlap * collisionNormal.x;
    this._y += overlap * collisionNormal.y;
    const dotProduct = this._xVelocity * collisionNormal.x + this._yVelocity * collisionNormal.y;
    this._xVelocity -= 1.99 * dotProduct * collisionNormal.x;
    this._yVelocity -= 1.99 * dotProduct * collisionNormal.y;
  }

  /** @param {Circle} circle*/
  checkCircleCollision(circle) {
    return ((this._x - circle.x) ** 2 + (this._y - circle.y) ** 2) < ((this._r + circle.r) ** 2);
  }
  //dynamic collision methods response for circles
  /** @param {Circle} circle */
  resolveCircleCollision(circle) {
    let distance = Math.sqrt((this._x - circle.x) ** 2 + (this._y - circle.y) ** 2);
    if (distance === 0) {
      return;
    }
    const overlap = (this._r + circle.r) - distance;
    const collisionNormal = {
      x: (circle.x - this._x) / distance,
      y: (circle.y - this._y) / distance,
    };
    this._x -= overlap * collisionNormal.x;
    this._y -= overlap * collisionNormal.y;
    circle.x += overlap * collisionNormal.x;
    circle.y += overlap * collisionNormal.y;

    const relativeVelocity = {
      x: this._xVelocity - circle.xVelocity,
      y: this._yVelocity - circle.yVelocity,
    };
    const speed = relativeVelocity.x * collisionNormal.x + relativeVelocity.y * collisionNormal.y;
    if (speed < 0) {
      return;
    }
    const impulse = 2 * speed / (this._r + circle.r);
    this._xVelocity -= impulse * circle.r * collisionNormal.x;
    this._yVelocity -= impulse * circle.r * collisionNormal.y;
    circle.xVelocity += impulse * this._r * collisionNormal.x;
    circle.yVelocity += impulse * this._r * collisionNormal.y;
  }

  updateData(data) {
    this._serverX = data.x;
    this._serverY = data.y;
    this._xVelocity = data.xVelocity;
    this._yVelocity = data.yVelocity;
  }

  /** @param {CanvasRenderingContext2D} ctx */
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this._x, this._y, this._r - this._lineWidth / 2, 0, 2 * Math.PI);
    ctx.strokeStyle = this._strokeStyle;
    ctx.lineWidth = this._lineWidth;
    ctx.stroke();
    if (this._fillStyle) {
      ctx.fillStyle = this._fillStyle;
      ctx.fill();
    }    
  }

  set x(num) {
    this._x = num;
  }
  set y(num) {
    this._y = num;
  }
  set r(num) {
    this._r = num;
  }
  set xVelocity(num) {
    this._xVelocity = num;
  }
  set yVelocity(num) {
    this._yVelocity = num;
  }

  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  get r() {
    return this._r;
  }
  get xVelocity() {
    return this._xVelocity;
  }
  get yVelocity() {
    return this._yVelocity;
  }
  get acceleration() {
    return this._acceleration;
  }
  get friction() {
    return this._friction;
  }
}