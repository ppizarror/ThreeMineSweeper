/**
 MATH
 Funciones utilitarias matemáticas.

 @author Pablo Pizarro R. @ppizarror.com
 @license Copyright 2018-2019, no copiar o distribuír sin permiso directo del autor
 */
"use strict";

/**
 * Redondea un número.
 *
 * @function
 * @param {number} num - Número
 * @param {number} scale - Cantidad de decimales
 * @returns {number} - Número redondeado
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
 * Retorna un número random entero entre dos valores.
 *
 * @function
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {int} - Número random entero
 * @since 3.2.28
 */
function getRandomInt(min, max) {
    if (min > max) return min;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Retorna el máximo de un arreglo.
 *
 * @function
 * @param {object} numArray - Array
 * @returns {object} - Objeto máximo del array
 */
function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
}

/**
 * Chequea que un array sea numérico, comprueba tamaño.
 *
 * @function
 * @param {Array} array - Arreglo a chequear
 * @param {int} size - Tamaño a validar
 * @param {int=} posi - Posición inicial a recorrer para validar numérico
 * @param {int=} posj - Posición final a recorrer para validar numérico
 * @returns {boolean} - Indica el estado de la validación
 * @since 2.7.53
 */
function checkNumericArray(array, size, posi, posj) {

    /**
     * Chequea que sea un arreglo
     */
    if (!Array.isArray(array)) return false;

    /**
     * Verifica tamaño
     */
    let $size = array.length;
    if (isNullUndf(posi)) posi = 0;
    if (isNullUndf(posj)) posj = $size;
    if (posj > size) return false;
    if ($size !== size) return false;

    /**
     * Recorre cada objeto y comprueba que sea un número
     */
    for (let i = posi; i < posj; i += 1) {
        if (isNaN(array[i])) return false; // Si no es un número retorna
    }
    return true;

}

/**
 * Chequea que todos los elementos en un arreglo sean numéricos sobre cero.
 *
 * @function
 * @param {Array} array - Arreglo
 * @returns {boolean} - Indica el estado de la validación
 * @since 2.7.53
 */
function checkAllPositiveInArray(array) {
    for (let i = 0; i < array.length; i += 1) {
        if (array[i] <= 0) return false;
    }
    return true;
}

/**
 * Convierte un número decimal en hexadecimal.
 *
 * @function
 * @param {number} dec - Número decimal
 * @returns {string} - Número hexadecimal
 */
function dec2hex(dec) {
    return ('0' + dec.toString(16)).substr(-2);
}

/**
 * Redondea un número en términos de mod, puede ser hacia arriba o abajo.
 *
 * @function
 * @param {number} num - Número a redondear
 * @param mod
 * @param {boolean=} enable_down - Desactiva el reondeo hacia abajo
 */
function modRoundNumber(num, mod, enable_down) {
    /* eslint "no-mixed-operators":off */

    // Ve si el número es entero
    let is_int = num % 1 === 0;

    // Calcula el módulo
    let dup = (num - (parseInt(num / mod, 10) + 1) * mod) / mod; // [-, -1]
    let ddw = (num - parseInt(num / mod, 10) * mod) / mod; // [0, 1]

    // Caso de borde, número ya está redondeado
    if (ddw === 0) return num;

    if (enable_down && ddw < 0.5) { // Redonear hacia abajo
        num -= mod * ddw;
    } else {
        num -= mod * dup;
    }

    // Si era entero redondea
    if (is_int) return parseInt(num.toString(), 10);
    return num;

}

/**
 * Suma todos los números de un arreglo y retorna el resultado.
 *
 * @function
 * @param {number[]} array - Arreglo de números
 * @returns {number} - Suma de los números
 * @since 3.5.67
 */
function sumNumericArray(array) {
    let $r = 0;
    for (let i = 0; i < array.length; i += 1) {
        $r += array[i];
    }
    return $r;
}