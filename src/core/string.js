/**
 STRING
 Auxilary string functions.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Remove an HTML tag.
 *
 * @function
 * @param {string} $text - HTML text
 * @param {string} $tag - Tag to delete
 * @returns {string}
 */
function removeHTMLTag($text, $tag) {
    let $regex = '<[\\/]{0,1}({0}|{1})[^><]*>'.format($tag.toLowerCase(), $tag.toUpperCase());
    return $text.replace(new RegExp($regex, 'g'), '');
}

/**
 * Removes a tag and it's content.
 *
 * @function
 * @param {string} $text - HTML text
 * @param {string} $tag - Tag to delete
 * @returns {string}
 */
function removeAllHTMLTag($text, $tag) {
    let $regex = '<{0}>[\\s\\S]*?<\\/{0}>'.format($tag);
    $text = $text.replace(new RegExp($regex, 'g'), '');
    return removeHTMLTag($text, $tag);
}

/**
 * Parse string to object.
 *
 * @function
 * @param {string} s - String to convert.
 * @return {string | number | boolean}
 */
function parseStringToType(s) {

    /**
     * String conversion
     * @type {string}
     */
    s = s.toString();

    /**
     * String is a number
     */
    // noinspection JSCheckFunctionSignatures
    if (!isNaN(s)) {
        if (s.indexOf('.') !== -1) {
            return parseFloat(s);
        }
        return parseInt(s, 10);
    }

    /**
     * String is boolean
     */
    let $bool = s.toLowerCase();
    if ($bool === 'true') {
        return true;
    } else if ($bool === 'false') {
        return false;
    }
    return s;

}

/**
 * Natural comparision
 *
 * @function
 * @param {string} a - String a
 * @param {String} b - String b
 * @returns {number}
 */
function naturalCompareStrings(a, b) {
    /* eslint "no-extra-parens":off */

    let ax = [];
    let bx = [];

    a.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
        ax.push([$1 || Infinity, $2 || ''])
    });
    b.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
        bx.push([$1 || Infinity, $2 || ''])
    });

    let an, bn, nn;
    while (ax.length && bx.length) {
        an = ax.shift();
        bn = bx.shift();
        nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
        if (nn) return nn;
    }

    return ax.length - bx.length;
}