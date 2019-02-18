/**
 SOUNDS
 Game sounds.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Sound class.
 *
 * @class
 * @constructor
 */
function TMSSound() {
    /* eslint-disable arrow-parens */
    /* eslint-disable new-cap */
    /* eslint-disable no-continue */
    /* eslint-disable no-extra-parens */

    /**
     * Avaiable sounds.
     */
    this.sound = {
        BUTTON: 'click',
        CLICK: 'click',
        FLAG: 'flag',
        GAMEOVER: 'gameOver',
        GAMEWIN: 'gameWin',
        MENU: 'mainmenu',
        MUSIC: 'music',
        UNFLAG: 'unflag',
        WRONG: 'wrong',
    };

    /**
     * Sound keys.
     * @type {string[]}
     * @private
     */
    this._soundkeys = Object.keys(this.sound);

    /**
     * Create ion sound.
     */
    ion.sound({ // http://ionden.com/a/plugins/ion.sound/en.html
        sounds: [
            {
                name: this.sound.CLICK,
                volume: 0.8,
            },
            {
                name: this.sound.FLAG,
                preload: false,
                volume: 0.8,
            },
            {
                name: this.sound.GAMEOVER,
                preload: false,
                volume: 0.6,
            },
            {
                name: this.sound.GAMEWIN,
                preload: false,
                volume: 0.6,
            },
            {
                name: this.sound.MENU,
                preload: false,
                volume: 0.5,
            },
            {
                name: this.sound.MUSIC,
                preload: false,
                volume: 0.6,
            },
            {
                name: this.sound.UNFLAG,
                preload: false,
                volume: 0.6,
            },
            {
                name: this.sound.WRONG,
                preload: false,
                volume: 0.4,
            }
        ],
        multiplay: true,
        path: 'resources/sounds/',
    });

    /**
     * Sounds played.
     * @type {string[]}
     * @private
     */
    this._played_sounds = [];

    /**
     * Check sound.
     *
     * @function
     * @param {string} sound
     * @returns {boolean}
     * @private
     */
    this._check_sound = function (sound) {
        for (let i = 0; i < this._soundkeys.length; i += 1) {
            if (this.sound[this._soundkeys[i]] === sound) return true;
        }
        return false;
    };

    /**
     * Play sound.
     *
     * @function
     * @param {string} sound
     */
    this.play = function (sound) {
        if (!this._check_sound(sound)) return;
        ion.sound.play(sound);
        if (!this._played_sounds.includes(sound)) this._played_sounds.push(sound);
    };

    /**
     * Stop sound.
     *
     * @function
     * @param {string} sound
     */
    this.stop = function (sound) {
        if (!this._check_sound(sound)) return;
        ion.sound.stop(sound);
    };

    /**
     * Stop all sounds.
     *
     * @function
     */
    this.stop_all = function () {
        for (let i = 0; i < this._played_sounds.length; i += 1) {
            ion.sound.stop(this._played_sounds[i]);
        }
    };

    /**
     * Pause sound.
     *
     * @function
     * @param {string} sound
     */
    this.pause = function (sound) {
        if (!this._check_sound(sound)) return;
        ion.sound.pause(sound);
    };
}

/**
 * Application sounds.
 * @type {TMSSound}
 * @global
 */
let app_sound = new TMSSound();