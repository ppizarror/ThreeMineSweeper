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
        container: $('#menu-container'),
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
        app_console.info(lang.load_menu);

        // Open menu
        self._dom.container.fadeIn();

        // Create events
        let $f = function () {
            self._dom.content.css('height', self._get_content_height());
        };
        app_dom.window.on('resize.menucontainer', $f);

        // Write buttons
        self._add_button(lang.menu_new_game, function () {
            self._load_new();
        });
        self._add_button(lang.menu_how_to_play);
        self._add_button(lang.menu_about);

        // noinspection HtmlUnknownTarget
        self._dom.footer.html('<div class="menu-footer-item menu-footer-item-author">{0}: <a href="{2}" target="_blank" title="{6}">{1}</a></div><div class="menu-footer-item menu-footer-item-other"><a href="{5}" target="_blank" title="{7}"><i class="fab fa-github"></i></a></div><div class="menu-footer-item menu-footer-item-version">v{3} ({4})</div>'.format(lang.author, aboutinfo.author.tag, aboutinfo.author.website, aboutinfo.v.version, aboutinfo.v.date, aboutinfo.productwebsite, lang.footer_author, lang.footer_github));

        // Apply rippler effect
        self._apply_rippler();

        // Set height
        $f();

    };

    /**
     * Addd button.
     *
     * @function
     * @param {string} text
     * @param {function=} callback
     * @private
     */
    this._add_button = function (text, callback) {
        if (isNullUndf(callback)) {
            callback = function () {
            };
        }
        let $callback = function () {
            app_sound.play(app_sound.sound.BUTTON);
            callback();
        };
        let $id = generateID();
        self._dom.content.append('<div class="menu-main-button"><button type="button" class="btn btn-default rippler rippler-inverse hvr-shadow" id="{0}">{1}</button></div>'.format($id, text));
        $('#' + $id).on('click', $callback);
    };

    /**
     * Apply rippler buttons effect.
     *
     * @function
     * @private
     */
    this._apply_rippler = function () {
        $('.rippler').rippler({
            effectClass: 'rippler-effect',
            effectSize: 16,      // Default size (width & height)
            addElement: 'div',   // e.g. 'svg'(feature)
            duration: 400,
        });
    };

    /**
     * Content height.
     *
     * @function
     * @returns {number}
     * @private
     */
    this._get_content_height = function () {
        return getElementHeight(self._dom.container) - getElementHeight(self._dom.header) - getElementHeight(self._dom.footer) - 6;
    };

    /**
     * Reset menu.
     *
     * @function
     */
    this.reset_menu = function () {

        // Hide menu
        self._dom.container.hide();

        // Destroy events
        app_dom.window.off('resize.menucontainer');

        // Delete content
        self._dom.content.empty();
        self._dom.footer.empty();
        app_console.info(lang.reset_menu);

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