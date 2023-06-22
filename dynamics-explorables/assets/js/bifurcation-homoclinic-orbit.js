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

slider.addEventListener('change', async (event) => {
  let q = parseFloat(event.target.value);
  let startingCoords = eigenvectors(q);
  for (let i = 0; i < startingCoords.length; i++) {
    startingCoords[i][0] *= 0.01;
    startingCoords[i][1] *= 0.01;

    if (startingCoords[i][0] < 0) {
      startingCoords[i][0] *= -1;
      startingCoords[i][1] *= -1;
    }
  }

  let numLines = 10
  let deltaY = (layout.yaxis.range[1] - layout.yaxis.range[0]) / numLines
  for (let i = 0; i < numLines; i++) {
    let y = layout.yaxis.range[0] + i * deltaY;
    startingCoords.push([0, y]);
  }
  for (let i = 0; i < numLines; i++) {
    let y = layout.yaxis.range[0] + i * deltaY;
    startingCoords.push([layout.xaxis.range[1], y]);
  }
  for (let i = 0; i < numLines; i++) {
    let y = layout.yaxis.range[0] + i * deltaY;
    startingCoords.push([1, y]);
  }

  streamlines(plotlyDiv, rhs, [q], layout.xaxis.range, layout.yaxis.range, {
    line: {width: 1},
    layout: layout,
    config: config,
    density: 15,
    minlength: 1,
    brokenStreamlines: true,
    // startingCoords: startingCoords,
  });
});

// trigger the first update of the plot manually
var event = new Event('change');
slider.dispatchEvent(event);