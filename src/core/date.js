/**
 DATE
 Colección de funciones asociadas al manejos de fechas.

 @author Pablo Pizarro R. @ppizarror.com
 @license Copyright 2018-2019, no copiar o distribuír sin permiso directo del autor
 */
"use strict";

/**
 * Objeto de fecha.
 *
 * @class
 * @constructor
 * @param {object} options - Objeto fecha
 * @since 1.7.8
 */
function DateElement(options) {
    /* eslint no-mixed-operators:"off" */
    /* eslint no-use-before-define:"off" */

    /**
     * Fecha
     * @type {Date}
     * @private
     * @ignore
     */
    this._date = options.date;

    /**
     * Día
     * @type {int}
     * @private
     * @ignore
     */
    this._day = options.day;

    /**
     * Hora
     * @type {int}
     * @private
     * @ignore
     */
    this._hour = options.hour;

    /**
     * Minuto
     * @type {int}
     * @private
     * @ignore
     */
    this._min = options.min;

    /**
     * Número de mes
     * @type {int}
     * @private
     * @ignore
     */
    this._month = options.month;

    /**
     * Segundo
     * @type {int}
     * @private
     * @ignore
     */
    this._sec = options.sec;

    /**
     * Año
     * @type {int}
     * @private
     * @ignore
     */
    this._year = options.year;

    /**
     * Retorna la fecha.
     *
     * @function
     * @public
     * @returns {Date}
     * @since 1.7.8
     */
    this.getDate = function () {
        return this._date;
    };

    /**
     * Retorna la fecha privada en un string.
     *
     * @function
     * @public
     * @returns {string}
     * @since 1.7.8
     */
    this.getDayString = function () {
        return dateFormat(this._date, cfg_date_format_private_d);
    };

    /**
     * Retorna la fecha pública en un string.
     *
     * @function
     * @public
     * @returns {string}
     * @since 2.0.05
     */
    this.getDayStringPublic = function () {
        return dateFormat(this._date, cfg_date_format_public_d);
    };

    /**
     * Retorna la hora.
     *
     * @function
     * @public
     * @returns {string}
     * @since 1.9.22
     */
    this.getTime = function () {
        return dateFormat(this._date, cfg_date_format_private_h);
    };

    /**
     * Retorna la hora pública.
     *
     * @function
     * @public
     * @returns {string}
     * @since 2.0.05
     */
    this.getTimePublic = function () {
        return dateFormat(this._date, cfg_date_format_public_h);
    };

    /**
     * Retorna el segundo.
     *
     * @function
     * @public
     * @returns {int}
     * @since 1.7.8
     */
    this.getSec = function () {
        return this._sec;
    };

    /**
     * Retorna el minuto.
     *
     * @function
     * @public
     * @returns {int}
     * @since 2.7.42
     */
    this.getMin = function () {
        return this._min;
    };

    /**
     * Retorna la hora.
     *
     * @function
     * @public
     * @returns {int}
     * @since 1.7.8
     */
    this.getHour = function () {
        return this._hour;
    };

    /**
     * Retorna el día.
     *
     * @function
     * @public
     * @returns {int}
     * @since 1.7.8
     */
    this.getDay = function () {
        return this._day;
    };

    /**
     * Retorna el mes.
     *
     * @function
     * @public
     * @returns {int}
     * @since 1.7.8
     */
    this.getMonth = function () {
        return this._month;
    };

    /**
     * Retorna el año.
     *
     * @function
     * @public
     * @returns {int}
     * @since 1.7.8
     */
    this.getYear = function () {
        return this._year;
    };

}

/**
 * Crea un objeto de fecha.
 *
 * @function
 * @param {string | number} day - Día
 * @param {string | number} month - Mes
 * @param {string | number} year - Año
 * @param {string | number} hour - Hora
 * @param {string | number} min - Minuto
 * @param {string | number} sec - Segundo
 * @returns {DateElement} - Retorna objeto con fechas
 * @since 0.2.5
 */
function createDateElement(day, month, year, hour, min, sec) {

    /**
     * Parsea las variables
     */
    day = parseInt(day, 10);
    month = parseInt(month, 10);
    year = parseInt(year, 10);
    hour = parseInt(hour, 10);
    min = parseInt(min, 10);
    sec = parseInt(sec, 10);

    /**
     * Crea el {@link DateElement}
     */
    return new DateElement({
        date: new Date(year, month, day, hour, min, sec),
        day: day,
        hour: hour,
        min: min,
        month: month,
        sec: sec,
        year: year,
    });

}

/**
 * Convierte un objeto date desde el servidor al local.
 *
 * @function
 * @param {object} date - Objeto tipo DateElement
 * @returns {DateElement} - Objeto local tipo DateElement
 * @since 0.3.2
 */
function dateElementParser(date) {
    return createDateElement(date.day, date.month - 1, date.year, date.hour, date.min, date.sec);
}

/**
 * Crea una fecha random entre el día actual y el principio de año.
 *
 * @function
 * @returns {DateElement} - Fecha random
 * @since 0.4.1
 */
function getRandomDateElement() {

    /**
     * Genera una fecha random
     * @function
     * @param {Date} start - Fecha inicial
     * @param {Date} end - Fecha final
     * @returns {Date} - Fecha random
     */
    function randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    let d = randomDate(new Date(2018, 0, 1), new Date());
    return createDateElement(d.getDate(), d.getMonth(), d.getFullYear(), d.getHours(), d.getMinutes(), d.getSeconds());

}

/**
 * Retorna los segundos entre dos fechas.
 *
 * @function
 * @param {Date} finish - Fecha final
 * @param {Date} init - Fecha inicial
 * @returns {number} - Número de segundos
 * @since 1.9.36
 */
function getSecondsBetween(finish, init) {
    return (finish.getTime() - init.getTime()) / 1000;
}

/**
 * Retorna los segundos desde una fecha.
 * @function
 * @param {Date} time - Fecha inicial
 * @returns {number} - Número de segundos
 * @since 1.9.36
 */
function getSecondsFrom(time) {
    return getSecondsBetween(new Date(), time);
}

/**
 * Formatea una fecha con un formato específico.
 *
 * @function
 * @param {Date} date - Fecha
 * @param {string} format - Formato
 * @returns {string} - Fecha formateada
 * @since 1.9.44
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