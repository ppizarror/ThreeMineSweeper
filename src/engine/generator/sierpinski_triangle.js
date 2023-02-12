/**
 SIERPINSKI TRIANGLE
 Sierpinski triangular pyramid.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Fractal sierpiski triangular pyramid.
 *
 * @class
 * @extends {Generator}
 */
function GenSierpinskiTriangle() {
    /* eslint-disable no-extra-parens */

    /**
     * Inherit class.
     */
    Generator.call(this);
    this._genprops.fractal = true;
    this._set_name('SierpinskiTriangle');

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

        // Apply limit
        this._apply_order_limit(5);

        // Place camera
        this._set_camera_position(-1.6, 0.9, 0);

        // Disables checks
        this._disable_face_check();
        this._disable_vertex_check();

        // Calculate origin
        let xo = (xf + xi) / 2;
        let yo = (yf + yi) / 2;
        let zo = (zf + zi) / 2;

        // Calculate radius
        let r = Math.min((xf - xi) / 2, (yf - yi) / 2);

        // Calculate a
        let a = 4 * r / Math.sqrt(6);

        // Create vertices
        let v1 = new Vertex(xo - 1, yo - (1 / Math.sqrt(3)), zo - (2 / Math.sqrt(6)));
        let v2 = new Vertex(xo + 1, yo - (1 / Math.sqrt(3)), zo - (2 / Math.sqrt(6)));
        let v3 = new Vertex(xo, yo + (2 / Math.sqrt(3)), zo - (2 / Math.sqrt(6)));
        let v4 = new Vertex(xo, yo, zo + (2 / Math.sqrt(6)));

        v1.scale(a / 2);
        v2.scale(a / 2);
        v3.scale(a / 2);
        v4.scale(a / 2);

        // Add faces to volume
        this._sierpinksi(v1, v2, v3, v4, 0, 'T');

    };

    /**
     * Generate fractal triangular pyramid.
     *
     * @function
     * @param {Vertex} v1
     * @param {Vertex} v2
     * @param {Vertex} v3
     * @param {Vertex} v4
     * @param {number} step - Recursive step
     * @param {string} triangle - Cube name
     * @private
     */
    this._sierpinksi = function (v1, v2, v3, v4, step, triangle) {

        /**
         * Get bottom left vertex position
         */
        let x = v1.get_x();
        let y = v1.get_y();
        let z = v1.get_z();

        /**
         * Calculate triangle length
         */
        let lx = v2.get_x() - v1.get_x();
        let ly = v3.get_y() - v1.get_y();
        let lz = v4.get_z() - v1.get_z();

        /**
         * If reached maximum depth create faces
         */
        if (step === this._order) {

            // Create faces
            let f1 = new Face([v1, v4, v2], triangle + '+F1');
            let f2 = new Face([v2, v4, v3], triangle + '+F2');
            let f3 = new Face([v3, v4, v1], triangle + '+F3');
            let f4 = new Face([v1, v2, v3], triangle + '+F4');

            // Rotate textures
            f1.enable_uv_flip();
            f3.enable_uv_flip();
            f3.set_uv_rotation(90);
            f4.set_uv_rotation(90);
            let f = [f1, f2, f3, f4];
            for (let i = 0; i < f.length; i += 1) {
                f[i].set_uv_scale(1.4);
                f[i].set_uv_translate(0.2, 0.1);
                f[i].set_bomb_behaviour(f[i].behaviour.AROUND);
            }

            // Add faces to volume
            this._volume.add_face(f);
            return;

        }

        /**
         * Create triangles
         */
        let v12 = new Vertex(x + (lx / 2), y, z);
        let v13 = new Vertex(x + (lx / 4), y + (ly / 2), z);
        let v14 = new Vertex(x + (lx / 4), y + (lx * Math.sqrt(3) / 12), z + (lz / 2));
        this._sierpinksi(v1, v12, v13, v14, step + 1, triangle + '-1');

        let v23 = new Vertex(x + (3 * lx / 4), y + (ly / 2), z);
        let v24 = new Vertex(x + (3 * lx / 4), y + (lx * Math.sqrt(3) / 12), z + (lz / 2));
        this._sierpinksi(v12, v2, v23, v24, step + 1, triangle + '-2');

        let v34 = new Vertex(x + (lx / 2), y + (ly / 2) + (lx * Math.sqrt(3) / 12), z + (lz / 2));
        this._sierpinksi(v13, v23, v3, v34, step + 1, triangle + '-3');

        this._sierpinksi(v14, v24, v34, v4, step + 1, triangle + '-4');

    };

}