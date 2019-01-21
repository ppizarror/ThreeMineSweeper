/**
 POLYFILLS
 Extiende funciones y comportamientos básicos a la aplicación.

 @author Pablo Pizarro R. @ppizarror.com
 @license Copyright 2018-2019, no copiar o distribuír sin permiso directo del autor
 */
"use strict";

/**
 * ----------------------------------------------------------------------------
 * Number, Math
 * ----------------------------------------------------------------------------
 */

/**
 * Extiende number epsilon
 */
if (Number.EPSILON === undefined) {
    Number.EPSILON = Math.pow(2, -52);
}

/**
 * Polyfills isInteger
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
 */
if (Number.isInteger === undefined) {
    Number.isInteger = function (value) {
        return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
    };
}

/**
 * Signo
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign
 */
if (Math.sign === undefined) {
    Math.sign = function (x) {
        /* eslint no-extra-parens:"off" */
        /* eslint no-implicit-coercion:"off" */
        /* eslint no-nested-ternary:"off" */
        return (x < 0) ? -1 : (x > 0) ? 1 : +x;
    };
}


/**
 * ----------------------------------------------------------------------------
 * Object
 * ----------------------------------------------------------------------------
 */

/**
 * Name en prototipe
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
 */
if ('name' in Function.prototype === false) {
    /* eslint no-extend-native:"off" */
    Object.defineProperty(Function.prototype, 'name', {
        get: function () {
            return this.toString().match(/^\s*function\s*([^(\s]*)/)[1];
        }
    });
}

/**
 * Assign
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */
if (Object.assign === undefined) {
    (function () {
        /* eslint prefer-rest-params:"off" */
        Object.assign = function (target) {
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }
            let output = Object(target);

            for (let index = 1; index < arguments.length; index += 1) {
                let source = arguments[index];
                if (source !== undefined && source !== null) {
                    for (let nextKey in source) {
                        if (Object.prototype.hasOwnProperty.call(source, nextKey)) {
                            output[nextKey] = source[nextKey];
                        }
                    }
                }
            }

            return output;
        };
    })();
}


/**
 * ----------------------------------------------------------------------------
 * Extiende String
 * ----------------------------------------------------------------------------
 */

/**
 * Format
 */
if (!String.prototype.format) {
    // @returns {string}
    String.prototype.format = function () {
        let args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] !== 'undefined' ? args[number] : match;
        });
    };
}

/**
 * Reemplazar un string.
 *
 * @function
 * @returns {string}
 */
String.prototype.replaceAll = function (search, replacement) {
    let target = this;
    if (replacement === null || replacement === undefined) replacement = '';
    return target.replace(new RegExp(search, 'g'), replacement);
};

/**
 * Capitaliza string, primer carácter es en mayúsculas.
 *
 * @function
 * @returns {string}
 */
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};


/**
 * ----------------------------------------------------------------------------
 * Extiende Array
 * ----------------------------------------------------------------------------
 */

/**
 * Agrega push si es único.
 *
 * @function
 * @param item - Elemento a añadir
 * @returns {boolean} - Indica si el elemento fue añadido o no
 */
Array.prototype.pushUnique = function (item) {
    if (this.indexOf(item) === -1) {
        this.push(item);
        return true;
    }
    return false;
};


/**
 * ----------------------------------------------------------------------------
 * Date
 * ----------------------------------------------------------------------------
 */

/**
 * Añade obtener número de la semana.
 *
 * @function
 * @returns {number} - Número de la semana
 */
Date.prototype.getWeekNumber = function () {
    /* eslint no-extend-native:"off" */
    /* eslint no-extra-parens:"off" */
    let d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    let dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
};