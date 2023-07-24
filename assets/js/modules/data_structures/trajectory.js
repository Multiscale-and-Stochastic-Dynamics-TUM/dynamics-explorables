export {Trajectory2D, Trajectory3D};

/**
 * A set of points in 2D space and the corresponding time points.
 */
class Trajectory2D {
  constructor(t, x, y) {
    this.t = t || [];
    this.x = x || [];
    this.y = y || [];
    this.length = this.t.length
  }

  /**
   * Append the other trajectory at the end. Non-mutating, returns a new
   * Trajectory.
   * @param {Trajectory2D} other
   * @returns {Trajectory2D}
   */
  append(other) {
    var result = new Trajectory2D();
    result.t = this.t.concat(other.t);
    result.x = this.x.concat(other.x);
    result.y = this.y.concat(other.y);
    result.length = result.t.length;
    return result;
  }

  /**
   * Slice the trajectory. Non-mutating, returns a new Trajectory.
   * @param {number} start
   * @param {number} end
   * @returns {Trajectory2D}
   */
  slice(start, end) {
    var result = new Trajectory2D();
    result.t = this.t.slice(start, end);
    result.x = this.x.slice(start, end);
    result.y = this.y.slice(start, end);
    result.length = result.t.length;
    return result;
  }
}

/**
 * A set of points in 3D space and the corresponding time points.
 */
class Trajectory3D {
  constructor(t, x, y, z) {
    this.t = t || [];
    this.x = x || [];
    this.y = y || [];
    this.z = z || [];
    this.length = this.t.length
  }

  /**
   * Append the other trajectory at the end. Non-mutating, returns a new
   * Trajectory.
   * @param {Trajectory3D} other
   * @returns {Trajectory3D}
   */
  append(other) {
    var result = new Trajectory3D();
    result.t = this.t.concat(other.t);
    result.x = this.x.concat(other.x);
    result.y = this.y.concat(other.y);
    result.z = this.z.concat(other.z);
    result.length = result.t.length;
    return result;
  }

  /**
   * Slice the trajectory. Non-mutating, returns a new Trajectory.
   * @param {number} start
   * @param {number} end
   * @returns {Trajectory3D}
   */
  slice(start, end) {
    var result = new Trajectory3D();
    result.t = this.t.slice(start, end);
    result.x = this.x.slice(start, end);
    result.y = this.y.slice(start, end);
    result.z = this.z.slice(start, end);
    result.length = result.t.length;
    return result;
  }
}
