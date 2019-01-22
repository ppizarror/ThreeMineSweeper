/**
 GLOBALCONFIG
 Global software settings.

 @author Pablo Pizarro R. @ppizarror.com
 @license MIT
 */

/**
 * ----------------------------------------------------------------------------
 * Init settings, saved on cookies
 * ----------------------------------------------------------------------------
 */

/**
 * Popup themes <bootstrap, dark, light, material, modern, supervan> {@link sessionCookie}
 * @type {string}
 * @global
 * @ignore
 */
let cfg_popup_theme = 'material';

/**
 * Enable console logging
 * @type {boolean}
 * @const
 * @global
 * @ignore
 */
const cfg_verbose = true;

/**
 * Show total messages on console
 * @type {boolean}
 * @const
 * @global
 * @ignore
 */
const show_console_total_messages = true;


/**
 * ----------------------------------------------------------------------------
 * Server settings
 * ----------------------------------------------------------------------------
 */

/**
 * Application host
 * @type {string}
 * @global
 * @const
 * @private
 * @ignore
 */
const cfg_href_host = window.location.protocol + '//' + window.location.host + '/';

/**
 * Enables CORS (Cross-domain)
 * @type {boolean}
 * @const
 * @global
 * @ignore
 */
const cfg_ajax_cors = false;

/**
 * Ajax timeout
 * @type {number}
 * @global
 * @ignore
 */
const cfg_href_ajax_timeout = 45000;

/**
 * Total queries before error
 * @type {number}
 * @const
 * @global
 * @ignore
 */
const cfg_retry_sync = 5;


/**
 * ----------------------------------------------------------------------------
 * Cookie settings
 * ----------------------------------------------------------------------------
 */

/**
 * Days before cookie expire
 * @type {number}
 * @const
 * @global
 * @ignore
 */
const cfg_cookie_expire_days = 14;

/**
 * Cookies ID {@link sessionCookie}
 * @type {string}
 * @const
 * @global
 * @ignore
 */
const cfg_cookie_session_id = 'R43R6yAZyk';

/**
 * Week start on mondays
 * @type {boolean}
 * @const
 * @global
 * @ignore
 */
const cfg_week_start_at_monday = true;

/**
 * Only local cookies.
 * @type {boolean}
 * @const
 * @global
 * @ignore
 */
const cfg_cookie_local = false;


/**
 * ----------------------------------------------------------------------------
 * UI settings
 * ----------------------------------------------------------------------------
 */

/**
 * Total messages on console after wipe
 * @type {int}
 * @const
 * @global
 * @ignore
 */
const cfg_total_console_messages_until_wipe = 1000;

/**
 * Mobile pixel width
 * @type {number}
 * @const
 * @global
 * @ignore
 */
const cfg_width_enable_mobile = 576;

/**
 * Maximum loading layer time
 * @type {number}
 * @const
 * @global
 * @ignore
 */
const cfg_max_time_loading_layer = 60;

/**
 * Time before loading layer appears
 * @type {number}
 * @const
 * @global
 * @ignore
 */
const cfg_init_loading_layer_after = 350;


/**
 * ----------------------------------------------------------------------------
 * Notification settings
 * ----------------------------------------------------------------------------
 */

/**
 * Notification core (amaranjs,jquery-toast-plugin,toastr)
 * @type {string}
 * @const
 * @global
 * @ignore
 */
const cfg_notification_core = 'toastr';

/**
 * Notification are or not avaiable
 * @type {boolean}
 * @const
 * @global
 * @ignore
 */
const cfg_notification_enabled = true;

/**
 * Maximum notifications on screen (jquery.toast,toastr)
 * @type {number}
 * @const
 * @global
 * @ignore
 */
const cfg_max_notification_stack = 3;

/**
 * Show always notifications
 * @type {boolean}
 * @const
 * @global
 * @ignore
 */
const cfg_always_show_err_notification = true;

/**
 * Notification time life in miliseconds
 * @type {number}
 * @global
 * @const
 * @ignore
 */
const cfg_notification_timeout = 10000;


/**
 * ----------------------------------------------------------------------------
 * Date settings
 * ----------------------------------------------------------------------------
 */

/**
 * Private day format
 * @type {string}
 * @const
 * @global
 * @ignore
 */
const cfg_date_format_private_d = 'yyyy/MM/dd';

/**
 * Public date format
 * @type {string}
 * @const
 * @global
 * @ignore
 */
const cfg_date_format_public_d = 'dd/MM/yyyy';

/**
 * Public hour format
 * @type {string}
 * @const
 * @global
 * @ignore
 */
const cfg_date_format_public_h = 'HH:mm:ss';