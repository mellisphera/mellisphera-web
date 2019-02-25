/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { NotifierAnimationService } from './../services/notifier-animation.service';
import { NotifierNotification } from './../models/notifier-notification.model';
import { NotifierService } from './../services/notifier.service';
import { NotifierTimerService } from './../services/notifier-timer.service';
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
        this.ready = new EventEmitter();
        this.dismiss = new EventEmitter();
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
        { type: Component, args: [{
                    changeDetection: ChangeDetectionStrategy.OnPush,
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
        { type: ElementRef },
        { type: Renderer2 },
        { type: NotifierService },
        { type: NotifierTimerService },
        { type: NotifierAnimationService }
    ]; };
    NotifierNotificationComponent.propDecorators = {
        notification: [{ type: Input }],
        ready: [{ type: Output }],
        dismiss: [{ type: Output }]
    };
    return NotifierNotificationComponent;
}());
export { NotifierNotificationComponent };
function NotifierNotificationComponent_tsickle_Closure_declarations() {
    /**
     * Input: Notification object, contains all details necessary to construct the notification
     * @type {?}
     */
    NotifierNotificationComponent.prototype.notification;
    /**
     * Output: Ready event, handles the initialization success by emitting a reference to this notification component
     * @type {?}
     */
    NotifierNotificationComponent.prototype.ready;
    /**
     * Output: Dismiss event, handles the click on the dismiss button by emitting the notification ID of this notification component
     * @type {?}
     */
    NotifierNotificationComponent.prototype.dismiss;
    /**
     * Notifier configuration
     * @type {?}
     */
    NotifierNotificationComponent.prototype.config;
    /**
     * Notifier timer service
     * @type {?}
     */
    NotifierNotificationComponent.prototype.timerService;
    /**
     * Notifier animation service
     * @type {?}
     */
    NotifierNotificationComponent.prototype.animationService;
    /**
     * Angular renderer, used to preserve the overall DOM abstraction & independence
     * @type {?}
     */
    NotifierNotificationComponent.prototype.renderer;
    /**
     * Native element reference, used for manipulating DOM properties
     * @type {?}
     */
    NotifierNotificationComponent.prototype.element;
    /**
     * Current notification height, calculated and cached here (#perfmatters)
     * @type {?}
     */
    NotifierNotificationComponent.prototype.elementHeight;
    /**
     * Current notification width, calculated and cached here (#perfmatters)
     * @type {?}
     */
    NotifierNotificationComponent.prototype.elementWidth;
    /**
     * Current notification shift, calculated and cached here (#perfmatters)
     * @type {?}
     */
    NotifierNotificationComponent.prototype.elementShift;
}
//# sourceMappingURL=notifier-notification.component.js.map