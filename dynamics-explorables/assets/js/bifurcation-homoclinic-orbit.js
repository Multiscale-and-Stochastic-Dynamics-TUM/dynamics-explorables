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
const label = document.getElementById('streamlinesSliderLabel');

label.innerHTML = `p = ${slider.value}`;

let qmin = parseFloat(slider.min);
let qmax = parseFloat(slider.max);
let qstep = parseFloat(slider.step);

let streamlinesDiv = document.getElementById('streamlines');
let streamlinesManifoldsDiv =
    document.getElementById('streamlinesWithManifolds');

let streamlineCache = new Map();
let streamlineManifoldCache = new Map();

function precomputeStreamlines(q) {
  let ind = Math.round((q - qmin) / qstep);
  if (!streamlineCache.has(ind)) {
    let traces = streamlines(
        streamlinesDiv, rhs, [q], layout.xaxis.range, layout.yaxis.range, {
          line: {width: 1},
          layout: layout,
          config: config,
          density: 6,
          minlength: 0.5,
          brokenStreamlines: true,
          noDisplay: true,
        });

    streamlineCache.set(ind, traces);

    // draw the stable/unstable manifolds
    let manifoldStartingCoords = eigenvectors(q);

    for (let coord of manifoldStartingCoords) {
      coord[0] *= 0.01;
      coord[1] *= 0.01;
      if (coord[0] < 0) {
        coord[0] *= -1;
        coord[1] *= -1;
      }
    }

    let manifoldTraces = streamlines(
        streamlinesManifoldsDiv, rhs, [q], layout.xaxis.range,
        layout.yaxis.range, {
          line: {width: 1, color: 'red'},
          layout: layout,
          config: config,
          minlength: 0.5,
          startingCoords: manifoldStartingCoords,
          redraw: false,
          brokenStreamlines: false,
          noDisplay: true
        });
    let allTraces = structuredClone(traces).concat(manifoldTraces);
    streamlineManifoldCache.set(ind, allTraces);
  }
}

slider.oninput = async (event) => {
  let q = parseFloat(event.target.value);
  label.innerHTML = `p = ${slider.value}`;
  let ind = Math.round((q - qmin) / qstep);

  if (!streamlineCache.has(ind)) {
    precomputeStreamlines(q);
  }
  traces = streamlineCache.get(ind);
  manifoldTraces = streamlineManifoldCache.get(ind);
  Plotly.react(streamlinesDiv, traces, layout, config);
  Plotly.react(streamlinesManifoldsDiv, manifoldTraces, layout, config);
};

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