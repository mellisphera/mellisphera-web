import { NotifierNotificationComponent } from './../components/notifier-notification.component';
import { TemplateRef } from '@angular/core';
/**
 * Notification
 *
 * This class describes the structure of a notifiction, including all information it needs to live, and everyone else needs to work with it.
 */
export declare class NotifierNotification {
    /**
     * Unique notification ID, can be set manually to control the notification from outside later on
     */
    id: string;
    /**
     * Notification type, will be used for constructing an appropriate class name
     */
    type: string;
    /**
     * Notification message
     */
    message: string;
    /**
     * The template to customize
     * the appearance of the notification
     */
    template?: TemplateRef<any>;
    /**
     * Component reference of this notification, created and set during creation time
     */
    component: NotifierNotificationComponent;
    /**
     * Constructor
     *
     * @param options Notifier options
     */
    constructor(options: NotifierNotificationOptions);
}
/**
 * Notifiction options
 *
 * This interface describes which information are needed to create a new notification, or in other words, which information the external API
 * call must provide.
 */
export interface NotifierNotificationOptions {
    /**
     * Notification ID, optional
     */
    id?: string;
    /**
     * Notification type
     */
    type: string;
    /**
     * Notificatin message
     */
    message: string;
    /**
     * The template to customize
     * the appearance of the notification
     */
    template?: TemplateRef<any>;
}
