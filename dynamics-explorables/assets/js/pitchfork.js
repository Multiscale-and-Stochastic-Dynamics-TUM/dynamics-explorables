import Plotly from 'plotly.js-dist-min'

function getLinspace(startValue, stopValue, cardinality) {
    var arr = [];
    var step = (stopValue - startValue) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
      arr.push(startValue + (step * i));
    }
    return arr;
}

const xLimInf = -2.0
const xLimSup = 2.0
const numPoints = 10000

let plotlyDiv = document.getElementById('plotlyPitchfork');
let stabilityDiv = document.getElementById('plotlyStability');

const layout_plot = {
    margin: {l: 40, r: 20, t: 20, b: 30},
    xaxis: {title: 'x', range: [-2, 2],},
    yaxis: {title: 'y', range: [-2, 2], },
    modebar: {remove: ['pan3d', 'resetCameraDefault3d']},
    paper_bgcolor: '#ffffff00',
};

const layout_stability = {
    margin: {l: 40, r: 20, t: 20, b: 30},
    xaxis: {title: 'x', range: [-2, 2],},
    yaxis: {title: 'y', range: [-0.5, 0.5],},
    modebar: {remove: ['pan3d', 'resetCameraDefault3d']},
    paper_bgcolor: '#ffffff00',
};

const parampSlider = document.getElementById('parampSlider')

const stable_line_style = {color: 'blue', width: 3}
const unstable_line_style = {color: 'blue', width: 3, dash: 'dash'}
const cut_line = {color:"Red", width: 1}
const base_stability_line = {color:"Red", width: 3}
const stable_marker = {color:"Green", size: 10}
const unstable_marker = {color:"Orange", size: 10}

var upperBranch = []; 
var lowerBranch = []; 

for (var i = 0; i < numPoints; i++) {
    var xValue = i * xLimSup / numPoints
    upperBranch.push(Math.sqrt(xValue));
    lowerBranch.push(-Math.sqrt(xValue));
}

var traceStableZeroEquilibrium = {
    x: getLinspace(xLimInf, 0, 2),
    y: Array(numPoints).fill(0),
    mode: 'lines',
    line: stable_line_style,
    showlegend: false
};

var traceUnstableZeroEquilibrium = {
    x: getLinspace(0, xLimSup, 2),
    y: Array(numPoints).fill(0),
    mode: 'lines',
    line: unstable_line_style,
    showlegend: false
};

var traceUpperBranch = {
    x: getLinspace(0, xLimSup, numPoints),
    y: upperBranch,
    mode: 'lines',
    line: stable_line_style,
    showlegend: false
}

var traceLowerBranch = {
    x: getLinspace(0, xLimSup, numPoints),
    y: lowerBranch,
    mode: 'lines',
    line: stable_line_style,
    showlegend: false
}

var traceUnstableEqPoints = {
    x: xUnstablePoints,
    y: yUnstablePoints,
    mode: 'markers',
    marker: unstable_marker,
    showlegend: false
}

var traceVLine = {
    x: [],
    y: [],
    mode: 'lines',
    line: cut_line,
    showlegend: false
} 

var traceStableEqPoints = {
    x: [],
    y: [],
    mode: 'markers',
    marker: stable_marker,
    showlegend: false
}

var traceUnstableEqPoints = {
    x: [],
    y: [],
    mode: 'markers',
    marker: unstable_marker,
    showlegend: false
}

var traceBaseStability = {
    x: getLinspace(xLimInf, xLimSup, numPoints),
    y: Array(numPoints).fill(0),
    mode: 'lines',
    line: base_stability_line,
    showlegend: false
}

var traceStabilityStablePoints = {
    x: [],
    y: [],
    mode: 'markers',
    marker: stable_marker,
    showlegend: false
}

var traceStabilityUnstablePoints = {
    x: [],
    y: [],
    mode: 'markers',
    marker: unstable_marker,
    showlegend: false
}

var xStablePoints = []
var yStablePoints = []
var xUnstablePoints = []
var yUnstablePoints = []

var plotData = [traceStableZeroEquilibrium, traceUnstableZeroEquilibrium, traceUpperBranch, 
                traceLowerBranch, traceVLine, traceStableEqPoints, traceUnstableEqPoints] 

Plotly.newPlot(plotlyDiv, plotData, layout_plot);
Plotly.newPlot(stabilityDiv, [traceBaseStability, traceStabilityStablePoints, traceStabilityUnstablePoints], layout_stability)

parampSlider.oninput = () => {
    const paramp = document.getElementById('parampSliderLabel')
    var param_value = parampSlider.value

    if (param_value <= 0) {
        xStablePoints = [param_value]
        yStablePoints = [0]

        xUnstablePoints = []
        yUnstablePoints = []
    } else {
        xStablePoints = [param_value, param_value]
        yStablePoints = [Math.sqrt(param_value), -Math.sqrt(param_value)]

        xUnstablePoints = [param_value]
        yUnstablePoints = [0]
    }
    console.log(paramp.innerHTML)

    var updatedTraces = {x: [[param_value, param_value], xStablePoints, xUnstablePoints],
                         y: [[-2, 2],yStablePoints, yUnstablePoints]}
    Plotly.update(plotlyDiv, updatedTraces, {}, [4, 5, 6]);
    
    var updatedStabilityData = {x: [yStablePoints, yUnstablePoints],
                                y: [Array(yStablePoints.length).fill(0), Array(yUnstablePoints.length).fill(0)]}
    Plotly.update(stabilityDiv, updatedStabilityData, {}, [1, 2])

};