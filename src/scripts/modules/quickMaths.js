class Vector {
  _magnitude = 0;
  _theta = 0;
  _dx = null;
  _dy = null;

  constructor(magnitude = 0, theta = 0) {
    this._magnitude = magnitude,
    this._theta = theta;
  }

  setMagnitude(magnitude) {
    this._magnitude = magnitude;
    this._dx = null;
    this._dy = null;
  }

  setTheta(theta) {
    this._theta = theta;
    this._dx = null;
    this._dy = null;
  }

  get magnitude() {
    return this._magnitude;
  }

  get theta() {
    return normalizeTheta(this._theta);
  }

  get dx() {
    if (this._dx === null) {
      this._dx = Math.cos(this._theta) * this._magnitude;
    }

    return this._dx;
  }

  get dy() {
    if (this._dy === null) {
      this._dy = Math.sin(this._theta) * this._magnitude;
    }
    
    return this._dy;
  }

  scale(multiplier) {
    this._magnitude = this._magnitude * multiplier;
  }
};

// faux static methods
Vector.fromCoordinates = (x, y) => {
  let magnitude = magnitude2D(x, y);
  let theta = Math.atan(y / x);

  if (x < 0) {
    theta += Math.PI;
  }

  return new Vector(magnitude, theta);
};

Vector.mean = (vectorList) => {
  if (vectorList.length === 0) {
    return new Vector(0, 0);
  }

  let xSum = 0;
  let ySum = 0;

  vectorList.forEach(v => {
    xSum += v.dx;
    ySum += v.dy;
  });

  let xAvg = xSum / vectorList.length;
  let yAvg = ySum / vectorList.length;

  return Vector.fromCoordinates(xAvg, yAvg);
};

Vector.sum = (vectorList) => {
  if (vectorList.length === 0) {
    return new Vector(0, 0);
  }

  let xSum = 0;
  let ySum = 0;

  vectorList.forEach(v => {
    xSum += v.dx;
    ySum += v.dy;
  });

  return Vector.fromCoordinates(xSum, ySum);
};

Vector.dotProduct = (v1, v2) => {
  return (v1.dx * v2.dx) + (v1.dy * v2.dy);
};

Vector.thetaBetween = (v1, v2) => {
  if (v1.magnitude * v2.magnitude === 0) {
    return 0;
  }

  let directionOfRotation = 1;
  if ((v1.theta - v2.theta > 0) && (Math.abs(v1.theta - v2.theta) < Math.PI)) {
    directionOfRotation = -1;
  }

  return Math.acos(Vector.dotProduct(v1, v2) / (v1.magnitude * v2.magnitude)) * directionOfRotation;
};
// end faux static methods

const distance2D = (x1, y1, x2, y2) => {
  return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2);
};

const magnitude2D = (x, y) => {
  return Math.sqrt(x**2 + y**2);
};

const normalizeTheta = (theta) => {
  if (theta < 0) {
    return normalizeTheta(theta + (Math.PI * 2));
  }

  if (theta > (2 * Math.PI)) {
    return normalizeTheta(theta - (Math.PI * 2));
  }

  return theta;
}

const radiansToDegrees = (radians) => {
  return radians * (180 / Math.PI);
};

export {
  Vector,

  distance2D,
  magnitude2D,
  radiansToDegrees
};