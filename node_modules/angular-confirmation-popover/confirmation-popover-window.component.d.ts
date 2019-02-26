import { AfterViewInit } from '@angular/core';
import { ConfirmationPopoverWindowOptions } from './confirmation-popover-window-options.provider';
/**
 * @internal
 */
export declare class ConfirmationPopoverWindowComponent implements AfterViewInit {
    options: ConfirmationPopoverWindowOptions;
    constructor(options: ConfirmationPopoverWindowOptions);
    ngAfterViewInit(): void;
}
