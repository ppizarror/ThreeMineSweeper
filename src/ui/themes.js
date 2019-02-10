/**
 THEMES
 Application themes

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Application themes.
 */
theme_db = {
    "default": {
        "headerBgColor": "#85c6f8", // Header background color
        "spinColor": "#ffffff", // Spinner color
        "spinLines": 11, // Spinner number of lines
        "spinScale": 0.23, // Spinner scale
        "spinShadow": "0 0 1px transparent", // Loading spinner shadow
        "spinSpeed": 1.0, // Spinner velocity
        "themeEnabled": true, // Theme is available or not
        "themeName": "Modern", // Theme name
        "tooltipTheme": "tooltipster-borderless", // Tooltip themes
    },
    "random": {
        "themeEnabled": true,
        "themeName": "Random",
    },
};

/**
 * Jquery-confirm themes.
 */
popupThemes = {
    "bootstrap": "Bootstrap",
    "dark": "Dark Theme",
    "light": "Light Theme",
    "material": "Material",
    "modern": "Modern",
    "supervan": "Supervan",
};

/**
 * Autocomplete themes, used by @src/app.js.
 *
 * @function
 * @returns {boolean}
 */
function initThemes() {

    try {
        app_console.info(lang.init_themes);
        let $themes = Object.keys(theme_db);
        let $mainkeys = Object.keys(theme_db.default);
        let $theme, $key;

        /**
         * Check each theme and extend
         */
        for (let i = 0; i < $themes.length; i += 1) {
            if ($themes[i] === 'default') {
                /* eslint no-continue: "off"*/
                continue;
            }
            $theme = theme_db[$themes[i]];
            if (isNullUndf($theme['themeName'])) {
                $theme['themeName'] = $themes[i];
            }
            if (isNullUndf($theme['themeEnabled'])) {
                $theme['themeEnabled'] = false;
            }
            for (let j = 0; j < $mainkeys.length; j += 1) {
                $key = $mainkeys[j];
                if (isNullUndf($theme[$key])) {
                    $theme[$key] = theme_db.default[$key];
                }
            }
        }

        /**
         * If random
         */
        $theme = theme_db['random'];
        for (let j = 0; j < $mainkeys.length; j += 1) {
            $key = $mainkeys[j];
            /* eslint no-use-before-define:"off" */
            if (isColor($theme[$key])) {
                $theme[$key] = getRandomColor();
            }
        }

        return true;
    } catch ($e) {
        app_console.exception($e, false);
    } finally {
    }
    return false;

}

/**
 * Apply the selected theme, used by @src/app.js.
 *
 * @function
 */
function applyTheme() {

    /**
     * ------------------------------------------------------------------------
     * Create dynamic tags
     * ------------------------------------------------------------------------
     */
    app_dom.head.append('<meta name="theme-color" content="{0}">'.format(theme.headerBgColor));
    app_dom.head.append('<meta name="msapplication-navbutton-color" content="{0}">'.format(theme.headerBgColor));
    app_dom.head.append('<meta name="apple-mobile-web-app-capable" content="yes">');
    app_dom.head.append('<meta name="apple-mobile-web-app-status-bar-style" content="{0}">'.format(theme.headerBgColor));

    /**
     * ------------------------------------------------------------------------
     * Load theme CSS
     * ------------------------------------------------------------------------
     */
    switch (theme.tooltipTheme) {
        case 'tooltipster-borderless': // noinspection HtmlUnknownTarget
            app_dom.head.append('<link rel="stylesheet" type="text/css" href="lib/tooltipster/themes/sideTip-borderless.min.css" media="screen">');
            break;
        case 'tooltipster-light': // noinspection HtmlUnknownTarget
            app_dom.head.append('<link rel="stylesheet" type="text/css" href="lib/tooltipster/themes/sideTip-light.min.css" media="screen">');
            break;
        case 'tooltipster-noir': // noinspection HtmlUnknownTarget
            app_dom.head.append('<link rel="stylesheet" type="text/css" href="lib/tooltipster/themes/sideTip-noir.min.css" media="screen">');
            break;
        case 'tooltipster-punk': // noinspection HtmlUnknownTarget
            app_dom.head.append('<link rel="stylesheet" type="text/css" href="lib/tooltipster/themes/sideTip-punk.min.css" media="screen">');
            break;
        case 'tooltipster-shadow': // noinspection HtmlUnknownTarget
            app_dom.head.append('<link rel="stylesheet" type="text/css" href="lib/tooltipster/themes/sideTip-shadow.min.css" media="screen">');
            break;
        default:
            app_console.warn(lang.popup_theme_error_load); // noinspection HtmlUnknownTarget
            app_dom.head.append('<link rel="stylesheet" type="text/css" href="lib/tooltipster/themes/sideTip-borderless.min.css" media="screen">');
            break;
    }

}