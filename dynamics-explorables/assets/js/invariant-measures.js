import Plotly from 'plotly.js-dist-min';

import {linspace} from './modules/data_structures/iterables';

// Number of points of the logistic map
const NUM_POINTS = 10000;

// Constant for small value
const EPSILON = 1e-5;

// Style of the plot
const MAP_LINE_STYLE = {
  color: 'blue',
  width: 3
};
const INTERVAL_LINE_STYLE = {
  color: 'orange',
  width: 4
};
const PREIMAGE_LINE_STYLE = {
  color: 'purple',
  width: 4
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

function computeMapTrace1(xInput) {
  let res = [];
  for (let i = 0; i < NUM_POINTS; i++) {
    res.push(2 * xInput[i]);
  };
  return res;
};

function computeMapTrace2(xInput) {
  let res = [];
  for (let i = 0; i < NUM_POINTS; i++) {
    res.push(xInput[i] - 1 / 2);
  };
  return res;
};

function computePreimage(a, b) {
  // computes the antimage and returns an array of arrays of 2 elements that
  // represent intervals
  let res = [];
  res.push([a / 2, b / 2]);
  if (a <= 1 / 2) {
    if (b <= 1 / 2) {
      res.push([Number(a) + 1 / 2, Number(b) + 1 / 2]);
    } else {
      res.push([Number(a) + 1 / 2, 1]);
    };
  };
  return res;
};

let plotlyMap = document.getElementById('plotlyMap');
let intervalStart = document.getElementById('inputIntervalStart');
let intervalEnd = document.getElementById('inputIntervalEnd');

let drawIntervalButton = document.getElementById('stepButtonDrawInterval');
let drawPreimageButton = document.getElementById('stepButtonDrawPreimage');

let xTrace1 = linspace(0, 1 / 2, NUM_POINTS);
let xTrace2 = linspace(1 / 2 + EPSILON, 1, NUM_POINTS);

let MapTrace1 = {
  x: xTrace1,
  y: computeMapTrace1(xTrace1),
  mode: 'lines',
  line: MAP_LINE_STYLE,
  showlegend: false
};

let MapTrace2 = {
  x: xTrace2,
  y: computeMapTrace2(xTrace2),
  mode: 'lines',
  line: MAP_LINE_STYLE,
  showlegend: false
};

let traceStartingInterval = {
  x: [],
  y: [],
  mode: 'lines+markers',
  line: INTERVAL_LINE_STYLE,
  showlegend: false
};

let tracePreimageInterval1 = {
  x: [],
  y: [],
  mode: 'lines+markers',
  line: PREIMAGE_LINE_STYLE,
  showlegend: false
};

let tracePreimageInterval2 = {
  x: [],
  y: [],
  mode: 'lines+markers',
  line: PREIMAGE_LINE_STYLE,
  showlegend: false
};

let plotData = [
  MapTrace1, MapTrace2, traceStartingInterval, tracePreimageInterval1,
  tracePreimageInterval2
];
Plotly.newPlot(plotlyMap, plotData, LAYOUT);

drawIntervalButton.addEventListener('click', () => {
  let updatedTraces = {
    x: [[intervalStart.value, intervalEnd.value]],
    y: [[0, 0]]
  };
  Plotly.update(plotlyMap, updatedTraces, {}, [2]);
});

drawPreimageButton.addEventListener('click', () => {
  preimage = computePreimage(intervalStart.value, intervalEnd.value)
  if (preimage.length == 1) {
    let updatedTraces = {x: [preimage[0]], y: [[0, 0]]};
    Plotly.update(plotlyMap, updatedTraces, {}, [3]);
  };

  if (preimage.length == 2) {
    let updatedTraces = {x: [preimage[0], preimage[1]], y: [[0, 0], [0, 0]]};
    Plotly.update(plotlyMap, updatedTraces, {}, [3, 4]);
  };
});


/*
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
*/