/**
 URL
 Auxiliary URL functions.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Get URL params.
 *
 * @function
 * @param name - Element name
 * @returns {string | null}
 */
$.urlParam = function (name) {
    let results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results === null) {
        return null;
    }
    return decodeURI(results[1]) || 0;
};

/**
 * Deletes all URL params.
 *
 * @function
 */
function deleteUrlParams() {
    window.history.replaceState(null, null, window.location.pathname);
}