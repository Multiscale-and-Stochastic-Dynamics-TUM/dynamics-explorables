
import Plotly from 'plotly.js-dist-min'

import {Trajectory3D} from './modules/data_structures/trajectory';
import {solve_ode} from './modules/simulation/ode_solver';
import {Stream} from './modules/simulation/streams';

// The maximum number of points of a trajectory to plot
const MAX_TRAJECTORY_LENGTH = 250

// How much simulated time should pass per second
const SIM_TIME_PER_SECOND = 0.5

// How much of the simulated time should be precomputed in advance
const TIME_PER_CHUNK = 3.

// How many updates should happen per second
const FPS = 30

// The starting point
const INITIAL_CONDITION = {
  x: 4.,
  y: 20.,
  z: 20.
}

// Current state that is displayed in the visualization
var current_state = {
  t: 0.,
  x: INITIAL_CONDITION.x,
  y: INITIAL_CONDITION.y,
  z: INITIAL_CONDITION.z,
  sigma: 10.,
  rho: 28.,
  beta: 8. / 3.
};

var trajectoryTail = new Trajectory3D(
    [0.0], [INITIAL_CONDITION.x], [INITIAL_CONDITION.y], [INITIAL_CONDITION.z]);

// ================================================================
// ---------------------- visualization ---------------------------

const layout = {
  margin: {l: 40, r: 20, t: 20, b: 30},
  xaxis: {
    title: 'x',
    range: [-30, 30],
  },
  yaxis: {
    title: 'y',
    range: [-30, 30],
  },
  scene: {
    xaxis: {
      range: [-50, 50],
      visible: true,
      tick0: -50,
      dtick: 25,
      zerolinewidth: 2,
    },
    yaxis: {
      range: [-50, 50],
      visible: true,
      tick0: -50,
      dtick: 25,
      zerolinewidth: 2,
    },
    zaxis: {
      range: [0, 100],
      visible: true,
      tick0: 0,
      dtick: 25,
      zerolinewidth: 2,
    },
    aspectmode: 'cube',
    camera: {eye: {x: 0.4, y: -0.4, z: -0.1}, center: {z: -0.2}},
    dragmode: 'turntable',
  },
  modebar: {remove: ['pan3d', 'resetCameraDefault3d', 'zoom', 'toimage']},
  paper_bgcolor: '#ffffff00',
  uirevision: 'true',
};

const config = {
  responsive: true,
  displaylogo: false,
};

var plotly3D = document.getElementById('plotly3D');

Plotly.newPlot(
    plotly3D, [{
      type: 'scatter3d',
      mode: 'lines',
      x: [[current_state.x]],
      y: [[current_state.y]],
      z: [[current_state.z]],
      line: {
        color: [current_state.t],
        colorscale: 'Greens',
      }
    }],
    layout, config);

function lorenz(t, y0, sigma, beta, rho) {
  let [x, y, z] = y0;
  let dx = -sigma * (x - y);
  let dy = rho * x - y - x * z;
  let dz = -beta * z + x * y;
  return [dx, dy, dz];
}

function generateChunk() {
  let tspan = [current_state.t, current_state.t + TIME_PER_CHUNK];
  let y0 = [current_state.x, current_state.y, current_state.z];
  let args = [current_state.sigma, current_state.beta, current_state.rho];
  console.log(`Solving the ode at t = ${tspan[0]}`);
  let solution = solve_ode(lorenz, tspan, y0, args);
  var chunk = new Trajectory3D(solution.t, ...solution.y);
  current_state.t = chunk.t.at(-1);
  current_state.x = chunk.x.at(-1);
  current_state.y = chunk.y.at(-1);
  current_state.z = chunk.z.at(-1);
  return chunk;
}

function crumbleChunk(chunk) {
  let t = chunk.t.at(0);
  let dt = SIM_TIME_PER_SECOND / FPS;
  let crumbs = [];

  while (t + dt < chunk.t.at(-1)) {
    var ind = chunk.t.findIndex(x => x > t + dt)
    if (ind === -1) {
      ind = chunk.t.length - 1;
    }
    var crumb = chunk.slice(0, ind);
    chunk = chunk.slice(ind, chunk.length);
    crumbs.push(crumb);
    t = t + dt;
  }
  return crumbs;
}

async function drawCrumb(crumb) {
  trajectoryTail = trajectoryTail.append(crumb);

  if (trajectoryTail.t.length > MAX_TRAJECTORY_LENGTH) {
    var offset = trajectoryTail.t.length - MAX_TRAJECTORY_LENGTH
    trajectoryTail = trajectoryTail.slice(offset, trajectoryTail.length)
  }

  await Plotly.update(
      plotly3D, {
        x: [trajectoryTail.x],
        y: [trajectoryTail.y],
        z: [trajectoryTail.z],
        line: {
          color: trajectoryTail.t,
          cmin: trajectoryTail.t.at(0),
          cmax: trajectoryTail.t.at(-1),
        }
      },
      [0]);
}

let stream = new Stream(
    generateChunk, crumbleChunk, drawCrumb, FPS, animationRunning = true);


// ================================================================
// ---------------------- controls --------------------------------

const playButton = document.getElementById('playButton');

playButton.addEventListener('click', () => {
  playButton.innerHTML = stream.animationPlaying ? 'Play' : 'Pause';
  stream.togglePausePlay();
});

const resetButton = document.getElementById('resetButton');

resetButton.addEventListener('click', async () => {
  let animationPlaying = stream.animationPlaying;
  stream.abort();
  current_state.t = 0.;
  current_state.x = INITIAL_CONDITION.x;
  current_state.y = INITIAL_CONDITION.y;
  current_state.z = INITIAL_CONDITION.z;
  trajectoryTail = new Trajectory3D();

  Plotly.update(
      plotly3D,
      {x: [[current_state.x]], y: [[current_state.y]], z: [[current_state.z]]},
      [0]);

  stream =
      new Stream(generateChunk, crumbleChunk, drawCrumb, FPS, animationPlaying);
})

const toGreek = {
  'sigma': 'σ',
  'beta': 'β',
  'rho': 'ρ'
};

for (const param of ['sigma', 'beta', 'rho']) {
  const slider = document.getElementById(`${param}Slider`);
  const label = document.getElementById(`${param}SliderLabel`)
  const greekLetter = toGreek[param];
  label.innerHTML = `${greekLetter} = ${slider.value}`;

  slider.oninput = () => {
    label.innerHTML = `${greekLetter} = ${slider.value}`;
  };

  slider.addEventListener('change', async (event) => {
    current_state[param] = parseFloat(event.target.value);
    let animationPlaying = stream.animationPlaying;
    stream.abort();
    current_state.t = trajectoryTail.t.at(-1);
    current_state.x = trajectoryTail.x.at(-1);
    current_state.y = trajectoryTail.y.at(-1);
    current_state.z = trajectoryTail.z.at(-1);

    stream = new Stream(
        generateChunk, crumbleChunk, drawCrumb, FPS, animationPlaying);
  })
}
