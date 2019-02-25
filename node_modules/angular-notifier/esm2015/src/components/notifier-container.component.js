/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { NotifierNotification } from './../models/notifier-notification.model';
import { NotifierQueueService } from './../services/notifier-queue.service';
import { NotifierService } from './../services/notifier.service';
/**
 * Notifier container component
 * ----------------------------
 * This component acts as a wrapper for all notification components; consequently, it is responsible for creating a new notification
 * component and removing an existing notification component. Being more precicely, it also handles side effects of those actions, such as
 * shifting or even completely removing other notifications as well. Overall, this components handles actions coming from the queue service
 * by subscribing to its action stream.
 *
 * Technical sidenote:
 * This component has to be used somewhere in an application to work; it will not inject and create itself automatically, primarily in order
 * to not break the Angular AoT compilation. Moreover, this component (and also the notification components) set their change detection
 * strategy onPush, which means that we handle change detection manually in order to get the best performance. (#perfmatters)
 */
export class NotifierContainerComponent {
    /**
     * Constructor
     *
     * @param {?} changeDetector       Change detector, used for manually triggering change detection runs
     * @param {?} notifierQueueService Notifier queue service
     * @param {?} notifierService      Notifier service
     */
    constructor(changeDetector, notifierQueueService, notifierService) {
        this.changeDetector = changeDetector;
        this.queueService = notifierQueueService;
        this.config = notifierService.getConfig();
        this.notifications = [];
    }
    /**
     * Component initialization lifecycle hook, connects this component to the action queue, and then handles incoming actions
     * @return {?}
     */
    ngOnInit() {
        this.queueServiceSubscription = this.queueService.actionStream.subscribe((action) => {
            this.handleAction(action).then(() => {
                this.queueService.continue();
            });
        });
    }
    /**
     * Component destroyment lifecycle hook, cleans up the observable subsciption
     * @return {?}
     */
    ngOnDestroy() {
        if (this.queueServiceSubscription) {
            this.queueServiceSubscription.unsubscribe();
        }
    }
    /**
     * Notification identifier, used as the ngFor trackby function
     *
     * @param {?} index        Index
     * @param {?} notification Notifier notification
     * @return {?} Notification ID as the unique identnfier
     */
    identifyNotification(index, notification) {
        return notification.id;
    }
    /**
     * Event handler, handles clicks on notification dismiss buttons
     *
     * @param {?} notificationId ID of the notification to dismiss
     * @return {?}
     */
    onNotificationDismiss(notificationId) {
        this.queueService.push({
            payload: notificationId,
            type: 'HIDE'
        });
    }
    /**
     * Event handler, handles notification ready events
     *
     * @param {?} notificationComponent Notification component reference
     * @return {?}
     */
    onNotificationReady(notificationComponent) {
        let /** @type {?} */ currentNotification = this.notifications[this.notifications.length - 1]; // Get the latest notification
        currentNotification.component = notificationComponent; // Save the new omponent reference
        this.continueHandleShowAction(currentNotification); // Continue with handling the show action
    }
    /**
     * Handle incoming actions by mapping action types to methods, and then running them
     *
     * @param {?} action Action object
     * @return {?} Promise, resolved when done
     */
    handleAction(action) {
        switch (action.type) {
            // TODO: Maybe a map (actionType -> class method) is a cleaner solution here?
            case 'SHOW':
                return this.handleShowAction(action);
            case 'HIDE':
                return this.handleHideAction(action);
            case 'HIDE_OLDEST':
                return this.handleHideOldestAction(action);
            case 'HIDE_NEWEST':
                return this.handleHideNewestAction(action);
            case 'HIDE_ALL':
                return this.handleHideAllAction(action);
            default:
                return new Promise((resolve, reject) => {
                    resolve(); // Ignore unknown action types
                });
        }
    }
    /**
     * Show a new notification
     *
     * We simply add the notification to the list, and then wait until its properly initialized / created / rendered.
     *
     * @param {?} action Action object
     * @return {?} Promise, resolved when done
     */
    handleShowAction(action) {
        return new Promise((resolve, reject) => {
            this.tempPromiseResolver = resolve; // Save the promise resolve function so that it can be called later on by another method
            this.addNotificationToList(new NotifierNotification(action.payload));
        });
    }
    /**
     * Continue to show a new notification (after the notification components is initialized / created / rendered).
     *
     * If this is the first (and thus only) notification, we can simply show it. Otherwhise, if stacking is disabled (or a low value), we
     * switch out notifications, in particular we hide the existing one, and then show our new one. Yet, if stacking is enabled, we first
     * shift all older notifications, and then show our new notification. In addition, if there are too many notification on the screen,
     * we hide the oldest one first. Furthermore, if configured, animation overlapping is applied.
     *
     * @param {?} notification New notification to show
     * @return {?}
     */
    continueHandleShowAction(notification) {
        // First (which means only one) notification in the list?
        const /** @type {?} */ numberOfNotifications = this.notifications.length;
        if (numberOfNotifications === 1) {
            notification.component.show().then(this.tempPromiseResolver); // Done
        }
        else {
            const /** @type {?} */ implicitStackingLimit = 2;
            // Stacking enabled? (stacking value below 2 means stacking is disabled)
            if (this.config.behaviour.stacking === false || this.config.behaviour.stacking < implicitStackingLimit) {
                this.notifications[0].component.hide().then(() => {
                    this.removeNotificationFromList(this.notifications[0]);
                    notification.component.show().then(this.tempPromiseResolver); // Done
                });
            }
            else {
                const /** @type {?} */ stepPromises = [];
                // Are there now too many notifications?
                if (numberOfNotifications > this.config.behaviour.stacking) {
                    const /** @type {?} */ oldNotifications = this.notifications.slice(1, numberOfNotifications - 1);
                    // Are animations enabled?
                    if (this.config.animations.enabled) {
                        // Is animation overlap enabled?
                        if (this.config.animations.overlap !== false && this.config.animations.overlap > 0) {
                            stepPromises.push(this.notifications[0].component.hide());
                            setTimeout(() => {
                                stepPromises.push(this.shiftNotifications(oldNotifications, notification.component.getHeight(), true));
                            }, this.config.animations.hide.speed - this.config.animations.overlap);
                            setTimeout(() => {
                                stepPromises.push(notification.component.show());
                            }, this.config.animations.hide.speed + this.config.animations.shift.speed - this.config.animations.overlap);
                        }
                        else {
                            stepPromises.push(new Promise((resolve, reject) => {
                                this.notifications[0].component.hide().then(() => {
                                    this.shiftNotifications(oldNotifications, notification.component.getHeight(), true).then(() => {
                                        notification.component.show().then(resolve);
                                    });
                                });
                            }));
                        }
                    }
                    else {
                        stepPromises.push(this.notifications[0].component.hide());
                        stepPromises.push(this.shiftNotifications(oldNotifications, notification.component.getHeight(), true));
                        stepPromises.push(notification.component.show());
                    }
                }
                else {
                    const /** @type {?} */ oldNotifications = this.notifications.slice(0, numberOfNotifications - 1);
                    // Are animations enabled?
                    if (this.config.animations.enabled) {
                        // Is animation overlap enabled?
                        if (this.config.animations.overlap !== false && this.config.animations.overlap > 0) {
                            stepPromises.push(this.shiftNotifications(oldNotifications, notification.component.getHeight(), true));
                            setTimeout(() => {
                                stepPromises.push(notification.component.show());
                            }, this.config.animations.shift.speed - this.config.animations.overlap);
                        }
                        else {
                            stepPromises.push(new Promise((resolve, reject) => {
                                this.shiftNotifications(oldNotifications, notification.component.getHeight(), true).then(() => {
                                    notification.component.show().then(resolve);
                                });
                            }));
                        }
                    }
                    else {
                        stepPromises.push(this.shiftNotifications(oldNotifications, notification.component.getHeight(), true));
                        stepPromises.push(notification.component.show());
                    }
                }
                Promise.all(stepPromises).then(() => {
                    if (numberOfNotifications > this.config.behaviour.stacking) {
                        this.removeNotificationFromList(this.notifications[0]);
                    }
                    this.tempPromiseResolver();
                }); // Done
            }
        }
    }
    /**
     * Hide an existing notification
     *
     * Fist, we skip everything if there are no notifications at all, or the given notification does not exist. Then, we hide the given
     * notification. If there exist older notifications, we then shift them around to fill the gap. Once both hiding the given notification
     * and shifting the older notificaitons is done, the given notification gets finally removed (from the DOM).
     *
     * @param {?} action Action object, payload contains the notification ID
     * @return {?} Promise, resolved when done
     */
    handleHideAction(action) {
        return new Promise((resolve, reject) => {
            const /** @type {?} */ stepPromises = [];
            // Does the notification exist / are there even any notifications? (let's prevent accidential errors)
            const /** @type {?} */ notification = this.findNotificationById(action.payload);
            if (notification === undefined) {
                resolve();
                return;
            }
            // Get older notifications
            const /** @type {?} */ notificationIndex = this.findNotificationIndexById(action.payload);
            if (notificationIndex === undefined) {
                resolve();
                return;
            }
            const /** @type {?} */ oldNotifications = this.notifications.slice(0, notificationIndex);
            // Do older notifications exist, and thus do we need to shift other notifications as a consequence?
            if (oldNotifications.length > 0) {
                // Are animations enabled?
                if (this.config.animations.enabled && this.config.animations.hide.speed > 0) {
                    // Is animation overlap enabled?
                    if (this.config.animations.overlap !== false && this.config.animations.overlap > 0) {
                        stepPromises.push(notification.component.hide());
                        setTimeout(() => {
                            stepPromises.push(this.shiftNotifications(oldNotifications, notification.component.getHeight(), false));
                        }, this.config.animations.hide.speed - this.config.animations.overlap);
                    }
                    else {
                        notification.component.hide().then(() => {
                            stepPromises.push(this.shiftNotifications(oldNotifications, notification.component.getHeight(), false));
                        });
                    }
                }
                else {
                    stepPromises.push(notification.component.hide());
                    stepPromises.push(this.shiftNotifications(oldNotifications, notification.component.getHeight(), false));
                }
            }
            else {
                stepPromises.push(notification.component.hide());
            }
            // Wait until both hiding and shifting is done, then remove the notification from the list
            Promise.all(stepPromises).then(() => {
                this.removeNotificationFromList(notification);
                resolve(); // Done
            });
        });
    }
    /**
     * Hide the oldest notification (bridge to handleHideAction)
     *
     * @param {?} action Action object
     * @return {?} Promise, resolved when done
     */
    handleHideOldestAction(action) {
        // Are there any notifications? (prevent accidential errors)
        if (this.notifications.length === 0) {
            return new Promise((resolve, reject) => {
                resolve();
            }); // Done
        }
        else {
            action.payload = this.notifications[0].id;
            return this.handleHideAction(action);
        }
    }
    /**
     * Hide the newest notification (bridge to handleHideAction)
     *
     * @param {?} action Action object
     * @return {?} Promise, resolved when done
     */
    handleHideNewestAction(action) {
        // Are there any notifications? (prevent accidential errors)
        if (this.notifications.length === 0) {
            return new Promise((resolve, reject) => {
                resolve();
            }); // Done
        }
        else {
            action.payload = this.notifications[this.notifications.length - 1].id;
            return this.handleHideAction(action);
        }
    }
    /**
     * Hide all notifications at once
     *
     * @param {?} action Action object
     * @return {?} Promise, resolved when done
     */
    handleHideAllAction(action) {
        return new Promise((resolve, reject) => {
            // Are there any notifications? (prevent accidential errors)
            const /** @type {?} */ numberOfNotifications = this.notifications.length;
            if (numberOfNotifications === 0) {
                resolve(); // Done
                return;
            }
            // Are animations enabled?
            if (this.config.animations.enabled && this.config.animations.hide.speed > 0 && this.config.animations.hide.offset !== false &&
                this.config.animations.hide.offset > 0) {
                for (let /** @type {?} */ i = numberOfNotifications - 1; i >= 0; i--) {
                    const /** @type {?} */ animationOffset = this.config.position.vertical.position === 'top' ? numberOfNotifications - 1 : i;
                    setTimeout(() => {
                        this.notifications[i].component.hide().then(() => {
                            // Are we done here, was this the last notification to be hidden?
                            if ((this.config.position.vertical.position === 'top' && i === 0) ||
                                (this.config.position.vertical.position === 'bottom' && i === numberOfNotifications - 1)) {
                                this.removeAllNotificationsFromList();
                                resolve(); // Done
                            }
                        });
                    }, this.config.animations.hide.offset * animationOffset);
                }
            }
            else {
                let /** @type {?} */ stepPromises = [];
                for (let /** @type {?} */ i = numberOfNotifications - 1; i >= 0; i--) {
                    stepPromises.push(this.notifications[i].component.hide());
                }
                Promise.all(stepPromises).then(() => {
                    this.removeAllNotificationsFromList();
                    resolve(); // Done
                });
            }
        });
    }
    /**
     * Shift multiple notifications at once
     *
     * @param {?} notifications List containing the notifications to be shifted
     * @param {?} distance      Distance to shift (in px)
     * @param {?} toMakePlace   Flag, defining in which direciton to shift
     * @return {?} Promise, resolved when done
     */
    shiftNotifications(notifications, distance, toMakePlace) {
        return new Promise((resolve, reject) => {
            // Are there any notifications to shift?
            if (notifications.length === 0) {
                resolve();
                return;
            }
            let /** @type {?} */ notificationPromises = [];
            for (let /** @type {?} */ i = notifications.length - 1; i >= 0; i--) {
                notificationPromises.push(notifications[i].component.shift(distance, toMakePlace));
            }
            Promise.all(notificationPromises).then(resolve); // Done
        });
    }
    /**
     * Add a new notification to the list of notifications (triggers change detection)
     *
     * @param {?} notification Notification to add to the list of notifications
     * @return {?}
     */
    addNotificationToList(notification) {
        this.notifications.push(notification);
        this.changeDetector.markForCheck(); // Run change detection because the notification list changed
    }
    /**
     * Remove an existing notification from the list of notifications (triggers change detection)
     *
     * @param {?} notification Notification to be removed from the list of notifications
     * @return {?}
     */
    removeNotificationFromList(notification) {
        this.notifications =
            this.notifications.filter((item) => item.component !== notification.component);
        this.changeDetector.markForCheck(); // Run change detection because the notification list changed
    }
    /**
     * Remove all notifications from the list (triggers change detection)
     * @return {?}
     */
    removeAllNotificationsFromList() {
        this.notifications = [];
        this.changeDetector.markForCheck(); // Run change detection because the notification list changed
    }
    /**
     * Helper: Find a notification in the notification list by a given notification ID
     *
     * @param {?} notificationId Notification ID, used for finding notification
     * @return {?} Notification, undefined if not found
     */
    findNotificationById(notificationId) {
        return this.notifications.find((currentNotification) => currentNotification.id === notificationId);
    }
    /**
     * Helper: Find a notification's index by a given notification ID
     *
     * @param {?} notificationId Notification ID, used for finding a notification's index
     * @return {?} Notification index, undefined if not found
     */
    findNotificationIndexById(notificationId) {
        const /** @type {?} */ notificationIndex = this.notifications.findIndex((currentNotification) => currentNotification.id === notificationId);
        return (notificationIndex !== -1 ? notificationIndex : undefined);
    }
}
NotifierContainerComponent.decorators = [
    { type: Component, args: [{
                changeDetection: ChangeDetectionStrategy.OnPush,
                // (#perfmatters)
                host: {
                    class: 'notifier__container'
                },
                selector: 'notifier-container',
                template: '<ul><li *ngFor="let notification of notifications; trackBy: identifyNotification;" class="notifier__container-list"><notifier-notification (dismiss)="onNotificationDismiss( $event )" (ready)="onNotificationReady( $event )" [notification]="notification"></notifier-notification></ul>'
            },] },
];
/** @nocollapse */
NotifierContainerComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: NotifierQueueService },
    { type: NotifierService }
];
function NotifierContainerComponent_tsickle_Closure_declarations() {
    /**
     * List of currently somewhat active notifications
     * @type {?}
     */
    NotifierContainerComponent.prototype.notifications;
    /**
     * Change detector
     * @type {?}
     */
    NotifierContainerComponent.prototype.changeDetector;
    /**
     * Notifier queue service
     * @type {?}
     */
    NotifierContainerComponent.prototype.queueService;
    /**
     * Notifier configuration
     * @type {?}
     */
    NotifierContainerComponent.prototype.config;
    /**
     * Queue service observable subscription (saved for cleanup)
     * @type {?}
     */
    NotifierContainerComponent.prototype.queueServiceSubscription;
    /**
     * Promise resolve function reference, temporarily used while the notification child component gets created
     * @type {?}
     */
    NotifierContainerComponent.prototype.tempPromiseResolver;
}
//# sourceMappingURL=notifier-container.component.js.map