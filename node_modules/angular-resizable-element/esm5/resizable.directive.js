/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Directive, Renderer2, ElementRef, Output, Input, EventEmitter, NgZone } from '@angular/core';
import { Subject, Observable, merge } from 'rxjs';
import { map, mergeMap, takeUntil, filter, pairwise, take, share, auditTime } from 'rxjs/operators';
/**
 * @record
 */
function PointerEventCoordinate() { }
/** @type {?} */
PointerEventCoordinate.prototype.clientX;
/** @type {?} */
PointerEventCoordinate.prototype.clientY;
/** @type {?} */
PointerEventCoordinate.prototype.event;
/**
 * @record
 */
function Coordinate() { }
/** @type {?} */
Coordinate.prototype.x;
/** @type {?} */
Coordinate.prototype.y;
/**
 * @param {?} value1
 * @param {?} value2
 * @param {?=} precision
 * @return {?}
 */
function isNumberCloseTo(value1, value2, precision) {
    if (precision === void 0) { precision = 3; }
    /** @type {?} */
    var diff = Math.abs(value1 - value2);
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
    var newBoundingRect = {
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
    var translateX = 0;
    /** @type {?} */
    var translateY = 0;
    /** @type {?} */
    var style = element.nativeElement.style;
    /** @type {?} */
    var transformProperties = [
        'transform',
        '-ms-transform',
        '-moz-transform',
        '-o-transform'
    ];
    /** @type {?} */
    var transform = transformProperties
        .map(function (property) { return style[property]; })
        .find(function (value) { return !!value; });
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
        var boundingRect = element.nativeElement.getBoundingClientRect();
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
function isWithinBoundingY(_a) {
    var clientY = _a.clientY, rect = _a.rect;
    return clientY >= rect.top && clientY <= rect.bottom;
}
/**
 * @param {?} __0
 * @return {?}
 */
function isWithinBoundingX(_a) {
    var clientX = _a.clientX, rect = _a.rect;
    return clientX >= rect.left && clientX <= rect.right;
}
/**
 * @param {?} __0
 * @return {?}
 */
function getResizeEdges(_a) {
    var clientX = _a.clientX, clientY = _a.clientY, elm = _a.elm, allowedEdges = _a.allowedEdges, cursorPrecision = _a.cursorPrecision;
    /** @type {?} */
    var elmPosition = elm.nativeElement.getBoundingClientRect();
    /** @type {?} */
    var edges = {};
    if (allowedEdges.left &&
        isNumberCloseTo(clientX, elmPosition.left, cursorPrecision) &&
        isWithinBoundingY({ clientY: clientY, rect: elmPosition })) {
        edges.left = true;
    }
    if (allowedEdges.right &&
        isNumberCloseTo(clientX, elmPosition.right, cursorPrecision) &&
        isWithinBoundingY({ clientY: clientY, rect: elmPosition })) {
        edges.right = true;
    }
    if (allowedEdges.top &&
        isNumberCloseTo(clientY, elmPosition.top, cursorPrecision) &&
        isWithinBoundingX({ clientX: clientX, rect: elmPosition })) {
        edges.top = true;
    }
    if (allowedEdges.bottom &&
        isNumberCloseTo(clientY, elmPosition.bottom, cursorPrecision) &&
        isWithinBoundingX({ clientX: clientX, rect: elmPosition })) {
        edges.bottom = true;
    }
    return edges;
}
/**
 * @record
 */
export function ResizeCursors() { }
/** @type {?} */
ResizeCursors.prototype.topLeft;
/** @type {?} */
ResizeCursors.prototype.topRight;
/** @type {?} */
ResizeCursors.prototype.bottomLeft;
/** @type {?} */
ResizeCursors.prototype.bottomRight;
/** @type {?} */
ResizeCursors.prototype.leftOrRight;
/** @type {?} */
ResizeCursors.prototype.topOrBottom;
/** @type {?} */
var DEFAULT_RESIZE_CURSORS = Object.freeze({
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
function getEdgesDiff(_a) {
    var edges = _a.edges, initialRectangle = _a.initialRectangle, newRectangle = _a.newRectangle;
    /** @type {?} */
    var edgesDiff = {};
    Object.keys(edges).forEach(function (edge) {
        edgesDiff[edge] = (newRectangle[edge] || 0) - (initialRectangle[edge] || 0);
    });
    return edgesDiff;
}
/** @type {?} */
var RESIZE_ACTIVE_CLASS = 'resize-active';
/** @type {?} */
var RESIZE_LEFT_HOVER_CLASS = 'resize-left-hover';
/** @type {?} */
var RESIZE_RIGHT_HOVER_CLASS = 'resize-right-hover';
/** @type {?} */
var RESIZE_TOP_HOVER_CLASS = 'resize-top-hover';
/** @type {?} */
var RESIZE_BOTTOM_HOVER_CLASS = 'resize-bottom-hover';
/** @type {?} */
var RESIZE_GHOST_ELEMENT_CLASS = 'resize-ghost-element';
/** @type {?} */
export var MOUSE_MOVE_THROTTLE_MS = 50;
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
var ResizableDirective = /** @class */ (function () {
    /**
     * @hidden
     */
    function ResizableDirective(renderer, elm, zone) {
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
     */
    /**
     * @hidden
     * @return {?}
     */
    ResizableDirective.prototype.ngOnInit = /**
     * @hidden
     * @return {?}
     */
    function () {
        var _this = this;
        // TODO - use some fancy Observable.merge's for this
        this.pointerEventListeners.pointerDown
            .pipe(takeUntil(this.destroy$))
            .subscribe(function (_a) {
            var clientX = _a.clientX, clientY = _a.clientY;
            _this.mousedown.next({ clientX: clientX, clientY: clientY });
        });
        this.pointerEventListeners.pointerMove
            .pipe(takeUntil(this.destroy$))
            .subscribe(function (_a) {
            var clientX = _a.clientX, clientY = _a.clientY, event = _a.event;
            _this.mousemove.next({ clientX: clientX, clientY: clientY, event: event });
        });
        this.pointerEventListeners.pointerUp
            .pipe(takeUntil(this.destroy$))
            .subscribe(function (_a) {
            var clientX = _a.clientX, clientY = _a.clientY;
            _this.mouseup.next({ clientX: clientX, clientY: clientY });
        });
        /** @type {?} */
        var currentResize;
        /** @type {?} */
        var removeGhostElement = function () {
            if (currentResize && currentResize.clonedNode) {
                _this.elm.nativeElement.parentElement.removeChild(currentResize.clonedNode);
                _this.renderer.setStyle(_this.elm.nativeElement, 'visibility', 'inherit');
            }
        };
        /** @type {?} */
        var mouseMove = this.mousemove.pipe(share());
        mouseMove.pipe(filter(function () { return !!currentResize; })).subscribe(function (_a) {
            var event = _a.event;
            event.preventDefault();
        });
        mouseMove
            .pipe(auditTime(MOUSE_MOVE_THROTTLE_MS))
            .subscribe(function (_a) {
            var clientX = _a.clientX, clientY = _a.clientY;
            /** @type {?} */
            var resizeEdges = getResizeEdges({
                clientX: clientX,
                clientY: clientY,
                elm: _this.elm,
                allowedEdges: _this.resizeEdges,
                cursorPrecision: _this.resizeCursorPrecision
            });
            /** @type {?} */
            var resizeCursors = Object.assign({}, DEFAULT_RESIZE_CURSORS, _this.resizeCursors);
            if (currentResize) {
                /** @type {?} */
                var cursor = getResizeCursor(currentResize.edges, resizeCursors);
                _this.renderer.setStyle(document.body, 'cursor', cursor);
            }
            else {
                /** @type {?} */
                var cursor = getResizeCursor(resizeEdges, resizeCursors);
                _this.renderer.setStyle(_this.elm.nativeElement, 'cursor', cursor);
            }
            _this.setElementClass(_this.elm, RESIZE_ACTIVE_CLASS, !!currentResize);
            _this.setElementClass(_this.elm, RESIZE_LEFT_HOVER_CLASS, resizeEdges.left === true);
            _this.setElementClass(_this.elm, RESIZE_RIGHT_HOVER_CLASS, resizeEdges.right === true);
            _this.setElementClass(_this.elm, RESIZE_TOP_HOVER_CLASS, resizeEdges.top === true);
            _this.setElementClass(_this.elm, RESIZE_BOTTOM_HOVER_CLASS, resizeEdges.bottom === true);
        });
        /** @type {?} */
        var mousedrag = this.mousedown
            .pipe(mergeMap(function (startCoords) {
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
            var getSnapGrid = function () {
                /** @type {?} */
                var snapGrid = { x: 1, y: 1 };
                if (currentResize) {
                    if (_this.resizeSnapGrid.left && currentResize.edges.left) {
                        snapGrid.x = +_this.resizeSnapGrid.left;
                    }
                    else if (_this.resizeSnapGrid.right &&
                        currentResize.edges.right) {
                        snapGrid.x = +_this.resizeSnapGrid.right;
                    }
                    if (_this.resizeSnapGrid.top && currentResize.edges.top) {
                        snapGrid.y = +_this.resizeSnapGrid.top;
                    }
                    else if (_this.resizeSnapGrid.bottom &&
                        currentResize.edges.bottom) {
                        snapGrid.y = +_this.resizeSnapGrid.bottom;
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
            return merge(mouseMove.pipe(take(1)).pipe(map(function (coords) { return [, coords]; })), mouseMove.pipe(pairwise()))
                .pipe(map(function (_a) {
                var _b = tslib_1.__read(_a, 2), previousCoords = _b[0], newCoords = _b[1];
                return [
                    previousCoords ? getDiff(previousCoords) : previousCoords,
                    getDiff(newCoords)
                ];
            }))
                .pipe(filter(function (_a) {
                var _b = tslib_1.__read(_a, 2), previousCoords = _b[0], newCoords = _b[1];
                if (!previousCoords) {
                    return true;
                }
                /** @type {?} */
                var snapGrid = getSnapGrid();
                /** @type {?} */
                var previousGrid = getGrid(previousCoords, snapGrid);
                /** @type {?} */
                var newGrid = getGrid(newCoords, snapGrid);
                return (previousGrid.x !== newGrid.x || previousGrid.y !== newGrid.y);
            }))
                .pipe(map(function (_a) {
                var _b = tslib_1.__read(_a, 2), newCoords = _b[1];
                /** @type {?} */
                var snapGrid = getSnapGrid();
                return {
                    clientX: Math.round(newCoords.clientX / snapGrid.x) * snapGrid.x,
                    clientY: Math.round(newCoords.clientY / snapGrid.y) * snapGrid.y
                };
            }))
                .pipe(takeUntil(merge(_this.mouseup, _this.mousedown)));
        }))
            .pipe(filter(function () { return !!currentResize; }));
        mousedrag
            .pipe(map(function (_a) {
            var clientX = _a.clientX, clientY = _a.clientY;
            return getNewBoundingRectangle(/** @type {?} */ ((currentResize)).startingRect, /** @type {?} */ ((currentResize)).edges, clientX, clientY);
        }))
            .pipe(filter(function (newBoundingRect) {
            return (_this.allowNegativeResizes ||
                !!(newBoundingRect.height &&
                    newBoundingRect.width &&
                    newBoundingRect.height > 0 &&
                    newBoundingRect.width > 0));
        }))
            .pipe(filter(function (newBoundingRect) {
            return _this.validateResize
                ? _this.validateResize({
                    rectangle: newBoundingRect,
                    edges: getEdgesDiff({
                        edges: /** @type {?} */ ((currentResize)).edges,
                        initialRectangle: /** @type {?} */ ((currentResize)).startingRect,
                        newRectangle: newBoundingRect
                    })
                })
                : true;
        }))
            .subscribe(function (newBoundingRect) {
            if (currentResize && currentResize.clonedNode) {
                _this.renderer.setStyle(currentResize.clonedNode, 'height', newBoundingRect.height + "px");
                _this.renderer.setStyle(currentResize.clonedNode, 'width', newBoundingRect.width + "px");
                _this.renderer.setStyle(currentResize.clonedNode, 'top', newBoundingRect.top + "px");
                _this.renderer.setStyle(currentResize.clonedNode, 'left', newBoundingRect.left + "px");
            }
            _this.zone.run(function () {
                _this.resizing.emit({
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
            .pipe(map(function (_a) {
            var clientX = _a.clientX, clientY = _a.clientY, edges = _a.edges;
            return (edges ||
                getResizeEdges({
                    clientX: clientX,
                    clientY: clientY,
                    elm: _this.elm,
                    allowedEdges: _this.resizeEdges,
                    cursorPrecision: _this.resizeCursorPrecision
                }));
        }))
            .pipe(filter(function (edges) {
            return Object.keys(edges).length > 0;
        }))
            .subscribe(function (edges) {
            if (currentResize) {
                removeGhostElement();
            }
            /** @type {?} */
            var startingRect = getElementRect(_this.elm, _this.ghostElementPositioning);
            currentResize = {
                edges: edges,
                startingRect: startingRect,
                currentRect: startingRect
            };
            if (_this.enableGhostResize) {
                currentResize.clonedNode = _this.elm.nativeElement.cloneNode(true);
                /** @type {?} */
                var resizeCursors = Object.assign({}, DEFAULT_RESIZE_CURSORS, _this.resizeCursors);
                _this.elm.nativeElement.parentElement.appendChild(currentResize.clonedNode);
                _this.renderer.setStyle(_this.elm.nativeElement, 'visibility', 'hidden');
                _this.renderer.setStyle(currentResize.clonedNode, 'position', _this.ghostElementPositioning);
                _this.renderer.setStyle(currentResize.clonedNode, 'left', currentResize.startingRect.left + "px");
                _this.renderer.setStyle(currentResize.clonedNode, 'top', currentResize.startingRect.top + "px");
                _this.renderer.setStyle(currentResize.clonedNode, 'height', currentResize.startingRect.height + "px");
                _this.renderer.setStyle(currentResize.clonedNode, 'width', currentResize.startingRect.width + "px");
                _this.renderer.setStyle(currentResize.clonedNode, 'cursor', getResizeCursor(currentResize.edges, resizeCursors));
                _this.renderer.addClass(currentResize.clonedNode, RESIZE_GHOST_ELEMENT_CLASS); /** @type {?} */
                ((currentResize.clonedNode)).scrollTop = /** @type {?} */ (currentResize.startingRect
                    .scrollTop); /** @type {?} */
                ((currentResize.clonedNode)).scrollLeft = /** @type {?} */ (currentResize.startingRect
                    .scrollLeft);
            }
            _this.zone.run(function () {
                _this.resizeStart.emit({
                    edges: getEdgesDiff({
                        edges: edges,
                        initialRectangle: startingRect,
                        newRectangle: startingRect
                    }),
                    rectangle: getNewBoundingRectangle(startingRect, {}, 0, 0)
                });
            });
        });
        this.mouseup.subscribe(function () {
            if (currentResize) {
                _this.renderer.removeClass(_this.elm.nativeElement, RESIZE_ACTIVE_CLASS);
                _this.renderer.setStyle(document.body, 'cursor', '');
                _this.renderer.setStyle(_this.elm.nativeElement, 'cursor', '');
                _this.zone.run(function () {
                    _this.resizeEnd.emit({
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
    };
    /**
     * @hidden
     */
    /**
     * @hidden
     * @return {?}
     */
    ResizableDirective.prototype.ngOnDestroy = /**
     * @hidden
     * @return {?}
     */
    function () {
        this.mousedown.complete();
        this.mouseup.complete();
        this.mousemove.complete();
        this.destroy$.next();
    };
    /**
     * @param {?} elm
     * @param {?} name
     * @param {?} add
     * @return {?}
     */
    ResizableDirective.prototype.setElementClass = /**
     * @param {?} elm
     * @param {?} name
     * @param {?} add
     * @return {?}
     */
    function (elm, name, add) {
        if (add) {
            this.renderer.addClass(elm.nativeElement, name);
        }
        else {
            this.renderer.removeClass(elm.nativeElement, name);
        }
    };
    ResizableDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[mwlResizable]'
                },] }
    ];
    /** @nocollapse */
    ResizableDirective.ctorParameters = function () { return [
        { type: Renderer2 },
        { type: ElementRef },
        { type: NgZone }
    ]; };
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
    return ResizableDirective;
}());
export { ResizableDirective };
if (false) {
    /**
     * A function that will be called before each resize event. Return `true` to allow the resize event to propagate or `false` to cancel it
     * @type {?}
     */
    ResizableDirective.prototype.validateResize;
    /**
     * The edges that an element can be resized from. Pass an object like `{top: true, bottom: false}`. By default no edges can be resized.
     * @type {?}
     */
    ResizableDirective.prototype.resizeEdges;
    /**
     * Set to `true` to enable a temporary resizing effect of the element in between the `resizeStart` and `resizeEnd` events.
     * @type {?}
     */
    ResizableDirective.prototype.enableGhostResize;
    /**
     * A snap grid that resize events will be locked to.
     *
     * e.g. to only allow the element to be resized every 10px set it to `{left: 10, right: 10}`
     * @type {?}
     */
    ResizableDirective.prototype.resizeSnapGrid;
    /**
     * The mouse cursors that will be set on the resize edges
     * @type {?}
     */
    ResizableDirective.prototype.resizeCursors;
    /**
     * Mouse over thickness to active cursor.
     * @type {?}
     */
    ResizableDirective.prototype.resizeCursorPrecision;
    /**
     * Define the positioning of the ghost element (can be fixed or absolute)
     * @type {?}
     */
    ResizableDirective.prototype.ghostElementPositioning;
    /**
     * Allow elements to be resized to negative dimensions
     * @type {?}
     */
    ResizableDirective.prototype.allowNegativeResizes;
    /**
     * Called when the mouse is pressed and a resize event is about to begin. `$event` is a `ResizeEvent` object.
     * @type {?}
     */
    ResizableDirective.prototype.resizeStart;
    /**
     * Called as the mouse is dragged after a resize event has begun. `$event` is a `ResizeEvent` object.
     * @type {?}
     */
    ResizableDirective.prototype.resizing;
    /**
     * Called after the mouse is released after a resize event. `$event` is a `ResizeEvent` object.
     * @type {?}
     */
    ResizableDirective.prototype.resizeEnd;
    /**
     * @hidden
     * @type {?}
     */
    ResizableDirective.prototype.mouseup;
    /**
     * @hidden
     * @type {?}
     */
    ResizableDirective.prototype.mousedown;
    /**
     * @hidden
     * @type {?}
     */
    ResizableDirective.prototype.mousemove;
    /** @type {?} */
    ResizableDirective.prototype.pointerEventListeners;
    /** @type {?} */
    ResizableDirective.prototype.destroy$;
    /** @type {?} */
    ResizableDirective.prototype.renderer;
    /** @type {?} */
    ResizableDirective.prototype.elm;
    /** @type {?} */
    ResizableDirective.prototype.zone;
}
var PointerEventListeners = /** @class */ (function () {
    function PointerEventListeners(renderer, zone) {
        this.pointerDown = new Observable(function (observer) {
            /** @type {?} */
            var unsubscribeMouseDown;
            /** @type {?} */
            var unsubscribeTouchStart;
            zone.runOutsideAngular(function () {
                unsubscribeMouseDown = renderer.listen('document', 'mousedown', function (event) {
                    observer.next({
                        clientX: event.clientX,
                        clientY: event.clientY,
                        event: event
                    });
                });
                unsubscribeTouchStart = renderer.listen('document', 'touchstart', function (event) {
                    observer.next({
                        clientX: event.touches[0].clientX,
                        clientY: event.touches[0].clientY,
                        event: event
                    });
                });
            });
            return function () {
                unsubscribeMouseDown();
                unsubscribeTouchStart();
            };
        }).pipe(share());
        this.pointerMove = new Observable(function (observer) {
            /** @type {?} */
            var unsubscribeMouseMove;
            /** @type {?} */
            var unsubscribeTouchMove;
            zone.runOutsideAngular(function () {
                unsubscribeMouseMove = renderer.listen('document', 'mousemove', function (event) {
                    observer.next({
                        clientX: event.clientX,
                        clientY: event.clientY,
                        event: event
                    });
                });
                unsubscribeTouchMove = renderer.listen('document', 'touchmove', function (event) {
                    observer.next({
                        clientX: event.targetTouches[0].clientX,
                        clientY: event.targetTouches[0].clientY,
                        event: event
                    });
                });
            });
            return function () {
                unsubscribeMouseMove();
                unsubscribeTouchMove();
            };
        }).pipe(share());
        this.pointerUp = new Observable(function (observer) {
            /** @type {?} */
            var unsubscribeMouseUp;
            /** @type {?} */
            var unsubscribeTouchEnd;
            /** @type {?} */
            var unsubscribeTouchCancel;
            zone.runOutsideAngular(function () {
                unsubscribeMouseUp = renderer.listen('document', 'mouseup', function (event) {
                    observer.next({
                        clientX: event.clientX,
                        clientY: event.clientY,
                        event: event
                    });
                });
                unsubscribeTouchEnd = renderer.listen('document', 'touchend', function (event) {
                    observer.next({
                        clientX: event.changedTouches[0].clientX,
                        clientY: event.changedTouches[0].clientY,
                        event: event
                    });
                });
                unsubscribeTouchCancel = renderer.listen('document', 'touchcancel', function (event) {
                    observer.next({
                        clientX: event.changedTouches[0].clientX,
                        clientY: event.changedTouches[0].clientY,
                        event: event
                    });
                });
            });
            return function () {
                unsubscribeMouseUp();
                unsubscribeTouchEnd();
                unsubscribeTouchCancel();
            };
        }).pipe(share());
    }
    /**
     * @param {?} renderer
     * @param {?} zone
     * @return {?}
     */
    PointerEventListeners.getInstance = /**
     * @param {?} renderer
     * @param {?} zone
     * @return {?}
     */
    function (renderer, zone) {
        if (!PointerEventListeners.instance) {
            PointerEventListeners.instance = new PointerEventListeners(renderer, zone);
        }
        return PointerEventListeners.instance;
    };
    return PointerEventListeners;
}());
if (false) {
    /** @type {?} */
    PointerEventListeners.instance;
    /** @type {?} */
    PointerEventListeners.prototype.pointerDown;
    /** @type {?} */
    PointerEventListeners.prototype.pointerMove;
    /** @type {?} */
    PointerEventListeners.prototype.pointerUp;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzaXphYmxlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItcmVzaXphYmxlLWVsZW1lbnQvIiwic291cmNlcyI6WyJyZXNpemFibGUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxTQUFTLEVBQ1QsVUFBVSxFQUVWLE1BQU0sRUFDTixLQUFLLEVBQ0wsWUFBWSxFQUVaLE1BQU0sRUFDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBWSxLQUFLLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQzFFLE9BQU8sRUFDTCxHQUFHLEVBQ0gsUUFBUSxFQUNSLFNBQVMsRUFDVCxNQUFNLEVBQ04sUUFBUSxFQUNSLElBQUksRUFDSixLQUFLLEVBQ0wsU0FBUyxFQUNWLE1BQU0sZ0JBQWdCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQnhCLHlCQUNFLE1BQWMsRUFDZCxNQUFjLEVBQ2QsU0FBcUI7SUFBckIsMEJBQUEsRUFBQSxhQUFxQjs7SUFFckIsSUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUM7SUFDL0MsT0FBTyxJQUFJLEdBQUcsU0FBUyxDQUFDO0NBQ3pCOzs7Ozs7OztBQUVELGlDQUNFLFlBQStCLEVBQy9CLEtBQVksRUFDWixPQUFlLEVBQ2YsT0FBZTs7SUFFZixJQUFNLGVBQWUsR0FBc0I7UUFDekMsR0FBRyxFQUFFLFlBQVksQ0FBQyxHQUFHO1FBQ3JCLE1BQU0sRUFBRSxZQUFZLENBQUMsTUFBTTtRQUMzQixJQUFJLEVBQUUsWUFBWSxDQUFDLElBQUk7UUFDdkIsS0FBSyxFQUFFLFlBQVksQ0FBQyxLQUFLO0tBQzFCLENBQUM7SUFFRixJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUU7UUFDYixlQUFlLENBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBQztL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QUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTzt3QkFDeEMsS0FBSyxPQUFBO3FCQUNOLENBQUMsQ0FBQztpQkFDSixDQUNGLENBQUM7YUFDSCxDQUFDLENBQUM7WUFFSCxPQUFPO2dCQUNMLGtCQUFrQixFQUFFLENBQUM7Z0JBQ3JCLG1CQUFtQixFQUFFLENBQUM7Z0JBQ3RCLHNCQUFzQixFQUFFLENBQUM7YUFDMUIsQ0FBQztTQUNILENBQ0YsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztLQUNqQjs7Ozs7O0lBN0lhLGlDQUFXOzs7OztjQUN2QixRQUFtQixFQUNuQixJQUFZO1FBRVosSUFBSSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsRUFBRTtZQUNuQyxxQkFBcUIsQ0FBQyxRQUFRLEdBQUcsSUFBSSxxQkFBcUIsQ0FDeEQsUUFBUSxFQUNSLElBQUksQ0FDTCxDQUFDO1NBQ0g7UUFDRCxPQUFPLHFCQUFxQixDQUFDLFFBQVEsQ0FBQzs7Z0NBeHlCMUM7SUE0NkJDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIFJlbmRlcmVyMixcbiAgRWxlbWVudFJlZixcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIElucHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIE9uRGVzdHJveSxcbiAgTmdab25lXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSwgT2JzZXJ2ZXIsIG1lcmdlLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIG1hcCxcbiAgbWVyZ2VNYXAsXG4gIHRha2VVbnRpbCxcbiAgZmlsdGVyLFxuICBwYWlyd2lzZSxcbiAgdGFrZSxcbiAgc2hhcmUsXG4gIGF1ZGl0VGltZVxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBFZGdlcyB9IGZyb20gJy4vaW50ZXJmYWNlcy9lZGdlcy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQm91bmRpbmdSZWN0YW5nbGUgfSBmcm9tICcuL2ludGVyZmFjZXMvYm91bmRpbmctcmVjdGFuZ2xlLmludGVyZmFjZSc7XG5pbXBvcnQgeyBSZXNpemVFdmVudCB9IGZyb20gJy4vaW50ZXJmYWNlcy9yZXNpemUtZXZlbnQuaW50ZXJmYWNlJztcblxuaW50ZXJmYWNlIFBvaW50ZXJFdmVudENvb3JkaW5hdGUge1xuICBjbGllbnRYOiBudW1iZXI7XG4gIGNsaWVudFk6IG51bWJlcjtcbiAgZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50O1xufVxuXG5pbnRlcmZhY2UgQ29vcmRpbmF0ZSB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xufVxuXG5mdW5jdGlvbiBpc051bWJlckNsb3NlVG8oXG4gIHZhbHVlMTogbnVtYmVyLFxuICB2YWx1ZTI6IG51bWJlcixcbiAgcHJlY2lzaW9uOiBudW1iZXIgPSAzXG4pOiBib29sZWFuIHtcbiAgY29uc3QgZGlmZjogbnVtYmVyID0gTWF0aC5hYnModmFsdWUxIC0gdmFsdWUyKTtcbiAgcmV0dXJuIGRpZmYgPCBwcmVjaXNpb247XG59XG5cbmZ1bmN0aW9uIGdldE5ld0JvdW5kaW5nUmVjdGFuZ2xlKFxuICBzdGFydGluZ1JlY3Q6IEJvdW5kaW5nUmVjdGFuZ2xlLFxuICBlZGdlczogRWRnZXMsXG4gIGNsaWVudFg6IG51bWJlcixcbiAgY2xpZW50WTogbnVtYmVyXG4pOiBCb3VuZGluZ1JlY3RhbmdsZSB7XG4gIGNvbnN0IG5ld0JvdW5kaW5nUmVjdDogQm91bmRpbmdSZWN0YW5nbGUgPSB7XG4gICAgdG9wOiBzdGFydGluZ1JlY3QudG9wLFxuICAgIGJvdHRvbTogc3RhcnRpbmdSZWN0LmJvdHRvbSxcbiAgICBsZWZ0OiBzdGFydGluZ1JlY3QubGVmdCxcbiAgICByaWdodDogc3RhcnRpbmdSZWN0LnJpZ2h0XG4gIH07XG5cbiAgaWYgKGVkZ2VzLnRvcCkge1xuICAgIG5ld0JvdW5kaW5nUmVjdC50b3AgKz0gY2xpZW50WTtcbiAgfVxuICBpZiAoZWRnZXMuYm90dG9tKSB7XG4gICAgbmV3Qm91bmRpbmdSZWN0LmJvdHRvbSArPSBjbGllbnRZO1xuICB9XG4gIGlmIChlZGdlcy5sZWZ0KSB7XG4gICAgbmV3Qm91bmRpbmdSZWN0LmxlZnQgKz0gY2xpZW50WDtcbiAgfVxuICBpZiAoZWRnZXMucmlnaHQpIHtcbiAgICBuZXdCb3VuZGluZ1JlY3QucmlnaHQgKz0gY2xpZW50WDtcbiAgfVxuICBuZXdCb3VuZGluZ1JlY3QuaGVpZ2h0ID0gbmV3Qm91bmRpbmdSZWN0LmJvdHRvbSAtIG5ld0JvdW5kaW5nUmVjdC50b3A7XG4gIG5ld0JvdW5kaW5nUmVjdC53aWR0aCA9IG5ld0JvdW5kaW5nUmVjdC5yaWdodCAtIG5ld0JvdW5kaW5nUmVjdC5sZWZ0O1xuXG4gIHJldHVybiBuZXdCb3VuZGluZ1JlY3Q7XG59XG5cbmZ1bmN0aW9uIGdldEVsZW1lbnRSZWN0KFxuICBlbGVtZW50OiBFbGVtZW50UmVmLFxuICBnaG9zdEVsZW1lbnRQb3NpdGlvbmluZzogc3RyaW5nXG4pOiBCb3VuZGluZ1JlY3RhbmdsZSB7XG4gIGxldCB0cmFuc2xhdGVYID0gMDtcbiAgbGV0IHRyYW5zbGF0ZVkgPSAwO1xuICBjb25zdCBzdHlsZSA9IGVsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZTtcbiAgY29uc3QgdHJhbnNmb3JtUHJvcGVydGllcyA9IFtcbiAgICAndHJhbnNmb3JtJyxcbiAgICAnLW1zLXRyYW5zZm9ybScsXG4gICAgJy1tb3otdHJhbnNmb3JtJyxcbiAgICAnLW8tdHJhbnNmb3JtJ1xuICBdO1xuICBjb25zdCB0cmFuc2Zvcm0gPSB0cmFuc2Zvcm1Qcm9wZXJ0aWVzXG4gICAgLm1hcChwcm9wZXJ0eSA9PiBzdHlsZVtwcm9wZXJ0eV0pXG4gICAgLmZpbmQodmFsdWUgPT4gISF2YWx1ZSk7XG4gIGlmICh0cmFuc2Zvcm0gJiYgdHJhbnNmb3JtLmluY2x1ZGVzKCd0cmFuc2xhdGUnKSkge1xuICAgIHRyYW5zbGF0ZVggPSB0cmFuc2Zvcm0ucmVwbGFjZSgvLip0cmFuc2xhdGVcXCgoLiopcHgsICguKilweFxcKS4qLywgJyQxJyk7XG4gICAgdHJhbnNsYXRlWSA9IHRyYW5zZm9ybS5yZXBsYWNlKC8uKnRyYW5zbGF0ZVxcKCguKilweCwgKC4qKXB4XFwpLiovLCAnJDInKTtcbiAgfVxuXG4gIGlmIChnaG9zdEVsZW1lbnRQb3NpdGlvbmluZyA9PT0gJ2Fic29sdXRlJykge1xuICAgIHJldHVybiB7XG4gICAgICBoZWlnaHQ6IGVsZW1lbnQubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQsXG4gICAgICB3aWR0aDogZWxlbWVudC5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoLFxuICAgICAgdG9wOiBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQub2Zmc2V0VG9wIC0gdHJhbnNsYXRlWSxcbiAgICAgIGJvdHRvbTpcbiAgICAgICAgZWxlbWVudC5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodCArXG4gICAgICAgIGVsZW1lbnQubmF0aXZlRWxlbWVudC5vZmZzZXRUb3AgLVxuICAgICAgICB0cmFuc2xhdGVZLFxuICAgICAgbGVmdDogZWxlbWVudC5uYXRpdmVFbGVtZW50Lm9mZnNldExlZnQgLSB0cmFuc2xhdGVYLFxuICAgICAgcmlnaHQ6XG4gICAgICAgIGVsZW1lbnQubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aCArXG4gICAgICAgIGVsZW1lbnQubmF0aXZlRWxlbWVudC5vZmZzZXRMZWZ0IC1cbiAgICAgICAgdHJhbnNsYXRlWFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgYm91bmRpbmdSZWN0OiBCb3VuZGluZ1JlY3RhbmdsZSA9IGVsZW1lbnQubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4ge1xuICAgICAgaGVpZ2h0OiBib3VuZGluZ1JlY3QuaGVpZ2h0LFxuICAgICAgd2lkdGg6IGJvdW5kaW5nUmVjdC53aWR0aCxcbiAgICAgIHRvcDogYm91bmRpbmdSZWN0LnRvcCAtIHRyYW5zbGF0ZVksXG4gICAgICBib3R0b206IGJvdW5kaW5nUmVjdC5ib3R0b20gLSB0cmFuc2xhdGVZLFxuICAgICAgbGVmdDogYm91bmRpbmdSZWN0LmxlZnQgLSB0cmFuc2xhdGVYLFxuICAgICAgcmlnaHQ6IGJvdW5kaW5nUmVjdC5yaWdodCAtIHRyYW5zbGF0ZVgsXG4gICAgICBzY3JvbGxUb3A6IGVsZW1lbnQubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AsXG4gICAgICBzY3JvbGxMZWZ0OiBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc2Nyb2xsTGVmdFxuICAgIH07XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNXaXRoaW5Cb3VuZGluZ1koe1xuICBjbGllbnRZLFxuICByZWN0XG59OiB7XG4gIGNsaWVudFk6IG51bWJlcjtcbiAgcmVjdDogQ2xpZW50UmVjdDtcbn0pOiBib29sZWFuIHtcbiAgcmV0dXJuIGNsaWVudFkgPj0gcmVjdC50b3AgJiYgY2xpZW50WSA8PSByZWN0LmJvdHRvbTtcbn1cblxuZnVuY3Rpb24gaXNXaXRoaW5Cb3VuZGluZ1goe1xuICBjbGllbnRYLFxuICByZWN0XG59OiB7XG4gIGNsaWVudFg6IG51bWJlcjtcbiAgcmVjdDogQ2xpZW50UmVjdDtcbn0pOiBib29sZWFuIHtcbiAgcmV0dXJuIGNsaWVudFggPj0gcmVjdC5sZWZ0ICYmIGNsaWVudFggPD0gcmVjdC5yaWdodDtcbn1cblxuZnVuY3Rpb24gZ2V0UmVzaXplRWRnZXMoe1xuICBjbGllbnRYLFxuICBjbGllbnRZLFxuICBlbG0sXG4gIGFsbG93ZWRFZGdlcyxcbiAgY3Vyc29yUHJlY2lzaW9uXG59OiB7XG4gIGNsaWVudFg6IG51bWJlcjtcbiAgY2xpZW50WTogbnVtYmVyO1xuICBlbG06IEVsZW1lbnRSZWY7XG4gIGFsbG93ZWRFZGdlczogRWRnZXM7XG4gIGN1cnNvclByZWNpc2lvbjogbnVtYmVyO1xufSk6IEVkZ2VzIHtcbiAgY29uc3QgZWxtUG9zaXRpb246IENsaWVudFJlY3QgPSBlbG0ubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3QgZWRnZXM6IEVkZ2VzID0ge307XG5cbiAgaWYgKFxuICAgIGFsbG93ZWRFZGdlcy5sZWZ0ICYmXG4gICAgaXNOdW1iZXJDbG9zZVRvKGNsaWVudFgsIGVsbVBvc2l0aW9uLmxlZnQsIGN1cnNvclByZWNpc2lvbikgJiZcbiAgICBpc1dpdGhpbkJvdW5kaW5nWSh7IGNsaWVudFksIHJlY3Q6IGVsbVBvc2l0aW9uIH0pXG4gICkge1xuICAgIGVkZ2VzLmxlZnQgPSB0cnVlO1xuICB9XG5cbiAgaWYgKFxuICAgIGFsbG93ZWRFZGdlcy5yaWdodCAmJlxuICAgIGlzTnVtYmVyQ2xvc2VUbyhjbGllbnRYLCBlbG1Qb3NpdGlvbi5yaWdodCwgY3Vyc29yUHJlY2lzaW9uKSAmJlxuICAgIGlzV2l0aGluQm91bmRpbmdZKHsgY2xpZW50WSwgcmVjdDogZWxtUG9zaXRpb24gfSlcbiAgKSB7XG4gICAgZWRnZXMucmlnaHQgPSB0cnVlO1xuICB9XG5cbiAgaWYgKFxuICAgIGFsbG93ZWRFZGdlcy50b3AgJiZcbiAgICBpc051bWJlckNsb3NlVG8oY2xpZW50WSwgZWxtUG9zaXRpb24udG9wLCBjdXJzb3JQcmVjaXNpb24pICYmXG4gICAgaXNXaXRoaW5Cb3VuZGluZ1goeyBjbGllbnRYLCByZWN0OiBlbG1Qb3NpdGlvbiB9KVxuICApIHtcbiAgICBlZGdlcy50b3AgPSB0cnVlO1xuICB9XG5cbiAgaWYgKFxuICAgIGFsbG93ZWRFZGdlcy5ib3R0b20gJiZcbiAgICBpc051bWJlckNsb3NlVG8oY2xpZW50WSwgZWxtUG9zaXRpb24uYm90dG9tLCBjdXJzb3JQcmVjaXNpb24pICYmXG4gICAgaXNXaXRoaW5Cb3VuZGluZ1goeyBjbGllbnRYLCByZWN0OiBlbG1Qb3NpdGlvbiB9KVxuICApIHtcbiAgICBlZGdlcy5ib3R0b20gPSB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGVkZ2VzO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlc2l6ZUN1cnNvcnMge1xuICB0b3BMZWZ0OiBzdHJpbmc7XG4gIHRvcFJpZ2h0OiBzdHJpbmc7XG4gIGJvdHRvbUxlZnQ6IHN0cmluZztcbiAgYm90dG9tUmlnaHQ6IHN0cmluZztcbiAgbGVmdE9yUmlnaHQ6IHN0cmluZztcbiAgdG9wT3JCb3R0b206IHN0cmluZztcbn1cblxuY29uc3QgREVGQVVMVF9SRVNJWkVfQ1VSU09SUzogUmVzaXplQ3Vyc29ycyA9IE9iamVjdC5mcmVlemUoe1xuICB0b3BMZWZ0OiAnbnctcmVzaXplJyxcbiAgdG9wUmlnaHQ6ICduZS1yZXNpemUnLFxuICBib3R0b21MZWZ0OiAnc3ctcmVzaXplJyxcbiAgYm90dG9tUmlnaHQ6ICdzZS1yZXNpemUnLFxuICBsZWZ0T3JSaWdodDogJ2NvbC1yZXNpemUnLFxuICB0b3BPckJvdHRvbTogJ3Jvdy1yZXNpemUnXG59KTtcblxuZnVuY3Rpb24gZ2V0UmVzaXplQ3Vyc29yKGVkZ2VzOiBFZGdlcywgY3Vyc29yczogUmVzaXplQ3Vyc29ycyk6IHN0cmluZyB7XG4gIGlmIChlZGdlcy5sZWZ0ICYmIGVkZ2VzLnRvcCkge1xuICAgIHJldHVybiBjdXJzb3JzLnRvcExlZnQ7XG4gIH0gZWxzZSBpZiAoZWRnZXMucmlnaHQgJiYgZWRnZXMudG9wKSB7XG4gICAgcmV0dXJuIGN1cnNvcnMudG9wUmlnaHQ7XG4gIH0gZWxzZSBpZiAoZWRnZXMubGVmdCAmJiBlZGdlcy5ib3R0b20pIHtcbiAgICByZXR1cm4gY3Vyc29ycy5ib3R0b21MZWZ0O1xuICB9IGVsc2UgaWYgKGVkZ2VzLnJpZ2h0ICYmIGVkZ2VzLmJvdHRvbSkge1xuICAgIHJldHVybiBjdXJzb3JzLmJvdHRvbVJpZ2h0O1xuICB9IGVsc2UgaWYgKGVkZ2VzLmxlZnQgfHwgZWRnZXMucmlnaHQpIHtcbiAgICByZXR1cm4gY3Vyc29ycy5sZWZ0T3JSaWdodDtcbiAgfSBlbHNlIGlmIChlZGdlcy50b3AgfHwgZWRnZXMuYm90dG9tKSB7XG4gICAgcmV0dXJuIGN1cnNvcnMudG9wT3JCb3R0b207XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldEVkZ2VzRGlmZih7XG4gIGVkZ2VzLFxuICBpbml0aWFsUmVjdGFuZ2xlLFxuICBuZXdSZWN0YW5nbGVcbn06IHtcbiAgZWRnZXM6IEVkZ2VzO1xuICBpbml0aWFsUmVjdGFuZ2xlOiBCb3VuZGluZ1JlY3RhbmdsZTtcbiAgbmV3UmVjdGFuZ2xlOiBCb3VuZGluZ1JlY3RhbmdsZTtcbn0pOiBFZGdlcyB7XG4gIGNvbnN0IGVkZ2VzRGlmZjogRWRnZXMgPSB7fTtcbiAgT2JqZWN0LmtleXMoZWRnZXMpLmZvckVhY2goZWRnZSA9PiB7XG4gICAgZWRnZXNEaWZmW2VkZ2VdID0gKG5ld1JlY3RhbmdsZVtlZGdlXSB8fCAwKSAtIChpbml0aWFsUmVjdGFuZ2xlW2VkZ2VdIHx8IDApO1xuICB9KTtcbiAgcmV0dXJuIGVkZ2VzRGlmZjtcbn1cblxuY29uc3QgUkVTSVpFX0FDVElWRV9DTEFTUzogc3RyaW5nID0gJ3Jlc2l6ZS1hY3RpdmUnO1xuY29uc3QgUkVTSVpFX0xFRlRfSE9WRVJfQ0xBU1M6IHN0cmluZyA9ICdyZXNpemUtbGVmdC1ob3Zlcic7XG5jb25zdCBSRVNJWkVfUklHSFRfSE9WRVJfQ0xBU1M6IHN0cmluZyA9ICdyZXNpemUtcmlnaHQtaG92ZXInO1xuY29uc3QgUkVTSVpFX1RPUF9IT1ZFUl9DTEFTUzogc3RyaW5nID0gJ3Jlc2l6ZS10b3AtaG92ZXInO1xuY29uc3QgUkVTSVpFX0JPVFRPTV9IT1ZFUl9DTEFTUzogc3RyaW5nID0gJ3Jlc2l6ZS1ib3R0b20taG92ZXInO1xuY29uc3QgUkVTSVpFX0dIT1NUX0VMRU1FTlRfQ0xBU1M6IHN0cmluZyA9ICdyZXNpemUtZ2hvc3QtZWxlbWVudCc7XG5cbmV4cG9ydCBjb25zdCBNT1VTRV9NT1ZFX1RIUk9UVExFX01TOiBudW1iZXIgPSA1MDtcblxuLyoqXG4gKiBQbGFjZSB0aGlzIG9uIGFuIGVsZW1lbnQgdG8gbWFrZSBpdCByZXNpemFibGUuIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYGh0bWxcbiAqIDxkaXZcbiAqICAgbXdsUmVzaXphYmxlXG4gKiAgIFtyZXNpemVFZGdlc109XCJ7Ym90dG9tOiB0cnVlLCByaWdodDogdHJ1ZSwgdG9wOiB0cnVlLCBsZWZ0OiB0cnVlfVwiXG4gKiAgIFtlbmFibGVHaG9zdFJlc2l6ZV09XCJ0cnVlXCI+XG4gKiA8L2Rpdj5cbiAqIGBgYFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbXdsUmVzaXphYmxlXSdcbn0pXG5leHBvcnQgY2xhc3MgUmVzaXphYmxlRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogQSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIGJlZm9yZSBlYWNoIHJlc2l6ZSBldmVudC4gUmV0dXJuIGB0cnVlYCB0byBhbGxvdyB0aGUgcmVzaXplIGV2ZW50IHRvIHByb3BhZ2F0ZSBvciBgZmFsc2VgIHRvIGNhbmNlbCBpdFxuICAgKi9cbiAgQElucHV0KClcbiAgdmFsaWRhdGVSZXNpemU6IChyZXNpemVFdmVudDogUmVzaXplRXZlbnQpID0+IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBlZGdlcyB0aGF0IGFuIGVsZW1lbnQgY2FuIGJlIHJlc2l6ZWQgZnJvbS4gUGFzcyBhbiBvYmplY3QgbGlrZSBge3RvcDogdHJ1ZSwgYm90dG9tOiBmYWxzZX1gLiBCeSBkZWZhdWx0IG5vIGVkZ2VzIGNhbiBiZSByZXNpemVkLlxuICAgKi9cbiAgQElucHV0KClcbiAgcmVzaXplRWRnZXM6IEVkZ2VzID0ge307XG5cbiAgLyoqXG4gICAqIFNldCB0byBgdHJ1ZWAgdG8gZW5hYmxlIGEgdGVtcG9yYXJ5IHJlc2l6aW5nIGVmZmVjdCBvZiB0aGUgZWxlbWVudCBpbiBiZXR3ZWVuIHRoZSBgcmVzaXplU3RhcnRgIGFuZCBgcmVzaXplRW5kYCBldmVudHMuXG4gICAqL1xuICBASW5wdXQoKVxuICBlbmFibGVHaG9zdFJlc2l6ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBBIHNuYXAgZ3JpZCB0aGF0IHJlc2l6ZSBldmVudHMgd2lsbCBiZSBsb2NrZWQgdG8uXG4gICAqXG4gICAqIGUuZy4gdG8gb25seSBhbGxvdyB0aGUgZWxlbWVudCB0byBiZSByZXNpemVkIGV2ZXJ5IDEwcHggc2V0IGl0IHRvIGB7bGVmdDogMTAsIHJpZ2h0OiAxMH1gXG4gICAqL1xuICBASW5wdXQoKVxuICByZXNpemVTbmFwR3JpZDogRWRnZXMgPSB7fTtcblxuICAvKipcbiAgICogVGhlIG1vdXNlIGN1cnNvcnMgdGhhdCB3aWxsIGJlIHNldCBvbiB0aGUgcmVzaXplIGVkZ2VzXG4gICAqL1xuICBASW5wdXQoKVxuICByZXNpemVDdXJzb3JzOiBSZXNpemVDdXJzb3JzID0gREVGQVVMVF9SRVNJWkVfQ1VSU09SUztcblxuICAvKipcbiAgICogTW91c2Ugb3ZlciB0aGlja25lc3MgdG8gYWN0aXZlIGN1cnNvci5cbiAgICovXG4gIEBJbnB1dCgpXG4gIHJlc2l6ZUN1cnNvclByZWNpc2lvbjogbnVtYmVyID0gMztcblxuICAvKipcbiAgICogRGVmaW5lIHRoZSBwb3NpdGlvbmluZyBvZiB0aGUgZ2hvc3QgZWxlbWVudCAoY2FuIGJlIGZpeGVkIG9yIGFic29sdXRlKVxuICAgKi9cbiAgQElucHV0KClcbiAgZ2hvc3RFbGVtZW50UG9zaXRpb25pbmc6ICdmaXhlZCcgfCAnYWJzb2x1dGUnID0gJ2ZpeGVkJztcblxuICAvKipcbiAgICogQWxsb3cgZWxlbWVudHMgdG8gYmUgcmVzaXplZCB0byBuZWdhdGl2ZSBkaW1lbnNpb25zXG4gICAqL1xuICBASW5wdXQoKVxuICBhbGxvd05lZ2F0aXZlUmVzaXplczogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgbW91c2UgaXMgcHJlc3NlZCBhbmQgYSByZXNpemUgZXZlbnQgaXMgYWJvdXQgdG8gYmVnaW4uIGAkZXZlbnRgIGlzIGEgYFJlc2l6ZUV2ZW50YCBvYmplY3QuXG4gICAqL1xuICBAT3V0cHV0KClcbiAgcmVzaXplU3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPFJlc2l6ZUV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgYXMgdGhlIG1vdXNlIGlzIGRyYWdnZWQgYWZ0ZXIgYSByZXNpemUgZXZlbnQgaGFzIGJlZ3VuLiBgJGV2ZW50YCBpcyBhIGBSZXNpemVFdmVudGAgb2JqZWN0LlxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHJlc2l6aW5nID0gbmV3IEV2ZW50RW1pdHRlcjxSZXNpemVFdmVudD4oKTtcblxuICAvKipcbiAgICogQ2FsbGVkIGFmdGVyIHRoZSBtb3VzZSBpcyByZWxlYXNlZCBhZnRlciBhIHJlc2l6ZSBldmVudC4gYCRldmVudGAgaXMgYSBgUmVzaXplRXZlbnRgIG9iamVjdC5cbiAgICovXG4gIEBPdXRwdXQoKVxuICByZXNpemVFbmQgPSBuZXcgRXZlbnRFbWl0dGVyPFJlc2l6ZUV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBwdWJsaWMgbW91c2V1cCA9IG5ldyBTdWJqZWN0PHtcbiAgICBjbGllbnRYOiBudW1iZXI7XG4gICAgY2xpZW50WTogbnVtYmVyO1xuICAgIGVkZ2VzPzogRWRnZXM7XG4gIH0+KCk7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHB1YmxpYyBtb3VzZWRvd24gPSBuZXcgU3ViamVjdDx7XG4gICAgY2xpZW50WDogbnVtYmVyO1xuICAgIGNsaWVudFk6IG51bWJlcjtcbiAgICBlZGdlcz86IEVkZ2VzO1xuICB9PigpO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBwdWJsaWMgbW91c2Vtb3ZlID0gbmV3IFN1YmplY3Q8e1xuICAgIGNsaWVudFg6IG51bWJlcjtcbiAgICBjbGllbnRZOiBudW1iZXI7XG4gICAgZWRnZXM/OiBFZGdlcztcbiAgICBldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQ7XG4gIH0+KCk7XG5cbiAgcHJpdmF0ZSBwb2ludGVyRXZlbnRMaXN0ZW5lcnM6IFBvaW50ZXJFdmVudExpc3RlbmVycztcblxuICBwcml2YXRlIGRlc3Ryb3kkID0gbmV3IFN1YmplY3QoKTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHB1YmxpYyBlbG06IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSB6b25lOiBOZ1pvbmVcbiAgKSB7XG4gICAgdGhpcy5wb2ludGVyRXZlbnRMaXN0ZW5lcnMgPSBQb2ludGVyRXZlbnRMaXN0ZW5lcnMuZ2V0SW5zdGFuY2UoXG4gICAgICByZW5kZXJlcixcbiAgICAgIHpvbmVcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIC8vIFRPRE8gLSB1c2Ugc29tZSBmYW5jeSBPYnNlcnZhYmxlLm1lcmdlJ3MgZm9yIHRoaXNcbiAgICB0aGlzLnBvaW50ZXJFdmVudExpc3RlbmVycy5wb2ludGVyRG93blxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgLnN1YnNjcmliZSgoeyBjbGllbnRYLCBjbGllbnRZIH0pID0+IHtcbiAgICAgICAgdGhpcy5tb3VzZWRvd24ubmV4dCh7IGNsaWVudFgsIGNsaWVudFkgfSk7XG4gICAgICB9KTtcblxuICAgIHRoaXMucG9pbnRlckV2ZW50TGlzdGVuZXJzLnBvaW50ZXJNb3ZlXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXG4gICAgICAuc3Vic2NyaWJlKCh7IGNsaWVudFgsIGNsaWVudFksIGV2ZW50IH0pID0+IHtcbiAgICAgICAgdGhpcy5tb3VzZW1vdmUubmV4dCh7IGNsaWVudFgsIGNsaWVudFksIGV2ZW50IH0pO1xuICAgICAgfSk7XG5cbiAgICB0aGlzLnBvaW50ZXJFdmVudExpc3RlbmVycy5wb2ludGVyVXBcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSlcbiAgICAgIC5zdWJzY3JpYmUoKHsgY2xpZW50WCwgY2xpZW50WSB9KSA9PiB7XG4gICAgICAgIHRoaXMubW91c2V1cC5uZXh0KHsgY2xpZW50WCwgY2xpZW50WSB9KTtcbiAgICAgIH0pO1xuXG4gICAgbGV0IGN1cnJlbnRSZXNpemU6IHtcbiAgICAgIGVkZ2VzOiBFZGdlcztcbiAgICAgIHN0YXJ0aW5nUmVjdDogQm91bmRpbmdSZWN0YW5nbGU7XG4gICAgICBjdXJyZW50UmVjdDogQm91bmRpbmdSZWN0YW5nbGU7XG4gICAgICBjbG9uZWROb2RlPzogSFRNTEVsZW1lbnQ7XG4gICAgfSB8IG51bGw7XG5cbiAgICBjb25zdCByZW1vdmVHaG9zdEVsZW1lbnQgPSAoKSA9PiB7XG4gICAgICBpZiAoY3VycmVudFJlc2l6ZSAmJiBjdXJyZW50UmVzaXplLmNsb25lZE5vZGUpIHtcbiAgICAgICAgdGhpcy5lbG0ubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKFxuICAgICAgICAgIGN1cnJlbnRSZXNpemUuY2xvbmVkTm9kZVxuICAgICAgICApO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxtLm5hdGl2ZUVsZW1lbnQsICd2aXNpYmlsaXR5JywgJ2luaGVyaXQnKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgbW91c2VNb3ZlOiBPYnNlcnZhYmxlPGFueT4gPSB0aGlzLm1vdXNlbW92ZS5waXBlKHNoYXJlKCkpO1xuXG4gICAgbW91c2VNb3ZlLnBpcGUoZmlsdGVyKCgpID0+ICEhY3VycmVudFJlc2l6ZSkpLnN1YnNjcmliZSgoeyBldmVudCB9KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0pO1xuXG4gICAgbW91c2VNb3ZlXG4gICAgICAucGlwZShhdWRpdFRpbWUoTU9VU0VfTU9WRV9USFJPVFRMRV9NUykpXG4gICAgICAuc3Vic2NyaWJlKCh7IGNsaWVudFgsIGNsaWVudFkgfSkgPT4ge1xuICAgICAgICBjb25zdCByZXNpemVFZGdlczogRWRnZXMgPSBnZXRSZXNpemVFZGdlcyh7XG4gICAgICAgICAgY2xpZW50WCxcbiAgICAgICAgICBjbGllbnRZLFxuICAgICAgICAgIGVsbTogdGhpcy5lbG0sXG4gICAgICAgICAgYWxsb3dlZEVkZ2VzOiB0aGlzLnJlc2l6ZUVkZ2VzLFxuICAgICAgICAgIGN1cnNvclByZWNpc2lvbjogdGhpcy5yZXNpemVDdXJzb3JQcmVjaXNpb25cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHJlc2l6ZUN1cnNvcnM6IFJlc2l6ZUN1cnNvcnMgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICAgIHt9LFxuICAgICAgICAgIERFRkFVTFRfUkVTSVpFX0NVUlNPUlMsXG4gICAgICAgICAgdGhpcy5yZXNpemVDdXJzb3JzXG4gICAgICAgICk7XG4gICAgICAgIGlmIChjdXJyZW50UmVzaXplKSB7XG4gICAgICAgICAgY29uc3QgY3Vyc29yOiBzdHJpbmcgPSBnZXRSZXNpemVDdXJzb3IoXG4gICAgICAgICAgICBjdXJyZW50UmVzaXplLmVkZ2VzLFxuICAgICAgICAgICAgcmVzaXplQ3Vyc29yc1xuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShkb2N1bWVudC5ib2R5LCAnY3Vyc29yJywgY3Vyc29yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBjdXJzb3I6IHN0cmluZyA9IGdldFJlc2l6ZUN1cnNvcihyZXNpemVFZGdlcywgcmVzaXplQ3Vyc29ycyk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsbS5uYXRpdmVFbGVtZW50LCAnY3Vyc29yJywgY3Vyc29yKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldEVsZW1lbnRDbGFzcyh0aGlzLmVsbSwgUkVTSVpFX0FDVElWRV9DTEFTUywgISFjdXJyZW50UmVzaXplKTtcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50Q2xhc3MoXG4gICAgICAgICAgdGhpcy5lbG0sXG4gICAgICAgICAgUkVTSVpFX0xFRlRfSE9WRVJfQ0xBU1MsXG4gICAgICAgICAgcmVzaXplRWRnZXMubGVmdCA9PT0gdHJ1ZVxuICAgICAgICApO1xuICAgICAgICB0aGlzLnNldEVsZW1lbnRDbGFzcyhcbiAgICAgICAgICB0aGlzLmVsbSxcbiAgICAgICAgICBSRVNJWkVfUklHSFRfSE9WRVJfQ0xBU1MsXG4gICAgICAgICAgcmVzaXplRWRnZXMucmlnaHQgPT09IHRydWVcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50Q2xhc3MoXG4gICAgICAgICAgdGhpcy5lbG0sXG4gICAgICAgICAgUkVTSVpFX1RPUF9IT1ZFUl9DTEFTUyxcbiAgICAgICAgICByZXNpemVFZGdlcy50b3AgPT09IHRydWVcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50Q2xhc3MoXG4gICAgICAgICAgdGhpcy5lbG0sXG4gICAgICAgICAgUkVTSVpFX0JPVFRPTV9IT1ZFUl9DTEFTUyxcbiAgICAgICAgICByZXNpemVFZGdlcy5ib3R0b20gPT09IHRydWVcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgY29uc3QgbW91c2VkcmFnOiBPYnNlcnZhYmxlPGFueT4gPSB0aGlzLm1vdXNlZG93blxuICAgICAgLnBpcGUoXG4gICAgICAgIG1lcmdlTWFwKHN0YXJ0Q29vcmRzID0+IHtcbiAgICAgICAgICBmdW5jdGlvbiBnZXREaWZmKG1vdmVDb29yZHM6IHsgY2xpZW50WDogbnVtYmVyOyBjbGllbnRZOiBudW1iZXIgfSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgY2xpZW50WDogbW92ZUNvb3Jkcy5jbGllbnRYIC0gc3RhcnRDb29yZHMuY2xpZW50WCxcbiAgICAgICAgICAgICAgY2xpZW50WTogbW92ZUNvb3Jkcy5jbGllbnRZIC0gc3RhcnRDb29yZHMuY2xpZW50WVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBnZXRTbmFwR3JpZCA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNuYXBHcmlkOiBDb29yZGluYXRlID0geyB4OiAxLCB5OiAxIH07XG5cbiAgICAgICAgICAgIGlmIChjdXJyZW50UmVzaXplKSB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLnJlc2l6ZVNuYXBHcmlkLmxlZnQgJiYgY3VycmVudFJlc2l6ZS5lZGdlcy5sZWZ0KSB7XG4gICAgICAgICAgICAgICAgc25hcEdyaWQueCA9ICt0aGlzLnJlc2l6ZVNuYXBHcmlkLmxlZnQ7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNpemVTbmFwR3JpZC5yaWdodCAmJlxuICAgICAgICAgICAgICAgIGN1cnJlbnRSZXNpemUuZWRnZXMucmlnaHRcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgc25hcEdyaWQueCA9ICt0aGlzLnJlc2l6ZVNuYXBHcmlkLnJpZ2h0O1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKHRoaXMucmVzaXplU25hcEdyaWQudG9wICYmIGN1cnJlbnRSZXNpemUuZWRnZXMudG9wKSB7XG4gICAgICAgICAgICAgICAgc25hcEdyaWQueSA9ICt0aGlzLnJlc2l6ZVNuYXBHcmlkLnRvcDtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZVNuYXBHcmlkLmJvdHRvbSAmJlxuICAgICAgICAgICAgICAgIGN1cnJlbnRSZXNpemUuZWRnZXMuYm90dG9tXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHNuYXBHcmlkLnkgPSArdGhpcy5yZXNpemVTbmFwR3JpZC5ib3R0b207XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHNuYXBHcmlkO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICBmdW5jdGlvbiBnZXRHcmlkKFxuICAgICAgICAgICAgY29vcmRzOiB7IGNsaWVudFg6IG51bWJlcjsgY2xpZW50WTogbnVtYmVyIH0sXG4gICAgICAgICAgICBzbmFwR3JpZDogQ29vcmRpbmF0ZVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgeDogTWF0aC5jZWlsKGNvb3Jkcy5jbGllbnRYIC8gc25hcEdyaWQueCksXG4gICAgICAgICAgICAgIHk6IE1hdGguY2VpbChjb29yZHMuY2xpZW50WSAvIHNuYXBHcmlkLnkpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBtZXJnZShcbiAgICAgICAgICAgIG1vdXNlTW92ZS5waXBlKHRha2UoMSkpLnBpcGUobWFwKGNvb3JkcyA9PiBbLCBjb29yZHNdKSksXG4gICAgICAgICAgICBtb3VzZU1vdmUucGlwZShwYWlyd2lzZSgpKVxuICAgICAgICAgIClcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICBtYXAoKFtwcmV2aW91c0Nvb3JkcywgbmV3Q29vcmRzXSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgICBwcmV2aW91c0Nvb3JkcyA/IGdldERpZmYocHJldmlvdXNDb29yZHMpIDogcHJldmlvdXNDb29yZHMsXG4gICAgICAgICAgICAgICAgICBnZXREaWZmKG5ld0Nvb3JkcylcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgIGZpbHRlcigoW3ByZXZpb3VzQ29vcmRzLCBuZXdDb29yZHNdKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFwcmV2aW91c0Nvb3Jkcykge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3Qgc25hcEdyaWQ6IENvb3JkaW5hdGUgPSBnZXRTbmFwR3JpZCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzR3JpZDogQ29vcmRpbmF0ZSA9IGdldEdyaWQoXG4gICAgICAgICAgICAgICAgICBwcmV2aW91c0Nvb3JkcyxcbiAgICAgICAgICAgICAgICAgIHNuYXBHcmlkXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdHcmlkOiBDb29yZGluYXRlID0gZ2V0R3JpZChuZXdDb29yZHMsIHNuYXBHcmlkKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICBwcmV2aW91c0dyaWQueCAhPT0gbmV3R3JpZC54IHx8IHByZXZpb3VzR3JpZC55ICE9PSBuZXdHcmlkLnlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgIG1hcCgoWywgbmV3Q29vcmRzXSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNuYXBHcmlkOiBDb29yZGluYXRlID0gZ2V0U25hcEdyaWQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgY2xpZW50WDpcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5yb3VuZChuZXdDb29yZHMuY2xpZW50WCAvIHNuYXBHcmlkLngpICogc25hcEdyaWQueCxcbiAgICAgICAgICAgICAgICAgIGNsaWVudFk6XG4gICAgICAgICAgICAgICAgICAgIE1hdGgucm91bmQobmV3Q29vcmRzLmNsaWVudFkgLyBzbmFwR3JpZC55KSAqIHNuYXBHcmlkLnlcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKG1lcmdlKHRoaXMubW91c2V1cCwgdGhpcy5tb3VzZWRvd24pKSk7XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgICAucGlwZShmaWx0ZXIoKCkgPT4gISFjdXJyZW50UmVzaXplKSk7XG5cbiAgICBtb3VzZWRyYWdcbiAgICAgIC5waXBlKFxuICAgICAgICBtYXAoKHsgY2xpZW50WCwgY2xpZW50WSB9KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGdldE5ld0JvdW5kaW5nUmVjdGFuZ2xlKFxuICAgICAgICAgICAgY3VycmVudFJlc2l6ZSEuc3RhcnRpbmdSZWN0LFxuICAgICAgICAgICAgY3VycmVudFJlc2l6ZSEuZWRnZXMsXG4gICAgICAgICAgICBjbGllbnRYLFxuICAgICAgICAgICAgY2xpZW50WVxuICAgICAgICAgICk7XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgICAucGlwZShcbiAgICAgICAgZmlsdGVyKChuZXdCb3VuZGluZ1JlY3Q6IEJvdW5kaW5nUmVjdGFuZ2xlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHRoaXMuYWxsb3dOZWdhdGl2ZVJlc2l6ZXMgfHxcbiAgICAgICAgICAgICEhKFxuICAgICAgICAgICAgICBuZXdCb3VuZGluZ1JlY3QuaGVpZ2h0ICYmXG4gICAgICAgICAgICAgIG5ld0JvdW5kaW5nUmVjdC53aWR0aCAmJlxuICAgICAgICAgICAgICBuZXdCb3VuZGluZ1JlY3QuaGVpZ2h0ID4gMCAmJlxuICAgICAgICAgICAgICBuZXdCb3VuZGluZ1JlY3Qud2lkdGggPiAwXG4gICAgICAgICAgICApXG4gICAgICAgICAgKTtcbiAgICAgICAgfSlcbiAgICAgIClcbiAgICAgIC5waXBlKFxuICAgICAgICBmaWx0ZXIoKG5ld0JvdW5kaW5nUmVjdDogQm91bmRpbmdSZWN0YW5nbGUpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy52YWxpZGF0ZVJlc2l6ZVxuICAgICAgICAgICAgPyB0aGlzLnZhbGlkYXRlUmVzaXplKHtcbiAgICAgICAgICAgICAgICByZWN0YW5nbGU6IG5ld0JvdW5kaW5nUmVjdCxcbiAgICAgICAgICAgICAgICBlZGdlczogZ2V0RWRnZXNEaWZmKHtcbiAgICAgICAgICAgICAgICAgIGVkZ2VzOiBjdXJyZW50UmVzaXplIS5lZGdlcyxcbiAgICAgICAgICAgICAgICAgIGluaXRpYWxSZWN0YW5nbGU6IGN1cnJlbnRSZXNpemUhLnN0YXJ0aW5nUmVjdCxcbiAgICAgICAgICAgICAgICAgIG5ld1JlY3RhbmdsZTogbmV3Qm91bmRpbmdSZWN0XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIDogdHJ1ZTtcbiAgICAgICAgfSlcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKG5ld0JvdW5kaW5nUmVjdDogQm91bmRpbmdSZWN0YW5nbGUpID0+IHtcbiAgICAgICAgaWYgKGN1cnJlbnRSZXNpemUgJiYgY3VycmVudFJlc2l6ZS5jbG9uZWROb2RlKSB7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShcbiAgICAgICAgICAgIGN1cnJlbnRSZXNpemUuY2xvbmVkTm9kZSxcbiAgICAgICAgICAgICdoZWlnaHQnLFxuICAgICAgICAgICAgYCR7bmV3Qm91bmRpbmdSZWN0LmhlaWdodH1weGBcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgICAgICBjdXJyZW50UmVzaXplLmNsb25lZE5vZGUsXG4gICAgICAgICAgICAnd2lkdGgnLFxuICAgICAgICAgICAgYCR7bmV3Qm91bmRpbmdSZWN0LndpZHRofXB4YFxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShcbiAgICAgICAgICAgIGN1cnJlbnRSZXNpemUuY2xvbmVkTm9kZSxcbiAgICAgICAgICAgICd0b3AnLFxuICAgICAgICAgICAgYCR7bmV3Qm91bmRpbmdSZWN0LnRvcH1weGBcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgICAgICBjdXJyZW50UmVzaXplLmNsb25lZE5vZGUsXG4gICAgICAgICAgICAnbGVmdCcsXG4gICAgICAgICAgICBgJHtuZXdCb3VuZGluZ1JlY3QubGVmdH1weGBcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZXNpemluZy5lbWl0KHtcbiAgICAgICAgICAgIGVkZ2VzOiBnZXRFZGdlc0RpZmYoe1xuICAgICAgICAgICAgICBlZGdlczogY3VycmVudFJlc2l6ZSEuZWRnZXMsXG4gICAgICAgICAgICAgIGluaXRpYWxSZWN0YW5nbGU6IGN1cnJlbnRSZXNpemUhLnN0YXJ0aW5nUmVjdCxcbiAgICAgICAgICAgICAgbmV3UmVjdGFuZ2xlOiBuZXdCb3VuZGluZ1JlY3RcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgcmVjdGFuZ2xlOiBuZXdCb3VuZGluZ1JlY3RcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY3VycmVudFJlc2l6ZSEuY3VycmVudFJlY3QgPSBuZXdCb3VuZGluZ1JlY3Q7XG4gICAgICB9KTtcblxuICAgIHRoaXMubW91c2Vkb3duXG4gICAgICAucGlwZShcbiAgICAgICAgbWFwKCh7IGNsaWVudFgsIGNsaWVudFksIGVkZ2VzIH0pID0+IHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgZWRnZXMgfHxcbiAgICAgICAgICAgIGdldFJlc2l6ZUVkZ2VzKHtcbiAgICAgICAgICAgICAgY2xpZW50WCxcbiAgICAgICAgICAgICAgY2xpZW50WSxcbiAgICAgICAgICAgICAgZWxtOiB0aGlzLmVsbSxcbiAgICAgICAgICAgICAgYWxsb3dlZEVkZ2VzOiB0aGlzLnJlc2l6ZUVkZ2VzLFxuICAgICAgICAgICAgICBjdXJzb3JQcmVjaXNpb246IHRoaXMucmVzaXplQ3Vyc29yUHJlY2lzaW9uXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICk7XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgICAucGlwZShcbiAgICAgICAgZmlsdGVyKChlZGdlczogRWRnZXMpID0+IHtcbiAgICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMoZWRnZXMpLmxlbmd0aCA+IDA7XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKChlZGdlczogRWRnZXMpID0+IHtcbiAgICAgICAgaWYgKGN1cnJlbnRSZXNpemUpIHtcbiAgICAgICAgICByZW1vdmVHaG9zdEVsZW1lbnQoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzdGFydGluZ1JlY3Q6IEJvdW5kaW5nUmVjdGFuZ2xlID0gZ2V0RWxlbWVudFJlY3QoXG4gICAgICAgICAgdGhpcy5lbG0sXG4gICAgICAgICAgdGhpcy5naG9zdEVsZW1lbnRQb3NpdGlvbmluZ1xuICAgICAgICApO1xuICAgICAgICBjdXJyZW50UmVzaXplID0ge1xuICAgICAgICAgIGVkZ2VzLFxuICAgICAgICAgIHN0YXJ0aW5nUmVjdCxcbiAgICAgICAgICBjdXJyZW50UmVjdDogc3RhcnRpbmdSZWN0XG4gICAgICAgIH07XG4gICAgICAgIGlmICh0aGlzLmVuYWJsZUdob3N0UmVzaXplKSB7XG4gICAgICAgICAgY3VycmVudFJlc2l6ZS5jbG9uZWROb2RlID0gdGhpcy5lbG0ubmF0aXZlRWxlbWVudC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgY29uc3QgcmVzaXplQ3Vyc29yczogUmVzaXplQ3Vyc29ycyA9IE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgICB7fSxcbiAgICAgICAgICAgIERFRkFVTFRfUkVTSVpFX0NVUlNPUlMsXG4gICAgICAgICAgICB0aGlzLnJlc2l6ZUN1cnNvcnNcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMuZWxtLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZChcbiAgICAgICAgICAgIGN1cnJlbnRSZXNpemUuY2xvbmVkTm9kZVxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShcbiAgICAgICAgICAgIHRoaXMuZWxtLm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICAndmlzaWJpbGl0eScsXG4gICAgICAgICAgICAnaGlkZGVuJ1xuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShcbiAgICAgICAgICAgIGN1cnJlbnRSZXNpemUuY2xvbmVkTm9kZSxcbiAgICAgICAgICAgICdwb3NpdGlvbicsXG4gICAgICAgICAgICB0aGlzLmdob3N0RWxlbWVudFBvc2l0aW9uaW5nXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKFxuICAgICAgICAgICAgY3VycmVudFJlc2l6ZS5jbG9uZWROb2RlLFxuICAgICAgICAgICAgJ2xlZnQnLFxuICAgICAgICAgICAgYCR7Y3VycmVudFJlc2l6ZS5zdGFydGluZ1JlY3QubGVmdH1weGBcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgICAgICBjdXJyZW50UmVzaXplLmNsb25lZE5vZGUsXG4gICAgICAgICAgICAndG9wJyxcbiAgICAgICAgICAgIGAke2N1cnJlbnRSZXNpemUuc3RhcnRpbmdSZWN0LnRvcH1weGBcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgICAgICBjdXJyZW50UmVzaXplLmNsb25lZE5vZGUsXG4gICAgICAgICAgICAnaGVpZ2h0JyxcbiAgICAgICAgICAgIGAke2N1cnJlbnRSZXNpemUuc3RhcnRpbmdSZWN0LmhlaWdodH1weGBcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgICAgICBjdXJyZW50UmVzaXplLmNsb25lZE5vZGUsXG4gICAgICAgICAgICAnd2lkdGgnLFxuICAgICAgICAgICAgYCR7Y3VycmVudFJlc2l6ZS5zdGFydGluZ1JlY3Qud2lkdGh9cHhgXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKFxuICAgICAgICAgICAgY3VycmVudFJlc2l6ZS5jbG9uZWROb2RlLFxuICAgICAgICAgICAgJ2N1cnNvcicsXG4gICAgICAgICAgICBnZXRSZXNpemVDdXJzb3IoY3VycmVudFJlc2l6ZS5lZGdlcywgcmVzaXplQ3Vyc29ycylcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3MoXG4gICAgICAgICAgICBjdXJyZW50UmVzaXplLmNsb25lZE5vZGUsXG4gICAgICAgICAgICBSRVNJWkVfR0hPU1RfRUxFTUVOVF9DTEFTU1xuICAgICAgICAgICk7XG4gICAgICAgICAgY3VycmVudFJlc2l6ZS5jbG9uZWROb2RlIS5zY3JvbGxUb3AgPSBjdXJyZW50UmVzaXplLnN0YXJ0aW5nUmVjdFxuICAgICAgICAgICAgLnNjcm9sbFRvcCBhcyBudW1iZXI7XG4gICAgICAgICAgY3VycmVudFJlc2l6ZS5jbG9uZWROb2RlIS5zY3JvbGxMZWZ0ID0gY3VycmVudFJlc2l6ZS5zdGFydGluZ1JlY3RcbiAgICAgICAgICAgIC5zY3JvbGxMZWZ0IGFzIG51bWJlcjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnJlc2l6ZVN0YXJ0LmVtaXQoe1xuICAgICAgICAgICAgZWRnZXM6IGdldEVkZ2VzRGlmZih7XG4gICAgICAgICAgICAgIGVkZ2VzLFxuICAgICAgICAgICAgICBpbml0aWFsUmVjdGFuZ2xlOiBzdGFydGluZ1JlY3QsXG4gICAgICAgICAgICAgIG5ld1JlY3RhbmdsZTogc3RhcnRpbmdSZWN0XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHJlY3RhbmdsZTogZ2V0TmV3Qm91bmRpbmdSZWN0YW5nbGUoc3RhcnRpbmdSZWN0LCB7fSwgMCwgMClcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIHRoaXMubW91c2V1cC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKGN1cnJlbnRSZXNpemUpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmVsbS5uYXRpdmVFbGVtZW50LCBSRVNJWkVfQUNUSVZFX0NMQVNTKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShkb2N1bWVudC5ib2R5LCAnY3Vyc29yJywgJycpO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxtLm5hdGl2ZUVsZW1lbnQsICdjdXJzb3InLCAnJyk7XG4gICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMucmVzaXplRW5kLmVtaXQoe1xuICAgICAgICAgICAgZWRnZXM6IGdldEVkZ2VzRGlmZih7XG4gICAgICAgICAgICAgIGVkZ2VzOiBjdXJyZW50UmVzaXplIS5lZGdlcyxcbiAgICAgICAgICAgICAgaW5pdGlhbFJlY3RhbmdsZTogY3VycmVudFJlc2l6ZSEuc3RhcnRpbmdSZWN0LFxuICAgICAgICAgICAgICBuZXdSZWN0YW5nbGU6IGN1cnJlbnRSZXNpemUhLmN1cnJlbnRSZWN0XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHJlY3RhbmdsZTogY3VycmVudFJlc2l6ZSEuY3VycmVudFJlY3RcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJlbW92ZUdob3N0RWxlbWVudCgpO1xuICAgICAgICBjdXJyZW50UmVzaXplID0gbnVsbDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLm1vdXNlZG93bi5jb21wbGV0ZSgpO1xuICAgIHRoaXMubW91c2V1cC5jb21wbGV0ZSgpO1xuICAgIHRoaXMubW91c2Vtb3ZlLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5kZXN0cm95JC5uZXh0KCk7XG4gIH1cblxuICBwcml2YXRlIHNldEVsZW1lbnRDbGFzcyhlbG06IEVsZW1lbnRSZWYsIG5hbWU6IHN0cmluZywgYWRkOiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKGFkZCkge1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyhlbG0ubmF0aXZlRWxlbWVudCwgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3MoZWxtLm5hdGl2ZUVsZW1lbnQsIG5hbWUpO1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBQb2ludGVyRXZlbnRMaXN0ZW5lcnMge1xuICBwdWJsaWMgcG9pbnRlckRvd246IE9ic2VydmFibGU8UG9pbnRlckV2ZW50Q29vcmRpbmF0ZT47XG5cbiAgcHVibGljIHBvaW50ZXJNb3ZlOiBPYnNlcnZhYmxlPFBvaW50ZXJFdmVudENvb3JkaW5hdGU+O1xuXG4gIHB1YmxpYyBwb2ludGVyVXA6IE9ic2VydmFibGU8UG9pbnRlckV2ZW50Q29vcmRpbmF0ZT47XG5cbiAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IFBvaW50ZXJFdmVudExpc3RlbmVyczsgLy8gdHNsaW50OmRpc2FibGUtbGluZVxuXG4gIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoXG4gICAgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICB6b25lOiBOZ1pvbmVcbiAgKTogUG9pbnRlckV2ZW50TGlzdGVuZXJzIHtcbiAgICBpZiAoIVBvaW50ZXJFdmVudExpc3RlbmVycy5pbnN0YW5jZSkge1xuICAgICAgUG9pbnRlckV2ZW50TGlzdGVuZXJzLmluc3RhbmNlID0gbmV3IFBvaW50ZXJFdmVudExpc3RlbmVycyhcbiAgICAgICAgcmVuZGVyZXIsXG4gICAgICAgIHpvbmVcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBQb2ludGVyRXZlbnRMaXN0ZW5lcnMuaW5zdGFuY2U7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihyZW5kZXJlcjogUmVuZGVyZXIyLCB6b25lOiBOZ1pvbmUpIHtcbiAgICB0aGlzLnBvaW50ZXJEb3duID0gbmV3IE9ic2VydmFibGUoXG4gICAgICAob2JzZXJ2ZXI6IE9ic2VydmVyPFBvaW50ZXJFdmVudENvb3JkaW5hdGU+KSA9PiB7XG4gICAgICAgIGxldCB1bnN1YnNjcmliZU1vdXNlRG93bjogKCkgPT4gdm9pZDtcbiAgICAgICAgbGV0IHVuc3Vic2NyaWJlVG91Y2hTdGFydDogKCkgPT4gdm9pZDtcblxuICAgICAgICB6b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICB1bnN1YnNjcmliZU1vdXNlRG93biA9IHJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICAgICdkb2N1bWVudCcsXG4gICAgICAgICAgICAnbW91c2Vkb3duJyxcbiAgICAgICAgICAgIChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0KHtcbiAgICAgICAgICAgICAgICBjbGllbnRYOiBldmVudC5jbGllbnRYLFxuICAgICAgICAgICAgICAgIGNsaWVudFk6IGV2ZW50LmNsaWVudFksXG4gICAgICAgICAgICAgICAgZXZlbnRcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcblxuICAgICAgICAgIHVuc3Vic2NyaWJlVG91Y2hTdGFydCA9IHJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICAgICdkb2N1bWVudCcsXG4gICAgICAgICAgICAndG91Y2hzdGFydCcsXG4gICAgICAgICAgICAoZXZlbnQ6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh7XG4gICAgICAgICAgICAgICAgY2xpZW50WDogZXZlbnQudG91Y2hlc1swXS5jbGllbnRYLFxuICAgICAgICAgICAgICAgIGNsaWVudFk6IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WSxcbiAgICAgICAgICAgICAgICBldmVudFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgIHVuc3Vic2NyaWJlTW91c2VEb3duKCk7XG4gICAgICAgICAgdW5zdWJzY3JpYmVUb3VjaFN0YXJ0KCk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgKS5waXBlKHNoYXJlKCkpO1xuXG4gICAgdGhpcy5wb2ludGVyTW92ZSA9IG5ldyBPYnNlcnZhYmxlKFxuICAgICAgKG9ic2VydmVyOiBPYnNlcnZlcjxQb2ludGVyRXZlbnRDb29yZGluYXRlPikgPT4ge1xuICAgICAgICBsZXQgdW5zdWJzY3JpYmVNb3VzZU1vdmU6ICgpID0+IHZvaWQ7XG4gICAgICAgIGxldCB1bnN1YnNjcmliZVRvdWNoTW92ZTogKCkgPT4gdm9pZDtcblxuICAgICAgICB6b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICB1bnN1YnNjcmliZU1vdXNlTW92ZSA9IHJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICAgICdkb2N1bWVudCcsXG4gICAgICAgICAgICAnbW91c2Vtb3ZlJyxcbiAgICAgICAgICAgIChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0KHtcbiAgICAgICAgICAgICAgICBjbGllbnRYOiBldmVudC5jbGllbnRYLFxuICAgICAgICAgICAgICAgIGNsaWVudFk6IGV2ZW50LmNsaWVudFksXG4gICAgICAgICAgICAgICAgZXZlbnRcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcblxuICAgICAgICAgIHVuc3Vic2NyaWJlVG91Y2hNb3ZlID0gcmVuZGVyZXIubGlzdGVuKFxuICAgICAgICAgICAgJ2RvY3VtZW50JyxcbiAgICAgICAgICAgICd0b3VjaG1vdmUnLFxuICAgICAgICAgICAgKGV2ZW50OiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIG9ic2VydmVyLm5leHQoe1xuICAgICAgICAgICAgICAgIGNsaWVudFg6IGV2ZW50LnRhcmdldFRvdWNoZXNbMF0uY2xpZW50WCxcbiAgICAgICAgICAgICAgICBjbGllbnRZOiBldmVudC50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFksXG4gICAgICAgICAgICAgICAgZXZlbnRcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICB1bnN1YnNjcmliZU1vdXNlTW92ZSgpO1xuICAgICAgICAgIHVuc3Vic2NyaWJlVG91Y2hNb3ZlKCk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgKS5waXBlKHNoYXJlKCkpO1xuXG4gICAgdGhpcy5wb2ludGVyVXAgPSBuZXcgT2JzZXJ2YWJsZShcbiAgICAgIChvYnNlcnZlcjogT2JzZXJ2ZXI8UG9pbnRlckV2ZW50Q29vcmRpbmF0ZT4pID0+IHtcbiAgICAgICAgbGV0IHVuc3Vic2NyaWJlTW91c2VVcDogKCkgPT4gdm9pZDtcbiAgICAgICAgbGV0IHVuc3Vic2NyaWJlVG91Y2hFbmQ6ICgpID0+IHZvaWQ7XG4gICAgICAgIGxldCB1bnN1YnNjcmliZVRvdWNoQ2FuY2VsOiAoKSA9PiB2b2lkO1xuXG4gICAgICAgIHpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgIHVuc3Vic2NyaWJlTW91c2VVcCA9IHJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICAgICdkb2N1bWVudCcsXG4gICAgICAgICAgICAnbW91c2V1cCcsXG4gICAgICAgICAgICAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh7XG4gICAgICAgICAgICAgICAgY2xpZW50WDogZXZlbnQuY2xpZW50WCxcbiAgICAgICAgICAgICAgICBjbGllbnRZOiBldmVudC5jbGllbnRZLFxuICAgICAgICAgICAgICAgIGV2ZW50XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICB1bnN1YnNjcmliZVRvdWNoRW5kID0gcmVuZGVyZXIubGlzdGVuKFxuICAgICAgICAgICAgJ2RvY3VtZW50JyxcbiAgICAgICAgICAgICd0b3VjaGVuZCcsXG4gICAgICAgICAgICAoZXZlbnQ6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh7XG4gICAgICAgICAgICAgICAgY2xpZW50WDogZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCxcbiAgICAgICAgICAgICAgICBjbGllbnRZOiBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZLFxuICAgICAgICAgICAgICAgIGV2ZW50XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICB1bnN1YnNjcmliZVRvdWNoQ2FuY2VsID0gcmVuZGVyZXIubGlzdGVuKFxuICAgICAgICAgICAgJ2RvY3VtZW50JyxcbiAgICAgICAgICAgICd0b3VjaGNhbmNlbCcsXG4gICAgICAgICAgICAoZXZlbnQ6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh7XG4gICAgICAgICAgICAgICAgY2xpZW50WDogZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCxcbiAgICAgICAgICAgICAgICBjbGllbnRZOiBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZLFxuICAgICAgICAgICAgICAgIGV2ZW50XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgdW5zdWJzY3JpYmVNb3VzZVVwKCk7XG4gICAgICAgICAgdW5zdWJzY3JpYmVUb3VjaEVuZCgpO1xuICAgICAgICAgIHVuc3Vic2NyaWJlVG91Y2hDYW5jZWwoKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICApLnBpcGUoc2hhcmUoKSk7XG4gIH1cbn1cbiJdfQ==