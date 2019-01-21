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
 * Color shading.
 *
 * @function
 * @param {string} color - Color
 * @param {number} percent - B/W percent
 * @returns {string}
 */
function shadeColor2(color, percent) {
    let f = parseInt(color.slice(1), 16);
    let t = percent < 0 ? 0 : 255;
    let p = percent < 0 ? percent * -1 : percent;
    /* eslint no-bitwise: "off"*/
    let R = f >> 16;
    let G = f >> 8 & 0x00FF;
    let B = f & 0x0000FF;
    /* eslint no-mixed-operators: "off"*/
    return '#' + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
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

/**
 * Convert hex color to rgba.
 *
 * @function
 * @param {string} hex - Color in hex
 * @param {number=} opacity - Opacity
 * @returns {string}
 */
function convertHexColorRGBA(hex, opacity) {
    hex = hex.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    if (notNullUndf(opacity) && !isNaN(opacity)) { // Se definió la opacidad
        return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
    }
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}