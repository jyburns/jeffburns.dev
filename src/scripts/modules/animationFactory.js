const _deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
}

const proto = {
  isRunning: false,
  canvasId: "",
  canvas: null,
  ctx: null,
  params: {},
  state: {},
  initialConditions: {},
  ticks: 0,

  setCanvasId: function(canvasId) {
    this.canvasId = canvasId;
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
  },

  setCanvasSize: function(height, width) {
    this.canvas.height = height;
    this.canvas.width = width;
  },

  setInitialConditions: function(params, state) {
    this.initialConditions = { params: _deepCopy(params), state: _deepCopy(state) };
    this.params = params;
    this.state = state;
  },

  setCreate: function(create) {
    this.create = create;
  },

  setUpdate: function(update) {
    this.update = update;
  },

  setDestroy: function(destroy) {
    this.destroy = destroy;
  },

  setDraw: function(draw) {
    this.draw = draw;
  },

  start: function() {
    this.isRunning = true;
  },

  pause: function() {
    this.isRunning = false;
  },

  reset: function() {
    this.isRunning = false;
    this.params = _deepCopy(this.initialConditions.params);
    this.state = _deepCopy(this.initialConditions.state);
    this.ticks = 0;
    this.draw();
  },

  run: function() {
    if (this.isRunning) {
      this.step();
    }
  },
  
  step: function() {
    this.create();
    this.update();
    this.destroy();
    this.draw();

    this.ticks += 1;
  },

  // animation lifecycle methods

  create: () => {},
  update: () => {},
  draw: () => {},
  destroy: () => {}
}

const create = () => {
  return Object.create(proto);
}

export default {
  create,
  proto
}
