/**
 MINESWEEPER
 Creates minesweeper game from volume.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Main game platform.
 *
 * @class
 * @constructor
 */
function ThreeMinesSweeper() {
    /* eslint-disable new-cap */
    /* eslint-disable no-extra-parens */

    /**
     * Stores events.
     * @type {TMSEvents}
     * @private
     */
    this._events = null;

    /**
     * Stores viewer.
     * @type {TMSViewer}
     * @private
     */
    this._viewer = null;

    /**
     * Stores minesweeper.
     * @type {Minesweeper}
     * @private
     */
    this._mines = null;

    /**
     * Stores menu.
     * @type {TMSMenu}
     * @private
     */
    this._menu = null;

    /**
     * Generator properties.
     * @type {{facetarget: number|null, latitude: number|null, type: number, longitude: number|null, order: number|null}}
     * @private
     */
    this._generator = {
        facetarget: null,
        latitude: null,
        longitude: null,
        mines: 0,
        order: null,
        type: 0,
    };

    /**
     * Stores object reference.
     * @type {ThreeMinesSweeper}
     */
    let self = this;

    /**
     * Init platform.
     *
     * @function
     * @param {string} parentElement - Container
     */
    this.init = function (parentElement) {

        // Create main objects
        self._viewer = new TMSViewer();
        self._events = new TMSEvents();
        self._mines = new Minesweeper();
        self._menu = new TMSMenu();

        // Init viewer
        self._viewer.init(parentElement);

        // Init events
        self._events.set_viewer(self._viewer);
        self._events.set_minesweeper(self._mines);
        self._events.initEvents();

        // Set window events
        setTimeout(function () {
            window.onbeforeunload = function () {
                return lang.reload_alert;
            }
        }, 500);

        // Init menu
        self._menu.init_menu();

    };

    /**
     * Set generator properties.
     *
     * @function
     * @param {number} type - Generator type
     * @param {number | null=} order - Generator order
     * @param {number | null=} face_target - Target face for random generators
     * @param {number | null=} latitude - Latitude
     * @param {number | null=} longitude - Longitude
     */
    this.set_generator = function (type, order, face_target, latitude, longitude) {
        this._generator.type = type;
        this._generator.order = order;
        this._generator.facetarget = face_target;
        this._generator.latitude = latitude;
        this._generator.longitude = longitude;
    };

    /**
     * Set mines number or percentage.
     *
     * @function
     * @param {number} mines - Number of mines, if less than 1 it's treated as percentage
     */
    this.set_mines = function (mines) {
        this._generator.mines = mines;
    };

    /**
     * Creates a new generator.
     *
     * @function
     * @returns {Generator}
     * @private
     */
    this._generate = function () {

        // Creates new generator
        let g;
        switch (this._generator.type) {
            case 0:
                g = new BasicCube();
                break;
            case 1:
                g = new BasicPyramid();
                break;
            case 2:
                g = new CrossFractal();
                break;
            case 3:
                g = new SierpinskiCube();
                break;
            case 4:
                g = new SierpinskiTriangle();
                break;
            case 5:
                g = new RandomPlane();
                break;
            case 6:
                g = new Sphere();
                break;
            case 7:
                g = new Cylinder();
                break;
            case 8:
                g = new Square();
                break;
            default:
                g = new EmptyGenerator();
                break;
        }

        // Set generator properties
        if (notNullUndf(this._generator.order)) g.set_order(this._generator.order);
        if (notNullUndf(this._generator.facetarget)) g.set_face_target(this._generator.facetarget);
        if (notNullUndf(this._generator.latitude)) g.set_latitude(this._generator.latitude);
        if (notNullUndf(this._generator.longitude)) g.set_longitude(this._generator.longitude);
        g.generate(-1, -1, -1, 1, 1, 1);

        // Returns generator
        return g;

    };

    /**
     * Abort current game.
     *
     * @function
     */
    this.abort = function () {
        self._viewer.delete_last_volume();
        self._mines.reset_game_ui();
        app_console.info(lang.reset_game);
    };

    /**
     * Load menu.
     *
     * @function
     */
    this.load_menu = function () {
        self.abort();
        self._menu.main_menu();
    };

    /**
     * Creates new game.
     *
     * @function
     */
    this.new = function () {
        loadingHandler(true);
        setTimeout(function () {

            // Generate the figure
            let gen = self._generate();
            let volume = gen.get_volume();
            let camera = gen.get_camera();

            // Creates new minesweeper game instance
            self._mines.new(volume, self._generator.mines, gen.get_genid(), gen.get_name());

            // Init events
            self._events.set_volume(volume);

            // Init viewer
            self._viewer.set_camera_init_pos(camera.x, camera.y, camera.z);
            self._viewer.new(volume);
            self._mines.new_game_ui(true);
            self._viewer.focus();
            loadingHandler(false);

        }, 450);
    };

}