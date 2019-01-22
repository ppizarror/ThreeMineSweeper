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
 */
function Volume() {
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
     * Array that contains the vertices of the volume, unordered.
     * @type {Vertex[]}
     * @private
     */
    this._vertex = [];

}