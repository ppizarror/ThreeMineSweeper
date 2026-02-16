/**
 CUBE
 3D cube.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

// noinspection JSClosureCompilerSyntax
/**
 * 3D Cube.
 *
 * @class
 * @extends {Generator}
 */
function GenCube() {

    /**
     * Inherit class.
     */
    Generator.call(this);
    this._genprops.latlng = true;
    this._set_name('Cube');

    /**
     * Plane definitions.
     * @type {{XY: string, YZ: string, XZ: string}}
     * @private
     */
    this._planes = {
        XY: 'xy',
        XZ: 'xz',
        YZ: 'yz',
    };

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

        // Plane XY
        this._create_plane(lx, ly, lz, xi, yi, zi, lat, lng, 90, false, this._planes.XY, '-', true);
        this._create_plane(lx, ly, lz, xi, yi, zf, lat, lng, 0, true, this._planes.XY, '+', false);

        // Plane XZ
        this._create_plane(lx, ly, lz, xi, yi, zi, lat, lng, -90, true, this._planes.XZ, '-', true);
        this._create_plane(lx, ly, lz, xf, yi, zi, lat, lng, 0, false, this._planes.XZ, '+', false);

        // Plane YZ
        this._create_plane(lx, ly, lz, xi, yi, zi, lat, lng, 0, true, this._planes.YZ, '-', false);
        this._create_plane(lx, ly, lz, xi, yf, zi, lat, lng, -90, false, this._planes.YZ, '+', true);

    };

    this._create_plane = function (lx, ly, lz, xi, yi, zi, lat, lng, angle, flip, plane, planedir, reverse) {

        // Displacements
        let dx, dy, dz;
        if (plane === this._planes.XY) {
            dx = lx / (lng - 1);
            dy = ly / (lat - 1);
            dz = 0;
        } else if (plane === this._planes.YZ) {
            dx = lx / (lng - 1);
            dy = 0;
            dz = lz / (lat - 1);
        } else if (plane === this._planes.XZ) {
            dx = 0;
            dy = ly / (lng - 1);
            dz = lz / (lat - 1);
        }

        // Plane name
        let planename = plane + planedir;

        // Create vertices
        let v = [];
        for (let i = 0; i < lng; i += 1) {
            for (let j = 0; j < lat; j += 1) {
                if (plane === this._planes.XY) {
                    v.push(new Vertex(xi + (dx * i), yi + (dy * j), zi, 'V' + planename + ((i * lng) + j).toString()));
                } else if (plane === this._planes.YZ) {
                    v.push(new Vertex(xi + (dx * i), yi, zi + (dz * j), 'V' + planename + ((i * lng) + j).toString()));
                } else if (plane === this._planes.XZ) {
                    v.push(new Vertex(xi, yi + (dy * i), zi + (dz * j), 'V' + planename + ((i * lng) + j).toString()));
                }
            }
        }

        // Create playable faces
        let f = [];
        let i = 1;
        let face;
        for (let j = 0; j < lng - 1; j += 1) {
            for (let fi = 0; fi < lat - 1; fi += 1) {
                face = new Face([
                    v[(lat * j) + fi],
                    v[(lat * j) + fi + 1],
                    v[(lat * (j + 1)) + fi + 1],
                    v[(lat * (j + 1)) + fi],
                ], 'F' + planename + '-' + i.toString());
                if (flip) face.enable_uv_flip();
                if (reverse) face.reverse_vertices();
                face.set_uv_rotation(-angle);
                face.set_bomb_behaviour(face.behaviour.AROUND);
                f.push(face);
                i += 1;
            }
        }

        // Add valid faces to volume
        this._volume.add_face(f);

    };

}