import animationFactory from '../modules/animationFactory.js';
import { Vector, distance2D, radiansToDegrees } from '../modules/quickMaths.js';

let img = new Image();
img.src = '../../assets/images/isoceles.png';

const minImgDimension = Math.min(img.height, img.width);

const defaultInitialParams = {
  boidCount: 20,
  speed: 3,
  neighborhoodRadius: 150,
  neighborhoodFOV: (5/4) * Math.PI,
  separationWeight: 3,
  alignmentWeight: 0.05,
  cohesionWeight: 1,
  pathVariability: Math.PI / 32
};

const _generateBoids = (count) => {
  let boids = [];

  for(let i = 0; i < count; i++) {
    boids.push(_generateBoid());
  }

  return boids;
};

const _generateBoid = () => {
  return {
    x: Math.random() * 500,
    y: Math.random() * 500,
    heading: Math.random() * (2 * Math.PI),
    turnDirection: Math.random() > 0.5 ? 1 : -1
  }
};

const defaultInitialState = {
  particles: _generateBoids(defaultInitialParams.boidCount)
};

const _getNeighborsForParticle = (p1, particles, nR, nFOV) => {
  return particles.reduce((accumulator, p2) => {
    let candidateNeighbor = {
      isNeighbor: false,
      distance: 0,
      dTheta: 0,
      particle: p2
    };

    // you are not your own neighbor
    if (p1 === p2) {
      return accumulator;
    }

    candidateNeighbor.distance = distance2D(p1.x, p1.y, p2.x, p2.y);

    // can't be a neighbor if distance > neighborhoodRadius
    if (candidateNeighbor.distance > nR) {
      return accumulator;
    }

    // calculate vector to neighbor
    let vectorToNeighbor = Vector.fromCoordinates((p2.x - p1.x), (p2.y - p1.y));
    candidateNeighbor.dTheta = Vector.thetaBetween(new Vector(1, p1.heading), vectorToNeighbor);

    // if dTheta falls within the boid's FOV & radius it is neigbor
    if (Math.abs(candidateNeighbor.dTheta) <= (nFOV / 2)) {
      candidateNeighbor.isNeighbor = true;
      accumulator.push(candidateNeighbor);
    }

    return accumulator;
  }, []);
}

const _calculateIndividualHeadingForce = (particle, ticks, pathVariability) => {
  let individualHeadingVector = new Vector(1, particle.heading);

  if (ticks % 5 === 0) {
    // pick a new heading within the pathVariability threshold in front of the boid 
    let turn = Math.random() * pathVariability;

    // ~2/3 likelihood that the boid will continue turning in the same diretion
    let turnDirection = (Math.random() > 0.33) ? particle.turnDirection : (-1 * particle.turnDirection);
    individualHeadingVector.setTheta(individualHeadingVector.theta + (turn * turnDirection));
  }

  return individualHeadingVector;
};

const _calculateCohesionForce = (particle, neighbors) => {
  if (neighbors.length === 0) {
    return undefined;
  }

  let xSum = particle.x;
  let ySum = particle.y;

  neighbors.forEach(n => {
    xSum += n.particle.x;
    ySum += n.particle.y;
  });

  let xAvg = xSum / (neighbors.length + 1);
  let yAvg = ySum / (neighbors.length + 1);

  return Vector.fromCoordinates(xAvg - particle.x, yAvg - particle.y);
};

const _calculateWeightedHeading = (heading, avgNeighborHeading, alignmentWeight) => {
  if (avgNeighborHeading === undefined) {
    return heading;
  }

  return (heading + (avgNeighborHeading * alignmentWeight)) / (alignmentWeight + 1);
};

const boids = (canvasId, initialParams = defaultInitialParams, initialState = defaultInitialState) => {
  const anim = animationFactory.create();
  anim.setCanvasId(canvasId);
  anim.setInitialConditions(initialParams, initialState);

  anim.setUpdate(() => {
    anim.state.particles.forEach(particle => {
      let neighbors = _getNeighborsForParticle(particle, anim.state.particles, anim.params.neighborhoodRadius, anim.params.neighborhoodFOV);
      
      let separationVectorsForParticle = neighbors.map(n => {
        // vector from neightbor to particle
        let separationVector = Vector.fromCoordinates(particle.x - n.particle.x, particle.y - n.particle.y);
        // scale to 1/distance
        separationVector.scale(1 / (separationVector.magnitude * n.distance));

        return separationVector
      });

      let neighborHeadingSum = neighbors.reduce((sum, n) => {
        return sum += n.particle.heading;
      }, 0);

      let netSeparationVector = Vector.sum(separationVectorsForParticle);
      let avgNeighborHeading = neighbors.length > 0 ? neighborHeadingSum / neighbors.length : undefined;
      let individualHeadingVector = _calculateIndividualHeadingForce(particle, anim.ticks, anim.params.pathVariability);
      let cohesionVector = _calculateCohesionForce(particle, neighbors);

      netSeparationVector.scale(anim.params.separationWeight);
      individualHeadingVector.scale(anim.params.speed);

      let componentVectors = [individualHeadingVector];

      if (neighbors.length > 0) {
        cohesionVector.scale(anim.params.cohesionWeight / anim.params.neighborhoodRadius);

        componentVectors.push(netSeparationVector);
        componentVectors.push(cohesionVector);
      }

      let sumOfForces = Vector.sum(componentVectors);
      let weightedHeading = _calculateWeightedHeading(sumOfForces.theta, avgNeighborHeading, anim.params.alignmentWeight);

      particle.heading = weightedHeading;
      
      let boundedX = (particle.x + sumOfForces.dx) % (anim.canvas.width + minImgDimension);
      let boundedY = (particle.y + sumOfForces.dy) % (anim.canvas.height + minImgDimension);
  
      particle.x = boundedX < (0 - minImgDimension) ? anim.canvas.width : boundedX;
      particle.y = boundedY < (0 - minImgDimension) ? anim.canvas.height : boundedY;
    });
  });

  anim.setDraw(() => {
    anim.ctx.clearRect(0, 0, anim.ctx.canvas.width, anim.ctx.canvas.height);

    anim.state.particles.forEach(particle => {
      anim.ctx.save();
      anim.ctx.translate(particle.x, particle.y);

      // image is rotated additional 90 degrees clockwise to face heading
      anim.ctx.rotate(particle.heading + (Math.PI / 2));
      anim.ctx.translate(-particle.x, -particle.y);
      anim.ctx.drawImage(img, particle.x - (img.width / 2), particle.y - (img.height / 2));
      anim.ctx.restore();
    });
  });

  document.getElementById(`${canvasId}_start`).onclick = (e) => {
    anim.start();
  };
  document.getElementById(`${canvasId}_pause`).onclick = (e) => {
    anim.pause();
  };
  document.getElementById(`${canvasId}_reset`).onclick = (e) => {
    anim.reset();
  };
  document.getElementById(`${canvasId}_step`).onclick = (e) => {
    anim.step();
  };

  return anim;
};

export {
  boids
}