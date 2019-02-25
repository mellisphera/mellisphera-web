/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { CommonModule } from '@angular/common';
import { InjectionToken, NgModule } from '@angular/core';
import { NotifierContainerComponent } from './components/notifier-container.component';
import { NotifierNotificationComponent } from './components/notifier-notification.component';
import { NotifierConfig } from './models/notifier-config.model';
import { NotifierAnimationService } from './services/notifier-animation.service';
import { NotifierQueueService } from './services/notifier-queue.service';
import { NotifierService } from './services/notifier.service';
/**
 * Injection Token for notifier options
 */
export var /** @type {?} */ NotifierOptionsToken = new InjectionToken('[angular-notifier] Notifier Options');
/**
 * Injection Token for notifier configuration
 */
export var /** @type {?} */ NotifierConfigToken = new InjectionToken('[anuglar-notifier] Notifier Config');
/**
 * Factory for a notifier configuration with custom options
 *
 * Sidenote:
 * Required as Angular AoT compilation cannot handle dynamic functions; see <https://github.com/angular/angular/issues/11262>.
 *
 * @param {?} options - Custom notifier options
 * @return {?} - Notifier configuration as result
 */
export function notifierCustomConfigFactory(options) {
    return new NotifierConfig(options);
}
/**
 * Factory for a notifier configuration with default options
 *
 * Sidenote:
 * Required as Angular AoT compilation cannot handle dynamic functions; see <https://github.com/angular/angular/issues/11262>.
 *
 * @return {?} - Notifier configuration as result
 */
export function notifierDefaultConfigFactory() {
    return new NotifierConfig({});
}
/**
 * Notifier module
 */
var NotifierModule = /** @class */ (function () {
    function NotifierModule() {
    }
    /**
     * Setup the notifier module with custom providers, in this case with a custom configuration based on the givne options
     *
     * @param {?=} options
     * @return {?} - Notifier module with custom providers
     */
    NotifierModule.withConfig = /**
     * Setup the notifier module with custom providers, in this case with a custom configuration based on the givne options
     *
     * @param {?=} options
     * @return {?} - Notifier module with custom providers
     */
    function (options) {
        if (options === void 0) { options = {}; }
        return {
            ngModule: NotifierModule,
            providers: [
                // Provide the options itself upfront (as we need to inject them as dependencies -- see below)
                {
                    provide: NotifierOptionsToken,
                    useValue: options
                },
                // Provide a custom notifier configuration, based on the given notifier options
                {
                    deps: [
                        NotifierOptionsToken
                    ],
                    provide: NotifierConfigToken,
                    useFactory: notifierCustomConfigFactory
                }
            ]
        };
    };
    NotifierModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        NotifierContainerComponent,
                        NotifierNotificationComponent
                    ],
                    exports: [
                        NotifierContainerComponent
                    ],
                    imports: [
                        CommonModule
                    ],
                    providers: [
                        NotifierAnimationService,
                        NotifierService,
                        NotifierQueueService,
                        // Provide the default notifier configuration if just the module is imported
                        {
                            provide: NotifierConfigToken,
                            useFactory: notifierDefaultConfigFactory
                        }
                    ]
                },] },
    ];
    return NotifierModule;
}());
export { NotifierModule };
//# sourceMappingURL=notifier.module.js.map