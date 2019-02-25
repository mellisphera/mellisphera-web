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
var NotifierContainerComponent = /** @class */ (function () {
    function NotifierContainerComponent(changeDetector, notifierQueueService, notifierService) {
        this.changeDetector = changeDetector;
        this.queueService = notifierQueueService;
        this.config = notifierService.getConfig();
        this.notifications = [];
    }
    /**
     * Component initialization lifecycle hook, connects this component to the action queue, and then handles incoming actions
     * @return {?}
     */
    NotifierContainerComponent.prototype.ngOnInit = /**
     * Component initialization lifecycle hook, connects this component to the action queue, and then handles incoming actions
     * @return {?}
     */
    function () {
        var _this = this;
        this.queueServiceSubscription = this.queueService.actionStream.subscribe(function (action) {
            _this.handleAction(action).then(function () {
                _this.queueService.continue();
            });
        });
    };
    /**
     * Component destroyment lifecycle hook, cleans up the observable subsciption
     * @return {?}
     */
    NotifierContainerComponent.prototype.ngOnDestroy = /**
     * Component destroyment lifecycle hook, cleans up the observable subsciption
     * @return {?}
     */
    function () {
        if (this.queueServiceSubscription) {
            this.queueServiceSubscription.unsubscribe();
        }
    };
    /**
     * Notification identifier, used as the ngFor trackby function
     *
     * @param {?} index        Index
     * @param {?} notification Notifier notification
     * @return {?} Notification ID as the unique identnfier
     */
    NotifierContainerComponent.prototype.identifyNotification = /**
     * Notification identifier, used as the ngFor trackby function
     *
     * @param {?} index        Index
     * @param {?} notification Notifier notification
     * @return {?} Notification ID as the unique identnfier
     */
    function (index, notification) {
        return notification.id;
    };
    /**
     * Event handler, handles clicks on notification dismiss buttons
     *
     * @param {?} notificationId ID of the notification to dismiss
     * @return {?}
     */
    NotifierContainerComponent.prototype.onNotificationDismiss = /**
     * Event handler, handles clicks on notification dismiss buttons
     *
     * @param {?} notificationId ID of the notification to dismiss
     * @return {?}
     */
    function (notificationId) {
        this.queueService.push({
            payload: notificationId,
            type: 'HIDE'
        });
    };
    /**
     * Event handler, handles notification ready events
     *
     * @param {?} notificationComponent Notification component reference
     * @return {?}
     */
    NotifierContainerComponent.prototype.onNotificationReady = /**
     * Event handler, handles notification ready events
     *
     * @param {?} notificationComponent Notification component reference
     * @return {?}
     */
    function (notificationComponent) {
        var /** @type {?} */ currentNotification = this.notifications[this.notifications.length - 1]; // Get the latest notification
        currentNotification.component = notificationComponent; // Save the new omponent reference
        this.continueHandleShowAction(currentNotification); // Continue with handling the show action
    };
    /**
     * Handle incoming actions by mapping action types to methods, and then running them
     *
     * @param {?} action Action object
     * @return {?} Promise, resolved when done
     */
    NotifierContainerComponent.prototype.handleAction = /**
     * Handle incoming actions by mapping action types to methods, and then running them
     *
     * @param {?} action Action object
     * @return {?} Promise, resolved when done
     */
    function (action) {
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
                return new Promise(function (resolve, reject) {
                    resolve(); // Ignore unknown action types
                });
        }
    };
    /**
     * Show a new notification
     *
     * We simply add the notification to the list, and then wait until its properly initialized / created / rendered.
     *
     * @param {?} action Action object
     * @return {?} Promise, resolved when done
     */
    NotifierContainerComponent.prototype.handleShowAction = /**
     * Show a new notification
     *
     * We simply add the notification to the list, and then wait until its properly initialized / created / rendered.
     *
     * @param {?} action Action object
     * @return {?} Promise, resolved when done
     */
    function (action) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.tempPromiseResolver = resolve; // Save the promise resolve function so that it can be called later on by another method
            _this.addNotificationToList(new NotifierNotification(action.payload));
        });
    };
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
    NotifierContainerComponent.prototype.continueHandleShowAction = /**
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
    function (notification) {
        var _this = this;
        // First (which means only one) notification in the list?
        var /** @type {?} */ numberOfNotifications = this.notifications.length;
        if (numberOfNotifications === 1) {
            notification.component.show().then(this.tempPromiseResolver); // Done
        }
        else {
            var /** @type {?} */ implicitStackingLimit = 2;
            // Stacking enabled? (stacking value below 2 means stacking is disabled)
            if (this.config.behaviour.stacking === false || this.config.behaviour.stacking < implicitStackingLimit) {
                this.notifications[0].component.hide().then(function () {
                    _this.removeNotificationFromList(_this.notifications[0]);
                    notification.component.show().then(_this.tempPromiseResolver); // Done
                });
            }
            else {
                var /** @type {?} */ stepPromises_1 = [];
                // Are there now too many notifications?
                if (numberOfNotifications > this.config.behaviour.stacking) {
                    var /** @type {?} */ oldNotifications_1 = this.notifications.slice(1, numberOfNotifications - 1);
                    // Are animations enabled?
                    if (this.config.animations.enabled) {
                        // Is animation overlap enabled?
                        if (this.config.animations.overlap !== false && this.config.animations.overlap > 0) {
                            stepPromises_1.push(this.notifications[0].component.hide());
                            setTimeout(function () {
                                stepPromises_1.push(_this.shiftNotifications(oldNotifications_1, notification.component.getHeight(), true));
                            }, this.config.animations.hide.speed - this.config.animations.overlap);
                            setTimeout(function () {
                                stepPromises_1.push(notification.component.show());
                            }, this.config.animations.hide.speed + this.config.animations.shift.speed - this.config.animations.overlap);
                        }
                        else {
                            stepPromises_1.push(new Promise(function (resolve, reject) {
                                _this.notifications[0].component.hide().then(function () {
                                    _this.shiftNotifications(oldNotifications_1, notification.component.getHeight(), true).then(function () {
                                        notification.component.show().then(resolve);
                                    });
                                });
                            }));
                        }
                    }
                    else {
                        stepPromises_1.push(this.notifications[0].component.hide());
                        stepPromises_1.push(this.shiftNotifications(oldNotifications_1, notification.component.getHeight(), true));
                        stepPromises_1.push(notification.component.show());
                    }
                }
                else {
                    var /** @type {?} */ oldNotifications_2 = this.notifications.slice(0, numberOfNotifications - 1);
                    // Are animations enabled?
                    if (this.config.animations.enabled) {
                        // Is animation overlap enabled?
                        if (this.config.animations.overlap !== false && this.config.animations.overlap > 0) {
                            stepPromises_1.push(this.shiftNotifications(oldNotifications_2, notification.component.getHeight(), true));
                            setTimeout(function () {
                                stepPromises_1.push(notification.component.show());
                            }, this.config.animations.shift.speed - this.config.animations.overlap);
                        }
                        else {
                            stepPromises_1.push(new Promise(function (resolve, reject) {
                                _this.shiftNotifications(oldNotifications_2, notification.component.getHeight(), true).then(function () {
                                    notification.component.show().then(resolve);
                                });
                            }));
                        }
                    }
                    else {
                        stepPromises_1.push(this.shiftNotifications(oldNotifications_2, notification.component.getHeight(), true));
                        stepPromises_1.push(notification.component.show());
                    }
                }
                Promise.all(stepPromises_1).then(function () {
                    if (numberOfNotifications > _this.config.behaviour.stacking) {
                        _this.removeNotificationFromList(_this.notifications[0]);
                    }
                    _this.tempPromiseResolver();
                }); // Done
            }
        }
    };
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
    NotifierContainerComponent.prototype.handleHideAction = /**
     * Hide an existing notification
     *
     * Fist, we skip everything if there are no notifications at all, or the given notification does not exist. Then, we hide the given
     * notification. If there exist older notifications, we then shift them around to fill the gap. Once both hiding the given notification
     * and shifting the older notificaitons is done, the given notification gets finally removed (from the DOM).
     *
     * @param {?} action Action object, payload contains the notification ID
     * @return {?} Promise, resolved when done
     */
    function (action) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var /** @type {?} */ stepPromises = [];
            // Does the notification exist / are there even any notifications? (let's prevent accidential errors)
            var /** @type {?} */ notification = _this.findNotificationById(action.payload);
            if (notification === undefined) {
                resolve();
                return;
            }
            // Get older notifications
            var /** @type {?} */ notificationIndex = _this.findNotificationIndexById(action.payload);
            if (notificationIndex === undefined) {
                resolve();
                return;
            }
            var /** @type {?} */ oldNotifications = _this.notifications.slice(0, notificationIndex);
            // Do older notifications exist, and thus do we need to shift other notifications as a consequence?
            if (oldNotifications.length > 0) {
                // Are animations enabled?
                if (_this.config.animations.enabled && _this.config.animations.hide.speed > 0) {
                    // Is animation overlap enabled?
                    if (_this.config.animations.overlap !== false && _this.config.animations.overlap > 0) {
                        stepPromises.push(notification.component.hide());
                        setTimeout(function () {
                            stepPromises.push(_this.shiftNotifications(oldNotifications, notification.component.getHeight(), false));
                        }, _this.config.animations.hide.speed - _this.config.animations.overlap);
                    }
                    else {
                        notification.component.hide().then(function () {
                            stepPromises.push(_this.shiftNotifications(oldNotifications, notification.component.getHeight(), false));
                        });
                    }
                }
                else {
                    stepPromises.push(notification.component.hide());
                    stepPromises.push(_this.shiftNotifications(oldNotifications, notification.component.getHeight(), false));
                }
            }
            else {
                stepPromises.push(notification.component.hide());
            }
            // Wait until both hiding and shifting is done, then remove the notification from the list
            Promise.all(stepPromises).then(function () {
                _this.removeNotificationFromList(notification);
                resolve(); // Done
            });
        });
    };
    /**
     * Hide the oldest notification (bridge to handleHideAction)
     *
     * @param {?} action Action object
     * @return {?} Promise, resolved when done
     */
    NotifierContainerComponent.prototype.handleHideOldestAction = /**
     * Hide the oldest notification (bridge to handleHideAction)
     *
     * @param {?} action Action object
     * @return {?} Promise, resolved when done
     */
    function (action) {
        // Are there any notifications? (prevent accidential errors)
        if (this.notifications.length === 0) {
            return new Promise(function (resolve, reject) {
                resolve();
            }); // Done
        }
        else {
            action.payload = this.notifications[0].id;
            return this.handleHideAction(action);
        }
    };
    /**
     * Hide the newest notification (bridge to handleHideAction)
     *
     * @param {?} action Action object
     * @return {?} Promise, resolved when done
     */
    NotifierContainerComponent.prototype.handleHideNewestAction = /**
     * Hide the newest notification (bridge to handleHideAction)
     *
     * @param {?} action Action object
     * @return {?} Promise, resolved when done
     */
    function (action) {
        // Are there any notifications? (prevent accidential errors)
        if (this.notifications.length === 0) {
            return new Promise(function (resolve, reject) {
                resolve();
            }); // Done
        }
        else {
            action.payload = this.notifications[this.notifications.length - 1].id;
            return this.handleHideAction(action);
        }
    };
    /**
     * Hide all notifications at once
     *
     * @param {?} action Action object
     * @return {?} Promise, resolved when done
     */
    NotifierContainerComponent.prototype.handleHideAllAction = /**
     * Hide all notifications at once
     *
     * @param {?} action Action object
     * @return {?} Promise, resolved when done
     */
    function (action) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // Are there any notifications? (prevent accidential errors)
            var /** @type {?} */ numberOfNotifications = _this.notifications.length;
            if (numberOfNotifications === 0) {
                resolve(); // Done
                return;
            }
            // Are animations enabled?
            if (_this.config.animations.enabled && _this.config.animations.hide.speed > 0 && _this.config.animations.hide.offset !== false &&
                _this.config.animations.hide.offset > 0) {
                var _loop_1 = function (i) {
                    var /** @type {?} */ animationOffset = _this.config.position.vertical.position === 'top' ? numberOfNotifications - 1 : i;
                    setTimeout(function () {
                        _this.notifications[i].component.hide().then(function () {
                            // Are we done here, was this the last notification to be hidden?
                            if ((_this.config.position.vertical.position === 'top' && i === 0) ||
                                (_this.config.position.vertical.position === 'bottom' && i === numberOfNotifications - 1)) {
                                _this.removeAllNotificationsFromList();
                                resolve(); // Done
                            }
                        });
                    }, _this.config.animations.hide.offset * animationOffset);
                };
                for (var /** @type {?} */ i = numberOfNotifications - 1; i >= 0; i--) {
                    _loop_1(i);
                }
            }
            else {
                var /** @type {?} */ stepPromises = [];
                for (var /** @type {?} */ i = numberOfNotifications - 1; i >= 0; i--) {
                    stepPromises.push(_this.notifications[i].component.hide());
                }
                Promise.all(stepPromises).then(function () {
                    _this.removeAllNotificationsFromList();
                    resolve(); // Done
                });
            }
        });
    };
    /**
     * Shift multiple notifications at once
     *
     * @param {?} notifications List containing the notifications to be shifted
     * @param {?} distance      Distance to shift (in px)
     * @param {?} toMakePlace   Flag, defining in which direciton to shift
     * @return {?} Promise, resolved when done
     */
    NotifierContainerComponent.prototype.shiftNotifications = /**
     * Shift multiple notifications at once
     *
     * @param {?} notifications List containing the notifications to be shifted
     * @param {?} distance      Distance to shift (in px)
     * @param {?} toMakePlace   Flag, defining in which direciton to shift
     * @return {?} Promise, resolved when done
     */
    function (notifications, distance, toMakePlace) {
        return new Promise(function (resolve, reject) {
            // Are there any notifications to shift?
            if (notifications.length === 0) {
                resolve();
                return;
            }
            var /** @type {?} */ notificationPromises = [];
            for (var /** @type {?} */ i = notifications.length - 1; i >= 0; i--) {
                notificationPromises.push(notifications[i].component.shift(distance, toMakePlace));
            }
            Promise.all(notificationPromises).then(resolve); // Done
        });
    };
    /**
     * Add a new notification to the list of notifications (triggers change detection)
     *
     * @param {?} notification Notification to add to the list of notifications
     * @return {?}
     */
    NotifierContainerComponent.prototype.addNotificationToList = /**
     * Add a new notification to the list of notifications (triggers change detection)
     *
     * @param {?} notification Notification to add to the list of notifications
     * @return {?}
     */
    function (notification) {
        this.notifications.push(notification);
        this.changeDetector.markForCheck(); // Run change detection because the notification list changed
    };
    /**
     * Remove an existing notification from the list of notifications (triggers change detection)
     *
     * @param {?} notification Notification to be removed from the list of notifications
     * @return {?}
     */
    NotifierContainerComponent.prototype.removeNotificationFromList = /**
     * Remove an existing notification from the list of notifications (triggers change detection)
     *
     * @param {?} notification Notification to be removed from the list of notifications
     * @return {?}
     */
    function (notification) {
        this.notifications =
            this.notifications.filter(function (item) { return item.component !== notification.component; });
        this.changeDetector.markForCheck(); // Run change detection because the notification list changed
    };
    /**
     * Remove all notifications from the list (triggers change detection)
     * @return {?}
     */
    NotifierContainerComponent.prototype.removeAllNotificationsFromList = /**
     * Remove all notifications from the list (triggers change detection)
     * @return {?}
     */
    function () {
        this.notifications = [];
        this.changeDetector.markForCheck(); // Run change detection because the notification list changed
    };
    /**
     * Helper: Find a notification in the notification list by a given notification ID
     *
     * @param {?} notificationId Notification ID, used for finding notification
     * @return {?} Notification, undefined if not found
     */
    NotifierContainerComponent.prototype.findNotificationById = /**
     * Helper: Find a notification in the notification list by a given notification ID
     *
     * @param {?} notificationId Notification ID, used for finding notification
     * @return {?} Notification, undefined if not found
     */
    function (notificationId) {
        return this.notifications.find(function (currentNotification) { return currentNotification.id === notificationId; });
    };
    /**
     * Helper: Find a notification's index by a given notification ID
     *
     * @param {?} notificationId Notification ID, used for finding a notification's index
     * @return {?} Notification index, undefined if not found
     */
    NotifierContainerComponent.prototype.findNotificationIndexById = /**
     * Helper: Find a notification's index by a given notification ID
     *
     * @param {?} notificationId Notification ID, used for finding a notification's index
     * @return {?} Notification index, undefined if not found
     */
    function (notificationId) {
        var /** @type {?} */ notificationIndex = this.notifications.findIndex(function (currentNotification) { return currentNotification.id === notificationId; });
        return (notificationIndex !== -1 ? notificationIndex : undefined);
    };
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
    NotifierContainerComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef },
        { type: NotifierQueueService },
        { type: NotifierService }
    ]; };
    return NotifierContainerComponent;
}());
export { NotifierContainerComponent };
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