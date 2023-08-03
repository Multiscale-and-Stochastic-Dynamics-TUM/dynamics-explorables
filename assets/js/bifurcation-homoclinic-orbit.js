import Plotly from 'plotly.js-dist-min';

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
 * Linearly interpolate between point1 = [x1, y1] and point2 = [x2, y2], to find
 * the point where the coordinate along `axis` is equal to `value`.
 */
function interpolate(point1, point2, x = null, y = null) {
  let [x1, y1] = point1;
  let [x2, y2] = point2;

  // If the linear interpolation is given by x(r) = x1 + (x2 - x1) * r.
  // Set x(r) = value => r = (value - x1) / (x2 - x1).
  // Then, y = y1 + (y2 - y1) * r = y1 + (y2 - y1) * (value - x1) / (x2 - x1)
  if (y === null && x !== null) {
    let y = y1 + (y2 - y1) * (x - x1) / (x2 - x1);
    return [x, y];
  } else if ((x === null && y !== null)) {
    let x = x1 + (x2 - x1) * (y - y1) / (y2 - y1);
    return [x, y];
  }
  throw new Error('Either x or y has to be set for interpolation');
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
 * within the unit square, 0 <= x <= 1 and 0 <= y <= 1.
 */
function straighten(stableTrajectory, unstableTrajectory) {
  // U(y) in the Kuznetzov notation
  let xshift = new Map();
  // S(x) in the Kuznetzov notation
  let yshift = new Map();
  const numbins = 30;

  let newStable = structuredClone(stableTrajectory);
  let newUnstable = structuredClone(unstableTrajectory);

  for (let axis of ['x', 'y']) {
    // the direction of time has to be reversed for the stable manifold along
    // the x-axis.
    let reverse = (axis == 'x');

    let currentParallel = axis == 'x' ? newStable.x : newUnstable.y;
    let currentPerp = axis == 'x' ? newStable.y : newUnstable.x;
    let otherParallel = axis == 'x' ? newUnstable.x : newStable.y;
    let otherPerp = axis == 'x' ? newUnstable.y : newStable.x;
    let shift = axis == 'x' ? xshift : yshift;

    // Example for the stable manifold, which is straightened along the x-axis.
    // We want to compute the function S(x) which gives the "height" of the
    // stable manifold above the x-axis. For this, split the interval [0, 1] on
    // the x-axis into `numbins` bins. For every bin, compute the y-coordinate
    // of the stable manifold in the center of the bin using linear
    // interpolation between nearest points. Save those values in xshift.
    let binwidth = 1 / numbins;
    for (let bin = 0; bin < numbins; bin++) {
      let center = (bin + 0.5) * binwidth;

      let point1;
      let point2;
      if (reverse) {
        index = currentParallel.findLastIndex(value => value > center);
        point1 = [currentParallel[index], currentPerp[index]];
        point2 = [currentParallel[index + 1], currentPerp[index + 1]];
      } else {
        index = currentParallel.findIndex(value => value > center);
        point1 = [currentParallel[index], currentPerp[index]];
        point2 = [currentParallel[index - 1], currentPerp[index - 1]];
      }

      let [_, height] = interpolate(point1, point2, x = center);

      shift.set(bin, height);
    }

    // Now shift everything according to the bins

    // The index where the trajectory exists the unit square for the first time
    let firstExit;
    if (reverse) {
      firstExit = currentParallel.findLastIndex(x => x > 1);
    } else {
      firstExit = currentParallel.findIndex(x => x > 1);
    }

    // Iterate over points and shift them according to bins.
    for (let i = 0; i < currentParallel.length; i++) {
      if (reverse) {
        if (i > firstExit) {
          currentPerp[i] = 0;
          continue;
        }
      } else {
        if (i < firstExit) {
          currentPerp[i] = 0;
          continue;
        }
      }
      let bin = Math.floor(currentParallel[i] / binwidth);
      if (0 < bin && bin < numbins) {
        currentPerp[i] -= shift.get(bin);
      } else if (bin >= numbins) {
        currentPerp[i] -= shift.get(numbins - 1);
      }
    }
    for (let i = 0; i < otherParallel.length; i++) {
      let bin = Math.floor(otherParallel[i] / binwidth);
      if (0 < bin && bin < numbins) {
        otherPerp[i] -= shift.get(bin);
      } else if (bin >= numbins) {
        otherPerp[i] -= shift.get(numbins - 1);
      }
    }
  }

  return [newStable, newUnstable];
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
  yaxis: {range: [-0.6, 1.5], scaleanchor: 'x'},
  showlegend: false,
};

let layoutPoincare = {
  margin: {l: 40, r: 20, t: 20, b: 30},
  xaxis: {
    range: [0, 2],
    title: {
      text: 'starting point η',
      standoff: 0,
    }
  },
  yaxis: {
    range: [-0.2, 1],
    scaleanchor: 'x',
    title: {
      text: 'return point P(η)',
      standoff: 0,
    }
  },
  showlegend: false,
};

const config = {
  displayModeBar: false,
  responsive: true,
};

const zoom = 5;

const streamlinesSlider = document.getElementById('streamlinesSlider');
const manifoldsSlider = document.getElementById('manifoldsSlider');
const firstCrosssectionSlider =
    document.getElementById('firstCrosssectionSlider');
const betaSlider = document.getElementById('betaSlider');
const eigenvalueRatioSlider = document.getElementById('eigenvalueRatioSlider');

const streamlinesLabel = document.getElementById('streamlinesSliderLabel');
const manifoldsLabel = document.getElementById('manifoldsSliderLabel');
const firstCrosssectionLabel =
    document.getElementById('firstCrosssectionSliderLabel');
const betaLabel = document.getElementById('betaSliderLabel');
const eigenvalueRatioLabel =
    document.getElementById('eigenvalueRatioSliderLabel');

const pSliders = [streamlinesSlider, manifoldsSlider];
const pLabels = [streamlinesLabel, manifoldsLabel];

streamlinesLabel.innerHTML = `p = ${streamlinesSlider.value}`;
manifoldsLabel.innerHTML = `p = ${manifoldsSlider.value}`;
firstCrosssectionLabel.innerHTML = `p = ${firstCrosssectionSlider.value}`;
betaLabel.innerHTML = `β = ${betaSlider.value}`;
eigenvalueRatioLabel.innerHTML = `λ₁ / λ₂ = ${eigenvalueRatioSlider.value}`;

const animButton = document.getElementById('animButton');

let streamlinesDiv = document.getElementById('streamlines');
let streamlinesManifoldsDiv = document.getElementById('manifolds');
let limitCycleDiv = document.getElementById('limitCycle');
let zoomOutDiv = document.getElementById('zoomInOut1');
let zoomInDiv = document.getElementById('zoomInOut2');
let firstCrosssectionDiv = document.getElementById('firstCrosssection');
let secondCrosssectionDiv = document.getElementById('secondCrosssection');
let localGlobalMapAnimDiv = document.getElementById('localGlobalMapAnim');
let poincareMapDiv = document.getElementById('poincareMap');

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
    let stable = vel[0] * coord[0] + vel[1] * coord[1] < 0
    let line = stable ? stableLine : unstableLine;
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

    let [lineTrace, arrowTrace] =
        streamlines(undefined, rhs, [p], xrange, yrange, kwargs);

    let positive = stable ? coord[0] > 0 : coord[1] > 0;
    lineTrace.meta = {
      type: 'line',
      stable: stable,
      positive: positive,
    };
    arrowTrace.meta = {type: 'arrow', stable: stable, positive: positive};

    traces = traces.concat([lineTrace, arrowTrace]);
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
    [localTrace.x, localTrace.y] = orthogonalize(trace.x, trace.y, p, zoom);

    return localTrace;
  });

  // straighten the manifolds
  let stableId = localTraces.findIndex(trace => {
    return trace.meta.type == 'line' && trace.meta.stable &&
        trace.meta.positive;
  });
  let stableTrajectory = localTraces[stableId];
  let unstableId = localTraces.findIndex(trace => {
    return trace.meta.type == 'line' && !trace.meta.stable &&
        trace.meta.positive;
  });
  let unstableTrajectory = localTraces[unstableId];

  [localTraces[stableId], localTraces[unstableId]] =
      straighten(stableTrajectory, unstableTrajectory);

  // move the arrows into the unit square
  let stableArrowId = stableId + 1;
  let unstableArrowId = unstableId + 1;
  let stableArrows = localTraces[stableArrowId];
  let unstableArrows = localTraces[unstableArrowId];
  stableArrows.x = [0.5, 0.49];
  stableArrows.y = [0, 0];

  unstableArrows.x = [0, 0];
  unstableArrows.y = [0.5, 0.51];

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
    return trace.meta.type == 'line' && !trace.meta.stable &&
        trace.meta.positive;
  });

  // find the first point where the unstable manifold intersects the vertical
  // line from right to left
  let firstHit = unstableTrace.x.findIndex(
      (value, i) => (value > 1 && unstableTrace.x[i + 1] < 1));

  let point1 = [unstableTrace.x[firstHit + 1], unstableTrace.y[firstHit + 1]];
  let point2 = [unstableTrace.x[firstHit], unstableTrace.y[firstHit]];

  let [_, beta] = interpolate(point1, point2, x = 1);
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

function getAnimationFrames(p, type = 'local') {
  let localTraces = getLocalManifolds(p);

  let unstableManifold = localTraces.find(trace => {
    return trace.meta.type == 'line' && !trace.meta.stable &&
        trace.meta.positive;
  })

  let startId, finishId;

  // local case
  startId = unstableManifold.x.findIndex((x, i) => {
    return x < 1 && unstableManifold.x[i - 1] > 1;
  })
  finishId = unstableManifold.y.findIndex((y, i) => {
    return i > startId && y > 1 && unstableManifold.y[i - 1] < 1;
  })

  // global case
  if (type == 'global') {
    startId = finishId;
    finishId = unstableManifold.x.findIndex((x, i) => {
      return i > startId && x < 1 && unstableManifold.x[i - 1] > 1;
    })
  }

  const tailLength = 100;

  let trajectoryFrames = [];

  for (let i = startId; i < finishId + tailLength; i += 15) {
    let tailId = Math.max(startId, i - tailLength);
    let headId = Math.min(finishId, i);
    let tracedata = {
      x: [unstableManifold.x.slice(tailId, headId)],
      y: [unstableManifold.y.slice(tailId, headId)]
    };
    trajectoryFrames.push(tracedata);
  }
  // push the last datapoint
  let tracedata = {
    x: [[unstableManifold.x.at(-1)]],
    y: [[unstableManifold.y.at(-1)]]
  };
  trajectoryFrames.push(tracedata);
  return trajectoryFrames;
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

  // add a rectangle which shows the zoom area
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

  let locLayoutGlobal = {
    title: {text: 'global', automargin: true},
    ...layoutGlobal,
  };

  let locLayoutLocal = {
    title: {text: 'local', automargin: true},
    ...layoutLocal,
  };

  Plotly.newPlot(globalDiv, globalTraces, locLayoutGlobal, config);
  Plotly.newPlot(localDiv, localTraces, locLayoutLocal, config);
}

function drawLocalView(plotlyDiv, p, vertLine = false, horizLine = false) {
  let localTraces = structuredClone(getLocalManifolds(p));

  const vertLineTrace = {
    x: [1, 1],
    y: layoutLocal.yaxis.range,
    mode: 'lines',
    line: {color: 'blue', width: 1}
  };

  const horizLineTrace = {
    x: layoutLocal.xaxis.range,
    y: [1, 1],
    mode: 'lines',
    line: {color: 'purple', width: 1}
  };

  if (vertLine) {
    localTraces.push(vertLineTrace);
  }

  if (horizLine) {
    localTraces.push(horizLineTrace);
  }

  let locLayoutLocal = structuredClone(layoutLocal);

  Plotly.newPlot(plotlyDiv, localTraces, locLayoutLocal, config);

  return localTraces;
}

async function drawBetaFunc(plotlyDiv, p) {
  drawLocalView(plotlyDiv, p, vertLine = true);

  let beta = computeBeta(p);

  const betaIntervalTraces = [
    {
      x: [1, 1],
      y: [0, beta],
      mode: 'lines',
      line: {color: 'blue', width: 3},
    },
    {
      x: [1, 1],
      y: [0, beta],
      mode: 'markers',
      marker: {size: 10, symbol: 'x', color: 'blue'}
    }
  ];

  Plotly.addTraces(plotlyDiv, betaIntervalTraces);

  // change the values of p and β in the text
  let pSpan = document.getElementById('pSpan');
  pSpan.innerText = `$p = ${p.toFixed(2)}$`;

  let betaSpan = document.getElementById('betaSpan');
  betaSpan.innerText = `$\\beta(p) = ${beta.toFixed(2)}$`;

  MathJax.typeset();
}

firstCrosssectionSlider.oninput = async (event) => {
  let p = parseFloat(event.target.value);
  firstCrosssectionLabel.innerHTML = `p = ${p}`;
  drawBetaFunc(firstCrosssectionDiv, p);
};


async function createAnimation(plotlyDiv, p) {
  let localFrames = getAnimationFrames(p, type = 'local');
  let globalFrames = getAnimationFrames(p, type = 'global');

  let data = new Map();
  data.set('local', {
    frames: localFrames,
    buttonText: 'Local map',
    numFrames: localFrames.length,
  });
  data.set('global', {
    frames: globalFrames,
    buttonText: 'Global map',
    numFrames: globalFrames.length,
  });

  let animationPlaying = false;
  let currentMap = 'local';

  Plotly.addTraces(plotlyDiv, [{}]);

  async function drawFrame(plotlyDiv, frames, currentFrame) {
    if (!animationPlaying) {
      return;
    }

    if (currentFrame >= data.get(currentMap).numFrames) {
      animationPlaying = false;
      currentMap = currentMap == 'local' ? 'global' : 'local';
      animButton.innerHTML = data.get(currentMap).buttonText;
      animButton.disabled = false;
      return;
    }
    let numTraces = plotlyDiv.data.length - 1;
    await Plotly.restyle(plotlyDiv, frames[currentFrame], [numTraces]);
    setTimeout(drawFrame, 15, plotlyDiv, frames, currentFrame + 1);
  }

  animButton.addEventListener('click', () => {
    animationPlaying = !animationPlaying;
    if (animationPlaying) {
      animButton.disabled = true;
    }

    let frames = data.get(currentMap).frames;

    let initialTrace = {
      x: frames[0].x[0],
      y: frames[0].y[0],
      mode: 'lines',
      line: {
        color: '#f4ae0188',
        width: 5,
      }
    };

    if (animationPlaying) {
      currentFrame = 0;
      let numTraces = plotlyDiv.data.length - 1;

      Plotly.deleteTraces(plotlyDiv, numTraces);
      Plotly.addTraces(plotlyDiv, initialTrace, numTraces);
      setTimeout(drawFrame, 15, plotlyDiv, frames, 0);
    }
  });
}

function drawPoincare(plotlyDiv, beta, eigenvalueRatio) {
  let x = linspace(0, 1, 100);
  let y = x.map(x => beta + x ** (-eigenvalueRatio));

  let poincare = {x: x, y: y, mode: 'lines', line: {color: 'purple'}};
  let diagonal = {
    x: x,
    y: x,
    mode: 'lines',
    line: {color: 'gray', dash: 'dot'},
  };

  let intersection = {
    x: [],
    y: [],
    mode: 'markers',
    marker: {color: 'purple', symbol: 'x', size: '15'}
  }

  // if an intersection exists
  if ((beta > 0 && eigenvalueRatio < -1) ||
      (beta < 0 && eigenvalueRatio > -1)) {
    let intersectionId;
    if (beta > 0 && eigenvalueRatio < -1) {
      intersectionId = y.findIndex((y, i) => y < x[i]);
    } else if (beta < 0 && eigenvalueRatio > -1) {
      intersectionId = y.findIndex((y, i) => y > x[i]);
    }
    let x1 = x[intersectionId - 1];
    let y1 = y[intersectionId - 1];
    let x2 = x[intersectionId];
    let y2 = y[intersectionId];
    let xint = x1 + (x2 - x1) * (x1 - y1) / (y2 - y1 - x2 + x1);
    intersection.x = [xint];
    intersection.y = [xint];
  }
  else if (Math.abs(beta) < 1e-4) {
    intersection.x = [0];
    intersection.y = [0];
  }


  Plotly.newPlot(
      plotlyDiv, [diagonal, poincare, intersection], layoutPoincare, config);
}

betaSlider.oninput = async (event) => {
  let beta = parseFloat(event.target.value);
  betaLabel.innerHTML = `β = ${beta}`;
  let eigenvalueRatio = parseFloat(eigenvalueRatioSlider.value);
  drawPoincare(poincareMapDiv, beta, eigenvalueRatio);
};

eigenvalueRatioSlider.oninput = async (event) => {
  let eigenvalueRatio = parseFloat(event.target.value);
  eigenvalueRatioLabel.innerHTML = `λ₁ / λ₂ = ${eigenvalueRatio}`;
  let beta = parseFloat(betaSlider.value);
  drawPoincare(poincareMapDiv, beta, eigenvalueRatio);
};

// (end draw stuff)
// ============================================================

// trigger the first update of the interactive plots manually
var event = new Event('input');
streamlinesSlider.dispatchEvent(event);
firstCrosssectionSlider.dispatchEvent(event);
betaSlider.dispatchEvent(event);

// draw the limit cycle at p = 0.9
drawLimitCycle(0.9);

drawZoom(zoomOutDiv, zoomInDiv, 0.82);

// draw the static local views
drawLocalView(secondCrosssectionDiv, 0.82, vertLine = true, horizLine = true);
drawLocalView(localGlobalMapAnimDiv, 0.85, vertLine = true, horizLine = true);

createAnimation(localGlobalMapAnimDiv, 0.85);