import { InjectionToken, ModuleWithProviders } from '@angular/core';
import { NotifierConfig, NotifierOptions } from './models/notifier-config.model';
/**
 * Injection Token for notifier options
 */
export declare const NotifierOptionsToken: InjectionToken<NotifierOptions>;
/**
 * Injection Token for notifier configuration
 */
export declare const NotifierConfigToken: InjectionToken<NotifierConfig>;
/**
 * Factory for a notifier configuration with custom options
 *
 * Sidenote:
 * Required as Angular AoT compilation cannot handle dynamic functions; see <https://github.com/angular/angular/issues/11262>.
 *
 * @param   options - Custom notifier options
 * @returns - Notifier configuration as result
 */
export declare function notifierCustomConfigFactory(options: NotifierOptions): NotifierConfig;
/**
 * Factory for a notifier configuration with default options
 *
 * Sidenote:
 * Required as Angular AoT compilation cannot handle dynamic functions; see <https://github.com/angular/angular/issues/11262>.
 *
 * @returns - Notifier configuration as result
 */
export declare function notifierDefaultConfigFactory(): NotifierConfig;
/**
 * Notifier module
 */
export declare class NotifierModule {
    /**
     * Setup the notifier module with custom providers, in this case with a custom configuration based on the givne options
     *
     * @param   [options={}] - Custom notifier options
     * @returns - Notifier module with custom providers
     */
    static withConfig(options?: NotifierOptions): ModuleWithProviders;
}
