import animationFactory from '../modules/animationFactory.js';

const defaultInitialParams = {
  minTicks: 1,
  tickRange: 7,
  minSize: 2,
  sizeRange: 5
};

const defaultInitialState = {
  particles: [],
  nextParticleTick: 1
};

const snow = (canvasId, initialParams = defaultInitialParams, initialState = defaultInitialState) => {
  const anim = animationFactory.create();
  anim.setCanvasId(canvasId);
  anim.setInitialConditions(initialParams, initialState);

  anim.setCreate(() => {
    if (anim.state.nextParticleTick === anim.ticks) {
      let size = anim.params.minSize + (Math.random() * anim.params.sizeRange);

      let particle = {
        size: size,
        speed: size,
        x: Math.random() * anim.ctx.canvas.width,
        y: 0
      };

      anim.state.particles.push(particle);

      anim.state.nextParticleTick += Math.floor(anim.params.minTicks + (Math.random() * anim.params.tickRange));
    }
  });

  anim.setUpdate(() => {
    anim.state.particles.forEach(particle => {
      particle.y += particle.speed;
    });
  });

  anim.setDestroy(() => {
    anim.state.particles = anim.state.particles.filter(particle => {
      return particle.y < anim.ctx.canvas.height;
    });
  });

  anim.setDraw(() => {
    anim.ctx.clearRect(0, 0, anim.ctx.canvas.width, anim.ctx.canvas.height);
    anim.state.particles.forEach(particle => {
      anim.ctx.beginPath(); 
      anim.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI*2);
      anim.ctx.closePath(); 
      anim.ctx.fillStyle = "black";
      anim.ctx.fill(); 
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
  snow
}