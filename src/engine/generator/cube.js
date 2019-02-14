/**
 CUBE
 3D cube.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * 3D Cube.
 *
 * @class
 * @extends {Generator}
 */
function GenCube() {
    /* eslint-disable no-extra-parens */

    /**
     * Inherit class.
     */
    Generator.call(this);
    this._genprops.latlng = true;
    this._set_name('Cube');

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

        // Place camera
        this._set_camera_position(1.8, -1.8, 1.8);

        // Define lat and lng
        let lat = this._lat + 1;
        let lng = this._lng + 1;

        // Calculate lengths
        let lx = Math.abs(xf - xi);
        let ly = Math.abs(yf - yi);
        let lz = Math.abs(zf - zi);

        // Calculate displacements
        let dx = lx / (lng - 1);
        let dy = ly / (lat - 1);

        // Create vertices
        let v = [];
        for (let i = 0; i < lng; i += 1) { // x
            for (let j = 0; j < lat; j += 1) { // y
                v.push(new Vertex(xi + (dx * i), yi + (dy * j), zo, 'V' + ((i * lng) + j).toString()));
            }
        }

        // Create playable faces
        let f = [];
        let i = 1;
        let face;
        for (let j = 0; j < lng - 1; j += 1) { // y
            for (let fi = 0; fi < lat - 1; fi += 1) { // Iterate through each face
                face = new Face([
                    v[(lat * j) + fi],
                    v[(lat * j) + fi + 1],
                    v[(lat * (j + 1)) + fi + 1],
                    v[(lat * (j + 1)) + fi]
                ], 'F' + i.toString());
                face.enable_uv_flip();
                face.set_uv_rotation(-90);
                face.set_bomb_behaviour(face.behaviour.AROUND);
                f.push(face);
                i += 1;
            }
        }

        // Add valid faces to volume
        this._volume.add_face(f);

    };

    this._create_plane = function (lx, ly, lz, xi, yi, zi, lat, lng) {

    };

}