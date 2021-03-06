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
function update_session_cookie() {
    try {
        if (!cfg_cookie_local) {
            Cookies.set(cfg_cookie_session_id, sessionCookie, {
                expires: cfg_cookie_expire_days,
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
 * Load session cookies.
 *
 * @function
 * @returns {object} - Cookies
 */
function load_session_cookie() {

    // Load cookies
    let c = Cookies.get(cfg_cookie_session_id);
    if (!not_null_undf(c)) {
        let defvalue = { // Default values
        };
        $.extend(defvalue, {

            /**
             * App settings
             */
            lang: cfg_lang,                 // App lang
            theme_app: cfg_app_theme,       // App theme
            theme_popup: cfg_popup_theme,   // Popups theme

            /**
             * User data
             */
            profilepic: '',                 // Profile picture
            userid: -1,                     // User ID
            username: '',                   // User name

        });

        // If cookies are local then uses localStorage
        if (cfg_cookie_local) {
            app_console.info(app_error.error.cookiesDisabled.usingLocalStorage);
            try {
                c = localStorage.getItem(cfg_cookie_session_id);
            } catch (e) {
                return null;
            } finally {
            }
            if (!not_null_undf(c)) {
                localStorage.setItem(cfg_cookie_session_id, JSON.stringify(defvalue));
                c = localStorage.getItem(cfg_cookie_session_id);
            }
            c = JSON.parse(c);
            return c;
        }

        // Check errors
        Cookies.set(cfg_cookie_session_id, defvalue, {
            expires: cfg_cookie_expire_days,
            path: '/',
        });
        c = Cookies.get(cfg_cookie_session_id);

        // If cookies cannot be save on browser
        if (!not_null_undf(c)) return null;

        // Return cookies
        try {
            return JSON.parse(c);
        } catch (e) {
            return defvalue;
        } finally {
        }
    }

    // Fallback
    return JSON.parse(c);

}