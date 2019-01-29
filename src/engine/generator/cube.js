/**
 CUBE
 Basic cube generator.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 *
 * @class
 * @extends {Generator}
 */
function Cube() {

    /**
     * Inherit class.
     */
    Generator.call(this);

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

        // Create vertices
        let v1 = new Vertex(xi, yi, zi, 'V1');
        let v2 = new Vertex(xi, yi, zi, 'V2');
        let v3 = new Vertex(xi, yi, zi, 'V3');
        let v4 = new Vertex(xi, yi, zi, 'V4');
        let v5 = new Vertex(xi, yi, zi, 'V5');
        let v6 = new Vertex(xi, yi, zi, 'V6');
        let v7 = new Vertex(xi, yi, zi, 'V7');
        let v8 = new Vertex(xi, yi, zi, 'V8');

    };

}