import Plotly from 'plotly.js-dist-min';

import {linspace} from './modules/data_structures/iterables';
import {Trajectory2D} from './modules/data_structures/trajectory';
import {streamlines} from './modules/plotly/streamlines';
import {solve_ode} from './modules/simulation/ode_solver';

const layout = {
  margin: {l: 40, r: 40, t: 40, b: 30},
  xaxis: {range: [0, 2]},
  yaxis: {range: [-1., 1.], scaleanchor: 'x1'},
  showlegend: false,
};

const config = {
  displayModeBar: false,
};

function rhs(t, y, q) {
  let [y1, y2] = y;
  return [y2, -q * y2 + y1 - y1 ** 2 + y1 * y2];
}

function eigenvalues(q) {
  return [
    0.5 * (-q - Math.sqrt(q ** 2 + 4)), 0.5 * (-q + Math.sqrt(q ** 2 + 4))
  ];
}

function eigenvectors(q) {
  return [
    [-0.5 * (q - Math.sqrt(q ** 2 + 4)), -1],
    [0.5 * (q + Math.sqrt(q ** 2 + 4)), 1]
  ];
}

const slider = document.getElementById('streamlinesSlider');
const label = document.getElementById('streamlinesSliderLabel');

label.innerHTML = `p = ${slider.value}`;

slider.oninput = () => {
  label.innerHTML = `p = ${slider.value}`;
};

let plotlyDiv = document.getElementById('streamlines');

slider.oninput = async (event) => {
  let q = parseFloat(event.target.value);

  streamlines(plotlyDiv, rhs, [q], layout.xaxis.range, layout.yaxis.range, {
    line: {width: 1},
    layout: layout,
    config: config,
    density: 6,
    minlength: 0.5,
    brokenStreamlines: true
  });
};

// trigger the first update of the plot manually
var event = new Event('input');
slider.dispatchEvent(event);