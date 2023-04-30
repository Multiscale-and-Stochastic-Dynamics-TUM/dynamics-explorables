import Plotly from 'plotly.js-dist-min';

import {linspace} from './modules/data_structures/iterables';

const X_LIMINF = -2.0;
const x_LIMSUP = 2.0;
const NUM_POINTS = 10000;

const LAYOUT_PITCHFORK = {
  margin: {l: 40, r: 20, t: 20, b: 30},
  xaxis: {
    title: 'x',
    range: [-2, 2],
  },
  yaxis: {
    title: 'y',
    range: [-2, 2],
  },
  modebar: {remove: ['pan3d', 'resetCameraDefault3d']},
  paper_bgcolor: '#ffffff00',
};

const LAYOUT_STABILITY = {
  margin: {l: 40, r: 20, t: 20, b: 30},
  xaxis: {
    title: 'x',
    range: [-2, 2],
  },
  yaxis: {
    title: 'y',
    range: [-0.5, 0.5],
  },
  modebar: {remove: ['pan3d', 'resetCameraDefault3d']},
  paper_bgcolor: '#ffffff00',
};

const STABLE_LINE_STYLE = {
  color: 'blue',
  width: 3
};
const UNSTABLE_LINE_STYLE = {
  color: 'blue',
  width: 3,
  dash: 'dash'
};
const VERTICAL_INTERSECTION_STYLE = {
  color: 'Red',
  width: 1
};
const BASE_STABILITY_LINE = {
  color: 'Red',
  width: 3
};
const STABLE_MARKER = {
  color: 'Green',
  size: 10
};
const UNSTABLE_MARKER = {
  color: 'Orange',
  size: 10
};

let parampSlider = document.getElementById('parampSlider');
let parampLabel = document.getElementById('parampSliderLabel');
let plotlyDiv = document.getElementById('plotlyPitchfork');
let stabilityDiv = document.getElementById('plotlyStability');

parampLabel.innerHTML = `p = ${parampSlider.value}`;

var upperBranch = [];
var lowerBranch = [];

for (var i = 0; i < NUM_POINTS; i++) {
  var xValue = i * x_LIMSUP / NUM_POINTS;
  upperBranch.push(Math.sqrt(xValue));
  lowerBranch.push(-Math.sqrt(xValue));
}

var traceStableZeroEquilibrium = {
  x: linspace(X_LIMINF, 0, 2),
  y: Array(NUM_POINTS).fill(0),
  mode: 'lines',
  line: STABLE_LINE_STYLE,
  showlegend: false
};

var traceUnstableZeroEquilibrium = {
  x: linspace(0, x_LIMSUP, 2),
  y: Array(NUM_POINTS).fill(0),
  mode: 'lines',
  line: UNSTABLE_LINE_STYLE,
  showlegend: false
};

var traceUpperBranch = {
  x: linspace(0, x_LIMSUP, NUM_POINTS),
  y: upperBranch,
  mode: 'lines',
  line: STABLE_LINE_STYLE,
  showlegend: false
};

var traceLowerBranch = {
  x: linspace(0, x_LIMSUP, NUM_POINTS),
  y: lowerBranch,
  mode: 'lines',
  line: STABLE_LINE_STYLE,
  showlegend: false
};

var traceUnstableEqPoints = {
  x: xUnstablePoints,
  y: yUnstablePoints,
  mode: 'markers',
  marker: UNSTABLE_MARKER,
  showlegend: false
};

var traceVLine = {
  x: [],
  y: [],
  mode: 'lines',
  line: VERTICAL_INTERSECTION_STYLE,
  showlegend: false
};

var traceStableEqPoints =
    {x: [], y: [], mode: 'markers', marker: STABLE_MARKER, showlegend: false};

var traceUnstableEqPoints =
    {x: [], y: [], mode: 'markers', marker: UNSTABLE_MARKER, showlegend: false};

var traceBaseStability = {
  x: linspace(X_LIMINF, x_LIMSUP, NUM_POINTS),
  y: Array(NUM_POINTS).fill(0),
  mode: 'lines',
  line: BASE_STABILITY_LINE,
  showlegend: false
};

var traceStabilityStablePoints =
    {x: [], y: [], mode: 'markers', marker: STABLE_MARKER, showlegend: false};

var traceStabilityUnstablePoints =
    {x: [], y: [], mode: 'markers', marker: UNSTABLE_MARKER, showlegend: false};

var xStablePoints = [];
var yStablePoints = [];
var xUnstablePoints = [];
var yUnstablePoints = [];

var plotData = [
  traceStableZeroEquilibrium, traceUnstableZeroEquilibrium, traceUpperBranch,
  traceLowerBranch, traceVLine, traceStableEqPoints, traceUnstableEqPoints
];

Plotly.newPlot(plotlyDiv, plotData, LAYOUT_PITCHFORK);
Plotly.newPlot(
    stabilityDiv,
    [
      traceBaseStability, traceStabilityStablePoints,
      traceStabilityUnstablePoints
    ],
    LAYOUT_STABILITY);

parampSlider.oninput = () => {
  var param_value = parampSlider.value;
  parampLabel.innerHTML = `p = ${param_value}`;

  if (param_value <= 0) {
    xStablePoints = [param_value];
    yStablePoints = [0];

    xUnstablePoints = [];
    yUnstablePoints = [];
  } else {
    xStablePoints = [param_value, param_value];
    yStablePoints = [Math.sqrt(param_value), -Math.sqrt(param_value)];

    xUnstablePoints = [param_value];
    yUnstablePoints = [0];
  }
  console.log(parampLabel.innerHTML);

  var updatedTraces = {
    x: [[param_value, param_value], xStablePoints, xUnstablePoints],
    y: [[-2, 2], yStablePoints, yUnstablePoints]
  };
  Plotly.update(plotlyDiv, updatedTraces, {}, [4, 5, 6]);

  var updatedStabilityData = {
    x: [yStablePoints, yUnstablePoints],
    y: [
      Array(yStablePoints.length).fill(0), Array(yUnstablePoints.length).fill(0)
    ]
  };
  Plotly.update(stabilityDiv, updatedStabilityData, {}, [1, 2]);
};