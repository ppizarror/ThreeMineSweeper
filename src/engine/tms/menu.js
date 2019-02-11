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
     * Get game modes.
     * @private
     */
    this._games = {
        0: {}, // BasicCube
        1: {}, // BasicPyramid
        2: { // CrossFractal
            fractal: true,
            maxorder: 2,
        },
        3: { // SierpinskiCube
            fractal: true,
            maxorder: 2,
        },
        4: { // SierpinskiTriangle
            fractal: true,
            maxorder: 5,
        },
        5: { // RandomPlane
            target: true,
        },
        6: { // Sphere
            latlng: true,
        },
        7: { // Cylinder
            latlng: true,
        },
        8: { // Square
            latlng: true,
        }
    };

    /**
     * Fill modes
     */
    this._gamekeys = Object.keys(this._games);
    for (let i = 0; i < this._gamekeys.length; i += 1) {
        if (isNullUndf(this._games[this._gamekeys[i]]['fractal'])) this._games[this._gamekeys[i]]['fractal'] = false;
        if (isNullUndf(this._games[this._gamekeys[i]]['latlng'])) this._games[this._gamekeys[i]]['latlng'] = false;
        if (isNullUndf(this._games[this._gamekeys[i]]['target'])) this._games[this._gamekeys[i]]['target'] = false;
        this._games[this._gamekeys[i]]['name'] = lang['gen_' + this._gamekeys[i].toString()];
    }

    /**
     * Object pointer.
     * @type {TMSMenu}
     */
    let self = this;

    /**
     * Init menu.
     *
     * @function
     */
    this.init_menu = function () {

        // Write header title
        self._dom.header.find('.menu-header-title').html(aboutinfo.productname);

        // Write footer
        let $langid = generateID();
        let $githubid = generateID();
        let $authorid = generateID();

        // noinspection HtmlUnknownTarget
        self._dom.footer.html('<div class="menu-footer-item menu-footer-item-author" id="{5}">{0}: <a href="{2}" target="_blank">@{1}</a></div><div class="menu-footer-item menu-footer-item-other"><a href="{4}" target="_blank" id="{6}"><i class="fab fa-github"></i></a></div><div class="menu-footer-item menu-footer-item-version">v{3}</div><div class="menu-footer-lang-selector" id="{7}"></div>'.format(lang.author, aboutinfo.author.tag, aboutinfo.author.website, aboutinfo.v.version, aboutinfo.productwebsite, $authorid, $githubid, $langid));

        // Write langs
        let langcontainer = $('#' + $langid);
        self._write_lang(langcontainer, 'en', lang.lang_en);
        self._write_lang(langcontainer, 'es', lang.lang_es);

        // Write github tooltip
        $('#' + $githubid).tooltipster({
            content: lang.footer_github,
            contentAsHTML: false,
            delay: [1200, 200],
            side: 'bottom',
            theme: theme.tooltipTheme,
        });

        // Write author tooltip
        $('#' + $authorid).tooltipster({
            content: aboutinfo.author.name,
            contentAsHTML: false,
            delay: [1200, 200],
            side: 'bottom',
            theme: theme.tooltipTheme,
        });

    };

    /**
     * Write lang.
     *
     * @function
     * @param {JQuery<HTMLElement> | jQuery | HTMLElement} container
     * @param {string} code
     * @param {string} langname
     * @private
     */
    this._write_lang = function (container, code, langname) {
        let $langid = generateID();
        let $langtooltip = lang.lang_load_title.format(langname);
        // noinspection HtmlUnknownTarget
        container.append('<img src="resources/langs/{1}.png" id="{0}" alt="" class="hvr-grow-shadow" />'.format($langid, code));
        let $btn = $('#' + $langid);
        $btn.on('click', function () {
            self._load_lang(code);
        });
        $btn.tooltipster({
            content: $langtooltip,
            contentAsHTML: false,
            delay: [1200, 200],
            side: 'bottom',
            theme: theme.tooltipTheme,
        });
        if (sessionCookie.lang === code) $btn.css('opacity', 1);
    };

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
        app_dom.window.on('resize.menucontainer', self._set_content_height);

        // Write buttons
        self._add_button(lang.menu_new_game, self._menu_new);
        self._add_button(lang.menu_how_to_play, self._menu_htp);
        self._add_button(lang.menu_about, self._menu_about);

        // Apply rippler effect
        self._apply_rippler();

        // Set height
        self._set_content_height();

    };

    /**
     * Set content height.
     *
     * @function
     * @private
     */
    this._set_content_height = function () {
        self._dom.content.css('height', self._get_content_height());
    };

    /**
     * Create new game menu.
     *
     * @function
     * @private
     */
    this._menu_new = function () {

        // Wipe content
        self._dom.content.empty();

        // Write generator selector
        self._load_new();

    };

    /**
     * Create menu how to play.
     *
     * @function
     * @private
     */
    this._menu_htp = function () {
    };

    /**
     * About menu.
     *
     * @function
     * @private
     */
    this._menu_about = function () {
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
        return self._dom.container.innerHeight() - getElementHeight(self._dom.header) - getElementHeight(self._dom.footer) - 6;
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

    /**
     * Load language.
     *
     * @function
     * @param {string} $lang
     * @private
     */
    this._load_lang = function ($lang) {
        app_sound.play(app_sound.sound.BUTTON);
        if (sessionCookie.lang === $lang) return;
        if (!lang_available.includes($lang)) return;
        sessionCookie.lang = $lang;
        updateSessionCookie();
        app_console.info(lang.load_lang.format($lang));
        lang = lang_db[$lang]; // Reload lang
        self.init_menu();
        self._menu_new(); // Reload menu
    };

}