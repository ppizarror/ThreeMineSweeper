/**
 MOBIUS
 3D Möbius strip.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Moebius strip.
 *
 * @class
 * @extends {Generator}
 */
function GenMobius() {
    /* eslint-disable no-extra-parens */

    /**
     * Inherit class.
     */
    Generator.call(this);
    this._genprops.latlng = true;
    this._set_name('Moebius');

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

        // https://en.wikipedia.org/wiki/Möbius_strip
        this._set_camera_position(0, 0, 2);

        // Define lat and lng
        let lat = this._lat + 1;
        let lng = this._lng + 1;

        // Calculate lengths
        let lx = Math.abs(xf - xi);
        let ly = Math.abs(yf - yi);
        let lz = Math.abs(zf - zi);
        let r = Math.min(lx, ly) / 2;

        // Calculate center
        let xo = (xi + xf) / 2;
        let yo = (yi + yf) / 2;
        let zo = (zi + zf) / 2;

        // Calculate displacements
        let du = 2 * Math.PI / (lng - 1);
        let dv = 2 * r / (lat - 1);

        /**
         * Vertices
         * @type {Vertex[]}
         */
        let v = [];

        // Create vertices
        let $x, $y, $z; // Coords
        let $u, $v; // Follow the strip

        // Calculate max and min
        let $mm = {
            origin_p: { // +
                factor: {
                    x: 1,
                    y: 1,
                    z: 1,
                },
                x: {
                    max: Number.NEGATIVE_INFINITY,
                    min: Number.POSITIVE_INFINITY,
                },
                y: {
                    max: Number.NEGATIVE_INFINITY,
                    min: Number.POSITIVE_INFINITY,
                },
                z: {
                    max: Number.NEGATIVE_INFINITY,
                    min: Number.POSITIVE_INFINITY,
                },
            },
            origin_n: { // -
                factor: {
                    x: 1,
                    y: 1,
                    z: 1,
                },
                x: {
                    max: Number.NEGATIVE_INFINITY,
                    min: Number.POSITIVE_INFINITY,
                },
                y: {
                    max: Number.NEGATIVE_INFINITY,
                    min: Number.POSITIVE_INFINITY,
                },
                z: {
                    max: Number.NEGATIVE_INFINITY,
                    min: Number.POSITIVE_INFINITY,
                },
            },
        };
        for (let i = 0; i < lng; i += 1) { // u
            $u = i * du;
            for (let j = 0; j < lat; j += 1) { // v
                $v = -r + (dv * j);
                $x = xo + ((1 + (($v / 2) * Math.cos($u / 2))) * Math.cos($u));
                $y = yo + ((1 + (($v / 2) * Math.cos($u / 2))) * Math.sin($u));
                $z = zo + (($v / 2) * Math.sin($u / 2));
                if ($x >= xo) {
                    $mm.origin_p.x.max = Math.max($mm.origin_p.x.max, $x);
                    $mm.origin_p.x.min = Math.min($mm.origin_p.x.min, $x);
                } else {
                    $mm.origin_n.x.max = Math.max($mm.origin_n.x.max, $x);
                    $mm.origin_n.x.min = Math.min($mm.origin_n.x.min, $x);
                }
                if ($y >= yo) {
                    $mm.origin_p.y.max = Math.max($mm.origin_p.y.max, $y);
                    $mm.origin_p.y.min = Math.min($mm.origin_p.y.min, $y);
                } else {
                    $mm.origin_n.y.max = Math.max($mm.origin_n.y.max, $y);
                    $mm.origin_n.y.min = Math.min($mm.origin_n.y.min, $y);
                }
                if ($z >= zo) {
                    $mm.origin_p.z.max = Math.max($mm.origin_p.z.max, $z);
                    $mm.origin_p.z.min = Math.min($mm.origin_p.z.min, $z);
                } else {
                    $mm.origin_n.z.max = Math.max($mm.origin_n.z.max, $z);
                    $mm.origin_n.z.min = Math.min($mm.origin_n.z.min, $z);
                }
            }
        }

        // Calculate factors
        $mm.origin_p.factor.x = Math.min(1, lx / (2 * Math.abs($mm.origin_p.x.max - $mm.origin_p.x.min)));
        $mm.origin_p.factor.y = Math.min(1, ly / (2 * Math.abs($mm.origin_p.y.max - $mm.origin_p.y.min)));
        $mm.origin_p.factor.z = Math.min(1, lz / (2 * Math.abs($mm.origin_p.z.max - $mm.origin_p.z.min)));
        $mm.origin_n.factor.x = Math.min(1, lx / (2 * Math.abs($mm.origin_n.x.max - $mm.origin_n.x.min)));
        $mm.origin_n.factor.y = Math.min(1, ly / (2 * Math.abs($mm.origin_n.y.max - $mm.origin_n.y.min)));
        $mm.origin_n.factor.z = Math.min(1, lz / (2 * Math.abs($mm.origin_n.z.max - $mm.origin_n.z.min)));

        let $fx, $fy, $fz;
        for (let i = 0; i < lng; i += 1) { // u
            $u = i * du;
            for (let j = 0; j < lat; j += 1) { // v
                $v = -r + (dv * j);
                $x = ((1 + (($v / 2) * Math.cos($u / 2))) * Math.cos($u));
                $y = ((1 + (($v / 2) * Math.cos($u / 2))) * Math.sin($u));
                $z = (($v / 2) * Math.sin($u / 2));
                $fx = $x >= xo ? $mm.origin_p.factor.x : $mm.origin_n.factor.x;
                $fy = $y >= yo ? $mm.origin_p.factor.y : $mm.origin_n.factor.y;
                $fz = $z >= zo ? $mm.origin_p.factor.z : $mm.origin_n.factor.z;
                $x *= $fx;
                $y *= $fy;
                $z *= $fz;
                v.push(new Vertex(xo + $x, yo + $y, zo + $z, 'Vs' + ((i * lng) + j).toString()));
            }
        }

        // Second strip
        let $half = v.length;
        for (let i = 0; i < lng; i += 1) { // u
            $u = i * du;
            for (let j = 0; j < lat; j += 1) { // v
                $v = -r + (dv * j);
                $x = ((1 + (($v / 2) * Math.cos($u / 2))) * Math.cos($u));
                $y = ((1 + (($v / 2) * Math.cos($u / 2))) * Math.sin($u));
                $z = ((($v / 2) * Math.sin($u / 2)) - (0.005 * (i === 0 ? 0 : 1)));
                $fx = $x >= xo ? $mm.origin_p.factor.x : $mm.origin_n.factor.x;
                $fy = $y >= yo ? $mm.origin_p.factor.y : $mm.origin_n.factor.y;
                $fz = $z >= zo ? $mm.origin_p.factor.z : $mm.origin_n.factor.z;
                $x *= $fx;
                $y *= $fy;
                $z *= $fz;
                v.push(new Vertex(xo + $x, yo + $y, zo + $z, 'Vi' + ((i * lng) + j).toString()));
            }
        }

        // Create playable faces
        let f = [];
        let i = 1;
        let face;

        // First strip
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

        // Second strip
        for (let j = 0; j < lng - 1; j += 1) { // y
            for (let fi = 0; fi < lat - 1; fi += 1) { // Iterate through each face
                face = new Face([
                    v[$half + (lat * j) + fi],
                    v[$half + (lat * j) + fi + 1],
                    v[$half + (lat * (j + 1)) + fi + 1],
                    v[$half + (lat * (j + 1)) + fi]
                ], 'F' + i.toString());
                face.reverse_vertices();
                face.set_uv_rotation(-90);
                face.set_bomb_behaviour(face.behaviour.AROUND);
                f.push(face);
                i += 1;
            }
        }

        // Add valid faces to volume
        this._volume.add_face(f);

    };

}