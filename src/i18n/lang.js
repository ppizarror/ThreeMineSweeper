/**
 LANG
 Language configuration.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */

/**
 * ----------------------------------------------------------------------------
 * Sección configurable idiomas
 * ----------------------------------------------------------------------------
 */

/**
 * Application language
 * @type {string}
 * @global
 * @ignore
 */
let cfg_lang = 'en';

/**
 * Available languages
 * @const
 * @private
 * @ignore
 */
const lang_available = ['en'];


/**
 * ----------------------------------------------------------------------------
 * Variables and functions non configurable
 * ----------------------------------------------------------------------------
 */

/**
 * Pointer to loaded language {@link lang_db}
 * @var
 * @global
 */
let lang;

/**
 * Lang database
 * @var
 * @global
 */
let lang_db = {};

/**
 * Checks cookie language
 */
$(function () {

    /**
     * If not exists the cookie is created
     */
    let $langvalue = Cookies.get('lang');
    if ($langvalue === undefined) {
        Cookies.set('lang', cfg_lang);
        $langvalue = cfg_lang;
    }

    /**
     * If lang exists the cookie is updated
     */
    if (lang_available.indexOf($langvalue) !== -1) {
        cfg_lang = $langvalue;
    } else {
        Cookies.set('lang', cfg_lang);
    }

});