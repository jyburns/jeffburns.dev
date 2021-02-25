class Vector {
  #magnitude = 0;
  #theta = 0;
  #dx = null;
  #dy = null;

  constructor(magnitude = 0, theta = 0) {
    this.#magnitude = magnitude,
    this.#theta = theta;
  }

  setMagnitude(magnitude) {
    this.#magnitude = magnitude;
    this.#dx = null;
    this.#dy = null;
  }

  setTheta(theta) {
    this.#theta = theta;
    this.#dx = null;
    this.#dy = null;
  }

  get magnitude() {
    return this.#magnitude;
  }

  get theta() {
    return this.#theta;
  }

  get dx() {
    if (this.#dx === null) {
      this.#dx = Math.cos(this.#theta) * this.#magnitude;
    }

    return this.#dx;
  }

  get dy() {
    if (this.#dy === null) {
      this.#dy = Math.sin(this.#theta) * this.#magnitude;
    }
    
    return this.#dy;
  }

  scale(multiplier) {
    this.#magnitude = this.#magnitude * multiplier;
  }

  static fromCoordinates = (x, y) => {
    let magnitude = magnitude2D(x, y);
    let theta = Math.acos(x / magnitude);

    return new Vector(magnitude, theta);
  };

  static mean = (vectorList) => {
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

  static sum = (vectorList) => {
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
};

const distance2D = (x1, y1, x2, y2) => {
  return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2);
};

const magnitude2D = (x, y) => {
  return Math.sqrt(x**2 + y**2);
};

export {
  Vector,

  distance2D,
  magnitude2D
};