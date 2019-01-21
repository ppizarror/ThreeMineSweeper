/**
 DATE
 Date auxiliar functions.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Seconds between two dates.
 *
 * @function
 * @param {Date} finish - End date
 * @param {Date} init - Start date
 * @returns {number} - Number of seconds
 */
function getSecondsBetween(finish, init) {
    return (finish.getTime() - init.getTime()) / 1000;
}

/**
 * Return the seconds after an initial date.
 *
 * @function
 * @param {Date} time - Init date
 * @returns {number} - Number of seconds
 */
function getSecondsFrom(time) {
    return getSecondsBetween(new Date(), time);
}

/**
 * Format a date.
 *
 * @function
 * @param {Date} date - Date to format
 * @param {string} format - Target format
 * @returns {string} - Formatted date
 */
function dateFormat(date, format) {
    let $datestring = date.toString();
    let $splitted = $datestring.split(' ');
    let $newstrdate = '';
    for (let i = 0; i < Math.min(6, $splitted.length); i += 1) {
        $newstrdate += $splitted[i] + ' ';
    }
    // noinspection JSUnresolvedVariable
    return $.format.date($newstrdate, format);
}