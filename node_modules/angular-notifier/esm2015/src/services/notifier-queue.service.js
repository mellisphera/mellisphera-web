/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
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
export class NotifierQueueService {
    /**
     * Constructor
     */
    constructor() {
        this.actionStream = new Subject();
        this.actionQueue = [];
        this.isActionInProgress = false;
    }
    /**
     * Push a new action to the queue, and try to run it
     *
     * @param {?} action Action object
     * @return {?}
     */
    push(action) {
        this.actionQueue.push(action);
        this.tryToRunNextAction();
    }
    /**
     * Continue with the next action (called when the current action is finished)
     * @return {?}
     */
    continue() {
        this.isActionInProgress = false;
        this.tryToRunNextAction();
    }
    /**
     * Try to run the next action in the queue; we skip if there already is some action in progress, or if there is no action left
     * @return {?}
     */
    tryToRunNextAction() {
        if (this.isActionInProgress || this.actionQueue.length === 0) {
            return; // Skip (the queue can now go drink a coffee as it has nothing to do anymore)
        }
        this.isActionInProgress = true;
        this.actionStream.next(this.actionQueue.shift()); // Push next action to the stream, and remove the current action from the queue
    }
}
NotifierQueueService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
NotifierQueueService.ctorParameters = () => [];
function NotifierQueueService_tsickle_Closure_declarations() {
    /**
     * Stream of actions, subscribable from outside
     * @type {?}
     */
    NotifierQueueService.prototype.actionStream;
    /**
     * Queue of actions
     * @type {?}
     */
    NotifierQueueService.prototype.actionQueue;
    /**
     * Flag, true if some action is currently in progress
     * @type {?}
     */
    NotifierQueueService.prototype.isActionInProgress;
}
//# sourceMappingURL=notifier-queue.service.js.map