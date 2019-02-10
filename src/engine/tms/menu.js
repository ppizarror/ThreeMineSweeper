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
        content: $('#menu-content'),
        footer: $('#menu-footer'),
        header: $('#menu-header'),
        menu: $('#menu'),
    };

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

        // Reset menu
        self.reset_menu();

        // Open menu
        self._dom.menu.fadeIn();

    };

    /**
     * Reset menu.
     *
     * @function
     */
    this.reset_menu = function () {

        // Hide menu
        self._dom.menu.hide();

        // Delete content
        self._dom.content.empty();
        self._dom.footer.empty();
        self._dom.header.empty();

    };

    /**
     * Load new game.
     *
     * @function
     * @private
     */
    this._load_new = function () {
        self.reset_menu();
        app_tms.set_generator(3, 2, 20, 20, 20);
        app_tms.set_mines(0.1);
        app_tms.new();
    };

}