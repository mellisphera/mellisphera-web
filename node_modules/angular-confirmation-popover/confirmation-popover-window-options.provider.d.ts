import { ConfirmCancelEvent } from './confirmation-popover.directive';
import { TemplateRef } from '@angular/core';
import { ConfirmationPopoverOptions } from './confirmation-popover-options.provider';
/**
 * @internal
 */
export declare class ConfirmationPopoverWindowOptions extends ConfirmationPopoverOptions {
    onConfirm: (event: ConfirmCancelEvent) => void;
    onCancel: (event: ConfirmCancelEvent) => void;
    onAfterViewInit: () => void;
    customTemplate: TemplateRef<any>;
}
