/**
 BASIC CUBE
 Basic cube generator.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Basic cube, 8 vertices and 6 faces.
 *
 * @class
 * @extends {Generator}
 */
function BasicCube() {

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
        let v2 = new Vertex(xf, yi, zi, 'V2');
        let v3 = new Vertex(xf, yf, zi, 'V3');
        let v4 = new Vertex(xi, yf, zi, 'V4');
        let v5 = new Vertex(xi, yi, zf, 'V5');
        let v6 = new Vertex(xf, yi, zf, 'V6');
        let v7 = new Vertex(xf, yf, zf, 'V7');
        let v8 = new Vertex(xi, yf, zf, 'V8');

        // Create faces
        let f1 = new Face([v1, v5, v6, v2], 'F1');
        let f2 = new Face([v3, v7, v8, v4], 'F2');
        let f3 = new Face([v4, v8, v5, v1], 'F3');
        let f4 = new Face([v2, v6, v7, v3], 'F4');
        let f5 = new Face([v5, v8, v7, v6], 'F5');
        let f6 = new Face([v2, v3, v4, v1], 'F6');

        // Add faces to volume
        this._volume.add_face([f1, f2, f3, f4, f5, f6]);

    };

}