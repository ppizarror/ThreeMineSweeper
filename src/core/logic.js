/**
 LOGIC
 Logic operators.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Return true if object is neither null or undefined.
 *
 * @function
 * @param {object} obj - Object
 * @returns {boolean}
 */
function not_null_undf(obj) {
    return obj !== null && obj !== undefined;
}

/**
 * Return true if object is null or undefined.
 *
 * @function
 * @param {object} obj - Object
 * @returns {boolean}
 */
function is_null_undf(obj) {
    return obj === null || obj === undefined;
}

/**
 * Return true if the object is a string.
 *
 * @function
 * @param {object} s - Object
 * @returns {boolean}
 */
function is_string(s) {
    return typeof s === 'string' || s instanceof String;
}