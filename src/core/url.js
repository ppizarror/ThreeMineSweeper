/**
 URL
 Funciones utilitarias administración de direcciones.

 @author Pablo Pizarro R. @ppizarror.com
 @license Copyright 2018-2019, no copiar o distribuír sin permiso directo del autor
 */
"use strict";

/**
 * Obtiene parámetros de la url.
 *
 * @function
 * @param name - Nombre del elemento
 * @returns {string | null}
 * @since 1.0.0
 */
$.urlParam = function (name) {
    let results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results === null) {
        return null;
    }
    return decodeURI(results[1]) || 0;
};

/**
 * Obtiene parámetro url.
 *
 * @function
 * @param {string} name - Nombre del parámetro
 * @returns {string} - Valor del parámetro
 * @since 1.0.0
 */
function getURLParameter(name) {
    // noinspection JSConsecutiveCommasInArrayLiteral
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
}

/**
 * Cambia el parámetro de la url.
 *
 * @function
 * @param {string} key - Nombre del parámeto
 * @param {string} value - Valor del parámetro
 * @since 2.1.9
 */
function changeUrlParam(key, value) {

    /**
     * Se obtiene la url y los parámetros existentes
     */
    let baseUrl = [location.protocol, '//', location.host, location.pathname].join('');
    let urlQueryString = document.location.search;
    let params = '';

    /**
     * Pasa el valor a un string
     */
    value = value.toString();

    /**
     * Casos de borde
     */
    if (urlQueryString === '') {
        if (value === '' || isNullUndf(value)) {
            window.history.replaceState({}, '', baseUrl);
        } else {
            params = '?' + key + '=' + value;
            window.history.replaceState({}, '', baseUrl + params);
        }
        return;
    }

    /**
     * Separa los keys en un arreglo
     */
    if (urlQueryString.charAt(0) === '?') urlQueryString = urlQueryString.slice(1);

    /**
     * @type {Object}
     */
    let $urlkeys = urlQueryString.split('&');
    for (let i = 0; i < $urlkeys.length; i += 1) {
        $urlkeys[i] = $urlkeys[i].split('=');
    }

    /**
     * Si el valor es '' se borra el elemento
     */
    if (value === '' || isNullUndf(value)) {
        for (let i = 0; i < $urlkeys.length; i += 1) {
            if ($urlkeys[i][0] === key) {
                if (value === '') {
                    $urlkeys.splice(i, 1);
                    break;
                }
            }
        }
    }

    /**
     * Se reemplaza o se añade si no se encontró
     */
    else {
        let $found = false;
        for (let i = 0; i < $urlkeys.length; i += 1) {
            if ($urlkeys[i][0] === key) {
                $urlkeys[i][1] = value;
                $found = true;
                break;
            }
        }
        if (!$found) {
            $urlkeys.push([key, value]);
        }
    }

    /**
     * Se arma el string
     */
    for (let i = 0; i < $urlkeys.length; i += 1) {
        $urlkeys[i] = $urlkeys[i].join('=');
    }
    $urlkeys = $urlkeys.join('&');
    if ($urlkeys !== '') $urlkeys = '?' + $urlkeys;

    /**
     * Se actualiza la url
     */
    window.history.replaceState({}, '', baseUrl + $urlkeys);

}

/**
 * Elimina todos los parámetros de la url.
 *
 * @function
 * @since 1.0.0
 */
function deleteUrlParams() {
    window.history.replaceState(null, null, window.location.pathname);
}

/**
 * Obtiene un string con todos los parámetros de la url.
 *
 * @function
 * @param {String} url - La url
 * @returns {String} - String con los parámetros de la url
 * @since 2.5.0
 */
function getAllUrlParamsString(url) {
    let parser = document.createElement('a');
    parser.href = url;
    return parser.search.substring(1);
}