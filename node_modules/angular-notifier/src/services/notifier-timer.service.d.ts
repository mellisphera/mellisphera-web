/**
 * Notifier timer service
 *
 * This service acts as a timer, needed due to the still rather limited setTimeout JavaScript API. The timer service can start and stop a
 * timer. Furthermore, it can also pause the timer at any time, and resume later on. The timer API workd promise-based.
 */
export declare class NotifierTimerService {
    /**
     * Timestamp (in ms), created in the moment the timer starts
     */
    private now;
    /**
     * Remaining time (in ms)
     */
    private remaining;
    /**
     * Timeout ID, used for clearing the timeout later on
     */
    private timerId;
    /**
     * Promise resolve function, eventually getting called once the timer finishes
     */
    private finishPromiseResolver;
    /**
     * Constructor
     */
    constructor();
    /**
     * Start (or resume) the timer
     *
     * @param   duration Timer duration, in ms
     * @returns          Promise, resolved once the timer finishes
     */
    start(duration: number): Promise<undefined>;
    /**
     * Pause the timer
     */
    pause(): void;
    /**
     * Continue the timer
     */
    continue(): void;
    /**
     * Stop the timer
     */
    stop(): void;
    /**
     * Finish up the timeout by resolving the timer promise
     */
    private finish();
}
