import Plotly from 'plotly.js-dist-min'

import {getCSSColor} from './modules/design/colors';
import {streamlines} from './modules/plotly/streamlines';
import {getXYFromClick} from './modules/plotting/plotly_click';
import {solve_ode} from './modules/simulation/ode_solver';

const stableManifoldColor = getCSSColor('--red');
const unstableManifoldColor = getCSSColor('--blue');
const trajectoryColor = getCSSColor('--purple');
const contentColor = getCSSColor('--content');
const streamlineColor = getCSSColor('--secondary');

// Color all instances of the words given by the keys of the colorMap into the
// corresponding color.
function colorWords(colorMap) {
  for (const span of document.getElementsByTagName('span')) {
    if (colorMap.has(span.innerHTML)) {
      span.style.color = colorMap.get(span.innerHTML);
    }
  }
}

const wordColorMap = new Map([
  ['stable', stableManifoldColor],
  ['unstable', unstableManifoldColor],
  ['convergence', stableManifoldColor],
  ['divergence', unstableManifoldColor],
  ['forwards', stableManifoldColor],
  ['backwards', unstableManifoldColor],
]);

colorWords(wordColorMap);

/////Functions for plots and coordinates/////
const LAYOUT = {
  xaxis: {range: [-10, 10]},
  yaxis: {range: [-10, 10]},
  showlegend: true,
  margin: {l: 20, t: 20, b: 20, r: 20},
};
if (window.screen.width <= 500) {
  LAYOUT.showlegend = false
}

const CONFIG = {
  displayModeBar: false,
  responsive: true,
};

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

function makeTrajectory(rhs, t, x0) {
  let x_clone = [...x0];
  let sol = solve_ode(rhs, [0, t], x_clone).y;
  sol[0].reverse()
  sol[0].push(x0[0])
  sol[0].reverse()
  sol[1].reverse()
  sol[1].push(x0[1])
  sol[1].reverse()
  return sol
}
/////Example functions/////
function simpleGeneralRHS(t, X) {
  return [X[0], -X[1] + X[0] * X[0]];
};
function simpleLinOriginRHS(t, X) {
  let jac = [[1, 0], [0, -1]];
  return [X[0], -X[1]];  // jac dot (x,y)T
};
function simpleEigenUnstab(x) {
  return [x, x.map((e) => {return e * 0.0})];
};
function simpleEigenStable(y) {
  return [y.map((e) => {return e * 0.0}), y];
};
function simpleManifUnstab(x) {
  return [x, x.map((e) => {return e * e / 3})];
};
function simpleManifStable(y) {
  return [y.map((e) => {return e * 0.0}), y];
};
/////First plot/////
/// Global vars and page elements
let post = document.querySelector('.post-content')

let linear_system_plot = document.getElementById('plotlyDiv');

let timeRadio_f = document.getElementById('time_forwards');
let timeRadio_b = document.getElementById('time_backwards');

let sysRadio_l = document.getElementById('sys_lin');
let sysRadio_g = document.getElementById('sys_gen');

let linSysPlay = document.getElementById('linPlayButton');
let linSysReset = document.getElementById('linResetButton');

let showTrajectory = document.getElementById('showTrajectory');
let showEigenspaces = document.getElementById('showEigenspaces');
let showManifolds = document.getElementById('showManifolds');

let textSetX = document.getElementById('setPointX')
let textSetY = document.getElementById('setPointY')

let T = 5;
let CURRENT_SYSTEM = simpleLinOriginRHS;
let TRACKED_POINT = [0.0, 0.0];
let TRACKED_TRAJECTORY = [[TRACKED_POINT[0]], [TRACKED_POINT[1]]];
///// Main plot and traces
Plotly.newPlot(linear_system_plot, [], LAYOUT, CONFIG);
linEnds_f = (plot) => {
  let x_range = plot.layout['xaxis']['range'];
  let y_range = plot.layout['xaxis']['range'];
  return {
    x: x_range, y: y_range
  }
};
linEnds = linEnds_f(linear_system_plot)

// Fixed plot elements
let indUnstableEigenspace = linear_system_plot.data.length
Plotly.addTraces(linear_system_plot, {
  x: simpleEigenUnstab(linEnds['x'])[0],
  y: simpleEigenUnstab(linEnds['x'])[1],
  mode: 'lines',
  marker: {color: unstableManifoldColor},
  name: 'Unstable Eigenspace',
});

let indStableEigenspace = linear_system_plot.data.length
Plotly.addTraces(linear_system_plot, {
  x: simpleEigenStable(linEnds['y'])[0],
  y: simpleEigenStable(linEnds['y'])[1],
  mode: 'lines',
  marker: {color: stableManifoldColor},
  name: 'Stable Eigenspace',
});

makeLinSteps = (start, end, n_steps) => {
  let step = (end - start) / n_steps;
  let linspace = [];
  for (let i = start; Math.abs(i) <= Math.abs(end); i += step) {
    linspace.push(i);
  }
  return linspace;
};

let xLinspace = makeLinSteps(linEnds['x'][0], linEnds['x'][1], 100);
let yLinspace = makeLinSteps(linEnds['y'][0], linEnds['y'][1], 100);
let indUnstableManifold = linear_system_plot.data.length;
Plotly.addTraces(linear_system_plot, {
  x: simpleManifUnstab(xLinspace)[0],
  y: simpleManifUnstab(xLinspace)[1],
  mode: 'lines',
  marker: {color: unstableManifoldColor},
  line: {dash: 'dot'},
  name: 'Unstable Manifold',
});
let indStableManifold = linear_system_plot.data.length;
Plotly.addTraces(linear_system_plot, {
  x: simpleManifStable(yLinspace)[0],
  y: simpleManifStable(yLinspace)[1],
  mode: 'lines',
  marker: {color: stableManifoldColor},
  line: {dash: 'dot'},
  name: 'Stable Manifold',
});

/////streamline here
// movable stuff
let indTrackedTrajectory = linear_system_plot.data.length
Plotly.addTraces(linear_system_plot, {
  x: TRACKED_TRAJECTORY[0],
  y: TRACKED_TRAJECTORY[1],
  mode: 'lines',
  marker: {color: trajectoryColor},
  name: 'Trajectory',
});
let indTrackedPoint = linear_system_plot.data.length
Plotly.addTraces(linear_system_plot, {
  x: [TRACKED_POINT[0]],
  y: [TRACKED_POINT[1]],
  mode: 'markers',
  marker: {color: contentColor},
  name: 'Tracked Point'
});


/// Clickable plot
// function updating point, trajectory, traces
function updateLinPlot_pt(point) {
  if (point) {
    TRACKED_POINT = point;
  }
  // updating traces
  Plotly.update(
      linear_system_plot,
      data_update = {x: [[TRACKED_POINT[0]]], y: [[TRACKED_POINT[1]]]}, {},
      indTrackedPoint);
  TRACKED_TRAJECTORY = makeTrajectory(CURRENT_SYSTEM, T, TRACKED_POINT);
  Plotly.update(
      linear_system_plot,
      data_update = {x: [TRACKED_TRAJECTORY[0]], y: [TRACKED_TRAJECTORY[1]]},
      {}, indTrackedTrajectory);
  // interrupting animations
  startAnimation(
      linear_system_plot, {
        data: [{x: [TRACKED_POINT[0]], y: [TRACKED_POINT[1]]}],
        traces: [indTrackedPoint]
      },
      no_transition = 1);
  return;
}
clickHandler_LinPlot = (event) => {
  let point_temp;
  point_temp = getXYFromClick(
      linear_system_plot, event);  //!!!returns false if clicked out of bounds
  if (point_temp) {
    textSetX.value = Number(Math.round(point_temp[0] + 'e3') + 'e-3');
    textSetY.value = Number(Math.round(point_temp[1] + 'e3') + 'e-3');
  }
  updateLinPlot_pt(point_temp);
  return;
};
linear_system_plot.addEventListener('click', clickHandler_LinPlot);
/// Play Button
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
/// Time
function clickHandler_RadioTime() {
  T = timeRadio_f.checked * (5.) + timeRadio_b.checked * (-5.0);
  updateLinPlot_pt(TRACKED_POINT);
  return;
}
timeRadio_f.addEventListener('click', clickHandler_RadioTime);
timeRadio_b.addEventListener('click', clickHandler_RadioTime);
timeRadio_f.click()
/// Systems
showManifolds.disabled =
    1;  // remove this and change the function below if one wants to disable the
        // showManifolds when linear system
function clickHandler_RadioSys() {
  if (sysRadio_l.checked) {
    CURRENT_SYSTEM = simpleLinOriginRHS;
  } else if (sysRadio_g.checked) {
    CURRENT_SYSTEM = simpleGeneralRHS;
  }
  if (sysRadio_g.checked) {
    showManifolds.disabled = 0;
  }  // put here when should be enabled with +, *
  updateLinPlot_pt(TRACKED_POINT);
  return;
}
sysRadio_l.addEventListener('click', clickHandler_RadioSys);
sysRadio_g.addEventListener('click', clickHandler_RadioSys);
sysRadio_l.click()
/// Checkboxes
function clickHandler_showPlotElements(event) {
  Plotly.restyle(
      linear_system_plot, {
        visible: [
          showTrajectory.checked, showEigenspaces.checked,
          showEigenspaces.checked, showManifolds.checked, showManifolds.checked
        ]
      },
      [
        indTrackedTrajectory, indUnstableEigenspace, indStableEigenspace,
        indUnstableManifold, indStableManifold
      ]);
  return;
}
showTrajectory.addEventListener('click', clickHandler_showPlotElements);
showEigenspaces.addEventListener('click', clickHandler_showPlotElements);
showManifolds.addEventListener('click', clickHandler_showPlotElements);
clickHandler_showPlotElements();
/// Manuslly setting the point
function inputHandler_setPoint(event) {
  if (event.key == 'Enter') {
    let valX = Number(textSetX.value);
    let valY = Number(textSetY.value);
    if (isNaN(valX * valY)) {
      return;
    }
    updateLinPlot_pt([valX, valY]);
    textSetX.value = Number(Math.round(textSetX.value + 'e3') + 'e-3');
    textSetY.value = Number(Math.round(textSetY.value + 'e3') + 'e-3');
    return;
  }
}
textSetX.addEventListener('keydown', inputHandler_setPoint);
textSetY.addEventListener('keydown', inputHandler_setPoint);


///////pop-out button/////////

let action = document.getElementById('popOut');
let plottingopen = action.querySelector('.openable');
let buttonopen = action.querySelector('button');
buttonopen.addEventListener('click', () => {
  action.classList.toggle('active');

  if (action.classList.contains('active')) {
    plottingopen.appendChild(linear_system_plot);
    // plottingopen.hight = linear_system_plot.hight;
    plottingopen.style.height =
        linear_system_plot.getElementsByClassName('main-svg')[0]
            .height.animVal.value +
        2 + 'px';  // That is a bit retarded if somone knows how to make the
                   // height of the pop-out auto-definable wrt appended child
                   // feel free to change
    plottingopen.style.width =
        linear_system_plot.getElementsByClassName('main-svg')[0]
            .width.animVal.value +
        1 + 'px';  // Same here
  } else {
    post.insertBefore(linear_system_plot, post.childNodes[1]);
  }
})

// text elemets quality of life
let eigenspaceText = document.getElementById('eigenspacesText');
eigenspaceText.addEventListener('click', () => {showEigenspaces.click()});
let trajectoryText = document.getElementById('trajectoryText');
trajectoryText.addEventListener('click', () => {showTrajectory.click()});
let generalText = document.getElementById('generalText');
generalText.addEventListener('click', () => {sysRadio_g.click()});
let manifoldsText = document.getElementById('manifoldsText');
manifoldsText.addEventListener('click', () => {showManifolds.click()});