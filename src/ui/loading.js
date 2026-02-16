/**
 LOADING
 Loading panel.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Manages full loading spinner.
 *
 * @class
 * @constructor
 * @private
 */
function FullPageLoadingSpinner() {

    /**
     * Loading spinner.
     * @type {Spinner | null}
     * @private
     */
    this._loading_spiner = null;

    /**
     * Spinner status.
     * @type {boolean}
     * @private
     */
    this._enabled = false;

    /**
     * Maximum duration of the event.
     * @type {number}
     * @private
     */
    this._maxDurationSpinner = cfg_max_time_loading_layer;

    /**
     * Thread ID.
     * @type {number}
     * @private
     */
    this._maxDurationThread = 0;

    /**
     * Change function, is enabled after {@link cfg_init_loading_layer_after} miliseconds.
     * @type {number}
     * @private
     */
    this._threadChange = -1;

    /**
     * Object pointer.
     * @type {FullPageLoadingSpinner}
     */
    const self = this;

    /**
     * Show spinner.
     *
     * @function
     */
    this.start = function () {

        // If waiting retunrs
        if (self._threadChange !== -1) return;

        // If init returns
        if (self._enabled) return;

        // Create new thread
        self._threadChange = setTimeout(function () {
            if (!self._enabled) self._load_fullpage_spinner(true);
            self._threadChange = -1;
        }, cfg_init_loading_layer_after);

    };

    /**
     * Stop spinner.
     *
     * @function
     */
    this.stop = function () {
        if (self._threadChange !== -1) {
            clearTimeout(self._threadChange);
            self._threadChange = -1;
        }
        self._load_fullpage_spinner(false);
    };

    /**
     * Show loading panel.
     *
     * @function
     * @param {boolean} checker - Set status
     * @param {Function=} callback - Callback function
     * @private
     */
    this._load_fullpage_spinner = function (checker, callback) {
        /* eslint callback-return:"off" */
        let h, hh, w, posX, posY;

        /**
         * Get page dimension
         */
        h = get_element_height(app_dom.window);
        hh = get_element_height(app_dom.body);
        hh = Math.max(h, hh) - 0.1;
        w = get_element_width(app_dom.window);
        posX = (w - 69) / 2;
        posY = (h - 69) / 2;

        /**
         * --------------------------------------------------------------------
         * Show spinner
         * --------------------------------------------------------------------
         */
        if (checker) {

            /**
             * Object has not been created
             */
            if (is_null_undf(document.getElementById('LoadingDivLayer'))) {

                // App message
                app_console.info(lang.building_full_loading_layer);

                // Add object
                app_dom.body.prepend('<div id="LoadingDivLayer" class="LoadingDivLayerClass noselect"><div class="LoadingForeground"><div class="LoadingBox"><div id="spinnerSpin"></div></div></div><div class="LoadingBackground"></div></div>');

                // Init spinner
                let opts = {
                    animation: 'spinner-line-fade-more',
                    className: 'spinner',
                    color: theme.spinColor,
                    corners: 0.95,
                    direction: 1,
                    fadeColor: 'transparet',
                    left: '50%',
                    length: 35,
                    lines: theme.spinLines,
                    position: 'absolute',
                    radius: 45,
                    rotate: 0,
                    scale: theme.spinScale,
                    shadow: theme.spinShadow,
                    speed: 1.0,
                    top: '50%',
                    width: 16,
                    zIndex: 2e9,
                };
                this._spinnerContainer = document.getElementById('spinnerSpin');
                self._loading_spiner = new Spinner(opts);

            }

            /**
             * Change loadingLayer geometry
             */
            let $loadinglayer = $('#LoadingDivLayer');
            $loadinglayer.css('height', String(hh) + 'px');
            $loadinglayer.find('.LoadingForeground').css('height', String(hh) + 'px');
            $loadinglayer.find('.LoadingForeground .LoadingBox').css({
                'top': String(posY) + 'px',
                'left': String(posX) + 'px',
            });
            $loadinglayer.find('.LoadingBackground').css('height', String(hh) + 'px');
            // noinspection JSValidateTypes
            $loadinglayer.fadeIn(350, function () {
                if (not_null_undf(callback)) callback();
            });

            /**
             * Init spinner
             */
            self._loading_spiner.spin(self._spinnerContainer);

            /**
             * Disable scroll
             */
            if (app_dom.body.height() > app_dom.window.height()) {
                // noinspection JSUnresolvedVariable
                $.extScrollLock.enable('loading');
            }

            /**
             * Init hide thread
             */
            if (self._maxDurationSpinner > 0) {
                self._maxDurationThread = setTimeout(function () {
                    self.stop();
                    self._maxDurationThread = 0;
                    clearTimeout(self._threadChange);
                    self._threadChange = -1;
                }, self._maxDurationSpinner * 1000);
            }

            /**
             * Set as initialized
             */
            self._enabled = true;

        }

        /**
         * --------------------------------------------------------------------
         * Hide spinner
         * --------------------------------------------------------------------
         */
        else {

            /**
             * Cancel timeout
             */
            if (self._maxDurationThread !== 0) {
                clearTimeout(self._maxDurationThread);
                self._maxDurationThread = 0;
            }

            /**
             * Hide object
             */
            $('#LoadingDivLayer').hide();

            /**
             * Stop spinner
             */
            if (not_null_undf(this._loading_spiner)) self._loading_spiner.stop();

            /**
             * Check as hidden
             */
            self._enabled = false;

            /**
             * Trigger callback
             */
            if (not_null_undf(callback)) callback();

        }

    };

    /**
     * Add resize event.
     */
    app_dom.window.on('resize.FullPageLoadingDivLayer', function (e) {
        e.preventDefault();
        if (!self._enabled) return;
        let h, hh, w, posX, posY;
        if (document.getElementById('LoadingDivLayer') !== null) {
            h = get_element_height(app_dom.window);
            hh = get_element_height(app_dom.body);
            hh = Math.max(h, hh);
            w = get_element_width(app_dom.window);
            posX = (w - 69) / 2;
            posY = (h - 69) / 2;
            let $loadinglayer = $('#LoadingDivLayer');
            $loadinglayer.css({
                height: String(hh) + 'px',
            });
            $loadinglayer.find('> .LoadingForeground').css({
                height: String(hh) + 'px',
            });
            $loadinglayer.find('> .LoadingBackground').css({
                height: String(hh) + 'px',
            });
            $loadinglayer.find('> .LoadingForeground > .LoadingBox').css({
                left: String(posX) + 'px',
            });
            $('.LoadingBox').css({
                'left': posX + 'px',
                'top': posY + 'px',
            });
        }

    });

}

/**
 * Init loading object.
 * @type {FullPageLoadingSpinner}
 * @private
 */
const _app_loading_layer = new FullPageLoadingSpinner();

/**
 * Loading handler.
 *
 * @function
 * @param {boolean} status - Show or hide loading layer
 * @returns {boolean}
 */
function loadingHandler(status) {
    if (!status) {
        _app_loading_layer.stop();
    } else {
        _app_loading_layer.start();
    }
    return true;
}