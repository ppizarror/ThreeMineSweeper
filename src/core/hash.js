/**
 HASH
 Hash functions.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Generates random ID.
 *
 * @function
 * @returns {string} - Random string
 */
function generateID() {
    /* eslint no-bitwise:"off" */
    /* eslint no-extra-parens:"off" */
    /* eslint no-mixed-operators:"off" */
    /* eslint no-use-before-define:"off" */
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0;
        let v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Calculate a 32 bit FNV-1a hash.
 * Found here: https://gist.github.com/vaiorabbit/5657561
 * Ref.: http://isthe.com/chongo/tech/comp/fnv/
 *
 * @function
 * @param {string} str - the input value
 * @param {boolean} [asString=false] - set to true to return the hash value as
 *     8-digit hex string instead of an integer
 * @param {number} [seed] - optionally pass the hash of the previous chunk
 * @returns {number | string}
 * @since 3.7.44
 */
function hashFnv32a(str, asString, seed) {
    /* eslint "no-bitwise":off */
    let i, l;
    let hval = seed === undefined ? 0x811c9dc5 : seed;

    for (i = 0, l = str.length; i < l; i += 1) {
        hval ^= str.charCodeAt(i);
        hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
    }
    if (asString) {
        return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
    }
    return hval >>> 0;
}