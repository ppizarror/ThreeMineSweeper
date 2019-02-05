/**
 VERTEX
 Geometric vertex definition.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Vertex class.
 *
 * @class
 * @constructor
 * @param {number=} x - X position
 * @param {number=} y - Y position
 * @param {number=} z - Z position
 * @param {string=} vertex_name - Vertex name
 */
function Vertex(x, y, z, vertex_name) {
    /* eslint-disable new-cap */
    /* eslint-disable no-extra-parens */

    /**
     * If x, y, z not defined then fill by zero
     */
    if (isNullUndf(x)) x = 0;
    if (isNullUndf(y)) y = 0;
    if (isNullUndf(z)) z = 0;

    /**
     * ID of the vertex.
     * @type {string}
     * @private
     */
    this._id = generateID();

    /**
     * Array that contains the faces that share the same vertex.
     * @type {Face[]}
     * @private
     */
    this._faces = [];

    /**
     * Vertex name.
     * @type {string}
     * @private
     */
    this._name = '';

    /**
     * Pointer to object.
     * @type {Vertex}
     */
    let self = this;

    /**
     * Position of the vertex.
     * @type {Vector3}
     * @private
     */
    this._position = new THREE.Vector3(x, y, z);

    /**
     * Returns the previous vertex from a face.
     *
     * @function
     * @param {Face} face - Face object
     * @returns {Vertex}
     */
    this.prev = function (face) {
        for (let i = 0; i < this._faces.length; i += 1) {
            if (this._faces[i].equals(face)) {
                return this._faces[i].get_prev_vertex(this);
            }
        }
        return null;
    };

    /**
     * Returns the next vertex from a face, null if not found.
     *
     * @function
     * @param {Face} face - Face object
     * @returns {Vertex|null}
     */
    this.next = function (face) {
        for (let i = 0; i < this._faces.length; i += 1) {
            if (this._faces[i].equals(face)) {
                return this._faces[i].get_next_vertex(this);
            }
        }
        return null;
    };

    /**
     * Return object ID.
     *
     * @function
     * @returns {string}
     */
    this.get_id = function () {
        return this._id;
    };

    /**
     * Set vertex name.
     *
     * @function
     * @param {string} s - Name
     */
    this.set_name = function (s) {
        if (isNullUndf(s)) return;
        self._name = s;
    };

    /**
     * Return vertex name.
     *
     * @function
     * @returns {string}
     */
    this.get_name = function () {
        return this._name;
    };

    /**
     * Adds a face to the vertex.
     *
     * @function
     * @param {Face | Face[]} face - Face object
     * @returns {boolean}
     */
    this.add_face = function (face) {

        // If face is an array then call multiple times
        if (face instanceof Array) {
            let r = true;
            for (let j = 0; j < face.length; j += 1) {
                r = r && this.add_face(face[j]);
            }
            return r;
        }

        // Check face has not been added
        for (let i = 0; i < this._faces.length; i += 1) {
            if (this._faces[i].equals(face)) {
                return false;
            }
        }

        // Add face to list
        this._faces.push(face);
        return true;

    };

    /**
     * Check if the vertex defines some face.
     *
     * @function
     * @param {Face | Face[]} face
     * @returns {boolean}
     */
    this.has_face = function (face) {
        if (face instanceof Array) {
            for (let j = 0; j < face.length; j += 1) {
                if (!this.has_face(face[j])) return false;
            }
            return true;
        }
        for (let i = 0; i < this._faces.length; i += 1) {
            if (this._faces[i].equals(face)) return true;
        }
        return false;
    };

    /**
     * Remove face.
     *
     * @function
     * @param {Face | Face[]} face
     */
    this.remove_face = function (face) {
        if (face instanceof Array) {
            for (let j = 0; j < face.length; j += 1) {
                this.remove_face(face[j]);
            }
            return;
        }
        for (let i = 0; i < this._faces.length; i += 1) {
            if (this._faces[i].equals(face)) {
                this._faces.splice(i, 1);
                return;
            }
        }
    };

    /**
     * Return vertex position as vector.
     *
     * @function
     * @param {boolean=} apply_z - Apply Z conversion
     * @returns {Vector3}
     */
    this.get_pos = function (apply_z) {
        if (apply_z) {
            return new THREE.Vector3(this.get_y(), this.get_z(), this.get_x());
        }
        return this._position.clone();
    };

    /**
     * Return x position.
     *
     * @function
     * @returns {number}
     */
    this.get_x = function () {
        return this._position.getComponent(0);
    };

    /**
     * Return y position.
     *
     * @function
     * @returns {number}
     */
    this.get_y = function () {
        return this._position.getComponent(1);
    };

    /**
     * Return z position.
     *
     * @function
     * @returns {number}
     */
    this.get_z = function () {
        return this._position.getComponent(2);
    };

    /**
     * Set x position.
     *
     * @function
     * @param {number} pos - Position coordinate
     */
    this.set_x = function (pos) {
        this._position.setX(pos);
    };

    /**
     * Set x position.
     *
     * @function
     * @param {number} pos - Position coordinate
     */
    this.set_y = function (pos) {
        this._position.setY(pos);
    };

    /**
     * Set x position.
     *
     * @function
     * @param {number} pos - Position coordinate
     */
    this.set_z = function (pos) {
        this._position.setZ(pos);
    };

    /**
     * Calculates the distance respect another vertex
     *
     * @function
     * @param {Vertex=} vertex - Vertex
     * @returns {number}
     */
    this.dist = function (vertex) {

        // If vertex is not defined then calculates the distance respect to the center
        if (isNullUndf(vertex)) {
            let zero = new THREE.Vector3(0, 0, 0);
            return this._position.distanceTo(zero);
        }

        // If vertex defined
        return this._position.distanceTo(vertex.get_pos());

    };

    /**
     * Check if vertex is the same.
     *
     * @function
     * @param {Vertex} vertex - Vertex to test
     * @returns {boolean}
     */
    this.equals = function (vertex) {
        return this._id === vertex.get_id();
    };

    /**
     * Adds position to vertex.
     *
     * @function
     * @param {Vertex} vertex - Adds vertex
     */
    this.add = function (vertex) {
        this._position.add(vertex._position);
    };

    /**
     * Adds position to vertex.
     *
     * @function
     * @param {Vertex} vertex - Adds vertex
     */
    this.subtract = function (vertex) {
        let v = vertex._position.clone();
        v.negate();
        this._position.add(v);
    };

    /**
     * Check if vertex position is close to zero.
     *
     * @function
     * @returns {boolean}
     */
    this.is_zero = function () {
        return this.dist() < MIN_TOL;
    };

    /**
     * Check if vertex is close to other.
     *
     * @function
     * @param {Vertex} vertex - Vertex to compare
     * @returns {boolean}
     */
    this.close_to = function (vertex) {
        return this.dist(vertex) < MIN_TOL;
    };

    /**
     * Check if vertex is in ccw order along two other vertices.
     *
     * @function
     * @param {Vertex} v1
     * @param {Vertex} v2
     * @returns {boolean}
     */
    this.ccw = function (v1, v2) {

        // If v1 or v2 is the same then return false
        if (this.equals(v1) || this.equals(v2)) return false;

        // Calculate vectors
        let x1 = v1.get_x() - this.get_x();
        let y1 = v1.get_y() - this.get_y();
        let z1 = v1.get_z() - this.get_z();
        let x2 = v2.get_x() - this.get_x();
        let y2 = v2.get_y() - this.get_y();
        let z2 = v2.get_z() - this.get_z();

        /**
         * Calculate u vector
         * https://math.stackexchange.com/questions/128991/how-to-calculate-area-of-3d-triangle
         */
        let x3 = (y1 * z2) - (y2 * z1);
        let y3 = (x1 * z2) - (x2 * z1);
        let z3 = (x1 * y2) - (x2 * y1);

        // Return area
        return !(x3 > 0 || y3 > 0 || z3 > 0);

    };

    /**
     * Check if vertices are collinear.
     *
     * @function
     * @param {Vertex} v1
     * @param {Vertex} v2
     * @returns {boolean}
     */
    this.collinear = function (v1, v2) {
        if (this.equals(v1) || this.equals(v2)) return false;
        return this.area2(v1, v2) === 0;
    };

    /**
     * Calculates the area with vertices v1 and v2.
     *
     * @function
     * @param {Vertex} v1
     * @param {Vertex} v2
     * @returns {number}
     */
    this.area2 = function (v1, v2) {

        // No area
        if (this.equals(v1) || this.equals(v2)) return 0;

        // Calculate vectors
        let x1 = v1.get_x() - this.get_x();
        let y1 = v1.get_y() - this.get_y();
        let z1 = v1.get_z() - this.get_z();
        let x2 = v2.get_x() - this.get_x();
        let y2 = v2.get_y() - this.get_y();
        let z2 = v2.get_z() - this.get_z();

        /**
         * Calculate u vector
         * https://math.stackexchange.com/questions/128991/how-to-calculate-area-of-3d-triangle
         */
        let x3 = (y1 * z2) - (y2 * z1);
        let y3 = (x1 * z2) - (x2 * z1);
        let z3 = (x1 * y2) - (x2 * y1);

        // noinspection JSSuspiciousNameCombination
        let a = Math.sqrt(Math.pow(x3, 2) + Math.pow(y3, 2) + Math.pow(z3, 2));
        return a * 0.5;

    };

    /**
     * Scale position.
     *
     * @function
     * @param {number} s - Scale factor
     * @param {number=} sx - X coordinate scale factor
     * @param {number=} sy - Y coordinate scale factor
     * @param {number=} sz - Z coordinate scale factor
     */
    this.scale = function (s, sx, sy, sz) {
        if (isNullUndf(sx)) sx = 1;
        if (isNullUndf(sy)) sy = 1;
        if (isNullUndf(sz)) sz = 1;
        this.set_x(this.get_x() * s * sx);
        this.set_y(this.get_y() * s * sy);
        this.set_z(this.get_z() * s * sz);
    };

    /**
     * Translate vertex.
     *
     * @function
     * @param {number=} tx - X coordinate
     * @param {number=} ty - Y coordinate
     * @param {number=} tz - Z coordinate
     */
    this.translate = function (tx, ty, tz) {
        if (isNullUndf(tx)) tx = 0;
        if (isNullUndf(ty)) ty = 0;
        if (isNullUndf(tz)) tz = 0;
        this.set_x(this.get_x() + tx);
        this.set_y(this.get_y() + ty);
        this.set_z(this.get_z() + tz);
    };

    /**
     * Print object to console.
     *
     * @function
     */
    this.print = function () {
        app_console.info('Vertex <{0}> at ({1},{2},{3})'.format(this._name, this.get_x(), this.get_y(), this.get_z()));
    };

    /**
     * Returns face array.
     *
     * @function
     * @returns {Face[]}
     */
    this.get_faces = function () {
        return this._faces.slice(0);
    };

    /**
     * Return total faces that share the same vertex.
     *
     * @function
     * @returns {number}
     */
    this.total_faces = function () {
        return this._faces.length;
    };

    /**
     * Check if vertex has the same position.
     *
     * @function
     * @param {Vertex} vertex
     * @returns {boolean}
     */
    this.equal_position = function (vertex) {
        return this._eq_pos(this.get_x(), vertex.get_x()) && this._eq_pos(this.get_y(), vertex.get_y()) &&
            this._eq_pos(this.get_z(), vertex.get_z());
    };

    /**
     * Check if two positions are the same.
     *
     * @function
     * @param {number} a
     * @param {number} b
     * @returns {boolean}
     * @private
     */
    this._eq_pos = function (a, b) {
        return Math.abs(a - b) < MIN_TOL;
    };

    /**
     * Join vertex and replace external, vertices must have same position.
     *
     * @function
     * @param {Vertex} vertex
     * @returns {boolean}
     */
    this.join_replace = function (vertex) {
        if (!this.equal_position(vertex)) return false;
        this.set_name(vertex.get_name());
        let f = vertex.get_faces();
        for (let i = 0; i < f.length; i += 1) {
            this.add_face(f[i]);
            vertex.remove_face(f[i]);
            f[i].replace_vertex(vertex, this);
        }
        return true;
    };

    /**
     * Apply constructor
     */
    this.set_name(vertex_name);

}