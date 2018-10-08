/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Directive, ElementRef, Output, EventEmitter, NgZone, Input, Renderer2, Optional } from '@angular/core';
import { distinctUntilChanged, pairwise, filter, map } from 'rxjs/operators';
import { DraggableHelper } from './draggable-helper.provider';
import { DraggableScrollContainerDirective } from './draggable-scroll-container.directive';
/**
 * @param {?} clientX
 * @param {?} clientY
 * @param {?} rect
 * @return {?}
 */
function isCoordinateWithinRectangle(clientX, clientY, rect) {
    return (clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom);
}
/**
 * @record
 * @template T
 */
export function DropEvent() { }
/** @type {?} */
DropEvent.prototype.dropData;
var DroppableDirective = /** @class */ (function () {
    function DroppableDirective(element, draggableHelper, zone, renderer, scrollContainer) {
        this.element = element;
        this.draggableHelper = draggableHelper;
        this.zone = zone;
        this.renderer = renderer;
        this.scrollContainer = scrollContainer;
        /**
         * Called when a draggable element starts overlapping the element
         */
        this.dragEnter = new EventEmitter();
        /**
         * Called when a draggable element stops overlapping the element
         */
        this.dragLeave = new EventEmitter();
        /**
         * Called when a draggable element is moved over the element
         */
        this.dragOver = new EventEmitter();
        /**
         * Called when a draggable element is dropped on this element
         */
        this.drop = new EventEmitter();
    }
    /**
     * @return {?}
     */
    DroppableDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.currentDragSubscription = this.draggableHelper.currentDrag.subscribe(function (drag$) {
            _this.renderer.addClass(_this.element.nativeElement, _this.dragActiveClass);
            /** @type {?} */
            var droppableElement = {
                updateCache: true
            };
            /** @type {?} */
            var deregisterScrollListener = _this.renderer.listen(_this.scrollContainer
                ? _this.scrollContainer.elementRef.nativeElement
                : 'window', 'scroll', function () {
                droppableElement.updateCache = true;
            });
            /** @type {?} */
            var currentDragDropData;
            /** @type {?} */
            var overlaps$ = drag$.pipe(map(function (_a) {
                var clientX = _a.clientX, clientY = _a.clientY, dropData = _a.dropData;
                currentDragDropData = dropData;
                if (droppableElement.updateCache) {
                    droppableElement.rect = _this.element.nativeElement.getBoundingClientRect();
                    if (_this.scrollContainer) {
                        droppableElement.scrollContainerRect = _this.scrollContainer.elementRef.nativeElement.getBoundingClientRect();
                    }
                    droppableElement.updateCache = false;
                }
                /** @type {?} */
                var isWithinElement = isCoordinateWithinRectangle(clientX, clientY, /** @type {?} */ (droppableElement.rect));
                if (droppableElement.scrollContainerRect) {
                    return (isWithinElement &&
                        isCoordinateWithinRectangle(clientX, clientY, /** @type {?} */ (droppableElement.scrollContainerRect)));
                }
                else {
                    return isWithinElement;
                }
            }));
            /** @type {?} */
            var overlapsChanged$ = overlaps$.pipe(distinctUntilChanged());
            /** @type {?} */
            var dragOverActive; // TODO - see if there's a way of doing this via rxjs
            overlapsChanged$
                .pipe(filter(function (overlapsNow) { return overlapsNow; }))
                .subscribe(function () {
                dragOverActive = true;
                _this.renderer.addClass(_this.element.nativeElement, _this.dragOverClass);
                _this.zone.run(function () {
                    _this.dragEnter.next({
                        dropData: currentDragDropData
                    });
                });
            });
            overlaps$.pipe(filter(function (overlapsNow) { return overlapsNow; })).subscribe(function () {
                _this.zone.run(function () {
                    _this.dragOver.next({
                        dropData: currentDragDropData
                    });
                });
            });
            overlapsChanged$
                .pipe(pairwise(), filter(function (_a) {
                var _b = tslib_1.__read(_a, 2), didOverlap = _b[0], overlapsNow = _b[1];
                return didOverlap && !overlapsNow;
            }))
                .subscribe(function () {
                dragOverActive = false;
                _this.renderer.removeClass(_this.element.nativeElement, _this.dragOverClass);
                _this.zone.run(function () {
                    _this.dragLeave.next({
                        dropData: currentDragDropData
                    });
                });
            });
            drag$.subscribe({
                complete: function () {
                    deregisterScrollListener();
                    _this.renderer.removeClass(_this.element.nativeElement, _this.dragActiveClass);
                    if (dragOverActive) {
                        _this.renderer.removeClass(_this.element.nativeElement, _this.dragOverClass);
                        _this.zone.run(function () {
                            _this.drop.next({
                                dropData: currentDragDropData
                            });
                        });
                    }
                }
            });
        });
    };
    /**
     * @return {?}
     */
    DroppableDirective.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.currentDragSubscription) {
            this.currentDragSubscription.unsubscribe();
        }
    };
    DroppableDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[mwlDroppable]'
                },] }
    ];
    /** @nocollapse */
    DroppableDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: DraggableHelper },
        { type: NgZone },
        { type: Renderer2 },
        { type: DraggableScrollContainerDirective, decorators: [{ type: Optional }] }
    ]; };
    DroppableDirective.propDecorators = {
        dragOverClass: [{ type: Input }],
        dragActiveClass: [{ type: Input }],
        dragEnter: [{ type: Output }],
        dragLeave: [{ type: Output }],
        dragOver: [{ type: Output }],
        drop: [{ type: Output }]
    };
    return DroppableDirective;
}());
export { DroppableDirective };
if (false) {
    /**
     * Added to the element when an element is dragged over it
     * @type {?}
     */
    DroppableDirective.prototype.dragOverClass;
    /**
     * Added to the element any time a draggable element is being dragged
     * @type {?}
     */
    DroppableDirective.prototype.dragActiveClass;
    /**
     * Called when a draggable element starts overlapping the element
     * @type {?}
     */
    DroppableDirective.prototype.dragEnter;
    /**
     * Called when a draggable element stops overlapping the element
     * @type {?}
     */
    DroppableDirective.prototype.dragLeave;
    /**
     * Called when a draggable element is moved over the element
     * @type {?}
     */
    DroppableDirective.prototype.dragOver;
    /**
     * Called when a draggable element is dropped on this element
     * @type {?}
     */
    DroppableDirective.prototype.drop;
    /** @type {?} */
    DroppableDirective.prototype.currentDragSubscription;
    /** @type {?} */
    DroppableDirective.prototype.element;
    /** @type {?} */
    DroppableDirective.prototype.draggableHelper;
    /** @type {?} */
    DroppableDirective.prototype.zone;
    /** @type {?} */
    DroppableDirective.prototype.renderer;
    /** @type {?} */
    DroppableDirective.prototype.scrollContainer;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcHBhYmxlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZHJhZ2dhYmxlLWRyb3BwYWJsZS8iLCJzb3VyY2VzIjpbImxpYi9kcm9wcGFibGUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFFVCxVQUFVLEVBRVYsTUFBTSxFQUNOLFlBQVksRUFDWixNQUFNLEVBQ04sS0FBSyxFQUNMLFNBQVMsRUFDVCxRQUFRLEVBQ1QsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLG9CQUFvQixFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0UsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzlELE9BQU8sRUFBRSxpQ0FBaUMsRUFBRSxNQUFNLHdDQUF3QyxDQUFDOzs7Ozs7O0FBRTNGLHFDQUNFLE9BQWUsRUFDZixPQUFlLEVBQ2YsSUFBZ0I7SUFFaEIsT0FBTyxDQUNMLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSTtRQUNwQixPQUFPLElBQUksSUFBSSxDQUFDLEtBQUs7UUFDckIsT0FBTyxJQUFJLElBQUksQ0FBQyxHQUFHO1FBQ25CLE9BQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUN2QixDQUFDO0NBQ0g7Ozs7Ozs7OztJQWdEQyw0QkFDVSxTQUNBLGlCQUNBLE1BQ0EsVUFDWSxlQUFrRDtRQUo5RCxZQUFPLEdBQVAsT0FBTztRQUNQLG9CQUFlLEdBQWYsZUFBZTtRQUNmLFNBQUksR0FBSixJQUFJO1FBQ0osYUFBUSxHQUFSLFFBQVE7UUFDSSxvQkFBZSxHQUFmLGVBQWUsQ0FBbUM7Ozs7eUJBM0I1RCxJQUFJLFlBQVksRUFBYTs7Ozt5QkFNN0IsSUFBSSxZQUFZLEVBQWE7Ozs7d0JBTTlCLElBQUksWUFBWSxFQUFhOzs7O29CQU1qQyxJQUFJLFlBQVksRUFBYTtLQVVoQzs7OztJQUVK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QUMsQ0FBQztxQkFDSjtpQkFDRjthQUNGLENBQUMsQ0FBQztTQUNKLENBQ0YsQ0FBQztLQUNIOzs7O0lBRUQsd0NBQVc7OztJQUFYO1FBQ0UsSUFBSSxJQUFJLENBQUMsdUJBQXVCLEVBQUU7WUFDaEMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQzVDO0tBQ0Y7O2dCQW5MRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtpQkFDM0I7Ozs7Z0JBakNDLFVBQVU7Z0JBV0gsZUFBZTtnQkFQdEIsTUFBTTtnQkFFTixTQUFTO2dCQU1GLGlDQUFpQyx1QkFrRXJDLFFBQVE7OztnQ0F4Q1YsS0FBSztrQ0FNTCxLQUFLOzRCQU1MLE1BQU07NEJBTU4sTUFBTTsyQkFNTixNQUFNO3VCQU1OLE1BQU07OzZCQXZFVDs7U0FxQ2Esa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBPbkluaXQsXG4gIEVsZW1lbnRSZWYsXG4gIE9uRGVzdHJveSxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIE5nWm9uZSxcbiAgSW5wdXQsXG4gIFJlbmRlcmVyMixcbiAgT3B0aW9uYWxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRpc3RpbmN0VW50aWxDaGFuZ2VkLCBwYWlyd2lzZSwgZmlsdGVyLCBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBEcmFnZ2FibGVIZWxwZXIgfSBmcm9tICcuL2RyYWdnYWJsZS1oZWxwZXIucHJvdmlkZXInO1xuaW1wb3J0IHsgRHJhZ2dhYmxlU2Nyb2xsQ29udGFpbmVyRGlyZWN0aXZlIH0gZnJvbSAnLi9kcmFnZ2FibGUtc2Nyb2xsLWNvbnRhaW5lci5kaXJlY3RpdmUnO1xuXG5mdW5jdGlvbiBpc0Nvb3JkaW5hdGVXaXRoaW5SZWN0YW5nbGUoXG4gIGNsaWVudFg6IG51bWJlcixcbiAgY2xpZW50WTogbnVtYmVyLFxuICByZWN0OiBDbGllbnRSZWN0XG4pOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICBjbGllbnRYID49IHJlY3QubGVmdCAmJlxuICAgIGNsaWVudFggPD0gcmVjdC5yaWdodCAmJlxuICAgIGNsaWVudFkgPj0gcmVjdC50b3AgJiZcbiAgICBjbGllbnRZIDw9IHJlY3QuYm90dG9tXG4gICk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRHJvcEV2ZW50PFQgPSBhbnk+IHtcbiAgZHJvcERhdGE6IFQ7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttd2xEcm9wcGFibGVdJ1xufSlcbmV4cG9ydCBjbGFzcyBEcm9wcGFibGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIC8qKlxuICAgKiBBZGRlZCB0byB0aGUgZWxlbWVudCB3aGVuIGFuIGVsZW1lbnQgaXMgZHJhZ2dlZCBvdmVyIGl0XG4gICAqL1xuICBASW5wdXQoKVxuICBkcmFnT3ZlckNsYXNzOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFkZGVkIHRvIHRoZSBlbGVtZW50IGFueSB0aW1lIGEgZHJhZ2dhYmxlIGVsZW1lbnQgaXMgYmVpbmcgZHJhZ2dlZFxuICAgKi9cbiAgQElucHV0KClcbiAgZHJhZ0FjdGl2ZUNsYXNzOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIGEgZHJhZ2dhYmxlIGVsZW1lbnQgc3RhcnRzIG92ZXJsYXBwaW5nIHRoZSBlbGVtZW50XG4gICAqL1xuICBAT3V0cHV0KClcbiAgZHJhZ0VudGVyID0gbmV3IEV2ZW50RW1pdHRlcjxEcm9wRXZlbnQ+KCk7XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIGEgZHJhZ2dhYmxlIGVsZW1lbnQgc3RvcHMgb3ZlcmxhcHBpbmcgdGhlIGVsZW1lbnRcbiAgICovXG4gIEBPdXRwdXQoKVxuICBkcmFnTGVhdmUgPSBuZXcgRXZlbnRFbWl0dGVyPERyb3BFdmVudD4oKTtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gYSBkcmFnZ2FibGUgZWxlbWVudCBpcyBtb3ZlZCBvdmVyIHRoZSBlbGVtZW50XG4gICAqL1xuICBAT3V0cHV0KClcbiAgZHJhZ092ZXIgPSBuZXcgRXZlbnRFbWl0dGVyPERyb3BFdmVudD4oKTtcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gYSBkcmFnZ2FibGUgZWxlbWVudCBpcyBkcm9wcGVkIG9uIHRoaXMgZWxlbWVudFxuICAgKi9cbiAgQE91dHB1dCgpXG4gIGRyb3AgPSBuZXcgRXZlbnRFbWl0dGVyPERyb3BFdmVudD4oKTsgLy8gdHNsaW50OmRpc2FibGUtbGluZSBuby1vdXRwdXQtbmFtZWQtYWZ0ZXItc3RhbmRhcmQtZXZlbnRcblxuICBjdXJyZW50RHJhZ1N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBkcmFnZ2FibGVIZWxwZXI6IERyYWdnYWJsZUhlbHBlcixcbiAgICBwcml2YXRlIHpvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBzY3JvbGxDb250YWluZXI6IERyYWdnYWJsZVNjcm9sbENvbnRhaW5lckRpcmVjdGl2ZVxuICApIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5jdXJyZW50RHJhZ1N1YnNjcmlwdGlvbiA9IHRoaXMuZHJhZ2dhYmxlSGVscGVyLmN1cnJlbnREcmFnLnN1YnNjcmliZShcbiAgICAgIGRyYWckID0+IHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyhcbiAgICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCxcbiAgICAgICAgICB0aGlzLmRyYWdBY3RpdmVDbGFzc1xuICAgICAgICApO1xuICAgICAgICBjb25zdCBkcm9wcGFibGVFbGVtZW50OiB7XG4gICAgICAgICAgcmVjdD86IENsaWVudFJlY3Q7XG4gICAgICAgICAgdXBkYXRlQ2FjaGU6IGJvb2xlYW47XG4gICAgICAgICAgc2Nyb2xsQ29udGFpbmVyUmVjdD86IENsaWVudFJlY3Q7XG4gICAgICAgIH0gPSB7XG4gICAgICAgICAgdXBkYXRlQ2FjaGU6IHRydWVcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBkZXJlZ2lzdGVyU2Nyb2xsTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihcbiAgICAgICAgICB0aGlzLnNjcm9sbENvbnRhaW5lclxuICAgICAgICAgICAgPyB0aGlzLnNjcm9sbENvbnRhaW5lci5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnRcbiAgICAgICAgICAgIDogJ3dpbmRvdycsXG4gICAgICAgICAgJ3Njcm9sbCcsXG4gICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgZHJvcHBhYmxlRWxlbWVudC51cGRhdGVDYWNoZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIGxldCBjdXJyZW50RHJhZ0Ryb3BEYXRhOiBhbnk7XG4gICAgICAgIGNvbnN0IG92ZXJsYXBzJCA9IGRyYWckLnBpcGUoXG4gICAgICAgICAgbWFwKCh7IGNsaWVudFgsIGNsaWVudFksIGRyb3BEYXRhIH0pID0+IHtcbiAgICAgICAgICAgIGN1cnJlbnREcmFnRHJvcERhdGEgPSBkcm9wRGF0YTtcbiAgICAgICAgICAgIGlmIChkcm9wcGFibGVFbGVtZW50LnVwZGF0ZUNhY2hlKSB7XG4gICAgICAgICAgICAgIGRyb3BwYWJsZUVsZW1lbnQucmVjdCA9IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICBpZiAodGhpcy5zY3JvbGxDb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICBkcm9wcGFibGVFbGVtZW50LnNjcm9sbENvbnRhaW5lclJlY3QgPSB0aGlzLnNjcm9sbENvbnRhaW5lci5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZHJvcHBhYmxlRWxlbWVudC51cGRhdGVDYWNoZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgaXNXaXRoaW5FbGVtZW50ID0gaXNDb29yZGluYXRlV2l0aGluUmVjdGFuZ2xlKFxuICAgICAgICAgICAgICBjbGllbnRYLFxuICAgICAgICAgICAgICBjbGllbnRZLFxuICAgICAgICAgICAgICBkcm9wcGFibGVFbGVtZW50LnJlY3QgYXMgQ2xpZW50UmVjdFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChkcm9wcGFibGVFbGVtZW50LnNjcm9sbENvbnRhaW5lclJlY3QpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICBpc1dpdGhpbkVsZW1lbnQgJiZcbiAgICAgICAgICAgICAgICBpc0Nvb3JkaW5hdGVXaXRoaW5SZWN0YW5nbGUoXG4gICAgICAgICAgICAgICAgICBjbGllbnRYLFxuICAgICAgICAgICAgICAgICAgY2xpZW50WSxcbiAgICAgICAgICAgICAgICAgIGRyb3BwYWJsZUVsZW1lbnQuc2Nyb2xsQ29udGFpbmVyUmVjdCBhcyBDbGllbnRSZWN0XG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGlzV2l0aGluRWxlbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IG92ZXJsYXBzQ2hhbmdlZCQgPSBvdmVybGFwcyQucGlwZShkaXN0aW5jdFVudGlsQ2hhbmdlZCgpKTtcblxuICAgICAgICBsZXQgZHJhZ092ZXJBY3RpdmU6IGJvb2xlYW47IC8vIFRPRE8gLSBzZWUgaWYgdGhlcmUncyBhIHdheSBvZiBkb2luZyB0aGlzIHZpYSByeGpzXG5cbiAgICAgICAgb3ZlcmxhcHNDaGFuZ2VkJFxuICAgICAgICAgIC5waXBlKGZpbHRlcihvdmVybGFwc05vdyA9PiBvdmVybGFwc05vdykpXG4gICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgICBkcmFnT3ZlckFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKFxuICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCxcbiAgICAgICAgICAgICAgdGhpcy5kcmFnT3ZlckNsYXNzXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuZHJhZ0VudGVyLm5leHQoe1xuICAgICAgICAgICAgICAgIGRyb3BEYXRhOiBjdXJyZW50RHJhZ0Ryb3BEYXRhXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgb3ZlcmxhcHMkLnBpcGUoZmlsdGVyKG92ZXJsYXBzTm93ID0+IG92ZXJsYXBzTm93KSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZHJhZ092ZXIubmV4dCh7XG4gICAgICAgICAgICAgIGRyb3BEYXRhOiBjdXJyZW50RHJhZ0Ryb3BEYXRhXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgb3ZlcmxhcHNDaGFuZ2VkJFxuICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgcGFpcndpc2UoKSxcbiAgICAgICAgICAgIGZpbHRlcigoW2RpZE92ZXJsYXAsIG92ZXJsYXBzTm93XSkgPT4gZGlkT3ZlcmxhcCAmJiAhb3ZlcmxhcHNOb3cpXG4gICAgICAgICAgKVxuICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgZHJhZ092ZXJBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3MoXG4gICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICAgICB0aGlzLmRyYWdPdmVyQ2xhc3NcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5kcmFnTGVhdmUubmV4dCh7XG4gICAgICAgICAgICAgICAgZHJvcERhdGE6IGN1cnJlbnREcmFnRHJvcERhdGFcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICBkcmFnJC5zdWJzY3JpYmUoe1xuICAgICAgICAgIGNvbXBsZXRlOiAoKSA9PiB7XG4gICAgICAgICAgICBkZXJlZ2lzdGVyU2Nyb2xsTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3MoXG4gICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICAgICB0aGlzLmRyYWdBY3RpdmVDbGFzc1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGlmIChkcmFnT3ZlckFjdGl2ZSkge1xuICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKFxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ092ZXJDbGFzc1xuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyb3AubmV4dCh7XG4gICAgICAgICAgICAgICAgICBkcm9wRGF0YTogY3VycmVudERyYWdEcm9wRGF0YVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5jdXJyZW50RHJhZ1N1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5jdXJyZW50RHJhZ1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxufVxuIl19