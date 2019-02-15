/**
 MATH
 Auxiliary math functions.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Rounds a number.
 *
 * @function
 * @param {number} num - Number
 * @param {number=} scale - Scale
 * @returns {number}
 */
function round_number(num, scale) {
    /* eslint no-implicit-coercion:"off" */

    if (is_null_undf(scale)) scale = 0;
    if (!('' + num).includes('e')) {
        // noinspection JSCheckFunctionSignatures
        return +Number(Math.round(num + 'e+' + scale) + 'e-' + scale);
    }
    let arr = ('' + num).split('e');
    let sig = '';
    if (+arr[1] + scale > 0) {
        sig = '+';
    }
    let i = +arr[0] + 'e' + sig + (+arr[1] + scale);
    // noinspection JSCheckFunctionSignatures
    return +(Math.round(i) + 'e-' + scale);

}

/**
 * Return a random number between two dates.
 *
 * @function
 * @param {number} min - Min value
 * @param {number} max - Max value
 * @returns {int}
 */
function get_random_int(min, max) {
    if (min > max) return min;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Return the maximum value of an array.
 *
 * @function
 * @param {object} numArray - Array
 * @returns {object}
 */
function get_max_of_array(numArray) {
    return Math.max.apply(null, numArray);
}