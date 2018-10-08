import { Renderer2, ElementRef, OnInit, EventEmitter, OnDestroy, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { Edges } from './interfaces/edges.interface';
import { ResizeEvent } from './interfaces/resize-event.interface';
export interface ResizeCursors {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
    leftOrRight: string;
    topOrBottom: string;
}
export declare const MOUSE_MOVE_THROTTLE_MS: number;
/**
 * Place this on an element to make it resizable. For example:
 *
 * ```html
 * <div
 *   mwlResizable
 *   [resizeEdges]="{bottom: true, right: true, top: true, left: true}"
 *   [enableGhostResize]="true">
 * </div>
 * ```
 */
export declare class ResizableDirective implements OnInit, OnDestroy {
    private renderer;
    elm: ElementRef;
    private zone;
    /**
     * A function that will be called before each resize event. Return `true` to allow the resize event to propagate or `false` to cancel it
     */
    validateResize: (resizeEvent: ResizeEvent) => boolean;
    /**
     * The edges that an element can be resized from. Pass an object like `{top: true, bottom: false}`. By default no edges can be resized.
     */
    resizeEdges: Edges;
    /**
     * Set to `true` to enable a temporary resizing effect of the element in between the `resizeStart` and `resizeEnd` events.
     */
    enableGhostResize: boolean;
    /**
     * A snap grid that resize events will be locked to.
     *
     * e.g. to only allow the element to be resized every 10px set it to `{left: 10, right: 10}`
     */
    resizeSnapGrid: Edges;
    /**
     * The mouse cursors that will be set on the resize edges
     */
    resizeCursors: ResizeCursors;
    /**
     * Mouse over thickness to active cursor.
     */
    resizeCursorPrecision: number;
    /**
     * Define the positioning of the ghost element (can be fixed or absolute)
     */
    ghostElementPositioning: 'fixed' | 'absolute';
    /**
     * Allow elements to be resized to negative dimensions
     */
    allowNegativeResizes: boolean;
    /**
     * Called when the mouse is pressed and a resize event is about to begin. `$event` is a `ResizeEvent` object.
     */
    resizeStart: EventEmitter<ResizeEvent>;
    /**
     * Called as the mouse is dragged after a resize event has begun. `$event` is a `ResizeEvent` object.
     */
    resizing: EventEmitter<ResizeEvent>;
    /**
     * Called after the mouse is released after a resize event. `$event` is a `ResizeEvent` object.
     */
    resizeEnd: EventEmitter<ResizeEvent>;
    /**
     * @hidden
     */
    mouseup: Subject<{
        clientX: number;
        clientY: number;
        edges?: Edges;
    }>;
    /**
     * @hidden
     */
    mousedown: Subject<{
        clientX: number;
        clientY: number;
        edges?: Edges;
    }>;
    /**
     * @hidden
     */
    mousemove: Subject<{
        clientX: number;
        clientY: number;
        edges?: Edges;
        event: MouseEvent | TouchEvent;
    }>;
    private pointerEventListeners;
    private destroy$;
    /**
     * @hidden
     */
    constructor(renderer: Renderer2, elm: ElementRef, zone: NgZone);
    /**
     * @hidden
     */
    ngOnInit(): void;
    /**
     * @hidden
     */
    ngOnDestroy(): void;
    private setElementClass;
}
