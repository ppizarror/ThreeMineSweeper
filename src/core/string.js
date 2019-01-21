/**
 STRING
 Funciones utilitarias asociadas al manejo de strings.

 @author Pablo Pizarro R. @ppizarror.com
 @license Copyright 2018-2019, no copiar o distribuír sin permiso directo del autor
 */
"use strict";

/**
 * Borra un tag desde un string que contiene texto HTML.
 *
 * @function
 * @param {string} $text - Texto con HTML
 * @param {string} $tag - Tag a borrar
 * @returns {string} - Texto con el tag borrado
 * @since 3.2.38
 */
function removeHTMLTag($text, $tag) {
    let $regex = '<[\\/]{0,1}({0}|{1})[^><]*>'.format($tag.toLowerCase(), $tag.toUpperCase());
    return $text.replace(new RegExp($regex, 'g'), '');
}

/**
 * Borra un tag y su contenido.
 *
 * @function
 * @param {string} $text - Texto con HTML
 * @param {string} $tag - Tag a borrar
 * @returns {string} - Texto con el tag borrado
 * @since 3.2.38
 */
function removeAllHTMLTag($text, $tag) {
    let $regex = '<{0}>[\\s\\S]*?<\\/{0}>'.format($tag);
    $text = $text.replace(new RegExp($regex, 'g'), '');
    return removeHTMLTag($text, $tag);
}

/**
 * Función que convierte un string a algún tipo de dato si cumple.
 *
 * @function
 * @param {string} s - String a convertir
 * @return {string | number | boolean} - String convertido
 * @since 3.4.12
 */
function parseStringToType(s) {

    /**
     * Forza conversión a string
     * @type {string}
     */
    s = s.toString();

    /**
     * El string es un número
     */
    // noinspection JSCheckFunctionSignatures
    if (!isNaN(s)) {

        // Es un flotante
        if (s.indexOf('.') !== -1) {
            return parseFloat(s);
        }
        return parseInt(s, 10);

    }

    /**
     * El string es un booleano
     */
    let $bool = s.toLowerCase();
    if ($bool === 'true') {
        return true;
    } else if ($bool === 'false') {
        return false;
    }

    /**
     * Finalmente es un string
     */
    return s;

}

/**
 * Compara dos strigs con números.
 *
 * @function
 * @param {string} a - String a
 * @param {String} b - String b
 * @returns {number} - Indica si se debe mover o no
 * @since 3.7.53
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