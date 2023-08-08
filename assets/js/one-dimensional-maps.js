import Plotly from 'plotly.js-dist-min';

import {linspace} from './modules/data_structures/iterables';

// Number of points of the logistic map
const NUM_POINTS = 10000;
const STARTING_VALUE = 0.4;
const NUM_DECIMALS_DISPLAY = 3;

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
const ANIMATION_LINE_STYLE = {
  color: 'Green',
  with: 2,
  dash: 'dash'
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
    title: '',
    range: [-0.2, 1.2],
  },
  yaxis: {
    title: '',
    range: [-0.2, 1.2],
  },
  paper_bgcolor: '#ffffff00'
};

const CONFIG = {
  displayModeBar: false,
  responsive: true,
};

// Global variable to know the current value for the next step, initialized at
// the same value than the slider
let GLOBAL_START_POINT_VALUE = STARTING_VALUE;

function getLogisticMapValues(xInput) {
  var res = [];
  for (let i = 0; i < NUM_POINTS; i++) {
    res.push(4 * xInput[i] * (1 - xInput[i]))
  }
  return res;
}

function roundToDecimals(value, numDecimals = 2) {
  let rounding = parseInt(Math.pow(10, numDecimals))
  return (Math.round(value * rounding) / rounding).toFixed(numDecimals);
};

let plotlyMap = document.getElementById('plotlyMap');
let startValue = document.getElementById('startValueSlider');
let startValueLabel = document.getElementById('startValueSliderLabel');

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
  x: [STARTING_VALUE],
  y: [0],
  mode: 'markers',
  marker: CURRENT_POINT_STYLE,
  showlegend: false
};

var traceAnimationLine = {
  x: [STARTING_VALUE],
  y: [0],
  mode: 'lines',
  line: ANIMATION_LINE_STYLE,
  showlegend: false
};

var plotData = [
  traceLogisticMap, traceDiagonal, traceTrackOfPoints, traceCurrentPoint,
  traceAnimationLine
];
Plotly.newPlot(plotlyMap, plotData, LAYOUT, CONFIG);

var trackValuesX = [];
var trackValuesY = [];

let displayValue = GLOBAL_START_POINT_VALUE;
startValue.oninput = () => {
  displayValue =
      roundToDecimals(GLOBAL_START_POINT_VALUE, NUM_DECIMALS_DISPLAY);
  startValueLabel.innerHTML = `Value: ${displayValue}`;

  trackValuesX = [];
  trackValuesY = [];

  var updatedTraces = {
    x: [trackValuesX, [startValue.value], [startValue.value]],
    y: [trackValuesY, [0], [0]]
  };

  Plotly.update(plotlyMap, updatedTraces, {}, [2, 3, 4]);

  GLOBAL_START_POINT_VALUE = startValue.value;
};

stepButton.addEventListener('click', () => {
  stepButton.disabled = true;
  setTimeout(function() {
    stepButton.disabled = false;
  }, 1400);

  var updatedTraces = {x: [[GLOBAL_START_POINT_VALUE]], y: [[0]]};
  Plotly.update(plotlyMap, updatedTraces, {}, [4]);

  var xValue = GLOBAL_START_POINT_VALUE;
  var yValue = 4 * xValue * (1 - xValue);
  animationTraces = [
    {
      data: [{x: [xValue], y: [yValue]}, {x: [xValue, xValue], y: [0, yValue]}],
      traces: [3, 4]
    },
    {
      data: [
        {x: [yValue], y: [yValue]},
        {x: [xValue, xValue, yValue], y: [0, yValue, yValue]}
      ],
      traces: [3, 4]
    },
    {
      data: [
        {x: [yValue], y: [0]},
        {x: [xValue, xValue, yValue, yValue], y: [0, yValue, yValue, 0]}
      ],
      traces: [3, 4]
    }
  ];

  Plotly.animate(plotlyMap, animationTraces, DEFAULT_TRANSITION);


  trackValuesX.push(xValue);
  trackValuesY.push(0);

  var updatedTraces = {x: [trackValuesX], y: [trackValuesY]};
  Plotly.update(plotlyMap, updatedTraces, {}, [2]);
  GLOBAL_START_POINT_VALUE = yValue;

  displayValue =
      roundToDecimals(GLOBAL_START_POINT_VALUE, NUM_DECIMALS_DISPLAY);
  startValueLabel.innerHTML = `Value: ${displayValue}`;
});