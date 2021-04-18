import animationFactory from '../modules/animationFactory.js';

let img = new Image();
img.src = '../../assets/images/isoceles.png';

const minImgDimension = Math.min(img.height, img.width);

const defaultInitialParams = {
  speed: 3
};

const defaultInitialState = {
  x: 150,
  y: 150,
  heading: 0, //radians
  turnDirection: 1  // -1 is clockwise, 1 is counterclockwise
};

const wanderingTriangle = (canvasId, initialParams = defaultInitialParams, initialState = defaultInitialState) => {
  const anim = animationFactory.create();
  anim.setCanvasId(canvasId);
  anim.setInitialConditions(initialParams, initialState);

  anim.setUpdate(() => {
    if (anim.ticks % 5 === 0) {
      // pick a new heading within the 22.5 degrees directly in front of the triangle 
      let turn = Math.random() * (1/32) * Math.PI;

      // ~2/3 likelihood that the triangle will continue turning in the same diretion
      anim.state.turnDirection = (Math.random() > 0.33) ? anim.state.turnDirection : (-1 * anim.state.turnDirection);
      anim.state.heading += turn * anim.state.turnDirection;
    }

    let offsetX = Math.cos(anim.state.heading) * anim.params.speed;
    let offsetY = Math.sin(anim.state.heading) * anim.params.speed;
    
    let boundedX = (anim.state.x + offsetX) % (anim.canvas.width + minImgDimension);
    let boundedY = (anim.state.y + offsetY) % (anim.canvas.height + minImgDimension);

    anim.state.x = boundedX < (0 - minImgDimension) ? anim.canvas.width : boundedX;
    anim.state.y = boundedY < (0 - minImgDimension) ? anim.canvas.height : boundedY;
  });

  anim.setDraw(() => {
    anim.ctx.save();
    anim.ctx.clearRect(0, 0, anim.ctx.canvas.width, anim.ctx.canvas.height);
    anim.ctx.translate(anim.state.x, anim.state.y);

    // image is rotated additional 90 degrees clockwise to face heading
    anim.ctx.rotate(anim.state.heading + (Math.PI / 2));
    anim.ctx.translate(-anim.state.x, -anim.state.y);
    anim.ctx.drawImage(img, anim.state.x - (img.width / 2), anim.state.y - (img.height / 2));
    anim.ctx.restore();
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
  wanderingTriangle
}