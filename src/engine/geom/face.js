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
 * @param {Vertex[] | Vertex=} face_vertex - Initial vertex definition
 * @param {string=} face_name - Face name
 */
function Face(face_vertex, face_name) {
    /* eslint-disable arrow-parens */
    /* eslint-disable newline-per-chained-call */
    /* eslint-disable no-extra-parens */
    /* eslint-disable no-mixed-operators */
    /* eslint-disable no-nested-ternary */

    /**
     * ------------------------------------------------------------------------
     * Topology definition
     * ------------------------------------------------------------------------
     */

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
     * Array that contains volumes.
     * @type {Volume[]}
     * @private
     */
    this._volumes = [];

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
     * @type {Face[] | null}
     * @private
     */
    this._neighbours = null;

    /**
     * Rotation texture in sexagesimal angles.
     * @type {number}
     * @private
     */
    this._uv_rotation = 0;

    /**
     * Flip uv texture.
     * @type {boolean}
     * @private
     */
    this._uv_flip = false;

    /**
     * UV texture coordinates scale factor.
     * @type {number}
     * @private
     */
    this._uv_scale = 1;

    /**
     * UV texture rotation center.
     * @type {Vector2}
     * @private
     */
    this._uv_center = new THREE.Vector2(0.5, 0.5);

    /**
     * UV texture translate coordinates.
     * @type {Vector2}
     * @private
     */
    this._uv_traslate = new THREE.Vector2(0, 0);

    /**
     * Stores three.js mesh object.
     * @type {Mesh | null}
     * @private
     */
    this._mesh = null;

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
     * @param {Vertex | Vertex[]} vertex
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
     * @param {Vertex | Vertex[]} vertex
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
     * @param {Vertex | Vertex[]} vertex
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
     * Reverse vertices.
     *
     * @function
     */
    this.reverse_vertices = function () {
        this._vertex.reverse();
    };

    /**
     * Push all vertices to right.
     *
     * @function
     */
    this.push_right = function () {
        let v = this._vertex.shift();
        this._vertex.push(v);
    };

    /**
     * Push all vertices to left.
     *
     * @function
     */
    this.push_left = function () {
        let v = this._vertex.pop();
        this._vertex.unshift(v);
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
     * Return faces around current.
     *
     * @function
     * @returns {Face[]}
     */
    this.get_faces_around = function () {
        /* eslint-disable no-continue */

        // Neighbours list
        let n = [];
        let n_id = []; // Stores ID

        /**
         * Iterate though each vertex of the face and look for faces
         * that share 1 vertex with the face
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

                // Stores neighbour face
                if (!n_id.includes(f[j].get_id())) {
                    n.push(f[j]);
                    n_id.push(f[j].get_id());
                }

            }

        }

        // Return face list
        return n;
    };

    /**
     * Return neighbours as a string list.
     *
     * @function
     * @returns {string}
     */
    this.get_neighbours_strlist = function () {
        let l = '';
        let n = this.get_neighbours();
        for (let i = 0; i < n.length; i += 1) {
            l += n[i].get_name();
            if (i < n.length - 1) {
                l += ', ';
            }
        }
        return l;
    };

    /**
     * Assemble face.
     *
     * @function
     */
    this.assemble = function () {
        if (self._assembled) return;
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
     * @returns {number}
     */
    this.get_total_neighbours = function () {
        if (!this._assembled) this.assemble();
        return this._neighbours.length;
    };

    /**
     * Check if the face is along a cartesian plane.
     *
     * @function
     * @returns {boolean}
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
     * @returns {Vertex[]}
     */
    this.get_vertices = function () {
        return this._vertex.slice(0);
    };

    /**
     * Return Three.js Points.
     *
     * @function
     * @param {boolean=} apply_z - Apply z conversion
     * @returns {Vector3[]}
     */
    this.get_threejs_points = function (apply_z) {
        let p = [];
        for (let i = 0; i < this.length(); i += 1) {
            p.push(this._vertex[i].get_pos(apply_z))
        }
        return p;
    };

    /**
     * Generates geometry to push back to Three.js, uses earcut to triangulate.
     *
     * @function
     * @returns {Geometry}
     */
    this.generate_geometry = function () {

        // Generate new Geometry
        let geom = new THREE.Geometry();
        let normal = this.get_normal();
        normal.normalize();

        // Triangulates, rotate points respect to normal Z
        let triangles;
        let ntriang; // Number of triangles

        // If face has 3 vertices
        if (this.length() === 3) {
            triangles = [0, 1, 2];
            ntriang = 1;
        } else {
            let coords = [];
            let points = this.get_threejs_points(false);
            let normalZ = new THREE.Vector3(0, 0, 1);
            let quaternion = new THREE.Quaternion().setFromUnitVectors(normal, normalZ);
            let quaternionBack = new THREE.Quaternion().setFromUnitVectors(normalZ, normal);
            points.forEach(p => {
                p.applyQuaternion(quaternion)
            });
            for (let i = 0; i < points.length; i += 1) {
                coords.push(points[i].getComponent(0));
                coords.push(points[i].getComponent(1));
                coords.push(points[i].getComponent(2));
            }
            let max_coord = Math.abs(getMaxOfArray(coords));
            for (let i = 0; i < coords.length; i += 1) {
                coords[i] /= max_coord;
            }
            points.forEach(p => {
                p.applyQuaternion(quaternionBack)
            });
            triangles = earcut(coords, null, 3);
            ntriang = triangles.length / 3;
        }

        // Generates faces
        if (ntriang > 0) {
            for (let i = 0; i < this._vertex.length; i += 1) {
                geom.vertices.push(this._vertex[i].get_pos(true));
            }
            for (let j = 0; j < ntriang; j += 1) {
                geom.faces.push(new THREE.Face3(triangles[3 * j + 2], triangles[3 * j + 1], triangles[3 * j], normal));
            }
        }

        // Computes normals
        geom.computeFaceNormals();
        geom.computeVertexNormals();

        // Compute UV
        this._boxUnwrapUVs(geom);

        // Returns geometry
        return geom;

    };

    /**
     * Create UV texture coordinates from plane.
     *
     * @function
     * @param {Geometry} geometry
     * @private
     */
    this._boxUnwrapUVs = function (geometry) {
        // https://stackoverflow.com/questions/51659109/three-js-calculate-the-custom-uvs-for-custom-buffer-geometry
        if (!geometry.boundingBox) geometry.computeBoundingBox();
        let sz = geometry.boundingBox.getSize(new THREE.Vector3());
        let min = geometry.boundingBox.min;
        if (geometry.faceVertexUvs[0].length === 0) {
            for (let i = 0; i < geometry.faces.length; i += 1) {
                geometry.faceVertexUvs[0].push([new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()]);
            }
        }
        for (let i = 0; i < geometry.faces.length; i += 1) {
            let faceUVs = geometry.faceVertexUvs[0][i];
            let va = geometry.vertices[geometry.faces[i].a];
            let vb = geometry.vertices[geometry.faces[i].b];
            let vc = geometry.vertices[geometry.faces[i].c];
            let vab = new THREE.Vector3().copy(vb).sub(va);
            let vac = new THREE.Vector3().copy(vc).sub(va);
            let vcross = new THREE.Vector3().copy(vab).cross(vac);
            // noinspection JSSuspiciousNameCombination
            vcross.set(Math.abs(vcross.x), Math.abs(vcross.y), Math.abs(vcross.z));
            let majorAxis = vcross.x > vcross.y ? (vcross.x > vcross.z ? 'x' : vcross.y > vcross.z ? 'y' : vcross.y > vcross.z) : vcross.y > vcross.z ? 'y' : 'z';
            // Take the other two axis from the largest axis
            let uAxis = majorAxis === 'x' ? 'y' : majorAxis === 'y' ? 'x' : 'x';
            let vAxis = majorAxis === 'x' ? 'z' : majorAxis === 'y' ? 'z' : 'y';
            if (!this._uv_flip) {
                faceUVs[0].set((va[uAxis] - min[uAxis]) / sz[uAxis], (va[vAxis] - min[vAxis]) / sz[vAxis]);
                faceUVs[1].set((vb[uAxis] - min[uAxis]) / sz[uAxis], (vb[vAxis] - min[vAxis]) / sz[vAxis]);
                faceUVs[2].set((vc[uAxis] - min[uAxis]) / sz[uAxis], (vc[vAxis] - min[vAxis]) / sz[vAxis]);
            } else {
                faceUVs[0].set((va[vAxis] - min[vAxis]) / sz[vAxis], (va[uAxis] - min[uAxis]) / sz[uAxis]);
                faceUVs[1].set((vb[vAxis] - min[vAxis]) / sz[vAxis], (vb[uAxis] - min[uAxis]) / sz[uAxis]);
                faceUVs[2].set((vc[vAxis] - min[vAxis]) / sz[vAxis], (vc[uAxis] - min[uAxis]) / sz[uAxis]);
            }
            faceUVs[0].rotateAround(this._uv_center, this._uv_rotation);
            faceUVs[1].rotateAround(this._uv_center, this._uv_rotation);
            faceUVs[2].rotateAround(this._uv_center, this._uv_rotation);
            faceUVs[0].multiplyScalar(this._uv_scale);
            faceUVs[1].multiplyScalar(this._uv_scale);
            faceUVs[2].multiplyScalar(this._uv_scale);
            faceUVs[0].add(this._uv_traslate);
            faceUVs[1].add(this._uv_traslate);
            faceUVs[2].add(this._uv_traslate);
        }
        geometry.elementsNeedUpdate = true;
        geometry.verticesNeedUpdate = true;
    };

    /**
     * Removes face from vertices.
     *
     * @function
     */
    this.remove = function () {
        for (let i = 0; i < this._vertex.length; i += 1) {
            this._vertex[i].remove_face(this);
        }
    };

    /**
     * Check vertex topology.
     *
     * @function
     */
    this.check_vertices = function () {
        for (let i = 0; i < this._vertex.length; i += 1) {
            this._vertex[i].add_face(this);
        }
    };

    /**
     * Adds volume.
     *
     * @function
     * @param {Volume} volume
     * @returns {boolean}
     */
    this.add_volume = function (volume) {
        if (this.has_volume(volume)) return false;
        this._volumes.push(volume);
        return true;
    };

    /**
     * Face contains volume.
     *
     * @function
     * @param {Volume} volume
     * @returns {boolean}
     */
    this.has_volume = function (volume) {
        for (let i = 0; i < this._volumes.length; i += 1) {
            if (this._volumes[i].equals(volume)) return true;
        }
        return false;
    };

    /**
     * Remove volume from face.
     *
     * @function
     * @param {Volume} volume
     * @returns {boolean}
     */
    this.remove_volume = function (volume) {
        for (let i = 0; i < this._volumes.length; i += 1) {
            if (this._volumes[i].equals(volume)) {
                this._volumes.splice(i, 1);
                return true;
            }
        }
        return false;
    };

    /**
     * Replaces vertex.
     *
     * @function
     * @param {Vertex} from
     * @param {Vertex} to
     * @returns {boolean}
     */
    this.replace_vertex = function (from, to) {
        for (let i = 0; i < this._vertex.length; i += 1) {
            if (this._vertex[i].equals(from)) {
                this._vertex[i] = to;
                return true;
            }
        }
        return false;
    };

    /**
     * Set UV texture rotation angle (0-360).
     *
     * @function
     * @param {number} angle
     */
    this.set_uv_rotation = function (angle) {
        self._uv_rotation = angle * Math.PI / 180;
    };

    /**
     * Flips UV texture coordinates.
     *
     * @function
     */
    this.enable_uv_flip = function () {
        self._uv_flip = true;
    };

    /**
     * Set UV texture coordinates scale.
     *
     * @function
     * @param {number} scale
     */
    this.set_uv_scale = function (scale) {
        if (scale === 0 || scale < 0) return;
        self._uv_scale = scale;
    };

    /**
     * Set UV texture translate coordinates.
     *
     * @function
     * @param {number} x
     * @param {number} y
     */
    this.set_uv_translate = function (x, y) {
        self._uv_traslate.setX(-x);
        self._uv_traslate.setY(-y);
    };

    /**
     * Set three.js mesh object.
     *
     * @function
     * @param {Mesh} mesh
     */
    this.set_mesh = function (mesh) {
        self._mesh = mesh;
    };

    /**
     * Get three.js mesh object.
     *
     * @function
     * @returns {Mesh}
     */
    this.get_mesh = function () {
        return this._mesh;
    };


    /**
     * ------------------------------------------------------------------------
     * Game definition
     * ------------------------------------------------------------------------
     */

    /**
     * Bombs in face.
     * @type {number}
     * @private
     */
    this._bomb = 0;

    /**
     * Face is enabled.
     * @type {boolean}
     * @private
     */
    this._enabled = true;

    /**
     * Face is played or not.
     * @type {boolean}
     * @private
     */
    this._played = false;

    /**
     * Face flag status.
     * @type {number}
     * @private
     */
    this._flag = 0;

    /**
     * Bomb counter behaviour.
     * @type {{NEIGHBOUR: number, AROUND: number}}
     */
    this.behaviour = {
        AROUND: 1,
        NEIGHBOUR: 0,
    };

    /**
     * Face bomb behaviour.
     * @type {number}
     * @private
     */
    this._bomb_behaviour = this.behaviour.NEIGHBOUR;

    /**
     * Face exploded.
     * @type {boolean}
     * @private
     */
    this._exploded = false;

    /**
     * Face has secondary exploded effect.
     * @type {boolean}
     * @private
     */
    this._exploded_secondary = false;

    /**
     * Put a bomb on the face.
     *
     * @function
     */
    this.place_bomb = function () {
        self._bomb = -1;
    };

    /**
     * Face has a bomb or not.
     *
     * @function
     * @returns {boolean}
     */
    this.has_bomb = function () {
        return self._bomb === -1;
    };

    /**
     * Set bomb count.
     *
     * @function
     * @param {number} bomb
     */
    this.set_bomb_count = function (bomb) {
        self._bomb = bomb;
    };

    /**
     * Bomb count behaviour.
     *
     * @function
     * @param {number} mode
     */
    this.set_bomb_behaviour = function (mode) {
        self._bomb_behaviour = mode;
    };

    /**
     * Get neighbours bombs.
     *
     * @function
     * @returns {number}
     */
    this.get_bomb_count = function () {
        if (!this.is_enabled()) return 0;
        let n; // Face list
        if (this._bomb_behaviour === this.behaviour.NEIGHBOUR) {
            n = this.get_neighbours();
        } else if (this._bomb_behaviour === this.behaviour.AROUND) {
            n = this.get_faces_around();
        } else {
            return 0;
        }
        let t = 0; // Total bombs
        let f; // Face
        for (let i = 0; i < n.length; i += 1) {
            f = n[i];
            if (f.has_bomb()) t += 1;
        }
        return t;
    };

    /**
     * Disables face.
     *
     * @function
     */
    this.disable_face = function () {
        self._enabled = false;
    };

    /**
     * Face is enabled or not.
     *
     * @function
     * @returns {boolean}
     */
    this.is_enabled = function () {
        return this._enabled;
    };

    /**
     * Get image of the face.
     *
     * @function
     * @param {TMSViewer} viewer
     * @param {string=} type - Image type
     * @returns {Texture}
     */
    this.get_image = function (viewer, type) {
        if (isNullUndf(type)) type = '';
        if (!this.is_enabled()) return viewer.images['disabled' + type];
        if (this._flag === 1) return viewer.images['flag' + type];
        if (this._flag === 2) return viewer.images['question' + type];
        if (!this._played) return viewer.images['unopened' + type];
        if (this.has_bomb()) return viewer.images['bomb' + type];
        return viewer.images['tile_' + self._bomb + type];
    };

    /**
     * Place image on mesh.
     *
     * @function
     * @param {TMSViewer} viewer
     */
    this.place_image = function (viewer) {
        this._mesh.material.aoMap = this.get_image(viewer, '_ambient');
        this._mesh.material.bumpMap = this.get_image(viewer, '_normal');
        this._mesh.material.map = this.get_image(viewer, '');
        this._mesh.material.specularMap = this.get_image(viewer, '_specular');
    };

    /**
     * Set face as played.
     *
     * @function
     * @param {TMSViewer} viewer
     */
    this.play = function (viewer) {
        self._played = true;
        self._mesh.material.color = viewer.palette.face_color_played;
        self._mesh.material.emissive = viewer.palette.face_unhover_played;
        self._mesh.material.shininess = viewer.palette.face_shininess_played;
    };

    /**
     * Face is played.
     *
     * @function
     * @returns {boolean}
     */
    this.is_played = function () {
        return self._played || !self._enabled;
    };

    /**
     * Return playable faces around face.
     *
     * @function
     * @returns {Face[]}
     */
    this.get_target_faces = function () {
        switch (this._bomb_behaviour) {
            case this.behaviour.NEIGHBOUR:
                return this.get_neighbours();
            case this.behaviour.AROUND:
                return this.get_faces_around();
            default:
                return [];
        }
    };

    /**
     * Place flag.
     *
     * @function
     */
    this.place_flag = function () {
        self._flag = (self._flag + 1) % 3;
    };

    /**
     * Face has flag.
     *
     * @function
     * @returns {boolean}
     */
    this.has_flag = function () {
        return self._flag === 1;
    };

    /**
     * Face has question.
     *
     * @function
     * @returns {boolean}
     */
    this.has_question = function () {
        return self._flag === 2;
    };

    /**
     * Explode face.
     *
     * @function
     * @param {TMSViewer} viewer - Viewer
     */
    this.explode = function (viewer) {
        self._exploded = true;
        self.play(viewer);
        self.place_image(viewer);
    };

    /**
     * Check if face exploded.
     *
     * @function
     * @returns {boolean}
     */
    this.has_exploded = function () {
        return this._exploded;
    };

    /**
     * Secondary explotion effect.
     *
     * @function
     * @param {TMSViewer} viewer
     */
    this.explode_secondary = function (viewer) {
        self._exploded_secondary = true;
        self._mesh.material.color = viewer.palette.face_exploded;
    };

    /**
     * Face has secondary exploded effect.
     *
     * @function
     * @returns {boolean}
     */
    this.has_exploded_secondary = function () {
        return self._exploded_secondary;
    };


    /**
     * ------------------------------------------------------------------------
     * Constructor
     * ------------------------------------------------------------------------
     */
    this.add_vertex(face_vertex);
    this.set_name(face_name);

}