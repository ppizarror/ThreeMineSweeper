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
    this._set_name('Torus');

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

        // Add valid faces to volume
        this._volume.add_face(f);

    };

}