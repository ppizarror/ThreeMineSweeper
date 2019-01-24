/**
 CORE GLOBALS
 Global variables.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Cookies.
 * @global
 */
let sessionCookie;

/**
 * Stores total ajax time queries.
 * @type {Date}
 * @global
 * @ignore
 */
let ajaxStartTime;

/**
 * Tolerance used by the application.
 * @global
 * @type {number}
 */
let MIN_TOL = 1e-12;