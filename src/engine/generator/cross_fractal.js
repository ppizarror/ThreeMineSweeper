/**
 CROSS FRACTAL
 Cube cross fractal

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Cross fractal cube.
 *
 * @class
 * @extends {Generator}
 */
function GenCrossFractal() {
    /* eslint-disable no-extra-parens */

    /**
     * Inherit class.
     */
    Generator.call(this);
    this._genprops.fractal = true;
    this._set_name('CrossFractal');

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

        // Place camera
        this._set_camera_position(-1.3, -1.3, 0.05);

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
        this._cross(v1, v2, v3, v4, v5, v6, v7, v8, -1, 'C');

    };

    /**
     * Generate fractal with cross shape.
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
    this._cross = function (v1, v2, v3, v4, v5, v6, v7, v8, step, cube) {

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
            f5.set_uv_rotation(90);

            // Add faces to volume
            this._volume.add_face([f1, f2, f3, f4, f5, f6]);
            return;

        }

        /**
         * Create cubes
         */
        let v11 = new Vertex(x + (lx / 3), y + (ly / 3), z);
        let v12 = new Vertex(x + (2 * lx / 3), y + (ly / 3), z);
        let v13 = new Vertex(x + (2 * lx / 3), y + (2 * ly / 3), z);
        let v14 = new Vertex(x + (lx / 3), y + (2 * ly / 3), z);
        let v15 = new Vertex(x + (lx / 3), y + (ly / 3), z + (lz / 3));
        let v16 = new Vertex(x + (2 * lx / 3), y + (ly / 3), z + (lz / 3));
        let v17 = new Vertex(x + (2 * lx / 3), y + (2 * ly / 3), z + (lz / 3));
        let v18 = new Vertex(x + (lx / 3), y + (2 * ly / 3), z + (lz / 3));
        this._cross(v11, v12, v13, v14, v15, v16, v17, v18, step + 1, cube + '-1');

        let v21 = new Vertex(x, y + (ly / 3), z + (lz / 3));
        let v24 = new Vertex(x, y + (2 * ly / 3), z + (lz / 3));
        let v25 = new Vertex(x, y + (ly / 3), z + (2 * lz / 3));
        let v26 = new Vertex(x + (lx / 3), y + (ly / 3), z + (2 * lz / 3));
        let v27 = new Vertex(x + (lx / 3), y + (2 * ly / 3), z + (2 * lz / 3));
        let v28 = new Vertex(x, y + (2 * ly / 3), z + (2 * lz / 3));
        this._cross(v21, v15, v18, v24, v25, v26, v27, v28, step + 1, cube + '-2');

        let v31 = new Vertex(x + (lx / 3), y, z + (lz / 3));
        let v32 = new Vertex(x + (2 * lx / 3), y, z + (lz / 3));
        let v35 = new Vertex(x + (lx / 3), y, z + (2 * lz / 3));
        let v36 = new Vertex(x + (2 * lx / 3), y, z + (2 * lz / 3));
        let v37 = new Vertex(x + (2 * lx / 3), y + (ly / 3), z + (2 * lz / 3));
        this._cross(v31, v32, v16, v15, v35, v36, v37, v26, step + 1, cube + '-3');

        let v42 = new Vertex(x + lx, y + (ly / 3), z + (lz / 3));
        let v43 = new Vertex(x + lx, y + (2 * ly / 3), z + (lz / 3));
        let v46 = new Vertex(x + lx, y + (ly / 3), z + (2 * lz / 3));
        let v47 = new Vertex(x + lx, y + (2 * ly / 3), z + (2 * lz / 3));
        let v48 = new Vertex(x + (2 * lx / 3), y + (2 * ly / 3), z + (2 * lz / 3));
        this._cross(v16, v42, v43, v17, v37, v46, v47, v48, step + 1, cube + '-4');

        let v53 = new Vertex(x + (2 * lx / 3), y + ly, z + (lz / 3));
        let v54 = new Vertex(x + (lx / 3), y + ly, z + (lz / 3));
        let v57 = new Vertex(x + (2 * lx / 3), y + ly, z + (2 * lz / 3));
        let v58 = new Vertex(x + (lx / 3), y + ly, z + (2 * lz / 3));
        this._cross(v18, v17, v53, v54, v27, v48, v57, v58, step + 1, cube + '-5');

        this._cross(v15, v16, v17, v18, v26, v37, v48, v27, step + 1, cube + '-6');

        let v75 = new Vertex(x + (lx / 3), y + (ly / 3), z + lz);
        let v76 = new Vertex(x + (2 * lx / 3), y + (ly / 3), z + lz);
        let v77 = new Vertex(x + (2 * lx / 3), y + (2 * ly / 3), z + lz);
        let v78 = new Vertex(x + (lx / 3), y + (2 * ly / 3), z + lz);
        this._cross(v26, v37, v48, v27, v75, v76, v77, v78, step + 1, cube + '-7');

    };

}