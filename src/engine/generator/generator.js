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
     * Target face for face-number depending generators.
     * @type {number}
     * @protected
     */
    this._faces_target = 0;

    /**
     * Sphere latitude.
     * @type {number}
     * @protected
     */
    this._lat = 0;

    /**
     * Sphere longitude.
     * @type {number}
     * @protected
     */
    this._lng = 0;

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
        let _xi = Math.min(xi, xf);
        let _xf = Math.max(xi, xf);
        let _yi = Math.min(yi, yf);
        let _yf = Math.max(yi, yf);
        let _zi = Math.min(zi, zf);
        let _zf = Math.max(zi, zf);
        self._generate(_xi, _yi, _zi, _xf, _yf, _zf);
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
        self._order = Math.max(order, 0);
    };

    /**
     * Set face target of the generator.
     *
     * @function
     * @param {number} target
     */
    this.set_face_target = function (target) {
        self._faces_target = Math.max(target, 1);
    };

    /**
     * Set geometry latitude.
     *
     * @function
     * @param {number} lat
     */
    this.set_latitude = function (lat) {
        self._lat = Math.max(lat, 1);
    };

    /**
     * Set geometry longitude.
     *
     * @function
     * @param {number} lng
     */
    this.set_longitude = function (lng) {
        self._lng = Math.max(lng, 1);
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
     * @param {number} mines - Number of mines, if less than 1 it's treated as percentage
     */
    this.start = function (mines) {
        app_tms.new(this._volume, mines);
    };

}