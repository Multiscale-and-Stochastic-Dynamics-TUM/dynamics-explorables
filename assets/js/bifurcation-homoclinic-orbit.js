import Plotly from 'plotly.js-dist-min';

import {linspace} from './modules/data_structures/iterables';
import {Trajectory2D} from './modules/data_structures/trajectory';
import {streamlines} from './modules/plotly/streamlines';
import {solve_ode} from './modules/simulation/ode_solver';

const layout = {
  margin: {l: 40, r: 40, t: 40, b: 30},
  xaxis: {range: [0, 2]},
  yaxis: {range: [-1., 1.], scaleanchor: 'x1'},
  showlegend: false,
};

const config = {
  displayModeBar: false,
};

const qc = 0.06456;

function rhs(t, y, q) {
  let [y1, y2] = y;
  let qmod = q + qc;
  return [y2, -qmod * y2 + y1 - y1 ** 2 + y1 * y2];
}

function eigenvalues(q) {
  let qmod = q + qc;
  return [
    0.5 * (-qmod - Math.sqrt(qmod ** 2 + 4)),
    0.5 * (-qmod + Math.sqrt(qmod ** 2 + 4))
  ];
}

function eigenvectors(q) {
  let qmod = q + qc;
  return [
    [-0.5 * (qmod - Math.sqrt(qmod ** 2 + 4)), -1],
    [0.5 * (qmod + Math.sqrt(qmod ** 2 + 4)), 1]
  ];
}

const slider = document.getElementById('streamlinesSlider');
const sliderManifolds = document.getElementById('streamlinesManifoldsSlider');
const label = document.getElementById('streamlinesSliderLabel');
const labelManifolds =
    document.getElementById('streamlinesManifoldsSliderLabel');

label.innerHTML = `p = ${slider.value}`;
labelManifolds.innerHTML = `p = ${sliderManifolds.value}`;

let qmin = parseFloat(slider.min);
let qmax = parseFloat(slider.max);
let qstep = parseFloat(slider.step);

let streamlinesDiv = document.getElementById('streamlines');
let streamlinesManifoldsDiv = document.getElementById('streamlinesManifolds');

let streamlineCache = new Map();
let streamlineManifoldCache = new Map();

let streamlineKwargs = {
  line: {width: 1, color: 'gray'},
  layout: layout,
  config: config,
  density: 6,
  minlength: 0.5,
};

function precomputeStreamlines(q) {
  let ind = Math.round((q - qmin) / qstep);
  if (!streamlineCache.has(ind)) {
    let xrange = layout.xaxis.range;
    let yrange = layout.yaxis.range;
    let kwargs = {noDisplay: true, ...streamlineKwargs};
    let traces = streamlines(streamlinesDiv, rhs, [q], xrange, yrange, kwargs);
    streamlineCache.set(ind, traces);

    // draw the stable/unstable manifolds
    let manifoldTraces = computeManifolds(q);
    let allTraces = traces.concat(manifoldTraces);
    streamlineManifoldCache.set(ind, allTraces);

    console.log(manifoldTraces);
  }
}

function computeManifolds(q) {
  let manifoldStartingCoords = eigenvectors(q);

  let traces = [];

  let stableLine = {
    color: 'red',
    dash: 'solid',
  };

  let unstableLine = {
    color: 'blue',
    dash: 'dash',
  }

  for (let coord of manifoldStartingCoords) {
    coord[0] *= 0.01;
    coord[1] *= 0.01;
    if (coord[0] < 0) {
      coord[0] *= -1;
      coord[1] *= -1;
    }

    let line = rhs(0, coord, q)[0] < 0 ? stableLine : unstableLine;
    let kwargs = {
      ...streamlineKwargs,
      line: line,
      redraw: false,
      startingCoords: [coord],
      brokenStreamlines: false,
      noDisplay: true
    };

    let trace = streamlines(
        streamlinesManifoldsDiv, rhs, [q], layout.xaxis.range,
        layout.yaxis.range, kwargs);
    traces = traces.concat(trace);
  }
  return traces;
}

async function updatePlots(event, sliderId) {
  let q = parseFloat(event.target.value);

  if (sliderId == 0) {
    sliderManifolds.value = q;
    label.innerHTML = `p = ${slider.value}`;
    labelManifolds.innerHTML = `p = ${slider.value}`;
  } else if (sliderId == 1) {
    slider.value = q;
    label.innerHTML = `p = ${sliderManifolds.value}`;
    labelManifolds.innerHTML = `p = ${sliderManifolds.value}`;
  }

  let ind = Math.round((q - qmin) / qstep);

  if (!streamlineCache.has(ind)) {
    precomputeStreamlines(q);
  }
  traces = streamlineCache.get(ind);
  manifoldTraces = streamlineManifoldCache.get(ind);
  Plotly.react(streamlinesDiv, traces, layout, config);
  Plotly.react(streamlinesManifoldsDiv, manifoldTraces, layout, config);
}

slider.oninput = async (event) => {
  updatePlots(event, 0);
};

sliderManifolds.oninput =
    async (event) => {
  updatePlots(event, 1);
}

// trigger the first update of the plot manually
var event = new Event('input');
slider.dispatchEvent(event);

let taskList = [];
let taskHandle = null;

// Use idle tasks to precompute streamlines in the background while there are
// resources available.
function enqueueTask(taskHandler, taskData) {
  taskList.push({
    handler: taskHandler,
    data: taskData,
  });

  if (!taskHandle) {
    taskHandle = requestIdleCallback(runTaskQueue, {timeout: 500});
  }
}

function runTaskQueue(deadline) {
  while ((deadline.timeRemaining() > 0 || deadline.didTimeout) &&
         taskList.length) {
    const task = taskList.shift();
    task.handler(task.data);
  }

  if (taskList.length) {
    taskHandle = requestIdleCallback(runTaskQueue, {timeout: 500});
  } else {
    taskHandle = 0;
  }
}

for (let q = qmin; q <= qmax + 1e-5; q += qstep) {
  enqueueTask(precomputeStreamlines, q);
}