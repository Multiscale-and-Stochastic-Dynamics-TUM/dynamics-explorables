import Plotly from 'plotly.js-dist-min'

function getLinspace(startValue, stopValue, cardinality) {
    var arr = [];
    var step = (stopValue - startValue) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
      arr.push(startValue + (step * i));
    }
    return arr;
}

function get3Dstability(gridLim=4.0, meshSize=50){
    var x = [];
    var y = [];
    var z = [];

    var v =getLinspace(-gridLim, gridLim, meshSize)
    for (var i = 0; i < meshSize; i++){
        for (var j = 0; j < meshSize; j++){
            x.push(v[j]);
            y.push(v[i]);
            z.push(v[j] * v[j] + v[i] * v[i])
        }
    }
    return [x, y, z];
}
const xLimInf = -2.0
const xLimSup = 2.0
const numPoints = 10000

const stable_line_style = {color: 'blue', width: 5}
const unstable_line_style = {color: 'blue', width: 5, dash: 'dash'}
const cut_line = {color:"Red", width: 1}
const base_stability_line = {color:"Red", width: 3}
const eigenval_marker = {color:"Purple", size: 10}
const stable_marker = {color:"Green", size: 10}
const unstable_marker = {color:"Orange", size: 10}

const layout_3d = {
    margin: {l: 40, r: 20, t: 20, b: 30},
    scene: {
      xaxis: {
        range: [-4, 4],
        visible: true,
        tick0: -50,
        dtick: 25,
        zerolinewidth: 2,
      },
      yaxis: {
        range: [-4, 4],
        visible: true,
        tick0: -50,
        dtick: 25,
        zerolinewidth: 2,
      },
      zaxis: {
        range: [-4, 4],
        visible: true,
        tick0: 0,
        dtick: 25,
        zerolinewidth: 2,
      },
      aspectmode: 'cube',
      camera: {up: {x: 1, y: 0, z: 0}, center: {x: 0, y: 0, z: 0}, eye: {x: 0.5, y: 2.5, z: 1.0}},
      dragmode: 'orbit',
    },
    modebar: {remove: ['pan3d']},
    paper_bgcolor: '#ffffff00',
  };

let plotlyDiv = document.getElementById('plotlyHopf');

var xyzData = get3Dstability();
var trace3Dcone = {
    x: xyzData[0],
    y: xyzData[1],
    z: xyzData[2],
    opacity: 0.8,
    color:'blue',
    type: 'mesh3d'
}

var traceStableLineEq = {
    x: [0, 0], 
    y: [0, 0],
    z: [-15, 0], 
    mode: 'lines',
    opacity: 0.8,
    color:'blue',
    type: 'scatter3d',
    line: stable_line_style
}

var traceUnstableLineEq = {
    x: [0, 0], 
    y: [0, 0],
    z: [0, 15], 
    mode: 'lines',
    opacity: 0.8,
    color:'blue',
    type: 'scatter3d',
    line: unstable_line_style
}

var traceCuttingPlane = {
    x: [],
    y: [],
    z: [],
    opacity: 0.2,
    color:'red',
    type: 'mesh3d'
}

/* TODO
var traceIntersecctionRing = {
}
var traceIntersecctionPoint = {
}
*/

var plotData = [trace3Dcone, traceStableLineEq, traceUnstableLineEq, traceCuttingPlane] 
Plotly.newPlot(plotlyDiv, plotData, layout_3d);

// Plotly.newPlot(stabilityDiv, [traceBaseStability, traceStabilityStablePoints, traceStabilityUnstablePoints], layout_stability)

let multiplotDiv = document.getElementById('plotlyMultiplot');


var traceEigenvals = {
    x: [-3, -3],
    y: [1, -1],
    type: 'scatter',
    mode: 'markers',
    marker: eigenval_marker
  };
  
  var trace2 = {
    x: [20, 30, 40],
    y: [50, 60, 70],
    xaxis: 'x2',
    yaxis: 'y2',
    type: 'scatter'
  };
  
  var data = [traceEigenvals, trace2];
  
  var layout = {
    grid: {rows: 1, columns: 2, pattern: 'independent'},
  };
  
  Plotly.newPlot(multiplotDiv, data, layout);


parampSlider.oninput = () => {
    const paramp = document.getElementById('parampSliderLabel')
    var param_value = parampSlider.value

    var xyzDataPlane = get3Dstability(4.0, 2);
    var updatedStabilityData = {
        x: [xyzDataPlane[0]],
        y: [xyzDataPlane[1]],
        z: [Array(xyzDataPlane[0].length).fill(param_value)]
    }
    Plotly.update(plotlyDiv, updatedStabilityData, {}, [3])

};