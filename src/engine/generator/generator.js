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
 */
function Generator() {

    /**
     * ------------------------------------------------------------------------
     * Generator properties
     * ------------------------------------------------------------------------
     */

    /**
     * Order of recursive fractal generators.
     * @type {number}
     * @protected
     */
    this._order = 0;

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
     * Function generator.
     * @type {string}
     * @protected
     */
    this._gen_fun = '';

    /**
     * Selected item.
     * @type {string}
     * @protected
     */
    this._item = '';

    /**
     * Generator name.
     * @type {string}
     * @private
     */
    this._name = 'Generator';

    /**
     * Type ID.
     * @type {number}
     * @private
     */
    this._type_id = 0;


    /**
     * ------------------------------------------------------------------------
     * Generator internals
     * ------------------------------------------------------------------------
     */

    /**
     * ID of the generator.
     * @type {string}
     * @protected
     */
    this._id = generateID();

    /**
     * Generator properties.
     * @type {{fractal: boolean, fun: boolean, item: boolean, latlng: boolean, target: boolean}}
     * @protected
     */
    this._genprops = {
        fractal: false,
        fun: false,
        item: false,
        latlng: false,
        target: false,
    };

    /**
     * Generator volume.
     * @type {Volume}
     * @protected
     */
    this._volume = new Volume();

    /**
     * Camera initial position.
     * @type {{x: number, y: number, z: number}}
     * @private
     */
    this._camera = {
        x: -1,
        y: -1,
        z: -1,
    };

    /**
     * Object pointer.
     * @type {Generator}
     */
    let self = this;


    /**
     * ------------------------------------------------------------------------
     * Generator methods
     * ------------------------------------------------------------------------
     */

    /**
     * Generate element, space volume goes from (xi,yi,zi) to (xf,yf,zf).
     *
     * @function
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
        app_console.info(lang.generator_start.format(self.get_name()));
        self._generate(_xi, _yi, _zi, _xf, _yf, _zf);
        this._volume.assemble();
        let tf = get_seconds_from(ti);
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
        self._order = Math.max(Math.floor(order), 1);
    };

    /**
     * Set face target of the generator.
     *
     * @function
     * @param {number} target
     */
    this.set_face_target = function (target) {
        self._faces_target = Math.max(Math.floor(target), 1);
    };

    /**
     * Set geometry latitude.
     *
     * @function
     * @param {number} lat
     */
    this.set_latitude = function (lat) {
        self._lat = Math.max(Math.floor(lat), 1);
    };

    /**
     * Set geometry longitude.
     *
     * @function
     * @param {number} lng
     */
    this.set_longitude = function (lng) {
        self._lng = Math.max(Math.floor(lng), 1);
    };

    /**
     * Set geometry function.
     *
     * @function
     * @param {string} fun
     */
    this.set_function = function (fun) {
        self._gen_fun = fun.toString();
    };

    /**
     * Set generator item.
     *
     * @function
     * @param {string} item
     */
    this.set_item = function (item) {
        self._item = item;
    };

    /**
     * Apply fractal order limit (recursive depth).
     *
     * @function
     * @param {number} max_order
     * @protected
     */
    this._apply_order_limit = function (max_order) {
        self._order = Math.max(self._order, 1);
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
     * Set camera position.
     *
     * @function
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @protected
     */
    this._set_camera_position = function (x, y, z) {
        this._camera.x = x;
        this._camera.y = y;
        this._camera.z = z;
    };

    /**
     * Returns volume.
     *
     * @function
     * @returns {Volume}
     */
    this.get_volume = function () {
        return this._volume;
    };

    /**
     * Returns camera.
     *
     * @function
     * @returns {{x: number, y: number, z: number}}
     */
    this.get_camera = function () {
        return this._camera;
    };

    /**
     * Generator name.
     *
     * @function
     * @param {string} name
     * @protected
     */
    this._set_name = function (name) {
        self._name = name.toString();
    };

    /**
     * Returns generator name.
     *
     * @function
     * @returns {string}
     */
    this.get_name = function () {
        let $fractal = '';
        let $target = '';
        let $latlng = '';
        if (self._genprops.fractal) $fractal = '^{0}'.format(self._order);
        if (self._genprops.target) $target = ' T({0})'.format(self._faces_target);
        if (self._genprops.latlng) $latlng = ' {0}x{1}'.format(self._lat, self._lng);
        return '{0}{1}{2}{3}'.format(self._name, $fractal, $target, $latlng);
    };

    /**
     * Return generator ID.
     *
     * @function
     * @returns {string}
     */
    this.get_genid = function () {
        return md5(md5(self._name) + md5(self._genprops.fractal) + md5(self._genprops.latlng) + md5(self._genprops.target) + md5(self._faces_target) + md5(self._lat) + md5(self._lng) + md5(self._order) + (self._gen_fun !== '' ? md5(self._gen_fun) : '') + (self._item !== '' ? md5(self._item) : ''));
    };

    /**
     * Generator type ID.
     *
     * @function
     * @returns {number}
     */
    this.get_type_id = function () {
        return self._type_id;
    };

    /**
     * Set generator type id.
     *
     * @function
     * @param {number} id
     */
    this.set_type_id = function (id) {
        self._type_id = id;
    };

}