import { NotifierAnimationData } from './../models/notifier-animation.model';
import { NotifierNotification } from './../models/notifier-notification.model';
/**
 * Notifier animation service
 */
export declare class NotifierAnimationService {
    /**
     * List of animation presets (currently static)
     */
    private readonly animationPresets;
    /**
     * Constructor
     */
    constructor();
    /**
     * Get animation data
     *
     * This method generates all data the Web Animations API needs to animate our notification. The result depends on both the animation
     * direction (either in or out) as well as the notifications (and its attributes) itself.
     *
     * @param   direction    Animation direction, either in or out
     * @param   notification Notification the animation data should be generated for
     * @returns Animation information
     */
    getAnimationData(direction: 'show' | 'hide', notification: NotifierNotification): NotifierAnimationData;
}
