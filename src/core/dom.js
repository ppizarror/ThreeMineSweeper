/**
 DOM
 Dom auxiliary functions.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

// noinspection JSCheckFunctionSignatures
/**
 * Get DOM objects.
 * @global
 * @since 0.1.1
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
function getElementHeight(elem) {
    try {
        // noinspection JSValidateTypes
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
function getElementWidth(elem) {
    try {
        // noinspection JSValidateTypes
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
function stopWheelEvent(e) {

    /**
     * IE7, IE8, Chrome, Safari
     */
    if (!e) e = window.event;

    /**
     * Chrome, Safari, Firefox
     */
    if (e.preventDefault) e.preventDefault();

    /**
     * IE7, IE8
     */
    e.returnValue = false;

}