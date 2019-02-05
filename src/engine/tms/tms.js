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

        // Init viewer
        self._viewer.init(parentElement);
        self._events.set_viewer(self._viewer);
        self._events.initEvents();

    };

    /**
     * Creates new game.
     *
     * @function
     * @param {Volume} volume
     * @param {number} mines - Number of mines, if less than 1 it's treated as percentage
     */
    this.new = function (volume, mines) {
        this._mines.apply(volume, mines);
        this._events.set_volume(volume);
        this._viewer.new(volume);
        loadingHandler(false);
    };

}