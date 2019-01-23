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
 */
let app_dom = {
    body: null,
    document: $(document),
    head: null,
    header: null,
    html: null,
    root: null,
    window: $(window),
};

$(function () {
    app_dom.body = $('body');
    app_dom.head = $('head');
    app_dom.header = $('#header');
    app_dom.html = $('html');
    app_dom.root = $('#root');
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