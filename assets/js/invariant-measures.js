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
const INTERVAL_AREA_LINE_STYLE = {
  color: 'orange',
  width: 1
};
const PREIMAGE_LINE_STYLE = {
  color: 'purple',
  width: 4
};
const PREIMAGE_AREA_LINE_STYLE = {
  color: 'purple',
  width: 1
};
const MEASURE_LINE_STYLE = {
  color: 'rgba(0, 255, 255, 0.1)',  // cyan color, needs to be this format for
                                    // oppacity
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
    range: [-0.1, 1.1],
  },
  yaxis: {
    title: 'y',
    range: [-0.1, 1.5],
  },
  paper_bgcolor: '#ffffff00',
};

const CONFIG = {
  displayModeBar: false,
  responsive: true,
};

let GLOBAL_INTERVAL_DRAWED = false;
let GLOBAL_PREIMAGE_DRAWED = false;

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

function computeBaseTrace(a, b) {
  let res = {};
  if (b <= 1 / 2 || a >= 1 / 2) {
    res = {'x': [a, a, b, b], 'y': [0, 0, 0, 0]};
  };
  if (a < 1 / 2 && b > 1 / 2) {
    res = {'x': [a, a, 0.5, 0.5 + EPSILON, b, b], 'y': [0, 0, 0, 0, 0, 0]};
  };
  return res;
};

function computeAreaTrace(a, b) {
  let res = {};
  if (b <= 1 / 2) {
    res = {'x': [a, a, b, b], 'y': [0, 4 / 3, 4 / 3, 0]};
  };
  if (a >= 1 / 2) {
    res = {'x': [a, a, b, b], 'y': [0, 2 / 3, 2 / 3, 0]};
  };
  if (a < 1 / 2 && b > 1 / 2) {
    res = {
      'x': [a, a, 0.5, 0.5 + EPSILON, b, b],
      'y': [0, 4 / 3, 4 / 3, 2 / 3, 2 / 3, 0]
    };
  };
  return res;
};

function computeMeasure(a, b, numFloatingPoint = 2) {
  let meas_half1 = Math.min(Math.max(1 / 2 - a, 0), b - a) * 4 / 3;
  let meas_half2 = Math.min(Math.max(b - 1 / 2, 0), b - a) * 2 / 3;
  let meas = meas_half1 + meas_half2
  let rounding = parseInt(Math.pow(10, numFloatingPoint))
  return (Math.round(meas * rounding) / rounding).toFixed(numFloatingPoint);
};

function getAnnotation(a, b, color, numFloatingPoint = 2, size = 18) {
  return {
    x: a / 2 + b / 2,
    y: 0.3,
    xref: 'x',
    yref: 'y',
    text: computeMeasure(a, b, numFloatingPoint),
    showarrow: false,
    bgcolor: 'white',
    opacity: 1.0,
    font: {color: color, size: size}
  };
};

let plotlyMap = document.getElementById('plotlyMap');
let plotlyArea = document.getElementById('plotlyMeasure');

let intervalStart = document.getElementById('inputIntervalStart');
let intervalEnd = document.getElementById('inputIntervalEnd');

let drawIntervalButton = document.getElementById('stepButtonDrawInterval');
let drawPreimageButton = document.getElementById('stepButtonDrawPreimage');
let measureButton = document.getElementById('stepButtonComputeMeasure');
let resetButton = document.getElementById('stepButtonReset');

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

let traceInvariantMeasure = {
  x: [0, 0, 0.5, 0.5 + EPSILON, 1, 1],
  y: [0, 4 / 3, 4 / 3, 2 / 3, 2 / 3, 0],
  mode: 'lines',
  fill: 'toself',
  line: MEASURE_LINE_STYLE,
  showlegend: false
};

let startingIntervalArea = {
  x: [],
  y: [],
  mode: 'lines',
  fill: 'toself',
  line: INTERVAL_AREA_LINE_STYLE,
  showlegend: false
};

let preimageIntervalArea1 = {
  x: [],
  y: [],
  mode: 'lines',
  fill: 'toself',
  line: PREIMAGE_AREA_LINE_STYLE,
  showlegend: false
};

let preimageIntervalArea2 = {
  x: [],
  y: [],
  mode: 'lines',
  fill: 'toself',
  line: PREIMAGE_AREA_LINE_STYLE,
  showlegend: false
};

let plotDataMap = [
  MapTrace1,
  MapTrace2,
  traceStartingInterval,
  tracePreimageInterval1,
  tracePreimageInterval2,
];

let plotDataArea = [
  traceInvariantMeasure, MapTrace1, MapTrace2, traceStartingInterval,
  tracePreimageInterval1, tracePreimageInterval2, startingIntervalArea,
  preimageIntervalArea1, preimageIntervalArea2
];

Plotly.newPlot(plotlyMap, plotDataMap, LAYOUT, CONFIG);
Plotly.newPlot(plotlyArea, plotDataArea, LAYOUT, CONFIG);

drawIntervalButton.addEventListener('click', () => {
  GLOBAL_INTERVAL_DRAWED = true;
  drawIntervalButton.disabled = true;
  preimage = computePreimage(intervalStart.value, intervalEnd.value);
  let updatedTraces = {
    x: [[intervalStart.value, intervalEnd.value]],
    y: [[0, 0]]
  };
  Plotly.update(plotlyMap, updatedTraces, {}, [2]);
  Plotly.update(plotlyArea, updatedTraces, {}, [3]);
});

drawPreimageButton.addEventListener('click', () => {
  GLOBAL_PREIMAGE_DRAWED = true;
  drawPreimageButton.disabled = true;
  preimage = computePreimage(intervalStart.value, intervalEnd.value);
  if (preimage.length == 1) {
    let updatedTraces = {x: [preimage[0]], y: [[0, 0]]};
    Plotly.update(plotlyMap, updatedTraces, {}, [3]);
    Plotly.update(plotlyArea, updatedTraces, {}, [4]);
  };

  if (preimage.length == 2) {
    let updatedTraces = {x: [preimage[0], preimage[1]], y: [[0, 0], [0, 0]]};
    Plotly.update(plotlyMap, updatedTraces, {}, [3, 4]);
    Plotly.update(plotlyArea, updatedTraces, {}, [4, 5]);
  };
});

measureButton.addEventListener('click', async () => {
  if (GLOBAL_INTERVAL_DRAWED && GLOBAL_PREIMAGE_DRAWED) {
    measureButton.disabled = true;
    preimage = computePreimage(intervalStart.value, intervalEnd.value);

    a = intervalStart.value;
    b = intervalEnd.value;

    baseTraceInterval = computeBaseTrace(a, b);
    areaTraceInterval = computeAreaTrace(a, b);

    baseTracePreimage1 = computeBaseTrace(preimage[0][0], preimage[0][1])
    areaTracePreimage1 = computeAreaTrace(preimage[0][0], preimage[0][1])

    animationTraces = [
      {
        data: [
          {x: baseTraceInterval['x'], y: baseTraceInterval['y']},
          {x: baseTracePreimage1['x'], y: baseTracePreimage1['y']}
        ],
        traces: [6, 7]
      },
      {
        data: [
          {x: areaTraceInterval['x'], y: areaTraceInterval['y']},
          {x: areaTracePreimage1['x'], y: areaTracePreimage1['y']}
        ],
        traces: [6, 7]
      }
    ];

    if (preimage.length == 2) {
      extraBase = computeBaseTrace(preimage[1][0], preimage[1][1])
      extraArea = computeAreaTrace(preimage[1][0], preimage[1][1])

      animationTraces[0]['data'].push({x: extraBase['x'], y: extraBase['y']})
      animationTraces[0]['traces'].push(8)

      animationTraces[0]['data'].push({x: extraArea['x'], y: extraArea['y']})
      animationTraces[0]['traces'].push(8)
    };
    Plotly.animate(plotlyArea, animationTraces, DEFAULT_TRANSITION);
    anns = [
      getAnnotation(a, b, 'orange', 2),
      getAnnotation(preimage[0][0], preimage[0][1], 'purple', 2)
    ];
    if (preimage.length == 2) {
      anns.push(getAnnotation(preimage[1][0], preimage[1][1], 'purple', 2));
    };

    let layout = {annotations: anns};

    await new Promise(r => setTimeout(r, 1000));
    Plotly.update(plotlyArea, {}, layout, []);
  };
});

resetButton.addEventListener('click', () => {
  drawIntervalButton.disabled = false;
  drawPreimageButton.disabled = false;
  measureButton.disabled = false;

  let layout = {annotations: []};

  let updatedTraces = {x: Array(3).fill([]), y: Array(3).fill([])};
  Plotly.update(plotlyMap, updatedTraces, layout, [2, 3, 4]);

  let updatedTracesArea = {x: Array(6).fill([]), y: Array(6).fill([])};
  Plotly.update(plotlyArea, updatedTracesArea, layout, [3, 4, 5, 6, 7, 8]);
});
