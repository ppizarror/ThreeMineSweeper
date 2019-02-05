/**
 APP
 Init appplication.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * App viewer.
 * @type {TMSViewer}
 * @global
 */
let app_viewer = new TMSViewer();

/**
 * App init
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
     * Init main modules
     * ------------------------------------------------------------------------
     */
    app_console.info(lang.init_app);
    app_error.init(); // Init app errors

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
        'exceptionTitle': lang.exception,
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
    loadingHandler(true);
    deleteUrlParams();
    app_viewer.init('#viewer');

    let $fig = 3; // Draw figure
    setTimeout(function () {
        let g;
        switch ($fig) {
            case 0:
                g = new BasicCube();
                break;
            case 1:
                g = new BasicPyramid();
                break;
            case 2:
                g = new CrossFractal();
                break;
            case 3:
                g = new SierpinskiCube();
                break;
            case 4:
                g = new SierpinskiTriangle();
                break;
            case 5:
                g = new RandomPlane();
                break;
            case 6:
                g = new Sphere();
                break;
            case 7:
                g = new Cylinder();
                break;
            default:
                return;
        }
        g.set_order(2);
        g.set_face_target(20);
        g.set_latitude(30);
        g.set_longitude(30);
        g.generate(-1, -1, -1, 1, 1, 1);
        g.start();
    }, 500);

});