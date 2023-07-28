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
 * keyword arguments:
 * @param line - a plotly object which contains the properties of the line
 * @param layout - a plotly layout object which will be passed to the plotly
 *     function
 * @param config - a plotly config object which will be passed to the plotly
 *     function
 * @param {int} density - how dense to plot the lines. Gives the number of lines
 *     which start from each border of the image
 * @param minlength - minimum allowed length of the line
 * @param {boolean} brokenStreamlines - If false, forces streamlines to continue
 *     until they
 *       leave the plot domain. If true, they may be terminated if they
 *       come too close to another streamline.
 * @param startingCoords - a vector of custom starting points. Should be given
 *     as `[[x1, y1], [x2, y2], ... ]`. If not provided,
 *     the starting points will be generated automatically on a grid.
 * @param criticalPoints - a vector of the critical points of the ODE. If given,
 *     the streamlines will terminate if they come too close to the critical
 *     points.
 * @param {float} criticalPointSafeSpace - determines the minimum distance
 *     between a streamline and a critical point.
 * @param {boolean} redraw - if true, a new plot is created, otherwise, the
 *     streamlines are drawn on top of existing lines.
 * @param {boolean} noDisplay - if true, the streamlines will only be
 *     precomputed but not drawn.
 */
function streamlines(plotlyDiv, rhs, params, xrange, yrange, {
  line,
  layout,
  config,
  density = 6,
  minlength = 0.1,
  brokenStreamlines = true,
  startingCoords = [],
  criticalPoints = [],
  criticalPointSafeSpace = 1e-3,
  redraw = true,
  noDisplay = false,
} = {}) {
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
  if (brokenStreamlines) {
    for (let i = 0; i < grid.size; i++) {
      grid.visited.push([]);
      grid.coordinates.push([]);
      for (let j = 0; j < grid.size; j++) {
        grid.visited[i].push(false);
        grid.coordinates[i].push([xnodes[i], ynodes[j]]);
      }
    }
  }

  if (startingCoords.length == 0) {
    startingCoords = _getStartingCoords(xrange, yrange, grid.size);
  }

  let streamlines = [];
  let streamline = {
    x: [],
    y: [],
  };

  // for every starting point, draw the streamline and add it to the vector
  for (const startingCoord of startingCoords) {
    [streamline, grid] = _getStreamline(
        rhs, params, startingCoord, grid, brokenStreamlines, minlength,
        criticalPoints, criticalPointSafeSpace);
    if (streamline.x.length > 1) {
      streamlines.push(streamline);
    }
  }

  let arrowPositions = _arrowPositions(streamlines, rhs, params);

  let defaultLine = {color: '#1f77b4'};

  let mergedLine = {...defaultLine, ...line};

  let traces = streamlines.map(streamline => {
    return {
      x: streamline.x,
      y: streamline.y,
      mode: 'lines',
      line: mergedLine,
      hoverinfo: 'none',
    };
  });

  if (!noDisplay) {
    if (redraw) {
      Plotly.react(plotlyDiv, traces, layout, config);
    } else {
      Plotly.addTraces(plotlyDiv, traces);
    }
  }

  let angleTrace = {
    x: arrowPositions.x,
    y: arrowPositions.y,
    mode: 'markers',
    hoverinfo: 'none',
    marker: {
      angleref: 'previous',
      symbol: 'triangle-up',
      size: 8,
      color: arrowPositions.mask,
      colorscale: [[0, '#ffffff00'], [1, mergedLine.color]],
    },
  };

  if (!noDisplay) {
    Plotly.addTraces(plotlyDiv, angleTrace);
  } else {
    traces.push(angleTrace);
  }

  return traces;
}

/**
 * Calculate coordinates from which the streamlines will start.
 */
function _getStartingCoords(xrange, yrange, density) {
  let startingCoords = [];
  let [xmin, xmax] = xrange;
  let [ymin, ymax] = yrange;
  let deltaX = (xmax - xmin) / density;
  let deltaY = (ymax - ymin) / density;

  /**
   * To fill the image uniformly, the starting points are sampled spiral-wise,
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

    // top
    for (let i = 0; i < numRingPoints; i++) {
      startingCoords.push([xminRing + i * deltaX, ymaxRing]);
    }
    // right
    for (let i = 0; i < numRingPoints; i++) {
      startingCoords.push([xmaxRing, ymaxRing - i * deltaY]);
    }
    // bottom
    for (let i = 0; i < numRingPoints; i++) {
      startingCoords.push([xminRing + i * deltaX, yminRing])
    }
    // left
    for (let i = 0; i < numRingPoints; i++) {
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

function _getStreamline(
    rhs, params, start, grid, brokenStreamlines, minlength, criticalPoints,
    criticalPointSafeSpace) {
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

  try {
    [forwardStreamline, discovered] = _integrate(
        rhs, params, start, grid, discovered, 1, brokenStreamlines,
        criticalPoints, criticalPointSafeSpace);
  } catch (error) {
    console.log('Error encountered during forward integration: ')
    console.log(error.message);
    forwardStreamline = {
      x: [],
      y: [],
    };
  }

  try {
    [backwardStreamline, discovered] = _integrate(
        rhs, params, start, grid, discovered, -1, brokenStreamlines,
        criticalPoints, criticalPointSafeSpace);
  } catch (error) {
    console.log('Error encountered during backward integration: ')
    console.log(error.message);
    backwardStreamline = {
      x: [],
      y: [],
    };
  }
  let streamline = {
    x: backwardStreamline.x.concat(forwardStreamline.x),
    y: backwardStreamline.y.concat(forwardStreamline.y),
  };

  // calculate the length of the streamline and check if it is long enough
  let totalLength = 0.0
  for (let i = 1; i < streamline.x.length; i++) {
    totalLength += Math.sqrt(
        (streamline.x[i] - streamline.x[i - 1]) ** 2 +
        (streamline.y[i] - streamline.y[i - 1]) ** 2)
  }

  if (totalLength < minlength) {
    return [{x: [], y: []}, grid]
  }

  // add the newly discovered cells
  let updatedGrid = structuredClone(grid);
  if (brokenStreamlines) {
    for (let i = 0; i < grid.size; i++) {
      for (let j = 0; j < grid.size; j++) {
        updatedGrid.visited[i][j] = grid.visited[i][j] || discovered[i][j];
      }
    }
  }

  return [streamline, updatedGrid]
}

function _integrate(
    rhs, params, start, grid, discovered, timeSign, brokenStreamlines,
    criticalPoints, criticalPointSafeSpace) {
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
  while (!terminate && numIterations < 5000) {
    numIterations += 1;

    let trajectory = solve_ode(internalRhs, [t, t + dt], [x, y]);

    let lastStep = trajectory.y.length;
    let cell = _coordToGridCell(x, y, grid);
    let prevCell = cell;

    for (let step = 0; step < trajectory.y.length; step++) {
      t = trajectory.t[step];
      x = trajectory.y[0][step];
      y = trajectory.y[1][step];

      prevCell = cell;
      cell = _coordToGridCell(x, y, grid);
      // stop the streamline if we are outside the boundaries of the plot
      if (cell[0] < 0 || cell[0] >= grid.size || cell[1] < 0 ||
          cell[1] >= grid.size) {
        terminate = true;
        lastStep = step;
        break;
      }

      // stop the streamline if we are too close to one of the critical points
      for (let point of criticalPoints) {
        if ((point[0] - x) ** 2 + (point[1] - y) ** 2 <
            criticalPointSafeSpace ** 2) {
          terminate = true;
          lastStep = step;
          break;
        }
      }

      if (brokenStreamlines) {
        // stop the streamline if we came to an already visited cell
        if (grid.visited[cell[0]][cell[1]]) {
          terminate = true;
          lastStep = step;
          break;
        }

        // if we entered a new cell which was not discovered before, mark it
        if (!discovered[cell[0]][cell[1]]) {
          discovered[cell[0]][cell[1]] = true;
        } else {
          if (prevCell[0] != cell[0] || prevCell[1] != cell[1]) {
            terminate = true;
            lastStep = step;
            break;
          }
        }
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

/**
 * Calculate the positions of the arrows.
 *
 * To draw the orientation of the arrows, the following galaxy-brain approach is
 * used. The position arrays consist of pairs of points very close to each
 * other. For example, positions.x might be `[0.0,
 * 0.0001, 1.0, 1.0001, 2.5, 2.50001 ... ]`.
 *
 * The second point in the pair is the point that is to be plotted, and the
 * first point is the same point shifted by a small Δt backwards in time. Plotly
 * can turn markers to point away from the previous point. Therefore, if every
 * second position is drawn, the arrows will have the correct orientation.
 */
function _arrowPositions(streamlines, rhs, params) {
  let positions = {
    x: [],
    y: [],
    mask: [],
  };
  for (let streamline of streamlines) {
    if (streamline.x.length < 2) {
      continue;
    }

    let cumLength = [0.0];
    for (let i = 1; i < streamline.x.length; i++) {
      let delta = Math.sqrt(
          (streamline.x[i] - streamline.x[i - 1]) ** 2 +
          (streamline.y[i] - streamline.y[i - 1]) ** 2);
      cumLength.push(cumLength[i - 1] + delta);
    }
    let totalLength = cumLength.at(-1);
    let ind = cumLength.findIndex(length => length > totalLength / 2);
    if (ind == cumLength.length - 1) {
      ind = Math.floor(cumLength.length / 2);
    }

    // Find the velocity of the arrow
    // TODO: this wouldn't work for non-autonomous systems
    let velocity = rhs(0.0, [streamline.x[ind], streamline.y[ind]], ...params);
    let prevX = streamline.x[ind] - velocity[0] * 0.01;
    let prevY = streamline.y[ind] - velocity[1] * 0.01;

    positions.x.push(prevX);
    positions.x.push(streamline.x[ind]);
    positions.y.push(prevY);
    positions.y.push(streamline.y[ind]);
    positions.mask.push(0);
    positions.mask.push(1);
  }

  return positions;
}