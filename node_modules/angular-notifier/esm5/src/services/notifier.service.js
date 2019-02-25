/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Inject, Injectable, forwardRef } from '@angular/core';
import { NotifierConfig } from './../models/notifier-config.model';
import { NotifierQueueService } from './notifier-queue.service';
import { NotifierConfigToken } from './../notifier.module';
/**
 * Notifier service
 *
 * This service provides access to the public notifier API. Once injected into a component, directive, pipe, service, or any other building
 * block of an applications, it can be used to show new notifications, and hide existing ones. Internally, it transforms API calls into
 * actions, which then get thrown into the action queue - eventually being processed at the right moment.
 */
var NotifierService = /** @class */ (function () {
    function NotifierService(notifierQueueService, config // The forwardRef is (sadly) required here
    ) {
        this.queueService = notifierQueueService;
        this.config = config;
    }
    /**
     * Get the notifier configuration
     *
     * @return {?} Notifier configuration
     */
    NotifierService.prototype.getConfig = /**
     * Get the notifier configuration
     *
     * @return {?} Notifier configuration
     */
    function () {
        return this.config;
    };
    /**
     * API: Show a new notification
     *
     * @param {?} notificationOptions Notification options
     * @return {?}
     */
    NotifierService.prototype.show = /**
     * API: Show a new notification
     *
     * @param {?} notificationOptions Notification options
     * @return {?}
     */
    function (notificationOptions) {
        this.queueService.push({
            payload: notificationOptions,
            type: 'SHOW'
        });
    };
    /**
     * API: Hide a specific notification, given its ID
     *
     * @param {?} notificationId ID of the notification to hide
     * @return {?}
     */
    NotifierService.prototype.hide = /**
     * API: Hide a specific notification, given its ID
     *
     * @param {?} notificationId ID of the notification to hide
     * @return {?}
     */
    function (notificationId) {
        this.queueService.push({
            payload: notificationId,
            type: 'HIDE'
        });
    };
    /**
     * API: Hide the newest notification
     * @return {?}
     */
    NotifierService.prototype.hideNewest = /**
     * API: Hide the newest notification
     * @return {?}
     */
    function () {
        this.queueService.push({
            type: 'HIDE_NEWEST'
        });
    };
    /**
     * API: Hide the oldest notification
     * @return {?}
     */
    NotifierService.prototype.hideOldest = /**
     * API: Hide the oldest notification
     * @return {?}
     */
    function () {
        this.queueService.push({
            type: 'HIDE_OLDEST'
        });
    };
    /**
     * API: Hide all notifications at once
     * @return {?}
     */
    NotifierService.prototype.hideAll = /**
     * API: Hide all notifications at once
     * @return {?}
     */
    function () {
        this.queueService.push({
            type: 'HIDE_ALL'
        });
    };
    /**
     * API: Shortcut for showing a new notification
     *
     * @param {?} type             Type of the notification
     * @param {?} message          Message of the notification
     * @param {?=} notificationId
     * @return {?}
     */
    NotifierService.prototype.notify = /**
     * API: Shortcut for showing a new notification
     *
     * @param {?} type             Type of the notification
     * @param {?} message          Message of the notification
     * @param {?=} notificationId
     * @return {?}
     */
    function (type, message, notificationId) {
        var /** @type {?} */ notificationOptions = {
            message: message,
            type: type
        };
        if (notificationId !== undefined) {
            notificationOptions.id = notificationId;
        }
        this.show(notificationOptions);
    };
    NotifierService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    NotifierService.ctorParameters = function () { return [
        { type: NotifierQueueService },
        { type: NotifierConfig, decorators: [{ type: Inject, args: [forwardRef(function () { return NotifierConfigToken; }),] }] }
    ]; };
    return NotifierService;
}());
export { NotifierService };
function NotifierService_tsickle_Closure_declarations() {
    /**
     * Notifier queue service
     * @type {?}
     */
    NotifierService.prototype.queueService;
    /**
     * Notifier configuration
     * @type {?}
     */
    NotifierService.prototype.config;
}
//# sourceMappingURL=notifier.service.js.map