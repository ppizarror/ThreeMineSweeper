/**
 COLOR
 Color auxiliary functions.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Returns a random color.
 *
 * @function
 * @returns {string}
 */
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i += 1) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/**
 * Return true/false if string is a color.
 *
 * @function
 * @param {object} color - Color
 * @returns boolean
 */
function isColor(color) {
    return typeof color === 'string' && color.length === 7 && color[0] === '#';
}