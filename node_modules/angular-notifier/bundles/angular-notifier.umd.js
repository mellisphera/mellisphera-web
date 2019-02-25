(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs', '@angular/common'], factory) :
    (factory((global['angular-notifier'] = {}),global.ng.core,global.rxjs,global.ng.common));
}(this, (function (exports,core,rxjs,common) { 'use strict';

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
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * Notifier queue service
     *
     * In general, API calls don't get processed right away. Instead, we have to queue them up in order to prevent simultanious API calls
     * interfering with each other. This, at least in theory, is possible at any time. In particular, animations - which potentially overlap -
     * can cause changes in JS classes as well as affect the DOM. Therefore, the queue service takes all actions, puts them in a queue, and
     * processes them at the right time (which is when the previous action has been processed successfully).
     *
     * Technical sidenote:
     * An action looks pretty similar to the ones within the Flux / Redux pattern.
     */
    var NotifierQueueService = /** @class */ (function () {
        function NotifierQueueService() {
            this.actionStream = new rxjs.Subject();
            this.actionQueue = [];
            this.isActionInProgress = false;
        }
        /**
         * Push a new action to the queue, and try to run it
         *
         * @param {?} action Action object
         * @return {?}
         */
        NotifierQueueService.prototype.push = /**
         * Push a new action to the queue, and try to run it
         *
         * @param {?} action Action object
         * @return {?}
         */
        function (action) {
            this.actionQueue.push(action);
            this.tryToRunNextAction();
        };
        /**
         * Continue with the next action (called when the current action is finished)
         * @return {?}
         */
        NotifierQueueService.prototype.continue = /**
         * Continue with the next action (called when the current action is finished)
         * @return {?}
         */
        function () {
            this.isActionInProgress = false;
            this.tryToRunNextAction();
        };
        /**
         * Try to run the next action in the queue; we skip if there already is some action in progress, or if there is no action left
         * @return {?}
         */
        NotifierQueueService.prototype.tryToRunNextAction = /**
         * Try to run the next action in the queue; we skip if there already is some action in progress, or if there is no action left
         * @return {?}
         */
        function () {
            if (this.isActionInProgress || this.actionQueue.length === 0) {
                return; // Skip (the queue can now go drink a coffee as it has nothing to do anymore)
            }
            this.isActionInProgress = true;
            this.actionStream.next(this.actionQueue.shift()); // Push next action to the stream, and remove the current action from the queue
        };
        NotifierQueueService.decorators = [
            { type: core.Injectable },
        ];
        /** @nocollapse */
        NotifierQueueService.ctorParameters = function () { return []; };
        return NotifierQueueService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * Notifier configuration
     *
     * The notifier configuration defines what notifications look like, how they behave, and how they get animated. It is a global
     * configuration, which means that it only can be set once (at the beginning), and cannot be changed afterwards. Aligning to the world of
     * Angular, this configuration can be provided in the root app module - alternatively, a meaningful default configuration will be used.
     */
    var  /**
     * Notifier configuration
     *
     * The notifier configuration defines what notifications look like, how they behave, and how they get animated. It is a global
     * configuration, which means that it only can be set once (at the beginning), and cannot be changed afterwards. Aligning to the world of
     * Angular, this configuration can be provided in the root app module - alternatively, a meaningful default configuration will be used.
     */
    NotifierConfig = /** @class */ (function () {
        function NotifierConfig(customOptions) {
            if (customOptions === void 0) { customOptions = {}; }
            // Set default values
            this.animations = {
                enabled: true,
                hide: {
                    easing: 'ease',
                    offset: 50,
                    preset: 'fade',
                    speed: 300
                },
                overlap: 150,
                shift: {
                    easing: 'ease',
                    speed: 300
                },
                show: {
                    easing: 'ease',
                    preset: 'slide',
                    speed: 300
                }
            };
            this.behaviour = {
                autoHide: 7000,
                onClick: false,
                onMouseover: 'pauseAutoHide',
                showDismissButton: true,
                stacking: 4
            };
            this.position = {
                horizontal: {
                    distance: 12,
                    position: 'left'
                },
                vertical: {
                    distance: 12,
                    gap: 10,
                    position: 'bottom'
                }
            };
            this.theme = 'material';
            // The following merges the custom options into the notifier config, respecting the already set default values
            // This linear, more explicit and code-sizy workflow is preferred here over a recursive one (because we know the object structure)
            // Technical sidenote: Objects are merged, other types of values simply overwritten / copied
            if (customOptions.theme !== undefined) {
                this.theme = customOptions.theme;
            }
            if (customOptions.animations !== undefined) {
                if (customOptions.animations.enabled !== undefined) {
                    this.animations.enabled = customOptions.animations.enabled;
                }
                if (customOptions.animations.overlap !== undefined) {
                    this.animations.overlap = customOptions.animations.overlap;
                }
                if (customOptions.animations.hide !== undefined) {
                    Object.assign(this.animations.hide, customOptions.animations.hide);
                }
                if (customOptions.animations.shift !== undefined) {
                    Object.assign(this.animations.shift, customOptions.animations.shift);
                }
                if (customOptions.animations.show !== undefined) {
                    Object.assign(this.animations.show, customOptions.animations.show);
                }
            }
            if (customOptions.behaviour !== undefined) {
                Object.assign(this.behaviour, customOptions.behaviour);
            }
            if (customOptions.position !== undefined) {
                if (customOptions.position.horizontal !== undefined) {
                    Object.assign(this.position.horizontal, customOptions.position.horizontal);
                }
                if (customOptions.position.vertical !== undefined) {
                    Object.assign(this.position.vertical, customOptions.position.vertical);
                }
            }
        }
        return NotifierConfig;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
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
            { type: core.Injectable },
        ];
        /** @nocollapse */
        NotifierService.ctorParameters = function () { return [
            { type: NotifierQueueService },
            { type: NotifierConfig, decorators: [{ type: core.Inject, args: [core.forwardRef(function () { return NotifierConfigToken; }),] }] }
        ]; };
        return NotifierService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
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
            { type: core.Component, args: [{
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
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
            { type: core.ChangeDetectorRef },
            { type: NotifierQueueService },
            { type: NotifierService }
        ]; };
        return NotifierContainerComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * Fade animation preset
     */
    var /** @type {?} */ fade = {
        hide: function () {
            return {
                from: {
                    opacity: '1'
                },
                to: {
                    opacity: '0'
                }
            };
        },
        show: function () {
            return {
                from: {
                    opacity: '0'
                },
                to: {
                    opacity: '1'
                }
            };
        }
    };

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * Slide animation preset
     */
    var /** @type {?} */ slide = {
        hide: function (notification) {
            // Prepare variables
            var /** @type {?} */ config = notification.component.getConfig();
            var /** @type {?} */ shift = notification.component.getShift();
            var /** @type {?} */ from;
            var /** @type {?} */ to;
            // Configure variables, depending on configuration and component
            if (config.position.horizontal.position === 'left') {
                from = {
                    transform: "translate3d( 0, " + shift + "px, 0 )"
                };
                to = {
                    transform: "translate3d( calc( -100% - " + config.position.horizontal.distance + "px - 10px ), " + shift + "px, 0 )"
                };
            }
            else if (config.position.horizontal.position === 'right') {
                from = {
                    transform: "translate3d( 0, " + shift + "px, 0 )"
                };
                to = {
                    transform: "translate3d( calc( 100% + " + config.position.horizontal.distance + "px + 10px ), " + shift + "px, 0 )"
                };
            }
            else {
                var /** @type {?} */ horizontalPosition = void 0;
                if (config.position.vertical.position === 'top') {
                    horizontalPosition = "calc( -100% - " + config.position.horizontal.distance + "px - 10px )";
                }
                else {
                    horizontalPosition = "calc( 100% + " + config.position.horizontal.distance + "px + 10px )";
                }
                from = {
                    transform: "translate3d( -50%, " + shift + "px, 0 )"
                };
                to = {
                    transform: "translate3d( -50%, " + horizontalPosition + ", 0 )"
                };
            }
            // Done
            return {
                from: from,
                to: to
            };
        },
        show: function (notification) {
            // Prepare variables
            var /** @type {?} */ config = notification.component.getConfig();
            var /** @type {?} */ from;
            var /** @type {?} */ to;
            // Configure variables, depending on configuration and component
            if (config.position.horizontal.position === 'left') {
                from = {
                    transform: "translate3d( calc( -100% - " + config.position.horizontal.distance + "px - 10px ), 0, 0 )"
                };
                to = {
                    transform: 'translate3d( 0, 0, 0 )'
                };
            }
            else if (config.position.horizontal.position === 'right') {
                from = {
                    transform: "translate3d( calc( 100% + " + config.position.horizontal.distance + "px + 10px ), 0, 0 )"
                };
                to = {
                    transform: 'translate3d( 0, 0, 0 )'
                };
            }
            else {
                var /** @type {?} */ horizontalPosition = void 0;
                if (config.position.vertical.position === 'top') {
                    horizontalPosition = "calc( -100% - " + config.position.horizontal.distance + "px - 10px )";
                }
                else {
                    horizontalPosition = "calc( 100% + " + config.position.horizontal.distance + "px + 10px )";
                }
                from = {
                    transform: "translate3d( -50%, " + horizontalPosition + ", 0 )"
                };
                to = {
                    transform: 'translate3d( -50%, 0, 0 )'
                };
            }
            // Done
            return {
                from: from,
                to: to
            };
        }
    };

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * Notifier animation service
     */
    var NotifierAnimationService = /** @class */ (function () {
        function NotifierAnimationService() {
            this.animationPresets = {
                fade: fade,
                slide: slide
            };
        }
        /**
         * Get animation data
         *
         * This method generates all data the Web Animations API needs to animate our notification. The result depends on both the animation
         * direction (either in or out) as well as the notifications (and its attributes) itself.
         *
         * @param {?} direction    Animation direction, either in or out
         * @param {?} notification Notification the animation data should be generated for
         * @return {?} Animation information
         */
        NotifierAnimationService.prototype.getAnimationData = /**
         * Get animation data
         *
         * This method generates all data the Web Animations API needs to animate our notification. The result depends on both the animation
         * direction (either in or out) as well as the notifications (and its attributes) itself.
         *
         * @param {?} direction    Animation direction, either in or out
         * @param {?} notification Notification the animation data should be generated for
         * @return {?} Animation information
         */
        function (direction, notification) {
            // Get all necessary animation data
            var /** @type {?} */ keyframes;
            var /** @type {?} */ duration;
            var /** @type {?} */ easing;
            if (direction === 'show') {
                keyframes = this.animationPresets[notification.component.getConfig().animations.show.preset].show(notification);
                duration = notification.component.getConfig().animations.show.speed;
                easing = notification.component.getConfig().animations.show.easing;
            }
            else {
                keyframes = this.animationPresets[notification.component.getConfig().animations.hide.preset].hide(notification);
                duration = notification.component.getConfig().animations.hide.speed;
                easing = notification.component.getConfig().animations.hide.easing;
            }
            // Build and return animation data
            return {
                keyframes: [
                    keyframes.from,
                    keyframes.to
                ],
                options: {
                    duration: duration,
                    easing: easing,
                    fill: 'forwards' // Keep the newly painted state after the animation finished
                }
            };
        };
        NotifierAnimationService.decorators = [
            { type: core.Injectable },
        ];
        /** @nocollapse */
        NotifierAnimationService.ctorParameters = function () { return []; };
        return NotifierAnimationService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * Notifier timer service
     *
     * This service acts as a timer, needed due to the still rather limited setTimeout JavaScript API. The timer service can start and stop a
     * timer. Furthermore, it can also pause the timer at any time, and resume later on. The timer API workd promise-based.
     */
    var NotifierTimerService = /** @class */ (function () {
        function NotifierTimerService() {
            this.now = 0;
            this.remaining = 0;
        }
        /**
         * Start (or resume) the timer
         *
         * @param {?} duration Timer duration, in ms
         * @return {?} Promise, resolved once the timer finishes
         */
        NotifierTimerService.prototype.start = /**
         * Start (or resume) the timer
         *
         * @param {?} duration Timer duration, in ms
         * @return {?} Promise, resolved once the timer finishes
         */
        function (duration) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                // For the first run ...
                // For the first run ...
                _this.remaining = duration;
                // Setup, then start the timer
                // Setup, then start the timer
                _this.finishPromiseResolver = resolve;
                _this.continue();
            });
        };
        /**
         * Pause the timer
         * @return {?}
         */
        NotifierTimerService.prototype.pause = /**
         * Pause the timer
         * @return {?}
         */
        function () {
            clearTimeout(this.timerId);
            this.remaining -= new Date().getTime() - this.now;
        };
        /**
         * Continue the timer
         * @return {?}
         */
        NotifierTimerService.prototype.continue = /**
         * Continue the timer
         * @return {?}
         */
        function () {
            var _this = this;
            this.now = new Date().getTime();
            this.timerId = window.setTimeout(function () {
                _this.finish();
            }, this.remaining);
        };
        /**
         * Stop the timer
         * @return {?}
         */
        NotifierTimerService.prototype.stop = /**
         * Stop the timer
         * @return {?}
         */
        function () {
            clearTimeout(this.timerId);
            this.remaining = 0;
        };
        /**
         * Finish up the timeout by resolving the timer promise
         * @return {?}
         */
        NotifierTimerService.prototype.finish = /**
         * Finish up the timeout by resolving the timer promise
         * @return {?}
         */
        function () {
            this.finishPromiseResolver();
        };
        NotifierTimerService.decorators = [
            { type: core.Injectable },
        ];
        /** @nocollapse */
        NotifierTimerService.ctorParameters = function () { return []; };
        return NotifierTimerService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * Notifier notification component
     * -------------------------------
     * This component is responsible for actually displaying the notification on screen. In addition, it's able to show and hide this
     * notification, in particular to animate this notification in and out, as well as shift (move) this notification vertically around.
     * Furthermore, the notification component handles all interactions the user has with this notification / component, such as clicks and
     * mouse movements.
     */
    var NotifierNotificationComponent = /** @class */ (function () {
        function NotifierNotificationComponent(elementRef, renderer, notifierService, notifierTimerService, notifierAnimationService) {
            this.config = notifierService.getConfig();
            this.ready = new core.EventEmitter();
            this.dismiss = new core.EventEmitter();
            this.timerService = notifierTimerService;
            this.animationService = notifierAnimationService;
            this.renderer = renderer;
            this.element = elementRef.nativeElement;
            this.elementShift = 0;
        }
        /**
         * Component after view init lifecycle hook, setts up the component and then emits the ready event
         * @return {?}
         */
        NotifierNotificationComponent.prototype.ngAfterViewInit = /**
         * Component after view init lifecycle hook, setts up the component and then emits the ready event
         * @return {?}
         */
        function () {
            this.setup();
            this.elementHeight = this.element.offsetHeight;
            this.elementWidth = this.element.offsetWidth;
            this.ready.emit(this);
        };
        /**
         * Get the notifier config
         *
         * @return {?} Notifier configuration
         */
        NotifierNotificationComponent.prototype.getConfig = /**
         * Get the notifier config
         *
         * @return {?} Notifier configuration
         */
        function () {
            return this.config;
        };
        /**
         * Get notification element height (in px)
         *
         * @return {?} Notification element height (in px)
         */
        NotifierNotificationComponent.prototype.getHeight = /**
         * Get notification element height (in px)
         *
         * @return {?} Notification element height (in px)
         */
        function () {
            return this.elementHeight;
        };
        /**
         * Get notification element width (in px)
         *
         * @return {?} Notification element height (in px)
         */
        NotifierNotificationComponent.prototype.getWidth = /**
         * Get notification element width (in px)
         *
         * @return {?} Notification element height (in px)
         */
        function () {
            return this.elementWidth;
        };
        /**
         * Get notification shift offset (in px)
         *
         * @return {?} Notification element shift offset (in px)
         */
        NotifierNotificationComponent.prototype.getShift = /**
         * Get notification shift offset (in px)
         *
         * @return {?} Notification element shift offset (in px)
         */
        function () {
            return this.elementShift;
        };
        /**
         * Show (animate in) this notification
         *
         * @return {?} Promise, resolved when done
         */
        NotifierNotificationComponent.prototype.show = /**
         * Show (animate in) this notification
         *
         * @return {?} Promise, resolved when done
         */
        function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                // Are animations enabled?
                if (_this.config.animations.enabled && _this.config.animations.show.speed > 0) {
                    // Get animation data
                    var /** @type {?} */ animationData = _this.animationService.getAnimationData('show', _this.notification);
                    // Set initial styles (styles before animation), prevents quick flicker when animation starts
                    var /** @type {?} */ animatedProperties = Object.keys(animationData.keyframes[0]);
                    for (var /** @type {?} */ i = animatedProperties.length - 1; i >= 0; i--) {
                        _this.renderer.setStyle(_this.element, animatedProperties[i], animationData.keyframes[0][animatedProperties[i]]);
                    }
                    // Animate notification in
                    // Animate notification in
                    _this.renderer.setStyle(_this.element, 'visibility', 'visible');
                    var /** @type {?} */ animation = _this.element.animate(animationData.keyframes, animationData.options);
                    animation.onfinish = function () {
                        _this.startAutoHideTimer();
                        resolve(); // Done
                    };
                }
                else {
                    // Show notification
                    // Show notification
                    _this.renderer.setStyle(_this.element, 'visibility', 'visible');
                    _this.startAutoHideTimer();
                    resolve(); // Done
                }
            });
        };
        /**
         * Hide (animate out) this notification
         *
         * @return {?} Promise, resolved when done
         */
        NotifierNotificationComponent.prototype.hide = /**
         * Hide (animate out) this notification
         *
         * @return {?} Promise, resolved when done
         */
        function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.stopAutoHideTimer();
                // Are animations enabled?
                if (_this.config.animations.enabled && _this.config.animations.hide.speed > 0) {
                    var /** @type {?} */ animationData = _this.animationService.getAnimationData('hide', _this.notification);
                    var /** @type {?} */ animation = _this.element.animate(animationData.keyframes, animationData.options);
                    animation.onfinish = function () {
                        resolve(); // Done
                    };
                }
                else {
                    resolve(); // Done
                }
            });
        };
        /**
         * Shift (move) this notification
         *
         * @param {?} distance         Distance to shift (in px)
         * @param {?} shiftToMakePlace Flag, defining in which direction to shift
         * @return {?} Promise, resolved when done
         */
        NotifierNotificationComponent.prototype.shift = /**
         * Shift (move) this notification
         *
         * @param {?} distance         Distance to shift (in px)
         * @param {?} shiftToMakePlace Flag, defining in which direction to shift
         * @return {?} Promise, resolved when done
         */
        function (distance, shiftToMakePlace) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                // Calculate new position (position after the shift)
                var /** @type {?} */ newElementShift;
                if ((_this.config.position.vertical.position === 'top' && shiftToMakePlace)
                    || (_this.config.position.vertical.position === 'bottom' && !shiftToMakePlace)) {
                    newElementShift = _this.elementShift + distance + _this.config.position.vertical.gap;
                }
                else {
                    newElementShift = _this.elementShift - distance - _this.config.position.vertical.gap;
                }
                var /** @type {?} */ horizontalPosition = _this.config.position.horizontal.position === 'middle' ? '-50%' : '0';
                // Are animations enabled?
                if (_this.config.animations.enabled && _this.config.animations.shift.speed > 0) {
                    var /** @type {?} */ animationData = {
                        // TODO: Extract into animation service
                        keyframes: [
                            {
                                transform: "translate3d( " + horizontalPosition + ", " + _this.elementShift + "px, 0 )"
                            },
                            {
                                transform: "translate3d( " + horizontalPosition + ", " + newElementShift + "px, 0 )"
                            }
                        ],
                        options: {
                            duration: _this.config.animations.shift.speed,
                            easing: _this.config.animations.shift.easing,
                            fill: 'forwards'
                        }
                    };
                    _this.elementShift = newElementShift;
                    var /** @type {?} */ animation = _this.element.animate(animationData.keyframes, animationData.options);
                    animation.onfinish = function () {
                        resolve(); // Done
                    };
                }
                else {
                    _this.renderer.setStyle(_this.element, 'transform', "translate3d( " + horizontalPosition + ", " + newElementShift + "px, 0 )");
                    _this.elementShift = newElementShift;
                    resolve(); // Done
                }
            });
        };
        /**
         * Handle click on dismiss button
         * @return {?}
         */
        NotifierNotificationComponent.prototype.onClickDismiss = /**
         * Handle click on dismiss button
         * @return {?}
         */
        function () {
            this.dismiss.emit(this.notification.id);
        };
        /**
         * Handle mouseover over notification area
         * @return {?}
         */
        NotifierNotificationComponent.prototype.onNotificationMouseover = /**
         * Handle mouseover over notification area
         * @return {?}
         */
        function () {
            if (this.config.behaviour.onMouseover === 'pauseAutoHide') {
                this.pauseAutoHideTimer();
            }
            else if (this.config.behaviour.onMouseover === 'resetAutoHide') {
                this.stopAutoHideTimer();
            }
        };
        /**
         * Handle mouseout from notification area
         * @return {?}
         */
        NotifierNotificationComponent.prototype.onNotificationMouseout = /**
         * Handle mouseout from notification area
         * @return {?}
         */
        function () {
            if (this.config.behaviour.onMouseover === 'pauseAutoHide') {
                this.continueAutoHideTimer();
            }
            else if (this.config.behaviour.onMouseover === 'resetAutoHide') {
                this.startAutoHideTimer();
            }
        };
        /**
         * Handle click on notification area
         * @return {?}
         */
        NotifierNotificationComponent.prototype.onNotificationClick = /**
         * Handle click on notification area
         * @return {?}
         */
        function () {
            if (this.config.behaviour.onClick === 'hide') {
                this.onClickDismiss();
            }
        };
        /**
         * Start the auto hide timer (if enabled)
         * @return {?}
         */
        NotifierNotificationComponent.prototype.startAutoHideTimer = /**
         * Start the auto hide timer (if enabled)
         * @return {?}
         */
        function () {
            var _this = this;
            if (this.config.behaviour.autoHide !== false && this.config.behaviour.autoHide > 0) {
                this.timerService.start(this.config.behaviour.autoHide).then(function () {
                    _this.onClickDismiss();
                });
            }
        };
        /**
         * Pause the auto hide timer (if enabled)
         * @return {?}
         */
        NotifierNotificationComponent.prototype.pauseAutoHideTimer = /**
         * Pause the auto hide timer (if enabled)
         * @return {?}
         */
        function () {
            if (this.config.behaviour.autoHide !== false && this.config.behaviour.autoHide > 0) {
                this.timerService.pause();
            }
        };
        /**
         * Continue the auto hide timer (if enabled)
         * @return {?}
         */
        NotifierNotificationComponent.prototype.continueAutoHideTimer = /**
         * Continue the auto hide timer (if enabled)
         * @return {?}
         */
        function () {
            if (this.config.behaviour.autoHide !== false && this.config.behaviour.autoHide > 0) {
                this.timerService.continue();
            }
        };
        /**
         * Stop the auto hide timer (if enabled)
         * @return {?}
         */
        NotifierNotificationComponent.prototype.stopAutoHideTimer = /**
         * Stop the auto hide timer (if enabled)
         * @return {?}
         */
        function () {
            if (this.config.behaviour.autoHide !== false && this.config.behaviour.autoHide > 0) {
                this.timerService.stop();
            }
        };
        /**
         * Initial notification setup
         * @return {?}
         */
        NotifierNotificationComponent.prototype.setup = /**
         * Initial notification setup
         * @return {?}
         */
        function () {
            // Set start position (initially the exact same for every new notification)
            if (this.config.position.horizontal.position === 'left') {
                this.renderer.setStyle(this.element, 'left', this.config.position.horizontal.distance + "px");
            }
            else if (this.config.position.horizontal.position === 'right') {
                this.renderer.setStyle(this.element, 'right', this.config.position.horizontal.distance + "px");
            }
            else {
                this.renderer.setStyle(this.element, 'left', '50%');
                // Let's get the GPU handle some work as well (#perfmatters)
                this.renderer.setStyle(this.element, 'transform', 'translate3d( -50%, 0, 0 )');
            }
            if (this.config.position.vertical.position === 'top') {
                this.renderer.setStyle(this.element, 'top', this.config.position.vertical.distance + "px");
            }
            else {
                this.renderer.setStyle(this.element, 'bottom', this.config.position.vertical.distance + "px");
            }
            // Add classes (responsible for visual design)
            this.renderer.addClass(this.element, "notifier__notification--" + this.notification.type);
            this.renderer.addClass(this.element, "notifier__notification--" + this.config.theme);
        };
        NotifierNotificationComponent.decorators = [
            { type: core.Component, args: [{
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        // (#perfmatters)
                        host: {
                            '(click)': 'onNotificationClick()',
                            '(mouseout)': 'onNotificationMouseout()',
                            '(mouseover)': 'onNotificationMouseover()',
                            class: 'notifier__notification'
                        },
                        providers: [
                            NotifierTimerService
                        ],
                        selector: 'notifier-notification',
                        template: '<ng-container *ngIf="notification.template; else predefinedNotification" [ngTemplateOutletContext]="{ notification: notification }" [ngTemplateOutlet]="notification.template"></ng-container><ng-template #predefinedNotification><p class="notifier__notification-message">{{ notification.message }}</p><button (click)="onClickDismiss()" *ngIf="config.behaviour.showDismissButton" class="notifier__notification-button" title="dismiss" type="button"><svg class="notifier__notification-button-icon" height="20" viewBox="0 0 24 24" width="20"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg></button></ng-template>'
                    },] },
        ];
        /** @nocollapse */
        NotifierNotificationComponent.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.Renderer2 },
            { type: NotifierService },
            { type: NotifierTimerService },
            { type: NotifierAnimationService }
        ]; };
        NotifierNotificationComponent.propDecorators = {
            notification: [{ type: core.Input }],
            ready: [{ type: core.Output }],
            dismiss: [{ type: core.Output }]
        };
        return NotifierNotificationComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    /**
     * Injection Token for notifier options
     */
    var /** @type {?} */ NotifierOptionsToken = new core.InjectionToken('[angular-notifier] Notifier Options');
    /**
     * Injection Token for notifier configuration
     */
    var /** @type {?} */ NotifierConfigToken = new core.InjectionToken('[anuglar-notifier] Notifier Config');
    /**
     * Factory for a notifier configuration with custom options
     *
     * Sidenote:
     * Required as Angular AoT compilation cannot handle dynamic functions; see <https://github.com/angular/angular/issues/11262>.
     *
     * @param {?} options - Custom notifier options
     * @return {?} - Notifier configuration as result
     */
    function notifierCustomConfigFactory(options) {
        return new NotifierConfig(options);
    }
    /**
     * Factory for a notifier configuration with default options
     *
     * Sidenote:
     * Required as Angular AoT compilation cannot handle dynamic functions; see <https://github.com/angular/angular/issues/11262>.
     *
     * @return {?} - Notifier configuration as result
     */
    function notifierDefaultConfigFactory() {
        return new NotifierConfig({});
    }
    /**
     * Notifier module
     */
    var NotifierModule = /** @class */ (function () {
        function NotifierModule() {
        }
        /**
         * Setup the notifier module with custom providers, in this case with a custom configuration based on the givne options
         *
         * @param {?=} options
         * @return {?} - Notifier module with custom providers
         */
        NotifierModule.withConfig = /**
         * Setup the notifier module with custom providers, in this case with a custom configuration based on the givne options
         *
         * @param {?=} options
         * @return {?} - Notifier module with custom providers
         */
        function (options) {
            if (options === void 0) { options = {}; }
            return {
                ngModule: NotifierModule,
                providers: [
                    // Provide the options itself upfront (as we need to inject them as dependencies -- see below)
                    {
                        provide: NotifierOptionsToken,
                        useValue: options
                    },
                    // Provide a custom notifier configuration, based on the given notifier options
                    {
                        deps: [
                            NotifierOptionsToken
                        ],
                        provide: NotifierConfigToken,
                        useFactory: notifierCustomConfigFactory
                    }
                ]
            };
        };
        NotifierModule.decorators = [
            { type: core.NgModule, args: [{
                        declarations: [
                            NotifierContainerComponent,
                            NotifierNotificationComponent
                        ],
                        exports: [
                            NotifierContainerComponent
                        ],
                        imports: [
                            common.CommonModule
                        ],
                        providers: [
                            NotifierAnimationService,
                            NotifierService,
                            NotifierQueueService,
                            // Provide the default notifier configuration if just the module is imported
                            {
                                provide: NotifierConfigToken,
                                useFactory: notifierDefaultConfigFactory
                            }
                        ]
                    },] },
        ];
        return NotifierModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    exports.NotifierModule = NotifierModule;
    exports.NotifierService = NotifierService;
    exports.ɵf = NotifierContainerComponent;
    exports.ɵh = NotifierNotificationComponent;
    exports.ɵe = NotifierConfig;
    exports.ɵb = NotifierConfigToken;
    exports.ɵa = NotifierOptionsToken;
    exports.ɵc = notifierCustomConfigFactory;
    exports.ɵd = notifierDefaultConfigFactory;
    exports.ɵj = NotifierAnimationService;
    exports.ɵg = NotifierQueueService;
    exports.ɵi = NotifierTimerService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=angular-notifier.umd.js.map
