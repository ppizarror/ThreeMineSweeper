/**
 BASIC PYRAMID
 Basic pyramid generator.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

// noinspection JSClosureCompilerSyntax
/**
 * Basic square pyramid.
 *
 * @class
 * @extends {Generator}
 */
function GenBasicPyramid() {

    /**
     * Inherit class.
     */
    Generator.call(this);
    this._set_name('BasicPyramid');

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
        this._set_camera_position(-2.5, -1.4, 0.45);

        // Calculate some values
        let zm = (zf + zi) / 2;
        let a = (xf - xi + yf - yi) / 2;
        let h = a / Math.sqrt(2);
        let xm = (xf + xi) * 0.5;
        let ym = (yf + yi) * 0.5;

        // Create vertices
        let v1 = new Vertex(xi, yi, zm, 'V1');
        let v2 = new Vertex(xf, yi, zm, 'V2');
        let v3 = new Vertex(xf, yf, zm, 'V3');
        let v4 = new Vertex(xi, yf, zm, 'V4');
        let v5 = new Vertex(xm, ym, h, 'V5');
        let v6 = new Vertex(xm, ym, -h, 'V6');

        // Create faces
        let f1 = new Face([v5, v2, v1], 'F1');
        let f2 = new Face([v5, v3, v2], 'F2');
        let f3 = new Face([v5, v4, v3], 'F3');
        let f4 = new Face([v5, v1, v4], 'F4');
        let f5 = new Face([v1, v2, v6], 'F5');
        let f6 = new Face([v2, v3, v6], 'F6');
        let f7 = new Face([v3, v4, v6], 'F7');
        let f8 = new Face([v4, v1, v6], 'F8');

        // Texture rotation
        f1.enable_uv_flip();
        f3.set_uv_rotation(90);
        f4.enable_uv_flip();
        f4.set_uv_rotation(90);
        f5.enable_uv_flip();
        f7.set_uv_rotation(90);
        f8.enable_uv_flip();
        f8.set_uv_rotation(90);

        let f = [f1, f2, f3, f4, f5, f6, f7, f8];
        for (let i = 0; i < f.length / 2; i += 1) {
            f[i].set_uv_scale(1.2);
            f[i].set_uv_translate(0.1, 0.075);
        }
        for (let i = f.length / 2; i < f.length; i += 1) {
            f[i].set_uv_scale(1.2);
            f[i].set_uv_translate(0.1, 0.150);
        }

        // Add faces to volume
        this._volume.add_face(f);

    };

}