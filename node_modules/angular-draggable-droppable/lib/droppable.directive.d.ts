import { OnInit, ElementRef, OnDestroy, EventEmitter, NgZone, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { DraggableHelper } from './draggable-helper.provider';
import { DraggableScrollContainerDirective } from './draggable-scroll-container.directive';
export interface DropEvent<T = any> {
    dropData: T;
}
export declare class DroppableDirective implements OnInit, OnDestroy {
    private element;
    private draggableHelper;
    private zone;
    private renderer;
    private scrollContainer;
    /**
     * Added to the element when an element is dragged over it
     */
    dragOverClass: string;
    /**
     * Added to the element any time a draggable element is being dragged
     */
    dragActiveClass: string;
    /**
     * Called when a draggable element starts overlapping the element
     */
    dragEnter: EventEmitter<DropEvent<any>>;
    /**
     * Called when a draggable element stops overlapping the element
     */
    dragLeave: EventEmitter<DropEvent<any>>;
    /**
     * Called when a draggable element is moved over the element
     */
    dragOver: EventEmitter<DropEvent<any>>;
    /**
     * Called when a draggable element is dropped on this element
     */
    drop: EventEmitter<DropEvent<any>>;
    currentDragSubscription: Subscription;
    constructor(element: ElementRef<HTMLElement>, draggableHelper: DraggableHelper, zone: NgZone, renderer: Renderer2, scrollContainer: DraggableScrollContainerDirective);
    ngOnInit(): void;
    ngOnDestroy(): void;
}
