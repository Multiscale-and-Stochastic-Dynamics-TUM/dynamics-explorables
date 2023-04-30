import Plotly from 'plotly.js-dist-min';

import {linspace} from './modules/data_structures/iterables';

// Number of points of the logistic map
const NUM_POINTS = 10000;

// Style of the plot
const LOGISTIC_MAP_STYLE = {
  color: 'blue',
  width: 3
};
const DIAGONAL_LINE_STYLE = {
  color: 'black',
  width: 1
};
const CURRENT_POINT_STYLE = {
  color: 'Green',
  size: 7
};
const TRACKED_POINT_STYLE = {
  color: 'Red',
  size: 7
};

const DEFAULT_TRANSITION = {
  transition: {duration: 500, easing: 'cubic-in-out'},
  frame: {duration: 500},
  mode: 'afterall'
};

const LAYOUT = {
  margin: {l: 40, r: 20, t: 20, b: 30},
  xaxis: {
    title: 'x',
    range: [-0.2, 1.2],
  },
  yaxis: {
    title: 'y',
    range: [-0.2, 1.2],
  },
  modebar: {remove: ['pan3d', 'resetCameraDefault3d']},
  paper_bgcolor: '#ffffff00',
};

// Global variable to know the current value for the next step, initialized at
// the same value than the slider
var GLOBAL_START_POINT_VALUE = 0.0;

function getLogisticMapValues(xInput) {
  var res = [];
  for (let i = 0; i < NUM_POINTS; i++) {
    res.push(4 * xInput[i] * (1 - xInput[i]))
  }
  return res;
}

let plotlyMap = document.getElementById('plotlyMap');
let startValue = document.getElementById('startValueSlider');
let stepButton = document.getElementById('stepButton');

var x = linspace(0, 1, NUM_POINTS);

var traceLogisticMap = {
  x: x,
  y: getLogisticMapValues(x),
  mode: 'lines',
  line: LOGISTIC_MAP_STYLE,
  showlegend: false
};

var traceDiagonal = {
  x: linspace(-1, 2, 2),
  y: linspace(-1, 2, 2),
  mode: 'lines',
  line: DIAGONAL_LINE_STYLE,
  showlegend: false
};

var traceTrackOfPoints = {
  x: [],
  y: [],
  mode: 'markers',
  marker: TRACKED_POINT_STYLE,
  showlegend: false
}

var traceCurrentPoint = {
  x: [0],
  y: [0],
  mode: 'markers',
  marker: CURRENT_POINT_STYLE,
  showlegend: false
};

var plotData =
    [traceLogisticMap, traceDiagonal, traceTrackOfPoints, traceCurrentPoint];
Plotly.newPlot(plotlyMap, plotData, LAYOUT);

var trackValuesX = [];
var trackValuesY = [];

startValue.addEventListener('change', () => {
  console.log('A')

  trackValuesX = [];
  trackValuesY = [];

  var updatedTraces = {
    x: [trackValuesX, [startValue.value]],
    y: [trackValuesY, [0]]
  };

  Plotly.update(plotlyMap, updatedTraces, {}, [2, 3]);

  GLOBAL_START_POINT_VALUE = startValue.value;
});

stepButton.addEventListener('click', () => {
  var xValue = GLOBAL_START_POINT_VALUE;
  var yValue = 4 * xValue * (1 - xValue);
  animationTraces = [
    {data: [{x: [xValue], y: [yValue]}], traces: [3]},
    {data: [{x: [yValue], y: [yValue]}], traces: [3]},
    {data: [{x: [yValue], y: [0]}], traces: [3]}
  ];

  Plotly.animate(plotlyMap, animationTraces, DEFAULT_TRANSITION);

  trackValuesX.push(xValue);
  trackValuesY.push(0);

  var updatedTraces = {x: [trackValuesX], y: [trackValuesY]};
  Plotly.update(plotlyMap, updatedTraces, {}, [2]);
  GLOBAL_START_POINT_VALUE = yValue;
});