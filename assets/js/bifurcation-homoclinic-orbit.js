import Plotly from 'plotly.js-dist-min';

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
async function getLocalManifolds(p) {
  let manifoldTraces = getManifolds(p);
  let globalTraces = structuredClone(manifoldTraces);

  // transform everything

  let localTraces = globalTraces.map(trace => {
    let localTrace = structuredClone(trace);
    let localTrajectory = orthogonalize(trace.x, trace.y, p, zoom);

    localTrace.x = localTrajectory[0];
    localTrace.y = localTrajectory[1];

    return localTrace;
  });

  return [globalTraces, localTraces];
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

  let [_, localTraces] = await getLocalManifolds(p);

  Plotly.react(streamlinesDiv, streamlineTraces, layoutGlobal, config);
  Plotly.react(streamlinesManifoldsDiv, manifoldTraces, layoutGlobal, config);
  Plotly.react(betaDiv, localTraces, layoutLocal, config);

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
  let [globalTraces, localTraces] = await getLocalManifolds(p);

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
  let [_, localTraces] = await getLocalManifolds(p);

  localTraces = structuredClone(localTraces);

  Plotly.newPlot(plotlyDiv, localTraces, layoutLocal, config);

  Plotly.addTraces(plotlyDiv, [{
                     x: [1, 1],
                     y: layoutLocal.yaxis.range,
                     mode: 'lines',
                     line: {
                       color: 'blue',
                     }
                   }])
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