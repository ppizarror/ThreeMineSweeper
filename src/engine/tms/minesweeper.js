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
     * Create ion sound.
     */
    ion.sound({ // http://ionden.com/a/plugins/ion.sound/en.html
        sounds: [
            {
                name: 'click'
            },
            {
                name: 'flag'
            },
            {
                name: 'gameOver',
                preload: false
            },
            {
                name: 'gameWin',
                preload: false
            },
            {
                name: 'mainmenu',
                preload: false
            },
            {
                name: 'music',
                preload: false
            },
            {
                name: 'unflag'
            },
            {
                name: 'wrong'
            }
        ],
        volume: 0.5,
        path: 'resources/sounds/',
        preload: true
    });

    /**
     * Apply minesweeper rules to volume.
     *
     * @function
     * @param {Volume} volume - Volume
     * @param {number} mines - Number of mines, if less than 1 it's treated as percentage
     */
    this.apply = function (volume, mines) {

        // Calculate total mines
        let tfaces = volume.get_total_faces();
        mines = Math.max(0, mines);
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
        app_console.info(lang.mines_placed.format(pm, roundNumber(100 * pm / tfaces, 1)));

        // Set bomb counters
        for (let i = 0; i < tfaces; i += 1) {
            if (!faces[i].has_bomb()) {
                faces[i].set_bomb_count(faces[i].get_bomb_count());
            }
        }

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
        if (isNullUndf(face)) return;

        // Click time
        let t = new Date();
        let ts = getSecondsBetween(t, this._last_click.time); // Seconds between last click

        // If face played then only left click is allowed
        if (face.is_played() && this._last_click.id === face.get_id() && ts < 0.15 && lclick && face.get_bomb_count() !== 0) {
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
            if (face.has_flag()) return;
            if (face.has_question()) face.place_flag();
            face.play(viewer);
            face.place_image(viewer);
            ion.sound.play('click');

            // Check bomb
            if (this._check_bomb(face)) return;

            // If face has zero bombs
            if (face.get_bomb_count() === 0) this._clear_zeros(face, viewer, false);
        } else {
            face.place_flag();
            face.place_image(viewer);
            if (face.has_flag()) {
                ion.sound.play('flag');
            } else if (face.has_question()) {
                ion.sound.play('unflag');
            } else {
                ion.sound.play('click');
            }
        }

        // Render scene
        viewer.render();

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
                if (this._check_bomb(f[i])) return;
                if (f[i].get_bomb_count() === 0) this._clear_zeros(f[i], viewer, true);
            }
        }
    };

    /**
     * Check if user clicked on a bomb.
     *
     * @function
     * @param {Face} face
     * @private
     */
    this._check_bomb = function (face) {
        if (face.has_bomb()) {
            ion.sound.play('wrong');
            // ion.sound.play('gameOver');
            app_console.info(lang.game_over);
            return true;
        }
        return false;
    };

}