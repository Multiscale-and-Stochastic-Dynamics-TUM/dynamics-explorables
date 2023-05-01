import Plotly from 'plotly.js-dist-min'

import {solve_ode} from './modules/simulation/ode_solver';

function rhsPolar(r, theta) {
  return [r - r ** 3, 10];
}

function rhsCart(t, y0) {
  let [x, y] = y0;
  let r = Math.sqrt(x ** 2 + y ** 2);
  let theta = Math.atan2(y, x);
  let [rdot, thetadot] = rhsPolar(r, theta);
  let xdot = rdot * Math.cos(theta) - thetadot * r * Math.sin(theta);
  let ydot = rdot * Math.sin(theta) + thetadot * r * Math.cos(theta);
  return [xdot, ydot];
}

/**
 * Maps the point [x, y] at time 0 to the point at time t.
 */
function evolveCart(t, x, y) {
  sol = solve_ode(rhsCart, [0, t], [x, y]);
  return [sol.y[0].at(-1), sol.y[1].at(-1)];
}

/**
 * Evolves the trajectory until it completes a full 2π rotation.
 */
function fullRotationCart(dt, x, y) {
  let angleCompleted = 0;
  let trajectory = [[x, y]];
  let r = Math.sqrt(x ** 2 + y ** 2);
  let theta = Math.atan2(y, x);
  let num_steps = 0;
  while (angleCompleted < 2 * Math.PI && num_steps < 20000) {
    let [xnew, ynew] = evolveCart(dt, x, y);
    trajectory.push([xnew, ynew]);
    let thetanew = Math.atan2(ynew, xnew);
    if (thetanew >= theta) {
      angleCompleted += thetanew - theta;
    } else {
      angleCompleted += thetanew + 2 * Math.PI - theta;
    }
    // console.log('thetanew: ', thetanew);
    // console.log('angleCompleted: ', angleCompleted);
    theta = thetanew;
    x = xnew;
    y = ynew;
    num_steps += 1;
  }
  return trajectory;
}

/**
 * Transforms a vector of coordinates from [[x1, y1], [x2, y2], ...] into
 * {x: [x1, x2, ...], y: [y1, y2, ...]}
 */
function unzipCoordinates(coords) {
  return {
    x: coords.map(x => x[0]), y: coords.map(x => x[1])
  }
}

const layout = {
  margin: {l: 40, r: 40, t: 40, b: 30},
  xaxis: {range: [-2, 2], domain: [0.15, 0.6]},
  yaxis: {range: [-2, 2.1], scaleanchor: 'x1', domain: [0, 1]},
  xaxis2: {
    range: [0, 2.1],
    anchor: 'y2',
    domain: [0.7, 1.],
    nticks: 3,
    title: {
      text: 'starting point',
      standoff: 0,
    }
  },
  yaxis2: {
    anchor: 'x2',
    range: [0, 2.1],
    domain: [0.5, 1],
    nticks: 3,
    title: {
      text: 'return point',
      standoff: 0,
    }
  },
  //  paper_bgcolor: '#ffffff00',
  //  plot_bgcolor: '#ffffff00',
  showlegend: false,
  modebar: {
    remove: [
      'lasso', 'pan', 'select', 'zoom', 'zoomIn2d', 'zoomOut2d', 'autoscale',
      'resetScale2d'
    ]
  },
};

// Generate some streamlines to show the vector field
let startingPoints = [];
let insideRadius = 0.01;
let outsideRadius = 3;
for (let i = 0; i < 1; i++) {
  // inside starting point
  let theta = 2 * Math.PI / 1 * i;
  startingPoints.push(
      [insideRadius * Math.cos(theta), insideRadius * Math.sin(theta)]);
}
for (let i = 0; i < 3; i++) {
  // outside starting point
  let theta = 2 * Math.PI / 3 * i;
  startingPoints.push(
      [outsideRadius * Math.cos(theta), outsideRadius * Math.sin(theta)]);
}

let streamlineTraces = [];
let dt = 0.005;
for (const point of startingPoints) {
  let trajectory = [point];
  // squared distance to the absorbing cycle at r = 1
  let distanceToCycle = Math.abs(Math.sqrt(point[0] ** 2 + point[1] ** 2) - 1);
  let midDistance = distanceToCycle / 2;
  let t = 0.;
  let middleFound = false;
  let midx = [undefined, undefined];
  let midy = [undefined, undefined];
  while (distanceToCycle > 0.01 && t < 100) {
    let [x, y] = trajectory.at(-1);
    let [xnew, ynew] = evolveCart(dt, x, y);
    trajectory.push([xnew, ynew]);
    distanceToCycle = Math.abs(Math.sqrt(xnew ** 2 + ynew ** 2) - 1);
    t += dt;
    if (!middleFound && distanceToCycle < midDistance) {
      middleFound = true;
      midx = [x, xnew];
      midy = [y, ynew];
    }
  }
  let xvalues = unzipCoordinates(trajectory).x;
  let yvalues = unzipCoordinates(trajectory).y;

  streamlineTraces.push({
    x: xvalues,
    y: yvalues,
    mode: 'lines',
    line: {color: 'lightgray', width: 1}
  });
  streamlineTraces.push({
    x: midx,
    y: midy,
    xaxis: 'x1',
    yaxis: 'y1',
    mode: 'markers',
    marker: {
      angleref: 'previous',
      symbol: 'triangle-up',
      size: 8,
      color: 'lightgray'
    },
  });
}

let xcycle = [];
let ycycle = [];
let xarrows = [];
let yarrows = [];
let markermask = [];

for (let i = 0; i < 101; i++) {
  let theta = 2 * Math.PI / 100 * i;
  xcycle.push(Math.cos(theta));
  ycycle.push(Math.sin(theta));
}

for (let i = 0; i < 5; i++) {
  let theta = 2 * Math.PI / 5 * i - 0.2;
  xarrows.push(Math.cos(theta));
  xarrows.push(Math.cos(theta + 0.01));
  yarrows.push(Math.sin(theta));
  yarrows.push(Math.sin(theta + 0.01));
  markermask.push(0);
  markermask.push(1);
}

let cycleTrace = [
  {x: xcycle, y: ycycle, mode: 'lines', line: {color: 'red'}}, {
    x: xarrows,
    y: yarrows,
    xaxis: 'x1',
    yaxis: 'y1',
    mode: 'markers',
    marker: {
      angleref: 'previous',
      symbol: 'triangle-up',
      size: 8,
      color: markermask,
      colorscale: [[0, '#ffffff00'], [1, 'red']]
    },
  }
];

// =====================================================================
// ---------------------------- first figure ---------------------------

let vectorPlot = document.getElementById('vectorPlot');

Plotly.newPlot(vectorPlot, structuredClone(streamlineTraces), layout);
Plotly.addTraces(vectorPlot, cycleTrace);

// =====================================================================
// ---------------------------- second figure --------------------------

let singleTrajectory = document.getElementById('singleTrajectory');

Plotly.newPlot(singleTrajectory, structuredClone(streamlineTraces), layout);
Plotly.addTraces(singleTrajectory, cycleTrace);

let annotations = {
  annotations: [
    {
      x: 0,
      y: 1,
      xref: 'x',
      yref: 'y',
      text: 'y',
      showarrow: true,
      arrowhead: 6,
      ax: 30,
      ay: -10,
      arrowwidth: 1,
    },
    {
      x: 0,
      y: 1.3,
      xref: 'x',
      yref: 'y',
      text: 'x',
      showarrow: true,
      arrowhead: 6,
      ax: 30,
      ay: -20,
      arrowwidth: 1,
    },
  ]
};

// Plotly.relayout(singleTrajectory, annotations);

let crossectionTrace = {
  x: [0, 0],
  y: [0.0, 2.],
  xaxis: 'x1',
  yaxis: 'y1',
  mode: 'lines+markers',
  marker: {symbol: 'line-ew-open', size: 10, color: 'orange', line: {width: 3}},
  line: {color: 'orange', width: 3}
};

Plotly.addTraces(singleTrajectory, crossectionTrace);

let p = [0.0, 1.3];
let trajectory = fullRotationCart(dt, p[0], p[1]);
let trajectoryFrames = [];

for (let i = 0; i < trajectory.length; i += 10) {
  let tracedata = {x: [[trajectory[i][0]]], y: [[trajectory[i][1]]]};
  trajectoryFrames.push(tracedata);
}
// push the last datapoint
let tracedata = {x: [[trajectory.at(-1)[0]]], y: [[trajectory.at(-1)[1]]]};
trajectoryFrames.push(tracedata);

const numFrames = trajectoryFrames.length;

let initialCondition = {
  x: [p[0]],
  y: [p[1]],
  xaxis: 'x1',
  yaxis: 'y1',
  line: {color: 'purple', width: 2},
  mode: 'lines',
};
Plotly.addTraces(singleTrajectory, initialCondition);

let poincareAnimTrace = {
  x: [p[1]],
  y: trajectoryFrames.at(-1).y[0],
  xaxis: 'x2',
  yaxis: 'y2',
  mode: 'markers',
  marker: {size: 8, color: 'purple', symbol: 'x'},
};

let startFinishAnimTrace = {
  x: [p[0]],
  y: [p[1]],
  xaxis: 'x1',
  yaxis: 'y1',
  mode: 'markers',
  marker: {size: 8, color: 'purple', symbol: 'x'},
};
Plotly.addTraces(singleTrajectory, startFinishAnimTrace);

let currentFrame = 0;

let animationPlaying = false;
let finishedFirstTime = false;

async function drawFrame() {
  if (!animationPlaying) {
    return;
  }
  if (currentFrame >= numFrames) {
    animationPlaying = false;
    if (!finishedFirstTime) {
      await Plotly.extendTraces(
          singleTrajectory, trajectoryFrames[numFrames - 1], [12]);
      await Plotly.addTraces(singleTrajectory, poincareAnimTrace);
      finishedFirstTime = true;
    }
    document.getElementById('stepButton').innerHTML = 'Play';
    return;
  }
  await Plotly.extendTraces(
      singleTrajectory, trajectoryFrames[currentFrame], [11]);
  currentFrame += 1;
  setTimeout(drawFrame, 10);
}
setTimeout(drawFrame, 10);

const stepButton = document.getElementById('stepButton');

stepButton.addEventListener('click', () => {
  animationPlaying = !animationPlaying;
  stepButton.innerHTML = animationPlaying ? 'Reset' : 'Play';
  if (animationPlaying) {
    currentFrame = 0;
    Plotly.deleteTraces(singleTrajectory, [11]);
    Plotly.addTraces(singleTrajectory, initialCondition, [11]);
    setTimeout(drawFrame, 60);
  }
});

// =====================================================================
// ---------------------------- third figure ---------------------------

let allTrajectories = document.getElementById('allTrajectories');

Plotly.newPlot(allTrajectories, structuredClone(streamlineTraces), layout);
Plotly.addTraces(allTrajectories, cycleTrace);
Plotly.addTraces(allTrajectories, crossectionTrace);

let trajectories = [];
let yStart = [];
let yFinal = [];
let dy = 0.1;

// compute the poincare map
for (let y0 = 0.0; y0 < 2.05; y0 += dy) {
  yStart.push(y0);
  let trajectory = fullRotationCart(dt, 0., y0)
  trajectories.push(trajectory);
  yFinal.push(trajectory.at(-1)[1]);
}

let trajectoryTrace = {
  x: [],
  y: [],
  xaxis: 'x1',
  yaxis: 'y1',
  line: {color: 'purple', width: 2},
  mode: 'lines',
};
Plotly.addTraces(allTrajectories, trajectoryTrace);  // trace 11

let startFinishTrace = {
  x: [],
  y: [],
  xaxis: 'x1',
  yaxis: 'y1',
  mode: 'markers',
  marker: {size: 8, color: 'purple', symbol: 'x'},
};
Plotly.addTraces(allTrajectories, startFinishTrace);  // trace 12

let poincareLineTrace = {
  x: yStart,
  y: yFinal,
  xaxis: 'x2',
  yaxis: 'y2',
  mode: 'lines',
  line: {width: 2, color: 'purple'},
};
Plotly.addTraces(allTrajectories, poincareLineTrace);  // trace 13

let poincareMarkerTrace = {
  x: [],
  y: [],
  xaxis: 'x2',
  yaxis: 'y2',
  mode: 'markers',
  marker: {size: 8, color: 'purple', symbol: 'x'},
};
Plotly.addTraces(allTrajectories, poincareMarkerTrace);  // trace 14

setPoincareTrajectory(1.3);

function setPoincareTrajectory(y0) {
  let ind = yStart.findIndex(y => Math.abs(y - y0) < 1e-4);
  let y1 = yFinal[ind];
  let trace = {
    x: [unzipCoordinates(trajectories[ind]).x],
    y: [unzipCoordinates(trajectories[ind]).y]
  };
  Plotly.update(allTrajectories, trace, {}, [11]);
  Plotly.update(allTrajectories, {x: [[0, 0]], y: [[y0, y1]]}, {}, [12]);
  Plotly.update(allTrajectories, {x: [[y0]], y: [[y1]]}, {}, [14]);
  return y1;
}

const slider = document.getElementById('x2Slider');
const label = document.getElementById('x2SliderLabel');
label.innerHTML = `x<sub>2</sub> = ${slider.value}`;

slider.oninput = () => {
  label.innerHTML = `x<sub>2</sub> = ${slider.value}`;
  let startingValue = parseFloat(slider.value);
  setPoincareTrajectory(startingValue);
  let startingPoint = document.getElementById('startingPointSpan');
  let returnPoint = document.getElementById('returnPointSpan');
  startingPoint.innerText =
      `$\\mathbf{x} = \\begin{pmatrix} x_1 & x_2 \\end{pmatrix}^T = \\begin{pmatrix} 0 & ${
          startingValue.toFixed(1)} \\end{pmatrix}^T$`
  let ind = yStart.findIndex(y => Math.abs(y - startingValue) < 1e-4);
  let returnValue = yFinal[ind];
  returnPoint.innerHTML =
      `$\\mathbf{x}' = \\begin{pmatrix} x_1' & x_2' \\end{pmatrix}^T = \\begin{pmatrix} 0 & ${
          returnValue.toFixed(2)} \\end{pmatrix}^T$`
  MathJax.typeset();
};

// =====================================================================
// ---------------------------- forth figure ---------------------------


let poincarePlot = document.getElementById('poincarePlot');

const layout2 = {
  margin: {l: 40, r: 40, t: 40, b: 30},
  xaxis2:
      {range: [0, 2.1], title: 'starting point', domain: [0.2, 0.8], nticks: 3},
  yaxis2: {range: [0, 2.1], title: 'return point', domain: [0, 1], nticks: 3},
  //  paper_bgcolor: '#ffffff00',
  //  plot_bgcolor: '#ffffff00',
  showlegend: false,
  modebar: {
    remove: [
      'lasso', 'pan', 'select', 'zoom', 'zoomIn2d', 'zoomOut2d', 'autoscale',
      'resetScale2d'
    ]
  },
};

let unityLine = {
  x: [0, 2],
  y: [0, 2],
  xaxis: 'x2',
  yaxis: 'y2',
  line: {color: 'lightgray', width: 1},
  mode: 'lines',
};

let fixpoint = {
  x: [1],
  y: [1],
  xaxis: 'x2',
  yaxis: 'y2',
  mode: 'markers',
  marker: {symbol: 'circle', size: 8, color: 'purple'},
};

Plotly.newPlot(poincarePlot, [unityLine], layout2);
Plotly.addTraces(poincarePlot, poincareLineTrace);
Plotly.addTraces(poincarePlot, fixpoint);