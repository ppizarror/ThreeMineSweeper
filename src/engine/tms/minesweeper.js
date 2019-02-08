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
    /* eslint-disable new-cap */
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
        played: 0,
        questions: 0,
        total: 0,
    };

    /**
     * Timer.
     * @type {{timer: e, dom: JQuery<HTMLElement> | jQuery | HTMLElement}}
     * @private
     */
    this._timer = {
        dom: $('#game-time-counter'),
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
        questioncount: $('#game-ui-question-counter'),
        resetbutton: $('#game-ui-button-reset'),
    };

    /**
     * Object pointer.
     * @type {Minesweeper}
     */
    let self = this;

    /**
     * Create ion sound.
     */
    ion.sound({ // http://ionden.com/a/plugins/ion.sound/en.html
        sounds: [
            {
                name: 'click',
                preload: true,
            },
            {
                name: 'flag'
            },
            {
                name: 'gameOver'
            },
            {
                name: 'gameWin'
            },
            {
                name: 'mainmenu'
            },
            {
                name: 'music'
            },
            {
                name: 'unflag'
            },
            {
                name: 'wrong'
            }
        ],
        multiplay: true,
        path: 'resources/sounds/',
        preload: false,
        volume: 1.0,
    });

    /**
     * Apply minesweeper rules to volume.
     *
     * @function
     * @param {Volume} volume - Volume
     * @param {number} mines - Number of mines, if less than 1 it's treated as percentage
     */
    this.new = function (volume, mines) {

        // Calculate total mines
        let tfaces = volume.get_total_faces(true);
        mines = Math.max(0, Math.min(mines, tfaces - 1));
        if (mines < 1) mines *= tfaces;

        // Get volume faces
        let faces = volume.get_faces();

        // Place bombs
        let pm = 0;
        for (let i = 0; i < mines; i += 1) {
            let j = getRandomInt(0, tfaces - 1);
            if (!faces[j].has_bomb() && faces[j].is_enabled()) {
                faces[j].place_bomb();
                pm += 1;
            } else {
                i -= 1;
            }
        }
        let p = roundNumber(100 * pm / tfaces, 1);
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
        self._game_status.total = tfaces;
        self._game_status.played = 0;
        self._game_status.flags = 0;
        self._game_status.questions = 0;

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
        if (isNullUndf(face) || self._gameover) return;

        // Click time
        let t = new Date();
        let ts = getSecondsBetween(t, this._last_click.time); // Seconds between last click

        // If face played then only left click is allowed
        if (face.is_played() && this._last_click.id === face.get_id() && ts < 0.20 && lclick && face.get_bomb_count() !== 0) {
            app_console.info(lang.mines_detected_double_lclick.format(ts));
            this._clear_zeros(face, viewer, true);
        }

        // Stores last click
        this._last_click.id = face.get_id();
        this._last_click.time = t;

        // Return if played
        if (face.is_played()) return;

        // If left click, uncovers face
        if (lclick) {
            if (face.has_flag()) {
                ion.sound.play('wrong');
                return;
            }
            if (face.has_question()) {
                face.place_flag();
                self._game_status.questions -= 1;
            }
            face.play(viewer);
            face.place_image(viewer);
            ion.sound.play('click');
            self._game_status.played += 1;

            // Check bomb
            if (this._check_bomb(face, viewer)) return;

            // If face has zero bombs
            if (face.get_bomb_count() === 0) this._clear_zeros(face, viewer, false);
        } else {
            face.place_flag();
            face.place_image(viewer);
            if (face.has_flag()) {
                ion.sound.play('flag');
                self._game_status.flags += 1;
                self._game_status.played += 1;
            } else if (face.has_question()) {
                ion.sound.play('unflag');
                self._game_status.flags -= 1;
                self._game_status.questions += 1;
            } else {
                self._game_status.questions -= 1;
                self._game_status.played -= 1;
                ion.sound.play('click');
            }
        }

        // Render scene
        viewer.render();
        self._update_counters();

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
            this._explotion_effect([face], viewer, 0);
            ion.sound.play('gameOver');
            setTimeout(function () {
                self._explotion_secondary_effect([face], viewer, 0);
            }, 300);

            return true;
        }
        return false;
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
        let $f = []; // Objective faces
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
        viewer.render();
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
        let $f = []; // Objective faces
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
        viewer.render();
        setTimeout(function () {
            self._explotion_secondary_effect($f, viewer, call + 1);
        }, Math.floor(80 * Math.pow((call + 1), 0.10)));
    };

    /**
     * Creates new game ui.
     *
     * @function
     */
    this.new_game_ui = function () {

        // Create counter
        this._timer.timer.reset();
        this._timer.timer.start();
        this._timer.timer.addEventListener('secondsUpdated', function () {
            self._timer.dom.html(self._timer.timer.getTimeValues().toString());
        });

        // Set language
        this._dom.menubutton.html('<i class="fas fa-home"></i> ' + lang.game_back_to_menu);
        this._dom.resetbutton.html('<i class="fas fa-redo-alt"></i> ' + lang.game_reset);

        // Set events
        this._dom.menubutton.off('click');
        this._dom.menubutton.on('click', function () {
        });
        this._dom.resetbutton.off('click');
        this._dom.resetbutton.on('click', function () {
            app_dialog.confirm(lang.reset_game_title, lang.reset_game_confirm, {
                cancel: function () {
                },
                confirm: function () {
                    app_tms.new();
                },
                icon: 'fas fa-exclamation-triangle',
                size: app_dialog.options.size.SMALL,
            });
        });

        // Update counters
        self._update_counters();

    };

    /**
     * Update counters.
     *
     * @function
     * @private
     */
    this._update_counters = function () {
        let $played = roundNumber(100 * self._game_status.played / self._game_status.total, 1);
        self._dom.facecount.html('{0}/{1} ({2}%)'.format(self._game_status.played, self._game_status.total, $played));
        self._dom.flagcount.html(self._game_status.flags);
        self._dom.questioncount.html(self._game_status.questions);
    };

}