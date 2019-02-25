/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable } from '@angular/core';
import { fade } from './../animation-presets/fade.animation-preset';
import { slide } from './../animation-presets/slide.animation-preset';
/**
 * Notifier animation service
 */
var NotifierAnimationService = /** @class */ (function () {
    function NotifierAnimationService() {
        this.animationPresets = {
            fade: fade,
            slide: slide
        };
    }
    /**
     * Get animation data
     *
     * This method generates all data the Web Animations API needs to animate our notification. The result depends on both the animation
     * direction (either in or out) as well as the notifications (and its attributes) itself.
     *
     * @param {?} direction    Animation direction, either in or out
     * @param {?} notification Notification the animation data should be generated for
     * @return {?} Animation information
     */
    NotifierAnimationService.prototype.getAnimationData = /**
     * Get animation data
     *
     * This method generates all data the Web Animations API needs to animate our notification. The result depends on both the animation
     * direction (either in or out) as well as the notifications (and its attributes) itself.
     *
     * @param {?} direction    Animation direction, either in or out
     * @param {?} notification Notification the animation data should be generated for
     * @return {?} Animation information
     */
    function (direction, notification) {
        // Get all necessary animation data
        var /** @type {?} */ keyframes;
        var /** @type {?} */ duration;
        var /** @type {?} */ easing;
        if (direction === 'show') {
            keyframes = this.animationPresets[notification.component.getConfig().animations.show.preset].show(notification);
            duration = notification.component.getConfig().animations.show.speed;
            easing = notification.component.getConfig().animations.show.easing;
        }
        else {
            keyframes = this.animationPresets[notification.component.getConfig().animations.hide.preset].hide(notification);
            duration = notification.component.getConfig().animations.hide.speed;
            easing = notification.component.getConfig().animations.hide.easing;
        }
        // Build and return animation data
        return {
            keyframes: [
                keyframes.from,
                keyframes.to
            ],
            options: {
                duration: duration,
                easing: easing,
                fill: 'forwards' // Keep the newly painted state after the animation finished
            }
        };
    };
    NotifierAnimationService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    NotifierAnimationService.ctorParameters = function () { return []; };
    return NotifierAnimationService;
}());
export { NotifierAnimationService };
function NotifierAnimationService_tsickle_Closure_declarations() {
    /**
     * List of animation presets (currently static)
     * @type {?}
     */
    NotifierAnimationService.prototype.animationPresets;
}
//# sourceMappingURL=notifier-animation.service.js.map