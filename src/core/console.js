/**
 CONSOLE
 Console manager.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Application console.
 *
 * @class
 * @constructor
 * @private
 */
function AppConsole() {
    /* eslint no-console:"off" */

    /**
     * Stores total messages before wipe.
     * @type {int}
     * @private
     */
    this._consoleMessages = 0;

    /**
     * Total console messages.
     * @type {int}
     * @private
     */
    this._totalConsoleMessages = 0;

    /**
     * Format string.
     * @type {string}
     * @private
     */
    this._msgDateFormat = cfg_date_format_public_d + ' ' + cfg_date_format_public_h;

    /**
     * Object pointer.
     * @type {AppConsole}
     * @private
     */
    let self = this;

    /**
     * Apply format message.
     *
     * @function
     * @private
     * @param {string} msg - Message
     */
    this._format = function (msg) {
        if (isNullUndf(msg)) return '';
        msg = msg.replace(/&lt;/g, '<');
        msg = msg.replace(/&gt;/g, '>');
        msg = msg.replace(/&nbsp;/g, ' ');
        msg = msg.replace(/&quot;/g, '"');
        msg = msg.replace(/&apos;/g, "'");
        return msg;
    };

    /**
     * Check console reset.
     *
     * @function
     * @private
     */
    this._resetMessages = function () {
        self._consoleMessages += 1;
        self._totalConsoleMessages += 1;
        if (self._consoleMessages > cfg_total_console_messages_until_wipe) {
            console.clear();
            self.aboutInfo();
            self._consoleMessages = 0;
        }
    };

    /**
     * Information message.
     *
     * @function
     * @param {string} msg - Message
     */
    this.info = function (msg) {
        if (cfg_verbose) {
            msg = self._format(msg);
            this._resetMessages();
            if (show_console_total_messages) {
                console.log('[{2}@{0}] {1}'.format(dateFormat(new Date(), this._msgDateFormat), msg, this._totalConsoleMessages));
            } else {
                console.log('[{0}] {1}'.format(dateFormat(new Date(), this._msgDateFormat), msg));
            }
        }
    };

    /**
     * Writes an error message.
     *
     * @function
     * @param {string} msg - Message
     * @param {boolean=} w - Writes header
     */
    this.error = function (msg, w) {
        if (cfg_verbose) {
            msg = self._format(msg);
            let $m;
            if (w) {
                $m = lang.error_message;
            } else {
                $m = '';
            }
            this._resetMessages();
            if (show_console_total_messages) {
                console.error('[{3}@{0}] {2}{1}'.format(dateFormat(new Date(), this._msgDateFormat), msg, $m, this._totalConsoleMessages));
            } else {
                console.error('[{0}] {2}{1}'.format(dateFormat(new Date(), this._msgDateFormat), msg, $m));
            }
        }
    };

    /**
     * Writes an error on console.
     *
     * @function
     * @param {Error} exceptionmsg - Exception message
     * @param {boolean=} w - Writes header
     */
    this.exception = function (exceptionmsg, w) {
        if (cfg_verbose) {
            let $m;
            if (w) {
                $m = lang.exception_title;
            } else {
                $m = '';
            }
            self._totalConsoleMessages -= 1; // Exception is not treated as message
            self._consoleMessages -= 1;
            this._resetMessages();
            if (isString(exceptionmsg)) {
                console.error('{1}{0}'.format(exceptionmsg, $m));
            } else {
                console.error('{2}{0} {1}'.format(exceptionmsg.message, exceptionmsg.stack, $m));
            }
        }
    };

    /**
     * Writes a generic warning message.
     *
     * @function
     * @param {string} msg - Message
     * @param {boolean=} w - Writes header
     */
    this.warn = function (msg, w) {
        if (cfg_verbose) {
            msg = self._format(msg);
            let $m;
            if (w) {
                $m = lang.error_message;
            } else {
                $m = '';
            }
            this._resetMessages();
            if (show_console_total_messages) {
                console.warn('[{3}@{0}] {2}{1}'.format(dateFormat(new Date(), this._msgDateFormat), msg, $m, this._totalConsoleMessages));
            } else {
                console.warn('[{0}] {2}{1}'.format(dateFormat(new Date(), this._msgDateFormat), msg, $m));
            }
        }
    };

    /**
     * Prints about info.
     *
     * @function
     */
    this.aboutInfo = function () {
        console.log('{0} v{1} ({2})'.format(aboutinfo.productname, aboutinfo.v.version, dateFormat(new Date(aboutinfo.v.date), cfg_date_format_public_d)));
        console.log('{0} | {1}'.format(aboutinfo.author.name, aboutinfo.author.website));
        console.log(' ');
    };

}

/**
 * Stores console object.
 * @type {AppConsole}
 * @const
 */
const app_console = new AppConsole();