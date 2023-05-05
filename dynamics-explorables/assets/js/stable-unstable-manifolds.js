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
  //!!!returns false if clickout of bounds
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
  };  // not reacting out of border clicks
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

//!!!!!!//
/*
let action = document.getElementById('magic');
let buttonopen = action.querySelector('button')
buttonopen.addEventListener('click', () => {
  action.classList.toggle('active');
  console.log('clicked');
})
let linear_system_plot = action.querySelector('.openable')
*/
//!!!!!!//

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
Plotly.newPlot(linear_system_plot, [], LAYOUT);
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
  marker: {color: '0000ff50'},
  name: 'Unstable Eigenspace',
});

let indStableEigenspace = linear_system_plot.data.length
Plotly.addTraces(linear_system_plot, {
  x: simpleEigenStable(linEnds['y'])[0],
  y: simpleEigenStable(linEnds['y'])[1],
  mode: 'lines',
  marker: {color: 'ff000050'},
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

let xLinspace = makeLinSteps(linEnds['x'][0], linEnds['x'][1], 100)
let yLinspace = makeLinSteps(linEnds['y'][0], linEnds['y'][1], 100)
let indUnstableManifold = linear_system_plot.data.length;
Plotly.addTraces(linear_system_plot, {
  x: simpleManifUnstab(xLinspace)[0],
  y: simpleManifUnstab(xLinspace)[1],
  mode: 'lines',
  marker: {color: '4040ff50'},
  name: 'Unstable Manifold',
});
let indStableManifold = linear_system_plot.data.length;
Plotly.addTraces(linear_system_plot, {
  x: simpleManifStable(yLinspace)[0],
  y: simpleManifStable(yLinspace)[1],
  mode: 'lines',
  marker: {color: 'ff404050'},
  name: 'Stable Manifold',
});
// movable stuff
let indTrackedTrajectory = linear_system_plot.data.length
Plotly.addTraces(linear_system_plot, {
  x: TRACKED_TRAJECTORY[0],
  y: TRACKED_TRAJECTORY[1],
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
    textSetX.value = point_temp[0];
    textSetY.value = point_temp[1];
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
function clickHandler_RadioSys() {
  if (sysRadio_l.checked) {
    CURRENT_SYSTEM = simpleLinOriginRHS;
  } else if (sysRadio_g.checked) {
    CURRENT_SYSTEM = simpleGeneralRHS;
  }
  showManifolds.disabled =
      !sysRadio_g.checked;  // put here when should be enabled with +
  ;
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
    return;
  }
}
textSetX.addEventListener('keydown', inputHandler_setPoint);
textSetY.addEventListener('keydown', inputHandler_setPoint);


////////////////

let action = document.getElementById('magic');
let buttonopen = action.querySelector('button')
buttonopen.addEventListener('click', () => {
  action.classList.toggle('active');
  console.log('clicked');
})
let plottingopen = action.querySelector('.openable');
/*

{{< button id="TEST" text="TEST" >}}
let TEST_b = document.getElementById('TEST')
function TEST_f() {
  console.log('TEST');
  plottingopen.appendChild(linear_system_plot);
  return;
}
TEST_b.addEventListener('click', TEST_f);
*/