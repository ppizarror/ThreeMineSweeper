/**
 LANG
 Language configuration.

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