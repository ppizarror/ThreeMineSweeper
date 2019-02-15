/**
 APP
 Init appplication.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * App game.
 * @type {ThreeMineSweeper}
 * @global
 * @const
 */
const app_tms = new ThreeMineSweeper();

/**
 * Pointer to loaded language {@link lang_db}.
 * @global
 */
let lang;

/**
 * Cookies.
 * @global
 */
let sessionCookie;

/**
 * App init.
 */
$(function () {

    /**
     * ------------------------------------------------------------------------
     * Show about information
     * ------------------------------------------------------------------------
     */
    app_console.aboutInfo();

    /**
     * ------------------------------------------------------------------------
     * Load cookies
     * ------------------------------------------------------------------------
     */
    sessionCookie = getSessionCookie();
    if (isNullUndf(sessionCookie)) {
        app_console.error("Cookies cannot be loaded");
        return;
    }
    updateSessionCookie();

    /**
     * ------------------------------------------------------------------------
     * Load language
     * ------------------------------------------------------------------------
     */
    lang = lang_db[sessionCookie.lang];

    /**
     * ------------------------------------------------------------------------
     * Init main modules
     * ------------------------------------------------------------------------
     */
    app_console.info(lang.init_app);
    app_error.init();

    /**
     * ------------------------------------------------------------------------
     * Init application theme
     * ------------------------------------------------------------------------
     */
    try {
        initThemes();
    } catch ($e) {
        app_console.exception($e);
        app_error.errorID(app_error.error.errorThemeInit);
        return;
    } finally {
    }
    if (Object.keys(theme_db).indexOf(sessionCookie.theme) !== -1) {
        theme = theme_db[sessionCookie.theme];
        cfg_app_theme = sessionCookie.theme;
    } else {
        sessionCookie.theme = cfg_app_theme;
        theme = theme_db[sessionCookie.theme];
        updateSessionCookie();
        app_error.errorID(app_error.error.themeNotExist);
    }
    app_console.info(lang.loading_theme.format(cfg_app_theme)); // Display loaded theme on console
    try {
        applyTheme();
    } catch ($e) {
        app_console.exception($e);
        app_error.errorID(app_error.error.errorThemeApply);
        return;
    } finally {
    }

    /**
     * ------------------------------------------------------------------------
     * Init notification engine
     * ------------------------------------------------------------------------
     */
    NotificationJS.init({
        'core': cfg_notification_core,
        'enabled': cfg_notification_enabled,
        'exceptionTitle': lang.exception_title,
        'maxStack': cfg_max_notification_stack,
        'timeout': cfg_notification_timeout,
    });

    /**
     * ------------------------------------------------------------------------
     * Check if test mode
     * ------------------------------------------------------------------------
     */
    app_console.info(lang.page_init_load_time.format(getSecondsFrom($init_time_app_load)));
    if (app_mode_test) {
        app_console.info(lang.init_test_mode);
        return;
    }

    /**
     * ------------------------------------------------------------------------
     * Init viewer
     * ------------------------------------------------------------------------
     */
    deleteUrlParams();
    setTimeout(function () {
        app_tms.init('#viewer');
        app_tms.load_menu();
    }, 150);

});