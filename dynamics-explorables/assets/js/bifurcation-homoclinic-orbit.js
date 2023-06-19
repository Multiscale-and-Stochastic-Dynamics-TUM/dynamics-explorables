import Plotly from 'plotly.js-dist-min';

import {linspace} from './modules/data_structures/iterables';
import {Trajectory2D} from './modules/data_structures/trajectory';
import {streamlines} from './modules/plotly/streamlines';
import {solve_ode} from './modules/simulation/ode_solver';

const layout = {
  margin: {l: 40, r: 40, t: 40, b: 30},
  xaxis: {range: [-1.5, 1.5]},
  yaxis: {range: [-1.5, 1.5], scaleanchor: 'x1'},
  showlegend: false,
};

const config = {
  displayModeBar: false,
};

/**
 * The rhs of a hopf normal form. We use it to construct an ODE in which
 * a homoclinic bifurcation occurs.
 */
function hopf(x, y, q) {
  return [q * x - y - (x ** 2 + y ** 2) * x, x + q * y - (x ** 2 + y ** 2) * y];
}

/**
 * The rhs of an ODE which contains a homoclinic bifurcation.
 * @param q - a bifurcation parameter
 * @param a - the eigenvalue of the Jacobian at (0, 0) in the x-direction
 * @param b - the eigenvalue of the Jacobian at (0, 0) in the y-direction
 */
function bifurcationODE(t, y, q, a, b) {
  let [y1, y2] = y;
  let hopf_rhs = hopf(x - 1, y - 1, q);
  return [
    a * y1 + (y1 ** 2 + y2 ** 2) * hopf_rhs[0],
    b * y2 + (y1 ** 2 + y2 ** 2) * hopf_rhs[1]
  ];
}

function simpleRHS(t, y) {
  return [y[1], -y[0]];
}

let plotlyDiv = document.getElementById('streamlines');
streamlines(
    plotlyDiv, simpleRHS, [], [-1, 1], [-1, 1], 6,
    {line: {width: 1}, layout: layout, config: config});