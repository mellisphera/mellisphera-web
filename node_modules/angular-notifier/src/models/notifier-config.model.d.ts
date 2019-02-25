export interface NotifierOptions {
    animations?: {
        enabled?: boolean;
        hide?: {
            easing?: string;
            offset?: number | false;
            preset?: string;
            speed?: number;
        };
        overlap?: number | false;
        shift?: {
            easing?: string;
            speed?: number;
        };
        show?: {
            easing?: string;
            preset?: string;
            speed?: number;
        };
    };
    behaviour?: {
        autoHide?: number | false;
        onClick?: 'hide' | false;
        onMouseover?: 'pauseAutoHide' | 'resetAutoHide' | false;
        showDismissButton?: boolean;
        stacking?: number | false;
    };
    position?: {
        horizontal?: {
            distance?: number;
            position?: 'left' | 'middle' | 'right';
        };
        vertical?: {
            distance?: number;
            gap?: number;
            position?: 'top' | 'bottom';
        };
    };
    theme?: string;
}
/**
 * Notifier configuration
 *
 * The notifier configuration defines what notifications look like, how they behave, and how they get animated. It is a global
 * configuration, which means that it only can be set once (at the beginning), and cannot be changed afterwards. Aligning to the world of
 * Angular, this configuration can be provided in the root app module - alternatively, a meaningful default configuration will be used.
 */
export declare class NotifierConfig implements NotifierOptions {
    /**
     * Customize animations
     */
    animations: {
        enabled: boolean;
        hide: {
            easing: string;
            offset: number | false;
            preset: string;
            speed: number;
        };
        overlap: number | false;
        shift: {
            easing: string;
            speed: number;
        };
        show: {
            easing: string;
            preset: string;
            speed: number;
        };
    };
    /**
     * Customize behaviour
     */
    behaviour: {
        autoHide: number | false;
        onClick: 'hide' | false;
        onMouseover: 'pauseAutoHide' | 'resetAutoHide' | false;
        showDismissButton: boolean;
        stacking: number | false;
    };
    /**
     * Customize positioning
     */
    position: {
        horizontal: {
            distance: number;
            position: 'left' | 'middle' | 'right';
        };
        vertical: {
            distance: number;
            gap: number;
            position: 'top' | 'bottom';
        };
    };
    /**
     * Customize theming
     */
    theme: string;
    /**
     * Constructor
     *
     * @param [customOptions={}] Custom notifier options, optional
     */
    constructor(customOptions?: NotifierOptions);
}
