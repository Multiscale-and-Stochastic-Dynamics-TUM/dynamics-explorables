import Plotly from 'plotly.js-dist-min'
import {getLinspace} from './modules/utils/utils';


// Number of points of the logistic map
const NUM_POINTS = 10000;
const LOGISTIC_MAP_STYLE = {color: 'blue', width: 3};
const DIAGONAL_LINE_STYLE = {color: 'black', width: 1};
const CURRENT_POINT_STYLE = {color:"Green", size: 7};
const OLD_POINT_STYLE = {color:"Red", size: 7};
const DEFAULT_TRANSITION = {
  transition: {
    duration: 500,
    easing: 'cubic-in-out'
  },
  frame: {
    duration: 500
  },
  mode: 'afterall'

}

const layout_plot = {
    margin: {l: 40, r: 20, t: 20, b: 30},
    xaxis: {title: 'x', range: [-0.2, 1.2],},
    yaxis: {title: 'y', range: [-0.2, 1.2], },
    modebar: {remove: ['pan3d', 'resetCameraDefault3d']},
    paper_bgcolor: '#ffffff00',
};

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
let startLabel = document.getElementById('startValueSliderLabel');
let stepButton = document.getElementById('stepButton');
startLabel.innerHTML = `y<sub>0</sub> = ${startValue.value}`;

var x = getLinspace(0, 1, NUM_POINTS)

var traceLogisticMap = { 
    x: x,
    y: getLogisticMapValues(x),
    mode: 'lines',
    line: LOGISTIC_MAP_STYLE,
    showlegend: false
};

var traceDiagonal = { 
    x: getLinspace(-1, 2, 2),
    y: getLinspace(-1, 2, 2),
    mode: 'lines',
    line: DIAGONAL_LINE_STYLE,
    showlegend: false
};

var traceTrackOfPoints = {
    x: [],
    y: [],
    mode: 'markers',
    marker: OLD_POINT_STYLE,
    showlegend: false
}

var traceCurrentPoint = { 
    x: [0],
    y: [0],
    mode: 'markers',
    marker: CURRENT_POINT_STYLE,
    showlegend: false
};

var plotData = [traceLogisticMap, traceDiagonal, traceTrackOfPoints, traceCurrentPoint] 
Plotly.newPlot(plotlyMap, plotData, layout_plot);

var trackValuesX = [];
var trackValuesY = [];

startValue.oninput = () => {
    startLabel.innerHTML = `y<sub>0</sub> = ${startValue.value}`;
};

startValue.addEventListener('change', () => { 

    console.log('A')

    trackValuesX = [];
    trackValuesY = [];

    var updatedTraces = {
        x: [trackValuesX, [startValue.value]],
        y: [trackValuesY, [0]]}
    Plotly.update(plotlyMap, updatedTraces, {}, [2, 3]);

    GLOBAL_START_POINT_VALUE = startValue.value
});

stepButton.addEventListener('click', () => { 

    var xValue = GLOBAL_START_POINT_VALUE;
    var yValue = 4 * xValue * (1 - xValue)
    animationTraces = [{data: [{x: [xValue], y: [yValue]}],
                        traces: [3]},
                       {data: [{x: [yValue], y: [yValue]}],
                        traces: [3]},
                       {data: [{x: [yValue], y: [0]}],
                        traces: [3]}]

    Plotly.animate(plotlyMap, animationTraces, DEFAULT_TRANSITION);

    trackValuesX.push(xValue)
    trackValuesY.push(0)

    var updatedTraces = {
      x: [trackValuesX],
      y: [trackValuesY]}

    Plotly.update(plotlyMap, updatedTraces, {}, [2]);
    
    GLOBAL_START_POINT_VALUE = yValue
});


