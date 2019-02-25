/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Slide animation preset
 */
export var /** @type {?} */ slide = {
    hide: function (notification) {
        // Prepare variables
        var /** @type {?} */ config = notification.component.getConfig();
        var /** @type {?} */ shift = notification.component.getShift();
        var /** @type {?} */ from;
        var /** @type {?} */ to;
        // Configure variables, depending on configuration and component
        if (config.position.horizontal.position === 'left') {
            from = {
                transform: "translate3d( 0, " + shift + "px, 0 )"
            };
            to = {
                transform: "translate3d( calc( -100% - " + config.position.horizontal.distance + "px - 10px ), " + shift + "px, 0 )"
            };
        }
        else if (config.position.horizontal.position === 'right') {
            from = {
                transform: "translate3d( 0, " + shift + "px, 0 )"
            };
            to = {
                transform: "translate3d( calc( 100% + " + config.position.horizontal.distance + "px + 10px ), " + shift + "px, 0 )"
            };
        }
        else {
            var /** @type {?} */ horizontalPosition = void 0;
            if (config.position.vertical.position === 'top') {
                horizontalPosition = "calc( -100% - " + config.position.horizontal.distance + "px - 10px )";
            }
            else {
                horizontalPosition = "calc( 100% + " + config.position.horizontal.distance + "px + 10px )";
            }
            from = {
                transform: "translate3d( -50%, " + shift + "px, 0 )"
            };
            to = {
                transform: "translate3d( -50%, " + horizontalPosition + ", 0 )"
            };
        }
        // Done
        return {
            from: from,
            to: to
        };
    },
    show: function (notification) {
        // Prepare variables
        var /** @type {?} */ config = notification.component.getConfig();
        var /** @type {?} */ from;
        var /** @type {?} */ to;
        // Configure variables, depending on configuration and component
        if (config.position.horizontal.position === 'left') {
            from = {
                transform: "translate3d( calc( -100% - " + config.position.horizontal.distance + "px - 10px ), 0, 0 )"
            };
            to = {
                transform: 'translate3d( 0, 0, 0 )'
            };
        }
        else if (config.position.horizontal.position === 'right') {
            from = {
                transform: "translate3d( calc( 100% + " + config.position.horizontal.distance + "px + 10px ), 0, 0 )"
            };
            to = {
                transform: 'translate3d( 0, 0, 0 )'
            };
        }
        else {
            var /** @type {?} */ horizontalPosition = void 0;
            if (config.position.vertical.position === 'top') {
                horizontalPosition = "calc( -100% - " + config.position.horizontal.distance + "px - 10px )";
            }
            else {
                horizontalPosition = "calc( 100% + " + config.position.horizontal.distance + "px + 10px )";
            }
            from = {
                transform: "translate3d( -50%, " + horizontalPosition + ", 0 )"
            };
            to = {
                transform: 'translate3d( -50%, 0, 0 )'
            };
        }
        // Done
        return {
            from: from,
            to: to
        };
    }
};
//# sourceMappingURL=slide.animation-preset.js.map