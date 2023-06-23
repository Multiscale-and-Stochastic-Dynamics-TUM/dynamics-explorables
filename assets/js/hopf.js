import Plotly from 'plotly.js-dist-min';

import {linspace} from './modules/data_structures/iterables';

const NUM_POINTS = 1000;
const STARTING_P = -1.3;

// Style constants
const STABLE_LINE_STYLE = {
  color: 'blue',
  width: 5
};

const UNSTABLE_LINE_STYLE = {
  color: 'blue',
  width: 5,
  dash: 'dash'
};

const INTERSECTION_LINE_STYLE = {
  color: 'orange',
  width: 7
};

const INTERSECTION_MARKER_STYLE = {
  color: 'orange',
  size: 5
};

const EIGENVAL_MARKER = {
  color: 'Purple',
  size: 10
};

const SPIRAL_LINE_STYLE = {
  color: 'green',
  with: 1
};

const LAYOUT_3D = {
  margin: {l: 40, r: 20, t: 20, b: 30},
  scene: {
    xaxis: {
      range: [-4, 4],
      visible: true,
      tick0: -50,
      dtick: 25,
      zerolinewidth: 2,
      title: 'x2'
    },
    yaxis: {
      range: [-4, 4],
      visible: true,
      tick0: -50,
      dtick: 25,
      zerolinewidth: 2,
      title: 'p'
    },
    zaxis: {
      range: [-4, 4],
      visible: true,
      tick0: 0,
      dtick: 25,
      zerolinewidth: 2,
      title: 'x1'
    },
    aspectmode: 'cube',
    camera: {
      up: {x: 1, y: 0, z: 0},
      center: {x: 0, y: 0, z: 0},
      eye: {x: 0.0, y: 1.4, z: 1.4}
    },
    dragmode: 'orbit',
  },
  modebar: {remove: ['pan3d']},
  paper_bgcolor: '#ffffff00',
  width: 600,
  height: 500
};

// Generate data for the 3D parabola of stability
function get3Dstability(gridLim = 4.0, meshSize = 50) {
  var x = [];
  var y = [];
  var z = [];

  var v = linspace(-gridLim, gridLim, meshSize)
  for (var i = 0; i < meshSize; i++) {
    for (var j = 0; j < meshSize; j++) {
      x.push(v[j]);
      y.push(v[i]);
      z.push(v[j] * v[j] + v[i] * v[i])
    }
  }
  return [x, y, z];
};

function getIntersectionRing(param_p) {
  let lins = linspace(0, 2 * Math.PI, NUM_POINTS)
  let x = [];
  let y = [];
  let z = [];
  if (param_p <= 0) {
    return {'x': x, 'y': y, 'z': z};
  };
  for (let i = 0; i < NUM_POINTS; i++) {
    x.push(Math.sqrt(param_p) * Math.cos(lins[i]));
    y.push(Math.sqrt(param_p) * Math.sin(lins[i]));
    z.push(param_p);
  }
  return {'x': x, 'y': y, 'z': z};
};

function getIntersectionPoint(param_p) {
  if (param_p > 0) {
    return {'x': [], 'y': [], 'z': []};
  };
  return {'x': [0], 'y': [0], 'z': [param_p]};
};


function getSpiral(param_p) {
  let theta = linspace(0, 5 * Math.PI, 2000)
  let r = 0;
  let x = [];
  let y = [];
  for (let i = 0; i < 2000; i++) {
    if (param_p > 0) {
      r = 0.05 * Math.sqrt(param_p) * theta[i]
    } else {
      r = 0.05 * Math.sqrt(2.0) * theta[i]
    };
    x.push(r * Math.cos(theta[i]));
    y.push(r * Math.sin(theta[i]));
  }
  return res = { 'x': x, 'y': y }
};

let plotlyDiv = document.getElementById('plotlyHopf');
let multiplotDiv = document.getElementById('plotlyMultiplot');

var xyzData = get3Dstability();
var trace3Dcone = {
  x: xyzData[0],
  y: xyzData[1],
  z: xyzData[2],
  opacity: 0.6,
  color: 'blue',
  type: 'mesh3d'
};

// Add all the traces
var traceStableLineEq = {
  x: [0, 0],
  y: [0, 0],
  z: [-15, 0],
  mode: 'lines',
  opacity: 0.6,
  color: 'blue',
  type: 'scatter3d',
  line: STABLE_LINE_STYLE,
  showlegend: false
};

var traceUnstableLineEq = {
  x: [0, 0],
  y: [0, 0],
  z: [0, 15],
  mode: 'lines',
  opacity: 0.6,
  color: 'blue',
  type: 'scatter3d',
  line: UNSTABLE_LINE_STYLE,
  showlegend: false
};

let xyzDataPlane = get3Dstability(4.0, 2);
let traceCuttingPlane = {
  x: xyzDataPlane[0],
  y: xyzDataPlane[1],
  z: Array(xyzDataPlane[0].length).fill(STARTING_P),
  opacity: 0.2,
  color: 'red',
  type: 'mesh3d',
  showlegend: false
};

let traceIntersectionRing = {
  x: [],
  y: [],
  z: [],
  mode: 'lines',
  type: 'scatter3d',
  line: INTERSECTION_LINE_STYLE,
  showlegend: false
};

let traceIntersectionPoint = {
  x: [0],
  y: [0],
  z: [STARTING_P],
  mode: 'markers',
  type: 'scatter3d',
  marker: INTERSECTION_MARKER_STYLE,
  showlegend: false
};


var plotData = [
  trace3Dcone, traceStableLineEq, traceUnstableLineEq, traceCuttingPlane,
  traceIntersectionRing, traceIntersectionPoint
];
Plotly.newPlot(plotlyDiv, plotData, LAYOUT_3D);

// TODO Implement the two bottom plots
var traceEigenvals = {
  x: [STARTING_P, STARTING_P],
  y: [1, -1],
  xaxis: 'x1',
  yaxis: 'y1',
  type: 'scatter',
  mode: 'markers',
  marker: EIGENVAL_MARKER,
  showlegend: false
};

spiralData = getSpiral(STARTING_P);
var traceSpiral = {
  x: spiralData['x'],
  y: spiralData['y'],
  xaxis: 'x2',
  yaxis: 'y2',
  mode: 'lines',
  line: SPIRAL_LINE_STYLE,
  showlegend: false
};

var traceStability = {
  x: [0],
  y: [0],
  xaxis: 'x2',
  yaxis: 'y2',
  mode: 'markers',
  showlegend: false
};

var data = [traceEigenvals, traceStability, traceSpiral];

var layout = {
  grid: {rows: 1, columns: 2, pattern: 'independent'},
  title: ['A', 'B'],
  xaxis: {
    title: 'Re',
    range: [-2.5, 2.5],
  },
  yaxis: {
    title: 'Im',
    range: [-1.5, 1.5],
  },
  xaxis2: {
    title: 'x1',
    range: [-2.5, 2.5],
  },
  yaxis2: {
    title: 'x2',
    range: [-2.5, 2.5],
  },
  annotations: [
    {
      text: 'Eigenvalues',
      font: {
        size: 16,
        color: 'black',
      },
      showarrow: false,
      align: 'center',
      x: 0.13,
      y: 1.15,
      xref: 'paper',
      yref: 'paper',
    },
    {
      text: 'Stability',
      font: {
        size: 16,
        color: 'black',
      },
      showarrow: false,
      align: 'center',
      x: 0.835,
      y: 1.15,
      xref: 'paper',
      yref: 'paper',
    }
  ],
  width: 650,
  height: 400
};

Plotly.newPlot(multiplotDiv, data, layout);

const parampSlider = document.getElementById('parampSlider');
const parampLabel = document.getElementById('parampSliderLabel');
parampLabel.innerHTML = `p = ${parampSlider.value}`;

parampSlider.oninput = () => {
  let p = parampSlider.value;
  parampLabel.innerHTML = `p = ${p}`;

  var xyzDataPlane = get3Dstability(4.0, 2);
  let interR = getIntersectionRing(p);
  let interP = getIntersectionPoint(p);

  var updatedTraces = {
    x: [xyzDataPlane[0], interR['x'], interP['x']],
    y: [xyzDataPlane[1], interR['y'], interP['y']],
    z: [Array(xyzDataPlane[0].length).fill(p), interR['z'], interP['z']]
  };
  Plotly.update(plotlyDiv, updatedTraces, {}, [3, 4, 5]);

  let intersectionX = [];
  let intersectionY = [];
  let mode = [];
  if (p > 0) {
    intersectionX = interR['x'];
    intersectionY = interR['y'];
    mode = ['markers', 'lines', 'lines'];
  } else {
    intersectionX = [0];
    intersectionY = [0];
    mode = ['markers', 'markers', 'lines'];
  };

  spiralData = getSpiral(p);
  let multiplotTraces = {
    x: [[p, p], intersectionX, spiralData['x']],
    y: [[1, -1], intersectionY, spiralData['y']],
    mode: mode
  };
  Plotly.update(multiplotDiv, multiplotTraces, layout, [0, 1, 2]);
};