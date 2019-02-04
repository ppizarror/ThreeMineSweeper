/**
 GENERATOR
 Global class.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Generator class.
 *
 * @class
 * @abstract
 */
function Generator() {

    /**
     * Object pointer.
     * @type {Generator}
     */
    let self = this;

    /**
     * Order of recursive fractal generators.
     * @type {number}
     * @protected
     */
    this._order = 1;

    /**
     * ID of the generator.
     * @type {string}
     * @protected
     */
    this._id = generateID();

    /**
     * Generator volume.
     * @type {Volume}
     * @protected
     */
    this._volume = new Volume();

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
     * @abstract
     */
    this._generate = function (xi, yi, zi, xf, yf, zf) {
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
    this.generate = function (xi, yi, zi, xf, yf, zf) {
        let ti = new Date();
        self._generate(xi, yi, zi, xf, yf, zf);
        this._volume.assemble();
        let tf = getSecondsFrom(ti);
        app_console.info(lang.generator_finished.format(tf, this._volume.get_total_faces(),
            this._volume.get_total_deleted_faces(), this._volume.get_duplicated_vertices(),
            this._volume.get_total_vertices()));
    };

    /**
     * Set fractal order of the generator.
     *
     * @function
     * @param {number} order
     */
    this.set_order = function (order) {
        self._order = order;
    };

    /**
     * Apply order limit.
     *
     * @function
     * @param {number} max_order
     * @protected
     */
    this._apply_order_limit = function (max_order) {
        self._order = Math.max(self._order, 0);
        if (self._order > max_order) {
            app_console.info(lang.generator_order_exceeded.format(self._order, max_order));
            self._order = max_order;
        }
    };

    /**
     * Disables face check.
     *
     * @function
     * @protected
     */
    this._disable_face_check = function () {
        this._volume.disable_face_check();
    };

    /**
     * Disables vertex check.
     *
     * @function
     * @protected
     */
    this._disable_vertex_check = function () {
        this._volume.disable_vertex_check();
    };

    /**
     * Start new game based on this geometry.
     *
     * @function
     */
    this.start = function () {
        app_viewer.new(this._volume);
    };

}