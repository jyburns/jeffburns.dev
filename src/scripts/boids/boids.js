import animationFactory from '../modules/animationFactory.js';
import { Vector, distance2D } from '../modules/quickMaths.js';

let img = new Image();
img.src = '../../assets/images/isoceles.png';

const minImgDimension = Math.min(img.height, img.width);

const defaultInitialParams = {
  speed: 3,
  neighborhoodRadius: 100,
  neighborhoodFOV: Math.PI,
  separationWeight: 6,
  alignmentWeight: 0.05,
  cohesionWeight: 1,
  pathVariability: Math.PI / 32
};

const defaultInitialState = {
  particles: [
    {
      x: 150,
      y: 150,
      heading: 0, //radians
      turnDirection: -1,  // -1 is clockwise, 1 is counterclockwise
    },
    {
      x: 100,
      y: 100,
      heading: -(1/8) * Math.PI,
      turnDirection: 1,
    },
    {
      x: 175,
      y: 200,
      heading: -(1/8) * Math.PI,
      turnDirection: -1,
    },
    {
      x: 50,
      y: 275,
      heading: -1/4,
      turnDirection: -1,
    },
    {
      x: 50,
      y: 210,
      heading: -(1/8) * Math.PI,
      turnDirection: -1,
    },
    {
      x: 175,
      y: 300,
      heading: -(1/4) * Math.PI,
      turnDirection: -1,
    }
  ]
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

    // calculate theta to neighbor
    candidateNeighbor.dTheta = Math.acos((p2.x - p1.x) / candidateNeighbor.distance);

    // if dTheta falls within the boid's FOV & radius it is neigbor
    if (Math.abs(p1.heading - candidateNeighbor.dTheta) < (nFOV / 2)) {
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
        return new Vector((1 / n.distance), (n.dTheta + Math.PI));
      });

      let neighborHeadingSum = neighbors.reduce((sum, n) => {
        return sum += n.particle.heading;
      }, 0);

      let netSeparationVector = Vector.sum(separationVectorsForParticle);
      let avgNeighborHeading = neighbors.length > 0 ? neighborHeadingSum / neighbors.length : undefined;
      let individualHeadingVector = _calculateIndividualHeadingForce(particle, anim.ticks, anim.params.pathVariability);
      let cohesionVector = _calculateCohesionForce(particle, neighbors);
      let componentVectors = [individualHeadingVector];

      netSeparationVector.scale(anim.params.separationWeight);
      individualHeadingVector.scale(anim.params.speed);

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