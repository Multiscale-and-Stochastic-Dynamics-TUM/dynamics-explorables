import Plotly from 'plotly.js-dist-min'

import {linspace} from './modules/data_structures/iterables';
import {getCSSColor} from './modules/design/colors';
import {streamlines} from './modules/plotly/streamlines';
import {solve_ode} from './modules/simulation/ode_solver';

const RED = getCSSColor('--red');
const ORANGE = getCSSColor('--orange');
const PURPLE = getCSSColor('--purple');
const STREAMLINE_COLOR = `${getCSSColor('--secondary')}44`;
const STROKE_COLOR = getCSSColor('--content');

const config = {
  responsive: true,
  staticPlot: true,
  displayModeBar: false,
};

let windowWidth = window.screen.width;
let mobile = windowWidth < 440;

// =====================================================================
// ---------------------------- RACING EXAMPLE -------------------------

const carX = 0.9;
let carY = 0.5

function carReturnHeight(y0) {
  return 0.1 * y0 * ((y0 - 1) ** 2 + 4);
}

let emojiSize = mobile ? 22 : 30;
let roadHeight = mobile ? 3.6 : 2.8;
let checkboardStart = -(roadHeight / 2 - 0.2);
let checkboardEnd = roadHeight / 2 - 0.2;
let yellowLineWidth = 0.05;

let carTraces = [
  {
    // a ghost image of the old position
    mode: 'text',
    x: [carX],
    y: [carY],
    text: ['🏎️'],
    type: 'scatter',
    textfont: {size: emojiSize},
    opacity: 0.3
  },
  {
    // solid car that is moving
    mode: 'text',
    x: [carX],
    y: [carY],
    text: ['🏎️'],
    type: 'scatter',
    textfont: {size: emojiSize}
  },
  {
    // an observer
    mode: 'text',
    x: [0],
    y: [roadHeight / 2 + 0.2],
    text: ['🙇‍♀️'],
    type: 'scatter',
    textfont: {size: emojiSize}
  },
];

let raceTrackLayout = {
  showlegend: false,
  xaxis: {range: [-4, 4], zeroline: false, showgrid: false, visible: false},
  yaxis: {range: [-2.0, 2.6], zeroline: false, showgrid: false, visible: false},
  margin: {l: 0, r: 0, t: 0, b: 20},
  shapes: [
    {
      // the gray track
      type: 'rect',
      xref: 'paper',
      yref: 'y',
      x0: 0,
      y0: -roadHeight / 2,
      x1: 1,
      y1: roadHeight / 2,
      fillcolor: '#666666',
      opacity: 1,
      line: {width: 0},
      layer: 'below',
    },
    {
      // yellow line below
      type: 'rect',
      xref: 'paper',
      yref: 'y',
      x0: 0,
      y0: checkboardStart,
      x1: 1,
      y1: checkboardStart - yellowLineWidth,
      fillcolor: '#EFC14C',
      opacity: 1,
      line: {width: 0},
      layer: 'below',
    },
    {
      // yellow line above
      type: 'rect',
      xref: 'paper',
      yref: 'y',
      x0: 0,
      y0: checkboardEnd + yellowLineWidth,
      x1: 1,
      y1: checkboardEnd,
      fillcolor: '#EFC14C',
      opacity: 1,
      line: {width: 0},
      layer: 'below',
    }
  ]
};

let boxHeight = (checkboardEnd - checkboardStart) / 8;
// add the checkboard starting line
for (let i = 0; i < 8; i++) {
  let firstColor = i % 2 == 0 ? 'white' : 'black'
  let secondColor = i % 2 == 0 ? 'black' : 'white'
  // left square
  raceTrackLayout.shapes.push({
    type: 'rect',
    xref: 'x',
    yref: 'y',
    x0: boxHeight,
    y0: checkboardStart + i * boxHeight,
    x1: 0,
    y1: checkboardStart + (i + 1) * boxHeight,
    fillcolor: firstColor,
    opacity: 1,
    line: {width: 0},
    layer: 'below',
  });
  // right square
  raceTrackLayout.shapes.push({
    type: 'rect',
    xref: 'x',
    yref: 'y',
    x0: 0,
    y0: checkboardStart + i * boxHeight,
    x1: -boxHeight,
    y1: checkboardStart + (i + 1) * boxHeight,
    fillcolor: secondColor,
    opacity: 1,
    line: {width: 0},
    layer: 'below',
  })
}


// =====================================================================
// ---------------------------- car figure ---------------------------

Plotly.newPlot('carExample', carTraces, raceTrackLayout, config);

carButton = document.getElementById('carButton')

carButton.addEventListener('click', async () => {
  carButton.disabled = true;

  // reset the position of the ghost car
  Plotly.restyle('carExample', {y: [[carY]]}, [0]);

  await Plotly.animate(
      'carExample', {data: [{x: [-5]}], traces: [1]},
      {transition: {duration: 800, easing: 'cubic-in-out'}});

  carY = carReturnHeight(carY);

  await Plotly.animate(
      'carExample', {data: [{x: [5], y: [carY]}], traces: [1]},
      {transition: {duration: 0}});
  await Plotly.animate(
      'carExample', {data: [{x: [carX]}], traces: [1]},
      {transition: {duration: 400, easing: 'cubic-in-out'}});

  carButton.disabled = false;
})

carSlider = document.getElementById('carSlider');

carSlider.oninput = () => {
  carY = parseFloat(carSlider.value);
  Plotly.restyle('carExample', {y: [[carY]]}, [1]);
};

// =====================================================================
// ---------------------------- carPoincare ---------------------------

let carPoincareSlider = document.getElementById('carSlider2');

let startPos = parseFloat(carPoincareSlider.value);
let returnPos = carReturnHeight(startPos);

let carPoincareMap = {
  x: linspace(-1.1, 1.1, 100),
  y: linspace(-1.1, 1.1, 100).map(carReturnHeight),
  mode: 'lines',
  line: {color: PURPLE},
};

let carPoincareMapMarker = {
  x: [startPos],
  y: [returnPos],
  mode: 'markers',
  marker: {size: 10, color: PURPLE, symbol: 'x'},
};

let carTrajectory1 = {
  x: [-5, carX],
  y: [startPos, startPos],
  mode: 'lines',
  line: {color: PURPLE},
};

let carTrajectory2 = {
  x: [5, carX],
  y: [returnPos, returnPos],
  mode: 'lines',
  line: {color: PURPLE},
};

let carDiagonal = {
  x: [-1, 1],
  y: [-1, 1],
  mode: 'lines',
  line: {color: 'gray', dash: 'dot'},
};

let carTrajectoryMarker = {
  x: [carX, carX - 3, carX, carX + 3],
  y: [startPos, startPos, returnPos, returnPos],
  xaxis: 'x1',
  yaxis: 'y1',
  mode: 'markers',
  marker: {size: 10, color: PURPLE, symbol: 'triangle-left'},
};

let carPoincareStablePoints = {
  x: [0],
  y: [0],
  mode: 'markers',
  marker: {size: 8, color: PURPLE, symbol: 'o'},
};

Plotly.newPlot(
    'carTrajectory',
    [carTrajectory1, carTrajectory2, carTrajectoryMarker, carTraces[2]],
    raceTrackLayout, config);

const carPoincareLayout = {
  margin: {l: 40, r: 20, t: 20, b: 50},
  xaxis: {range: [-1.1, 1.1], title: {text: 'start height', standoff: 5}},
  yaxis:
      {range: [-1.1, 1.1], title: 'return height', automargin: true, nticks: 3},
  showlegend: false,
};

Plotly.newPlot(
    'carPoincareMap',
    [
      carDiagonal, carPoincareMap, carPoincareStablePoints, carPoincareMapMarker
    ],
    carPoincareLayout, config);

carPoincareSlider.oninput = () => {
  startPos = parseFloat(carPoincareSlider.value);
  returnPos = carReturnHeight(startPos);
  Plotly.restyle(
      'carTrajectory', {
        x: [[-5, carX], [5, carX], [carX, carX - 3, carX, carX + 3]],
        y: [
          [startPos, startPos], [returnPos, returnPos],
          [startPos, startPos, returnPos, returnPos]
        ]
      },
      [0, 1, 2]);
  Plotly.restyle('carPoincareMap', {x: [[startPos]], y: [[returnPos]]}, [3]);
};

// =====================================================================
// ---------------------------- ZOOMING OUT ---------------------------

// =====================================================================
// ---------------------------- ODE definitions ------------------------

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
 * Evolves the trajectory until it completes a full 2π rotation.
 * The function assumes that we are moving anti-clockwise.
 */
function fullRotation(x, y) {
  let xtrajectory = [x];
  let ytrajectory = [y];

  let theta = (Math.atan2(y, x) + Math.PI) % (Math.PI * 2);
  let thetaStart = theta;

  tlast = 0;
  xlast = x;
  ylast = y;
  dt = 0.1;

  let num_steps = 0;
  while (num_steps < 1000) {
    let newTraj = solve_ode(rhsCart, [tlast, tlast + dt], [xlast, ylast]);
    xtrajectory = xtrajectory.concat(newTraj.y[0]);
    ytrajectory = ytrajectory.concat(newTraj.y[1]);

    tlast = newTraj.t.at(-1);
    xlast = xtrajectory.at(-1);
    ylast = ytrajectory.at(-1);

    // search for the index where the trajectory made a full revolution
    let id = xtrajectory.findIndex((x, id) => {
      if (id == 0) {
        return false;
      }
      let y = ytrajectory[id];
      let xPrev = xtrajectory[id - 1];
      let yPrev = ytrajectory[id - 1];
      let theta = (Math.atan2(y, x) + Math.PI) % (Math.PI * 2);
      let thetaPrev = (Math.atan2(yPrev, xPrev) + Math.PI) % (Math.PI * 2);

      return theta > thetaStart && thetaPrev < thetaStart;
    });

    // if such point was found, break the loop
    if (id > -1) {
      xtrajectory = xtrajectory.slice(0, id + 1);
      ytrajectory = ytrajectory.slice(0, id + 1);
      break;
    }

    num_steps += 1;
  }

  return {x: xtrajectory, y: ytrajectory};
}

// Generate some streamlines to show the vector field
function getStartingPoints() {
  let startingPoints = [];
  let insideRadius = 0.3;
  let outsideRadius = 2;

  // inside starting point
  startingPoints.push([insideRadius, 0]);

  // outside starting point
  for (let i = 0; i < 3; i++) {
    let theta = 2 * Math.PI / 3 * i;
    startingPoints.push(
        [outsideRadius * Math.cos(theta), outsideRadius * Math.sin(theta)]);
  }
  return startingPoints;
}

const ODELayout = {
  margin: {l: 20, r: 20, t: 20, b: 50},
  xaxis:
      {range: [-2, 2], domain: [0.1, 0.9], scaleanchor: 'y', showgrid: false},
  yaxis: {range: [-2, 2.1], showgrid: false},
  showlegend: false,
};

const poincareLayout = {
  margin: {l: 40, r: 40, t: 20, b: 50},
  xaxis: {range: [0, 2], title: {text: 'x', standoff: 5}},
  yaxis: {range: [0, 2.1], title: 'x\'', automargin: true, nticks: 3},
  showlegend: false,
};

// trigger the update of the ODELayout
Plotly.newPlot('vectorPlot', [], ODELayout);

let startingPoints = getStartingPoints();

let criticalPoints = [[0, 0]];

// add several points on the unit circle to critical points, so that
// numerical integration doesn't orbit forever on the circle.
for (let i = 0; i < 10; i++) {
  let theta = Math.PI * 2 / 10 * i;
  criticalPoints.push([Math.cos(theta), Math.sin(theta)]);
}

const streamlineKwargs = {
  line: {width: 1, color: STREAMLINE_COLOR},
  layout: ODELayout,
  config: config,
  startingCoords: startingPoints,
  criticalPoints: criticalPoints,
  criticalPointSafeSpace: 0.05,
  brokenStreamlines: false,
  noDisplay: true,
}

let streamlineTraces = streamlines(
    undefined, rhsCart, [], ODELayout.xaxis.range, ODELayout.yaxis.range,
    streamlineKwargs);

// compute the red orbit
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
  {x: xcycle, y: ycycle, mode: 'lines', line: {color: RED}}, {
    x: xarrows,
    y: yarrows,
    mode: 'markers',
    marker: {
      angleref: 'previous',
      symbol: 'triangle-up',
      size: 8,
      color: markermask,
      colorscale: [[0, '#ffffff00'], [1, RED]]
    },
  }
];

// =====================================================================
// ------------------------- vector plot figure ------------------------

let vectorPlot = document.getElementById('vectorPlot');

Plotly.newPlot(
    vectorPlot, structuredClone(streamlineTraces), structuredClone(ODELayout),
    config);
Plotly.addTraces(vectorPlot, cycleTrace);

// =====================================================================
// ------------------- single trajectory animation ---------------------

let singleTrajectory = document.getElementById('singleTrajectory');

Plotly.newPlot(
    singleTrajectory, structuredClone(streamlineTraces),
    structuredClone(ODELayout), config);
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
    }
  ]
};

Plotly.relayout(singleTrajectory, annotations);

let crossectionTrace = {
  x: [0, 0],
  y: [0.0, 2.],
  mode: 'lines+markers',
  marker: {symbol: 'line-ew-open', size: 10, color: ORANGE, line: {width: 2}},
  line: {color: ORANGE, width: 2}
};

Plotly.addTraces(singleTrajectory, crossectionTrace);

let x0 = 0.0;
let y0 = 1.3;
let trajectory = fullRotation(x0, y0);
let trajectoryFrames = [];

for (let i = 0; i < trajectory.x.length - 1; i += 2) {
  let tracedata = {
    x: [trajectory.x.slice(i, i + 2)],
    y: [trajectory.y.slice(i, i + 2)]
  };
  trajectoryFrames.push(tracedata);
}
// push the last datapoint
let tracedata = {x: [[0]], y: [[trajectory.y.at(-1)]]};
trajectoryFrames.push(tracedata);

const numFrames = trajectoryFrames.length;

let animTrajectoryLineTrace = {
  x: [x0],
  y: [y0],
  line: {color: PURPLE, width: 2},
  mode: 'lines',
};
Plotly.addTraces(singleTrajectory, animTrajectoryLineTrace);

// The id of the line trace to reference it later
let animTrajectoryLineId = singleTrajectory.data.length - 1;

let animTrajectoryMarkersTrace = {
  x: [x0],
  y: [y0],
  mode: 'markers',
  marker: {size: 8, color: PURPLE, symbol: 'x'},
};
Plotly.addTraces(singleTrajectory, animTrajectoryMarkersTrace);

// The id of the markers to reference it later
let animTrajectoryMarkersId = singleTrajectory.data.length - 1;

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
          singleTrajectory, trajectoryFrames[numFrames - 1],
          [animTrajectoryMarkersId]);
      finishedFirstTime = true;
    }
    document.getElementById('stepButton').innerHTML = 'Play';
    return;
  }

  await Plotly.extendTraces(
      singleTrajectory, trajectoryFrames[currentFrame], [animTrajectoryLineId]);
  currentFrame += 1;
  setTimeout(drawFrame, 30);
}
setTimeout(drawFrame, 30);

const stepButton = document.getElementById('stepButton');

stepButton.addEventListener('click', () => {
  animationPlaying = !animationPlaying;
  stepButton.innerHTML = animationPlaying ? 'Reset' : 'Play';
  if (animationPlaying) {
    currentFrame = 0;
    Plotly.deleteTraces(singleTrajectory, [animTrajectoryLineId]);
    Plotly.addTraces(
        singleTrajectory, animTrajectoryLineTrace, [animTrajectoryLineId]);
    setTimeout(drawFrame, 30);
  }
});

// =====================================================================
// ------------------ full trajectory with a slider --------------------

let allTrajectories = document.getElementById('allTrajectories');
let poincareMapDiv = document.getElementById('poincareMap');

Plotly.newPlot(
    allTrajectories, structuredClone(streamlineTraces), ODELayout, config);
Plotly.addTraces(allTrajectories, cycleTrace);
Plotly.addTraces(allTrajectories, crossectionTrace);

let trajectories = [];
let yStart = [];
let yFinal = [];
let dy = 0.1;

// compute the poincare map
for (let y0 = 0.0; y0 < 2.05; y0 += dy) {
  yStart.push(y0);
  let trajectory = fullRotation(0., y0)
  trajectories.push(trajectory);
  yFinal.push(trajectory.y.at(-1));
}

let fullTrajectoryLineTrace = {
  x: [],
  y: [],
  line: {color: PURPLE, width: 2},
  mode: 'lines',
};
Plotly.addTraces(allTrajectories, fullTrajectoryLineTrace);

let fullLineId = allTrajectories.data.length - 1;

let fullTrajectoryMarkerTrace = {
  x: [],
  y: [],
  mode: 'markers',
  marker: {size: 8, color: PURPLE, symbol: 'x'},
};
Plotly.addTraces(allTrajectories, fullTrajectoryMarkerTrace);

let fullMarkerId = allTrajectories.data.length - 1;

let poincareLineTrace = {
  x: yStart,
  y: yFinal,
  mode: 'lines',
  line: {width: 2, color: PURPLE},
};

let poincareMarkerTrace = {
  x: [],
  y: [],
  mode: 'markers',
  marker: {size: 8, color: PURPLE, symbol: 'x'},
};

let poincareStablePoints = {
  x: [0, 1],
  y: [0, 1],
  mode: 'markers',
  marker: {size: 8, color: PURPLE, symbol: 'o'},
};

let diagonal = {
  x: [0, 2],
  y: [0, 2],
  mode: 'lines',
  line: {color: 'gray', dash: 'dot'},
};

Plotly.newPlot(
    poincareMapDiv,
    [diagonal, poincareLineTrace, poincareStablePoints, poincareMarkerTrace],
    poincareLayout, config);
let poincareMarkerId = poincareMapDiv.data.length - 1;

setPoincareTrajectory(1.3);

function setPoincareTrajectory(y0) {
  let ind = yStart.findIndex(y => Math.abs(y - y0) < 1e-4);
  let y1 = yFinal[ind];
  let trace = {x: [trajectories[ind].x], y: [trajectories[ind].y]};
  Plotly.update(allTrajectories, trace, {}, [fullLineId]);
  Plotly.update(
      allTrajectories, {x: [[0, 0]], y: [[y0, y1]]}, {}, [fullMarkerId]);
  Plotly.update(poincareMapDiv, {x: [[y0]], y: [[y1]]}, {}, [poincareMarkerId]);
  return y1;
}

const slider = document.getElementById('x2Slider');
const label = document.getElementById('x2SliderLabel');
label.innerHTML = `x<sub>2</sub> = ${slider.value}`;

slider.oninput = () => {
  label.innerHTML = `x<sub>2</sub> = ${slider.value}`;
  let startingValue = parseFloat(slider.value);

  setPoincareTrajectory(startingValue);

  // change the latex in the text
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