/**
 MENU
 Game menu.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Menu.
 *
 * @class
 * @constructor
 */
function TMSMenu() {
    /* eslint-disable arrow-parens */
    /* eslint-disable new-cap */
    /* eslint-disable no-continue */
    /* eslint-disable no-extra-parens */

    /**
     * Store dom objects.
     * @private
     */
    this._dom = {
        menu: $('#menu'),
    };

    /**
     * Stores viewer reference.
     * @type {Minesweeper}
     * @private
     */
    this._mines = null;

    /**
     * Object pointer.
     * @type {TMSMenu}
     */
    let self = this;

    /**
     * Open main menu.
     *
     * @function
     */
    this.main_menu = function () {

    };

    /**
     * Load new game.
     *
     * @function
     * @private
     */
    this._load_new = function () {
        app_tms.set_generator(3, 2, 20, 20, 20);
        app_tms.set_mines(0.1);
        app_tms.new();
    };

    /**
     * Set minesweeper reference.
     *
     * @function
     * @param {Minesweeper} mines
     */
    this.set_minesweeper = function (mines) {
        self._mines = mines;
    };

}