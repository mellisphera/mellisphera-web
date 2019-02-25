import { AfterViewInit, ElementRef, EventEmitter, Renderer2 } from '@angular/core';
import { NotifierAnimationService } from './../services/notifier-animation.service';
import { NotifierConfig } from './../models/notifier-config.model';
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
export declare class NotifierNotificationComponent implements AfterViewInit {
    /**
     * Input: Notification object, contains all details necessary to construct the notification
     */
    notification: NotifierNotification;
    /**
     * Output: Ready event, handles the initialization success by emitting a reference to this notification component
     */
    ready: EventEmitter<NotifierNotificationComponent>;
    /**
     * Output: Dismiss event, handles the click on the dismiss button by emitting the notification ID of this notification component
     */
    dismiss: EventEmitter<string>;
    /**
     * Notifier configuration
     */
    readonly config: NotifierConfig;
    /**
     * Notifier timer service
     */
    private readonly timerService;
    /**
     * Notifier animation service
     */
    private readonly animationService;
    /**
     * Angular renderer, used to preserve the overall DOM abstraction & independence
     */
    private readonly renderer;
    /**
     * Native element reference, used for manipulating DOM properties
     */
    private readonly element;
    /**
     * Current notification height, calculated and cached here (#perfmatters)
     */
    private elementHeight;
    /**
     * Current notification width, calculated and cached here (#perfmatters)
     */
    private elementWidth;
    /**
     * Current notification shift, calculated and cached here (#perfmatters)
     */
    private elementShift;
    /**
     * Constructor
     *
     * @param elementRef               Reference to the component's element
     * @param renderer                 Angular renderer
     * @param notifierService          Notifier service
     * @param notifierTimerService     Notifier timer service
     * @param notifierAnimationService Notifier animation service
     */
    constructor(elementRef: ElementRef, renderer: Renderer2, notifierService: NotifierService, notifierTimerService: NotifierTimerService, notifierAnimationService: NotifierAnimationService);
    /**
     * Component after view init lifecycle hook, setts up the component and then emits the ready event
     */
    ngAfterViewInit(): void;
    /**
     * Get the notifier config
     *
     * @returns Notifier configuration
     */
    getConfig(): NotifierConfig;
    /**
     * Get notification element height (in px)
     *
     * @returns Notification element height (in px)
     */
    getHeight(): number;
    /**
     * Get notification element width (in px)
     *
     * @returns Notification element height (in px)
     */
    getWidth(): number;
    /**
     * Get notification shift offset (in px)
     *
     * @returns Notification element shift offset (in px)
     */
    getShift(): number;
    /**
     * Show (animate in) this notification
     *
     * @returns Promise, resolved when done
     */
    show(): Promise<undefined>;
    /**
     * Hide (animate out) this notification
     *
     * @returns Promise, resolved when done
     */
    hide(): Promise<undefined>;
    /**
     * Shift (move) this notification
     *
     * @param   distance         Distance to shift (in px)
     * @param   shiftToMakePlace Flag, defining in which direction to shift
     * @returns Promise, resolved when done
     */
    shift(distance: number, shiftToMakePlace: boolean): Promise<undefined>;
    /**
     * Handle click on dismiss button
     */
    onClickDismiss(): void;
    /**
     * Handle mouseover over notification area
     */
    onNotificationMouseover(): void;
    /**
     * Handle mouseout from notification area
     */
    onNotificationMouseout(): void;
    /**
     * Handle click on notification area
     */
    onNotificationClick(): void;
    /**
     * Start the auto hide timer (if enabled)
     */
    private startAutoHideTimer();
    /**
     * Pause the auto hide timer (if enabled)
     */
    private pauseAutoHideTimer();
    /**
     * Continue the auto hide timer (if enabled)
     */
    private continueAutoHideTimer();
    /**
     * Stop the auto hide timer (if enabled)
     */
    private stopAutoHideTimer();
    /**
     * Initial notification setup
     */
    private setup();
}
