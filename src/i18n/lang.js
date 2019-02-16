/**
 LANG
 Language manager.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * ----------------------------------------------------------------------------
 * Configurable section
 * ----------------------------------------------------------------------------
 */

/**
 * Available languages.
 * @type {string[]}
 * @const
 */
const lang_available = ['en', 'es', 'fr', 'ru', 'br', 'de'];


/**
 * ----------------------------------------------------------------------------
 * Variables and functions non configurable
 * ----------------------------------------------------------------------------
 */

/**
 * Lang database.
 * @global
 */
let lang_db = {};

/**
 * Check languages definition.
 * @type {boolean}
 */
let check_lang_onload = false;

/**
 * Return default language from navigator settings, if not valid returns english (en).
 *
 * @function
 * @returns {string}
 */
function get_default_language() {

    // https://tools.ietf.org/html/rfc5646
    let get_first_browser_language = function () {
        let nav = window.navigator,
            browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'],
            i,
            language;

        // Support for HTML 5.1 "navigator.languages"
        if (Array.isArray(nav.languages)) {
            for (i = 0; i < nav.languages.length; i += 1) {
                language = nav.languages[i];
                if (language && language.length) {
                    return language;
                }
            }
        }

        // Support for other well known properties in browsers
        for (i = 0; i < browserLanguagePropertyKeys.length; i += 1) {
            language = nav[browserLanguagePropertyKeys[i]];
            if (language && language.length) {
                return language;
            }
        }
        return null;
    };

    let $lang = get_first_browser_language();
    let $langk = $lang.split('-');
    if ($langk.length > 1) $lang = $langk[0];
    $lang = $lang.toString().toLowerCase();

    // Check if language exists, if not use default english
    if (lang_available.includes($lang)) return $lang;
    return 'en';

}

/**
 * ----------------------------------------------------------------------------
 * Autocomplete languages
 * ----------------------------------------------------------------------------
 */
if (check_lang_onload) {
    $(function () {
        let $lng;
        let $en_keys = Object.keys(lang_db.en);
        let $keys;
        for (let i = 0; i < lang_available.length; i += 1) {
            $lng = lang_available[i];

            // eslint-disable-next-line no-continue
            if ($lng === 'en') continue;

            // Autocomplete language
            $keys = Object.keys(lang_db[$lng]);
            if (is_null_undf($keys)) lang_db[$lng] = lang_db.en;
            for (let j = 0; j < $en_keys.length; j += 1) {
                if (!$keys.includes($en_keys[j])) {
                    lang_db[$lng][$en_keys[j]] = lang_db.en[$en_keys[j]];
                    // eslint-disable-next-line no-console
                    console.warn('Language {0} does not contain key {1}, extending from english'.format($lng, $en_keys[j]));
                }
            }

        }
    });
}