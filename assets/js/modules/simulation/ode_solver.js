var ode45 = require('ode45-cash-karp')

export {solve_ode};

/**
 * Solve the ode
 *
 *    dy/dt = rhs(y, t)
 *    y(t0) = y0
 *
 * on the time interval given by `tspan` using the RK45 method with adaptive
 * time steps.
 *
 * @param {function} rhs - the right-hand side of the ODE. Should be called as
 *     rhs(t, y).
 * @param {Array} tspan - an array with two elements: `[tstart, tend]`.
 * @param {Array | number} y0 - the initial condition at time point t = tstart.
 * @param {Array} args - an array of additional arguments to the rhs function
 * @returns {Object} - an object with fields t and y
 */
function solve_ode(rhs, tspan, y0, args = []) {
  // Wrap the rhs as the solver needs it
  function rhs_wrap(ydot, y, t) {
    result = rhs(t, y, ...args);
    for (let i = 0; i < y.length; i++) {
      ydot[i] = result[i];
    }
  }

  // initial time step
  let dt0 = 1e-3;

  // Initialize:
  let integrator = ode45(y0, rhs_wrap, tspan[0], dt0);

  let solution = {'t': [], 'y': []};
  let dim = y0.length;
  for (let i = 0; i < dim; i++) {
    solution.y.push([]);
  }

  while (integrator.step(tspan[1])) {
    solution.t.push(integrator.t);
    for (let i = 0; i < dim; i++) {
      solution.y[i].push(integrator.y[i]);
    }
  }
  return solution;
}