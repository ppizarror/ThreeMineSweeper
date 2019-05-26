/**
 MINESWEEPER
 Creates minesweeper game from volume.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Minesweeper implementation.
 *
 * @class
 * @constructor
 */
function Minesweeper() {
    /* eslint-disable arrow-parens */
    /* eslint-disable new-cap */
    /* eslint-disable no-continue */
    /* eslint-disable no-extra-parens */

    /**
     * Stores volume reference.
     * @type {Volume}
     * @private
     */
    this._volume = null;

    /**
     * Stores last click
     * @type {{id: string, time: Date}}
     * @private
     */
    this._last_click = {
        id: '',
        time: new Date(),
    };

    /**
     * Game over.
     * @type {boolean}
     * @private
     */
    this._gameover = false;

    /**
     * Game status.
     * @type {{total: number, played: number}}
     * @private
     */
    this._game_status = {
        flags: 0,
        mines: 0,
        played: 0,
        questions: 0,
        total: 0,
    };

    /**
     * Timer.
     * @private
     */
    this._timer = {
        dom: $('#game-time-counter'),
        init: null,
        timer: new easytimer.Timer(),
    };

    /**
     * Stores ui objects.
     * @private
     */
    this._dom = {
        facecount: $('#game-ui-face-counter'),
        flagcount: $('#game-ui-flag-counter'),
        menubutton: $('#game-ui-button-menu'),
        minecount: $('#game-ui-mine-counter'),
        questioncount: $('#game-ui-question-counter'),
        resetbutton: $('#game-ui-button-reset'),
        scoreboard_container: $('#game-scoreboard-container'),
        scoreboard_content: $('#game-scoreboard-content'),
        scoreboard_header: $('#game-scoreboard-header'),
        scoreboard_name: $('#game-scoreboard-name'),
        scoreboard_title: $('#game-scoreboard-title'),
        viewer: $('#viewer'),
    };

    /**
     * User information.
     * @private
     */
    this._user = {
        location: '',
        name: '',
        time: 0,
    };

    /**
     * Generator properties.
     * @private
     */
    this._generator = {
        id: '',
        mines: 0,
        name: '',
        type_id: 0,
    };

    /**
     * Check for min window size, display dialog if false.
     * @type {{width: number, opened: boolean, enabled: boolean, height: number}}
     * @private
     */
    this._check_size = {
        enabled: true,
        height: 520,
        opened: false,
        width: 640,
    };

    /**
     * Stores id of last download.
     * @type {string}
     * @private
     */
    this._last_downloaded_score = '';

    /**
     * Game reset.
     * @type {boolean}
     * @private
     */
    this._reset = false;

    /**
     * User is playing.
     * @type {boolean}
     * @private
     */
    this._is_playing = false;

    /**
     * Object pointer.
     * @type {Minesweeper}
     */
    let self = this;

    /**
     * Apply minesweeper rules to volume.
     *
     * @function
     * @param {Volume} volume - Volume
     * @param {number} mines - Number of mines, if less than 1 it's treated as percentage
     * @param {string} id - Generator id
     * @param {string} name - Generator name
     * @param {number} type - Generator type
     * @returns {boolean} - Volume is valid
     */
    this.new = function (volume, mines, id, name, type) {

        // Get number of faces
        let tfaces = volume.get_total_faces(true);

        // Calculate total mines
        mines = Math.max(0, Math.min(mines, tfaces - 1));
        self._generator.mines = mines;
        if (mines < 1) mines *= tfaces;

        // Check if figure is valid
        if (tfaces === 0 || mines === 0 || mines > tfaces) return false;

        // Place bombs
        let faces = volume.get_faces();
        let pm = 0;
        let faceid = []; // Array containing face ID
        for (let i = 0; i < tfaces; i += 1) {
            faceid.push(i);
        }

        for (let i = 0; i < mines; i += 1) {
            let j = get_random_int(0, faceid.length - 1); // Find random index
            if (!faces[j].has_bomb() && faces[j].is_enabled()) {
                faces[j].place_bomb();
                faceid.splice(j, 1);
                pm += 1;
            } else {
                i -= 1;
            }
        }

        // Calculate percentage of placed mines
        let p = round_number(100 * pm / tfaces, 1);
        if (isNaN(p)) p = 0;
        app_console.info(lang.mines_placed.format(pm, p));

        // Set bomb counters
        for (let i = 0; i < tfaces; i += 1) {
            if (!faces[i].has_bomb()) {
                faces[i].set_bomb_count(faces[i].get_bomb_count());
            }
        }

        // Change game status
        self._gameover = false;
        self._is_playing = true;
        self._game_status.total = tfaces;
        self._game_status.played = 0;
        self._game_status.flags = 0;
        self._game_status.questions = 0;
        self._game_status.mines = pm;
        self._volume = volume;
        self._generator.id = md5(md5(id) + md5(pm));
        self._generator.name = name;
        self._generator.type_id = type;

        // OK
        return true;

    };

    /**
     * Play face.
     *
     * @function
     * @param {Face} face - Face to play
     * @param {boolean} lclick - Left or right click
     * @param {TMSViewer} viewer - Viewer reference
     */
    this.play = function (face, lclick, viewer) {

        // Not valid conditions
        if (is_null_undf(face) || self._gameover) return;

        // Click time
        let t = new Date();
        let ts = get_seconds_between(t, this._last_click.time); // Seconds between last click

        // If face played then only left click is allowed
        if (face.is_played() && this._last_click.id === face.get_id() && ts < 0.20 && lclick && face.get_bomb_count() !== 0) {
            app_console.info(lang.mines_detected_double_lclick.format(ts));
            this._clear_zeros(face, viewer, true);
            self._update_counters();
            this._check_win();
        }

        // Stores last click
        this._last_click.id = face.get_id();
        this._last_click.time = t;

        // Return if played
        if (face.is_played()) return;

        // If left click, uncovers face
        if (lclick) {
            if (face.has_flag()) {
                app_sound.play(app_sound.sound.WRONG);
                return;
            }
            if (face.has_question()) {
                face.place_flag();
                self._game_status.questions -= 1;
                self._game_status.played -= 1;
            }
            face.play(viewer);
            face.place_image(viewer);
            app_sound.play(app_sound.sound.CLICK);
            self._game_status.played += 1;

            // Check bomb
            if (this._check_bomb(face, viewer)) return;

            // If face has zero bombs
            if (face.get_bomb_count() === 0) this._clear_zeros(face, viewer, false);
        } else {
            if (ts < 0.15) return;
            face.place_flag();
            face.place_image(viewer);
            if (face.has_flag()) {
                app_sound.play(app_sound.sound.FLAG);
                self._game_status.flags += 1;
                self._game_status.played += 1;
            } else if (face.has_question()) {
                app_sound.play(app_sound.sound.UNFLAG);
                self._game_status.flags -= 1;
                self._game_status.questions += 1;
            } else {
                self._game_status.questions -= 1;
                self._game_status.played -= 1;
                app_sound.play(app_sound.sound.CLICK);
            }
        }

        // Render scene
        viewer.render();
        self._update_counters();

        // Check win
        this._check_win();

    };

    /**
     * Clear zero bombs around a face.
     *
     * @function
     * @param {Face} face
     * @param {TMSViewer} viewer
     * @param {boolean} click_bombs
     * @private
     */
    this._clear_zeros = function (face, viewer, click_bombs) {
        let f = face.get_target_faces();
        for (let i = 0; i < f.length; i += 1) {
            if (f[i].is_enabled() && !f[i].is_played() && (!f[i].has_bomb() || click_bombs) && !f[i].has_flag() && !f[i].has_question()) {
                f[i].play(viewer);
                f[i].place_image(viewer);
                self._game_status.played += 1;
                if (this._check_bomb(f[i], viewer)) return;
                if (f[i].get_bomb_count() === 0) this._clear_zeros(f[i], viewer, true);
            }
        }
    };

    /**
     * Check if user clicked on a bomb.
     *
     * @function
     * @param {Face} face
     * @param {TMSViewer} viewer
     * @private
     */
    this._check_bomb = function (face, viewer) {
        if (face.has_bomb()) {

            // Set status
            self._gameover = true;
            app_console.info(lang.game_over);
            self._timer.timer.stop();

            // Explotion effect
            this._set_text_color('#ff1111');
            setTimeout(function () {
                self._new_game_after_lose();
            }, 1450); // Popup must be synchronized with ending sound
            this._explotion_effect([face], viewer, 0);
            app_sound.play(app_sound.sound.GAMEOVER);
            setTimeout(function () {
                self._explotion_secondary_effect([face], viewer, 0);
            }, 300);

            return true;
        }
        return false;
    };

    /**
     * Check user won.
     *
     * @function
     * @private
     */
    this._check_win = function () {

        // Fast check
        if (self._game_status.played !== self._game_status.total) {
            if (!((self._game_status.played + self._game_status.mines - self._game_status.flags - self._game_status.questions) === self._game_status.total)) return;
        }
        app_console.info(lang.game_checking_win_condition);

        // Check all faces has been played (except if they have a bomb)
        let $played = 0;
        let $f = self._volume.get_faces();
        for (let i = 0; i < $f.length; i += 1) {
            if (!$f[i].is_enabled()) continue;
            if ($f[i].is_played() && $f[i].has_bomb()) continue;
            if (!$f[i].is_played() && !$f[i].has_bomb()) continue;
            $played += 1;
        }
        if ($played !== self._game_status.total) return;

        // User won
        let $time = get_seconds_from(this._timer.init);
        self._user.time = $time;
        self._timer.timer.stop();
        self._gameover = true;
        self._set_text_color('#3dff4d');
        app_console.info(lang.game_finished.format($time));
        app_sound.play(app_sound.sound.GAMEWIN);

        // Request user info
        self._request_username();

    };

    /**
     * Explotion effect when a bomb is pressed.
     *
     * @function
     * @param {Face[]} face - Target faces
     * @param {TMSViewer} viewer - Viewer
     * @param {number} call - Call number
     * @private
     */
    this._explotion_effect = function (face, viewer, call) {

        // If reset returns
        if (self._reset) return;

        // Objective faces
        let $f = [];
        let $f_id = [];
        for (let i = 0; i < face.length; i += 1) {
            face[i].explode(viewer);
            let $ff = face[i].get_target_faces();
            for (let j = 0; j < $ff.length; j += 1) {
                if (!$ff[j].has_exploded() && !$f_id.includes($ff[j].get_id())) {
                    $f.push($ff[j]);
                    $f_id.push($ff[j].get_id());
                }
            }
        }

        // Recursive call
        if ($f.length === 0 || !self._is_playing) return; // Check if playing) return;
        // viewer.render();
        setTimeout(function () {
            self._explotion_effect($f, viewer, call + 1);
        }, Math.floor(30 * Math.pow((call + 1), 0.20)));

    };

    /**
     * Explotion secondary effect when a bomb is pressed.
     *
     * @function
     * @param {Face[]} face - Target faces
     * @param {TMSViewer} viewer - Viewer
     * @param {number} call - Call number
     * @private
     */
    this._explotion_secondary_effect = function (face, viewer, call) {

        // If reset returns
        if (self._reset) return;

        // Objective faces
        let $f = [];
        let $f_id = [];
        for (let i = 0; i < face.length; i += 1) {
            face[i].explode_secondary(viewer);
            let $ff = face[i].get_target_faces();
            for (let j = 0; j < $ff.length; j += 1) {
                if (!$ff[j].has_exploded_secondary() && !$f_id.includes($ff[j].get_id())) {
                    $f.push($ff[j]);
                    $f_id.push($ff[j].get_id());
                }
            }
        }

        // viewer.render();
        setTimeout(function () { // Recursive call
            self._explotion_secondary_effect($f, viewer, call + 1);
        }, Math.floor(80 * Math.pow((call + 1), 0.10)));

    };

    /**
     * Set text color.
     *
     * @function
     * @param {string} color
     * @private
     */
    this._set_text_color = function (color) {
        self._dom.facecount.css('color', color);
        self._dom.flagcount.css('color', color);
        self._dom.minecount.css('color', color);
        self._dom.questioncount.css('color', color);
        self._timer.dom.css('color', color);
    };

    /**
     * Stops current game ui.
     *
     * @function
     */
    this.reset_game_ui = function () {

        // Refresh style
        this._set_text_color('#ffffff');

        // Counter
        self._timer.dom.html('00:00:00');
        this._timer.timer.stop();
        this._timer.timer.removeEventListener('secondsUpdated');

        // Remove events
        this._dom.menubutton.off('click');
        this._dom.resetbutton.off('click');
        app_dom.window.off('resize.scoreboard');
        if (self._check_size.enabled) app_dom.window.off('resize.checksize');

        // Hide
        this._dom.viewer.hide();
        app_console.info(lang.reset_ui);

    };

    /**
     * Creates new game ui.
     *
     * @function
     * @param {boolean=} download_score
     */
    this.new_game_ui = function (download_score) {

        // Reset event
        this.reset_game_ui();
        app_console.info(lang.load_ui);
        // app_dom.body.css('overflow', 'hidden');

        // Timer
        this._timer.init = new Date();
        this._timer.timer.reset();
        this._timer.timer.start();
        this._timer.timer.addEventListener('secondsUpdated', function () {
            self._timer.dom.html(self._timer.timer.getTimeValues().toString());
        });

        // Set language
        this._dom.menubutton.html('<i class="fas fa-home"></i> ' + lang.game_back_to_menu);
        this._dom.resetbutton.html('<i class="fas fa-redo-alt"></i> ' + lang.game_reset);

        // Set events
        this._dom.menubutton.on('click', function () {
            let $loadmenu = function () {
                self._is_playing = false;
                app_tms.load_menu();
            };
            app_sound.play(app_sound.sound.BUTTON);
            if (self._game_status.played === 0) { // || self._gameover
                $loadmenu();
                return;
            }
            app_dialog.confirm(lang.leave_game_title, lang.leave_game_confirm, {
                confirm: $loadmenu,
                confirmButtonClass: app_dialog.options.buttons.BLUE,
                icon: 'fas fa-home',
                size: app_dialog.options.size.SMALL,
            });
        });
        this._dom.resetbutton.on('click', function () {
            let $reset = function () {
                self._reset = true;
                app_tms.new();
            };
            app_sound.play(app_sound.sound.BUTTON);
            if (self._game_status.played === 0 || self._gameover) {
                $reset();
                return;
            }
            app_dialog.confirm(lang.reset_game_title, lang.reset_game_confirm, {
                confirm: $reset,
                confirmButtonClass: app_dialog.options.buttons.DANGER,
                icon: 'fas fa-exclamation-triangle',
                size: app_dialog.options.size.SMALL,
            });
        });

        // Update counters
        self._update_counters();

        // Get score from server
        if (download_score) self._load_score(true);

        // Check window size
        self._check_size.opened = false;
        if (self._check_size.enabled) {
            app_dom.window.on('resize.checksize', self._check_window_size);
            self._check_window_size();
        }

        // Show
        this._dom.viewer.show();
        self._scoreboard_setup();

        // Disable reset status
        self._reset = false;

    };

    /**
     * Check window size popup.
     *
     * @function
     * @private
     */
    this._check_window_size = function () {
        let $w = app_dom.window.outerWidth();
        let $h = app_dom.window.outerHeight();
        if ($w >= self._check_size.width && $h >= self._check_size.height) {
            if (self._check_size.opened) app_dialog.close_last();
            self._check_size.opened = false;
            return;
        }
        if (self._check_size.opened) return;
        self._check_size.opened = true;
        app_dialog.confirm(lang.check_window_size_title, lang.check_window_size_info.format(round_number($w), round_number($h), round_number(self._check_size.width), round_number(self._check_size.height)), {
            cancelText: null,
            confirm: function () {
                self._check_window_size();
            },
            confirmButtonClass: app_dialog.options.buttons.DANGER,
            confirmText: lang.answer_ok,
            icon: 'fas fa-desktop',
            size: app_dialog.options.size.NORMAL,
        });
    };

    /**
     * Load game scores.
     *
     * @function
     * @param {boolean=} wipe
     * @private
     */
    this._load_score = function (wipe) {
        if (wipe) self._scoreboard_setup();
        setTimeout(function () {
            self._get_score();
        }, 1000);
    };

    /**
     * Update counters.
     *
     * @function
     * @private
     */
    this._update_counters = function () {
        let $played = round_number(100 * self._game_status.played / self._game_status.total, 1);
        if (isNaN($played)) $played = 0;

        // Update
        self._dom.facecount.html('{0}/{1} ({2}%)'.format(self._game_status.played, self._game_status.total, $played));
        self._dom.flagcount.html(self._game_status.flags);
        self._dom.minecount.html(self._game_status.mines);
        self._dom.questioncount.html(self._game_status.questions);
    };

    /**
     * Request user name.
     *
     * @function
     * @private
     */
    this._request_username = function () {

        // Check if playing
        if (!self._is_playing) return;

        // Generate ID
        let $id = generateID();

        // Get last added name from cookies if exists
        let $lastname = sessionCookie.username;
        if (is_null_undf($lastname)) $lastname = '';

        // noinspection HtmlUnknownAttribute
        app_dialog.form(lang.game_won_title, '{2}.<br><br><form action="" class="formName"><div class="form-group"><label for="{0}">{1}:</label><input type="text" class="form-control" id="{0}" minlength="4" maxlength="20" value="{4}" required aria-required="true" placeholder="{5}" aria-placeholder="{5}" {3}></div></form>'.format($id, lang.game_won_name, lang.game_won_content.format(round_number(self._user.time, self._user.time < 10 ? 3 : 2)), $lastname === '' ? 'autofocus' : '', $lastname, lang.game_won_placeholder),
            function () {
                let $name = self._sanitize_text($('#' + $id).val()); // Get name
                if ($name.length >= 4 && $name.length <= 20) {
                    sessionCookie.username = $name;
                    update_session_cookie();
                    self._submit_score($name);
                }
            }, self._new_game_after_win
            , {
                cancelText: lang.dialog_form_cancel,
                icon: 'fas fa-trophy',
                submitText: lang.dialog_form_send,
            }
        );

    };

    /**
     * Sanitize string.
     *
     * @function
     * @param {string} str
     * @returns {string}
     * @private
     */
    this._sanitize_text = function (str) {
        str = str.toString();
        str = str.replace(/[^a-z0-9áéíóúñü .,_-]/gim, '');
        return str.trim();
    };

    /**
     * Submits score.
     *
     * @function
     * @param {string} name
     * @private
     */
    this._submit_score = function (name) {
        app_library_manager.import_async_library(app_library_manager.lib.DBIP, function () {
            self._user.name = name;
            let location = dbip.getVisitorInfo();
            location.then(info => {
                // noinspection JSUnresolvedVariable
                self._user.location = info.countryCode.toLowerCase();
                self._push_server();
            }).catch(function () {
                NotificationJS.error(lang.score_error_location);
                self._user.location = 'none';
                setTimeout(self._push_server, 500);
            });
        });
    };

    /**
     * Push game information to server.
     *
     * @function
     * @private
     */
    this._push_server = function () {

        // noinspection JSUnresolvedFunction
        /**
         * Create query
         * @type {JQuery.jqXHR}
         */
        let $query = $.ajax({
            crossOrigin: cfg_ajax_cors,
            data: 'm=upload&id={0}&u={1}&c={2}&t={3}&g={4}'.format(self._generator.id, self._user.name, self._user.location, self._user.time, self._generator.type_id),
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
                if (Object.keys($data).indexOf('error') === -1) {
                    self._load_score(false);
                    return;
                }
                NotificationJS.error(lang.score_error_submit);
            } catch ($e) {
                app_console.exception($e);
            } finally {
            }
            app_console.exception(response);
        });

        // noinspection JSUnusedLocalSymbols
        /**
         * Fail connection
         */
        $query.fail(function (response, textStatus, jqXHR) {
            NotificationJS.error(lang.score_error_submit);
        });

        // Show dialog
        self._new_game_after_win();

    };

    /**
     * Dialog after wining.
     *
     * @function
     * @private
     */
    this._new_game_after_win = function () {
        if (!self._is_playing) return; // Check if playing
        setTimeout(function () {
            app_dialog.confirm(lang.game_won_title, lang.start_new_game, {
                confirm: function () {
                    self._reset = true;
                    app_tms.new();
                },
                backgroundDismiss: 'cancel',
                confirmButtonClass: app_dialog.options.buttons.SUCCESS,
                escapeCancelKey: true,
                icon: 'fas fa-trophy',
                size: app_dialog.options.size.SMALL,
            });
        }, 400);
    };

    /**
     * Dialog after losing.
     *
     * @function
     * @private
     */
    this._new_game_after_lose = function () {
        if (!self._is_playing) return; // Check if playing
        setTimeout(function () {
            app_dialog.confirm(lang.game_over, lang.start_new_game, {
                confirm: function () {
                    self._reset = true;
                    app_tms.new();
                },
                backgroundDismiss: 'cancel',
                confirmButtonClass: app_dialog.options.buttons.DANGER,
                escapeCancelKey: true,
                icon: 'fas fa-bomb',
                size: app_dialog.options.size.SMALL,
            });
        }, 400);
    };

    /**
     * Get score from server.
     *
     * @function
     */
    this._get_score = function () {

        // noinspection JSUnresolvedFunction
        /**
         * Create query
         * @type {JQuery.jqXHR}
         */
        let $query = $.ajax({
            crossOrigin: cfg_ajax_cors,
            data: 'm=get&id={0}&g={1}'.format(self._generator.id, self._generator.type_id),
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
                if (Object.keys($data).indexOf('error') === -1) {
                    self._write_scores($data);
                    return;
                }
            } catch ($e) {
                app_console.exception($e);
            } finally {
            }
            NotificationJS.error(lang.score_error_get);
            app_console.error(response);
            self._write_scores(null);
        });

        // noinspection JSUnusedLocalSymbols
        /**
         * Fail connection
         */
        $query.fail(function (response, textStatus, jqXHR) {
            NotificationJS.error(lang.score_error_get);
            self._write_scores(null);
        });

    };

    /**
     * Write server score.
     *
     * @function
     * @param {object} score
     * @private
     */
    this._write_scores = function (score) {
        let $scoreid = md5(score);
        if ($scoreid === self._last_downloaded_score) return;
        self._last_downloaded_score = $scoreid;
        self._dom.scoreboard_content.empty();
        if (not_null_undf(score)) {
            let w = 0; // Effective writes
            for (let i = 0; i < score.length; i += 1) {
                if (self._write_user_scoreboard(score[i].user, i + 1, score[i].country, score[i].date, score[i].time)) w += 1;
            }
            if (w === 0) self._dom.scoreboard_content.html('<div class="game-scoreboard-empty">{0} <i class="fas fa-smile-wink"></i></div>'.format(lang.scoreboard_empty, self._get_scoreboard_height()));
            self._center_scoreboard();
            return;
        }
        self._dom.scoreboard_content.html('<div class="game-scoreboard-empty"><i class="fas fa-exclamation-triangle"></i> {0}</div>'.format(lang.server_error));
        self._center_scoreboard();
    };

    /**
     * Setup scoreboard panel.
     *
     * @function
     * @private
     */
    this._scoreboard_setup = function () {

        // If reset
        self._dom.scoreboard_content.animate({
            scrollTop: 0
        }, 400);
        if (self._reset) return;

        // Clear scoreboard
        self._last_downloaded_score = '';
        self._dom.scoreboard_content.empty();
        self._dom.scoreboard_title.html(lang.scoreboard_title);
        let $mines = '';
        if (self._generator.mines < 1) {
            $mines = round_number(self._generator.mines * 100, 2).toString() + '%';
        } else {
            $mines = round_number(self._generator.mines, 0).toString();
        }
        if ($mines !== '0' && $mines !== '0%') {
            $mines = '{0} ({1})'.format(self._generator.name, $mines);
        } else {
            $mines = '';
        }
        self._dom.scoreboard_name.html($mines);

        // Scoreboard content autosize
        app_dom.window.on('resize.scoreboard', self._center_scoreboard);
        self._center_scoreboard(); // Apply text centering

        // Write loading
        self._dom.scoreboard_content.html('<div class="game-scoreboard-loading" style="line-height: {0}px;"><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i></div>'.format(self._get_scoreboard_height()));

    };

    /**
     * Center scoreboard.
     *
     * @function
     * @private
     */
    this._center_scoreboard = function () {
        self._dom.scoreboard_content.css('height', self._get_scoreboard_height());
        let $child = self._dom.scoreboard_content.find('.game-scoreboard-empty');
        if (is_null_undf($child) || $child.length === 0) return;
        $child.css('line-height', '');
        $child.css('padding-top', ((self._get_scoreboard_height() / 2) - 20) + 'px');
    };

    /**
     * Get scoreboard height.
     *
     * @function
     * @returns {number}
     * @private
     */
    this._get_scoreboard_height = function () {
        let $height = self._dom.scoreboard_container.innerHeight();
        let $header = get_element_height(self._dom.scoreboard_header);
        return $height - $header - 6;
    };

    /**
     * Write user into scoreboard.
     *
     * @function
     * @param {string} name
     * @param {string} position
     * @param {string} country
     * @param {string} date
     * @param {string} time
     * @returns {boolean}
     * @private
     */
    this._write_user_scoreboard = function (name, position, country, date, time) {

        // Format time
        let $timestr = '';
        let $time = parseFloat(time);
        if (isNaN($time) || time <= 0) return false;

        // Format number
        if ($time < 1e1) {
            $time = round_number($time, 3);
            $timestr = $time.toString().padEnd(5, '0');
        }
        if ($time > 1e1) {
            $time = round_number($time, 2);
            $timestr = $time.toString().padEnd(5, '0');
        }
        if ($time > 1e2) {
            $time = round_number($time, 1);
            $timestr = $time.toString().padEnd(5, '0');
        }
        if ($time > 1e3) {
            $time = round_number($time, 0);
            $timestr = $time.toString();
        }
        if ($time > 86400) return false;

        // Format country
        country = country.toString();
        if (is_null_undf(country) || country === 'null' || country === 'none') country = '';
        if (country !== '') {
            let country_name = ''; // Find country name
            for (let i = 0; i < country_list.length; i += 1) {
                if (country_list[i].code.toLowerCase() === country) {
                    country_name = country_list[i].name;
                    break;
                }
            }
            // noinspection HtmlUnknownTarget
            country = '<div class="game-scoreboard-userdata-img"><img src="resources/flags/{0}.png" alt="" title="{1}" /></div>'.format(country, country_name);
        } else if (country === 'none' || country === 'null') {
            country = '<div class="game-scoreboard-userdata-img-null"></div>'.format();
        }

        // Format date
        let date_display = date_format(new Date(date), cfg_date_format_public_d);

        // Write content
        self._dom.scoreboard_content.append('<div class="game-scoreboard-entry"><div class="game-scoreboard-user"><div class="game-scoreboard-username">{0}</div><div class="game-scoreboard-userdata"><div class="game-scoreboard-userdata-position">#{1}</div><div class="game-scoreboard-userdata-date">{3}</div>{2}</div></div><div class="game-scoreboard-time">{4}</div></div>'.format(name, position, country, date_display, $timestr));
        return true;

    };

}