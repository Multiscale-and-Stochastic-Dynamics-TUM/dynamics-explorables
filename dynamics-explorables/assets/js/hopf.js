import Plotly from 'plotly.js-dist-min'
import {getLinspace} from './modules/utils/utils';

//Style constants
const STABLE_LINE_STYLE = {color: 'blue', width: 5}
const UNSTABLE_LINE_STYLE = {color: 'blue', width: 5, dash: 'dash'}
const EIGENVAL_MARKER = {color:"Purple", size: 10}

const LAYOUT_3D = {
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

// Generate data for the 3D parabola of stability
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

let plotlyDiv = document.getElementById('plotlyHopf');
let multiplotDiv = document.getElementById('plotlyMultiplot');

var xyzData = get3Dstability();
var trace3Dcone = {
    x: xyzData[0],
    y: xyzData[1],
    z: xyzData[2],
    opacity: 0.8,
    color:'blue',
    type: 'mesh3d'
}

//Add all the traces
var traceStableLineEq = {
    x: [0, 0], 
    y: [0, 0],
    z: [-15, 0], 
    mode: 'lines',
    opacity: 0.8,
    color:'blue',
    type: 'scatter3d',
    line: STABLE_LINE_STYLE,
    showlegend: false
}

var traceUnstableLineEq = {
    x: [0, 0], 
    y: [0, 0],
    z: [0, 15], 
    mode: 'lines',
    opacity: 0.8,
    color:'blue',
    type: 'scatter3d',
    line: UNSTABLE_LINE_STYLE,
    showlegend: false
}

var traceCuttingPlane = {
    x: [],
    y: [],
    z: [],
    opacity: 0.2,
    color:'red',
    type: 'mesh3d',
    showlegend: false
}

var plotData = [trace3Dcone, traceStableLineEq, traceUnstableLineEq, traceCuttingPlane] 
Plotly.newPlot(plotlyDiv, plotData, LAYOUT_3D);

// TODO Implement the two bottom plots
var traceEigenvals = {
    x: [-3, -3],
    y: [1, -1],
    type: 'scatter',
    mode: 'markers',
    marker: EIGENVAL_MARKER,
    showlegend: false
  };
  
  var trace2 = {
    x: [20, 30, 40],
    y: [50, 60, 70],
    xaxis: 'x2',
    yaxis: 'y2',
    type: 'scatter',
    showlegend: false
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