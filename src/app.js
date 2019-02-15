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
 * Import all libraries
 */
app_library_manager.import_all_libraries();

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
    sessionCookie = get_session_cookie();
    if (is_null_undf(sessionCookie)) {
        app_console.error("Cookies cannot be loaded");
        return;
    }
    update_session_cookie();

    /**
     * ------------------------------------------------------------------------
     * Load language
     * ------------------------------------------------------------------------
     */
    lang = lang_db[sessionCookie.lang];
    app_console.info(lang.page_init_load_time.format(get_seconds_from($init_time_app_load)));

    /**
     * ------------------------------------------------------------------------
     * Init main modules
     * ------------------------------------------------------------------------
     */
    app_console.info(lang.init_app);
    app_error.init();
    app_library_manager.disable_hold_ready();
    app_library_manager.set_app_initialized();
    app_library_manager.get_imported_libraries(cfg_verbose);

    /**
     * ------------------------------------------------------------------------
     * Init application theme
     * ------------------------------------------------------------------------
     */
    try {
        initThemes();
    } catch ($e) {
        app_console.exception($e);
        app_error.error_id(app_error.error.errorThemeInit);
        return;
    } finally {
    }
    if (Object.keys(theme_db).indexOf(sessionCookie.theme) !== -1) {
        theme = theme_db[sessionCookie.theme];
        cfg_app_theme = sessionCookie.theme;
    } else {
        sessionCookie.theme = cfg_app_theme;
        theme = theme_db[sessionCookie.theme];
        update_session_cookie();
        app_error.error_id(app_error.error.themeNotExist);
    }
    app_console.info(lang.loading_theme.format(cfg_app_theme)); // Display loaded theme on console
    try {
        applyTheme();
    } catch ($e) {
        app_console.exception($e);
        app_error.error_id(app_error.error.errorThemeApply);
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
    if (app_mode_test) {
        app_console.info(lang.init_test_mode);
        return;
    }

    /**
     * ------------------------------------------------------------------------
     * Init viewer
     * ------------------------------------------------------------------------
     */
    delete_url_params();
    setTimeout(function () {
        app_tms.init('#viewer');
        app_tms.load_menu();
    }, 150);
    after_load_imports();

});