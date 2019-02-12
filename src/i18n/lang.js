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
 * Application language.
 * @type {string}
 * @global
 */
let cfg_lang = 'en';

/**
 * Available languages.
 * @const
 * @global
 */
const lang_available = ['en', 'es', 'fr', 'ru'];


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

    /**
     * Autocomplete languages
     */
    let $lng;
    let $en_keys = Object.keys(lang_db.en);
    let $keys;
    for (let i = 0; i < lang_available.length; i += 1) {
        $lng = lang_available[i];

        // eslint-disable-next-line no-continue
        if ($lng === 'en') continue;

        // Autocomplete language
        $keys = Object.keys(lang_db[$lng]);
        if (isNullUndf($keys)) lang_db[$lng] = lang_db.en;
        for (let j = 0; j < $en_keys.length; j += 1) {
            if (!$keys.includes($en_keys[j])) {
                lang_db[$lng][$en_keys[j]] = lang_db.en[$en_keys[j]];
                // eslint-disable-next-line no-console
                console.warn('Language {0} does not contain key {1}, extending from english'.format($lng, $en_keys[j]));
            }
        }

    }

});