/**
 TORUS
 3D Toroid generator (donut).

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * 3D Toroid.
 *
 * @class
 * @extends {Generator}
 */
function GenToroid() {
    /* eslint-disable no-extra-parens */

    /**
     * Inherit class.
     */
    Generator.call(this);
    this._genprops.latlng = true;
    this._set_name('Toroid');

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
        this._set_camera_position(0, 0, 2.5);

        // Define lat and lng
        let lat = this._lat + 1;
        let lng = this._lng + 1;

        // Calculate radius
        let lx = xf - xi;
        let ly = yf - yi;
        let lz = zf - zi;
        let lr = Math.min(lx, ly, lz);
        let zo = (zf + zi) / 2;

        let r = lr / 5; // Small radius
        let R = (lr - r) / 2; // Big radius

        // Calculate advance angles
        let beta = 2 * Math.PI / lng; // R
        let alpha = 2 * Math.PI / lat; // r

        // Create vertices
        let v = [];
        let $x, $y, $z; // Vertex position
        let k = 1; // Counter
        for (let i = 0; i < lng; i += 1) { // Theta
            for (let j = 0; j < lat; j += 1) { // Phi
                $x = (R + (r * Math.cos(j * alpha))) * Math.cos(i * beta);
                $y = (R + (r * Math.cos(j * alpha))) * Math.sin(i * beta);
                $z = r * Math.sin(j * alpha);
                v.push(new Vertex($x, $y, zo + $z, 'V-{0}'.format(k)));
                k += 1;
            }
        }

        // Create faces
        let f = [];
        let face;
        k = 1;
        for (let i = 0; i < lng; i += 1) { // Theta
            for (let j = 0; j < lat; j += 1) { // Phi
                face = new Face([
                    v[(i * lat) + j],
                    v[(((i + 1) * lat) + j) % v.length],
                    v[(((i + 1) * lat) + ((j + 1) % lat)) % v.length],
                    v[(i * lat) + ((j + 1) % lat)]
                ], 'F-{0}'.format(k));
                face.reverse_vertices();
                face.enable_uv_flip();
                face.set_uv_rotation(-90);
                f.push(face);
                k += 1;
            }
        }

        // Add valid faces to volume
        this._volume.add_face(f);

    };

}