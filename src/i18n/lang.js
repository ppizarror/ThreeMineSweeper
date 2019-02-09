/**
 LANG
 Language manager.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */

/**
 * ----------------------------------------------------------------------------
 * Configurable section
 * ----------------------------------------------------------------------------
 */

/**
 * Application language
 * @type {string}
 * @global
 */
let cfg_lang = 'en';

/**
 * Available languages
 * @const
 * @private
 */
const lang_available = ['en'];


/**
 * ----------------------------------------------------------------------------
 * Variables and functions non configurable
 * ----------------------------------------------------------------------------
 */

/**
 * Lang database.
 * @var
 * @global
 */
let lang_db = {};

/**
 * Check cookie language
 */
$(function () {

    /**
     * If the cookie not exists then it's created
     */
    let $lang_value = Cookies.get('lang');
    if ($lang_value === undefined) {
        Cookies.set('lang', cfg_lang);
        $lang_value = cfg_lang;
    }

    /**
     * If lang exists the cookie is updated
     */
    if (lang_available.indexOf($lang_value) !== -1) {
        cfg_lang = $lang_value;
    } else {
        Cookies.set('lang', cfg_lang);
    }

});