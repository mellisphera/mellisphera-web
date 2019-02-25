/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Notifier animation data
 *
 * This interface describes an object containing all information necessary to run an animation, in particular to run an animation with the
 * all new (shiny) Web Animations API. When other components or services request data for an animation they have to run, this is the object
 * they get back from the animation service.
 *
 * Technical sidenote:
 * Nope, it's not a coincidence - the structure looks similar to the Web Animation API syntax.
 * @record
 */
export function NotifierAnimationData() { }
function NotifierAnimationData_tsickle_Closure_declarations() {
    /**
     * Animation keyframes; the first index ctonaining changes for animate-in, the second index those for animate-out
     * @type {?}
     */
    NotifierAnimationData.prototype.keyframes;
    /**
     * Futher animation options
     * @type {?}
     */
    NotifierAnimationData.prototype.options;
}
/**
 * Notifier animation preset
 *
 * This interface describes the structure of an animation preset, defining the keyframes for both animating-in and animating-out. Animation
 * presets are always defined outside the animation service, and therefore one day may become part of some new API.
 * @record
 */
export function NotifierAnimationPreset() { }
function NotifierAnimationPreset_tsickle_Closure_declarations() {
    /**
     * Function generating the keyframes for animating-out
     * @type {?}
     */
    NotifierAnimationPreset.prototype.hide;
    /**
     * Function generating the keyframes for animating-in
     * @type {?}
     */
    NotifierAnimationPreset.prototype.show;
}
/**
 * Notifier animation keyframes
 *
 * This interface describes the data, in particular all the keyframes animation presets return.
 * @record
 */
export function NotifierAnimationPresetKeyframes() { }
function NotifierAnimationPresetKeyframes_tsickle_Closure_declarations() {
    /**
     * CSS attributes before the animation starts
     * @type {?}
     */
    NotifierAnimationPresetKeyframes.prototype.from;
    /**
     * CSS attributes after the animation ends
     * @type {?}
     */
    NotifierAnimationPresetKeyframes.prototype.to;
}
//# sourceMappingURL=notifier-animation.model.js.map