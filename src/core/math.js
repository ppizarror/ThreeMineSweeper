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
 * @param {number} scale - Scale
 * @returns {number}
 */
function roundNumber(num, scale) {
    /* eslint no-implicit-coercion:"off" */

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
function getRandomInt(min, max) {
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
function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
}

/**
 * Check if array is numeric.
 *
 * @function
 * @param {Array} array - Array to check
 * @param {int} size - Size to validate
 * @param {int=} posi - Initial position
 * @param {int=} posj - End position
 * @returns {boolean}
 */
function checkNumericArray(array, size, posi, posj) {

    /**
     * Check is an array
     */
    if (!Array.isArray(array)) return false;

    /**
     * Check size
     */
    let $size = array.length;
    if (isNullUndf(posi)) posi = 0;
    if (isNullUndf(posj)) posj = $size;
    if (posj > size) return false;
    if ($size !== size) return false;

    /**
     * Checks each object
     */
    for (let i = posi; i < posj; i += 1) {
        if (isNaN(array[i])) return false; // If not number returns
    }
    return true;

}

/**
 * Check all the elements of an array are positive.
 *
 * @function
 * @param {Array} array - Array
 * @returns {boolean}
 */
function checkAllPositiveInArray(array) {
    for (let i = 0; i < array.length; i += 1) {
        if (array[i] <= 0) return false;
    }
    return true;
}