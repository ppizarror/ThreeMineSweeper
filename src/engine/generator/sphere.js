/**
 SPHERE
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

        // Update longitude
        self._lng = Math.max(self._lng, 3);

        // Calculate origin
        let xo = (xf + xi) / 2;
        let yo = (yf + yi) / 2;
        let zo = (zf + zi) / 2;

        // Calculate radius
        let r = Math.min((xf - xi) / 2, (yf - yi) / 2, (zf - zi) / 2);

        // Create hemispheres vertices
        let vi = new Vertex(xo, yo, -r);
        let vs = new Vertex(xo, yo, r);

        // Create latitudes heights
        let lath = [];
        let lz = zi;
        for (let i = 0; i < this._lat; i += 1) {
            lz += ((2 * r) / (this._lat + 1));
            lath.push(lz);
        }

        // Create latitudes vertices
        let latv = [];
        let theta, rj;
        for (let i = 0; i < this._lat; i += 1) {
            let latvi = [];
            for (let j = 0; j < this._lng; j += 1) {
                theta = 2 * Math.PI * j / (this._lng);
                rj = Math.sqrt(Math.pow(r, 2) - Math.pow(Math.abs(lath[i] - zo), 2));
                latvi.push(new Vertex(rj * Math.cos(theta), rj * Math.sin(theta), lath[i]));
            }
            latv.push(latvi);
        }

        // Create vertices hemispheres faces
        let face;
        for (let i = 0; i < this._lng; i += 1) {
            face = new Face([vi, latv[0][i % this._lng], latv[0][(i + 1) % this._lng]], 'F-B' + i.toString());
            face.disable_face();
            this._volume.add_face(face);
        }
        for (let i = 0; i < this._lng; i += 1) {
            face = new Face([vs, latv[this._lat - 1][(i + 1) % this._lng], latv[this._lat - 1][i % this._lng]], 'F-T' + i.toString());
            face.disable_face();
            this._volume.add_face(face);
        }

        // Create faces between hemispheres
        let k = 0;
        for (let i = 0; i < this._lat - 1; i += 1) {
            for (let j = 0; j < this._lng; j += 1) {
                face = new Face([latv[i][j], latv[i][(j + 1) % this._lng], latv[(i + 1) % this._lat][(j + 1) % this._lng], latv[(i + 1) % this._lat][j]], 'FH{0}+{1}-{2}'.format(i, j, k));
                face.reverse_vertices();
                face.set_bomb_behaviour(face.behaviour.AROUND);
                this._volume.add_face(face);
                k += 1;
            }
        }

    };

}