/**
 DOM
 Dom auxiliary functions.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Get DOM objects.
 * @global
 */
let app_dom = {
    body: null,
    document: $(document),
    head: null,
    html: null,
    window: $(window),
};

$(function () {
    app_dom.body = $('body');
    app_dom.head = $('head');
    app_dom.html = $('html');
});

/**
 * Return element height in pixels.
 *
 * @function
 * @param {Object} elem - Jquery element.
 * @returns {number} - Height
 */
function get_element_height(elem) {
    try {
        return elem.outerHeight();
    } catch (e) {
        return -1;
    } finally {
    }
}

/**
 * Return element width in pixels.
 *
 * @function
 * @param {Object} elem - Jquery element.
 * @returns {number} - Width
 */
function get_element_width(elem) {
    try {
        return elem.outerWidth();
    } catch (e) {
        return -1;
    } finally {
    }
}

/**
 * Disable scroll.
 *
 * @function
 * @param {object} e - Scrollwheel event
 */
function stop_wheel_event(e) {
    if (!e) { // noinspection JSDeprecatedSymbols
        e = window.event;
    } // IE7, IE8, Chrome, Safari
    if (e.preventDefault) e.preventDefault(); // Chrome, Safari, Firefox
    e.returnValue = false; // IE7, IE8
}