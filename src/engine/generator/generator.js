/**
 GENERATOR
 Global class.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Generator class.
 *
 * @class
 * @abstract
 */
function Generator() {

    /**
     * Object pointer.
     * @type {Generator}
     */
    let self = this;

    /**
     * ID of the generator.
     * @type {string}
     * @protected
     */
    this._id = generateID();

    /**
     * Generator volume.
     * @type {Volume}
     * @protected
     */
    this._volume = new Volume();

    /**
     * Generate element, space volume goes from (xi,yi,zi) to (xf,yf,zf).
     *
     * @function
     * @param {number} xi - Initial X coordinate
     * @param {number} yi - Initial Y coordinate
     * @param {number} zi - Initial Z coordinate
     * @param {number} xf - End X coordinate
     * @param {number} yf - End Y coordinate
     * @param {number} zf - End Z coordinate
     */
    this.generate = function (xi, yi, zi, xf, yf, zf) {
    };

    /**
     * Start new game based on this geometry.
     *
     * @function
     */
    this.start = function () {
        app_viewer.new(this._volume);
    };

}