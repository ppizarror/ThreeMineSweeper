/**
 THEMES
 Application themes

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Temas de la aplicación
 */
theme_db = {
    "default": {
        "backgroundColor": "#3e3e3e", // Background color
        "backToTopScrollPxTrigger": 300, // Pixel to show back to top button
        "backToTopShow": true, // Show back to top button
        "backToTopSize": [50, 65], // Size back to top button
        "headerBgColor": "#24292e", // Header background color
        "headerFontColor": "#ffffff", // Text header color
        "headerPosition": "fixed", // Header position <fixed, absolute>
        "maxWebWidth": "75rem", // Max page width
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
 * Jquery-confirm themes
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
 * @ignore
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
 * @ignore
 */
function applyTheme() {

    /**
     * ------------------------------------------------------------------------
     * Apply CSS
     * ------------------------------------------------------------------------
     */
    app_dom.body.css({
        'background-color': theme.backgroundColor,
    });
    app_dom.root.css({
        'max-width': theme.maxWebWidth,
    });
    app_dom.header.css({
        'background-color': theme.headerBgColor,
        'position': theme.headerPosition,
    });

    /**
     * ------------------------------------------------------------------------
     * Change header opacity
     * ------------------------------------------------------------------------
     */
    setTimeout(function () {
        app_dom.header.css('opacity', 1.0);
    }, 1500);

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
        case 'tooltipster-borderless':
            app_dom.head.append('<link rel="stylesheet" type="text/css" href="lib/tooltipster/themes/sideTip-borderless.min.css" media="screen">');
            break;
        case 'tooltipster-light':
            app_dom.head.append('<link rel="stylesheet" type="text/css" href="lib/tooltipster/themes/sideTip-light.min.css" media="screen">');
            break;
        case 'tooltipster-noir':
            app_dom.head.append('<link rel="stylesheet" type="text/css" href="lib/tooltipster/themes/sideTip-noir.min.css" media="screen">');
            break;
        case 'tooltipster-punk':
            app_dom.head.append('<link rel="stylesheet" type="text/css" href="lib/tooltipster/themes/sideTip-punk.min.css" media="screen">');
            break;
        case 'tooltipster-shadow':
            app_dom.head.append('<link rel="stylesheet" type="text/css" href="lib/tooltipster/themes/sideTip-shadow.min.css" media="screen">');
            break;
        default:
            app_console.warn(lang.popup_theme_error_load);
            app_dom.head.append('<link rel="stylesheet" type="text/css" href="lib/tooltipster/themes/sideTip-borderless.min.css" media="screen">');
            break;
    }

}