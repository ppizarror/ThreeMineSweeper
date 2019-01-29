/**
 VOLUME
 Volume definition.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Vertex class.
 *
 * @class
 * @constructor
 * @param {Face[] | Face=} volume_faces - Initial volume faces
 * @param {string=} volume_name - Volume name
 */
function Volume(volume_faces, volume_name) {
    /* eslint-disable new-cap */

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
        if (this._strict) {
            if (face.is_valid()) {
                this._faces.push(face);
                return true;
            }
            app_console.error('[VOLUME] Face {0} ID {1} could not be added to volume, not valid'.format(face.get_name(), face.get_id()));
            return false;
        }
        this._faces.push(face);
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
     * @returns {Face[]}
     */
    this.get_faces = function () {
        return this._faces.slice(0);
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

}