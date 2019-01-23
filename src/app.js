/**
 APP
 Init appplication.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

$(function () {

    /**
     * ------------------------------------------------------------------------
     * Show about information
     * ------------------------------------------------------------------------
     */
    app_console.aboutInfo();

    /**
     * ------------------------------------------------------------------------
     * Load language
     * ------------------------------------------------------------------------
     */
    lang = lang_db[cfg_lang];

    /**
     * ------------------------------------------------------------------------
     * Load cookies
     * ------------------------------------------------------------------------
     */
    sessionCookie = getSessionCookie();
    if (isNullUndf(sessionCookie)) {
        app_console.error(lang.error_cookie_load);
        return;
    }
    updateSessionCookie();

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
        updateSessionCookie();
        app_error.errorID(app_error.error.themeNotExist);
        return;
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
        'enabled': true,
        'exceptionTitle': lang.exception,
        'maxStack': cfg_max_notification_stack,
        'timeout': cfg_notification_timeout,
    });

    /**
     * ------------------------------------------------------------------------
     * Init viewer
     * ------------------------------------------------------------------------
     */
    loadingHandler(true);

});