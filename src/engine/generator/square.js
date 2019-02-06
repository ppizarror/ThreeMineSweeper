/**
 SQUARE
 2D plane square.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Square plane.
 *
 * @class
 * @extends {Generator}
 */
function Square() {
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

        // Calculate lengths
        let lx = Math.abs(xf - xi);
        let ly = Math.abs(yf - yi);
        let zo = (zf + zi) / 2;

        // Calculate displacements
        let dx = lx / (this._lng - 1);
        let dy = ly / (this._lat - 1);

        // Create vertices
        let v = [];
        for (let i = 0; i < this._lng; i += 1) { // x
            for (let j = 0; j < this._lat; j += 1) { // y
                v.push(new Vertex(xi + (dx * i), yi + (dy * j), zo, 'V' + ((i * this._lng) + j).toString()));
            }
        }

        // Create faces
        let f = [];
        let i = 1;
        let face;
        for (let j = 0; j < this._lat - 1; j += 1) { // y
            for (let fi = 0; fi < this._lng - 1; fi += 1) { // Iterate through each face

                // Create playable face
                face = new Face([
                    v[(this._lat * j) + fi],
                    v[(this._lat * j) + fi + 1],
                    v[(this._lat * (j + 1)) + fi + 1],
                    v[(this._lat * (j + 1)) + fi]
                ], 'F' + i.toString());
                face.enable_uv_flip();
                face.set_bomb_behaviour(face.behaviour.AROUND);
                f.push(face);
                i += 1;

            }
        }

        // Add valid faces to volume
        this._volume.add_face(f);

        // Create vertices hidden
        zo -= 0.0005;
        v = [];
        for (i = 0; i < this._lng; i += 1) { // x
            for (let j = 0; j < this._lat; j += 1) { // y
                v.push(new Vertex(xi + (dx * i), yi + (dy * j), zo, 'V' + ((i * this._lng) + j).toString()));
            }
        }

        // Create unplayable faces
        f = [];
        i = 1;
        for (let j = 0; j < this._lat - 1; j += 1) { // y
            for (let fi = 0; fi < this._lng - 1; fi += 1) { // Iterate through each face
                face = new Face([
                    v[(this._lat * j) + fi],
                    v[(this._lat * j) + fi + 1],
                    v[(this._lat * (j + 1)) + fi + 1],
                    v[(this._lat * (j + 1)) + fi]
                ], 'F' + i.toString());
                face.disable_face();
                face.reverse_vertices();
                f.push(face);
                i += 1;
            }
        }

        // Add unplayable faces to volume
        this._volume.add_face(f);

    };

}