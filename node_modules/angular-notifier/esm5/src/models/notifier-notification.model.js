/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Notification
 *
 * This class describes the structure of a notifiction, including all information it needs to live, and everyone else needs to work with it.
 */
var /**
 * Notification
 *
 * This class describes the structure of a notifiction, including all information it needs to live, and everyone else needs to work with it.
 */
NotifierNotification = /** @class */ (function () {
    function NotifierNotification(options) {
        /**
         * The template to customize
         * the appearance of the notification
         */
        this.template = null;
        Object.assign(this, options);
        // If not set manually, we have to create a unique notification ID by ourselves. The ID generation relies on the current browser
        // datetime in ms, in praticular the moment this notification gets constructed. Concurrency, and thus two IDs being the exact same,
        // is not possible due to the action queue concept.
        if (options.id === undefined) {
            this.id = "ID_" + new Date().getTime();
        }
    }
    return NotifierNotification;
}());
/**
 * Notification
 *
 * This class describes the structure of a notifiction, including all information it needs to live, and everyone else needs to work with it.
 */
export { NotifierNotification };
function NotifierNotification_tsickle_Closure_declarations() {
    /**
     * Unique notification ID, can be set manually to control the notification from outside later on
     * @type {?}
     */
    NotifierNotification.prototype.id;
    /**
     * Notification type, will be used for constructing an appropriate class name
     * @type {?}
     */
    NotifierNotification.prototype.type;
    /**
     * Notification message
     * @type {?}
     */
    NotifierNotification.prototype.message;
    /**
     * The template to customize
     * the appearance of the notification
     * @type {?}
     */
    NotifierNotification.prototype.template;
    /**
     * Component reference of this notification, created and set during creation time
     * @type {?}
     */
    NotifierNotification.prototype.component;
}
/**
 * Notifiction options
 *
 * This interface describes which information are needed to create a new notification, or in other words, which information the external API
 * call must provide.
 * @record
 */
export function NotifierNotificationOptions() { }
function NotifierNotificationOptions_tsickle_Closure_declarations() {
    /**
     * Notification ID, optional
     * @type {?|undefined}
     */
    NotifierNotificationOptions.prototype.id;
    /**
     * Notification type
     * @type {?}
     */
    NotifierNotificationOptions.prototype.type;
    /**
     * Notificatin message
     * @type {?}
     */
    NotifierNotificationOptions.prototype.message;
    /**
     * The template to customize
     * the appearance of the notification
     * @type {?|undefined}
     */
    NotifierNotificationOptions.prototype.template;
}
//# sourceMappingURL=notifier-notification.model.js.map