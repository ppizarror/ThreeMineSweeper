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
     * Init notification engine
     * ------------------------------------------------------------------------
     */
    NotificationJS.init({
        "core": cfg_notification_core,
        "enabled": true,
        "exceptionTitle": "Exception",
        "maxStack": cfg_max_notification_stack,
        "timeout": cfg_notification_timeout,
    });

    /**
     * ------------------------------------------------------------------------
     * Init viewer
     * ------------------------------------------------------------------------
     */
    loadingHandler(true);

});