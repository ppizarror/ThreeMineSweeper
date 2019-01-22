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
 */
function Vertex() {
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
    this._position = new THREE.Vector3(0, 0, 0);

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

}