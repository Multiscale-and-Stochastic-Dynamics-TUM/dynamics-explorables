import Plotly from 'plotly.js-dist-min'

import {solve_ode} from './modules/numerics/ode_solver.js'

Plotly.newPlot(
    'plotlyDiv',
    [{x: [1, 2, 3], y: [2, 1, 4], mode: 'lines+markers', type: 'scatter'}]);

var a = [1, 2, 3];