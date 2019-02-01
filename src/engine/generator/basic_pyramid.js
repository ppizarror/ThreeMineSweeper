/**
 BASIC PYRAMID
 Basic pyramid generator.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Basic square pyramid.
 *
 * @class
 * @extends {Generator}
 */
function BasicPyramid() {

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

        // Calculate some values
        let zm = (zf + zi) / 2;
        let a = (xf - xi + yf - yi) / 2;
        let h = a / Math.sqrt(2);
        let xm = (xf + xi) * 0.5;
        let ym = (yf + yi) * 0.5;

        // Create vertices
        let v1 = new Vertex(xi, yi, zm, 'V1');
        let v2 = new Vertex(xf, yi, zm, 'V1');
        let v3 = new Vertex(xf, yf, zm, 'V1');
        let v4 = new Vertex(xi, yf, zm, 'V1');
        let v5 = new Vertex(xm, ym, h, 'V1');
        let v6 = new Vertex(xm, ym, -h, 'V1');

        // Create faces
        let f1 = new Face([v5, v2, v1], 'F1');
        let f2 = new Face([v5, v3, v2], 'F2');
        let f3 = new Face([v5, v4, v3], 'F3');
        let f4 = new Face([v5, v1, v4], 'F4');
        let f5 = new Face([v1, v2, v6], 'F1');
        let f6 = new Face([v2, v3, v6], 'F2');
        let f7 = new Face([v3, v4, v6], 'F3');
        let f8 = new Face([v4, v1, v6], 'F4');

        // Add faces to volume
        this._volume.add_face([f1, f2, f3, f4, f5, f6, f7, f8]);

    };

}