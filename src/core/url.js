/**
 URL
 Auxiliary URL functions.

 @author Pablo Pizarro R. @ppizarror.com
 @license Copyright 2018-2019, no copiar o distribuír sin permiso directo del autor
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
 * Get URL param.
 *
 * @function
 * @param {string} name - Parameter name
 * @returns {string} - Parameter value
 */
function getURLParameter(name) {
    // noinspection JSConsecutiveCommasInArrayLiteral
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
}

/**
 * Changes URL param.
 *
 * @function
 * @param {string} key - Parameter name
 * @param {string} value - Parameter value
 * @since 2.1.9
 */
function changeUrlParam(key, value) {

    /**
     * Get URL and exiting params.
     */
    let baseUrl = [location.protocol, '//', location.host, location.pathname].join('');
    let urlQueryString = document.location.search;
    let params = '';

    /**
     * Turn to string
     */
    value = value.toString();

    /**
     * Limit cases
     */
    if (urlQueryString === '') {
        if (value === '' || isNullUndf(value)) {
            window.history.replaceState({}, '', baseUrl);
        } else {
            params = '?' + key + '=' + value;
            window.history.replaceState({}, '', baseUrl + params);
        }
        return;
    }

    /**
     * Turn keys into an array
     */
    if (urlQueryString.charAt(0) === '?') urlQueryString = urlQueryString.slice(1);

    /**
     * @type {Object}
     */
    let $urlkeys = urlQueryString.split('&');
    for (let i = 0; i < $urlkeys.length; i += 1) {
        $urlkeys[i] = $urlkeys[i].split('=');
    }

    /**
     * Wipes element if empty
     */
    if (value === '' || isNullUndf(value)) {
        for (let i = 0; i < $urlkeys.length; i += 1) {
            if ($urlkeys[i][0] === key) {
                if (value === '') {
                    $urlkeys.splice(i, 1);
                    break;
                }
            }
        }
    }

    /**
     * Replace or add if not found
     */
    else {
        let $found = false;
        for (let i = 0; i < $urlkeys.length; i += 1) {
            if ($urlkeys[i][0] === key) {
                $urlkeys[i][1] = value;
                $found = true;
                break;
            }
        }
        if (!$found) {
            $urlkeys.push([key, value]);
        }
    }

    /**
     * Create string
     */
    for (let i = 0; i < $urlkeys.length; i += 1) {
        $urlkeys[i] = $urlkeys[i].join('=');
    }
    $urlkeys = $urlkeys.join('&');
    if ($urlkeys !== '') $urlkeys = '?' + $urlkeys;

    /**
     * Update URL
     */
    window.history.replaceState({}, '', baseUrl + $urlkeys);

}

/**
 * Deletes all URL params.
 *
 * @function
 */
function deleteUrlParams() {
    window.history.replaceState(null, null, window.location.pathname);
}

/**
 * Get an string with all URL params.
 *
 * @function
 * @param {String} url - URL
 * @returns {String}
 */
function getAllUrlParamsString(url) {
    let parser = document.createElement('a');
    parser.href = url;
    return parser.search.substring(1);
}