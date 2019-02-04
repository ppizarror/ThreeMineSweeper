/**
 Sphere.
 Sphere class.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Sphere.
 *
 * @class
 * @extends {Generator}
 */
function Sphere() {
    /* eslint-disable no-extra-parens */

    /**
     * Inherit class.
     */
    Generator.call(this);

    // noinspection JSUnusedGlobalSymbols
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

        // Calculate origin
        let xo = (xf + xi) / 2;
        let yo = (yf + yi) / 2;
        let zo = (zf + zi) / 2;

        // Calculate radius
        let r = Math.min((xf - xi) / 2, (yf - yi) / 2, (zf - zi) / 2);

    };

}