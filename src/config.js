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
 * App theme.
 * @type {string}
 * @global
 */
let cfg_app_theme = 'default';

/**
 * Popup themes <bootstrap, dark, light, material, modern, supervan> {@link sessionCookie}.
 * @type {string}
 * @global
 */
let cfg_popup_theme = 'material';

/**
 * Enable console logging.
 * @type {boolean}
 * @const
 * @global
 */
const cfg_verbose = true;

/**
 * Show total messages on console.
 * @type {boolean}
 * @const
 * @global
 */
const show_console_total_messages = true;


/**
 * ----------------------------------------------------------------------------
 * Server settings
 * ----------------------------------------------------------------------------
 */

/**
 * Href score server.
 * @type {string}
 * @global
 * @const
 */
const cfg_href_score = 'https://ppizarror.000webhostapp.com/tms/score.php';

/**
 * Enables CORS (Cross-domain).
 * @type {boolean}
 * @const
 * @global
 */
const cfg_ajax_cors = true;

/**
 * Ajax timeout.
 * @type {number}
 * @global
 */
const cfg_href_ajax_timeout = 45000;


/**
 * ----------------------------------------------------------------------------
 * Cookie settings
 * ----------------------------------------------------------------------------
 */

/**
 * Days before cookie expire.
 * @type {number}
 * @const
 * @global
 */
const cfg_cookie_expire_days = 14;

/**
 * Cookies ID {@link sessionCookie}.
 * @type {string}
 * @const
 * @global
 */
const cfg_cookie_session_id = 'e43y65AZDB';

/**
 * Only local cookies.
 * @type {boolean}
 * @const
 * @global
 */
const cfg_cookie_local = false;


/**
 * ----------------------------------------------------------------------------
 * UI settings
 * ----------------------------------------------------------------------------
 */

/**
 * Total messages on console after wipe.
 * @type {int}
 * @const
 * @global
 */
const cfg_total_console_messages_until_wipe = 1000;

/**
 * Maximum loading layer time.
 * @type {number}
 * @const
 * @global
 */
const cfg_max_time_loading_layer = 60;

/**
 * Time before loading layer appears.
 * @type {number}
 * @const
 * @global
 */
const cfg_init_loading_layer_after = 150;


/**
 * ----------------------------------------------------------------------------
 * Notification settings
 * ----------------------------------------------------------------------------
 */

/**
 * Notification core (amaranjs,jquery-toast-plugin,toastr).
 * @type {string}
 * @const
 * @global
 */
const cfg_notification_core = 'toastr';

/**
 * Notification are or not avaiable.
 * @type {boolean}
 * @const
 * @global
 */
const cfg_notification_enabled = true;

/**
 * Maximum notifications on screen (jquery.toast,toastr).
 * @type {number}
 * @const
 * @global
 */
const cfg_max_notification_stack = 3;

/**
 * Show always notifications.
 * @type {boolean}
 * @const
 * @global
 */
const cfg_always_show_err_notification = true;

/**
 * Notification time life in miliseconds.
 * @type {number}
 * @global
 * @const
 */
const cfg_notification_timeout = 10000;


/**
 * ----------------------------------------------------------------------------
 * Date settings
 * ----------------------------------------------------------------------------
 */

/**
 * Public date format.
 * @type {string}
 * @const
 * @global
 */
const cfg_date_format_public_d = getLocaleDateString();

/**
 * Public hour format.
 * @type {string}
 * @const
 * @global
 */
const cfg_date_format_public_h = 'HH:mm:ss';