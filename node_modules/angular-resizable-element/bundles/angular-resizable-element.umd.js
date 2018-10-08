(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('angular-resizable-element', ['exports', '@angular/core', 'rxjs', 'rxjs/operators'], factory) :
    (factory((global['angular-resizable-element'] = {}),global.ng.core,global.rxjs,global.rxjs.operators));
}(this, (function (exports,core,rxjs,operators) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }

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
    function isNumberCloseTo(value1, value2, precision) {
        if (precision === void 0) {
            precision = 3;
        }
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
    var MOUSE_MOVE_THROTTLE_MS = 50;
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
            this.resizeStart = new core.EventEmitter();
            /**
             * Called as the mouse is dragged after a resize event has begun. `$event` is a `ResizeEvent` object.
             */
            this.resizing = new core.EventEmitter();
            /**
             * Called after the mouse is released after a resize event. `$event` is a `ResizeEvent` object.
             */
            this.resizeEnd = new core.EventEmitter();
            /**
             * @hidden
             */
            this.mouseup = new rxjs.Subject();
            /**
             * @hidden
             */
            this.mousedown = new rxjs.Subject();
            /**
             * @hidden
             */
            this.mousemove = new rxjs.Subject();
            this.destroy$ = new rxjs.Subject();
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
                    .pipe(operators.takeUntil(this.destroy$))
                    .subscribe(function (_a) {
                    var clientX = _a.clientX, clientY = _a.clientY;
                    _this.mousedown.next({ clientX: clientX, clientY: clientY });
                });
                this.pointerEventListeners.pointerMove
                    .pipe(operators.takeUntil(this.destroy$))
                    .subscribe(function (_a) {
                    var clientX = _a.clientX, clientY = _a.clientY, event = _a.event;
                    _this.mousemove.next({ clientX: clientX, clientY: clientY, event: event });
                });
                this.pointerEventListeners.pointerUp
                    .pipe(operators.takeUntil(this.destroy$))
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
                var mouseMove = this.mousemove.pipe(operators.share());
                mouseMove.pipe(operators.filter(function () { return !!currentResize; })).subscribe(function (_a) {
                    var event = _a.event;
                    event.preventDefault();
                });
                mouseMove
                    .pipe(operators.auditTime(MOUSE_MOVE_THROTTLE_MS))
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
                    .pipe(operators.mergeMap(function (startCoords) {
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
                    return rxjs.merge(mouseMove.pipe(operators.take(1)).pipe(operators.map(function (coords) { return [, coords]; })), mouseMove.pipe(operators.pairwise()))
                        .pipe(operators.map(function (_a) {
                        var _b = __read(_a, 2), previousCoords = _b[0], newCoords = _b[1];
                        return [
                            previousCoords ? getDiff(previousCoords) : previousCoords,
                            getDiff(newCoords)
                        ];
                    }))
                        .pipe(operators.filter(function (_a) {
                        var _b = __read(_a, 2), previousCoords = _b[0], newCoords = _b[1];
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
                        .pipe(operators.map(function (_a) {
                        var _b = __read(_a, 2), newCoords = _b[1];
                        /** @type {?} */
                        var snapGrid = getSnapGrid();
                        return {
                            clientX: Math.round(newCoords.clientX / snapGrid.x) * snapGrid.x,
                            clientY: Math.round(newCoords.clientY / snapGrid.y) * snapGrid.y
                        };
                    }))
                        .pipe(operators.takeUntil(rxjs.merge(_this.mouseup, _this.mousedown)));
                }))
                    .pipe(operators.filter(function () { return !!currentResize; }));
                mousedrag
                    .pipe(operators.map(function (_a) {
                    var clientX = _a.clientX, clientY = _a.clientY;
                    return getNewBoundingRectangle(/** @type {?} */ ((currentResize)).startingRect, /** @type {?} */ ((currentResize)).edges, clientX, clientY);
                }))
                    .pipe(operators.filter(function (newBoundingRect) {
                    return (_this.allowNegativeResizes ||
                        !!(newBoundingRect.height &&
                            newBoundingRect.width &&
                            newBoundingRect.height > 0 &&
                            newBoundingRect.width > 0));
                }))
                    .pipe(operators.filter(function (newBoundingRect) {
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
                    .pipe(operators.map(function (_a) {
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
                    .pipe(operators.filter(function (edges) {
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
            { type: core.Directive, args: [{
                        selector: '[mwlResizable]'
                    },] }
        ];
        /** @nocollapse */
        ResizableDirective.ctorParameters = function () {
            return [
                { type: core.Renderer2 },
                { type: core.ElementRef },
                { type: core.NgZone }
            ];
        };
        ResizableDirective.propDecorators = {
            validateResize: [{ type: core.Input }],
            resizeEdges: [{ type: core.Input }],
            enableGhostResize: [{ type: core.Input }],
            resizeSnapGrid: [{ type: core.Input }],
            resizeCursors: [{ type: core.Input }],
            resizeCursorPrecision: [{ type: core.Input }],
            ghostElementPositioning: [{ type: core.Input }],
            allowNegativeResizes: [{ type: core.Input }],
            resizeStart: [{ type: core.Output }],
            resizing: [{ type: core.Output }],
            resizeEnd: [{ type: core.Output }]
        };
        return ResizableDirective;
    }());
    var PointerEventListeners = /** @class */ (function () {
        function PointerEventListeners(renderer, zone) {
            this.pointerDown = new rxjs.Observable(function (observer) {
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
            }).pipe(operators.share());
            this.pointerMove = new rxjs.Observable(function (observer) {
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
            }).pipe(operators.share());
            this.pointerUp = new rxjs.Observable(function (observer) {
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
            }).pipe(operators.share());
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
    var ResizeHandleDirective = /** @class */ (function () {
        function ResizeHandleDirective(renderer, element, zone, resizable) {
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
        ResizeHandleDirective.prototype.ngOnDestroy = /**
         * @return {?}
         */
            function () {
                this.unsubscribeEventListeners();
            };
        /**
         * @hidden
         */
        /**
         * @hidden
         * @param {?} event
         * @param {?} clientX
         * @param {?} clientY
         * @return {?}
         */
        ResizeHandleDirective.prototype.onMousedown = /**
         * @hidden
         * @param {?} event
         * @param {?} clientX
         * @param {?} clientY
         * @return {?}
         */
            function (event, clientX, clientY) {
                var _this = this;
                event.preventDefault();
                this.zone.runOutsideAngular(function () {
                    if (!_this.eventListeners.touchmove) {
                        _this.eventListeners.touchmove = _this.renderer.listen(_this.element.nativeElement, 'touchmove', function (touchMoveEvent) {
                            _this.onMousemove(touchMoveEvent, touchMoveEvent.targetTouches[0].clientX, touchMoveEvent.targetTouches[0].clientY);
                        });
                    }
                    if (!_this.eventListeners.mousemove) {
                        _this.eventListeners.mousemove = _this.renderer.listen(_this.element.nativeElement, 'mousemove', function (mouseMoveEvent) {
                            _this.onMousemove(mouseMoveEvent, mouseMoveEvent.clientX, mouseMoveEvent.clientY);
                        });
                    }
                    _this.resizable.mousedown.next({
                        clientX: clientX,
                        clientY: clientY,
                        edges: _this.resizeEdges
                    });
                });
            };
        /**
         * @hidden
         */
        /**
         * @hidden
         * @param {?} clientX
         * @param {?} clientY
         * @return {?}
         */
        ResizeHandleDirective.prototype.onMouseup = /**
         * @hidden
         * @param {?} clientX
         * @param {?} clientY
         * @return {?}
         */
            function (clientX, clientY) {
                var _this = this;
                this.zone.runOutsideAngular(function () {
                    _this.unsubscribeEventListeners();
                    _this.resizable.mouseup.next({
                        clientX: clientX,
                        clientY: clientY,
                        edges: _this.resizeEdges
                    });
                });
            };
        /**
         * @param {?} event
         * @param {?} clientX
         * @param {?} clientY
         * @return {?}
         */
        ResizeHandleDirective.prototype.onMousemove = /**
         * @param {?} event
         * @param {?} clientX
         * @param {?} clientY
         * @return {?}
         */
            function (event, clientX, clientY) {
                this.resizable.mousemove.next({
                    clientX: clientX,
                    clientY: clientY,
                    edges: this.resizeEdges,
                    event: event
                });
            };
        /**
         * @return {?}
         */
        ResizeHandleDirective.prototype.unsubscribeEventListeners = /**
         * @return {?}
         */
            function () {
                var _this = this;
                Object.keys(this.eventListeners).forEach(function (type) {
                    ( /** @type {?} */(_this)).eventListeners[type]();
                    delete _this.eventListeners[type];
                });
            };
        ResizeHandleDirective.decorators = [
            { type: core.Directive, args: [{
                        selector: '[mwlResizeHandle]'
                    },] }
        ];
        /** @nocollapse */
        ResizeHandleDirective.ctorParameters = function () {
            return [
                { type: core.Renderer2 },
                { type: core.ElementRef },
                { type: core.NgZone },
                { type: ResizableDirective }
            ];
        };
        ResizeHandleDirective.propDecorators = {
            resizeEdges: [{ type: core.Input }],
            onMousedown: [{ type: core.HostListener, args: ['touchstart', [
                            '$event',
                            '$event.touches[0].clientX',
                            '$event.touches[0].clientY'
                        ],] }, { type: core.HostListener, args: ['mousedown', ['$event', '$event.clientX', '$event.clientY'],] }],
            onMouseup: [{ type: core.HostListener, args: ['touchend', [
                            '$event.changedTouches[0].clientX',
                            '$event.changedTouches[0].clientY'
                        ],] }, { type: core.HostListener, args: ['touchcancel', [
                            '$event.changedTouches[0].clientX',
                            '$event.changedTouches[0].clientY'
                        ],] }, { type: core.HostListener, args: ['mouseup', ['$event.clientX', '$event.clientY'],] }]
        };
        return ResizeHandleDirective;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var ResizableModule = /** @class */ (function () {
        function ResizableModule() {
        }
        ResizableModule.decorators = [
            { type: core.NgModule, args: [{
                        declarations: [ResizableDirective, ResizeHandleDirective],
                        exports: [ResizableDirective, ResizeHandleDirective]
                    },] }
        ];
        return ResizableModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    exports.ResizableDirective = ResizableDirective;
    exports.ResizeHandleDirective = ResizeHandleDirective;
    exports.ResizableModule = ResizableModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1yZXNpemFibGUtZWxlbWVudC51bWQuanMubWFwIiwic291cmNlcyI6W251bGwsIm5nOi8vYW5ndWxhci1yZXNpemFibGUtZWxlbWVudC9yZXNpemFibGUuZGlyZWN0aXZlLnRzIiwibmc6Ly9hbmd1bGFyLXJlc2l6YWJsZS1lbGVtZW50L3Jlc2l6ZS1oYW5kbGUuZGlyZWN0aXZlLnRzIiwibmc6Ly9hbmd1bGFyLXJlc2l6YWJsZS1lbGVtZW50L3Jlc2l6YWJsZS5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2VcclxudGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGVcclxuTGljZW5zZSBhdCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblRISVMgQ09ERSBJUyBQUk9WSURFRCBPTiBBTiAqQVMgSVMqIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcclxuS0lORCwgRUlUSEVSIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIFdJVEhPVVQgTElNSVRBVElPTiBBTlkgSU1QTElFRFxyXG5XQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgVElUTEUsIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLFxyXG5NRVJDSEFOVEFCTElUWSBPUiBOT04tSU5GUklOR0VNRU5ULlxyXG5cclxuU2VlIHRoZSBBcGFjaGUgVmVyc2lvbiAyLjAgTGljZW5zZSBmb3Igc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zXHJcbmFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24oZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIGlmIChlLmluZGV4T2YocFtpXSkgPCAwKVxyXG4gICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgcmVzdWx0W2tdID0gbW9kW2tdO1xyXG4gICAgcmVzdWx0LmRlZmF1bHQgPSBtb2Q7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG4iLCJpbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIFJlbmRlcmVyMixcbiAgRWxlbWVudFJlZixcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIElucHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIE9uRGVzdHJveSxcbiAgTmdab25lXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU3ViamVjdCwgT2JzZXJ2YWJsZSwgT2JzZXJ2ZXIsIG1lcmdlLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIG1hcCxcbiAgbWVyZ2VNYXAsXG4gIHRha2VVbnRpbCxcbiAgZmlsdGVyLFxuICBwYWlyd2lzZSxcbiAgdGFrZSxcbiAgc2hhcmUsXG4gIGF1ZGl0VGltZVxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBFZGdlcyB9IGZyb20gJy4vaW50ZXJmYWNlcy9lZGdlcy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQm91bmRpbmdSZWN0YW5nbGUgfSBmcm9tICcuL2ludGVyZmFjZXMvYm91bmRpbmctcmVjdGFuZ2xlLmludGVyZmFjZSc7XG5pbXBvcnQgeyBSZXNpemVFdmVudCB9IGZyb20gJy4vaW50ZXJmYWNlcy9yZXNpemUtZXZlbnQuaW50ZXJmYWNlJztcblxuaW50ZXJmYWNlIFBvaW50ZXJFdmVudENvb3JkaW5hdGUge1xuICBjbGllbnRYOiBudW1iZXI7XG4gIGNsaWVudFk6IG51bWJlcjtcbiAgZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50O1xufVxuXG5pbnRlcmZhY2UgQ29vcmRpbmF0ZSB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xufVxuXG5mdW5jdGlvbiBpc051bWJlckNsb3NlVG8oXG4gIHZhbHVlMTogbnVtYmVyLFxuICB2YWx1ZTI6IG51bWJlcixcbiAgcHJlY2lzaW9uOiBudW1iZXIgPSAzXG4pOiBib29sZWFuIHtcbiAgY29uc3QgZGlmZjogbnVtYmVyID0gTWF0aC5hYnModmFsdWUxIC0gdmFsdWUyKTtcbiAgcmV0dXJuIGRpZmYgPCBwcmVjaXNpb247XG59XG5cbmZ1bmN0aW9uIGdldE5ld0JvdW5kaW5nUmVjdGFuZ2xlKFxuICBzdGFydGluZ1JlY3Q6IEJvdW5kaW5nUmVjdGFuZ2xlLFxuICBlZGdlczogRWRnZXMsXG4gIGNsaWVudFg6IG51bWJlcixcbiAgY2xpZW50WTogbnVtYmVyXG4pOiBCb3VuZGluZ1JlY3RhbmdsZSB7XG4gIGNvbnN0IG5ld0JvdW5kaW5nUmVjdDogQm91bmRpbmdSZWN0YW5nbGUgPSB7XG4gICAgdG9wOiBzdGFydGluZ1JlY3QudG9wLFxuICAgIGJvdHRvbTogc3RhcnRpbmdSZWN0LmJvdHRvbSxcbiAgICBsZWZ0OiBzdGFydGluZ1JlY3QubGVmdCxcbiAgICByaWdodDogc3RhcnRpbmdSZWN0LnJpZ2h0XG4gIH07XG5cbiAgaWYgKGVkZ2VzLnRvcCkge1xuICAgIG5ld0JvdW5kaW5nUmVjdC50b3AgKz0gY2xpZW50WTtcbiAgfVxuICBpZiAoZWRnZXMuYm90dG9tKSB7XG4gICAgbmV3Qm91bmRpbmdSZWN0LmJvdHRvbSArPSBjbGllbnRZO1xuICB9XG4gIGlmIChlZGdlcy5sZWZ0KSB7XG4gICAgbmV3Qm91bmRpbmdSZWN0LmxlZnQgKz0gY2xpZW50WDtcbiAgfVxuICBpZiAoZWRnZXMucmlnaHQpIHtcbiAgICBuZXdCb3VuZGluZ1JlY3QucmlnaHQgKz0gY2xpZW50WDtcbiAgfVxuICBuZXdCb3VuZGluZ1JlY3QuaGVpZ2h0ID0gbmV3Qm91bmRpbmdSZWN0LmJvdHRvbSAtIG5ld0JvdW5kaW5nUmVjdC50b3A7XG4gIG5ld0JvdW5kaW5nUmVjdC53aWR0aCA9IG5ld0JvdW5kaW5nUmVjdC5yaWdodCAtIG5ld0JvdW5kaW5nUmVjdC5sZWZ0O1xuXG4gIHJldHVybiBuZXdCb3VuZGluZ1JlY3Q7XG59XG5cbmZ1bmN0aW9uIGdldEVsZW1lbnRSZWN0KFxuICBlbGVtZW50OiBFbGVtZW50UmVmLFxuICBnaG9zdEVsZW1lbnRQb3NpdGlvbmluZzogc3RyaW5nXG4pOiBCb3VuZGluZ1JlY3RhbmdsZSB7XG4gIGxldCB0cmFuc2xhdGVYID0gMDtcbiAgbGV0IHRyYW5zbGF0ZVkgPSAwO1xuICBjb25zdCBzdHlsZSA9IGVsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZTtcbiAgY29uc3QgdHJhbnNmb3JtUHJvcGVydGllcyA9IFtcbiAgICAndHJhbnNmb3JtJyxcbiAgICAnLW1zLXRyYW5zZm9ybScsXG4gICAgJy1tb3otdHJhbnNmb3JtJyxcbiAgICAnLW8tdHJhbnNmb3JtJ1xuICBdO1xuICBjb25zdCB0cmFuc2Zvcm0gPSB0cmFuc2Zvcm1Qcm9wZXJ0aWVzXG4gICAgLm1hcChwcm9wZXJ0eSA9PiBzdHlsZVtwcm9wZXJ0eV0pXG4gICAgLmZpbmQodmFsdWUgPT4gISF2YWx1ZSk7XG4gIGlmICh0cmFuc2Zvcm0gJiYgdHJhbnNmb3JtLmluY2x1ZGVzKCd0cmFuc2xhdGUnKSkge1xuICAgIHRyYW5zbGF0ZVggPSB0cmFuc2Zvcm0ucmVwbGFjZSgvLip0cmFuc2xhdGVcXCgoLiopcHgsICguKilweFxcKS4qLywgJyQxJyk7XG4gICAgdHJhbnNsYXRlWSA9IHRyYW5zZm9ybS5yZXBsYWNlKC8uKnRyYW5zbGF0ZVxcKCguKilweCwgKC4qKXB4XFwpLiovLCAnJDInKTtcbiAgfVxuXG4gIGlmIChnaG9zdEVsZW1lbnRQb3NpdGlvbmluZyA9PT0gJ2Fic29sdXRlJykge1xuICAgIHJldHVybiB7XG4gICAgICBoZWlnaHQ6IGVsZW1lbnQubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQsXG4gICAgICB3aWR0aDogZWxlbWVudC5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoLFxuICAgICAgdG9wOiBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQub2Zmc2V0VG9wIC0gdHJhbnNsYXRlWSxcbiAgICAgIGJvdHRvbTpcbiAgICAgICAgZWxlbWVudC5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodCArXG4gICAgICAgIGVsZW1lbnQubmF0aXZlRWxlbWVudC5vZmZzZXRUb3AgLVxuICAgICAgICB0cmFuc2xhdGVZLFxuICAgICAgbGVmdDogZWxlbWVudC5uYXRpdmVFbGVtZW50Lm9mZnNldExlZnQgLSB0cmFuc2xhdGVYLFxuICAgICAgcmlnaHQ6XG4gICAgICAgIGVsZW1lbnQubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aCArXG4gICAgICAgIGVsZW1lbnQubmF0aXZlRWxlbWVudC5vZmZzZXRMZWZ0IC1cbiAgICAgICAgdHJhbnNsYXRlWFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgYm91bmRpbmdSZWN0OiBCb3VuZGluZ1JlY3RhbmdsZSA9IGVsZW1lbnQubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICByZXR1cm4ge1xuICAgICAgaGVpZ2h0OiBib3VuZGluZ1JlY3QuaGVpZ2h0LFxuICAgICAgd2lkdGg6IGJvdW5kaW5nUmVjdC53aWR0aCxcbiAgICAgIHRvcDogYm91bmRpbmdSZWN0LnRvcCAtIHRyYW5zbGF0ZVksXG4gICAgICBib3R0b206IGJvdW5kaW5nUmVjdC5ib3R0b20gLSB0cmFuc2xhdGVZLFxuICAgICAgbGVmdDogYm91bmRpbmdSZWN0LmxlZnQgLSB0cmFuc2xhdGVYLFxuICAgICAgcmlnaHQ6IGJvdW5kaW5nUmVjdC5yaWdodCAtIHRyYW5zbGF0ZVgsXG4gICAgICBzY3JvbGxUb3A6IGVsZW1lbnQubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AsXG4gICAgICBzY3JvbGxMZWZ0OiBlbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc2Nyb2xsTGVmdFxuICAgIH07XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNXaXRoaW5Cb3VuZGluZ1koe1xuICBjbGllbnRZLFxuICByZWN0XG59OiB7XG4gIGNsaWVudFk6IG51bWJlcjtcbiAgcmVjdDogQ2xpZW50UmVjdDtcbn0pOiBib29sZWFuIHtcbiAgcmV0dXJuIGNsaWVudFkgPj0gcmVjdC50b3AgJiYgY2xpZW50WSA8PSByZWN0LmJvdHRvbTtcbn1cblxuZnVuY3Rpb24gaXNXaXRoaW5Cb3VuZGluZ1goe1xuICBjbGllbnRYLFxuICByZWN0XG59OiB7XG4gIGNsaWVudFg6IG51bWJlcjtcbiAgcmVjdDogQ2xpZW50UmVjdDtcbn0pOiBib29sZWFuIHtcbiAgcmV0dXJuIGNsaWVudFggPj0gcmVjdC5sZWZ0ICYmIGNsaWVudFggPD0gcmVjdC5yaWdodDtcbn1cblxuZnVuY3Rpb24gZ2V0UmVzaXplRWRnZXMoe1xuICBjbGllbnRYLFxuICBjbGllbnRZLFxuICBlbG0sXG4gIGFsbG93ZWRFZGdlcyxcbiAgY3Vyc29yUHJlY2lzaW9uXG59OiB7XG4gIGNsaWVudFg6IG51bWJlcjtcbiAgY2xpZW50WTogbnVtYmVyO1xuICBlbG06IEVsZW1lbnRSZWY7XG4gIGFsbG93ZWRFZGdlczogRWRnZXM7XG4gIGN1cnNvclByZWNpc2lvbjogbnVtYmVyO1xufSk6IEVkZ2VzIHtcbiAgY29uc3QgZWxtUG9zaXRpb246IENsaWVudFJlY3QgPSBlbG0ubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3QgZWRnZXM6IEVkZ2VzID0ge307XG5cbiAgaWYgKFxuICAgIGFsbG93ZWRFZGdlcy5sZWZ0ICYmXG4gICAgaXNOdW1iZXJDbG9zZVRvKGNsaWVudFgsIGVsbVBvc2l0aW9uLmxlZnQsIGN1cnNvclByZWNpc2lvbikgJiZcbiAgICBpc1dpdGhpbkJvdW5kaW5nWSh7IGNsaWVudFksIHJlY3Q6IGVsbVBvc2l0aW9uIH0pXG4gICkge1xuICAgIGVkZ2VzLmxlZnQgPSB0cnVlO1xuICB9XG5cbiAgaWYgKFxuICAgIGFsbG93ZWRFZGdlcy5yaWdodCAmJlxuICAgIGlzTnVtYmVyQ2xvc2VUbyhjbGllbnRYLCBlbG1Qb3NpdGlvbi5yaWdodCwgY3Vyc29yUHJlY2lzaW9uKSAmJlxuICAgIGlzV2l0aGluQm91bmRpbmdZKHsgY2xpZW50WSwgcmVjdDogZWxtUG9zaXRpb24gfSlcbiAgKSB7XG4gICAgZWRnZXMucmlnaHQgPSB0cnVlO1xuICB9XG5cbiAgaWYgKFxuICAgIGFsbG93ZWRFZGdlcy50b3AgJiZcbiAgICBpc051bWJlckNsb3NlVG8oY2xpZW50WSwgZWxtUG9zaXRpb24udG9wLCBjdXJzb3JQcmVjaXNpb24pICYmXG4gICAgaXNXaXRoaW5Cb3VuZGluZ1goeyBjbGllbnRYLCByZWN0OiBlbG1Qb3NpdGlvbiB9KVxuICApIHtcbiAgICBlZGdlcy50b3AgPSB0cnVlO1xuICB9XG5cbiAgaWYgKFxuICAgIGFsbG93ZWRFZGdlcy5ib3R0b20gJiZcbiAgICBpc051bWJlckNsb3NlVG8oY2xpZW50WSwgZWxtUG9zaXRpb24uYm90dG9tLCBjdXJzb3JQcmVjaXNpb24pICYmXG4gICAgaXNXaXRoaW5Cb3VuZGluZ1goeyBjbGllbnRYLCByZWN0OiBlbG1Qb3NpdGlvbiB9KVxuICApIHtcbiAgICBlZGdlcy5ib3R0b20gPSB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGVkZ2VzO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlc2l6ZUN1cnNvcnMge1xuICB0b3BMZWZ0OiBzdHJpbmc7XG4gIHRvcFJpZ2h0OiBzdHJpbmc7XG4gIGJvdHRvbUxlZnQ6IHN0cmluZztcbiAgYm90dG9tUmlnaHQ6IHN0cmluZztcbiAgbGVmdE9yUmlnaHQ6IHN0cmluZztcbiAgdG9wT3JCb3R0b206IHN0cmluZztcbn1cblxuY29uc3QgREVGQVVMVF9SRVNJWkVfQ1VSU09SUzogUmVzaXplQ3Vyc29ycyA9IE9iamVjdC5mcmVlemUoe1xuICB0b3BMZWZ0OiAnbnctcmVzaXplJyxcbiAgdG9wUmlnaHQ6ICduZS1yZXNpemUnLFxuICBib3R0b21MZWZ0OiAnc3ctcmVzaXplJyxcbiAgYm90dG9tUmlnaHQ6ICdzZS1yZXNpemUnLFxuICBsZWZ0T3JSaWdodDogJ2NvbC1yZXNpemUnLFxuICB0b3BPckJvdHRvbTogJ3Jvdy1yZXNpemUnXG59KTtcblxuZnVuY3Rpb24gZ2V0UmVzaXplQ3Vyc29yKGVkZ2VzOiBFZGdlcywgY3Vyc29yczogUmVzaXplQ3Vyc29ycyk6IHN0cmluZyB7XG4gIGlmIChlZGdlcy5sZWZ0ICYmIGVkZ2VzLnRvcCkge1xuICAgIHJldHVybiBjdXJzb3JzLnRvcExlZnQ7XG4gIH0gZWxzZSBpZiAoZWRnZXMucmlnaHQgJiYgZWRnZXMudG9wKSB7XG4gICAgcmV0dXJuIGN1cnNvcnMudG9wUmlnaHQ7XG4gIH0gZWxzZSBpZiAoZWRnZXMubGVmdCAmJiBlZGdlcy5ib3R0b20pIHtcbiAgICByZXR1cm4gY3Vyc29ycy5ib3R0b21MZWZ0O1xuICB9IGVsc2UgaWYgKGVkZ2VzLnJpZ2h0ICYmIGVkZ2VzLmJvdHRvbSkge1xuICAgIHJldHVybiBjdXJzb3JzLmJvdHRvbVJpZ2h0O1xuICB9IGVsc2UgaWYgKGVkZ2VzLmxlZnQgfHwgZWRnZXMucmlnaHQpIHtcbiAgICByZXR1cm4gY3Vyc29ycy5sZWZ0T3JSaWdodDtcbiAgfSBlbHNlIGlmIChlZGdlcy50b3AgfHwgZWRnZXMuYm90dG9tKSB7XG4gICAgcmV0dXJuIGN1cnNvcnMudG9wT3JCb3R0b207XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldEVkZ2VzRGlmZih7XG4gIGVkZ2VzLFxuICBpbml0aWFsUmVjdGFuZ2xlLFxuICBuZXdSZWN0YW5nbGVcbn06IHtcbiAgZWRnZXM6IEVkZ2VzO1xuICBpbml0aWFsUmVjdGFuZ2xlOiBCb3VuZGluZ1JlY3RhbmdsZTtcbiAgbmV3UmVjdGFuZ2xlOiBCb3VuZGluZ1JlY3RhbmdsZTtcbn0pOiBFZGdlcyB7XG4gIGNvbnN0IGVkZ2VzRGlmZjogRWRnZXMgPSB7fTtcbiAgT2JqZWN0LmtleXMoZWRnZXMpLmZvckVhY2goZWRnZSA9PiB7XG4gICAgZWRnZXNEaWZmW2VkZ2VdID0gKG5ld1JlY3RhbmdsZVtlZGdlXSB8fCAwKSAtIChpbml0aWFsUmVjdGFuZ2xlW2VkZ2VdIHx8IDApO1xuICB9KTtcbiAgcmV0dXJuIGVkZ2VzRGlmZjtcbn1cblxuY29uc3QgUkVTSVpFX0FDVElWRV9DTEFTUzogc3RyaW5nID0gJ3Jlc2l6ZS1hY3RpdmUnO1xuY29uc3QgUkVTSVpFX0xFRlRfSE9WRVJfQ0xBU1M6IHN0cmluZyA9ICdyZXNpemUtbGVmdC1ob3Zlcic7XG5jb25zdCBSRVNJWkVfUklHSFRfSE9WRVJfQ0xBU1M6IHN0cmluZyA9ICdyZXNpemUtcmlnaHQtaG92ZXInO1xuY29uc3QgUkVTSVpFX1RPUF9IT1ZFUl9DTEFTUzogc3RyaW5nID0gJ3Jlc2l6ZS10b3AtaG92ZXInO1xuY29uc3QgUkVTSVpFX0JPVFRPTV9IT1ZFUl9DTEFTUzogc3RyaW5nID0gJ3Jlc2l6ZS1ib3R0b20taG92ZXInO1xuY29uc3QgUkVTSVpFX0dIT1NUX0VMRU1FTlRfQ0xBU1M6IHN0cmluZyA9ICdyZXNpemUtZ2hvc3QtZWxlbWVudCc7XG5cbmV4cG9ydCBjb25zdCBNT1VTRV9NT1ZFX1RIUk9UVExFX01TOiBudW1iZXIgPSA1MDtcblxuLyoqXG4gKiBQbGFjZSB0aGlzIG9uIGFuIGVsZW1lbnQgdG8gbWFrZSBpdCByZXNpemFibGUuIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYGh0bWxcbiAqIDxkaXZcbiAqICAgbXdsUmVzaXphYmxlXG4gKiAgIFtyZXNpemVFZGdlc109XCJ7Ym90dG9tOiB0cnVlLCByaWdodDogdHJ1ZSwgdG9wOiB0cnVlLCBsZWZ0OiB0cnVlfVwiXG4gKiAgIFtlbmFibGVHaG9zdFJlc2l6ZV09XCJ0cnVlXCI+XG4gKiA8L2Rpdj5cbiAqIGBgYFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbXdsUmVzaXphYmxlXSdcbn0pXG5leHBvcnQgY2xhc3MgUmVzaXphYmxlRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogQSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIGJlZm9yZSBlYWNoIHJlc2l6ZSBldmVudC4gUmV0dXJuIGB0cnVlYCB0byBhbGxvdyB0aGUgcmVzaXplIGV2ZW50IHRvIHByb3BhZ2F0ZSBvciBgZmFsc2VgIHRvIGNhbmNlbCBpdFxuICAgKi9cbiAgQElucHV0KClcbiAgdmFsaWRhdGVSZXNpemU6IChyZXNpemVFdmVudDogUmVzaXplRXZlbnQpID0+IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBlZGdlcyB0aGF0IGFuIGVsZW1lbnQgY2FuIGJlIHJlc2l6ZWQgZnJvbS4gUGFzcyBhbiBvYmplY3QgbGlrZSBge3RvcDogdHJ1ZSwgYm90dG9tOiBmYWxzZX1gLiBCeSBkZWZhdWx0IG5vIGVkZ2VzIGNhbiBiZSByZXNpemVkLlxuICAgKi9cbiAgQElucHV0KClcbiAgcmVzaXplRWRnZXM6IEVkZ2VzID0ge307XG5cbiAgLyoqXG4gICAqIFNldCB0byBgdHJ1ZWAgdG8gZW5hYmxlIGEgdGVtcG9yYXJ5IHJlc2l6aW5nIGVmZmVjdCBvZiB0aGUgZWxlbWVudCBpbiBiZXR3ZWVuIHRoZSBgcmVzaXplU3RhcnRgIGFuZCBgcmVzaXplRW5kYCBldmVudHMuXG4gICAqL1xuICBASW5wdXQoKVxuICBlbmFibGVHaG9zdFJlc2l6ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBBIHNuYXAgZ3JpZCB0aGF0IHJlc2l6ZSBldmVudHMgd2lsbCBiZSBsb2NrZWQgdG8uXG4gICAqXG4gICAqIGUuZy4gdG8gb25seSBhbGxvdyB0aGUgZWxlbWVudCB0byBiZSByZXNpemVkIGV2ZXJ5IDEwcHggc2V0IGl0IHRvIGB7bGVmdDogMTAsIHJpZ2h0OiAxMH1gXG4gICAqL1xuICBASW5wdXQoKVxuICByZXNpemVTbmFwR3JpZDogRWRnZXMgPSB7fTtcblxuICAvKipcbiAgICogVGhlIG1vdXNlIGN1cnNvcnMgdGhhdCB3aWxsIGJlIHNldCBvbiB0aGUgcmVzaXplIGVkZ2VzXG4gICAqL1xuICBASW5wdXQoKVxuICByZXNpemVDdXJzb3JzOiBSZXNpemVDdXJzb3JzID0gREVGQVVMVF9SRVNJWkVfQ1VSU09SUztcblxuICAvKipcbiAgICogTW91c2Ugb3ZlciB0aGlja25lc3MgdG8gYWN0aXZlIGN1cnNvci5cbiAgICovXG4gIEBJbnB1dCgpXG4gIHJlc2l6ZUN1cnNvclByZWNpc2lvbjogbnVtYmVyID0gMztcblxuICAvKipcbiAgICogRGVmaW5lIHRoZSBwb3NpdGlvbmluZyBvZiB0aGUgZ2hvc3QgZWxlbWVudCAoY2FuIGJlIGZpeGVkIG9yIGFic29sdXRlKVxuICAgKi9cbiAgQElucHV0KClcbiAgZ2hvc3RFbGVtZW50UG9zaXRpb25pbmc6ICdmaXhlZCcgfCAnYWJzb2x1dGUnID0gJ2ZpeGVkJztcblxuICAvKipcbiAgICogQWxsb3cgZWxlbWVudHMgdG8gYmUgcmVzaXplZCB0byBuZWdhdGl2ZSBkaW1lbnNpb25zXG4gICAqL1xuICBASW5wdXQoKVxuICBhbGxvd05lZ2F0aXZlUmVzaXplczogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgbW91c2UgaXMgcHJlc3NlZCBhbmQgYSByZXNpemUgZXZlbnQgaXMgYWJvdXQgdG8gYmVnaW4uIGAkZXZlbnRgIGlzIGEgYFJlc2l6ZUV2ZW50YCBvYmplY3QuXG4gICAqL1xuICBAT3V0cHV0KClcbiAgcmVzaXplU3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPFJlc2l6ZUV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgYXMgdGhlIG1vdXNlIGlzIGRyYWdnZWQgYWZ0ZXIgYSByZXNpemUgZXZlbnQgaGFzIGJlZ3VuLiBgJGV2ZW50YCBpcyBhIGBSZXNpemVFdmVudGAgb2JqZWN0LlxuICAgKi9cbiAgQE91dHB1dCgpXG4gIHJlc2l6aW5nID0gbmV3IEV2ZW50RW1pdHRlcjxSZXNpemVFdmVudD4oKTtcblxuICAvKipcbiAgICogQ2FsbGVkIGFmdGVyIHRoZSBtb3VzZSBpcyByZWxlYXNlZCBhZnRlciBhIHJlc2l6ZSBldmVudC4gYCRldmVudGAgaXMgYSBgUmVzaXplRXZlbnRgIG9iamVjdC5cbiAgICovXG4gIEBPdXRwdXQoKVxuICByZXNpemVFbmQgPSBuZXcgRXZlbnRFbWl0dGVyPFJlc2l6ZUV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBwdWJsaWMgbW91c2V1cCA9IG5ldyBTdWJqZWN0PHtcbiAgICBjbGllbnRYOiBudW1iZXI7XG4gICAgY2xpZW50WTogbnVtYmVyO1xuICAgIGVkZ2VzPzogRWRnZXM7XG4gIH0+KCk7XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIHB1YmxpYyBtb3VzZWRvd24gPSBuZXcgU3ViamVjdDx7XG4gICAgY2xpZW50WDogbnVtYmVyO1xuICAgIGNsaWVudFk6IG51bWJlcjtcbiAgICBlZGdlcz86IEVkZ2VzO1xuICB9PigpO1xuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBwdWJsaWMgbW91c2Vtb3ZlID0gbmV3IFN1YmplY3Q8e1xuICAgIGNsaWVudFg6IG51bWJlcjtcbiAgICBjbGllbnRZOiBudW1iZXI7XG4gICAgZWRnZXM/OiBFZGdlcztcbiAgICBldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQ7XG4gIH0+KCk7XG5cbiAgcHJpdmF0ZSBwb2ludGVyRXZlbnRMaXN0ZW5lcnM6IFBvaW50ZXJFdmVudExpc3RlbmVycztcblxuICBwcml2YXRlIGRlc3Ryb3kkID0gbmV3IFN1YmplY3QoKTtcblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHB1YmxpYyBlbG06IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSB6b25lOiBOZ1pvbmVcbiAgKSB7XG4gICAgdGhpcy5wb2ludGVyRXZlbnRMaXN0ZW5lcnMgPSBQb2ludGVyRXZlbnRMaXN0ZW5lcnMuZ2V0SW5zdGFuY2UoXG4gICAgICByZW5kZXJlcixcbiAgICAgIHpvbmVcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEBoaWRkZW5cbiAgICovXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIC8vIFRPRE8gLSB1c2Ugc29tZSBmYW5jeSBPYnNlcnZhYmxlLm1lcmdlJ3MgZm9yIHRoaXNcbiAgICB0aGlzLnBvaW50ZXJFdmVudExpc3RlbmVycy5wb2ludGVyRG93blxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgLnN1YnNjcmliZSgoeyBjbGllbnRYLCBjbGllbnRZIH0pID0+IHtcbiAgICAgICAgdGhpcy5tb3VzZWRvd24ubmV4dCh7IGNsaWVudFgsIGNsaWVudFkgfSk7XG4gICAgICB9KTtcblxuICAgIHRoaXMucG9pbnRlckV2ZW50TGlzdGVuZXJzLnBvaW50ZXJNb3ZlXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXG4gICAgICAuc3Vic2NyaWJlKCh7IGNsaWVudFgsIGNsaWVudFksIGV2ZW50IH0pID0+IHtcbiAgICAgICAgdGhpcy5tb3VzZW1vdmUubmV4dCh7IGNsaWVudFgsIGNsaWVudFksIGV2ZW50IH0pO1xuICAgICAgfSk7XG5cbiAgICB0aGlzLnBvaW50ZXJFdmVudExpc3RlbmVycy5wb2ludGVyVXBcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSlcbiAgICAgIC5zdWJzY3JpYmUoKHsgY2xpZW50WCwgY2xpZW50WSB9KSA9PiB7XG4gICAgICAgIHRoaXMubW91c2V1cC5uZXh0KHsgY2xpZW50WCwgY2xpZW50WSB9KTtcbiAgICAgIH0pO1xuXG4gICAgbGV0IGN1cnJlbnRSZXNpemU6IHtcbiAgICAgIGVkZ2VzOiBFZGdlcztcbiAgICAgIHN0YXJ0aW5nUmVjdDogQm91bmRpbmdSZWN0YW5nbGU7XG4gICAgICBjdXJyZW50UmVjdDogQm91bmRpbmdSZWN0YW5nbGU7XG4gICAgICBjbG9uZWROb2RlPzogSFRNTEVsZW1lbnQ7XG4gICAgfSB8IG51bGw7XG5cbiAgICBjb25zdCByZW1vdmVHaG9zdEVsZW1lbnQgPSAoKSA9PiB7XG4gICAgICBpZiAoY3VycmVudFJlc2l6ZSAmJiBjdXJyZW50UmVzaXplLmNsb25lZE5vZGUpIHtcbiAgICAgICAgdGhpcy5lbG0ubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKFxuICAgICAgICAgIGN1cnJlbnRSZXNpemUuY2xvbmVkTm9kZVxuICAgICAgICApO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxtLm5hdGl2ZUVsZW1lbnQsICd2aXNpYmlsaXR5JywgJ2luaGVyaXQnKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgbW91c2VNb3ZlOiBPYnNlcnZhYmxlPGFueT4gPSB0aGlzLm1vdXNlbW92ZS5waXBlKHNoYXJlKCkpO1xuXG4gICAgbW91c2VNb3ZlLnBpcGUoZmlsdGVyKCgpID0+ICEhY3VycmVudFJlc2l6ZSkpLnN1YnNjcmliZSgoeyBldmVudCB9KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0pO1xuXG4gICAgbW91c2VNb3ZlXG4gICAgICAucGlwZShhdWRpdFRpbWUoTU9VU0VfTU9WRV9USFJPVFRMRV9NUykpXG4gICAgICAuc3Vic2NyaWJlKCh7IGNsaWVudFgsIGNsaWVudFkgfSkgPT4ge1xuICAgICAgICBjb25zdCByZXNpemVFZGdlczogRWRnZXMgPSBnZXRSZXNpemVFZGdlcyh7XG4gICAgICAgICAgY2xpZW50WCxcbiAgICAgICAgICBjbGllbnRZLFxuICAgICAgICAgIGVsbTogdGhpcy5lbG0sXG4gICAgICAgICAgYWxsb3dlZEVkZ2VzOiB0aGlzLnJlc2l6ZUVkZ2VzLFxuICAgICAgICAgIGN1cnNvclByZWNpc2lvbjogdGhpcy5yZXNpemVDdXJzb3JQcmVjaXNpb25cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHJlc2l6ZUN1cnNvcnM6IFJlc2l6ZUN1cnNvcnMgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICAgIHt9LFxuICAgICAgICAgIERFRkFVTFRfUkVTSVpFX0NVUlNPUlMsXG4gICAgICAgICAgdGhpcy5yZXNpemVDdXJzb3JzXG4gICAgICAgICk7XG4gICAgICAgIGlmIChjdXJyZW50UmVzaXplKSB7XG4gICAgICAgICAgY29uc3QgY3Vyc29yOiBzdHJpbmcgPSBnZXRSZXNpemVDdXJzb3IoXG4gICAgICAgICAgICBjdXJyZW50UmVzaXplLmVkZ2VzLFxuICAgICAgICAgICAgcmVzaXplQ3Vyc29yc1xuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShkb2N1bWVudC5ib2R5LCAnY3Vyc29yJywgY3Vyc29yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBjdXJzb3I6IHN0cmluZyA9IGdldFJlc2l6ZUN1cnNvcihyZXNpemVFZGdlcywgcmVzaXplQ3Vyc29ycyk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsbS5uYXRpdmVFbGVtZW50LCAnY3Vyc29yJywgY3Vyc29yKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldEVsZW1lbnRDbGFzcyh0aGlzLmVsbSwgUkVTSVpFX0FDVElWRV9DTEFTUywgISFjdXJyZW50UmVzaXplKTtcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50Q2xhc3MoXG4gICAgICAgICAgdGhpcy5lbG0sXG4gICAgICAgICAgUkVTSVpFX0xFRlRfSE9WRVJfQ0xBU1MsXG4gICAgICAgICAgcmVzaXplRWRnZXMubGVmdCA9PT0gdHJ1ZVxuICAgICAgICApO1xuICAgICAgICB0aGlzLnNldEVsZW1lbnRDbGFzcyhcbiAgICAgICAgICB0aGlzLmVsbSxcbiAgICAgICAgICBSRVNJWkVfUklHSFRfSE9WRVJfQ0xBU1MsXG4gICAgICAgICAgcmVzaXplRWRnZXMucmlnaHQgPT09IHRydWVcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50Q2xhc3MoXG4gICAgICAgICAgdGhpcy5lbG0sXG4gICAgICAgICAgUkVTSVpFX1RPUF9IT1ZFUl9DTEFTUyxcbiAgICAgICAgICByZXNpemVFZGdlcy50b3AgPT09IHRydWVcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zZXRFbGVtZW50Q2xhc3MoXG4gICAgICAgICAgdGhpcy5lbG0sXG4gICAgICAgICAgUkVTSVpFX0JPVFRPTV9IT1ZFUl9DTEFTUyxcbiAgICAgICAgICByZXNpemVFZGdlcy5ib3R0b20gPT09IHRydWVcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuXG4gICAgY29uc3QgbW91c2VkcmFnOiBPYnNlcnZhYmxlPGFueT4gPSB0aGlzLm1vdXNlZG93blxuICAgICAgLnBpcGUoXG4gICAgICAgIG1lcmdlTWFwKHN0YXJ0Q29vcmRzID0+IHtcbiAgICAgICAgICBmdW5jdGlvbiBnZXREaWZmKG1vdmVDb29yZHM6IHsgY2xpZW50WDogbnVtYmVyOyBjbGllbnRZOiBudW1iZXIgfSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgY2xpZW50WDogbW92ZUNvb3Jkcy5jbGllbnRYIC0gc3RhcnRDb29yZHMuY2xpZW50WCxcbiAgICAgICAgICAgICAgY2xpZW50WTogbW92ZUNvb3Jkcy5jbGllbnRZIC0gc3RhcnRDb29yZHMuY2xpZW50WVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBnZXRTbmFwR3JpZCA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNuYXBHcmlkOiBDb29yZGluYXRlID0geyB4OiAxLCB5OiAxIH07XG5cbiAgICAgICAgICAgIGlmIChjdXJyZW50UmVzaXplKSB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLnJlc2l6ZVNuYXBHcmlkLmxlZnQgJiYgY3VycmVudFJlc2l6ZS5lZGdlcy5sZWZ0KSB7XG4gICAgICAgICAgICAgICAgc25hcEdyaWQueCA9ICt0aGlzLnJlc2l6ZVNuYXBHcmlkLmxlZnQ7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNpemVTbmFwR3JpZC5yaWdodCAmJlxuICAgICAgICAgICAgICAgIGN1cnJlbnRSZXNpemUuZWRnZXMucmlnaHRcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgc25hcEdyaWQueCA9ICt0aGlzLnJlc2l6ZVNuYXBHcmlkLnJpZ2h0O1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKHRoaXMucmVzaXplU25hcEdyaWQudG9wICYmIGN1cnJlbnRSZXNpemUuZWRnZXMudG9wKSB7XG4gICAgICAgICAgICAgICAgc25hcEdyaWQueSA9ICt0aGlzLnJlc2l6ZVNuYXBHcmlkLnRvcDtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZVNuYXBHcmlkLmJvdHRvbSAmJlxuICAgICAgICAgICAgICAgIGN1cnJlbnRSZXNpemUuZWRnZXMuYm90dG9tXG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHNuYXBHcmlkLnkgPSArdGhpcy5yZXNpemVTbmFwR3JpZC5ib3R0b207XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHNuYXBHcmlkO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICBmdW5jdGlvbiBnZXRHcmlkKFxuICAgICAgICAgICAgY29vcmRzOiB7IGNsaWVudFg6IG51bWJlcjsgY2xpZW50WTogbnVtYmVyIH0sXG4gICAgICAgICAgICBzbmFwR3JpZDogQ29vcmRpbmF0ZVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgeDogTWF0aC5jZWlsKGNvb3Jkcy5jbGllbnRYIC8gc25hcEdyaWQueCksXG4gICAgICAgICAgICAgIHk6IE1hdGguY2VpbChjb29yZHMuY2xpZW50WSAvIHNuYXBHcmlkLnkpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBtZXJnZShcbiAgICAgICAgICAgIG1vdXNlTW92ZS5waXBlKHRha2UoMSkpLnBpcGUobWFwKGNvb3JkcyA9PiBbLCBjb29yZHNdKSksXG4gICAgICAgICAgICBtb3VzZU1vdmUucGlwZShwYWlyd2lzZSgpKVxuICAgICAgICAgIClcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICBtYXAoKFtwcmV2aW91c0Nvb3JkcywgbmV3Q29vcmRzXSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgICBwcmV2aW91c0Nvb3JkcyA/IGdldERpZmYocHJldmlvdXNDb29yZHMpIDogcHJldmlvdXNDb29yZHMsXG4gICAgICAgICAgICAgICAgICBnZXREaWZmKG5ld0Nvb3JkcylcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgIGZpbHRlcigoW3ByZXZpb3VzQ29vcmRzLCBuZXdDb29yZHNdKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFwcmV2aW91c0Nvb3Jkcykge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3Qgc25hcEdyaWQ6IENvb3JkaW5hdGUgPSBnZXRTbmFwR3JpZCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzR3JpZDogQ29vcmRpbmF0ZSA9IGdldEdyaWQoXG4gICAgICAgICAgICAgICAgICBwcmV2aW91c0Nvb3JkcyxcbiAgICAgICAgICAgICAgICAgIHNuYXBHcmlkXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdHcmlkOiBDb29yZGluYXRlID0gZ2V0R3JpZChuZXdDb29yZHMsIHNuYXBHcmlkKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICBwcmV2aW91c0dyaWQueCAhPT0gbmV3R3JpZC54IHx8IHByZXZpb3VzR3JpZC55ICE9PSBuZXdHcmlkLnlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgIG1hcCgoWywgbmV3Q29vcmRzXSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNuYXBHcmlkOiBDb29yZGluYXRlID0gZ2V0U25hcEdyaWQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgY2xpZW50WDpcbiAgICAgICAgICAgICAgICAgICAgTWF0aC5yb3VuZChuZXdDb29yZHMuY2xpZW50WCAvIHNuYXBHcmlkLngpICogc25hcEdyaWQueCxcbiAgICAgICAgICAgICAgICAgIGNsaWVudFk6XG4gICAgICAgICAgICAgICAgICAgIE1hdGgucm91bmQobmV3Q29vcmRzLmNsaWVudFkgLyBzbmFwR3JpZC55KSAqIHNuYXBHcmlkLnlcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKG1lcmdlKHRoaXMubW91c2V1cCwgdGhpcy5tb3VzZWRvd24pKSk7XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgICAucGlwZShmaWx0ZXIoKCkgPT4gISFjdXJyZW50UmVzaXplKSk7XG5cbiAgICBtb3VzZWRyYWdcbiAgICAgIC5waXBlKFxuICAgICAgICBtYXAoKHsgY2xpZW50WCwgY2xpZW50WSB9KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGdldE5ld0JvdW5kaW5nUmVjdGFuZ2xlKFxuICAgICAgICAgICAgY3VycmVudFJlc2l6ZSEuc3RhcnRpbmdSZWN0LFxuICAgICAgICAgICAgY3VycmVudFJlc2l6ZSEuZWRnZXMsXG4gICAgICAgICAgICBjbGllbnRYLFxuICAgICAgICAgICAgY2xpZW50WVxuICAgICAgICAgICk7XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgICAucGlwZShcbiAgICAgICAgZmlsdGVyKChuZXdCb3VuZGluZ1JlY3Q6IEJvdW5kaW5nUmVjdGFuZ2xlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIHRoaXMuYWxsb3dOZWdhdGl2ZVJlc2l6ZXMgfHxcbiAgICAgICAgICAgICEhKFxuICAgICAgICAgICAgICBuZXdCb3VuZGluZ1JlY3QuaGVpZ2h0ICYmXG4gICAgICAgICAgICAgIG5ld0JvdW5kaW5nUmVjdC53aWR0aCAmJlxuICAgICAgICAgICAgICBuZXdCb3VuZGluZ1JlY3QuaGVpZ2h0ID4gMCAmJlxuICAgICAgICAgICAgICBuZXdCb3VuZGluZ1JlY3Qud2lkdGggPiAwXG4gICAgICAgICAgICApXG4gICAgICAgICAgKTtcbiAgICAgICAgfSlcbiAgICAgIClcbiAgICAgIC5waXBlKFxuICAgICAgICBmaWx0ZXIoKG5ld0JvdW5kaW5nUmVjdDogQm91bmRpbmdSZWN0YW5nbGUpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy52YWxpZGF0ZVJlc2l6ZVxuICAgICAgICAgICAgPyB0aGlzLnZhbGlkYXRlUmVzaXplKHtcbiAgICAgICAgICAgICAgICByZWN0YW5nbGU6IG5ld0JvdW5kaW5nUmVjdCxcbiAgICAgICAgICAgICAgICBlZGdlczogZ2V0RWRnZXNEaWZmKHtcbiAgICAgICAgICAgICAgICAgIGVkZ2VzOiBjdXJyZW50UmVzaXplIS5lZGdlcyxcbiAgICAgICAgICAgICAgICAgIGluaXRpYWxSZWN0YW5nbGU6IGN1cnJlbnRSZXNpemUhLnN0YXJ0aW5nUmVjdCxcbiAgICAgICAgICAgICAgICAgIG5ld1JlY3RhbmdsZTogbmV3Qm91bmRpbmdSZWN0XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIDogdHJ1ZTtcbiAgICAgICAgfSlcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKG5ld0JvdW5kaW5nUmVjdDogQm91bmRpbmdSZWN0YW5nbGUpID0+IHtcbiAgICAgICAgaWYgKGN1cnJlbnRSZXNpemUgJiYgY3VycmVudFJlc2l6ZS5jbG9uZWROb2RlKSB7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShcbiAgICAgICAgICAgIGN1cnJlbnRSZXNpemUuY2xvbmVkTm9kZSxcbiAgICAgICAgICAgICdoZWlnaHQnLFxuICAgICAgICAgICAgYCR7bmV3Qm91bmRpbmdSZWN0LmhlaWdodH1weGBcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgICAgICBjdXJyZW50UmVzaXplLmNsb25lZE5vZGUsXG4gICAgICAgICAgICAnd2lkdGgnLFxuICAgICAgICAgICAgYCR7bmV3Qm91bmRpbmdSZWN0LndpZHRofXB4YFxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShcbiAgICAgICAgICAgIGN1cnJlbnRSZXNpemUuY2xvbmVkTm9kZSxcbiAgICAgICAgICAgICd0b3AnLFxuICAgICAgICAgICAgYCR7bmV3Qm91bmRpbmdSZWN0LnRvcH1weGBcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgICAgICBjdXJyZW50UmVzaXplLmNsb25lZE5vZGUsXG4gICAgICAgICAgICAnbGVmdCcsXG4gICAgICAgICAgICBgJHtuZXdCb3VuZGluZ1JlY3QubGVmdH1weGBcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZXNpemluZy5lbWl0KHtcbiAgICAgICAgICAgIGVkZ2VzOiBnZXRFZGdlc0RpZmYoe1xuICAgICAgICAgICAgICBlZGdlczogY3VycmVudFJlc2l6ZSEuZWRnZXMsXG4gICAgICAgICAgICAgIGluaXRpYWxSZWN0YW5nbGU6IGN1cnJlbnRSZXNpemUhLnN0YXJ0aW5nUmVjdCxcbiAgICAgICAgICAgICAgbmV3UmVjdGFuZ2xlOiBuZXdCb3VuZGluZ1JlY3RcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgcmVjdGFuZ2xlOiBuZXdCb3VuZGluZ1JlY3RcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY3VycmVudFJlc2l6ZSEuY3VycmVudFJlY3QgPSBuZXdCb3VuZGluZ1JlY3Q7XG4gICAgICB9KTtcblxuICAgIHRoaXMubW91c2Vkb3duXG4gICAgICAucGlwZShcbiAgICAgICAgbWFwKCh7IGNsaWVudFgsIGNsaWVudFksIGVkZ2VzIH0pID0+IHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgZWRnZXMgfHxcbiAgICAgICAgICAgIGdldFJlc2l6ZUVkZ2VzKHtcbiAgICAgICAgICAgICAgY2xpZW50WCxcbiAgICAgICAgICAgICAgY2xpZW50WSxcbiAgICAgICAgICAgICAgZWxtOiB0aGlzLmVsbSxcbiAgICAgICAgICAgICAgYWxsb3dlZEVkZ2VzOiB0aGlzLnJlc2l6ZUVkZ2VzLFxuICAgICAgICAgICAgICBjdXJzb3JQcmVjaXNpb246IHRoaXMucmVzaXplQ3Vyc29yUHJlY2lzaW9uXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICk7XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgICAucGlwZShcbiAgICAgICAgZmlsdGVyKChlZGdlczogRWRnZXMpID0+IHtcbiAgICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMoZWRnZXMpLmxlbmd0aCA+IDA7XG4gICAgICAgIH0pXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKChlZGdlczogRWRnZXMpID0+IHtcbiAgICAgICAgaWYgKGN1cnJlbnRSZXNpemUpIHtcbiAgICAgICAgICByZW1vdmVHaG9zdEVsZW1lbnQoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzdGFydGluZ1JlY3Q6IEJvdW5kaW5nUmVjdGFuZ2xlID0gZ2V0RWxlbWVudFJlY3QoXG4gICAgICAgICAgdGhpcy5lbG0sXG4gICAgICAgICAgdGhpcy5naG9zdEVsZW1lbnRQb3NpdGlvbmluZ1xuICAgICAgICApO1xuICAgICAgICBjdXJyZW50UmVzaXplID0ge1xuICAgICAgICAgIGVkZ2VzLFxuICAgICAgICAgIHN0YXJ0aW5nUmVjdCxcbiAgICAgICAgICBjdXJyZW50UmVjdDogc3RhcnRpbmdSZWN0XG4gICAgICAgIH07XG4gICAgICAgIGlmICh0aGlzLmVuYWJsZUdob3N0UmVzaXplKSB7XG4gICAgICAgICAgY3VycmVudFJlc2l6ZS5jbG9uZWROb2RlID0gdGhpcy5lbG0ubmF0aXZlRWxlbWVudC5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgY29uc3QgcmVzaXplQ3Vyc29yczogUmVzaXplQ3Vyc29ycyA9IE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgICB7fSxcbiAgICAgICAgICAgIERFRkFVTFRfUkVTSVpFX0NVUlNPUlMsXG4gICAgICAgICAgICB0aGlzLnJlc2l6ZUN1cnNvcnNcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMuZWxtLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZChcbiAgICAgICAgICAgIGN1cnJlbnRSZXNpemUuY2xvbmVkTm9kZVxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShcbiAgICAgICAgICAgIHRoaXMuZWxtLm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICAndmlzaWJpbGl0eScsXG4gICAgICAgICAgICAnaGlkZGVuJ1xuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShcbiAgICAgICAgICAgIGN1cnJlbnRSZXNpemUuY2xvbmVkTm9kZSxcbiAgICAgICAgICAgICdwb3NpdGlvbicsXG4gICAgICAgICAgICB0aGlzLmdob3N0RWxlbWVudFBvc2l0aW9uaW5nXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKFxuICAgICAgICAgICAgY3VycmVudFJlc2l6ZS5jbG9uZWROb2RlLFxuICAgICAgICAgICAgJ2xlZnQnLFxuICAgICAgICAgICAgYCR7Y3VycmVudFJlc2l6ZS5zdGFydGluZ1JlY3QubGVmdH1weGBcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgICAgICBjdXJyZW50UmVzaXplLmNsb25lZE5vZGUsXG4gICAgICAgICAgICAndG9wJyxcbiAgICAgICAgICAgIGAke2N1cnJlbnRSZXNpemUuc3RhcnRpbmdSZWN0LnRvcH1weGBcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgICAgICBjdXJyZW50UmVzaXplLmNsb25lZE5vZGUsXG4gICAgICAgICAgICAnaGVpZ2h0JyxcbiAgICAgICAgICAgIGAke2N1cnJlbnRSZXNpemUuc3RhcnRpbmdSZWN0LmhlaWdodH1weGBcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoXG4gICAgICAgICAgICBjdXJyZW50UmVzaXplLmNsb25lZE5vZGUsXG4gICAgICAgICAgICAnd2lkdGgnLFxuICAgICAgICAgICAgYCR7Y3VycmVudFJlc2l6ZS5zdGFydGluZ1JlY3Qud2lkdGh9cHhgXG4gICAgICAgICAgKTtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKFxuICAgICAgICAgICAgY3VycmVudFJlc2l6ZS5jbG9uZWROb2RlLFxuICAgICAgICAgICAgJ2N1cnNvcicsXG4gICAgICAgICAgICBnZXRSZXNpemVDdXJzb3IoY3VycmVudFJlc2l6ZS5lZGdlcywgcmVzaXplQ3Vyc29ycylcbiAgICAgICAgICApO1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3MoXG4gICAgICAgICAgICBjdXJyZW50UmVzaXplLmNsb25lZE5vZGUsXG4gICAgICAgICAgICBSRVNJWkVfR0hPU1RfRUxFTUVOVF9DTEFTU1xuICAgICAgICAgICk7XG4gICAgICAgICAgY3VycmVudFJlc2l6ZS5jbG9uZWROb2RlIS5zY3JvbGxUb3AgPSBjdXJyZW50UmVzaXplLnN0YXJ0aW5nUmVjdFxuICAgICAgICAgICAgLnNjcm9sbFRvcCBhcyBudW1iZXI7XG4gICAgICAgICAgY3VycmVudFJlc2l6ZS5jbG9uZWROb2RlIS5zY3JvbGxMZWZ0ID0gY3VycmVudFJlc2l6ZS5zdGFydGluZ1JlY3RcbiAgICAgICAgICAgIC5zY3JvbGxMZWZ0IGFzIG51bWJlcjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnJlc2l6ZVN0YXJ0LmVtaXQoe1xuICAgICAgICAgICAgZWRnZXM6IGdldEVkZ2VzRGlmZih7XG4gICAgICAgICAgICAgIGVkZ2VzLFxuICAgICAgICAgICAgICBpbml0aWFsUmVjdGFuZ2xlOiBzdGFydGluZ1JlY3QsXG4gICAgICAgICAgICAgIG5ld1JlY3RhbmdsZTogc3RhcnRpbmdSZWN0XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHJlY3RhbmdsZTogZ2V0TmV3Qm91bmRpbmdSZWN0YW5nbGUoc3RhcnRpbmdSZWN0LCB7fSwgMCwgMClcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgIHRoaXMubW91c2V1cC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKGN1cnJlbnRSZXNpemUpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmVsbS5uYXRpdmVFbGVtZW50LCBSRVNJWkVfQUNUSVZFX0NMQVNTKTtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShkb2N1bWVudC5ib2R5LCAnY3Vyc29yJywgJycpO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWxtLm5hdGl2ZUVsZW1lbnQsICdjdXJzb3InLCAnJyk7XG4gICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMucmVzaXplRW5kLmVtaXQoe1xuICAgICAgICAgICAgZWRnZXM6IGdldEVkZ2VzRGlmZih7XG4gICAgICAgICAgICAgIGVkZ2VzOiBjdXJyZW50UmVzaXplIS5lZGdlcyxcbiAgICAgICAgICAgICAgaW5pdGlhbFJlY3RhbmdsZTogY3VycmVudFJlc2l6ZSEuc3RhcnRpbmdSZWN0LFxuICAgICAgICAgICAgICBuZXdSZWN0YW5nbGU6IGN1cnJlbnRSZXNpemUhLmN1cnJlbnRSZWN0XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHJlY3RhbmdsZTogY3VycmVudFJlc2l6ZSEuY3VycmVudFJlY3RcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJlbW92ZUdob3N0RWxlbWVudCgpO1xuICAgICAgICBjdXJyZW50UmVzaXplID0gbnVsbDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLm1vdXNlZG93bi5jb21wbGV0ZSgpO1xuICAgIHRoaXMubW91c2V1cC5jb21wbGV0ZSgpO1xuICAgIHRoaXMubW91c2Vtb3ZlLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5kZXN0cm95JC5uZXh0KCk7XG4gIH1cblxuICBwcml2YXRlIHNldEVsZW1lbnRDbGFzcyhlbG06IEVsZW1lbnRSZWYsIG5hbWU6IHN0cmluZywgYWRkOiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKGFkZCkge1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyhlbG0ubmF0aXZlRWxlbWVudCwgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3MoZWxtLm5hdGl2ZUVsZW1lbnQsIG5hbWUpO1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBQb2ludGVyRXZlbnRMaXN0ZW5lcnMge1xuICBwdWJsaWMgcG9pbnRlckRvd246IE9ic2VydmFibGU8UG9pbnRlckV2ZW50Q29vcmRpbmF0ZT47XG5cbiAgcHVibGljIHBvaW50ZXJNb3ZlOiBPYnNlcnZhYmxlPFBvaW50ZXJFdmVudENvb3JkaW5hdGU+O1xuXG4gIHB1YmxpYyBwb2ludGVyVXA6IE9ic2VydmFibGU8UG9pbnRlckV2ZW50Q29vcmRpbmF0ZT47XG5cbiAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IFBvaW50ZXJFdmVudExpc3RlbmVyczsgLy8gdHNsaW50OmRpc2FibGUtbGluZVxuXG4gIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoXG4gICAgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICB6b25lOiBOZ1pvbmVcbiAgKTogUG9pbnRlckV2ZW50TGlzdGVuZXJzIHtcbiAgICBpZiAoIVBvaW50ZXJFdmVudExpc3RlbmVycy5pbnN0YW5jZSkge1xuICAgICAgUG9pbnRlckV2ZW50TGlzdGVuZXJzLmluc3RhbmNlID0gbmV3IFBvaW50ZXJFdmVudExpc3RlbmVycyhcbiAgICAgICAgcmVuZGVyZXIsXG4gICAgICAgIHpvbmVcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBQb2ludGVyRXZlbnRMaXN0ZW5lcnMuaW5zdGFuY2U7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihyZW5kZXJlcjogUmVuZGVyZXIyLCB6b25lOiBOZ1pvbmUpIHtcbiAgICB0aGlzLnBvaW50ZXJEb3duID0gbmV3IE9ic2VydmFibGUoXG4gICAgICAob2JzZXJ2ZXI6IE9ic2VydmVyPFBvaW50ZXJFdmVudENvb3JkaW5hdGU+KSA9PiB7XG4gICAgICAgIGxldCB1bnN1YnNjcmliZU1vdXNlRG93bjogKCkgPT4gdm9pZDtcbiAgICAgICAgbGV0IHVuc3Vic2NyaWJlVG91Y2hTdGFydDogKCkgPT4gdm9pZDtcblxuICAgICAgICB6b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICB1bnN1YnNjcmliZU1vdXNlRG93biA9IHJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICAgICdkb2N1bWVudCcsXG4gICAgICAgICAgICAnbW91c2Vkb3duJyxcbiAgICAgICAgICAgIChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0KHtcbiAgICAgICAgICAgICAgICBjbGllbnRYOiBldmVudC5jbGllbnRYLFxuICAgICAgICAgICAgICAgIGNsaWVudFk6IGV2ZW50LmNsaWVudFksXG4gICAgICAgICAgICAgICAgZXZlbnRcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcblxuICAgICAgICAgIHVuc3Vic2NyaWJlVG91Y2hTdGFydCA9IHJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICAgICdkb2N1bWVudCcsXG4gICAgICAgICAgICAndG91Y2hzdGFydCcsXG4gICAgICAgICAgICAoZXZlbnQ6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh7XG4gICAgICAgICAgICAgICAgY2xpZW50WDogZXZlbnQudG91Y2hlc1swXS5jbGllbnRYLFxuICAgICAgICAgICAgICAgIGNsaWVudFk6IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WSxcbiAgICAgICAgICAgICAgICBldmVudFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgIHVuc3Vic2NyaWJlTW91c2VEb3duKCk7XG4gICAgICAgICAgdW5zdWJzY3JpYmVUb3VjaFN0YXJ0KCk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgKS5waXBlKHNoYXJlKCkpO1xuXG4gICAgdGhpcy5wb2ludGVyTW92ZSA9IG5ldyBPYnNlcnZhYmxlKFxuICAgICAgKG9ic2VydmVyOiBPYnNlcnZlcjxQb2ludGVyRXZlbnRDb29yZGluYXRlPikgPT4ge1xuICAgICAgICBsZXQgdW5zdWJzY3JpYmVNb3VzZU1vdmU6ICgpID0+IHZvaWQ7XG4gICAgICAgIGxldCB1bnN1YnNjcmliZVRvdWNoTW92ZTogKCkgPT4gdm9pZDtcblxuICAgICAgICB6b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICB1bnN1YnNjcmliZU1vdXNlTW92ZSA9IHJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICAgICdkb2N1bWVudCcsXG4gICAgICAgICAgICAnbW91c2Vtb3ZlJyxcbiAgICAgICAgICAgIChldmVudDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgICBvYnNlcnZlci5uZXh0KHtcbiAgICAgICAgICAgICAgICBjbGllbnRYOiBldmVudC5jbGllbnRYLFxuICAgICAgICAgICAgICAgIGNsaWVudFk6IGV2ZW50LmNsaWVudFksXG4gICAgICAgICAgICAgICAgZXZlbnRcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcblxuICAgICAgICAgIHVuc3Vic2NyaWJlVG91Y2hNb3ZlID0gcmVuZGVyZXIubGlzdGVuKFxuICAgICAgICAgICAgJ2RvY3VtZW50JyxcbiAgICAgICAgICAgICd0b3VjaG1vdmUnLFxuICAgICAgICAgICAgKGV2ZW50OiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIG9ic2VydmVyLm5leHQoe1xuICAgICAgICAgICAgICAgIGNsaWVudFg6IGV2ZW50LnRhcmdldFRvdWNoZXNbMF0uY2xpZW50WCxcbiAgICAgICAgICAgICAgICBjbGllbnRZOiBldmVudC50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFksXG4gICAgICAgICAgICAgICAgZXZlbnRcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICB1bnN1YnNjcmliZU1vdXNlTW92ZSgpO1xuICAgICAgICAgIHVuc3Vic2NyaWJlVG91Y2hNb3ZlKCk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgKS5waXBlKHNoYXJlKCkpO1xuXG4gICAgdGhpcy5wb2ludGVyVXAgPSBuZXcgT2JzZXJ2YWJsZShcbiAgICAgIChvYnNlcnZlcjogT2JzZXJ2ZXI8UG9pbnRlckV2ZW50Q29vcmRpbmF0ZT4pID0+IHtcbiAgICAgICAgbGV0IHVuc3Vic2NyaWJlTW91c2VVcDogKCkgPT4gdm9pZDtcbiAgICAgICAgbGV0IHVuc3Vic2NyaWJlVG91Y2hFbmQ6ICgpID0+IHZvaWQ7XG4gICAgICAgIGxldCB1bnN1YnNjcmliZVRvdWNoQ2FuY2VsOiAoKSA9PiB2b2lkO1xuXG4gICAgICAgIHpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgIHVuc3Vic2NyaWJlTW91c2VVcCA9IHJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICAgICdkb2N1bWVudCcsXG4gICAgICAgICAgICAnbW91c2V1cCcsXG4gICAgICAgICAgICAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh7XG4gICAgICAgICAgICAgICAgY2xpZW50WDogZXZlbnQuY2xpZW50WCxcbiAgICAgICAgICAgICAgICBjbGllbnRZOiBldmVudC5jbGllbnRZLFxuICAgICAgICAgICAgICAgIGV2ZW50XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICB1bnN1YnNjcmliZVRvdWNoRW5kID0gcmVuZGVyZXIubGlzdGVuKFxuICAgICAgICAgICAgJ2RvY3VtZW50JyxcbiAgICAgICAgICAgICd0b3VjaGVuZCcsXG4gICAgICAgICAgICAoZXZlbnQ6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh7XG4gICAgICAgICAgICAgICAgY2xpZW50WDogZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCxcbiAgICAgICAgICAgICAgICBjbGllbnRZOiBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZLFxuICAgICAgICAgICAgICAgIGV2ZW50XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICB1bnN1YnNjcmliZVRvdWNoQ2FuY2VsID0gcmVuZGVyZXIubGlzdGVuKFxuICAgICAgICAgICAgJ2RvY3VtZW50JyxcbiAgICAgICAgICAgICd0b3VjaGNhbmNlbCcsXG4gICAgICAgICAgICAoZXZlbnQ6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh7XG4gICAgICAgICAgICAgICAgY2xpZW50WDogZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCxcbiAgICAgICAgICAgICAgICBjbGllbnRZOiBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZLFxuICAgICAgICAgICAgICAgIGV2ZW50XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgdW5zdWJzY3JpYmVNb3VzZVVwKCk7XG4gICAgICAgICAgdW5zdWJzY3JpYmVUb3VjaEVuZCgpO1xuICAgICAgICAgIHVuc3Vic2NyaWJlVG91Y2hDYW5jZWwoKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICApLnBpcGUoc2hhcmUoKSk7XG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgSW5wdXQsXG4gIEhvc3RMaXN0ZW5lcixcbiAgUmVuZGVyZXIyLFxuICBFbGVtZW50UmVmLFxuICBPbkRlc3Ryb3ksXG4gIE5nWm9uZVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJlc2l6YWJsZURpcmVjdGl2ZSB9IGZyb20gJy4vcmVzaXphYmxlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBFZGdlcyB9IGZyb20gJy4vaW50ZXJmYWNlcy9lZGdlcy5pbnRlcmZhY2UnO1xuXG4vKipcbiAqIEFuIGVsZW1lbnQgcGxhY2VkIGluc2lkZSBhIGBtd2xSZXNpemFibGVgIGRpcmVjdGl2ZSB0byBiZSB1c2VkIGFzIGEgZHJhZyBhbmQgcmVzaXplIGhhbmRsZVxuICpcbiAqIEZvciBleGFtcGxlXG4gKlxuICogYGBgaHRtbFxuICogPGRpdiBtd2xSZXNpemFibGU+XG4gKiAgIDxkaXYgbXdsUmVzaXplSGFuZGxlIFtyZXNpemVFZGdlc109XCJ7Ym90dG9tOiB0cnVlLCByaWdodDogdHJ1ZX1cIj48L2Rpdj5cbiAqIDwvZGl2PlxuICogYGBgXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttd2xSZXNpemVIYW5kbGVdJ1xufSlcbmV4cG9ydCBjbGFzcyBSZXNpemVIYW5kbGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogVGhlIGBFZGdlc2Agb2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIGVkZ2VzIG9mIHRoZSBwYXJlbnQgZWxlbWVudCB0aGF0IGRyYWdnaW5nIHRoZSBoYW5kbGUgd2lsbCB0cmlnZ2VyIGEgcmVzaXplIG9uXG4gICAqL1xuICBASW5wdXQoKVxuICByZXNpemVFZGdlczogRWRnZXMgPSB7fTtcblxuICBwcml2YXRlIGV2ZW50TGlzdGVuZXJzOiB7XG4gICAgdG91Y2htb3ZlPzogKCkgPT4gdm9pZDtcbiAgICBtb3VzZW1vdmU/OiAoKSA9PiB2b2lkO1xuICAgIFtrZXk6IHN0cmluZ106ICgoKSA9PiB2b2lkKSB8IHVuZGVmaW5lZDtcbiAgfSA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcml2YXRlIGVsZW1lbnQ6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSB6b25lOiBOZ1pvbmUsXG4gICAgcHJpdmF0ZSByZXNpemFibGU6IFJlc2l6YWJsZURpcmVjdGl2ZVxuICApIHt9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy51bnN1YnNjcmliZUV2ZW50TGlzdGVuZXJzKCk7XG4gIH1cblxuICAvKipcbiAgICogQGhpZGRlblxuICAgKi9cbiAgQEhvc3RMaXN0ZW5lcigndG91Y2hzdGFydCcsIFtcbiAgICAnJGV2ZW50JyxcbiAgICAnJGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WCcsXG4gICAgJyRldmVudC50b3VjaGVzWzBdLmNsaWVudFknXG4gIF0pXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZG93bicsIFsnJGV2ZW50JywgJyRldmVudC5jbGllbnRYJywgJyRldmVudC5jbGllbnRZJ10pXG4gIG9uTW91c2Vkb3duKFxuICAgIGV2ZW50OiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCxcbiAgICBjbGllbnRYOiBudW1iZXIsXG4gICAgY2xpZW50WTogbnVtYmVyXG4gICk6IHZvaWQge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGlmICghdGhpcy5ldmVudExpc3RlbmVycy50b3VjaG1vdmUpIHtcbiAgICAgICAgdGhpcy5ldmVudExpc3RlbmVycy50b3VjaG1vdmUgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCxcbiAgICAgICAgICAndG91Y2htb3ZlJyxcbiAgICAgICAgICAodG91Y2hNb3ZlRXZlbnQ6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMub25Nb3VzZW1vdmUoXG4gICAgICAgICAgICAgIHRvdWNoTW92ZUV2ZW50LFxuICAgICAgICAgICAgICB0b3VjaE1vdmVFdmVudC50YXJnZXRUb3VjaGVzWzBdLmNsaWVudFgsXG4gICAgICAgICAgICAgIHRvdWNoTW92ZUV2ZW50LnRhcmdldFRvdWNoZXNbMF0uY2xpZW50WVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuZXZlbnRMaXN0ZW5lcnMubW91c2Vtb3ZlKSB7XG4gICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnMubW91c2Vtb3ZlID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oXG4gICAgICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgJ21vdXNlbW92ZScsXG4gICAgICAgICAgKG1vdXNlTW92ZUV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLm9uTW91c2Vtb3ZlKFxuICAgICAgICAgICAgICBtb3VzZU1vdmVFdmVudCxcbiAgICAgICAgICAgICAgbW91c2VNb3ZlRXZlbnQuY2xpZW50WCxcbiAgICAgICAgICAgICAgbW91c2VNb3ZlRXZlbnQuY2xpZW50WVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICB0aGlzLnJlc2l6YWJsZS5tb3VzZWRvd24ubmV4dCh7XG4gICAgICAgIGNsaWVudFgsXG4gICAgICAgIGNsaWVudFksXG4gICAgICAgIGVkZ2VzOiB0aGlzLnJlc2l6ZUVkZ2VzXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaGlkZGVuXG4gICAqL1xuICBASG9zdExpc3RlbmVyKCd0b3VjaGVuZCcsIFtcbiAgICAnJGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFgnLFxuICAgICckZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WSdcbiAgXSlcbiAgQEhvc3RMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCBbXG4gICAgJyRldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYJyxcbiAgICAnJGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFknXG4gIF0pXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNldXAnLCBbJyRldmVudC5jbGllbnRYJywgJyRldmVudC5jbGllbnRZJ10pXG4gIG9uTW91c2V1cChjbGllbnRYOiBudW1iZXIsIGNsaWVudFk6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLnVuc3Vic2NyaWJlRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICAgIHRoaXMucmVzaXphYmxlLm1vdXNldXAubmV4dCh7XG4gICAgICAgIGNsaWVudFgsXG4gICAgICAgIGNsaWVudFksXG4gICAgICAgIGVkZ2VzOiB0aGlzLnJlc2l6ZUVkZ2VzXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgb25Nb3VzZW1vdmUoXG4gICAgZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50LFxuICAgIGNsaWVudFg6IG51bWJlcixcbiAgICBjbGllbnRZOiBudW1iZXJcbiAgKTogdm9pZCB7XG4gICAgdGhpcy5yZXNpemFibGUubW91c2Vtb3ZlLm5leHQoe1xuICAgICAgY2xpZW50WCxcbiAgICAgIGNsaWVudFksXG4gICAgICBlZGdlczogdGhpcy5yZXNpemVFZGdlcyxcbiAgICAgIGV2ZW50XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHVuc3Vic2NyaWJlRXZlbnRMaXN0ZW5lcnMoKTogdm9pZCB7XG4gICAgT2JqZWN0LmtleXModGhpcy5ldmVudExpc3RlbmVycykuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgICh0aGlzIGFzIGFueSkuZXZlbnRMaXN0ZW5lcnNbdHlwZV0oKTtcbiAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50TGlzdGVuZXJzW3R5cGVdO1xuICAgIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUmVzaXphYmxlRGlyZWN0aXZlIH0gZnJvbSAnLi9yZXNpemFibGUuZGlyZWN0aXZlJztcbmltcG9ydCB7IFJlc2l6ZUhhbmRsZURpcmVjdGl2ZSB9IGZyb20gJy4vcmVzaXplLWhhbmRsZS5kaXJlY3RpdmUnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtSZXNpemFibGVEaXJlY3RpdmUsIFJlc2l6ZUhhbmRsZURpcmVjdGl2ZV0sXG4gIGV4cG9ydHM6IFtSZXNpemFibGVEaXJlY3RpdmUsIFJlc2l6ZUhhbmRsZURpcmVjdGl2ZV1cbn0pXG5leHBvcnQgY2xhc3MgUmVzaXphYmxlTW9kdWxlIHt9XG4iXSwibmFtZXMiOlsiRXZlbnRFbWl0dGVyIiwiU3ViamVjdCIsInRha2VVbnRpbCIsInNoYXJlIiwiZmlsdGVyIiwiYXVkaXRUaW1lIiwibWVyZ2VNYXAiLCJtZXJnZSIsInRha2UiLCJtYXAiLCJwYWlyd2lzZSIsIkRpcmVjdGl2ZSIsIlJlbmRlcmVyMiIsIkVsZW1lbnRSZWYiLCJOZ1pvbmUiLCJJbnB1dCIsIk91dHB1dCIsIk9ic2VydmFibGUiLCJIb3N0TGlzdGVuZXIiLCJOZ01vZHVs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