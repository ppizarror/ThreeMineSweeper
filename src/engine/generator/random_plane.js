/**
 RANDOM PLANE
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
function GenRandomPlane() {
    /* eslint-disable no-extra-parens */

    /**
     * Inherit class.
     */
    Generator.call(this);
    this._genprops.target = true;
    this._set_name('RandomPlane');

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
        this._set_camera_position(0, 0, 2.0);

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
            vertices.push(new Vertex(x, y, z, 'V-' + (i + 1).toString()));
        }

        // noinspection JSUnresolvedReference
        let delaunay = Delaunator.from(v);
        let triangles = delaunay.triangles;
        let faces = [];

        // Draw faces
        let face;
        for (let i = 0; i < triangles.length / 3; i += 1) {
            face = new Face([vertices[triangles[(3 * i)]], vertices[triangles[(3 * i) + 1]], vertices[triangles[(3 * i) + 2]]], 'F-' + (i + 1).toString());
            face.enable_uv_flip();
            face.set_uv_rotation(-90);
            faces.push(face);
        }

        // Add to geometry
        this._volume.add_face(faces);

    };

}