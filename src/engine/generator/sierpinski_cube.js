/**
 SIERPINSKI CUBE
 Basic fractal cube.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Fractal sierpinksi cube.
 *
 * @class
 * @extends {Generator}
 */
function SierpinskiCube() {
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

        // Apply limit
        this._apply_order_limit(2);

        // Create vertices
        let v1 = new Vertex(xi, yi, zi, 'V1-0');
        let v2 = new Vertex(xf, yi, zi, 'V2-0');
        let v3 = new Vertex(xf, yf, zi, 'V3-0');
        let v4 = new Vertex(xi, yf, zi, 'V4-0');
        let v5 = new Vertex(xi, yi, zf, 'V5-0');
        let v6 = new Vertex(xf, yi, zf, 'V6-0');
        let v7 = new Vertex(xf, yf, zf, 'V7-0');
        let v8 = new Vertex(xi, yf, zf, 'V8-0');

        // Add faces to volume
        this._sierpinksi(v1, v2, v3, v4, v5, v6, v7, v8, 0, 'C');

    };

    /**
     * Generate fractal sierpinski based on existing vertices.
     *
     * @function
     * @param {Vertex} v1
     * @param {Vertex} v2
     * @param {Vertex} v3
     * @param {Vertex} v4
     * @param {Vertex} v5
     * @param {Vertex} v6
     * @param {Vertex} v7
     * @param {Vertex} v8
     * @param {number} step - Recursive step
     * @param {string} cube - Cube name
     * @private
     */
    this._sierpinksi = function (v1, v2, v3, v4, v5, v6, v7, v8, step, cube) {

        /**
         * Get origin
         */
        let x = v1.get_x();
        let y = v1.get_y();
        let z = v1.get_z();

        /**
         * Calculate cube lengths
         */
        let lx = Math.abs(v1.get_x() - v2.get_x());
        let ly = Math.abs(v1.get_y() - v4.get_y());
        let lz = Math.abs(v1.get_z() - v5.get_z());

        /**
         * If reached maximum depth create faces
         */
        if (step === this._order) {

            // Create faces
            let f1 = new Face([v1, v5, v6, v2], cube + '+F1');
            let f2 = new Face([v3, v7, v8, v4], cube + '+F2');
            let f3 = new Face([v4, v8, v5, v1], cube + '+F3');
            let f4 = new Face([v2, v6, v7, v3], cube + '+F4');
            let f5 = new Face([v5, v8, v7, v6], cube + '+F5');
            let f6 = new Face([v2, v3, v4, v1], cube + '+F6');

            // Rotate textures
            f1.enable_uv_flip();
            f2.set_uv_rotation(90);
            f3.enable_uv_flip();
            f3.set_uv_rotation(90);
            f5.enable_uv_flip();
            f5.set_uv_rotation(270);

            // Add faces to volume
            this._volume.add_face([f1, f2, f3, f4, f5, f6]);
            this._volume.set_bomb_behaviour(f1.behaviour.AROUND);
            return;

        }

        /**
         * Create cubes
         */
        let v12 = new Vertex(x + (lx / 3), y, z);
        let v13 = new Vertex(x + (lx / 3), y + (ly / 3), z);
        let v14 = new Vertex(x, y + (ly / 3), z);
        let v15 = new Vertex(x, y, z + (lz / 3));
        let v16 = new Vertex(x + (lx / 3), y, z + (lz / 3));
        let v17 = new Vertex(x + (lx / 3), y + (ly / 3), z + (lz / 3));
        let v18 = new Vertex(x, y + (ly / 3), z + (lz / 3));
        this._sierpinksi(v1, v12, v13, v14, v15, v16, v17, v18, step + 1, cube + '-1');

        let v22 = new Vertex(x + (2 * lx / 3), y, z);
        let v23 = new Vertex(x + (2 * lx / 3), y + (ly / 3), z);
        let v26 = new Vertex(x + (2 * lx / 3), y, z + (lz / 3));
        let v27 = new Vertex(x + (2 * lx / 3), y + (ly / 3), z + (lz / 3));
        this._sierpinksi(v12, v22, v23, v13, v16, v26, v27, v17, step + 1, cube + '-2');

        let v33 = new Vertex(x + lx, y + (ly / 3), z);
        let v36 = new Vertex(x + lx, y, z + (lz / 3));
        let v37 = new Vertex(x + lx, y + (ly / 3), z + (lz / 3));
        this._sierpinksi(v22, v2, v33, v23, v26, v36, v37, v27, step + 1, cube + '-3');

        let v43 = new Vertex(x + (lx / 3), y + (2 * ly / 3), z);
        let v44 = new Vertex(x, y + (2 * ly / 3), z);
        let v47 = new Vertex(x + (lx / 3), y + (2 * ly / 3), z + (lz / 3));
        let v48 = new Vertex(x, y + (2 * ly / 3), z + (lz / 3));
        this._sierpinksi(v14, v13, v43, v44, v18, v17, v47, v48, step + 1, cube + '-4');

        let v53 = new Vertex(x + lx, y + (2 * ly / 3), z);
        let v54 = new Vertex(x + (2 * lx / 3), y + (2 * ly / 3), z);
        let v57 = new Vertex(x + lx, y + (2 * ly / 3), z + (lz / 3));
        let v58 = new Vertex(x + (2 * lx / 3), y + (2 * ly / 3), z + (lz / 3));
        this._sierpinksi(v23, v33, v53, v54, v27, v37, v57, v58, step + 1, cube + '-5');

        let v63 = new Vertex(x + (lx / 3), y + ly, z);
        let v67 = new Vertex(x + (lx / 3), y + ly, z + (lz / 3));
        let v68 = new Vertex(x, y + ly, z + (lz / 3));
        this._sierpinksi(v44, v43, v63, v4, v48, v47, v67, v68, step + 1, cube + '-6');

        let v73 = new Vertex(x + (2 * lx / 3), y + ly, z);
        let v77 = new Vertex(x + (2 * lx / 3), y + ly, z + (lz / 3));
        this._sierpinksi(v43, v54, v73, v63, v47, v58, v77, v67, step + 1, cube + '-7');

        let v87 = new Vertex(x + lx, y + ly, z + (lz / 3));
        this._sierpinksi(v54, v53, v3, v73, v58, v57, v87, v77, step + 1, cube + '-8');

        let v95 = new Vertex(x, y, z + (2 * lz / 3));
        let v96 = new Vertex(x + (lx / 3), y, z + (2 * lz / 3));
        let v97 = new Vertex(x + (lx / 3), y + (ly / 3), z + (2 * lz / 3));
        let v98 = new Vertex(x, y + (ly / 3), z + (2 * lz / 3));
        this._sierpinksi(v15, v16, v17, v18, v95, v96, v97, v98, step + 1, cube + '-9');

        let v105 = new Vertex(x + (2 * lx / 3), y, z + (2 * lz / 3));
        let v106 = new Vertex(x + lx, y, z + (2 * lz / 3));
        let v107 = new Vertex(x + lx, y + (ly / 3), z + (2 * lz / 3));
        let v108 = new Vertex(x + (2 * lx / 3), y + (ly / 3), z + (2 * lz / 3));
        this._sierpinksi(v26, v36, v37, v27, v105, v106, v107, v108, step + 1, cube + '-10');

        let v115 = new Vertex(x, y + (2 * ly / 3), z + (2 * lz / 3));
        let v116 = new Vertex(x + (lx / 3), y + (2 * ly / 3), z + (2 * lz / 3));
        let v117 = new Vertex(x + (lx / 3), y + ly, z + (2 * lz / 3));
        let v118 = new Vertex(x, y + ly, z + (2 * lz / 3));
        this._sierpinksi(v48, v47, v67, v68, v115, v116, v117, v118, step + 1, cube + '-11');

        let v125 = new Vertex(x + (2 * lx / 3), y + (2 * ly / 3), z + (2 * lz / 3));
        let v126 = new Vertex(x + lx, y + (2 * ly / 3), z + (2 * lz / 3));
        let v127 = new Vertex(x + lx, y + ly, z + (2 * lz / 3));
        let v128 = new Vertex(x + (2 * lx / 3), y + ly, z + (2 * lz / 3));
        this._sierpinksi(v58, v57, v87, v77, v125, v126, v127, v128, step + 1, cube + '-12');

        let v136 = new Vertex(x + (lx / 3), y, z + lz);
        let v137 = new Vertex(x + (lx / 3), y + (ly / 3), z + lz);
        let v138 = new Vertex(x, y + (ly / 3), z + lz);
        this._sierpinksi(v95, v96, v97, v98, v5, v136, v137, v138, step + 1, cube + '-13');

        let v146 = new Vertex(x + (2 * lx / 3), y, z + lz);
        let v147 = new Vertex(x + (2 * lx / 3), y + (ly / 3), z + lz);
        this._sierpinksi(v96, v105, v108, v97, v136, v146, v147, v137, step + 1, cube + '-14');

        let v157 = new Vertex(x + lx, y + (ly / 3), z + lz);
        this._sierpinksi(v105, v106, v107, v108, v146, v6, v157, v147, step + 1, cube + '-15');

        let v167 = new Vertex(x + (lx / 3), y + (2 * ly / 3), z + lz);
        let v168 = new Vertex(x, y + (2 * ly / 3), z + lz);
        this._sierpinksi(v98, v97, v116, v115, v138, v137, v167, v168, step + 1, cube + '-16');

        let v177 = new Vertex(x + lx, y + (2 * ly / 3), z + lz);
        let v178 = new Vertex(x + (2 * lx / 3), y + (2 * ly / 3), z + lz);
        this._sierpinksi(v108, v107, v126, v125, v147, v157, v177, v178, step + 1, cube + '-17');

        let v187 = new Vertex(x + (lx / 3), y + ly, z + lz);
        this._sierpinksi(v115, v116, v117, v118, v168, v167, v187, v8, step + 1, cube + '-18');

        let v197 = new Vertex(x + (2 * lx / 3), y + ly, z + lz);
        this._sierpinksi(v116, v125, v128, v117, v167, v178, v197, v187, step + 1, cube + '-19');

        this._sierpinksi(v125, v126, v127, v128, v178, v177, v7, v197, step + 1, cube + '-20');

    };

}