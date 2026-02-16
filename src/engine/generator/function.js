/**
 FUNCTION
 2D plane function.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

// noinspection JSClosureCompilerSyntax
/**
 * Square mesh, applies function z = f(x,y)
 *
 * @class
 * @extends {Generator}
 */
function GenFunction() {

    /**
     * Inherit class.
     */
    Generator.call(this);
    this._genprops.latlng = true;
    this._genprops.fun = true;
    this._set_name('Function');

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
        this._set_camera_position(1.3, 0, 1.6);

        // Define lat and lng
        let lat = this._lat + 1;
        let lng = this._lng + 1;

        // Calculate lengths
        let lx = Math.abs(xf - xi);
        let ly = Math.abs(yf - yi);
        let lz = Math.abs(zf - zi);
        let zo = (zf + zi) / 2; // Mid
        let dx = lx / (lng - 1); // Displacements
        let dy = ly / (lat - 1);

        // noinspection JSUnresolvedFunction
        let $f = Parser.parse(this._gen_fun).toJSFunction(['x', 'y']);

        // Calculate max/min (z) value
        let $x, $y, $z;
        let $zmin = Number.POSITIVE_INFINITY;
        let $zmax = Number.NEGATIVE_INFINITY;
        for (let i = 0; i < lng; i += 1) { // x
            for (let j = 0; j < lat; j += 1) { // y
                $x = xi + (dx * i);
                $y = yi + (dy * j);
                $z = $f($x, $y);
                $zmin = Math.min($z, $zmin);
                $zmax = Math.max($z, $zmax);
            }
        }
        let $lz = Math.abs($zmax - $zmin); // Real value
        if ($lz === 0) return;
        let $zf = Math.min(1, lz / $lz); // Conversion factor
        let $dz = (($zmax + $zmin) / 2) - zo;

        // Create vertices
        let v = [];
        for (let i = 0; i < lng; i += 1) { // x
            for (let j = 0; j < lat; j += 1) { // y
                $x = xi + (dx * i);
                $y = yi + (dy * j);
                $z = ($f($x, $y) - $dz) * $zf;
                v.push(new Vertex($x, $y, $z, 'Vs' + ((i * lng) + j).toString()));
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
                    v[(lat * (j + 1)) + fi],
                ], 'Fs' + i.toString());
                face.enable_uv_flip();
                face.set_uv_rotation(-90);
                face.set_bomb_behaviour(face.behaviour.AROUND);
                face.disable_contour();
                f.push(face);
                i += 1;
            }
        }

        // Add valid faces to volume
        this._volume.add_face(f);

        // Create vertices hidden
        v = [];
        for (i = 0; i < lng; i += 1) { // x
            for (let j = 0; j < lat; j += 1) { // y
                $x = xi + (dx * i);
                $y = yi + (dy * j);
                $z = (($f($x, $y) - $dz) * $zf) - 0.0005;
                v.push(new Vertex($x, $y, $z, 'Vi' + ((i * lng) + j).toString()));
            }
        }

        // Create unplayable faces
        f = [];
        i = 1;
        for (let j = 0; j < lng - 1; j += 1) { // y
            for (let fi = 0; fi < lat - 1; fi += 1) { // Iterate through each face
                face = new Face([
                    v[(lat * j) + fi],
                    v[(lat * j) + fi + 1],
                    v[(lat * (j + 1)) + fi + 1],
                    v[(lat * (j + 1)) + fi],
                ], 'Fi' + i.toString());
                face.disable_face();
                face.reverse_vertices();
                face.disable_contour();
                f.push(face);
                i += 1;
            }
        }

        // Add unplayable faces to volume
        this._volume.add_face(f);

        // Disable contour
        this._volume.disable_contour();

    };

}