/**
 VERTEX
 Geometric vertex definition.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Vertex class
 *
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} z - Z position
 * @constructor
 */
function Vertex(x, y, z) {
    /* eslint-disable new-cap */

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
    };

    /**
     * Returns the next vertex from a face.
     *
     * @function
     * @param {Face} face - Face object
     * @returns {Vertex}
     */
    this.next = function (face) {
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
     * Adds a face to the vertex.
     *
     * @function
     * @param {Face} face - Face object
     * @returns {boolean}
     */
    this.add_face = function (face) {

        // Check face has not been added
        for (let i = 0; i < this._faces.length; i += 1) {
            if (this._faces[i].get_id() === face.get_id()) {
                return false;
            }
        }

        // Add face to list
        this._faces.push(face);
        return true;

    };

    /**
     * Return vertex position as vector.
     *
     * @function
     * @returns {Vector3}
     */
    this.get_pos = function () {
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

}