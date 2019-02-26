import { EventEmitter, ViewContainerRef, ComponentRef, OnDestroy, ElementRef, OnChanges, OnInit, ComponentFactoryResolver, Renderer2, TemplateRef, SimpleChanges } from '@angular/core';
import { ConfirmationPopoverWindowComponent } from './confirmation-popover-window.component';
import { ConfirmationPopoverOptions } from './confirmation-popover-options.provider';
import { Positioning } from 'positioning';
/**
 * @internal
 */
export interface ConfirmCancelEvent {
    clickEvent: MouseEvent;
}
/**
 * All properties can be set on the directive as attributes like so (use `ConfirmationPopoverModule.forRoot()` to configure them globally):
 * ```html
 * <button
 *  class="btn btn-default"
 *  mwlConfirmationPopover
 *  [popoverTitle]="popoverTitle"
 *  [popoverMessage]="popoverMessage"
 *  placement="left"
 *  (confirm)="confirmClicked = true"
 *  (cancel)="cancelClicked = true"
 *  [(isOpen)]="isOpen">
 *   Show confirm popover!
 * </button>
 * ```
 */
export declare class ConfirmationPopoverDirective implements OnDestroy, OnChanges, OnInit {
    private viewContainerRef;
    private elm;
    private defaultOptions;
    private cfr;
    private position;
    private renderer;
    /**
     * The title of the popover
     */
    popoverTitle: string;
    /**
     * The body text of the popover.
     */
    popoverMessage: string;
    /**
     * The text of the confirm button. Default `Confirm`
     */
    confirmText: string;
    /**
     * The text of the cancel button. Default `Cancel`
     */
    cancelText: string;
    /**
     * The placement of the popover. It can be either `top`, `right`, `bottom` or `left`. Default `top`
     */
    placement: string;
    /**
     * The bootstrap button type of the confirm button. It can be any supported bootstrap color type
     * e.g. `default`, `warning`, `danger` etc. Default `success`
     */
    confirmButtonType: string;
    /**
     * The bootstrap button type of the cancel button. It can be any supported bootstrap color type
     * e.g. `default`, `warning`, `danger` etc. Default `default`
     */
    cancelButtonType: string;
    /**
     * Set to either `confirm` or `cancel` to focus the confirm or cancel button.
     * If omitted, by default it will not focus either button.
     */
    focusButton: string;
    /**
     * Whether to hide the confirm button. Default `false`.
     */
    hideConfirmButton: boolean;
    /**
     * Whether to hide the cancel button. Default `false`.
     */
    hideCancelButton: boolean;
    /**
     * Whether to disable showing the popover. Default `false`.
     */
    isDisabled: boolean;
    /**
     * Will open or show the popover when changed.
     * Can be sugared with `isOpenChange` to emulate 2-way binding like so `[(isOpen)]="isOpen"`
     */
    isOpen: boolean;
    /**
     * A reference to a <ng-template> tag that if set will override the popovers template. Use like so:
     * ```html
     * <ng-template #customTemplate let-options="options">
     *   <div [class]="'popover ' + options.placement" style="display: block">
     *     My custom template
     *   </div>
     * </ng-template>
     * ```
     *
     * Then pass customTemplate to the mwlConfirmationPopover directive like so `[customTemplate]="customTemplate"`
     */
    customTemplate: TemplateRef<any>;
    /**
     * Will emit when the popover is opened or closed
     */
    isOpenChange: EventEmitter<boolean>;
    /**
     * An expression that is called when the confirm button is clicked.
     */
    confirm: EventEmitter<ConfirmCancelEvent>;
    /**
     * An expression that is called when the cancel button is clicked.
     */
    cancel: EventEmitter<ConfirmCancelEvent>;
    /**
     * A custom CSS class to be added to the popover
     */
    popoverClass: string;
    /**
     * Append the element to the document body rather than the trigger element
     */
    appendToBody: boolean;
    /**
     * Swap the order of the confirm and cancel buttons
     */
    reverseButtonOrder: boolean;
    /**
     * Determines whether or not the popover should stay open even when clicking outside of it
     */
    closeOnOutsideClick: boolean;
    /**
     * @internal
     */
    popover: ComponentRef<ConfirmationPopoverWindowComponent>;
    private eventListeners;
    /**
     * @internal
     */
    constructor(viewContainerRef: ViewContainerRef, elm: ElementRef, defaultOptions: ConfirmationPopoverOptions, cfr: ComponentFactoryResolver, position: Positioning, renderer: Renderer2);
    /**
     * @internal
     */
    ngOnInit(): void;
    /**
     * @internal
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * @internal
     */
    ngOnDestroy(): void;
    /**
     * @internal
     */
    onConfirm(event: ConfirmCancelEvent): void;
    /**
     * @internal
     */
    onCancel(event: ConfirmCancelEvent): void;
    /**
     * @internal
     */
    togglePopover(): void;
    private onDocumentClick(event);
    private showPopover();
    private positionPopover();
    private hidePopover();
}
