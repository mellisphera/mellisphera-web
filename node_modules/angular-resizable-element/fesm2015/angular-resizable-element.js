import { Directive, Renderer2, ElementRef, Output, Input, EventEmitter, NgZone, HostListener, NgModule } from '@angular/core';
import { Subject, Observable, merge } from 'rxjs';
import { map, mergeMap, takeUntil, filter, pairwise, take, share, auditTime } from 'rxjs/operators';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @param {?} value1
 * @param {?} value2
 * @param {?=} precision
 * @return {?}
 */
function isNumberCloseTo(value1, value2, precision = 3) {
    /** @type {?} */
    const diff = Math.abs(value1 - value2);
    return diff < precision;
}
/**
 * @param {?} startingRect
 * @param {?} edges
 * @param {?} clientX
 * @param {?} clientY
 * @return {?}
 */
function getNewBoundingRectangle(startingRect, edges, clientX, clientY) {
    /** @type {?} */
    const newBoundingRect = {
        top: startingRect.top,
        bottom: startingRect.bottom,
        left: startingRect.left,
        right: startingRect.right
    };
    if (edges.top) {
        newBoundingRect.top += clientY;
    }
    if (edges.bottom) {
        newBoundingRect.bottom += clientY;
    }
    if (edges.left) {
        newBoundingRect.left += clientX;
    }
    if (edges.right) {
        newBoundingRect.right += clientX;
    }
    newBoundingRect.height = newBoundingRect.bottom - newBoundingRect.top;
    newBoundingRect.width = newBoundingRect.right - newBoundingRect.left;
    return newBoundingRect;
}
/**
 * @param {?} element
 * @param {?} ghostElementPositioning
 * @return {?}
 */
function getElementRect(element, ghostElementPositioning) {
    /** @type {?} */
    let translateX = 0;
    /** @type {?} */
    let translateY = 0;
    /** @type {?} */
    const style = element.nativeElement.style;
    /** @type {?} */
    const transformProperties = [
        'transform',
        '-ms-transform',
        '-moz-transform',
        '-o-transform'
    ];
    /** @type {?} */
    const transform = transformProperties
        .map(property => style[property])
        .find(value => !!value);
    if (transform && transform.includes('translate')) {
        translateX = transform.replace(/.*translate\((.*)px, (.*)px\).*/, '$1');
        translateY = transform.replace(/.*translate\((.*)px, (.*)px\).*/, '$2');
    }
    if (ghostElementPositioning === 'absolute') {
        return {
            height: element.nativeElement.offsetHeight,
            width: element.nativeElement.offsetWidth,
            top: element.nativeElement.offsetTop - translateY,
            bottom: element.nativeElement.offsetHeight +
                element.nativeElement.offsetTop -
                translateY,
            left: element.nativeElement.offsetLeft - translateX,
            right: element.nativeElement.offsetWidth +
                element.nativeElement.offsetLeft -
                translateX
        };
    }
    else {
        /** @type {?} */
        const boundingRect = element.nativeElement.getBoundingClientRect();
        return {
            height: boundingRect.height,
            width: boundingRect.width,
            top: boundingRect.top - translateY,
            bottom: boundingRect.bottom - translateY,
            left: boundingRect.left - translateX,
            right: boundingRect.right - translateX,
            scrollTop: element.nativeElement.scrollTop,
            scrollLeft: element.nativeElement.scrollLeft
        };
    }
}
/**
 * @param {?} __0
 * @return {?}
 */
function isWithinBoundingY({ clientY, rect }) {
    return clientY >= rect.top && clientY <= rect.bottom;
}
/**
 * @param {?} __0
 * @return {?}
 */
function isWithinBoundingX({ clientX, rect }) {
    return clientX >= rect.left && clientX <= rect.right;
}
/**
 * @param {?} __0
 * @return {?}
 */
function getResizeEdges({ clientX, clientY, elm, allowedEdges, cursorPrecision }) {
    /** @type {?} */
    const elmPosition = elm.nativeElement.getBoundingClientRect();
    /** @type {?} */
    const edges = {};
    if (allowedEdges.left &&
        isNumberCloseTo(clientX, elmPosition.left, cursorPrecision) &&
        isWithinBoundingY({ clientY, rect: elmPosition })) {
        edges.left = true;
    }
    if (allowedEdges.right &&
        isNumberCloseTo(clientX, elmPosition.right, cursorPrecision) &&
        isWithinBoundingY({ clientY, rect: elmPosition })) {
        edges.right = true;
    }
    if (allowedEdges.top &&
        isNumberCloseTo(clientY, elmPosition.top, cursorPrecision) &&
        isWithinBoundingX({ clientX, rect: elmPosition })) {
        edges.top = true;
    }
    if (allowedEdges.bottom &&
        isNumberCloseTo(clientY, elmPosition.bottom, cursorPrecision) &&
        isWithinBoundingX({ clientX, rect: elmPosition })) {
        edges.bottom = true;
    }
    return edges;
}
/** @type {?} */
const DEFAULT_RESIZE_CURSORS = Object.freeze({
    topLeft: 'nw-resize',
    topRight: 'ne-resize',
    bottomLeft: 'sw-resize',
    bottomRight: 'se-resize',
    leftOrRight: 'col-resize',
    topOrBottom: 'row-resize'
});
/**
 * @param {?} edges
 * @param {?} cursors
 * @return {?}
 */
function getResizeCursor(edges, cursors) {
    if (edges.left && edges.top) {
        return cursors.topLeft;
    }
    else if (edges.right && edges.top) {
        return cursors.topRight;
    }
    else if (edges.left && edges.bottom) {
        return cursors.bottomLeft;
    }
    else if (edges.right && edges.bottom) {
        return cursors.bottomRight;
    }
    else if (edges.left || edges.right) {
        return cursors.leftOrRight;
    }
    else if (edges.top || edges.bottom) {
        return cursors.topOrBottom;
    }
    else {
        return '';
    }
}
/**
 * @param {?} __0
 * @return {?}
 */
function getEdgesDiff({ edges, initialRectangle, newRectangle }) {
    /** @type {?} */
    const edgesDiff = {};
    Object.keys(edges).forEach(edge => {
        edgesDiff[edge] = (newRectangle[edge] || 0) - (initialRectangle[edge] || 0);
    });
    return edgesDiff;
}
/** @type {?} */
const RESIZE_ACTIVE_CLASS = 'resize-active';
/** @type {?} */
const RESIZE_LEFT_HOVER_CLASS = 'resize-left-hover';
/** @type {?} */
const RESIZE_RIGHT_HOVER_CLASS = 'resize-right-hover';
/** @type {?} */
const RESIZE_TOP_HOVER_CLASS = 'resize-top-hover';
/** @type {?} */
const RESIZE_BOTTOM_HOVER_CLASS = 'resize-bottom-hover';
/** @type {?} */
const RESIZE_GHOST_ELEMENT_CLASS = 'resize-ghost-element';
/** @type {?} */
const MOUSE_MOVE_THROTTLE_MS = 50;
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
class ResizableDirective {
    /**
     * @hidden
     * @param {?} renderer
     * @param {?} elm
     * @param {?} zone
     */
    constructor(renderer, elm, zone) {
        this.renderer = renderer;
        this.elm = elm;
        this.zone = zone;
        /**
         * The edges that an element can be resized from. Pass an object like `{top: true, bottom: false}`. By default no edges can be resized.
         */
        this.resizeEdges = {};
        /**
         * Set to `true` to enable a temporary resizing effect of the element in between the `resizeStart` and `resizeEnd` events.
         */
        this.enableGhostResize = false;
        /**
         * A snap grid that resize events will be locked to.
         *
         * e.g. to only allow the element to be resized every 10px set it to `{left: 10, right: 10}`
         */
        this.resizeSnapGrid = {};
        /**
         * The mouse cursors that will be set on the resize edges
         */
        this.resizeCursors = DEFAULT_RESIZE_CURSORS;
        /**
         * Mouse over thickness to active cursor.
         */
        this.resizeCursorPrecision = 3;
        /**
         * Define the positioning of the ghost element (can be fixed or absolute)
         */
        this.ghostElementPositioning = 'fixed';
        /**
         * Allow elements to be resized to negative dimensions
         */
        this.allowNegativeResizes = false;
        /**
         * Called when the mouse is pressed and a resize event is about to begin. `$event` is a `ResizeEvent` object.
         */
        this.resizeStart = new EventEmitter();
        /**
         * Called as the mouse is dragged after a resize event has begun. `$event` is a `ResizeEvent` object.
         */
        this.resizing = new EventEmitter();
        /**
         * Called after the mouse is released after a resize event. `$event` is a `ResizeEvent` object.
         */
        this.resizeEnd = new EventEmitter();
        /**
         * @hidden
         */
        this.mouseup = new Subject();
        /**
         * @hidden
         */
        this.mousedown = new Subject();
        /**
         * @hidden
         */
        this.mousemove = new Subject();
        this.destroy$ = new Subject();
        this.pointerEventListeners = PointerEventListeners.getInstance(renderer, zone);
    }
    /**
     * @hidden
     * @return {?}
     */
    ngOnInit() {
        // TODO - use some fancy Observable.merge's for this
        this.pointerEventListeners.pointerDown
            .pipe(takeUntil(this.destroy$))
            .subscribe(({ clientX, clientY }) => {
            this.mousedown.next({ clientX, clientY });
        });
        this.pointerEventListeners.pointerMove
            .pipe(takeUntil(this.destroy$))
            .subscribe(({ clientX, clientY, event }) => {
            this.mousemove.next({ clientX, clientY, event });
        });
        this.pointerEventListeners.pointerUp
            .pipe(takeUntil(this.destroy$))
            .subscribe(({ clientX, clientY }) => {
            this.mouseup.next({ clientX, clientY });
        });
        /** @type {?} */
        let currentResize;
        /** @type {?} */
        const removeGhostElement = () => {
            if (currentResize && currentResize.clonedNode) {
                this.elm.nativeElement.parentElement.removeChild(currentResize.clonedNode);
                this.renderer.setStyle(this.elm.nativeElement, 'visibility', 'inherit');
            }
        };
        /** @type {?} */
        const mouseMove = this.mousemove.pipe(share());
        mouseMove.pipe(filter(() => !!currentResize)).subscribe(({ event }) => {
            event.preventDefault();
        });
        mouseMove
            .pipe(auditTime(MOUSE_MOVE_THROTTLE_MS))
            .subscribe(({ clientX, clientY }) => {
            /** @type {?} */
            const resizeEdges = getResizeEdges({
                clientX,
                clientY,
                elm: this.elm,
                allowedEdges: this.resizeEdges,
                cursorPrecision: this.resizeCursorPrecision
            });
            /** @type {?} */
            const resizeCursors = Object.assign({}, DEFAULT_RESIZE_CURSORS, this.resizeCursors);
            if (currentResize) {
                /** @type {?} */
                const cursor = getResizeCursor(currentResize.edges, resizeCursors);
                this.renderer.setStyle(document.body, 'cursor', cursor);
            }
            else {
                /** @type {?} */
                const cursor = getResizeCursor(resizeEdges, resizeCursors);
                this.renderer.setStyle(this.elm.nativeElement, 'cursor', cursor);
            }
            this.setElementClass(this.elm, RESIZE_ACTIVE_CLASS, !!currentResize);
            this.setElementClass(this.elm, RESIZE_LEFT_HOVER_CLASS, resizeEdges.left === true);
            this.setElementClass(this.elm, RESIZE_RIGHT_HOVER_CLASS, resizeEdges.right === true);
            this.setElementClass(this.elm, RESIZE_TOP_HOVER_CLASS, resizeEdges.top === true);
            this.setElementClass(this.elm, RESIZE_BOTTOM_HOVER_CLASS, resizeEdges.bottom === true);
        });
        /** @type {?} */
        const mousedrag = this.mousedown
            .pipe(mergeMap(startCoords => {
            /**
             * @param {?} moveCoords
             * @return {?}
             */
            function getDiff(moveCoords) {
                return {
                    clientX: moveCoords.clientX - startCoords.clientX,
                    clientY: moveCoords.clientY - startCoords.clientY
                };
            }
            /** @type {?} */
            const getSnapGrid = () => {
                /** @type {?} */
                const snapGrid = { x: 1, y: 1 };
                if (currentResize) {
                    if (this.resizeSnapGrid.left && currentResize.edges.left) {
                        snapGrid.x = +this.resizeSnapGrid.left;
                    }
                    else if (this.resizeSnapGrid.right &&
                        currentResize.edges.right) {
                        snapGrid.x = +this.resizeSnapGrid.right;
                    }
                    if (this.resizeSnapGrid.top && currentResize.edges.top) {
                        snapGrid.y = +this.resizeSnapGrid.top;
                    }
                    else if (this.resizeSnapGrid.bottom &&
                        currentResize.edges.bottom) {
                        snapGrid.y = +this.resizeSnapGrid.bottom;
                    }
                }
                return snapGrid;
            };
            /**
             * @param {?} coords
             * @param {?} snapGrid
             * @return {?}
             */
            function getGrid(coords, snapGrid) {
                return {
                    x: Math.ceil(coords.clientX / snapGrid.x),
                    y: Math.ceil(coords.clientY / snapGrid.y)
                };
            }
            return merge(mouseMove.pipe(take(1)).pipe(map(coords => [, coords])), mouseMove.pipe(pairwise()))
                .pipe(map(([previousCoords, newCoords]) => {
                return [
                    previousCoords ? getDiff(previousCoords) : previousCoords,
                    getDiff(newCoords)
                ];
            }))
                .pipe(filter(([previousCoords, newCoords]) => {
                if (!previousCoords) {
                    return true;
                }
                /** @type {?} */
                const snapGrid = getSnapGrid();
                /** @type {?} */
                const previousGrid = getGrid(previousCoords, snapGrid);
                /** @type {?} */
                const newGrid = getGrid(newCoords, snapGrid);
                return (previousGrid.x !== newGrid.x || previousGrid.y !== newGrid.y);
            }))
                .pipe(map(([, newCoords]) => {
                /** @type {?} */
                const snapGrid = getSnapGrid();
                return {
                    clientX: Math.round(newCoords.clientX / snapGrid.x) * snapGrid.x,
                    clientY: Math.round(newCoords.clientY / snapGrid.y) * snapGrid.y
                };
            }))
                .pipe(takeUntil(merge(this.mouseup, this.mousedown)));
        }))
            .pipe(filter(() => !!currentResize));
        mousedrag
            .pipe(map(({ clientX, clientY }) => {
            return getNewBoundingRectangle(/** @type {?} */ ((currentResize)).startingRect, /** @type {?} */ ((currentResize)).edges, clientX, clientY);
        }))
            .pipe(filter((newBoundingRect) => {
            return (this.allowNegativeResizes ||
                !!(newBoundingRect.height &&
                    newBoundingRect.width &&
                    newBoundingRect.height > 0 &&
                    newBoundingRect.width > 0));
        }))
            .pipe(filter((newBoundingRect) => {
            return this.validateResize
                ? this.validateResize({
                    rectangle: newBoundingRect,
                    edges: getEdgesDiff({
                        edges: /** @type {?} */ ((currentResize)).edges,
                        initialRectangle: /** @type {?} */ ((currentResize)).startingRect,
                        newRectangle: newBoundingRect
                    })
                })
                : true;
        }))
            .subscribe((newBoundingRect) => {
            if (currentResize && currentResize.clonedNode) {
                this.renderer.setStyle(currentResize.clonedNode, 'height', `${newBoundingRect.height}px`);
                this.renderer.setStyle(currentResize.clonedNode, 'width', `${newBoundingRect.width}px`);
                this.renderer.setStyle(currentResize.clonedNode, 'top', `${newBoundingRect.top}px`);
                this.renderer.setStyle(currentResize.clonedNode, 'left', `${newBoundingRect.left}px`);
            }
            this.zone.run(() => {
                this.resizing.emit({
                    edges: getEdgesDiff({
                        edges: /** @type {?} */ ((currentResize)).edges,
                        initialRectangle: /** @type {?} */ ((currentResize)).startingRect,
                        newRectangle: newBoundingRect
                    }),
                    rectangle: newBoundingRect
                });
            }); /** @type {?} */
            ((currentResize)).currentRect = newBoundingRect;
        });
        this.mousedown
            .pipe(map(({ clientX, clientY, edges }) => {
            return (edges ||
                getResizeEdges({
                    clientX,
                    clientY,
                    elm: this.elm,
                    allowedEdges: this.resizeEdges,
                    cursorPrecision: this.resizeCursorPrecision
                }));
        }))
            .pipe(filter((edges) => {
            return Object.keys(edges).length > 0;
        }))
            .subscribe((edges) => {
            if (currentResize) {
                removeGhostElement();
            }
            /** @type {?} */
            const startingRect = getElementRect(this.elm, this.ghostElementPositioning);
            currentResize = {
                edges,
                startingRect,
                currentRect: startingRect
            };
            if (this.enableGhostResize) {
                currentResize.clonedNode = this.elm.nativeElement.cloneNode(true);
                /** @type {?} */
                const resizeCursors = Object.assign({}, DEFAULT_RESIZE_CURSORS, this.resizeCursors);
                this.elm.nativeElement.parentElement.appendChild(currentResize.clonedNode);
                this.renderer.setStyle(this.elm.nativeElement, 'visibility', 'hidden');
                this.renderer.setStyle(currentResize.clonedNode, 'position', this.ghostElementPositioning);
                this.renderer.setStyle(currentResize.clonedNode, 'left', `${currentResize.startingRect.left}px`);
                this.renderer.setStyle(currentResize.clonedNode, 'top', `${currentResize.startingRect.top}px`);
                this.renderer.setStyle(currentResize.clonedNode, 'height', `${currentResize.startingRect.height}px`);
                this.renderer.setStyle(currentResize.clonedNode, 'width', `${currentResize.startingRect.width}px`);
                this.renderer.setStyle(currentResize.clonedNode, 'cursor', getResizeCursor(currentResize.edges, resizeCursors));
                this.renderer.addClass(currentResize.clonedNode, RESIZE_GHOST_ELEMENT_CLASS); /** @type {?} */
                ((currentResize.clonedNode)).scrollTop = /** @type {?} */ (currentResize.startingRect
                    .scrollTop); /** @type {?} */
                ((currentResize.clonedNode)).scrollLeft = /** @type {?} */ (currentResize.startingRect
                    .scrollLeft);
            }
            this.zone.run(() => {
                this.resizeStart.emit({
                    edges: getEdgesDiff({
                        edges,
                        initialRectangle: startingRect,
                        newRectangle: startingRect
                    }),
                    rectangle: getNewBoundingRectangle(startingRect, {}, 0, 0)
                });
            });
        });
        this.mouseup.subscribe(() => {
            if (currentResize) {
                this.renderer.removeClass(this.elm.nativeElement, RESIZE_ACTIVE_CLASS);
                this.renderer.setStyle(document.body, 'cursor', '');
                this.renderer.setStyle(this.elm.nativeElement, 'cursor', '');
                this.zone.run(() => {
                    this.resizeEnd.emit({
                        edges: getEdgesDiff({
                            edges: /** @type {?} */ ((currentResize)).edges,
                            initialRectangle: /** @type {?} */ ((currentResize)).startingRect,
                            newRectangle: /** @type {?} */ ((currentResize)).currentRect
                        }),
                        rectangle: /** @type {?} */ ((currentResize)).currentRect
                    });
                });
                removeGhostElement();
                currentResize = null;
            }
        });
    }
    /**
     * @hidden
     * @return {?}
     */
    ngOnDestroy() {
        this.mousedown.complete();
        this.mouseup.complete();
        this.mousemove.complete();
        this.destroy$.next();
    }
    /**
     * @param {?} elm
     * @param {?} name
     * @param {?} add
     * @return {?}
     */
    setElementClass(elm, name, add) {
        if (add) {
            this.renderer.addClass(elm.nativeElement, name);
        }
        else {
            this.renderer.removeClass(elm.nativeElement, name);
        }
    }
}
ResizableDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mwlResizable]'
            },] }
];
/** @nocollapse */
ResizableDirective.ctorParameters = () => [
    { type: Renderer2 },
    { type: ElementRef },
    { type: NgZone }
];
ResizableDirective.propDecorators = {
    validateResize: [{ type: Input }],
    resizeEdges: [{ type: Input }],
    enableGhostResize: [{ type: Input }],
    resizeSnapGrid: [{ type: Input }],
    resizeCursors: [{ type: Input }],
    resizeCursorPrecision: [{ type: Input }],
    ghostElementPositioning: [{ type: Input }],
    allowNegativeResizes: [{ type: Input }],
    resizeStart: [{ type: Output }],
    resizing: [{ type: Output }],
    resizeEnd: [{ type: Output }]
};
class PointerEventListeners {
    /**
     * @param {?} renderer
     * @param {?} zone
     * @return {?}
     */
    static getInstance(renderer, zone) {
        if (!PointerEventListeners.instance) {
            PointerEventListeners.instance = new PointerEventListeners(renderer, zone);
        }
        return PointerEventListeners.instance;
    }
    /**
     * @param {?} renderer
     * @param {?} zone
     */
    constructor(renderer, zone) {
        this.pointerDown = new Observable((observer) => {
            /** @type {?} */
            let unsubscribeMouseDown;
            /** @type {?} */
            let unsubscribeTouchStart;
            zone.runOutsideAngular(() => {
                unsubscribeMouseDown = renderer.listen('document', 'mousedown', (event) => {
                    observer.next({
                        clientX: event.clientX,
                        clientY: event.clientY,
                        event
                    });
                });
                unsubscribeTouchStart = renderer.listen('document', 'touchstart', (event) => {
                    observer.next({
                        clientX: event.touches[0].clientX,
                        clientY: event.touches[0].clientY,
                        event
                    });
                });
            });
            return () => {
                unsubscribeMouseDown();
                unsubscribeTouchStart();
            };
        }).pipe(share());
        this.pointerMove = new Observable((observer) => {
            /** @type {?} */
            let unsubscribeMouseMove;
            /** @type {?} */
            let unsubscribeTouchMove;
            zone.runOutsideAngular(() => {
                unsubscribeMouseMove = renderer.listen('document', 'mousemove', (event) => {
                    observer.next({
                        clientX: event.clientX,
                        clientY: event.clientY,
                        event
                    });
                });
                unsubscribeTouchMove = renderer.listen('document', 'touchmove', (event) => {
                    observer.next({
                        clientX: event.targetTouches[0].clientX,
                        clientY: event.targetTouches[0].clientY,
                        event
                    });
                });
            });
            return () => {
                unsubscribeMouseMove();
                unsubscribeTouchMove();
            };
        }).pipe(share());
        this.pointerUp = new Observable((observer) => {
            /** @type {?} */
            let unsubscribeMouseUp;
            /** @type {?} */
            let unsubscribeTouchEnd;
            /** @type {?} */
            let unsubscribeTouchCancel;
            zone.runOutsideAngular(() => {
                unsubscribeMouseUp = renderer.listen('document', 'mouseup', (event) => {
                    observer.next({
                        clientX: event.clientX,
                        clientY: event.clientY,
                        event
                    });
                });
                unsubscribeTouchEnd = renderer.listen('document', 'touchend', (event) => {
                    observer.next({
                        clientX: event.changedTouches[0].clientX,
                        clientY: event.changedTouches[0].clientY,
                        event
                    });
                });
                unsubscribeTouchCancel = renderer.listen('document', 'touchcancel', (event) => {
                    observer.next({
                        clientX: event.changedTouches[0].clientX,
                        clientY: event.changedTouches[0].clientY,
                        event
                    });
                });
            });
            return () => {
                unsubscribeMouseUp();
                unsubscribeTouchEnd();
                unsubscribeTouchCancel();
            };
        }).pipe(share());
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * An element placed inside a `mwlResizable` directive to be used as a drag and resize handle
 *
 * For example
 *
 * ```html
 * <div mwlResizable>
 *   <div mwlResizeHandle [resizeEdges]="{bottom: true, right: true}"></div>
 * </div>
 * ```
 */
class ResizeHandleDirective {
    /**
     * @param {?} renderer
     * @param {?} element
     * @param {?} zone
     * @param {?} resizable
     */
    constructor(renderer, element, zone, resizable) {
        this.renderer = renderer;
        this.element = element;
        this.zone = zone;
        this.resizable = resizable;
        /**
         * The `Edges` object that contains the edges of the parent element that dragging the handle will trigger a resize on
         */
        this.resizeEdges = {};
        this.eventListeners = {};
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.unsubscribeEventListeners();
    }
    /**
     * @hidden
     * @param {?} event
     * @param {?} clientX
     * @param {?} clientY
     * @return {?}
     */
    onMousedown(event, clientX, clientY) {
        event.preventDefault();
        this.zone.runOutsideAngular(() => {
            if (!this.eventListeners.touchmove) {
                this.eventListeners.touchmove = this.renderer.listen(this.element.nativeElement, 'touchmove', (touchMoveEvent) => {
                    this.onMousemove(touchMoveEvent, touchMoveEvent.targetTouches[0].clientX, touchMoveEvent.targetTouches[0].clientY);
                });
            }
            if (!this.eventListeners.mousemove) {
                this.eventListeners.mousemove = this.renderer.listen(this.element.nativeElement, 'mousemove', (mouseMoveEvent) => {
                    this.onMousemove(mouseMoveEvent, mouseMoveEvent.clientX, mouseMoveEvent.clientY);
                });
            }
            this.resizable.mousedown.next({
                clientX,
                clientY,
                edges: this.resizeEdges
            });
        });
    }
    /**
     * @hidden
     * @param {?} clientX
     * @param {?} clientY
     * @return {?}
     */
    onMouseup(clientX, clientY) {
        this.zone.runOutsideAngular(() => {
            this.unsubscribeEventListeners();
            this.resizable.mouseup.next({
                clientX,
                clientY,
                edges: this.resizeEdges
            });
        });
    }
    /**
     * @param {?} event
     * @param {?} clientX
     * @param {?} clientY
     * @return {?}
     */
    onMousemove(event, clientX, clientY) {
        this.resizable.mousemove.next({
            clientX,
            clientY,
            edges: this.resizeEdges,
            event
        });
    }
    /**
     * @return {?}
     */
    unsubscribeEventListeners() {
        Object.keys(this.eventListeners).forEach(type => {
            (/** @type {?} */ (this)).eventListeners[type]();
            delete this.eventListeners[type];
        });
    }
}
ResizeHandleDirective.decorators = [
    { type: Directive, args: [{
                selector: '[mwlResizeHandle]'
            },] }
];
/** @nocollapse */
ResizeHandleDirective.ctorParameters = () => [
    { type: Renderer2 },
    { type: ElementRef },
    { type: NgZone },
    { type: ResizableDirective }
];
ResizeHandleDirective.propDecorators = {
    resizeEdges: [{ type: Input }],
    onMousedown: [{ type: HostListener, args: ['touchstart', [
                    '$event',
                    '$event.touches[0].clientX',
                    '$event.touches[0].clientY'
                ],] }, { type: HostListener, args: ['mousedown', ['$event', '$event.clientX', '$event.clientY'],] }],
    onMouseup: [{ type: HostListener, args: ['touchend', [
                    '$event.changedTouches[0].clientX',
                    '$event.changedTouches[0].clientY'
                ],] }, { type: HostListener, args: ['touchcancel', [
                    '$event.changedTouches[0].clientX',
                    '$event.changedTouches[0].clientY'
                ],] }, { type: HostListener, args: ['mouseup', ['$event.clientX', '$event.clientY'],] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class ResizableModule {
}
ResizableModule.decorators = [
    { type: NgModule, args: [{
                declarations: [ResizableDirective, ResizeHandleDirective],
                exports: [ResizableDirective, ResizeHandleDirective]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { ResizableDirective, ResizeHandleDirective, ResizableModule };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1yZXNpemFibGUtZWxlbWVudC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vYW5ndWxhci1yZXNpemFibGUtZWxlbWVudC9yZXNpemFibGUuZGlyZWN0aXZlLnRzIiwibmc6Ly9hbmd1bGFyLXJlc2l6YWJsZS1lbGVtZW50L3Jlc2l6ZS1oYW5kbGUuZGlyZWN0aXZlLnRzIiwibmc6Ly9hbmd1bGFyLXJlc2l6YWJsZS1lbGVtZW50L3Jlc2l6YWJsZS5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBSZW5kZXJlcjIsXG4gIEVsZW1lbnRSZWYsXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBJbnB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBPbkRlc3Ryb3ksXG4gIE5nWm9uZVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFN1YmplY3QsIE9ic2VydmFibGUsIE9ic2VydmVyLCBtZXJnZSwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBtYXAsXG4gIG1lcmdlTWFwLFxuICB0YWtlVW50aWwsXG4gIGZpbHRlcixcbiAgcGFpcndpc2UsXG4gIHRha2UsXG4gIHNoYXJlLFxuICBhdWRpdFRpbWVcbn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgRWRnZXMgfSBmcm9tICcuL2ludGVyZmFjZXMvZWRnZXMuaW50ZXJmYWNlJztcbmltcG9ydCB7IEJvdW5kaW5nUmVjdGFuZ2xlIH0gZnJvbSAnLi9pbnRlcmZhY2VzL2JvdW5kaW5nLXJlY3RhbmdsZS5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgUmVzaXplRXZlbnQgfSBmcm9tICcuL2ludGVyZmFjZXMvcmVzaXplLWV2ZW50LmludGVyZmFjZSc7XG5cbmludGVyZmFjZSBQb2ludGVyRXZlbnRDb29yZGluYXRlIHtcbiAgY2xpZW50WDogbnVtYmVyO1xuICBjbGllbnRZOiBudW1iZXI7XG4gIGV2ZW50OiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudDtcbn1cblxuaW50ZXJmYWNlIENvb3JkaW5hdGUge1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXJDbG9zZVRvKFxuICB2YWx1ZTE6IG51bWJlcixcbiAgdmFsdWUyOiBudW1iZXIsXG4gIHByZWNpc2lvbjogbnVtYmVyID0gM1xuKTogYm9vbGVhbiB7XG4gIGNvbnN0IGRpZmY6IG51bWJlciA9IE1hdGguYWJzKHZhbHVlMSAtIHZhbHVlMik7XG4gIHJldHVybiBkaWZmIDwgcHJlY2lzaW9uO1xufVxuXG5mdW5jdGlvbiBnZXROZXdCb3VuZGluZ1JlY3RhbmdsZShcbiAgc3RhcnRpbmdSZWN0OiBCb3VuZGluZ1JlY3RhbmdsZSxcbiAgZWRnZXM6IEVkZ2VzLFxuICBjbGllbnRYOiBudW1iZXIsXG4gIGNsaWVudFk6IG51bWJlclxuKTogQm91bmRpbmdSZWN0YW5nbGUge1xuICBjb25zdCBuZXdCb3VuZGluZ1JlY3Q6IEJvdW5kaW5nUmVjdGFuZ2xlID0ge1xuICAgIHRvcDogc3RhcnRpbmdSZWN0LnRvcCxcbiAgICBib3R0b206IHN0YXJ0aW5nUmVjdC5ib3R0b20sXG4gICAgbGVmdDogc3RhcnRpbmdSZWN0LmxlZnQsXG4gICAgcmlnaHQ6IHN0YXJ0aW5nUmVjdC5yaWdodFxuICB9O1xuXG4gIGlmIChlZGdlcy50b3ApIHtcbiAgICBuZXdCb3VuZGluZ1JlY3QudG9wICs9IGNsaWVudFk7XG4gIH1cbiAgaWYgKGVkZ2VzLmJvdHRvbSkge1xuICAgIG5ld0JvdW5kaW5nUmVjdC5ib3R0b20gKz0gY2xpZW50WTtcbiAgfVxuICBpZiAoZWRnZXMubGVmdCkge1xuICAgIG5ld0JvdW5kaW5nUmVjdC5sZWZ0ICs9IGNsaWVudFg7XG4gIH1cbiAgaWYgKGVkZ2VzLnJpZ2h0KSB7XG4gICAgbmV3Qm91bmRpbmdSZWN0LnJpZ2h0ICs9IGNsaWVudFg7XG4gIH1cbiAgbmV3Qm91bmRpbmdSZWN0LmhlaWdodCA9IG5ld0JvdW5kaW5nUmVjdC5ib3R0b20gLSBuZXdCb3VuZGluZ1JlY3QudG9wO1xuICBuZXdCb3VuZGluZ1JlY3Qud2lkdGggPSBuZXdCb3VuZGluZ1JlY3QucmlnaHQgLSBuZXdCb3VuZGluZ1JlY3QubGVmdDtcblxuICByZXR1cm4gbmV3Qm91bmRpbmdSZWN0O1xufVxuXG5mdW5jdGlvbiBnZXRFbGVtZW50UmVjdChcbiAgZWxlbWVudDogRWxlbWVudFJlZixcbiAgZ2hvc3RFbGVtZW50UG9zaXRpb25pbmc6IHN0cmluZ1xuKTogQm91bmRpbmdSZWN0YW5nbGUge1xuICBsZXQgdHJhbnNsYXRlWCA9IDA7XG4gIGxldCB0cmFuc2xhdGVZID0gMDtcbiAgY29uc3Qgc3R5bGUgPSBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc3R5bGU7XG4gIGNvbnN0IHRyYW5zZm9ybVByb3BlcnRpZXMgPSBbXG4gICAgJ3RyYW5zZm9ybScsXG4gICAgJy1tcy10cmFuc2Zvcm0nLFxuICAgICctbW96LXRyYW5zZm9ybScsXG4gICAgJy1vLXRyYW5zZm9ybSdcbiAgXTtcbiAgY29uc3QgdHJhbnNmb3JtID0gdHJhbnNmb3JtUHJvcGVydGllc1xuICAgIC5tYXAocHJvcGVydHkgPT4gc3R5bGVbcHJvcGVydHldKVxuICAgIC5maW5kKHZhbHVlID0+ICEhdmFsdWUpO1xuICBpZiAodHJhbnNmb3JtICYmIHRyYW5zZm9ybS5pbmNsdWRlcygndHJhbnNsYXRlJykpIHtcbiAgICB0cmFuc2xhdGVYID0gdHJhbnNmb3JtLnJlcGxhY2UoLy4qdHJhbnNsYXRlXFwoKC4qKXB4LCAoLiopcHhcXCkuKi8sICckMScpO1xuICAgIHRyYW5zbGF0ZVkgPSB0cmFuc2Zvcm0ucmVwbGFjZSgvLip0cmFuc2xhdGVcXCgoLiopcHgsICguKilweFxcKS4qLywgJyQyJyk7XG4gIH1cblxuICBpZiAoZ2hvc3RFbGVtZW50UG9zaXRpb25pbmcgPT09ICdhYnNvbHV0ZScpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGVpZ2h0OiBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0LFxuICAgICAgd2lkdGg6IGVsZW1lbnQubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aCxcbiAgICAgIHRvcDogZWxlbWVudC5uYXRpdmVFbGVtZW50Lm9mZnNldFRvcCAtIHRyYW5zbGF0ZVksXG4gICAgICBib3R0b206XG4gICAgICAgIGVsZW1lbnQubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQgK1xuICAgICAgICBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQub2Zmc2V0VG9wIC1cbiAgICAgICAgdHJhbnNsYXRlWSxcbiAgICAgIGxlZnQ6IGVsZW1lbnQubmF0aXZlRWxlbWVudC5vZmZzZXRMZWZ0IC0gdHJhbnNsYXRlWCxcbiAgICAgIHJpZ2h0OlxuICAgICAgICBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGggK1xuICAgICAgICBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQub2Zmc2V0TGVmdCAtXG4gICAgICAgIHRyYW5zbGF0ZVhcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGJvdW5kaW5nUmVjdDogQm91bmRpbmdSZWN0YW5nbGUgPSBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlaWdodDogYm91bmRpbmdSZWN0LmhlaWdodCxcbiAgICAgIHdpZHRoOiBib3VuZGluZ1JlY3Qud2lkdGgsXG4gICAgICB0b3A6IGJvdW5kaW5nUmVjdC50b3AgLSB0cmFuc2xhdGVZLFxuICAgICAgYm90dG9tOiBib3VuZGluZ1JlY3QuYm90dG9tIC0gdHJhbnNsYXRlWSxcbiAgICAgIGxlZnQ6IGJvdW5kaW5nUmVjdC5sZWZ0IC0gdHJhbnNsYXRlWCxcbiAgICAgIHJpZ2h0OiBib3VuZGluZ1JlY3QucmlnaHQgLSB0cmFuc2xhdGVYLFxuICAgICAgc2Nyb2xsVG9wOiBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wLFxuICAgICAgc2Nyb2xsTGVmdDogZWxlbWVudC5uYXRpdmVFbGVtZW50LnNjcm9sbExlZnRcbiAgICB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzV2l0aGluQm91bmRpbmdZKHtcbiAgY2xpZW50WSxcbiAgcmVjdFxufToge1xuICBjbGllbnRZOiBudW1iZXI7XG4gIHJlY3Q6IENsaWVudFJlY3Q7XG59KTogYm9vbGVhbiB7XG4gIHJldHVybiBjbGllbnRZID49IHJlY3QudG9wICYmIGNsaWVudFkgPD0gcmVjdC5ib3R0b207XG59XG5cbmZ1bmN0aW9uIGlzV2l0aGluQm91bmRpbmdYKHtcbiAgY2xpZW50WCxcbiAgcmVjdFxufToge1xuICBjbGllbnRYOiBudW1iZXI7XG4gIHJlY3Q6IENsaWVudFJlY3Q7XG59KTogYm9vbGVhbiB7XG4gIHJldHVybiBjbGllbnRYID49IHJlY3QubGVmdCAmJiBjbGllbnRYIDw9IHJlY3QucmlnaHQ7XG59XG5cbmZ1bmN0aW9uIGdldFJlc2l6ZUVkZ2VzKHtcbiAgY2xpZW50WCxcbiAgY2xpZW50WSxcbiAgZWxtLFxuICBhbGxvd2VkRWRnZXMsXG4gIGN1cnNvclByZWNpc2lvblxufToge1xuICBjbGllbnRYOiBudW1iZXI7XG4gIGNsaWVudFk6IG51bWJlcjtcbiAgZWxtOiBFbGVtZW50UmVmO1xuICBhbGxvd2VkRWRnZXM6IEVkZ2VzO1xuICBjdXJzb3JQcmVjaXNpb246IG51bWJlcjtcbn0pOiBFZGdlcyB7XG4gIGNvbnN0IGVsbVBvc2l0aW9uOiBDbGllbnRSZWN0ID0gZWxtLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIGNvbnN0IGVkZ2VzOiBFZGdlcyA9IHt9O1xuXG4gIGlmIChcbiAgICBhbGxvd2VkRWRnZXMubGVmdCAmJlxuICAgIGlzTnVtYmVyQ2xvc2VUbyhjbGllbnRYLCBlbG1Qb3NpdGlvbi5sZWZ0LCBjdXJzb3JQcmVjaXNpb24pICYmXG4gICAgaXNXaXRoaW5Cb3VuZGluZ1koeyBjbGllbnRZLCByZWN0OiBlbG1Qb3NpdGlvbiB9KVxuICApIHtcbiAgICBlZGdlcy5sZWZ0ID0gdHJ1ZTtcbiAgfVxuXG4gIGlmIChcbiAgICBhbGxvd2VkRWRnZXMucmlnaHQgJiZcbiAgICBpc051bWJlckNsb3NlVG8oY2xpZW50WCwgZWxtUG9zaXRpb24ucmlnaHQsIGN1cnNvclByZWNpc2lvbikgJiZcbiAgICBpc1dpdGhpbkJvdW5kaW5nWSh7IGNsaWVudFksIHJlY3Q6IGVsbVBvc2l0aW9uIH0pXG4gICkge1xuICAgIGVkZ2VzLnJpZ2h0ID0gdHJ1ZTtcbiAgfVxuXG4gIGlmIChcbiAgICBhbGxvd2VkRWRnZXMudG9wICYmXG4gICAgaXNOdW1iZXJDbG9zZVRvKGNsaWVudFksIGVsbVBvc2l0aW9uLnRvcCwgY3Vyc29yUHJlY2lzaW9uKSAmJlxuICAgIGlzV2l0aGluQm91bmRpbmdYKHsgY2xpZW50WCwgcmVjdDogZWxtUG9zaXRpb24gfSlcbiAgKSB7XG4gICAgZWRnZXMudG9wID0gdHJ1ZTtcbiAgfVxuXG4gIGlmIChcbiAgICBhbGxvd2VkRWRnZXMuYm90dG9tICYmXG4gICAgaXNOdW1iZXJDbG9zZVRvKGNsaWVudFksIGVsbVBvc2l0aW9uLmJvdHRvbSwgY3Vyc29yUHJlY2lzaW9uKSAmJlxuICAgIGlzV2l0aGluQm91bmRpbmdYKHsgY2xpZW50WCwgcmVjdDogZWxtUG9zaXRpb24gfSlcbiAgKSB7XG4gICAgZWRnZXMuYm90dG9tID0gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBlZGdlcztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZXNpemVDdXJzb3JzIHtcbiAgdG9wTGVmdDogc3RyaW5nO1xuICB0b3BSaWdodDogc3RyaW5nO1xuICBib3R0b21MZWZ0OiBzdHJpbmc7XG4gIGJvdHRvbVJpZ2h0OiBzdHJpbmc7XG4gIGxlZnRPclJpZ2h0OiBzdHJpbmc7XG4gIHRvcE9yQm90dG9tOiBzdHJpbmc7XG59XG5cbmNvbnN0IERFRkFVTFRfUkVTSVpFX0NVUlNPUlM6IFJlc2l6ZUN1cnNvcnMgPSBPYmplY3QuZnJlZXplKHtcbiAgdG9wTGVmdDogJ253LXJlc2l6ZScsXG4gIHRvcFJpZ2h0OiAnbmUtcmVzaXplJyxcbiAgYm90dG9tTGVmdDogJ3N3LXJlc2l6ZScsXG4gIGJvdHRvbVJpZ2h0OiAnc2UtcmVzaXplJyxcbiAgbGVmdE9yUmlnaHQ6ICdjb2wtcmVzaXplJyxcbiAgdG9wT3JCb3R0b206ICdyb3ctcmVzaXplJ1xufSk7XG5cbmZ1bmN0aW9uIGdldFJlc2l6ZUN1cnNvcihlZGdlczogRWRnZXMsIGN1cnNvcnM6IFJlc2l6ZUN1cnNvcnMpOiBzdHJpbmcge1xuICBpZiAoZWRnZXMubGVmdCAmJiBlZGdlcy50b3ApIHtcbiAgICByZXR1cm4gY3Vyc29ycy50b3BMZWZ0O1xuICB9IGVsc2UgaWYgKGVkZ2VzLnJpZ2h0ICYmIGVkZ2VzLnRvcCkge1xuICAgIHJldHVybiBjdXJzb3JzLnRvcFJpZ2h0O1xuICB9IGVsc2UgaWYgKGVkZ2VzLmxlZnQgJiYgZWRnZXMuYm90dG9tKSB7XG4gICAgcmV0dXJuIGN1cnNvcnMuYm90dG9tTGVmdDtcbiAgfSBlbHNlIGlmIChlZGdlcy5yaWdodCAmJiBlZGdlcy5ib3R0b20pIHtcbiAgICByZXR1cm4gY3Vyc29ycy5ib3R0b21SaWdodDtcbiAgfSBlbHNlIGlmIChlZGdlcy5sZWZ0IHx8IGVkZ2VzLnJpZ2h0KSB7XG4gICAgcmV0dXJuIGN1cnNvcnMubGVmdE9yUmlnaHQ7XG4gIH0gZWxzZSBpZiAoZWRnZXMudG9wIHx8IGVkZ2VzLmJvdHRvbSkge1xuICAgIHJldHVybiBjdXJzb3JzLnRvcE9yQm90dG9tO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnJztcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRFZGdlc0RpZmYoe1xuICBlZGdlcyxcbiAgaW5pdGlhbFJlY3RhbmdsZSxcbiAgbmV3UmVjdGFuZ2xlXG59OiB7XG4gIGVkZ2VzOiBFZGdlcztcbiAgaW5pdGlhbFJlY3RhbmdsZTogQm91bmRpbmdSZWN0YW5nbGU7XG4gIG5ld1JlY3RhbmdsZTogQm91bmRpbmdSZWN0YW5nbGU7XG59KTogRWRnZXMge1xuICBjb25zdCBlZGdlc0RpZmY6IEVkZ2VzID0ge307XG4gIE9iamVjdC5rZXlzKGVkZ2VzKS5mb3JFYWNoKGVkZ2UgPT4ge1xuICAgIGVkZ2VzRGlmZltlZGdlXSA9IChuZXdSZWN0YW5nbGVbZWRnZV0gfHwgMCkgLSAoaW5pdGlhbFJlY3RhbmdsZVtlZGdlXSB8fCAwKTtcbiAgfSk7XG4gIHJldHVybiBlZGdlc0RpZmY7XG59XG5cbmNvbnN0IFJFU0laRV9BQ1RJVkVfQ0xBU1M6IHN0cmluZyA9ICdyZXNpemUtYWN0aXZlJztcbmNvbnN0IFJFU0laRV9MRUZUX0hPVkVSX0NMQVNTOiBzdHJpbmcgPSAncmVzaXplLWxlZnQtaG92ZXInO1xuY29uc3QgUkVTSVpFX1JJR0hUX0hPVkVSX0NMQVNTOiBzdHJpbmcgPSAncmVzaXplLXJpZ2h0LWhvdmVyJztcbmNvbnN0IFJFU0laRV9UT1BfSE9WRVJfQ0xBU1M6IHN0cmluZyA9ICdyZXNpemUtdG9wLWhvdmVyJztcbmNvbnN0IFJFU0laRV9CT1RUT01fSE9WRVJfQ0xBU1M6IHN0cmluZyA9ICdyZXNpemUtYm90dG9tLWhvdmVyJztcbmNvbnN0IFJFU0laRV9HSE9TVF9FTEVNRU5UX0NMQVNTOiBzdHJpbmcgPSAncmVzaXplLWdob3N0LWVsZW1lbnQnO1xuXG5leHBvcnQgY29uc3QgTU9VU0VfTU9WRV9USFJPVFRMRV9NUzogbnVtYmVyID0gNTA7XG5cbi8qKlxuICogUGxhY2UgdGhpcyBvbiBhbiBlbGVtZW50IHRvIG1ha2UgaXQgcmVzaXphYmxlLiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGBodG1sXG4gKiA8ZGl2XG4gKiAgIG13bFJlc2l6YWJsZVxuICogICBbcmVzaXplRWRnZXNdPVwie2JvdHRvbTogdHJ1ZSwgcmlnaHQ6IHRydWUsIHRvcDogdHJ1ZSwgbGVmdDogdHJ1ZX1cIlxuICogICBbZW5hYmxlR2hvc3RSZXNpemVdPVwidHJ1ZVwiPlxuICogPC9kaXY+XG4gKiBgYGBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW213bFJlc2l6YWJsZV0nXG59KVxuZXhwb3J0IGNsYXNzIFJlc2l6YWJsZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIEEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCBiZWZvcmUgZWFjaCByZXNpemUgZXZlbnQuIFJldHVybiBgdHJ1ZWAgdG8gYWxsb3cgdGhlIHJlc2l6ZSBldmVudCB0byBwcm9wYWdhdGUgb3IgYGZhbHNlYCB0byBjYW5jZWwgaXRcbiAgICovXG4gIEBJbnB1dCgpXG4gIHZhbGlkYXRlUmVzaXplOiAocmVzaXplRXZlbnQ6IFJlc2l6ZUV2ZW50KSA9PiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgZWRnZXMgdGhhdCBhbiBlbGVtZW50IGNhbiBiZSByZXNpemVkIGZyb20uIFBhc3MgYW4gb2JqZWN0IGxpa2UgYHt0b3A6IHRydWUsIGJvdHRvbTogZmFsc2V9YC4gQnkgZGVmYXVsdCBubyBlZGdlcyBjYW4gYmUgcmVzaXplZC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIHJlc2l6ZUVkZ2VzOiBFZGdlcyA9IHt9O1xuXG4gIC8qKlxuICAgKiBTZXQgdG8gYHRydWVgIHRvIGVuYWJsZSBhIHRlbXBvcmFyeSByZXNpemluZyBlZmZlY3Qgb2YgdGhlIGVsZW1lbnQgaW4gYmV0d2VlbiB0aGUgYHJlc2l6ZVN0YXJ0YCBhbmQgYHJlc2l6ZUVuZGAgZXZlbnRzLlxuICAgKi9cbiAgQElucHV0KClcbiAgZW5hYmxlR2hvc3RSZXNpemU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogQSBzbmFwIGdyaWQgdGhhdCByZXNpemUgZXZlbnRzIHdpbGwgYmUgbG9ja2VkIHRvLlxuICAgKlxuICAgKiBlLmcuIHRvIG9ubHkgYWxsb3cgdGhlIGVsZW1lbnQgdG8gYmUgcmVzaXplZCBldmVyeSAxMHB4IHNldCBpdCB0byBge2xlZnQ6IDEwLCByaWdodDogMTB9YFxuICAgKi9cbiAgQElucHV0KClcbiAgcmVzaXplU25hcEdyaWQ6IEVkZ2VzID0ge307XG5cbiAgLyoqXG4gICAqIFRoZSBtb3VzZSBjdXJzb3JzIHRoYXQgd2lsbCBiZSBzZXQgb24gdGhlIHJlc2l6ZSBlZGdlc1xuICAgKi9cbiAgQElucHV0KClcbiAgcmVzaXplQ3Vyc29yczogUmVzaXplQ3Vyc29ycyA9IERFRkFVTFRfUkVTSVpFX0NVUlNPUlM7XG5cbiAgLyoqXG4gICAqIE1vdXNlIG92ZXIgdGhpY2tuZXNzIHRvIGFjdGl2ZSBjdXJzb3IuXG4gICAqL1xuICBASW5wdXQoKVxuICByZXNpemVDdXJzb3JQcmVjaXNpb246IG51bWJlciA9IDM7XG5cbiAgLyoqXG4gICAqIERlZmluZSB0aGUgcG9zaXRpb25pbmcgb2YgdGhlIGdob3N0IGVsZW1lbnQgKGNhbiBiZSBmaXhlZCBvciBhYnNvbHV0ZSlcbiAgICovXG4gIEBJbnB1dCgpXG4gIGdob3N0RWxlbWVudFBvc2l0aW9uaW5nOiAnZml4ZWQnIHwgJ2Fic29sdXRlJyA9ICdmaXhlZCc7XG5cbiAgLyoqXG4gICAqIEFsbG93IGVsZW1lbnRzIHRvIGJlIHJlc2l6ZWQgdG8gbmVnYXRpdmUgZGltZW5zaW9uc1xuICAgKi9cbiAgQElucHV0KClcbiAgYWxsb3dOZWdhdGl2ZVJlc2l6ZXM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIG1vdXNlIGlzIHByZXNzZWQgYW5kIGEgcmVzaXplIGV2ZW50IGlzIGFib3V0IHRvIGJlZ2luLiBgJGV2ZW50YCBpcyBhIGBSZXNpemVFdmVudGAgb2JqZWN0LlxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHJlc2l6ZVN0YXJ0ID0gbmV3IEV2ZW50RW1pdHRlcjxSZXNpemVFdmVudD4oKTtcblxuICAvKipcbiAgICogQ2FsbGVkIGFzIHRoZSBtb3VzZSBpcyBkcmFnZ2VkIGFmdGVyIGEgcmVzaXplIGV2ZW50IGhhcyBiZWd1bi4gYCRldmVudGAgaXMgYSBgUmVzaXplRXZlbnRgIG9iamVjdC5cbiAgICovXG4gIEBPdXRwdXQoKVxuICByZXNpemluZyA9IG5ldyBFdmVudEVtaXR0ZXI8UmVzaXplRXZlbnQ+KCk7XG5cbiAgLyoqXG4gICAqIENhbGxlZCBhZnRlciB0aGUgbW91c2UgaXMgcmVsZWFzZWQgYWZ0ZXIgYSByZXNpemUgZXZlbnQuIGAkZXZlbnRgIGlzIGEgYFJlc2l6ZUV2ZW50YCBvYmplY3QuXG4gICAqL1xuICBAT3V0cHV0KClcbiAgcmVzaXplRW5kID0gbmV3IEV2ZW50RW1pdHRlcjxSZXNpemVFdmVudD4oKTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgcHVibGljIG1vdXNldXAgPSBuZXcgU3ViamVjdDx7XG4gICAgY2xpZW50WDogbnVtYmVyO1xuICAgIGNsaWVudFk6IG51bWJlcjtcbiAgICBlZGdlcz86IEVkZ2VzO1xuICB9PigpO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBwdWJsaWMgbW91c2Vkb3duID0gbmV3IFN1YmplY3Q8e1xuICAgIGNsaWVudFg6IG51bWJlcjtcbiAgICBjbGllbnRZOiBudW1iZXI7XG4gICAgZWRnZXM/OiBFZGdlcztcbiAgfT4oKTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgcHVibGljIG1vdXNlbW92ZSA9IG5ldyBTdWJqZWN0PHtcbiAgICBjbGllbnRYOiBudW1iZXI7XG4gICAgY2xpZW50WTogbnVtYmVyO1xuICAgIGVkZ2VzPzogRWRnZXM7XG4gICAgZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50O1xuICB9PigpO1xuXG4gIHByaXZhdGUgcG9pbnRlckV2ZW50TGlzdGVuZXJzOiBQb2ludGVyRXZlbnRMaXN0ZW5lcnM7XG5cbiAgcHJpdmF0ZSBkZXN0cm95JCA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwdWJsaWMgZWxtOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgem9uZTogTmdab25lXG4gICkge1xuICAgIHRoaXMucG9pbnRlckV2ZW50TGlzdGVuZXJzID0gUG9pbnRlckV2ZW50TGlzdGVuZXJzLmdldEluc3RhbmNlKFxuICAgICAgcmVuZGVyZXIsXG4gICAgICB6b25lXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAvLyBUT0RPIC0gdXNlIHNvbWUgZmFuY3kgT2JzZXJ2YWJsZS5tZXJnZSdzIGZvciB0aGlzXG4gICAgdGhpcy5wb2ludGVyRXZlbnRMaXN0ZW5lcnMucG9pbnRlckRvd25cbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSlcbiAgICAgIC5zdWJzY3JpYmUoKHsgY2xpZW50WCwgY2xpZW50WSB9KSA9PiB7XG4gICAgICAgIHRoaXMubW91c2Vkb3duLm5leHQoeyBjbGllbnRYLCBjbGllbnRZIH0pO1xuICAgICAgfSk7XG5cbiAgICB0aGlzLnBvaW50ZXJFdmVudExpc3RlbmVycy5wb2ludGVyTW92ZVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgLnN1YnNjcmliZSgoeyBjbGllbnRYLCBjbGllbnRZLCBldmVudCB9KSA9PiB7XG4gICAgICAgIHRoaXMubW91c2Vtb3ZlLm5leHQoeyBjbGllbnRYLCBjbGllbnRZLCBldmVudCB9KTtcbiAgICAgIH0pO1xuXG4gICAgdGhpcy5wb2ludGVyRXZlbnRMaXN0ZW5lcnMucG9pbnRlclVwXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXG4gICAgICAuc3Vic2NyaWJlKCh7IGNsaWVudFgsIGNsaWVudFkgfSkgPT4ge1xuICAgICAgICB0aGlzLm1vdXNldXAubmV4dCh7IGNsaWVudFgsIGNsaWVudFkgfSk7XG4gICAgICB9KTtcblxuICAgIGxldCBjdXJyZW50UmVzaXplOiB7XG4gICAgICBlZGdlczogRWRnZXM7XG4gICAgICBzdGFydGluZ1JlY3Q6IEJvdW5kaW5nUmVjdGFuZ2xlO1xuICAgICAgY3VycmVudFJlY3Q6IEJvdW5kaW5nUmVjdGFuZ2xlO1xuICAgICAgY2xvbmVkTm9kZT86IEhUTUxFbGVtZW50O1xuICAgIH0gfCBudWxsO1xuXG4gICAgY29uc3QgcmVtb3ZlR2hvc3RFbGVtZW50ID0gKCkgPT4ge1xuICAgICAgaWYgKGN1cnJlbnRSZXNpemUgJiYgY3VycmVudFJlc2l6ZS5jbG9uZWROb2RlKSB7XG4gICAgICAgIHRoaXMuZWxtLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChcbiAgICAgICAgICBjdXJyZW50UmVzaXplLmNsb25lZE5vZGVcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsbS5uYXRpdmVFbGVtZW50LCAndmlzaWJpbGl0eScsICdpbmhlcml0Jyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IG1vdXNlTW92ZTogT2JzZXJ2YWJsZTxhbnk+ID0gdGhpcy5tb3VzZW1vdmUucGlwZShzaGFyZSgpKTtcblxuICAgIG1vdXNlTW92ZS5waXBlKGZpbHRlcigoKSA9PiAhIWN1cnJlbnRSZXNpemUpKS5zdWJzY3JpYmUoKHsgZXZlbnQgfSkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9KTtcblxuICAgIG1vdXNlTW92ZVxuICAgICAgLnBpcGUoYXVkaXRUaW1lKE1PVVNFX01PVkVfVEhST1RUTEVfTVMpKVxuICAgICAgLnN1YnNjcmliZSgoeyBjbGllbnRYLCBjbGllbnRZIH0pID0+IHtcbiAgICAgICAgY29uc3QgcmVzaXplRWRnZXM6IEVkZ2VzID0gZ2V0UmVzaXplRWRnZXMoe1xuICAgICAgICAgIGNsaWVudFgsXG4gICAgICAgICAgY2xpZW50WSxcbiAgICAgICAgICBlbG06IHRoaXMuZWxtLFxuICAgICAgICAgIGFsbG93ZWRFZGdlczogdGhpcy5yZXNpemVFZGdlcyxcbiAgICAgICAgICBjdXJzb3JQcmVjaXNpb246IHRoaXMucmVzaXplQ3Vyc29yUHJlY2lzaW9uXG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCByZXNpemVDdXJzb3JzOiBSZXNpemVDdXJzb3JzID0gT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICB7fSxcbiAgICAgICAgICBERUZBVUxUX1JFU0laRV9DVVJTT1JTLFxuICAgICAgICAgIHRoaXMucmVzaXplQ3Vyc29yc1xuICAgICAgICApO1xuICAgICAgICBpZiAoY3VycmVudFJlc2l6ZSkge1xuICAgICAgICAgIGNvbnN0IGN1cnNvcjogc3RyaW5nID0gZ2V0UmVzaXplQ3Vyc29yKFxuICAgICAgICAgICAgY3VycmVudFJlc2l6ZS5lZGdlcyxcbiAgICAgICAgICAgIHJlc2l6ZUN1cnNvcnNcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoZG9jdW1lbnQuYm9keSwgJ2N1cnNvcicsIGN1cnNvcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgY3Vyc29yOiBzdHJpbmcgPSBnZXRSZXNpemVDdXJzb3IocmVzaXplRWRnZXMsIHJlc2l6ZUN1cnNvcnMpO1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbG0ubmF0aXZlRWxlbWVudCwgJ2N1cnNvcicsIGN1cnNvcik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRFbGVtZW50Q2xhc3ModGhpcy5lbG0sIFJFU0laRV9BQ1RJVkVfQ0xBU1MsICEhY3VycmVudFJlc2l6ZSk7XG4gICAgICAgIHRoaXMuc2V0RWxlbWVudENsYXNzKFxuICAgICAgICAgIHRoaXMuZWxtLFxuICAgICAgICAgIFJFU0laRV9MRUZUX0hPVkVSX0NMQVNTLFxuICAgICAgICAgIHJlc2l6ZUVkZ2VzLmxlZnQgPT09IHRydWVcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50Q2xhc3MoXG4gICAgICAgICAgdGhpcy5lbG0sXG4gICAgICAgICAgUkVTSVpFX1JJR0hUX0hPVkVSX0NMQVNTLFxuICAgICAgICAgIHJlc2l6ZUVkZ2VzLnJpZ2h0ID09PSB0cnVlXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc2V0RWxlbWVudENsYXNzKFxuICAgICAgICAgIHRoaXMuZWxtLFxuICAgICAgICAgIFJFU0laRV9UT1BfSE9WRVJfQ0xBU1MsXG4gICAgICAgICAgcmVzaXplRWRnZXMudG9wID09PSB0cnVlXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc2V0RWxlbWVudENsYXNzKFxuICAgICAgICAgIHRoaXMuZWxtLFxuICAgICAgICAgIFJFU0laRV9CT1RUT01fSE9WRVJfQ0xBU1MsXG4gICAgICAgICAgcmVzaXplRWRnZXMuYm90dG9tID09PSB0cnVlXG4gICAgICAgICk7XG4gICAgICB9KTtcblxuICAgIGNvbnN0IG1vdXNlZHJhZzogT2JzZXJ2YWJsZTxhbnk+ID0gdGhpcy5tb3VzZWRvd25cbiAgICAgIC5waXBlKFxuICAgICAgICBtZXJnZU1hcChzdGFydENvb3JkcyA9PiB7XG4gICAgICAgICAgZnVuY3Rpb24gZ2V0RGlmZihtb3ZlQ29vcmRzOiB7IGNsaWVudFg6IG51bWJlcjsgY2xpZW50WTogbnVtYmVyIH0pIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIGNsaWVudFg6IG1vdmVDb29yZHMuY2xpZW50WCAtIHN0YXJ0Q29vcmRzLmNsaWVudFgsXG4gICAgICAgICAgICAgIGNsaWVudFk6IG1vdmVDb29yZHMuY2xpZW50WSAtIHN0YXJ0Q29vcmRzLmNsaWVudFlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgZ2V0U25hcEdyaWQgPSAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzbmFwR3JpZDogQ29vcmRpbmF0ZSA9IHsgeDogMSwgeTogMSB9O1xuXG4gICAgICAgICAgICBpZiAoY3VycmVudFJlc2l6ZSkge1xuICAgICAgICAgICAgICBpZiAodGhpcy5yZXNpemVTbmFwR3JpZC5sZWZ0ICYmIGN1cnJlbnRSZXNpemUuZWRnZXMubGVmdCkge1xuICAgICAgICAgICAgICAgIHNuYXBHcmlkLnggPSArdGhpcy5yZXNpemVTbmFwR3JpZC5sZWZ0O1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgICAgIHRoaXMucmVzaXplU25hcEdyaWQucmlnaHQgJiZcbiAgICAgICAgICAgICAgICBjdXJyZW50UmVzaXplLmVkZ2VzLnJpZ2h0XG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHNuYXBHcmlkLnggPSArdGhpcy5yZXNpemVTbmFwR3JpZC5yaWdodDtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmICh0aGlzLnJlc2l6ZVNuYXBHcmlkLnRvcCAmJiBjdXJyZW50UmVzaXplLmVkZ2VzLnRvcCkge1xuICAgICAgICAgICAgICAgIHNuYXBHcmlkLnkgPSArdGhpcy5yZXNpemVTbmFwR3JpZC50b3A7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNpemVTbmFwR3JpZC5ib3R0b20gJiZcbiAgICAgICAgICAgICAgICBjdXJyZW50UmVzaXplLmVkZ2VzLmJvdHRvbVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBzbmFwR3JpZC55ID0gK3RoaXMucmVzaXplU25hcEdyaWQuYm90dG9tO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBzbmFwR3JpZDtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgZnVuY3Rpb24gZ2V0R3JpZChcbiAgICAgICAgICAgIGNvb3JkczogeyBjbGllbnRYOiBudW1iZXI7IGNsaWVudFk6IG51bWJlciB9LFxuICAgICAgICAgICAgc25hcEdyaWQ6IENvb3JkaW5hdGVcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHg6IE1hdGguY2VpbChjb29yZHMuY2xpZW50WCAvIHNuYXBHcmlkLngpLFxuICAgICAgICAgICAgICB5OiBNYXRoLmNlaWwoY29vcmRzLmNsaWVudFkgLyBzbmFwR3JpZC55KVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gbWVyZ2UoXG4gICAgICAgICAgICBtb3VzZU1vdmUucGlwZSh0YWtlKDEpKS5waXBlKG1hcChjb29yZHMgPT4gWywgY29vcmRzXSkpLFxuICAgICAgICAgICAgbW91c2VNb3ZlLnBpcGUocGFpcndpc2UoKSlcbiAgICAgICAgICApXG4gICAgICAgICAgICAucGlwZShcbiAgICAgICAgICAgICAgbWFwKChbcHJldmlvdXNDb29yZHMsIG5ld0Nvb3Jkc10pID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgICAgcHJldmlvdXNDb29yZHMgPyBnZXREaWZmKHByZXZpb3VzQ29vcmRzKSA6IHByZXZpb3VzQ29vcmRzLFxuICAgICAgICAgICAgICAgICAgZ2V0RGlmZihuZXdDb29yZHMpXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICBmaWx0ZXIoKFtwcmV2aW91c0Nvb3JkcywgbmV3Q29vcmRzXSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICghcHJldmlvdXNDb29yZHMpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IHNuYXBHcmlkOiBDb29yZGluYXRlID0gZ2V0U25hcEdyaWQoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmV2aW91c0dyaWQ6IENvb3JkaW5hdGUgPSBnZXRHcmlkKFxuICAgICAgICAgICAgICAgICAgcHJldmlvdXNDb29yZHMsXG4gICAgICAgICAgICAgICAgICBzbmFwR3JpZFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3R3JpZDogQ29vcmRpbmF0ZSA9IGdldEdyaWQobmV3Q29vcmRzLCBzbmFwR3JpZCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgcHJldmlvdXNHcmlkLnggIT09IG5ld0dyaWQueCB8fCBwcmV2aW91c0dyaWQueSAhPT0gbmV3R3JpZC55XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICBtYXAoKFssIG5ld0Nvb3Jkc10pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBzbmFwR3JpZDogQ29vcmRpbmF0ZSA9IGdldFNuYXBHcmlkKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgIGNsaWVudFg6XG4gICAgICAgICAgICAgICAgICAgIE1hdGgucm91bmQobmV3Q29vcmRzLmNsaWVudFggLyBzbmFwR3JpZC54KSAqIHNuYXBHcmlkLngsXG4gICAgICAgICAgICAgICAgICBjbGllbnRZOlxuICAgICAgICAgICAgICAgICAgICBNYXRoLnJvdW5kKG5ld0Nvb3Jkcy5jbGllbnRZIC8gc25hcEdyaWQueSkgKiBzbmFwR3JpZC55XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbChtZXJnZSh0aGlzLm1vdXNldXAsIHRoaXMubW91c2Vkb3duKSkpO1xuICAgICAgICB9KVxuICAgICAgKVxuICAgICAgLnBpcGUoZmlsdGVyKCgpID0+ICEhY3VycmVudFJlc2l6ZSkpO1xuXG4gICAgbW91c2VkcmFnXG4gICAgICAucGlwZShcbiAgICAgICAgbWFwKCh7IGNsaWVudFgsIGNsaWVudFkgfSkgPT4ge1xuICAgICAgICAgIHJldHVybiBnZXROZXdCb3VuZGluZ1JlY3RhbmdsZShcbiAgICAgICAgICAgIGN1cnJlbnRSZXNpemUhLnN0YXJ0aW5nUmVjdCxcbiAgICAgICAgICAgIGN1cnJlbnRSZXNpemUhLmVkZ2VzLFxuICAgICAgICAgICAgY2xpZW50WCxcbiAgICAgICAgICAgIGNsaWVudFlcbiAgICAgICAgICApO1xuICAgICAgICB9KVxuICAgICAgKVxuICAgICAgLnBpcGUoXG4gICAgICAgIGZpbHRlcigobmV3Qm91bmRpbmdSZWN0OiBCb3VuZGluZ1JlY3RhbmdsZSkgPT4ge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0aGlzLmFsbG93TmVnYXRpdmVSZXNpemVzIHx8XG4gICAgICAgICAgICAhIShcbiAgICAgICAgICAgICAgbmV3Qm91bmRpbmdSZWN0LmhlaWdodCAmJlxuICAgICAgICAgICAgICBuZXdCb3VuZGluZ1JlY3Qud2lkdGggJiZcbiAgICAgICAgICAgICAgbmV3Qm91bmRpbmdSZWN0LmhlaWdodCA+IDAgJiZcbiAgICAgICAgICAgICAgbmV3Qm91bmRpbmdSZWN0LndpZHRoID4gMFxuICAgICAgICAgICAgKVxuICAgICAgICAgICk7XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgICAucGlwZShcbiAgICAgICAgZmlsdGVyKChuZXdCb3VuZGluZ1JlY3Q6IEJvdW5kaW5nUmVjdGFuZ2xlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMudmFsaWRhdGVSZXNpemVcbiAgICAgICAgICAgID8gdGhpcy52YWxpZGF0ZVJlc2l6ZSh7XG4gICAgICAgICAgICAgICAgcmVjdGFuZ2xlOiBuZXdCb3VuZGluZ1JlY3QsXG4gICAgICAgICAgICAgICAgZWRnZXM6IGdldEVkZ2VzRGlmZih7XG4gICAgICAgICAgICAgICAgICBlZGdlczogY3VycmVudFJlc2l6ZSEuZWRnZXMsXG4gICAgICAgICAgICAgICAgICBpbml0aWFsUmVjdGFuZ2xlOiBjdXJyZW50UmVzaXplIS5zdGFydGluZ1JlY3QsXG4gICAgICAgICAgICAgICAgICBuZXdSZWN0YW5nbGU6IG5ld0JvdW5kaW5nUmVjdFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICA6IHRydWU7XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKChuZXdCb3VuZGluZ1JlY3Q6IEJvdW5kaW5nUmVjdGFuZ2xlKSA9PiB7XG4gICAgICAgIGlmIChjdXJyZW50UmVzaXplICYmIGN1cnJlbnRSZXNpemUuY2xvbmVkTm9kZSkge1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgICAgICBjdXJyZW50UmVzaXplLmNsb25lZE5vZGUsXG4gICAgICAgICAgICAnaGVpZ2h0JyxcbiAgICAgICAgICAgIGAke25ld0JvdW5kaW5nUmVjdC5oZWlnaHR9cHhgXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKFxuICAgICAgICAgICAgY3VycmVudFJlc2l6ZS5jbG9uZWROb2RlLFxuICAgICAgICAgICAgJ3dpZHRoJyxcbiAgICAgICAgICAgIGAke25ld0JvdW5kaW5nUmVjdC53aWR0aH1weGBcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgICAgICBjdXJyZW50UmVzaXplLmNsb25lZE5vZGUsXG4gICAgICAgICAgICAndG9wJyxcbiAgICAgICAgICAgIGAke25ld0JvdW5kaW5nUmVjdC50b3B9cHhgXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKFxuICAgICAgICAgICAgY3VycmVudFJlc2l6ZS5jbG9uZWROb2RlLFxuICAgICAgICAgICAgJ2xlZnQnLFxuICAgICAgICAgICAgYCR7bmV3Qm91bmRpbmdSZWN0LmxlZnR9cHhgXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMucmVzaXppbmcuZW1pdCh7XG4gICAgICAgICAgICBlZGdlczogZ2V0RWRnZXNEaWZmKHtcbiAgICAgICAgICAgICAgZWRnZXM6IGN1cnJlbnRSZXNpemUhLmVkZ2VzLFxuICAgICAgICAgICAgICBpbml0aWFsUmVjdGFuZ2xlOiBjdXJyZW50UmVzaXplIS5zdGFydGluZ1JlY3QsXG4gICAgICAgICAgICAgIG5ld1JlY3RhbmdsZTogbmV3Qm91bmRpbmdSZWN0XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHJlY3RhbmdsZTogbmV3Qm91bmRpbmdSZWN0XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGN1cnJlbnRSZXNpemUhLmN1cnJlbnRSZWN0ID0gbmV3Qm91bmRpbmdSZWN0O1xuICAgICAgfSk7XG5cbiAgICB0aGlzLm1vdXNlZG93blxuICAgICAgLnBpcGUoXG4gICAgICAgIG1hcCgoeyBjbGllbnRYLCBjbGllbnRZLCBlZGdlcyB9KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIGVkZ2VzIHx8XG4gICAgICAgICAgICBnZXRSZXNpemVFZGdlcyh7XG4gICAgICAgICAgICAgIGNsaWVudFgsXG4gICAgICAgICAgICAgIGNsaWVudFksXG4gICAgICAgICAgICAgIGVsbTogdGhpcy5lbG0sXG4gICAgICAgICAgICAgIGFsbG93ZWRFZGdlczogdGhpcy5yZXNpemVFZGdlcyxcbiAgICAgICAgICAgICAgY3Vyc29yUHJlY2lzaW9uOiB0aGlzLnJlc2l6ZUN1cnNvclByZWNpc2lvblxuICAgICAgICAgICAgfSlcbiAgICAgICAgICApO1xuICAgICAgICB9KVxuICAgICAgKVxuICAgICAgLnBpcGUoXG4gICAgICAgIGZpbHRlcigoZWRnZXM6IEVkZ2VzKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGVkZ2VzKS5sZW5ndGggPiAwO1xuICAgICAgICB9KVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSgoZWRnZXM6IEVkZ2VzKSA9PiB7XG4gICAgICAgIGlmIChjdXJyZW50UmVzaXplKSB7XG4gICAgICAgICAgcmVtb3ZlR2hvc3RFbGVtZW50KCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3RhcnRpbmdSZWN0OiBCb3VuZGluZ1JlY3RhbmdsZSA9IGdldEVsZW1lbnRSZWN0KFxuICAgICAgICAgIHRoaXMuZWxtLFxuICAgICAgICAgIHRoaXMuZ2hvc3RFbGVtZW50UG9zaXRpb25pbmdcbiAgICAgICAgKTtcbiAgICAgICAgY3VycmVudFJlc2l6ZSA9IHtcbiAgICAgICAgICBlZGdlcyxcbiAgICAgICAgICBzdGFydGluZ1JlY3QsXG4gICAgICAgICAgY3VycmVudFJlY3Q6IHN0YXJ0aW5nUmVjdFxuICAgICAgICB9O1xuICAgICAgICBpZiAodGhpcy5lbmFibGVHaG9zdFJlc2l6ZSkge1xuICAgICAgICAgIGN1cnJlbnRSZXNpemUuY2xvbmVkTm9kZSA9IHRoaXMuZWxtLm5hdGl2ZUVsZW1lbnQuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgIGNvbnN0IHJlc2l6ZUN1cnNvcnM6IFJlc2l6ZUN1cnNvcnMgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAge30sXG4gICAgICAgICAgICBERUZBVUxUX1JFU0laRV9DVVJTT1JTLFxuICAgICAgICAgICAgdGhpcy5yZXNpemVDdXJzb3JzXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzLmVsbS5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoXG4gICAgICAgICAgICBjdXJyZW50UmVzaXplLmNsb25lZE5vZGVcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgICAgICB0aGlzLmVsbS5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICAgJ3Zpc2liaWxpdHknLFxuICAgICAgICAgICAgJ2hpZGRlbidcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgICAgICBjdXJyZW50UmVzaXplLmNsb25lZE5vZGUsXG4gICAgICAgICAgICAncG9zaXRpb24nLFxuICAgICAgICAgICAgdGhpcy5naG9zdEVsZW1lbnRQb3NpdGlvbmluZ1xuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShcbiAgICAgICAgICAgIGN1cnJlbnRSZXNpemUuY2xvbmVkTm9kZSxcbiAgICAgICAgICAgICdsZWZ0JyxcbiAgICAgICAgICAgIGAke2N1cnJlbnRSZXNpemUuc3RhcnRpbmdSZWN0LmxlZnR9cHhgXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKFxuICAgICAgICAgICAgY3VycmVudFJlc2l6ZS5jbG9uZWROb2RlLFxuICAgICAgICAgICAgJ3RvcCcsXG4gICAgICAgICAgICBgJHtjdXJyZW50UmVzaXplLnN0YXJ0aW5nUmVjdC50b3B9cHhgXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKFxuICAgICAgICAgICAgY3VycmVudFJlc2l6ZS5jbG9uZWROb2RlLFxuICAgICAgICAgICAgJ2hlaWdodCcsXG4gICAgICAgICAgICBgJHtjdXJyZW50UmVzaXplLnN0YXJ0aW5nUmVjdC5oZWlnaHR9cHhgXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKFxuICAgICAgICAgICAgY3VycmVudFJlc2l6ZS5jbG9uZWROb2RlLFxuICAgICAgICAgICAgJ3dpZHRoJyxcbiAgICAgICAgICAgIGAke2N1cnJlbnRSZXNpemUuc3RhcnRpbmdSZWN0LndpZHRofXB4YFxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShcbiAgICAgICAgICAgIGN1cnJlbnRSZXNpemUuY2xvbmVkTm9kZSxcbiAgICAgICAgICAgICdjdXJzb3InLFxuICAgICAgICAgICAgZ2V0UmVzaXplQ3Vyc29yKGN1cnJlbnRSZXNpemUuZWRnZXMsIHJlc2l6ZUN1cnNvcnMpXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKFxuICAgICAgICAgICAgY3VycmVudFJlc2l6ZS5jbG9uZWROb2RlLFxuICAgICAgICAgICAgUkVTSVpFX0dIT1NUX0VMRU1FTlRfQ0xBU1NcbiAgICAgICAgICApO1xuICAgICAgICAgIGN1cnJlbnRSZXNpemUuY2xvbmVkTm9kZSEuc2Nyb2xsVG9wID0gY3VycmVudFJlc2l6ZS5zdGFydGluZ1JlY3RcbiAgICAgICAgICAgIC5zY3JvbGxUb3AgYXMgbnVtYmVyO1xuICAgICAgICAgIGN1cnJlbnRSZXNpemUuY2xvbmVkTm9kZSEuc2Nyb2xsTGVmdCA9IGN1cnJlbnRSZXNpemUuc3RhcnRpbmdSZWN0XG4gICAgICAgICAgICAuc2Nyb2xsTGVmdCBhcyBudW1iZXI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZXNpemVTdGFydC5lbWl0KHtcbiAgICAgICAgICAgIGVkZ2VzOiBnZXRFZGdlc0RpZmYoe1xuICAgICAgICAgICAgICBlZGdlcyxcbiAgICAgICAgICAgICAgaW5pdGlhbFJlY3RhbmdsZTogc3RhcnRpbmdSZWN0LFxuICAgICAgICAgICAgICBuZXdSZWN0YW5nbGU6IHN0YXJ0aW5nUmVjdFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICByZWN0YW5nbGU6IGdldE5ld0JvdW5kaW5nUmVjdGFuZ2xlKHN0YXJ0aW5nUmVjdCwge30sIDAsIDApXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICB0aGlzLm1vdXNldXAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmIChjdXJyZW50UmVzaXplKSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5lbG0ubmF0aXZlRWxlbWVudCwgUkVTSVpFX0FDVElWRV9DTEFTUyk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoZG9jdW1lbnQuYm9keSwgJ2N1cnNvcicsICcnKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsbS5uYXRpdmVFbGVtZW50LCAnY3Vyc29yJywgJycpO1xuICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnJlc2l6ZUVuZC5lbWl0KHtcbiAgICAgICAgICAgIGVkZ2VzOiBnZXRFZGdlc0RpZmYoe1xuICAgICAgICAgICAgICBlZGdlczogY3VycmVudFJlc2l6ZSEuZWRnZXMsXG4gICAgICAgICAgICAgIGluaXRpYWxSZWN0YW5nbGU6IGN1cnJlbnRSZXNpemUhLnN0YXJ0aW5nUmVjdCxcbiAgICAgICAgICAgICAgbmV3UmVjdGFuZ2xlOiBjdXJyZW50UmVzaXplIS5jdXJyZW50UmVjdFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICByZWN0YW5nbGU6IGN1cnJlbnRSZXNpemUhLmN1cnJlbnRSZWN0XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZW1vdmVHaG9zdEVsZW1lbnQoKTtcbiAgICAgICAgY3VycmVudFJlc2l6ZSA9IG51bGw7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5tb3VzZWRvd24uY29tcGxldGUoKTtcbiAgICB0aGlzLm1vdXNldXAuY29tcGxldGUoKTtcbiAgICB0aGlzLm1vdXNlbW92ZS5jb21wbGV0ZSgpO1xuICAgIHRoaXMuZGVzdHJveSQubmV4dCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRFbGVtZW50Q2xhc3MoZWxtOiBFbGVtZW50UmVmLCBuYW1lOiBzdHJpbmcsIGFkZDogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmIChhZGQpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3MoZWxtLm5hdGl2ZUVsZW1lbnQsIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKGVsbS5uYXRpdmVFbGVtZW50LCBuYW1lKTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgUG9pbnRlckV2ZW50TGlzdGVuZXJzIHtcbiAgcHVibGljIHBvaW50ZXJEb3duOiBPYnNlcnZhYmxlPFBvaW50ZXJFdmVudENvb3JkaW5hdGU+O1xuXG4gIHB1YmxpYyBwb2ludGVyTW92ZTogT2JzZXJ2YWJsZTxQb2ludGVyRXZlbnRDb29yZGluYXRlPjtcblxuICBwdWJsaWMgcG9pbnRlclVwOiBPYnNlcnZhYmxlPFBvaW50ZXJFdmVudENvb3JkaW5hdGU+O1xuXG4gIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBQb2ludGVyRXZlbnRMaXN0ZW5lcnM7IC8vIHRzbGludDpkaXNhYmxlLWxpbmVcblxuICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKFxuICAgIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgem9uZTogTmdab25lXG4gICk6IFBvaW50ZXJFdmVudExpc3RlbmVycyB7XG4gICAgaWYgKCFQb2ludGVyRXZlbnRMaXN0ZW5lcnMuaW5zdGFuY2UpIHtcbiAgICAgIFBvaW50ZXJFdmVudExpc3RlbmVycy5pbnN0YW5jZSA9IG5ldyBQb2ludGVyRXZlbnRMaXN0ZW5lcnMoXG4gICAgICAgIHJlbmRlcmVyLFxuICAgICAgICB6b25lXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gUG9pbnRlckV2ZW50TGlzdGVuZXJzLmluc3RhbmNlO1xuICB9XG5cbiAgY29uc3RydWN0b3IocmVuZGVyZXI6IFJlbmRlcmVyMiwgem9uZTogTmdab25lKSB7XG4gICAgdGhpcy5wb2ludGVyRG93biA9IG5ldyBPYnNlcnZhYmxlKFxuICAgICAgKG9ic2VydmVyOiBPYnNlcnZlcjxQb2ludGVyRXZlbnRDb29yZGluYXRlPikgPT4ge1xuICAgICAgICBsZXQgdW5zdWJzY3JpYmVNb3VzZURvd246ICgpID0+IHZvaWQ7XG4gICAgICAgIGxldCB1bnN1YnNjcmliZVRvdWNoU3RhcnQ6ICgpID0+IHZvaWQ7XG5cbiAgICAgICAgem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgdW5zdWJzY3JpYmVNb3VzZURvd24gPSByZW5kZXJlci5saXN0ZW4oXG4gICAgICAgICAgICAnZG9jdW1lbnQnLFxuICAgICAgICAgICAgJ21vdXNlZG93bicsXG4gICAgICAgICAgICAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh7XG4gICAgICAgICAgICAgICAgY2xpZW50WDogZXZlbnQuY2xpZW50WCxcbiAgICAgICAgICAgICAgICBjbGllbnRZOiBldmVudC5jbGllbnRZLFxuICAgICAgICAgICAgICAgIGV2ZW50XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICB1bnN1YnNjcmliZVRvdWNoU3RhcnQgPSByZW5kZXJlci5saXN0ZW4oXG4gICAgICAgICAgICAnZG9jdW1lbnQnLFxuICAgICAgICAgICAgJ3RvdWNoc3RhcnQnLFxuICAgICAgICAgICAgKGV2ZW50OiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIG9ic2VydmVyLm5leHQoe1xuICAgICAgICAgICAgICAgIGNsaWVudFg6IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WCxcbiAgICAgICAgICAgICAgICBjbGllbnRZOiBldmVudC50b3VjaGVzWzBdLmNsaWVudFksXG4gICAgICAgICAgICAgICAgZXZlbnRcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICB1bnN1YnNjcmliZU1vdXNlRG93bigpO1xuICAgICAgICAgIHVuc3Vic2NyaWJlVG91Y2hTdGFydCgpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICkucGlwZShzaGFyZSgpKTtcblxuICAgIHRoaXMucG9pbnRlck1vdmUgPSBuZXcgT2JzZXJ2YWJsZShcbiAgICAgIChvYnNlcnZlcjogT2JzZXJ2ZXI8UG9pbnRlckV2ZW50Q29vcmRpbmF0ZT4pID0+IHtcbiAgICAgICAgbGV0IHVuc3Vic2NyaWJlTW91c2VNb3ZlOiAoKSA9PiB2b2lkO1xuICAgICAgICBsZXQgdW5zdWJzY3JpYmVUb3VjaE1vdmU6ICgpID0+IHZvaWQ7XG5cbiAgICAgICAgem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgdW5zdWJzY3JpYmVNb3VzZU1vdmUgPSByZW5kZXJlci5saXN0ZW4oXG4gICAgICAgICAgICAnZG9jdW1lbnQnLFxuICAgICAgICAgICAgJ21vdXNlbW92ZScsXG4gICAgICAgICAgICAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh7XG4gICAgICAgICAgICAgICAgY2xpZW50WDogZXZlbnQuY2xpZW50WCxcbiAgICAgICAgICAgICAgICBjbGllbnRZOiBldmVudC5jbGllbnRZLFxuICAgICAgICAgICAgICAgIGV2ZW50XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICB1bnN1YnNjcmliZVRvdWNoTW92ZSA9IHJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICAgICdkb2N1bWVudCcsXG4gICAgICAgICAgICAndG91Y2htb3ZlJyxcbiAgICAgICAgICAgIChldmVudDogVG91Y2hFdmVudCkgPT4ge1xuICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0KHtcbiAgICAgICAgICAgICAgICBjbGllbnRYOiBldmVudC50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFgsXG4gICAgICAgICAgICAgICAgY2xpZW50WTogZXZlbnQudGFyZ2V0VG91Y2hlc1swXS5jbGllbnRZLFxuICAgICAgICAgICAgICAgIGV2ZW50XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgdW5zdWJzY3JpYmVNb3VzZU1vdmUoKTtcbiAgICAgICAgICB1bnN1YnNjcmliZVRvdWNoTW92ZSgpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICkucGlwZShzaGFyZSgpKTtcblxuICAgIHRoaXMucG9pbnRlclVwID0gbmV3IE9ic2VydmFibGUoXG4gICAgICAob2JzZXJ2ZXI6IE9ic2VydmVyPFBvaW50ZXJFdmVudENvb3JkaW5hdGU+KSA9PiB7XG4gICAgICAgIGxldCB1bnN1YnNjcmliZU1vdXNlVXA6ICgpID0+IHZvaWQ7XG4gICAgICAgIGxldCB1bnN1YnNjcmliZVRvdWNoRW5kOiAoKSA9PiB2b2lkO1xuICAgICAgICBsZXQgdW5zdWJzY3JpYmVUb3VjaENhbmNlbDogKCkgPT4gdm9pZDtcblxuICAgICAgICB6b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICB1bnN1YnNjcmliZU1vdXNlVXAgPSByZW5kZXJlci5saXN0ZW4oXG4gICAgICAgICAgICAnZG9jdW1lbnQnLFxuICAgICAgICAgICAgJ21vdXNldXAnLFxuICAgICAgICAgICAgKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIG9ic2VydmVyLm5leHQoe1xuICAgICAgICAgICAgICAgIGNsaWVudFg6IGV2ZW50LmNsaWVudFgsXG4gICAgICAgICAgICAgICAgY2xpZW50WTogZXZlbnQuY2xpZW50WSxcbiAgICAgICAgICAgICAgICBldmVudFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuXG4gICAgICAgICAgdW5zdWJzY3JpYmVUb3VjaEVuZCA9IHJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICAgICdkb2N1bWVudCcsXG4gICAgICAgICAgICAndG91Y2hlbmQnLFxuICAgICAgICAgICAgKGV2ZW50OiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIG9ic2VydmVyLm5leHQoe1xuICAgICAgICAgICAgICAgIGNsaWVudFg6IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFgsXG4gICAgICAgICAgICAgICAgY2xpZW50WTogZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WSxcbiAgICAgICAgICAgICAgICBldmVudFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuXG4gICAgICAgICAgdW5zdWJzY3JpYmVUb3VjaENhbmNlbCA9IHJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICAgICdkb2N1bWVudCcsXG4gICAgICAgICAgICAndG91Y2hjYW5jZWwnLFxuICAgICAgICAgICAgKGV2ZW50OiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIG9ic2VydmVyLm5leHQoe1xuICAgICAgICAgICAgICAgIGNsaWVudFg6IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFgsXG4gICAgICAgICAgICAgICAgY2xpZW50WTogZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WSxcbiAgICAgICAgICAgICAgICBldmVudFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgIHVuc3Vic2NyaWJlTW91c2VVcCgpO1xuICAgICAgICAgIHVuc3Vic2NyaWJlVG91Y2hFbmQoKTtcbiAgICAgICAgICB1bnN1YnNjcmliZVRvdWNoQ2FuY2VsKCk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgKS5waXBlKHNoYXJlKCkpO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIElucHV0LFxuICBIb3N0TGlzdGVuZXIsXG4gIFJlbmRlcmVyMixcbiAgRWxlbWVudFJlZixcbiAgT25EZXN0cm95LFxuICBOZ1pvbmVcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSZXNpemFibGVEaXJlY3RpdmUgfSBmcm9tICcuL3Jlc2l6YWJsZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgRWRnZXMgfSBmcm9tICcuL2ludGVyZmFjZXMvZWRnZXMuaW50ZXJmYWNlJztcblxuLyoqXG4gKiBBbiBlbGVtZW50IHBsYWNlZCBpbnNpZGUgYSBgbXdsUmVzaXphYmxlYCBkaXJlY3RpdmUgdG8gYmUgdXNlZCBhcyBhIGRyYWcgYW5kIHJlc2l6ZSBoYW5kbGVcbiAqXG4gKiBGb3IgZXhhbXBsZVxuICpcbiAqIGBgYGh0bWxcbiAqIDxkaXYgbXdsUmVzaXphYmxlPlxuICogICA8ZGl2IG13bFJlc2l6ZUhhbmRsZSBbcmVzaXplRWRnZXNdPVwie2JvdHRvbTogdHJ1ZSwgcmlnaHQ6IHRydWV9XCI+PC9kaXY+XG4gKiA8L2Rpdj5cbiAqIGBgYFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbXdsUmVzaXplSGFuZGxlXSdcbn0pXG5leHBvcnQgY2xhc3MgUmVzaXplSGFuZGxlRGlyZWN0aXZlIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIFRoZSBgRWRnZXNgIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBlZGdlcyBvZiB0aGUgcGFyZW50IGVsZW1lbnQgdGhhdCBkcmFnZ2luZyB0aGUgaGFuZGxlIHdpbGwgdHJpZ2dlciBhIHJlc2l6ZSBvblxuICAgKi9cbiAgQElucHV0KClcbiAgcmVzaXplRWRnZXM6IEVkZ2VzID0ge307XG5cbiAgcHJpdmF0ZSBldmVudExpc3RlbmVyczoge1xuICAgIHRvdWNobW92ZT86ICgpID0+IHZvaWQ7XG4gICAgbW91c2Vtb3ZlPzogKCkgPT4gdm9pZDtcbiAgICBba2V5OiBzdHJpbmddOiAoKCkgPT4gdm9pZCkgfCB1bmRlZmluZWQ7XG4gIH0gPSB7fTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgem9uZTogTmdab25lLFxuICAgIHByaXZhdGUgcmVzaXphYmxlOiBSZXNpemFibGVEaXJlY3RpdmVcbiAgKSB7fVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMudW5zdWJzY3JpYmVFdmVudExpc3RlbmVycygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIEBIb3N0TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBbXG4gICAgJyRldmVudCcsXG4gICAgJyRldmVudC50b3VjaGVzWzBdLmNsaWVudFgnLFxuICAgICckZXZlbnQudG91Y2hlc1swXS5jbGllbnRZJ1xuICBdKVxuICBASG9zdExpc3RlbmVyKCdtb3VzZWRvd24nLCBbJyRldmVudCcsICckZXZlbnQuY2xpZW50WCcsICckZXZlbnQuY2xpZW50WSddKVxuICBvbk1vdXNlZG93bihcbiAgICBldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQsXG4gICAgY2xpZW50WDogbnVtYmVyLFxuICAgIGNsaWVudFk6IG51bWJlclxuICApOiB2b2lkIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuZXZlbnRMaXN0ZW5lcnMudG91Y2htb3ZlKSB7XG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnMudG91Y2htb3ZlID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgJ3RvdWNobW92ZScsXG4gICAgICAgICAgKHRvdWNoTW92ZUV2ZW50OiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uTW91c2Vtb3ZlKFxuICAgICAgICAgICAgICB0b3VjaE1vdmVFdmVudCxcbiAgICAgICAgICAgICAgdG91Y2hNb3ZlRXZlbnQudGFyZ2V0VG91Y2hlc1swXS5jbGllbnRYLFxuICAgICAgICAgICAgICB0b3VjaE1vdmVFdmVudC50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmV2ZW50TGlzdGVuZXJzLm1vdXNlbW92ZSkge1xuICAgICAgICB0aGlzLmV2ZW50TGlzdGVuZXJzLm1vdXNlbW92ZSA9IHRoaXMucmVuZGVyZXIubGlzdGVuKFxuICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICdtb3VzZW1vdmUnLFxuICAgICAgICAgIChtb3VzZU1vdmVFdmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vbk1vdXNlbW92ZShcbiAgICAgICAgICAgICAgbW91c2VNb3ZlRXZlbnQsXG4gICAgICAgICAgICAgIG1vdXNlTW92ZUV2ZW50LmNsaWVudFgsXG4gICAgICAgICAgICAgIG1vdXNlTW92ZUV2ZW50LmNsaWVudFlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgdGhpcy5yZXNpemFibGUubW91c2Vkb3duLm5leHQoe1xuICAgICAgICBjbGllbnRYLFxuICAgICAgICBjbGllbnRZLFxuICAgICAgICBlZGdlczogdGhpcy5yZXNpemVFZGdlc1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgQEhvc3RMaXN0ZW5lcigndG91Y2hlbmQnLCBbXG4gICAgJyRldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYJyxcbiAgICAnJGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFknXG4gIF0pXG4gIEBIb3N0TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgW1xuICAgICckZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCcsXG4gICAgJyRldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZJ1xuICBdKVxuICBASG9zdExpc3RlbmVyKCdtb3VzZXVwJywgWyckZXZlbnQuY2xpZW50WCcsICckZXZlbnQuY2xpZW50WSddKVxuICBvbk1vdXNldXAoY2xpZW50WDogbnVtYmVyLCBjbGllbnRZOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy51bnN1YnNjcmliZUV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICB0aGlzLnJlc2l6YWJsZS5tb3VzZXVwLm5leHQoe1xuICAgICAgICBjbGllbnRYLFxuICAgICAgICBjbGllbnRZLFxuICAgICAgICBlZGdlczogdGhpcy5yZXNpemVFZGdlc1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG9uTW91c2Vtb3ZlKFxuICAgIGV2ZW50OiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCxcbiAgICBjbGllbnRYOiBudW1iZXIsXG4gICAgY2xpZW50WTogbnVtYmVyXG4gICk6IHZvaWQge1xuICAgIHRoaXMucmVzaXphYmxlLm1vdXNlbW92ZS5uZXh0KHtcbiAgICAgIGNsaWVudFgsXG4gICAgICBjbGllbnRZLFxuICAgICAgZWRnZXM6IHRoaXMucmVzaXplRWRnZXMsXG4gICAgICBldmVudFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSB1bnN1YnNjcmliZUV2ZW50TGlzdGVuZXJzKCk6IHZvaWQge1xuICAgIE9iamVjdC5rZXlzKHRoaXMuZXZlbnRMaXN0ZW5lcnMpLmZvckVhY2godHlwZSA9PiB7XG4gICAgICAodGhpcyBhcyBhbnkpLmV2ZW50TGlzdGVuZXJzW3R5cGVdKCk7XG4gICAgICBkZWxldGUgdGhpcy5ldmVudExpc3RlbmVyc1t0eXBlXTtcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJlc2l6YWJsZURpcmVjdGl2ZSB9IGZyb20gJy4vcmVzaXphYmxlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBSZXNpemVIYW5kbGVEaXJlY3RpdmUgfSBmcm9tICcuL3Jlc2l6ZS1oYW5kbGUuZGlyZWN0aXZlJztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbUmVzaXphYmxlRGlyZWN0aXZlLCBSZXNpemVIYW5kbGVEaXJlY3RpdmVdLFxuICBleHBvcnRzOiBbUmVzaXphYmxlRGlyZWN0aXZlLCBSZXNpemVIYW5kbGVEaXJlY3RpdmVdXG59KVxuZXhwb3J0IGNsYXNzIFJlc2l6YWJsZU1vZHVsZSB7fVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7OztBQXFDQSx5QkFDRSxNQUFjLEVBQ2QsTUFBYyxFQUNkLFlBQW9CLENBQUM7O0lBRXJCLE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDO0lBQy9DLE9BQU8sSUFBSSxHQUFHLFNBQVMsQ0FBQztDQUN6Qjs7Ozs7Ozs7QUFFRCxpQ0FDRSxZQUErQixFQUMvQixLQUFZLEVBQ1osT0FBZSxFQUNmLE9BQWU7O0lBRWYsTUFBTSxlQUFlLEdBQXNCO1FBQ3pDLEdBQUcsRUFBRSxZQUFZLENBQUMsR0FBRztRQUNyQixNQUFNLEVBQUUsWUFBWSxDQUFDLE1BQU07UUFDM0IsSUFBSSxFQUFFLFlBQVksQ0FBQyxJQUFJO1FBQ3ZCLEtBQUssRUFBRSxZQUFZLENBQUMsS0FBSztLQUMxQixDQUFDO0lBRUYsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFO1FBQ2IsZUFBZSxDQUFDLEdBQUcsSUFBSSxPQUFPLENBQUM7S0FDaEM7SUFDRCxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7UUFDaEIsZUFBZSxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUM7S0FDbkM7SUFDRCxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUU7UUFDZCxlQUFlLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQztLQUNqQztJQUNELElBQUksS0FBSyxDQUFDLEtBQUssRUFBRTtRQUNmLGVBQWUsQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDO0tBQ2xDO0lBQ0QsZUFBZSxDQUFDLE1BQU0sR0FBRyxlQUFl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