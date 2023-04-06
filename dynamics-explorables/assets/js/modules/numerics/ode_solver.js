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
 * This is a pure javascript implementation and might be slow.
 *
 * @param {function} rhs - the right-hand side of the ODE. Should be called as
 *     rhs(t, y).
 * @param {Array} tspan - an array with two elements: `[tstart, tend]`.
 * @param {Array | number} y0 - the initial condition at time point t = tstart.
 * @returns {Object} - an object with the fields t and y
 */
function solve_ode(rhs, tspan, y0) {
  return y0;
}