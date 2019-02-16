/**
 MODE LOCAL
 Uses remote server.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Enable console logging.
 * @type {boolean}
 * @const
 */
const cfg_verbose = false;

/**
 * Href score server.
 * @type {string}
 * @const
 */
const cfg_href_score = 'https://ppizarror.000webhostapp.com/tms/score.php';

/*
 * ----------------------------------------------------------------------------
 * Disables console
 * ----------------------------------------------------------------------------
(function () {
    try {
        if (!window.console) { // noinspection JSValidateTypes
        }
        let methods = ['log', 'degug', 'warn', 'info', 'dir', 'dirxml', 'trace', 'profile'];
        for (let i = 0; i < methods.length; i += 1) {
            console[methods[i]] = function () {
            };
        }
    } catch ($e) {
    } finally {
    }
})();
*/