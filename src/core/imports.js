/**
 CORE IMPORTS
 Library imports.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */
"use strict";

/**
 * Library admin.
 *
 * @class
 * @constructor
 * @private
 */
function LibraryManager() {

    /**
     * Manager libraries.
     */
    this.lib = {
        __LANG__: 'app_lang',
        AMARANJS: 'amaranJS',
        ANIMATE: 'animateCSS',
        ASRANGE: 'asRange',
        BACKTOTOP: 'jquery-backToTop',
        BOOTSTRAP: 'bootstrap',
        BOOTSTRAPJS: 'bootstrap-js',
        BOWSER: 'bowser',
        BPASSWDTOGGLER: 'bootstrap-password-toggler',
        CHARTJS: 'Chartjs',
        CONTEXTMENU: 'contextMenu',
        D3: 'd3',
        DATATABLES: 'dataTables',
        DATATABLESBT4: 'dataTables.bootstrap4',
        DATEPICKER: 'datepicker',
        DATGUI: 'dat.gui',
        DBIP: 'dbip',
        DELAUNATOR: 'delaunator',
        EARCUT: 'earcut',
        EASYTIMER: 'easytimer',
        FILESAVERJS: 'filesaver.js',
        FONTAWESOME: 'fontAwesome',
        FORMVALIDATOR: 'formvalidator',
        FORMVALIDATORLANG: 'formvalidator-lang',
        GLTFEXPORTER: 'threejs-GLTFExporter',
        GOJS: 'gojs',
        HAMMER: 'hammer',
        HOVERCSS: 'hover.css',
        IONRANGESLIDER: 'ion.rangeSlider',
        IONSOUND: 'ion.sound',
        JQUERYCONFIRM: 'jquery-confirm',
        JQUERYNICESELECT: 'jquery-nice-select',
        JQUERYTIMEAGO: 'jquery-timeago',
        JQUERYTOAST: 'jquery.toast',
        JQVMAP: 'jqvmap',
        MD5: 'md5',
        MENTIONSINPUT: 'jquery-mentions-input',
        MMENU: 'mmenu',
        MOUSEWHEEL: 'jquery.mousewheel',
        MULTISELECT: 'multiselect',
        NORMALIZE: 'normalize.css',
        NOTIFICATIONJS: 'notification.js',
        OBJEXPORTER: 'threejs-OBJExporter',
        ORBITCONTROLS: 'Orbitcontrols',
        POPPER: 'popper',
        RIPPLER: 'rippler',
        SCROLLLOCK: 'jquery-scrollLock',
        SELECT2: 'select2',
        SHA1: 'sha1',
        SIMPLEPAGINATION: 'simplePagination',
        SPIN: 'spin',
        STATS: 'stats',
        THREEJS: 'threejs',
        TINYMCE: 'tinyMCE',
        TJSPROJECTOR: 'threejs-projector',
        TOASTR: 'toastr',
        TOOLTIPSTER: 'tooltipster',
        TWBSPAGINATION: 'twbs-pagination',
        UIPOSITION: 'jquery.ui.position',
        UNDERSCORE: 'underscore',
        VALIDATORJS: 'validator.js',
    };

    /**
     * Enables ajax cache.
     */
    $.ajaxSetup({
        cache: true,
    });

    /**
     * Store imported libraries.
     * @type {{}}
     * @private
     */
    this._importedLibraries = {};

    /**
     * Store imported libraries.
     * @example
     *     'libraryName1': false,       // Not loaded library
     *     'libraryName2': true,        // Loaded library
     *     'libraryName3': true         // Loaded library
     * @private
     */
    this._importLibQueue = [];

    /**
     * Object pointer.
     * @type {LibraryManager}
     * @private
     */
    let self = this;

    /**
     * Enabls holdReady status.
     * @type {boolean}
     * @private
     */
    this._holdReady = false;

    /**
     * Init load time.
     * @private
     */
    this._startTime = null;

    /**
     * Library time execution.
     * @private
     */
    this._importTime = {};

    /**
     * Query load time.
     * @type {number}
     * @private
     */
    this._queryTime = 0.0;

    /**
     * Application is initialized.
     * @type {boolean}
     * @private
     */
    this._initapp = false;

    /**
     * Map that contain the data of each thread that waits the load of the library.
     * @private
     */
    this._waitingThreadData = {};

    /**
     * Enable application holdReady.
     *
     * @function
     * @private
     */
    this._enable_holdReady = function () {
        self._holdReady = true;
    };

    /**
     * Set application as initialized.
     *
     * @function
     */
    this.set_app_initialized = function () {
        self._initapp = true;
    };

    /**
     * Desactiva el holdready de la aplicación.
     *
     * @function
     */
    this.disable_hold_ready = function () {
        if (this._holdReady) {
            // noinspection JSDeprecatedSymbols
            $.holdReady(false);
        }
        self._holdReady = false;
    };

    /**
     * Returns a string with loaded libraries.
     *
     * @function
     * @param {boolean} $log - Console logging
     * @returns {string} - Loaded libraries
     */
    this.get_imported_libraries = function ($log) {

        // Get imported libraries
        let $k = Object.keys(this._importedLibraries);
        let $imp = '';
        for (let i = 0; i < $k.length; i += 1) {
            if (this._importedLibraries[$k[i]]) {
                $imp += $k[i];
                if (i < $k.length - 1) {
                    $imp += ', '
                }
            }
        }

        // Message on console
        if ($imp !== '' && $log) {
            try {
                app_console.info(lang.imported_dynamically_libs.format($imp, round_number(this._queryTime, 3)));
            } catch ($e) {
            } finally {
            }
        }

        // Return string
        return $imp;

    };

    /**
     * Returns true/false if the library has been loaded or not.
     *
     * @function
     * @param {string} $lib - Library name
     * @returns {boolean} - Status
     */
    this.is_loaded_library = function ($lib) {
        if (Object.keys(this._importedLibraries).indexOf($lib) === -1) {
            return false;
        }
        return this._importedLibraries[$lib];
    };

    /**
     * Returns true/false when all libraries have been loaded.
     *
     * @function
     * @returns {boolean} - Status
     */
    this.is_all_loaded_libraries = function () {
        if (Object.keys(this._importLibQueue).length === 0) {
            if (this._holdReady) {
                // noinspection JSDeprecatedSymbols
                $.holdReady(false);
            }
            self._queryTime = get_seconds_from(this._startTime);
            return true;
        }
        return false;
    };

    /**
     * Throws fatal error.
     *
     * @function
     * @param {string} msg - Library error.
     * @param {string} path - Library path
     * @private
     */
    this._throw_fatal_error = function (msg, path) {
        app_dialog.error(lang.import_fatal_error_title, lang.import_fatal_error_content.format(msg, path));
        NotificationJS.error(lang.import_fatal_error_title);
    };

    /**
     * Import a library
     *
     * @function
     * @param {string} name - Library name
     * @param {string} path - Library path
     * @param {function} callback - Trigger function after load
     * @param {object=} params - Function parameters
     * @returns {boolean} - Status
     * @private
     */
    this._getScript_async_callback = function (name, path, callback, params) {
        /* eslint callback-return:"off" */

        try {

            /**
             * Trigger function after load
             */
            let $f_funct = function () {

                // Execute function
                if (params !== undefined) {
                    callback(params)
                } else {
                    callback();
                }
                self._importedLibraries[name] = true;
                self._remove_lib_from_queue(name);

                // Print message
                if (not_null_undf(self._importTime[name])) {
                    app_console.info(lang.loading_async_library.format(name, get_seconds_from(self._importTime[name])));
                    delete self._importTime[name];
                }

                // Returns ok status
                return true;

            };

            // If library already downloaded
            if (self._importedLibraries[name]) {
                $f_funct();
                return true;
            }

            // noinspection JSIgnoredPromiseFromCall
            $.getScript(path, $f_funct).fail(function () { // Get script
                self._throw_fatal_error(name, path);
            });

        } catch ($e) {
        } finally {
        }
        return false;
    };

    /**
     * Import a library asynchronously once the application has been initialized.
     *
     * @function
     * @param {string | Array} lib - Libraries
     * @param {function=} callback - Function triggered after download
     * @param {boolean=} force - Force download
     * @param {object=} params - Function parameters
     * @returns {boolean} - Status
     */
    this.import_async_library = function (lib, callback, force, params) {

        // If application is not initialized then throw error
        if (!self._initapp) throw 'LibraryManager::import_async_library Application is not initialized yet, the library has not been downloaded ' + lib;

        // If function is not defined
        if (is_null_undf(callback)) {
            callback = function () {
            };
        }

        // If library is an array then each library is loaded
        if (lib instanceof Array) {
            if (lib.length === 1) {
                lib = lib[0];
            } else {
                let $lib = lib.splice(0, 1);
                let $newlib = lib;
                lib = $lib[0];
                let $newcallback = function ($$lib, $callback, $params) { // Updates function
                    return function () {
                        if ($newlib.length === 1) {
                            $newlib = $newlib[0];
                        }
                        self.import_async_library($newlib, $callback, force, $params);
                    }
                };
                callback = $newcallback($newlib, callback, params);
            }
        }

        // If loaded check anyway
        if (this.is_loaded_library(lib) || force) {
            self._loadLibrary(lib, callback, params);
            // if (self.__initapp) app_console.consoleLogInfo(lang.library_already_downloaded.format(lib));
        }

        // If not downloaded adds to the queue
        else {

            // If not in queue it's added
            let $k = Object.keys(self._importLibQueue);
            if ($k.indexOf(lib) === -1) {
                self.add_lib_to_queue(lib);
                self._importTime[lib] = new Date();
                try {
                    self._loadLibrary(lib, callback, params);
                    return true;
                } catch ($e) {
                    NotificationJS.error($e.message);
                } finally {
                }
                return false;
            }

            // If in queue creates a function that constanstly checks if downloaded
            self._create_waiting_thread(lib, callback, params);

        }

        return true;

    };

    /**
     * Creates a thread that waits the library is loaded.
     *
     * @function
     * @param {string} lib - Library name
     * @param {function} callback - Function
     * @param {object} params - Function parameters
     * @private
     */
    this._create_waiting_thread = function (lib, callback, params) {

        // If empty function returns
        if (callback === undefined) return;

        // Create thread id and the data
        let $dataid = generateID();
        self._waitingThreadData[$dataid] = {
            callback: callback,
            id: $dataid,
            params: params,
            threadid: 0,
        };

        // Function that checks the library was loaded
        let $f = function () {
            if (self.is_loaded_library(lib)) {
                let data = self._waitingThreadData[$dataid];
                clearInterval(data.threadid);
                if (data.params !== undefined) {
                    data.callback(data.params);
                } else {
                    data.callback();
                }
                delete self._waitingThreadData[$dataid];
            }
        };

        // Creates the thread
        self._waitingThreadData[$dataid].threadid = setInterval($f, cfg_module_async_wait);

    };

    /**
     * Imports a library asynchronously.
     *
     * @function
     * @param {string} name - Library name
     * @param {string} path - Library path
     * @returns {boolean} - Status
     * @private
     */
    this._getScript_async = function (name, path) {
        return this._getScript_async_callback(name, path, function () {
        })
    };

    /**
     * Load a css file.
     *
     * @function
     * @param {string} lib - Library name
     * @param {string} path - File path
     */
    this.load_css_lib = function (lib, path) {
        if (self._importedLibraries[lib + '.css']) return;
        self._importedLibraries[lib + '.css'] = true;
        $('head').append('<link rel="stylesheet" type="text/css" href="' + path + '" media="screen">');
    };

    /**
     * Import all queue libraries.
     *
     * @function
     */
    this.import_all_libraries = function () {

        // If application is loaded throw an exception
        if (self._initapp) throw 'LibraryManager::import_all_libraries The application has been initizlied, the libraries could not been downloaded';
        self._startTime = new Date(); // Set init tiem

        // Check all queuqed libraries
        let $klibs = Object.keys(this._importLibQueue);
        if ($klibs.length === 0) {
            return;
        }
        if (this._holdReady) { // Stop readyState
            // noinspection JSDeprecatedSymbols
            $.holdReady(true);
        }
        let lib;
        for (let i = 0; i < $klibs.length; i += 1) {
            lib = $klibs[i];
            this._loadLibrary(lib);
        }

    };

    /**
     * Adds a library to the queue.
     *
     * @function
     * @param {string} lib - Library name
     */
    this.add_lib_to_queue = function (lib) {
        let $k = Object.keys(this._importLibQueue);
        if ($k.indexOf(lib) !== -1) return;
        self._importLibQueue[lib] = false; // Set library as not loaded
    };

    /**
     * Deletes a library from queue.
     *
     * @function
     * @param {string} lib - Library name
     * @private
     */
    this._remove_lib_from_queue = function (lib) {
        let $k = Object.keys(this._importLibQueue);
        if ($k.indexOf(lib) === -1) {
            return;
        }
        delete this._importLibQueue[lib];
        this.is_all_loaded_libraries(); // Check all libraries are loaded
    };

    /**
     * Loads platform libraries.
     *
     * @function
     * @param {string} lib - Library
     * @param {function=} callback - Triggers function
     * @param {object=} params - Function parameters
     * @private
     */
    this._loadLibrary = function (lib, callback, params) {
        if (is_null_undf(callback)) {
            callback = function () {
            };
        }
        switch (lib) {

            /**
             * Application language
             */
            case self.lib.__LANG__:
                // eslint-disable-next-line no-case-declarations
                let $lang = sessionCookie.lang; // Lang to load
                if (!lang_available.includes($lang)) $lang = 'en';
                this._getScript_async_callback(lib + $lang, 'dist/i18n/{0}.min.js'.format($lang), callback, params);
                break;

            /**
             * select2
             */
            case self.lib.SELECT2:
                this.load_css_lib(lib, 'lib/select2/select2.min.css');
                this._getScript_async_callback(lib, 'lib/select2/select2.full.min.js', callback, params);
                break;

            /**
             * GoJS
             */
            case self.lib.GOJS:
                this._getScript_async_callback(lib, 'lib/goJS/go.min.js', callback, params);
                break;

            /**
             * Three.js
             */
            case self.lib.THREEJS:
                this._getScript_async_callback(lib, 'lib/three.js/three.min.js',
                    function ($e) {
                        // self.add_lib_to_queue(self.lib.TJSPROJECTOR);
                        self.add_lib_to_queue(self.lib.ORBITCONTROLS);
                        // self._getScript_async(self.lib.TJSPROJECTOR, 'lib/three.js/Projector.min.js');
                        self._getScript_async_callback(self.lib.ORBITCONTROLS, 'lib/three.js/OrbitControls.min.js', $e.c, $e.p);
                    }, {
                        c: callback,
                        p: params,
                    });
                break;

            /**
             * GUI graphic interface
             */
            case self.lib.DATGUI:
                self.load_css_lib(lib, 'lib/dat.gui/dat.gui.min.css');
                this._getScript_async_callback(lib, 'lib/dat.gui/dat.gui.min.js', callback, params);
                break;

            /**
             * GLTF exporter, used by Three.js
             */
            case self.lib.GLTFEXPORTER:
                this._getScript_async_callback(lib, 'lib/three.js/GLTFExporter.min.js', callback, params);
                break;

            /**
             * Obj exporter, used by Three.js
             */
            case self.lib.OBJEXPORTER:
                this._getScript_async_callback(lib, 'lib/three.js/OBJExporter.min.js', callback, params);
                break;

            /**
             * Jquery-formvalidator
             */
            case self.lib.FORMVALIDATOR:
                self.load_css_lib(lib, 'lib/formvalidator/theme-default.min.css');
                this._getScript_async_callback(lib, 'lib/formvalidator/jquery.form-validator.min.js',
                    function ($e) {
                        // Carga el idioma
                        self.add_lib_to_queue(self.lib.FORMVALIDATORLANG);
                        switch (cfg_lang) {
                            case 'es':
                                self._getScript_async_callback(self.lib.FORMVALIDATORLANG, 'lib/formvalidator/lang/es.min.js', $e.c, $e.p);
                                break;
                            case 'en':
                                break;
                            case 'fr':
                                self._getScript_async_callback(self.lib.FORMVALIDATORLANG, 'lib/formvalidator/lang/fr.min.js', $e.c, $e.p);
                                break;
                            default:
                                break;
                        }
                    }, {
                        c: callback,
                        p: params,
                    });
                break;

            /**
             * stats.js
             */
            case self.lib.STATS:
                this._getScript_async_callback(lib, 'lib/stats.js/stats.min.js', callback, params);
                break;

            /**
             * Datatables
             */
            case self.lib.DATATABLES:
                self.load_css_lib(lib, 'lib/dataTables/dataTables.bootstrap4.min.css');
                this._getScript_async_callback(lib, 'lib/dataTables/jquery.dataTables.min.js',
                    function ($e) {
                        self.add_lib_to_queue(self.lib.DATATABLESBT4);
                        self._getScript_async_callback(self.lib.DATATABLESBT4, 'lib/dataTables/dataTables.bootstrap4.min.js', $e.c, $e.p);
                    }, {
                        c: callback,
                        p: params,
                    });
                break;

            /**
             * ContextMenu
             */
            case self.lib.CONTEXTMENU:
                self.load_css_lib(lib, 'lib/jquery.contextMenu/jquery.contextMenu.min.css');
                this._getScript_async_callback(lib, 'lib/jquery.contextMenu/jquery.contextMenu.min.js', callback, params);
                break;

            /**
             * Datepicker date selector
             */
            case self.lib.DATEPICKER:
                self.load_css_lib(lib, 'lib/datepicker/datepicker.min.css');
                this._getScript_async_callback(lib, 'lib/datepicker/datepicker.min.js', callback, params);
                break;

            /**
             * asRange
             */
            case self.lib.ASRANGE:
                self.load_css_lib(lib, 'lib/jquery-asRange/asRange.min.css');
                this._getScript_async_callback(lib, 'lib/jquery-asRange/jquery-asRange.min.js', callback, params);
                break;

            /**
             * Multiselect
             */
            case self.lib.MULTISELECT:
                this._getScript_async_callback(lib, 'lib/multiselect/multiselect.min.js', callback, params);
                break;

            /**
             * Notification - toastr
             */
            case self.lib.TOASTR:
                self.load_css_lib(lib, 'lib/toastr/toastr.min.css');
                this._getScript_async_callback(lib, 'lib/toastr/toastr.min.js', callback, params);
                break;

            /**
             * Chart.js
             */
            case self.lib.CHARTJS:
                this._getScript_async_callback(lib, 'lib/chart.js/Chart.bundle.min.js', callback, params);
                break;

            /**
             * Bootstrap password toggler
             */
            case self.lib.BPASSWDTOGGLER:
                this._getScript_async_callback(lib, 'lib/bootstrap-password-toggler/toggler.min.js', callback, params);
                break;

            /**
             * AmaranJS
             */
            case self.lib.AMARANJS:
                self.load_css_lib(lib, 'lib/AmaranJS/css/amaran.min.css');
                self.load_css_lib(lib, 'lib/AmaranJS/css/animate.min.css');
                this._getScript_async_callback(lib, 'lib/AmaranJS/js/jquery.amaran.min.js', callback, params);
                break;

            /**
             * jquery.toast
             */
            case self.lib.JQUERYTOAST:
                self.load_css_lib(lib, 'lib/jquery.toast/jquery.toast.min.css');
                this._getScript_async_callback(lib, 'lib/jquery.toast/jquery.toast.min.js', callback, params);
                break;

            /**
             * Fontawesome
             */
            case self.lib.FONTAWESOME:
                self.load_css_lib(lib, 'lib/font-awesome/css/all.min.css');
                break;

            /**
             * Jquery-confirm
             */
            case self.lib.JQUERYCONFIRM:
                self.load_css_lib(lib, 'lib/jquery-confirm/jquery-confirm.min.css');
                this._getScript_async_callback(lib, 'lib/jquery-confirm/jquery-confirm.min.js', callback, params);
                break;

            /**
             * AES-MD5
             */
            case self.lib.MD5:
                this._getScript_async_callback(lib, 'lib/md5/md5.min.js', callback, params);
                break;

            /**
             * Hover.css
             */
            case self.lib.HOVERCSS:
                self.load_css_lib(lib, 'lib/hover/hover.min.css');
                break;

            /**
             * Tooltipster
             */
            case self.lib.TOOLTIPSTER:
                self.load_css_lib(lib, 'lib/tooltipster/tooltipster.bundle.min.css');
                this._getScript_async_callback(lib, 'lib/tooltipster/tooltipster.bundle.min.js', callback, params);
                break;

            /**
             * Bootstrap scss
             */
            case self.lib.BOOTSTRAP:
                self.load_css_lib(lib, 'lib/bootstrap/bootstrap.min.css');
                break;

            /**
             * Mmenu
             */
            case self.lib.MMENU:
                self.load_css_lib(lib, 'lib/mmenu/jquery.mmenu.all.css');
                this._getScript_async_callback(lib, 'lib/mmenu/jquery.mmenu.all.js',
                    function ($e) {
                        self.add_lib_to_queue(self.lib.HAMMER);
                        self._getScript_async_callback(self.lib.HAMMER, 'lib/hammer/hammer.min.js', $e.c, $e.p);
                    }, {
                        c: callback,
                        p: params,
                    });
                break;

            /**
             * Rippler
             */
            case self.lib.RIPPLER:
                self.load_css_lib(lib, 'lib/rippler/rippler.min.css');
                this._getScript_async_callback(lib, 'lib/rippler/rippler.min.js', callback, params);
                break;

            /**
             * Spin
             */
            case self.lib.SPIN:
                self.load_css_lib(lib, 'lib/spin/spin.css');
                this._getScript_async_callback(lib, 'lib/spin/spin.min.js', callback, params);
                break;

            /**
             * Bowser
             */
            case self.lib.BOWSER:
                this._getScript_async_callback(lib, 'lib/bowser/bowser.min.js', callback, params);
                break;

            /**
             * Jquery-scrollLock
             */
            case self.lib.SCROLLLOCK:
                this._getScript_async_callback(lib, 'lib/jquery-scrollLock/jquery-scrollLock.min.js', callback, params);
                break;

            /**
             * Jquery.mousewheel
             */
            case self.lib.MOUSEWHEEL:
                this._getScript_async_callback(lib, 'lib/jquery.mousewheel/jquery.mousewheel.min.js', callback, params);
                break;

            /**
             * Jquery.ui.position
             */
            case self.lib.UIPOSITION:
                this._getScript_async_callback(lib, 'lib/jquery.ui/jquery.ui.position.min.js', callback, params);
                break;

            /**
             * Jquery-mentions-input
             */
            case self.lib.MENTIONSINPUT:
                self.load_css_lib(lib, 'lib/jquery-mentions-input/jquery.mentionsInput.min.css');
                self.add_lib_to_queue(self.lib.UNDERSCORE);
                self._getScript_async_callback(self.lib.UNDERSCORE, 'lib/underscore/underscore-min.js',
                    function ($e) {
                        self.add_lib_to_queue('jquery.events.input');
                        self.add_lib_to_queue('jquery.elastic');
                        self._getScript_async('jquery.events.input', 'lib/jquery-mentions-input/jquery.events.input.min.js');
                        self._getScript_async('jquery.elastic', 'lib/jquery-mentions-input/jquery.elastic.min.js');
                        self._getScript_async_callback(lib, 'lib/jquery-mentions-input/jquery.mentionsInput.min.js', $e.c, $e.p);
                    }, {
                        c: callback,
                        p: params,
                    });
                break;

            /**
             * Underscore.js
             */
            case self.lib.UNDERSCORE:
                this._getScript_async_callback(lib, 'lib/underscore/underscore-min.js', callback, params);
                break;

            /**
             * TinyMCE
             */
            case self.lib.TINYMCE:
                self.load_css_lib(lib + '-plugin-mention-autocomplete',
                    'lib/tinymce/plugins/mention/autocomplete.css');
                self.load_css_lib(lib + '-plugin-mention-rte',
                    'lib/tinymce/plugins/mention/rte-content.css');
                self.add_lib_to_queue('jquery.tinymce');
                this._getScript_async('jquery.tinymce', 'lib/tinymce/jquery.tinymce.min.js');
                this._getScript_async_callback(lib, 'lib/tinymce/tinymce.min.js',
                    function ($e) {
                        self.add_lib_to_queue('tinymce-lang');
                        switch (cfg_lang) {
                            case 'es':
                                self._getScript_async_callback('tinymce-lang', 'lib/tinymce/langs/es.js', $e.c, $e.p);
                                break;
                            case 'en':
                                self._getScript_async_callback('tinymce-lang', 'lib/tinymce/langs/en_GB.js', $e.c, $e.p);
                                break;
                            case 'fr':
                                self._getScript_async_callback('tinymce-lang', 'lib/tinymce/langs/fr_FR.js', $e.c, $e.p);
                                break;
                            case 'br':
                                self._getScript_async_callback('tinymce-lang', 'lib/tinymce/langs/br_BR.js', $e.c, $e.p);
                                break;
                            case 'ru':
                                self._getScript_async_callback('tinymce-lang', 'lib/tinymce/langs/ru_RU.js', $e.c, $e.p);
                                break;
                            default:
                                break;
                        }
                    }, {
                        c: callback,
                        p: params,
                    });
                break;

            /**
             * Animate CSS
             */
            case self.lib.ANIMATE:
                self.load_css_lib(lib, 'lib/animate/animate.min.css');
                break;

            /**
             * SHA-1
             */
            case self.lib.SHA1:
                this._getScript_async_callback(lib, 'lib/sha1/sha1.min.js', callback, params);
                break;

            /**
             * Normalize.css
             */
            case self.lib.NORMALIZE:
                self.load_css_lib(lib, 'lib/normalize/normalize.min.css');
                break;

            /**
             * Ion-rangeslider
             */
            case self.lib.IONRANGESLIDER:
                self.load_css_lib(lib, 'lib/ion.rangeSlider/ion.rangeSlider.min.css');
                this._getScript_async_callback(lib, 'lib/ion.rangeSlider/ion.rangeSlider.min.js', callback, params);
                break;

            /**
             * Jquery-backtotop
             */
            case self.lib.BACKTOTOP:
                self.load_css_lib(lib, 'lib/jquery-backToTop/jquery-backToTop.min.css');
                this._getScript_async_callback(lib, 'lib/jquery-backToTop/jquery-backToTop.min.js', callback, params);
                break;

            /**
             * Jquery-timeago
             */
            case self.lib.JQUERYTIMEAGO:
                this._getScript_async_callback(lib, 'lib/jquery-timeago/jquery.timeago.min.js',
                    function ($e) {
                        self.add_lib_to_queue('jquery-timeago-locale');
                        switch (cfg_lang) {
                            case 'es':
                                self._getScript_async_callback('jquery-timeago-locale', 'lib/jquery-timeago/locales/jquery.timeago.es.min.js', $e.c, $e.p);
                                break;
                            case 'en':
                                self._getScript_async_callback('jquery-timeago-locale', 'lib/jquery-timeago/locales/jquery.timeago.en.min.js', $e.c, $e.p);
                                break;
                            case 'fr':
                                self._getScript_async_callback('jquery-timeago-locale', 'lib/jquery-timeago/locales/jquery.timeago.fr.min.js', $e.c, $e.p);
                                break;
                            case 'de':
                                self._getScript_async_callback('jquery-timeago-locale', 'lib/jquery-timeago/locales/jquery.timeago.de.min.js', $e.c, $e.p);
                                break;
                            case 'ru':
                                self._getScript_async_callback('jquery-timeago-locale', 'lib/jquery-timeago/locales/jquery.timeago.fr.min.js', $e.c, $e.p);
                                break;
                            default:
                                break;
                        }
                    }, {
                        c: callback,
                        p: params,
                    });
                break;

            /**
             * Twbs-pagination
             */
            case self.lib.TWBSPAGINATION:
                this._getScript_async_callback(lib, 'lib/twbs-pagination/jquery.twbsPagination.min.js', callback, params);
                break;

            /**
             * Simple pagination
             */
            case self.lib.SIMPLEPAGINATION:
                self.load_css_lib(lib, 'lib/simplePagination/simplePagination.min.css');
                this._getScript_async_callback(lib, 'lib/simplePagination/jquery.simplePagination.min.js', callback, params);
                break;

            /**
             * Bootstrap.js
             */
            case self.lib.BOOTSTRAPJS:
                this._getScript_async_callback(lib, 'lib/bootstrap/bootstrap.bundle.min.js', callback, params);
                break;

            /**
             * Filesaver.js
             */
            case self.lib.FILESAVERJS:
                this._getScript_async_callback(lib, 'lib/filesaver/FileSaver.js',
                    function ($e) {
                        self._getScript_async('canvas-toBlob', 'lib/filesaver/canvas-toBlob.js');
                        self.add_lib_to_queue('Blob.js');
                        self._getScript_async_callback('Blob.js', 'lib/filesaver/Blob.js', $e.c, $e.p);
                    }, {
                        c: callback,
                        p: params,
                    });
                break;

            /**
             * D3
             */
            case self.lib.D3:
                this._getScript_async_callback(lib, 'lib/d3/d3.min.js', callback, params);
                break;

            /**
             * Popper.js
             */
            case self.lib.POPPER:
                this._getScript_async_callback(lib, 'lib/popper/popper.min.js', callback, params);
                break;

            /**
             * Validator.js
             */
            case self.lib.VALIDATORJS:
                this._getScript_async_callback(lib, 'lib/validator.js/validator.min.js', callback, params);
                break;

            /**
             * Earcut
             */
            case self.lib.EARCUT:
                this._getScript_async_callback(lib, 'lib/earcut/earcut.js', callback, params);
                break;

            /**
             * Delaunator
             */
            case self.lib.DELAUNATOR:
                this._getScript_async_callback(lib, 'lib/delaunator/delaunator.min.js', callback, params);
                break;

            /**
             * Ion sound
             */
            case self.lib.IONSOUND:
                this._getScript_async_callback(lib, 'lib/ion.sound/ion.sound.min.js', callback, params);
                break;

            /**
             * Easytimer
             */
            case self.lib.EASYTIMER:
                this._getScript_async_callback(lib, 'lib/easytimer/easytimer.min.js', callback, params);
                break;

            /**
             * DBIP
             */
            case self.lib.DBIP:
                this._getScript_async_callback(lib, 'https://cdn.db-ip.com/js/dbip.js', callback, params);
                break;

            /**
             * JQVMAP
             */
            case self.lib.JQVMAP:
                self.load_css_lib(lib, 'lib/jqvmap/jqvmap.min.css');
                this._getScript_async_callback(lib, 'lib/jqvmap/jquery.vmap.min.js',
                    function ($e) {
                        self._getScript_async_callback('jqvmap.world', 'lib/jqvmap/maps/jquery.vmap.world.js', $e.c, $e.p);
                    }, {
                        c: callback,
                        p: params,
                    });
                break;

            /**
             * Jquery-nice-select
             */
            case self.lib.JQUERYNICESELECT:
                self.load_css_lib(lib, 'lib/jquery-nice-select/style.css');
                this._getScript_async_callback(lib, 'lib/jquery-nice-select/jquery.nice-select.min.js', callback, params);
                break;

            /**
             * Notification.js
             */
            case self.lib.NOTIFICATIONJS:
                self.load_css_lib(lib, 'lib/notification.js/notification.min.css');
                this._getScript_async_callback(lib, 'lib/notification.js/notification.min.js', callback, params);
                break;

            /**
             * Unknown library
             */
            default:
                self._remove_lib_from_queue(lib);
                if (is_null_undf(lib)) lib = '__undefined__';
                throw 'LibraryManager::loadLibrary Library <{0}> unknown'.format(lib);
        }

    };

    /**
     * Enable holdready.
     */
    this._enable_holdReady();

}


/**
 * ----------------------------------------------------------------------------
 * Creates new library
 * ----------------------------------------------------------------------------
 */

/**
 * Library administrator.
 * @type {LibraryManager}
 * @const
 * @global
 */
const app_library_manager = new LibraryManager();


/**
 * ----------------------------------------------------------------------------
 * Imports before app init
 * ----------------------------------------------------------------------------
 */
app_library_manager.add_lib_to_queue(app_library_manager.lib.EASYTIMER);
app_library_manager.add_lib_to_queue(app_library_manager.lib.IONRANGESLIDER);
app_library_manager.add_lib_to_queue(app_library_manager.lib.MD5);
app_library_manager.add_lib_to_queue(app_library_manager.lib.NOTIFICATIONJS);
app_library_manager.add_lib_to_queue(app_library_manager.lib.RIPPLER);
app_library_manager.add_lib_to_queue(app_library_manager.lib.THREEJS);
app_library_manager.add_lib_to_queue(app_library_manager.lib.TOOLTIPSTER);


/**
 * ----------------------------------------------------------------------------
 * Imports after app init, used by @src/app.js
 * ----------------------------------------------------------------------------
 */
function after_load_imports() {
    app_library_manager.import_async_library(app_library_manager.lib.AMARANJS);
    app_library_manager.import_async_library(app_library_manager.lib.ANIMATE);
    app_library_manager.import_async_library(app_library_manager.lib.DELAUNATOR);
    app_library_manager.import_async_library(app_library_manager.lib.EARCUT);
    app_library_manager.import_async_library(app_library_manager.lib.FONTAWESOME);
    app_library_manager.import_async_library(app_library_manager.lib.HOVERCSS);
    app_library_manager.import_async_library(app_library_manager.lib.JQUERYCONFIRM);
    app_library_manager.import_async_library(app_library_manager.lib.JQUERYNICESELECT);
}


/**
 * ----------------------------------------------------------------------------
 * Extends initial functions to prevent errors before loading
 * ----------------------------------------------------------------------------
 */
jQuery.fn.tooltipster = function () {
};
jQuery.fn.alert = function () {
};
jQuery.fn.confirm = function () {
};

/* eslint no-var:"off" */
/* eslint vars-on-top:"off" */

// noinspection ES6ConvertVarToLetConst
/**
 * bowser - Navigator validator.
 */
var bowser;

// noinspection ES6ConvertVarToLetConst
/**
 * Spinner - Spin.js main variable.
 */
var Spinner;