/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable } from '@angular/core';
/**
 * Notifier timer service
 *
 * This service acts as a timer, needed due to the still rather limited setTimeout JavaScript API. The timer service can start and stop a
 * timer. Furthermore, it can also pause the timer at any time, and resume later on. The timer API workd promise-based.
 */
export class NotifierTimerService {
    /**
     * Constructor
     */
    constructor() {
        this.now = 0;
        this.remaining = 0;
    }
    /**
     * Start (or resume) the timer
     *
     * @param {?} duration Timer duration, in ms
     * @return {?} Promise, resolved once the timer finishes
     */
    start(duration) {
        return new Promise((resolve, reject) => {
            // For the first run ...
            this.remaining = duration;
            // Setup, then start the timer
            this.finishPromiseResolver = resolve;
            this.continue();
        });
    }
    /**
     * Pause the timer
     * @return {?}
     */
    pause() {
        clearTimeout(this.timerId);
        this.remaining -= new Date().getTime() - this.now;
    }
    /**
     * Continue the timer
     * @return {?}
     */
    continue() {
        this.now = new Date().getTime();
        this.timerId = window.setTimeout(() => {
            this.finish();
        }, this.remaining);
    }
    /**
     * Stop the timer
     * @return {?}
     */
    stop() {
        clearTimeout(this.timerId);
        this.remaining = 0;
    }
    /**
     * Finish up the timeout by resolving the timer promise
     * @return {?}
     */
    finish() {
        this.finishPromiseResolver();
    }
}
NotifierTimerService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
NotifierTimerService.ctorParameters = () => [];
function NotifierTimerService_tsickle_Closure_declarations() {
    /**
     * Timestamp (in ms), created in the moment the timer starts
     * @type {?}
     */
    NotifierTimerService.prototype.now;
    /**
     * Remaining time (in ms)
     * @type {?}
     */
    NotifierTimerService.prototype.remaining;
    /**
     * Timeout ID, used for clearing the timeout later on
     * @type {?}
     */
    NotifierTimerService.prototype.timerId;
    /**
     * Promise resolve function, eventually getting called once the timer finishes
     * @type {?}
     */
    NotifierTimerService.prototype.finishPromiseResolver;
}
//# sourceMappingURL=notifier-timer.service.js.map