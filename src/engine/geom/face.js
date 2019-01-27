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
 */
function Face() {

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
     * Number of vertices that define the face.
     * @type {number}
     * @private
     */
    this._length = 0;

    /**
     * ThreeJS mesh reference.
     * @private
     */
    this._mesh = null;

    /**
     * Array that contains the neighbours of the face.
     * @type {Face[]}
     * @private
     */
    this._neighbours = [];

    /**
     * Area of the face.
     * @type {number}
     * @private
     */
    this._area = 0;

    /**
     * Perimeter of the face
     * @type {number}
     * @private
     */
    this._perimeter = 0;

    /**
     * Normal of the vector.
     * @type {number}
     * @private
     */
    this._normal = 0;

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
        self._length += 1;
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
        for (let i = 0; i < this._length; i += 1) {
            if (this._vertex[i].equals(vertex)) return true;
        }
        return false;

    };

    /**
     * Return number of vertices.
     *
     * @function
     * @returns {number}
     */
    this.length = function () {
        return this._length;
    };

}