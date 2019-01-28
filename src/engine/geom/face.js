/**
 FACE
 Geometric face definition.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Face class.
 *
 * @class
 * @constructor
 * @param {Vertex[]|Vertex=} face_vertex - Initial vertex definition
 * @param {string=} face_name - Face name
 */
function Face(face_vertex, face_name) {
    /* eslint-disable no-extra-parens */
    /* eslint-disable no-mixed-operators */

    /**
     * ID of the face.
     * @type {string}
     * @private
     */
    this._id = generateID();

    /**
     * Array that contains the vertices of the face, ordered in CCW.
     * @type {Vertex[]}
     * @private
     */
    this._vertex = [];

    /**
     * Face name.
     * @type {string}
     * @private
     */
    this._name = '';

    /**
     * Assembled.
     * @type {boolean}
     * @private
     */
    this._assembled = false;

    /**
     * Stores face neighbours.
     * @type {Face[]|null}
     * @private
     */
    this._neighbours = null;

    /**
     * Pointer to object.
     * @type {Face}
     */
    let self = this;

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
     * Check if face is same as other.
     *
     * @function
     * @param {Face} face
     * @returns {boolean}
     */
    this.equals = function (face) {
        return this._id === face._id;
    };

    /**
     * Add vertex to face.
     *
     * @function
     * @param {Vertex|Vertex[]} vertex
     * @returns {boolean}
     */
    this.add_vertex = function (vertex) {

        if (isNullUndf(vertex)) return false;

        // If array
        if (vertex instanceof Array) {
            let r = true;
            for (let j = 0; j < vertex.length; j += 1) {
                r = r && this.add_vertex(vertex[j]);
            }
            return r;
        }

        // Check if vertex is not duplicated
        if (this.has_vertex(vertex)) return false;

        // Add vertex
        this._vertex.push(vertex);
        vertex.add_face(this);
        self._assembled = false;
        return true;

    };

    /**
     * Check if vertex exists.
     *
     * @function
     * @param {Vertex|Vertex[]} vertex
     * @returns {boolean}
     */
    this.has_vertex = function (vertex) {

        // If vertex array
        if (vertex instanceof Array) {
            let r = true;
            for (let j = 0; j < vertex.length; j += 1) {
                r = r && this.has_vertex(vertex[j]);
            }
            return r;
        }

        // Look for vertex, if not found returns false
        for (let i = 0; i < this._vertex.length; i += 1) {
            if (this._vertex[i].equals(vertex)) return true;
        }
        return false;

    };

    /**
     * Remove vertex.
     *
     * @function
     * @param {Vertex|Vertex[]} vertex
     */
    this.remove_vertex = function (vertex) {
        if (vertex instanceof Array) {
            for (let j = 0; j < vertex.length; j += 1) {
                this.remove_vertex(vertex[j]);
            }
            return;
        }
        for (let i = 0; i < this._vertex.length; i += 1) {
            if (this._vertex[i].equals(vertex)) {
                this._vertex.splice(i, 1);
                self._assembled = false;
                return;
            }
        }
    };

    /**
     * Return number of vertices.
     *
     * @function
     * @returns {number}
     */
    this.length = function () {
        return this._vertex.length;
    };

    /**
     * Check if face is defined by ccw vertex.
     *
     * @function
     * @returns {boolean}
     */
    this.is_ccw = function () {
        if (this._vertex.length < 3) return false;
        for (let i = 0; i < this._vertex.length; i += 1) {
            let i0 = this._vertex[i % this._vertex.length];
            let i1 = this._vertex[(i + 1) % this._vertex.length];
            let i2 = this._vertex[(i + 2) % this._vertex.length];
            // eslint-disable-next-line no-continue
            if (i0.collinear(i1, i2)) continue;
            if (!i0.ccw(i1, i2)) return false;
        }
        return true;
    };

    /**
     * Check if face is planar.
     *
     * @function
     * @returns {boolean}
     */
    this.is_planar = function () {

        // If face has less than three vertices then it's not planar
        if (this._vertex.length < 3) return false;

        // Compute first normal
        let n = this.get_normal();
        n.normalize();
        let nx = n.getComponent(0);
        let ny = n.getComponent(1);
        let nz = n.getComponent(2);

        // Check each combination
        for (let i = 1; i < this._vertex.length; i += 1) {
            let i0 = this._vertex[i % this._vertex.length];
            let i1 = this._vertex[(i + 1) % this._vertex.length];
            let i2 = this._vertex[(i + 2) % this._vertex.length];
            // eslint-disable-next-line no-continue
            if (i0.collinear(i1, i2)) continue;
            n = this._normal(i0, i1, i2);
            n.normalize();
            if (n.getComponent(0) !== nx || n.getComponent(1) !== ny || n.getComponent(2) !== nz) {
                return false;
            }
        }
        return true;

    };

    /**
     * Calculates the normal vector from 3 vertices.
     *
     * @function
     * @param {Vertex} v1
     * @param {Vertex} v2
     * @param {Vertex} v3
     * @returns {Vector3}
     * @private
     */
    this._normal = function (v1, v2, v3) {

        // Compute vectors
        let a1 = v2.get_x() - v1.get_x();
        let a2 = v2.get_y() - v1.get_y();
        let a3 = v2.get_z() - v1.get_z();

        let b1 = v3.get_x() - v2.get_x();
        let b2 = v3.get_y() - v2.get_y();
        let b3 = v3.get_z() - v2.get_z();

        // Compute cross vector
        let nx = a2 * b3 - a3 * b2;
        let ny = a1 * b3 - a3 * b1;
        let nz = a1 * b2 - a2 * b1;

        // Return new vector
        return new THREE.Vector3(nx, -ny, nz);

    };

    /**
     * Return plane normal.
     *
     * @function
     * @returns {Vector3|null}
     */
    this.get_normal = function () {
        for (let i = 0; i < this._vertex.length; i += 1) {
            let i0 = this._vertex[i % this._vertex.length];
            let i1 = this._vertex[(i + 1) % this._vertex.length];
            let i2 = this._vertex[(i + 2) % this._vertex.length];
            // eslint-disable-next-line no-continue
            if (i0.collinear(i1, i2)) continue;
            return this._normal(i0, i1, i2);
        }
        return null; // All vertices are collinear
    };

    /**
     * Set face name.
     *
     * @function
     * @param {string} s - Name
     */
    this.set_name = function (s) {
        if (isNullUndf(s)) return;
        self._name = s;
    };

    /**
     * Return face name.
     *
     * @function
     * @returns {string}
     */
    this.get_name = function () {
        return this._name;
    };

    /**
     * Check face is valid and well defined.
     *
     * @function
     * @returns {boolean}
     */
    this.is_valid = function () {
        return ((this.is_cartesian_plane() === this.is_ccw()) && this.is_planar()) ||
            (this.is_ccw() && this.is_planar());
    };

    /**
     * Return face area.
     *
     * @function
     * @returns {number}
     */
    this.get_area = function () {
        if (!this.is_valid()) return -1;
        let zero = this._vertex[0];
        let area = 0;
        for (let i = 0; i < this._vertex.length; i += 1) {
            let i0 = i % this._vertex.length;
            let i1 = (i + 1) % this._vertex.length;
            area += zero.area2(this._vertex[i0], this._vertex[i1]);
        }
        return area;
    };

    /**
     * Calculate face perimeter.
     *
     * @function
     * @returns {number}
     */
    this.get_perimeter = function () {
        if (!this.is_valid()) return -1;
        let dist = 0;
        for (let i = 0; i < this._vertex.length; i += 1) {
            let i0 = i % this._vertex.length;
            let i1 = (i + 1) % this._vertex.length;
            dist += this._vertex[i0].dist(this._vertex[i1]);
        }
        return dist;
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
        for (let i = 0; i < this._vertex.length; i += 1) {
            this._vertex[i].scale(s, sx, sy, sz);
        }
    };

    /**
     * Translate face.
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
        for (let i = 0; i < this._vertex.length; i += 1) {
            this._vertex[i].translate(tx, ty, tz);
        }
    };

    /**
     * Returns next vertex, null if not found.
     *
     * @function
     * @param {Vertex} vertex
     * @returns {Vertex|null}
     */
    this.get_next_vertex = function (vertex) {
        for (let i = 0; i < this._vertex.length; i += 1) {
            if (this._vertex[i].equals(vertex)) {
                return this._vertex[(i + 1) % this._vertex.length];
            }
        }
        return null;
    };

    /**
     * Returns previous vertex, null if not found.
     *
     * @function
     * @param {Vertex} vertex
     * @returns {Vertex|null}
     */
    this.get_prev_vertex = function (vertex) {
        for (let i = 0; i < this._vertex.length; i += 1) {
            if (this._vertex[i].equals(vertex)) {
                let j = i - 1;
                if (j < 0) j = this._vertex.length - 1;
                return this._vertex[j];
            }
        }
        return null;
    };

    /**
     * Return face neighbours.
     *
     * @function
     * @returns {Face[]}
     */
    this.get_neighbours = function () {
        /* eslint-disable no-continue */

        // Neighbours list
        let n = [];
        let n_id = []; // Stores ID

        /**
         * Iterate though each vertex of the face and look for faces
         * that share 2 vertices with the same face
         */
        for (let i = 0; i < this._vertex.length; i += 1) {

            // Get faces of the vertex
            let v = this._vertex[i];
            let f = v.get_faces();
            for (let j = 0; j < f.length; j += 1) {

                // If face is different than the current one
                if (f[j].equals(this)) { // noinspection UnnecessaryContinueJS
                    continue;
                }

                // Get previous or next vertex exists in same face
                if (this.has_vertex(v.next(f[j])) || this.has_vertex(v.prev(f[j]))) {

                    // Stores neighbour face
                    if (!n_id.includes(f[j].get_id())) {
                        n.push(f[j]);
                        n_id.push(f[j].get_id());
                    }

                }

            }

        }

        // Return face list
        return n;

    };

    /**
     * Assemble face.
     *
     * @function
     */
    this.assemble = function () {
        self._assembled = true;
        self._neighbours = this.get_neighbours();
    };

    /**
     * Check if face if neighbour.
     *
     * @function
     * @param {Face|Face[]} face
     * @param {boolean=} strict - Only the defined faces can be neighbours
     * @returns {boolean}
     */
    this.is_neighbour = function (face, strict) {
        if (!this._assembled) this.assemble();
        if (face instanceof Array) {
            let r = true;
            for (let j = 0; j < face.length; j += 1) {
                r = r && this.is_neighbour(face[j], false);
            }
            return r && (face.length === this._neighbours.length);
        }
        if (strict) return this._neighbours.length === 1 && this._neighbours[0].equals(face);
        for (let i = 0; i < this._neighbours.length; i += 1) {
            if (this._neighbours[i].equals(face)) return true;
        }
        return false;
    };

    /**
     * Get total number of neighbours.
     *
     * @function
     * @return {number}
     */
    this.get_total_neighbours = function () {
        if (!this._assembled) this.assemble();
        return this._neighbours.length;
    };

    /**
     * Check if the face is along a cartesian plane.
     *
     * @function
     * @return {boolean}
     */
    this.is_cartesian_plane = function () {
        let n = this.get_normal();
        let x = n.getComponent(0);
        let y = n.getComponent(1);
        let z = n.getComponent(2);
        return (x !== 0 && y === 0 && z === 0) || (x === 0 && y !== 0 && z === 0) ||
            (x === 0 && y === 0 && z !== 0);
    };

    /**
     * Return face vertices.
     *
     * @function
     * @return {Vertex[]}
     */
    this.get_vertices = function () {
        return this._vertex.slice(0);
    };

    /**
     * Apply constructor
     */
    this.add_vertex(face_vertex);
    this.set_name(face_name);

}