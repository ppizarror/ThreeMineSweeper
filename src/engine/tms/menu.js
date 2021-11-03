/* eslint-disable object-curly-spacing */
// noinspection JSCheckFunctionSignatures

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
    /* eslint-disable array-bracket-newline */
    /* eslint-disable arrow-parens */
    /* eslint-disable new-cap */
    /* eslint-disable no-continue */
    /* eslint-disable no-extra-parens */

    /**
     * Get game modes.
     * @private
     */
    this._games = {
        0: { // BasicCube
            enabled: false,
        },
        1: { // BasicPyramid
            enabled: false,
        },
        2: { // CrossFractal
            fractal: true,
            maxorder: 2,
            minorder: 1,
        },
        3: { // SierpinskiCube
            fractal: true,
            maxorder: 2,
            minorder: 1,
        },
        4: { // SierpinskiTriangle
            fractal: true,
            maxorder: 5,
            minorder: 2,
        },
        5: { // RandomPlane
            from: 300,
            max: 1200,
            min: 50,
            step: 50,
            target: true,
        },
        6: { // Sphere
            from: 20,
            latlng: true,
            max: 55,
            min: 20,
            step: 5,
        },
        7: { // Cylinder
            from: 20,
            lateq: false,
            latlng: true,
            max: 60,
            min: 10,
            step: 5,
        },
        8: { // Square
            from: 20,
            lateq: false,
            latlng: true,
            max: 60,
            min: 10,
            step: 5,
        },
        9: { // Cube
            from: 20,
            lateq: false,
            latlng: true,
            max: 25,
            min: 10,
            step: 5,
        },
        10: { // Toroid
            from: 20,
            lateq: false,
            latlng: true,
            max: 65,
            min: 20,
            step: 5,
        },
        11: { // Function
            from: 20,
            fun: true,
            lateq: true,
            latlng: true,
            max: 60,
            min: 10,
            step: 5,
        },
        12: { // Möbius
            from: [11, 45],
            lateq: false,
            latlng: true,
            max: [15, 70],
            min: [5, 20],
            step: [1, 5],
        },
        13: { // Polyhedra
            item: true,
        },
        'null': { // EmptyGenerator
            enabled: false,
        },
    };

    /**
     * Configure mines.
     * @type {{min: number, max: number, step: number}}
     * @private
     */
    this._mines = {
        from: 5,
        max: 25,
        min: 5,
        step: 1,
    };

    /**
     * Fill modes
     */
    this._gamekeys = [3, 4, 2, 8, 11, 9, 6, 7, 10, 12, 13, 5]; // The order within the menu
    for (let i = 0; i < this._gamekeys.length; i += 1) {
        if (is_null_undf(this._games[this._gamekeys[i]])) continue;

        // Extend properties
        if (is_null_undf(this._games[this._gamekeys[i]]['enabled'])) this._games[this._gamekeys[i]]['enabled'] = true;
        if (is_null_undf(this._games[this._gamekeys[i]]['fractal'])) this._games[this._gamekeys[i]]['fractal'] = false;
        if (is_null_undf(this._games[this._gamekeys[i]]['fun'])) this._games[this._gamekeys[i]]['fun'] = false;
        if (is_null_undf(this._games[this._gamekeys[i]]['item'])) this._games[this._gamekeys[i]]['item'] = false;
        if (is_null_undf(this._games[this._gamekeys[i]]['latlng'])) this._games[this._gamekeys[i]]['latlng'] = false;
        if (is_null_undf(this._games[this._gamekeys[i]]['target'])) this._games[this._gamekeys[i]]['target'] = false;
    }

    /**
     * Cookies ID.
     * @type {{gen: string, mines: string, lng: string, fun: string, lat: string, order: string, target: string}}
     * @private
     */
    this._cookies = {
        fun: 'newgame.fun',
        gen: 'newgame.gen',
        lat: 'newgame.lat',
        lng: 'newgame.lng',
        mines: 'newgame.mines',
        order: 'newgame.order',
        target: 'newgame.target',
    };

    /**
     * Enable or disable rippler effect.
     * @type {boolean}
     * @private
     */
    this._rippler = false;

    /**
     * Dom objects.
     * @type {{
     *      container: JQuery<HTMLElement> | jQuery | HTMLElement,
     *      gen_lng: JQuery<HTMLElement> | jQuery | HTMLElement,
     *      playbutton: JQuery<HTMLElement> | jQuery | HTMLElement,
     *      github: JQuery<HTMLElement> | jQuery | HTMLElement,
     *      gen_selector: JQuery<HTMLElement> | jQuery | HTMLElement,
     *      footer: JQuery<HTMLElement> | jQuery | HTMLElement,
     *      gen_order: JQuery<HTMLElement> | jQuery | HTMLElement,
     *      gen_fun: JQuery<HTMLElement> | jQuery | HTMLElement,
     *      gen_lat: JQuery<HTMLElement> | jQuery | HTMLElement,
     *      generator: JQuery<HTMLElement> | jQuery | HTMLElement,
     *      gen_mines: JQuery<HTMLElement> | jQuery | HTMLElement,
     *      menu: JQuery<HTMLElement> | jQuery | HTMLElement,
     *      gen_item: JQuery<HTMLElement> | jQuery | HTMLElement,
     *      content: JQuery<HTMLElement> | jQuery | HTMLElement,
     *      mines: JQuery<HTMLElement> | jQuery | HTMLElement,
     *      subheader: JQuery<HTMLElement> | jQuery | HTMLElement,
     *      header: JQuery<HTMLElement> | jQuery | HTMLElement,
     *      gen_target: JQuery<HTMLElement> | jQuery | HTMLElement
     *  }}
     * @private
     */
    this._dom = {
        container: $('#menu-container'),
        content: $('#menu-content'),
        footer: $('#menu-footer'),
        gen_fun: null,
        gen_item: null,
        gen_lat: null,
        gen_lng: null,
        gen_mines: null,
        gen_order: null,
        gen_selector: null,
        gen_target: null,
        generator: null,
        github: $('#menu-github-corner'),
        header: $('#menu-header'),
        menu: $('#menu'),
        mines: null,
        playbutton: null,
        subheader: $('#menu-subheader'),
    };

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

        // Write corner information
        self._dom.github.attr('href', aboutinfo.productwebsite);
        self._dom.github.attr('aria-label', lang.footer_github);

        // Write footer
        let $langid = generateID();
        let $githubid = generateID();
        let $authorid = generateID();

        // noinspection HtmlUnknownTarget
        self._dom.footer.html('<div class="menu-footer-item menu-footer-item-author" id="{5}">{0}: <a href="{2}" target="_blank">@{1}</a></div><div class="menu-footer-item menu-footer-item-other"><a href="{4}" target="_blank" id="{6}"><i class="fab fa-github"></i></a></div><div class="menu-footer-item menu-footer-item-version">v{3}</div><div class="menu-footer-lang-selector menu-container-width" id="{7}"></div>'.format(lang.author_text, aboutinfo.author.tag, aboutinfo.author.website, aboutinfo.v.version, aboutinfo.productwebsite, $authorid, $githubid, $langid));

        // Write langs
        let langcontainer = $('#' + $langid);
        self._write_lang(langcontainer, 'en', lang.lang_en);
        self._write_lang(langcontainer, 'es', lang.lang_es);
        self._write_lang(langcontainer, 'br', lang.lang_br);
        self._write_lang(langcontainer, 'fr', lang.lang_fr);
        self._write_lang(langcontainer, 'it', lang.lang_it);
        self._write_lang(langcontainer, 'de', lang.lang_de);
        self._write_lang(langcontainer, 'ru', lang.lang_ru);

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
     * @param {boolean=} disable_fade - Disable fade effect
     */
    this.main_menu = function (disable_fade) {

        // Reset menu
        self.reset_menu();
        app_console.info(lang.load_menu);
        // app_dom.body.css('overflow', 'auto');

        // Open menu
        if (disable_fade) {
            self._dom.container.show();
            self._dom.github.show();
        } else {
            self._dom.container.fadeIn();
            self._dom.github.fadeIn();
            // app_sound.play(app_sound.sound.MENU);
        }

        // Create events
        app_dom.window.on('resize.menucontainer', self._set_content_height);

        // Write buttons
        let $buttons = generateID();
        self._dom.content.html('<div id="{0}" class="main-button-container"></div>'.format($buttons));
        let $btncontainer = $('#' + $buttons);
        self._add_button(lang.menu_new_game, null, $btncontainer, self._menu_new);
        self._add_button(lang.menu_how_to_play, null, $btncontainer, self._menu_htp);
        self._add_button(lang.menu_controls, null, $btncontainer, self._menu_controls);
        self._add_button(lang.menu_statistics, null, $btncontainer, self._menu_stats);
        self._add_button(lang.menu_about, null, $btncontainer, self._menu_about);
        self._dom.footer.find('.menu-footer-lang-selector').show();

        // Apply rippler effect
        self._apply_rippler();

        // Set height
        self._set_content_height();

        // Delete animation of main icon
        setTimeout(function () {
            $('.menu-header-icon').removeClass('slideInDown');
            $('.menu-header-title').removeClass('fadeIn');
        }, 2500);

    };

    /**
     * Set content height.
     *
     * @function
     * @private
     */
    this._set_content_height = function () {
        self._dom.content.css('height', self._get_content_height());
        setTimeout(function () {
            self._dom.content.css('height', self._get_content_height());
        }, 150);
    };

    /**
     * Get value from cookie.
     *
     * @function
     * @param {string} id
     * @param {number} min
     * @param {number} max
     * @param {number} other
     * @param {boolean} force_int
     * @returns {number}
     * @private
     */
    this._get_cookie_val = function (id, min, max, other, force_int) {
        let $val = sessionCookie[id];
        if (is_null_undf($val)) return other;
        $val = parseFloat($val);
        if (isNaN($val)) return other;
        $val = Math.max(min, Math.min(max, $val));
        if (force_int) $val = parseInt($val, 10);
        return $val;
    };

    /**
     * Get string from cookie.
     *
     * @function
     * @param {string} id
     * @param {string} other
     * @returns {string}
     * @private
     */
    this._get_cookie_string = function (id, other) {
        let $val = sessionCookie[id];
        if (is_null_undf($val)) return other;
        return $val;
    };

    /**
     * Store cookie value, null values are not stored.
     *
     * @function
     * @param {string} id
     * @param {number | null} value
     * @private
     */
    this._save_cookie_val = function (id, value) {
        if (is_null_undf(value)) return;
        sessionCookie[id] = value;
        update_session_cookie();
    };

    /**
     * Wipe content.
     *
     * @function
     * @private
     */
    this._wipe_content = function () {
        self._dom.content.empty();
        self._dom.content.css('display', 'block');
        self._dom.footer.find('.menu-footer-lang-selector').hide();
    };

    /**
     * Wait for libraries.
     *
     * @function
     * @returns {boolean}
     * @private
     */
    this._wait_libraries = function () {
        if (app_library_manager.is_all_loaded_libraries()) return false;
        app_dialog.confirm(lang.loading_libraries_title, lang.loading_libraries_content, {
            cancelText: null,
            confirmButtonClass: app_dialog.options.buttons.BLUE,
            confirmText: lang.answer_ok,
            icon: 'fa fa-spinner fa-spin fa-fw',
            size: app_dialog.options.size.SMALL,
        });
        return true;
    };

    /**
     * Create new game menu.
     *
     * @function
     * @private
     */
    this._menu_new = function () {

        // Check libraries
        if (self._wait_libraries()) return;

        // Wipe content
        self._wipe_content();

        // Write generator selector
        self._write_menuback(lang.menu_new_game);

        // Write generator selector
        let $selector = generateID();
        self._write_input(lang.new_game_generator, '<select id="{0}"></select>'.format($selector));
        self._dom.gen_selector = $('#' + $selector);
        self._dom.gen_selector.append('<option value="-1" disabled>{0}</option>'.format(lang.new_game_generator_select));
        for (let i = 0; i < self._gamekeys.length; i += 1) {
            if (self._games[self._gamekeys[i]].enabled) {
                self._dom.gen_selector.append('<option value="{0}">{1}</option>'.format(self._gamekeys[i], lang['gen_' + self._gamekeys[i].toString()]));
            }
        }
        self._dom.gen_selector[0].selectedIndex = self._get_cookie_val(self._cookies.gen, 0, self._gamekeys.length, 0, true);
        self._dom.gen_selector.niceSelect();
        self._dom.gen_selector.on('change', function (e) {
            self._load_generator_options(e.target.value);
            self._save_cookie_val(self._cookies.gen, self._dom.gen_selector[0].selectedIndex);
        });

        // If selected then apply
        if (self._dom.gen_selector[0].selectedIndex !== 0) {
            setTimeout(function () {
                self._dom.gen_selector.trigger('change');
            }, 250);
        }

        // Create container
        let $gencontainer = generateID();
        self._dom.content.append('<div class="menu-generator-options" id="{0}"></div>'.format($gencontainer));
        self._dom.generator = $('#' + $gencontainer);

        // Add play button
        self._dom.playbutton = self._add_button(lang.new_game_start, 'btn-primary', null, self._play);
        self._dom.playbutton.attr('disabled', 'disabled');

        // Apply button effect
        self._set_content_height();
        self._apply_rippler();
        self._dom.gen_selector.niceSelect('update');

    };

    /**
     * Load generator options.
     *
     * @function
     * @param {string} option
     * @private
     */
    this._load_generator_options = function (option) {

        // Empty generator
        self._dom.generator.empty();
        self._dom.generator.removeClass('animated');
        self._dom.generator.removeClass('bounceInUp');
        // self._dom.generator.hide();

        // Get object
        let game = self._games[option];
        if (is_null_undf(game)) return;

        // Write options
        let $id, $id2;

        // Fractal order
        if (game.fractal) {
            $id = generateID();
            self._write_input(lang.new_game_order, '<select id="{0}"></select>'.format($id), self._dom.generator);
            self._dom.gen_order = $('#' + $id);
            for (let i = game.minorder; i <= game.maxorder; i += 1) {
                self._dom.gen_order.append('<option value="{0}">{1}</option>'.format(i, i));
            }
            self._dom.gen_order[0].selectedIndex = this._get_cookie_val(self._cookies.order, 0, game.maxorder - game.minorder, game.maxorder - game.minorder, true);
            self._dom.gen_order.niceSelect();
            // self._dom.gen_order.select2();
        }

        // Face target
        if (game.target) {
            $id = generateID();

            /*
            let $inc, j;
            self._write_input(lang.new_game_target_face, '<select id="{0}"></select>'.format($id), self._dom.generator);
            self._dom.gen_target = $('#' + $id);
            $inc = Math.floor((game.max - game.min) / game.step);
            j = game.min;
            for (let i = 0; i <= $inc; i += 1) {
                self._dom.gen_target.append('<option value="{0}">{1}</option>'.format(j, j));
                j += game.inc;
            }
            self._dom.gen_target[0].selectedIndex = 0;
            self._dom.gen_target.niceSelect();
            */

            self._write_input(lang.new_game_target_face, '<input id="{0}" />'.format($id), self._dom.generator);
            self._dom.gen_target = $('#' + $id);
            self._dom.gen_target.ionRangeSlider({
                from: self._get_cookie_val(self._cookies.target, game.min, game.max, game.from, true),
                max: game.max,
                min: game.min,
                skin: 'round',
                step: game.step,
            });
        }

        // Latitude/longitude
        if (game.latlng) {
            $id = generateID();
            $id2 = generateID();
            self._write_input(lang.new_game_latlng, '<div class="menu-generator-latlng"><input id="{0}" /><div class="menu-generator-latlng-sep"></div><input id="{1}" /></div>'.format($id, $id2), self._dom.generator);
            self._dom.gen_lat = $('#' + $id);
            self._dom.gen_lng = $('#' + $id2);

            // Get from lat/lng
            let $fromlat, $fromlng;
            if (game.from instanceof Array && game.from.length === 2) {
                $fromlat = game.from[0];
                $fromlng = game.from[1];
            } else {
                $fromlat = game.from;
                $fromlng = game.from;
            }

            // Get max lat/lng
            let $maxlat, $maxlng;
            if (game.max instanceof Array && game.max.length === 2) {
                $maxlat = game.max[0];
                $maxlng = game.max[1];
            } else {
                $maxlat = game.max;
                $maxlng = game.max;
            }

            // Get min lat/lng
            let $minlat, $minlng;
            if (game.min instanceof Array && game.min.length === 2) {
                $minlat = game.min[0];
                $minlng = game.min[1];
            } else {
                $minlat = game.min;
                $minlng = game.min;
            }

            // Get step lat/lng
            let $steplat, $steplng;
            if (game.step instanceof Array && game.step.length === 2) {
                $steplat = game.step[0];
                $steplng = game.step[1];
            } else {
                $steplat = game.step;
                $steplng = game.step;
            }

            // Write sliders
            self._dom.gen_lat.ionRangeSlider({
                from: self._get_cookie_val(self._cookies.lat, $minlat, $maxlat, $fromlat, true),
                max: $maxlat,
                min: $minlat,
                skin: 'round',
                step: $steplat,
            });
            if (!game.lateq) {
                self._dom.gen_lng.ionRangeSlider({
                    from: self._get_cookie_val(self._cookies.lng, $minlng, $maxlng, $fromlng, true),
                    max: $maxlng,
                    min: $minlng,
                    skin: 'round',
                    step: $steplng,
                });
            } else {
                self._dom.gen_lng.remove();
                self._dom.generator.find('.menu-generator-latlng-sep').remove(); // Hide separator
            }
        }

        // Function
        if (game.fun) {
            app_library_manager.import_async_library(app_library_manager.lib.MATHPARSER);
            $id = generateID();
            let $functionpicker = generateID();
            self._write_input('z=f(x,y)', '<input type="text" class="form-control function-input" id="{0}" minlength="3" maxlength="200" value="{2}" required aria-required="true" placeholder="{1}" aria-placeholder="{1}"><button class="btn function-button" id="{3}">{4}</button>'.format($id, lang.new_game_function_placeholder, self._get_cookie_string(self._cookies.fun, '0.1*sin(1.2*sqrt((10*x)^2+(10*y)^2))'), $functionpicker, lang.new_game_function_button), self._dom.generator);
            self._dom.gen_fun = $('#' + $id);
            self._dom.gen_fun.on('change', function () {
                self._check_function_popup($(this).val());
            });

            // Create function select
            $('#' + $functionpicker).on('click', function () {
                app_library_manager.import_async_library(app_library_manager.lib.SELECT2, function () {

                    let $fun_examples = [
                        ['Bumps', 'sin(5*x)*cos(5*y)/5'],
                        ['Cone', '(x^2+y^2)^0.5'],
                        ['Cross', '0.1-sign(sign((x*12)^2-9)-1+sign((y*12)^2-9)-1)/2'],
                        ['Hills', '0.2*(3*exp(-(y+1)^2-x^2)*(x-1)^2-(-(x+1)^2-y^2)/3+exp(-x^2-y^2)*(10*x^3-2*x+10*y^5))'],
                        ['Intersecting fences', '0.75/exp((x*5)^2*(y*5)^2)'],
                        ['Letter A', '((1-sign(-x-0.9+abs(y*2)))/3*(sign(0.9-x)+1)/3)*(sign(x+0.65)+1)/2-((1-sign(-x-0.39+abs(y*2)))/3*(sign(0.9-x)+1)/3)+((1-sign(-x-0.39+abs(y*2)))/3*(sign(0.6-x)+1)/3)*(sign(x-0.35)+1)/2'],
                        ['Letter O', '(-sign(0.2-(x^2+y^2))+sign(0.2-(x^2/3+y^2/3)))/9'],
                        ['Letter V', 'sign(x-1+abs(y*2))/3+sign(x-0.5+abs(y*2))/3'],
                        ['Paper plane', 'sign(x)*atan(x*80)/6*sign(-y-x+1)*sign(-y+x+1)-1.01'],
                        ['Propeller', '(x^(-2)+y^(-2))^0.5'],
                        ['Pyramid', '1-abs(x+y)-abs(y-x)'],
                        ['Random Hill', '(random()^0.1)*(1/(x^2+y^2+0.05))'],
                        ['Ripple', 'sin(10*(x^2+y^2))/10'],
                        ['Roof', '1-abs(y)'],
                        ['Saddle', 'x^2-y^2'],
                        ['Stairs', '(sign(-0.65-x)+sign(-0.35-x)+sign(-0.05-x)+sign(0.25-x)+sign(0.55-x))/7'],
                        ['Top hat', '(sign(0.2-(x^2+y^2))+sign(0.2-(x^2/3+y^2/3)))/3-1'],
                        ['Triangle', '(1-sign(-x-0.51+abs(y*2)))/3*(sign(0.5-x)+1)/3'],
                        ['Windmill', 'sign(x*y)*sign(1-(x*9)^2+(y*9)^2)/9'],
                    ];
                    let $fun_selector = generateID();

                    app_dialog.form(lang.new_game_function_examples_title, '<form action="" class="formName"><select id="{0}" class="form-control"><option value="-1" disabled selected>{1}</option></select></form>'.format($fun_selector, lang.new_game_function_select_drop),
                        function () {
                            self._dom.gen_fun.val($('#' + $fun_selector).val());
                        }, null
                        , {
                            cancelText: lang.dialog_form_cancel,
                            icon: 'fas fa-superscript',

                            // Triggered before opening
                            onOpenBefore: function () {
                                let $sel = $('#' + $fun_selector); // Get selector
                                for (let i = 0; i < $fun_examples.length; i += 1) { // Append options
                                    $sel.append('<option value="{0}">{1}</option>'.format($fun_examples[i][1], $fun_examples[i][0]));
                                }
                                $('.jconfirm-content').css('overflow', 'hidden');
                                $sel.select2({
                                    // dropdownAutoWidth: true,
                                    dropdownParent: $('.jconfirm'),
                                    selectOnClose: true,
                                });
                            },

                            size: app_dialog.options.size.SMALL,
                            submitText: lang.dialog_form_send,
                        }
                    );

                });
            });
        }

        // Item
        if (game.item) {
            app_library_manager.import_async_library(app_library_manager.lib.SELECT2, function () {

                // Create selector
                let $itemid = generateID();
                let $iteminput = self._write_input(lang.new_game_gen_item, '<select id="{0}"><option value="-1" disabled selected>{1}</option></select>'.format($itemid, lang.new_game_gen_select_item), self._dom.generator);
                self._dom.gen_item = $('#' + $itemid);

                // Write content to selector
                if (option === '13') { // Polyhedra
                    let $polyhedrak = Object.keys(POLYHEDRA);
                    for (let i = 0; i < $polyhedrak.length; i += 1) {
                        self._dom.gen_item.append('<option value="{0}">{1}</option>'.format($polyhedrak[i], POLYHEDRA[$polyhedrak[i]].name));
                    }
                    self._dom.gen_item.select2({
                        containerCssClass: 'menu-input-select2',
                        selectOnClose: true,
                    });
                }
                // Invalid generator
                else {
                    self._dom.gen_item = null;
                    $iteminput.remove();
                }

            });
        }

        // Write mines
        $id = generateID();
        self._write_input(lang.new_game_mines, '<input id="{0}" />'.format($id), self._dom.generator);
        // noinspection JSJQueryEfficiency
        self._dom.gen_mines = $('#' + $id);
        self._dom.gen_mines.ionRangeSlider({
            from: self._get_cookie_val(self._cookies.mines, self._mines.min, self._mines.max, self._mines.from, true),
            max: self._mines.max,
            min: self._mines.min,
            skin: 'round',
            step: self._mines.step,
        });

        // Add animation
        self._dom.generator.addClass('animated');
        // self._dom.generator.fadeIn();

        // Enable button
        self._dom.playbutton.removeAttr('disabled');

        // Others
        self._set_content_height();
        self._dom.gen_selector.niceSelect('update');

    };

    /**
     * Create new game.
     *
     * @function
     * @private
     */
    this._play = function () {

        // Load game
        let $gen = self._dom.gen_selector.val();
        $gen = parseInt($gen, 10);

        // Check generator
        if (!self._gamekeys.includes($gen)) return;
        let game = self._games[$gen];
        if (is_null_undf(game)) return;

        // Load options
        let $fun = '';
        let $item = null;
        let $lat = null;
        let $lng = null;
        let $order = null;
        let $target = null;

        // Number of mines
        let $mines;

        if (game.fractal) {
            $order = self._dom.gen_order.val();
            if (is_null_undf($order)) return;
            $order = parseInt($order, 10);
            self._save_cookie_val(self._cookies.order, self._dom.gen_order[0].selectedIndex);
        }
        if (game.target) {
            $target = self._dom.gen_target.val();
            if (is_null_undf($target)) return;
            $target = parseInt($target, 10);
            self._save_cookie_val(self._cookies.target, $target);
        }
        if (game.latlng) {
            $lat = self._dom.gen_lat.val();
            if (!game.lateq) {
                $lng = self._dom.gen_lng.val();
            } else {
                $lng = $lat;
            }
            if (is_null_undf($lat) || is_null_undf($lng)) return;
            $lat = parseInt($lat, 10);
            $lng = parseInt($lng, 10);
            self._save_cookie_val(self._cookies.lat, $lat);
            self._save_cookie_val(self._cookies.lng, $lng);
        }
        if (game.fun) {
            $fun = self._dom.gen_fun.val();
            self._save_cookie_val(self._cookies.fun, $fun);
            if (!self._check_function_popup($fun) || $fun.length < 3 || $fun.length > 200) return;
            self._save_cookie_val(self._cookies.fun, $fun);
        }
        if (game.item && not_null_undf(self._dom.gen_item)) {
            $item = self._dom.gen_item.val();
            if (is_null_undf($item) || $item === '-1') return;
        }
        $mines = self._dom.gen_mines.val();
        if (is_null_undf($mines)) return;
        $mines = parseInt($mines, 10);
        if ($mines < 0 || $mines > 100) return;

        // Save to cookies
        self._save_cookie_val(self._cookies.mines, $mines);

        // Init new game
        self.reset_menu();
        app_tms.set_generator($gen, $order, $target, $lat, $lng, $fun, $item);
        app_tms.set_mines($mines * 0.01);
        app_tms.new();

    };

    /**
     * Create menu how to play.
     *
     * @function
     * @private
     */
    this._menu_htp = function () {

        // Check libraries
        if (self._wait_libraries()) return;

        // Wipe content
        self._wipe_content();
        self._write_menuback(lang.menu_how_to_play);

        // Write help info
        self._add_title(lang.help_quick_start);
        self._write_text(lang.help_p1);
        self._write_text(lang.help_p2);
        self._write_text(lang.help_p3);

        self._add_title(lang.help_detailed_instructions);
        self._write_list_item(lang.help_p4);
        self._write_list_item(lang.help_p5);
        self._write_list_item(lang.help_p6);
        self._write_list_item(lang.help_p7);
        self._write_list_item(lang.help_p8);
        self._write_list_item(lang.help_p9);

        // Apply button effect
        self._set_content_height();
        self._apply_rippler();

    };

    /**
     * Controls menu.
     *
     * @function
     * @private
     */
    this._menu_controls = function () {

        // Check libraries
        if (self._wait_libraries()) return;

        // Wipe content
        self._wipe_content();
        self._write_menuback(lang.menu_controls);

        self._write_htp_entry(['Keyboard_White_Mouse_Left'], lang.help_controls_click_faces);
        self._write_htp_entry(['Keyboard_White_Mouse_Left|shake-lr'], lang.help_controls_click_hold_left);
        self._write_htp_entry(['Keyboard_White_Mouse_Left|shake-lr', '+', 'Keyboard_White_Ctrl'], lang.help_controls_click_rotate_center);
        self._write_htp_entry(['Keyboard_White_Mouse_Middle'], lang.help_controls_zoom);
        self._write_htp_entry(['Keyboard_White_Mouse_Right'], lang.help_controls_click_right);
        self._write_htp_entry(['Keyboard_White_Mouse_Right|shake-lr'], lang.help_controls_click_hold_right);
        self._write_htp_entry(['Keyboard_White_Arrow_Up', 'Keyboard_White_Arrow_Left', 'Keyboard_White_Arrow_Down', 'Keyboard_White_Arrow_Right'], lang.help_controls_rotate);
        self._write_htp_entry(['Keyboard_White_W', 'Keyboard_White_A', 'Keyboard_White_S', 'Keyboard_White_D'], lang.help_controls_move);
        self._write_htp_entry(['Keyboard_White_I', 'Keyboard_White_J', 'Keyboard_White_K', 'Keyboard_White_L'], lang.help_controls_move);
        self._write_htp_entry(['Keyboard_White_E', 'Keyboard_White_Space'], lang.help_controls_move_up);
        self._write_htp_entry(['Keyboard_White_Q', 'Keyboard_White_Shift'], lang.help_controls_move_down);
        self._write_htp_entry(['Keyboard_White_R'], lang.help_controls_camera_reset);

        // Apply button effect
        self._set_content_height();
        self._apply_rippler();

    };

    /**
     * Write how to play entry line.
     *
     * @function
     * @param {string[]} keys
     * @param {string} text
     * @private
     */
    this._write_htp_entry = function (keys, text) {
        let $keys = '';
        let $key;
        for (let i = 0; i < keys.length; i += 1) {
            if (keys[i] === '+') {
                $keys += '<i class="fas fa-plus"></i>';
                continue;
            }
            $key = keys[i].split('|');
            if ($key.length === 1) {
                // noinspection HtmlUnknownTarget
                $keys += '<img src="resources/keys/{0}.png" class="hvr-grow" alt="" />'.format(keys[i]);
            } else {
                // noinspection HtmlUnknownTarget
                $keys += '<img src="resources/keys/{0}.png" class="hvr-grow {1}" alt="" />'.format($key[0].replaceAll(',', ' '), $key[1]);
            }
        }
        self._dom.content.append('<div class="menu-htp-entry-line"><div class="menu-htp-keys">{0}</div><div class="menu-htp-text">{1}</div></div>'.format($keys, text));
    };

    /**
     * Stats menu.
     *
     * @function
     * @private
     */
    this._menu_stats = function () {
        if (self._wait_libraries()) return;
        loadingHandler(true);
        app_library_manager.import_async_library([app_library_manager.lib.CHARTJS, app_library_manager.lib.JQVMAP], self._load_stats);
    };

    /**
     * Check if string is a math function.
     *
     * @function
     * @param {string} fun
     * @returns {boolean}
     * @private
     */
    this._check_if_function = function (fun) {
        try {
            // noinspection JSUnresolvedFunction
            let $f = Parser.parse(fun.toLowerCase()).toJSFunction(['x', 'y']);
            return (!isNaN(parseFloat($f(343.343, 123.457))));
        } catch ($e) {
        } finally {
        }
        return false;
    };

    /**
     * Check function, if invalid throws popup.
     *
     * @function
     * @param {string} fun
     * @returns {boolean}
     * @private
     */
    this._check_function_popup = function (fun) {
        if (!this._check_if_function(fun)) {
            app_dialog.confirm(lang.error_message, lang.new_game_function_bad.format('<i style="background-color: #f6f6f6;">{0}</i>'.format(fun.replace(/<(?:.|\n)*?>/gm, ''))), { // lgtm [js/incomplete-multi-character-sanitization]
                cancelText: null,
                confirmButtonClass: app_dialog.options.buttons.DANGER,
                confirmText: lang.answer_ok,
                icon: 'fas fa-exclamation-triangle',
            });
            return false;
        }
        return true;
    };

    /**
     * Load stats from server.
     *
     * @function
     * @private
     */
    this._load_stats = function () {

        // noinspection JSUnresolvedFunction,JSCheckFunctionSignatures
        /**
         * Create query
         * @type {JQuery.jqXHR}
         */
        let $query = $.ajax({
            crossOrigin: cfg_ajax_cors,
            data: 'm=stats',
            timeout: cfg_href_ajax_timeout,
            type: 'get',
            url: cfg_href_score,
        });

        /**
         * Query done
         */
        $query.done(function (response) {
            try {
                let $data = JSON.parse(response);
                if (Object.keys($data).indexOf('error') === -1 && $data[0]['sid'] === '1') {
                    self._write_stats_menu($data);
                    return;
                }
            } catch ($e) {
                app_console.exception($e);
            } finally {
            }
            NotificationJS.error(lang.stats_error);
            app_console.error(response);
            loadingHandler(false);
        });

        // noinspection JSUnusedLocalSymbols
        /**
         * Fail connection
         */
        $query.fail(function (response, textStatus, jqXHR) {
            NotificationJS.error(lang.stats_error);
            loadingHandler(false);
        });

    };

    /**
     * Write statistics menu.
     *
     * @function
     * @param {Object} stats - Downloaded stats
     * @private
     */
    this._write_stats_menu = function (stats) {

        // Wipe content
        self._wipe_content();
        self._write_menuback(lang.menu_statistics);

        // Write main data
        let $stat_keys = Object.keys(stats);
        self._add_title(lang.menu_stats_general_info);
        self._write_stats_line(lang.menu_stats_total_games, stats[0]['n'], true);
        self._write_stats_line(lang.menu_stats_total_scoreboard, stats[0]['sc'], true);

        // Get all data by country
        let country_scoreboard = {};
        let $stat, $country, $sc;
        for (let i = 0; i < $stat_keys.length; i += 1) {
            $stat = stats[$stat_keys[i]];
            $country = $stat['c'];
            if ($country !== '' && $country !== 'none') {
                $sc = parseInt($stat['sc'], 10);
                if (!isNaN($sc)) country_scoreboard[$country] = $sc;
            }
        }

        // Write map
        app_dom.body.find('.jqvmap-label').remove();
        self._add_title(lang.menu_stats_scoreboard_distribution);
        let $mapid = generateID();
        self._write_text('<div id="{0}" class="menu-stats-map"></div>'.format($mapid));
        $('#' + $mapid).vectorMap({
            color: '#ffffff',
            enableZoom: true,
            hoverOpacity: 0.7,
            map: 'world_en',
            normalizeFunction: 'polynomial',
            scaleColors: ['#C8EEFF', '#006491'],
            selectedColor: '#666666',
            showTooltip: true,
            values: country_scoreboard,
            onLabelShow: function (event, label, code) {
                if (is_null_undf(country_scoreboard[code])) return;
                label.append(': {0}'.format(country_scoreboard[code]));
            },
        });

        // Generator distribution
        let generator_colors = [];
        let generator_names = [];
        let generator_sc = [];
        let generator_games = [];
        let $gen;
        for (let i = 0; i < $stat_keys.length; i += 1) {
            $stat = stats[$stat_keys[i]];
            $gen = $stat['g'];
            if ($gen !== '' && $gen !== '0' && not_null_undf(lang['gen_{0}'.format($gen)])) {
                $gen = parseInt($gen, 10);
                if (isNaN($gen)) continue;
                generator_names.push(lang['gen_{0}'.format($gen)]);
                generator_sc.push(parseInt($stat['sc'], 10));
                generator_games.push(parseInt($stat['n'], 10));
                generator_colors.push(get_random_color());
            }
        }

        let $gen_game = generateID(); // Generator total games
        let $gen_sc = generateID(); // Generator scoreboard
        self._add_title(lang.menu_stats_distribution_generator);
        self._write_text('<div class="menu-stat-chart"><canvas id="{0}"></canvas></div><div style="width: 2%"></div><div class="menu-stat-chart"><canvas id="{1}"></canvas></div>'.format($gen_game, $gen_sc));

        // eslint-disable-next-line no-new
        new Chart($('#' + $gen_game), {
                type: 'pie',
                data: {
                    datasets: [
                        {
                            data: generator_games,
                            backgroundColor: generator_colors
                        }
                    ],
                    labels: generator_names
                },
                options: {
                    legend: {
                        position: 'right',
                    },
                    responsive: true,
                    title: {
                        display: true,
                        fontSize: 14,
                        text: lang.stat_chart_games
                    },
                },
            }
        );

        // eslint-disable-next-line no-new
        new Chart($('#' + $gen_sc), {
                type: 'pie',
                data: {
                    datasets: [
                        {
                            data: generator_sc,
                            backgroundColor: generator_colors
                        }
                    ],
                    labels: generator_names
                },
                options: {
                    legend: {
                        position: 'right',
                    },
                    responsive: true,
                    title: {
                        display: true,
                        fontSize: 14,
                        text: lang.stat_chart_scoreboard
                    },
                },
            }
        );

        // Apply button effect
        self._set_content_height();
        self._apply_rippler();
        loadingHandler(false);

    };

    /**
     * Write text.
     *
     * @function
     * @param {string} text
     * @param {number=} padleft
     * @param {number=} font_weight
     * @private
     */
    this._write_text = function (text, padleft, font_weight) {
        if (is_null_undf(padleft)) padleft = 0;
        let $fontweight = '';
        if (not_null_undf(font_weight)) $fontweight = 'font-weight: {0};'.format(font_weight);
        // noinspection CssUnitlessNumber
        self._dom.content.append('<div class="menu-text" style="padding-left: {1}rem;{2}">{0}</div>'.format(text.replaceAll('\n', '<br />'), padleft, $fontweight));
    };

    /**
     * Write item list.
     *
     * @function
     * @param {string} text
     * @private
     */
    this._write_list_item = function (text) {
        self._dom.content.append('<div class="menu-text menu-list-item">{0}</div>'.format(text));
    };

    /**
     * Add title to menu.
     *
     * @function
     * @param {string} title
     * @private
     */
    this._add_title = function (title) {
        self._dom.content.append('<div class="menu-title">{0}</div>'.format(title));
    };

    /**
     * About menu.
     *
     * @function
     * @private
     */
    this._menu_about = function () {

        // Check libraries
        if (self._wait_libraries()) return;

        // Wipe content
        self._wipe_content();
        self._write_menuback(lang.menu_about);

        self._add_title(aboutinfo.productname);
        // noinspection HtmlUnknownTarget
        self._write_about_line(lang.author_text, '{0} <a href="{1}" target="_blank">@{2}</a>'.format(aboutinfo.author.name, aboutinfo.author.website, aboutinfo.author.tag));
        self._write_about_line(lang.about_version, '{0} ({1})'.format(aboutinfo.v.version, date_format(new Date(aboutinfo.v.date), cfg_date_format_public_d)));

        // Write license
        self._write_about_line(lang.about_license, 'MIT');
        self._write_text("Copyright (c) 2019 Pablo Pizarro R.\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the \"Software\"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.", 2);

        if (aboutinfo.author.contributors.length > 0) {
            self._write_about_line(lang.about_thanks_to, aboutinfo.author.contributors.join(', '));
        }

        // noinspection HtmlUnknownTarget
        self._write_about_line(lang.about_source_code, '<a href="{0}" target="_blank">{0}</a>'.format(aboutinfo.productwebsite));

        // Apply button effect
        self._set_content_height();
        self._apply_rippler();

    };

    /**
     * Write about line.
     *
     * @function
     * @param {string} title
     * @param {string} content
     * @param {boolean=} center
     * @private
     */
    this._write_about_line = function (title, content, center) {
        self._dom.content.append('<div class="menu-about" style="{2}"><span class="menu-about-title">{0}:</span>{1}</div>'.format(title, content, center ? 'text-align:center;' : ''));
    };

    /**
     * Write stats line.
     *
     * @function
     * @param {string} title
     * @param {string} content
     * @param {boolean=} center
     * @private
     */
    this._write_stats_line = function (title, content, center) {
        self._dom.content.append('<div class="menu-stat" style="{2}"><span class="menu-stat-title">{0}:</span>{1}</div>'.format(title, content, center ? 'text-align:center;' : ''));
    };

    /**
     * Write input on content.
     *
     * @function
     * @param {string | HTMLElement} label
     * @param {string | HTMLElement} selector
     * @param {JQuery<HTMLElement> | jQuery | HTMLElement=} container
     * @returns {JQuery<HTMLElement> | jQuery | HTMLElement}
     * @private
     */
    this._write_input = function (label, selector, container) {
        if (is_null_undf(container)) container = self._dom.content;
        let $id = generateID();
        container.append('<div class="menu-content-input" id="{2}"><div class="menu-content-input-child menu-content-input-label ">{0}</div><div class="menu-content-input-child menu-content-input-content">{1}</div></div>'.format(label, selector, $id));
        return $('#' + $id);
    };

    /**
     * Write menu back and a title.
     *
     * @function
     * @param {string} title
     * @private
     */
    this._write_menuback = function (title) {
        let $btn = generateID();
        self._dom.subheader.empty();
        self._dom.subheader.html('<div class="menu-subheader-container"><div class="menu-menuback-button"><button type="button" class="btn hvr-shadow rippler rippler-inverse animated fadeInLeft" id="{1}"><i class="fas fa-arrow-left"></i></button></div><div class="menu-menuback-title">{0}</div></div>'.format(title, $btn));
        $btn = $('#' + $btn);
        self._dom.subheader.show();
        $btn.tooltipster({
            content: lang.back_to_menu,
            contentAsHTML: false,
            delay: [1200, 200],
            side: 'bottom',
            theme: theme.tooltipTheme,
        });
        $btn.on('click', function () {
            app_sound.play(app_sound.sound.BUTTON);
            self.main_menu(true);
        });
        self._set_content_height();
    };

    /**
     * Adds button.
     *
     * @function
     * @param {string} text
     * @param {string | null} theme
     * @param {JQuery<HTMLElement> | jQuery | HTMLElement | null} container
     * @param {function=} callback
     * @returns {JQuery<HTMLElement> | jQuery | HTMLElement}
     * @private
     */
    this._add_button = function (text, theme, container, callback) {
        if (is_null_undf(callback)) {
            callback = function () {
            };
        }
        let $callback = function () {
            app_sound.play(app_sound.sound.BUTTON);
            callback();
        };
        if (is_null_undf(theme)) theme = 'btn-default';
        if (is_null_undf(container)) container = self._dom.content;
        let $id = generateID();
        container.append('<div class="menu-main-button"><button type="button" class="btn {2} rippler rippler-inverse hvr-shadow" id="{0}">{1}</button></div>'.format($id, text, theme));
        let btn = $('#' + $id);
        btn.on('click', $callback);
        return btn;
    };

    /**
     * Apply rippler buttons effect.
     *
     * @function
     * @private
     */
    this._apply_rippler = function () {
        if (!self._rippler) return;
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
        return self._dom.container.innerHeight() - self._dom.header.innerHeight() - self._dom.subheader.innerHeight() - get_element_height(self._dom.footer) - 15;
    };

    /**
     * Reset menu.
     *
     * @function
     */
    this.reset_menu = function () {

        // Hide menu
        self._dom.container.hide();
        self._dom.subheader.empty();
        self._dom.subheader.hide();
        self._dom.github.hide();

        // Destroy events
        app_dom.window.off('resize.menucontainer');

        // Delete content
        self._dom.content.empty();
        self._dom.content.css('display', 'inline-table');
        app_console.info(lang.reset_menu);

    };

    /**
     * Load language.
     *
     * @function
     * @param {string} $lang
     * @private
     */
    this._load_lang = function ($lang) {

        // Invalid lang
        if (sessionCookie.lang === $lang) return;
        if (!lang_available.includes($lang)) return;

        // Apply language
        app_sound.play(app_sound.sound.BUTTON);
        sessionCookie.lang = $lang;
        update_session_cookie();
        app_console.info(lang.load_lang.format($lang));

        // Load lang from server and reload menu
        app_library_manager.import_async_library(app_library_manager.lib.__LANG__, function () {
            check_language();
            lang = lang_db[$lang];
            self.init_menu();
            self.main_menu(true);
        }, true);

    };

}