/**
 POLYHEDRA
 Uses polyhedron data.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Polyhedra generator.
 *
 * @class
 * @extends {Generator}
 */
function GenPolyhedra() {
    /* eslint-disable no-extra-parens */

    /**
     * Inherit class.
     */
    Generator.call(this);
    this._genprops.item = true;
    this._set_name('Polyhedra');

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

        // Load polyhedron
        let poly = POLYHEDRA[this._item];
        if (is_null_undf(poly)) return;

        // Calculate lengths
        let lx = Math.abs(xf - xi);
        let ly = Math.abs(yf - yi);
        let lz = Math.abs(zf - zi);

        // Calculate center
        let xo = (xi + xf) / 2;
        let yo = (yi + yf) / 2;
        let zo = (zi + zf) / 2;

        // Calculate vertex factors
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
        let $x, $y, $z;
        for (let i = 0; i < poly.vertex.length; i += 1) {
            $x = poly.vertex[i][0];
            $y = poly.vertex[i][1];
            $z = poly.vertex[i][2];
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

        // Calculate factors
        $mm.origin_p.factor.x = Math.min($mm.origin_p.factor.x,
            lx / (2 * Math.abs($mm.origin_p.x.max - $mm.origin_p.x.min)));
        $mm.origin_p.factor.y = Math.min($mm.origin_p.factor.y,
            ly / (2 * Math.abs($mm.origin_p.y.max - $mm.origin_p.y.min)));
        $mm.origin_p.factor.z = Math.min($mm.origin_p.factor.z,
            lz / (2 * Math.abs($mm.origin_p.z.max - $mm.origin_p.z.min)));
        $mm.origin_n.factor.x = Math.min($mm.origin_n.factor.x,
            lx / (2 * Math.abs($mm.origin_n.x.max - $mm.origin_n.x.min)));
        $mm.origin_n.factor.y = Math.min($mm.origin_n.factor.y,
            ly / (2 * Math.abs($mm.origin_n.y.max - $mm.origin_n.y.min)));
        $mm.origin_n.factor.z = Math.min($mm.origin_n.factor.z,
            lz / (2 * Math.abs($mm.origin_n.z.max - $mm.origin_n.z.min)));

        // Create vertices
        let v = [];
        let $fx, $fy, $fz;
        let k = 1;
        for (let i = 0; i < poly.vertex.length; i += 1) {
            $x = poly.vertex[i][0];
            $y = poly.vertex[i][1];
            $z = poly.vertex[i][2];
            $fx = $x >= xo ? $mm.origin_p.factor.x : $mm.origin_n.factor.x;
            $fy = $y >= yo ? $mm.origin_p.factor.y : $mm.origin_n.factor.y;
            $fz = $z >= zo ? $mm.origin_p.factor.z : $mm.origin_n.factor.z;
            $x *= $fx;
            $y *= $fy;
            $z *= $fz;
            v.push(new Vertex(xo + $x, yo + $y, zo + $z, 'V{0}'.format(k)));
            k += 1;
        }

        // Create playable faces
        let f = [];
        let i = 1;
        let face;
        let $v;
        for (let j = 0; j < poly.face.length; j += 1) {
            $v = [];
            for (k = 0; k < poly.face[j].length; k += 1) {
                $v.push(v[poly.face[j][k]]);
            }
            face = new Face($v, 'F' + i.toString());
            face.reverse_vertices();
            face.enable_uv_flip();
            face.set_uv_rotation(-90);
            face.set_bomb_behaviour(face.behaviour.AROUND);
            face.disable_contour();
            f.push(face);
            i += 1;
        }

        // Add valid faces to volume
        this._volume.add_face(f);

    };

}