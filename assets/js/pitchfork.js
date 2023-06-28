import Plotly from 'plotly.js-dist-min';

import {linspace} from './modules/data_structures/iterables';

const X_LIMINF = -2.2;
const x_LIMSUP = 2.2;
const NUM_POINTS = 10000;
const STARTING_P = -1.3;

const LAYOUT_PITCHFORK = {
  margin: {l: 40, r: 20, t: 20, b: 30},
  xaxis: {
    title: 'p',
    range: [-2.2, 2.2],
  },
  yaxis: {
    title: 'x',
    range: [-2, 2],
  },
  modebar: {remove: ['pan3d', 'resetCameraDefault3d']},
  paper_bgcolor: '#ffffff00',
};

const LAYOUT_STABILITY = {
  margin: {l: 40, r: 20, t: 20, b: 30},
  xaxis: {
    title: 'x',
    range: [-2.2, 2.2],
  },
  yaxis: {
    title: '',
    range: [-0.5, 0.5],
  },
  modebar: {remove: ['pan3d', 'resetCameraDefault3d']},
  paper_bgcolor: '#ffffff00',
  annotations: [getArrowH(-0.2, true), getArrowH(0.2, false)],
};

const STABLE_LINE_STYLE = {
  color: 'blue',
  width: 2
};
const UNSTABLE_LINE_STYLE = {
  color: 'blue',
  width: 2,
  dash: 'dash'
};
const VERTICAL_INTERSECTION_STYLE = {
  color: 'Red',
  width: 2
};
const BASE_STABILITY_LINE = {
  color: 'Red',
  width: 2
};
const STABLE_MARKER = {
  color: 'Green',
  size: 10
};
const UNSTABLE_MARKER = {
  color: 'Orange',
  size: 10
};

function getArrowH(point, right = true) {
  let ax = 10;
  if (right) {
    ax = -10;
  };
  return {
    x: point,
    y: 0,
    xref: 'x',
    yref: 'y',
    text: '',
    showarrow: true,
    align: 'center',
    arrowhead: 2,
    arrowsize: 1.1,
    arrowwidth: 2.2,
    arrowcolor: 'red',
    ax: ax,
    ay: 0,
    opacity: 1.0
  };
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
  x: [STARTING_P, STARTING_P],
  y: [-2, 2],
  mode: 'lines',
  line: VERTICAL_INTERSECTION_STYLE,
  showlegend: false
};

var traceStableEqPoints = {
  x: [STARTING_P],
  y: [0],
  mode: 'markers',
  marker: STABLE_MARKER,
  showlegend: false
};

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
    {x: [0], y: [0], mode: 'markers', marker: STABLE_MARKER, showlegend: false};

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

  anns = [];

  if (param_value <= 0) {
    xStablePoints = [param_value];
    yStablePoints = [0];

    xUnstablePoints = [];
    yUnstablePoints = [];

    anns1D = [getArrowH(-0.2, true), getArrowH(0.2, false)]
  } else {
    xStablePoints = [param_value, param_value];
    yStablePoints = [Math.sqrt(param_value), -Math.sqrt(param_value)];

    xUnstablePoints = [param_value];
    yUnstablePoints = [0];
    let pos = Math.sqrt(param_value) / 2;
    if (param_value < 0.7) {
      // one arrow in the middle of the two eq points
      anns1D = [
        getArrowH(-3 * pos + 0.05, true), getArrowH(-pos - 0.05, false),
        getArrowH(pos + 0.05, true), getArrowH(3 * pos - 0.05, false)
      ];
    } else {  // one arrow for each eq point
      anns1D = [
        getArrowH(-0.3, false), getArrowH(0.3, true),
        getArrowH(-2 * pos + 0.2, false), getArrowH(-2 * pos - 0.2, true),
        getArrowH(2 * pos + 0.2, false), getArrowH(2 * pos - 0.2, true)
      ]
    };
  }
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


  let layout = LAYOUT_STABILITY;
  layout['annotations'] = anns1D;
  Plotly.update(stabilityDiv, updatedStabilityData, layout, [1, 2]);
};