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
        { type: Injectable },
    ];
    /** @nocollapse */
    NotifierTimerService.ctorParameters = function () { return []; };
    return NotifierTimerService;
}());
export { NotifierTimerService };
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