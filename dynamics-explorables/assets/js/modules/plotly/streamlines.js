import Plotly from 'plotly.js-dist-min';

import {linspace} from '../data_structures/iterables';
import {Trajectory2D} from '../data_structures/trajectory';
import {solve_ode} from '../simulation/ode_solver';

export {streamlines};

/**
 * Draw the streamlines of a vector field using an explicit right hand-side.
 * @param plotlyDiv - the plotly div into which the plot will be drawn
 * @param {function} rhs - the right-hand side of the ODE. Should be called as
 *     rhs(t, y).
 * @param params - any additional parameters to pass to the rhs function
 * @param {Array} xrange - vector with the minimum and maximum value of x,
 *     `[xmin, xmax]`
 * @param {Array} yrange - vector with the minimum and maximum value of y,
 *     `[ymin, ymax]`
 * @param {int} density - how dense to plot the lines. Gives the number of lines
 *     which start from each border of the image
 * keyword arguments:
 * @param line - a plotly object which contains the properties of the line
 * @param layout - a plotly layout object which will be passed to the plotly
 *     function
 * @param config - a plotly config object which will be passed to the plotly
 *     function
 */
function streamlines(
    plotlyDiv, rhs, params, xrange, yrange, density = 6,
    {line, layout, config} = {}) {
  let [xmin, xmax] = xrange;
  let [ymin, ymax] = yrange;
  let xnodes = linspace(xmin, xmax, density);
  let ynodes = linspace(ymin, ymax, density);

  let grid = {
    visited: [],
    coordinates: [],
    size: density,
    xmin: xmin,
    xmax: xmax,
    ymin: ymin,
    ymax: ymax,
    deltaX: (xmax - xmin) / density,
    deltaY: (ymax - ymin) / density,
  };

  // initiate the grid
  for (let i = 0; i < grid.size; i++) {
    grid.visited.push([]);
    grid.coordinates.push([]);
    for (let j = 0; j < grid.size; j++) {
      grid.visited[i].push(false);
      grid.coordinates[i].push([xnodes[i], ynodes[j]]);
    }
  }

  let startingCoords = _getStartingCoords(xrange, yrange, grid.size);

  let streamlines = [];
  let streamline = {
    x: [],
    y: [],
  };

  // for every starting point, draw the streamline and add it to the vector
  for (const startingCoord of startingCoords) {
    [streamline, grid] = _getStreamline(rhs, [], startingCoord, grid);
    if (streamline.x.length > 1) {
      streamlines.push(streamline);
    }
  }

  let defaultLine = {color: '#1f77b4'};

  let mergedLine = {...defaultLine, ...line};

  let traces = streamlines.map(streamline => {
    return {
      x: streamline.x, y: streamline.y, mode: 'lines', line: mergedLine,
    }
  });
  Plotly.newPlot(plotlyDiv, traces, layout, config);
}

function _getStartingCoords(xrange, yrange, density) {
  // coordinates from which the streamlines will start
  let startingCoords = [];
  let [xmin, xmax] = xrange;
  let [ymin, ymax] = yrange;
  let deltaX = (xmax - xmin) / density;
  let deltaY = (ymax - ymin) / density;

  /**
   * To fill the image uniformly, the starting points are sampled circle-wise,
   * starting from the boundaries of the image (ring 0) and moving inwards.
   * Here's an example for a 5x5 grid, the numbers denote the rings:
   *
   * 00000
   * 01110
   * 01210
   * 01110
   * 00000
   */

  for (let ring = 0; ring < density / 2; ring++) {
    let [xminRing, xmaxRing] = [xmin + ring * deltaX, xmax - ring * deltaX];
    let [yminRing, ymaxRing] = [ymin + ring * deltaY, ymax - ring * deltaY];

    if (xminRing > xmaxRing || yminRing > ymaxRing) {
      break;
    }

    let numRingPoints = density - ring * 2;

    for (let i = 0; i < numRingPoints; i++) {
      // top
      startingCoords.push([xminRing + i * deltaX, ymaxRing]);
      // right
      startingCoords.push([xmaxRing, ymaxRing - i * deltaY]);
      // bottom
      startingCoords.push([xminRing + i * deltaX, yminRing])
      // left
      startingCoords.push([xminRing, yminRing + i * deltaY]);
    }
  }
  return startingCoords;
}

function _coordToGridCell(x, y, grid) {
  let xind = Math.floor((x - grid.xmin) / grid.deltaX);
  let yind = Math.floor((y - grid.ymin) / grid.deltaY);
  return [xind, yind];
}

function _getStreamline(rhs, params, start, grid) {
  // cells which were visited for the first time by this streamline
  let discovered = [];
  for (let i = 0; i < grid.size; i++) {
    discovered.push([]);
    for (let j = 0; j < grid.size; j++) {
      discovered[i].push(false);
    }
  }

  let forwardStreamline = {
    x: [],
    y: [],
  }

  let backwardStreamline = {
    x: [],
    y: [],
  };

  [forwardStreamline, discovered] =
      _integrate(rhs, params, start, grid, discovered, 1);
  [backwardStreamline, discovered] =
      _integrate(rhs, params, start, grid, discovered, -1);

  let streamline = {
    x: backwardStreamline.x.concat(forwardStreamline.x),
    y: backwardStreamline.y.concat(forwardStreamline.y),
  };

  // add the newly discovered cells
  let updatedGrid = structuredClone(grid);
  for (let i = 0; i < grid.size; i++) {
    for (let j = 0; j < grid.size; j++) {
      updatedGrid.visited[i][j] = grid.visited[i][j] || discovered[i][j];
    }
  }

  return [streamline, updatedGrid]
}

function _integrate(rhs, params, start, grid, discovered, timeSign) {
  let streamline = {
    x: [],
    y: [],
  };

  const dt = 0.1;
  let t = 0;
  let [x, y] = start;
  let deltaX = grid.deltaX;
  let deltaY = grid.deltaY;

  // if the integration is done in backwards time, use the function -rhs(-t, y)
  // as the right hand-side
  let internalRhs;
  if (timeSign < 0) {
    internalRhs = (t, y) => {
      let ydot = rhs(-t, y, ...params);
      for (let i = 0; i < ydot.length; i++) {
        ydot[i] *= -1;
      }
      return ydot;
    };
  } else {
    internalRhs = (t, y) => {
      return rhs(t, y, ...params);
    };
  }

  let terminate = false
  let numIterations = 0;
  while (!terminate && numIterations < 10000) {
    numIterations += 1;

    let trajectory = solve_ode(internalRhs, [t, t + dt], [x, y]);

    let lastStep = trajectory.y.length;
    for (let step = 0; step < trajectory.y.length; step++) {
      x = trajectory.y[0][step];
      y = trajectory.y[1][step];

      let cell = _coordToGridCell(x, y, grid);
      // stop the streamline if we are outside the boundaries of the plot
      if (cell[0] < 0 || cell[0] >= grid.size || cell[1] < 0 ||
          cell[1] >= grid.size) {
        terminate = true;
        lastStep = step;
        break;
      }

      // stop the streamline if we came to an already visited cell
      if (grid.visited[cell[0]][cell[1]]) {
        terminate = true;
        lastStep = step;
        break;
      }

      // if we entered a new cell which was not discovered before, mark it
      if (!discovered[cell[0]][cell[1]]) {
        discovered[cell[0]][cell[1]] = true;
      }
    }
    streamline.x = streamline.x.concat(trajectory.y[0].slice(0, lastStep));
    streamline.y = streamline.y.concat(trajectory.y[1].slice(0, lastStep));
  }

  if (timeSign < 0) {
    streamline.x = streamline.x.reverse();
    streamline.y = streamline.y.reverse();
  }

  return [streamline, discovered];
}
