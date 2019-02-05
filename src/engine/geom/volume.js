/**
 VOLUME
 Volume definition.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Volume, contains faces and generates the whole figure topology.
 *
 * @class
 * @constructor
 * @param {Face[] | Face=} volume_faces - Initial volume faces
 * @param {string=} volume_name - Volume name
 */
function Volume(volume_faces, volume_name) {
    /* eslint-disable max-depth */
    /* eslint-disable new-cap */
    /* eslint-disable no-continue */

    /**
     * ID of the volume.
     * @type {string}
     * @private
     */
    this._id = generateID();

    /**
     * Array that contains the faces of the volume.
     * @type {Face[]}
     * @private
     */
    this._faces = [];

    /**
     * Stores last added faces.
     * @type {Face[]}
     * @private
     */
    this._last_added_faces = [];

    /**
     * Face name.
     * @type {string}
     * @private
     */
    this._name = '';

    /**
     * Face add is strict.
     * @type {boolean}
     * @private
     */
    this._strict = false;

    /**
     * Stores deleted faces.
     * @type {number}
     * @private
     */
    this._faces_deleted = 0;

    /**
     * Stores duplicated vertices.
     * @type {number}
     * @private
     */
    this._vertices_duplicated = 0;

    /**
     * Total vertices.
     * @type {number}
     * @private
     */
    this._total_vertices = 0;

    /**
     * Check faces.
     * @type {boolean}
     * @private
     */
    this._add_check_faces = true;

    /**
     * Check vertices.
     * @type {boolean}
     * @private
     */
    this._add_check_vertices = true;

    /**
     * Object pointer.
     * @type {Volume}
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
     * Adds a face to the vertex.
     *
     * @function
     * @param {Face|Face[]} face - Face object
     * @param {boolean=} disable_check - Check faces after addition
     * @returns {boolean}
     */
    this.add_face = function (face, disable_check) {

        // Disable face check after addition
        if (isNullUndf(disable_check)) disable_check = false;
        disable_check = disable_check && self._add_check_faces;

        // If null
        if (isNullUndf(face)) return false;

        // If face is an array then call multiple times
        if (face instanceof Array) {
            let r = true;
            for (let j = 0; j < face.length; j += 1) {
                r = r && this.add_face(face[j], true);
            }
            self._last_added_faces = face;
            if (!disable_check) this._check_after_add_face();
            return r;
        }

        // Check face has not been added
        for (let i = 0; i < this._faces.length; i += 1) {
            if (this._faces[i].equals(face)) {
                return false;
            }
        }

        // Add face to list
        if (this._strict && !face.is_valid()) {
            app_console.error('[VOLUME] Face {0} ID {1} could not be added to volume, not valid'.format(face.get_name(), face.get_id()));
            return false;
        }
        if (self._add_check_vertices) face.check_vertices();
        this._faces.push(face);
        face.add_volume(this);
        if (!disable_check) {
            self._last_added_faces = [face];
            this._check_after_add_face();
        }
        return true;

    };

    /**
     * Check if the vertex defines some face.
     *
     * @function
     * @param {Face|Face[]} face
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
     * @param {Face|Face[]} face
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
     * Return volume faces.
     *
     * @function
     * @param {boolean=} do_clone - Clones object
     * @returns {Face[]}
     */
    this.get_faces = function (do_clone) {
        if (isNullUndf(do_clone)) do_clone = true;
        if (do_clone) {
            return this._faces.slice(0);
        }
        return this._faces;
    };

    /**
     * Check if volume is same as other.
     *
     * @function
     * @param {Volume} volume
     * @returns {boolean}
     */
    this.equals = function (volume) {
        return this._id === volume._id;
    };

    /**
     * Set volume name.
     *
     * @function
     * @param {string} s - Name
     */
    this.set_name = function (s) {
        if (isNullUndf(s)) return;
        self._name = s;
    };

    /**
     * Return volume name.
     *
     * @function
     * @returns {string}
     */
    this.get_name = function () {
        return this._name;
    };

    /**
     * Return volume vertices.
     *
     * @function
     * @returns {Vertex[]}
     */
    this.get_vertices = function () {
        let v = [];
        let v_id = [];

        // Check all faces and get theirs vertices
        for (let i = 0; i < this._faces.length; i += 1) {
            let fv = this._faces[i].get_vertices();

            // Add vertex if not exists
            for (let j = 0; j < fv.length; j += 1) {
                if (!v_id.includes(fv[j].get_id())) {
                    v.push(fv[j]);
                    v_id.push(fv[j].get_id());
                }
            }

        }

        // Return vertex list
        return v;
    };

    /**
     * Check if vertex exists.
     *
     * @function
     * @param {Vertex[] | Vertex} vertex
     * @returns {boolean}
     */
    this.has_vertex = function (vertex) {
        let vertices = this.get_vertices();
        if (vertex instanceof Array) {
            let r = true;
            for (let j = 0; j < vertex.length; j += 1) {
                r = r && this._has_vertex(vertex[j], vertices);
            }
            return r;
        }
        return this._has_vertex(vertex, vertices);
    };

    /**
     * Check if vertex exists into vertex_list.
     *
     * @function
     * @param {Vertex} vertex
     * @param {Vertex[]} vertex_list
     * @returns {boolean}
     * @private
     */
    this._has_vertex = function (vertex, vertex_list) {
        for (let i = 0; i < vertex_list.length; i += 1) {
            if (vertex_list[i].equals(vertex)) return true;
        }
        return false;
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
        let vertices = this.get_vertices();
        for (let i = 0; i < vertices.length; i += 1) {
            vertices[i].scale(s, sx, sy, sz);
        }
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
        let vertices = this.get_vertices();
        for (let i = 0; i < vertices.length; i += 1) {
            vertices[i].translate(tx, ty, tz);
        }
    };

    /**
     * Get vertices from last added faces.
     *
     * @function
     * @returns {Vertex[]}
     * @private
     */
    this._get_vertices_last_added = function () {
        let v = [];
        let v_id = [];
        for (let i = 0; i < self._last_added_faces.length; i += 1) {
            let fv = self._last_added_faces[i].get_vertices();
            for (let j = 0; j < fv.length; j += 1) {
                if (!v_id.includes(fv[j].get_id())) {
                    v.push(fv[j]);
                    v_id.pushUnique(fv[j].get_id());
                }
            }
        }
        return v;
    };

    /**
     * Return faces around last added to check deletion.
     *
     * @function
     * @returns {Face[]}
     * @private
     */
    this._get_faces_around_last_added = function () {

        // Get last added vertices
        let v = this._get_vertices_last_added();

        // Get faces from those vertices
        let faces = [];
        let faces_id = [];
        for (let i = 0; i < v.length; i += 1) {
            let fs = v[i].get_faces();
            for (let j = 0; j < fs.length; j += 1) {
                if (!faces_id.includes(fs[j].get_id()) && fs[j].has_volume(this)) {
                    faces.push(fs[j]);
                    faces_id.push(fs[j].get_id());
                }
            }
        }

        // Return faces
        return faces;

    };

    /**
     * Check faces after addition.
     *
     * @function
     * @private
     */
    this._check_faces = function () {

        // Faces to be deleted
        let delete_id = [];
        let faces = this._get_faces_around_last_added();

        // Look for repeated faces
        /**
         * @type {Face}
         */
        let fi, fj;
        for (let i = 0; i < self._last_added_faces.length; i += 1) {
            fi = self._last_added_faces[i];
            for (let j = 0; j < faces.length; j += 1) {
                fj = faces[j];
                if (fi.equals(fj)) { // noinspection UnnecessaryContinueJS
                    continue;
                }
                if (fj.has_vertex(fi.get_vertices())) {
                    delete_id.pushUnique(fj.get_id());
                    delete_id.pushUnique(fi.get_id());
                    break;
                }
            }
        }

        // Delete each face from volume
        for (let j = 0; j < this._faces.length; j += 1) {
            if (delete_id.includes(this._faces[j].get_id())) {
                this._faces[j].remove();
                this._faces[j].remove_volume(this);
                this._faces.splice(j, 1);
                self._faces_deleted += 1;
                j -= 1;
            }
        }

        // Delete each face from added faces
        for (let j = 0; j < this._last_added_faces.length; j += 1) {
            if (delete_id.includes(this._last_added_faces[j].get_id())) {
                self._last_added_faces.splice(j, 1);
                self._faces_deleted += 1;
                j -= 1;
            }
        }
    };

    /**
     * Check duplicated vertices.
     *
     * @function
     * @private
     */
    this._check_vertices = function () {

        // Get vertices
        let v = this.get_vertices();

        // Find affected faces
        let f = [];
        let f_id = [];

        // Find duplicated vertices
        let vi, vj;
        for (let i = 0; i < v.length; i += 1) {
            vi = v[i];
            for (let j = 0; j < v.length; j += 1) {
                vj = v[j];
                if (vi.equals(vj)) continue;
                if (vj.equal_position(vi)) {

                    // Store affected faces
                    let fi = vi.get_faces();
                    for (let ii = 0; ii < fi.length; ii += 1) {
                        if (!f_id.includes(fi[ii].get_id())) {
                            f.push(fi[ii]);
                            f_id.push(fi[ii].get_id());
                        }
                    }
                    let fj = vj.get_faces();
                    for (let jj = 0; jj < fj.length; jj += 1) {
                        if (!f_id.includes(fj[jj].get_id())) {
                            f.push(fj[jj]);
                            f_id.push(fj[jj].get_id());
                        }
                    }

                    // Replace vertices
                    vi.join_replace(vj);
                    v.splice(j, 1);

                    j -= 1;
                    self._vertices_duplicated += 1;

                }
            }
        }

        // Total vertices
        self._total_vertices = v.length;

        // Update faces
        self._last_added_faces = f;
        this._check_after_add_face();

    };

    /**
     * Check topology after add face.
     *
     * @function
     * @private
     */
    this._check_after_add_face = function () {

        // Check face topology
        this._check_faces();

        // Remove last added faces
        self._last_added_faces = [];

    };

    /**
     * Assemble volume.
     *
     * @function
     */
    this.assemble = function () {
        this._check_vertices();
        for (let i = 0; i < this._faces.length; i += 1) {
            this._faces[i].assemble();
        }
    };

    /**
     * Return number of faces.
     *
     * @function
     * @returns {number}
     */
    this.get_total_faces = function () {
        return this._faces.length;
    };

    /**
     * Return number of deleted faces.
     *
     * @function
     * @returns {number}
     */
    this.get_total_deleted_faces = function () {
        return this._faces_deleted;
    };

    /**
     * Get duplicated vertices.
     *
     * @function
     * @returns {number}
     */
    this.get_duplicated_vertices = function () {
        return this._vertices_duplicated;
    };

    /**
     * Return total vertices.
     *
     * @function
     * @returns {number}
     */
    this.get_total_vertices = function () {
        return this._total_vertices;
    };

    /**
     * Disables face check.
     *
     * @function
     */
    this.disable_face_check = function () {
        self._add_check_faces = false;
    };

    /**
     * Disables vertex check.
     *
     * @function
     */
    this.disable_vertex_check = function () {
        self._add_check_vertices = false;
    };

    /**
     * Set bomb behaviour of faces.
     *
     * @function
     * @param {number} mode - Behaviour mode
     */
    this.set_bomb_behaviour = function (mode) {
        for (let i = 0; i < this._faces.length; i += 1) {
            this._faces[i].set_bomb_behaviour(mode);
        }
    };

    /**
     * Apply constructor
     */
    this.add_face(volume_faces);
    this.set_name(volume_name);

}