import animationFactory from '../modules/animationFactory.js';

const defaultParams = {
  rectangleWidth: 200,
  rectangleHeight: 100,
  slideSpeed: 5,
  fillStyle: "red"
};

const defaultState = {
  x: 0,
  direction: 1
};

const slidingRectangle = (canvasId, initialParams = defaultParams, initialState = defaultState) => {
  const anim = animationFactory.create();
  anim.setCanvasId(canvasId);
  anim.setInitialConditions(initialParams, initialState);

  anim.setUpdate(() => {
    if (anim.state.x <= 0) {
      anim.state.direction = 1;
    }

    if ((anim.state.x + anim.params.rectangleWidth) >= anim.ctx.canvas.width) {
      anim.state.direction = -1;
    }

    anim.state.x = (anim.state.x + (anim.params.slideSpeed * anim.state.direction));
  });

  anim.setDraw(() => {
    anim.ctx.clearRect(0, 0, anim.ctx.canvas.width, anim.ctx.canvas.height);
    anim.ctx.fillStyle = anim.params.fillStyle;
    anim.ctx.fillRect(anim.state.x, anim.params.rectangleHeight, anim.params.rectangleWidth, anim.params.rectangleHeight);
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
  slidingRectangle
}