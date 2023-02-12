/**
 EMPTY GENERATOR
 Empty generator.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * This generator does nothing.
 *
 * @class
 * @extends {Generator}
 */
function GenEmpty() {

    /**
     * Inherit class.
     */
    Generator.call(this);
    this._set_name('Empty');

    // noinspection JSUnusedLocalSymbols
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
    this._generate = function (xi, yi, zi, xf, yf, zf) {

        // Place camera
        this._set_camera_position(0, 0, 1);

    };

}