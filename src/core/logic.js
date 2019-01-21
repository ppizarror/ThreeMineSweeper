/**
 LOGIC
 Logic operators.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Turns 1/0 into true/false.
 *
 * @function
 * @param {string | number} b - Boolean value en 1, 0
 * @returns {boolean}
 */
function binaryBoolean(b) {
    return b === 1 || b === '1';
}

/**
 * Return true if object is neither null or undefined.
 *
 * @function
 * @param {object} obj - Object
 * @returns {boolean}
 */
function notNullUndf(obj) {
    return obj !== null && obj !== undefined;
}

/**
 * Return true if object is null or undefined.
 *
 * @function
 * @param {object} obj - Object
 * @returns {boolean}
 */
function isNullUndf(obj) {
    return obj === null || obj === undefined;
}

/**
 * Return true/false if object is undefined.
 *
 * @function
 * @param {object} obj - Object
 * @returns {boolean}
 */
function isBoolean(obj) {
    /* eslint space-unary-ops:"off" */
    return typeof obj === 'boolean';
}

/**
 * Return true if object is false and not null.
 *
 * @function
 * @param {object} obj - Object
 * @returns {boolean}
 */
function isFalseNotNull(obj) {
    return isBoolean(obj) && notNullUndf(obj) && !obj
}

/**
 * Return true if object is true and not null.
 *
 * @function
 * @param {object} obj - Object
 * @returns {boolean}
 */
function isTrueNotNull(obj) {
    return isBoolean(obj) && notNullUndf(obj) && obj
}

/**
 * Return true if the object is a string.
 *
 * @function
 * @param {object} s - Object
 * @returns {boolean}
 */
function isString(s) {
    return typeof s === 'string' || s instanceof String;
}

/**
 * Return true if object is a function
 *
 * @function
 * @param {object} s - Object
 * @returns {boolean}
 */
function isFunction(s) {
    return typeof s === 'function' || s instanceof Function;
}