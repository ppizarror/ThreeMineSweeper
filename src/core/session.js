/**
 SESSION
 User session.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Save session status.
 *
 * @function
 * @returns {boolean}
 */
function updateSessionCookie() {
    try {
        if (!cfg_cookie_local) {
            Cookies.set(cfg_cookie_session_id, sessionCookie, {
                expires: cfg_cookie_expire_days
            });
        } else {
            localStorage.setItem(cfg_cookie_session_id, JSON.stringify(sessionCookie));
        }
        return true;
    } catch ($e) {
    } finally {
    }
    return false;
}

/**
 * Extend default values to user cookies.
 *
 * @function
 * @param {object} $session - Session value
 */
function extendDefaultSessionValues($session) {
    $.extend($session, {

        /**
         * App settings
         */
        theme_app: cfg_app_theme,       // App theme
        theme_popup: cfg_popup_theme,   // Popups theme

        /**
         * User data
         */
        profilepic: '',                 // Profile picture
        userid: -1,                     // User ID
        username: '',                   // User name

    });
}

/**
 * Load session cookies.
 *
 * @function
 * @returns {object} - Cookies
 */
function loadSessionCookies() {

    /**
     * Load cookies
     */
    let c = Cookies.get(cfg_cookie_session_id);
    if (!notNullUndf(c)) {

        /**
         * Default values
         */
        let defvalue = {
            lang: cfg_lang,
        };
        extendDefaultSessionValues(defvalue);

        /**
         * If cookies are local then uses localStorage
         */
        if (cfg_cookie_local) {
            app_console.info(app_error.error.cookiesDisabled.usingLocalStorage);
            try {
                c = localStorage.getItem(cfg_cookie_session_id);
            } catch (e) {
                return null;
            } finally {
            }
            if (!notNullUndf(c)) {
                localStorage.setItem(cfg_cookie_session_id, JSON.stringify(defvalue));
                c = localStorage.getItem(cfg_cookie_session_id);
            }
            c = JSON.parse(c);
            return c;
        }

        /**
         * Check errors
         */
        Cookies.set(cfg_cookie_session_id, defvalue, {
            expires: cfg_cookie_expire_days,
            path: '/',
        });
        c = Cookies.get(cfg_cookie_session_id);

        /**
         * If cookies cannot be save on browser
         */
        if (!notNullUndf(c)) {
            return null;
        }

        /**
         * Return cookies
         */
        try {
            return JSON.parse(c);
        } catch (e) {
            return defvalue;
        } finally {
        }
    }

    /**
     * Fallback
     */
    return JSON.parse(c);

}

/**
 * Returns session cookie.
 *
 * @function
 * @returns {object}
 */
function getSessionCookie() {
    return loadSessionCookies();
}