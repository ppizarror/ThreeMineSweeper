/**
 ERRORS
 Manages aplication errors.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Manages application errors.
 *
 * @class
 * @constructor
 * @private
 */
function AppError() {
    /* eslint no-use-before-define:"off" */

    /**
     * Error database.
     */
    this.error = {
        "langNotExist": {
            "code": 0,
            "id": "langNotExist",
            "moreinfo": "cfg_lang settings is incorrect, reload application to reset configuration",
            "msg": "Bad language setting",
        },
        "cookiesDisabled": {
            "code": 1,
            "id": "cookiesDisabled",
            "moreinfo": "This browser cannot save cookies",
            "msg": "Cannot save cookies",
            "other": "Set cfg_cookie_local to true",
            "usingLocalStorage": "Cookies are disabled, using localStorage",
        },
        "errorThemeInit": {
            "code": 2,
        },
        "themeNotExist": {
            "code": 3,
        },
        "errorThemeApply": {
            "code": 4,
        }
    };

    /**
     * Set error messages after lang loaded, used by @src/app.js.
     *
     * @function
     */
    this.init = function () {

        let errid = Object.keys(this.error);
        let i, j, lng;
        for (i = 0; i < errid.length; i += 1) {
            j = errid[i];
            if (this.error[j].code > 1) {
                lng = lang['errordb_{0}_msg'.format(j)];
                if (isNullUndf(lng)) {
                    lang['errordb_{0}_msg'.format(j)] = 'Error ' + this.error[j].code;
                    lng = lang['errordb_{0}_msg'.format(j)];
                    app_console.warn(lang.error_errordb_langinit_msg.format(j));
                }
                this.error[j].msg = lng;
                lng = lang['errordb_{0}_moreinfo'.format(j)];
                if (isNullUndf(lng)) {
                    lang['errordb_{0}_moreinfo'.format(j)] = lang.error_errordb_langinit_defaultmsg;
                    lng = lang['errordb_{0}_moreinfo'.format(j)];
                    app_console.warn(lang.error_errordb_langinit_moreinfo.format(j));
                }
                this.error[j].moreinfo = lng;
                this.error[j].id = j;
            }
        }

    };

    /**
     * Writes an generic error with an exception.
     *
     * @function
     * @param {object} errorid - app_error.error object
     * @param {Error=} exceptionmsg - Exception object
     */
    this.throwExceptionID = function (errorid, exceptionmsg) {
        app_console.error('Error #{0} <{2}>: {1}.'.format(errorid.code, errorid.msg, errorid.id), false);
        if (notNullUndf(exceptionmsg)) app_console.exception(exceptionmsg);
        if (cfg_always_show_err_notification) this.errorMessage(errorid);
    };

    /**
     * Writes an error ID.
     *
     * @function
     * @param {object} errorid - app_error.error object
     */
    this.errorID = function (errorid) {
        app_error.throwExceptionID(errorid, null);
        if (cfg_always_show_err_notification) this.errorMessage(errorid);
    };

    /**
     * Throws an error notification.
     *
     * @function
     * @param {object} errorid - app_error.error object
     */
    this.errorMessage = function (errorid) {
        NotificationJS.error(errorid.msg);
        if (cfg_verbose) {
            /* eslint no-console:"off" */
            console.error('Error #{0} <{2}>: {1}'.format(errorid.code, errorid.msg, errorid.id));
        }
    };

}

/**
 * Admin application errors.
 * @type {AppError}
 * @const
 * @global
 */
const app_error = new AppError();