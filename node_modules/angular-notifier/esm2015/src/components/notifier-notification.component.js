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
export class NotifierNotificationComponent {
    /**
     * Constructor
     *
     * @param {?} elementRef               Reference to the component's element
     * @param {?} renderer                 Angular renderer
     * @param {?} notifierService          Notifier service
     * @param {?} notifierTimerService     Notifier timer service
     * @param {?} notifierAnimationService Notifier animation service
     */
    constructor(elementRef, renderer, notifierService, notifierTimerService, notifierAnimationService) {
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
    ngAfterViewInit() {
        this.setup();
        this.elementHeight = this.element.offsetHeight;
        this.elementWidth = this.element.offsetWidth;
        this.ready.emit(this);
    }
    /**
     * Get the notifier config
     *
     * @return {?} Notifier configuration
     */
    getConfig() {
        return this.config;
    }
    /**
     * Get notification element height (in px)
     *
     * @return {?} Notification element height (in px)
     */
    getHeight() {
        return this.elementHeight;
    }
    /**
     * Get notification element width (in px)
     *
     * @return {?} Notification element height (in px)
     */
    getWidth() {
        return this.elementWidth;
    }
    /**
     * Get notification shift offset (in px)
     *
     * @return {?} Notification element shift offset (in px)
     */
    getShift() {
        return this.elementShift;
    }
    /**
     * Show (animate in) this notification
     *
     * @return {?} Promise, resolved when done
     */
    show() {
        return new Promise((resolve, reject) => {
            // Are animations enabled?
            if (this.config.animations.enabled && this.config.animations.show.speed > 0) {
                // Get animation data
                const /** @type {?} */ animationData = this.animationService.getAnimationData('show', this.notification);
                // Set initial styles (styles before animation), prevents quick flicker when animation starts
                const /** @type {?} */ animatedProperties = Object.keys(animationData.keyframes[0]);
                for (let /** @type {?} */ i = animatedProperties.length - 1; i >= 0; i--) {
                    this.renderer.setStyle(this.element, animatedProperties[i], animationData.keyframes[0][animatedProperties[i]]);
                }
                // Animate notification in
                this.renderer.setStyle(this.element, 'visibility', 'visible');
                const /** @type {?} */ animation = this.element.animate(animationData.keyframes, animationData.options);
                animation.onfinish = () => {
                    this.startAutoHideTimer();
                    resolve(); // Done
                };
            }
            else {
                // Show notification
                this.renderer.setStyle(this.element, 'visibility', 'visible');
                this.startAutoHideTimer();
                resolve(); // Done
            }
        });
    }
    /**
     * Hide (animate out) this notification
     *
     * @return {?} Promise, resolved when done
     */
    hide() {
        return new Promise((resolve, reject) => {
            this.stopAutoHideTimer();
            // Are animations enabled?
            if (this.config.animations.enabled && this.config.animations.hide.speed > 0) {
                const /** @type {?} */ animationData = this.animationService.getAnimationData('hide', this.notification);
                const /** @type {?} */ animation = this.element.animate(animationData.keyframes, animationData.options);
                animation.onfinish = () => {
                    resolve(); // Done
                };
            }
            else {
                resolve(); // Done
            }
        });
    }
    /**
     * Shift (move) this notification
     *
     * @param {?} distance         Distance to shift (in px)
     * @param {?} shiftToMakePlace Flag, defining in which direction to shift
     * @return {?} Promise, resolved when done
     */
    shift(distance, shiftToMakePlace) {
        return new Promise((resolve, reject) => {
            // Calculate new position (position after the shift)
            let /** @type {?} */ newElementShift;
            if ((this.config.position.vertical.position === 'top' && shiftToMakePlace)
                || (this.config.position.vertical.position === 'bottom' && !shiftToMakePlace)) {
                newElementShift = this.elementShift + distance + this.config.position.vertical.gap;
            }
            else {
                newElementShift = this.elementShift - distance - this.config.position.vertical.gap;
            }
            const /** @type {?} */ horizontalPosition = this.config.position.horizontal.position === 'middle' ? '-50%' : '0';
            // Are animations enabled?
            if (this.config.animations.enabled && this.config.animations.shift.speed > 0) {
                const /** @type {?} */ animationData = {
                    // TODO: Extract into animation service
                    keyframes: [
                        {
                            transform: `translate3d( ${horizontalPosition}, ${this.elementShift}px, 0 )`
                        },
                        {
                            transform: `translate3d( ${horizontalPosition}, ${newElementShift}px, 0 )`
                        }
                    ],
                    options: {
                        duration: this.config.animations.shift.speed,
                        easing: this.config.animations.shift.easing,
                        fill: 'forwards'
                    }
                };
                this.elementShift = newElementShift;
                const /** @type {?} */ animation = this.element.animate(animationData.keyframes, animationData.options);
                animation.onfinish = () => {
                    resolve(); // Done
                };
            }
            else {
                this.renderer.setStyle(this.element, 'transform', `translate3d( ${horizontalPosition}, ${newElementShift}px, 0 )`);
                this.elementShift = newElementShift;
                resolve(); // Done
            }
        });
    }
    /**
     * Handle click on dismiss button
     * @return {?}
     */
    onClickDismiss() {
        this.dismiss.emit(this.notification.id);
    }
    /**
     * Handle mouseover over notification area
     * @return {?}
     */
    onNotificationMouseover() {
        if (this.config.behaviour.onMouseover === 'pauseAutoHide') {
            this.pauseAutoHideTimer();
        }
        else if (this.config.behaviour.onMouseover === 'resetAutoHide') {
            this.stopAutoHideTimer();
        }
    }
    /**
     * Handle mouseout from notification area
     * @return {?}
     */
    onNotificationMouseout() {
        if (this.config.behaviour.onMouseover === 'pauseAutoHide') {
            this.continueAutoHideTimer();
        }
        else if (this.config.behaviour.onMouseover === 'resetAutoHide') {
            this.startAutoHideTimer();
        }
    }
    /**
     * Handle click on notification area
     * @return {?}
     */
    onNotificationClick() {
        if (this.config.behaviour.onClick === 'hide') {
            this.onClickDismiss();
        }
    }
    /**
     * Start the auto hide timer (if enabled)
     * @return {?}
     */
    startAutoHideTimer() {
        if (this.config.behaviour.autoHide !== false && this.config.behaviour.autoHide > 0) {
            this.timerService.start(this.config.behaviour.autoHide).then(() => {
                this.onClickDismiss();
            });
        }
    }
    /**
     * Pause the auto hide timer (if enabled)
     * @return {?}
     */
    pauseAutoHideTimer() {
        if (this.config.behaviour.autoHide !== false && this.config.behaviour.autoHide > 0) {
            this.timerService.pause();
        }
    }
    /**
     * Continue the auto hide timer (if enabled)
     * @return {?}
     */
    continueAutoHideTimer() {
        if (this.config.behaviour.autoHide !== false && this.config.behaviour.autoHide > 0) {
            this.timerService.continue();
        }
    }
    /**
     * Stop the auto hide timer (if enabled)
     * @return {?}
     */
    stopAutoHideTimer() {
        if (this.config.behaviour.autoHide !== false && this.config.behaviour.autoHide > 0) {
            this.timerService.stop();
        }
    }
    /**
     * Initial notification setup
     * @return {?}
     */
    setup() {
        // Set start position (initially the exact same for every new notification)
        if (this.config.position.horizontal.position === 'left') {
            this.renderer.setStyle(this.element, 'left', `${this.config.position.horizontal.distance}px`);
        }
        else if (this.config.position.horizontal.position === 'right') {
            this.renderer.setStyle(this.element, 'right', `${this.config.position.horizontal.distance}px`);
        }
        else {
            this.renderer.setStyle(this.element, 'left', '50%');
            // Let's get the GPU handle some work as well (#perfmatters)
            this.renderer.setStyle(this.element, 'transform', 'translate3d( -50%, 0, 0 )');
        }
        if (this.config.position.vertical.position === 'top') {
            this.renderer.setStyle(this.element, 'top', `${this.config.position.vertical.distance}px`);
        }
        else {
            this.renderer.setStyle(this.element, 'bottom', `${this.config.position.vertical.distance}px`);
        }
        // Add classes (responsible for visual design)
        this.renderer.addClass(this.element, `notifier__notification--${this.notification.type}`);
        this.renderer.addClass(this.element, `notifier__notification--${this.config.theme}`);
    }
}
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
NotifierNotificationComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: NotifierService },
    { type: NotifierTimerService },
    { type: NotifierAnimationService }
];
NotifierNotificationComponent.propDecorators = {
    notification: [{ type: Input }],
    ready: [{ type: Output }],
    dismiss: [{ type: Output }]
};
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