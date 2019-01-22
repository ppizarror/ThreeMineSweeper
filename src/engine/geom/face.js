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

}