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
    return;
  };
  // getting parameters of the axis on data
  let fig_layout = plot.layout;
  let x_lim = fig_layout.xaxis.range;
  let y_lim = fig_layout.yaxis.range;

  let x_coord = (x_click - l_margin) / width * (x_lim[1] - x_lim[0]) + x_lim[0];
  let y_coord =
      (y_click - t_margin) / height * (y_lim[0] - y_lim[1]) + y_lim[1];
  // reminder, the axis are reverted in respect to coordinates on the page
  tracked_point = [x_coord, y_coord];
  return tracked_point;
};

function unzipCoordinates(coords) {
  return {
    x: coords.map(x => x[0]), y: coords.map(x => x[1])
  }
};
/////end/////

/////Example functions/////
function simpleGeneralRHS(x, y) {
  return [x, -y + x * x];
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
/*
function makeTrajectory(
    system,
    x0,
) {
  sol = solve_ode(simpleLinOriginRHS, [0, dt], [x, y]);
}*/

/*
def create_trajectory(f, x_0, dt, n_it):
    pt_trajectory = [x_0]
    for i in range(n_it):
            nx_point=iterate_pt(f, pt_trajectory[-1], dt)
pt_trajectory.append(nx_point)
pt_trajectory = np.array(pt_trajectory)
return pt_trajectory
*/

/////end/////

const layout = {
  xaxis: {range: [-10, 10]},
  yaxis: {range: [-10, 10]},
  showlegend: true,
  margin: {l: 20, t: 20, b: 20, r: 20}
};

let linear_system_plot = document.getElementById('plotlyDiv');

Plotly.newPlot(linear_system_plot, [], layout);

let tracked_point = [0.0, 0.0];

indTrackedTrace = linear_system_plot.data.length - 1

Plotly.addTraces(linear_system_plot, {
  x: [tracked_point[0]],
  y: [tracked_point[1]],
  mode: 'markers',
  marker: {color: 'black'},
  name: 'Tracked Point'
});
clickHandler_LinPlot = (event) => {
  tracked_point = getXYFromClick(linear_system_plot, event);
  Plotly.update(
      linear_system_plot,
      data_update = {x: [[tracked_point[0]]], y: [[tracked_point[1]]]},
      indTrackedTrace);
};

linear_system_plot.addEventListener('click', clickHandler_LinPlot);