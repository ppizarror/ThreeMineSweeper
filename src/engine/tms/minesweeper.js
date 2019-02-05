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
        if (isNullUndf(face) || face.is_played()) return;

        // If left click, uncovers face
        if (lclick) {
            face.play(viewer);
            face.place_image(viewer);

            // If face has bomb
            if (face.has_bomb()) return;

            // If face has zero bombs
            if (face.get_bomb_count() === 0) this._clear_zeros(face, viewer);

            viewer.render();
        }

    };

    /**
     * Clear zero bombs around a face.
     *
     * @function
     * @param {Face} face
     * @param {TMSViewer} viewer
     * @private
     */
    this._clear_zeros = function (face, viewer) {
        let f = face.get_target_faces();
        for (let i = 0; i < f.length; i += 1) {
            if (f[i].is_enabled() && !f[i].is_played() && !f[i].has_bomb()) {
                f[i].play(viewer);
                f[i].place_image(viewer);
                if (f[i].get_bomb_count() === 0) this._clear_zeros(f[i], viewer);
            }
        }
    };

}