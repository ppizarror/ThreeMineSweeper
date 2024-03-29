/**
 TMS
 Inits all the objects and controls the game status.

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
function ThreeMineSweeper() {
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
     * @private
     */
    this._generator = {
        facetarget: null,
        fun: '',
        item: '',
        latitude: null,
        longitude: null,
        mines: 0,
        order: null,
        type: 0,
    };

    /**
     * Stores object reference.
     * @type {ThreeMineSweeper}
     */
    const self = this;

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
        if (!cfg_verbose && cfg_reload_alert_onclose) {
            setTimeout(function () {
                window.onbeforeunload = function () {
                    return lang.reload_alert;
                }
            }, 500);
        }

        // Init menu
        self._menu.init_menu();

    };

    /**
     * Set generator properties.
     *
     * @function
     * @param {number} type - Generator type
     * @param {number | null} order - Generator order
     * @param {number | null} face_target - Target face for random generators
     * @param {number | null} latitude - Latitude
     * @param {number | null} longitude - Longitude
     * @param {string | null} fun - Function generator
     * @param {string | null} item - Selected item
     */
    this.set_generator = function (type, order, face_target, latitude, longitude, fun, item) {

        // Type
        this._generator.type = type;

        // Properties
        this._generator.facetarget = face_target;
        this._generator.fun = fun;
        this._generator.item = item;
        this._generator.latitude = latitude;
        this._generator.longitude = longitude;
        this._generator.order = order;

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
                g = new GenBasicCube();
                break;
            case 1:
                g = new GenBasicPyramid();
                break;
            case 2:
                g = new GenCrossFractal();
                break;
            case 3:
                g = new GenSierpinskiCube();
                break;
            case 4:
                g = new GenSierpinskiTriangle();
                break;
            case 5:
                g = new GenRandomPlane();
                break;
            case 6:
                g = new GenSphere();
                break;
            case 7:
                g = new GenCylinder();
                break;
            case 8:
                g = new GenSquare();
                break;
            case 9:
                g = new GenCube();
                break;
            case 10:
                g = new GenToroid();
                break;
            case 11:
                g = new GenFunction();
                break;
            case 12:
                g = new GenMobius();
                break;
            case 13:
                g = new GenPolyhedra();
                break;
            default:
                g = new GenEmpty();
                break;
        }

        // Set generator properties
        if (not_null_undf(this._generator.facetarget)) g.set_face_target(this._generator.facetarget);
        if (not_null_undf(this._generator.fun)) g.set_function(this._generator.fun);
        if (not_null_undf(this._generator.item)) g.set_item(this._generator.item);
        if (not_null_undf(this._generator.latitude)) g.set_latitude(this._generator.latitude);
        if (not_null_undf(this._generator.longitude)) g.set_longitude(this._generator.longitude);
        if (not_null_undf(this._generator.order)) g.set_order(this._generator.order);

        // Generate figure
        g.generate(-1, -1, -1, 1, 1, 1);
        g.set_type_id(this._generator.type);

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
        app_sound.stop_all();
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
        self.abort();
        loadingHandler(true);
        setTimeout(function () {

            // Generate the figure
            let gen = self._generate();
            let volume = gen.get_volume();
            let camera = gen.get_camera();

            // Creates new minesweeper game instance
            if (!self._mines.new(volume, self._generator.mines, gen.get_genid(), gen.get_name(), gen.get_type_id())) {
                loadingHandler(false);
                app_dialog.confirm(lang.error_message, lang.new_game_bad_volume, {
                    cancelText: null,
                    confirmButtonClass: app_dialog.options.buttons.DANGER,
                    confirmText: lang.answer_ok,
                    icon: 'fas fa-exclamation-triangle',
                });
                self.load_menu();
                return;
            }

            // Init events
            self._events.set_volume(volume);

            // Init viewer
            self._viewer.set_camera_pos(camera.x, camera.y, camera.z);
            self._viewer.new(volume);
            self._mines.new_game_ui(true);
            self._viewer.focus();
            loadingHandler(false);

        }, 450); // Timeout for loadinghandler
    };

}