/**
 RANDOM PLANE.
 Creates an random plane.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Random plane.
 *
 * @class
 * @extends {Generator}
 */
function RandomPlane() {
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

        // Calculate lengths of the cube
        let lx = xf - xi;
        let ly = yf - yi;
        let zo = Math.abs((zf + zi) / 2);

        // Calcualte required vertices
        let nv = this._faces_target + 2;

        // Create vertices
        let v = [];
        let vertices = [];
        let x, y, z;
        for (let i = 0; i < nv; i += 1) {
            x = (Math.random() * lx) + xi;
            y = (Math.random() * ly) + yi;
            z = zo;
            v.push([x, y]);
            vertices.push(new Vertex(x, y, z, 'V' + (i + 1).toString()));
        }

        // Triangulate
        let delaunay = Delaunator.from(v);
        let triangles = delaunay.triangles;
        let faces = [];

        // Draw faces
        for (let i = 0; i < triangles.length / 3; i += 1) {
            faces.push(new Face([vertices[triangles[(3 * i)]], vertices[triangles[(3 * i) + 1]], vertices[triangles[(3 * i) + 2]]], 'F' + (i + 1).toString()));
        }

        // Add to geometry
        this._volume.add_face(faces);

    };

}