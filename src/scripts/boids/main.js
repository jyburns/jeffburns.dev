import { slidingRectangle } from "./slidingRectangle.js";
import { snow } from "./snow.js";

const animations = [];

const mainLoop = () => {
  window.requestAnimationFrame(mainLoop);

  animations.forEach((animation) => {
    animation.run();
  });
};

window.addEventListener('load', () => {
  animations.push(slidingRectangle('canvas_1'));
  animations.push(snow('canvas_2'));

  const main = document.getElementsByTagName('main')[0];
 
  animations.forEach((animation) => {
    animation.setCanvasSize(400, main.clientWidth);
    animation.draw();
  })

  mainLoop();
});

window.addEventListener('resize', (e) => {
  const main = document.getElementsByTagName('main')[0];

  animations.forEach((animation) => {
    animation.setCanvasSize(400, main.clientWidth);
  });
});
