/**
 DIALOGS
 Dialog administrator.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Application dialogs using Jquery-Confirm.
 *
 * @class
 * @constructor
 * @private
 */
function AppDialog() {

    /**
     * Stores all configurations.
     */
    this.options = {
        animation: {
            BOTTOM: 'bottom',
            LEFT: 'left',
            NONE: 'none',
            OPACITY: 'opacity',
            RIGHT: 'right',
            ROTATE: 'rotate',
            ROTATEX: 'rotateX',
            ROTATEXR: 'rotateXR',
            ROTATEY: 'rotateY',
            ROTATEYR: 'rotateYR',
            SCALE: 'scale',
            SCALEX: 'scaleX',
            SCALEY: 'scaleY',
            TOP: 'top',
            ZOOM: 'zoom',
        },
        buttons: {
            BLUE: 'btn-blue',
            DANGER: 'btn-danger',
            DEFAULT: 'btn-default',
            ERROR: 'btn-default', // btn-red
            INFO: 'btn-info',
            NONE: '',
            OTHER: 'btn-default',
            PRIMARY: 'btn-primary',
            PURPLE: 'btn-purple',
            SUCCESS: 'btn-success',
            WARNING: 'btn-warning',
        },
        icons: {
            ERROR: 'fas fa-times',
            DEFAULT: '',
            INFO: 'fas fa-info-circle',
            NONE: '',
            OTHER: '',
            PURPLE: '',
            SUCCESS: 'fas fa-check-circle',
            WARNING: 'fas fa-exclamation-triangle',
        },
        size: {
            SMALL: 'DIALOG-SMALL',
            NORMAL: 'DIALOG-NORMAL',
            LARGE: 'DIALOG-LARGE',
            FULL: 'DIALOG-FULL',
        },
        type: {
            ERROR: 'red',
            DEFAULT: '',
            INFO: 'blue',
            NONE: '',
            OTHER: 'dark',
            PURPLE: 'purple',
            SUCCESS: 'green',
            WARNING: 'orange',
        },
    };

    /**
     * Stores last popup content.
     * @private
     */
    this._last = {
        destroyed: true,
        md5: '',
        object: null,
        options: null,
    };

    /**
     * Close last after opening a new dialog.
     * @type {boolean}
     * @private
     */
    this._close_last = false;

    /**
     * Object pointer.
     * @type {AppDialog}
     * @private
     */
    let self = this;

    /**
     * Text dialog and close button (confirmButton).
     *
     * @function
     * @param {string} text
     * @param {string=} title
     * @param {object=} options
     */
    this.text = function (text, title, options) {

        /**
         * Default values
         */
        if (isNullUndf(options)) options = {};
        if (isNullUndf(title)) title = '';

        /**
         * Build parameters
         */
        let $defaults = {
            close: null,
            closeButtonClass: this.options.buttons.DEFAULT,
            closeText: lang.close_message,
        };
        options = $.extend($defaults, options);

        /**
         * Check options are OK
         */
        if (notNullUndf(options['close']) && !(options['close'] instanceof Function)) {
            app_console.warn(lang.dialog_error_button_function_null.format(options['closeText'].toUpperCase()));
            options['close'] = null;
        }

        options['cancelText'] = null;
        options['onClose'] = options['close'];
        options['confirmButtonClass'] = options['closeButtonClass'];
        options['confirmText'] = options['closeText'];
        delete options['close'];
        delete options['closeButtonClass'];
        delete options['closeText'];

        /**
         * Crate text
         */
        this._create_dialog(title, text, options);

    };

    /**
     * Error dialog
     *
     * @function
     * @param {string} title
     * @param {string} content
     * @param {object=} options
     */
    this.error = function (title, content, options) {
        this._ewsio_type(title, content, this.options.type.ERROR, this.options.icons.ERROR, this.options.buttons.ERROR, options);
    };

    /**
     * Information dialog.
     *
     * @function
     * @param {string} title
     * @param {string} content
     * @param {object=} options
     */
    this.info = function (title, content, options) {
        this._ewsio_type(title, content, this.options.type.INFO, this.options.icons.INFO, this.options.buttons.INFO, options);
    };

    /**
     * Warning dialog.
     *
     * @function
     * @param {string} title
     * @param {string} content
     * @param {object=} options
     */
    this.warning = function (title, content, options) {
        this._ewsio_type(title, content, this.options.type.WARNING, this.options.icons.WARNING, this.options.buttons.WARNING, options);
    };

    /**
     * Success dialog.
     *
     * @function
     * @param {string} title
     * @param {string} content
     * @param {object=} options
     */
    this.success = function (title, content, options) {
        this._ewsio_type(title, content, this.options.type.SUCCESS, this.options.icons.SUCCESS, this.options.buttons.SUCCESS, options);
    };

    /**
     * Other dialog.
     *
     * @function
     * @param {string} title
     * @param {string} content
     * @param {object=} options
     */
    this.other = function (title, content, options) {
        this._ewsio_type(title, content, this.options.type.OTHER, this.options.icons.OTHER, this.options.buttons.OTHER, options);
    };

    /**
     * Trows and (E)rror, (W)arning, (S)uccess, (I)nfo, (O)ther dialog.
     *
     * @function
     * @param {string} title
     * @param {string} content
     * @param {string} type
     * @param {string} icon
     * @param {string} buttonClass
     * @param {object=} options
     * @private
     */
    this._ewsio_type = function (title, content, type, icon, buttonClass, options) {

        /**
         * Default params
         */
        if (isNullUndf(options)) options = {};

        /**
         * Build parameters
         */
        let $defaults = {
            close: null,                        // Close function
            closeButtonClass: buttonClass,      // Button class
            closeText: lang.close_message,      // Confirm text
            icon: icon,                         // Icon
            size: this.options.size.SMALL,      // Dialog size
            type: type,                         // Dialog type
            typeAnimated: true,                 // Animated dialog
        };
        options = $.extend($defaults, options);

        /**
         * Check paramaters are OK
         */
        if (notNullUndf(options['close']) && !(options['close'] instanceof Function)) {
            app_console.warn(lang.dialog_error_button_function_null.format(options['closeText'].toUpperCase()));
            options['close'] = null;
        }

        options['cancelText'] = null;
        options['onClose'] = options['close'];
        options['confirmButtonClass'] = options['closeButtonClass'];
        options['confirmText'] = options['closeText'];
        delete options['close'];
        delete options['closeButtonClass'];
        delete options['closeText'];

        /**
         * Creates dialog
         */
        this._create_dialog(title, content, options);

    };

    /**
     * Throws an information popup.
     *
     * @function
     * @param {string} title
     * @param {string} content
     * @param {object=} options
     */
    this.confirm = function (title, content, options) {

        /**
         * Default options
         */
        if (isNullUndf(options)) options = {};

        /**
         * Build parameters
         */
        let $defaults = {
            backgroundDismiss: false,
            closeIcon: false,
            draggable: false,
            escapeCancelKey: false,
            size: this.options.size.SMALL
        };
        options = $.extend($defaults, options);

        /**
         * Confirm dialog
         */
        this._create_dialog(title, content, options);

    };

    /**
     * Form dialog, requires two functions that are triggered one the form has been submitted
     * (submit) or cancelled (cancel).
     *
     * @function
     * @param {string} title
     * @param {string} content
     * @param {function} submit
     * @param {function | null} cancel
     * @param {object=} options
     */
    this.form = function (title, content, submit, cancel, options) {

        /**
         * Default variables
         */
        if (isNullUndf(options)) options = {};
        if (isNullUndf(cancel)) cancel = function () {
        };

        /**
         * If submit function is null
         */
        if (isNullUndf(submit)) {
            app_console.warn(lang.dialog_form_submit_null);
            submit = function () {
            };
        }

        /**
         * Build parameters
         */
        let $defaults = {
            backgroundDismiss: false,
            cancelButtonClass: this.options.buttons.DEFAULT,
            cancelText: lang.dialog_form_cancel,
            closeIcon: false,
            closeAfterSubmit: true,
            escapeCancelKey: false,
            submitButtonClass: this.options.buttons.BLUE,
            submitText: lang.dialog_form_send,
        };
        options = $.extend($defaults, options);

        /**
         * Dialog closes after send
         */
        if (options['closeAfterSubmit']) {
            let $prevsubmit = submit;
            submit = function () {
                $prevsubmit();
                let jc = this;
                jc.close();
            };
        }

        options['confirm'] = submit;
        options['cancel'] = cancel;
        options['confirmButtonClass'] = options['submitButtonClass'];
        options['confirmText'] = options['submitText'];
        delete options['submitButtonClass'];
        delete options['submitText'];

        /**
         * onContentReady function
         */
        let $contentReady = function () {
        };
        if (notNullUndf(options['onContentReady']) && options['onContentReady'] instanceof Function) {
            $contentReady = options['onContentReady'];
        }
        options['onContentReady'] = function () {
            $contentReady();

            // Get content
            let $cnt = null;

            // Method 1, uses this
            let jc = this;
            if (notNullUndf(jc) && jc.hasOwnProperty('$content')) {
                $cnt = jc.$content;
            }

            // Method 2, uses DOM
            if (isNullUndf($cnt)) {
                $cnt = $('.jconfirm-content');
            }

            // If null returns
            if (isNullUndf($cnt)) return;
            let $form = $cnt.find('form');
            $form.on('submit', function (e) {
                e.preventDefault();
                if (isNullUndf(jc)) return;
                // noinspection JSUnresolvedVariable
                jc.$$confirm.trigger('click');
            });
        };

        /**
         * Create confirm dialog
         */
        this._create_dialog(title, content, options);

    };

    /**
     * Creates a dialog.
     *
     * @function
     * @param {string} title
     * @param {string} content
     * @param {object} $options
     * @private
     */
    this._create_dialog = function (title, content, $options) {

        /**
         * If close last
         */
        if (self._close_last) self.close_last();

        /**
         * Creation dialogs build parameters
         */
        let __$defaults = {
            animateFromElement: false,              // Animates from element
            animation: this.options.animation.ZOOM, // Open animation
            animationBounce: 1,                     // 1,0 enables bounce
            animationSpeed: 400,                    // Animation speed
            backgroundDismiss: 'close',             // Click outside popup
            buttonMaxLength: 30,                    // Max button length
            cancel: null,                           // Function if cancel
            cancelButtonClass: this.options.buttons.DEFAULT, // Cancel button class
            cancelText: lang.answer_no,             // Cancel text
            closeAnimation: this.options.animation.ZOOM, // Close animation
            closeIcon: true,                        // Close icon
            confirm: null,                          // Confirm function
            confirmButtonClass: this.options.buttons.BLUE, // Confirm button style
            confirmText: lang.answer_yes,           // Confirm text
            disableSelect: false,                   // Disables text select
            draggable: true,                        // Popup can be dragged
            dragWindowGap: 0,                       // Border between window and popup
            escapeCancelKey: true,                  // Escape button event
            forceCursorDefault: false,              // Force cursor focus
            icon: this.options.icons.DEFAULT,       // Title icon
            lazyOpen: false,                        // If true opens .open_last()
            onClose: null,                          // Triggered after close popup
            onContentReady: null,                   // Trigerred after content is ready
            onDestroy: null,                        // Triggered after destroy popup
            onOpen: null,                           // Triggered after open popup
            onOpenBefore: null,                     // Triggered before open popup
            size: this.options.size.NORMAL,         // Popup size
            type: this.options.type.DEFAULT,        // Popup animation
            typeAnimated: false,                    // Animates or not
            useBootstrap: false,                    // Use boostrap
            watchInterval: 100,                     // Watch events interval (ms)
        };

        /**
         * Extends default parameters
         */
        $options = $.extend(__$defaults, $options);

        /**
         * Updates params
         */
        if ($options.escapeCancelKey) $options.escapeCancelKey = 'cancel';
        if (!$options.typeAnimated) delete $options['type'];
        if (isNullUndf($options.icon)) $options.icon = this.options.icons.DEFAULT;

        /**
         * Deletes dangerous variables
         */
        if (notNullUndf($options.close)) delete $options['close'];
        if (notNullUndf($options.open)) delete $options['open'];

        /**
         * Apply other configurations
         */
        $options['theme'] = cfg_popup_theme;

        /**
         * Create buttons
         */
        let $button = {};

        // Confirm
        if (notNullUndf($options.confirmText) && $options.confirmText !== '') {
            $options.confirmText = $options.confirmText.toString();
            if ($options.confirmText.length > $options.buttonMaxLength) {
                $options.confirmText = $options.confirmText.substring(0, $options.buttonMaxLength - 3) + '&hellip;';
            }
            if (notNullUndf($options.confirm) && !($options.confirm instanceof Function)) {
                app_console.warn(lang.dialog_error_button_function_null.format($options.confirmText.toUpperCase()));
                $options.confirm = null;
            }
            $button['confirm'] = {
                action: $options.confirm,
                btnClass: $options.confirmButtonClass,
                keys: ['y', 'enter'],
                text: $options.confirmText,
            };
        }

        // Cancel
        if (notNullUndf($options.cancelText) && $options.cancelText !== '') {
            $options.cancelText = $options.cancelText.toString();
            if ($options.cancelText.length > $options.buttonMaxLength) {
                $options.cancelText = $options.cancelText.substring(0, $options.buttonMaxLength - 3) + '&hellip;';
            }
            if (notNullUndf($options.cancel) && !($options.cancel instanceof Function)) {
                app_console.warn(lang.dialog_error_button_function_null.format($options.cancelText.toUpperCase()));
                $options.cancel = null;
            }
            $button['cancel'] = {
                action: $options.cancel,
                btnClass: $options.cancelButtonClass,
                keys: ['n'],
                text: $options.cancelText,
            };
        }

        // Save buttons
        $options['buttons'] = $button;

        /**
         * Set title and content
         */
        if (notNullUndf(title) && title !== '') $options['title'] = title;
        if (notNullUndf(content) && content !== '') $options['content'] = content;

        /**
         * Set functions
         */
        if (isNullUndf($options['onClose']) || !($options['onClose'] instanceof Function)) {
            $options['onClose'] = function () {
            };
        }
        if (isNullUndf($options['onContentReady']) || !($options['onContentReady'] instanceof Function)) {
            $options['onContentReady'] = function () {
            };
        }
        if (isNullUndf($options['onDestroy']) || !($options['onDestroy'] instanceof Function)) {
            $options['onDestroy'] = function () {
            };
        }
        if (isNullUndf($options['onOpen']) || !($options['onOpen'] instanceof Function)) {
            $options['onOpen'] = function () {
            };
        }
        if (isNullUndf($options['onOpenBefore']) || !($options['onOpenBefore'] instanceof Function)) {
            $options['onOpenBefore'] = function () {
            };
        }

        /**
         * Creates functions once the content is ready
         */
        let $prevContentReadyFnc = $options['onContentReady'];
        $options['onContentReady'] = function () {

            // Trigger original funciton
            $prevContentReadyFnc();

            // Get jconfirm
            let $jconfirm = $('.jconfirm-box');

            // Apply noselect
            if ($options.disableSelect) {
                $jconfirm.addClass('noselect');
            }

            // Apply default cursor
            if ($options.forceCursorDefault) {
                $jconfirm.addClass('jconfirm-default-cursor');
            }

        };

        /**
         * Add function that sets last popup as destroyed
         */
        let $destroy = $options['onDestroy'];
        $options['onDestroy'] = function () {
            $destroy();
        };

        /**
         * Set popup size
         */
        self._dialog_size($options);

        /**
         * Check md5
         */
        let $md5options = $.extend({}, $options);
        delete $md5options['boxWidth'];
        delete $md5options['size'];
        let $md5 = md5(JSON.stringify($options));

        /**
         * If last popup has the same md5 tne returns
         */
        // noinspection JSValidateTypes
        if (notNullUndf(this._last.object) && this._last.md5 === $md5 && !this._last.object.isClosed()) {
            app_console.info(lang.dialog_last_closed_equal_opened);
            self.close_last();
        }

        /**
         * Crates popup
         */
        let $confirm = $.confirm($options);
        app_console.info(lang.dialog_popup_created.format($md5));

        /**
         * Saves last popup
         */
        this._last.md5 = $md5;
        // noinspection JSValidateTypes
        this._last.$options = $options;
        // noinspection JSUnresolvedVariable
        this._last.object = $confirm;

    };

    /**
     * Check dialog size
     *
     * @function
     * @private
     * @param {Object} $options
     */
    this._dialog_size = function ($options) {

        /**
         * Get page width
         * @type {number}
         */
        let $width = getElementWidth(app_dom.window);

        switch ($options['size']) {
            case this.options.size.SMALL:
                if ($width <= 350) {
                    $options['boxWidth'] = '95%';
                } else if ($width <= 400) {
                    $options['boxWidth'] = '57%';
                } else if ($width <= 500) {
                    $options['boxWidth'] = '53%';
                } else if ($width <= 600) {
                    $options['boxWidth'] = '48%';
                } else if ($width <= 700) {
                    $options['boxWidth'] = '43%';
                } else if ($width <= 800) {
                    $options['boxWidth'] = '38%';
                } else if ($width <= 900) {
                    $options['boxWidth'] = '35%';
                } else if ($width <= 1000) {
                    $options['boxWidth'] = '31%';
                } else {
                    $options['boxWidth'] = '30%';
                }
                break;
            case this.options.size.NORMAL:
                if ($width <= 350) {
                    $options['boxWidth'] = '95%';
                } else if ($width <= 400) {
                    $options['boxWidth'] = '67%';
                } else if ($width <= 500) {
                    $options['boxWidth'] = '60%';
                } else if ($width <= 600) {
                    $options['boxWidth'] = '58%';
                } else if ($width <= 700) {
                    $options['boxWidth'] = '54%';
                } else if ($width <= 800) {
                    $options['boxWidth'] = '50%';
                } else if ($width <= 900) {
                    $options['boxWidth'] = '46%';
                } else if ($width <= 1000) {
                    $options['boxWidth'] = '44%';
                } else {
                    $options['boxWidth'] = '37%';
                }
                break;
            case this.options.size.LARGE:
                if ($width <= 350) {
                    $options['boxWidth'] = '95%';
                } else if ($width <= 400) {
                    $options['boxWidth'] = '85%';
                } else if ($width <= 500) {
                    $options['boxWidth'] = '78%';
                } else if ($width <= 600) {
                    $options['boxWidth'] = '74%';
                } else if ($width <= 700) {
                    $options['boxWidth'] = '71%';
                } else if ($width <= 800) {
                    $options['boxWidth'] = '67%';
                } else if ($width <= 900) {
                    $options['boxWidth'] = '63%';
                } else if ($width <= 1000) {
                    $options['boxWidth'] = '60%';
                } else {
                    $options['boxWidth'] = '55%';
                }
                break;
            case this.options.size.FULL:
                $options['boxWidth'] = '95%';
                break;
            default:
                app_console.warn(lang.app_dialog_unknown_size.format($options['size']));
                $options['useBootstrap'] = true;
                delete $options['size'];
                break;
        }

    };

    /**
     * Close last dialog.
     *
     * @function
     */
    this.close_last = function () {
        if (notNullUndf(self._last.object)) self._last.object.close();
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Open last dialog.
     *
     * @function
     */
    this.open_last = function () {
        if (notNullUndf(self._last.object)) self._last.object.open();
    };

    /**
     * Enable close last after opening a new dialog.
     *
     * @function
     */
    this.enable_close_last = function () {
        self._close_last = true;
    };

}

/**
 * Dialog administrator.
 * @type {AppDialog}
 * @const
 * @global
 */
const app_dialog = new AppDialog();
app_dialog.enable_close_last();