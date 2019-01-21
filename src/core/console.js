/**
 CONSOLE
 Console manager.

 @author Pablo Pizarro R. @ppizarror.com
 @license Copyright 2018-2019, no copiar o distribuír sin permiso directo del autor
 */
"use strict";

/**
 * Administra la consola de la aplicación.
 *
 * @class
 * @private
 * @constructor
 * @since 1.9.52
 */
function AppConsole() {
    /* eslint no-console:"off" */

    /**
     * Almacena total de mensajes en consola antes de borrar
     * @type {int}
     * @private
     * @ignore
     */
    this._consoleMessages = 0;

    /**
     * Mensajes totals en consola
     * @type {int}
     * @private
     * @ignore
     */
    this._totalConsoleMessages = 0;

    /**
     * Formato de fecha de mensajes
     * @type {string}
     * @private
     * @ignore
     */
    this._msgDateFormat = cfg_date_format_public_d + ' ' + cfg_date_format_public_h;

    /**
     * Puntero a objeto
     * @type {AppConsole}
     * @private
     * @ignore
     */
    let self = this;

    /**
     * Aplica formato al mensaje para ser impreso en la consola.
     *
     * @function
     * @private
     * @param {string} msg - Mensaje
     * @since 3.0.28
     * @ignore
     */
    this._format = function (msg) {
        if (isNullUndf(msg)) return '';
        msg = msg.replace(/&lt;/g, '<');
        msg = msg.replace(/&gt;/g, '>');
        msg = msg.replace(/&nbsp;/g, ' ');
        msg = msg.replace(/&amp;/g, '&');
        msg = msg.replace(/&quot;/g, '"');
        msg = msg.replace(/&apos;/g, "'");
        return msg;
    };

    /**
     * Chequea reseteo de mensajes en consola, si se excede borra consola y imprime inicio.
     *
     * @function
     * @private
     * @since 3.0.20
     * @ignore
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
     * Muestra un mensaje de información en la consola.
     *
     * @function
     * @public
     * @param {string} msg - Mensaje
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
     * Escribe un objeto en la consola.
     *
     * @function
     * @public
     * @param {Object} obj - Objeto
     * @since 3.5.22
     */
    this.writeObj = function (obj) {
        if (cfg_verbose) {
            console.log(obj);
        }
    };

    /**
     * Muestra un mensaje de error en la consola.
     *
     * @function
     * @public
     * @param {string} msg - Mensaje
     * @param {boolean=} w - Indica si se escribe el encabezado o no
     */
    this.error = function (msg, w) {
        if (cfg_verbose) {
            msg = self._format(msg);
            let $m;
            if (w) {
                $m = 'ERROR: ';
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
     * Escribe un contenido en la consola sin aplicar formato dentro de la línea.
     *
     * @function
     * @public
     * @param {object} obj - Objeto a escribir
     * @since 1.9.54
     */
    this.errorf = function (obj) {
        console.error(obj);
    };

    /**
     * Escribe un error en consola.
     *
     * @function
     * @public
     * @param {Error} exceptionmsg - Excepción
     * @param {boolean=} w - Indica si se escribe el encabezado o no
     */
    this.exception = function (exceptionmsg, w) {
        if (cfg_verbose && isRoot()) {
            let $m;
            if (w) {
                $m = 'EXCEPTION: ';
            } else {
                $m = '';
            }
            self._totalConsoleMessages -= 1; // Excepción no considera como mensaje
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
     * Muestra un mensaje de advertencia en la consola.
     *
     * @function
     * @public
     * @param {string} msg - Mensaje
     * @param {boolean=} w - Indica si se escribe el encabezado o no
     */
    this.warn = function (msg, w) {
        if (cfg_verbose) {
            msg = self._format(msg);
            let $m;
            if (w) {
                $m = 'ERROR: ';
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
     * Escribe un contenido en la consola sin aplicar formato dentro de la línea.
     *
     * @function
     * @public
     * @param {object} obj - Objeto a escribir
     * @since 1.9.54
     */
    this.warnf = function (obj) {
        console.warn(obj);
    };

    /**
     * Imprime un acerca-de en consola.
     *
     * @function
     * @public
     * @since 1.9.52
     * @ignore
     */
    this.aboutInfo = function () {
        console.log('{0} v{1} ({2})'.format(aboutinfo.productname, aboutinfo.v.version, aboutinfo.v.date));
        console.log('{0} | {1}'.format(aboutinfo.author.name, aboutinfo.author.website));
        console.log(' '); // En IE si está vacío ('') imprime un objeto
    };

}

/**
 * Almacena objeto consola de la aplicación
 * @type {AppConsole}
 * @var
 * @const
 */
const app_console = new AppConsole();