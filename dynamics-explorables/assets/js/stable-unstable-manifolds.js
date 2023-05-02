import Plotly from 'plotly.js-dist-min'

import {solve_ode} from './modules/simulation/ode_solver';

dt = 0.01

/////Functions for plots and coordinates/////
function getXYFromClick(plot, event) {
  let element = plot.querySelector(['g.xy']).querySelector(['rect']);
  let l_margin = element.x.baseVal.value;
  let t_margin = element.y.baseVal.value;
  let width = element.width.baseVal.value;
  let height = element.height.baseVal.value;

  let x_click = event.offsetX;
  let y_click = event.offsetY;

  if (x_click < l_margin || x_click > l_margin + width || y_click < t_margin ||
      y_click > t_margin + height) {
    return false;
  };
  // getting parameters of the axis on data
  let fig_layout = plot.layout;
  let x_lim = fig_layout.xaxis.range;
  let y_lim = fig_layout.yaxis.range;

  let x_coord = (x_click - l_margin) / width * (x_lim[1] - x_lim[0]) + x_lim[0];
  let y_coord =
      (y_click - t_margin) / height * (y_lim[0] - y_lim[1]) + y_lim[1];
  // reminder, the axis are reverted in respect to coordinates on the page
  let point = [x_coord, y_coord];
  return point;
};

function unzipCoordinates(coords) {
  return {
    x: coords.map(x => x[0]), y: coords.map(x => x[1])
  }
};

function animate() {
  return;
}
/*
async function drawFrame(plot, frames, trace, currentFrame) {
  if (!animationPlaying) {
    return;
  }
  if (currentFrame >= numFrames) {
    animationPlaying = false;
    document.getElementById('stepButton').innerHTML = 'Play';
    return;
  }
  await Plotly.extendTraces(plot, trajectoryFrames[currentFrame], [11]);
  currentFrame += 1;
  setTimeout(drawFrame, 10);
}
setTimeout(drawFrame, 10);
*/

/////end/////

/////Example functions/////
function simpleGeneralRHS(t, X) {
  return [X[0], -X[1] + X[0] * X[0]];
};
function simpleLinOriginRHS(x, y) {
  let jac = [[1, 0], [0, -1]];
  return [x, -y];  // jac dot (x,y)T
};
function simpleEigenUnstab(x) {
  return [x, 0 * x];
};
function simpleEigenStable(y) {
  return [0 * y, y];
};
function simpleManifUnstab(x) {
  return [x, 1 / 3 * x * x];
};
function simpleManifStable(y) {
  return [0 * y, y];
};
function makeTrajectory(rhs, t, x0) {
  x_clone = [...x0]
  sol = solve_ode(rhs, [0, t], x_clone);
  return sol
}
/////end/////
/////
const layout = {
  xaxis: {range: [-10, 10]},
  yaxis: {range: [-10, 10]},
  showlegend: true,
  margin: {l: 20, t: 20, b: 20, r: 20}
};
/////

let linear_system_plot = document.getElementById('plotlyDiv');
Plotly.newPlot(linear_system_plot, [], layout);

let t = 5
let tracked_point = [0.0, 0.0];

let indTrackedTrace = linear_system_plot.data.length
Plotly.addTraces(linear_system_plot, {
  x: [tracked_point[0]],
  y: [tracked_point[1]],
  mode: 'markers',
  marker: {color: 'black'},
  name: 'Tracked Point'
});

let indTrackedTrajectory = linear_system_plot.data.length
Plotly.addTraces(linear_system_plot, {
  x: [tracked_point[0]],
  y: [tracked_point[1]],
  mode: 'lines',
  name: 'Trajectory'
});

clickHandler_LinPlot = (event) => {
  let point_temp;
  point_temp = getXYFromClick(linear_system_plot, event);
  if (!point_temp) {
    return;
  }
  tracked_point = point_temp;
  Plotly.update(
      linear_system_plot,
      data_update = {x: [[tracked_point[0]]], y: [[tracked_point[1]]]}, {},
      indTrackedTrace);
  sol = makeTrajectory(simpleGeneralRHS, t, tracked_point)
  Plotly.update(
      linear_system_plot, data_update = {x: [sol.y[0]], y: [sol.y[1]]}, {},
      indTrackedTrajectory);
};

linear_system_plot.addEventListener('click', clickHandler_LinPlot);