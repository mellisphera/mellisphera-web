import { ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { NotifierNotification } from './../models/notifier-notification.model';
import { NotifierQueueService } from './../services/notifier-queue.service';
import { NotifierService } from './../services/notifier.service';
import { NotifierNotificationComponent } from './notifier-notification.component';
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
export declare class NotifierContainerComponent implements OnDestroy, OnInit {
    /**
     * List of currently somewhat active notifications
     */
    notifications: Array<NotifierNotification>;
    /**
     * Change detector
     */
    private readonly changeDetector;
    /**
     * Notifier queue service
     */
    private readonly queueService;
    /**
     * Notifier configuration
     */
    private readonly config;
    /**
     * Queue service observable subscription (saved for cleanup)
     */
    private queueServiceSubscription;
    /**
     * Promise resolve function reference, temporarily used while the notification child component gets created
     */
    private tempPromiseResolver;
    /**
     * Constructor
     *
     * @param changeDetector       Change detector, used for manually triggering change detection runs
     * @param notifierQueueService Notifier queue service
     * @param notifierService      Notifier service
     */
    constructor(changeDetector: ChangeDetectorRef, notifierQueueService: NotifierQueueService, notifierService: NotifierService);
    /**
     * Component initialization lifecycle hook, connects this component to the action queue, and then handles incoming actions
     */
    ngOnInit(): void;
    /**
     * Component destroyment lifecycle hook, cleans up the observable subsciption
     */
    ngOnDestroy(): void;
    /**
     * Notification identifier, used as the ngFor trackby function
     *
     * @param   index        Index
     * @param   notification Notifier notification
     * @returns Notification ID as the unique identnfier
     */
    identifyNotification(index: number, notification: NotifierNotification): string;
    /**
     * Event handler, handles clicks on notification dismiss buttons
     *
     * @param notificationId ID of the notification to dismiss
     */
    onNotificationDismiss(notificationId: string): void;
    /**
     * Event handler, handles notification ready events
     *
     * @param notificationComponent Notification component reference
     */
    onNotificationReady(notificationComponent: NotifierNotificationComponent): void;
    /**
     * Handle incoming actions by mapping action types to methods, and then running them
     *
     * @param   action Action object
     * @returns Promise, resolved when done
     */
    private handleAction(action);
    /**
     * Show a new notification
     *
     * We simply add the notification to the list, and then wait until its properly initialized / created / rendered.
     *
     * @param   action Action object
     * @returns Promise, resolved when done
     */
    private handleShowAction(action);
    /**
     * Continue to show a new notification (after the notification components is initialized / created / rendered).
     *
     * If this is the first (and thus only) notification, we can simply show it. Otherwhise, if stacking is disabled (or a low value), we
     * switch out notifications, in particular we hide the existing one, and then show our new one. Yet, if stacking is enabled, we first
     * shift all older notifications, and then show our new notification. In addition, if there are too many notification on the screen,
     * we hide the oldest one first. Furthermore, if configured, animation overlapping is applied.
     *
     * @param notification New notification to show
     */
    private continueHandleShowAction(notification);
    /**
     * Hide an existing notification
     *
     * Fist, we skip everything if there are no notifications at all, or the given notification does not exist. Then, we hide the given
     * notification. If there exist older notifications, we then shift them around to fill the gap. Once both hiding the given notification
     * and shifting the older notificaitons is done, the given notification gets finally removed (from the DOM).
     *
     * @param   action Action object, payload contains the notification ID
     * @returns Promise, resolved when done
     */
    private handleHideAction(action);
    /**
     * Hide the oldest notification (bridge to handleHideAction)
     *
     * @param   action Action object
     * @returns Promise, resolved when done
     */
    private handleHideOldestAction(action);
    /**
     * Hide the newest notification (bridge to handleHideAction)
     *
     * @param   action Action object
     * @returns Promise, resolved when done
     */
    private handleHideNewestAction(action);
    /**
     * Hide all notifications at once
     *
     * @param   action Action object
     * @returns Promise, resolved when done
     */
    private handleHideAllAction(action);
    /**
     * Shift multiple notifications at once
     *
     * @param   notifications List containing the notifications to be shifted
     * @param   distance      Distance to shift (in px)
     * @param   toMakePlace   Flag, defining in which direciton to shift
     * @returns Promise, resolved when done
     */
    private shiftNotifications(notifications, distance, toMakePlace);
    /**
     * Add a new notification to the list of notifications (triggers change detection)
     *
     * @param notification Notification to add to the list of notifications
     */
    private addNotificationToList(notification);
    /**
     * Remove an existing notification from the list of notifications (triggers change detection)
     *
     * @param notification Notification to be removed from the list of notifications
     */
    private removeNotificationFromList(notification);
    /**
     * Remove all notifications from the list (triggers change detection)
     */
    private removeAllNotificationsFromList();
    /**
     * Helper: Find a notification in the notification list by a given notification ID
     *
     * @param   notificationId Notification ID, used for finding notification
     * @returns Notification, undefined if not found
     */
    private findNotificationById(notificationId);
    /**
     * Helper: Find a notification's index by a given notification ID
     *
     * @param   notificationId Notification ID, used for finding a notification's index
     * @returns Notification index, undefined if not found
     */
    private findNotificationIndexById(notificationId);
}
