import Plotly from 'plotly.js-dist-min'

import {solve_ode} from './modules/simulation/ode_solver';

/////Functions for plots and coordinates/////
const LAYOUT = {
  xaxis: {range: [-10, 10]},
  yaxis: {range: [-10, 10]},
  showlegend: true,
  margin: {l: 20, t: 20, b: 20, r: 20}
};
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

function stopAnimation(plot) {
  Plotly.animate(plot, [], {mode: 'next'});
}

function startAnimation(plot, frames, no_transition = false) {
  let transition, duration;
  transition = {duration: duration, easing: 'linear'};
  if (no_transition) {
    duration = 1
  } else {
    duration = 100
  }
  Plotly.animate(plot, frames, {
    transition: transition,
    frame: {
      duration: duration,
      redraw: false,
    },
    mode: 'next',
  });
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
  let x_clone = [...x0];
  let sol = solve_ode(rhs, [0, t], x_clone).y;

  return sol
}
/////First plot/////
/// Time
let T = 5
let timeRadio_f = document.getElementById('time_forwards')
let timeRadio_b = document.getElementById('time_backwards')
function clickHandler_RadioTime() {
  T = timeRadio_f.checked * (5.) + timeRadio_b.checked * (-5.0);
  return;
}
timeRadio_f.addEventListener('click', clickHandler_RadioTime);
timeRadio_b.addEventListener('click', clickHandler_RadioTime);
timeRadio_f.click()

/// Main plot and traces
let linear_system_plot = document.getElementById('plotlyDiv');
Plotly.newPlot(linear_system_plot, [], LAYOUT);

let TRACKED_POINT = [0.0, 0.0];
let TRACKED_TRAJECTORY = [[0.0], [0.0]];

let indTrackedTrajectory = linear_system_plot.data.length
Plotly.addTraces(linear_system_plot, {
  x: [TRACKED_POINT[0]],
  y: [TRACKED_POINT[1]],
  mode: 'lines',
  marker: {color: '#ff00ff50'},
  name: 'Trajectory',
});

let indTrackedPoint = linear_system_plot.data.length
Plotly.addTraces(linear_system_plot, {
  x: [TRACKED_POINT[0]],
  y: [TRACKED_POINT[1]],
  mode: 'markers',
  marker: {color: 'black'},
  name: 'Tracked Point'
});
/// Clickable plot
clickHandler_LinPlot = (event) => {
  let point_temp;
  point_temp = getXYFromClick(linear_system_plot, event);
  if (!point_temp) {
    return;
  }
  stopAnimation(linear_system_plot)
  TRACKED_POINT = point_temp;
  Plotly.update(
      linear_system_plot,
      data_update = {x: [[TRACKED_POINT[0]]], y: [[TRACKED_POINT[1]]]}, {},
      indTrackedPoint);
  TRACKED_TRAJECTORY = makeTrajectory(simpleGeneralRHS, T, TRACKED_POINT);
  Plotly.update(
      linear_system_plot,
      data_update = {x: [TRACKED_TRAJECTORY[0]], y: [TRACKED_TRAJECTORY[1]]},
      {}, indTrackedTrajectory);

  startAnimation(
      linear_system_plot, {
        data: [{x: [TRACKED_POINT[0]], y: [TRACKED_POINT[1]]}],
        traces: [indTrackedPoint]
      },
      no_transition = 1);
};
linear_system_plot.addEventListener('click', clickHandler_LinPlot);
/// Play Button
let linSysPlay = document.getElementById('linPlayButton')
function linAnimate() {
  let frames = [];
  for (let i = 1; i < TRACKED_TRAJECTORY[0].length; i++) {
    frames.push({
      data: [{x: [TRACKED_TRAJECTORY[0][i]], y: [TRACKED_TRAJECTORY[1][i]]}],
      traces: [indTrackedPoint]
    });
  };
  startAnimation(linear_system_plot, frames);
  return;
}
linSysPlay.addEventListener('click', linAnimate);
/// Reset button
let linSysReset = document.getElementById('linResetButton')
function linReset() {
  startAnimation(
      linear_system_plot, {
        data: [{x: [TRACKED_POINT[0]], y: [TRACKED_POINT[1]]}],
        traces: [indTrackedPoint]
      },
      no_transition = true);
  return;
}
linSysReset.addEventListener('click', linReset);
/////////////////

let TEST_b = document.getElementById('TEST')
function TEST_f() {
  console.log('TEST')
  console.log(TRACKED_TRAJECTORY)

  startAnimation(
      linear_system_plot, {
        data: [{x: [TRACKED_POINT[0]], y: [TRACKED_POINT[1]]}],
        traces: [indTrackedPoint]
      },
      no_transition = true);
  return;
}
TEST_b.addEventListener('click', TEST_f);