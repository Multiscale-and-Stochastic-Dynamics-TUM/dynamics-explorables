import Plotly, {newPlot} from 'plotly.js-dist-min';

import {linspace} from './modules/data_structures/iterables';
import {streamlines} from './modules/plotly/streamlines';

// Before we do anything, we need to color the words in the document nicely.
// Priorities.

const style = getComputedStyle(document.body)

const stableManifoldColor = style.getPropertyValue('--green');
const unstableManifoldColor = style.getPropertyValue('--red');
const limitCycleColor = style.getPropertyValue('--orange');

// Color all instances of the words "stable" and "unstable" written within a
// span tag in green and red.
function colorWords(colorMap) {
  for (const span of document.getElementsByTagName('span')) {
    if (colorMap.has(span.innerHTML)) {
      span.style.color = colorMap.get(span.innerHTML);
    }
  }
}

const wordColorMap = new Map([
  ['stable', stableManifoldColor],
  ['unstable', unstableManifoldColor],
  ['orange', limitCycleColor],
]);

colorWords(wordColorMap);

// ============================================================
// Functions related to the ODE

const pc = 0.06456;

function rhs(t, y, p) {
  let [y1, y2] = y;
  let pmod = p + pc;
  return [y2, -pmod * y2 + y1 - y1 ** 2 + y1 * y2];
}

function eigenvalues(p) {
  let pmod = p + pc;
  return [
    0.5 * (-pmod - Math.sqrt(pmod ** 2 + 4)),
    0.5 * (-pmod + Math.sqrt(pmod ** 2 + 4))
  ];
}

function eigenvectors(p) {
  let pmod = p + pc;

  let v1 = [-0.5 * (pmod - Math.sqrt(pmod ** 2 + 4)), -1];
  let v2 = [0.5 * (pmod + Math.sqrt(pmod ** 2 + 4)), 1];

  for (let v in [v1, v2]) {
    let vnorm = Math.sqrt(v[0] ** 2 + v[1] ** 2);
    v[0] /= vnorm;
    v[1] /= vnorm;
  }

  return [v1, v2];
}

/**
 * Map the (x,  y) coordinate from the original coordinate system to the system
 * in which the eigenvectors are parallel to the axes. Accepts vectors of x- and
 * y-coordinates and returns vectors of x- and y-coordinates back.
 */
function orthogonalize(xvec, yvec, p, scale = 1) {
  let [v1, v2] = eigenvectors(p);

  let det = (v1[0] * v2[1] - v2[0] * v1[1]) / scale;

  let newx = [];
  let newy = [];

  for (let i = 0; i < xvec.length; i++) {
    newx.push((v2[1] * xvec[i] - v2[0] * yvec[i]) / det);
    newy.push((-v1[1] * xvec[i] + v1[0] * yvec[i]) / det);
  }
  return [newx, newy];
}

/**
 * Straighten the manifolds so that they are parallel to the coordinate axes
 * within the visible region.
 */
function straighten(trajectory, reverse, axis) {
  let straightTrajectory = structuredClone(trajectory);

  let shift = new Map();

  let [x, y] = straightTrajectory;

  // axis along which we want to straighten
  let parallelAxis = axis == 'x' ? x : y;

  // axis, perpendicular to the other
  let perpAxis = axis == 'x' ? y : x;

  let lastId = 0;
  let lastdist = 0;
  for (let i = 0; i < x.length; i++) {
    lastId = i;

    if (Math.abs(parallelAxis[i]) > 1.5) {
      break;
    }

    if (reverse) {
      let ind = perpAxis.length - i - 1;
      dist = perpAxis[ind];
      perpAxis[ind] = 0;
      shift.set(Math.round(parallelAxis[ind] * 100), dist);
    } else {
      dist = perpAxis[i];
      perpAxis[i] = 0;
      shift.set(Math.round(parallelAxis[i] * 100), dist);
    }

    lastdist = dist;
  }

  for (let i = lastId; i < x.length; i++) {
    let ind = Math.round(parallelAxis[i] * 100);

    dist = shift.has(ind) ? shift.get(ind) : lastdist;
    perpAxis[i] -= dist;
  }

  return straightTrajectory;
}

// (end ODE functions)
// ============================================================


// ============================================================
// Plotly declarations

let layoutGlobal = {
  margin: {l: 40, r: 20, t: 20, b: 30},
  xaxis: {range: [-1, 2]},
  yaxis: {range: [-1.5, 1.5]},
  showlegend: false,
};

let layoutLocal = {
  margin: {l: 40, r: 20, t: 20, b: 30},
  xaxis: {range: [0, 2]},
  yaxis: {range: [-0.6, 1.2], scaleanchor: 'x'},
  showlegend: false,
};

const config = {
  displayModeBar: false,
  responsive: true,
};

const zoom = 5;

const streamlinesSlider = document.getElementById('streamlinesSlider');
const manifoldsSlider = document.getElementById('manifoldsSlider');
const betaSlider = document.getElementById('betaSlider');

const streamlinesLabel = document.getElementById('streamlinesSliderLabel');
const manifoldsLabel = document.getElementById('manifoldsSliderLabel');
const betaLabel = document.getElementById('betaSliderLabel');

const pSliders = [streamlinesSlider, manifoldsSlider];
const pLabels = [streamlinesLabel, manifoldsLabel];

streamlinesLabel.innerHTML = `p = ${streamlinesSlider.value}`;
manifoldsLabel.innerHTML = `p = ${manifoldsSlider.value}`;

let streamlinesDiv = document.getElementById('streamlines');
let streamlinesManifoldsDiv = document.getElementById('manifolds');
let limitCycleDiv = document.getElementById('limitCycle');
let zoomOutDiv = document.getElementById('zoomInOut1');
let zoomInDiv = document.getElementById('zoomInOut2');
let betaDiv = document.getElementById('beta');

// trigger an empty update to set xrange in the layout to the actual values
Plotly.newPlot(zoomInDiv, [], layoutLocal, config);

const xrange = layoutGlobal.xaxis.range;
const yrange = layoutGlobal.yaxis.range;

const pmin = parseFloat(streamlinesSlider.min);
const pmax = parseFloat(streamlinesSlider.max);
const pstep = parseFloat(streamlinesSlider.step);

const streamlineKwargs = {
  line: {width: 1, color: 'gray'},
  layout: layoutGlobal,
  config: config,
  density: 6,
  minlength: 0.5,
};

const stableLine = {
  color: stableManifoldColor,
  dash: 'solid',
};

const unstableLine = {
  color: unstableManifoldColor,
  dash: 'dash',
};

const criticalPointTraces = [{
  mode: 'markers',
  x: [0, 1],
  y: [0, 0],
  text: ['saddle point', 'unstable focus'],
  type: 'scatter',
  marker: {
    size: 8,
    symbol: 'x',
    color: 'black',
  },
  name: 'critical point',
}];

// (end Plotly declarations)
// ============================================================


// ============================================================
// Functions to calculate stuff

/**
 * Cache the result of calling func(arg). If the function has not been called
 * before with this argument, call the function and cache the result. Otherwise,
 * return the cached result.
 *
 * For now, this really only works when arg is a float rounded to two digits.
 */
function cacheFunc(func, arg) {
  let key = Math.round(arg * 100);

  let result;

  // a hack to use the `cache` variable as a "static" variable which
  // saves its value between function calls. See
  // https://stackoverflow.com/a/1535650
  if (typeof func.cache == 'undefined') {
    func.cache = new Map();
  }

  if (!func.cache.has(key)) {
    result = func(arg);
    func.cache.set(key, result);
  } else {
    result = func.cache.get(key);
  }

  return result;
}

function getStreamlines(p) {
  return cacheFunc(precomputeStreamlines, p);
}

function precomputeStreamlines(p) {
  let kwargs = {noDisplay: true, ...streamlineKwargs};
  let traces = streamlines(undefined, rhs, [p], xrange, yrange, kwargs);
  return traces;
}

function getManifolds(p) {
  return cacheFunc(precomputeManifolds, p);
}

function precomputeManifolds(p) {
  let manifoldStartingCoords = eigenvectors(p);

  // Mirror the coordinates on the origin and add them too
  let mirroredCoords = [];
  for (let coord of manifoldStartingCoords) {
    let mirroredCoord = structuredClone(coord);
    coord[0] *= -1;
    coord[1] *= -1;
    mirroredCoords.push(mirroredCoord);
  }
  manifoldStartingCoords = manifoldStartingCoords.concat(mirroredCoords);

  let traces = [];

  for (let coord of manifoldStartingCoords) {
    // move the starting coords very close to origin to find the manifolds.
    coord[0] *= 0.01;
    coord[1] *= 0.01;

    // check if the line belongs to a stable or unstable manifold
    let vel = rhs(0, coord, p);
    let line =
        vel[0] * coord[0] + vel[1] * coord[1] > 0 ? unstableLine : stableLine;
    let kwargs = {
      ...streamlineKwargs,
      line: line,
      redraw: false,
      startingCoords: [coord],
      criticalPoints: [[0, 0], [1, 0]],
      criticalPointSafeSpace: 0.008,
      brokenStreamlines: false,
      noDisplay: true
    };

    let trace = streamlines(undefined, rhs, [p], xrange, yrange, kwargs);

    traces = traces.concat(trace);
  }
  return traces;
}

/**
 * Transform the global manifolds to a local view.
 */
function getLocalManifolds(p) {
  let manifoldTraces = getManifolds(p);
  let globalTraces = structuredClone(manifoldTraces);

  // transform everything

  let localTraces = globalTraces.map(trace => {
    let localTrace = structuredClone(trace);
    let localTrajectory = orthogonalize(trace.x, trace.y, p, zoom);

    // straighten the manifolds
    if (localTrace.mode == 'lines' && localTrace.x.length > 100) {
      let stable = (localTrace.line.color == stableManifoldColor)
      let reverse =
          localTrajectory[0].at(-1) < 0.05 && localTrajectory[0].at(-1) < 0.05;
      let axis = stable ? 'x' : 'y';

      localTrajectory = straighten(localTrajectory, reverse, axis);
    }

    localTrace.x = localTrajectory[0];
    localTrace.y = localTrajectory[1];

    return localTrace;
  });

  return localTraces;
}

function computeBeta(p) {
  return cacheFunc(precomputeBeta, p);
}

function precomputeBeta(p) {
  let localTraces = getLocalManifolds(p);

  // find the unstable trace which starts from the origin by going up along the
  // (0, 1) vector.
  let unstableTrace = localTraces.find((trace) => {
    if (trace.mode == 'markers' || trace.line == 'undefined') {
      return false;
    }
    if (trace.line.color != unstableManifoldColor) {
      return false
    }
    return trace.y[0] > 0;
  });

  // find the first point where the unstable manifold intersects the vertical
  // line from right to left
  let firstHit = unstableTrace.x.findIndex(
      (value, i) => (value > 1 && unstableTrace.x[i + 1] < 1));

  // linearly interpolate between the point to the left and to the right of the
  // vertical line to find the intersection point where x = 1.
  // The point to the left of the x = 1 line has coordinates (x1, y1), the point
  // to the right has coordinates (x2, y2).
  let x1 = unstableTrace.x[firstHit + 1];
  let y1 = unstableTrace.y[firstHit + 1];
  let x2 = unstableTrace.x[firstHit];
  let y2 = unstableTrace.y[firstHit];

  // If the linear interpolation is given by x(r) = x1 + (x2 - x1) * r.
  // Set x(r) = 1 => r = (1 - x1) / (x2 - x1).
  // Then, y = y1 + (y2 - y1) * r = y1 + (y2 - y1) * (1 - x1) / (x2 - x1)
  let beta = y1 + (y2 - y1) * (1 - x1) / (x2 - x1);
  return beta;
}

// Use idle tasks to precompute streamlines in the background while there are
// resources available.

let taskList = [];
let taskHandle = null;

for (let p = pmin; p <= pmax + 1e-5; p += pstep) {
  taskList.push({
    handler: (p) => {
      getStreamlines(p);
      getManifolds(p);
    },
    data: [p],
  });

  if (!taskHandle) {
    taskHandle = requestIdleCallback(runTaskQueue, {timeout: 500});
  }
}

function runTaskQueue(deadline) {
  while ((deadline.timeRemaining() > 0 || deadline.didTimeout) &&
         taskList.length) {
    const task = taskList.shift();
    task.handler(...task.data);
  }

  if (taskList.length) {
    taskHandle = requestIdleCallback(runTaskQueue, {timeout: 500});
  } else {
    taskHandle = 0;
  }
}

// (end calculate stuff)
// ============================================================

// ============================================================
// Functions to draw stuff

/**
 * Update all plots that depend on the value of p whenever p is changed by any
 * slider.
 *
 * @param {int} sliderId - the serial number of the slider, starting from 0.
 */
async function updatePlots(event, sliderId) {
  let p = parseFloat(event.target.value);

  pSliders.map((slider, id) => {
    if (id != sliderId) {
      slider.value = p;
    }
    pLabels[id].innerHTML = `p = ${slider.value}`;
  });

  let streamlineTraces = getStreamlines(p);
  let manifoldTraces = getManifolds(p);

  streamlineTraces = structuredClone(streamlineTraces);
  manifoldTraces = structuredClone(manifoldTraces);

  Plotly.react(streamlinesDiv, streamlineTraces, layoutGlobal, config);
  Plotly.react(streamlinesManifoldsDiv, manifoldTraces, layoutGlobal, config);

  Plotly.addTraces(streamlinesDiv, criticalPointTraces);
  Plotly.addTraces(streamlinesManifoldsDiv, criticalPointTraces);
}

// Trigger the updatePlots function at the update of any p-slider.
for (let i in pSliders) {
  pSliders[i].oninput = async (event) => {
    updatePlots(event, i);
  };
}

async function drawLimitCycle(p) {
  let manifoldTraces = getManifolds(p);
  let traces = structuredClone(manifoldTraces);

  Plotly.react(limitCycleDiv, traces, layoutGlobal, config);

  let limitCycleTrace = structuredClone(traces.at(-2));
  let length = limitCycleTrace.x.length
  limitCycleTrace.x = limitCycleTrace.x.slice(length - 1250, length);
  limitCycleTrace.y = limitCycleTrace.y.slice(length - 1250, length);

  limitCycleTrace.line = {
    color: limitCycleColor,
    width: 3,
  };

  Plotly.addTraces(limitCycleDiv, [limitCycleTrace]);
  Plotly.addTraces(limitCycleDiv, criticalPointTraces);
};

async function drawZoom(globalDiv, localDiv, p) {
  let globalTraces = getManifolds(p);
  let localTraces = getLocalManifolds(p);

  globalTraces = structuredClone(globalTraces);
  localTraces = structuredClone(localTraces);

  // add a rectangle, which shows the zoom area
  let [v1, v2] = eigenvectors(p);

  for (let v of [v1, v2]) {
    v[0] /= zoom;
    v[1] /= zoom;
  }

  let rectangleKwargs = {
    mode: 'lines',
    fill: 'toself',
    showlegend: false,
    fillcolor: '#ffaa5e33',
    line: {simplify: false, color: '#ffaa5e'},
  };

  let globalRectangle = {
    x: [0, v1[0], v1[0] + v2[0], v2[0], 0],
    y: [0, v1[1], v1[1] + v2[1], v2[1], 0],
    ...rectangleKwargs
  };
  let localRectangle = {
    x: [0, 0, 1, 1, 0],
    y: [0, 1, 1, 0, 0],
    ...rectangleKwargs
  };

  globalTraces.push(globalRectangle);
  localTraces.push(localRectangle);

  let locLayoutGlobal = structuredClone(layoutGlobal);
  let locLayoutLocal = structuredClone(layoutLocal);

  locLayoutGlobal.title = {text: 'global', automargin: true};
  locLayoutLocal.title = {text: 'local', automargin: true};

  Plotly.newPlot(globalDiv, globalTraces, locLayoutGlobal, config);
  Plotly.newPlot(localDiv, localTraces, locLayoutLocal, config);
}

async function drawBetaFunc(plotlyDiv, p) {
  let localTraces = getLocalManifolds(p);

  localTraces = structuredClone(localTraces);

  let beta = computeBeta(p);

  Plotly.newPlot(plotlyDiv, localTraces, layoutLocal, config);

  // vertical line at x = 1
  Plotly.addTraces(plotlyDiv, [{
                     x: [1, 1],
                     y: layoutLocal.yaxis.range,
                     mode: 'lines',
                     line: {color: 'blue'}
                   }]);

  Plotly.addTraces(plotlyDiv, [{
                     x: [1],
                     y: [beta],
                     mode: 'markers',
                     marker: {size: 10, symbol: 'x', color: 'blue'}
                   }]);

  // change the values of p and β in the text
  let pSpan = document.getElementById('pSpan');
  pSpan.innerText = `$p = ${p.toFixed(2)}$`;

  let betaSpan = document.getElementById('betaSpan');
  betaSpan.innerText = `$\\beta(p) = ${beta.toFixed(2)}$`;

  MathJax.typeset();
}

betaSlider.oninput = async (event) => {
  let p = parseFloat(event.target.value);
  betaLabel.innerHTML = `p = ${p}`;
  drawBetaFunc(betaDiv, p);
};

// (end draw stuff)
// ============================================================

// trigger the first update of the interactive plots manually
var event = new Event('input');
streamlinesSlider.dispatchEvent(event);
betaSlider.dispatchEvent(event);

// draw the limit cycle at p = 0.9
drawLimitCycle(0.9);

drawZoom(zoomOutDiv, zoomInDiv, 0.82);